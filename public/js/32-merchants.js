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

// ── 세바스찬: 나포(도박이 아니라 강제 계약) ──
const SEBASTIAN_RELEASE_PRICE=990000;
const SEBASTIAN_TASK_KILLS=100;
const SEBASTIAN_CREW_MS=5*60000;

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

// ── 상인별 로비 탈것: kind는 이동 방식(ship=배, cart=바퀴달린 수레, float=공중부유) ──
const MERCHANT_KIND={sebastian:'ship', angelina:'cart', potato:'cart', kevin:'cart', eggbread:'cart', starfairy:'float', devil:'float', angel:'float'};
const MERCHANT_VEHICLE_SVG={
  sebastian:`<svg viewBox="0 0 160 110" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 78 Q80 102 152 78 L138 94 Q80 112 22 94 Z" fill="#5c3a21" stroke="#2b1a0e" stroke-width="2"/>
    <path d="M20 82 L140 82" stroke="#3b2414" stroke-width="2" opacity=".6"/>
    <rect x="77" y="14" width="4" height="66" fill="#3b2414"/>
    <path d="M79 18 L79 62 L38 55 Z" fill="#efe9dc" stroke="#2b1a0e" stroke-width="1.5"/>
    <path d="M81 20 L81 66 L122 58 Z" fill="#ded6c2" stroke="#2b1a0e" stroke-width="1.5"/>
    <path class="merch-ship-flag" d="M81 6 Q95 9 92 20 L81 18 Z" fill="#111"/>
    <text x="79.5" y="17" font-size="13" text-anchor="middle">☠️</text>
  </svg>`,
  angelina:`<svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="34" cy="82" r="12" fill="#3b2414"/><circle cx="34" cy="82" r="5" fill="#78716c"/>
    <circle cx="96" cy="82" r="12" fill="#3b2414"/><circle cx="96" cy="82" r="5" fill="#78716c"/>
    <rect x="18" y="40" width="94" height="34" rx="4" fill="#8a5a2e" stroke="#3b2414" stroke-width="2"/>
    <path d="M18 40 Q65 14 112 40 Z" fill="#166534" stroke="#14532d" stroke-width="1.5"/>
    <text x="26" y="34" font-size="20">🍎</text><text x="56" y="26" font-size="20">🍊</text><text x="84" y="32" font-size="20">🍇</text>
  </svg>`,
  potato:`<svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="34" cy="82" r="12" fill="#78350f"/><circle cx="34" cy="82" r="5" fill="#fde68a"/>
    <circle cx="96" cy="82" r="12" fill="#78350f"/><circle cx="96" cy="82" r="5" fill="#fde68a"/>
    <rect x="16" y="40" width="98" height="34" rx="6" fill="#a16207" stroke="#78350f" stroke-width="2"/>
    <path d="M16 40 Q65 10 114 40 Z" fill="#7c2d12" stroke="#450a0a" stroke-width="1.5"/>
    <text x="50" y="34" font-size="22">💰</text><text x="24" y="30" font-size="18">🥔</text><text x="88" y="28" font-size="18">👑</text>
  </svg>`,
  kevin:`<svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="65" cy="86" r="11" fill="#292524"/><circle cx="65" cy="86" r="4" fill="#78716c"/>
    <path d="M20 46 L110 46 L96 76 L34 76 Z" fill="#57534e" stroke="#1c1917" stroke-width="2"/>
    <text x="30" y="42" font-size="18">🗑️</text><text x="58" y="38" font-size="18">📦</text><text x="86" y="42" font-size="18">🥫</text>
  </svg>`,
  eggbread:`<svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="34" cy="82" r="11" fill="#292524"/><circle cx="34" cy="82" r="4" fill="#a8a29e"/>
    <circle cx="96" cy="82" r="11" fill="#292524"/><circle cx="96" cy="82" r="4" fill="#a8a29e"/>
    <rect x="18" y="46" width="94" height="30" rx="3" fill="#7c2d12" stroke="#450a0a" stroke-width="2"/>
    <path d="M14 46 L118 46 L112 32 L20 32 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="1.5"/>
    <text x="38" y="42" font-size="18">🥯</text><text x="72" y="42" font-size="18">🍢</text>
  </svg>`,
  starfairy:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="30" fill="#c4b5fd" opacity=".25"/>
    <circle cx="50" cy="50" r="18" fill="#e9d5ff" opacity=".35"/>
    <text x="50" y="58" font-size="34" text-anchor="middle">🧚</text>
    <text x="18" y="82" font-size="14">✨</text><text x="80" y="28" font-size="14">✨</text>
  </svg>`,
  devil:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="55" r="26" fill="#f97316" opacity=".22"/>
    <path d="M50 20 Q65 40 55 55 Q70 55 62 75 Q50 90 38 75 Q30 55 45 55 Q35 40 50 20Z" fill="#ea580c" opacity=".55"/>
    <text x="50" y="60" font-size="32" text-anchor="middle">😈</text>
  </svg>`,
  angel:`<svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="40" cy="60" rx="26" ry="16" fill="#ffffff"/>
    <ellipse cx="70" cy="55" rx="30" ry="20" fill="#ffffff"/>
    <ellipse cx="95" cy="62" rx="22" ry="14" fill="#ffffff"/>
    <text x="65" y="52" font-size="30" text-anchor="middle">👼</text>
  </svg>`,
};

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
    const msg = m.id==='sebastian'
      ? '🏴‍☠️ 해적선이 앞바다에 나타났습니다... 곧 나포당할 것이다!'
      : m.icon+' '+m.name+'가(이) 로비에 나타났습니다!';
    showMerchantToast(msg);
    if(m.id==='sebastian') scheduleSebastianAutoCapture();
  }
  renderMerchantNpc();
}
setInterval(spawnCheckTick, 60000);
// 해적선은 클릭하지 않아도 잠시 후 자동으로 나포된다 (좋은 선택지가 없으므로 회피 불가)
function scheduleSebastianAutoCapture(){
  setTimeout(()=>{
    if(merchState.id!=='sebastian'||merchState.until<=Date.now())return;
    const lobbyEl=document.getElementById('sLobby');
    if(!lobbyEl||!lobbyEl.classList.contains('on'))return;
    if(sebastianCrewActive())return;
    const ov=document.getElementById('merchContractOv');
    if(ov&&ov.classList.contains('on'))return;
    openSebastianCapture();
  }, 2500);
}

