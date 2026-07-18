// ════════════════════════════════════════════
// ══ 떠돌이 상인 7종 + 인벤토리 ══
// ════════════════════════════════════════════

// ── 통합 버프 카테고리 (과일/물약/분식 공용) ──
const MB_CATS=['dmg','armor','luck','maxHp','spd','coin','energy'];
const MB_LABEL={dmg:'공격력',armor:'방어력',luck:'행운',maxHp:'최대체력',spd:'이동속도',coin:'코인 획득량',energy:'에너지 획득량',all:'모든 능력치'};

let merchBuffs = lJ('hd_merch_buffs', {});
function saveMerchBuffs(){ sv('hd_merch_buffs', merchBuffs); }
function applyMerchBuff(cat, mult, durMs){ merchBuffs[cat]={mult, until:Date.now()+durMs}; saveMerchBuffs(); recalcMerchEconMults(); }
function merchBuffMult(cat){ const b=merchBuffs[cat]; return (b&&b.until>Date.now())?b.mult:1; }
function merchStatMult(cat){ return merchBuffMult(cat)*merchBuffMult('all'); }

let merchDebuff = lJ('hd_merch_debuff', {until:0});
function saveMerchDebuff(){ sv('hd_merch_debuff', merchDebuff); }
function merchDebuffActive(){ return merchDebuff.until>Date.now(); }

function merchDmgMult(){ return merchStatMult('dmg')*(merchDebuffActive()?0.5:1); }
function merchArmorMult(){ return merchStatMult('armor')*(merchDebuffActive()?0.5:1); }
function merchLuckMult(){ return merchStatMult('luck')*(merchDebuffActive()?0.5:1); }
function applyMerchStatsToPlayer(P){
  const hm=merchStatMult('maxHp');
  P.maxHp=Math.round(P.maxHp*hm); P.hp=P.maxHp;
  P.spd=P.spd*merchStatMult('spd');
}
function recalcMerchEconMults(){
  window._merchCoinMult = merchStatMult('coin');
  window._merchEnergyMult = merchStatMult('energy');
}

// ── 인벤토리 저장소 ──
let merchInv = lJ('hd_merch_inv', {fruit:{},potion:{},trash:{},paper:{},snack:{}});
['fruit','potion','trash','paper','snack'].forEach(k=>{ if(!merchInv[k])merchInv[k]={}; });
function saveMerchInv(){ sv('hd_merch_inv', merchInv); }

// ── 안젤리나: 과일 17종 ──
const FRUIT_DEF=[
  {name:'사과',icon:'🍎',cat:'dmg'},{name:'바나나',icon:'🍌',cat:'spd'},{name:'포도',icon:'🍇',cat:'luck'},
  {name:'수박',icon:'🍉',cat:'maxHp'},{name:'딸기',icon:'🍓',cat:'armor'},{name:'오렌지',icon:'🍊',cat:'coin'},
  {name:'레몬',icon:'🍋',cat:'energy'},{name:'복숭아',icon:'🍑',cat:'dmg'},{name:'파인애플',icon:'🍍',cat:'spd'},
  {name:'체리',icon:'🍒',cat:'luck'},{name:'멜론',icon:'🍈',cat:'maxHp'},{name:'망고',icon:'🥭',cat:'armor'},
  {name:'키위',icon:'🥝',cat:'coin'},{name:'코코넛',icon:'🥥',cat:'energy'},{name:'배',icon:'🍐',cat:'dmg'},
  {name:'토마토',icon:'🍅',cat:'spd'},{name:'만병통치 열매',icon:'✨',cat:'all'},
];
const FRUITS = FRUIT_DEF.map((f,i)=>{
  const price=Math.round(250*Math.pow(1.42,i));
  const durMin=5+i;
  const mult = f.cat==='all' ? 1.12 : +(1.06+Math.floor(i/7)*0.14).toFixed(2);
  return {id:'fruit_'+i, name:f.name, icon:f.icon, cat:f.cat, mult, durMs:durMin*60000, price,
    desc:`${MB_LABEL[f.cat]} +${Math.round((mult-1)*100)}% (${durMin}분 지속)`};
});

