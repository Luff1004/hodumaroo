// ══════════════ BGM (Barista Ballad) ══════════════
let bgmUnlocked = false;

function getBGM(){ return document.getElementById('bgmAudio'); }

function unlockBGM(){
  if(bgmUnlocked) return;
  bgmUnlocked = true;
  startBGM();
}

function startBGM(){
  const a=getBGM(); if(!a)return;
  a.volume=0.35;
  const p=a.play();
  if(p!==undefined) p.catch(()=>{});
}
function stopBGM(){
  const a=getBGM(); if(!a)return;
  a.pause();
}
function setBGMVol(v){
  const a=getBGM(); if(!a)return;
  a.volume=parseFloat(v);
}

// 첫 클릭/터치 시 언락
document.addEventListener('click', unlockBGM, {once:true});
document.addEventListener('touchstart', unlockBGM, {once:true});
document.addEventListener('keydown', unlockBGM, {once:true});


// ══════════════ 파티 시스템 ══════════════
let myParty = null; // {code, members:[], host:true}
let partyBonus = 1.0;

function genPartyCode(){
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({length:6},()=>chars[Math.floor(Math.random()*chars.length)]).join('');
}

function createParty(){
  const code = genPartyCode();
  myParty = {code, members:[getMyName()], host:true};
  sv('hd_party_'+code, JSON.stringify({members:[getMyName()], host:getMyName(), ts:Date.now()}));
  document.getElementById('myPartyCode').textContent = code;
  document.getElementById('startPartyBtn').style.display='block';
  renderPartyMembers();
  // 폴링 시작 (3초마다 멤버 갱신)
  if(window._partyPoll) clearInterval(window._partyPoll);
  window._partyPoll = setInterval(pollParty, 3000);
  setPartyStatus('✅ 파티 생성 완료! 코드를 공유하세요.');
}

function getMyName(){
  let n = lS('hd_nickname','');
  if(!n){ n='플레이어'+(Math.floor(Math.random()*9000)+1000); sv('hd_nickname',n); }
  return n;
}

function joinParty(){
  const code = document.getElementById('joinCodeInput').value.trim().toUpperCase();
  if(code.length!==6){setJoinStatus('❌ 6자리 코드를 입력하세요.');return;}
  const raw = lS('hd_party_'+code,'');
  if(!raw){setJoinStatus('❌ 파티를 찾을 수 없습니다.');return;}
  try{
    const pdata = JSON.parse(raw);
    if(Date.now()-pdata.ts > 300000){setJoinStatus('❌ 만료된 파티입니다.');return;}
    const me = getMyName();
    if(!pdata.members.includes(me)) pdata.members.push(me);
    sv('hd_party_'+code, JSON.stringify(pdata));
    myParty = {code, members:pdata.members, host:false};
    setJoinStatus('✅ '+pdata.host+' 님의 파티에 참가했습니다!');
    partyBonus = 1.5;
    renderPartyMembers();
    if(window._partyPoll) clearInterval(window._partyPoll);
    window._partyPoll = setInterval(pollParty,3000);
  }catch(e){setJoinStatus('❌ 오류가 발생했습니다.');}
}

function pollParty(){
  if(!myParty) return;
  const raw = lS('hd_party_'+myParty.code,'');
  if(!raw) return;
  try{
    const pdata=JSON.parse(raw);
    myParty.members=pdata.members;
    renderPartyMembers();
    // 호스트가 게임 시작 신호 보냈으면
    if(!myParty.host && pdata.gameStarted){
      clearInterval(window._partyPoll);
      partyBonus=1.5;
      go('sMap');
      setJoinStatus('');
    }
  }catch(e){}
}

function renderPartyMembers(){
  const list=document.getElementById('partyMemberList');
  if(!list||!myParty)return;
  list.innerHTML='<div style="font-size:11px;font-weight:700;color:#3b82f6;margin-bottom:6px;">👥 파티원 ('+myParty.members.length+'명)</div>'+
    myParty.members.map((m,i)=>`<div class="party-member"><span style="font-size:16px">${i===0?'👑':'🎮'}</span><span style="font-size:12px;font-weight:700;color:#1e40af">${m}</span>${m===getMyName()?'<span style="font-size:9px;background:#dbeafe;color:#1e40af;padding:1px 6px;border-radius:8px;margin-left:auto">나</span>':''}</div>`).join('');
}

