// api/chat.js
//
// Vercel Edge Function 版のバックエンド(Cloudflare Workerの移植版)
// 役割は元のworker.jsと全く同じ:
//   - フロントエンドから { messages: [...] } を受け取る
//   - Groq APIに中継してストリーミング(SSE)で返す
//   - 会話履歴はどこにも保存しない(リクエストのたびに使い捨て)
//
// 【Vercelでの設定手順】
// 1. このファイルをリポジトリの "api/chat.js" に置く(このパスが重要。
//    Vercelは /api フォルダの中身を自動でサーバーレス関数として認識します)
// 2. GitHubにpushし、vercel.com で「Add New Project」→ そのリポジトリを選択してデプロイ
// 3. Vercelのプロジェクト設定 → Environment Variables で
//      GROQ_API_KEY = (Groqで取得したAPIキー)
//    を追加する(Production/Preview両方にチェック)
// 4. デプロイ後に発行されるURL(例: https://your-project.vercel.app)を使い、
//    config.js の WORKER_URL を
//      https://your-project.vercel.app/api/chat
//    に書き換える(末尾に /api/chat を忘れずに付けること)

export const config = {
  runtime: "edge", // Cloudflare Workerと同じくWeb標準のRequest/Responseが使えるモード
};

const SYSTEM_PROMPT =
  "あなたは親しみやすい日本語AIアシスタントです。フレンドリーかつ簡潔に、絵文字を交えて答えてください。" +
  "コード、企画書、まとまった文書(3行以上になるもの)を作成するときは、必ず```言語名\n(内容)\n```の形式のコードブロックで囲んでください。" +
  "文書の場合は言語名の位置に markdown と書いてください。コードブロックの前後には短い一言だけ添え、内容自体はコードブロックの中だけに書いてください。";

// フロントエンドを特定のドメインだけに限定したい場合は、ここを実際のオリジンに変更してください
// (例: "https://username.github.io")
const ALLOWED_ORIGIN = "*";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default async function handler(request) {
  // プリフライトリクエストへの対応
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders() });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ reply: "POSTリクエストのみ対応しています。" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  try {
    const body = await request.json();

    // 互換性のため、旧形式 { message } でも新形式 { messages: [...] } でも受け付ける
    let messages = Array.isArray(body.messages) ? body.messages : null;
    if (!messages && typeof body.message === "string") {
      messages = [{ role: "user", content: body.message }];
    }

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ reply: "メッセージが空です。" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }

    // クライアント側から改ざんされたリクエストにも備えて、サーバー側でも検証・上限を設ける
    const MAX_HISTORY = 20;
    const cleanMessages = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-MAX_HISTORY);

    if (cleanMessages.length === 0) {
      return new Response(JSON.stringify({ reply: "メッセージの形式が不正です。" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...cleanMessages],
        temperature: 0.7,
        max_tokens: 800,
        stream: true,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq API error:", errText);
      return new Response(JSON.stringify({ reply: "⚠️ AIの応答生成でエラーが発生しました。" }), {
        status: 502,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }

    // GroqからのSSE(ストリーミング)応答をそのままフロントエンドへ橋渡しする。
    // ここでは何も保存せず、届いたバイト列を右から左へ流すだけ。
    return new Response(groqRes.body, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        ...corsHeaders(),
      },
    });
  } catch (err) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ reply: "❌ サーバーエラーが発生しました。" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }
}