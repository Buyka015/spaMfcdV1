/* product.js — барааны дэлгэрэнгүй цонх, өнгө/хэмжээ сонгох, wishlist, compare */
'use strict';

/* ---------- product modal ---------- */
function renderProduct(){
 const p=byId(M.id);if(!p)return;
 const s=sel(p),full=M.mode==='full',f=imgF(p,s.color),src=imgSrc(p,s.color),o=focusPt(p),at=A(p,s.color);
 const modal=$('#qvL .modal'),st=modal.scrollTop;
 const th=v=>`<button class="th ${M.view===v?'on':''}" data-a="view" data-v="${v}"><img src="${src}" alt="" style="filter:${f};${v==2?`transform:scale(1.7);transform-origin:${o}`:''}" ${at}></button>`;
 const rating=(4+(p.id%10)/10).toFixed(1);
 $('#qvBody').innerHTML=`<div class="pm-grid">
 <div class="pm-gal"><div class="pm-main"><img class="${M.view==2?'z':''}" src="${src}" alt="${p.brand} ${p.name}" style="filter:${f};transform-origin:${o}" ${at}></div>${full?`<div class="pm-th">${th(1)}${th(2)}</div>`:''}</div>
 <div class="pm-info">
  <div class="c-brand">${p.brand} · ${catN(p.cat)}</div>
  <h2>${p.name}</h2>
  <div style="display:flex;gap:6px;flex-wrap:wrap">${badgeH(p)}</div>
  <div class="price">${priceH(p)}</div>
  <div class="stars">★★★★★ <span class="mut">${rating} · ${Math.round(p.sales/4)} ${t('reviews')}</span></div>
  <div><div class="lbl"><span>${t('color')}: ${colN(s.color)}</span></div>
   <div class="sw-row" style="margin-top:10px;gap:12px">${p.colors.map(c=>`<button class="sw ${c===s.color?'on':''}" style="--c:${COL[c]};width:32px;height:32px" data-a="color" data-id="${p.id}" data-v="${c}" title="${colN(c)}" aria-label="${colN(c)}"></button>`).join('')}</div></div>
  <div><div class="lbl"><span>${t('size')}: EU ${s.size}</span><button data-a="sg">${t('size_guide')}</button></div>
   <div class="sizes">${p.sizes.map(z=>`<button class="szb ${z===s.size?'on':''}" data-a="size" data-id="${p.id}" data-v="${z}">${z}</button>`).join('')}</div></div>
  <div class="buy"><div class="qty"><button data-a="mq" data-d="-1" aria-label="−">−</button><span>${M.qty}</span><button data-a="mq" data-d="1" aria-label="+">+</button></div>
   <button class="btn" data-a="madd">${t('add')} — ${money(sale(p)*M.qty)}</button>
   <button class="tool ${inWish(p.id)?'on':''}" data-a="wish" data-id="${p.id}" title="${t('wish')}" aria-label="${t('wish')}">${ICON.heart}</button>
   <button class="tool ${inCmp(p.id)?'on':''}" data-a="cmp" data-id="${p.id}" title="${t('cmp')}" aria-label="${t('cmp')}">${ICON.cmp}</button></div>
  ${full?`<p class="pm-d">${t('desc_'+p.cat)}</p>
  <div class="spec"><div><b>${t('brand')}</b>${p.brand}</div><div><b>${t('category')}</b>${catN(p.cat)}</div><div><b>${t('sku')}</b>SS-${String(p.id).padStart(4,'0')}</div><div><b>${t('avail')}</b>EU ${p.sizes[0]}–${p.sizes[p.sizes.length-1]}</div></div>`:''}
 </div></div>`;
 modal.scrollTop=st;
}

/* mode: 'full' (карт дээр дарах) | 'quick' (нүдэн icon) */
function openProduct(id,mode){
 M.id=id;M.mode=mode;M.view=1;M.qty=1;
 S.recent=[id,...S.recent.filter(x=>x!==id)].slice(0,8);SV('ss_recent',S.recent);
 renderProduct();openLayer('qvL');
 if(mode==='full')setHash('#product-'+id);
 renderRecent();
}