function startPartyGame(){
  if(!myParty||!myParty.host)return;
  const raw=lS('hd_party_'+myParty.code,'');
  if(!raw)return;
  const pdata=JSON.parse(raw);
  pdata.gameStarted=true;
  sv('hd_party_'+myParty.code,JSON.stringify(pdata));
  partyBonus=1.5+myParty.members.length*0.1;
  clearInterval(window._partyPoll);
  go('sMap');
}

function leaveParty(){
  if(window._partyPoll) clearInterval(window._partyPoll);
  myParty=null; partyBonus=1.0;
  document.getElementById('myPartyCode').textContent='------';
  document.getElementById('startPartyBtn').style.display='none';
  const ml=document.getElementById('partyMemberList');if(ml)ml.innerHTML='';
}

function setPartyStatus(msg){
  const el=document.getElementById('partyMemberList');
  if(el&&!myParty) el.innerHTML='<div style="font-size:11px;color:#3b82f6;text-align:center">'+msg+'</div>';
}
function setJoinStatus(msg){
  const el=document.getElementById('joinStatus');if(el)el.textContent=msg;
}

// go에서 파티 화면 진입 시 초기화
const _origGo=go;
// → go 함수에 파티 렌더 추가는 아래서

// ══════════════ 시즌패스 ══════════════
const SEASON_NUM = 1;
function getSeasonMonth(){ return new Date().getMonth()+1; }
function isOddMonth(){ return getSeasonMonth()%2===1; }

