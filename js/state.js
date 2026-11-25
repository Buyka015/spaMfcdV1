/* state.js — апп-ын төлөв (localStorage-д хадгалагдана) + орчуулгын функц */
'use strict';

const S={
 cart:LS('ss_cart',[]),       /* сагс: [{id,color,size,qty}] */
 wish:LS('ss_wish',[]),       /* хадгалсан бараа: [id] */
 cmp:LS('ss_cmp',[]),         /* харьцуулах: [id] */
 recent:LS('ss_recent',[]),   /* саяхан үзсэн: [id] */
 lang:LS('ss_lang','en'),     /* 'en' | 'mn' */
 theme:LS('ss_theme','light'),/* 'light' | 'dark' */
 sel:LS('ss_sel',{}),         /* бараа бүрийн сонгосон өнгө/хэмжээ */
 f:Object.assign({q:'',cat:'all',brand:'all',size:'all',max:250,sort:'featured'},LS('ss_filters',{})),   /* шүүлтүүр */
 view:''                      /* одоо харагдаж буй хуудас: home | new | best | sale | shop */
};

const M={id:0,mode:'full',view:1,qty:1};   /* барааны modal-ын төлөв */
const layerStack=[];                       /* нээлттэй overlay-ууд */

/* орчуулга */
const t=k=>(T[S.lang]&&T[S.lang][k])||T.en[k]||k;
const catN=c=>t('cat_'+c),colN=c=>t('col_'+c);

const saveSel=()=>SV('ss_sel',S.sel),saveF=()=>SV('ss_filters',S.f);
const inWish=id=>S.wish.includes(id),inCmp=id=>S.cmp.includes(id);

/* тухайн барааны сонгогдсон өнгө/хэмжээ (байхгүй бол анхны утга өгнө) */
function sel(p){
 const s=S.sel[p.id]||(S.sel[p.id]={});
 if(!p.colors.includes(s.color))s.color=p.colors[0];
 if(!p.sizes.includes(s.size))s.size=(S.f.size!=='all'&&p.sizes.includes(+S.f.size))?+S.f.size:p.sizes[Math.floor(p.sizes.length/2)];
 return s;
}
