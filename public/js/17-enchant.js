// ════════════════════════════════════════════
// ══ 인챈트 시스템 ══
// ════════════════════════════════════════════

// enchants: {itemKey: tierIndex}  itemKey = 무기id / 'ar_'+갑옷id / 'job_'+직업id
let enchants = lJ('hd_enchants', {});
function saveEnchants(){ sv('hd_enchants', enchants); }

const ENCHANT_COST = 50000;

// 등급표 (commonest → rarest)
const ENCHANT_TIERS = [
  {chance:70,     name:'화염의 손길'},
  {chance:60,     name:'불의 손길'},
  {chance:50,     name:'나노 파워'},
  {chance:45,     name:'돌연변이'},
  {chance:40,     name:'수퍼(무지개빛)'},
  {chance:35,     name:'무지개'},
  {chance:30,     name:'하늘의 무기'},
  {chance:25,     name:'천상'},
  {chance:23.5,   name:'잉크'},
  {chance:20,     name:'HELL'},
  {chance:15,     name:'THE TURE'},
  {chance:10,     name:'이 무기는 좋아요!~'},
  {chance:8,      name:'IOT'},
  {chance:7,      name:'LOL',        cutscene:180},
  {chance:5,      name:'오이',       cutscene:180},
  {chance:3,      name:'???',        cutscene:180},
  {chance:2,      name:'XXX',        cutscene:180},
  {chance:1,      name:'공간',       cutscene:600},
  {chance:0.2,    name:'차원',       cutscene:1200},
  {chance:0.002,  name:'신',         cutscene:1800},
  {chance:0.0001,                             name:'초월의 신',   cutscene:2400},
  {chance:0.00002,                            name:'창조주',      cutscene:2700},
  {chance:0.0000002,                          name:'태초',        cutscene:3000},
  {chance:0.0000000004,                       name:'무(無)',      cutscene:3600},
  {chance:0.00000000000000001,                name:'관측자의 눈', cutscene:4200},
  {chance:0.000000000000000000000000001,     name:'존재 그 자체',cutscene:5400},
  {chance:0.00000000000000000000000000001,   name:'특이점',      cutscene:5700},
  {chance:0.00000000000000000000000000000000000000001, name:'무한의 문', cutscene:6000},
  {chance:0.000000000000000000000000000000000000000000001, name:'허수의 저편', cutscene:6600},
  {chance:0.00000000000000000000000000000000000000000000000001, name:'제로 포인트', cutscene:7200},
  {chance:0.0000000000000000000000000000000000000000000000000000000001, name:'그 이름을 부를 수 없는 것', cutscene:9000},
];

// ── 신규 100종 인챈트 (0.01% ~ 0.0000000000000001% 사이 로그 스케일 분포) ──
// 각 등급마다 이름/컷씬 스타일/지속시간이 전부 다르게 생성됨
const ENCHANT_STYLE_POOL = ['rays','vortex','lightning','starfield','meteor','portal','supernova','spiral','shatter','aurora','blackhole','kaleidoscope','shockwave','nebula'];
{
  const adj = ['태초의','무한의','절대','영원한','붕괴하는','침묵하는','불타는','얼어붙은','빛나는','어둠의',
    '신성한','저주받은','공허한','찬란한','부서진','흐르는','잠든','깨어난','불멸의','유령의',
    '떨리는','일그러진','메아리치는','타오르는','스러지는','응축된','증폭된','왜곡된','봉인된','해방된',
    '갈라진','뒤틀린','스며드는','넘실대는','솟아오르는','가라앉는','휘몰아치는','머금은','새겨진','흩날리는'];
  const noun = ['눈동자','심연','파편','메아리','그림자','왕관','문','불꽃','서약','기억',
    '꿈','별','달','태양','바람','파도','뿌리','씨앗','고리','문양',
    '숨결','맥박','파동','인장','거울','지평선','우물','깃털','뼈대','유성',
    '나침반','등불','저울','실타래','파문','균열','빙하','폭풍','재','잔영'];
  const total=100;
  // (adj,noun) 조합공간(40x40=1600) 안에서 완전 유일하게 매핑되는 선형합동식으로 뽑아
  // 100개 전부 이름이 절대 겹치지 않게 함 (1600과 서로소인 173을 곱해 전단사 매핑)
  const AN=adj.length, NN=noun.length, COMBO=AN*NN;
  const logMax=Math.log10(0.01), logMin=Math.log10(0.0000000000000001);
  for(let i=0;i<total;i++){
    const logC = logMax + (logMin-logMax)*(i/(total-1));
    const chance = Math.pow(10, logC);
    const c=(i*173+37)%COMBO;
    const a=adj[c%AN], n=noun[Math.floor(c/AN)%NN];
    const name = `${a} ${n}`;
    // 등급이 희귀할수록 컷씬이 길어짐 (3초~90초 사이 선형 보간)
    const cutscene = Math.round(180 + (5400-180)*(i/(total-1)));
    const style = ENCHANT_STYLE_POOL[(i*5+2)%ENCHANT_STYLE_POOL.length];
    ENCHANT_TIERS.push({chance, name, cutscene, style});
  }
}

