/* cart.js — сагс: нэмэх, тоо өөрчлөх, хасах, нийт дүн, header-ийн тоолуур */
'use strict';

/* сагсны мөрийн түлхүүр: бараа + өнгө + хэмжээ */
const key=i=>`${i.id}|${i.color}|${i.size}`;
const saveCart=()=>{SV('ss_cart',S.cart);renderCart();badges()};

/* ---------- нийт дүн ---------- */
function totals(){
 let orig=0,sub=0,n=0;
 S.cart.forEach(i=>{const p=byId(i.id);orig+=p.price*i.qty;sub+=sale(p)*i.qty;n+=i.qty});
 const r=x=>Math.round(x*100)/100,ship=!n||sub>=150?0:9.99;   /* $150-с дээш бол хүргэлт үнэгүй */
 return{n,orig:r(orig),sub:r(sub),save:r(orig-sub),ship,total:r(sub+ship)};
}

/* ---------- сагсны drawer ---------- */
function renderCart(){
 const box=$('#cartItems'),foot=$('#cartFoot');
 if(!S.cart.length){
  box.innerHTML=`<div class="empty"><span>${t('empty_cart')}</span><button class="btn" data-a="close" data-v="cartL">${t('continue')}</button></div>`;
  foot.style.display='none';return;
 }
 foot.style.display='';
 box.innerHTML=S.cart.map(i=>{const p=byId(i.id),k=key(i);
  return `<div class="ci"><a class="ci-img" href="#product-${p.id}" data-a="open" data-id="${p.id}"><img src="${imgSrc(p,i.color)}" style="filter:${imgF(p,i.color)}" alt="${p.name}" ${A(p,i.color)}></a>
  <div><div class="ci-n">${p.name}</div><div class="mut">${p.brand} · ${colN(i.color)} · ${t('size')} EU ${i.size}</div><div class="price" style="margin-top:4px">${priceH(p)}</div>
  <div class="ci-r"><div class="qty"><button data-a="cartq" data-k="${k}" data-d="-1" aria-label="−">−</button><span>${i.qty}</span><button data-a="cartq" data-k="${k}" data-d="1" aria-label="+">+</button></div><b>${money(sale(p)*i.qty)}</b></div></div>
  <button class="x" data-a="cartrm" data-k="${k}" title="${t('remove')}" aria-label="${t('remove')}">×</button></div>`}).join('');
 const o=totals();
 $('#cartSum').innerHTML=`<div class="row"><span>${t('items')}</span><span>${o.n}</span></div>
 ${o.save>0?`<div class="row"><span>${t('orig')}</span><s>${money(o.orig)}</s></div><div class="row"><span>${t('savings')}</span><span class="g">−${money(o.save)}</span></div>`:''}
 <div class="row"><span>${t('subtotal')}</span><span>${money(o.sub)}</span></div>
 <div class="row"><span>${t('shipping')}</span><span>${o.ship?money(o.ship):t('free')}</span></div>
 <div class="row t"><span>${t('total')}</span><span>${money(o.total)}</span></div>`;
}

/* ---------- header дээрх тоолуурууд ---------- */
function badges(){
 const set=(id,n)=>{const e=$('#'+id);e.textContent=n;e.style.display=n?'':'none'};
 set('cartN',S.cart.reduce((a,i)=>a+i.qty,0));set('wishN',S.wish.length);set('cmpN',S.cmp.length);
}
function bump(id){const e=$('#'+id);e.classList.remove('bump');void e.offsetWidth;e.classList.add('bump')}

/* ---------- үйлдлүүд ---------- */
function addCart(id,color,size,qty){
 const p=byId(id);if(!p)return;
 const it=S.cart.find(i=>i.id==id&&i.color===color&&i.size===size);
 if(it)it.qty=Math.min(10,it.qty+qty);else S.cart.push({id,color,size,qty});
 saveCart();bump('cartN');
 toast(p.name,`${t('added')} · ${colN(color)} · EU ${size} × ${qty}`,p,true);
}
function changeQty(k,d){
 const i=S.cart.find(x=>key(x)===k);if(!i)return;
 i.qty=Math.min(10,i.qty+d);
 if(i.qty<=0)S.cart=S.cart.filter(x=>x!==i);
 saveCart();
}
function removeItem(k){S.cart=S.cart.filter(x=>key(x)!==k);saveCart()}
function clearCart(){S.cart=[];saveCart();toast(t('cart'),t('cart_cleared'))}
function checkout(){
 if(!S.cart.length)return;
 S.cart=[];saveCart();closeLayer('cartL');toast('BUYKA SHOP',t('order_ok'));
}
