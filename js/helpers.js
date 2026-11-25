/* helpers.js — жижиг туслах функцууд: DOM, localStorage, үнэ, зураг, icon, toast, reveal */
'use strict';

/* ---------- DOM / storage ---------- */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const LS=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};   /* унших */
const SV=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};                          /* хадгалах */
const money=n=>'$'+(Math.round(n*100)/100).toFixed(2);
const isOpen=id=>$('#'+id).classList.contains('open');   /* overlay нээлттэй эсэх */

/* ---------- images ---------- */
const IMG=(id,w=900)=>`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${w}&q=80`;

/* зураг ачаалагдахгүй бол SVG гутлын зураг үүсгэнэ */
function ph(b,hex){
 const s=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800'><rect width='800' height='800' fill='#ececec'/><path d='M130 520c0-50 40-80 90-90l80-100c25-30 65-25 85 5l30 45c60 20 140 40 200 70 60 30 70 70 65 105H130z' fill='${hex}' stroke='#111' stroke-width='6'/><rect x='115' y='530' width='600' height='46' rx='23' fill='#fff' stroke='#111' stroke-width='6'/><text x='400' y='680' font-family='Arial' font-weight='900' font-size='46' text-anchor='middle' fill='#111'>${b}</text></svg>`;
 return 'data:image/svg+xml;utf8,'+encodeURIComponent(s);
}
/* <img onerror="fb(this)"> */
function fb(el){el.style.filter='none';el.dataset.f=1;el.onerror=null;el.src=ph(el.dataset.b,el.dataset.c)}

const A=(p,c)=>`data-b="${p.brand}" data-c="${COL[c]}" onerror="fb(this)"`;              /* img-ийн fallback attribute */
const imgSrc=(p,c)=>IMG((p.ci&&p.ci[c])||p.img);
const imgF=(p,c)=>(p.ci&&p.ci[c])||c===p.colors[0]?'none':(FILT[c]||'none');              /* өнгөний filter */
const focusPt=p=>['30% 70%','70% 60%','50% 85%','25% 45%'][p.id%4];                       /* zoom хийх цэг */

/* ---------- icons ---------- */
const ICON={
 heart:'<svg class="fillable" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-8-5.2-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.8-8 11-8 11z"/></svg>',
 cmp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 4v16M3 8l4-4 4 4M17 20V4m-4 12 4 4 4-4"/></svg>',
 eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
 sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4"/></svg>',
 moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/></svg>'
};

/* ---------- reveal animation (.rev → .in) ---------- */
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}}),{threshold:.06}):null;
function reveal(){$$('.rev:not(.in)').forEach(el=>io?io.observe(el):el.classList.add('in'))}

/* ---------- toast мэдэгдэл ---------- */
function toast(title,msg,p,cart){
 const el=document.createElement('div');el.className='toast';
 const c=p?sel(p).color:'';
 el.innerHTML=(p?`<img src="${imgSrc(p,c)}" style="filter:${imgF(p,c)}" alt="" ${A(p,c)}>`:'')+`<div><b>${title}</b><span>${msg}</span>${cart?`<button data-a="openCart">${t('view_cart')}</button>`:''}</div>`;
 $('#toasts').appendChild(el);
 while($('#toasts').children.length>3)$('#toasts').firstChild.remove();
 setTimeout(()=>{el.classList.add('out');setTimeout(()=>el.remove(),320)},3000);
}