// ── 신규 40종 인챈트 (0.00000000000000000001% ~ 초극악 확률, 이름마다 고유 특수효과 부여) ──
// 무기를 이 등급으로 인챈트하면 %강화 외에 실제 특수 효과(화염/빙결/연쇄/폭발/흡혈/관통/치명타)가 함께 붙는다.
{
  const effectGroups = [
    {effect:'fire',    names:['타오르는 잉걸불','노을의 심장','용암의 맥박','재의 나선','화신의 손톱','불사조의 눈물']},
    {effect:'freeze',  names:['서릿발 파문','만년설의 숨','빙하의 노래','북극성의 파편','동토의 심장','서리꽃 결정']},
    {effect:'chain',   names:['뇌명의 고리','스파크 사슬','전격의 잔상','폭풍의 눈','뇌우의 서명','천둥의 발자국']},
    {effect:'explosive',names:['작열하는 씨앗','뇌관의 계시','폭심의 낙인','충격파 문양','파쇄의 서약','붕괴하는 별']},
    {effect:'vamp',    names:['갈증의 인장','탐식자의 손길','피의 맹세','굶주린 그림자','생명 흡수자','저주받은 송곳니']},
    {effect:'pierce',  names:['천공의 화살','직선의 계율','관통자의 눈','창끝의 진실','뚫어내는 의지']},
    {effect:'crit',    names:['급소를 아는 자','치명의 순간','필살의 예감','일격필살의 낙인','최후의 일침']},
  ];
  const flat=[];
  effectGroups.forEach(g=>g.names.forEach(name=>flat.push({name,effect:g.effect})));
  const total=flat.length; // 40
  const logMax=Math.log10(0.0000000000000000001), logMin=-130;
  flat.forEach((item,i)=>{
    const logC = logMax + (logMin-logMax)*(i/(total-1));
    const chance = Math.pow(10, logC);
    const cutscene = Math.round(1200 + (7200-1200)*(i/(total-1)));
    const style = ENCHANT_STYLE_POOL[(i*5+2)%ENCHANT_STYLE_POOL.length];
    ENCHANT_TIERS.push({chance, name:item.name, cutscene, style, effect:item.effect});
  });
}

// ── 행운(potion) 시스템 ──
// pendingRolls: 마신 만큼 쌓이는 "1회성 대박 행운" 큐. 인챈트 1번마다 하나씩 소모됨 (SOL'S RNG의 천상의 물약 컨셉)
let pendingRolls = lJ('hd_pending_rolls', []);
let potionInv = lJ('hd_potion_inv', {}); // {potionId: count}
let potionBuff = lJ('hd_potion_buff', null); // {mult, expiresAt} - 5분 임시 버프
function savePotionState(){ sv('hd_pending_rolls', pendingRolls); sv('hd_potion_inv', potionInv); sv('hd_potion_buff', potionBuff); }

function currentLuckMult(){
  let m = 1;
  if(potionBuff && potionBuff.expiresAt > Date.now()) m += potionBuff.mult;
  else if(potionBuff) { potionBuff = null; savePotionState(); }
  if(typeof PETS!=='undefined' && typeof equippedPetId!=='undefined'){
    const pet=PETS.find(p=>p.id===equippedPetId);
    if(pet&&pet.bonus.luckPct){
      const lv=petLevel(pet.id);
      m += pet.bonus.luckPct*(1+lv*0.15)/100;
    }
  }
  return m;
}

// 30종 물약: 23종 반복 구매형(5분 임시버프) + 7종 1회용 "단발 대박 행운"형
const POTIONS = [];
for(let i=0;i<23;i++){
  const luck = +(0.15 + i*0.13).toFixed(2);
  const price = Math.round(3000*(i+1)*(i+1)*3 + 2000);
  POTIONS.push({id:'pot_temp_'+i, name:`행운의 물약 Lv.${i+1}`, icon:'🧪', price, luck, burst:false,
    desc:`5분간 행운 +${luck}`});
}
const BURST_POTIONS = [
  {id:'pot_perm_1', name:'축복의 물약', icon:'✨', price:2000000,   luck:20},
  {id:'pot_perm_2', name:'성스러운 물약', icon:'🕊️', price:5000000,   luck:50},
  {id:'pot_perm_3', name:'기적의 물약', icon:'🌈', price:8000000,   luck:100},
  {id:'pot_perm_4', name:'천상의 물약', icon:'☁️', price:10000000,  luck:200},
  {id:'pot_perm_5', name:'초월의 물약', icon:'🌠', price:20000000,  luck:500},
  {id:'pot_perm_6', name:'전능의 물약', icon:'👁️', price:50000000,  luck:2000},
  {id:'pot_perm_7', name:'신화의 물약', icon:'🌌', price:100000000, luck:10000},
  // ── 초고가 대박 물약 9종 (2억~250억) ──
  {id:'pot_perm_8',  name:'무한의 물약',       icon:'♾️', price:200000000,   luck:2000},
  {id:'pot_perm_9',  name:'창조의 물약',       icon:'🪐', price:400000000,   luck:5000},
  {id:'pot_perm_10', name:'파괴의 물약',       icon:'💢', price:800000000,   luck:10000},
  {id:'pot_perm_11', name:'차원붕괴의 물약',   icon:'🕳️', price:1500000000,  luck:100000},
  {id:'pot_perm_12', name:'우주의 물약',       icon:'🌌', price:3000000000,  luck:10000000},
  {id:'pot_perm_13', name:'절대자의 물약',     icon:'👑', price:6000000000,  luck:100000000},
  {id:'pot_perm_14', name:'종말의 물약',       icon:'☄️', price:10000000000, luck:450000000},
  {id:'pot_perm_15', name:'태초 이전의 물약',  icon:'⏳', price:17000000000, luck:750000000},
  {id:'pot_perm_16', name:'만물의 물약',       icon:'🔱', price:25000000000, luck:999999999},
];
// ── 초초고가 대박 물약 30종 (250억~1000억, 행운 x10억~x999,999,999,999,999,999) ──
{
  const potNames = ['공허의 정수','태초 이전의 눈물','창조주의 숨결','파괴신의 축복','시공간의 조각',
    '무한회랑의 열쇠','절대영도의 결정','빅뱅의 씨앗','다중우주의 파편','영원의 모래시계',
    '섭리의 인장','운명 조작자의 물약','확률 파괴자','인과율의 사슬 절단자','전지전능의 눈',
    '만능키의 정수','붕괴하는 확률장','기적 그 자체','신들의 유산','태초의 빛',
    '무형의 심판','절대자의 마지막 선물','존재 초월의 증표','한계 돌파의 결정체','완전무결의 물약',
    '초월적 우연','확정된 기적','불가능의 실현체','섭리를 거스르는 자','모든 것의 어머니'];
  const total=30;
  const logPMin=Math.log10(25000000000), logPMax=Math.log10(100000000000);
  const logLMin=Math.log10(1000000000), logLMax=Math.log10(999999999999999999);
  for(let i=0;i<total;i++){
    const price=Math.round(Math.pow(10, logPMin+(logPMax-logPMin)*(i/(total-1))));
    const luck=Math.round(Math.pow(10, logLMin+(logLMax-logLMin)*(i/(total-1))));
    BURST_POTIONS.push({id:'pot_ultra_'+i, name:potNames[i], icon:'🌟', price, luck});
  }
}
BURST_POTIONS.forEach(p=>{p.burst=true;p.desc=`다음 인챈트 1회에만 행운 x${p.luck.toLocaleString()} 적용 (1회용, 영구 아님)`;POTIONS.push(p);});

