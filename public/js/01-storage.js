// ══════════════ 저장소 ══════════════
// 저장 버전이 바뀌면 다음 접속 시 모든 저장 데이터를 초기화 (유출 코드 악용 대응)
const SAVE_VERSION='2';
(function(){
  try{
    if(localStorage.getItem('hd_save_version')!==SAVE_VERSION){
      localStorage.clear();
      localStorage.setItem('hd_save_version',SAVE_VERSION);
    }
  }catch(e){}
})();
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