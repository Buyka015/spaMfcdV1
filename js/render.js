/* render.js — барааны карт болон хуудас бүрийн агуулгыг зурах */
'use strict';

/* ---------- жижиг HTML хэсгүүд ---------- */
const priceH=p=>p.disc?`<span class="now">${money(sale(p))}</span><s>${money(p.price)}</s><span class="pct">-${p.disc}%</span>`:`<span class="now">${money(p.price)}</span>`;
const badgeH=p=>[NEWS.has(p.id)&&`<span class="bd">${t('badge_new')}</span>`,BESTS.has(p.id)&&`<span class="bd best">${t('badge_best')}</span>`,p.disc&&`<span class="bd sale">${t('badge_sale')} −${p.disc}%</span>`].filter(Boolean).join('');

/* ---------- product card ---------- */
function card(p,x={}){
 const s=sel(p),href=`#product-${p.id}`,src=imgSrc(p,s.color),at=A(p,s.color);
 const sw=p.colors.map(c=>`<button class="sw ${c===s.color?'on':''}" data-a="color" data-id="${p.id}" data-v="${c}" style="--c:${COL[c]}" title="${colN(c)}" aria-label="${colN(c)}"></button>`).join('');
 return `<article class="card rev" data-id="${p.id}" style="--f:${imgF(p,s.color)}">
 <div class="c-img" style="--o:${focusPt(p)}">
  <a href="${href}" data-a="open" data-id="${p.id}" aria-label="${p.name}">
   <img class="i1" src="${src}" alt="${p.brand} ${p.name}" loading="lazy" ${at}>
   <img class="i2" src="${src}" alt="" loading="lazy" ${at}>
  </a>
  <div class="badges">${badgeH(p)}</div>
  <div class="tools">
   <button class="tool ${inWish(p.id)?'on':''}" data-a="wish" data-id="${p.id}" title="${t('wish')}" aria-label="${t('wish')}">${ICON.heart}</button>
   <button class="tool hov ${inCmp(p.id)?'on':''}" data-a="cmp" data-id="${p.id}" title="${t('cmp')}" aria-label="${t('cmp')}">${ICON.cmp}</button>
   <button class="tool hov" data-a="quick" data-id="${p.id}" title="${t('quick')}" aria-label="${t('quick')}">${ICON.eye}</button>
  </div>
 </div>
 <div class="c-body">
  <div class="c-brand">${p.brand} · ${catN(p.cat)}</div>
  <h3 class="c-name"><a href="${href}" data-a="open" data-id="${p.id}">${p.name}</a></h3>
  <div class="sw-row">${sw}<span class="sw-l">${colN(s.color)}</span></div>
  <div class="price">${priceH(p)}</div>
  ${x.rank?`<div class="sold">#${x.rank} · ${p.sales.toLocaleString()} ${t('sold')}</div>`:''}
  ${x.save&&p.disc?`<div class="save">${t('save')} ${money(p.price-sale(p))}</div>`:''}
  <button class="btn full" data-a="add" data-id="${p.id}">${t('add')}</button>
 </div></article>`;
}

/* өнгө солиход тухайн барааны бүх картыг шинэчлэх */
function syncCard(id){
 const p=byId(id),s=sel(p);
 $$(`.card[data-id="${id}"]`).forEach(c=>{
  c.style.setProperty('--f',imgF(p,s.color));
  $$('.sw',c).forEach(b=>b.classList.toggle('on',b.dataset.v===s.color));
  $('.sw-l',c).textContent=colN(s.color);
  $$('.c-img img',c).forEach(i=>{i.dataset.c=COL[s.color];if(i.dataset.f)i.src=ph(p.brand,COL[s.color]);else{i.style.filter='';i.src=imgSrc(p,s.color)}});
 });
}

/* ---------- HOME: ангиллын хавтангууд ---------- */
function renderCats(){
 $('#catTiles').innerHTML=CATS.map(c=>{
  const list=P.filter(x=>x.cat===c),p=list[0];
  return `<button class="cat-tile rev" data-a="cat" data-v="${c}"><img src="${IMG(p.img,600)}" alt="" loading="lazy" ${A(p,p.colors[0])}><span><b>${catN(c)}</b><small>${list.length} ${t('models')}</small></span></button>`;
 }).join('');
}

/* ---------- HOME: саяхан үзсэн ---------- */
function renderRecent(){
 const items=S.recent.map(byId).filter(Boolean);
 $('#recentSec').style.display=items.length?'':'none';
 $('#gridRecent').innerHTML=items.map(p=>card(p)).join('');
 reveal();
}

/* ---------- NEW / BEST / SALE хуудсууд ---------- */
function renderLists(){
 $('#gridNew').innerHTML=NEWL.map(p=>card(p)).join('');
 $('#gridBest').innerHTML=BESTL.map((p,i)=>card(p,{rank:i+1})).join('');
 $('#gridSale').innerHTML=SALEL.map(p=>card(p,{save:1})).join('');
}

/* ---------- SHOP хуудас ---------- */
function filtered(){
 const f=S.f,q=f.q.trim().toLowerCase();
 const r=P.filter(p=>(f.cat==='all'||p.cat===f.cat)&&(f.brand==='all'||p.brand===f.brand)&&sale(p)<=f.max&&(f.size==='all'||p.sizes.includes(+f.size))&&(!q||[p.name,p.brand,T.en['cat_'+p.cat],T.mn['cat_'+p.cat]].join(' ').toLowerCase().includes(q)));
 const so={featured:(a,b)=>a.id-b.id,pl:(a,b)=>sale(a)-sale(b),ph:(a,b)=>sale(b)-sale(a),new:(a,b)=>b.added.localeCompare(a.added),best:(a,b)=>b.sales-a.sales,disc:(a,b)=>b.disc-a.disc,name:(a,b)=>a.name.localeCompare(b.name)};
 return r.sort(so[f.sort]||so.featured);
}
function renderShop(){
 const r=filtered();
 $('#gridShop').innerHTML=r.length?r.map(p=>card(p)).join(''):`<div class="none">${t('no_res')}</div>`;
 $('#count').textContent=`${r.length} ${t('found')}`;
 $('#pVal').textContent=money(S.f.max);
 reveal();
}

/* шүүлтүүрийн сонголтууд, брэндийн мөр, footer-ийн ангилал */
function renderControls(){
 $('#catChips').innerHTML=[['all',t('all')],...CATS.map(c=>[c,catN(c)])].map(([v,l])=>`<button class="chip ${S.f.cat===v?'on':''}" data-a="cat" data-v="${v}">${l}</button>`).join('');
 $('#fBrand').innerHTML=`<option value="all">${t('all')}</option>`+BRANDS.map(b=>`<option>${b}</option>`).join('');
 $('#fBrand').value=S.f.brand;
 $('#fSize').innerHTML=`<option value="all">${t('all_s')}</option>`+Array.from({length:10},(_,i)=>38+i).map(s=>`<option value="${s}">EU ${s}</option>`).join('');
 $('#fSize').value=S.f.size;
 const so=[['featured','s_feat'],['pl','s_pl'],['ph','s_ph'],['new','s_new'],['best','s_best'],['disc','s_disc'],['name','s_name']];
 $('#fSort').innerHTML=so.map(([v,k])=>`<option value="${v}">${t(k)}</option>`).join('');
 $('#fSort').value=S.f.sort;
 $('#fPrice').value=S.f.max;$('#q').value=S.f.q;
 $('#brandStrip').innerHTML=BRANDS.map(b=>`<button data-a="brandpick" data-v="${b}">${b}</button>`).join('');
 $('#footCats').innerHTML=CATS.map(c=>`<li><button data-a="cat" data-v="${c}">${catN(c)}</button></li>`).join('');
}

/* ---------- хэмжээний хүснэгт ---------- */
function renderSG(){
 const rows=[[38,'5.5',5,24.1],[39,'6.5',6,24.8],[40,'7',6.5,25.4],[41,'8',7.5,26],[42,'8.5',8,26.7],[43,'9.5',9,27.3],[44,'10',9.5,27.9],[45,'11',10.5,28.6],[46,'12',11,29.2],[47,'13',12,29.8]];
 $('#sgBody').innerHTML=`<table class="tbl"><tr><th>EU</th><th>US</th><th>UK</th><th>${t('foot')}</th></tr>${rows.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</table>`;
}

/* ---------- бүгдийг дахин зурах (хэл солих үед) ---------- */
function renderAll(){
 renderControls();renderCats();renderLists();renderShop();renderRecent();renderCart();renderWish();badges();
 if(isOpen('cmpL'))renderCmp();
 if(isOpen('qvL'))renderProduct();
 if(isOpen('sgL'))renderSG();
 reveal();
}