/* ---------- өнгө / хэмжээ ---------- */
function setColor(id,c){
 sel(byId(id)).color=c;saveSel();syncCard(id);
 if(isOpen('qvL')&&M.id==id)renderProduct();
}
function setSize(id,z){
 sel(byId(id)).size=z;saveSel();
 if(isOpen('qvL')&&M.id==id)renderProduct();
}

/* ---------- wishlist ---------- */
function toggleWish(id){
 const p=byId(id),on=inWish(id);
 S.wish=on?S.wish.filter(x=>x!==id):[...S.wish,id];SV('ss_wish',S.wish);
 $$(`.tool[data-a="wish"][data-id="${id}"]`).forEach(b=>b.classList.toggle('on',!on));
 badges();bump('wishN');renderWish();
 toast(p.name,on?t('wish_rm'):t('wish_add'),p);
}
function renderWish(){
 const items=S.wish.map(byId).filter(Boolean),box=$('#wishItems');
 if(!items.length){box.innerHTML=`<div class="empty"><span>${t('empty_wish')}</span></div>`;return}
 box.innerHTML=items.map(p=>{const s=sel(p);return `<div class="wl"><img src="${imgSrc(p,s.color)}" style="filter:${imgF(p,s.color)}" alt="" ${A(p,s.color)}>
 <div><a href="#product-${p.id}" data-a="open" data-id="${p.id}" style="font-weight:800">${p.name}</a><div class="mut">${p.brand}</div><div class="price">${priceH(p)}</div>
 <div class="btns"><button class="btn sm" data-a="add" data-id="${p.id}">${t('add')}</button><button class="btn ghost sm" data-a="wish" data-id="${p.id}">${t('remove')}</button></div></div></div>`}).join('');
}

/* ---------- compare (4 хүртэл) ---------- */
function toggleCmp(id){
 const p=byId(id),on=inCmp(id);
 if(!on&&S.cmp.length>=4){toast(t('cmp'),t('cmp_max'));return}
 S.cmp=on?S.cmp.filter(x=>x!==id):[...S.cmp,id];SV('ss_cmp',S.cmp);
 $$(`.tool[data-a="cmp"][data-id="${id}"]`).forEach(b=>b.classList.toggle('on',!on));
 badges();bump('cmpN');if(isOpen('cmpL'))renderCmp();
 toast(p.name,on?t('cmp_rm'):t('cmp_add'),p);
}
function renderCmp(){
 const items=S.cmp.map(byId).filter(Boolean),box=$('#cmpBody');
 if(!items.length){box.innerHTML=`<div class="empty"><span>${t('empty_cmp')}</span></div>`;return}
 const row=(l,f)=>`<tr><th>${l}</th>${items.map(p=>`<td>${f(p)}</td>`).join('')}</tr>`;
 box.innerHTML=`<table class="tbl">
 ${row('',p=>{const s=sel(p);return `<img src="${imgSrc(p,s.color)}" style="filter:${imgF(p,s.color)}" alt="" ${A(p,s.color)}>`})}
 ${row(t('brand'),p=>`<b>${p.name}</b><br>${p.brand}`)}
 ${row(t('category'),p=>catN(p.cat))}
 ${row(t('price'),p=>`<div class="price">${priceH(p)}</div>`)}
 ${row(t('colors'),p=>p.colors.map(colN).join(', '))}
 ${row(t('avail'),p=>`EU ${p.sizes[0]}–${p.sizes[p.sizes.length-1]}`)}
 ${row('',p=>`<button class="btn sm" data-a="add" data-id="${p.id}">${t('add')}</button><button class="btn ghost sm" data-a="cmp" data-id="${p.id}">${t('remove')}</button>`)}
 </table>`;
}
