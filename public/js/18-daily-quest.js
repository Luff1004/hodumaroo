// ════════════════════════════════════════════
// ══ 퀘스트 (일일 / 주간 / 메가) ══
// ════════════════════════════════════════════

const QUEST_POOL = [
  {id:'kill10',    desc:'좀비 10마리 처치',           target:10,  stat:'kills',           reward:{coins:2000,energy:500}},
  {id:'kill50',    desc:'좀비 50마리 처치',           target:50,  stat:'kills',           reward:{coins:8000,energy:2000}},
  {id:'kill200',   desc:'좀비 200마리 처치',          target:200, stat:'kills',           reward:{coins:25000,energy:6000}},
  {id:'item5',     desc:'아이템 5회 사용',            target:5,   stat:'totalItemUses',   reward:{coins:3000,energy:1000}},
  {id:'item20',    desc:'아이템 20회 사용',           target:20,  stat:'totalItemUses',   reward:{coins:12000,energy:3500}},
  {id:'boss1',     desc:'보스 1마리 처치',            target:1,   stat:'bossKillsCount',  reward:{coins:15000,energy:4000}},
  {id:'boss3',     desc:'보스 3마리 처치',            target:3,   stat:'bossKillsCount',  reward:{coins:40000,energy:12000}},
  {id:'enchant1',  desc:'인챈트 1회 시도',            target:1,   stat:'enchantAttempts', reward:{coins:5000,energy:1500}},
  {id:'enchant5',  desc:'인챈트 5회 시도',            target:5,   stat:'enchantAttempts', reward:{coins:25000,energy:8000}},
  {id:'wave3',     desc:'웨이브 클리어 3회',          target:3,   stat:'waveClearsTotal', reward:{coins:5000,energy:1500}},
  {id:'wave10',    desc:'웨이브 클리어 10회',         target:10,  stat:'waveClearsTotal', reward:{coins:20000,energy:6000}},
  {id:'game2',     desc:'게임 2회 플레이',            target:2,   stat:'gamesPlayed',     reward:{coins:4000,energy:1200}},
  {id:'game5',     desc:'게임 5회 플레이',            target:5,   stat:'gamesPlayed',     reward:{coins:15000,energy:4500}},
  {id:'dream1',    desc:'드림코어 진입 1회',          target:1,   stat:'dreamEntered',    reward:{coins:30000,energy:10000}},
  {id:'party1',    desc:'파티 게임 1회 플레이',       target:1,   stat:'partyPlayed',     reward:{coins:15000,energy:5000}},
  {id:'clearmap1', desc:'맵 1개 클리어 (10웨이브+)',  target:1,   stat:'clearedMapsCount',reward:{coins:10000,energy:3000}},
];

const WEEKLY_QUEST_POOL = [
  {id:'w_kill500',   desc:'좀비 500마리 처치',          target:500, stat:'kills',           reward:{coins:60000,energy:15000}},
  {id:'w_boss10',    desc:'보스 10마리 처치',           target:10,  stat:'bossKillsCount',  reward:{coins:120000,energy:30000}},
  {id:'w_wave30',    desc:'웨이브 클리어 30회',         target:30,  stat:'waveClearsTotal', reward:{coins:80000,energy:20000}},
  {id:'w_game15',    desc:'게임 15회 플레이',           target:15,  stat:'gamesPlayed',     reward:{coins:70000,energy:18000}},
  {id:'w_enchant20', desc:'인챈트 20회 시도',           target:20,  stat:'enchantAttempts', reward:{coins:100000,energy:25000}},
  {id:'w_item50',    desc:'아이템 50회 사용',           target:50,  stat:'totalItemUses',   reward:{coins:75000,energy:20000}},
  {id:'w_dream3',    desc:'드림코어 진입 3회',          target:3,   stat:'dreamEntered',    reward:{coins:150000,energy:40000}},
  {id:'w_party3',    desc:'파티 게임 3회 플레이',       target:3,   stat:'partyPlayed',     reward:{coins:90000,energy:22000}},
  {id:'w_clearmap3', desc:'맵 3개 클리어 (10웨이브+)',  target:3,   stat:'clearedMapsCount',reward:{coins:110000,energy:28000}},
];

