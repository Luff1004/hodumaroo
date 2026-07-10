// ════════════════════════════════════════════
// ══ 시즌 이벤트 (2개월마다 순환하는 미니게임) ══
// ════════════════════════════════════════════

const EVENT_PERIODS = [
  {id:'cookwar', months:[1,2], name:'요리전쟁', icon:'🍳', theme:'#f97316', bg:'linear-gradient(160deg,#451a03,#7c2d12)',
   desc:'레시피대로 재료를 조합해 요리를 완성하고 셰프에게 제출해 포인트를 받으세요!',
   ptName:'요리 포인트', ptIcon:'🍲',
   rewards:{weapon:{id:'ev_cw_wep',cost:300}, armor:{id:'ev_cw_armor',cost:500}, job:{id:'ev_cw_job',cost:900},
     items:[{id:'ev_cw_item1',cost:150},{id:'ev_cw_item2',cost:180},{id:'ev_cw_item3',cost:220}]},
   shop:[
     {id:'coin_s',name:'코인 주머니',icon:'🪙',cost:40,type:'coins',amount:5000,repeatable:true},
     {id:'coin_m',name:'코인 궤짝',icon:'💰',cost:180,type:'coins',amount:32000,repeatable:true},
     {id:'energy_s',name:'에너지 캡슐',icon:'⚡',cost:45,type:'energy',amount:6000,repeatable:true},
     {id:'energy_m',name:'에너지 배터리',icon:'🔋',cost:190,type:'energy',amount:36000,repeatable:true},
     {id:'egg',name:'셰프의 달걀',icon:'🥚',cost:350,type:'pet',target:'pet_ev_cookwar',repeatable:true},
   ]},
  {id:'garden', months:[3,4], name:'봄맞이 텃밭 가꾸기', icon:'🌱', theme:'#4ade80', bg:'linear-gradient(160deg,#14532d,#365314)',
   desc:'빈 밭을 클릭해 씨앗을 심고, 활짝 피면 다시 클릭해 수확하세요! 너무 늦으면 시들어버려요. 🌟황금 꽃은 추가 코인도 줍니다.',
   ptName:'새싹 포인트', ptIcon:'🌱',
   rewards:{weapon:{id:'ev_gd_wep',cost:250}, armor:{id:'ev_gd_armor',cost:450},
     items:[{id:'ev_gd_item1',cost:130},{id:'ev_gd_item2',cost:160},{id:'ev_gd_item3',cost:200}]},
   shop:[
     {id:'coin_s',name:'코인 주머니',icon:'🪙',cost:35,type:'coins',amount:5000,repeatable:true},
     {id:'coin_m',name:'코인 궤짝',icon:'💰',cost:160,type:'coins',amount:32000,repeatable:true},
     {id:'energy_s',name:'에너지 캡슐',icon:'⚡',cost:40,type:'energy',amount:6000,repeatable:true},
     {id:'energy_m',name:'에너지 배터리',icon:'🔋',cost:170,type:'energy',amount:36000,repeatable:true},
     {id:'egg',name:'새싹 알',icon:'🥚',cost:300,type:'pet',target:'pet_ev_garden',repeatable:true},
   ]},
  {id:'treasure', months:[5,6], name:'보물찾기 대회', icon:'💎', theme:'#b45309', bg:'linear-gradient(160deg,#451a03,#78350f)',
   desc:'코인으로 땅을 파서 전용 무기·갑옷·직업·아이템을 발굴하세요! (64칸 중 6칸에 대박이 숨어있습니다)',
   ptName:'코인', ptIcon:'🪙', useCoins:true,
   rewards:{weapon:{id:'ev_tr_wep'}, armor:{id:'ev_tr_armor'}, job:{id:'ev_tr_job'},
     items:[{id:'ev_tr_item1'},{id:'ev_tr_item2'},{id:'ev_tr_item3'}]},
   shop:[
     {id:'egg',name:'보물 알',icon:'🥚',cost:20000,type:'pet',target:'pet_ev_treasure',repeatable:true},
   ]},
  {id:'watermelon', months:[7,8], name:'여름 수박격파 대회', icon:'🍉', theme:'#22c55e', bg:'linear-gradient(160deg,#0c4a6e,#f59e0b)',
   desc:'날아오는 수박을 빠르게 클릭해서 격파하세요! 🥇황금 수박은 대박 보너스, 💣폭탄 수박은 피하세요!',
   ptName:'수박 포인트', ptIcon:'🍉',
   rewards:{weapon:{id:'ev_wm_wep',cost:280}, armor:{id:'ev_wm_armor',cost:480}, job:{id:'ev_wm_job',cost:850},
     items:[{id:'ev_wm_item1',cost:140},{id:'ev_wm_item2',cost:170},{id:'ev_wm_item3',cost:210}]},
   shop:[
     {id:'coin_s',name:'코인 주머니',icon:'🪙',cost:38,type:'coins',amount:5000,repeatable:true},
     {id:'coin_m',name:'코인 궤짝',icon:'💰',cost:170,type:'coins',amount:32000,repeatable:true},
     {id:'energy_s',name:'에너지 캡슐',icon:'⚡',cost:42,type:'energy',amount:6000,repeatable:true},
     {id:'energy_m',name:'에너지 배터리',icon:'🔋',cost:180,type:'energy',amount:36000,repeatable:true},
     {id:'egg',name:'수박 알',icon:'🥚',cost:320,type:'pet',target:'pet_ev_watermelon',repeatable:true},
   ]},
  {id:'slingshot', months:[9,10], name:'가을 사과 슬링샷 대회', icon:'🍎', theme:'#dc2626', bg:'linear-gradient(160deg,#431407,#7c2d12)',
   desc:'사과를 당겨서 놓아 과녁을 맞히세요! 드래그로 각도와 힘을 조절합니다. 중앙에 가까울수록 고득점!',
   ptName:'사과 포인트', ptIcon:'🍎',
   rewards:{weapon:{id:'ev_as_wep',cost:280}, armor:{id:'ev_as_armor',cost:480}, job:{id:'ev_as_job',cost:850},
     items:[{id:'ev_as_item1',cost:140},{id:'ev_as_item2',cost:170},{id:'ev_as_item3',cost:210}]},
   shop:[
     {id:'coin_s',name:'코인 주머니',icon:'🪙',cost:38,type:'coins',amount:5000,repeatable:true},
     {id:'coin_m',name:'코인 궤짝',icon:'💰',cost:170,type:'coins',amount:32000,repeatable:true},
     {id:'energy_s',name:'에너지 캡슐',icon:'⚡',cost:42,type:'energy',amount:6000,repeatable:true},
     {id:'energy_m',name:'에너지 배터리',icon:'🔋',cost:180,type:'energy',amount:36000,repeatable:true},
     {id:'egg',name:'사과 알',icon:'🥚',cost:320,type:'pet',target:'pet_ev_slingshot',repeatable:true},
   ]},
  {id:'giftrhythm', months:[11,12], name:'산타의 선물배달', icon:'🎅', theme:'#ef4444', bg:'linear-gradient(160deg,#0c2a3a,#7f1d1d)',
   desc:'굴뚝 3곳으로 떨어지는 선물을 타이밍에 맞춰 클릭하세요! PERFECT일수록 고득점, 콤보를 이어가세요.',
   ptName:'선물 포인트', ptIcon:'🎁',
   rewards:{weapon:{id:'ev_gr_wep',cost:280}, armor:{id:'ev_gr_armor',cost:480}, job:{id:'ev_gr_job',cost:850},
     items:[{id:'ev_gr_item1',cost:140},{id:'ev_gr_item2',cost:170},{id:'ev_gr_item3',cost:210}]},
   shop:[
     {id:'coin_s',name:'코인 주머니',icon:'🪙',cost:38,type:'coins',amount:5000,repeatable:true},
     {id:'coin_m',name:'코인 궤짝',icon:'💰',cost:170,type:'coins',amount:32000,repeatable:true},
     {id:'energy_s',name:'에너지 캡슐',icon:'⚡',cost:42,type:'energy',amount:6000,repeatable:true},
     {id:'energy_m',name:'에너지 배터리',icon:'🔋',cost:180,type:'energy',amount:36000,repeatable:true},
     {id:'egg',name:'선물 알',icon:'🥚',cost:320,type:'pet',target:'pet_ev_giftrhythm',repeatable:true},
   ]},
];

let devModeUnlocked = lJ('hd_devmode', false);
let devEventOverride = lN('hd_dev_event_idx', -1);

