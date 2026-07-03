// ══════════════ 저장소 ══════════════
function lN(k,d=0){try{return parseInt(localStorage.getItem(k)||d);}catch{return d;}}
function lS(k,d=''){try{return localStorage.getItem(k)||d;}catch{return d;}}
function lJ(k,d={}){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d));}catch{return d;}}
function sv(k,v){try{localStorage.setItem(k,typeof v==='object'?JSON.stringify(v):String(v));}catch{}}
let coins=lN('hd_c',0),energy=lN('hd_e',0);
let shopLv=lJ('hd_s',{}),pUpgLv=lJ('hd_pu',{});
let owned=lJ('hd_ow',{pistol:true,shotgun:true,knife:true,minigun:true});
let eqArmor=lS('hd_ea',''),eqWepId=lS('hd_ew','minigun');
let arLv=lJ('hd_al',{}),wepLv=lJ('hd_wl',{});
function saveAll(){sv('hd_c',coins);sv('hd_e',energy);sv('hd_s',shopLv);sv('hd_pu',pUpgLv);sv('hd_ow',owned);sv('hd_ea',eqArmor||'');sv('hd_ew',eqWepId||'pistol');sv('hd_al',arLv);sv('hd_wl',wepLv);}