const MEGA_QUEST_POOL = [
  {id:'m_kill3000',   desc:'좀비 3000마리 처치',   target:3000, stat:'kills',           reward:{coins:500000,energy:150000,pet:'pet_wolf'}},
  {id:'m_boss30',     desc:'보스 30마리 처치',     target:30,   stat:'bossKillsCount',  reward:{coins:800000,energy:200000,relic:'relic_phoenix'}},
  {id:'m_wave150',    desc:'웨이브 클리어 150회',  target:150,  stat:'waveClearsTotal', reward:{coins:600000,energy:180000,pet:'pet_eagle'}},
  {id:'m_game60',     desc:'게임 60회 플레이',     target:60,   stat:'gamesPlayed',     reward:{coins:450000,energy:120000}},
  {id:'m_dream10',    desc:'드림코어 진입 10회',   target:10,   stat:'dreamEntered',    reward:{coins:1000000,energy:300000,relic:'relic_guard'}},
  {id:'m_enchant100', desc:'인챈트 100회 시도',    target:100,  stat:'enchantAttempts', reward:{coins:700000,energy:200000,pet:'pet_bear'}},
];

// 유물/펫 보상 아이콘·이름 조회 (없으면 null)
function questBonusRewardInfo(reward){
  if(reward.relic&&typeof RELICS!=='undefined'){
    const r=RELICS.find(x=>x.id===reward.relic);
    if(r) return {icon:r.icon, name:r.name+' 유물'};
  }
  if(reward.pet&&typeof PETS!=='undefined'){
    const p=PETS.find(x=>x.id===reward.pet);
    if(p) return {icon:p.icon, name:p.name+' 펫'};
  }
  return null;
}

function statValue(statName){
  if(statName==='bossKillsCount') return Object.values(achStats.bossKills||{}).reduce((a,b)=>a+b,0);
  if(statName==='clearedMapsCount') return (achStats.clearedMaps||[]).length;
  return achStats[statName]||0;
}