// 공중에 떠서 등장하는 상인(천사/악마/별의 요정)은 바닥 연출 대신 로비 전체 배경 연출을 받는다
const LOBBY_AMBIENT_IDS=new Set(['angel','devil','starfairy']);
let _shootingStarItv=null;
function renderLobbyAmbient(themeId){
  const el=document.getElementById('merchLobbyAmbientFx'); if(!el)return;
  stopShootingStars();
  el.className='on theme-'+themeId;
  if(themeId==='angel'){
    el.innerHTML='<div class="mla-stairs"></div>'+
      Array.from({length:5}).map((_,i)=>`<div class="mla-cloud c${i}"></div>`).join('');
  } else if(themeId==='devil'){
    el.innerHTML=Array.from({length:16}).map(()=>{
      const left=(Math.random()*96).toFixed(1);
      const dur=(5+Math.random()*4).toFixed(2), delay=(-Math.random()*8).toFixed(2);
      const drift=(Math.random()*40-20).toFixed(0);
      return `<span class="mla-ember" style="left:${left}%;animation-duration:${dur}s;animation-delay:${delay}s;--drift:${drift}px;"></span>`;
    }).join('');
  } else if(themeId==='starfairy'){
    el.innerHTML=Array.from({length:50}).map(()=>{
      const left=(Math.random()*100).toFixed(1), top=(Math.random()*90).toFixed(1);
      const dur=(1.5+Math.random()*2.5).toFixed(2), delay=(-Math.random()*3).toFixed(2);
      return `<span class="mla-star" style="left:${left}%;top:${top}%;animation-duration:${dur}s;animation-delay:${delay}s;"></span>`;
    }).join('');
    startShootingStars();
  }
  setTimeout(()=>el.classList.add('show'),20);
}
function clearLobbyAmbient(){
  const el=document.getElementById('merchLobbyAmbientFx'); if(!el)return;
  el.className=''; el.innerHTML='';
  stopShootingStars();
}
function startShootingStars(){
  stopShootingStars();
  _shootingStarItv=setInterval(()=>{
    const el=document.getElementById('merchLobbyAmbientFx');
    if(!el||!el.classList.contains('theme-starfairy'))return;
    const s=document.createElement('span'); s.className='mla-shooting-star';
    s.style.top=(5+Math.random()*40)+'%';
    s.style.left=(Math.random()*55)+'%';
    el.appendChild(s);
    setTimeout(()=>s.remove(),1300);
  }, 2600+Math.random()*1800);
}
function stopShootingStars(){ if(_shootingStarItv){clearInterval(_shootingStarItv);_shootingStarItv=null;} }