function buyPotion(id){
  const p = POTIONS.find(x=>x.id===id);
  if(!p||coins<p.price) return;
  coins-=p.price; sv('hd_c',coins); updRes();
  potionInv[id]=(potionInv[id]||0)+1;
  savePotionState();
  renderPotionShop();
}
function drinkPotion(id){
  const p = POTIONS.find(x=>x.id===id);
  if(!p||!potionInv[id]) return;
  potionInv[id]--;
  if(potionInv[id]<=0) delete potionInv[id];
  if(p.burst){
    pendingRolls.push(p.luck); // 마신 만큼 큐에 쌓임 - 각각 인챈트 1회씩 소모
  } else {
    const curMult = potionBuff&&potionBuff.expiresAt>Date.now()?potionBuff.mult:0;
    potionBuff = {mult: curMult+p.luck, expiresAt: Date.now()+300000};
  }
  savePotionState();
  renderPotionShop();
}

function openPotionShop(){ go('sPotionShop'); }
function renderPotionShop(){
  const g=document.getElementById('potionGrid'); if(!g) return;
  g.innerHTML='';
  document.getElementById('potionLuckDisp').textContent = '현재 행운 배율: x'+currentLuckMult().toFixed(2)+(pendingRolls.length>0?' · 대박 행운 대기 '+pendingRolls.length+'회 (다음: x'+pendingRolls[0]+')':'');
  POTIONS.forEach(p=>{
    const owned = potionInv[p.id]||0;
    const cb = coins>=p.price;
    const d=document.createElement('div');
    d.className='si'+(owned?' own':cb?' cb2':'')+(p.burst?' rar-legendary':'');
    d.innerHTML = `<div class="sico">${p.icon}</div><div class="snm">${p.name}</div>`+
      `<div style="font-size:9px;color:#c4b5fd;margin-top:3px;">${p.desc}</div>`+
      `<div style="font-size:10px;font-weight:700;color:${cb?'#fbbf24':'#6b7280'};margin-top:4px;">🪙${p.price.toLocaleString()}</div>`+
      (owned?`<div style="font-size:9px;color:#4ade80;margin-top:2px;">보유 ${owned}개</div>`:'');
    const btnRow=document.createElement('div');btnRow.style.cssText='display:flex;gap:4px;margin-top:6px;justify-content:center;';
    const buyBtn=document.createElement('button');buyBtn.className='bybtn';buyBtn.textContent='구매';buyBtn.disabled=!cb;
    buyBtn.onclick=()=>buyPotion(p.id);
    btnRow.appendChild(buyBtn);
    if(owned){
      const drinkBtn=document.createElement('button');drinkBtn.className='bybtn';drinkBtn.style.background='linear-gradient(135deg,#7c3aed,#a855f7)';drinkBtn.textContent='마시기';
      drinkBtn.onclick=()=>drinkPotion(p.id);
      btnRow.appendChild(drinkBtn);
    }
    d.appendChild(btnRow);
    g.appendChild(d);
  });
}

