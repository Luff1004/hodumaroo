// ════════════════════════════════════════════
// ══ 데일리 보상 상자 (24시간마다 1회) ══
// ════════════════════════════════════════════

const DR_COOLDOWN = 24*60*60*1000;

// ── 영원의 별 (최상위 희귀 장비, 데일리 보상/특별 업적으로만 획득) ──
const STARS = [
  {id:'star_dawn',      name:'여명의 별',   icon:'🌅', desc:'하루의 시작을 알리는 별'},
  {id:'star_dusk',      name:'황혼의 별',   icon:'🌇', desc:'저물어가는 빛을 담은 별'},
  {id:'star_abyss',     name:'심연의 별',   icon:'🌑', desc:'끝없는 어둠 속에서 빛나는 별'},
  {id:'star_radiance',  name:'광휘의 별',   icon:'☀️', desc:'눈부신 빛을 뿜어내는 별'},
  {id:'star_frost',     name:'서리의 별',   icon:'❄️', desc:'차가운 냉기를 품은 별'},
  {id:'star_ember',     name:'불씨의 별',   icon:'🔥', desc:'꺼지지 않는 불꽃의 별'},
  {id:'star_tide',      name:'조류의 별',   icon:'🌊', desc:'끝없이 흐르는 파도의 별'},
  {id:'star_void',      name:'공허의 별',   icon:'🌌', desc:'모든 것을 삼키는 공허의 별'},
  {id:'star_origin',    name:'태초의 별',   icon:'✨', desc:'세상이 시작된 순간의 별'},
  {id:'star_eternity',  name:'영원의 별',   icon:'♾️', desc:'시간을 초월한 궁극의 별'},
];

let drData = lJ('hd_daily_reward', {lastClaim:0});
let ownedStars = lJ('hd_stars', {});
let equippedStarId = lS('hd_eq_star', '');
function saveDailyRewardData(){ sv('hd_daily_reward', drData); }
function saveStarData(){ sv('hd_stars', ownedStars); sv('hd_eq_star', equippedStarId||''); }

function dailyRewardReady(){ return Date.now()-(drData.lastClaim||0) >= DR_COOLDOWN; }

function fmtDrTime(ms){
  if(ms<0)ms=0;
  const h=Math.floor(ms/3600000), m=Math.floor((ms%3600000)/60000), s=Math.floor((ms%60000)/1000);
  return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
}

function renderDailyRewardBox(){
  const box=document.getElementById('dailyRewardBox');if(!box)return;
  const ready=dailyRewardReady();
  box.classList.toggle('locked', !ready);
  const iconEl=document.getElementById('drBoxIcon'),timerEl=document.getElementById('drBoxTimer');
  if(ready){
    if(iconEl)iconEl.textContent='🎁';
    if(timerEl)timerEl.textContent='';
    box.title='데일리 보상 받기';
  } else {
    if(iconEl)iconEl.textContent='🔒';
    if(timerEl)timerEl.textContent=fmtDrTime(DR_COOLDOWN-(Date.now()-(drData.lastClaim||0)));
    box.title='다음 보상까지 남은 시간';
  }
}

function grantDailyBonus(kind){
  if(kind==='star'){
    const avail=STARS.filter(s=>!ownedStars[s.id]);
    const pick=avail.length?avail[Math.floor(Math.random()*avail.length)]:null;
    if(!pick){ const amount=100000; coins+=amount; sv('hd_c',coins); return {kind:'coins_fallback',amount}; }
    ownedStars[pick.id]=true; saveStarData();
    return {kind,label:'영원의 별',icon:pick.icon,name:pick.name};
  }
  if(kind==='armor'){
    const avail=ARMORS.filter(a=>!owned['ar_'+a.id]);
    if(!avail.length){ const amount=50000; coins+=amount; sv('hd_c',coins); return {kind:'coins_fallback',amount}; }
    const pick=avail[Math.floor(Math.random()*avail.length)];
    owned['ar_'+pick.id]=true; saveAll();
    return {kind,label:'갑옷',icon:pick.icon,name:pick.name+'갑옷'};
  }
  if(kind==='job'){
    const avail=JOBS.filter(j=>!ownedJobs[j.id]);
    if(!avail.length){ const amount=30000; coins+=amount; sv('hd_c',coins); return {kind:'coins_fallback',amount}; }
    const pick=avail[Math.floor(Math.random()*avail.length)];
    ownedJobs[pick.id]=true; saveJobData();
    return {kind,label:'직업',icon:pick.icon,name:pick.name};
  }
  if(kind==='pet'){
    const pool=PETS.filter(p=>p.rarity==='legendary');
    const pick=pool[Math.floor(Math.random()*pool.length)];
    if(!ownedPets[pick.id])ownedPets[pick.id]={count:0,level:0};
    ownedPets[pick.id].count++;
    savePetData();
    return {kind,label:'전설 펫',icon:pick.icon,name:pick.name};
  }
  return null;
}

