// ══════════════ 명예의 전당 (플레이 기록) ══════════════
function renderRecordsScreen(){
  const wrap=document.getElementById('recordsList');
  if(!wrap) return;
  wrap.innerHTML='';

  const bossKills=achStats.bossKills||{};
  const bossMaps=MAPS.filter(m=>m.category==='boss');
  const dreamBossIds=Object.keys(typeof DREAM_BOSSES!=='undefined'?DREAM_BOSSES:{});
  const dreamKillsTotal=dreamBossIds.reduce((s,k)=>s+(bossKills[k.replace('_boss','')]||0),0);
  const totalBossKills=bossMaps.reduce((s,m)=>s+(bossKills[m.id]||0),0)+dreamKillsTotal;

  const ownedWepsCnt=Object.keys(owned).filter(k=>owned[k]).length;
  const ownedArmorsCnt=ARMORS.filter(a=>owned['ar_'+a.id]).length;
  const ownedItemsCnt=Object.keys(ownedItems).filter(k=>ownedItems[k]).length;
  const ownedPetsCnt=Object.keys(ownedPets).length;
  const ownedJobsCnt=Object.keys(ownedJobs).filter(k=>ownedJobs[k]).length;
  const achDone=ACHIEVEMENTS.filter(a=>achData[a.id]).length;

  const summary=[
    {icon:'🎮',label:'플레이 횟수',val:(achStats.gamesPlayed||0).toLocaleString()+'회'},
    {icon:'💀',label:'총 처치 수',val:(achStats.kills||0).toLocaleString()+'마리'},
    {icon:'🌊',label:'최고 웨이브',val:'Wave '+(achStats.maxWave||0)},
    {icon:'🗺️',label:'클리어한 맵',val:(achStats.clearedMaps||[]).length+'개'},
    {icon:'👑',label:'보스 처치',val:totalBossKills.toLocaleString()+'회'},
    {icon:'🌙',label:'드림코어 방문',val:(achStats.dreamEntered||0)+'회'},
    {icon:'🤝',label:'파티 플레이',val:(achStats.partyPlayed||0)+'회'},
    {icon:'🧪',label:'아이템 사용',val:(achStats.totalItemUses||0).toLocaleString()+'회'},
    {icon:'🏆',label:'업적 달성',val:achDone+' / '+ACHIEVEMENTS.length},
    {icon:'⚔️',label:'보유 무기',val:ownedWepsCnt+' / '+Object.keys(WEPS).length},
    {icon:'🛡️',label:'보유 방어구',val:ownedArmorsCnt+' / '+ARMORS.length},
    {icon:'🎒',label:'보유 아이템',val:ownedItemsCnt+' / '+ITEMS.length},
    {icon:'🐾',label:'보유 펫 종류',val:ownedPetsCnt+' / '+PETS.length},
    {icon:'💼',label:'보유 직업',val:ownedJobsCnt+' / '+JOBS.length},
  ];

  const grid=document.createElement('div');
  grid.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;max-width:760px;margin:0 auto 20px;';
  summary.forEach(s=>{
    const c=document.createElement('div');
    c.style.cssText='background:#151022;border:1px solid #2e2447;border-radius:10px;padding:12px 8px;text-align:center;';
    c.innerHTML='<div style="font-size:20px;">'+s.icon+'</div>'+
      '<div style="font-size:9px;color:#9ca3af;margin-top:4px;">'+s.label+'</div>'+
      '<div style="font-size:14px;font-weight:800;color:#fbbf24;margin-top:2px;">'+s.val+'</div>';
    grid.appendChild(c);
  });
  wrap.appendChild(grid);

  const bossTitle=document.createElement('div');
  bossTitle.style.cssText='text-align:center;font-size:13px;font-weight:800;color:#c4b5fd;margin:4px 0 8px;';
  bossTitle.textContent='👑 보스별 처치 기록';
  wrap.appendChild(bossTitle);

  const bossList=document.createElement('div');
  bossList.style.cssText='display:flex;flex-direction:column;gap:6px;max-width:700px;margin:0 auto;padding-bottom:40px;';
  bossMaps.forEach(m=>{
    const n=bossKills[m.id]||0;
    const row=document.createElement('div');
    row.className='ach-card'+(n>0?' done':'');
    row.innerHTML='<div class="ach-ico">'+(n>0?'👑':'❔')+'</div>'+
      '<div class="ach-info"><div class="ach-name">'+m.name+'</div></div>'+
      '<div class="ach-done" style="color:'+(n>0?'#fbbf24':'#6b7280')+';">'+n+'회 처치</div>';
    bossList.appendChild(row);
  });
  dreamBossIds.forEach(bid=>{
    const bd=DREAM_BOSSES[bid];
    const n=bossKills[bid.replace('_boss','')]||0;
    const row=document.createElement('div');
    row.className='ach-card'+(n>0?' done':'');
    row.innerHTML='<div class="ach-ico">'+(n>0?bd.icon:'❔')+'</div>'+
      '<div class="ach-info"><div class="ach-name">'+(n>0?bd.name:'???')+'</div></div>'+
      '<div class="ach-done" style="color:'+(n>0?'#fbbf24':'#6b7280')+';">'+n+'회 처치</div>';
    bossList.appendChild(row);
  });
  wrap.appendChild(bossList);
}