// ── 인챈트 홀 ──
let enchantCat = 'wep'; // wep | armor | job
let enchantSelId = null;
function setEnchantCat(cat,btn){
  enchantCat=cat; enchantSelId=null;
  document.querySelectorAll('#sEnchant .stab').forEach(b=>b.classList.remove('on'));
  if(btn)btn.classList.add('on');
  renderEnchantList();
  renderEnchantProbTable();
}
function renderEnchantProbTable(){
  const t=document.getElementById('enchantProbTable'); if(!t) return;
  const sorted=[...ENCHANT_TIERS].sort((a,b)=>b.chance-a.chance);
  t.innerHTML = sorted.map(x=>`<div>${x.chance}% : ${x.name}</div>`).join('');
}
function enchantKey(){
  if(!enchantSelId) return null;
  if(enchantCat==='wep') return enchantSelId;
  if(enchantCat==='armor') return 'ar_'+enchantSelId;
  return 'job_'+enchantSelId;
}
// 장비칸/목록에 표시할 보라빛 "성능 향상" 설명 텍스트
const ENCHANT_EFFECT_LABEL = {
  fire:'🔥 화염 데미지 추가', freeze:'❄️ 빙결 효과 부여', chain:'⚡ 번개 연쇄 부여',
  explosive:'💥 폭발 효과 부여', vamp:'🩸 흡혈 효과 부여', pierce:'➡️ 관통 효과 부여', crit:'🎯 치명타 확률 증가',
};
function enchantStatText(itemKey,cat){
  const tier=enchants[itemKey];
  if(tier==null) return '';
  const pct=(tier+1)*10;
  const label = cat==='wep'?'데미지가':cat==='armor'?'방어력이':'능력치가';
  const t=ENCHANT_TIERS[tier];
  const effectLine = t&&t.effect?`<div style="color:#f0abfc;font-size:9px;font-weight:700;">${ENCHANT_EFFECT_LABEL[t.effect]}</div>`:'';
  return `<div style="color:#c084fc;font-size:9px;font-weight:700;margin-top:2px;">✨ 인챈트로 ${label} ${pct}% 강화됨</div>${effectLine}`;
}
function renderEnchantList(){
  const list=document.getElementById('enchantList'); if(!list) return;
  list.innerHTML='';
  let items=[];
  if(enchantCat==='wep') items=Object.keys(WEPS).filter(id=>owned[id]).map(id=>({id,name:WEPS[id].name,icon:WEPS[id].icon}));
  else if(enchantCat==='armor') items=ARMORS.filter(a=>owned['ar_'+a.id]).map(a=>({id:a.id,name:a.name+'갑옷',icon:a.icon}));
  else items=JOBS.filter(j=>ownedJobs[j.id]).map(j=>({id:j.id,name:j.name,icon:j.icon}));
  if(items.length===0){list.innerHTML='<div style="color:#c4b5fd;font-size:12px;padding:20px;text-align:center;">보유한 항목이 없습니다</div>';return;}
  items.forEach(it=>{
    const key = enchantCat==='wep'?it.id:enchantCat==='armor'?'ar_'+it.id:'job_'+it.id;
    const tier = enchants[key];
    const isSel = enchantSelId===it.id;
    const d=document.createElement('div');
    d.className='ei'+(isSel?' eq':'');
    d.style.cursor='pointer';
    d.innerHTML=`<div class="eico">${it.icon}</div><div><div class="enm" style="color:#e9d5ff;">${it.name}</div><div class="elv" style="color:#c4b5fd;">${tier!=null?'✨ '+ENCHANT_TIERS[tier].name:'미인챈트'}</div>${enchantStatText(key,enchantCat)}</div>`;
    d.onclick=()=>{enchantSelId=it.id;renderEnchantList();renderEnchantDetail();};
    list.appendChild(d);
  });
  renderEnchantDetail();
}
function renderEnchantDetail(){
  const det=document.getElementById('enchantDetail'); if(!det) return;
  if(!enchantSelId){ det.innerHTML='<div style="color:#c4b5fd;font-size:13px;">왼쪽에서 인챈트할 대상을 선택하세요</div>'; return; }
  const key=enchantKey();
  const tier=enchants[key];
  const cb = coins>=ENCHANT_COST;
  det.innerHTML = `
    <div style="font-size:16px;color:#fbbf24;font-weight:800;margin-bottom:8px;">${tier!=null?'✨ '+ENCHANT_TIERS[tier].name:'미인챈트 상태'}</div>
    ${tier!=null?enchantStatText(key,enchantCat):''}
    <div style="font-size:12px;color:#c4b5fd;margin:12px 0;">인챈트 비용: 🪙${ENCHANT_COST.toLocaleString()}<br>현재 행운 배율: x${currentLuckMult().toFixed(2)}${pendingRolls.length>0?' <span style="color:#fbbf24;">(대박 행운 대기 '+pendingRolls.length+'회, 다음 x'+pendingRolls[0]+')</span>':''}</div>
    <button class="mok" id="doEnchantBtn" style="width:100%;padding:22px 0;font-size:20px;background:linear-gradient(135deg,#6d28d9,#a855f7);box-shadow:0 4px 24px #a855f760;" ${cb?'':'disabled'}>🔮 인챈트하기</button>
    <button class="mok" style="width:100%;padding:14px 0;margin-top:10px;background:linear-gradient(135deg,#4c1d95,#7c3aed);" onclick="openPotionShop()">🧪 물약 상점</button>
  `;
  document.getElementById('doEnchantBtn').onclick=doEnchant;
}
function rollEnchantTier(){
  // 등급별 chance 값을 가중치로 삼아 "한 번의 추첨"으로 정확히 하나만 뽑는다.
  // 행운(luck)은 지수(exp)를 완만하게 낮춰서 희귀 등급 쪽 가중치를 밀어올리는 방식 - 특정 등급이 무조건 당첨되는 "확정 구간"이 생기지 않는다.
  const rollLuck = pendingRolls.length>0 ? pendingRolls[0] : 1;
  const luck = Math.max(1, currentLuckMult()*rollLuck);
  const exp = 1/(1+Math.log10(luck)); // luck=1 → exp=1(기본표 그대로), luck이 커질수록 0에 서서히 수렴
  const weights = ENCHANT_TIERS.map(t=>Math.pow(t.chance, exp));
  const total = weights.reduce((a,b)=>a+b,0);
  let r = Math.random()*total;
  for(let i=0;i<weights.length;i++){
    r-=weights[i];
    if(r<=0) return i;
  }
  return weights.length-1;
}
function doEnchant(){
  const key=enchantKey();
  if(!key||coins<ENCHANT_COST) return;
  coins-=ENCHANT_COST; sv('hd_c',coins); updRes();
  achStats.enchantAttempts=(achStats.enchantAttempts||0)+1; saveAch();
  const resultTier=rollEnchantTier();
  if(typeof trackEnchantStreak==='function')trackEnchantStreak(resultTier);
  if(resultTier>=ENCHANT_TIERS.length-5&&typeof unlockEgg==='function')unlockEgg('egg_void','secret_38');
  if(pendingRolls.length>0){ pendingRolls.shift(); savePotionState(); } // 대박 행운 큐에서 1회 소모
  runEnchantRoulette(resultTier);
}
function runEnchantRoulette(resultTier){
  const ov=document.getElementById('enchantRouletteOv');
  const spin=document.getElementById('enchantSpinName');
  ov.style.display='flex';
  let t=0;
  const itv=setInterval(()=>{
    t++;
    const rnd=ENCHANT_TIERS[Math.floor(Math.random()*ENCHANT_TIERS.length)];
    spin.textContent=rnd.name;
    if(t>=45){
      clearInterval(itv);
      finishEnchant(resultTier);
    }
  },66); // 약 3초 (45*66ms)
}
function finishEnchant(resultTier){
  const key=enchantKey();
  enchants[key]=resultTier;
  saveEnchants();
  const tier=ENCHANT_TIERS[resultTier];
  const ov=document.getElementById('enchantRouletteOv');
  const spin=document.getElementById('enchantSpinName');
  spin.textContent=tier.name+' 획득!';
  const cutDur=tier.cutscene||0;
  if(cutDur>0){
    ov.style.display='none';
    playEnchantCutscene(resultTier, cutDur/60*1000, ()=>{ renderEnchantList(); });
  } else {
    setTimeout(()=>{ov.style.display='none';renderEnchantList();},1200);
  }
}