// ── 계란빵 아저씨: 분식 6종 ──
const SNACK_DEF=[
  {name:'계란빵',icon:'🥯',cat:'maxHp'},{name:'떡볶이',icon:'🍢',cat:'dmg'},{name:'순대',icon:'🌭',cat:'armor'},
  {name:'오뎅',icon:'🍥',cat:'energy'},{name:'김밥',icon:'🍙',cat:'spd'},{name:'호떡',icon:'🥮',cat:'coin'},
];
const SNACKS = SNACK_DEF.map((s,i)=>{
  const price=Math.round(150*Math.pow(1.6,i));
  const durMin=3+i;
  const mult=+(1.03+i*0.01).toFixed(2);
  return {id:'snack_'+i, name:s.name, icon:s.icon, cat:s.cat, mult, durMs:durMin*60000, price,
    desc:`${MB_LABEL[s.cat]} +${Math.round((mult-1)*100)}% (${durMin}분 지속)`};
});

// ── MR 감자씨: 초고가 물약 7종 + 부자의 숟가락 ──
const RICH_POTION_NAMES=['광폭화의 영약','철옹성의 영약','천운의 영약','불사의 영약','질풍의 영약','황금손의 영약','만물에너지의 영약'];
const RICH_POTIONS = MB_CATS.map((cat,i)=>{
  const mult=+(2+i*0.5).toFixed(2);
  const price=Math.round(600000*Math.pow(2.2,i));
  return {id:'rich_pot_'+cat, name:RICH_POTION_NAMES[i], icon:'🧪', cat, mult, durMs:15*60000, price,
    desc:`${MB_LABEL[cat]} +${Math.round((mult-1)*100)}% (15분 지속) · 부자의 특제 물약`};
});
const RICH_SPOON={id:'rich_spoon', name:'부자의 숟가락', icon:'🥄', price:50000000,
  desc:'1회용 사치품. 사용하면 엄청난 빛과 함께 히든 업적과 "부자의 모자"를 얻는다.'};

// ── 케빈: 음식물쓰레기 3종 + 폐지 10종 ──
const KEVIN_TRASH=[
  {id:'trash_food',name:'음식물쓰레기',icon:'🍂',price:10,desc:'사용해도 아무 효과가 없다'},
  {id:'trash_can',name:'찌그러진 깡통',icon:'🥫',price:30,desc:'사용해도 아무 효과가 없다'},
  {id:'trash_bag',name:'냄새나는 쓰레기봉투',icon:'🗑️',price:100,desc:'사용해도 아무 효과가 없다'},
];
const KEVIN_PAPER_PRICES=[5,50,500,5000,50000,200000,800000,2000000,5000000,10000000];
const KEVIN_PAPER = KEVIN_PAPER_PRICES.map((price,i)=>({
  id:'paper_'+i, name:'폐지 '+(i+1)+'단계', icon:'📦', price,
  coinPerTick:10*(i+1), desc:`케빈이 5분간 로비에서 구걸 · 3초마다 🪙${10*(i+1)}`,
}));

// ── 별의 요정: 차원의 별 4종 직접 판매 (31-daily-reward.js STARS 재사용) ──
const STARFAIRY_SELL=[
  {starId:'star_radiance', price:25000000},
  {starId:'star_void', price:40000000},
  {starId:'star_origin', price:60000000},
  {starId:'star_eternity', price:90000000},
];

// ── 세바스찬: 배팅 5단계 ──
const SEBASTIAN_BETS=[1000,10000,100000,1000000,10000000];

// ── 악마 거래 ──
const DEVIL_PRICE=5000000;

// ── 상인 정의 ──
const MERCHANTS=[
  {id:'angelina', name:'안젤리나', title:'과일 장수', icon:'🍎'},
  {id:'sebastian', name:'세바스찬', title:'해적', icon:'🏴‍☠️'},
  {id:'potato', name:'MR 감자씨', title:'부자', icon:'🥔'},
  {id:'kevin', name:'케빈', title:'거지', icon:'🧓'},
  {id:'starfairy', name:'별의 요정', title:'', icon:'🧚'},
  {id:'devil', name:'악마', title:'', icon:'😈'},
  {id:'angel', name:'천사', title:'', icon:'👼'},
  {id:'eggbread', name:'계란빵 아저씨', title:'', icon:'🥯'},
];

