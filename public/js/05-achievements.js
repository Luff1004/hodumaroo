// ════════════════════════════════════════════
// ══ 업적 시스템 ══
// ════════════════════════════════════════════

const ACHIEVEMENTS = [
  // ── 킬 업적 ──
  {id:'kill_10',    name:'첫 걸음',            desc:'좀비 10마리 처치',                    reward:{coins:500},     cond:'kills>=10'},
  {id:'kill_100',   name:'학살자',             desc:'좀비 100마리 처치',                   reward:{item:'soul_hope'},cond:'kills>=100'},
  {id:'kill_500',   name:'대학살',             desc:'좀비 500마리 처치',                   reward:{coins:5000},    cond:'kills>=500'},
  {id:'kill_1000',  name:'전설의 사냥꾼',      desc:'좀비 1000마리 처치',                  reward:{energy:50000}, cond:'kills>=1000'},
  {id:'kill_5000',  name:'절멸자',             desc:'좀비 5000마리 처치',                  reward:{coins:100000}, cond:'kills>=5000'},
  {id:'kill_10000', name:'학살의 왕',          desc:'좀비 10000마리 처치',                 reward:{energy:200000},cond:'kills>=10000'},
  // ── 웨이브 업적 ──
  {id:'wave_5',     name:'입문자',             desc:'웨이브 5 달성',                       reward:{coins:300},    cond:'maxWave>=5'},
  {id:'wave_10',    name:'생존자',             desc:'웨이브 10 달성',                      reward:{coins:1000},   cond:'maxWave>=10'},
  {id:'wave_25',    name:'베테랑',             desc:'웨이브 25 달성',                      reward:{coins:3000},   cond:'maxWave>=25'},
  {id:'wave_50',    name:'철벽',               desc:'웨이브 50 달성',                      reward:{energy:10000}, cond:'maxWave>=50'},
  {id:'wave_100',   name:'불멸',               desc:'웨이브 100 달성',                     reward:{item:'revive'}, cond:'maxWave>=100'},
  // ── 맵별 웨이브 업적 ──
  {id:'city_w10',   name:'도시 탐험가',        desc:'폐허 도시에서 웨이브 10 달성',        reward:{coins:1000},   cond:'(mapWave.city||0)>=10'},
  {id:'city_w25',   name:'도시 정복자',        desc:'폐허 도시에서 웨이브 25 달성',        reward:{coins:5000},   cond:'(mapWave.city||0)>=25'},
  {id:'forest_w10', name:'숲의 생존자',        desc:'저주받은 숲에서 웨이브 10 달성',      reward:{coins:1500},   cond:'(mapWave.forest||0)>=10'},
  {id:'forest_w20', name:'숲의 지배자',        desc:'저주받은 숲에서 웨이브 20 달성',      reward:{coins:5000},   cond:'(mapWave.forest||0)>=20'},
  {id:'lab_w15',    name:'실험실 생존자',      desc:'바이오 실험실에서 웨이브 15 달성',    reward:{coins:2000},   cond:'(mapWave.lab||0)>=15'},
  {id:'lab_w25',    name:'실험실 정복자',      desc:'바이오 실험실에서 웨이브 25 달성',    reward:{coins:8000},   cond:'(mapWave.lab||0)>=25'},
  {id:'desert_w10', name:'사막의 방랑자',      desc:'불타는 사막에서 웨이브 10 달성',      reward:{coins:3000},   cond:'(mapWave.desert||0)>=10'},
  {id:'desert_w20', name:'사막의 제왕',        desc:'불타는 사막에서 웨이브 20 달성',      reward:{energy:15000}, cond:'(mapWave.desert||0)>=20'},
  {id:'space_w10',  name:'우주 비행사',        desc:'우주 전쟁에서 웨이브 10 달성',        reward:{coins:5000},   cond:'(mapWave.space||0)>=10'},
  {id:'space_w20',  name:'우주 정복자',        desc:'우주 전쟁에서 웨이브 20 달성',        reward:{energy:30000}, cond:'(mapWave.space||0)>=20'},
  // ── 보스 업적 ──
  {id:'boss_sun',   name:'태양을 삼킨 자',     desc:'THE SUN 보스 처치',                   reward:{coins:5000},   cond:'bossKills.sun>=1'},
  {id:'boss_machine',name:'기계를 멈춘 자',    desc:'THE MACHINE 보스 처치',               reward:{coins:8000},   cond:'bossKills.machine>=1'},
  {id:'boss_bacteria',name:'세균 박멸자',      desc:'BACTERIA 보스 처치',                  reward:{coins:10000},  cond:'bossKills.bacteria>=1'},
  {id:'boss_skeleton',name:'뼈를 부순 자',     desc:'SKELETON 보스 처치',                  reward:{coins:12000},  cond:'bossKills.skeleton>=1'},
  {id:'boss_clock', name:'시간을 깨뜨린 자',   desc:'CLOCK 보스 처치',                     reward:{coins:15000},  cond:'bossKills.clock>=1'},
  {id:'boss_reanim',name:'죽음을 이긴 자',     desc:'REANIMATION 보스 처치',               reward:{coins:18000},  cond:'bossKills.reanimation>=1'},
  {id:'boss_kraken',name:'심해 정복자',        desc:'KRAKEN 처치',                         reward:{coins:20000},  cond:'bossKills.kraken>=1'},
  {id:'boss_sym',   name:'심포니의 끝',        desc:'FANTASTIC SYMPHONY 처치',             reward:{energy:50000}, cond:'bossKills.symphony>=1'},
  {id:'boss_all',   name:'보스 사냥꾼',        desc:'일반 보스 8종 모두 처치',             reward:{item:'spatial_path'}, cond:'Object.keys(bossKills).filter(k=>!k.startsWith("dream")).length>=8'},
  // ── 드림코어 업적 ──
  {id:'dream_enter',name:'THE DREAMCORE',      desc:'드림코어 세계에 진입',                reward:{item:'spatial_path'}, cond:'dreamEntered>=1'},
  {id:'dream_sun',  name:'태양이 뜨지 않는다', desc:'THE SUN IS RISE 처치',                reward:{coins:50000},  cond:'bossKills.dream_sun>=1'},
  {id:'dream_eye',  name:'눈을 감아라',        desc:'E Y E 처치',                          reward:{coins:100000}, cond:'bossKills.dream_eye>=1'},
  {id:'dream_wakeup',name:'WAKE UP',           desc:'WAKE UP 보스 처치',                   reward:{item:'black_hole'}, cond:'bossKills.dream_wakeup>=1'},
  {id:'dream_all',  name:'꿈에서 깨어나라',    desc:'드림코어 보스 4종 모두 처치',         reward:{energy:500000},cond:'["dream_sun","dream_limbo","dream_eye","dream_wakeup"].every(k=>bossKills[k]>=1)'},
  // ── 코인/에너지 업적 ──
  {id:'coin_1k',    name:'첫 수입',            desc:'코인 1,000 보유',                     reward:{coins:500},    cond:'coins>=1000'},
  {id:'coin_10k',   name:'부자 입문',          desc:'코인 10,000 보유',                    reward:{energy:5000},  cond:'coins>=10000'},
  {id:'coin_100k',  name:'재벌',               desc:'코인 100,000 보유',                   reward:{energy:15000}, cond:'coins>=100000'},
  {id:'coin_1m',    name:'백만장자',           desc:'코인 1,000,000 보유',                 reward:{energy:50000}, cond:'coins>=1000000'},
  {id:'energy_10k', name:'에너지 입문',        desc:'에너지 10,000 보유',                  reward:{coins:3000},   cond:'energy>=10000'},
  {id:'energy_100k',name:'에너지 충전',        desc:'에너지 100,000 보유',                 reward:{coins:10000},  cond:'energy>=100000'},
  // ── 시즌패스 업적 ──
  {id:'season_10',  name:'시즌 입문자',        desc:'시즌패스 레벨 10 달성',               reward:{coins:3000},   cond:'spData.lv>=10'},
  {id:'season_25',  name:'시즌 도전자',        desc:'시즌패스 레벨 25 달성',               reward:{coins:10000},  cond:'spData.lv>=25'},
  {id:'season_50',  name:'시즌 마스터',        desc:'시즌패스 레벨 50 달성',               reward:{item:'sp_item_dec'},cond:'spData.lv>=50'},
  // ── 장비 업적 ──
  {id:'wep_5',      name:'무기 입문',          desc:'무기 5종 보유',                       reward:{coins:2000},   cond:'Object.keys(owned).filter(k=>!k.startsWith("ar_")).length>=5'},
  {id:'wep_10',     name:'무기 수집가',        desc:'무기 10종 보유',                      reward:{coins:5000},   cond:'Object.keys(owned).filter(k=>!k.startsWith("ar_")).length>=10'},
  {id:'wep_20',     name:'무기 마스터',        desc:'무기 20종 보유',                      reward:{energy:20000}, cond:'Object.keys(owned).filter(k=>!k.startsWith("ar_")).length>=20'},
  {id:'armor_5',    name:'갑옷 입문',          desc:'갑옷 5종 보유',                       reward:{coins:3000},   cond:'Object.keys(owned).filter(k=>k.startsWith("ar_")).length>=5'},
  {id:'armor_all',  name:'갑옷 마스터',        desc:'갑옷 20종 이상 보유',                 reward:{energy:20000}, cond:'Object.keys(owned).filter(k=>k.startsWith("ar_")).length>=20'},
  {id:'job_3',      name:'직업 입문',          desc:'직업 3종 보유',                       reward:{coins:1500},   cond:'Object.keys(ownedJobs).length>=3'},
  {id:'job_5',      name:'직업 탐구자',        desc:'직업 5종 보유',                       reward:{coins:3000},   cond:'Object.keys(ownedJobs).length>=5'},
  {id:'job_10',     name:'직업 마스터',        desc:'직업 10종 보유',                      reward:{energy:15000}, cond:'Object.keys(ownedJobs).length>=10'},
  // ── 아이템 업적 ──
  {id:'item_5',     name:'아이템 입문',        desc:'아이템 5종 보유',                     reward:{coins:2000},   cond:'Object.keys(ownedItems).length>=5'},
  {id:'item_10',    name:'아이템 수집가',      desc:'아이템 10종 보유',                    reward:{coins:5000},   cond:'Object.keys(ownedItems).length>=10'},
  {id:'item_use_10',name:'아이템 활용가',      desc:'아이템 10회 사용',                    reward:{coins:3000},   cond:'totalItemUses>=10'},
  {id:'item_use_50',name:'아이템 달인',        desc:'아이템 50회 사용',                    reward:{energy:10000}, cond:'totalItemUses>=50'},
  // ── 특수 업적 ──
  {id:'no_dmg_wave',name:'무적',              desc:'피해 없이 웨이브 1회 클리어',           reward:{item:'shield'}, cond:'noDmgWave>=1'},
  {id:'boss_nodmg', name:'퍼펙트 클리어',     desc:'피해 없이 보스 처치',                  reward:{energy:30000}, cond:'noDmgBoss>=1'},
  {id:'party_play', name:'우리 함께',          desc:'파티 플레이 1회',                     reward:{coins:5000},   cond:'partyPlayed>=1'},
  {id:'all_maps',   name:'탐험가',             desc:'모든 일반 맵에서 웨이브 10 달성',     reward:{energy:15000}, cond:'clearedMaps.length>=5'},
  // ── 운 업적 ──
  {id:'lucky',      name:'오늘은 운이 좋군요', desc:'매 1초마다 20000분의 1 확률로 획득',  reward:{item:'lucky_clover'}, cond:'luckyAchieved>=1'},
  // ── 히든 ──
  {id:'secret_1',   name:'???',               desc:'???',                                  reward:{item:'soul_hope'},cond:'kills>=9999',hidden:true},
  {id:'secret_2',   name:'꿈과 현실 사이',    desc:'보스를 플레이어 체력 10% 이하로 잡기', reward:{energy:200000},cond:'dreamCloseKill>=1',hidden:true},
];

