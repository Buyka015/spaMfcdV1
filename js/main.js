/* main.js — overlay, router (navbar-ын хуудсууд), шүүлтүүр, event-үүд, эхлүүлэх */
'use strict';

/* ---------- overlays (drawer / modal) ---------- */
function setHash(h){try{history.replaceState(null,'',h)}catch(e){}}
function openLayer(id){
 if(id==='cartL')renderCart();if(id==='wishL')renderWish();if(id==='cmpL')renderCmp();if(id==='sgL')renderSG();
 if(!isOpen(id)){$('#'+id).classList.add('open');layerStack.push(id)}
 document.body.classList.add('lock');
}
function closeLayer(id){
 $('#'+id).classList.remove('open');
 const i=layerStack.indexOf(id);if(i>-1)layerStack.splice(i,1);
 if(!layerStack.length)document.body.classList.remove('lock');
 if(id==='qvL'&&location.hash.startsWith('#product-'))setHash('#'+(S.view||'home'));
}

/* ---------- router: navbar-ын цэс бүр тусдаа хуудас ----------
   index.html доторх <div class="view" data-view="..."> -ээс зөвхөн нэг нь харагдана.
   Шинэ хуудас нэмэх: 1) VIEWS-д нэр нэмэх  2) index.html-д .view блок нэмэх  3) nav-д <a href="#нэр"> нэмэх */
const VIEWS=['home','new','best','sale','shop'];
function showView(v){
 if(!VIEWS.includes(v))v='home';
 const changed=S.view!==v;S.view=v;
 $$('.view').forEach(el=>el.classList.toggle('active',el.dataset.view===v));
 $$('#nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+v));
 $('#nav').classList.remove('open');
 if(changed)window.scrollTo(0,0);
 reveal();
}
function goView(v){
 showView(v);
 if(location.hash!=='#'+v){try{location.hash='#'+v}catch(e){}}
}
/* URL-ийн # хэсгээс хуудсыг тодорхойлно (#shop, #sale, #product-5 ...) */
function route(){
 const h=location.hash.slice(1),m=h.match(/^product-(\d+)$/);
 if(m){if(!S.view)showView('home');if(byId(+m[1]))openProduct(+m[1],'full');return}
 if(isOpen('qvL'))closeLayer('qvL');
 showView(h||'home');
}
addEventListener('hashchange',route);

/* ---------- шүүлтүүр ---------- */
function refreshShop(){saveF();renderControls();renderShop()}
function setCat(v){S.f.cat=v;refreshShop();goView('shop')}
function resetF(){S.f={q:'',cat:'all',brand:'all',size:'all',max:250,sort:'featured'};refreshShop()}

/* ---------- theme / хэл ---------- */
function applyTheme(){
 document.documentElement.dataset.theme=S.theme;
 $('#themeBtn').innerHTML=S.theme==='dark'?ICON.sun:ICON.moon;
}
function applyLang(){
 document.documentElement.lang=S.lang;
 $$('[data-i18n]').forEach(e=>e.textContent=t(e.dataset.i18n));
 $$('[data-i18n-ph]').forEach(e=>e.placeholder=t(e.dataset.i18nPh));
 $('#langBtn').textContent=S.lang==='en'?'MN':'EN';
 renderAll();
}

/* ---------- data-a="..." товчнуудын үйлдэл ---------- */
function action(el,e){
 const id=+el.dataset.id,v=el.dataset.v;
 switch(el.dataset.a){
  /* бараа */
  case 'open':e.preventDefault();openProduct(id,'full');break;
  case 'quick':openProduct(id,'quick');break;
  case 'color':setColor(id,v);break;
  case 'size':setSize(id,+v);break;
  case 'view':M.view=+v;renderProduct();break;
  case 'mq':M.qty=Math.max(1,Math.min(10,M.qty+ +el.dataset.d));renderProduct();break;
  case 'wish':toggleWish(id);if(isOpen('qvL'))renderProduct();break;
  case 'cmp':toggleCmp(id);if(isOpen('qvL'))renderProduct();break;
  /* сагс */
  case 'add':{const s=sel(byId(id));addCart(id,s.color,s.size,1);break}
  case 'madd':{const s=sel(byId(M.id));addCart(M.id,s.color,s.size,M.qty);break}
  case 'cartq':changeQty(el.dataset.k,+el.dataset.d);break;
  case 'cartrm':removeItem(el.dataset.k);break;
  case 'clearCart':clearCart();break;
  case 'checkout':checkout();break;
  /* шүүлтүүр */
  case 'cat':setCat(v);break;
  case 'brandpick':S.f.brand=v;refreshShop();goView('shop');break;
  case 'sortpick':S.f.sort=v;S.f.cat='all';refreshShop();break;
  case 'reset':resetF();break;
  case 'clearRecent':S.recent=[];SV('ss_recent',S.recent);renderRecent();break;
  /* overlay */
  case 'sg':openLayer('sgL');break;
  case 'openCart':openLayer('cartL');break;
  case 'openWish':openLayer('wishL');break;
  case 'openCmp':openLayer('cmpL');break;
  case 'close':closeLayer(v);break;
 }
}

/* ---------- events ---------- */
document.addEventListener('click',e=>{
 /* overlay-ийн гадна талд дарвал хаана */
 const lay=e.target.closest('[data-layer]');
 if(lay&&e.target===lay){closeLayer(lay.id);return}
 /* data-a товч */
 const el=e.target.closest('[data-a]');
 if(el)action(el,e);
 /* navbar / logo / "View all" холбоос → хуудас солих */
 const link=e.target.closest('a[href^="#"]');
 if(link){
  const v=link.getAttribute('href').slice(1);
  if(VIEWS.includes(v)){
   e.preventDefault();
   if(v===S.view)window.scrollTo({top:0,behavior:'smooth'});
   goView(v);
  }
 }
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&layerStack.length)closeLayer(layerStack[layerStack.length-1])});

