// ════════════════════════════════════════════
// ══ 일일 퀘스트 ══
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

function statValue(statName){
  if(statName==='bossKillsCount') return Object.values(achStats.bossKills||{}).reduce((a,b)=>a+b,0);
  if(statName==='clearedMapsCount') return (achStats.clearedMaps||[]).length;
  return achStats[statName]||0;
}

function todayKey(){
  const d=new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

let dailyQuestData = lJ('hd_daily_quest', null);
function ensureDailyQuests(){
  const key=todayKey();
  if(!dailyQuestData||dailyQuestData.date!==key){
    // 새 날짜: 퀘스트 3개 랜덤 선정 + 현재 스탯을 기준값으로 스냅샷
    const shuffled=[...QUEST_POOL].sort(()=>Math.random()-0.5).slice(0,3);
    const baseline={};
    shuffled.forEach(q=>{baseline[q.id]=statValue(q.stat);});
    dailyQuestData={date:key, quests:shuffled.map(q=>q.id), baseline, claimed:{}};
    sv('hd_daily_quest', dailyQuestData);
  }
}

function questProgress(qid){
  const q=QUEST_POOL.find(x=>x.id===qid);
  if(!q) return {cur:0,target:1};
  const base=dailyQuestData.baseline[qid]||0;
  const cur=Math.max(0, Math.min(q.target, statValue(q.stat)-base));
  return {cur, target:q.target};
}

function claimQuest(qid){
  ensureDailyQuests();
  if(dailyQuestData.claimed[qid]) return;
  const {cur,target}=questProgress(qid);
  if(cur<target) return;
  const q=QUEST_POOL.find(x=>x.id===qid);
  coins+=(q.reward.coins||0); energy+=(q.reward.energy||0);
  sv('hd_c',coins); sv('hd_e',energy);
  dailyQuestData.claimed[qid]=true;
  sv('hd_daily_quest', dailyQuestData);
  updRes();
  renderDailyQuest();
}

function renderDailyQuest(){
  ensureDailyQuests();
  const list=document.getElementById('dailyQuestList');
  if(!list) return;
  list.innerHTML='';
  dailyQuestData.quests.forEach(qid=>{
    const q=QUEST_POOL.find(x=>x.id===qid);
    const {cur,target}=questProgress(qid);
    const done=cur>=target;
    const claimed=dailyQuestData.claimed[qid];
    const pct=Math.min(100,Math.floor(cur/target*100));
    const d=document.createElement('div');
    d.className='ei'+(claimed?' eq':'');
    d.style.cssText+='align-items:center;';
    d.innerHTML=`
      <div style="flex:1;">
        <div class="enm">${q.desc}</div>
        <div style="background:#e5e7eb;border-radius:6px;height:8px;margin-top:6px;overflow:hidden;">
          <div style="background:${done?'#22c55e':'#a855f7'};height:100%;width:${pct}%;"></div>
        </div>
        <div class="elv" style="margin-top:4px;">${cur}/${target} · 🪙${q.reward.coins.toLocaleString()} ⚡${q.reward.energy.toLocaleString()}</div>
      </div>
    `;
    const btn=document.createElement('button');
    btn.className='bybtn';
    btn.style.marginLeft='10px';
    if(claimed){btn.textContent='완료';btn.disabled=true;btn.style.background='#374151';}
    else if(done){btn.textContent='수령';btn.onclick=()=>claimQuest(qid);}
    else{btn.textContent='진행중';btn.disabled=true;btn.style.background='#9ca3af';}
    d.appendChild(btn);
    list.appendChild(d);
  });
  const resetInfo=document.getElementById('dailyQuestReset');
  if(resetInfo){
    const now=new Date();
    const tomorrow=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1);
    const msLeft=tomorrow-now;
    const h=Math.floor(msLeft/3600000), m=Math.floor((msLeft%3600000)/60000);
    resetInfo.textContent=`⏰ 다음 초기화까지: ${h}시간 ${m}분`;
  }
}