// ════════════════════════════════════════════
// ══ 상인 등장/배회 ══
// ════════════════════════════════════════════
let merchState = lJ('hd_merch_state', {id:null, until:0});
function saveMerchState(){ sv('hd_merch_state', merchState); }
let _merchMoveItv=null;

function spawnCheckTick(){
  if(merchState.id && merchState.until>Date.now()) return;
  if(merchState.id){ merchState={id:null,until:0}; saveMerchState(); renderMerchantNpc(); }
  if(Math.random()<0.15){
    const m=MERCHANTS[Math.floor(Math.random()*MERCHANTS.length)];
    merchState={id:m.id, until:Date.now()+600000}; saveMerchState();
    showMerchantToast(m.icon+' '+m.name+'가(이) 로비에 나타났습니다!');
  }
  renderMerchantNpc();
}
setInterval(spawnCheckTick, 60000);

function renderMerchantNpc(){
  const el=document.getElementById('merchantNpc'); if(!el) return;
  const lobbyEl=document.getElementById('sLobby');
  const lobbyOn = lobbyEl && lobbyEl.classList.contains('on');
  const active = merchState.id && merchState.until>Date.now();
  if(!active || !lobbyOn){
    el.style.display='none';
    if(_merchMoveItv){clearInterval(_merchMoveItv);_merchMoveItv=null;}
    return;
  }
  const m=MERCHANTS.find(x=>x.id===merchState.id);
  if(!m){ el.style.display='none'; return; }
  el.style.display='flex';
  el.textContent=m.icon;
  el.title=m.name+' - 클릭해서 상점 열기';
  el.onclick=()=>openMerchantShop(m.id);
  if(!_merchMoveItv){
    moveMerchantNpc();
    _merchMoveItv=setInterval(moveMerchantNpc,3500);
  }
}
function moveMerchantNpc(){
  const el=document.getElementById('merchantNpc'); if(!el)return;
  const left=10+Math.random()*72, top=15+Math.random()*60;
  el.style.left=left+'%'; el.style.top=top+'%';
}
function showMerchantToast(msg){
  const el=document.getElementById('merchantToast'); if(!el)return;
  el.textContent=msg;
  el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
  clearTimeout(el._hideT);
  el._hideT=setTimeout(()=>el.classList.remove('show'),3200);
}

// 개발자 테스트용: 콘솔에서 devSpawnMerchant('angelina') 등으로 즉시 등장
window.devSpawnMerchant=function(id){
  const m=MERCHANTS.find(x=>x.id===id);
  if(!m){ console.log('사용 가능한 id:', MERCHANTS.map(x=>x.id)); return; }
  merchState={id:m.id, until:Date.now()+600000}; saveMerchState();
  renderMerchantNpc();
  showMerchantToast('[DEV] '+m.icon+' '+m.name+' 강제 등장');
};

// ════════════════════════════════════════════
// ══ 케빈 구걸 ══
// ════════════════════════════════════════════
let kevinBeg = lJ('hd_kevin_beg', {until:0, coinPerTick:0});
function saveKevinBeg(){ sv('hd_kevin_beg', kevinBeg); }
setInterval(()=>{
  if(kevinBeg.until>Date.now()){
    coins+=kevinBeg.coinPerTick; sv('hd_c',coins);
    if(typeof updRes==='function')updRes();
  }
},3000);
function renderKevinBeg(){
  const el=document.getElementById('kevinBegBadge'); if(!el)return;
  el.style.display=(kevinBeg.until>Date.now())?'flex':'none';
}

// ════════════════════════════════════════════
// ══ 악마 디버프 오버레이 ══
// ════════════════════════════════════════════
setInterval(()=>{
  const el=document.getElementById('merchDebuffOverlay'); if(!el)return;
  el.style.display=merchDebuffActive()?'block':'none';
},1000);

