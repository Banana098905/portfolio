/* 作品データ（ここだけ編集すれば、マップ・ライブラリ・詳細・お気に入りに反映されます）
   status: "published"=公開中 / "wip"=開発中   kind: "game" | "site"   featured: true でおすすめ */
window.AREAS = {
  forest: { name: "FOREST", label: "探索・RPG", color: "#2f8a5f", x: 170, y: 140 },
  city:   { name: "CITY", label: "建設・戦略", color: "#3f7fb0", x: 440, y: 110 },
  ruins:  { name: "RUINS", label: "盤面・パズル", color: "#a08d63", x: 660, y: 160 },
  arena:  { name: "ARENA", label: "アクション", color: "#b8664d", x: 190, y: 340 },
  lab:    { name: "LABORATORY", label: "実験・物理", color: "#6277c0", x: 450, y: 340 },
  studio: { name: "STUDIO", label: "Webデザイン", color: "#3fa398", x: 670, y: 350 }
};
window.WORKS = [
  { id:"ocean_quest", sym:"⚓", title:"Ocean Quest", area:"forest", status:"published", kind:"game", featured:true, url:"ocean_quest.html",
    desc:"探索・図鑑・ボート・育成・クラフトがすべて詰まった、ブラウザで手軽に遊べる本格釣りシミュレーションRPG。",
    tags:["探索","図鑑","ボート","育成","クラフト"] },
  { id:"subterranean_1000", sym:"⛏", title:"地下1000階", area:"forest", status:"published", kind:"game", url:"subterranean_1000.html",
    desc:"採掘・戦闘・宝箱・基地強化を備えた2Dダンジョン探索RPG。地下1000階の深淵を目指せ。",
    tags:["採掘","戦闘","宝箱","基地強化"] },
  { id:"simcity", sym:"▦", title:"MICRO CITY (都市建設)", area:"city", status:"published", kind:"game", url:"simcity.html",
    desc:"ミニ都市建設シミュレーター。道路・発電所・住宅・商業・工業を配置し、RCI需要と税収を管理しながら荒れ地から大都市へ育てよう。",
    tags:["RCI需要","税収管理"] },
      { id:"robot_factory", sym:"⚙", title:"ROBOT FACTORY", area:"city", status:"published", kind:"game", url:"robot_factory.html",
    desc:"ロボット工場を育てる放置・自動生産ゲーム。設備・ロボット・研究ツリーで自動化を進め、工場の見た目も成長していく。",
    tags:["放置","自動生産","研究ツリー","周回要素","スマホ対応"] },
  { id:"rts", sym:"⚔", title:"王国戦争", area:"city", status:"published", kind:"game", url:"rts.html",
    desc:"30×30マップのリアルタイム戦略ゲーム。施設を建て軍を育て敵城を落とせ。", tags:["RTS","30×30マップ"] },
  { id:"defense_tactics", sym:"♜", title:"防衛戦略", area:"city", status:"published", kind:"game", url:"defense_tactics.html",
    desc:"玉座を守る防衛ゲーム。資源を管理し、壁を修理、弓兵を召喚せよ。", tags:["資源管理","防衛"] },
  { id:"othello", sym:"◐", title:"オセロ", area:"ruins", status:"published", kind:"game", url:"game.html",
    desc:"AIと対戦できるオセロゲーム。強さ選択・先後選択対応。", tags:["AI対戦","強さ選択","先後選択"] },
  { id:"shogi", sym:"☗", title:"将棋", area:"ruins", status:"published", kind:"game", url:"shogi.html",
    desc:"本格将棋AIと対戦。持ち駒・成り・全ルール対応。", tags:["AI対戦","持ち駒","成り"] },
  { id:"onitama", sym:"♞", title:"鬼玉 / Onitama", area:"ruins", status:"published", kind:"game", url:"onitama.html",
    desc:"カード式の戦略ボードゲーム。毎回変わるカードで読み合いを楽しむ。", tags:["カード式","戦略"] },
  { id:"2048", sym:"▤", title:"2048", area:"ruins", status:"published", kind:"game", url:"2048.html",
    desc:"数字をマージして2048を作ろう！", tags:["パズル"] },
  { id:"capture_shooter", sym:"▣", title:"陣取りシューティング", area:"arena", status:"published", kind:"game", url:"capture_shooter.html",
    desc:"オセロ感覚の陣地制圧型シューティング。敵を撃ってフィールドを塗り替えろ。", tags:["シューティング","陣取り"] },
  { id:"reverse_dodge", sym:"☯", title:"陰陽の狭間で", area:"arena", status:"published", kind:"game", url:"reverse_dodge.html",
    desc:"反転避けゲーム。光と闇の領域を駆け抜け、自分の色と同じ弾だけをすり抜けろ。", tags:["避けゲーム","反転"] },
  { id:"henteko_battle", sym:"✦", title:"へんてこバトル", area:"arena", status:"published", kind:"game", url:"henteko_battle.html",
    desc:"荷物を武器にする配達員が、体育館でCPUと戦う2Dアクションゲーム。", tags:["2Dアクション","CPU対戦"] },
  { id:"trex", sym:"▲", title:"恐竜ゲーム", area:"arena", status:"published", kind:"game", url:"T-rex.html",
    desc:"単純なゲームどこまで避けられるか", tags:[] },
  { id:"physics_sandbox", sym:"◈", title:"3D物理サンドボックス", area:"lab", status:"published", kind:"game", url:"physics_sandbox.html",
    desc:"3D空間のブロックを掴んで積む・倒す・ぶつける物理サンドボックス。26種類のブロック、スマホのタッチ操作にも対応。", tags:["3D","物理演算","26種類のブロック","タッチ操作対応"] },
  { id:"ai", sym:"∴", title:"AI", area:"lab", status:"wip", kind:"game", url:"AI.HTML", desc:"未完成", tags:[] },
  { id:"cafe", sym:"☾", title:"月読珈琲", area:"studio", status:"published", kind:"site", url:"cafe.html",
    desc:"夜だけ開く架空カフェのWebサイト。世界観を重視したダークデザイン。", tags:["架空サイト","ダークデザイン"] },
  { id:"ryokan", sym:"⌂", title:"宵待ちの宿", area:"studio", status:"published", kind:"site", url:"ryokan.html",
    desc:"夜をテーマにした架空旅館のWebサイト。和と静けさを表現。", tags:["架空サイト","和"] },
  { id:"thumbnail", sym:"▶", title:"サムネイル制作", area:"studio", status:"published", kind:"site", url:"thumbnail.html",
    desc:"YouTube・SNS向けサムネイルのデザイン制作。", tags:["サムネイル"] },
  { id:"webdesign", sym:"</>", title:"Webデザイン", area:"studio", status:"published", kind:"site", url:"webdesign.html",
    desc:"各種WebサイトのデザインをHTML / CSS / Figmaで制作。", tags:["HTML / CSS","Figma"] }
  
];
/* 更新ログ（確認できた履歴のみ追加すること） */
window.LOG = [
  { date:"2026-10-22", target:"ポートフォリオ全体", text:"探索型マップ・ライブラリ検索・お気に入り・発見記録を追加。既存の作品とURLはそのまま維持。" }
];