function currentEventPeriod(){
  if(devModeUnlocked && devEventOverride>=0 && EVENT_PERIODS[devEventOverride]) return EVENT_PERIODS[devEventOverride];
  const m=new Date().getMonth()+1;
  return EVENT_PERIODS.find(p=>p.months.includes(m)) || EVENT_PERIODS[0];
}
function devCycleEvent(dir){
  if(!devModeUnlocked) return;
  const cur = devEventOverride>=0 ? devEventOverride : EVENT_PERIODS.findIndex(p=>p.id===currentEventPeriod().id);
  devEventOverride=(cur+dir+EVENT_PERIODS.length)%EVENT_PERIODS.length;
  sv('hd_dev_event_idx', devEventOverride);
  renderEventGameScreen();
}

let eventGameData = lJ('hd_event_game2', {});
function saveEventGameData(){ sv('hd_event_game2', eventGameData); }
function genTreasureGrid(){
  const n=64;
  const cells=new Array(n).fill(null).map(()=>({dug:false,reward:'coin_small'}));
  const bigRewards=['weapon','armor','job','item0','item1','item2'];
  const bigSlots=[];
  while(bigSlots.length<bigRewards.length){ const i=Math.floor(Math.random()*n); if(!bigSlots.includes(i)) bigSlots.push(i); }
  bigRewards.forEach((r,idx)=>{ cells[bigSlots[idx]].reward=r; });
  for(let i=0;i<n;i++){
    if(cells[i].reward!=='coin_small') continue;
    const r=Math.random();
    cells[i].reward = r<0.1?'coin_big' : r<0.35?'coin_mid' : r<0.7?'coin_small' : 'empty';
  }
  return cells;
}
function ensureEventGame(pid){
  if(!eventGameData[pid]) eventGameData[pid]={points:0, redeemed:{}};
  if(pid==='treasure' && !eventGameData[pid].treasureGrid) eventGameData[pid].treasureGrid=genTreasureGrid();
  return eventGameData[pid];
}

function redeemEventReward(pid, kind, idx){
  const period=EVENT_PERIODS.find(p=>p.id===pid); if(!period) return;
  const rw = kind==='item' ? (period.rewards.items||[])[idx] : period.rewards[kind];
  if(!rw) return;
  const redeemKey = kind==='item' ? 'item'+idx : kind;
  const gd=ensureEventGame(pid);
  if(gd.redeemed[redeemKey]) return;
  if((gd.points||0)<rw.cost) return;
  gd.points-=rw.cost;
  grantEventItem(kind, rw.id);
  gd.redeemed[redeemKey]=true;
  saveEventGameData();
  _evLastBought='evrw_'+pid+'_'+redeemKey;
  refreshEventPointsUI(period);
  renderEventRewardPanel(period);
  flashBoughtCard();
}
function grantEventItem(kind, id){
  if(kind==='weapon'){ owned[id]=true; saveAll(); }
  else if(kind==='armor'){ owned['ar_'+id]=true; saveAll(); }
  else if(kind==='job'){ ownedJobs[id]=true; saveJobData(); }
  else if(kind==='item'){ ownedItems[id]=true; saveItems(); }
}
let _evLastBought=null;
function flashBoughtCard(){
  if(!_evLastBought) return;
  const el=document.getElementById(_evLastBought);
  if(el){ el.classList.add('flash'); setTimeout(()=>el.classList.remove('flash'),650); }
  _evLastBought=null;
}

// ── 이벤트 화면 렌더 ──
let curEventTab='game';
function setEventTab(tab,btn){
  curEventTab=tab;
  document.querySelectorAll('#sEvent .stab').forEach(b=>b.classList.remove('on'));
  if(btn) btn.classList.add('on');
  const gameEl=document.getElementById('eventGameTab'), shopEl=document.getElementById('eventShopTab');
  if(gameEl) gameEl.style.display = tab==='game' ? 'block' : 'none';
  if(shopEl) shopEl.style.display = tab==='shop' ? 'block' : 'none';
  if(tab==='game') renderEventGameScreen();
  else { stopEventPresentation(); if(bgmUnlocked) startBGM(); renderEventShop(); }
}

let _evTimers=[];
function stopAllEventTimers(){
  _evTimers.forEach(t=>clearInterval(t)); _evTimers=[];
  _gdActive=false; _grActive=false; _wmActive=false;
  if(typeof _asRAF!=='undefined'&&_asRAF){ cancelAnimationFrame(_asRAF); _asRAF=null; }
  _asFlying=null; _asPull=null;
}

function refreshEventPointsUI(period){
  const gd=ensureEventGame(period.id);
  const ptDisp=document.getElementById('eventGamePoints');
  if(ptDisp) ptDisp.innerHTML = period.useCoins ? `🪙 ${coins.toLocaleString()}` : `${period.ptIcon} ${(gd.points||0).toLocaleString()} ${period.ptName}`;
  if(period.id!=='treasure') renderEventRewardPanel(period);
  renderPeriodShop(period);
  updRes();
}

function renderEventRewardPanel(period){
  const gd=ensureEventGame(period.id);
  const panel=document.getElementById('eventRewardPanel');
  if(!panel) return;
  const kinds=['weapon','armor','job'].filter(k=>period.rewards[k]);
  let html = kinds.map(k=>{
    const rw=period.rewards[k];
    const label = k==='weapon'?'⚔️ 전용 무기':k==='armor'?'🛡️ 전용 갑옷':'🎭 전용 직업';
    const name = k==='weapon'?(WEPS[rw.id]?.name||''):k==='armor'?(ARMORS.find(a=>a.id===rw.id)?.name||''):(JOBS.find(j=>j.id===rw.id)?.name||'');
    const icon = k==='weapon'?(WEPS[rw.id]?.icon||'?'):k==='armor'?(ARMORS.find(a=>a.id===rw.id)?.icon||'?'):(JOBS.find(j=>j.id===rw.id)?.icon||'?');
    const done=gd.redeemed[k];
    const can=!done && (gd.points||0)>=rw.cost;
    return `<div id="evrw_${period.id}_${k}" class="ev-card${done?' done':can?' can':''}">
      <div class="ev-ico">${icon}</div>
      <div class="ev-nm">${label}</div>
      <div class="ev-ds">${name}</div>
      ${done
        ? '<div class="ev-done-badge">✅ 획득 완료</div>'
        : `<div class="ev-cost" style="color:${can?'#fbbf24':'#9ca3af'}">${period.ptIcon} ${rw.cost.toLocaleString()}</div><button class="ev-btn" ${can?'':'disabled'} onclick="redeemEventReward('${period.id}','${k}')">교환</button>`}
    </div>`;
  }).join('');
  if(period.rewards.items){
    html += period.rewards.items.map((rw,idx)=>{
      const it=ITEMS.find(x=>x.id===rw.id);
      const done=gd.redeemed['item'+idx];
      const can=!done && (gd.points||0)>=rw.cost;
      return `<div id="evrw_${period.id}_item${idx}" class="ev-card${done?' done':can?' can':''}">
        <div class="ev-ico">${it?.icon||'?'}</div>
        <div class="ev-nm">🎁 전용 아이템</div>
        <div class="ev-ds">${it?.name||''}</div>
        ${done
          ? '<div class="ev-done-badge">✅ 획득 완료</div>'
          : `<div class="ev-cost" style="color:${can?'#fbbf24':'#9ca3af'}">${period.ptIcon} ${rw.cost.toLocaleString()}</div><button class="ev-btn" ${can?'':'disabled'} onclick="redeemEventReward('${period.id}','item',${idx})">교환</button>`}
      </div>`;
    }).join('');
  }
  panel.innerHTML = html;
}

// ── 이벤트별 전용 교환소 (코인/에너지/전용 알) ──
function buyPeriodShopItem(pid, itemId){
  const period=EVENT_PERIODS.find(p=>p.id===pid); if(!period||!period.shop) return;
  const it=period.shop.find(x=>x.id===itemId); if(!it) return;
  const gd=ensureEventGame(pid);
  const balance = period.useCoins ? coins : (gd.points||0);
  gd.shopBought = gd.shopBought||{};
  if(!it.repeatable && gd.shopBought[itemId]) return;
  if(balance<it.cost) return;
  if(period.useCoins){ coins-=it.cost; sv('hd_c',coins); } else { gd.points-=it.cost; }
  if(it.type==='coins'){ coins+=it.amount; sv('hd_c',coins); }
  else if(it.type==='energy'){ energy+=it.amount; sv('hd_e',energy); }
  else if(it.type==='pet'){
    if(typeof ownedPets!=='undefined'){
      if(!ownedPets[it.target]) ownedPets[it.target]={count:0,level:0};
      ownedPets[it.target].count++;
      savePetData();
    }
  }
  if(!it.repeatable) gd.shopBought[itemId]=true;
  saveEventGameData();
  updRes();
  _evLastBought='evps_'+pid+'_'+itemId;
  refreshEventPointsUI(period);
  renderPeriodShop(period);
  flashBoughtCard();
}
function renderPeriodShop(period){
  const wrap=document.getElementById('eventPeriodShopWrap');
  const panel=document.getElementById('eventPeriodShop');
  if(!panel) return;
  if(!period.shop || !period.shop.length){ if(wrap) wrap.style.display='none'; return; }
  if(wrap) wrap.style.display='block';
  const gd=ensureEventGame(period.id);
  gd.shopBought=gd.shopBought||{};
  const balance = period.useCoins ? coins : (gd.points||0);
  panel.innerHTML = period.shop.map(it=>{
    const bought=!it.repeatable && gd.shopBought[it.id];
    const canBuy=!bought && balance>=it.cost;
    const desc = it.type==='coins' ? '🪙 '+it.amount.toLocaleString()+' 획득' :
      it.type==='energy' ? '⚡ '+it.amount.toLocaleString()+' 획득' : '이벤트 전용 펫 획득';
    return `<div id="evps_${period.id}_${it.id}" class="ev-card${bought?' done':canBuy?' can':''}">
      <div class="ev-ico">${it.icon}</div>
      <div class="ev-nm">${it.name}</div>
      <div class="ev-ds">${desc}</div>
      ${bought
        ? '<div class="ev-done-badge">✅ 획득 완료</div>'
        : `<div class="ev-cost" style="color:${canBuy?'#fbbf24':'#9ca3af'}">${period.useCoins?'🪙':period.ptIcon} ${it.cost.toLocaleString()}</div><button class="ev-btn" ${canBuy?'':'disabled'} onclick="buyPeriodShopItem('${period.id}','${it.id}')">교환</button>`}
    </div>`;
  }).join('');
}