// SP_REWARDS는 아래 배열 기준, Lv25/50은 월에 따라 동적 변환
const SP_REWARDS_BASE = [
  {lv:1,  ico:'🪙', rwd:'코인 +500',           type:'coins',    val:500},
  {lv:2,  ico:'⚡', rwd:'에너지 +300',          type:'energy',   val:300},
  {lv:3,  ico:'🪙', rwd:'코인 +1,000',          type:'coins',    val:1000},
  {lv:4,  ico:'⚡', rwd:'에너지 +500',          type:'energy',   val:500},
  {lv:5,  ico:'🌟', rwd:'특성 선택지+1',        type:'perk',     val:1},
  {lv:6,  ico:'🪙', rwd:'코인 +2,000',          type:'coins',    val:2000},
  {lv:7,  ico:'⚡', rwd:'에너지 +1,000',        type:'energy',   val:1000},
  {lv:8,  ico:'🛡️',rwd:'갑옷 강화권',          type:'armor_upg',val:1},
  {lv:9,  ico:'🪙', rwd:'코인 +3,000',          type:'coins',    val:3000},
  {lv:10, ico:'👑', rwd:'코인 +5,000',          type:'coins',    val:5000},
  {lv:11, ico:'⚡', rwd:'에너지 +2,000',        type:'energy',   val:2000},
  {lv:12, ico:'🪙', rwd:'코인 +8,000',          type:'coins',    val:8000},
  {lv:13, ico:'🌟', rwd:'특성 선택지+2',        type:'perk',     val:2},
  {lv:14, ico:'⚡', rwd:'에너지 +5,000',        type:'energy',   val:5000},
  {lv:15, ico:'🎯', rwd:'무기 강화권',          type:'wep_upg',  val:1},
  {lv:16, ico:'🪙', rwd:'코인 +15,000',         type:'coins',    val:15000},
  {lv:17, ico:'⚡', rwd:'에너지 +8,000',        type:'energy',   val:8000},
  {lv:18, ico:'🌟', rwd:'특성 선택지+3',        type:'perk',     val:3},
  {lv:19, ico:'🪙', rwd:'코인 +20,000',         type:'coins',    val:20000},
  {lv:20, ico:'💎', rwd:'에너지 +12,000',       type:'energy',   val:12000},
  {lv:21, ico:'🪙', rwd:'코인 +30,000',         type:'coins',    val:30000},
  {lv:22, ico:'⚡', rwd:'에너지 +15,000',       type:'energy',   val:15000},
  {lv:23, ico:'🌟', rwd:'특성 선택지+5',        type:'perk',     val:5},
  {lv:24, ico:'🪙', rwd:'코인 +50,000',         type:'coins',    val:50000},
  {lv:25, ico:'🌠', rwd:'【전용무기】성흔의 검',type:'sp_weapon', val:'sp_blade'},
  {lv:26, ico:'⚡', rwd:'에너지 +25,000',       type:'energy',   val:25000},
  {lv:27, ico:'🪙', rwd:'코인 +80,000',         type:'coins',    val:80000},
  {lv:28, ico:'🛡️',rwd:'갑옷 강화권×3',       type:'armor_upg',val:3},
  {lv:29, ico:'⚡', rwd:'에너지 +40,000',       type:'energy',   val:40000},
  {lv:30, ico:'👑', rwd:'코인 +120,000',        type:'coins',    val:120000},
  {lv:31, ico:'🌟', rwd:'특성 선택지+6',        type:'perk',     val:6},
  {lv:32, ico:'🪙', rwd:'코인 +180,000',        type:'coins',    val:180000},
  {lv:33, ico:'⚡', rwd:'에너지 +60,000',       type:'energy',   val:60000},
  {lv:34, ico:'🎯', rwd:'무기 강화권×3',        type:'wep_upg',  val:3},
  {lv:35, ico:'🪙', rwd:'코인 +250,000',        type:'coins',    val:250000},
  {lv:36, ico:'⚡', rwd:'에너지 +100,000',      type:'energy',   val:100000},
  {lv:37, ico:'🌟', rwd:'특성 선택지+8',        type:'perk',     val:8},
  {lv:38, ico:'🪙', rwd:'코인 +400,000',        type:'coins',    val:400000},
  {lv:39, ico:'⚡', rwd:'에너지 +150,000',      type:'energy',   val:150000},
  {lv:40, ico:'🌌', rwd:'코인 +600,000',        type:'coins',    val:600000},
  {lv:41, ico:'⚡', rwd:'에너지 +200,000',      type:'energy',   val:200000},
  {lv:42, ico:'🌟', rwd:'특성 선택지+10',       type:'perk',     val:10},
  {lv:43, ico:'🪙', rwd:'코인 +800,000',        type:'coins',    val:800000},
  {lv:44, ico:'⚡', rwd:'에너지 +300,000',      type:'energy',   val:300000},
  {lv:45, ico:'🛡️',rwd:'갑옷 강화권×10',      type:'armor_upg',val:10},
  {lv:46, ico:'🪙', rwd:'코인 +1,000,000',      type:'coins',    val:1000000},
  {lv:47, ico:'⚡', rwd:'에너지 +500,000',      type:'energy',   val:500000},
  {lv:48, ico:'🌟', rwd:'특성 선택지+15',       type:'perk',     val:15},
  {lv:49, ico:'🪙', rwd:'코인 +2,000,000',      type:'coins',    val:2000000},
  {lv:50, ico:'💫', rwd:'【전용갑옷】별의 화신',type:'sp_armor',  val:'sp_armor50'},
];