function openDailyRewardBox(){
  if(!dailyRewardReady()){
    const box=document.getElementById('dailyRewardBox');
    if(box){box.classList.remove('shake');void box.offsetWidth;box.classList.add('shake');}
    return;
  }
  const coinsGain=500+Math.floor(Math.random()*1000);
  const energyGain=300+Math.floor(Math.random()*500);
  coins+=coinsGain; energy+=energyGain; sv('hd_c',coins); sv('hd_e',energy); updRes();

  drData.lastClaim=Date.now();
  saveDailyRewardData();

  const r=Math.random()*100;
  let bonus=null;
  if(r<0.4) bonus=grantDailyBonus('star');
  else if(r<1.4) bonus=grantDailyBonus('armor');
  else if(r<3.4) bonus=grantDailyBonus('job');
  else if(r<6.4) bonus=grantDailyBonus('pet');

  showDailyRewardResult(coinsGain,energyGain,bonus);
  renderDailyRewardBox();
}

function showDailyRewardResult(coinsGain,energyGain,bonus){
  const el=document.getElementById('dailyRewardResult');if(!el)return;
  const lvlMap={star:3,pet:2,job:2,armor:1,coins_fallback:1};
  const colorMap={star:'#a855f7',pet:'#f59e0b',job:'#3b82f6',armor:'#9ca3af',coins_fallback:'#fbbf24'};
  const lvl=bonus?(lvlMap[bonus.kind]||0):0;
  const color=bonus?(colorMap[bonus.kind]||'#fbbf24'):'#fbbf24';
  el.style.setProperty('--sd-glow', color+'55');
  el.style.setProperty('--sd-aurora', lvl);
  const tierCls=lvl>=3?' sd-result-tier-rainbow':lvl>=2?' sd-result-tier-epic':'';
  const confetti=typeof sdConfettiHTML==='function'?sdConfettiHTML(lvl):'';
  let bonusLine='';
  if(bonus){
    bonusLine = bonus.kind==='coins_fallback'
      ? `<div class="sd-reward-line">🪙 (이미 모두 보유) 대신 코인 +${bonus.amount.toLocaleString()}</div>`
      : `<div class="sd-reward-line">${bonus.icon} ${bonus.label} - ${bonus.name} 획득!</div>`;
  }
  el.innerHTML = confetti+
    `<div class="sd-result-tier${tierCls}" style="color:${color}">🎁 데일리 보상 획득!</div>`+
    `<div class="sd-result-list">`+
      `<div class="sd-reward-line">🪙 코인 +${coinsGain.toLocaleString()}</div>`+
      `<div class="sd-reward-line">⚡ 에너지 +${energyGain.toLocaleString()}</div>`+
      bonusLine+
    `</div>`+
    `<div class="sd-result-btns"><button class="sd-close-btn" onclick="closeDailyRewardResult()">확인</button></div>`;
  el.classList.add('show');
  clearTimeout(el._hideT);
  if(lvl<=0){
    el._hideT=setTimeout(()=>closeDailyRewardResult(),2200);
  }
  if(lvl>=2){
    const screenEl=document.getElementById('sLobby');
    if(screenEl){screenEl.classList.remove('sd-chaos-shake');void screenEl.offsetWidth;screenEl.classList.add('sd-chaos-shake');}
  }
}
function closeDailyRewardResult(){
  const el=document.getElementById('dailyRewardResult');if(!el)return;
  el.classList.remove('show');
}

// ── 장비 화면: 별 탭 ──
function renderEquipStarTab(){
  const list=document.getElementById('eList');list.innerHTML='';
  document.getElementById('eDet').style.display='none';
  let has=false;
  STARS.forEach(s=>{
    if(!ownedStars[s.id])return;has=true;
    const isEq=equippedStarId===s.id;
    const d=document.createElement('div');d.className='ei star-item'+(isEq?' eq':'');
    d.innerHTML=`<div class="eico">${s.icon}</div><div><div class="enm">${s.name} <span class="rbadge legendary">🌠 STAR</span></div><div class="elv">${s.desc} ${isEq?'<span style="font-size:8px;background:#14532d;color:#4ade80;padding:1px 5px;border-radius:5px">장착중</span>':''}</div></div>`;
    d.onclick=()=>{equippedStarId=equippedStarId===s.id?'':s.id;saveStarData();renderEquipStarTab();};
    list.appendChild(d);
  });
  if(!has)list.innerHTML='<div style="color:#6b7280;font-size:12px;padding:24px;text-align:center;">데일리 보상이나 특별 업적으로 획득할 수 있습니다 (0.4% 확률)</div>';
}

renderDailyRewardBox();
setInterval(renderDailyRewardBox,1000);