function todayKey(){
  const d=new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

// 퀘스트 종류별 설정: 저장키, 대상 풀, 뽑을 개수, 갱신 주기(일), 업적 카운터 필드
const QUEST_TIERS = {
  daily:  {storageKey:'hd_daily_quest',   pool:QUEST_POOL,        count:3, cycleDays:1,  claimStat:'dailyQuestClaims',  hint:'💡 매일 자정에 새로운 퀘스트 3개로 초기화됩니다'},
  weekly: {storageKey:'hd_weekly_quest',  pool:WEEKLY_QUEST_POOL, count:2, cycleDays:7,  claimStat:'weeklyQuestClaims', hint:'💡 7일마다 새로운 퀘스트 2개로 초기화됩니다'},
  mega:   {storageKey:'hd_mega_quest',    pool:MEGA_QUEST_POOL,   count:1, cycleDays:14, claimStat:'megaQuestClaims',   hint:'💡 14일마다 새로운 메가 퀘스트 1개로 초기화됩니다'},
};

let curQuestTab='daily';
const questData={
  daily: lJ('hd_daily_quest', null),
  weekly: lJ('hd_weekly_quest', null),
  mega: lJ('hd_mega_quest', null),
};

function questPeriodKey(tier){
  if(tier==='daily') return todayKey();
  const days=Math.floor(Date.now()/86400000);
  return Math.floor(days/QUEST_TIERS[tier].cycleDays);
}

function ensureQuests(tier){
  const cfg=QUEST_TIERS[tier];
  const key=questPeriodKey(tier);
  let data=questData[tier];
  if(!data||data.period!==key){
    const shuffled=[...cfg.pool].sort(()=>Math.random()-0.5).slice(0,cfg.count);
    const baseline={};
    shuffled.forEach(q=>{baseline[q.id]=statValue(q.stat);});
    data={period:key, quests:shuffled.map(q=>q.id), baseline, claimed:{}};
    questData[tier]=data;
    sv(cfg.storageKey, data);
  }
  return data;
}

// 기존 코드/이스터에그가 참조하는 전역명 유지
Object.defineProperty(window,'dailyQuestData',{
  get(){ return questData.daily; },
  set(v){ questData.daily=v; },
});

function questProgress(tier,qid){
  const cfg=QUEST_TIERS[tier];
  const data=questData[tier];
  const q=cfg.pool.find(x=>x.id===qid);
  if(!q) return {cur:0,target:1};
  const base=(data&&data.baseline[qid])||0;
  const cur=Math.max(0, Math.min(q.target, statValue(q.stat)-base));
  return {cur, target:q.target};
}

function claimQuest(qid, tier){
  tier=tier||curQuestTab;
  const cfg=QUEST_TIERS[tier];
  const data=ensureQuests(tier);
  if(data.claimed[qid]) return;
  const {cur,target}=questProgress(tier,qid);
  if(cur<target) return;
  const q=cfg.pool.find(x=>x.id===qid);
  coins+=(q.reward.coins||0); energy+=(q.reward.energy||0);
  sv('hd_c',coins); sv('hd_e',energy);
  if(q.reward.relic&&typeof ownedRelics!=='undefined'){
    if(!ownedRelics[q.reward.relic]) ownedRelics[q.reward.relic]={count:0,level:0};
    ownedRelics[q.reward.relic].count++;
    if(typeof saveRelicData==='function')saveRelicData();
  }
  if(q.reward.pet&&typeof ownedPets!=='undefined'){
    if(!ownedPets[q.reward.pet]) ownedPets[q.reward.pet]={count:0,level:0};
    ownedPets[q.reward.pet].count++;
    if(typeof savePetData==='function')savePetData();
  }
  data.claimed[qid]=true;
  sv(cfg.storageKey, data);
  achStats[cfg.claimStat]=(achStats[cfg.claimStat]||0)+1;
  saveAch();
  if(typeof checkAchievements==='function')checkAchievements();
  updRes();
  renderDailyQuest();
  if(tier==='daily'&&typeof trackDailyStreak==='function')trackDailyStreak();
}

function setQuestTab(tab,btn){
  curQuestTab=tab;
  document.querySelectorAll('#sDailyQuest .stab').forEach(b=>b.classList.remove('on'));
  if(btn) btn.classList.add('on');
  renderDailyQuest();
}

function renderDailyQuest(){
  const tier=curQuestTab;
  const cfg=QUEST_TIERS[tier];
  const data=ensureQuests(tier);
  const list=document.getElementById('dailyQuestList');
  if(!list) return;
  list.innerHTML='';
  data.quests.forEach(qid=>{
    const q=cfg.pool.find(x=>x.id===qid);
    const {cur,target}=questProgress(tier,qid);
    const done=cur>=target;
    const claimed=data.claimed[qid];
    const pct=Math.min(100,Math.floor(cur/target*100));
    const bonus=questBonusRewardInfo(q.reward);
    const bonusText=bonus?` ${bonus.icon}${bonus.name}`:'';
    const d=document.createElement('div');
    d.className='ei'+(claimed?' eq':'');
    d.style.cssText+='align-items:center;';
    d.innerHTML=`
      <div style="flex:1;">
        <div class="enm">${q.desc}</div>
        <div style="background:#e5e7eb;border-radius:6px;height:8px;margin-top:6px;overflow:hidden;">
          <div style="background:${done?'#22c55e':'#a855f7'};height:100%;width:${pct}%;"></div>
        </div>
        <div class="elv" style="margin-top:4px;">${cur}/${target} · 🪙${q.reward.coins.toLocaleString()} ⚡${q.reward.energy.toLocaleString()}${bonusText}</div>
      </div>
    `;
    const btn=document.createElement('button');
    btn.className='bybtn';
    btn.style.marginLeft='10px';
    if(claimed){btn.textContent='완료';btn.disabled=true;btn.style.background='#374151';}
    else if(done){btn.textContent='수령';btn.onclick=()=>claimQuest(qid,tier);}
    else{btn.textContent='진행중';btn.disabled=true;btn.style.background='#9ca3af';}
    d.appendChild(btn);
    list.appendChild(d);
  });
  const resetInfo=document.getElementById('dailyQuestReset');
  if(resetInfo){
    let msLeft;
    if(tier==='daily'){
      const now=new Date();
      const tomorrow=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1);
      msLeft=tomorrow-now;
    } else {
      const cycleMs=cfg.cycleDays*86400000;
      const period=questPeriodKey(tier);
      msLeft=(period+1)*cycleMs-Date.now();
    }
    const h=Math.floor(msLeft/3600000), m=Math.floor((msLeft%3600000)/60000);
    const d=Math.floor(h/24);
    resetInfo.textContent = d>0
      ? `⏰ 다음 초기화까지: ${d}일 ${h%24}시간`
      : `⏰ 다음 초기화까지: ${h}시간 ${m}분`;
  }
  const hint=document.getElementById('dailyQuestHint');
  if(hint) hint.textContent=cfg.hint;
}