function renderMerchantNpc(){
  const el=document.getElementById('merchantNpc'); if(!el) return;
  const floorEl=document.getElementById('merchFloorFx');
  const vehicleEl=document.getElementById('merchVehicleNpc');
  const lobbyEl=document.getElementById('sLobby');
  const lobbyOn = lobbyEl && lobbyEl.classList.contains('on');
  const active = merchState.id && merchState.until>Date.now();
  const clearThemeVisuals=()=>{
    if(floorEl)floorEl.className='';
    if(vehicleEl){vehicleEl.className=''; vehicleEl.innerHTML='';}
    clearLobbyAmbient();
  };
  if(!active || !lobbyOn){
    el.style.display='none';
    clearThemeVisuals();
    if(_merchMoveItv){clearInterval(_merchMoveItv);_merchMoveItv=null;}
    return;
  }
  const m=MERCHANTS.find(x=>x.id===merchState.id);
  if(!m){ el.style.display='none'; clearThemeVisuals(); return; }
  const kind=MERCHANT_KIND[m.id];
  if(kind && MERCHANT_VEHICLE_SVG[m.id]){
    // 테마가 정의된 상인: 비눗방울 대신 바닥 연출 + 배회하는 탈것/영체로 부드럽게 등장(페이드 인)
    el.style.display='none';
    if(_merchMoveItv){clearInterval(_merchMoveItv);_merchMoveItv=null;}
    if(LOBBY_AMBIENT_IDS.has(m.id)){
      if(floorEl)floorEl.className='';
      renderLobbyAmbient(m.id);
    } else {
      clearLobbyAmbient();
      if(floorEl)floorEl.className='on theme-'+m.id;
      setTimeout(()=>{ if(floorEl)floorEl.classList.add('show'); },20);
    }
    if(vehicleEl){
      vehicleEl.className='on kind-'+kind+' theme-'+m.id;
      vehicleEl.innerHTML=MERCHANT_VEHICLE_SVG[m.id];
      if(m.id==='sebastian'){
        vehicleEl.title=m.name+' - 클릭하면 즉시 나포된다';
        vehicleEl.onclick=()=>openSebastianCapture();
      } else {
        vehicleEl.title=m.name+' - 클릭해서 상점 열기';
        vehicleEl.onclick=()=>openMerchantShop(m.id);
      }
    }
    setTimeout(()=>{ if(vehicleEl)vehicleEl.classList.add('show'); },20);
    return;
  }
  clearThemeVisuals();
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
// 히든급 연출: 풀스크린 플래시+광선+파티클+텍스트 컷신 (부자의 숟가락/천사 강림 등)
function playMerchCutscene({theme, lines, particleEmoji='✨', duration=2600}){
  const el=document.getElementById('merchCutsceneFx'); if(!el)return;
  el.className='on theme-'+theme;
  const particles=Array.from({length:18}).map((_,i)=>`<span style="--i:${i}">${particleEmoji}</span>`).join('');
  const textLines=lines.map((l,i)=>`<div class="mcut-line" style="animation-delay:${0.5+i*0.35}s">${l}</div>`).join('');
  el.innerHTML=`<div class="mcut-flash"></div><div class="mcut-rays"></div>`+
    `<div class="mcut-particles">${particles}</div>`+
    `<div class="mcut-text">${textLines}</div>`;
  const lobbyEl=document.getElementById('sLobby');
  if(lobbyEl){ lobbyEl.classList.remove('sd-chaos-shake'); void lobbyEl.offsetWidth; lobbyEl.classList.add('sd-chaos-shake'); }
  clearTimeout(el._hideT);
  el._hideT=setTimeout(()=>{ el.className=''; el.innerHTML=''; }, duration);
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
  if(id==='sebastian') scheduleSebastianAutoCapture();
};

// 개발자용 상인 소환 버튼/모달 (업적 화면의 DEV 버튼에서 진입)
function openDevMerchantSummon(){
  const modal=document.getElementById('devMerchSummonModal'); if(!modal)return;
  const list=document.getElementById('devMerchSummonList'); if(!list)return;
  list.innerHTML='';
  MERCHANTS.forEach(m=>{
    const isCur = merchState.id===m.id && merchState.until>Date.now();
    const row=document.createElement('div');
    row.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:8px;background:#1e1033;border-radius:8px;padding:8px 10px;';
    row.innerHTML=`<div style="font-size:13px;font-weight:700;color:${isCur?'#4ade80':'#e5e7eb'};">${m.icon} ${m.name}${m.title?' ('+m.title+')':''}${isCur?' · 현재 등장중':''}</div>`;
    const btn=document.createElement('button');
    btn.textContent='소환';
    btn.style.cssText='flex-shrink:0;padding:5px 12px;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;background:linear-gradient(135deg,#c2410c,#f97316);color:#fff;';
    btn.onclick=()=>{ devSpawnMerchant(m.id); closeDevMerchantSummon(); go('sLobby'); };
    row.appendChild(btn);
    list.appendChild(row);
  });
  modal.style.display='flex';
}
function closeDevMerchantSummon(){
  const modal=document.getElementById('devMerchSummonModal'); if(modal)modal.style.display='none';
}

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
  const el=document.getElementById('merchDebuffOverlay');
  const badge=document.getElementById('merchDebuffBadge');
  const active=merchDebuffActive();
  if(el)el.style.display=active?'block':'none';
  if(badge){
    badge.style.display=active?'flex':'none';
    if(active){
      const remainMin=Math.max(0,Math.ceil((merchDebuff.until-Date.now())/60000));
      badge.textContent=`😈 저주 중 (${remainMin}분)`;
    }
  }
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
  playMerchCutscene({
    theme:'gold',
    particleEmoji:'💰',
    lines:['🥄 사치의 극치!','황금빛이 온 세상을 뒤덮는다...','🎩 부자가 남긴 모자를 손에 넣었다'],
    duration:3000,
  });
  setTimeout(()=>{
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
  }, 900);
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

function fmtShort(n){
  if(n>=1000000) return (n/1000000)+'M';
  if(n>=1000) return (n/1000)+'K';
  return String(n);
}

// ════════════════════════════════════════════
// ══ 세바스찬: 나포 계약서 (도박 아님, 클릭 없이도 잡혀감) ══
// ════════════════════════════════════════════
let sebastianCrew = lJ('hd_sebastian_crew', {active:false, until:0, startKills:0, target:SEBASTIAN_TASK_KILLS});
function saveSebastianCrew(){ sv('hd_sebastian_crew', sebastianCrew); }
function sebastianCrewActive(){ return !!(sebastianCrew.active && sebastianCrew.until>Date.now()); }
function sebastianCrewProgress(){ return Math.min(sebastianCrew.target, Math.max(0,(achStats.kills||0)-sebastianCrew.startKills)); }
function sebastianCrewTaskDone(){ return sebastianCrewProgress()>=sebastianCrew.target; }

function openSebastianCapture(){
  merchState={id:null,until:0}; saveMerchState(); renderMerchantNpc();
  openMerchContract({
    theme:'sebastian',
    title:'🏴‍☠️ 세바스찬의 최후통첩',
    bodyHtml:'크크큭... 오랜만이군, 육지 친구.<br>'+
      '이 몸 세바스찬의 배에 오른 이상, 그냥 보내줄 순 없지.<br><br>'+
      '선택은 두 가지뿐이다.<br><br>'+
      '<b>① 해적단의 일원</b>이 되어 <b>5분간</b> 내 밑에서 구르는 것.<br>'+
      '그동안은 이 갑판을 벗어날 생각은 하지 마라 — 로비로 돌아갈 방법 따윈 없을 테니.<br>'+
      `대신 내가 시키는 대로 좀비 <b>${SEBASTIAN_TASK_KILLS}마리</b>를 완벽하게 처치해낸다면, 그 즉시 풀어주도록 하지.<br><br>`+
      `<b>② 겁쟁이답게 코인 ${SEBASTIAN_RELEASE_PRICE.toLocaleString()}</b>을 내놓고 조용히 사라지는 것.<br><br>`+
      '어느 쪽이든 이 몸에게 손해는 없다. 자, 선택해라.',
    sealIcon:'⚓',
    signLabel:'① 해적단에 합류한다',
    signDisabled:false,
    onConfirm:()=>joinPirateCrew(),
  });
  const ov=document.getElementById('merchContractOv');
  const cancelBtn=ov?ov.querySelector('.mc-cancel-btn'):null;
  if(cancelBtn){
    const canPay=coins>=SEBASTIAN_RELEASE_PRICE;
    cancelBtn.classList.add('choice2-btn');
    cancelBtn.textContent=canPay?`② 🪙 ${SEBASTIAN_RELEASE_PRICE.toLocaleString()} 내고 풀려난다`:'② 코인이 부족해 풀려날 수 없다';
    cancelBtn.disabled=!canPay;
    cancelBtn.onclick=()=>{ if(!canPay)return; closeMerchContract(); payToBeReleased(); };
  }
}
function payToBeReleased(){
  if(coins<SEBASTIAN_RELEASE_PRICE)return;
  coins-=SEBASTIAN_RELEASE_PRICE; sv('hd_c',coins); updRes();
  showMerchantToast('🏴‍☠️ "다시는 걸리지 마라." 코인을 빼앗기고 풀려났습니다...');
}
function joinPirateCrew(){
  sebastianCrew={active:true, until:Date.now()+SEBASTIAN_CREW_MS, startKills:achStats.kills||0, target:SEBASTIAN_TASK_KILLS};
  saveSebastianCrew();
  showMerchantToast(`🏴‍☠️ 해적단에 합류했다... 대장이 좀비 ${SEBASTIAN_TASK_KILLS}마리를 처치하라 명령한다!`);
  renderSebastianCrewBadge();
}
setInterval(()=>{
  if(!sebastianCrew.active)return;
  if(sebastianCrewTaskDone()){
    sebastianCrew.active=false; saveSebastianCrew();
    coins+=50000; sv('hd_c',coins); updRes();
    showMerchantToast('🏴‍☠️ "완벽하군!" 임무를 완수하고 즉시 풀려났습니다! 🪙+50,000');
    renderSebastianCrewBadge();
  } else if(!sebastianCrewActive()){
    sebastianCrew.active=false; saveSebastianCrew();
    showMerchantToast('🏴‍☠️ 5분이 지나 자유의 몸이 되었습니다.');
    renderSebastianCrewBadge();
  } else {
    renderSebastianCrewBadge();
  }
},1000);
function renderSebastianCrewBadge(){
  const el=document.getElementById('sebastianCrewBadge'); if(!el)return;
  if(!sebastianCrewActive()){ el.style.display='none'; return; }
  el.style.display='flex';
  const remainSec=Math.max(0,Math.ceil((sebastianCrew.until-Date.now())/1000));
  const mm=String(Math.floor(remainSec/60)).padStart(2,'0'), ss=String(remainSec%60).padStart(2,'0');
  el.textContent=`⚓ 해적단 복무 중 · 좀비 ${sebastianCrewProgress()}/${sebastianCrew.target} · ${mm}:${ss}`;
}
// 해적단 복무 중에는 임무를 마치기 전까지 로비로 돌아갈 수 없다
(function(){
  const _origGo=go;
  window.go=function(id){
    if(id==='sLobby'&&sebastianCrewActive()&&!sebastianCrewTaskDone()){
      showMerchantToast('⚓ "아직 대장이 놔주지 않는다... 임무나 마쳐라!"');
      return;
    }
    return _origGo(id);
  };
})();

function devilDeal(){
  // 악마는 돈을 받고 저주를 파는 게 아니라, 돈을 주는 대신 저주를 거는 쪽이다
  if(merchDebuffActive())return;
  coins+=DEVIL_PRICE; sv('hd_c',coins); updRes();
  merchDebuff={until:Date.now()+24*60*60*1000}; saveMerchDebuff();
  merchState={id:null,until:0}; saveMerchState(); renderMerchantNpc();
  showMerchantToast('😈 거래가 성립되었습니다... 코인을 받는 대신 24시간 동안 힘이 약해집니다');
  closeMerchantShop();
}
function angelDeal(){
  coins+=1000000; sv('hd_c',coins); updRes();
  achStats.egg_angelfaith=1; saveAch(); checkAchievements();
  merchState={id:null,until:0}; saveMerchState(); renderMerchantNpc();
  closeMerchantShop();
  playMerchCutscene({
    theme:'holy',
    particleEmoji:'🕊️',
    lines:['☀️ 눈부신 빛이 온 세상을 뒤덮는다...','"당신은 믿음의 사람이군요"','천사가 미소지으며 사라졌습니다'],
    duration:3000,
  });
  setTimeout(()=>showMerchantToast('👼 코인 +1,000,000 획득'), 900);
}

// ════════════════════════════════════════════
// ══ 상점 오버레이 렌더링 ══
// ════════════════════════════════════════════
let _curMerchantShopId=null;
function openMerchantShop(id){
  if(id==='sebastian'){ openSebastianCapture(); return; }
  const m=MERCHANTS.find(x=>x.id===id); if(!m)return;
  _curMerchantShopId=id;
  const t=document.getElementById('merchantShopTitle');
  if(t)t.textContent = m.icon+' '+m.name+(m.title?' ('+m.title+')':'');
  renderMerchantShopContent();
  const ov=document.getElementById('merchantShopOv');
  const panel=document.getElementById('merchantShopPanel');
  if(ov){ ov.className=(ov.className.replace(/\btheme-\S+/g,'').trim()+' theme-'+id).trim(); ov.style.display='flex'; }
  if(panel)panel.className='merchant-shop-panel theme-'+id;
}
function closeMerchantShop(){
  const ov=document.getElementById('merchantShopOv');
  if(ov)ov.style.display='none';
}
function themedShopHeader(container, bannerText, dialogueText){
  if(bannerText){
    const b=document.createElement('div'); b.className='merch-banner'; b.textContent=bannerText;
    container.appendChild(b);
  }
  if(dialogueText){
    const d=document.createElement('div'); d.className='merch-dialogue'; d.textContent=dialogueText;
    container.appendChild(d);
  }
}
function renderMerchantShopContent(){
  const id=_curMerchantShopId;
  const c=document.getElementById('merchantShopContent'); if(!c)return;
  const coinDisp=document.getElementById('merchShopCoinDisp'); if(coinDisp)coinDisp.textContent=coins.toLocaleString();
  c.innerHTML='';
  if(id==='angelina') renderFruitMarket(c);
  else if(id==='eggbread'){
    themedShopHeader(c, '🌙 야시장의 불빛과 고소한 냄새가 감돈다', null);
    renderPotScene(c, SNACKS.map(s=>({...s,kind:'snack'})),
      '"뜨끈할 때 드셔야 제맛이지! 꼬치를 뽑으면 바로 계산해줄게, 냠!"');
  }
  else if(id==='potato') renderPotatoShop(c);
  else if(id==='kevin') renderKevinShop(c);
  else if(id==='starfairy') renderStarFairyShop(c);
  else if(id==='devil') renderDevilShop(c);
  else if(id==='angel') renderAngelShop(c);
}
// 아이템의 보유 수량/여부를 종류에 상관없이 통일된 방식으로 조회
function getItemOwned(it){
  if(it.kind==='star') return (typeof ownedStars!=='undefined'&&ownedStars[it.id])?1:0;
  if(it.kind==='spoon') return (merchInv.potion&&merchInv.potion['rich_spoon'])||0;
  return (merchInv[it.kind]&&merchInv[it.kind][it.id])||0;
}
// 아이템 종류별 실제 구매 함수로 라우팅
function buyNormItem(kind,id){
  if(kind==='fruit'||kind==='snack'||kind==='potion') buyBuffItem(kind,id);
  else if(kind==='trash'||kind==='paper') buyKevinItem(kind,id);
  else if(kind==='star') buyFairyStar(id);
  else if(kind==='spoon') buyRichSpoon();
}
// 진열대에서 아이템을 클릭했을 때 대사창에 가격/효과를 띄우고 구매 버튼 표시 (별의 요정 전용으로 계속 사용)
function showSceneItemDetail(it, dialogueId){
  const dlg=document.getElementById(dialogueId||'merchSceneDialogue'); if(!it||!dlg)return;
  const owned=getItemOwned(it);
  const already = it.kind==='star' && owned>0;
  const cb=coins>=it.price && !already;
  dlg.innerHTML=`<div class="merch-scene-detail">`+
    `<div style="font-weight:900;margin-bottom:4px;">${it.icon} ${it.name}</div>`+
    `<div>${it.desc}</div>`+
    `<div style="margin-top:8px;">`+
    (already
      ? `<span style="color:#4ade80;font-weight:800;">이미 보유 중인 별입니다</span>`
      : `<span class="msd-price" style="color:${cb?'#4ade80':'#f87171'}">🪙 ${it.price.toLocaleString()}</span>`+
        `<button class="bybtn" ${cb?'':'disabled'} onclick="buyNormItem('${it.kind}','${it.id}')">구매</button>`)+
    `</div></div>`;
}

// ══ 계약서(두루마리+인장) 공용 컴포넌트: MR 감자씨/악마/천사가 사용 ══
function openMerchContract({theme, title, bodyHtml, sealIcon, signLabel, signDisabled, onConfirm}){
  const ov=document.getElementById('merchContractOv'); if(!ov)return;
  const scroll=ov.querySelector('.merch-contract-scroll');
  scroll.className='merch-contract-scroll theme-'+theme;
  document.getElementById('merchContractTitle').textContent=title;
  document.getElementById('merchContractBody').innerHTML=bodyHtml;
  document.getElementById('merchContractSeal').textContent=sealIcon;
  const signBtn=document.getElementById('merchContractSignBtn');
  signBtn.textContent=signLabel;
  signBtn.disabled=!!signDisabled;
  signBtn.onclick=()=>{
    if(signBtn.disabled)return;
    const seal=document.getElementById('merchContractSeal');
    seal.classList.remove('stamp'); void seal.offsetWidth; seal.classList.add('stamp');
    signBtn.disabled=true;
    setTimeout(()=>{ closeMerchContract(); if(onConfirm)onConfirm(); }, 620);
  };
  ov.classList.add('on');
}
function closeMerchContract(){
  const ov=document.getElementById('merchContractOv'); if(ov)ov.classList.remove('on');
}

// ══ 안젤리나: 장바구니(카트)에 여러 개 담아서 한번에 결제 ══
let _fruitBasket={};
function renderFruitMarket(c){
  themedShopHeader(c, '🌿 향긋한 과일 냄새가 코를 찌른다', null);
  _fruitBasket={};
  const items=FRUITS.map(f=>({...f,kind:'fruit'}));
  const market=document.createElement('div'); market.className='merch-market mk-fruit';
  const itemsWrap=document.createElement('div'); itemsWrap.className='mm-items';
  items.forEach(it=>{
    const owned=getItemOwned(it);
    const btn=document.createElement('button'); btn.className='mm-item';
    btn.innerHTML=it.icon+`<span class="mm-tag">🪙${fmtShort(it.price)}</span>`+(owned?`<span class="mm-item-badge">${owned}</span>`:'');
    btn.onclick=()=>{
      _fruitBasket[it.id]=(_fruitBasket[it.id]||0)+1;
      btn.classList.add('in-basket');
      let qtyEl=btn.querySelector('.mm-item-qty');
      if(!qtyEl){ qtyEl=document.createElement('span'); qtyEl.className='mm-item-qty'; btn.appendChild(qtyEl); }
      qtyEl.textContent=_fruitBasket[it.id];
      btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop');
      updateFruitBasketBar();
    };
    itemsWrap.appendChild(btn);
  });
  market.appendChild(itemsWrap);
  c.appendChild(market);
  const dlg=document.createElement('div'); dlg.className='merch-dialogue'; dlg.id='merchSceneDialogue';
  dlg.innerHTML='"싱싱한 과일 있어요~! 원하는 만큼 담아서 한번에 계산해드릴게요."';
  c.appendChild(dlg);
  const bar=document.createElement('div'); bar.className='mm-basket-bar'; bar.id='fruitBasketBar';
  c.appendChild(bar);
  updateFruitBasketBar();
}
function fruitBasketTotal(){
  return Object.entries(_fruitBasket).reduce((sum,[id,qty])=>{
    const it=FRUITS.find(f=>f.id===id);
    return sum+(it?it.price*qty:0);
  },0);
}
function updateFruitBasketBar(){
  const bar=document.getElementById('fruitBasketBar'); if(!bar)return;
  const count=Object.values(_fruitBasket).reduce((a,b)=>a+b,0);
  const total=fruitBasketTotal();
  const cb=count>0 && coins>=total;
  bar.innerHTML=`<div class="mm-basket-info"><span class="mm-basket-icon">🧺</span>담은 개수 ${count}개 · 합계 🪙${total.toLocaleString()}</div>`+
    `<button class="mm-basket-checkout" ${cb?'':'disabled'} onclick="checkoutFruitBasket(this)">담은 과일 결제</button>`;
}
function checkoutFruitBasket(btn){
  const total=fruitBasketTotal();
  if(coins<total||total<=0)return;
  coins-=total; sv('hd_c',coins); updRes();
  Object.entries(_fruitBasket).forEach(([id,qty])=>{
    if(!merchInv.fruit)merchInv.fruit={};
    merchInv.fruit[id]=(merchInv.fruit[id]||0)+qty;
  });
  saveMerchInv();
  showMerchantToast('🧺 장바구니 결제 완료! 🪙'+total.toLocaleString());
  _fruitBasket={};
  if(btn){ btn.classList.add('done'); }
  setTimeout(()=>renderMerchantShopContent(), 350);
}

// ══ 계란빵 아저씨: 꼬치를 뽑으면 즉석에서 바로 결제(원클릭 즉시구매) ══
function renderPotScene(container, items, greeting){
  const market=document.createElement('div'); market.className='merch-market mk-pot';
  market.innerHTML='<div class="mm-pot-body"><div class="mm-broth"></div>'+
    '<div class="mm-steam s1"></div><div class="mm-steam s2"></div><div class="mm-steam s3"></div><div class="mm-steam s4"></div>'+
    '<div class="mm-items-arc"></div></div>';
  container.appendChild(market);
  const arc=market.querySelector('.mm-items-arc');
  const n=items.length;
  items.forEach((it,i)=>{
    const t=n>1?i/(n-1):0.5;
    const angle=-68+t*136;
    const rad=angle*Math.PI/180;
    const radius=40, cx=50, cy=50;
    const x=cx+Math.sin(rad)*radius;
    const y=cy-Math.cos(rad)*radius*0.62;
    const owned=getItemOwned(it);
    const btn=document.createElement('button'); btn.className='mm-item';
    btn.style.left=x+'%'; btn.style.top=y+'%'; btn.style.transform=`translate(-50%,-50%) rotate(${(angle*0.35).toFixed(1)}deg)`;
    btn.innerHTML='<span class="mm-skewer"></span><span class="mm-food">'+it.icon+'</span>'+
      `<span class="mm-tag">🪙${fmtShort(it.price)}</span>`+(owned?`<span class="mm-item-badge">${owned}</span>`:'');
    btn.onclick=()=>{
      btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop');
      buyPotItemInstant(it, btn);
    };
    arc.appendChild(btn);
  });
  const dlg=document.createElement('div'); dlg.className='merch-dialogue'; dlg.id='merchSceneDialogue';
  dlg.innerHTML=greeting;
  container.appendChild(dlg);
}
function buyPotItemInstant(it, btn){
  const dlg=document.getElementById('merchSceneDialogue');
  if(coins<it.price){
    if(dlg)dlg.innerHTML=`<div class="merch-scene-detail" style="color:#fca5a5;">🪙 코인이 부족해요! (${it.icon} ${it.name} · 🪙${it.price.toLocaleString()})</div>`;
    return;
  }
  coins-=it.price; sv('hd_c',coins); updRes();
  if(!merchInv[it.kind])merchInv[it.kind]={};
  merchInv[it.kind][it.id]=(merchInv[it.kind][it.id]||0)+1; saveMerchInv();
  btn.classList.add('bought-flash');
  const toast=document.createElement('div'); toast.className='mm-bite-toast'; toast.textContent='냠! 구매완료';
  btn.appendChild(toast);
  showMerchantToast(it.icon+' '+it.name+' 즉석 구매!');
  setTimeout(()=>renderMerchantShopContent(), 550);
}

// ══ MR 감자씨: 계약서 두루마리에 인장을 찍어야 성사되는 거래 ══
function renderPotatoShop(c){
  themedShopHeader(c, '💰 화려한 응접실, 황금빛 샹들리에가 번쩍인다', null);
  const items=[...RICH_POTIONS.map(p=>({...p,kind:'potion'})), {...RICH_SPOON,kind:'spoon'}];
  const market=document.createElement('div'); market.className='merch-market mk-vault';
  const itemsWrap=document.createElement('div'); itemsWrap.className='mm-items';
  items.forEach(it=>{
    const owned=getItemOwned(it);
    const btn=document.createElement('button'); btn.className='mm-item';
    btn.innerHTML=it.icon+`<span class="mm-tag">🪙${fmtShort(it.price)}</span>`+(owned?`<span class="mm-item-badge">${owned}</span>`:'');
    btn.onclick=()=>openPotatoContract(it);
    itemsWrap.appendChild(btn);
  });
  market.appendChild(itemsWrap);
  c.appendChild(market);
  const dlg=document.createElement('div'); dlg.className='merch-dialogue'; dlg.id='merchSceneDialogue';
  dlg.innerHTML='"어서 오게. 원하는 물건을 고르면 정식으로 계약서를 작성해주지."';
  c.appendChild(dlg);
}
function openPotatoContract(it){
  const cb=coins>=it.price;
  openMerchContract({
    theme:'potato', title:'📜 거래 계약서',
    bodyHtml:`<b>${it.icon} ${it.name}</b><br>${it.desc}<br><br>가격: <b style="color:${cb?'#166534':'#b91c1c'}">🪙 ${it.price.toLocaleString()}</b>`,
    sealIcon:'💰', signLabel: cb?'날인하고 구매하기':'코인이 부족합니다', signDisabled: !cb,
    onConfirm:()=>{ buyNormItem(it.kind, it.id); showMerchantToast('📜 계약이 체결되었습니다: '+it.icon+' '+it.name); },
  });
}

// ══ 케빈: 흥정(랜덤 협상) — 성공하면 할인, 실패하면 오히려 비싸짐 ══
function renderKevinShop(c){
  themedShopHeader(c, '🛍️ 낡은 리어카 옆, 케빈이 손짓한다', null);
  const items=[...KEVIN_TRASH.map(t=>({...t,kind:'trash'})), ...KEVIN_PAPER.map(p=>({...p,kind:'paper'}))];
  const market=document.createElement('div'); market.className='merch-market mk-cart';
  const itemsWrap=document.createElement('div'); itemsWrap.className='mm-items';
  items.forEach(it=>{
    const owned=getItemOwned(it);
    const btn=document.createElement('button'); btn.className='mm-item';
    btn.innerHTML=it.icon+`<span class="mm-tag">🪙${fmtShort(it.price)}</span>`+(owned?`<span class="mm-item-badge">${owned}</span>`:'');
    btn.onclick=()=>{
      itemsWrap.querySelectorAll('.mm-item.sel').forEach(b=>b.classList.remove('sel'));
      btn.classList.add('sel');
      btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop');
      _kevinHagglePrice=it.price;
      renderKevinHaggleDialogue(it, false);
    };
    itemsWrap.appendChild(btn);
  });
  market.appendChild(itemsWrap);
  c.appendChild(market);
  const dlg=document.createElement('div'); dlg.className='merch-dialogue'; dlg.id='merchSceneDialogue';
  dlg.innerHTML='"허허... 이거라도 가져가시게. 흥정도 받아준다네, 운이 좋으면 싸게 줄 수도 있어."';
  c.appendChild(dlg);
}
let _kevinHagglePrice=null;
function renderKevinHaggleDialogue(it, haggled){
  const dlg=document.getElementById('merchSceneDialogue'); if(!dlg)return;
  const price=_kevinHagglePrice;
  const cb=coins>=price;
  dlg.innerHTML=`<div class="merch-scene-detail">`+
    `<div style="font-weight:900;margin-bottom:4px;">${it.icon} ${it.name}</div>`+
    `<div>${it.desc}</div>`+
    `<div style="margin-top:8px;"><span class="msd-price" style="color:${cb?'#4ade80':'#f87171'}">🪙 ${price.toLocaleString()}</span>`+
    `<button class="bybtn" ${cb?'':'disabled'} onclick="buyKevinHaggled('${it.kind}','${it.id}')">구매</button></div>`+
    `<div class="mk-haggle-row">`+
    (haggled?'':`<button class="mk-haggle-btn" onclick="doKevinHaggle('${it.kind}','${it.id}')">🗣️ 흥정하기</button>`)+
    `</div></div>`;
}
function findKevinItem(kind,id){
  const items=[...KEVIN_TRASH.map(t=>({...t,kind:'trash'})), ...KEVIN_PAPER.map(p=>({...p,kind:'paper'}))];
  return items.find(x=>x.kind===kind&&x.id===id);
}
function doKevinHaggle(kind,id){
  const it=findKevinItem(kind,id); if(!it)return;
  const r=Math.random();
  let msg, color;
  if(r<0.5){
    const disc=0.1+Math.random()*0.2;
    _kevinHagglePrice=Math.max(1,Math.round(it.price*(1-disc)));
    msg=`"허허, 그럼 특별히 ${Math.round(disc*100)}% 깎아주지."`; color='#4ade80';
  } else if(r<0.8){
    _kevinHagglePrice=it.price;
    msg='"안 돼, 이미 헐값이야."'; color='#e5e7eb';
  } else {
    const inc=0.1+Math.random()*0.15;
    _kevinHagglePrice=Math.round(it.price*(1+inc));
    msg=`"괘씸하군! ${Math.round(inc*100)}% 더 받아야겠어."`; color='#f87171';
  }
  renderKevinHaggleDialogue(it, true);
  const row=document.querySelector('#merchSceneDialogue .mk-haggle-row');
  if(row){ const r2=document.createElement('div'); r2.className='mk-haggle-result'; r2.style.color=color; r2.textContent=msg; row.appendChild(r2); }
}
function buyKevinHaggled(kind,id){
  const it=findKevinItem(kind,id); if(!it)return;
  const price=_kevinHagglePrice!=null?_kevinHagglePrice:it.price;
  if(coins<price)return;
  coins-=price; sv('hd_c',coins); updRes();
  if(!merchInv[kind])merchInv[kind]={};
  merchInv[kind][id]=(merchInv[kind][id]||0)+1; saveMerchInv();
  showMerchantToast(it.icon+' '+it.name+' 흥정 구매 완료! 🪙'+price.toLocaleString());
  _kevinHagglePrice=null;
  renderMerchantShopContent();
}

// ══ 별의 요정: 요정과 별을 잇는 소원의 실을 그은 뒤 소원을 빌며 구매 ══
function renderStarFairyShop(c){
  themedShopHeader(c, '✨ 별빛이 부드럽게 감싸며 반짝인다', null);
  const items=STARFAIRY_SELL.map(def=>{
    const star=(typeof STARS!=='undefined')?STARS.find(s=>s.id===def.starId):null;
    if(!star)return null;
    return {id:def.starId, icon:star.icon, name:star.name, desc:star.desc, price:def.price, kind:'star'};
  }).filter(Boolean);
  const market=document.createElement('div'); market.className='merch-market mk-constellation';
  market.innerHTML='<div class="mm-fairy-icon">🧚</div>';
  const itemsWrap=document.createElement('div'); itemsWrap.className='mm-items';
  items.forEach(it=>{
    const owned=getItemOwned(it);
    const btn=document.createElement('button'); btn.className='mm-item';
    btn.innerHTML=it.icon+`<span class="mm-tag">🪙${fmtShort(it.price)}</span>`+(owned?`<span class="mm-item-badge">✓</span>`:'');
    btn.onclick=()=>{
      itemsWrap.querySelectorAll('.mm-item.sel').forEach(b=>b.classList.remove('sel'));
      btn.classList.add('sel');
      btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop');
      drawWishLine(market, btn);
      showSceneItemDetail(it, 'merchSceneDialogue');
    };
    itemsWrap.appendChild(btn);
  });
  market.appendChild(itemsWrap);
  c.appendChild(market);
  const dlg=document.createElement('div'); dlg.className='merch-dialogue'; dlg.id='merchSceneDialogue';
  dlg.innerHTML='"별을 고르면 저와 이어진 소원의 실이 만들어져요. 소원을 빌며 구매해보세요."';
  c.appendChild(dlg);
}
function drawWishLine(market, btn){
  market.querySelectorAll('.mm-wish-line').forEach(l=>l.remove());
  const fairy=market.querySelector('.mm-fairy-icon'); if(!fairy)return;
  const marketRect=market.getBoundingClientRect();
  const fairyRect=fairy.getBoundingClientRect();
  const btnRect=btn.getBoundingClientRect();
  const x1=fairyRect.left+fairyRect.width/2-marketRect.left;
  const y1=fairyRect.top+fairyRect.height/2-marketRect.top;
  const x2=btnRect.left+btnRect.width/2-marketRect.left;
  const y2=btnRect.top+btnRect.height/2-marketRect.top;
  const dx=x2-x1, dy=y2-y1;
  const len=Math.sqrt(dx*dx+dy*dy);
  const ang=Math.atan2(dy,dx)*180/Math.PI;
  const line=document.createElement('div'); line.className='mm-wish-line';
  line.style.width=len+'px'; line.style.left=x1+'px'; line.style.top=y1+'px';
  line.style.transform=`rotate(${ang}deg)`;
  market.appendChild(line);
}

// ══ 악마: 피의 계약서에 서명해야 성사되는 저주 거래 ══
function renderDevilShop(c){
  const active=merchDebuffActive();
  themedShopHeader(c, '🔥 유황 냄새와 함께 서늘한 기운이 감돈다',
    '"500만 코인을 주지. 대신 24시간 동안 데미지, 방어력, 인챈트 행운을 반토막 내주마. 계약서에 서명할 텐가?"');
  const wrap=document.createElement('div'); wrap.className='merch-seal-wrap';
  const btn=document.createElement('button'); btn.className='merch-seal-btn mk-devilseal';
  btn.disabled=active;
  btn.innerHTML=active?'이미 저주에<br>걸려 있습니다':'😈<br>계약서 펼치기';
  btn.onclick=()=>openDevilContract();
  wrap.appendChild(btn);
  c.appendChild(wrap);
}
function openDevilContract(){
  if(merchDebuffActive())return;
  openMerchContract({
    theme:'devil', title:'🩸 악마와의 계약서',
    bodyHtml:`나, <b>세바스찬의 주인</b>은 그대에게<br><b style="color:#fca5a5;">🪙 ${DEVIL_PRICE.toLocaleString()}</b>을 지불한다.<br><br>`+
      `대신 그대는 24시간 동안<br>데미지·방어력·인챈트 행운이 <b>반토막</b>남을<br>받아들인다.`,
    sealIcon:'😈', signLabel:'피로 서명하기', signDisabled:false,
    onConfirm:()=>devilDeal(),
  });
}
// ══ 천사: 서약서에 서약해야 성사되는 승천 거래 ══
function renderAngelShop(c){
  themedShopHeader(c, '☁️ 포근한 구름 위, 평온함이 감돈다',
    '"코인과 에너지를 모두 소비하여 천국에 가시겠습니까? 서약서를 준비했어요."');
  const wrap=document.createElement('div'); wrap.className='merch-seal-wrap';
  const btn=document.createElement('button'); btn.className='merch-seal-btn mk-angelseal';
  btn.innerHTML='👼<br>서약서 펼치기';
  btn.onclick=()=>openAngelContract();
  wrap.appendChild(btn);
  const skip=document.createElement('button'); skip.className='merch-skip-btn';
  skip.textContent='거절한다';
  skip.onclick=()=>closeMerchantShop();
  wrap.appendChild(skip);
  c.appendChild(wrap);
}
function openAngelContract(){
  openMerchContract({
    theme:'angel', title:'🕊️ 믿음의 서약서',
    bodyHtml:`그대는 가진 코인과 에너지를 모두<br>내려놓고 천국의 문 앞에 선다.<br><br>보상: <b style="color:#b45309;">🪙 1,000,000</b>`,
    sealIcon:'👼', signLabel:'서약하기', signDisabled:false,
    onConfirm:()=>angelDeal(),
  });
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
renderSebastianCrewBadge();