// 업적 진행도 저장
let achData = lJ('hd_ach', {});  // {id: true/false}
let achStats = lJ('hd_ach_stats', {
  kills:0, maxWave:0, mapWave:{}, bossKills:{}, dreamEntered:0,
  noDmgWave:0, noDmgBoss:0, partyPlayed:0, clearedMaps:[],
  totalItemUses:0, luckyAchieved:0, dreamCloseKill:0
});
function saveAch(){ sv('hd_ach',achData); sv('hd_ach_stats',achStats); }

// 업적 체크 함수
function checkAchievements(){
  let newUnlock = false;
  const kills=achStats.kills, maxWave=achStats.maxWave, bossKills=achStats.bossKills||{};
  const mapWave=achStats.mapWave||{}, dreamEntered=achStats.dreamEntered||0;
  const noDmgWave=achStats.noDmgWave||0, noDmgBoss=achStats.noDmgBoss||0;
  const partyPlayed=achStats.partyPlayed||0, clearedMaps=achStats.clearedMaps||[];
  const totalItemUses=achStats.totalItemUses||0, luckyAchieved=achStats.luckyAchieved||0;
  const dreamCloseKill=achStats.dreamCloseKill||0;
  const jobLvs=lJ('hd_jlv',{});
  ACHIEVEMENTS.forEach(a=>{
    if(achData[a.id]) return;
    try {
      if(eval(a.cond)){
        achData[a.id]=true;
        newUnlock=true;
        grantAchReward(a);
        setMsg('🏆 업적 달성: '+a.name+'!');
        setTimeout(()=>{if(running)setMsg('');},3000);
      }
    } catch(e){}
  });
  if(newUnlock) saveAch();
}

