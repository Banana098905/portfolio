(function(){
'use strict';
var A=window.AREAS,W=window.WORKS,LOG=window.LOG||[];
var $=function(s){return document.querySelector(s)};
var esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var ST={published:'公開中',wip:'開発中'};
/* ---- 保存（localStorage が使えなくても動く） ---- */
function load(k){try{return JSON.parse(localStorage.getItem(k))||[]}catch(e){return[]}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
var favs=load('fm_favs'),seen=load('fm_seen');
/* ---- 仮ビジュアル（実際のゲーム画面ではありません） ---- */
function thumb(w){
  var c=A[w.area].color,h=0;for(var i=0;i<w.id.length;i++)h=(h*31+w.id.charCodeAt(i))%360;
  var cx=60+h%200,svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+c+'"/><stop offset="1" stop-color="#0b1514"/></linearGradient></defs><rect width="320" height="180" fill="url(#g)"/><circle cx="'+cx+'" cy="'+(40+h%50)+'" r="'+(30+h%30)+'" fill="#fff" fill-opacity=".12"/><path d="M0 150 Q80 '+(110+h%30)+' 160 140 T320 '+(120+h%30)+' V180 H0Z" fill="#06100f" fill-opacity=".55"/><text x="20" y="112" font-size="64" fill="#fff" fill-opacity=".85" font-family="serif">'+esc(w.title.charAt(0))+'</text></svg>';
  return 'data:image/svg+xml,'+encodeURIComponent(svg);
}
/* ---- マップ ---- */
var svg=$('#mapSvg'),panel=$('#mapPanel'),tabs=$('#areaTabs'),selArea=null,selWork=null;
var NS='http://www.w3.org/2000/svg';
function el(n,a,p){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
function pos(w){var list=W.filter(function(x){return x.area===w.area}),i=list.indexOf(w),n=list.length,a=A[w.area],t=i/n*Math.PI*2-Math.PI/2;
  return n===1?{x:a.x,y:a.y+8}:{x:a.x+Math.cos(t)*48,y:a.y+8+Math.sin(t)*34}}
function buildMap(){
  Object.keys(A).forEach(function(id){
    var a=A[id],g=el('g',{'class':'region','data-area':id,tabindex:0,role:'button','aria-label':a.name+'（'+a.label+'）'},svg);
    el('ellipse',{'class':'blob',cx:a.x,cy:a.y+8,rx:100,ry:78,fill:a.color,stroke:a.color},g);
    var t=el('text',{x:a.x,y:a.y-52,'text-anchor':'middle'},g);t.textContent=a.name;
    g.addEventListener('click',function(){pick(id)});
    g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(id)}});
  });
  W.forEach(function(w){
    var p=pos(w),g=el('g',{'class':'pin','data-work':w.id,tabindex:0,role:'button','aria-label':w.title},svg);
    el('circle',{cx:p.x,cy:p.y,r:6},g);var t=el('title',{},g);t.textContent=w.title;
    g.addEventListener('click',function(e){e.stopPropagation();pick(w.area,w.id)});
    g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();pick(w.area,w.id)}});
  });
  Object.keys(A).forEach(function(id){
    var b=document.createElement('button');b.type='button';b.className='btn btn-sm';b.dataset.area=id;b.textContent=A[id].name;b.setAttribute('aria-pressed','false');
    b.addEventListener('click',function(){pick(id)});tabs.appendChild(b);
  });
  panel.innerHTML='<h3>エリアを選んでください</h3><p>地図上の地域、または上のボタンから選べます。</p>';
}
function pick(area,work){
  selArea=area;selWork=work||null;var a=A[area],list=W.filter(function(w){return w.area===area});
  svg.classList.add('has-sel');
  [].forEach.call(svg.querySelectorAll('.region'),function(r){r.classList.toggle('on',r.dataset.area===area)});
  [].forEach.call(svg.querySelectorAll('.pin'),function(p){p.classList.toggle('on',p.dataset.work===work)});
  [].forEach.call(tabs.children,function(b){b.setAttribute('aria-pressed',b.dataset.area===area)});
  var h='<h3>'+esc(a.name)+'</h3><p class="sub">'+esc(a.label)+'・'+list.length+'作品</p><ul>';
  list.forEach(function(w){h+='<li><button type="button" data-w="'+w.id+'"'+(w.id===work?' aria-current="true"':'')+'>'+esc(w.title)+'</button></li>'});
  h+='</ul>';
  var w=W.filter(function(x){return x.id===work})[0];
  if(w)h+='<p>'+esc(w.desc)+'</p><div class="actions"><button type="button" class="btn btn-sm" data-d="'+w.id+'">詳細</button><a class="btn btn-sm btn-primary" href="'+esc(w.url)+'">'+(w.kind==='game'?'プレイ':'見る')+'</a></div>';
  panel.innerHTML=h;
  [].forEach.call(panel.querySelectorAll('[data-w]'),function(b){b.addEventListener('click',function(){pick(area,b.dataset.w)})});
  var d=panel.querySelector('[data-d]');if(d)d.addEventListener('click',function(){openDlg(d.dataset.d,d)});
}
/* ---- ライブラリ ---- */
var f={q:$('#q'),area:$('#fArea'),st:$('#fStatus'),sort:$('#fSort'),fav:$('#fFav')};
f.area.innerHTML='<option value="">すべてのエリア</option>'+Object.keys(A).map(function(k){return '<option value="'+k+'">'+A[k].name+'（'+A[k].label+'）</option>'}).join('');
function card(w){
  var isF=favs.indexOf(w.id)>-1;
  return '<article class="work"><img class="thumb" loading="lazy" width="320" height="180" alt="" src="'+thumb(w)+'"><div class="work-body"><h3>'+esc(w.title)+'</h3><div class="meta"><span class="badge">'+esc(A[w.area].name)+'</span><span class="badge'+(w.status==='wip'?' wip':'')+'">'+ST[w.status]+'</span>'+(seen.indexOf(w.id)>-1?'<span class="badge">発見済み</span>':'')+'</div><p>'+esc(w.desc)+'</p><div class="actions"><a class="btn btn-sm btn-primary" href="'+esc(w.url)+'">'+(w.kind==='game'?'プレイ':'見る')+'<span class="sr-only">: '+esc(w.title)+'</span></a><button type="button" class="btn btn-sm" data-d="'+w.id+'">詳細<span class="sr-only">: '+esc(w.title)+'</span></button><button type="button" class="btn btn-sm fav" data-f="'+w.id+'" aria-pressed="'+isF+'" aria-label="'+esc(w.title)+'をお気に入り">'+(isF?'♥':'♡')+'</button></div></div></article>';
}
function render(){
  var q=f.q.value.trim().toLowerCase(),r=W.filter(function(w){
    return (!q||w.title.toLowerCase().indexOf(q)>-1)&&(!f.area.value||w.area===f.area.value)&&(!f.st.value||w.status===f.st.value)&&(!f.fav.checked||favs.indexOf(w.id)>-1)});
  if(f.sort.value==='name')r.sort(function(a,b){return a.title.localeCompare(b.title,'ja')});
  else r.sort(function(a,b){return (b.featured?1:0)-(a.featured?1:0)||W.indexOf(a)-W.indexOf(b)});
  $('#grid').innerHTML=r.map(card).join('');
  $('#empty').hidden=r.length>0;
  $('#count').textContent=r.length+' / '+W.length+' 作品を表示中';
  $('#discover').textContent='発見 '+seen.length+' / '+W.length;
}
$('#grid').addEventListener('click',function(e){
  var d=e.target.closest('[data-d]'),b=e.target.closest('[data-f]');
  if(d)openDlg(d.dataset.d,d);
  if(b){var id=b.dataset.f,i=favs.indexOf(id);i>-1?favs.splice(i,1):favs.push(id);save('fm_favs',favs);var fo=b.dataset.f;render();var nb=$('[data-f="'+fo+'"]');if(nb)nb.focus()}
});
['input','change'].forEach(function(ev){$('#filters').addEventListener(ev,render)});
$('#reset').addEventListener('click',function(){f.q.value='';f.area.value='';f.st.value='';f.sort.value='rec';f.fav.checked=false;render()});
$('#resetSeen').addEventListener('click',function(){seen=[];save('fm_seen',seen);render()});
/* ---- 詳細モーダル ---- */
var dlg=$('#dlg'),opener=null;
function openDlg(id,from){
  var w=W.filter(function(x){return x.id===id})[0];if(!w)return;opener=from;
  if(seen.indexOf(id)<0){seen.push(id);save('fm_seen',seen);render()}
  var h='<button type="button" class="btn btn-sm dlg-close" id="dlgX">閉じる</button><img class="thumb" alt="" src="'+thumb(w)+'"><div class="dlg-body"><h3 id="dlgTitle">'+esc(w.title)+'</h3><p>'+esc(w.desc)+'</p><dl><dt>エリア</dt><dd>'+esc(A[w.area].name)+'（'+esc(A[w.area].label)+'）</dd><dt>公開状況</dt><dd>'+ST[w.status]+'</dd>'+(w.tags&&w.tags.length?'<dt>特徴</dt><dd>'+w.tags.map(esc).join(' / ')+'</dd>':'')+'</dl><div class="actions"><a class="btn btn-primary" href="'+esc(w.url)+'">'+(w.kind==='game'?'プレイする':'見る')+'</a></div><p class="note" style="margin-top:16px">画像は雰囲気を表す仮のビジュアルで、実際の画面ではありません。</p></div>';
  dlg.innerHTML=h;dlg.showModal();$('#dlgX').addEventListener('click',function(){dlg.close()});
}
dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
dlg.addEventListener('close',function(){if(opener&&document.contains(opener))opener.focus()});
/* ---- 更新ログ ---- */
$('#logList').innerHTML=LOG.map(function(l){return '<li><time datetime="'+esc(l.date)+'">'+esc(l.date)+'</time><strong>'+esc(l.target)+'</strong><br>'+esc(l.text)+'</li>'}).join('');
buildMap();render();
})();