// ════════════════════════════════════════════
// ══ 구매/사용 로직 ══
// ════════════════════════════════════════════
function buyBuffItem(kind,id){
  const list = kind==='fruit'?FRUITS:kind==='snack'?SNACKS:RICH_POTIONS;
  const it=list.find(x=>x.id===id); if(!it||coins<it.price)return;
  coins-=it.price; sv('hd_c',coins); updRes();
  if(!merchInv[kind])merchInv[kind]={};
  merchInv[kind][id]=(merchInv[kind][id]||0)+1; saveMerchInv();
  renderMerchantShopContent();
}
function consumeBuffItem(kind,id){
  const list = kind==='fruit'?FRUITS:kind==='snack'?SNACKS:RICH_POTIONS;
  const it=list.find(x=>x.id===id);
  if(!it||!merchInv[kind]||!merchInv[kind][id])return;
  merchInv[kind][id]--; if(merchInv[kind][id]<=0)delete merchInv[kind][id];
  saveMerchInv();
  applyMerchBuff(it.cat, it.mult, it.durMs);
  showMerchantToast(it.icon+' '+it.name+' 섭취! '+MB_LABEL[it.cat]+' 버프 획득');
  renderMerchantInv();
}
function buyRichSpoon(){
  if(coins<RICH_SPOON.price)return;
  coins-=RICH_SPOON.price; sv('hd_c',coins); updRes();
  merchInv.potion['rich_spoon']=(merchInv.potion['rich_spoon']||0)+1; saveMerchInv();
  renderMerchantShopContent();
}
function useRichSpoon(){
  if(!merchInv.potion['rich_spoon'])return;
  merchInv.potion['rich_spoon']--; if(merchInv.potion['rich_spoon']<=0)delete merchInv.potion['rich_spoon'];
  saveMerchInv();
  achStats.egg_richspoon=1; saveAch(); checkAchievements();
  showRichSpoonFx();
  renderMerchantInv();
}
function showRichSpoonFx(){
  const el=document.getElementById('dailyRewardResult'); if(!el)return;
  el.style.setProperty('--sd-glow','#fbbf2455');
  el.style.setProperty('--sd-aurora',3);
  const confetti=typeof sdConfettiHTML==='function'?sdConfettiHTML(3):'';
  el.innerHTML = confetti+
    '<div class="sd-result-tier sd-result-tier-rainbow">🥄 사치의 극치!</div>'+
    '<div class="sd-result-list">'+
      '<div class="sd-reward-line">🎩 부자가 남긴 모자 획득!</div>'+
      '<div class="sd-reward-line">🏆 히든 업적: 사치의 극치</div>'+
    '</div>'+
    '<div class="sd-result-btns"><button class="sd-close-btn" onclick="closeDailyRewardResult()">확인</button></div>';
  el.classList.add('show');
  const screenEl=document.getElementById('sLobby');
  if(screenEl){screenEl.classList.remove('sd-chaos-shake');void screenEl.offsetWidth;screenEl.classList.add('sd-chaos-shake');}
}

function buyKevinItem(kind,id){
  const list = kind==='trash'?KEVIN_TRASH:KEVIN_PAPER;
  const it=list.find(x=>x.id===id); if(!it||coins<it.price)return;
  coins-=it.price; sv('hd_c',coins); updRes();
  if(!merchInv[kind])merchInv[kind]={};
  merchInv[kind][id]=(merchInv[kind][id]||0)+1; saveMerchInv();
  renderMerchantShopContent();
}
function useTrash(id){
  if(!merchInv.trash||!merchInv.trash[id])return;
  merchInv.trash[id]--; if(merchInv.trash[id]<=0)delete merchInv.trash[id];
  saveMerchInv();
  showMerchantToast('...아무 일도 일어나지 않았다');
  renderMerchantInv();
}
function usePaper(id){
  const p=KEVIN_PAPER.find(x=>x.id===id);
  if(!p||!merchInv.paper||!merchInv.paper[id])return;
  merchInv.paper[id]--; if(merchInv.paper[id]<=0)delete merchInv.paper[id];
  saveMerchInv();
  kevinBeg={until:Date.now()+300000,coinPerTick:p.coinPerTick}; saveKevinBeg();
  showMerchantToast('🧓 케빈이 로비에서 구걸을 시작합니다...');
  renderMerchantInv(); renderKevinBeg();
}

function buyFairyStar(starId){
  const def=STARFAIRY_SELL.find(x=>x.starId===starId); if(!def)return;
  if(typeof ownedStars==='undefined')return;
  if(ownedStars[starId]){ showMerchantToast('이미 보유 중인 별입니다'); return; }
  if(coins<def.price)return;
  coins-=def.price; sv('hd_c',coins); updRes();
  ownedStars[starId]=true; saveStarData();
  const star=STARS.find(s=>s.id===starId);
  showMerchantToast('🌠 '+(star?star.name:'')+' 획득!');
  renderMerchantShopContent();
}