// 월별 동적 보상 적용
// 월별 시즌패스 보상 매핑
const SP_MONTH_REWARDS = {
  1:  {lv25:{ico:'❄️',rwd:'【무기】겨울의 창',    type:'sp_weapon',val:'sp_winter'},  lv50:{ico:'🧊',rwd:'【직업】빙하술사',    type:'sp_job',val:'sp_job_jan'}},
  2:  {lv25:{ico:'❄️',rwd:'【갑옷】눈꽃 갑옷',    type:'sp_armor', val:'sp_armor_feb'},lv50:{ico:'👸',rwd:'【직업】눈의 여왕',   type:'sp_job',val:'sp_job_feb'}},
  3:  {lv25:{ico:'🚀',rwd:'【무기】우주 포',       type:'sp_weapon',val:'sp_space'},    lv50:{ico:'👨‍🚀',rwd:'【직업】우주인',   type:'sp_job',val:'sp_job_mar'}},
  4:  {lv25:{ico:'🌸',rwd:'【갑옷】봄꽃 갑옷',    type:'sp_armor', val:'sp_armor_apr'},lv50:{ico:'🌸',rwd:'【직업】봄의 정령', type:'sp_job',val:'sp_job_apr'}},
  5:  {lv25:{ico:'🌊',rwd:'【무기】여름 파도',     type:'sp_weapon',val:'sp_summer'},   lv50:{ico:'☀️',rwd:'【직업】태양 전사', type:'sp_job',val:'sp_job_may'}},
  6:  {lv25:{ico:'🌊',rwd:'【갑옷】파도 갑옷',    type:'sp_armor', val:'sp_armor_jun'},lv50:{ico:'🌊',rwd:'【직업】파도 술사', type:'sp_job',val:'sp_job_jun'}},
  7:  {lv25:{ico:'🍂',rwd:'【무기】낙엽 낫',       type:'sp_weapon',val:'sp_autumn'},   lv50:{ico:'🍂',rwd:'【직업】낙엽 검사', type:'sp_job',val:'sp_job_jul'}},
  8:  {lv25:{ico:'🌋',rwd:'【갑옷】용암 갑옷',    type:'sp_armor', val:'sp_armor_aug'},lv50:{ico:'🌋',rwd:'【직업】용암 왕',   type:'sp_job',val:'sp_job_aug'}},
  9:  {lv25:{ico:'⚡',rwd:'【무기】폭풍의 검',     type:'sp_weapon',val:'sp_storm'},    lv50:{ico:'⛈️',rwd:'【직업】폭풍의 신', type:'sp_job',val:'sp_job_sep'}},
  10: {lv25:{ico:'🌙',rwd:'【갑옷】달빛 갑옷',    type:'sp_armor', val:'sp_armor_oct'},lv50:{ico:'🌙',rwd:'【직업】달빛 사신', type:'sp_job',val:'sp_job_oct'}},
  11: {lv25:{ico:'🌌',rwd:'【무기】성운 포',       type:'sp_weapon',val:'sp_nova'},     lv50:{ico:'🌌',rwd:'【직업】성운 마법사',type:'sp_job',val:'sp_job_nov'}},
  12: {lv25:{ico:'⭐',rwd:'【갑옷】별빛 갑옷',    type:'sp_armor', val:'sp_armor_dec'},lv50:{ico:'⭐',rwd:'【직업】별의 왕',   type:'sp_job',val:'sp_job_dec'}},
};

function getSpRewards(){
  const m=getSeasonMonth();
  const mr=SP_MONTH_REWARDS[m]||SP_MONTH_REWARDS[1];
  return SP_REWARDS_BASE.map(r=>{
    if(r.lv===25)return {lv:25,...mr.lv25};
    if(r.lv===50)return {lv:50,...mr.lv50};
    return r;
  });
}
// SP_REWARDS alias
Object.defineProperty(window,'SP_REWARDS',{get:getSpRewards,configurable:true});

const XP_PER_LV = [0,1000,1500,2000,2500,3000,3500,4000,5000,6000,7000,8000,9000,10000,12000,14000,16000,18000,20000,25000,30000,35000,40000,50000,60000,70000,80000,90000,100000,120000,150000,180000,220000,260000,300000,350000,400000,450000,500000,600000,700000,800000,900000,1000000,1200000,1400000,1600000,1800000,2000000,2500000,3000000];
function getXPForLv(lv){return XP_PER_LV[Math.min(lv,XP_PER_LV.length-1)]||lv*5000;}

let spData = lJ('hd_sp',{season:1,xp:0,lv:1,claimed:{}});
if(!spData.season)spData.season=1;
// 영구 소유 아이템 복원
(function restoreSpOwned(){
  const spOwned=lJ('hd_sp_owned',{});
  Object.keys(spOwned).forEach(k=>{
    if(k.startsWith('ar_'))owned[k]=true;
    else if(k.startsWith('job_'))ownedJobs[k.replace('job_','')]=true;
    else owned[k]=true;
  });
})();

function addSeasonXP(xp){
  if(!xp||xp<0||!isFinite(xp))return;
  spData.xp += xp;
  // 레벨업 체크 (무한루프 방지: 최대 50레벨까지만, 반복 상한)
  let guard=0;
  while(guard++<100){
    if(spData.lv>=50){spData.xp=Math.min(spData.xp,getXPForLv(50));break;}
    const needed = getXPForLv(spData.lv);
    if(!needed||needed<=0||!isFinite(needed))break;
    if(spData.xp >= needed){ spData.xp -= needed; spData.lv++; }
    else break;
  }
  sv('hd_sp', spData);
}

