// Cloudflare Worker — Groq API を中継してCORSを解決する
// ★ このファイルの中身をCloudflareのエディタに貼り付けてDeployする

export default {
  async fetch(request, env) {

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      const { message } = await request.json();
      if (!message) return jsonResponse({ error: 'message is required' }, 400);

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 1024,
          messages: [
            {
              role: 'system',
              content: 'あなたは親切で賢いAIアシスタントです。Roblox/Luaの開発についても詳しいです。日本語で自然に会話してください。'
            },
            { role: 'user', content: message }
          ]
        })
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content ?? 'エラーが発生しました。';
      return jsonResponse({ reply });

    } catch (e) {
      return jsonResponse({ error: e.message }, 500);
    }
  }
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
}