function sebastianGamble(bet){
  if(!SEBASTIAN_BETS.includes(bet)||coins<bet)return;
  coins-=bet; sv('hd_c',coins);
  const r=Math.random()*100;
  let mult;
  if(r<5) mult=8;
  else if(r<20) mult=2.5;
  else if(r<55) mult=1.2;
  else if(r<85) mult=0.4;
  else mult=0.05;
  const total=Math.max(1,Math.round(bet*mult));
  const coinGain=Math.round(total*(0.3+Math.random()*0.4));
  const energyGain=Math.max(0,total-coinGain);
  coins+=coinGain; energy+=energyGain; sv('hd_c',coins); sv('hd_e',energy); updRes();
  showSebastianResult(bet,coinGain,energyGain,mult);
}
function showSebastianResult(bet,coinGain,energyGain,mult){
  const el=document.getElementById('dailyRewardResult'); if(!el)return;
  const lvl = mult>=8?3:mult>=2.5?2:mult>=1.2?1:0;
  const color = lvl>=3?'#f59e0b':lvl>=2?'#a855f7':lvl>=1?'#22c55e':'#ef4444';
  el.style.setProperty('--sd-glow', color+'55');
  el.style.setProperty('--sd-aurora', lvl);
  const tierCls=lvl>=3?' sd-result-tier-rainbow':lvl>=2?' sd-result-tier-epic':'';
  const confetti=(lvl>=2&&typeof sdConfettiHTML==='function')?sdConfettiHTML(lvl):'';
  el.innerHTML = confetti+
    `<div class="sd-result-tier${tierCls}" style="color:${color}">🏴‍☠️ 세바스찬의 보상!</div>`+
    `<div class="sd-result-list">`+
      `<div class="sd-reward-line">🪙 배팅 ${bet.toLocaleString()} → 코인 +${coinGain.toLocaleString()}</div>`+
      `<div class="sd-reward-line">⚡ 에너지 +${energyGain.toLocaleString()}</div>`+
    `</div>`+
    `<div class="sd-result-btns"><button class="sd-close-btn" onclick="closeDailyRewardResult()">확인</button></div>`;
  el.classList.add('show');
  closeMerchantShop();
}

function devilDeal(){
  if(merchDebuffActive()||coins<DEVIL_PRICE)return;
  coins-=DEVIL_PRICE; sv('hd_c',coins); updRes();
  merchDebuff={until:Date.now()+24*60*60*1000}; saveMerchDebuff();
  merchState={id:null,until:0}; saveMerchState(); renderMerchantNpc();
  showMerchantToast('😈 거래가 성립되었습니다... 24시간 동안 힘이 약해집니다');
  closeMerchantShop();
}
function angelDeal(){
  coins+=1000000; sv('hd_c',coins); updRes();
  achStats.egg_angelfaith=1; saveAch(); checkAchievements();
  merchState={id:null,until:0}; saveMerchState(); renderMerchantNpc();
  showMerchantToast('👼 "당신은 믿음의 사람이군요" - 천사가 미소지으며 사라졌습니다');
  closeMerchantShop();
}