function getSeasonEndTime(){
  // 매달 1일 00:00 기준 다음 달 1일
  const now=new Date();
  const end=new Date(now.getFullYear(),now.getMonth()+1,1,0,0,0,0);
  return end.getTime();
}

function checkSeasonReset(){
  const savedEnd=lJ('hd_sp_end',0);
  const now=Date.now();
  if(!savedEnd){
    // 최초 설정
    sv('hd_sp_end', getSeasonEndTime());
    return;
  }
  if(now>=savedEnd){
    // 시즌 초기화
    const newSeason=(spData.season||1)+1;
    spData={season:newSeason,xp:0,lv:1,claimed:{}};
    sv('hd_sp',spData);
    sv('hd_sp_end',getSeasonEndTime());
    alert('🌟 시즌 '+newSeason+' 시작! 시즌패스가 초기화됐습니다.');
  }
}

function formatTimer(ms){
  if(ms<=0)return '00:00:00';
  const s=Math.floor(ms/1000);
  const d=Math.floor(s/86400);
  const h=Math.floor((s%86400)/3600);
  const m=Math.floor((s%3600)/60);
  const sec=s%60;
  if(d>0)return d+'일 '+String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0');
  return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0');
}

let _spTimerItv=null;
function renderSeasonPass(){
  checkSeasonReset();
  const mt=document.getElementById('spMonthType');
  if(mt){
    const odd=isOddMonth();
    const _m=getSeasonMonth();const _mr=SP_MONTH_REWARDS[_m]||SP_MONTH_REWARDS[1];
    mt.textContent=`${_m}월 시즌 | Lv.25→${_mr.lv25.rwd} / Lv.50→${_mr.lv50.rwd}`;
    mt.style.background='rgba(251,191,36,0.12)';mt.style.color='#fbbf24';
  }
  document.getElementById('spSeasonNum').textContent='시즌 '+( spData.season||1);
  document.getElementById('spLv').textContent=spData.lv;
  document.getElementById('spTotalXP').textContent=(spData.xp||0).toLocaleString();
  const needed=getXPForLv(spData.lv);
  document.getElementById('spNextXP').textContent=needed.toLocaleString();
  document.getElementById('spXP').textContent=(spData.xp||0).toLocaleString();
  const pct=Math.min(100,(spData.xp/needed)*100);
  document.getElementById('spBar').style.width=pct+'%';

  // 타이머
  if(_spTimerItv)clearInterval(_spTimerItv);
  const timerEl=document.getElementById('spTimer');
  function updateTimer(){
    const endT=lJ('hd_sp_end',getSeasonEndTime());
    const rem=Math.max(0,endT-Date.now());
    if(timerEl)timerEl.textContent='⏰ 시즌 종료까지 '+formatTimer(rem);
    if(rem<=0){clearInterval(_spTimerItv);checkSeasonReset();renderSeasonPass();}
  }
  updateTimer();
  _spTimerItv=setInterval(updateTimer,1000);

  // 트랙 렌더 (가로 스크롤)
  const track=document.getElementById('spTrack');
  track.innerHTML='';
  SP_REWARDS.forEach(r=>{
    const unlocked=spData.lv>=r.lv;
    const claimed=spData.claimed['s'+(spData.season||1)+'_'+r.lv];
    const isSpecial=r.type==='sp_weapon'||r.type==='sp_armor';
    const div=document.createElement('div');
    div.className='sp-node '+(claimed?'done':unlocked?'active':'locked');
    if(isSpecial){
      div.style.cssText+='border-color:'+(r.type==='sp_weapon'?'#6366f1':'#fbbf24')+';background:'+(r.type==='sp_weapon'?'#1e1b4b':'#1a0a00')+';min-width:100px;';
    }
    div.innerHTML=
      '<div class="lv">Lv.'+r.lv+'</div>'+
      '<div class="ico">'+r.ico+'</div>'+
      '<div class="rwd" style="font-size:'+(isSpecial?'8':'9')+'px;color:'+(isSpecial?'#fbbf24':'#e5e7eb')+'">'+r.rwd+'</div>'+
      (claimed?'<div class="claimed">✅</div>':'')+
      (unlocked&&!claimed?'<button class="sp-claim-btn" onclick="claimSPReward('+r.lv+')">수령!</button>':'');
    track.appendChild(div);
  });
}