// ── 이벤트별 배경음악 (Web Audio 피아노 합성, 잔잔하게) ──
const NOTE_FREQ = {G3:196.00,A3:220.00,B3:246.94,C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392.00,A4:440.00,B4:493.88,C5:523.25,D5:587.33,E5:659.25,F5:698.46,G5:783.99};
// 느긋한 피아노풍 멜로디 (음 사이 여백을 둬서 정신없지 않게)
const EVENT_TUNES = {
  cookwar:    [['C4',.5],['E4',.5],['G4',.5],['C5',1],['G4',.5],['E4',.5],['C4',1]],
  garden:     [['C4',.6],['E4',.6],['G4',.6],['E4',.6],['C4',.6],['F4',.6],['A4',1.2]],
  treasure:   [['C4',.5],['E4',.5],['G4',.5],['C5',1],['B4',.5],['G4',.5],['E4',1]],
  watermelon: [['G4',.5],['E4',.5],['C4',.5],['E4',.5],['G4',.5],['C5',1],['G4',1]],
  slingshot:  [['A3',.6],['C4',.6],['E4',.6],['A4',1.2],['G4',.6],['E4',.6],['C4',1.2]],
  giftrhythm: [['C4',.6],['E4',.6],['G4',.6],['C5',.6],['B4',.6],['G4',.6],['A4',1.2],['G4',1.2]],
};
let _evAudioCtx=null, _evTuneTimer=null, _evTuneToken=0;
function playPianoNote(freq,dur){
  if(!_evAudioCtx) return;
  const t=_evAudioCtx.currentTime;
  const master=_evAudioCtx.createGain();
  master.gain.setValueAtTime(0,t);
  master.gain.linearRampToValueAtTime(0.14,t+0.02);
  master.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  master.connect(_evAudioCtx.destination);
  [[1,1],[2,0.22],[3,0.08]].forEach(([mult,vol])=>{
    const osc=_evAudioCtx.createOscillator();
    const g=_evAudioCtx.createGain();
    g.gain.value=vol;
    osc.type='sine'; osc.frequency.value=freq*mult;
    osc.connect(g); g.connect(master);
    osc.start(t); osc.stop(t+dur);
  });
}
function playEventTune(periodId){
  stopEventTune();
  const tune=EVENT_TUNES[periodId]; if(!tune) return;
  try{ if(!_evAudioCtx) _evAudioCtx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ return; }
  if(!_evAudioCtx) return;
  const myToken=++_evTuneToken;
  let idx=0;
  function playNote(){
    if(myToken!==_evTuneToken) return; // 다른 곡으로 전환됨 - 중복 재생 방지
    const [note,dur]=tune[idx%tune.length];
    const freq=NOTE_FREQ[note];
    if(freq) playPianoNote(freq,dur*0.92);
    idx++;
    _evTuneTimer=setTimeout(playNote, tune[(idx-1)%tune.length][1]*1000);
  }
  playNote();
}
function stopEventTune(){ _evTuneToken++; if(_evTuneTimer){ clearTimeout(_evTuneTimer); _evTuneTimer=null; } }
function playClickPop(freq){
  try{
    if(!_evAudioCtx) _evAudioCtx=new (window.AudioContext||window.webkitAudioContext)();
    const o=_evAudioCtx.createOscillator(), g=_evAudioCtx.createGain();
    o.type='sine'; o.frequency.value=freq||600;
    g.gain.setValueAtTime(0.16,_evAudioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001,_evAudioCtx.currentTime+0.15);
    o.connect(g); g.connect(_evAudioCtx.destination);
    o.start(); o.stop(_evAudioCtx.currentTime+0.15);
  }catch(e){}
}