// ════════════════════════════════════════════
// ══ 상점 오버레이 렌더링 ══
// ════════════════════════════════════════════
let _curMerchantShopId=null;
function openMerchantShop(id){
  const m=MERCHANTS.find(x=>x.id===id); if(!m)return;
  _curMerchantShopId=id;
  const t=document.getElementById('merchantShopTitle');
  if(t)t.textContent = m.icon+' '+m.name+(m.title?' ('+m.title+')':'');
  renderMerchantShopContent();
  const ov=document.getElementById('merchantShopOv');
  if(ov)ov.style.display='flex';
}
function closeMerchantShop(){
  const ov=document.getElementById('merchantShopOv');
  if(ov)ov.style.display='none';
}
function renderMerchantShopContent(){
  const id=_curMerchantShopId;
  const c=document.getElementById('merchantShopContent'); if(!c)return;
  const coinDisp=document.getElementById('merchShopCoinDisp'); if(coinDisp)coinDisp.textContent=coins.toLocaleString();
  c.innerHTML='';
  if(id==='angelina') renderBuffShopGrid(c, FRUITS, 'fruit', '🍎 안젤리나의 과일 가게 - 먹으면 일정 시간 버프를 얻습니다.');
  else if(id==='eggbread') renderBuffShopGrid(c, SNACKS, 'snack', '🥯 계란빵 아저씨의 분식 포장마차');
  else if(id==='potato') renderPotatoShop(c);
  else if(id==='kevin') renderKevinShop(c);
  else if(id==='starfairy') renderStarFairyShop(c);
  else if(id==='sebastian') renderSebastianShop(c);
  else if(id==='devil') renderDevilShop(c);
  else if(id==='angel') renderAngelShop(c);
}
function renderBuffShopGrid(container, list, kind, headerText){
  if(headerText){
    const h=document.createElement('div'); h.style.cssText='font-size:11px;color:#c4b5fd;margin-bottom:8px;text-align:center;';
    h.textContent=headerText; container.appendChild(h);
  }
  const grid=document.createElement('div'); grid.className='sgrid';
  list.forEach(it=>{
    const owned=(merchInv[kind]&&merchInv[kind][it.id])||0;
    const cb=coins>=it.price;
    const d=document.createElement('div'); d.className='si'+(cb?' cb2':'');
    d.innerHTML=`<div class="sico">${it.icon}</div><div class="snm">${it.name}</div>`+
      `<div style="font-size:9px;color:#c4b5fd;margin-top:3px;">${it.desc}</div>`+
      `<div style="font-size:10px;font-weight:700;color:${cb?'#fbbf24':'#6b7280'};margin-top:4px;">🪙${it.price.toLocaleString()}</div>`+
      (owned?`<div style="font-size:9px;color:#4ade80;margin-top:2px;">보유 ${owned}개</div>`:'');
    const btn=document.createElement('button'); btn.className='bybtn'; btn.textContent='구매'; btn.disabled=!cb;
    btn.onclick=()=>buyBuffItem(kind,it.id);
    d.appendChild(btn);
    grid.appendChild(d);
  });
  container.appendChild(grid);
}
function renderPotatoShop(c){
  const desc=document.createElement('div'); desc.style.cssText='font-size:11px;color:#c4b5fd;margin-bottom:8px;text-align:center;';
  desc.textContent='🥔 MR 감자씨 - 상상을 초월하는 효율의 물약들 (매우 비쌉니다)';
  c.appendChild(desc);
  renderBuffShopGrid(c, RICH_POTIONS, 'potion', null);
  const owned=merchInv.potion['rich_spoon']||0;
  const cb=coins>=RICH_SPOON.price;
  const spoonDiv=document.createElement('div'); spoonDiv.className='si'+(cb?' cb2':''); spoonDiv.style.marginTop='10px';
  spoonDiv.innerHTML=`<div class="sico">${RICH_SPOON.icon}</div><div class="snm">${RICH_SPOON.name}</div>`+
    `<div style="font-size:9px;color:#c4b5fd;margin-top:3px;">${RICH_SPOON.desc}</div>`+
    `<div style="font-size:10px;font-weight:700;color:${cb?'#fbbf24':'#6b7280'};margin-top:4px;">🪙${RICH_SPOON.price.toLocaleString()}</div>`+
    (owned?`<div style="font-size:9px;color:#4ade80;margin-top:2px;">보유 ${owned}개 (인벤토리에서 사용)</div>`:'');
  const btn=document.createElement('button'); btn.className='bybtn'; btn.textContent='구매'; btn.disabled=!cb;
  btn.onclick=()=>buyRichSpoon();
  spoonDiv.appendChild(btn);
  c.appendChild(spoonDiv);
}
function renderKevinShop(c){
  const desc=document.createElement('div'); desc.style.cssText='font-size:11px;color:#c4b5fd;margin-bottom:8px;text-align:center;';
  desc.textContent='🧓 케빈 - 음식물쓰레기와 폐지를 팝니다';
  c.appendChild(desc);
  const grid=document.createElement('div'); grid.className='sgrid';
  [...KEVIN_TRASH.map(it=>({...it,kind:'trash'})), ...KEVIN_PAPER.map(it=>({...it,kind:'paper'}))].forEach(it=>{
    const owned=(merchInv[it.kind]&&merchInv[it.kind][it.id])||0;
    const cb=coins>=it.price;
    const d=document.createElement('div'); d.className='si'+(cb?' cb2':'');
    d.innerHTML=`<div class="sico">${it.icon}</div><div class="snm">${it.name}</div>`+
      `<div style="font-size:9px;color:#c4b5fd;margin-top:3px;">${it.desc}</div>`+
      `<div style="font-size:10px;font-weight:700;color:${cb?'#fbbf24':'#6b7280'};margin-top:4px;">🪙${it.price.toLocaleString()}</div>`+
      (owned?`<div style="font-size:9px;color:#4ade80;margin-top:2px;">보유 ${owned}개</div>`:'');
    const btn=document.createElement('button'); btn.className='bybtn'; btn.textContent='구매'; btn.disabled=!cb;
    btn.onclick=()=>buyKevinItem(it.kind,it.id);
    d.appendChild(btn);
    grid.appendChild(d);
  });
  c.appendChild(grid);
}
function renderStarFairyShop(c){
  const desc=document.createElement('div'); desc.style.cssText='font-size:11px;color:#c4b5fd;margin-bottom:8px;text-align:center;';
  desc.textContent='🧚 별의 요정 - 차원의 별을 직접 판매합니다 (확정 획득, 뽑기 아님)';
  c.appendChild(desc);
  const grid=document.createElement('div'); grid.className='sgrid';
  STARFAIRY_SELL.forEach(def=>{
    const star=(typeof STARS!=='undefined')?STARS.find(s=>s.id===def.starId):null; if(!star)return;
    const has=typeof ownedStars!=='undefined'&&!!ownedStars[def.starId];
    const cb=coins>=def.price;
    const d=document.createElement('div'); d.className='si'+(has?' own':cb?' cb2':'');
    d.innerHTML=`<div class="sico">${star.icon}</div><div class="snm">${star.name}</div>`+
      `<div style="font-size:9px;color:#c4b5fd;margin-top:3px;">${star.desc}</div>`+
      `<div style="font-size:10px;font-weight:700;color:${cb?'#fbbf24':'#6b7280'};margin-top:4px;">🪙${def.price.toLocaleString()}</div>`+
      (has?'<div style="font-size:9px;color:#4ade80;margin-top:2px;">보유중</div>':'');
    const btn=document.createElement('button'); btn.className='bybtn'; btn.textContent=has?'보유중':'구매'; btn.disabled=has||!cb;
    btn.onclick=()=>buyFairyStar(def.starId);
    d.appendChild(btn);
    grid.appendChild(d);
  });
  c.appendChild(grid);
}
function renderSebastianShop(c){
  const desc=document.createElement('div'); desc.style.cssText='font-size:11px;color:#c4b5fd;margin-bottom:10px;text-align:center;';
  desc.textContent='🏴‍☠️ 세바스찬 - "돈을 걸어라. 얼마나 받을진 나도 모른다." (보상 확률은 비공개)';
  c.appendChild(desc);
  const row=document.createElement('div'); row.style.cssText='display:flex;flex-direction:column;gap:8px;';
  SEBASTIAN_BETS.forEach(bet=>{
    const btn=document.createElement('button'); btn.className='bybtn'; btn.style.cssText='padding:10px;font-size:13px;';
    btn.disabled=coins<bet;
    btn.textContent=`🪙 ${bet.toLocaleString()} 배팅하기`;
    btn.onclick=()=>sebastianGamble(bet);
    row.appendChild(btn);
  });
  c.appendChild(row);
}
function renderDevilShop(c){
  const active=merchDebuffActive();
  const wrap=document.createElement('div');
  wrap.innerHTML = `<div style="font-size:12px;color:#fca5a5;line-height:1.7;text-align:center;margin-bottom:12px;">😈 "500만 코인을 내놓아라. 대신 24시간 동안 데미지, 방어력, 인챈트 행운을 반토막 내주지."</div>`+
    (active?`<div style="text-align:center;color:#f87171;font-weight:700;margin-bottom:8px;">이미 저주에 걸려 있습니다</div>`:'');
  c.appendChild(wrap);
  const btn=document.createElement('button'); btn.className='bybtn'; btn.style.cssText='width:100%;padding:10px;';
  btn.disabled = active || coins<DEVIL_PRICE;
  btn.textContent=`🪙 ${DEVIL_PRICE.toLocaleString()} 내고 거래하기`;
  btn.onclick=()=>devilDeal();
  c.appendChild(btn);
}
function renderAngelShop(c){
  const wrap=document.createElement('div');
  wrap.innerHTML=`<div style="font-size:12px;color:#fef3c7;line-height:1.7;text-align:center;margin-bottom:12px;">👼 "코인과 에너지를 모두 소비하여 천국에 가시겠습니까?"</div>`;
  c.appendChild(wrap);
  const btn=document.createElement('button'); btn.className='bybtn'; btn.style.cssText='width:100%;padding:10px;';
  btn.textContent='천국으로';
  btn.onclick=()=>angelDeal();
  c.appendChild(btn);
  const skip=document.createElement('button'); skip.className='bybtn'; skip.style.cssText='width:100%;padding:8px;margin-top:6px;background:#374151;';
  skip.textContent='거절한다';
  skip.onclick=()=>closeMerchantShop();
  c.appendChild(skip);
}