/* хайлт: бичихэд Shop хуудас руу шилжиж үр дүнг харуулна */
let qt;
$('#q').addEventListener('input',e=>{
 S.f.q=e.target.value;saveF();clearTimeout(qt);
 qt=setTimeout(()=>{renderShop();if(S.f.q.trim()&&S.view!=='shop')goView('shop')},180);
});
$('#fBrand').addEventListener('change',e=>{S.f.brand=e.target.value;saveF();renderShop()});
$('#fSize').addEventListener('change',e=>{
 S.f.size=e.target.value;saveF();
 if(S.f.size!=='all')P.forEach(p=>{if(p.sizes.includes(+S.f.size))(S.sel[p.id]=S.sel[p.id]||{}).size=+S.f.size});
 saveSel();renderShop();
});
$('#fSort').addEventListener('change',e=>{S.f.sort=e.target.value;saveF();renderShop()});
$('#fPrice').addEventListener('input',e=>{S.f.max=+e.target.value;saveF();renderShop()});

/* header товчнууд */
$('#themeBtn').addEventListener('click',()=>{S.theme=S.theme==='dark'?'light':'dark';SV('ss_theme',S.theme);applyTheme()});
$('#langBtn').addEventListener('click',()=>{S.lang=S.lang==='en'?'mn':'en';SV('ss_lang',S.lang);applyLang()});
$('#menuBtn').addEventListener('click',()=>{$('#nav').classList.toggle('open');$('#search').classList.remove('open')});
$('#sBtn').addEventListener('click',()=>{
 $('#search').classList.toggle('open');$('#nav').classList.remove('open');
 if($('#search').classList.contains('open'))$('#q').focus();
});

/* newsletter */
$('#nl').addEventListener('submit',e=>{
 e.preventDefault();const v=$('#nlE').value.trim();
 if(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)){toast('BUYKA SHOP',t('news_ok'));$('#nlE').value=''}else toast('BUYKA SHOP',t('news_bad'));
});

/* scroll */
$('#toTop').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
addEventListener('scroll',()=>{$('#topbar').classList.toggle('sc',scrollY>10);$('#toTop').classList.toggle('show',scrollY>700)},{passive:true});

/* ---------- init ---------- */
S.cart=S.cart.filter(i=>byId(i.id));
S.wish=S.wish.filter(id=>byId(id));
S.cmp=S.cmp.filter(id=>byId(id));
S.recent=S.recent.filter(id=>byId(id));
applyTheme();
applyLang();
route();