// ── 이벤트별 배경 앰비언트 (캔버스 파티클) ──
let _evAmbientRAF=null, _evAmbientParticles=[];
function genAmbientParticles(periodId, w, h){
  const cnt = periodId==='giftrhythm' ? 40 : periodId==='slingshot' ? 30 : 24;
  const arr=[];
  for(let i=0;i<cnt;i++){
    arr.push({x:Math.random()*w, y:Math.random()*h, spd:0.3+Math.random()*0.8, drift:(Math.random()-.5)*0.6, size:3+Math.random()*5, phase:Math.random()*Math.PI*2});
  }
  return arr;
}
function startEventAmbient(periodId){
  stopEventAmbient();
  const cv=document.getElementById('eventAmbientCanvas'); if(!cv) return;
  const ctx=cv.getContext('2d');
  function resize(){ cv.width=cv.clientWidth; cv.height=cv.clientHeight||600; }
  resize();
  _evAmbientParticles=genAmbientParticles(periodId, cv.width, cv.height);
  function frame(){
    if(cv.width!==cv.clientWidth||cv.height!==(cv.clientHeight||600)) resize();
    drawEventAmbient(ctx, cv, periodId);
    _evAmbientRAF=requestAnimationFrame(frame);
  }
  _evAmbientRAF=requestAnimationFrame(frame);
}
function stopEventAmbient(){ if(_evAmbientRAF){ cancelAnimationFrame(_evAmbientRAF); _evAmbientRAF=null; } }
function drawEventAmbient(ctx, cv, periodId){
  const w=cv.width, h=cv.height;
  ctx.clearRect(0,0,w,h);
  if(periodId==='garden'){
    // 텃밭: 갈색 이랑 + 은은한 햇살 + 떠다니는 반딧불/꽃가루
    const g=ctx.createLinearGradient(0,0,0,h); g.addColorStop(0,'rgba(74,222,128,0.1)'); g.addColorStop(1,'rgba(20,83,45,0.2)');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    ctx.fillStyle='rgba(120,53,15,0.35)';
    for(let i=0;i<5;i++){ const yy=h*0.65+i*h*0.08; ctx.fillRect(0,yy,w,6); }
    ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.font='20px sans-serif'; ctx.fillText('☀️', w*0.88, h*0.12);
    _evAmbientParticles.forEach(p=>{
      p.y-=p.spd*0.3; p.x+=Math.sin(p.phase+p.y*0.03)*0.6; p.phase+=0.02;
      if(p.y<-10){ p.y=h+10; p.x=Math.random()*w; }
      ctx.globalAlpha=0.5+Math.abs(Math.sin(p.phase))*0.4;
      ctx.fillStyle='#bef264'; ctx.beginPath();ctx.arc(p.x,p.y,p.size*0.4,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=1;
    });
  } else if(periodId==='giftrhythm'){
    const g=ctx.createLinearGradient(0,0,0,h); g.addColorStop(0,'rgba(2,6,23,0.5)'); g.addColorStop(1,'rgba(127,29,29,0.15)');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    ctx.fillStyle='rgba(255,255,255,0.7)';
    for(let i=0;i<40;i++){ const sx=(i*97+30)%w, sy=(i*151+10)%h; ctx.beginPath();ctx.arc(sx,sy,i%5===0?1.6:1,0,Math.PI*2);ctx.fill(); }
    ctx.fillStyle='rgba(226,232,240,0.6)';
    ctx.beginPath();ctx.moveTo(0,h);ctx.lineTo(0,h*0.85);ctx.lineTo(w*0.15,h*0.7);ctx.lineTo(w*0.3,h*0.85);ctx.lineTo(w*0.3,h);ctx.fill();
    ctx.beginPath();ctx.moveTo(w,h);ctx.lineTo(w,h*0.8);ctx.lineTo(w*0.82,h*0.65);ctx.lineTo(w*0.68,h*0.8);ctx.lineTo(w*0.68,h);ctx.fill();
    _evAmbientParticles.forEach(p=>{
      p.y+=p.spd; p.x+=p.drift;
      if(p.y>h){ p.y=-10; p.x=Math.random()*w; }
      ctx.fillStyle='rgba(255,255,255,0.9)';
      ctx.beginPath();ctx.arc(p.x,p.y,p.size*0.5,0,Math.PI*2);ctx.fill();
    });
  } else if(periodId==='cookwar'){
    ctx.fillStyle='rgba(124,45,18,0.15)'; ctx.fillRect(0,0,w,h);
    _evAmbientParticles.forEach(p=>{
      p.y-=p.spd*0.6; p.x+=Math.sin(p.phase+p.y*0.03)*0.7;
      if(p.y<-10){ p.y=h+10; p.x=Math.random()*w; }
      ctx.globalAlpha=0.5;
      ctx.font=p.size*2.5+'px sans-serif'; ctx.fillText('♨️',p.x,p.y);
      ctx.globalAlpha=1;
    });
  } else if(periodId==='treasure'){
    ctx.fillStyle='rgba(180,83,9,0.12)'; ctx.fillRect(0,0,w,h);
    ctx.fillStyle='rgba(120,53,15,0.3)';
    ctx.fillRect(w*0.05,h*0.3,14,h*0.6); ctx.beginPath();ctx.moveTo(w*0.02,h*0.32);ctx.lineTo(w*0.12,h*0.32);ctx.lineTo(w*0.07,h*0.12);ctx.fill();
    ctx.fillRect(w*0.9,h*0.35,14,h*0.55); ctx.beginPath();ctx.moveTo(w*0.87,h*0.37);ctx.lineTo(w*0.97,h*0.37);ctx.lineTo(w*0.92,h*0.18);ctx.fill();
    _evAmbientParticles.forEach(p=>{
      p.phase+=0.05;
      ctx.globalAlpha=Math.abs(Math.sin(p.phase))*0.8;
      ctx.fillStyle='#fbbf24'; ctx.beginPath();ctx.arc(p.x,p.y,p.size*0.4,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=1;
    });
  } else if(periodId==='watermelon'){
    const g=ctx.createLinearGradient(0,0,0,h); g.addColorStop(0,'rgba(56,189,248,0.12)'); g.addColorStop(0.55,'rgba(245,158,11,0.1)'); g.addColorStop(1,'rgba(180,83,9,0.18)');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    ctx.strokeStyle='rgba(255,255,255,0.2)'; ctx.lineWidth=2;
    ctx.beginPath(); for(let x=0;x<=w;x+=20){ ctx.lineTo(x, h*0.5+Math.sin(x*0.04+Date.now()/900)*6); } ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.font='20px sans-serif'; ctx.fillText('☀️', w*0.88, h*0.12);
  } else if(periodId==='slingshot'){
    const g=ctx.createLinearGradient(0,0,0,h); g.addColorStop(0,'rgba(124,45,18,0.2)'); g.addColorStop(1,'rgba(67,20,7,0.3)');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    _evAmbientParticles.forEach(p=>{
      p.y+=p.spd*0.5; p.x+=Math.sin(p.phase+p.y*0.02)*0.6; p.phase+=0.015; p.rot=(p.rot||0)+0.02;
      if(p.y>h){ p.y=-10; p.x=Math.random()*w; }
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
      ctx.globalAlpha=0.5; ctx.font=p.size*2.6+'px sans-serif'; ctx.fillText('🍁',0,0);
      ctx.restore(); ctx.globalAlpha=1;
    });
  }
}

function renderEventGameScreen(){
  const period=currentEventPeriod();
  const gd=ensureEventGame(period.id);
  const sEventEl=document.getElementById('sEvent');
  if(sEventEl && period.bg) sEventEl.style.background=period.bg;
  const banner=document.getElementById('eventBanner');
  if(banner) banner.innerHTML = `<div style="font-size:34px;">${period.icon}</div><div style="font-size:18px;font-weight:900;color:${period.theme}">${period.name}</div><div style="font-size:11px;color:#e5e7eb;max-width:520px;margin:4px auto;">${period.desc}</div>`;
  refreshEventPointsUI(period);
  const devBar=document.getElementById('eventDevBar');
  if(devBar) devBar.style.display = devModeUnlocked ? 'flex' : 'none';
  const devLabel=document.getElementById('eventDevLabel');
  if(devLabel) devLabel.textContent = (devEventOverride>=0?'🛠️ DEV: ':'')+period.name;
  const panel=document.getElementById('eventRewardPanel');
  if(panel) panel.style.display = period.id==='treasure' ? 'none' : 'grid';
  stopAllEventTimers();
  const area=document.getElementById('eventGameArea');
  if(!area) return;
  area.innerHTML='';
  if(period.id==='cookwar') renderCookWar(area);
  else if(period.id==='garden') renderGarden(area);
  else if(period.id==='treasure') renderTreasure(area);
  else if(period.id==='watermelon') renderWatermelon(area);
  else if(period.id==='slingshot') renderSlingshot(area);
  else if(period.id==='giftrhythm') renderGiftRhythm(area);
  renderPeriodShop(period);
  if(_evLastPeriodId!==period.id){
    _evLastPeriodId=period.id;
    startEventAmbient(period.id);
    if(bgmUnlocked){ stopBGM(); playEventTune(period.id); }
  }
}
let _evLastPeriodId=null;
function stopEventPresentation(){
  stopEventAmbient();
  stopEventTune();
  _evLastPeriodId=null;
}

// ── 공용 이펙트 헬퍼 (파티클 버스트 / 플로팅 텍스트) ──
function spawnBurstFx(container,x,y,color,cnt){
  for(let i=0;i<(cnt||8);i++){
    const p=document.createElement('div');
    const ang=(i/(cnt||8))*Math.PI*2+Math.random()*.4;
    const dist=30+Math.random()*20;
    p.style.cssText=`position:absolute;left:${x}px;top:${y}px;width:6px;height:6px;border-radius:50%;background:${color};pointer-events:none;transition:transform .5s ease-out, opacity .5s ease-out;opacity:1;z-index:5;`;
    container.appendChild(p);
    requestAnimationFrame(()=>{ p.style.transform=`translate(${Math.cos(ang)*dist}px,${Math.sin(ang)*dist}px)`; p.style.opacity='0'; });
    setTimeout(()=>{ if(p.parentNode) p.remove(); },550);
  }
}
function spawnFloatText(container,x,y,text,color){
  const t=document.createElement('div');
  t.textContent=text;
  t.style.cssText=`position:absolute;left:${x}px;top:${y}px;color:${color};font-weight:900;font-size:13px;text-shadow:0 1px 4px rgba(0,0,0,.6);pointer-events:none;transition:transform .75s ease-out, opacity .75s ease-out;opacity:1;white-space:nowrap;z-index:5;`;
  container.appendChild(t);
  requestAnimationFrame(()=>{ t.style.transform='translateY(-34px)'; t.style.opacity='0'; });
  setTimeout(()=>{ if(t.parentNode) t.remove(); },800);
}

// ══ A. 요리전쟁 ══
const RECIPES = [
  {name:'김치찌개', icon:'🍲', ing:['🥬','🥩','🌶️']},
  {name:'돈까스',   icon:'🍱', ing:['🐷','🍞','🥚']},
  {name:'초밥',     icon:'🍣', ing:['🐟','🍚','🌊']},
  {name:'피자',     icon:'🍕', ing:['🍅','🧀','🍞']},
  {name:'라면',     icon:'🍜', ing:['🍜','🥚','🌶️']},
  {name:'스테이크', icon:'🥩', ing:['🐄','🧈','🧂']},
  {name:'샐러드',   icon:'🥗', ing:['🥬','🍅','🥒']},
  {name:'케이크',   icon:'🍰', ing:['🥚','🧈','🍓']},
];
const INGREDIENT_POOL = ['🥬','🥩','🌶️','🐷','🍞','🥚','🐟','🍚','🌊','🍅','🧀','🍜','🐄','🧈','🧂','🥒','🍓'];
let _cwRecipe=null, _cwSelected=[];
function newCookRecipe(){ _cwRecipe=RECIPES[Math.floor(Math.random()*RECIPES.length)]; _cwSelected=[]; }
function renderCookWar(area){
  if(!_cwRecipe) newCookRecipe();
  const d=document.createElement('div');
  d.style.cssText='text-align:center;';
  d.innerHTML=`
    <div style="font-size:13px;color:#e5e7eb;margin-bottom:8px;">🍽️ 주문서: <b style="color:#fbbf24">${_cwRecipe.name}</b> ${_cwRecipe.icon}</div>
    <div id="cwTarget" style="display:flex;gap:8px;justify-content:center;margin-bottom:14px;"></div>
    <div id="cwSelected" style="display:flex;gap:8px;justify-content:center;min-height:44px;margin-bottom:14px;background:rgba(255,255,255,.06);border-radius:10px;padding:6px;max-width:400px;margin-left:auto;margin-right:auto;"></div>
    <div id="cwPalette" style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;max-width:480px;margin:0 auto 14px;"></div>
    <button class="bybtn" id="cwSubmit" style="padding:8px 24px;">🍳 셰프에게 제출</button>
    <div id="cwMsg" style="font-size:12px;font-weight:700;margin-top:8px;min-height:16px;"></div>
  `;
  area.appendChild(d);
  const target=d.querySelector('#cwTarget');
  _cwRecipe.ing.forEach(ic=>{ const s=document.createElement('div'); s.style.cssText='font-size:26px;'; s.textContent=ic; target.appendChild(s); });
  renderCookSelected(); renderCookPalette();
  d.querySelector('#cwSubmit').onclick=submitCookRecipe;
}
function renderCookSelected(){
  const el=document.getElementById('cwSelected'); if(!el)return;
  el.innerHTML='';
  _cwSelected.forEach((ic,i)=>{
    const s=document.createElement('div'); s.style.cssText='font-size:24px;cursor:pointer;';
    s.textContent=ic; s.onclick=()=>{ _cwSelected.splice(i,1); renderCookSelected(); };
    el.appendChild(s);
  });
}
function renderCookPalette(){
  const el=document.getElementById('cwPalette'); if(!el)return;
  el.innerHTML='';
  INGREDIENT_POOL.forEach(ic=>{
    const b=document.createElement('button');
    b.className='bybtn'; b.style.cssText='font-size:20px;padding:6px 10px;';
    b.textContent=ic;
    b.onclick=()=>{ if(_cwSelected.length<_cwRecipe.ing.length){ _cwSelected.push(ic); renderCookSelected(); } };
    el.appendChild(b);
  });
}
function submitCookRecipe(){
  const need=[..._cwRecipe.ing].sort().join(',');
  const got=[..._cwSelected].sort().join(',');
  const period=currentEventPeriod();
  const gd=ensureEventGame(period.id);
  if(need===got && _cwSelected.length===_cwRecipe.ing.length){
    gd.points=(gd.points||0)+15;
    saveEventGameData();
    playClickPop(740);
    newCookRecipe();
    const area=document.getElementById('eventGameArea');
    if(area){ area.innerHTML=''; renderCookWar(area); }
    refreshEventPointsUI(period);
    const newMsg=document.getElementById('cwMsg');
    if(newMsg){ newMsg.style.color='#4ade80'; newMsg.textContent='✅ 셰프: "훌륭해요! +15 요리 포인트"'; }
  } else {
    const msg=document.getElementById('cwMsg');
    if(msg){ msg.style.color='#ef4444'; msg.textContent='❌ 셰프: "음... 다시 만들어볼까요?"'; }
    _cwSelected=[];
    renderCookSelected();
  }
}

// ══ B. 봄맞이 텃밭 가꾸기 (씨앗 심기→수확) ══
let _gdActive=false, _gdTimeLeft=0, _gdTickItv=null, _gdTimerItv=null, _gdPlots=[];
const GD_PLOT_COUNT=12, GD_GROW_MS=2400, GD_WILT_MS=2600;
function renderGarden(area){
  _gdPlots = new Array(GD_PLOT_COUNT).fill(null).map(()=>({state:'empty', t:0, gold:false}));
  const d=document.createElement('div');
  d.innerHTML=`
    <div style="text-align:center;margin-bottom:8px;font-size:12px;color:#e5e7eb;">빈 밭을 클릭해 씨앗을 심고, 활짝 피면 클릭해 수확하세요! 너무 늦으면 시들어요.</div>
    <div style="text-align:center;margin-bottom:8px;"><button class="bybtn" id="gdStart">▶ 라운드 시작 (40초)</button> <span id="gdTimer" style="font-weight:800;color:#4ade80;margin-left:10px;"></span></div>
    <div id="gdArea" style="position:relative;max-width:460px;margin:0 auto;padding:14px;border-radius:14px;background:linear-gradient(180deg,#78350f,#451a03);border:2px solid #92400e;">
      <div id="gdGrid" style="position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:8px;"></div>
    </div>
  `;
  area.appendChild(d);
  const grid=d.querySelector('#gdGrid');
  for(let i=0;i<GD_PLOT_COUNT;i++){
    const cell=document.createElement('div');
    cell.id='gdCell'+i;
    cell.style.cssText='aspect-ratio:1;border-radius:10px;background:#5c3d1a;border:2px solid #3f2610;display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer;transition:background .2s;';
    cell.textContent='🟫';
    cell.onclick=()=>clickGardenPlot(i);
    grid.appendChild(cell);
  }
  d.querySelector('#gdStart').onclick=startGardenRound;
}
function startGardenRound(){
  if(_gdActive) return;
  _gdActive=true; _gdTimeLeft=40;
  const timerEl=document.getElementById('gdTimer');
  _gdTimerItv=setInterval(()=>{
    _gdTimeLeft--;
    if(timerEl) timerEl.textContent='⏰ '+_gdTimeLeft+'초';
    if(_gdTimeLeft<=0) endGardenRound();
  },1000);
  _evTimers.push(_gdTimerItv);
  _gdTickItv=setInterval(tickGardenPlots,150);
  _evTimers.push(_gdTickItv);
}
function endGardenRound(){
  _gdActive=false;
  clearInterval(_gdTickItv); clearInterval(_gdTimerItv);
  for(let i=0;i<GD_PLOT_COUNT;i++){
    _gdPlots[i]={state:'empty',t:0,gold:false};
    const cell=document.getElementById('gdCell'+i);
    if(cell) cell.textContent='🟫';
  }
  const timerEl=document.getElementById('gdTimer');
  if(timerEl) timerEl.textContent='라운드 종료! 다시 시작하려면 버튼을 누르세요';
}
function tickGardenPlots(){
  if(!_gdActive) return;
  const now=Date.now();
  for(let i=0;i<GD_PLOT_COUNT;i++){
    const p=_gdPlots[i]; const cell=document.getElementById('gdCell'+i);
    if(!cell) continue;
    if(p.state==='growing'){
      const el=now-p.t, pct=el/GD_GROW_MS;
      cell.textContent = pct<0.33?'🌱' : pct<0.7?'🌿' : (p.gold?'✨':'🌸');
      if(pct>=1){ p.state='bloomed'; p.t=now; }
    } else if(p.state==='bloomed'){
      if(now-p.t>GD_WILT_MS){ p.state='wilted'; cell.textContent='🥀'; }
    }
  }
}
function clickGardenPlot(i){
  if(!_gdActive) return;
  const p=_gdPlots[i]; const cell=document.getElementById('gdCell'+i);
  if(!p||!cell) return;
  const period=currentEventPeriod(); const gd=ensureEventGame(period.id);
  if(p.state==='empty'){
    p.state='growing'; p.t=Date.now(); p.gold=Math.random()<0.18;
    cell.textContent='🌱';
  } else if(p.state==='bloomed'){
    const pts=p.gold?15:5;
    gd.points=(gd.points||0)+pts;
    if(p.gold){ coins+=40; sv('hd_c',coins); }
    saveEventGameData();
    const grid=cell.parentElement;
    if(grid) spawnBurstFx(grid, cell.offsetLeft+cell.offsetWidth/2, cell.offsetTop+cell.offsetHeight/2, p.gold?'#fbbf24':'#f472b6', p.gold?12:7);
    if(grid) spawnFloatText(grid, cell.offsetLeft+cell.offsetWidth/2, cell.offsetTop, '+'+pts+(p.gold?' 🪙+40':''), p.gold?'#fbbf24':'#f9a8d4');
    playClickPop(p.gold?880:660);
    refreshEventPointsUI(period);
    p.state='empty'; cell.textContent='🟫';
  } else if(p.state==='wilted'){
    p.state='empty'; cell.textContent='🟫';
  }
}

// ══ C. 보물찾기 대회 ══
const TREASURE_COIN_TABLE = {coin_small:1500, coin_mid:5000, coin_big:15000, empty:0};
const TREASURE_DIG_COST = 2000;
function treasureCellIcon(reward){
  return {weapon:'⚔️',armor:'🛡️',job:'🎭',item0:'🎁',item1:'🎁',item2:'🎁',coin_big:'💰',coin_mid:'🪙',coin_small:'🥉',empty:'💨'}[reward]||'❓';
}
function renderTreasure(area){
  const period=currentEventPeriod(); const gd=ensureEventGame(period.id);
  const d=document.createElement('div');
  d.style.cssText='text-align:center;';
  d.innerHTML=`<div style="font-size:12px;color:#e5e7eb;margin-bottom:8px;">한 칸당 🪙${TREASURE_DIG_COST.toLocaleString()}으로 땅을 파세요! (보유 코인 ${coins.toLocaleString()})</div>
    <div id="trGrid" style="display:grid;grid-template-columns:repeat(8,1fr);gap:5px;max-width:420px;margin:0 auto;"></div>
    <div id="trMsg" style="font-size:12px;font-weight:700;margin-top:10px;min-height:16px;"></div>`;
  area.appendChild(d);
  const grid=d.querySelector('#trGrid');
  gd.treasureGrid.forEach((cell,i)=>{
    const b=document.createElement('button');
    b.style.cssText='aspect-ratio:1;font-size:18px;border-radius:8px;border:2px solid #92400e;background:'+(cell.dug?'#78350f':'#b45309')+';cursor:pointer;color:#fff;';
    b.textContent = cell.dug ? treasureCellIcon(cell.reward) : '❓';
    b.disabled = cell.dug;
    b.onclick=()=>digTreasureCell(i);
    grid.appendChild(b);
  });
}
function digTreasureCell(i){
  const period=currentEventPeriod(); const gd=ensureEventGame(period.id);
  const cell=gd.treasureGrid[i];
  if(!cell||cell.dug) return;
  if(coins<TREASURE_DIG_COST){
    const msg=document.getElementById('trMsg');
    if(msg){ msg.style.color='#ef4444'; msg.textContent='❌ 코인이 부족합니다!'; }
    return;
  }
  coins-=TREASURE_DIG_COST; sv('hd_c',coins);
  cell.dug=true;
  let msgColor='#4ade80', msgText='';
  if(cell.reward==='weapon'){ owned[period.rewards.weapon.id]=true; saveAll(); msgColor='#fbbf24'; msgText='🎉 대박! 전용 무기 획득: '+WEPS[period.rewards.weapon.id].name; }
  else if(cell.reward==='armor'){ owned['ar_'+period.rewards.armor.id]=true; saveAll(); msgColor='#fbbf24'; msgText='🎉 대박! 전용 갑옷 획득: '+ARMORS.find(a=>a.id===period.rewards.armor.id).name; }
  else if(cell.reward==='job'){ ownedJobs[period.rewards.job.id]=true; saveJobData(); msgColor='#fbbf24'; msgText='🎉 대박! 전용 직업 획득: '+JOBS.find(j=>j.id===period.rewards.job.id).name; }
  else if(cell.reward==='item0'||cell.reward==='item1'||cell.reward==='item2'){
    const idx=parseInt(cell.reward.slice(-1));
    const itDef=period.rewards.items[idx];
    ownedItems[itDef.id]=true; saveItems();
    msgColor='#fbbf24'; msgText='🎉 대박! 전용 아이템 획득: '+(ITEMS.find(x=>x.id===itDef.id)?.name||'');
  }
  else if(cell.reward==='empty'){ msgColor='#9ca3af'; msgText='💨 꽝... 아무것도 없네요'; }
  else { const amt=TREASURE_COIN_TABLE[cell.reward]||0; coins+=amt; sv('hd_c',coins); msgText='🪙 +'+amt.toLocaleString()+' 코인 발견!'; }
  saveEventGameData();
  refreshEventPointsUI(period);
  const area=document.getElementById('eventGameArea');
  if(area){ area.innerHTML=''; renderTreasure(area); }
  const newMsg=document.getElementById('trMsg');
  if(newMsg){ newMsg.style.color=msgColor; newMsg.textContent=msgText; }
}

// ══ D. 여름 수박격파 대회 ══
let _wmActive=false, _wmSpawnItv=null, _wmTimerItv=null, _wmTimeLeft=0;
function renderWatermelon(area){
  const d=document.createElement('div');
  d.innerHTML=`
    <div style="text-align:center;margin-bottom:8px;font-size:12px;color:#e5e7eb;">날아오는 수박을 클릭해 격파하세요! 🥇황금 수박=대박, 💣폭탄 수박은 피하세요!</div>
    <div style="text-align:center;margin-bottom:8px;"><button class="bybtn" id="wmStart">▶ 라운드 시작 (30초)</button> <span id="wmTimer" style="font-weight:800;color:#22c55e;margin-left:10px;"></span></div>
    <div id="wmArea" style="position:relative;width:100%;max-width:600px;height:320px;margin:0 auto;background:linear-gradient(180deg,#7dd3fc 0%,#38bdf8 55%,#f2d29b 55%,#e0b876 100%);border-radius:14px;overflow:hidden;border:2px solid #f59e0b;">
      <div style="position:absolute;top:10px;right:24px;font-size:26px;filter:drop-shadow(0 0 10px rgba(255,220,120,.8));">☀️</div>
      <div style="position:absolute;bottom:8px;left:4%;font-size:44px;opacity:.9;">🌴</div>
      <div style="position:absolute;bottom:2px;right:4%;font-size:52px;opacity:.9;transform:scaleX(-1);">🌴</div>
      <div class="fs-wave" style="position:absolute;top:42%;left:0;width:200%;height:16px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 20px,transparent 20px 40px);"></div>
    </div>
  `;
  area.appendChild(d);
  d.querySelector('#wmStart').onclick=startWatermelonRound;
}
function startWatermelonRound(){
  if(_wmActive) return;
  _wmActive=true; _wmTimeLeft=30;
  const timerEl=document.getElementById('wmTimer');
  _wmTimerItv=setInterval(()=>{
    _wmTimeLeft--;
    if(timerEl) timerEl.textContent='⏰ '+_wmTimeLeft+'초';
    if(_wmTimeLeft<=0) endWatermelonRound();
  },1000);
  _evTimers.push(_wmTimerItv);
  _wmSpawnItv=setInterval(spawnWatermelon,600);
  _evTimers.push(_wmSpawnItv);
}
function endWatermelonRound(){
  _wmActive=false;
  clearInterval(_wmSpawnItv); clearInterval(_wmTimerItv);
  const playArea=document.getElementById('wmArea');
  if(playArea) playArea.querySelectorAll('.wm-el').forEach(w=>w.remove());
  const timerEl=document.getElementById('wmTimer');
  if(timerEl) timerEl.textContent='라운드 종료!';
}
function spawnWatermelon(){
  const playArea=document.getElementById('wmArea'); if(!playArea) return;
  const r=Math.random();
  const type = r<0.1?'bomb' : r<0.3?'gold' : 'normal';
  const fromLeft = Math.random()<0.5;
  const wrap=document.createElement('div');
  wrap.className='wm-el';
  const dur=2+Math.random()*1.2;
  const topPos=15+Math.random()*55;
  wrap.style.cssText=`position:absolute;top:${topPos}%;${fromLeft?'left:-40px':'right:-40px'};font-size:${type==='bomb'?30:34}px;cursor:pointer;user-select:none;transition:${fromLeft?'left':'right'} ${dur}s linear;filter:${type==='gold'?'drop-shadow(0 0 10px #fbbf24) saturate(1.6)':'none'};animation:wm-bob 0.6s ease-in-out infinite alternate;`;
  wrap.textContent = type==='bomb'?'💣':'🍉';
  playArea.appendChild(wrap);
  requestAnimationFrame(()=>{ wrap.style[fromLeft?'left':'right']='calc(100% + 10px)'; });
  const removeTimer=setTimeout(()=>{ if(wrap.parentNode) wrap.remove(); }, dur*1000+50);
  wrap.onclick=()=>{
    if(!_wmActive) return;
    clearTimeout(removeTimer);
    const period=currentEventPeriod(); const gd=ensureEventGame(period.id);
    const px=wrap.offsetLeft, py=wrap.offsetTop;
    if(type==='bomb'){
      gd.points=Math.max(0,(gd.points||0)-5);
      spawnBurstFx(playArea, px, py, '#ef4444', 10);
      spawnFloatText(playArea, px, py, '-5 💥', '#ef4444');
      playClickPop(160);
    } else {
      const pts = type==='gold'?15:5;
      gd.points=(gd.points||0)+pts;
      if(type==='gold'){ coins+=50; sv('hd_c',coins); }
      spawnBurstFx(playArea, px, py, type==='gold'?'#fbbf24':'#ef4444', type==='gold'?12:8);
      spawnFloatText(playArea, px, py, '+'+pts+(type==='gold'?' 🪙+50':''), type==='gold'?'#fbbf24':'#fff');
      playClickPop(type==='gold'?880:660);
    }
    saveEventGameData();
    refreshEventPointsUI(period);
    wrap.remove();
  };
}

// ══ E. 가을 사과 슬링샷 대회 (드래그 발사 물리 게임) ══
let _asCanvas=null, _asCtx=null, _asAnchor={x:70,y:250}, _asPull=null, _asFlying=null, _asRAF=null;
const AS_TARGET={x:430,y:170,r:70};
function renderSlingshot(area){
  const d=document.createElement('div');
  d.innerHTML=`
    <div style="text-align:center;margin-bottom:8px;font-size:12px;color:#e5e7eb;">사과를 눌러서 당긴 뒤 놓아 과녁을 맞히세요! 중앙에 가까울수록 고득점</div>
    <canvas id="asCanvas" width="500" height="320" style="display:block;margin:0 auto;background:linear-gradient(180deg,#7dd3fc,#fde68a 65%,#a16207);border-radius:14px;border:2px solid #92400e;cursor:pointer;touch-action:none;max-width:100%;"></canvas>
    <div id="asMsg" style="text-align:center;font-size:12px;font-weight:700;margin-top:10px;min-height:16px;"></div>
  `;
  area.appendChild(d);
  _asCanvas=d.querySelector('#asCanvas');
  _asCtx=_asCanvas.getContext('2d');
  _asPull=null; _asFlying=null;
  _asCanvas.addEventListener('pointerdown', asPointerDown);
  _asCanvas.addEventListener('pointermove', asPointerMove);
  window.removeEventListener('pointerup', asPointerUp);
  window.addEventListener('pointerup', asPointerUp);
  drawSlingshotScene();
}
function asLocalPos(e){
  const rect=_asCanvas.getBoundingClientRect();
  return {x:(e.clientX-rect.left)*(_asCanvas.width/rect.width), y:(e.clientY-rect.top)*(_asCanvas.height/rect.height)};
}
function asPointerDown(e){
  if(_asFlying) return;
  const p=asLocalPos(e);
  if(Math.hypot(p.x-_asAnchor.x,p.y-_asAnchor.y)<44) _asPull={x:p.x,y:p.y};
}
function asPointerMove(e){
  if(!_asPull||!_asCanvas) return;
  const p=asLocalPos(e);
  const dx=p.x-_asAnchor.x, dy=p.y-_asAnchor.y;
  const dist=Math.min(75,Math.hypot(dx,dy));
  const ang=Math.atan2(dy,dx);
  _asPull={x:_asAnchor.x+Math.cos(ang)*dist, y:_asAnchor.y+Math.sin(ang)*dist};
  drawSlingshotScene();
}
function asPointerUp(){
  if(!_asPull||!_asCtx) return;
  const dx=_asAnchor.x-_asPull.x, dy=_asAnchor.y-_asPull.y;
  if(Math.hypot(dx,dy)<15){ _asPull=null; drawSlingshotScene(); return; }
  const power=0.17;
  _asFlying={x:_asAnchor.x, y:_asAnchor.y, vx:dx*power, vy:dy*power};
  _asPull=null;
  if(_asRAF) cancelAnimationFrame(_asRAF);
  runSlingshotFlight();
}
function runSlingshotFlight(){
  function tick(){
    if(!_asFlying) return;
    _asFlying.vy+=0.32;
    _asFlying.x+=_asFlying.vx; _asFlying.y+=_asFlying.vy;
    drawSlingshotScene();
    if(_asFlying.y>320||_asFlying.x>520||_asFlying.x<-20){ finishSlingshotShot(false); return; }
    if(Math.hypot(_asFlying.x-AS_TARGET.x,_asFlying.y-AS_TARGET.y)<AS_TARGET.r){ finishSlingshotShot(true); return; }
    _asRAF=requestAnimationFrame(tick);
  }
  _asRAF=requestAnimationFrame(tick);
}
function finishSlingshotShot(hit){
  if(_asRAF){ cancelAnimationFrame(_asRAF); _asRAF=null; }
  const period=currentEventPeriod(); const gd=ensureEventGame(period.id);
  const msg=document.getElementById('asMsg');
  if(hit){
    const dist=Math.hypot(_asFlying.x-AS_TARGET.x,_asFlying.y-AS_TARGET.y);
    const pts = dist<20?25 : dist<40?15 : 8;
    gd.points=(gd.points||0)+pts;
    saveEventGameData();
    playClickPop(dist<20?900:dist<40?740:600);
    if(msg){ msg.style.color=dist<20?'#fbbf24':'#4ade80'; msg.textContent=(dist<20?'🎯 퍼펙트 명중! ':'🍎 명중! ')+'+'+pts; }
  } else if(msg){ msg.style.color='#9ca3af'; msg.textContent='아쉽네요, 빗나갔어요...'; }
  refreshEventPointsUI(period);
  _asFlying=null;
  drawSlingshotScene();
}
function drawSlingshotScene(){
  const ctx=_asCtx; if(!ctx) return;
  ctx.clearRect(0,0,500,320);
  [70,46,22].forEach((r,i)=>{
    ctx.beginPath(); ctx.arc(AS_TARGET.x,AS_TARGET.y,r,0,Math.PI*2);
    ctx.fillStyle = i===0?'#ef4444':i===1?'#f8fafc':'#dc2626';
    ctx.fill();
  });
  ctx.strokeStyle='#78350f'; ctx.lineWidth=6; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(_asAnchor.x-14,_asAnchor.y+40); ctx.lineTo(_asAnchor.x,_asAnchor.y-4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(_asAnchor.x+14,_asAnchor.y+40); ctx.lineTo(_asAnchor.x,_asAnchor.y-4); ctx.stroke();
  const applePos = _asPull || _asFlying || _asAnchor;
  ctx.strokeStyle='#451a03'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(_asAnchor.x-14,_asAnchor.y+40); ctx.lineTo(applePos.x,applePos.y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(_asAnchor.x+14,_asAnchor.y+40); ctx.lineTo(applePos.x,applePos.y); ctx.stroke();
  ctx.font='26px sans-serif'; ctx.textAlign='center'; ctx.fillText('🍎',applePos.x,applePos.y+9);
}

// ══ F. 산타의 선물배달 (레인 리듬 게임) ══
let _grActive=false, _grSpawnItv=null, _grTimerItv=null, _grTimeLeft=0, _grCombo=0, _grGifts=[];
function renderGiftRhythm(area){
  const d=document.createElement('div');
  d.innerHTML=`
    <div style="text-align:center;margin-bottom:8px;font-size:12px;color:#e5e7eb;">선물이 초록 히트존에 들어왔을 때 해당 레인 버튼을 클릭하세요!</div>
    <div style="text-align:center;margin-bottom:8px;"><button class="bybtn" id="grStart">▶ 라운드 시작 (40초)</button> <span id="grTimer" style="font-weight:800;color:#ef4444;margin-left:10px;"></span> <span id="grCombo" style="font-weight:800;color:#fbbf24;margin-left:10px;"></span></div>
    <div id="grArea" style="position:relative;width:100%;max-width:420px;height:320px;margin:0 auto;background:linear-gradient(180deg,#0c2a3a,#1e3a5f);border-radius:14px;overflow:hidden;border:2px solid #7f1d1d;">
      <div style="position:absolute;top:0;left:33.3%;width:1px;height:100%;background:rgba(255,255,255,.12);"></div>
      <div style="position:absolute;top:0;left:66.6%;width:1px;height:100%;background:rgba(255,255,255,.12);"></div>
      <div style="position:absolute;top:78%;left:0;width:100%;height:10%;background:rgba(74,222,128,.18);border-top:2px dashed rgba(74,222,128,.6);border-bottom:2px dashed rgba(74,222,128,.6);"></div>
      <div id="grLane0" style="position:absolute;left:0%;top:0;width:33.3%;height:100%;"></div>
      <div id="grLane1" style="position:absolute;left:33.3%;top:0;width:33.3%;height:100%;"></div>
      <div id="grLane2" style="position:absolute;left:66.6%;top:0;width:33.3%;height:100%;"></div>
    </div>
    <div style="display:flex;gap:8px;justify-content:center;margin-top:10px;max-width:420px;margin-left:auto;margin-right:auto;">
      <button class="bybtn" style="flex:1;padding:14px 0;font-size:20px;" onclick="hitGiftLane(0)">🏠</button>
      <button class="bybtn" style="flex:1;padding:14px 0;font-size:20px;" onclick="hitGiftLane(1)">🏠</button>
      <button class="bybtn" style="flex:1;padding:14px 0;font-size:20px;" onclick="hitGiftLane(2)">🏠</button>
    </div>
  `;
  area.appendChild(d);
  d.querySelector('#grStart').onclick=startGiftRound;
}
function startGiftRound(){
  if(_grActive) return;
  _grActive=true; _grTimeLeft=40; _grCombo=0; _grGifts=[];
  updateGiftCombo();
  const timerEl=document.getElementById('grTimer');
  _grTimerItv=setInterval(()=>{
    _grTimeLeft--;
    if(timerEl) timerEl.textContent='⏰ '+_grTimeLeft+'초';
    if(_grTimeLeft<=0) endGiftRound();
  },1000);
  _evTimers.push(_grTimerItv);
  _grSpawnItv=setInterval(spawnGift,900);
  _evTimers.push(_grSpawnItv);
}
function endGiftRound(){
  _grActive=false;
  clearInterval(_grSpawnItv); clearInterval(_grTimerItv);
  const area=document.getElementById('grArea');
  if(area) area.querySelectorAll('.gift-el').forEach(g=>g.remove());
  _grGifts=[];
  const timerEl=document.getElementById('grTimer');
  if(timerEl) timerEl.textContent='라운드 종료!';
}
function spawnGift(){
  if(!_grActive) return;
  const lane=Math.floor(Math.random()*3);
  const laneEl=document.getElementById('grLane'+lane); if(!laneEl) return;
  const el=document.createElement('div');
  el.className='gift-el';
  el.textContent='🎁';
  const dur=2.4;
  el.style.cssText=`position:absolute;top:-30px;left:50%;transform:translateX(-50%);font-size:26px;transition:top ${dur}s linear;user-select:none;`;
  laneEl.appendChild(el);
  requestAnimationFrame(()=>{ el.style.top='300px'; });
  const giftObj={el, lane, spawnT:Date.now(), dur};
  _grGifts.push(giftObj);
  setTimeout(()=>{
    if(el.parentNode) el.remove();
    _grGifts=_grGifts.filter(g=>g!==giftObj);
    if(_grActive){ _grCombo=0; updateGiftCombo(); }
  }, dur*1000+80);
}
function hitGiftLane(lane){
  if(!_grActive) return;
  const candidates=_grGifts.filter(g=>g.lane===lane);
  if(candidates.length===0) return;
  let best=null, bestDist=999;
  candidates.forEach(g=>{
    const elapsed=Date.now()-g.spawnT;
    const pct=elapsed/(g.dur*1000);
    const dist=Math.abs(pct-0.83);
    if(dist<bestDist){ bestDist=dist; best=g; }
  });
  if(!best||bestDist>0.22) return;
  const period=currentEventPeriod(); const gd=ensureEventGame(period.id);
  let pts, label, color;
  if(bestDist<0.05){ pts=25; label='PERFECT!'; color='#fbbf24'; _grCombo++; }
  else if(bestDist<0.12){ pts=12; label='GOOD'; color='#4ade80'; _grCombo++; }
  else { pts=4; label='OK'; color='#e5e7eb'; _grCombo=0; }
  pts += Math.min(_grCombo,10)*2;
  gd.points=(gd.points||0)+pts;
  saveEventGameData();
  const area=document.getElementById('grArea');
  if(area) spawnFloatText(area, best.el.offsetLeft+best.el.parentElement.offsetLeft, best.el.offsetTop, label+' +'+pts, color);
  playClickPop(label==='PERFECT!'?880:label==='GOOD'?660:440);
  if(best.el.parentNode) best.el.remove();
  _grGifts=_grGifts.filter(g=>g!==best);
  updateGiftCombo();
  refreshEventPointsUI(period);
}
function updateGiftCombo(){ const el=document.getElementById('grCombo'); if(el) el.textContent = _grCombo>1?'🔥 콤보 x'+_grCombo:''; }

// ── 이벤트 상점 (기존, 상시 운영) ──
const EVENT_SHOP = [
  {id:'ev_coin_s',  name:'코인 주머니',     icon:'🪙', cost:30,   type:'coins',  amount:5000,   repeatable:true},
  {id:'ev_coin_m',  name:'코인 궤짝',       icon:'💰', cost:150,  type:'coins',  amount:30000,  repeatable:true},
  {id:'ev_energy_s',name:'에너지 캡슐',     icon:'⚡', cost:35,   type:'energy', amount:6000,   repeatable:true},
  {id:'ev_energy_m',name:'에너지 배터리',   icon:'🔋', cost:170,  type:'energy', amount:35000,  repeatable:true},
  {id:'ev_item',    name:'축제의 부적',     icon:'🎊', cost:300,  type:'item',   target:'ev_charm',            repeatable:false},
  {id:'ev_pet',     name:'축제 마스코트',   icon:'🎪', cost:500,  type:'pet',    target:'pet_event_carnival',  repeatable:false},
  {id:'ev_wep',     name:'축제의 폭죽포',   icon:'🎆', cost:900,  type:'weapon', target:'event_firework',      repeatable:false},
  {id:'ev_title',   name:'칭호: 축제의 주인공', icon:'🎉', cost:1200, type:'title', target:'t_event',           repeatable:false},
  // ── 이벤트 전용 아이템 10종 ──
  {id:'ev_shop_i1', name:'축제 폭죽',       icon:'🎇', cost:200, type:'item', target:'ev_shop_item1',  repeatable:false},
  {id:'ev_shop_i2', name:'만능 강장제',     icon:'💊', cost:250, type:'item', target:'ev_shop_item2',  repeatable:false},
  {id:'ev_shop_i3', name:'풍선 방패',       icon:'🎈', cost:220, type:'item', target:'ev_shop_item3',  repeatable:false},
  {id:'ev_shop_i4', name:'축제 가면',       icon:'🎭', cost:230, type:'item', target:'ev_shop_item4',  repeatable:false},
  {id:'ev_shop_i5', name:'경품 룰렛',       icon:'🎡', cost:180, type:'item', target:'ev_shop_item5',  repeatable:false},
  {id:'ev_shop_i6', name:'팡파레 나팔',     icon:'📯', cost:240, type:'item', target:'ev_shop_item6',  repeatable:false},
  {id:'ev_shop_i7', name:'축제 대폭탄',     icon:'🧨', cost:300, type:'item', target:'ev_shop_item7',  repeatable:false},
  {id:'ev_shop_i8', name:'솜사탕',         icon:'🍭', cost:190, type:'item', target:'ev_shop_item8',  repeatable:false},
  {id:'ev_shop_i9', name:'행운의 부적',     icon:'🧿', cost:260, type:'item', target:'ev_shop_item9',  repeatable:false},
  {id:'ev_shop_i10',name:'서커스 사자 소환',icon:'🦁', cost:350, type:'item', target:'ev_shop_item10', repeatable:false},
];

let eventData = lJ('hd_event_data', {points:0, purchased:{}});
function saveEventData(){ sv('hd_event_data', eventData); }

function buyEventItem(id){
  const it=EVENT_SHOP.find(x=>x.id===id);
  if(!it) return;
  if(!it.repeatable && eventData.purchased[id]) return;
  if((eventData.points||0)<it.cost) return;
  eventData.points-=it.cost;
  if(it.type==='coins'){ coins+=it.amount; sv('hd_c',coins); }
  else if(it.type==='energy'){ energy+=it.amount; sv('hd_e',energy); }
  else if(it.type==='item'){ ownedItems[it.target]=true; saveItems(); }
  else if(it.type==='pet'){
    if(typeof ownedPets!=='undefined'){
      if(!ownedPets[it.target]) ownedPets[it.target]={count:0,level:0};
      ownedPets[it.target].count++;
      savePetData();
    }
  }
  else if(it.type==='weapon'){ owned[it.target]=true; saveAll(); }
  else if(it.type==='title'){ titleData.unlocked[it.target]=true; saveTitles(); updateTitleDisp(); }
  if(!it.repeatable) eventData.purchased[id]=true;
  saveEventData();
  updRes();
  _evLastBought='evsh_'+id;
  renderEventShop();
  flashBoughtCard();
}

function renderEventShop(){
  updRes();
  const el=document.getElementById('eventPoints');
  if(el) el.textContent=(eventData.points||0).toLocaleString();
  const list=document.getElementById('eventShopList');
  if(!list) return;
  list.innerHTML = EVENT_SHOP.map(it=>{
    const bought=!it.repeatable && eventData.purchased[it.id];
    const canBuy=!bought && (eventData.points||0)>=it.cost;
    const desc = it.type==='coins' ? '🪙 '+it.amount.toLocaleString()+' 획득' :
      it.type==='energy' ? '⚡ '+it.amount.toLocaleString()+' 획득' :
      it.type==='item' ? '전용 아이템 획득' : it.type==='pet' ? '전용 펫 획득' :
      it.type==='weapon' ? '전용 무기 획득' : '전용 칭호 획득';
    return `<div id="evsh_${it.id}" class="ev-card${bought?' done':canBuy?' can':''}">
      <div class="ev-ico">${it.icon}</div>
      <div class="ev-nm">${it.name}</div>
      <div class="ev-ds">${desc}</div>
      ${bought
        ? '<div class="ev-done-badge">✅ 획득 완료</div>'
        : `<div class="ev-cost" style="color:${canBuy?'#fbbf24':'#9ca3af'}">🎫 ${it.cost.toLocaleString()}</div><button class="ev-btn" ${canBuy?'':'disabled'} onclick="buyEventItem('${it.id}')">교환</button>`}
    </div>`;
  }).join('');
}