function claimSPReward(lv){
  const r=SP_REWARDS.find(x=>x.lv===lv);
  if(!r)return;
  const key='s'+SEASON_NUM+'_'+lv;
  if(spData.claimed[key])return;
  spData.claimed[key]=true;
  if(r.type==='coins'){coins+=r.val;sv('hd_c',coins);}
  else if(r.type==='energy'){energy+=r.val;sv('hd_e',energy);}
  else if(r.type==='perk'){pUpgLv['px']=(pUpgLv['px']||0)+r.val;sv('hd_pu',pUpgLv);}
  else if(r.type==='armor_upg'){
    // 강화권: 다음 갑옷 강화 비용 면제권 저장
    const cur=lJ('hd_ar_tickets',0); sv('hd_ar_tickets', cur+r.val);
    setMsg(`🛡️ 갑옷 강화권 ×${r.val} 획득!`);
  }
  else if(r.type==='wep_upg'){
    const cur=lJ('hd_wep_tickets',0); sv('hd_wep_tickets', cur+r.val);
    setMsg(`🎯 무기 강화권 ×${r.val} 획득!`);
  }
  else if(r.type==='sp_weapon'){
    owned[r.val]=true;
    // 영구 소유 별도 저장
    const spOwned=lJ('hd_sp_owned',{});spOwned[r.val]=true;sv('hd_sp_owned',spOwned);
    saveAll();
    setMsg('🌠 시즌 전용 무기 ['+( WEPS[r.val]?.name||r.val)+'] 영구 획득!');
    setTimeout(()=>{if(typeof setMsg==='function')setMsg('');},4000);
  }
  else if(r.type==='sp_armor'){
    owned['ar_'+r.val]=true;
    const spOwned=lJ('hd_sp_owned',{});spOwned['ar_'+r.val]=true;sv('hd_sp_owned',spOwned);
    saveAll();
    setMsg('💫 시즌 전용 갑옷 ['+(ARMORS.find(a=>a.id===r.val)?.name||r.val)+'] 영구 획득!');
    setTimeout(()=>{if(typeof setMsg==='function')setMsg('');},4000);
  }
  else if(r.type==='sp_job'){
    ownedJobs[r.val]=true;
    const spOwned=lJ('hd_sp_owned',{});spOwned['job_'+r.val]=true;sv('hd_sp_owned',spOwned);
    saveJobData();
    const jname=JOBS.find(j=>j.id===r.val)?.name||r.val;
    setMsg('🌟 시즌 전용 직업 ['+jname+'] 영구 획득!');
    setTimeout(()=>{if(typeof setMsg==='function')setMsg('');},4000);
  }
  sv('hd_sp', spData);
  updRes();
  renderSeasonPass();
}

// go에 시즌패스 렌더 연결
const _goOrig = go;
go = function(id){
  _goOrig(id);
  if(id==='sSeason') renderSeasonPass();
  if(id==='sParty') renderPartyMembers();
  if(id==='sEquip'){
    if(window._ppInterval)clearInterval(window._ppInterval);
    window._ppInterval=setInterval(drawPP,50);
  } else {
    if(window._ppInterval){clearInterval(window._ppInterval);window._ppInterval=null;}
  }
};

// ── 초기 맵 미리보기 & 버튼 이벤트 ──
setTimeout(()=>{
  drawMP();
  drawPP();
  updRes();
  initDreamBtn();
  checkDreamUnlock();
},500);

setTimeout(()=>{
  const btnMap={
    'btn-play':()=>go('sMap'),
    'btn-shop':()=>go('sShop'),
    'btn-skin':()=>go('sJob'),
    'btn-upg':()=>go('sUpg'),
    'btn-equip':()=>go('sEquip'),
  };
  Object.entries(btnMap).forEach(([id,fn])=>{
    const el=document.getElementById(id);
    if(el)el.addEventListener('click',fn);
  });
},200);