// 업적 보상 지급
function grantAchReward(a){
  const r=a.reward;
  if(!r) return;
  if(r.coins){ coins+=r.coins; sv('hd_c',coins); }
  if(r.energy){ energy+=r.energy; sv('hd_e',energy); }
  if(r.item){ ownedItems[r.item]=true; saveItems(); }
  updRes();
}

// 랜덤 행운 업적 체크 (1초마다)
setInterval(()=>{
  if(!achData['lucky'] && Math.random() < 1/20000){
    achStats.luckyAchieved=1; checkAchievements();
  }
},1000);

const SCREENS=['sLobby','sMap','sWeapon','sShop','sJob','sUpg','sEquip','sParty','sSeason','sDream','sDreamMap','sAch','sEnchant','sPotionShop'];
function go(id){
  SCREENS.forEach(s=>{const el=document.getElementById(s);if(el)el.classList.toggle('on',s===id);});
  document.getElementById('gameCanvas').style.display='none';
  document.getElementById('gameUI').style.display='none';
  if(id==='sLobby'){updRes();stopGame();if(bgmUnlocked)startBGM();}
  if(id==='sMap')drawMP();
  if(id==='sWeapon')renderWepSel();
  if(id==='sShop'){curShopTab='items';renderShop();}
  if(id==='sJob')renderJob();
  if(id==='sUpg')renderUpg();
  if(id==='sEquip')renderEquip();
  if(id==='sAch')renderAchievements();
  if(id==='sEnchant'){updRes();setEnchantCat('wep',document.querySelector('#sEnchant .stab'));}
  if(id==='sPotionShop'){updRes();renderPotionShop();}
  if(id==='sDream'){
    document.getElementById('dlc').textContent=coins.toLocaleString();
    document.getElementById('dle').textContent=energy.toLocaleString();
    startDreamAmbient('dreamCanvas');
    positionDreamEyes();
    animateDreamTitle();
    startScanline();
  }
  if(id==='sLobby'){
    stopScanline();
    const gc=document.getElementById('gameCanvas');if(gc)gc.style.filter='';
    if(window._dreamTitleItv){clearInterval(window._dreamTitleItv);window._dreamTitleItv=null;}
  }
}
function showGame(){
  SCREENS.forEach(s=>{const el=document.getElementById(s);if(el)el.classList.remove('on');});
  document.getElementById('gameCanvas').style.display='block';
  document.getElementById('gameUI').style.display='block';
}
function updRes(){
  ['lc','sc','jc'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=coins;});
  ['le','se','ue','je'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=energy;});
  
}
updRes();