// ── SOL'S RNG 스타일 컷씬 연출 ──
function tierColors(idx){
  // 등급이 높을수록(희귀할수록) 더 화려한 색 팔레트
  const palettes=[
    ['#f97316','#fbbf24'],           // 낮은 등급
    ['#a855f7','#818cf8'],
    ['#38bdf8','#22d3ee','#a855f7'],
    ['#fbbf24','#ef4444','#a855f7','#38bdf8'], // 최상위 - 레인보우
  ];
  const total=ENCHANT_TIERS.length;
  const r=idx/(total-1); // 0(흔함)~1(희귀)
  if(r<0.55) return palettes[0];
  if(r<0.75) return palettes[1];
  if(r<0.92) return palettes[2];
  return palettes[3];
}
// 등급에 따라 컷씬 연출 스타일을 다르게 - 뽑을 때마다 다른 느낌
function cutsceneStyle(idx){
  const tier=ENCHANT_TIERS[idx];
  if(tier&&tier.style) return tier.style; // 신규 100종은 등급마다 스타일이 고정 지정됨
  const total=ENCHANT_TIERS.length;
  const r=idx/(total-1);
  if(r<0.5) return 'rays';
  if(r<0.65) return 'vortex';
  if(r<0.8) return 'lightning';
  if(r<0.9) return 'starfield';
  return 'chaos'; // 최상위 등급: 모든 연출 총동원
}
let _activeCutscene=null;
function skipEnchantCutscene(){
  if(_activeCutscene) _activeCutscene.finish();
}
function playEnchantCutscene(resultTier, durationMs, onDone){
  const tier=ENCHANT_TIERS[resultTier];
  const cs=document.getElementById('enchantCutscene');
  const cv=document.getElementById('cutsceneCanvas');
  const flash=document.getElementById('cutsceneFlash');
  const shakeWrap=document.getElementById('cutsceneShakeWrap');
  const label=document.getElementById('cutsceneRarityLabel');
  const nameEl=document.getElementById('cutsceneTierName');
  const subEl=document.getElementById('cutsceneSub');
  const colors=tierColors(resultTier);
  const isTop=resultTier>=ENCHANT_TIERS.length-4;

  cs.style.display='block';
  cv.width=window.innerWidth; cv.height=window.innerHeight;
  const cx2=cv.getContext('2d');
  const W=cv.width,H=cv.height,cxp=W/2,cyp=H/2;

  // 초기 상태 리셋
  flash.style.opacity='0';
  nameEl.style.transform='scale(0)';
  nameEl.style.background=`linear-gradient(135deg,${colors.join(',')})`;
  nameEl.style.webkitBackgroundClip='text'; nameEl.style.backgroundClip='text';
  nameEl.textContent=tier.name;
  nameEl.classList.remove('cutpulse');
  label.style.opacity='0'; label.textContent='✨ '+tier.chance+'% RARE ENCHANT ✨';
  subEl.style.opacity='0'; subEl.textContent=isTop?'전설이 되었다':'등급 확정!';
  shakeWrap.classList.remove('cutshake');

  const style=cutsceneStyle(resultTier);
  const startT=Date.now();
  let particles=[];
  const pCount=isTop?140:80;
  for(let i=0;i<pCount;i++){
    const a=Math.random()*Math.PI*2, spd=1+Math.random()*4;
    particles.push({x:cxp,y:cyp,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,ang:a,dist:0,r:2+Math.random()*4,col:colors[Math.floor(Math.random()*colors.length)],life:1});
  }
  let bolts=[];
  function drawRays(t){
    const rays=isTop?24:14;
    for(let i=0;i<rays;i++){
      const a=(i/rays)*Math.PI*2 + t/500;
      const len=Math.max(W,H);
      const col=colors[i%colors.length];
      cx2.strokeStyle=col+'33'; cx2.lineWidth=isTop?6:3;
      cx2.beginPath(); cx2.moveTo(cxp,cyp); cx2.lineTo(cxp+Math.cos(a)*len,cyp+Math.sin(a)*len); cx2.stroke();
    }
    const ringR=(t/6)%Math.max(W,H);
    cx2.strokeStyle=colors[0]+'55'; cx2.lineWidth=3;
    cx2.beginPath();cx2.arc(cxp,cyp,ringR,0,Math.PI*2);cx2.stroke();
    particles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy; p.life-=0.006;
      if(p.life<=0){const a=Math.random()*Math.PI*2,spd=1+Math.random()*4;p.x=cxp;p.y=cyp;p.vx=Math.cos(a)*spd;p.vy=Math.sin(a)*spd;p.life=1;}
      cx2.globalAlpha=Math.max(0,p.life); cx2.fillStyle=p.col;
      cx2.beginPath();cx2.arc(p.x,p.y,p.r,0,Math.PI*2);cx2.fill();
    });
    cx2.globalAlpha=1;
  }
  function drawVortex(t){
    particles.forEach(p=>{
      p.ang+=0.05; p.dist=Math.min(Math.max(W,H)*.5, p.dist+2.2);
      p.x=cxp+Math.cos(p.ang+t/800)*p.dist;
      p.y=cyp+Math.sin(p.ang+t/800)*p.dist*.6;
      cx2.globalAlpha=0.85; cx2.fillStyle=p.col;
      cx2.beginPath();cx2.arc(p.x,p.y,3+Math.random()*2,0,Math.PI*2);cx2.fill();
      if(p.dist>=Math.max(W,H)*.5) p.dist=0;
    });
    cx2.globalAlpha=1;
    cx2.strokeStyle=colors[0]+'44'; cx2.lineWidth=2;
    for(let i=0;i<3;i++){cx2.beginPath();cx2.arc(cxp,cyp,(t/8+i*120)%(Math.max(W,H)*.5),0,Math.PI*2);cx2.stroke();}
  }
  function drawLightning(t){
    if(Math.random()>.85){
      const a=Math.random()*Math.PI*2;
      const pts=[[cxp,cyp]];
      let x=cxp,y=cyp;
      for(let i=0;i<8;i++){x+=Math.cos(a+((Math.random()-.5)*1.2))*40;y+=Math.sin(a+((Math.random()-.5)*1.2))*40;pts.push([x,y]);}
      bolts.push({pts,life:12,col:colors[Math.floor(Math.random()*colors.length)]});
    }
    bolts=bolts.filter(b=>{
      b.life--;
      cx2.globalAlpha=Math.max(0,b.life/12); cx2.strokeStyle=b.col; cx2.lineWidth=3;
      cx2.beginPath(); cx2.moveTo(b.pts[0][0],b.pts[0][1]);
      for(const pt of b.pts) cx2.lineTo(pt[0],pt[1]);
      cx2.stroke();
      return b.life>0;
    });
    cx2.globalAlpha=1;
    particles.forEach(p=>{
      p.x+=p.vx*.4; p.y+=p.vy*.4; p.life-=0.004;
      if(p.life<=0){const a=Math.random()*Math.PI*2,spd=1+Math.random()*3;p.x=cxp;p.y=cyp;p.vx=Math.cos(a)*spd;p.vy=Math.sin(a)*spd;p.life=1;}
      cx2.globalAlpha=Math.max(0,p.life)*.6; cx2.fillStyle=p.col;
      cx2.beginPath();cx2.arc(p.x,p.y,2,0,Math.PI*2);cx2.fill();
    });
    cx2.globalAlpha=1;
  }
  function drawStarfield(t){
    particles.forEach(p=>{
      const spdMul=1+ (t/1000);
      p.x+=p.vx*spdMul; p.y+=p.vy*spdMul; p.life-=0.01;
      if(p.life<=0||p.x<0||p.x>W||p.y<0||p.y>H){
        const a=Math.random()*Math.PI*2;
        p.x=cxp;p.y=cyp;p.vx=Math.cos(a)*2;p.vy=Math.sin(a)*2;p.life=1;
      }
      cx2.globalAlpha=Math.max(0,p.life); cx2.strokeStyle=p.col; cx2.lineWidth=2;
      cx2.beginPath();cx2.moveTo(p.x,p.y);cx2.lineTo(p.x-p.vx*2,p.y-p.vy*2);cx2.stroke();
    });
    cx2.globalAlpha=1;
  }
  function drawMeteor(t){
    // 화면 위쪽에서 유성이 쏟아지는 연출
    if(Math.random()>.7){
      particles[Math.floor(Math.random()*particles.length)]=
        {x:Math.random()*W,y:-20,vx:(Math.random()-.5)*2,vy:6+Math.random()*6,r:3+Math.random()*3,col:colors[Math.floor(Math.random()*colors.length)],life:1};
    }
    particles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.y>H+20){p.y=-20;p.x=Math.random()*W;}
      cx2.strokeStyle=p.col; cx2.lineWidth=p.r;
      cx2.beginPath();cx2.moveTo(p.x,p.y);cx2.lineTo(p.x-p.vx*4,p.y-p.vy*4);cx2.stroke();
    });
  }
  function drawPortal(t){
    for(let i=0;i<6;i++){
      const rr=((t/10)+i*60)%(Math.max(W,H)*.6);
      cx2.strokeStyle=colors[i%colors.length]+'88'; cx2.lineWidth=4;
      cx2.beginPath();cx2.ellipse(cxp,cyp,rr,rr*.4,t/1000,0,Math.PI*2);cx2.stroke();
    }
    particles.forEach(p=>{
      p.ang=(p.ang||0)+0.03; p.dist=((p.dist||0)+3)%(Math.max(W,H)*.5);
      p.x=cxp+Math.cos(p.ang)*p.dist; p.y=cyp+Math.sin(p.ang)*p.dist*.4;
      cx2.fillStyle=p.col; cx2.beginPath();cx2.arc(p.x,p.y,2.5,0,Math.PI*2);cx2.fill();
    });
  }
  function drawSupernova(t){
    const prog=(t/1400)%1;
    const r=prog*Math.max(W,H)*.75;
    const grad=cx2.createRadialGradient(cxp,cyp,0,cxp,cyp,r);
    grad.addColorStop(0,colors[0]+'cc'); grad.addColorStop(0.6,colors[colors.length-1]+'44'); grad.addColorStop(1,'transparent');
    cx2.fillStyle=grad; cx2.beginPath(); cx2.arc(cxp,cyp,r,0,Math.PI*2); cx2.fill();
    particles.forEach(p=>{
      p.x+=p.vx*1.5; p.y+=p.vy*1.5; p.life-=0.008;
      if(p.life<=0){const a=Math.random()*Math.PI*2,spd=2+Math.random()*4;p.x=cxp;p.y=cyp;p.vx=Math.cos(a)*spd;p.vy=Math.sin(a)*spd;p.life=1;}
      cx2.globalAlpha=Math.max(0,p.life); cx2.fillStyle=p.col;
      cx2.beginPath();cx2.arc(p.x,p.y,3,0,Math.PI*2);cx2.fill();
    });
    cx2.globalAlpha=1;
  }
  function drawSpiral(t){
    // 이중 나선으로 뻗어나가는 입자
    particles.forEach((p,i)=>{
      const arm=i%2===0?0:Math.PI;
      const ang=t/400+i*0.15+arm;
      const dist=((t/8)+i*10)%(Math.max(W,H)*.55);
      p.x=cxp+Math.cos(ang)*dist; p.y=cyp+Math.sin(ang)*dist*.7;
      cx2.fillStyle=colors[i%colors.length]; cx2.globalAlpha=.85;
      cx2.beginPath();cx2.arc(p.x,p.y,3,0,Math.PI*2);cx2.fill();
    });
    cx2.globalAlpha=1;
  }
  function drawShatter(t){
    // 중심에서 유리 파편처럼 갈라지는 직선 파편들
    const n=isTop?28:16;
    for(let i=0;i<n;i++){
      const a=(i/n)*Math.PI*2+ (i%2?0.3:0);
      const len=Math.min(t/4, Math.max(W,H)*.6);
      cx2.strokeStyle=colors[i%colors.length]+'aa'; cx2.lineWidth=2+((i%3));
      cx2.beginPath();cx2.moveTo(cxp+Math.cos(a)*20,cyp+Math.sin(a)*20);cx2.lineTo(cxp+Math.cos(a)*(len+20),cyp+Math.sin(a)*(len+20));cx2.stroke();
    }
    particles.forEach(p=>{
      p.x+=p.vx*.5; p.y+=p.vy*.5; p.life-=0.005;
      if(p.life<=0){const a=Math.random()*Math.PI*2,spd=1+Math.random()*3;p.x=cxp;p.y=cyp;p.vx=Math.cos(a)*spd;p.vy=Math.sin(a)*spd;p.life=1;}
      cx2.globalAlpha=Math.max(0,p.life); cx2.fillStyle=p.col;
      cx2.beginPath();cx2.arc(p.x,p.y,2,0,Math.PI*2);cx2.fill();
    });
    cx2.globalAlpha=1;
  }
  function drawAurora(t){
    // 물결치는 오로라 밴드
    for(let band=0;band<4;band++){
      cx2.beginPath();
      cx2.strokeStyle=colors[band%colors.length]+'66'; cx2.lineWidth=14-band*2;
      for(let x=0;x<=W;x+=20){
        const y=cyp+Math.sin(x/120+t/500+band*1.3)*(80+band*20);
        if(x===0)cx2.moveTo(x,y); else cx2.lineTo(x,y);
      }
      cx2.stroke();
    }
  }
  function drawBlackhole(t){
    // 중심으로 빨려들어가다 주기적으로 방출
    const cyclePhase=(t%2600)/2600;
    particles.forEach((p,i)=>{
      if(cyclePhase<0.7){
        p.ang=(p.ang||i)+0.06; p.dist=Math.max(4,(p.dist===undefined?Math.max(W,H)*.4:p.dist)-1.5);
        p.x=cxp+Math.cos(p.ang)*p.dist; p.y=cyp+Math.sin(p.ang)*p.dist;
      } else {
        p.dist=(p.dist||0)+10;
        p.x=cxp+Math.cos(p.ang||0)*p.dist; p.y=cyp+Math.sin(p.ang||0)*p.dist;
        if(p.dist>Math.max(W,H)*.5){p.dist=0;}
      }
      cx2.fillStyle=p.col||colors[i%colors.length]; cx2.globalAlpha=.8;
      cx2.beginPath();cx2.arc(p.x,p.y,2.5,0,Math.PI*2);cx2.fill();
    });
    cx2.globalAlpha=1;
    cx2.fillStyle='#000'; cx2.beginPath();cx2.arc(cxp,cyp,cyclePhase<0.7?30:10,0,Math.PI*2);cx2.fill();
  }
  function drawKaleidoscope(t){
    const seg=8;
    for(let s=0;s<seg;s++){
      cx2.save();
      cx2.translate(cxp,cyp); cx2.rotate((s/seg)*Math.PI*2 + t/900);
      for(let i=0;i<5;i++){
        cx2.strokeStyle=colors[i%colors.length]+'99'; cx2.lineWidth=2;
        cx2.beginPath();cx2.moveTo(0,0);cx2.lineTo(30+i*30,10+Math.sin(t/300+i)*20);cx2.stroke();
      }
      cx2.restore();
    }
  }
  function drawShockwave(t){
    const cyc=(t%1000)/1000;
    for(let i=0;i<3;i++){
      const rr=((cyc+i/3)%1)*Math.max(W,H)*.7;
      cx2.strokeStyle=colors[i%colors.length]+'88'; cx2.lineWidth=6-i;
      cx2.beginPath();cx2.arc(cxp,cyp,rr,0,Math.PI*2);cx2.stroke();
    }
    particles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy; p.life-=0.007;
      if(p.life<=0){const a=Math.random()*Math.PI*2,spd=2+Math.random()*3;p.x=cxp;p.y=cyp;p.vx=Math.cos(a)*spd;p.vy=Math.sin(a)*spd;p.life=1;}
      cx2.globalAlpha=Math.max(0,p.life); cx2.fillStyle=p.col;
      cx2.beginPath();cx2.arc(p.x,p.y,2.5,0,Math.PI*2);cx2.fill();
    });
    cx2.globalAlpha=1;
  }
  function drawNebula(t){
    particles.forEach((p,i)=>{
      p.x+=Math.sin(t/600+i)*0.6; p.y+=Math.cos(t/700+i)*0.6;
      if(Math.abs(p.x-cxp)>W*.4)p.vx=-p.vx; if(Math.abs(p.y-cyp)>H*.4)p.vy=-p.vy;
      cx2.fillStyle=p.col; cx2.globalAlpha=.25;
      cx2.beginPath();cx2.arc(p.x,p.y,10+Math.sin(t/300+i)*4,0,Math.PI*2);cx2.fill();
    });
    cx2.globalAlpha=1;
  }
  let running_=true;
  function frame(){
    if(!running_) return;
    const t=Date.now()-startT;
    cx2.fillStyle='rgba(0,0,0,0.18)';
    cx2.fillRect(0,0,W,H);
    if(style==='rays') drawRays(t);
    else if(style==='vortex') drawVortex(t);
    else if(style==='lightning') drawLightning(t);
    else if(style==='starfield') drawStarfield(t);
    else if(style==='meteor') drawMeteor(t);
    else if(style==='portal') drawPortal(t);
    else if(style==='supernova') drawSupernova(t);
    else if(style==='spiral') drawSpiral(t);
    else if(style==='shatter') drawShatter(t);
    else if(style==='aurora') drawAurora(t);
    else if(style==='blackhole') drawBlackhole(t);
    else if(style==='kaleidoscope') drawKaleidoscope(t);
    else if(style==='shockwave') drawShockwave(t);
    else if(style==='nebula') drawNebula(t);
    else { drawRays(t); drawVortex(t); drawLightning(t); drawSupernova(t); } // chaos: 최상위 등급 총동원
    if(running_) requestAnimationFrame(frame);
  }
  frame();

  const timers=[];

  // 초반 스트로브 플래시 (0~700ms)
  let flashN=0;
  const flashItv=setInterval(()=>{
    flashN++;
    flash.style.transition='opacity .05s';
    flash.style.opacity=flashN%2===0?'0.7':'0';
    if(flashN>=(isTop?10:6)){ clearInterval(flashItv); flash.style.opacity='0'; }
  },90);
  timers.push(flashItv);

  // 흔들림 (0~600ms)
  shakeWrap.classList.add('cutshake');
  timers.push(setTimeout(()=>shakeWrap.classList.remove('cutshake'), isTop?900:600));

  // 텍스트 등장 (라벨 → 이름 zoom-in → 서브)
  timers.push(setTimeout(()=>{ label.style.transition='opacity .4s'; label.style.opacity='1'; }, 500));
  timers.push(setTimeout(()=>{
    nameEl.style.fontSize = isTop?'56px':'42px';
    nameEl.style.transform='scale(1)';
    nameEl.classList.add('cutpulse');
    // 등장 순간 추가 플래시
    flash.style.transition='opacity .08s';
    flash.style.opacity='0.9';
    timers.push(setTimeout(()=>{flash.style.opacity='0';},120));
  }, 850));
  timers.push(setTimeout(()=>{ subEl.style.opacity='1'; }, 1300));

  function finish(){
    running_=false;
    timers.forEach(id=>{clearTimeout(id);clearInterval(id);});
    shakeWrap.classList.remove('cutshake');
    flash.style.opacity='0';
    cs.style.display='none';
    _activeCutscene=null;
    if(onDone) onDone();
  }
  timers.push(setTimeout(finish, durationMs));
  _activeCutscene={finish};
}