// ════════════════════════════════════════════
// ══ 인벤토리 화면 ══
// ════════════════════════════════════════════
let curMerchInvTab='fruit';
function setMerchInvTab(tab,btn){
  curMerchInvTab=tab;
  document.querySelectorAll('#sMerchantInv .stab').forEach(b=>b.classList.remove('on'));
  if(btn)btn.classList.add('on');
  renderMerchantInv();
}
function useMerchInvItem(it){
  if(it.kind==='trash'){ useTrash(it.id); return; }
  if(it.kind==='paper'){ usePaper(it.id); return; }
  if(it.isSpoon){ useRichSpoon(); return; }
  consumeBuffItem(it.kind, it.id);
}
function renderMerchantInv(){
  const grid=document.getElementById('merchInvGrid'); if(!grid)return;
  grid.innerHTML='';
  let items=[];
  if(curMerchInvTab==='fruit') items=FRUITS.map(f=>({...f,kind:'fruit',useLabel:'섭취'}));
  else if(curMerchInvTab==='potion') items=[...RICH_POTIONS.map(p=>({...p,kind:'potion',useLabel:'마시기'})), {...RICH_SPOON,kind:'potion',useLabel:'사용',isSpoon:true}];
  else if(curMerchInvTab==='junk') items=[...KEVIN_TRASH.map(t=>({...t,kind:'trash',useLabel:'사용'})),...KEVIN_PAPER.map(p=>({...p,kind:'paper',useLabel:'사용'}))];
  else if(curMerchInvTab==='snack') items=SNACKS.map(s=>({...s,kind:'snack',useLabel:'먹기'}));
  const owned=items.filter(it=>(merchInv[it.kind]&&merchInv[it.kind][it.id])>0);
  if(!owned.length){
    grid.innerHTML='<div style="color:#6b7280;font-size:12px;padding:24px;text-align:center;grid-column:1/-1;">보유한 아이템이 없습니다. 로비에 상인이 나타나면 구매해보세요!</div>';
    return;
  }
  owned.forEach(it=>{
    const cnt=merchInv[it.kind][it.id];
    const d=document.createElement('div'); d.className='si own';
    d.innerHTML=`<div class="sico">${it.icon}</div><div class="snm">${it.name}</div>`+
      `<div style="font-size:9px;color:#6b7280;margin-top:3px;">${it.desc}</div>`+
      `<div style="font-size:9px;color:#4ade80;margin-top:2px;">보유 ${cnt}개</div>`;
    const btn=document.createElement('button'); btn.className='bybtn'; btn.textContent=it.useLabel;
    btn.onclick=()=>useMerchInvItem(it);
    d.appendChild(btn);
    grid.appendChild(d);
  });
}

// ── 코인/에너지 배율 주기적 재계산 ──
setInterval(recalcMerchEconMults, 5000);
recalcMerchEconMults();
renderMerchantNpc();
renderKevinBeg();
