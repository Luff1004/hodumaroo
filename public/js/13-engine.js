// ══════════════ 게임 엔진 ══════════════
const gC=document.getElementById('gameCanvas');
const ctx=gC.getContext('2d');
const mmCv=document.getElementById('mmC');
const mmc=mmCv.getContext('2d');
const MW=800,MH=3000;
function VW(){return gC.width;}function VH(){return gC.height;}
function clampC(y){return Math.max(0,Math.min(MH-VH(),y));}
function clampCX(x){return Math.max(0,Math.min(Math.max(0,MW-VW()),x));}
function resize(){gC.width=window.innerWidth;gC.height=window.innerHeight;}
resize();window.addEventListener('resize',()=>{resize();if(P){camY=clampC(P.y-VH()/2);camX=clampCX(P.x-VW()/2);}});

let P,zoms,buls,parts,effs,hpItems;
let wave,score,kills,poison;
let waveDmgTaken=0;
let spawnT=0,spawnInt=75,spawnedCnt=0,totalSpawn=9,betweenWave=false;
let waveSpeedMul=1;
function toggleWaveSpeed(){
  waveSpeedMul=waveSpeedMul===1?2:1;
  const btn=document.getElementById('waveSpeedBtn');
  if(btn){btn.textContent=waveSpeedMul===2?'⏩ 2배 ON':'⏩ 2배';btn.classList.toggle('on',waveSpeedMul===2);}
}
let relTimer=0,camY=0,camX=0,mxW=400,myW=MH-100;
const keys={};
let touchDX=0,touchDY=0;
let rafId=null,running=false,activeBoss=null,mx=0,my=0;
let pTimers={};

// 게임용 타이머 추적 (보스 패턴 등의 예약 탄환이 게임 종료 후에도 실행되는 렉/버그 방지)
let gameTimers=[];
function gTimeout(fn,ms){
  const id=setTimeout(()=>{
    const i=gameTimers.indexOf(id);if(i>=0)gameTimers.splice(i,1);
    if(running)fn();
  },ms);
  gameTimers.push(id);
  return id;
}
function clearGameTimers(){
  for(const id of gameTimers)clearTimeout(id);
  gameTimers=[];
}

const ZT={
  normal:    {name:'일반',   col:'#6B8E6B',ol:'#3a5c3a',bHp:7,  spd:1.1,r:13,sc:10},
  runner:    {name:'돌격',   col:'#CC4444',ol:'#8B0000',bHp:6,  spd:2.4,r:11,sc:20},
  tanker:    {name:'탱커',   col:'#8B4513',ol:'#4a2008',bHp:17, spd:.55, r:20,sc:50},
  exploder:  {name:'폭발',   col:'#9370DB',ol:'#5B2C9B',bHp:7,  spd:1.2,r:14,sc:30},
  healer:    {name:'치유사', col:'#20B2AA',ol:'#0d7a75',bHp:8,  spd:.9,  r:13,sc:40},
  poison:    {name:'독',     col:'#8DB800',ol:'#557700',bHp:7,  spd:1.3,r:12,sc:30},
  ghost:     {name:'유령',   col:'#C0C0C0',ol:'#888',   bHp:7,  spd:1.5,r:12,sc:40},
  supertank: {name:'수퍼탱커',col:'#3b0000',ol:'#1a0000',bHp:50, spd:.4,  r:28,sc:150,isSuperTank:true},
  spider:    {name:'거미',   col:'#1a1a2e',ol:'#0d0d1a',bHp:5,  spd:2.0,r:11,sc:35,isSpider:true},
  wizard:    {name:'마법사', col:'#5B2C8B',ol:'#2e1045',bHp:6,  spd:.8,  r:14,sc:60,isWizard:true},
  rob:       {name:'ROB',    col:'#ffffff',ol:'#cccccc',bHp:999, spd:.5,  r:18,sc:200,isROB:true},
  prophet:   {name:'선지자', col:'#a16207',ol:'#713f12',bHp:5,   spd:1.0, r:14,sc:45,isProphet:true},
  golem:     {name:'골렘',   col:'#6b7280',ol:'#374151',bHp:35,  spd:.35, r:26,sc:80,isGolem:true},
  demon:     {name:'악마',   col:'#7f1d1d',ol:'#450a0a',bHp:8,   spd:1.6, r:14,sc:55,isDemon:true},
  // ── 로봇 공장 챌린지 전용 ──
  robot:        {name:'로봇',     col:'#94a3b8',ol:'#475569',bHp:16, spd:1.0, r:16,sc:45},
  spider_robot: {name:'거미로봇', col:'#334155',ol:'#0f172a',bHp:8,  spd:2.3, r:12,sc:40},
  raptor_robot: {name:'랩터로봇', col:'#f87171',ol:'#7f1d1d',bHp:10, spd:1.1, r:14,sc:60},
  // ── UNDER WATER 챌린지 전용 ──
  fish:      {name:'물고기',   col:'#38bdf8',ol:'#0369a1',bHp:5,  spd:2.6, r:10,sc:25},
  squid:     {name:'오징어',   col:'#a78bfa',ol:'#5b21b6',bHp:7,  spd:1.2, r:13,sc:40},
  starfish:  {name:'불가사리', col:'#fb923c',ol:'#9a3412',bHp:24, spd:.5,  r:18,sc:50},
  kraken_mob:{name:'크라켄',   col:'#0891b2',ol:'#164e63',bHp:16, spd:.9,  r:17,sc:70},
  // ── HARDEST OF THE WORLD 챌린지 전용 ──
  parasite:         {name:'기생수',   col:'#84cc16',ol:'#3f6212',bHp:6,  spd:2.1, r:11,sc:40},
  alien:            {name:'에일리언', col:'#22c55e',ol:'#14532d',bHp:9,  spd:1.2, r:14,sc:60},
  tentacle_monster: {name:'촉수괴물', col:'#7c2d92',ol:'#3b0764',bHp:15, spd:1.0, r:17,sc:70},
  the_thing:        {name:'더 씽',   col:'#57534e',ol:'#1c1917',bHp:42, spd:.5,  r:24,sc:130},
  // ── 아포칼립스 전용 ──
  super_zombie:   {name:'수퍼좀비',   col:'#166534',ol:'#052e16',bHp:20, spd:1.6, r:15,sc:60},
  suicide_zombie: {name:'자폭좀비',   col:'#c026d3',ol:'#701a75',bHp:9,  spd:1.4, r:14,sc:45},
  num999:         {name:'999',        col:'#dc2626',ol:'#450a0a',bHp:15, spd:1.8, r:13,sc:70},
  // ── 차원의 심장 전용 ──
  dim_shard:     {name:'차원조각',   col:'#818cf8',ol:'#3730a3',bHp:7,  spd:2.2, r:10,sc:50},
  dim_rift:      {name:'차원의틈',   col:'#1e1033',ol:'#4c1d95',bHp:30, spd:.3,  r:22,sc:90},
  dim_separator: {name:'차원분리기', col:'#a855f7',ol:'#581c87',bHp:18, spd:.9,  r:17,sc:80},
  worm:          {name:'기생충',     col:'#65a30d',ol:'#365314',bHp:8,  spd:2.0, r:11,sc:45},
  // ── ETERNAL SPACE 전용 ──
  space_jelly:   {name:'우주의 해파리', col:'#67e8f9',ol:'#0e7490',bHp:11,  spd:.8,  r:16,sc:55},
  glitch_entity: {name:'X)(#%+#@?',     col:'#ffffff',ol:'#000000',bHp:60,  spd:1.3, r:20,sc:150},
  the_god:       {name:'THE GOD',       col:'#fbbf24',ol:'#78350f',bHp:120, spd:.5,  r:30,sc:300},
  // ── 아이템 소환 동맹 ──
  wolf_ally:  {name:'늑대',   col:'#78716c',ol:'#44403c',bHp:40,  spd:3.2, r:14,sc:0},
  drone_ally: {name:'드론',   col:'#60a5fa',ol:'#1d4ed8',bHp:60,  spd:2.6, r:14,sc:0},
  golem_ally: {name:'골렘',   col:'#6b7280',ol:'#374151',bHp:400, spd:1.2, r:26,sc:0},
};

function d2(ax,ay,bx,by){return(ax-bx)**2+(ay-by)**2;}

// 신규 웨이브맵 3종 EXTREME 난이도 배율 (아포칼립스 < 차원의 심장 < ETERNAL SPACE)
const HARD_WAVE_MUL={apocalypse:1.5,dimension_heart:2.0,eternal_space:2.8};

function calcWZ(){if(selMap.boss)return 1;if(BOSSES[wave]&&!selMap.challenge)return 1;if(selMap.challenge)return 100;const hwm=HARD_WAVE_MUL[selMap.id]||1;return Math.ceil((5+wave*4)*hwm);}

function getWep(){
  const base=WEPS[selWepId]||WEPS.pistol;
  const lv=wepLv[selWepId]||0;
  const dB=[0,1,2,3,5,8][Math.min(lv,5)];
  const aM=[1,1,1.2,1.2,1.4,2][Math.min(lv,5)];
  const encTier=(typeof enchants!=='undefined')?enchants[selWepId]:null;
  const encData=encTier!=null?ENCHANT_TIERS[encTier]:null;
  const encMul=encData?1+(encTier+1)*.10:1;
  const encEffect={};
  if(encData&&encData.effect){
    if(encData.effect==='fire')encEffect.enchFire=true;
    if(encData.effect==='freeze')encEffect.enchFreeze=true;
    if(encData.effect==='chain')encEffect.enchChain=true;
    if(encData.effect==='explosive')encEffect.enchExplosive=true;
    if(encData.effect==='vamp')encEffect.enchVamp=true;
    if(encData.effect==='pierce')encEffect.enchPierce=true;
    if(encData.effect==='crit')encEffect.enchCrit=true;
  }
  return{...base,...encEffect,dmg:Math.round((base.dmg+dB)*encMul),max:Math.floor(base.max*aM),ammo:Math.floor(base.max*aM)};
}

function initGame(){
  perkLv={};pTimers={};waveDmgTaken=0;
  if(!selMap) selMap=MAPS[0];
  const ws=getWep();
  const ar=ARMORS.find(x=>x.id===eqArmor);
  const puSpd=(pUpgLv['ps']||0)*.2,puHp=(pUpgLv['pmh']||0)*20,puArm=(pUpgLv['pa']||0)*2,puDmg=pUpgLv['pd']||0;
  const arEncTier=(typeof enchants!=='undefined'&&eqArmor)?enchants['ar_'+eqArmor]:null;
  const arEncMul=arEncTier!=null&&ENCHANT_TIERS[arEncTier]?1+(arEncTier+1)*.10:1;
  const arDef=ar?(ar.def+(arLv[eqArmor]||0)*5)*arEncMul:0;
  P={
    x:MW/2,y:MH-180,r:16,
    hp:100+puHp+(shopLv['sh_hp']||0)*30,
    maxHp:100+puHp+(shopLv['sh_hp']||0)*30,
    angle:0,
    ammo:ws.ammo+(shopLv['sh_ammo']||0)*4,
    maxAmmo:ws.max+(shopLv['sh_ammo']||0)*4,
    reloading:false,
    spd:3+puSpd+(shopLv['sh_spd']||0)*.3,
    ws,armor:arDef+puArm,dmgB:puDmg+(shopLv['sh_dmg']||0),
    _mdown:false,_aoeB:0,_shield:0,_frozen:0,_timewarp:0,
    reloadBonus:(shopLv['sh_reload']||0)*18+(pUpgLv['pr']||0)*9,
    _wepCrit:ws.enchCrit?0.25:0,
  };
  if(shopLv['sh_grenade'])perkLv['grenade']=0;
  if(shopLv['sh_magnet'])perkLv['magnet']=0;
  if(shopLv['sh_multi'])perkLv['multi']=0;
  updBadges();
  zoms=[];buls=[];parts=[];effs=[];hpItems=[];
  wave=1;score=0;kills=0;poison=0;
  achStats.gamesPlayed=(achStats.gamesPlayed||0)+1;saveAch();
  spawnT=0;spawnedCnt=0;totalSpawn=calcWZ();spawnInt=selMap.challenge?60:Math.round(75/(HARD_WAVE_MUL[selMap.id]||1));betweenWave=false;relTimer=0;
  waveSpeedMul=1;
  const wsBtn=document.getElementById('waveSpeedBtn');
  if(wsBtn){wsBtn.textContent='⏩ 2배';wsBtn.classList.remove('on');}
  fireMode=localStorage.getItem('hd_fireMode')||'manual';
  P._semiOn=false;
  updFireModeBtn();
  updSemiIndicator();
  camY=clampC(P.y-VH()/2);camX=clampCX(P.x-VW()/2);activeBoss=null;
  // 맵 장애물 초기화
  obstacles=[];
  if(selMap.id==='desert'){
    const rocks=[[120,100,80,80],[350,80,70,90],[600,120,90,75],[50,350,65,85],[280,300,75,80],[500,280,80,70],[720,320,70,85],[150,600,85,80],[400,550,70,90],[650,580,80,75],[80,850,70,80],[320,800,85,75],[580,820,75,85],[750,800,60,90],[200,1100,80,70],[450,1050,70,85],[700,1080,85,70],[100,1350,75,85],[380,1300,80,70],[620,1320,70,80],[150,1600,85,75],[430,1550,70,90],[680,1570,80,80],[80,1850,70,80],[350,1800,85,70],[600,1820,75,85],[200,2100,80,85],[480,2050,70,80],[730,2080,85,70],[100,2350,75,80],[400,2300,80,85],[650,2320,70,75],[150,2600,85,80],[430,2550,80,70],[700,2570,70,85],[80,2850,70,75],[380,2800,85,85],[620,2820,75,80]];
    rocks.forEach(([x,y,w,h])=>obstacles.push({x,y,w,h}));
  }
  // 갑옷 보너스 패시브 적용
  const eqArObj=ARMORS.find(a=>a.id===eqArmor);
  if(eqArObj&&eqArObj.bonus){
    const b=eqArObj.bonus;
    if(b.spd)P.spd+=b.spd;
    if(b.hp){P.maxHp+=b.hp;P.hp+=b.hp;}
    if(b.dmg)P.dmgB=(P.dmgB||0)+b.dmg;
    if(b.regen)P._armorRegen=b.regen;
    if(b.crit)P._armorCrit=(b.crit||0)/100;
    if(b.lifesteal)P._armorLS=b.lifesteal;
    if(b.dodge)P._armorDodge=(b.dodge||0)/100;
    if(b.fireAura)P._fireAura=true;
    if(b.coldAura)P._coldAura=true;
    if(b.thunderAura)P._thunderAura=true;
    if(b.poisonAura)P._poisonAura=true;
  }
  // 직업 패시브 적용
  const activeJob=JOBS.find(x=>x.id===equippedJob);
  if(activeJob){
    const jobEncTier=(typeof enchants!=='undefined')?enchants['job_'+equippedJob]:null;
    const jlv=(jobLv[equippedJob]||0)+(jobEncTier!=null&&ENCHANT_TIERS[jobEncTier]?(jobEncTier+1)*2:0);
    const jmult=jlv>21?1+(jlv-21)*.1:1+jlv*.03; // HYPER: +10%/lv, 일반: +3%/lv
    P.dmgB=(P.dmgB||0)+Math.floor(jlv*.5); // 레벨당 데미지+0.5
    if(equippedJob==='medic'){const bonus=50+jlv*10;P.maxHp+=bonus;P.hp+=bonus;}
    if(equippedJob==='ninja'){P.spd+=1+jlv*.05;P.armor=(P.armor||0)+15+jlv*2;}
    if(equippedJob==='berserker'){P._berserkDmg=jmult;}
    if(equippedJob==='sniper_job'){P.armor=(P.armor||0)+10+jlv*3;}
    if(equippedJob==='miner'){P._minerPassive=true;}
    if(equippedJob==='engineer'){P.ws={...P.ws,pierce:true};}
    if(equippedJob==='god'){P.maxHp+=jlv*20;P.hp+=jlv*20;P.spd+=jlv*.05;}
    if(equippedJob==='demolitionist'){P._aoeB=(P._aoeB||0)+15+jlv*3;}
    if(equippedJob==='elementalist'){P._fireAura=true;P._coldAura=true;P._thunderAura=true;}
    if(jlv>21)setMsg('✨ HYPER LEVEL '+equippedJob+'! 모든 스탯 대폭 강화!');
  }
  if(typeof applyPetBonus==='function')applyPetBonus();
  document.getElementById('bossBar').style.display='none';
  spawnHpItems();
  itemCooldowns={};
  renderItemBar();
}

function spawnHpItems(){
  const cnt=10+(pUpgLv['pl']||0)*2;
  for(let i=0;i<cnt;i++)hpItems.push({x:40+Math.random()*(MW-80),y:40+Math.random()*(MH-80),r:10,collected:false,bob:Math.random()*Math.PI*2});
}

// ── 특성 틱 ──
function tickPerks(){
  const lv=id=>perkLv[id]??-1;

  // 수류탄
  if(lv('grenade')>=0){
    const gl=lv('grenade'),isMG=gl>=5;
    const cd=isMG?90:[300,240,180,150,120][gl];
    const cnt=isMG?6:[1,2,3,3,4][gl];
    const rad=isMG?100:gl>=3?60:40;
    pTimers.gren=(pTimers.gren||0)+1;
    if(pTimers.gren>=cd){pTimers.gren=0;
      for(let i=0;i<cnt;i++){
        const ang=Math.random()*Math.PI*2,dist2=60+Math.random()*150;
        const tx=P.x+Math.cos(ang)*dist2,ty=P.y+Math.sin(ang)*dist2;
        setTimeout(()=>{if(!running)return;addExp(tx,ty,rad,isMG?'#9333ea':'#f59e0b');zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,tx,ty)<(rad+z.r)**2)hitZ(z,3+(P.dmgB||0));});},i*130);
      }
    }
  }

  // 자기장
  if(lv('magnet')>=0){
    const ml=lv('magnet'),isMG=ml>=5;
    const range=isMG?180:[50,70,90,110,130][ml];
    const iv=isMG?30:60,dmg=isMG?2:ml>=4?1:.5;
    pTimers.mag=(pTimers.mag||0)+1;
    if(pTimers.mag>=iv){pTimers.mag=0;
      zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<(range+z.r)**2){hitZ(z,dmg);parts.push({x:z.x,y:z.y,vx:(Math.random()-.5)*3,vy:(Math.random()-.5)*3,l:12,ml:12,r:3,col:isMG?'#9333ea':'#38bdf8'});}});
    }
  }

  // 레이저
  if(lv('laser')>=0){
    const ll=lv('laser'),isMG=ll>=5;
    const cd=isMG?48:ll>=3?120:180;
    pTimers.laser=(pTimers.laser||0)+1;
    if(pTimers.laser>=cd){pTimers.laser=0;
      const len=isMG?9999:ll>=1?280:200;
      const beams=isMG?8:ll>=4?3:1;
      for(let b=0;b<beams;b++){
        const ang=P.angle+(isMG?b/beams*Math.PI*2:b===0?0:b===1?-.22:.22);
        fireLaser(ang,len,ll,isMG);
      }
    }
  }

  // 유도탄
  if(lv('missile')>=0){
    const sl=lv('missile'),isMG=sl>=5;
    const cd=isMG?90:[480,360,240,180,120][sl];
    const cnt=isMG?5:sl>=2?sl:1;
    pTimers.miss=(pTimers.miss||0)+1;
    if(pTimers.miss>=cd){pTimers.miss=0;
      const targets=zoms.filter(z=>!z.dead).sort((a,b)=>d2(a.x,a.y,P.x,P.y)-d2(b.x,b.y,P.x,P.y)).slice(0,cnt);
      targets.forEach(tgt=>{const ang=Math.atan2(tgt.y-P.y,tgt.x-P.x);buls.push({x:P.x,y:P.y,vx:Math.cos(ang)*11,vy:Math.sin(ang)*11,r:5,l:120,en:false,dmg:3+(P.dmgB||0)+(isMG?4:0),homing:tgt,pierce:sl>=4});});
    }
  }

  // 폭격
  if(lv('bomb_rain')>=0){
    const bl=lv('bomb_rain'),isMG=bl>=5;
    const cd=isMG?120:[420,360,300,240,180][bl];
    const cnt=isMG?10:[1,2,3,5,8][bl];
    pTimers.bomb=(pTimers.bomb||0)+1;
    if(pTimers.bomb>=cd){pTimers.bomb=0;
      for(let i=0;i<cnt;i++){
        const tx=P.x+(Math.random()-.5)*300,ty=P.y+(Math.random()-.5)*300;
        effs.push({type:'warn',x:tx,y:ty,l:i*9+30,ml:i*9+30});
        setTimeout(()=>{if(!running)return;addExp(tx,ty,60+(P._aoeB||0),'#fb923c');zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,tx,ty)<(60+(P._aoeB||0)+z.r)**2)hitZ(z,4+(P.dmgB||0));});},i*160);
      }
    }
  }

  // 시간감속
  if(lv('time_warp')>=0){
    const tl=lv('time_warp');
    pTimers.twarp=(pTimers.twarp||0)+1;
    const cd=tl>=3?480:600;
    if(pTimers.twarp>=cd){pTimers.twarp=0;P._timewarp=tl>=1?240:180;}
  }

  // 방어펄스
  if(lv('shield')>=0){
    const sl=lv('shield'),isMG=sl>=5;
    const cd=isMG?1:sl>=3?240:300;
    pTimers.shield=(pTimers.shield||0)+1;
    if(!isMG&&pTimers.shield>=cd){pTimers.shield=0;if(!P._shield)P._shield=sl>=1?30:18;}
    if(isMG&&P._shield<=0)P._shield=999;
    if(P._shield>0&&!isMG)P._shield--;
    if(sl>=2&&P._shield>0){
      zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<(P.r+z.r+30)**2){const ang=Math.atan2(z.y-P.y,z.x-P.x);z.x+=Math.cos(ang)*4;z.y+=Math.sin(ang)*4;}});
    }
  }

  // 회복력
  if(lv('regen')>=0){
    const rl=lv('regen'),isMG=rl>=5;
    pTimers.regen=(pTimers.regen||0)+1;
    const iv=isMG?30:[300,240,180,120,60][rl];
    const hp=isMG?8:[1,1,2,3,5][rl];
    if(pTimers.regen>=iv){pTimers.regen=0;P.hp=Math.min(P.maxHp,P.hp+hp);}
  }

  // 독구름
  if(lv('poison_cloud')>=0){
    const pcl=lv('poison_cloud');
    pTimers.pcloud=(pTimers.pcloud||0)+1;
    if(pTimers.pcloud>=45){pTimers.pcloud=0;
      const r=pcl>=3?55:35,dur=90+(pcl>=1?60:0),dm=pcl>=2?2:1;
      effs.push({type:'cloud',x:P.x,y:P.y,l:dur,ml:dur,r,dmgMult:dm,dmgT:0});
    }
    effs.forEach(e=>{if(e.type==='cloud'){e.dmgT=(e.dmgT||0)+1;if(e.dmgT>=20){e.dmgT=0;zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,e.x,e.y)<(e.r+z.r)**2)hitZ(z,.5*e.dmgMult);});}}});
  }

  // 영구업그레이드 체력재생
  const puRegen=pUpgLv['ph']||0;
  if(puRegen>0){pTimers.puRegen=(pTimers.puRegen||0)+1;if(pTimers.puRegen>=Math.max(60,Math.floor(360/puRegen))){pTimers.puRegen=0;P.hp=Math.min(P.maxHp,P.hp+puRegen*.08);}}

  // 시간감속 적용
  if(P._timewarp>0){P._timewarp--;parts.push({x:P.x+(Math.random()-.5)*200,y:P.y+(Math.random()-.5)*200,vx:0,vy:0,l:3,ml:3,r:2,col:'rgba(167,139,250,.4)'});}

  // 갑옷 오라 효과
  if(P._fireAura){zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<(P.r+z.r+30)**2)hitZ(z,.15);});}
  if(P._coldAura){zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<(P.r+z.r+40)**2)z._frz=Math.max(z._frz||0,2);});}
  if(P._poisonAura){zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<(P.r+z.r+35)**2)hitZ(z,.08);});}
  if(P._thunderAura){pTimers._thAura=(pTimers._thAura||0)+1;if(pTimers._thAura>=120){pTimers._thAura=0;const near=zoms.filter(z=>!z.dead&&d2(z.x,z.y,P.x,P.y)<80**2);near.slice(0,3).forEach(z=>{hitZ(z,5);parts.push({x:z.x,y:z.y,vx:0,vy:-3,l:12,ml:12,r:4,col:'#facc15'});});}}
  if(P._armorRegen){pTimers._arRegen=(pTimers._arRegen||0)+1;if(pTimers._arRegen>=60){pTimers._arRegen=0;P.hp=Math.min(P.maxHp,P.hp+P._armorRegen);}}
  // 자동 회복 (영구업그)
  if(P._autoHealIv>0){P._autoHealTimer=(P._autoHealTimer||0)+1;if(P._autoHealTimer>=P._autoHealIv){P._autoHealTimer=0;P.hp=Math.min(P.maxHp,P.hp+1);}}
  // 미끼드론 (decoy)
  if(lv('decoy')>=0){
    const dcl=lv('decoy'),isMG=dcl>=5;
    const cd=isMG?1:dcl>=3?1800:2400;
    const dur=isMG?999:dcl>=1?2700+dcl*900:1800;
    pTimers.decoy=(pTimers.decoy||0)+1;
    if(pTimers.decoy>=cd&&effs.filter(e=>e.type==='drone').length<(isMG?5:dcl>=4?3:dcl>=2?2:1)){
      pTimers.decoy=0;
      effs.push({type:'drone',x:P.x+(Math.random()-.5)*100,y:P.y+(Math.random()-.5)*100,l:dur,ml:dur,fireT:0,hp:30,active:true});
    }
    // 드론 공격 & 이동
    effs.forEach(e=>{
      if(e.type!=='drone'||!e.active)return;
      // 가장 가까운 적 찾아 이동
      const tgt=zoms.filter(z=>!z.dead&&!z.isMinion).sort((a,b)=>d2(a.x,a.y,e.x,e.y)-d2(b.x,b.y,e.x,e.y))[0];
      if(tgt){const dx=tgt.x-e.x,dy=tgt.y-e.y,dl=Math.sqrt(d2(tgt.x,tgt.y,e.x,e.y))||1;if(dl>60){e.x+=dx/dl*3;e.y+=dy/dl*3;}}
      // 공격
      if(dcl>=2){e.fireT=(e.fireT||0)+1;const fr=isMG?10:20;if(e.fireT>=fr&&tgt){e.fireT=0;buls.push({x:e.x,y:e.y,vx:(tgt.x-e.x)/Math.hypot(tgt.x-e.x,tgt.y-e.y)*10,vy:(tgt.y-e.y)/Math.hypot(tgt.x-e.x,tgt.y-e.y)*10,r:4,l:80,en:false,dmg:2+(P.dmgB||0),col:'#67e8f9'});}}
      // 자폭 (dcl>=4)
      if(dcl>=4&&tgt&&d2(tgt.x,tgt.y,e.x,e.y)<(30)**2){e.active=false;addExp(e.x,e.y,60,'#67e8f9');zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,e.x,e.y)<60**2)hitZ(z,15);});}
    });
  }
  // 아드레날린
  if(lv('adrenaline')>=0){
    const al=lv('adrenaline');const thresh=al>=3?.5:.3;
    P._adActive=P.hp/P.maxHp<thresh;
  }

  // 분신(clone) - 주기적으로 그림자 탄환 복제
  if(lv('clone')>=0){
    const cl=lv('clone'),isMG=cl>=5;
    const cd=isMG?1:cl>=3?180:300;
    const dur=isMG?999:cl>=1?300:180;
    const cnt=isMG?5:cl>=4?3:cl>=3?2:1;
    pTimers.clone=(pTimers.clone||0)+1;
    if(pTimers.clone>=cd){
      pTimers.clone=0;
      // 분신 이펙트 파티클
      for(let i=0;i<cnt;i++){
        const ang=i/cnt*Math.PI*2;
        const cx=P.x+Math.cos(ang)*40,cy=P.y+Math.sin(ang)*40;
        effs.push({type:'shadow',x:cx,y:cy,l:dur,ml:dur,ang,idx:i,cnt,col:'#818cf8'});
      }
    }
    // 분신이 공격하는 기능 (lv>=2)
    // 분신 P 위치 따라가기
    effs.forEach(e=>{
      if(e.type!=='shadow')return;
      const sa=e.ang||0;
      const si=e.idx||0;const sc=e.cnt||1;
      const ta=sa+si/sc*Math.PI*2;
      e.x=P.x+Math.cos(ta)*50;e.y=P.y+Math.sin(ta)*50;
    });
    if(cl>=2){
      effs.forEach(e=>{
        if(e.type!=='shadow')return;
        if(!e.fireT)e.fireT=0;
        e.fireT++;
        const fRate=cl>=4?15:25;
        if(e.fireT>=fRate){
          e.fireT=0;
          const tgt=zoms.filter(z=>!z.dead&&!z.isMinion).sort((a,b)=>
            Math.hypot(a.x-e.x,a.y-e.y)-Math.hypot(b.x-e.x,b.y-e.y))[0];
          if(tgt){
            const sang=Math.atan2(tgt.y-e.y,tgt.x-e.x);
            buls.push({x:e.x,y:e.y,vx:Math.cos(sang)*10,vy:Math.sin(sang)*10,r:3,l:80,en:false,dmg:1+(P.dmgB||0),pierce:false,col:'#818cf8'});
          }
        }
        // 분신이 플레이어와 같이 이동
        const td=Math.hypot(e.x-P.x,e.y-P.y);
        if(td>60){const sa=Math.atan2(P.y-e.y,P.x-e.x);e.x+=Math.cos(sa)*3;e.y+=Math.sin(sa)*3;}
      });
    }
  }

  // 감지(vision) - 미니맵 강화 및 유령 표시
  if(lv('vision')>=0){
    const vl=lv('vision');
    P._visionLv=vl; // draw에서 사용
  } else {
    P._visionLv=-1;
  }

  // 아이템(분신) - 특성(perk)과 무관하게 항상 작동
  effs.forEach(e=>{
    if(e.type!=='shadow'||!e.fromItem)return;
    const td=Math.hypot(e.x-P.x,e.y-P.y);
    if(td>60){const sa=Math.atan2(P.y-e.y,P.x-e.x);e.x+=Math.cos(sa)*3;e.y+=Math.sin(sa)*3;}
    e.fireT=(e.fireT||0)+1;
    if(e.fireT>=20){
      e.fireT=0;
      const tgt=zoms.filter(z=>!z.dead&&!z.isMinion).sort((a,b)=>Math.hypot(a.x-e.x,a.y-e.y)-Math.hypot(b.x-e.x,b.y-e.y))[0];
      if(tgt){
        const sang=Math.atan2(tgt.y-e.y,tgt.x-e.x);
        buls.push({x:e.x,y:e.y,vx:Math.cos(sang)*10,vy:Math.sin(sang)*10,r:4,l:100,en:false,dmg:8+(P.dmgB||0),pierce:false,col:'#818cf8'});
      }
    }
  });
}

function fireLaser(ang,len,ll,isMG){
  effs.push({type:'laser',x:P.x,y:P.y,ang,len,l:ll>=1?30:18,ml:ll>=1?30:18,col:isMG?'#9333ea':'#facc15',pierce:ll>=2,dmg:4+(P.dmgB||0)});
  const dx=Math.cos(ang),dy=Math.sin(ang);
  zoms.forEach(z=>{
    if(z.dead)return;
    const dx2=z.x-P.x,dy2=z.y-P.y,dot=dx2*dx+dy2*dy;
    if(dot<0||dot>len)return;
    const px=P.x+dx*dot,py=P.y+dy*dot;
    if(d2(px,py,z.x,z.y)<(z.r+5)**2)hitZ(z,6+(P.dmgB||0));
  });
}

function addExp(x,y,r=70,col='#FF6600'){
  const tr=r+(P?P._aoeB||0:0);
  for(let i=0;i<18;i++){const a=Math.random()*Math.PI*2,s=2+Math.random()*5;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:28,ml:28,r:3+Math.random()*3,col});}
  effs.push({type:'ring',x,y,r:0,maxR:tr,l:22,ml:22,col});
}

function hitZ(z,dmg){
  if(equippedJob==='berserker')dmg*=(P._berserkDmg||1);
  if(focusNextShot&&equippedJob==='sniper_job'){dmg*=5;focusNextShot=false;for(let i=0;i<10;i++)parts.push({x:z.x,y:z.y,vx:(Math.random()-.5)*8,vy:(Math.random()-.5)*8,l:20,ml:20,r:5,col:'#facc15'});}
  if(z.dead)return;
  const cl=perkLv['crit']??-1,critC=(cl>=0?[.05,.10,.15,.20,.30][Math.min(cl,4)]:0)+(P._armorCrit||0)+(P._wepCrit||0);
  let d=dmg;
  if(Math.random()<critC){d*=cl>=2?[2,2,2.5,2.5,3,3][Math.min(cl+1,5)]:2;for(let i=0;i<6;i++)parts.push({x:z.x,y:z.y,vx:(Math.random()-.5)*7,vy:(Math.random()-.5)*7,l:18,ml:18,r:4,col:'#ff0'});}
  z.hp-=d;
  for(let i=0;i<4;i++)parts.push({x:z.x,y:z.y,vx:(Math.random()-.5)*5,vy:(Math.random()-.5)*5,l:12,ml:12,r:3,col:z.isBoss?z.bd.col:(ZT[z.type]?.col||'#888')});
  if(z.hp<=0){
    if((z.type==='exploder'||z.type==='suicide_zombie')&&!z._ex){z._ex=true;addExp(z.x,z.y,z.type==='suicide_zombie'?95:70,'#FF6600');}
    z.dead=true;z.dT=z.isBoss?80:35;z._justDied=true;
    score+=Math.floor((z.isBoss?z.bd.reward.c:(ZT[z.type]?.sc||10))*(1+(pUpgLv['pxp']||0)*.1));kills++;
    achStats.kills=(achStats.kills||0)+1;
    if(typeof eventData!=='undefined'){eventData.points=(eventData.points||0)+1;}
    const vl=perkLv['vampiric']??-1;
    if(vl>=0)P.hp=Math.min(P.maxHp,P.hp+[.5,1,2,3,5][Math.min(vl,4)]);
    if(activeBuffs.vampiric>0)P.hp=Math.min(P.maxHp,P.hp+3);
    if(P._armorLS)P.hp=Math.min(P.maxHp,P.hp+P._armorLS);
    if(window._petLifesteal)P.hp=Math.min(P.maxHp,P.hp+window._petLifesteal);
    // 분노 스택
    if(equippedJob==='berserker2')P._rageStack=(P._rageStack||0)+1;
    // 광부 패시브: 추가 코인
    if(equippedJob==='miner'&&!z.isBoss){const bonus=Math.floor((P._goldRush>0?3:1)*.2*(ZT[z.type]?.sc||10));coins+=bonus;}
    // 폭파전문가 패시브: 20% 확률 연쇄 폭발
    if(equippedJob==='demolitionist'&&!z.isBoss&&!z._chainProc){
      if(Math.random()<0.2){
        addExp(z.x,z.y,50,'#f97316');
        zoms.forEach(zz=>{if(!zz.dead&&zz!==z&&d2(zz.x,zz.y,z.x,z.y)<50**2){zz._chainProc=true;hitZ(zz,8+(P.dmgB||0));zz._chainProc=false;}});
      }
    }
    if(z.isBoss)onBossDie(z);
  }
}

function takeDmg(d){
  if(P._invincible>0)return;
  if(P._shadow>0){d*=0.3;}
  if(P._shield>0)return;
  waveDmgTaken+=d;
  const dl=perkLv['dodge']??-1;
  if(dl>=0&&Math.random()<[.05,.10,.15,.20,.30][Math.min(dl,4)])return;
  if(P._armorDodge&&Math.random()<P._armorDodge)return;
  if(P._spShield)dmg=dmg*0.1; // 성흔 방패
  const arR=1-Math.min(.65,(P.armor||0)/100);
  if(activeBuffs.mirror>0){
    const tgt=zoms.filter(z=>!z.dead&&!z.isMinion).sort((a,b)=>d2(a.x,a.y,P.x,P.y)-d2(b.x,b.y,P.x,P.y))[0];
    if(tgt)hitZ(tgt,d*0.5);
  }
  P.hp-=d*arR;
  if(P.hp<=0&&running){
    if(reviveReady){
      reviveReady=false;
      P.hp=Math.floor(P.maxHp*.5);
      setMsg('🪶 부활!');
      setTimeout(()=>{if(running)setMsg('');},2000);
      return;
    }
    running=false;
    window._needLastDraw=true;
    requestAnimationFrame(loop);
  }
}

// ── 보스 ──
function spawnBoss(wn){
  const bd=BOSSES[wn];if(!bd)return;
  const bz={x:MW/2,y:camY+VH()*.12,isBoss:true,bd,r:bd.r,hp:bd.hp,maxHp:bd.hp,spd:.9,angle:0,dead:false,dT:0,_aT:0,_aI:0,phT:[],_chargeV:null,_chargeT:0};
  zoms.unshift(bz);activeBoss=bz;
  document.getElementById('bossBar').style.display='block';updBossBar();
  setMsg(`⚠️ ${bd.icon} ${bd.name} 등장!`);
  // vision lv>=3: 화면 전체 경고 이펙트
  if(P&&(P._visionLv||0)>=3){
    for(let i=0;i<3;i++)setTimeout(()=>{
      effs.push({type:'warn',x:MW/2,y:camY+VH()/2,l:30,ml:30});
    },i*300);
  }
  for(let i=0;i<30;i++)parts.push({x:bz.x,y:bz.y,vx:(Math.random()-.5)*12,vy:(Math.random()-.5)*12,l:55,ml:55,r:5,col:bd.col});
  setTimeout(()=>{if(running)setMsg('');},3000);
}
function updBossBar(){
  const b=activeBoss;if(!b||b.dead)return;
  const pct=Math.max(0,b.hp/b.bd.hp);
  document.getElementById('bFill').style.width=(pct*100)+'%';
  document.getElementById('bHp').textContent=Math.ceil(b.hp)+'/'+b.bd.hp;
  document.getElementById('bNm').textContent=b.bd.icon+' '+b.bd.name;
  document.getElementById('bFill').style.background=pct>.5?'linear-gradient(90deg,#ef4444,#fbbf24)':pct>.25?'linear-gradient(90deg,#dc2626,#f97316)':'linear-gradient(90deg,#7f1d1d,#ef4444)';
  if(b.bd.phases){let ph='';for(const p of b.bd.phases)if(pct<=p.t){ph=p.m;break;}document.getElementById('bPhase').textContent=ph;}
}
function onBossDie(z){
  coins+=Math.floor(z.bd.reward.c*(window._petCoinMult||1));energy+=Math.floor(z.bd.reward.e*(window._petEnergyMult||1));saveAll();updHUD();
  addSeasonXP(Math.floor(z.bd.reward.c*0.5*(window._petXpMult||1))); // 보스 XP
  // 보스 킬 기록
  if(z.bossMapId){ achStats.bossKills=achStats.bossKills||{}; achStats.bossKills[z.bossMapId]=(achStats.bossKills[z.bossMapId]||0)+1; }
  if(z.bd&&z.bd.id&&z.bd.id.startsWith('dream_')){ achStats.bossKills=achStats.bossKills||{}; const dk=z.bd.id.replace('_boss',''); achStats.bossKills[dk]=(achStats.bossKills[dk]||0)+1; }
  if(waveDmgTaken===0){achStats.noDmgBoss=(achStats.noDmgBoss||0)+1;}
  if(P.hp<=z.bd.hp*0.1+1){achStats.dreamCloseKill=(achStats.dreamCloseKill||0)+1;}
  if(typeof eventData!=='undefined'){eventData.points=(eventData.points||0)+100;saveEventData();}
  checkAchievements(); saveAch();
  activeBoss=null;document.getElementById('bossBar').style.display='none';
  // 보스맵 클리어
  if(z.bossMapId){
    activeBossMap=null;bossMapData=null;
    // 보스 전용 무기 지급
    const dropWep=Object.values(WEPS).find(w=>w.bossReward===z.bossMapId);
    if(dropWep&&!owned[dropWep.id]){
      owned[dropWep.id]=true;saveAll();
    }
    window._bossMapClearing=true;
    stopLoop();
    // 클리어 화면 표시
    setTimeout(()=>{
      document.getElementById('clearTitle').textContent=z.bd.icon+' '+z.bd.name+' 처치!';
      document.getElementById('clearSub').textContent='보스 클리어 달성!';
      const _dropW=Object.values(WEPS).find(w=>w.bossReward===z.bossMapId);
      const _rarityStyle={rare:'background:linear-gradient(135deg,#6366f1,#818cf8);border:2px solid #818cf8',epic:'background:linear-gradient(135deg,#7c3aed,#a855f7);border:2px solid #c084fc',legendary:'background:linear-gradient(135deg,#d97706,#fbbf24);border:2px solid #fbbf24',mythic:'background:linear-gradient(135deg,#ec4899,#8b5cf6,#06b6d4);border:2px solid #fff'};
      const _rs=_dropW?(_rarityStyle[_dropW.rarity]||'background:#374151;border:2px solid #6b7280'):'';
      document.getElementById('clearReward').innerHTML=
        `<div style="background:#fef3c7;border:2px solid #f59e0b;color:#92400e;padding:8px 20px;border-radius:20px;font-weight:800;font-size:18px;">🪙 +${z.bd.reward.c.toLocaleString()}</div>`+
        `<div style="background:#ede9ff;border:2px solid #7c3aed;color:#4c1d95;padding:8px 20px;border-radius:20px;font-weight:800;font-size:18px;">⚡ +${z.bd.reward.e.toLocaleString()}</div>`+
        (_dropW?`<div style="${_rs};color:#fff;padding:8px 16px;border-radius:20px;font-weight:900;font-size:15px;text-align:center;">${_dropW.icon} 【클리어 보상】 ${_dropW.name}<br><span style="font-size:10px;opacity:.8">${_dropW.desc}</span></div>`:'');
      document.getElementById('clearScreen').style.display='flex';
    },100);
    return;
  }
  for(let i=0;i<50;i++)parts.push({x:z.x,y:z.y,vx:(Math.random()-.5)*14,vy:(Math.random()-.5)*14,l:70,ml:70,r:4+Math.random()*6,col:['#FFD700','#f97316','#9333ea','#22c55e'][Math.floor(Math.random()*4)]});
  setMsg(`🎉 ${z.bd.icon} ${z.bd.name} 처치! +${z.bd.reward.c}🪙 +${z.bd.reward.e}⚡`);
  setTimeout(()=>{if(running)setMsg('');},3500);
}
function doBossAtk(z){
  const ab=(z.bd.atk||[])[z._aI%Math.max(1,(z.bd.atk||[]).length)];z._aI++;
  // 드림코어 보스 분기
  if(z.bd&&z.bd.id&&z.bd.id.startsWith('dream_')){doDreamBossAtk(z,ab);return;}
  if(ab==='burst8')for(let i=0;i<8;i++){const a=z.angle+i/8*Math.PI*2;buls.push({x:z.x,y:z.y,vx:Math.cos(a)*4.5,vy:Math.sin(a)*4.5,r:6,l:140,en:true,dmg:8});}
  else if(ab==='burst12')for(let i=0;i<12;i++){const a=i/12*Math.PI*2;buls.push({x:z.x,y:z.y,vx:Math.cos(a)*4,vy:Math.sin(a)*4,r:5,l:140,en:true,dmg:6});}
  else if(ab==='burst16')for(let i=0;i<16;i++){const a=i/16*Math.PI*2;buls.push({x:z.x,y:z.y,vx:Math.cos(a)*5,vy:Math.sin(a)*5,r:7,l:150,en:true,dmg:10});}
  else if(ab==='charge'){const dx=P.x-z.x,dy=P.y-z.y,dl=Math.sqrt(d2(P.x,P.y,z.x,z.y))||1;z._chargeV={vx:dx/dl*9,vy:dy/dl*9};z._chargeT=22;}
  else if(ab==='poisonRing')for(let i=0;i<8;i++){const a=i/8*Math.PI*2;buls.push({x:z.x,y:z.y,vx:Math.cos(a)*2.5,vy:Math.sin(a)*2.5,r:7,l:200,en:true,dmg:5,poison:true});}
  else if(ab==='poisonCloud')effs.push({type:'cloud',x:z.x,y:z.y,l:200,ml:200,r:70,dmgMult:1,dmgT:0});
  else if(ab==='blink'){z.x=80+Math.random()*(MW-160);z.y=camY+50+Math.random()*(VH()-120);for(let i=0;i<12;i++)parts.push({x:z.x,y:z.y,vx:(Math.random()-.5)*7,vy:(Math.random()-.5)*7,l:22,ml:22,r:4,col:'#818cf8'});}
  else if(ab==='summon'){
    const pool=['runner','poison','prophet','demon','golem'];
    for(let i=0;i<3;i++)spawnZType(pool[Math.floor(Math.random()*pool.length)]);
  }
  else if(ab==='summonAll')['runner','poison','exploder','demon','prophet','golem'].forEach(t=>spawnZType(t));
  else if(ab==='spikeField'){for(let i=0;i<5;i++){const ang=Math.random()*Math.PI*2,dist=60+Math.random()*140;const tx=P.x+Math.cos(ang)*dist,ty=P.y+Math.sin(ang)*dist;const delay=i*100;effs.push({type:'warn',x:tx,y:ty,l:delay/1000*60+20,ml:delay/1000*60+20});gTimeout(()=>{if(!running)return;addExp(tx,ty,45,'#16a34a');zoms.forEach(zz=>{if(!zz.dead&&d2(zz.x,zz.y,tx,ty)<(45+zz.r)**2)hitZ(zz,8);});if(d2(P.x,P.y,tx,ty)<(45+P.r)**2)takeDmg(10);},delay);}}
  else if(ab==='freeze'){P._frozen=(P._frozen||0)+120;for(let i=0;i<12;i++)parts.push({x:P.x,y:P.y,vx:(Math.random()-.5)*5,vy:(Math.random()-.5)*5,l:25,ml:25,r:5,col:'#7dd3fc'});}
  else if(ab==='lightning'){const tx=P.x,ty=P.y;effs.push({type:'warn',x:tx,y:ty,l:30,ml:30});gTimeout(()=>{if(!running)return;addExp(tx,ty,65,'#facc15');if(d2(P.x,P.y,tx,ty)<(65+P.r)**2)takeDmg(15);},500);}
  else if(ab==='fireBreath')for(let i=0;i<7;i++){const a=z.angle+(i-3)*.15;buls.push({x:z.x,y:z.y,vx:Math.cos(a)*8,vy:Math.sin(a)*8,r:8,l:70,en:true,dmg:12,col:'#ff6600'});}
  // 🌋 VOLCANO - 용암 웅덩이 (지연 폭발)
  else if(ab==='lavaPool'){
    for(let i=0;i<4;i++){
      const ang=Math.random()*Math.PI*2,dist=50+Math.random()*160;
      const tx=P.x+Math.cos(ang)*dist,ty=P.y+Math.sin(ang)*dist;
      effs.push({type:'warn',x:tx,y:ty,l:50,ml:50});
      gTimeout(()=>{if(!running)return;addExp(tx,ty,55,'#f97316');zoms.forEach(zz=>{if(!zz.dead&&d2(zz.x,zz.y,tx,ty)<(55+zz.r)**2)hitZ(zz,10);});if(d2(P.x,P.y,tx,ty)<(55+P.r)**2)takeDmg(45);},800);
    }
  }
  // 🧊 FROST EMPRESS - 얼음창 3연발
  else if(ab==='iceSpear'){
    const ang=Math.atan2(P.y-z.y,P.x-z.x);
    for(let i=-1;i<=1;i++)buls.push({x:z.x,y:z.y,vx:Math.cos(ang+i*.1)*11,vy:Math.sin(ang+i*.1)*11,r:8,l:180,en:true,dmg:40,col:'#7dd3fc'});
  }
  // 🌌 VOID REAPER - 차원 균열
  else if(ab==='voidRift'){
    const tx=Math.random()*MW,ty=camY+Math.random()*VH();
    effs.push({type:'warn',x:tx,y:ty,l:40,ml:40});
    gTimeout(()=>{if(!running)return;for(let i=0;i<10;i++){const a=i/10*Math.PI*2;buls.push({x:tx,y:ty,vx:Math.cos(a)*7,vy:Math.sin(a)*7,r:8,l:150,en:true,dmg:35,col:'#7c3aed'});}},700);
  }
  // ── 보스맵 전용 공격 (맵 지형 활용 + 데미지 대폭 강화) ──

  // ☀️ THE SUN - 태양 광선 + 맵 경계 불꽃벽
  else if(ab==='sunRay'){
    // 16방향 방사 + 맵 가장자리에서 안쪽으로 불덩이
    for(let i=0;i<16;i++){const a=i/16*Math.PI*2+(z._aI*.15);buls.push({x:z.x,y:z.y,vx:Math.cos(a)*10,vy:Math.sin(a)*10,r:9,l:160,en:true,dmg:60,col:'#fbbf24'});}
    // 맵 4방향 경계에서 불꽃이 안쪽으로 밀려옴
    for(let i=0;i<5;i++){
      const side=z._aI%4;
      const bx=side===0?0:side===1?MW:Math.random()*MW;
      const by=side===2?camY:side===3?camY+VH():camY+Math.random()*VH();
      const ang=Math.atan2(z.y-by,z.x-bx);
      gTimeout(()=>{if(!running)return;
        effs.push({type:'warn',x:bx,y:by,l:25,ml:25});
        gTimeout(()=>{if(!running)return;buls.push({x:bx,y:by,vx:Math.cos(ang)*8,vy:Math.sin(ang)*8,r:10,l:200,en:true,dmg:50,col:'#f97316'});},400);
      },i*120);
    }
  }
  else if(ab==='sunOrb'){
    const ang=Math.atan2(P.y-z.y,P.x-z.x);
    for(let i=-3;i<=3;i++)buls.push({x:z.x,y:z.y,vx:Math.cos(ang+i*.1)*12,vy:Math.sin(ang+i*.1)*12,r:10,l:140,en:true,dmg:70,col:'#f97316'});
  }
  else if(ab==='sunNova'){
    // 맵 전체 불꽃 노바: 32방향 + 맵 격자 경계선 따라 불꽃
    for(let i=0;i<32;i++){const a=i/32*Math.PI*2;buls.push({x:z.x,y:z.y,vx:Math.cos(a)*13,vy:Math.sin(a)*13,r:11,l:200,en:true,dmg:80,col:'#ff4400'});}
    // 맵 격자(200px)마다 불꽃 기둥
    for(let gx=0;gx<MW;gx+=200){
      const gy=camY+Math.random()*VH();
      effs.push({type:'warn',x:gx,y:gy,l:40,ml:40});
      gTimeout(()=>{if(!running)return;addExp(gx,gy,60,'#ff6600');if(d2(P.x,P.y,gx,gy)<(60+P.r)**2)takeDmg(55);},660);
    }
  }

  // ⚙️ THE MACHINE - 레이저 격자 + 기계 탄막
  else if(ab==='laserAim'){
    // 조준 레이저 5연속
    const ang=Math.atan2(P.y-z.y,P.x-z.x);
    for(let i=0;i<5;i++)gTimeout(()=>{if(!running)return;
      buls.push({x:z.x,y:z.y,vx:Math.cos(ang)*16,vy:Math.sin(ang)*16,r:7,l:120,en:true,dmg:65,col:'#60a5fa'});
    },i*70);
  }
  else if(ab==='rotateBurst'){
    // 회전 탄막 + 맵 모서리에서 레이저 발사
    const base=Date.now()/400;
    for(let i=0;i<14;i++){const a=base+i/14*Math.PI*2;buls.push({x:z.x,y:z.y,vx:Math.cos(a)*9,vy:Math.sin(a)*9,r:7,l:150,en:true,dmg:50,col:'#3b82f6'});}
    // 맵 4구석에서 레이저
    [[0,camY],[MW,camY],[0,camY+VH()],[MW,camY+VH()]].forEach(([cx,cy])=>{
      const ang2=Math.atan2(P.y-cy,P.x-cx);
      effs.push({type:'warn',x:cx,y:cy,l:30,ml:30});
      gTimeout(()=>{if(!running)return;buls.push({x:cx,y:cy,vx:Math.cos(ang2)*10,vy:Math.sin(ang2)*10,r:6,l:160,en:true,dmg:55,col:'#93c5fd'});},500);
    });
  }
  else if(ab==='missileLock'){
    // 유도 미사일 5발 + 맵 격자 지뢰
    const ang=Math.atan2(P.y-z.y,P.x-z.x);
    for(let i=-2;i<=2;i++)buls.push({x:z.x,y:z.y,vx:Math.cos(ang+i*.15)*11,vy:Math.sin(ang+i*.15)*11,r:10,l:220,en:true,dmg:75,col:'#1d4ed8'});
    // 맵 가로줄마다 지뢰
    for(let y2=camY+80;y2<camY+VH()-80;y2+=160){
      const x2=Math.random()*MW;
      effs.push({type:'warn',x:x2,y:y2,l:50,ml:50});
      gTimeout(()=>{if(!running)return;addExp(x2,y2,50,'#1d4ed8');if(d2(P.x,P.y,x2,y2)<(50+P.r)**2)takeDmg(60);},830);
    }
  }

  // 🦠 BACTERIA - 세포 분열 + 독 지역
  else if(ab==='splitShot'){
    // 분열탄: 맵 전체에 독 세포 퍼짐
    for(let i=0;i<10;i++){const a=i/10*Math.PI*2+(z._aI*.1);buls.push({x:z.x,y:z.y,vx:Math.cos(a)*7,vy:Math.sin(a)*7,r:11,l:200,en:true,dmg:45,col:'#4ade80',poison:true});}
    // 맵 정사각형 구역마다 독 안개
    for(let i=0;i<3;i++){
      const px=Math.random()*MW,py=camY+50+Math.random()*(VH()-100);
      gTimeout(()=>{if(!running)return;effs.push({type:'cloud',x:px,y:py,l:300,ml:300,r:90,dmgMult:2,dmgT:0});},i*200);
    }
  }

  // 🕐 CLOCK - 시계바늘 + 맵 전체 시간 폭풍
  else if(ab==='clockHand'){
    // 시계바늘이 맵을 가로지르며 회전
    const spd=9+z._aI*.2;
    for(let i=0;i<4;i++){const a=z.angle+i/4*Math.PI*2+(Date.now()/600);
      // 바늘 끝에서 맵 가장자리까지 탄환
      for(let dist=60;dist<350;dist+=60)
        buls.push({x:z.x+Math.cos(a)*dist,y:z.y+Math.sin(a)*dist,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,r:8,l:110,en:true,dmg:55,col:'#a78bfa'});
    }
  }
  else if(ab==='clockBurst'){
    // 맵 세로 줄마다 시계 탄환 기둥 (폐허도시 골목 느낌)
    for(let x2=100;x2<MW;x2+=180){
      effs.push({type:'warn',x:x2,y:camY+VH()/2,l:35,ml:35});
      gTimeout(()=>{if(!running)return;
        for(let y2=camY;y2<camY+VH();y2+=60)
          buls.push({x:x2,y:y2,vx:0,vy:0,r:7,l:60,en:true,dmg:45,col:'#c4b5fd'});
      },580);
    }
  }

  // 💀 SKELETON - 뼈 폭우 + 벽에서 뼈 튕기기
  else if(ab==='boneRain'){
    // 맵 위에서 뼈가 빽빽하게 비처럼 내림
    for(let i=0;i<14;i++){
      const x2=Math.random()*MW;
      effs.push({type:'warn',x:x2,y:camY+10,l:30,ml:30});
      gTimeout(()=>{if(!running)return;buls.push({x:x2,y:camY-20,vx:(Math.random()-.5)*2,vy:11,r:9,l:140,en:true,dmg:55,col:'#d1d5db'});},i*50+500);
    }
  }
  else if(ab==='boneRing'){
    // 360 뼈링 + 맵 벽에서 반사탄
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2+(z._aI*.2);
      buls.push({x:z.x,y:z.y,vx:Math.cos(a)*9,vy:Math.sin(a)*9,r:9,l:180,en:true,dmg:50,col:'#e5e7eb',_bounces:0});}
    // 맵 좌우 벽에서 뼈 반사
    for(let y2=camY+50;y2<camY+VH();y2+=120){
      buls.push({x:0,y:y2,vx:7,vy:(Math.random()-.5)*3,r:8,l:150,en:true,dmg:45,col:'#d1d5db'});
      buls.push({x:MW,y:y2,vx:-7,vy:(Math.random()-.5)*3,r:8,l:150,en:true,dmg:45,col:'#d1d5db'});
    }
  }

  // ☠️ REANIMATION - 부활 파동 + 맵 전체 저주
  else if(ab==='waveRing'){
    // 맵 중심+보스에서 동시에 파동
    for(let i=0;i<18;i++){const a=i/18*Math.PI*2;buls.push({x:z.x,y:z.y,vx:Math.cos(a)*9,vy:Math.sin(a)*9,r:10,l:170,en:true,dmg:65,col:'#ef4444'});}
    // 맵 중앙에서도 파동
    const mx2=MW/2,my2=camY+VH()/2;
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2;buls.push({x:mx2,y:my2,vx:Math.cos(a)*7,vy:Math.sin(a)*7,r:9,l:150,en:true,dmg:55,col:'#fca5a5'});}
  }

  // 🐙 KRAKEN - 촉수 + 맵 직사각형 구역 공격
  else if(ab==='tentacle'){
    // 맵의 직사각형 구역(200x200) 여러 곳에 촉수 내리꽂기
    const zones=[];
    for(let i=0;i<5;i++){
      const tx=Math.floor(Math.random()*4)*200+100;
      const ty=camY+60+Math.floor(Math.random()*3)*(VH()/3);
      zones.push([tx,ty]);
      effs.push({type:'warn',x:tx,y:ty,l:50,ml:50});
      gTimeout(()=>{if(!running)return;
        // 촉수 타격: 100x300 범위 세로로 길게
        for(let dy=-150;dy<=150;dy+=30)
          buls.push({x:tx,y:ty+dy,vx:0,vy:0,r:14,l:40,en:true,dmg:70,col:'#22d3ee'});
        addExp(tx,ty,80,'#0891b2');
        if(Math.abs(P.x-tx)<100&&Math.abs(P.y-ty)<150)takeDmg(65);
      },833);
    }
    // 맵 가장자리에서도 촉수 (바다에서 나오는 느낌)
    for(let i=0;i<3;i++){
      const side=i%2===0?0:MW;
      const ty2=camY+100+Math.random()*(VH()-200);
      effs.push({type:'warn',x:side,y:ty2,l:40,ml:40});
      gTimeout(()=>{if(!running)return;
        const vx2=side===0?8:-8;
        buls.push({x:side,y:ty2,vx:vx2,vy:(Math.random()-.5)*4,r:14,l:180,en:true,dmg:75,col:'#0891b2'});
      },600+i*150);
    }
  }
  else if(ab==='inkCloud'){
    // 먹물: 플레이어+맵 3곳에 독구름
    effs.push({type:'cloud',x:P.x,y:P.y,l:250,ml:250,r:100,dmgMult:2.5,dmgT:0});
    for(let i=0;i<2;i++){
      effs.push({type:'cloud',x:Math.random()*MW,y:camY+Math.random()*VH(),l:200,ml:200,r:80,dmgMult:2,dmgT:0});
    }
  }

  // 🎵 FANTASTIC SYMPHONY - 무지개 탄막 + 맵 전체 음표 폭발
  else if(ab==='noteBurst'){
    // 회전 무지개 탄막 + 빠른 속도
    const base=Date.now()/250;
    for(let i=0;i<8;i++){const a=base+i/8*Math.PI*2;
      buls.push({x:z.x,y:z.y,vx:Math.cos(a)*(10+z._aI*.08),vy:Math.sin(a)*(10+z._aI*.08),r:9,l:180,en:true,dmg:70+Math.floor(z._aI/8),col:`hsl(${z._aI*15%360},85%,65%)`});}
    // 맵 전체 격자에 음표 폭탄
    if(z._aI%3===0){
      for(let gx=100;gx<MW;gx+=200){
        const gy=camY+50+Math.random()*(VH()-100);
        effs.push({type:'warn',x:gx,y:gy,l:40,ml:40});
        gTimeout(()=>{if(!running)return;addExp(gx,gy,70,`hsl(${gx},80%,60%)`);if(d2(P.x,P.y,gx,gy)<(70+P.r)**2)takeDmg(75);},666);
      }
    }
  }
  else if(ab==='noteRing'){
    const ang=Math.atan2(P.y-z.y,P.x-z.x);
    for(let i=0;i<4;i++){const a=ang+(i-1.5)*.18;
      buls.push({x:z.x,y:z.y,vx:Math.cos(a)*13,vy:Math.sin(a)*13,r:8,l:130,en:true,dmg:80,col:`hsl(${i*40},90%,65%)`});}
    for(let i=0;i<3;i++){
      const ly=camY+VH()*.2+i*(VH()*.3);
      effs.push({type:'warn',x:MW/2,y:ly,l:35,ml:35});
      gTimeout(()=>{if(!running)return;
        for(let lx=0;lx<MW;lx+=40)
          buls.push({x:lx,y:ly,vx:0,vy:0,r:8,l:40,en:true,dmg:85,col:`hsl(${i*120},90%,60%)`});
      },583);
    }
  }

  // 🎵 SYMPHONY: 탄환 100개 연속 발사 (OMEGA)
  else if(ab==='noteStorm'){
    setMsg('🎵 OMEGA STORM!');
    for(let i=0;i<25;i++){
      gTimeout(()=>{
        const a=Math.random()*Math.PI*2;
        buls.push({x:z.x,y:z.y,vx:Math.cos(a)*(5+Math.random()*5),vy:Math.sin(a)*(5+Math.random()*5),r:7,l:130,en:true,
          dmg:90,col:`hsl(${i*14},90%,60%)`});
      },i*80);
    }
  }

  // 🦠 BACTERIA: 거미 50마리 소환
  else if(ab==='spiderSwarm'){
    setMsg('🦠 포자 폭발 - 거미 50마리 소환!');
    // 경고 이펙트
    addExp(z.x,z.y,120,'#4ade80');
    for(let i=0;i<50;i++){
      gTimeout(()=>{
        if(!running)return;
        // 맵 전체에 랜덤 위치로 소환
        const sx=50+Math.random()*(MW-100);
        const sy=camY+50+Math.random()*(VH()-100);
        const T=ZT['spider'];
        zoms.push({x:sx,y:sy,type:'spider',r:T.r,hp:T.bHp*2,maxHp:T.bHp*2,
          spd:T.spd*1.5,angle:0,dead:false,dT:0,_dshC:180,_dsh:false,
          _dvx:0,_dvy:0,_healT:0,_phT:60,_phased:false,_frz:0,wob:0,_zigT:0,_webT:0});
      },i*60);
    }
  }

  // 💀 SKELETON: 십자방향 탄환 100개
  else if(ab==='crossBone'){
    setMsg('💀 십자 뼈 폭풍 - 100발!');
    // 4방향으로 각 25발씩 = 100발
    const dirs=[0, Math.PI/2, Math.PI, Math.PI*1.5];
    dirs.forEach((baseAng,di)=>{
      for(let i=0;i<25;i++){
        gTimeout(()=>{
          if(!running)return;
          const spread=(i-12)*.04; // 약간 퍼짐
          const a=baseAng+spread;
          buls.push({x:z.x,y:z.y,vx:Math.cos(a)*10,vy:Math.sin(a)*10,
            r:9,l:180,en:true,dmg:60,col:'#d1d5db'});
        },i*25+di*50);
      }
    });
    // 맵 전체에 뼈 비도 추가
    for(let i=0;i<8;i++){
      const x2=Math.random()*MW;
      gTimeout(()=>{
        if(!running)return;
        effs.push({type:'warn',x:x2,y:camY+10,l:25,ml:25});
        gTimeout(()=>{if(!running)return;
          buls.push({x:x2,y:camY-20,vx:0,vy:10,r:9,l:120,en:true,dmg:55,col:'#e5e7eb'});
        },416);
      },i*80);
    }
  }

  // 🐙 KRAKEN: 맵 직사각형 구역 전체 촉수 격자 공격
  else if(ab==='tentacleGrid'){
    setMsg('🐙 촉수 격자 - 맵 전체 강타!');
    // 맵을 200x200 격자로 나눠서 각 구역에 촉수 공격
    const gridW=200, gridH=200;
    for(let gx=0;gx<MW;gx+=gridW){
      for(let gy=0;gy<Math.min(VH(),800);gy+=gridH){
        const tx=gx+gridW/2;
        const ty=camY+gy+gridH/2;
        const delay=(gx/gridW+gy/gridH)*80;
        effs.push({type:'warn',x:tx,y:ty,l:Math.ceil(delay/16)+30,ml:Math.ceil(delay/16)+30});
        gTimeout(()=>{
          if(!running)return;
          // 각 구역 테두리를 따라 촉수
          for(let edge=0;edge<4;edge++){
            const ex=edge===0?gx:edge===1?gx+gridW:gx+Math.random()*gridW;
            const ey=edge===2?ty-gridH/2:edge===3?ty+gridH/2:ty+(Math.random()-.5)*gridH;
            buls.push({x:ex,y:ey,vx:0,vy:0,r:14,l:35,en:true,dmg:75,col:'#0891b2'});
          }
          if(d2(P.x,P.y,tx,ty)<(100+P.r)**2)takeDmg(70);
        },delay+500);
      }
    }
  }

  // ── 새 패턴들 ──
  else if(ab==='laserBeam'){
    const ang=Math.atan2(P.y-z.y,P.x-z.x);
    setMsg('⚡ 레이저 빔!');
    effs.push({type:'warn',x:z.x+Math.cos(ang)*200,y:z.y+Math.sin(ang)*200,l:40,ml:40});
    gTimeout(()=>{if(!running)return;
      for(let dist=0;dist<520;dist+=22)
        buls.push({x:z.x+Math.cos(ang)*dist,y:z.y+Math.sin(ang)*dist,vx:0,vy:0,r:16,l:90,en:true,dmg:35,laser:true,col:z.bd.col});
    },660);
  }
  else if(ab==='horiBeam'){
    setMsg('📡 수평 스캔 빔!');
    for(let i=0;i<3;i++){
      const ly=camY+VH()*.15+i*(VH()*.28);
      effs.push({type:'warn',x:MW/2,y:ly,l:50+i*5,ml:50+i*5});
      gTimeout(()=>{if(!running)return;
        for(let lx=0;lx<=MW;lx+=22)
          buls.push({x:lx,y:ly,vx:0,vy:0,r:15,l:85,en:true,dmg:32,laser:true,col:z.bd.col});
      },700+i*220);
    }
  }
  else if(ab==='vertBeam'){
    setMsg('📡 수직 스캔 빔!');
    for(let i=0;i<4;i++){
      const lx=80+i*(MW/4);
      effs.push({type:'warn',x:lx,y:camY+VH()/2,l:50,ml:50});
      gTimeout(()=>{if(!running)return;
        for(let ly2=camY-30;ly2<camY+VH()+30;ly2+=22)
          buls.push({x:lx,y:ly2,vx:0,vy:0,r:15,l:85,en:true,dmg:32,laser:true,col:z.bd.col});
      },700+i*180);
    }
  }
  else if(ab==='bombDrop'){
    setMsg('💣 폭탄 투하!');
    for(let i=0;i<8;i++){
      gTimeout(()=>{if(!running)return;
        const tx=50+Math.random()*(MW-100),ty=camY+60+Math.random()*(VH()-120);
        effs.push({type:'warn',x:tx,y:ty,l:50,ml:50});
        gTimeout(()=>{if(!running)return;
          addExp(tx,ty,90,z.bd.col);
          for(let j=0;j<10;j++){const a=j/10*Math.PI*2;buls.push({x:tx,y:ty,vx:Math.cos(a)*6,vy:Math.sin(a)*6,r:8,l:100,en:true,dmg:55,col:z.bd.col});}
          if(d2(P.x,P.y,tx,ty)<(90+P.r)**2)takeDmg(65);
        },833);
      },i*150);
    }
  }
  else if(ab==='homingMissile'){
    setMsg('🚀 추적 미사일 5발!');
    for(let i=0;i<5;i++){
      gTimeout(()=>{if(!running)return;
        const ang=Math.atan2(P.y-z.y,P.x-z.x)+(i-2)*.2;
        buls.push({x:z.x,y:z.y,vx:Math.cos(ang)*5,vy:Math.sin(ang)*5,r:10,l:300,en:true,dmg:80,col:z.bd.col,_homing:true,_hspd:7});
      },i*120);
    }
  }
  else if(ab==='sunWall'){
    setMsg('☀️ 불꽃 장벽 - 틈새를 피해라!');
    for(let i=0;i<3;i++){
      const ly=camY+VH()*.15+i*(VH()*.28);
      const gapY=P.y;
      effs.push({type:'warn',x:MW/2,y:ly,l:45+i*10,ml:45+i*10});
      gTimeout(()=>{if(!running)return;
        for(let lx=0;lx<MW;lx+=26){
          if(Math.abs(ly-gapY)<90)continue;
          buls.push({x:lx,y:ly,vx:0,vy:0,r:13,l:110,en:true,dmg:42,laser:true,col:'#f97316'});
        }
      },666+i*120);
    }
  }
  else if(ab==='sunSpiral'){
    setMsg('☀️ 태양 나선 불꽃!');
    let tick=0;const itv=setInterval(()=>{
      if(!running||tick>70){clearInterval(itv);const _i=gameTimers.indexOf(itv);if(_i>=0)gameTimers.splice(_i,1);return;}
      const a=tick*.28;
      buls.push({x:z.x,y:z.y,vx:Math.cos(a)*12,vy:Math.sin(a)*12,r:9,l:160,en:true,dmg:58,col:'#fbbf24'});
      buls.push({x:z.x,y:z.y,vx:Math.cos(a+Math.PI)*11,vy:Math.sin(a+Math.PI)*11,r:9,l:160,en:true,dmg:58,col:'#f97316'});
      tick++;
    },45);
    gameTimers.push(itv);
  }
  else if(ab==='machineGrid'){
    setMsg('⚙️ 격자 레이저 - 가로+세로!');
    gTimeout(()=>doBossAtkDirect(z,'horiBeam'),0);
    gTimeout(()=>doBossAtkDirect(z,'vertBeam'),600);
  }
  else if(ab==='overdrive'){
    setMsg('⚙️ 오버드라이브 - 연속 조준 20발!');
    for(let i=0;i<20;i++){
      gTimeout(()=>{if(!running)return;
        const ang=Math.atan2(P.y-z.y,P.x-z.x)+(Math.random()-.5)*.25;
        buls.push({x:z.x,y:z.y,vx:Math.cos(ang)*14,vy:Math.sin(ang)*14,r:8,l:150,en:true,dmg:62,col:'#3b82f6'});
      },i*75);
    }
  }
  else if(ab==='acidRain'){
    setMsg('🦠 독 산성비 30발!');
    for(let i=0;i<30;i++){
      gTimeout(()=>{if(!running)return;
        buls.push({x:Math.random()*MW,y:camY-20,vx:(Math.random()-.5)*2,vy:9,r:9,l:140,en:true,dmg:48,col:'#4ade80',poison:true});
      },i*80);
    }
  }
  else if(ab==='cellDivide'){
    setMsg('🦠 세포 폭발 분열!');
    addExp(z.x,z.y,150,'#4ade80');
    for(let i=0;i<20;i++){const a=i/20*Math.PI*2;
      buls.push({x:z.x+Math.cos(a)*80,y:z.y+Math.sin(a)*80,vx:Math.cos(a)*4,vy:Math.sin(a)*4,r:11,l:200,en:true,dmg:52,col:'#86efac',poison:true});
    }
    for(let i=0;i<3;i++)effs.push({type:'cloud',x:z.x+(Math.random()-.5)*200,y:z.y+(Math.random()-.5)*200,l:240,ml:240,r:80,dmgMult:2,dmgT:0});
  }
  else if(ab==='timeLaser'){
    setMsg('🕐 8방향 시간 레이저!');
    const base=Date.now()/400;
    for(let i=0;i<8;i++){
      const ang=i/8*Math.PI*2+base;
      effs.push({type:'warn',x:z.x+Math.cos(ang)*100,y:z.y+Math.sin(ang)*100,l:38,ml:38});
      gTimeout(()=>{if(!running)return;
        for(let dist=0;dist<400;dist+=24)
          buls.push({x:z.x+Math.cos(ang)*dist,y:z.y+Math.sin(ang)*dist,vx:0,vy:0,r:14,l:95,en:true,dmg:42,laser:true,col:'#a78bfa'});
      },630);
    }
  }
  else if(ab==='timeStop'){
    setMsg('🕐 시간 정지 + 폭탄 12개!');
    P._frozen=(P._frozen||0)+180;
    for(let i=0;i<12;i++){
      gTimeout(()=>{if(!running)return;
        const tx=Math.random()*MW,ty=camY+50+Math.random()*(VH()-100);
        effs.push({type:'warn',x:tx,y:ty,l:50,ml:50});
        gTimeout(()=>{if(!running)return;
          addExp(tx,ty,70,'#7c3aed');if(d2(P.x,P.y,tx,ty)<(70+P.r)**2)takeDmg(72);
        },833);
      },i*60);
    }
  }
  else if(ab==='boneCross'){
    setMsg('💀 십자+사선 - 8방향 X자 뼈 폭풍!');
    const dirs=[0,Math.PI/4,Math.PI/2,Math.PI*.75,Math.PI,Math.PI*1.25,Math.PI*1.5,Math.PI*1.75];
    dirs.forEach((baseAng,di)=>{
      for(let i=0;i<20;i++){
        gTimeout(()=>{if(!running)return;
          const a=baseAng+(i-10)*.03;
          buls.push({x:z.x,y:z.y,vx:Math.cos(a)*11,vy:Math.sin(a)*11,r:9,l:185,en:true,dmg:58,col:'#d1d5db'});
        },i*20+di*35);
      }
    });
  }
  else if(ab==='boneArmy'){
    setMsg('💀 해골 군단 - 탱커+달리기 35마리!');
    for(let i=0;i<20;i++)gTimeout(()=>{if(!running)return;spawnZType('tanker');},i*100);
    for(let i=0;i<15;i++)gTimeout(()=>{if(!running)return;spawnZType('runner');},i*60);
  }
  else if(ab==='gravityPull'){
    setMsg('💀 중력 붕괴 - 끌어당기기!');
    P._frozen=(P._frozen||0)+60;
    P.x+=(z.x-P.x)*.18;P.y+=(z.y-P.y)*.18;
    for(let i=0;i<18;i++){const a=i/18*Math.PI*2;
      buls.push({x:z.x+Math.cos(a)*50,y:z.y+Math.sin(a)*50,vx:Math.cos(a)*10,vy:Math.sin(a)*10,r:10,l:165,en:true,dmg:62,col:'#e5e7eb'});
    }
  }
  else if(ab==='deathWave'){
    setMsg('☠️ 죽음의 파동 - 3연속!');
    for(let w=0;w<3;w++){
      gTimeout(()=>{if(!running)return;
        const cnt=18+w*6;
        for(let i=0;i<cnt;i++){const a=i/cnt*Math.PI*2;
          buls.push({x:z.x,y:z.y,vx:Math.cos(a)*(9+w*2),vy:Math.sin(a)*(9+w*2),r:10,l:170,en:true,dmg:65+w*18,col:w===0?'#fca5a5':w===1?'#ef4444':'#7f1d1d'});
        }
      },w*420);
    }
  }
  else if(ab==='undead'){
    setMsg('☠️ 완전 부활!');
    let cnt=0;
    zoms.filter(z2=>z2.dead&&z2.dT>5).forEach(z2=>{if(cnt<30){z2.dead=false;z2.hp=z2.maxHp*.7;cnt++;}});
    if(cnt>0)setMsg(`☠️ ${cnt}마리 부활!`);
    addExp(z.x,z.y,200,'#ef4444');
    for(let i=0;i<20;i++){const a=i/20*Math.PI*2;
      buls.push({x:z.x,y:z.y,vx:Math.cos(a)*10,vy:Math.sin(a)*10,r:10,l:180,en:true,dmg:72,col:'#ef4444'});
    }
  }
  else if(ab==='deepPull'){
    setMsg('🐙 심해 흡수 - 1.5초 흡수 후 방출!');
    let pullT=0;const pull=setInterval(()=>{
      if(!running||z.dead||pullT++>90){clearInterval(pull);const _i=gameTimers.indexOf(pull);if(_i>=0)gameTimers.splice(_i,1);return;}
      P.x+=(z.x-P.x)*.05;P.y+=(z.y-P.y)*.05;
    },16);
    gameTimers.push(pull);
    gTimeout(()=>{clearInterval(pull);
      if(!running)return;
      for(let i=0;i<22;i++){const a=i/22*Math.PI*2;
        buls.push({x:z.x,y:z.y,vx:Math.cos(a)*13,vy:Math.sin(a)*13,r:11,l:180,en:true,dmg:88,col:'#22d3ee'});
      }
    },1500);
  }
  else if(ab==='inkExplosion'){
    setMsg('🐙 먹물 대폭발!');
    addExp(z.x,z.y,250,'#0891b2');
    for(let i=0;i<5;i++)
      effs.push({type:'cloud',x:z.x+(Math.random()-.5)*300,y:z.y+(Math.random()-.5)*200,l:300,ml:300,r:100,dmgMult:3,dmgT:0});
    for(let i=0;i<16;i++){const a=i/16*Math.PI*2;
      buls.push({x:z.x,y:z.y,vx:Math.cos(a)*11,vy:Math.sin(a)*11,r:12,l:200,en:true,dmg:82,col:'#0c4a6e',poison:true});
    }
  }
  else if(ab==='crescendo'){
    setMsg('🎵 크레센도 - 가속 나선!');
    let t2=0;const itv2=setInterval(()=>{
      if(!running||t2>80||z.dead){clearInterval(itv2);const _i=gameTimers.indexOf(itv2);if(_i>=0)gameTimers.splice(_i,1);return;}
      const a=t2*.25;const spd=6+t2*.08;
      for(let j=0;j<4;j++){const ja=a+j/4*Math.PI*2;
        buls.push({x:z.x,y:z.y,vx:Math.cos(ja)*spd,vy:Math.sin(ja)*spd,r:8,l:200,en:true,dmg:88+Math.floor(t2*.5),col:`hsl(${t2*4},90%,60%)`});
      }
      t2++;
    },40);
    gameTimers.push(itv2);
  }
  else if(ab==='symphonyGrid'){
    setMsg('🎵 하모니 그리드 - 전체 레이저!');
    for(let i=0;i<3;i++){
      const ly=camY+VH()*.15+i*(VH()*.3);
      effs.push({type:'warn',x:MW/2,y:ly,l:55,ml:55});
      gTimeout(()=>{if(!running)return;
        for(let lx2=0;lx2<MW;lx2+=30)
          buls.push({x:lx2,y:ly,vx:0,vy:0,r:13,l:100,en:true,dmg:92,laser:true,col:`hsl(${i*90},90%,60%)`});
      },900);
    }
    gTimeout(()=>{
      for(let i=0;i<4;i++){
        const lx3=80+i*(MW/4);
        effs.push({type:'warn',x:lx3,y:camY+VH()/2,l:30,ml:30});
        gTimeout(()=>{if(!running)return;
          for(let ly3=camY-30;ly3<camY+VH()+30;ly3+=20)
            buls.push({x:lx3,y:ly3,vx:0,vy:0,r:13,l:100,en:true,dmg:92,laser:true,col:`hsl(${i*90+45},90%,60%)`});
        },i*150);
      }
    },500);
  }
  else if(ab==='omegaFinale'){
    setMsg('🎵🎵 OMEGA FINALE — 살아남아라!!!');
    let t3=0;const hell=setInterval(()=>{
      if(!running||t3>150||z.dead){clearInterval(hell);const hi=gameTimers.indexOf(hell);if(hi>=0)gameTimers.splice(hi,1);return;}
      const a=t3*.2;
      for(let j=0;j<3;j++){const ja=a+j/3*Math.PI*2;
        buls.push({x:z.x,y:z.y,vx:Math.cos(ja)*10,vy:Math.sin(ja)*10,r:7,l:140,en:true,dmg:125,col:`hsl(${t3*3},90%,65%)`});
      }
      if(t3%15===0)buls.push({x:Math.random()*MW,y:camY-20,vx:0,vy:11,r:10,l:120,en:true,dmg:110,col:`hsl(${t3*5},80%,60%)`});
      if(t3%35===0){const ang=Math.atan2(P.y-z.y,P.x-z.x);
        for(let k=-1;k<=1;k++)buls.push({x:z.x,y:z.y,vx:Math.cos(ang+k*.12)*14,vy:Math.sin(ang+k*.12)*14,r:9,l:130,en:true,dmg:135,col:'#fff'});
      }
      if(t3%80===0)doBossAtkDirect(z,'symphonyGrid');
      t3++;
    },60);
    gameTimers.push(hell);
  }
}

function doBossAtkDirect(z,ab2){
  const savedI=z._aI;const savedAtk=z.bd.atk;
  z.bd={...z.bd,atk:[ab2]};z._aI=0;
  doBossAtk(z);
  z.bd={...z.bd,atk:savedAtk};z._aI=savedI;
}

function spawnZType(type){
  const side=Math.floor(Math.random()*4);let x,y;
  if(side===0){x=Math.random()*MW;y=camY-40;}else if(side===1){x=MW+30;y=camY+Math.random()*VH();}else if(side===2){x=Math.random()*MW;y=camY+VH()+40;}else{x=-30;y=camY+Math.random()*VH();}
  // 장애물 안에 스폰되지 않도록 조정 (사막 바위)
  if(obstacles.length>0){
    let tries=0;
    while(tries<20&&obstacles.some(o=>x>o.x-20&&x<o.x+o.w+20&&y>o.y-20&&y<o.y+o.h+20)){
      x=50+Math.random()*(MW-100);y=camY+50+Math.random()*(VH()-100);tries++;
    }
  }
  const hwm=HARD_WAVE_MUL[selMap.id]||1;
  const T=ZT[type]||ZT.normal,sm=(1+wave*.07)*(1+(hwm-1)*.4),hm=(1+Math.floor(wave/4)*.5)*hwm;
  zoms.push({x,y,type,r:T.r,hp:Math.ceil(T.bHp*hm),maxHp:Math.ceil(T.bHp*hm),spd:T.spd*sm,
    angle:0,dead:false,dT:0,_dshC:180+Math.random()*60,_dsh:false,_dvx:0,_dvy:0,
    _healT:0,_phT:Math.random()*120,_phased:false,_frz:0,wob:Math.random()*Math.PI*2,
    // 새 몹 전용
    _potT:0,_slamT:0,_spearT:0,_spearDash:false,_dashVx:0,_dashVy:0,_dashDur:0,
    _zigT:0,_webT:0,_spellT:0});
}

function getZombiePool(){if(selMap.boss)return [];
  if(selMap.id==='robot_factory'){
    const rp=['robot','robot'];
    if(wave>=2)rp.push('spider_robot','spider_robot');
    if(wave>=4)rp.push('raptor_robot');
    if(wave>=8)rp.push('robot','spider_robot','raptor_robot');
    if(wave>=15)rp.push('raptor_robot','spider_robot');
    if(wave>=25)rp.push('robot','raptor_robot','spider_robot');
    return rp;
  }
  if(selMap.id==='underwater'){
    const up=['fish','fish'];
    if(wave>=2)up.push('squid');
    if(wave>=4)up.push('starfish');
    if(wave>=6)up.push('kraken_mob');
    if(wave>=8)up.push('fish','squid','kraken_mob');
    if(wave>=15)up.push('kraken_mob','starfish');
    if(wave>=25)up.push('kraken_mob','squid','starfish');
    return up;
  }
  if(selMap.id==='hardest_world'){
    const hp=['parasite','parasite'];
    if(wave>=2)hp.push('alien');
    if(wave>=4)hp.push('tentacle_monster');
    if(wave>=6)hp.push('the_thing');
    if(wave>=8)hp.push('parasite','alien','tentacle_monster');
    if(wave>=15)hp.push('the_thing','tentacle_monster');
    if(wave>=25)hp.push('the_thing','alien','tentacle_monster');
    return hp;
  }
  const base=['normal'];
  if(wave>=2)base.push('runner');
  if(wave>=3)base.push('tanker');
  if(wave>=4)base.push('exploder','poison');
  if(wave>=5)base.push('healer');
  if(wave>=6)base.push('ghost');
  // 맵별 추가 좀비
  const m=selMap;
  if(m.id==='forest'){
    if(wave>=3)base.push('ghost','ghost');
    if(wave>=4)base.push('spider');
    if(wave>=6)base.push('prophet');
    if(wave>=8)base.push('demon');
  }
  if(m.id==='lab'){
    base.push('wizard');
    if(wave>=4)base.push('supertank');
    if(wave>=8)base.push('prophet','golem');
    if(wave>=15)base.push('demon');
    if(wave>=25)base.push('rob');
  }
  if(m.id==='desert'){
    base.push('supertank','spider');
    if(wave>=5)base.push('wizard');
    if(wave>=7)base.push('golem','demon');
    if(wave>=10)base.push('prophet');
  }
  // 우주 맵: 모든 강력한 몹
  if(m.id==='space'){
    base.push('supertank','supertank','wizard','spider');
    if(wave>=3)base.push('demon','demon');
    if(wave>=5)base.push('golem','prophet');
    if(wave>=8)base.push('supertank','demon');
    if(wave>=15)base.push('rob');
  }
  // 일반 맵 후반
  if(m.id==='city'&&wave>=8)base.push('prophet');
  if(m.id==='city'&&wave>=12)base.push('demon');
  if(m.id==='city'&&wave>=15)base.push('golem');
  if(m.id==='forest'&&wave>=10)base.push('golem');
  // 아포칼립스: 수퍼좀비 + 자폭좀비 (EXTREME, 1웨이브부터 강적 밀도 높음)
  if(m.id==='apocalypse'){
    base.push('super_zombie','super_zombie','super_zombie','suicide_zombie');
    if(wave>=2)base.push('num999','suicide_zombie');
    if(wave>=4)base.push('super_zombie','num999');
    if(wave>=6)base.push('super_zombie','suicide_zombie','num999');
    if(wave>=9)base.push('num999','super_zombie','suicide_zombie','num999');
  }
  // 차원의 심장: 차원 몬스터 (아포칼립스보다 훨씬 강력)
  if(m.id==='dimension_heart'){
    base.push('dim_shard','dim_shard','dim_shard','dim_rift');
    if(wave>=2)base.push('dim_separator','dim_rift');
    if(wave>=4)base.push('worm','dim_separator');
    if(wave>=6)base.push('dim_shard','dim_separator','worm');
    if(wave>=9)base.push('dim_rift','worm','dim_separator','dim_shard');
  }
  // ETERNAL SPACE: 최종 난이도, X)(#%+#@?와 THE GOD 전용 등장 (조기 등장)
  if(m.id==='eternal_space'){
    base.push('space_jelly','space_jelly','worm','dim_shard');
    if(wave>=2)base.push('num999','space_jelly');
    if(wave>=3)base.push('glitch_entity');
    if(wave>=5)base.push('the_god');
    if(wave>=7)base.push('glitch_entity','the_god','space_jelly','worm');
    if(wave>=10)base.push('glitch_entity','the_god','num999');
  }
  return base;
}
function spawnWave(){
  if(BOSSES[wave]&&!selMap.challenge){if(spawnedCnt===0){spawnBoss(wave);spawnedCnt++;}return;}
  if(selMap.boss){
    if(wave===1&&spawnedCnt===0&&!activeBossMap){startBossMap(selMap.boss);spawnedCnt++;}
    return;
  }
  if(selMap.id==='bob'){if(!bobActive&&spawnedCnt===0){startBobMap();spawnedCnt++;}return;}
  const pool=getZombiePool();
  spawnZType(pool[Math.floor(Math.random()*pool.length)]);
}

function triggerChallengeClear(){
  window._bossMapClearing=true;
  stopLoop();
  const rc=Math.floor(50000*(selMap.diff||10));
  const re=Math.floor(25000*(selMap.diff||10));
  coins+=rc;energy+=re;saveAll();updHUD();
  addSeasonXP(20000);
  achStats.challengeCleared=achStats.challengeCleared||[];
  if(!achStats.challengeCleared.includes(selMap.id))achStats.challengeCleared.push(selMap.id);
  checkAchievements();saveAch();
  setTimeout(()=>{
    document.getElementById('clearTitle').textContent='🏆 챌린지 클리어!';
    document.getElementById('clearSub').textContent=selMap.name+' - 100웨이브 달성!';
    document.getElementById('clearReward').innerHTML=
      `<div style="background:#fef3c7;border:2px solid #f59e0b;color:#92400e;padding:8px 20px;border-radius:20px;font-weight:800;font-size:18px;">🪙 +${rc.toLocaleString()}</div>`+
      `<div style="background:#ede9ff;border:2px solid #7c3aed;color:#4c1d95;padding:8px 20px;border-radius:20px;font-weight:800;font-size:18px;">⚡ +${re.toLocaleString()}</div>`;
    document.getElementById('clearScreen').style.display='flex';
  },300);
}

// ── UPDATE ──
function update(){
  // 적 탄환 폭증 방지 상한선 (렉 방지)
  if(buls.length>200){
    let enemyBuls=buls.filter(b=>b.en);
    if(enemyBuls.length>160){
      // 가장 오래된 적 탄환부터 제거 (수명 l이 큰=오래된 것 우선 정리)
      const toRemove=enemyBuls.sort((a,b)=>a.l-b.l).slice(0,enemyBuls.length-160);
      const rmSet=new Set(toRemove);
      buls=buls.filter(b=>!rmSet.has(b));
    }
  }
  let dx=0,dy=0;
  if(P._frozen>0){P._frozen--;}else{
    if(keys['w']||keys['arrowup'])dy--;if(keys['s']||keys['arrowdown'])dy++;
    if(keys['a']||keys['arrowleft'])dx--;if(keys['d']||keys['arrowright'])dx++;
    dx+=touchDX;dy+=touchDY;
    const mag=Math.hypot(dx,dy);
    if(mag>1){dx/=mag;dy/=mag;}
  }
  const nx=Math.max(P.r,Math.min(MW-P.r,P.x+dx*P.spd));
  const ny=Math.max(P.r,Math.min(MH-P.r,P.y+dy*P.spd));
  const blocked=obstacles.some(o=>nx>o.x-P.r&&nx<o.x+o.w+P.r&&ny>o.y-P.r&&ny<o.y+o.h+P.r);
  if(!blocked){P.x=nx;P.y=ny;}
  else{
    const bx=obstacles.some(o=>nx>o.x-P.r&&nx<o.x+o.w+P.r&&P.y>o.y-P.r&&P.y<o.y+o.h+P.r);
    const by=obstacles.some(o=>P.x>o.x-P.r&&P.x<o.x+o.w+P.r&&ny>o.y-P.r&&ny<o.y+o.h+P.r);
    if(!bx)P.x=nx;
    if(!by)P.y=ny;
  }
  camY+=(clampC(P.y-VH()/2)-camY)*.1;
  camX+=(clampCX(P.x-VW()/2)-camX)*.1;
  if(isMobileTouch){
    const nearestZ=zoms.filter(z=>!z.dead).sort((a,b)=>d2(a.x,a.y,P.x,P.y)-d2(b.x,b.y,P.x,P.y))[0];
    if(nearestZ)P.angle=Math.atan2(nearestZ.y-P.y,nearestZ.x-P.x);
  } else {
    P.angle=Math.atan2(myW-P.y,mxW-P.x);
  }
  if(P._infiniteAmmo)P.ammo=P.maxAmmo;
  const wsid=P.ws.id;
  const fr=wsid==='minigun'?3:wsid==='gatling'?2:wsid==='machinegun'?4:wsid==='smg'?4:wsid==='laser_gun'?4:wsid==='flamer'?5:P.ws.knife?1:wsid==='sniper'?45:wsid==='railgun'?60:wsid==='shotgun'?32:wsid==='autocannon'?30:P.ws.auto?6:14;
  // 발사 모드: manual(기존, 클릭 필요) / semi(클릭으로 발사 토글) / auto(계속 발사)
  const held=fireMode==='auto'?true:fireMode==='semi'?!!P._semiOn:P._mdown;
  const firing=fireMode==='manual'?(P.ws.auto&&held):held;
  if(firing&&!P.reloading&&P.ammo>0){
    P._autoT=(P._autoT||0)+1;
    if(P._autoT>=fr){P._autoT=0;fireWep();}
  } else if(!held){
    P._autoT=0;
  }
  if(fireMode==='semi')updSemiIndicator();
  if(P.reloading){relTimer--;if(relTimer<=0){P.reloading=false;P.ammo=P.maxAmmo;}}
  if(poison>0){poison--;P.hp-=.05;if(Math.random()<.04)parts.push({x:P.x,y:P.y,vx:(Math.random()-.5)*3,vy:(Math.random()-.5)*3,l:18,ml:18,r:3,col:'#8DB800'});}
  if(P.hp<=0&&running){
    running=false;
    window._needLastDraw=true;
    requestAnimationFrame(loop);
  }
  tickPerks();
  tickJob();
  tickItems();
  hpItems.forEach(it=>{if(it.collected)return;it.bob+=.05;if(d2(P.x,P.y,it.x,it.y)<(P.r+it.r+4)**2){it.collected=true;const heal=Math.ceil(P.maxHp*.1);P.hp=Math.min(P.maxHp,P.hp+heal);setMsg(`❤️ +${heal}HP!`);setTimeout(()=>{if(running)setMsg('');},1500);for(let i=0;i<10;i++)parts.push({x:it.x,y:it.y,vx:(Math.random()-.5)*4,vy:-2-Math.random()*3,l:22,ml:22,r:4,col:'#ef4444'});}});
  if(!betweenWave){
    if(selMap.boss){if(spawnedCnt===0&&!activeBossMap){spawnWave();spawnT=0;}}
    else{spawnT+=waveSpeedMul;if(spawnT>=spawnInt&&spawnedCnt<totalSpawn){spawnWave();spawnedCnt++;spawnT=0;}}
    if(!selMap.boss&&spawnedCnt>=totalSpawn&&zoms.filter(z=>!z.dead&&!z.isMinion).length===0){betweenWave=true;setMsg(`✨ 웨이브 ${wave} 클리어!`);if(wave>(achStats.maxWave||0))achStats.maxWave=wave;achStats.mapWave=achStats.mapWave||{};const prevBest=achStats.mapWave[selMap?.id]||0;if(wave>prevBest)achStats.mapWave[selMap.id]=wave;if(waveDmgTaken===0){achStats.noDmgWave=(achStats.noDmgWave||0)+1;}waveDmgTaken=0;if(!achStats.clearedMaps)achStats.clearedMaps=[];if(wave>=10&&!achStats.clearedMaps.includes(selMap.id))achStats.clearedMaps.push(selMap.id);achStats.waveClearsTotal=(achStats.waveClearsTotal||0)+1;checkAchievements();saveAch();if(typeof eventData!=='undefined'){eventData.points=(eventData.points||0)+10;saveEventData();}
    const xpGain=100*(wave+(selMap.diff||1))*((pUpgLv['pxp']||0)*.1+1)*(window._petXpMult||1);
    addSeasonXP(Math.floor(xpGain));
    // 폐허도시 클리어 기록
    if(selMap.id==='city'){
      const prev=parseInt(localStorage.getItem('hd_city_clear')||'0');
      if(wave>prev)localStorage.setItem('hd_city_clear',wave);
      if(wave>=35){
        // BOB 맵 해금
        MAPS.find(m=>m.id==='bob').locked=false;
        if(wave===35)setMsg('🔓 THE ETERNAL BOB 해금!');
      }
    }
    if(selMap.challenge&&wave>=selMap.waveLimit){triggerChallengeClear();}
    else if(selMap.challenge){
      // 챌린지 맵: 특성 선택 없이 자동으로 바로 다음 웨이브 진행 (EXTREME 속도)
      const coinMult=1+(pUpgLv['pc']||0)*.05,enMult=1+(pUpgLv['pe']||0)*.05;
      coins+=Math.floor((100+(shopLv['sh_coin']||0)*20)*coinMult*(partyBonus||1)*(window._petCoinMult||1));
      energy+=Math.floor((100+(shopLv['sh_energy']||0)*30)*enMult*(partyBonus||1)*(window._petEnergyMult||1));
      saveAll();updHUD();
      setTimeout(()=>{if(running||betweenWave)nextWave();},400);
    }
    else{setTimeout(()=>{if(running||betweenWave)showUpgOv();},1500);}}
  }
  const slowM=P._timewarp>0?.35:1;
  zoms=zoms.filter(z=>{
    if(z.dead){z.dT--;return z.dT>0;}
    if(z._frz>0){z._frz--;return true;}
    if(z._burnT>0){
      z._burnT--;
      if(z._burnT%20===0){hitZ(z,2);if(z.dead)return true;}
    }
    const spd=z.spd*slowM;
    const ddx=P.x-z.x,ddy=P.y-z.y,dl=Math.sqrt(d2(P.x,P.y,z.x,z.y))||1;
    z.angle=Math.atan2(ddy,ddx);z.wob=(z.wob||0)+.05;
    if(z.isBoss){
      z._aT=(z._aT||0)+1;
      const acd=z.bossMapId?Math.max(40,120-z.phT.length*15):Math.max(60,200-wave*2);
      if(z._aT>=acd){z._aT=0;doBossAtk(z);}
      const pct=z.hp/z.bd.hp;
      z.bd.phases.forEach(ph=>{if(pct<=ph.t&&!z.phT.includes(ph.t)){z.phT.push(ph.t);setMsg(ph.m);setTimeout(()=>{if(running)setMsg('');},3000);for(let i=0;i<20;i++)parts.push({x:z.x,y:z.y,vx:(Math.random()-.5)*9,vy:(Math.random()-.5)*9,l:40,ml:40,r:5,col:z.bd.col});for(let i=0;i<10;i++){const a=i/10*Math.PI*2;buls.push({x:z.x,y:z.y,vx:Math.cos(a)*5,vy:Math.sin(a)*5,r:7,l:150,en:true,dmg:10});}z.spd=Math.min(z.spd*1.25,4);}});
      updBossBar();
      if(z._chargeV){z.x+=z._chargeV.vx;z.y+=z._chargeV.vy;z._chargeT--;if(z._chargeT<=0)z._chargeV=null;}else{z.x+=ddx/dl*spd;z.y+=ddy/dl*spd;}
    } else if(z.type==='runner'){z._dshC=(z._dshC||180)-1;if(z._dshC<=0&&!z._dsh&&dl<220){z._dsh=true;z._dshT=18;z._dvx=ddx/dl*7;z._dvy=ddy/dl*7;z._dshC=200+Math.random()*100;}if(z._dsh){z.x+=z._dvx;z.y+=z._dvy;z._dshT--;if(z._dshT<=0)z._dsh=false;}else{z.x+=ddx/dl*spd;z.y+=ddy/dl*spd;}}
    else if(z.type==='ghost'){z._phT=(z._phT||60)-1;if(z._phT<=0){z._phased=!z._phased;z._phT=z._phased?80:120;}z.x+=ddx/dl*spd;z.y+=ddy/dl*spd;}
    else if(z.type==='healer'){z._healT=(z._healT||0)+1;if(z._healT>=90){z._healT=0;zoms.forEach(o=>{if(o!==z&&!o.dead&&d2(o.x,o.y,z.x,z.y)<80**2){o.hp=Math.min(o.maxHp,o.hp+1);parts.push({x:o.x,y:o.y,vx:0,vy:-2,l:20,ml:20,r:3,col:'#00FF7F'});}});}z.x+=ddx/dl*spd;z.y+=ddy/dl*spd;}
    else if(z.type==='wizard'){
      // 마법사: 거리 유지하며 마법 발사
      z._spellT=(z._spellT||0)+1;
      const keepDist=200;
      if(dl>keepDist){z.x+=ddx/dl*spd*.5;z.y+=ddy/dl*spd*.5;}
      else if(dl<120){z.x-=ddx/dl*spd;z.y-=ddy/dl*spd;}
      if(z._spellT>=(wave>=10?80:120)){z._spellT=0;
        const ang=Math.atan2(ddy,ddx);
        // 3방향 마법 발사
        for(let wi=-1;wi<=1;wi++){
          const a=ang+wi*.15;
          buls.push({x:z.x,y:z.y,vx:Math.cos(a)*5,vy:Math.sin(a)*5,r:7,l:120,en:true,dmg:6,col:'#9333ea',magic:true});
        }
        for(let i=0;i<6;i++)parts.push({x:z.x,y:z.y,vx:(Math.random()-.5)*4,vy:(Math.random()-.5)*4,l:15,ml:15,r:4,col:'#a855f7'});
      }
    }
    else if(z.type==='spider'){
      z._zigT=(z._zigT||0)+1;const zigAng=Math.atan2(ddy,ddx)+Math.sin(z._zigT*.15)*.8;
      z.x+=Math.cos(zigAng)*spd;z.y+=Math.sin(zigAng)*spd;
      z._webT=(z._webT||0)+1;
      if(z._webT>=200){z._webT=0;
        buls.push({x:z.x,y:z.y,vx:(P.x-z.x)/dl*4,vy:(P.y-z.y)/dl*4,r:5,l:100,en:true,dmg:3,poison:true,col:'#a855f7'});
      }
    }
    else if(z.type==='prophet'){
      // 선지자: 거리 유지 + 물약 투척
      const keepDist=180;
      if(dl>keepDist+30){z.x+=ddx/dl*spd;z.y+=ddy/dl*spd;}
      else if(dl<keepDist-30){z.x-=ddx/dl*spd;z.y-=ddy/dl*spd;}
      z._potT=(z._potT||0)+1;
      if(z._potT>=150){z._potT=0;
        // 물약 투척: 포물선으로 날아가 폭발
        const ang=Math.atan2(P.y-z.y,P.x-z.x);
        const pot={x:z.x,y:z.y,vx:Math.cos(ang)*5,vy:Math.sin(ang)*5-3,r:7,l:55,en:true,dmg:0,col:'#a855f7',_potion:true};
        buls.push(pot);
        // 물약 낙하 후 폭발 독구름
        setTimeout(()=>{if(!running)return;
          effs.push({type:'cloud',x:P.x,y:P.y,l:180,ml:180,r:60,dmgMult:1.5,dmgT:0});
          addExp(P.x,P.y,50,'#a855f7');
          if(d2(P.x,P.y,P.x,P.y)<(50+P.r)**2)takeDmg(12);
        },900);
      }
    }
    else if(z.type==='golem'){
      // 골렘: 매우 느리게 접근, 근접 강타
      z.x+=ddx/dl*spd;z.y+=ddy/dl*spd;
      z._slamT=(z._slamT||0)+1;
      if(dl<z.r+P.r+20&&z._slamT>=60){z._slamT=0;
        // 강타: 범위 피해
        takeDmg(25);
        addExp(z.x,z.y,60,'#6b7280');
        for(let i=0;i<8;i++)parts.push({x:z.x,y:z.y,vx:(Math.random()-.5)*8,vy:(Math.random()-.5)*8,l:20,ml:20,r:5,col:'#9ca3af'});
      }
    }
    else if(z.type==='demon'){
      // 악마: 빠르게 접근 후 창 돌진
      z._spearT=(z._spearT||0)+1;
      if(dl<200&&z._spearT>=100&&!z._spearDash){
        z._spearDash=true;z._spearT=0;
        z._dashVx=ddx/dl*10;z._dashVy=ddy/dl*10;z._dashDur=20;
        setMsg?.('악마의 창 돌진!');
      }
      if(z._spearDash){
        z.x+=z._dashVx;z.y+=z._dashVy;z._dashDur--;
        if(dl<z.r+P.r+5)takeDmg(22);
        if(z._dashDur<=0)z._spearDash=false;
      } else {
        z.x+=ddx/dl*spd;z.y+=ddy/dl*spd;
      }
    }
    else if(z.type==='supertank'){z.x+=ddx/dl*spd;z.y+=ddy/dl*spd;}
    else if(z.type==='rob'){
      // ROB: 느리지만 무적, 직진
      z.x+=ddx/dl*z.spd;z.y+=ddy/dl*z.spd;
    }
    else if(z.type==='spider_robot'){
      z._zigT=(z._zigT||0)+1;const zigAng=Math.atan2(ddy,ddx)+Math.sin(z._zigT*.15)*.8;
      z.x+=Math.cos(zigAng)*spd;z.y+=Math.sin(zigAng)*spd;
    }
    else if(z.type==='parasite'||z.type==='dim_shard'||z.type==='worm'){
      z._zigT=(z._zigT||0)+1;const zigAng=Math.atan2(ddy,ddx)+Math.sin(z._zigT*.2)*1.0;
      z.x+=Math.cos(zigAng)*spd;z.y+=Math.sin(zigAng)*spd;
    }
    else if(z.type==='raptor_robot'||z.type==='alien'||z.type==='dim_separator'){
      // 랩터로봇/에일리언/차원분리기: 거리 유지 + 레이저 저격
      const keepDist=220;
      if(dl>keepDist){z.x+=ddx/dl*spd;z.y+=ddy/dl*spd;}
      else if(dl<140){z.x-=ddx/dl*spd;z.y-=ddy/dl*spd;}
      z._spellT=(z._spellT||0)+1;
      if(z._spellT>=90){z._spellT=0;
        const ang=Math.atan2(ddy,ddx);
        const col=z.type==='alien'?'#22c55e':z.type==='dim_separator'?'#a855f7':'#f87171';
        buls.push({x:z.x,y:z.y,vx:Math.cos(ang)*9,vy:Math.sin(ang)*9,r:5,l:150,en:true,dmg:9,col,laser:true});
      }
    }
    else if(z.type==='squid'||z.type==='space_jelly'){
      // 오징어/우주해파리: 거리 유지 + 독 투척
      const keepDist=180;
      if(dl>keepDist+30){z.x+=ddx/dl*spd;z.y+=ddy/dl*spd;}
      else if(dl<keepDist-30){z.x-=ddx/dl*spd;z.y-=ddy/dl*spd;}
      z._potT=(z._potT||0)+1;
      if(z._potT>=160){z._potT=0;
        const ang=Math.atan2(P.y-z.y,P.x-z.x);
        const px=P.x,py=P.y;
        buls.push({x:z.x,y:z.y,vx:Math.cos(ang)*4,vy:Math.sin(ang)*4-2,r:6,l:60,en:true,dmg:0,col:'#a78bfa',_potion:true});
        gTimeout(()=>{effs.push({type:'cloud',x:px,y:py,l:150,ml:150,r:55,dmgMult:1,dmgT:0});addExp(px,py,50,'#a78bfa');if(d2(P.x,P.y,px,py)<(50+P.r)**2)takeDmg(10);},900);
      }
    }
    else if(z.type==='kraken_mob'){
      // 크라켄(몹): 거리 유지 + 3way 촉수 탄
      z._spellT=(z._spellT||0)+1;
      const keepDist=200;
      if(dl>keepDist){z.x+=ddx/dl*spd*.6;z.y+=ddy/dl*spd*.6;}
      else if(dl<130){z.x-=ddx/dl*spd;z.y-=ddy/dl*spd;}
      if(z._spellT>=110){z._spellT=0;
        const ang=Math.atan2(ddy,ddx);
        for(let wi=-1;wi<=1;wi++){const a=ang+wi*.2;buls.push({x:z.x,y:z.y,vx:Math.cos(a)*6,vy:Math.sin(a)*6,r:7,l:130,en:true,dmg:10,col:'#0891b2'});}
      }
    }
    else if(z.type==='tentacle_monster'){
      // 촉수괴물: 접근 후 붙잡기 돌진
      z._spearT=(z._spearT||0)+1;
      if(dl<220&&z._spearT>=110&&!z._spearDash){
        z._spearDash=true;z._spearT=0;
        z._dashVx=ddx/dl*8;z._dashVy=ddy/dl*8;z._dashDur=24;
      }
      if(z._spearDash){
        z.x+=z._dashVx;z.y+=z._dashVy;z._dashDur--;
        if(dl<z.r+P.r+5)takeDmg(20);
        if(z._dashDur<=0)z._spearDash=false;
      } else {
        z.x+=ddx/dl*spd;z.y+=ddy/dl*spd;
      }
    }
    else if(z.type==='the_thing'){
      // 더 씽: 매우 느리게 접근, 강타
      z.x+=ddx/dl*spd;z.y+=ddy/dl*spd;
      z._slamT=(z._slamT||0)+1;
      if(dl<z.r+P.r+20&&z._slamT>=50){z._slamT=0;
        takeDmg(30);
        addExp(z.x,z.y,65,'#57534e');
        for(let i=0;i<8;i++)parts.push({x:z.x,y:z.y,vx:(Math.random()-.5)*8,vy:(Math.random()-.5)*8,l:20,ml:20,r:5,col:'#a8a29e'});
      }
    }
    else if(z.type==='dim_rift'){
      // 차원의틈: 거의 정지, 흡입 후 방출
      z._potT=(z._potT||0)+1;
      if(z._potT>=150&&z._potT<200){P.x+=(z.x-P.x)*.015;P.y+=(z.y-P.y)*.015;}
      if(z._potT>=200){z._potT=0;
        for(let i=0;i<16;i++){const a=i/16*Math.PI*2;buls.push({x:z.x,y:z.y,vx:Math.cos(a)*10,vy:Math.sin(a)*10,r:8,l:150,en:true,dmg:16,col:'#4c1d95'});}
      }
      z.x+=ddx/dl*spd*.2;z.y+=ddy/dl*spd*.2;
    }
    else if(z.type==='glitch_entity'){
      // X)(#%+#@?: 순간이동 + 고속 추격
      z._webT=(z._webT||0)+1;
      if(z._webT>=140){z._webT=0;z.x=P.x+(Math.random()-.5)*260;z.y=P.y+(Math.random()-.5)*260;for(let i=0;i<10;i++)parts.push({x:z.x,y:z.y,vx:(Math.random()-.5)*7,vy:(Math.random()-.5)*7,l:20,ml:20,r:4,col:'#fff'});}
      else{z.x+=ddx/dl*spd;z.y+=ddy/dl*spd;}
    }
    else if(z.type==='the_god'){
      // THE GOD: 거리 유지 + 5way 광역 탄막
      z._spellT=(z._spellT||0)+1;
      const keepDist=260;
      if(dl>keepDist){z.x+=ddx/dl*spd*.5;z.y+=ddy/dl*spd*.5;}
      else if(dl<160){z.x-=ddx/dl*spd;z.y-=ddy/dl*spd;}
      if(z._spellT>=100){z._spellT=0;
        const ang=Math.atan2(ddy,ddx);
        for(let wi=-2;wi<=2;wi++){const a=ang+wi*.18;buls.push({x:z.x,y:z.y,vx:Math.cos(a)*8,vy:Math.sin(a)*8,r:8,l:160,en:true,dmg:14,col:'#fbbf24'});}
      }
    }
    else{z.x+=ddx/dl*spd+Math.cos(z.wob)*.2;z.y+=ddy/dl*spd+Math.sin(z.wob)*.2;}
    z.x=Math.max(z.r,Math.min(MW-z.r,z.x));z.y=Math.max(z.r,Math.min(MH-z.r,z.y));
    if(dl<z.r+P.r&&!z.isMinion){let dps=z.isBoss?1.5:z.type==='tanker'?.8:z.type==='supertank'?2:z.type==='the_thing'?1.5:z.type==='starfish'?.6:z.type==='robot'?.7:z.type==='the_god'?2:z.type==='dim_rift'?1.2:z.type==='glitch_entity'?1.3:z.type==='super_zombie'?.9:.35;dps+=(ZT[z.type]?.dmgMult||1)*.05;if(z.type==='rob'&&!P._bobPlayerMode){running=false;return true;}takeDmg(dps);if((z.type==='poison'||z.type==='parasite'||z.type==='worm')&&poison<=0){poison=300;for(let i=0;i<6;i++)parts.push({x:P.x,y:P.y,vx:(Math.random()-.5)*4,vy:(Math.random()-.5)*4,l:20,ml:20,r:4,col:'#8DB800'});}if((z.type==='exploder'||z.type==='suicide_zombie')&&!z._ex){z._ex=true;z.dead=true;z.dT=30;addExp(z.x,z.y,z.type==='suicide_zombie'?95:70,'#FF6600');takeDmg(z.type==='suicide_zombie'?26:18);}}
    return true;
  });
  buls=buls.filter(b=>{
  if(b.homing&&!b.homing.dead){const hd=Math.sqrt(d2(b.x,b.y,b.homing.x,b.homing.y))||1;const tx=(b.homing.x-b.x)/hd*14,ty=(b.homing.y-b.y)/hd*14;b.vx+=(tx-b.vx)*.18;b.vy+=(ty-b.vy)*.18;}
    if(b._homing){const hd2=Math.sqrt(d2(b.x,b.y,P.x,P.y))||1;const sp=b._hspd||7;b.vx+=(P.x-b.x)/hd2*sp*.12;b.vy+=(P.y-b.y)/hd2*sp*.12;const cs=Math.sqrt(b.vx**2+b.vy**2);if(cs>sp){b.vx=b.vx/cs*sp;b.vy=b.vy/cs*sp;}}
    b.x+=b.vx;b.y+=b.vy;b.l--;
    if(b.l<=0||b.x<-30||b.x>MW+30||b.y<-30||b.y>MH+30)return false;
    if(b.en){
      // 레이저 타입: 정지 탄환 → 지속 틱 피해
      if(b.laser){
        if(d2(b.x,b.y,P.x,P.y)<(P.r+b.r)**2){
          b._laserTick=(b._laserTick||0)+1;
          if(b._laserTick%30===0)takeDmg(b.dmg||20);
        }
        return b.l>0;
      }
      // 빔: 선형 범위 피해
      if(b.beam){
        const beamLen=b.beamLen||300;
        const dx2=Math.cos(b.ang),dy2=Math.sin(b.ang);
        const dot=(P.x-b.x)*dx2+(P.y-b.y)*dy2;
        if(dot>=0&&dot<=beamLen){
          const px=b.x+dx2*dot,py=b.y+dy2*dot;
          if(d2(px,py,P.x,P.y)<(P.r+b.r)**2){
            b._beamTick=(b._beamTick||0)+1;
            if(b._beamTick%20===0)takeDmg(b.dmg||30);
          }
        }
        return b.l>0;
      }
      if(d2(b.x,b.y,P.x,P.y)<(P.r+b.r)**2){takeDmg(b.dmg||6);if(b.poison&&poison<=0)poison=200;return false;}
      return true;
    }
    const rcl=perkLv['ricochet']??-1;
    for(let i=zoms.length-1;i>=0;i--){
      const z=zoms[i];if(z.dead||(z.type==='ghost'&&z._phased))continue;
      if(d2(b.x,b.y,z.x,z.y)<(z.r+b.r)**2){
        hitZ(z,b.dmg||1);
        const fl=perkLv['freeze']??-1;if(fl>=0&&!z.isBoss)z._frz=fl>=1?120:60;
        const cl=perkLv['chain']??-1;
        if(cl>=0){const cc=[2,3,5,5,8][Math.min(cl,4)];zoms.filter(zz=>!zz.dead&&zz!==z&&d2(zz.x,zz.y,z.x,z.y)<120**2).slice(0,cc).forEach(zz=>{hitZ(zz,(b.dmg||1)*.7);parts.push({x:zz.x,y:zz.y,vx:0,vy:-3,l:12,ml:12,r:4,col:'#818cf8'});});}
        // 폭발 무기 (관통탄 중복폭발 방지: 탄환당 0.15초 쿨다운)
        if(b._explosive&&!z.isBoss&&(!b._lastExpT||Date.now()-b._lastExpT>150)){
          b._lastExpT=Date.now();
          addExp(z.x,z.y,70+(P._aoeB||0),z.col||'#f97316');
          const expR=(70+(P._aoeB||0))**2;
          for(let k=0;k<zoms.length;k++){const ez=zoms[k];if(!ez.dead&&ez!==z&&d2(ez.x,ez.y,z.x,z.y)<(70+(P._aoeB||0)+ez.r)**2)hitZ(ez,(b.dmg||1)*.6);}
        }
        // 냉동 무기
        if(b._freezeAtk&&!z.isBoss)z._frz=Math.max(z._frz||0,90);
        // 번개 연쇄
        if(b._chainAtk){zoms.filter(zz=>!zz.dead&&zz!==z&&d2(zz.x,zz.y,z.x,z.y)<120**2).slice(0,2).forEach(zz=>{hitZ(zz,(b.dmg||1)*.7);parts.push({x:zz.x,y:zz.y,vx:0,vy:-3,l:12,ml:12,r:4,col:'#facc15'});});}
        if(b._vamp){P.hp=Math.min(P.maxHp,P.hp+8);}
        if(b._fire){z._burnT=180;} // 화염 지속 데미지 180프레임 (드래곤 보스의 _fireT 공격타이머와 충돌 방지)
        if(b._reanimation&&z.hp<=0){
          // 처치된 적 위치에 아군 소환
          setTimeout(()=>{if(!running)return;zoms.push({x:z.x,y:z.y,type:z.type||'runner',r:11,hp:15,maxHp:15,spd:2,angle:0,dead:false,dT:0,isMinion:true,minionTimer:1200,_dshC:999,_dsh:false,_dvx:0,_dvy:0,_healT:0,_phT:60,_phased:false,_frz:0,wob:0,col:'#a855f7'});},50);
        }
        if(!b.pierce&&rcl<2)return false;
      }
    }
    if(rcl>=0){
      const maxB=rcl>=5?999:rcl>=4?5:rcl+1;
      if(!b._bounces)b._bounces=0;
      if(b.x<=0&&b.vx<0&&b._bounces<maxB){b.vx*=-1;b._bounces++;b.x=1;}
      if(b.x>=MW&&b.vx>0&&b._bounces<maxB){b.vx*=-1;b._bounces++;b.x=MW-1;}
      if(b.y<=0&&b.vy<0&&b._bounces<maxB){b.vy*=-1;b._bounces++;b.y=1;}
      if(b.y>=MH&&b.vy>0&&b._bounces<maxB){b.vy*=-1;b._bounces++;b.y=MH-1;}
    }
    return true;
  });
  effs=effs.filter(e=>{e.l--;if(e.type==='ring')e.r+=e.maxR/e.ml*2;return e.l>0;});
  parts=parts.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.vx*=.88;p.vy*=.88;p.l--;return p.l>0;});
  updHUD();
}

// ── FIRE ──
let lastKT=0;
function fireWep(){
  const ws=P.ws;

  // ── 근접 무기 분기 ──
  if(ws.knife){
    const now=Date.now();if(now-lastKT<280)return;lastKT=now;
    const wsid=ws.id;
    if(wsid==='katana'||wsid==='dualkatana'){
      // 카타나: 넓은 부채꼴 참격 + 베기 이펙트
      doMelee(75,Math.PI*.75);
      addExp(P.x+Math.cos(P.angle)*40,P.y+Math.sin(P.angle)*40,55,'rgba(220,220,255,0.6)');
    } else if(wsid==='axe'){
      // 도끼: 강타 + 밀어내기
      doMelee(60,Math.PI*.6);
      zoms.forEach(z=>{if(!z.dead){const dl=Math.sqrt(d2(z.x,z.y,P.x,P.y));if(dl<80){z.x+=(z.x-P.x)/dl*30;z.y+=(z.y-P.y)/dl*30;}}});
    } else if(wsid==='hammer'){
      // 망치: 범위 충격파
      doMelee(70,Math.PI*.5);
      addExp(P.x,P.y,80,'rgba(150,150,150,0.5)');
      zoms.forEach(z=>{if(!z.dead&&Math.sqrt(d2(z.x,z.y,P.x,P.y))<85){z._frz=Math.max(z._frz||0,20);}});
    } else if(wsid==='spear'||wsid==='thunderspear'){
      // 창: 좁고 길게 찌르기
      doMelee(100,Math.PI*.25);
      if(wsid==='thunderspear'){
        for(let i=0;i<3;i++){setTimeout(()=>{if(!running)return;buls.push({x:P.x,y:P.y,vx:Math.cos(P.angle+(.5-Math.random())*.3)*9,vy:Math.sin(P.angle+(.5-Math.random())*.3)*9,r:5,l:100,en:false,dmg:10,col:'#facc15'});},i*40);}
      }
    } else if(wsid==='scythe'||wsid==='soulreaper'||wsid==='moonshard'){
      // 낫: 360도 회전 참격
      doMelee(80,Math.PI*2);
      addExp(P.x,P.y,85,'rgba(80,0,80,0.4)');
      if(wsid==='soulreaper')P.hp=Math.min(P.maxHp,P.hp+5);
    } else if(wsid==='sword'||wsid==='darksword'){
      // 대검: 앞 180도 참격 + 이펙트
      doMelee(68,Math.PI);
      if(wsid==='darksword'){addExp(P.x+Math.cos(P.angle)*35,P.y+Math.sin(P.angle)*35,65,'rgba(20,0,40,0.7)');}
    } else if(wsid==='halberd'){
      // 할버드: 넓고 먼 참격
      doMelee(90,Math.PI*.8);
      addExp(P.x+Math.cos(P.angle)*50,P.y+Math.sin(P.angle)*50,70,'rgba(180,180,200,0.5)');
    } else if(wsid==='godspear'){
      // 신의 창: 360도 + 번개 연쇄
      doMelee(100,Math.PI*2);
      zoms.filter(z=>!z.dead&&Math.sqrt(d2(z.x,z.y,P.x,P.y))<100).forEach(z=>{
        for(let i=0;i<3;i++)parts.push({x:z.x,y:z.y,vx:(Math.random()-.5)*8,vy:(Math.random()-.5)*8,l:15,ml:15,r:5,col:'#fbbf24'});
      });
    } else if(wsid==='sp_winter'){
      // 겨울의 창: 찌르기+동결+번개연쇄
      doMelee(90,Math.PI*.3);
      zoms.filter(z=>!z.dead&&Math.sqrt(d2(z.x,z.y,P.x,P.y))<95).forEach(z=>{z._frz=Math.max(z._frz||0,120);});
      setTimeout(()=>{if(!running)return;zoms.filter(z=>!z.dead&&Math.sqrt(d2(z.x,z.y,P.x,P.y))<200).slice(0,3).forEach(z=>hitZ(z,15));},100);
    } else if(wsid==='sp_autumn'){
      // 낙엽 낫: 360도+낙엽 파티클 연쇄
      doMelee(80,Math.PI*2);
      for(let i=0;i<12;i++){const a=i/12*Math.PI*2;parts.push({x:P.x+Math.cos(a)*40,y:P.y+Math.sin(a)*40,vx:Math.cos(a)*3,vy:Math.sin(a)*3-2,l:20,ml:20,r:5,col:['#f97316','#d97706','#92400e'][i%3]});}
    } else if(wsid==='sp_storm'){
      // 폭풍의 검: 360도+번개 6방향
      doMelee(90,Math.PI*2);
      for(let i=0;i<6;i++){const a=i/6*Math.PI*2;buls.push({x:P.x,y:P.y,vx:Math.cos(a)*12,vy:Math.sin(a)*12,r:5,l:110,en:false,dmg:25+(P.dmgB||0),col:'#facc15',_chainAtk:true});}
    } else if(wsid==='sp_blade'){
      // 성흔의 검: 180도+HP흡혈
      doMelee(85,Math.PI);
      P.hp=Math.min(P.maxHp,P.hp+10);
    } else if(wsid==='skeleton_drop'){
      // 해골왕의 검: 참격 + 자동 뼈 파편
      doMelee(80,Math.PI*.8);
      for(let i=0;i<8;i++){const a=i/8*Math.PI*2;buls.push({x:P.x,y:P.y,vx:Math.cos(a)*7,vy:Math.sin(a)*7,r:5,l:100,en:false,dmg:12,col:'#d1d5db'});}
    } else if(wsid==='reanimation_drop'){
      // 죽음의 낫: 360도 + 처치 확인 후 아군 소환
      doMelee(85,Math.PI*2);
      // 처치된 좀비 아군으로 소환
      setTimeout(()=>{
        if(!running)return;
        zoms.filter(z=>z.dead&&Math.sqrt(d2(z.x,z.y,P.x,P.y))<90&&z._justDied).forEach(z=>{
          z._justDied=false;
          zoms.push({x:z.x,y:z.y,type:z.type||'runner',r:11,hp:20,maxHp:20,spd:1.8,angle:0,dead:false,dT:0,isMinion:true,minionTimer:900,_dshC:999,_dsh:false,_dvx:0,_dvy:0,_healT:0,_phT:60,_phased:false,_frz:0,wob:0,col:'#a855f7'});
        });
      },50);
    } else if(wsid==='symphony_drop'){
      // 지휘봉: 360도 + 무지개 48발
      doMelee(80,Math.PI*2);
      for(let i=0;i<48;i++){const a=i/48*Math.PI*2;buls.push({x:P.x,y:P.y,vx:Math.cos(a)*9,vy:Math.sin(a)*9,r:6,l:150,en:false,dmg:ws.dmg*.4,col:`hsl(${i*7.5},90%,65%)`});}
    } else {
      doMelee(55,Math.PI*.5);
    }
    return;
  }

  if(P.reloading||P.ammo<=0)return;
  const wsid2=ws.id;

  // ── 화염방사기: 불꽃 파티클 + 화염 지속 데미지 ──
  if(wsid2==='flamer'){
    const ang=P.angle+(Math.random()-.5)*.4;
    const dist=20+Math.random()*30;
    const fx=P.x+Math.cos(ang)*dist, fy=P.y+Math.sin(ang)*dist;
    // 화염 파티클 여러 개
    for(let i=0;i<3;i++){
      const fa=ang+(Math.random()-.5)*.25;
      buls.push({x:P.x,y:P.y,vx:Math.cos(fa)*ws.spd*(0.7+Math.random()*.6),vy:Math.sin(fa)*ws.spd*(0.7+Math.random()*.6),r:ws.r+Math.random()*4,l:ws.life+Math.floor(Math.random()*15),en:false,dmg:ws.dmg+(P.dmgB||0),col:`hsl(${10+Math.random()*30},100%,60%)`,_fire:true});
    }
    P.ammo--;if(P.ammo<=0)startRel();updHUD();return;
  }

  // ── 레이저건: 긴 레이저 라인 ──
  if(wsid2==='laser_gun'){
    for(let d=0;d<200;d+=18){buls.push({x:P.x+Math.cos(P.angle)*d,y:P.y+Math.sin(P.angle)*d,vx:Math.cos(P.angle)*18,vy:Math.sin(P.angle)*18,r:5,l:20,en:false,dmg:ws.dmg+(P.dmgB||0),laser:true,col:'#a855f7'});}
    P.ammo--;if(P.ammo<=0)startRel();updHUD();return;
  }

  // ── 냉동총/냉동포: 얼음 파편 ──
  if(wsid2==='icegen'){
    for(let i=0;i<3;i++){const fa=P.angle+(Math.random()-.5)*.2;buls.push({x:P.x,y:P.y,vx:Math.cos(fa)*ws.spd,vy:Math.sin(fa)*ws.spd,r:ws.r,l:ws.life,en:false,dmg:ws.dmg+(P.dmgB||0),col:'#bae6fd',_freezeAtk:true,pierce:false});}
    P.ammo--;if(P.ammo<=0)startRel();updHUD();return;
  }
  if(wsid2==='cryocannon'){
    buls.push({x:P.x,y:P.y,vx:Math.cos(P.angle)*ws.spd,vy:Math.sin(P.angle)*ws.spd,r:ws.r+4,l:ws.life,en:false,dmg:ws.dmg+(P.dmgB||0),col:'#67e8f9',_explosive:true,_freezeAtk:true});
    P.ammo--;if(P.ammo<=0)startRel();updHUD();return;
  }

  // ── 화산포/로켓런처/유탄발사기: 거대 폭발탄 ──
  if(wsid2==='volcanogun'||wsid2==='rocket'||wsid2==='grenadel'){
    const big=wsid2==='volcanogun';
    buls.push({x:P.x,y:P.y,vx:Math.cos(P.angle)*ws.spd,vy:Math.sin(P.angle)*ws.spd,r:big?14:ws.r,l:ws.life,en:false,dmg:ws.dmg+(P.dmgB||0),col:big?'#f97316':'#ef4444',_explosive:true,_aoeR:big?120:80});
    P.ammo--;if(P.ammo<=0)startRel();updHUD();return;
  }

  // ── 오메가건: 에너지 파동 ──
  if(wsid2==='omegagun'){
    for(let i=-1;i<=1;i++){const a=P.angle+i*.15;buls.push({x:P.x,y:P.y,vx:Math.cos(a)*ws.spd,vy:Math.sin(a)*ws.spd,r:7,l:ws.life,en:false,dmg:ws.dmg+(P.dmgB||0),col:'#22d3ee',_explosive:true,pierce:true});}
    P.ammo--;if(P.ammo<=0)startRel();updHUD();return;
  }

  // ── 양자총: 4방향 동시 ──
  if(wsid2==='quantumgun'){
    for(let i=0;i<4;i++){const a=P.angle+i*Math.PI*.5;buls.push({x:P.x,y:P.y,vx:Math.cos(a)*ws.spd,vy:Math.sin(a)*ws.spd,r:ws.r,l:ws.life,en:false,dmg:ws.dmg+(P.dmgB||0),col:`hsl(${i*90},90%,65%)`,_explosive:true,pierce:true});}
    P.ammo--;if(P.ammo<=0)startRel();updHUD();return;
  }

  // ── 빔소총/레일건: 순간 직선 관통 ──
  if(wsid2==='beamrifle'||wsid2==='railgun'){
    const steps=wsid2==='railgun'?50:35;
    for(let d=0;d<steps*18;d+=18){buls.push({x:P.x+Math.cos(P.angle)*d,y:P.y+Math.sin(P.angle)*d,vx:0,vy:0,r:wsid2==='railgun'?3:5,l:6,en:false,dmg:ws.dmg+(P.dmgB||0),col:wsid2==='railgun'?'#facc15':'#f87171',pierce:true});}
    P.ammo--;if(P.ammo<=0)startRel();updHUD();return;
  }

  // ── 크라켄 드롭: 먹물+촉수 ──
  if(wsid2==='kraken_drop'){
    buls.push({x:P.x,y:P.y,vx:Math.cos(P.angle)*ws.spd,vy:Math.sin(P.angle)*ws.spd,r:ws.r,l:ws.life,en:false,dmg:ws.dmg+(P.dmgB||0),col:'#0e7490',_explosive:true});
    setTimeout(()=>{if(!running)return;for(let i=0;i<6;i++){const a=i/6*Math.PI*2;buls.push({x:P.x,y:P.y,vx:Math.cos(a)*6,vy:Math.sin(a)*6,r:8,l:120,en:false,dmg:20,col:'#22d3ee'});}},150);
    P.ammo--;if(P.ammo<=0)startRel();updHUD();return;
  }

  // ── 박테리아 드롭: 독구름 자동 생성 ──
  if(wsid2==='bacteria_drop'){
    buls.push({x:P.x,y:P.y,vx:Math.cos(P.angle)*ws.spd,vy:Math.sin(P.angle)*ws.spd,r:ws.r,l:ws.life,en:false,dmg:ws.dmg+(P.dmgB||0),col:'#86efac',_explosive:true});
    effs.push({type:'cloud',x:P.x+Math.cos(P.angle)*60,y:P.y+Math.sin(P.angle)*60,l:120,ml:120,r:50,dmgMult:1.5,dmgT:0});
    P.ammo--;if(P.ammo<=0)startRel();updHUD();return;
  }

  // ── 썬 드롭: 8방향 분열 ──
  if(wsid2==='sun_drop'){
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2;buls.push({x:P.x,y:P.y,vx:Math.cos(a)*8,vy:Math.sin(a)*8,r:6,l:100,en:false,dmg:ws.dmg+(P.dmgB||0),col:'#fbbf24',_explosive:true});}
    P.ammo--;if(P.ammo<=0)startRel();updHUD();return;
  }

  // ── 추가 무기 특수효과 ──
  if(wsid2==='thunderbolt'||wsid2==='sp_storm'){
    // 번개창/폭풍검: 타겟 추적 번개
    const tgt=zoms.filter(z=>!z.dead).sort((a,b)=>d2(a.x,a.y,P.x,P.y)-d2(b.x,b.y,P.x,P.y))[0];
    const ang=tgt?Math.atan2(tgt.y-P.y,tgt.x-P.x):P.angle;
    buls.push({x:P.x,y:P.y,vx:Math.cos(ang)*ws.spd,vy:Math.sin(ang)*ws.spd,r:ws.r,l:ws.life,en:false,dmg:ws.dmg+(P.dmgB||0),col:'#facc15',_chainAtk:true,_homing:true});
    P.ammo--;if(P.ammo<=0)startRel();updHUD();return;
  }
  if(wsid2==='crossbow'){
    // 석궁: 관통 화살
    buls.push({x:P.x,y:P.y,vx:Math.cos(P.angle)*ws.spd,vy:Math.sin(P.angle)*ws.spd,r:ws.r,l:ws.life,en:false,dmg:ws.dmg+(P.dmgB||0),col:'#92400e',pierce:true});
    P.ammo--;if(P.ammo<=0)startRel();updHUD();return;
  }
  if(wsid2==='boltgun'){
    // 볼트건: 관통+폭발
    buls.push({x:P.x,y:P.y,vx:Math.cos(P.angle)*ws.spd,vy:Math.sin(P.angle)*ws.spd,r:ws.r,l:ws.life,en:false,dmg:ws.dmg+(P.dmgB||0),col:'#9ca3af',pierce:true,_explosive:true});
    P.ammo--;if(P.ammo<=0)startRel();updHUD();return;
  }
  if(wsid2==='plasma'){
    // 플라즈마: 에너지+폭발 대형탄
    buls.push({x:P.x,y:P.y,vx:Math.cos(P.angle)*ws.spd,vy:Math.sin(P.angle)*ws.spd,r:ws.r+3,l:ws.life,en:false,dmg:ws.dmg+(P.dmgB||0),col:'#22d3ee',pierce:true,_explosive:true,_aoeR:90});
    P.ammo--;if(P.ammo<=0)startRel();updHUD();return;
  }
  if(wsid2==='antimatter'){
    // 반물질: 극대형 폭발
    buls.push({x:P.x,y:P.y,vx:Math.cos(P.angle)*ws.spd,vy:Math.sin(P.angle)*ws.spd,r:12,l:ws.life,en:false,dmg:ws.dmg+(P.dmgB||0),col:'#e879f9',pierce:true,_explosive:true,_aoeR:150});
    P.ammo--;if(P.ammo<=0)startRel();updHUD();return;
  }
  if(wsid2==='dualgun'){
    // 쌍권총: 2발 동시
    [-0.15,0.15].forEach(off=>buls.push({x:P.x,y:P.y,vx:Math.cos(P.angle+off)*ws.spd,vy:Math.sin(P.angle+off)*ws.spd,r:ws.r,l:ws.life,en:false,dmg:ws.dmg+(P.dmgB||0),col:'#94a3b8'}));
    P.ammo-=2;if(P.ammo<=0)startRel();updHUD();return;
  }
  if(wsid2==='sniper'||wsid2==='sniperex'){
    // 저격: 즉시 직선+고데미지+관통
    for(let d=0;d<600;d+=16)buls.push({x:P.x+Math.cos(P.angle)*d,y:P.y+Math.sin(P.angle)*d,vx:0,vy:0,r:wsid2==='sniperex'?6:4,l:5,en:false,dmg:ws.dmg+(P.dmgB||0),col:'#fbbf24',pierce:true});
    P.ammo--;if(P.ammo<=0)startRel();updHUD();return;
  }
  if(wsid2==='machine_drop'){
    // 강철심장: 고속탄+레이저
    buls.push({x:P.x,y:P.y,vx:Math.cos(P.angle)*ws.spd,vy:Math.sin(P.angle)*ws.spd,r:ws.r,l:ws.life,en:false,dmg:ws.dmg+(P.dmgB||0),col:'#60a5fa',pierce:true});
    if(P.ammo%5===0){for(let d=0;d<250;d+=18)buls.push({x:P.x+Math.cos(P.angle)*d,y:P.y+Math.sin(P.angle)*d,vx:0,vy:0,r:8,l:20,en:false,dmg:8,laser:true,col:'#3b82f6'});}
    P.ammo--;if(P.ammo<=0)startRel();updHUD();return;
  }
  if(wsid2==='clock_drop'){
    // 시간의 바늘: 나선+얼림
    const spiralA=P.angle+Date.now()/500;
    buls.push({x:P.x,y:P.y,vx:Math.cos(spiralA)*ws.spd,vy:Math.sin(spiralA)*ws.spd,r:ws.r,l:ws.life,en:false,dmg:ws.dmg+(P.dmgB||0),col:'#c4b5fd',_freezeAtk:true});
    P.ammo--;if(P.ammo<=0)startRel();updHUD();return;
  }
  if(wsid2==='sp_space'||wsid2==='sp_nova'){
    // 우주/성운 포: 에너지+폭발+관통
    buls.push({x:P.x,y:P.y,vx:Math.cos(P.angle)*ws.spd,vy:Math.sin(P.angle)*ws.spd,r:ws.r,l:ws.life,en:false,dmg:ws.dmg+(P.dmgB||0),col:wsid2==='sp_nova'?'#818cf8':'#6366f1',pierce:true,_explosive:true,_aoeR:100});
    P.ammo--;if(P.ammo<=0)startRel();updHUD();return;
  }
  if(wsid2==='sp_summer'){
    // 여름 파도: 파동 3발+냉각
    for(let i=-1;i<=1;i++){buls.push({x:P.x,y:P.y,vx:Math.cos(P.angle+i*.2)*ws.spd,vy:Math.sin(P.angle+i*.2)*ws.spd,r:ws.r,l:ws.life,en:false,dmg:ws.dmg+(P.dmgB||0),col:'#38bdf8',_freezeAtk:true,_explosive:true});}
    P.ammo--;if(P.ammo<=0)startRel();updHUD();return;
  }
  if(wsid2==='sp_cannon'){
    // 별의 포: 대형 에너지탄+폭발
    buls.push({x:P.x,y:P.y,vx:Math.cos(P.angle)*ws.spd,vy:Math.sin(P.angle)*ws.spd,r:12,l:ws.life,en:false,dmg:ws.dmg+(P.dmgB||0),col:'#fbbf24',pierce:true,_explosive:true,_aoeR:130});
    P.ammo--;if(P.ammo<=0)startRel();updHUD();return;
  }
  if(wsid2==='flintlock'){
    // 화승총: 1발 고데미지
    buls.push({x:P.x,y:P.y,vx:Math.cos(P.angle)*ws.spd,vy:Math.sin(P.angle)*ws.spd,r:7,l:ws.life,en:false,dmg:ws.dmg+(P.dmgB||0),col:'#f5f5dc',pierce:true});
    addExp(P.x+Math.cos(P.angle)*30,P.y+Math.sin(P.angle)*30,40,'rgba(200,150,50,0.4)');
    P.ammo--;if(P.ammo<=0)startRel();updHUD();return;
  }

  const ml=perkLv['multi']??-1,cnt=ml<0?1:[2,3,4,5,7][Math.min(ml,4)];
  if(ws.sg){const spread=ws.spread||5;for(let i=-(spread-1)/2;i<=(spread-1)/2;i++){const a=P.angle+i*.12;fB(a,ws.dmg+(P.dmgB||0),ws);}}
  else if(ws.burst){for(let b=0;b<3;b++)setTimeout(()=>{if(running)fB(P.angle+(Math.random()-.5)*.05,ws.dmg+(P.dmgB||0),ws);},b*80);}
  else{for(let i=0;i<cnt;i++){const a=P.angle+(i-(cnt-1)/2)*.1;fB(a,ws.dmg+(P.dmgB||0),ws);}}
  // ── 보스 클리어 전용 무기 특수 효과 ──
  if(ws.id==='sun_drop'){
    // 8방향 분열탄
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2;buls.push({x:P.x,y:P.y,vx:Math.cos(a)*8,vy:Math.sin(a)*8,r:6,l:100,en:false,dmg:(ws.dmg||30)/2,col:'#f59e0b',_explosive:true});}
  }
  if(ws.id==='machine_drop'){
    // 레이저 빔 병행 발사
    const la=P.angle;for(let d=0;d<300;d+=20)buls.push({x:P.x+Math.cos(la)*d,y:P.y+Math.sin(la)*d,vx:0,vy:0,r:8,l:25,en:false,dmg:8,laser:true,col:'#60a5fa'});
  }
  if(ws.id==='bacteria_drop'){
    // 폭발 시 독구름 자동 생성
    buls.filter(b=>b._explosive&&!b.en).forEach(()=>{effs.push({type:'cloud',x:P.x,y:P.y,l:180,ml:180,r:60,dmgMult:1.5,dmgT:0});});
    // 발사 시마다 소형 독구름
    effs.push({type:'cloud',x:P.x+Math.cos(P.angle)*40,y:P.y+Math.sin(P.angle)*40,l:80,ml:80,r:30,dmgMult:1,dmgT:0});
  }
  if(ws.id==='skeleton_drop'){
    // 뼈 파편 8방향 자동 발사
    setTimeout(()=>{if(!running)return;for(let i=0;i<8;i++){const a=i/8*Math.PI*2;buls.push({x:P.x,y:P.y,vx:Math.cos(a)*7,vy:Math.sin(a)*7,r:5,l:100,en:false,dmg:12,col:'#d1d5db'});}},120);
  }
  if(ws.id==='clock_drop'){
    // 나선 궤도로 날아감
    const base=Date.now()/400;buls[buls.length-1].vx=Math.cos(base+P.angle)*ws.spd;buls[buls.length-1].vy=Math.sin(base+P.angle)*ws.spd;
  }
  if(ws.id==='reanimation_drop'){
    // 처치 시 아군 소환은 hitZ에서 처리 (_reanimation 태그)
    if(buls.length>0)buls[buls.length-1]._reanimation=true;
  }
  if(ws.id==='kraken_drop'){
    // 폭발+촉수 소환
    const ang=P.angle;setTimeout(()=>{if(!running)return;for(let i=-2;i<=2;i++){buls.push({x:P.x,y:P.y,vx:Math.cos(ang+i*.15)*6,vy:Math.sin(ang+i*.15)*6,r:10,l:120,en:false,dmg:20,col:'#22d3ee'});}},200);
  }
  if(ws.id==='symphony_drop'){
    // 무지개 48발 자동 방사
    setTimeout(()=>{if(!running)return;for(let i=0;i<48;i++){const a=i/48*Math.PI*2;buls.push({x:P.x,y:P.y,vx:Math.cos(a)*9,vy:Math.sin(a)*9,r:6,l:150,en:false,dmg:30,col:`hsl(${i*7.5},90%,65%)`});}},80);
  }
  // 신규 무기 특수 효과
  if(ws.explosive){
    // 마지막 발사 탄환에 폭발 태그
    buls[buls.length-1]._explosive=true;
  }
  if(ws.freeze){buls.forEach(b=>{if(!b.en)b._freezeAtk=true;});}
  if(ws.chain){buls.forEach(b=>{if(!b.en)b._chainAtk=true;});}
  // 인챈트 특수효과
  if(ws.enchFire){buls.forEach(b=>{if(!b.en)b._fire=true;});}
  if(ws.enchFreeze){buls.forEach(b=>{if(!b.en)b._freezeAtk=true;});}
  if(ws.enchChain){buls.forEach(b=>{if(!b.en)b._chainAtk=true;});}
  if(ws.enchExplosive){buls.forEach(b=>{if(!b.en)b._explosive=true;});}
  if(ws.enchVamp){buls.forEach(b=>{if(!b.en)b._vamp=true;});}
  if(ws.enchPierce){buls.forEach(b=>{if(!b.en)b.pierce=true;});}
  if(ws.dual){
    // 약간 다른 각도로 1발 더
    const a2=P.angle+.15;fB(a2,ws.dmg+(P.dmgB||0),ws);
    P.ammo--;
  }
  P.ammo--;if(P.ammo<=0)startRel();updHUD();
}
function fB(ang,dmg,ws){
  const bspd=(ws.spd||10)*(P._bulletSpeedMult||1);
  buls.push({x:P.x,y:P.y,vx:Math.cos(ang)*bspd,vy:Math.sin(ang)*bspd,r:ws.r,l:ws.life,en:false,dmg,pierce:ws.energy||false,col:ws.col||undefined});
  for(let i=0;i<4;i++)parts.push({x:P.x,y:P.y,vx:(Math.random()-.5)*4+Math.cos(ang)*3,vy:(Math.random()-.5)*4+Math.sin(ang)*3,l:10,ml:10,r:3,col:ws.energy?'#c084fc':'#FAC775'});
}
function doMelee(range,arc){
  zoms.forEach(z=>{if(z.dead)return;const dx=z.x-P.x,dy=z.y-P.y,dl=Math.sqrt(d2(P.x,P.y,z.x,z.y));if(dl>range+z.r)return;let df=Math.atan2(dy,dx)-P.angle;while(df>Math.PI)df-=Math.PI*2;while(df<-Math.PI)df+=Math.PI*2;if(Math.abs(df)<arc/2){hitZ(z,P.ws.dmg+(P.dmgB||0));for(let i=0;i<6;i++)parts.push({x:z.x,y:z.y,vx:(Math.random()-.5)*6,vy:(Math.random()-.5)*6,l:14,ml:14,r:3,col:'#ccc'});}});
}
function startRel(){if(P.ws.knife||P.reloading)return;P.reloading=true;P.ammo=0;relTimer=Math.max(20,P.ws.rel-P.reloadBonus);setMsg('🔄 재장전...');setTimeout(()=>{if(running)setMsg('');},relTimer/60*1000);}

// ── DRAW ──
const THEMES={city:{bg:'#7a7a7a',bd:'rgba(60,60,60,.6)'},forest:{bg:'#1a2e1a',bd:'rgba(20,83,45,.5)'},lab:{bg:'#0e1828',bd:'rgba(30,80,175,.4)'},desert:{bg:'#c4a050',bd:'rgba(120,80,0,.5)'},sun:{bg:'#2a1200',bd:'rgba(200,80,0,.4)'},machine:{bg:'#0e1e30',bd:'rgba(30,80,180,.4)'},bacteria:{bg:'#0a2010',bd:'rgba(20,120,50,.4)'},clock:{bg:'#18103a',bd:'rgba(80,30,180,.4)'},skeleton:{bg:'#202020',bd:'rgba(120,120,120,.4)'},reanimation:{bg:'#280808',bd:'rgba(180,0,0,.5)'},kraken:{bg:'#001828',bd:'rgba(0,100,160,.4)'},space:{bg:'#000010',bd:'rgba(80,0,150,.4)'},symphony:{bg:'#120018',bd:'rgba(180,130,0,.5)'},};

function draw(){
  ctx.clearRect(0,0,VW(),VH());
  ctx.shadowBlur=0;ctx.shadowColor='transparent';
  const _ox=VW()>=MW?(VW()-MW)/2:-camX;
  ctx.save();ctx.translate(_ox,-camY);
  {
    const th=THEMES[selMap?.id]||THEMES.city;
    ctx.fillStyle=th.bg;ctx.fillRect(0,0,MW,MH);
    drawTerrain(ctx,selMap);
    ctx.strokeStyle=th.bd;ctx.lineWidth=3;ctx.strokeRect(1,1,MW-2,MH-2);
  }
  {
    for(let y=600;y<MH;y+=600){ctx.strokeStyle='rgba(255,255,255,.06)';ctx.lineWidth=1;ctx.setLineDash([8,8]);ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(MW,y);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='rgba(255,255,255,.1)';ctx.font='11px sans-serif';ctx.textAlign='right';ctx.fillText(`구역${Math.floor(y/600)+1}`,MW-6,y-4);}
  }
  // 실험실 구획선 제거됨
  hpItems.forEach(it=>{if(it.collected)return;const bob=Math.sin(it.bob)*3;ctx.beginPath();ctx.arc(it.x,it.y+bob,it.r+5,0,Math.PI*2);ctx.fillStyle='rgba(239,68,68,.15)';ctx.fill();ctx.beginPath();ctx.arc(it.x,it.y+bob,it.r,0,Math.PI*2);ctx.fillStyle='#ef4444';ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle='#fff';ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.fillText('+',it.x,it.y+bob+5);});
  const ml=perkLv['magnet']??-1;
  if(ml>=0){const rng=ml>=5?180:[50,70,90,110,130][ml];ctx.beginPath();ctx.arc(P.x,P.y,rng,0,Math.PI*2);ctx.fillStyle=ml>=5?'rgba(147,51,234,.1)':'rgba(56,189,248,.08)';ctx.fill();ctx.strokeStyle=ml>=5?'rgba(147,51,234,.5)':'rgba(56,189,248,.4)';ctx.lineWidth=1.5;ctx.stroke();}
  if(P._shield>0){ctx.beginPath();ctx.arc(P.x,P.y,P.r+8,0,Math.PI*2);ctx.strokeStyle=`rgba(52,211,153,${.6+Math.sin(Date.now()/100)*.3})`;ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='rgba(52,211,153,.08)';ctx.fill();}
  effs.forEach(e=>{
    if(e.type==='ring'){ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,Math.PI*2);ctx.strokeStyle=(e.col||'#FF6600')+(Math.floor(e.l/e.ml*200).toString(16).padStart(2,'0'));ctx.lineWidth=3;ctx.stroke();}
    else if(e.type==='laser'){const dx=Math.cos(e.ang),dy=Math.sin(e.ang),alpha=e.l/e.ml;ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=e.col||'#facc15';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x+dx*e.len,e.y+dy*e.len);ctx.stroke();ctx.lineWidth=10;ctx.globalAlpha=alpha*.25;ctx.stroke();ctx.restore();}
    else if(e.type==='cloud'){const a=e.l/e.ml*.45;ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,Math.PI*2);ctx.fillStyle=`rgba(141,184,0,${a})`;ctx.fill();ctx.strokeStyle=`rgba(85,119,0,${a*1.5})`;ctx.lineWidth=2;ctx.stroke();}
    else if(e.type==='warn'){const a=1-e.l/e.ml;ctx.beginPath();ctx.arc(e.x,e.y,18+a*10,0,Math.PI*2);ctx.strokeStyle=`rgba(255,${Math.floor(200*(1-a))},0,${.5+a*.5})`;ctx.lineWidth=2;ctx.stroke();}
    else if(e.type==='shadow'){
      const alpha=Math.min(0.7,e.l/e.ml*0.8);
      ctx.save();ctx.globalAlpha=alpha;ctx.translate(e.x,e.y);ctx.rotate(P?P.angle:0);
      ctx.beginPath();ctx.arc(0,0,P?P.r:16,0,Math.PI*2);ctx.fillStyle='#818cf8';ctx.fill();
      ctx.strokeStyle='#c4b5fd';ctx.lineWidth=2;ctx.stroke();
      ctx.fillStyle='rgba(129,140,248,0.3)';ctx.fillRect(P?P.r-2:14,-4,16,8);
      ctx.restore();
    }
    else if(e.type==='drone'){
      if(!e.active)return;
      const t3=Date.now()/400;const alpha=0.9;
      ctx.save();ctx.globalAlpha=alpha;ctx.translate(e.x,e.y+Math.sin(t3)*4);
      // 드론 몸체
      ctx.fillStyle='#0891b2';ctx.beginPath();ctx.arc(0,0,10,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#67e8f9';ctx.lineWidth=2;ctx.stroke();
      // 프로펠러
      ctx.strokeStyle='rgba(103,232,249,0.7)';ctx.lineWidth=2;
      for(let i=0;i<4;i++){const a=i/4*Math.PI*2+t3*5;ctx.beginPath();ctx.moveTo(Math.cos(a)*6,Math.sin(a)*6);ctx.lineTo(Math.cos(a)*14,Math.sin(a)*14);ctx.stroke();}
      // HP바
      const dhp=e.hp/30;ctx.fillStyle='rgba(0,0,0,.4)';ctx.fillRect(-12,-18,24,4);ctx.fillStyle='#22c55e';ctx.fillRect(-12,-18,24*dhp,4);
      ctx.restore();
      // 남은 시간 표시
      ctx.fillStyle='rgba(103,232,249,0.7)';ctx.font='8px sans-serif';ctx.textAlign='center';
      ctx.fillText(Math.ceil(e.l/60)+'s',e.x,e.y-22);
    }
  });
  zoms.forEach(z=>drawZ(z));
  buls.forEach(b=>{
    const t=Date.now(), col=b.col||(b.en?'#FFD700':b.pierce?'#c084fc':'#f97316');
    // hsl/rgb 색상에 hex 투명도 붙이면 에러 → rgba()로 안전하게 변환
    const colA=(alpha)=>{
      if(col.startsWith('#')){
        // hex → rgba
        const h=col.slice(1);
        const r=parseInt(h.length===3?h[0]+h[0]:h.slice(0,2),16);
        const g2=parseInt(h.length===3?h[1]+h[1]:h.slice(2,4),16);
        const b2=parseInt(h.length===3?h[2]+h[2]:h.slice(4,6),16);
        return `rgba(${r},${g2},${b2},${alpha})`;
      }
      if(col.startsWith('hsl')){
        return col.replace('hsl(','hsla(').replace(')',`,${alpha})`);
      }
      return col;
    };
    ctx.save();
    if(b.laser){
      // 레이저: 십자형 글로우
      const g=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r+8);
      g.addColorStop(0,col);g.addColorStop(1,colA(0));
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(b.x,b.y,b.r+8,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle=col;ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(b.x-b.r*2,b.y);ctx.lineTo(b.x+b.r*2,b.y);ctx.stroke();
      ctx.beginPath();ctx.moveTo(b.x,b.y-b.r*2);ctx.lineTo(b.x,b.y+b.r*2);ctx.stroke();
    } else if(b._fire){
      // 화염: 불꽃 삼각형+글로우
      ctx.translate(b.x,b.y);ctx.rotate(t/200+b.x*.1);
      const fg=ctx.createRadialGradient(0,0,0,0,0,b.r+4);
      fg.addColorStop(0,'#fff');fg.addColorStop(0.4,col);fg.addColorStop(1,colA(0));
      ctx.fillStyle=fg;
      ctx.beginPath();
      for(let i=0;i<3;i++){const a=i/3*Math.PI*2;ctx.lineTo(Math.cos(a)*(b.r+3),Math.sin(a)*(b.r+3));}
      ctx.closePath();ctx.fill();
    } else if(b._freezeAtk){
      // 냉동: 눈꽃 결정
      ctx.translate(b.x,b.y);
      ctx.strokeStyle=col;ctx.lineWidth=2;
      for(let i=0;i<6;i++){ctx.save();ctx.rotate(i/6*Math.PI*2);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,b.r+3);ctx.stroke();ctx.restore();}
      ctx.fillStyle=colA(0.67);ctx.beginPath();ctx.arc(0,0,b.r*.6,0,Math.PI*2);ctx.fill();
    } else if(b._explosive){
      // 폭발탄: 별 모양
      ctx.translate(b.x,b.y);ctx.rotate(t/300);
      const pts=5,outer=b.r+3,inner=b.r*.5;
      ctx.beginPath();
      for(let i=0;i<pts*2;i++){const a=i/pts*Math.PI,r2=i%2===0?outer:inner;ctx.lineTo(Math.cos(a)*r2,Math.sin(a)*r2);}
      ctx.closePath();
      const sg=ctx.createRadialGradient(0,0,0,0,0,outer+4);
      sg.addColorStop(0,'#fff');sg.addColorStop(0.5,col);sg.addColorStop(1,colA(0));
      ctx.fillStyle=sg;ctx.fill();
    } else if(b._chainAtk||col==='#facc15'){
      // 번개: 지그재그 라인
      ctx.translate(b.x,b.y);
      ctx.strokeStyle=col;ctx.lineWidth=3;ctx.shadowColor=col;ctx.shadowBlur=8;
      const ang=Math.atan2(b.vy,b.vx);ctx.rotate(ang);
      ctx.beginPath();ctx.moveTo(-b.r*2,0);
      for(let i=0;i<4;i++){ctx.lineTo(-b.r*2+i*b.r+b.r*.5,(i%2===0?1:-1)*4);}
      ctx.lineTo(b.r*2,0);ctx.stroke();
      ctx.shadowBlur=0;
    } else if(b.pierce&&!b._explosive){
      // 관통탄: 다이아몬드+궤적
      ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy,b.vx));
      const pg=ctx.createLinearGradient(-b.r*2,0,b.r*2,0);
      pg.addColorStop(0,colA(0));pg.addColorStop(0.5,col);pg.addColorStop(1,'#fff');
      ctx.fillStyle=pg;
      ctx.beginPath();ctx.moveTo(-b.r*2,0);ctx.lineTo(-b.r*.5,-b.r*.8);ctx.lineTo(b.r*1.5,0);ctx.lineTo(-b.r*.5,b.r*.8);ctx.closePath();ctx.fill();
    } else if(b._homing){
      // 추적 미사일: 로켓
      ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy,b.vx));
      ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(-8,7);ctx.lineTo(-4,0);ctx.lineTo(-8,-7);ctx.closePath();ctx.fill();
      ctx.fillStyle='#ff4400';ctx.beginPath();ctx.arc(-6,0,4,0,Math.PI*2);ctx.fill();
      // 불꽃 꼬리
      if(Math.random()<.3)parts.push({x:b.x-Math.cos(Math.atan2(b.vy,b.vx))*10,y:b.y-Math.sin(Math.atan2(b.vy,b.vx))*10,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,l:5,ml:5,r:3,col:'#f97316'});
    } else if(b.magic){
      // 마법탄: 육각형+오라
      ctx.translate(b.x,b.y);ctx.rotate(t/200);
      const mg=ctx.createRadialGradient(0,0,0,0,0,b.r+5);mg.addColorStop(0,'#fff');mg.addColorStop(0.5,col);mg.addColorStop(1,colA(0));
      ctx.fillStyle=mg;
      ctx.beginPath();for(let i=0;i<6;i++){const a=i/6*Math.PI*2;ctx.lineTo(Math.cos(a)*(b.r+2),Math.sin(a)*(b.r+2));}ctx.closePath();ctx.fill();
    } else if(b.en){
      // 적 탄환: 붉은 마름모
      ctx.translate(b.x,b.y);ctx.rotate(Math.PI/4);
      ctx.fillStyle=col||'#ef4444';ctx.strokeStyle='#fff';ctx.lineWidth=1;
      ctx.fillRect(-b.r,-b.r,b.r*2,b.r*2);ctx.strokeRect(-b.r,-b.r,b.r*2,b.r*2);
    } else {
      // 기본 총알: 방향에 맞춰 타원+글로우
      const spd=Math.hypot(b.vx,b.vy);
      ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy,b.vx));
      const bgg=ctx.createRadialGradient(0,0,0,0,0,b.r+3);bgg.addColorStop(0,'#fff');bgg.addColorStop(0.5,col);bgg.addColorStop(1,colA(0));
      ctx.fillStyle=bgg;
      ctx.beginPath();ctx.ellipse(0,0,b.r+spd*.5,b.r,0,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  });
  parts.forEach(p=>{ctx.globalAlpha=p.l/p.ml;ctx.beginPath();ctx.arc(p.x,p.y,p.r*(p.l/p.ml),0,Math.PI*2);ctx.fillStyle=p.col||'#FAC775';ctx.fill();ctx.globalAlpha=1;});
  drawPlayer();
  // ── 보스맵 보스 그리기 ──
  // 보스맵 보스는 drawZ에서 자동 처리
  // 포탑 그리기
  turrets.forEach(t=>{
    ctx.save();ctx.translate(t.x,t.y);
    ctx.beginPath();ctx.arc(0,0,t.r,0,Math.PI*2);ctx.fillStyle='#0284c7';ctx.fill();ctx.strokeStyle='#7dd3fc';ctx.lineWidth=2;ctx.stroke();
    ctx.fillRect(-3,-t.r+4,6,t.r*.7);
    const rem=t.timer/900;ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(-t.r,-t.r-8,t.r*2,5);ctx.fillStyle='#7dd3fc';ctx.fillRect(-t.r,-t.r-8,t.r*2*rem,5);
    ctx.restore();
  });
  ctx.restore();
  // crosshair
  const sx=mx,sy=my;ctx.strokeStyle='rgba(250,199,117,.9)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(sx-10,sy);ctx.lineTo(sx-3,sy);ctx.stroke();ctx.beginPath();ctx.moveTo(sx+3,sy);ctx.lineTo(sx+10,sy);ctx.stroke();ctx.beginPath();ctx.moveTo(sx,sy-10);ctx.lineTo(sx,sy-3);ctx.stroke();ctx.beginPath();ctx.moveTo(sx,sy+3);ctx.lineTo(sx,sy+10);ctx.stroke();ctx.beginPath();ctx.arc(sx,sy,5,0,Math.PI*2);ctx.stroke();
  if(poison>0){const a=Math.min(.2,poison/300*.25)*Math.abs(Math.sin(Date.now()/200));const g=ctx.createRadialGradient(VW()/2,VH()/2,VH()*.3,VW()/2,VH()/2,VH()*.7);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(80,160,0,${a})`);ctx.fillStyle=g;ctx.fillRect(0,0,VW(),VH());}
  if(P._frozen>0){ctx.fillStyle=`rgba(125,211,252,${P._frozen/120*.25})`;ctx.fillRect(0,0,VW(),VH());}
  if(P._timewarp>0){ctx.fillStyle='rgba(167,139,250,.05)';ctx.fillRect(0,0,VW(),VH());}
  // minimap
  mmc.fillStyle='rgba(10,10,20,.85)';mmc.fillRect(0,0,72,108);mmc.strokeStyle='rgba(255,255,255,.2)';mmc.lineWidth=1;mmc.strokeRect(0,0,72,108);

  hpItems.forEach(it=>{if(!it.collected){mmc.fillStyle='#ef4444';mmc.fillRect(it.x/MW*72-1,it.y/MH*108-1,3,3);}});
  zoms.forEach(z=>{if(z.dead)return;const vl2=P?P._visionLv:-1;
    // vision lv>=2: 유령도 미니맵에 표시
    if(z.type==='ghost'&&z._phased&&vl2<2)return;
    mmc.fillStyle=z.isBoss?z.bd.col:(ZT[z.type]?.col||'#888');mmc.fillRect(z.x/MW*72-1,z.y/MH*108-1,z.isBoss?5:2,z.isBoss?5:2);});
  mmc.fillStyle='#1D9E75';mmc.beginPath();mmc.arc(P.x/MW*72,P.y/MH*108,3,0,Math.PI*2);mmc.fill();
  const v1=camY/MH*108,v2=(camY+VH())/MH*108;
  const vx1=VW()>=MW?0:camX/MW*72,vx2=VW()>=MW?72:Math.min(72,(camX+VW())/MW*72);
  mmc.strokeStyle='rgba(168,85,247,.5)';mmc.lineWidth=1.5;mmc.strokeRect(vx1,v1,vx2-vx1,v2-v1);
  if(!running&&!window._bossMapClearing&&gC.style.display==='block'&&document.getElementById('clearScreen').style.display==='none'){ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(0,0,VW(),VH());ctx.fillStyle='#fbbf24';ctx.font='bold 40px sans-serif';ctx.textAlign='center';ctx.fillText('☠ GAME OVER ☠',VW()/2,VH()/2-30);ctx.fillStyle='#fff';ctx.font='20px sans-serif';ctx.fillText(`점수: ${score}  킬: ${kills}  웨이브: ${wave}`,VW()/2,VH()/2+8);ctx.fillStyle='rgba(255,255,255,.6)';ctx.font='14px sans-serif';ctx.fillText('클릭하면 로비로',VW()/2,VH()/2+40);}
}

function drawWepIcon(ctx,ws,r){
  ctx.save();ctx.shadowBlur=0;
  const wid=ws.id, t=Date.now();
  if(ws.knife){
    // 근접 무기: 이미 위에서 처리됨
  } else if(wid==='shotgun'||wid==='shotgun2'){
    ctx.fillStyle='#374151';ctx.fillRect(r-2,-5,22,10);
    ctx.fillStyle='#111';ctx.fillRect(r+18,-3,6,6);
  } else if(wid==='sniper'||wid==='sniperex'){
    ctx.fillStyle='#1f2937';ctx.fillRect(r-2,-3,42,6);
    ctx.fillStyle='#4b5563';ctx.fillRect(r+10,-6,4,12);
  } else if(wid==='railgun'){
    ctx.fillStyle='#1f2937';ctx.fillRect(r-2,-3,42,6);
    ctx.shadowColor='#facc15';ctx.shadowBlur=6;
    ctx.strokeStyle='#facc15';ctx.lineWidth=2;ctx.strokeRect(r,-2,40,4);
  } else if(wid==='minigun'||wid==='gatling'){
    ctx.fillStyle='#374151';ctx.fillRect(r-2,-6,26,12);
    const rot=t/30;
    for(let i=0;i<3;i++){ctx.save();ctx.translate(r+22,0);ctx.rotate(rot+i*Math.PI*2/3);ctx.fillStyle='#6b7280';ctx.fillRect(-2,-7,4,14);ctx.restore();}
  } else if(wid==='flamer'){
    ctx.fillStyle='#7c2d12';ctx.fillRect(r-2,-6,20,12);
    ctx.fillStyle='#f97316';ctx.beginPath();ctx.arc(r+20,0,5,0,Math.PI*2);ctx.fill();
  } else if(wid==='rocket'||wid==='volcanogun'){
    ctx.fillStyle='#374151';ctx.fillRect(r-2,-6,20,12);
    ctx.fillStyle='#6b7280';ctx.beginPath();ctx.arc(r+20,0,5,0,Math.PI*2);ctx.fill();
  } else if(wid==='laser_gun'||wid==='beamrifle'){
    ctx.fillStyle='#1e1b4b';ctx.fillRect(r-2,-4,28,8);
    ctx.shadowColor='#818cf8';ctx.shadowBlur=4;
    ctx.fillStyle='#818cf8';ctx.fillRect(r+24,-2,6,4);
  } else if(wid==='icegen'||wid==='cryocannon'){
    ctx.fillStyle='#0369a1';ctx.fillRect(r-2,-4,24,8);
    ctx.fillStyle='#bae6fd';ctx.beginPath();ctx.arc(r+22,0,4,0,Math.PI*2);ctx.fill();
  } else if(wid==='thunderbolt'){
    ctx.fillStyle='#78350f';ctx.fillRect(r-2,-2,26,4);
    ctx.fillStyle='#facc15';
    ctx.beginPath();ctx.moveTo(r+24,-6);ctx.lineTo(r+36,0);ctx.lineTo(r+24,6);ctx.closePath();ctx.fill();
  } else if(wid==='quantumgun'||wid==='omegagun'||wid==='antimatter'){
    const qg=ctx.createLinearGradient(r,0,r+30,0);
    qg.addColorStop(0,`hsl(${t/20%360},90%,60%)`);qg.addColorStop(1,`hsl(${(t/20+180)%360},90%,60%)`);
    ctx.fillStyle=qg;ctx.fillRect(r-2,-5,32,10);
  } else if(wid==='sun_drop'){
    ctx.shadowColor='#fbbf24';ctx.shadowBlur=6;
    ctx.fillStyle='#f59e0b';ctx.beginPath();ctx.arc(r+12,0,8,0,Math.PI*2);ctx.fill();
  } else if(wid==='symphony_drop'){
    const sq=ctx.createLinearGradient(r,0,r+22,0);
    for(let i=0;i<7;i++)sq.addColorStop(i/6,`hsl(${i*50},90%,60%)`);
    ctx.fillStyle=sq;ctx.fillRect(r,-3,22,6);
  } else if(wid==='sp_cannon'||wid==='sp_nova'||wid==='sp_space'){
    const spc=wid==='sp_cannon'?'#fbbf24':'#818cf8';
    ctx.shadowColor=spc;ctx.shadowBlur=5;
    ctx.fillStyle=spc;ctx.fillRect(r-2,-6,28,12);
  } else if(wid==='machinegun'){
    ctx.fillStyle='#374151';ctx.fillRect(r-2,-5,28,10);
    ctx.fillStyle='#111';ctx.fillRect(r+26,-3,5,6);
  } else {
    ctx.fillStyle='#085041';ctx.fillRect(r-2,-4,18,8);
    ctx.beginPath();ctx.arc(r+15,0,4,0,Math.PI*2);ctx.fill();
  }
  ctx.shadowBlur=0;ctx.restore();
}

function drawPlayer(){
  const{x,y,r,angle}=P,poi=poison>0;
  const ar=ARMORS.find(a=>a.id===eqArmor);const bc=poi?'#7aaa4a':ar?ar.bc:'#1D9E75';
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);
  if(ar){ctx.beginPath();ctx.arc(0,0,r+4,0,Math.PI*2);ctx.fillStyle=ar.ac+'44';ctx.fill();ctx.strokeStyle=ar.ac;ctx.lineWidth=2;ctx.stroke();}
  ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);
  ctx.fillStyle=bc;ctx.fill();ctx.strokeStyle=poi?'#557700':'#085041';ctx.lineWidth=2;ctx.stroke();
  // 무기 그리기
  if(P&&P.ws&&P.ws.knife){
    const sid=P.ws.id;
    const t2=Date.now();const sw=Math.sin(t2/200)*.25;ctx.rotate(sw);
    if(sid==='katana'){ctx.fillStyle='#e2e8f0';ctx.fillRect(r,-2,38,4);ctx.fillStyle='#f59e0b';ctx.fillRect(r+32,-4,5,8);ctx.fillStyle='#7c3aed';ctx.fillRect(r-3,-5,6,10);}
    else if(sid==='sword'){ctx.fillStyle='#d4d4d8';ctx.fillRect(r,-2,30,4);ctx.fillStyle='#f59e0b';ctx.fillRect(r+6,-6,4,12);}
    else if(sid==='axe'){ctx.fillStyle='#9ca3af';ctx.fillRect(r,-2,18,4);ctx.fillStyle='#6b7280';ctx.fillRect(r+16,-12,10,24);}
    else if(sid==='hammer'){ctx.fillStyle='#9ca3af';ctx.fillRect(r,-3,22,6);ctx.fillStyle='#374151';ctx.fillRect(r+20,-14,14,28);}
    else if(sid==='spear'){ctx.fillStyle='#78716c';ctx.fillRect(r,-2,32,4);ctx.fillStyle='#e2e8f0';ctx.beginPath();ctx.moveTo(r+32,-7);ctx.lineTo(r+46,0);ctx.lineTo(r+32,7);ctx.closePath();ctx.fill();}
    else if(sid==='scythe'){ctx.fillStyle='#78716c';ctx.fillRect(r,-2,24,4);ctx.strokeStyle='#9ca3af';ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.arc(r+24,-8,14,Math.PI*.4,Math.PI*1.15);ctx.stroke();}
    else{ctx.fillStyle='#c0c0c0';ctx.fillRect(r,-2,20,4);}
  } else {
    ctx.save();
    ctx.shadowBlur=0;ctx.shadowColor='transparent';
    if(!P.ws){
      ctx.fillStyle='#085041';ctx.fillRect(r-2,-4,16,8);
      ctx.beginPath();ctx.arc(r+13,0,4,0,Math.PI*2);ctx.fill();
    } else {
      drawWepIcon(ctx,P.ws,r);
    }
    ctx.restore();
  }
  ctx.restore();
  const bw=44,bh=5,pct=Math.max(0,P.hp/P.maxHp);
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(x-bw/2,y-r-14,bw,bh);
  ctx.fillStyle=pct>.5?'#22c55e':pct>.25?'#f59e0b':'#ef4444';ctx.fillRect(x-bw/2,y-r-14,bw*pct,bh);
  if(P.reloading){const prog=1-relTimer/Math.max(1,P.ws.rel);ctx.beginPath();ctx.arc(x,y,r+8,-Math.PI/2,-Math.PI/2+Math.PI*2*prog);ctx.strokeStyle='#f59e0b';ctx.lineWidth=3;ctx.stroke();}
}

function drawZ(z){
  if(z.isBoss&&!z.isMinion){drawBoss(z);return;}
  // 화염 도트데미지 상태 표시 (가벼운 오버레이, 파티클 생성 없음 - 성능)
  if(z._burnT>0&&!z.dead){
    ctx.save();ctx.globalAlpha=0.35+0.15*Math.sin(z._burnT*.5);
    ctx.beginPath();ctx.arc(z.x,z.y,z.r*0.85,0,Math.PI*2);
    ctx.fillStyle='#f97316';ctx.fill();
    ctx.restore();
  }
  // 수퍼탱커
  if(z.type==='supertank'){
    if(z.dead){ctx.save();ctx.globalAlpha=z.dT/35;ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,Math.PI*2);ctx.fillStyle='#3b0000';ctx.fill();ctx.restore();return;}
    ctx.save();ctx.translate(z.x,z.y);
    const pulse=.7+.3*Math.sin(Date.now()/200);
    ctx.beginPath();ctx.arc(0,0,z.r+8,0,Math.PI*2);ctx.fillStyle=`rgba(139,0,0,${.2*pulse})`;ctx.fill();
    ctx.beginPath();ctx.roundRect(-z.r,-z.r,z.r*2,z.r*2,4);ctx.fillStyle='#3b0000';ctx.fill();ctx.strokeStyle='#7f0000';ctx.lineWidth=4;ctx.stroke();
    // 갑옷 판
    for(let i=0;i<4;i++){const a=i/4*Math.PI*2;ctx.fillStyle='#1a0000';ctx.fillRect(Math.cos(a)*(z.r-8)-6,Math.sin(a)*(z.r-8)-6,12,12);}
    ctx.fillStyle='#ff4444';ctx.font=`bold ${Math.floor(z.r*.5)}px sans-serif`;ctx.textAlign='center';ctx.fillText('ST',0,z.r*.2);
    ctx.restore();
    const bw=z.r*2+6,bh=5,pct=Math.max(0,z.hp/z.maxHp);
    ctx.fillStyle='rgba(0,0,0,.4)';ctx.fillRect(z.x-bw/2,z.y-z.r-16,bw,bh);ctx.fillStyle='#ef4444';ctx.fillRect(z.x-bw/2,z.y-z.r-16,bw*pct,bh);
    ctx.fillStyle='#fff';ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillText('수퍼탱커',z.x,z.y-z.r-18);
    return;
  }
  // 거미
  if(z.type==='spider'){
    if(z.dead){ctx.save();ctx.globalAlpha=z.dT/35;ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,Math.PI*2);ctx.fillStyle='#1a1a2e';ctx.fill();ctx.restore();return;}
    ctx.save();ctx.translate(z.x,z.y);ctx.rotate(z.angle);
    // 다리
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2+Math.sin(Date.now()/100+i)*.3;const len=z.r+14;ctx.strokeStyle='#312e81';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(Math.cos(a)*z.r*.6,Math.sin(a)*z.r*.6);ctx.lineTo(Math.cos(a)*len,Math.sin(a)*len);ctx.stroke();}
    ctx.beginPath();ctx.ellipse(0,0,z.r*.8,z.r,0,0,Math.PI*2);ctx.fillStyle='#1a1a2e';ctx.fill();ctx.strokeStyle='#312e81';ctx.lineWidth=2;ctx.stroke();
    // 눈
    for(let i=0;i<4;i++){ctx.fillStyle='#ef4444';ctx.beginPath();ctx.arc(-4+i*3,-4,2,0,Math.PI*2);ctx.fill();}
    ctx.restore();
    if(!z.dead&&z.maxHp>2){const bw=z.r*2+4,bh=4,pct=Math.max(0,z.hp/z.maxHp);ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(z.x-bw/2,z.y-z.r-13,bw,bh);ctx.fillStyle='#a855f7';ctx.fillRect(z.x-bw/2,z.y-z.r-13,bw*pct,bh);}
    return;
  }
  // 마법사
  if(z.type==='wizard'){
    if(z.dead){ctx.save();ctx.globalAlpha=z.dT/35;ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,Math.PI*2);ctx.fillStyle='#5B2C8B';ctx.fill();ctx.restore();return;}
    ctx.save();ctx.translate(z.x,z.y);
    const glow=.5+.5*Math.sin(Date.now()/300);
    ctx.beginPath();ctx.arc(0,0,z.r+10,0,Math.PI*2);ctx.fillStyle=`rgba(91,44,139,${.15*glow})`;ctx.fill();
    ctx.beginPath();ctx.arc(0,0,z.r,0,Math.PI*2);ctx.fillStyle='#5B2C8B';ctx.fill();ctx.strokeStyle='#9333ea';ctx.lineWidth=2;ctx.stroke();
    // 마법 파티클
    for(let i=0;i<3;i++){const a=Date.now()/400+i/3*Math.PI*2;const r2=z.r+6;ctx.fillStyle=`rgba(168,85,247,${.6+.4*Math.sin(a)})`;ctx.beginPath();ctx.arc(Math.cos(a)*r2,Math.sin(a)*r2,3,0,Math.PI*2);ctx.fill();}
    ctx.fillStyle='#fff';ctx.font=`${Math.floor(z.r*.6)}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🔮',0,0);ctx.textBaseline='alphabetic';
    ctx.restore();
    if(!z.dead&&z.maxHp>2){const bw=z.r*2+4,bh=4,pct=Math.max(0,z.hp/z.maxHp);ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(z.x-bw/2,z.y-z.r-13,bw,bh);ctx.fillStyle='#a855f7';ctx.fillRect(z.x-bw/2,z.y-z.r-13,bw*pct,bh);ctx.fillStyle='rgba(255,255,255,.7)';ctx.font='9px sans-serif';ctx.textAlign='center';ctx.fillText('마법사',z.x,z.y-z.r-15);}
    return;
  }
  // 선지자
  if(z.type==='prophet'){
    if(z.dead){ctx.save();ctx.globalAlpha=z.dT/35;ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,Math.PI*2);ctx.fillStyle='#a16207';ctx.fill();ctx.restore();return;}
    ctx.save();ctx.translate(z.x,z.y);
    // 로브
    ctx.beginPath();ctx.ellipse(0,4,z.r*.8,z.r,0,0,Math.PI*2);ctx.fillStyle='#854d0e';ctx.fill();ctx.strokeStyle='#713f12';ctx.lineWidth=2;ctx.stroke();
    // 머리
    ctx.beginPath();ctx.arc(0,-z.r*.4,z.r*.5,0,Math.PI*2);ctx.fillStyle='#a16207';ctx.fill();
    // 눈 (빛나는)
    const pg=.5+.5*Math.sin(Date.now()/300);
    ctx.fillStyle=`rgba(168,85,247,${pg})`;ctx.beginPath();ctx.arc(-4,-z.r*.4,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(4,-z.r*.4,3,0,Math.PI*2);ctx.fill();
    // 물약 들고 있는 손
    ctx.fillStyle='#a855f7';ctx.beginPath();ctx.arc(z.r*.6,-z.r*.2,5,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#7c3aed';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(z.r*.4,0);ctx.lineTo(z.r*.6,-z.r*.2);ctx.stroke();
    ctx.restore();
    const bw=z.r*2,bh=4,pct=Math.max(0,z.hp/z.maxHp);ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(z.x-bw/2,z.y-z.r-13,bw,bh);ctx.fillStyle='#a855f7';ctx.fillRect(z.x-bw/2,z.y-z.r-13,bw*pct,bh);
    ctx.fillStyle='rgba(255,255,255,.8)';ctx.font='9px sans-serif';ctx.textAlign='center';ctx.fillText('선지자',z.x,z.y-z.r-15);
    return;
  }
  // 골렘
  if(z.type==='golem'){
    if(z.dead){ctx.save();ctx.globalAlpha=z.dT/35;ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,Math.PI*2);ctx.fillStyle='#6b7280';ctx.fill();ctx.restore();return;}
    ctx.save();ctx.translate(z.x,z.y);
    // 몸체 (사각형)
    ctx.fillStyle='#4b5563';ctx.fillRect(-z.r*.8,-z.r*.7,z.r*1.6,z.r*1.4);
    ctx.strokeStyle='#374151';ctx.lineWidth=3;ctx.strokeRect(-z.r*.8,-z.r*.7,z.r*1.6,z.r*1.4);
    // 균열 텍스처
    ctx.strokeStyle='#1f2937';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(-z.r*.4,-z.r*.4);ctx.lineTo(z.r*.2,0);ctx.lineTo(-z.r*.1,z.r*.4);ctx.stroke();
    ctx.beginPath();ctx.moveTo(z.r*.3,-z.r*.5);ctx.lineTo(z.r*.1,z.r*.3);ctx.stroke();
    // 눈 (빨간 코어)
    ctx.fillStyle='#dc2626';ctx.beginPath();ctx.arc(-z.r*.25,-z.r*.2,6,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(z.r*.25,-z.r*.2,6,0,Math.PI*2);ctx.fill();
    // 팔
    ctx.fillStyle='#4b5563';ctx.fillRect(-z.r*1.3,-z.r*.4,z.r*.4,z.r*.8);ctx.fillRect(z.r*.9,-z.r*.4,z.r*.4,z.r*.8);
    ctx.strokeStyle='#374151';ctx.lineWidth=2;ctx.strokeRect(-z.r*1.3,-z.r*.4,z.r*.4,z.r*.8);ctx.strokeRect(z.r*.9,-z.r*.4,z.r*.4,z.r*.8);
    ctx.restore();
    const bw=z.r*2+8,bh=5,pct=Math.max(0,z.hp/z.maxHp);ctx.fillStyle='rgba(0,0,0,.4)';ctx.fillRect(z.x-bw/2,z.y-z.r-16,bw,bh);ctx.fillStyle=pct>.5?'#dc2626':'#7f1d1d';ctx.fillRect(z.x-bw/2,z.y-z.r-16,bw*pct,bh);
    ctx.fillStyle='rgba(255,255,255,.8)';ctx.font='9px sans-serif';ctx.textAlign='center';ctx.fillText('골렘',z.x,z.y-z.r-18);
    return;
  }
  // 악마
  if(z.type==='demon'){
    if(z.dead){ctx.save();ctx.globalAlpha=z.dT/35;ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,Math.PI*2);ctx.fillStyle='#7f1d1d';ctx.fill();ctx.restore();return;}
    ctx.save();ctx.translate(z.x,z.y);ctx.rotate(z.angle);
    // 날개
    ctx.fillStyle='rgba(127,29,29,0.5)';
    ctx.beginPath();ctx.moveTo(0,-4);ctx.lineTo(-z.r*1.8,-z.r*.8);ctx.lineTo(-z.r*1.2,z.r*.4);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(0,-4);ctx.lineTo(z.r*1.8,-z.r*.8);ctx.lineTo(z.r*1.2,z.r*.4);ctx.closePath();ctx.fill();
    // 몸
    ctx.beginPath();ctx.ellipse(0,0,z.r*.7,z.r,0,0,Math.PI*2);ctx.fillStyle='#991b1b';ctx.fill();ctx.strokeStyle='#450a0a';ctx.lineWidth=2;ctx.stroke();
    // 눈
    ctx.fillStyle='#fca5a5';ctx.beginPath();ctx.arc(-5,-4,4,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(5,-4,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#7f1d1d';ctx.beginPath();ctx.arc(-5,-4,2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(5,-4,2,0,Math.PI*2);ctx.fill();
    // 창
    ctx.strokeStyle='#c0c0c0';ctx.lineWidth=3;ctx.lineCap='round';
    const spearAng=z._spearDash?.2:0;
    ctx.save();ctx.rotate(spearAng);
    ctx.beginPath();ctx.moveTo(z.r*.5,0);ctx.lineTo(z.r*1.8,0);ctx.stroke();
    ctx.fillStyle='#e5e7eb';ctx.beginPath();ctx.moveTo(z.r*1.8,0);ctx.lineTo(z.r*2.2,-4);ctx.lineTo(z.r*2.2,4);ctx.closePath();ctx.fill();
    ctx.restore();
    if(z._spearDash){
      ctx.strokeStyle='rgba(239,68,68,.5)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,z.r+8,0,Math.PI*2);ctx.stroke();
    }
    ctx.restore();
    const bw=z.r*2,bh=4,pct=Math.max(0,z.hp/z.maxHp);ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(z.x-bw/2,z.y-z.r-14,bw,bh);ctx.fillStyle='#ef4444';ctx.fillRect(z.x-bw/2,z.y-z.r-14,bw*pct,bh);
    ctx.fillStyle='rgba(255,255,255,.8)';ctx.font='9px sans-serif';ctx.textAlign='center';ctx.fillText('악마',z.x,z.y-z.r-16);
    return;
  }
  // ROB
  if(z.type==='rob'){
    if(z.dead){ctx.save();ctx.globalAlpha=z.dT/35;ctx.fillStyle='#ccc';ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,Math.PI*2);ctx.fill();ctx.restore();return;}
    const robPulse=.6+.4*Math.abs(Math.sin(Date.now()/150));
    ctx.save();ctx.translate(z.x,z.y);
    ctx.beginPath();ctx.arc(0,0,z.r+12,0,Math.PI*2);ctx.fillStyle=`rgba(255,50,50,${.15*robPulse})`;ctx.fill();
    ctx.beginPath();ctx.arc(0,0,z.r,0,Math.PI*2);ctx.fillStyle='#f0f0f0';ctx.fill();ctx.strokeStyle='#ff3333';ctx.lineWidth=3;ctx.stroke();
    ctx.fillStyle='#ff0000';ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.fillText('ROB',0,4);
    ctx.fillStyle='rgba(255,0,0,0.6)';ctx.font='8px sans-serif';ctx.fillText('⚠️즉사',0,14);
    ctx.restore();
    ctx.fillStyle='#fff';ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.fillText('☠ ROB ☠',z.x,z.y-z.r-6);
    return;
  }
  if(z.isDragon){
    if(z.dead){ctx.save();ctx.globalAlpha=z.dT/35;ctx.beginPath();ctx.arc(z.x,z.y,z.r*2,0,Math.PI*2);ctx.fillStyle='#dc2626';ctx.fill();ctx.restore();return;}
    ctx.save();ctx.translate(z.x,z.y);ctx.rotate(z.angle);
    const gdr=ctx.createRadialGradient(0,0,0,0,0,z.r);gdr.addColorStop(0,'#ff6600');gdr.addColorStop(1,'#dc2626');
    ctx.beginPath();ctx.arc(0,0,z.r,0,Math.PI*2);ctx.fillStyle=gdr;ctx.fill();ctx.strokeStyle='#7f1d1d';ctx.lineWidth=2;ctx.stroke();
    ctx.font=`${Math.floor(z.r*.8)}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🐲',0,0);
    ctx.restore();
    const bw=z.r*2+4,bh=4,pct=z.hp/z.maxHp;ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(z.x-bw/2,z.y-z.r-12,bw,bh);ctx.fillStyle='#22c55e';ctx.fillRect(z.x-bw/2,z.y-z.r-12,bw*pct,bh);
    return;
  }
  const T=ZT[z.type];if(!T)return;
  // 아군 표시
  if(z.isMinion&&!z.dead){ctx.beginPath();ctx.arc(z.x,z.y,z.r+5,0,Math.PI*2);ctx.strokeStyle='rgba(34,197,94,.7)';ctx.lineWidth=2;ctx.stroke();}
  if(z.dead){ctx.save();ctx.globalAlpha=z.dT/35;ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,Math.PI*2);ctx.fillStyle='#555';ctx.fill();ctx.restore();return;}
  ctx.save();ctx.translate(z.x,z.y);ctx.rotate(z.angle);
  if(z.type==='ghost')ctx.globalAlpha=z._phased?.15:.85;
  if(z._frz>0)ctx.globalAlpha=(ctx.globalAlpha||1)*.6;
  if(z.type==='tanker'){ctx.beginPath();ctx.roundRect(-z.r,-z.r,z.r*2,z.r*2,5);ctx.fillStyle=T.col;ctx.fill();ctx.strokeStyle=T.ol;ctx.lineWidth=3;ctx.stroke();}
  else if(z.type==='ghost'){ctx.beginPath();ctx.arc(0,-2,z.r,Math.PI,0);ctx.lineTo(z.r,z.r*.6);for(let i=0;i<3;i++){const cx=z.r*(1-i*.67);ctx.quadraticCurveTo(cx-z.r*.33+z.r*.1,z.r*1.1,cx-z.r*.67,z.r*.6);}ctx.lineTo(-z.r,z.r*.6);ctx.closePath();ctx.fillStyle=T.col;ctx.fill();ctx.strokeStyle=T.ol;ctx.lineWidth=1.5;ctx.stroke();}
  else if(z.type==='exploder'){const pu=.7+.3*Math.sin(Date.now()/150);ctx.beginPath();ctx.arc(0,0,z.r+5,0,Math.PI*2);ctx.fillStyle=`rgba(147,112,219,${.2*pu})`;ctx.fill();ctx.beginPath();ctx.arc(0,0,z.r,0,Math.PI*2);ctx.fillStyle=T.col;ctx.fill();ctx.strokeStyle=T.ol;ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#fff';ctx.font=`bold ${Math.floor(z.r)}px sans-serif`;ctx.textAlign='center';ctx.fillText('!',0,z.r*.4);}
  else if(z.type==='healer'){ctx.beginPath();ctx.arc(0,0,z.r,0,Math.PI*2);ctx.fillStyle=T.col;ctx.fill();ctx.strokeStyle=T.ol;ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#fff';ctx.fillRect(-3,-z.r*.6,6,z.r*1.2);ctx.fillRect(-z.r*.6,-3,z.r*1.2,6);}
  else if(z.type==='poison'){ctx.beginPath();ctx.arc(0,0,z.r,0,Math.PI*2);ctx.fillStyle=T.col;ctx.fill();ctx.strokeStyle=T.ol;ctx.lineWidth=2;ctx.stroke();ctx.fillStyle=T.ol;ctx.font=`${Math.floor(z.r*.75)}px sans-serif`;ctx.textAlign='center';ctx.fillText('☠',0,z.r*.4);}
  else{ctx.beginPath();if(z.type==='runner')ctx.ellipse(2,0,z.r*.8,z.r,0,0,Math.PI*2);else ctx.arc(0,0,z.r,0,Math.PI*2);ctx.fillStyle=z._frz>0?'#93c5fd':T.col;ctx.fill();ctx.strokeStyle=T.ol;ctx.lineWidth=2;ctx.stroke();if(z.type==='runner'){ctx.strokeStyle='rgba(204,68,68,.3)';ctx.lineWidth=1.5;for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(-z.r-2,i*5);ctx.lineTo(-z.r-10,i*5);ctx.stroke();}}else{ctx.strokeStyle=T.ol;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(z.r-2,-5);ctx.lineTo(z.r+9,-8);ctx.stroke();ctx.beginPath();ctx.moveTo(z.r-2,5);ctx.lineTo(z.r+9,8);ctx.stroke();}ctx.fillStyle=T.ol;ctx.font=`${Math.floor(z.r*.7)}px sans-serif`;ctx.textAlign='center';ctx.fillText('✕',0,z.r*.3);}
  ctx.globalAlpha=1;ctx.restore();
  if(!z.dead&&z.maxHp>2){const bw=z.r*2+4,bh=4,pct=Math.max(0,z.hp/z.maxHp);ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(z.x-bw/2,z.y-z.r-13,bw,bh);ctx.fillStyle=pct>.5?'#22c55e':pct>.25?'#f59e0b':'#ef4444';ctx.fillRect(z.x-bw/2,z.y-z.r-13,bw*pct,bh);ctx.fillStyle='rgba(255,255,255,.7)';ctx.font='9px sans-serif';ctx.textAlign='center';ctx.fillText(T.name,z.x,z.y-z.r-15);}
}

function drawBoss(z){
  if(z.dead){
    ctx.save();ctx.globalAlpha=z.dT/80;
    const gr=ctx.createRadialGradient(z.x,z.y,0,z.x,z.y,z.r*2.5);
    gr.addColorStop(0,z.bd.col);gr.addColorStop(1,'transparent');
    ctx.fillStyle=gr;ctx.beginPath();ctx.arc(z.x,z.y,z.r*2.5,0,Math.PI*2);ctx.fill();
    ctx.restore();return;
  }
  const t=Date.now(),pct=z.hp/z.bd.hp;
  // 보스맵 전용 그리기
  if(z.bossMapId){drawBossMapBoss(z,t,pct);return;}
  // 일반 보스
  ctx.save();ctx.translate(z.x,z.y);ctx.rotate(z.angle);
  const aura=.35+.25*Math.sin(t/300);ctx.beginPath();ctx.arc(0,0,z.r+12,0,Math.PI*2);
  ctx.fillStyle=z.bd.col+(Math.floor(aura*99).toString(16).padStart(2,'0'));ctx.fill();
  const spikes=z.bd.name==='호두마루'?12:8;
  for(let i=0;i<spikes;i++){const a=i/spikes*Math.PI*2+(t/600),inn=z.r,out=z.r+14+Math.sin(t/200+i)*3;ctx.beginPath();ctx.moveTo(Math.cos(a-.15)*inn,Math.sin(a-.15)*inn);ctx.lineTo(Math.cos(a)*out,Math.sin(a)*out);ctx.lineTo(Math.cos(a+.15)*inn,Math.sin(a+.15)*inn);ctx.fillStyle=z.bd.ol;ctx.fill();}
  ctx.beginPath();ctx.arc(0,0,z.r,0,Math.PI*2);
  if(z.bd.name==='호두마루'){const grd=ctx.createRadialGradient(0,0,0,0,0,z.r);grd.addColorStop(0,'#7c3aed');grd.addColorStop(.5,'#1f2937');grd.addColorStop(1,'#000');ctx.fillStyle=grd;}else ctx.fillStyle=z.bd.col;
  ctx.fill();ctx.strokeStyle=z.bd.ol;ctx.lineWidth=3;ctx.stroke();
  ctx.font=`${Math.floor(z.r*.65)}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(z.bd.icon,0,0);ctx.textBaseline='alphabetic';
  if(z.bd.name==='호두마루'){ctx.strokeStyle='rgba(147,51,234,.6)';ctx.lineWidth=2;for(let i=0;i<3;i++){const r2=z.r+18+i*10;ctx.beginPath();ctx.arc(0,0,r2,t/800+i,t/800+i+Math.PI*1.5);ctx.stroke();}}
  ctx.restore();
  ctx.fillStyle='#fff';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.shadowColor=z.bd.col;ctx.shadowBlur=10;ctx.fillText(z.bd.name,z.x,z.y-z.r-9);ctx.shadowBlur=0;
  if(P&&(P._visionLv||0)>=4){ctx.fillStyle='#fbbf24';ctx.font='10px sans-serif';ctx.fillText(`HP ${Math.ceil(z.hp)}/${z.bd.hp}`,z.x,z.y-z.r-22);}
  const bw=z.r*2+6,bh=5;ctx.fillStyle='rgba(0,0,0,.4)';ctx.fillRect(z.x-bw/2,z.y-z.r-22,bw,bh);ctx.fillStyle=pct>.5?'#ef4444':pct>.25?'#dc2626':'#7f1d1d';ctx.fillRect(z.x-bw/2,z.y-z.r-22,bw*pct,bh);
}

function drawBossMapBoss(z,t,pct){
  if(z&&z.bd&&z.bd.id&&z.bd.id.startsWith('dream_')){drawDreamBoss(z,t);return;}
  const id=z.bossMapId;
  const cx=z.x,cy=z.y,r=z.r;
  ctx.save();ctx.translate(cx,cy);

  if(id==='sun'){
    // 태양: 광선 + 원형
    for(let i=0;i<16;i++){const a=i/16*Math.PI*2+t/800;ctx.strokeStyle=`rgba(251,191,36,${.3+.1*Math.sin(t/200+i)})`;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);ctx.lineTo(Math.cos(a)*(r+25),Math.sin(a)*(r+25));ctx.stroke();}
    const g=ctx.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,'#fffbeb');g.addColorStop(.5,'#fbbf24');g.addColorStop(1,'#dc2626');
    ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#f59e0b';ctx.lineWidth=3;ctx.stroke();
    ctx.fillStyle='rgba(0,0,0,.8)';ctx.beginPath();ctx.arc(-20,-8,10,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(20,-8,10,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-20,-8,4,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(20,-8,4,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(220,38,38,.6)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,15,18,.15,Math.PI-.15);ctx.stroke();
  } else if(id==='machine'){
    // 기계: 회전 사각형 + 기어
    ctx.rotate(t/2000);ctx.strokeStyle='#60a5fa';ctx.lineWidth=3;ctx.strokeRect(-r,-r,r*2,r*2);
    ctx.rotate(-t/1000);ctx.strokeStyle='#3b82f6';ctx.lineWidth=2;ctx.strokeRect(-r*.7,-r*.7,r*1.4,r*1.4);
    ctx.rotate(t/2000);
    ctx.beginPath();ctx.arc(0,0,r*.6,0,Math.PI*2);ctx.fillStyle='#1e3a5f';ctx.fill();ctx.strokeStyle='#60a5fa';ctx.lineWidth=3;ctx.stroke();
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2;ctx.fillStyle='#3b82f6';ctx.beginPath();ctx.arc(Math.cos(a)*r*.45,Math.sin(a)*r*.45,7,0,Math.PI*2);ctx.fill();}
    ctx.fillStyle='#93c5fd';ctx.font='bold 20px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('⚙️',0,0);
  } else if(id==='bacteria'){
    // 세포: 불규칙한 원형 + 세포막
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2+t/1000;const br=r*.4+Math.sin(t/300+i)*r*.15;ctx.beginPath();ctx.arc(Math.cos(a)*r*.5,Math.sin(a)*r*.5,br,0,Math.PI*2);ctx.fillStyle=`rgba(74,222,128,${.15+.05*Math.sin(t/200+i)})`;ctx.fill();}
    ctx.beginPath();
    for(let i=0;i<20;i++){const a=i/20*Math.PI*2;const rr=r+Math.sin(t/200+i*2)*8;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}
    ctx.closePath();ctx.fillStyle='#15803d';ctx.fill();ctx.strokeStyle='#4ade80';ctx.lineWidth=3;ctx.stroke();
    ctx.fillStyle='#bbf7d0';ctx.font='bold 22px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🦠',0,0);
  } else if(id==='clock'){
    // 시계: 시계 원판 + 시침 분침
    ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fillStyle='#1e0a3c';ctx.fill();ctx.strokeStyle='#7c3aed';ctx.lineWidth=4;ctx.stroke();
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2-Math.PI/2;ctx.fillStyle='#c4b5fd';ctx.beginPath();ctx.arc(Math.cos(a)*r*.78,Math.sin(a)*r*.78,4,0,Math.PI*2);ctx.fill();}
    const handA=t/800;ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.lineCap='round';
    ctx.save();ctx.rotate(handA);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-r*.65);ctx.stroke();ctx.restore();
    ctx.strokeStyle='#c4b5fd';ctx.lineWidth=2;ctx.save();ctx.rotate(handA*.08);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-r*.45);ctx.stroke();ctx.restore();
    ctx.fillStyle='#fbbf24';ctx.beginPath();ctx.arc(0,0,6,0,Math.PI*2);ctx.fill();
  } else if(id==='skeleton'){
    // 해골: 해골 모양
    ctx.beginPath();ctx.arc(0,-r*.15,r*.65,0,Math.PI*2);ctx.fillStyle='#d1d5db';ctx.fill();ctx.strokeStyle='#6b7280';ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle='#111827';ctx.beginPath();ctx.arc(-r*.22,-r*.22,r*.18,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(r*.22,-r*.22,r*.18,0,Math.PI*2);ctx.fill();
    // 코
    ctx.fillStyle='#374151';ctx.beginPath();ctx.arc(0,-r*.05,r*.06,0,Math.PI*2);ctx.fill();
    // 이빨
    ctx.fillStyle='#d1d5db';for(let i=-2;i<=2;i++)ctx.fillRect(i*r*.12-r*.05,r*.2,r*.09,r*.15);
    ctx.strokeStyle='#6b7280';ctx.lineWidth=1;for(let i=-2;i<=2;i++)ctx.strokeRect(i*r*.12-r*.05,r*.2,r*.09,r*.15);
    // 떠다니는 뼈 파편
    for(let i=0;i<4;i++){const a=i/4*Math.PI*2+t/600;ctx.fillStyle='rgba(209,213,219,0.5)';ctx.fillRect(Math.cos(a)*(r+15)-4,Math.sin(a)*(r+15)-2,8,4);}
  } else if(id==='reanimation'){
    // 리애니메이션: 피처럼 빨간 원형 + 파동
    const pulse=.8+.2*Math.sin(t/200);
    ctx.beginPath();ctx.arc(0,0,r*pulse+8,0,Math.PI*2);ctx.fillStyle=`rgba(239,68,68,${.15+.05*Math.sin(t/150)})`;ctx.fill();
    ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);
    const rg=ctx.createRadialGradient(0,0,0,0,0,r);rg.addColorStop(0,'#ef4444');rg.addColorStop(.6,'#7f1d1d');rg.addColorStop(1,'#1a0000');
    ctx.fillStyle=rg;ctx.fill();ctx.strokeStyle='#fca5a5';ctx.lineWidth=3;ctx.stroke();
    // 해골 눈
    ctx.fillStyle='#fca5a5';ctx.beginPath();ctx.arc(-r*.25,-r*.1,r*.12,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(r*.25,-r*.1,r*.12,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(0,0,0,.8)';ctx.beginPath();ctx.arc(-r*.25,-r*.1,r*.07,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(r*.25,-r*.1,r*.07,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='bold 20px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('☠️',0,r*.2);
  } else if(id==='kraken'){
    // 크라켄: 촉수 + 원형 몸체
    for(let i=0;i<8;i++){
      const a=i/8*Math.PI*2+t/1200;const len=r+30+Math.sin(t/400+i)*15;
      ctx.strokeStyle=`rgba(34,211,238,${.4+.1*Math.sin(t/300+i)})`;ctx.lineWidth=8+Math.sin(t/200+i)*3;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.6,Math.sin(a)*r*.6);
      const mx=Math.cos(a+.4)*len,my=Math.sin(a+.4)*len;
      ctx.quadraticCurveTo(Math.cos(a)*len*.6,Math.sin(a)*len*.6,mx,my);ctx.stroke();
    }
    ctx.beginPath();ctx.arc(0,0,r*.6,0,Math.PI*2);ctx.fillStyle='#0c4a6e';ctx.fill();ctx.strokeStyle='#22d3ee';ctx.lineWidth=3;ctx.stroke();
    ctx.fillStyle='#7dd3fc';ctx.beginPath();ctx.arc(-r*.2,-r*.1,r*.14,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(r*.2,-r*.1,r*.14,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(0,0,0,.8)';ctx.beginPath();ctx.arc(-r*.2,-r*.1,r*.08,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(r*.2,-r*.1,r*.08,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#22d3ee';ctx.font='bold 18px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🐙',0,r*.2);
  } else if(id==='symphony'){
    // 심포니: 무지개 + 음표
    for(let i=0;i<20;i++){const a=i/20*Math.PI*2+t/1000;const rr=r*.4+i*r*.025;ctx.strokeStyle=`hsl(${i*18+t/10},80%,65%)`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,rr,a,a+Math.PI*.7);ctx.stroke();}
    ctx.beginPath();ctx.arc(0,0,r*.5,0,Math.PI*2);
    const sg=ctx.createRadialGradient(0,0,0,0,0,r*.5);sg.addColorStop(0,'#fff');sg.addColorStop(.5,'#fbbf24');sg.addColorStop(1,`hsl(${t/5%360},80%,50%)`);ctx.fillStyle=sg;ctx.fill();
    ctx.strokeStyle=`hsl(${t/3%360},90%,60%)`;ctx.lineWidth=3;ctx.stroke();
    ctx.fillStyle='rgba(0,0,0,.6)';ctx.font='bold 24px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🎵',0,0);
    // 바깥 오라
    ctx.beginPath();ctx.arc(0,0,r+Math.sin(t/200)*5,0,Math.PI*2);ctx.strokeStyle=`hsla(${t/3%360},90%,60%,.4)`;ctx.lineWidth=8;ctx.stroke();
  } else if(id==='volcano'){
    // 화산: 균열 몸체 + 용암 아지랑이
    for(let i=0;i<10;i++){const a=i/10*Math.PI*2+t/900;const rr=r+8+Math.sin(t/200+i)*6;ctx.strokeStyle=`rgba(249,115,22,${.3+.1*Math.sin(t/150+i)})`;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.6,Math.sin(a)*r*.6);ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);ctx.stroke();}
    const vg=ctx.createRadialGradient(0,0,0,0,0,r);vg.addColorStop(0,'#fed7aa');vg.addColorStop(.5,'#f97316');vg.addColorStop(1,'#7c2d12');
    ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fillStyle=vg;ctx.fill();ctx.strokeStyle='#ea580c';ctx.lineWidth=3;ctx.stroke();
    ctx.fillStyle='#450a0a';ctx.beginPath();ctx.arc(-16,-6,9,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(16,-6,9,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fde047';ctx.beginPath();ctx.arc(-16,-6,4,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(16,-6,4,0,Math.PI*2);ctx.fill();
  } else if(id==='frost'){
    // 서리 여제: 얼음 왕관 + 결정체
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2;ctx.strokeStyle='rgba(224,242,254,.5)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.7,Math.sin(a)*r*.7);ctx.lineTo(Math.cos(a)*(r+20),Math.sin(a)*(r+20));ctx.stroke();}
    const fg=ctx.createRadialGradient(0,0,0,0,0,r);fg.addColorStop(0,'#f0f9ff');fg.addColorStop(.5,'#7dd3fc');fg.addColorStop(1,'#0369a1');
    ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fillStyle=fg;ctx.fill();ctx.strokeStyle='#38bdf8';ctx.lineWidth=3;ctx.stroke();
    ctx.fillStyle='#0c4a6e';ctx.beginPath();ctx.arc(-16,-6,8,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(16,-6,8,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-16,-6,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(16,-6,3,0,Math.PI*2);ctx.fill();
  } else if(id==='void'){
    // 보이드 리퍼: 공허의 소용돌이 + 균열
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2+t/700;const rr=r+15+Math.sin(t/300+i)*8;ctx.strokeStyle=`rgba(124,58,237,${.35+.1*Math.sin(t/200+i)})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,rr,a,a+Math.PI*.6);ctx.stroke();}
    const vg2=ctx.createRadialGradient(0,0,0,0,0,r);vg2.addColorStop(0,'#c4b5fd');vg2.addColorStop(.5,'#7c3aed');vg2.addColorStop(1,'#1e1b4b');
    ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fillStyle=vg2;ctx.fill();ctx.strokeStyle='#a78bfa';ctx.lineWidth=3;ctx.stroke();
    ctx.fillStyle='#000';ctx.beginPath();ctx.arc(0,0,r*.35,0,Math.PI*2);ctx.fill();
  }

  ctx.restore();

  // 이름 + HP바
  ctx.fillStyle='#fff';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
  ctx.shadowColor=z.bd.col;ctx.shadowBlur=12;ctx.fillText(z.bd.name,cx,cy-r-12);ctx.shadowBlur=0;
  if(z.bossMapId){
    // 화려한 오라 링
    ctx.beginPath();ctx.arc(cx,cy,r+18+Math.sin(t/300)*4,0,Math.PI*2);ctx.strokeStyle=(z.bd.col||'#fff').startsWith('#')?z.bd.col+'55':'rgba(200,200,200,0.33)';ctx.lineWidth=5;ctx.stroke();
  }
  const bw=z.r*2+20,bh=6;
  ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(cx-bw/2,cy-r-28,bw,bh);
  ctx.fillStyle=pct>.5?'#22c55e':pct>.25?'#f59e0b':'#ef4444';ctx.fillRect(cx-bw/2,cy-r-28,bw*pct,bh);
  ctx.fillStyle='rgba(255,255,255,.7)';ctx.font='9px sans-serif';ctx.textAlign='center';
  ctx.fillText(Math.ceil(z.hp)+'/'+z.bd.hp,cx,cy-r-30);
}

// ── HUD ──
function setMsg(t){const el=document.getElementById('hmsg');if(el)el.textContent=t;}
function updHUD(){
  if(!P)return;
  document.getElementById('hw').textContent=`🌊 웨이브 ${wave}`;
  const hp=Math.ceil(P.hp),hel=document.getElementById('hhp');
  hel.textContent=`❤️ ${hp}/${P.maxHp}`;hel.style.color=hp/P.maxHp>.5?'#4ade80':hp/P.maxHp>.25?'#fb923c':'#ef4444';
  document.getElementById('hsc').textContent=`⭐ ${score}`;
  document.getElementById('ham').textContent=P.ws.knife?`${P.ws.icon}∞`:P.reloading?'🔄...':`${P.ws.icon}${P.ammo}/${P.maxAmmo}`;
  document.getElementById('hkl').textContent=`💀 ${kills}`;
  document.getElementById('hco').textContent=`🪙 ${coins}`;
  document.getElementById('hen').textContent=`⚡ ${energy}`;
}

// ── 게임 루프 ──
function stopGame(){
  running=false;paused=false;activeBossMap=null;bossMapData=null;
  clearGameTimers();
  isDreamMode=false;
  stopDreamBGM();
  const gc3=document.getElementById('gameCanvas');if(gc3)gc3.style.filter='';
  if(rafId){cancelAnimationFrame(rafId);rafId=null;}
  document.getElementById('gameCanvas').style.display='none';
  document.getElementById('gameUI').style.display='none';
  document.getElementById('bossBar').style.display='none';
  document.getElementById('pauseBtn').style.display='none';
  document.getElementById('waveSpeedBtn').style.display='none';
  document.getElementById('fireModeBtn').style.display='none';
  document.getElementById('semiFireIndicator').style.display='none';
  document.getElementById('skillBar').style.display='none';
  document.getElementById('pauseMenu').style.display='none';
  document.getElementById('clearScreen').style.display='none';
  if(typeof hideMobileControls==='function')hideMobileControls();
}
function clearToLobby(){
  window._bossMapClearing=false;
  const wasDream = selMap && selMap.dream;
  document.getElementById('clearScreen').style.display='none';
  stopGame();
  if(wasDream){
    isDreamMode=true;
    enterDreamworld();
  } else {
    if(bgmUnlocked)startBGM();go('sLobby');
  }
}
function stopLoop(){running=false;if(rafId){cancelAnimationFrame(rafId);rafId=null;}}
function startLoop(){running=true;rafId=requestAnimationFrame(loop);}
function loop(){
  if(!running){
    // 게임오버/클리어 화면을 위해 마지막 draw 호출
    if(window._needLastDraw){window._needLastDraw=false;draw();}
    return;
  }
  update();draw();rafId=requestAnimationFrame(loop);
}

function hideAllScreens(){
  SCREENS.forEach(s=>{const el=document.getElementById(s);if(el){el.classList.remove('on');el.style.display='';}});
}

function startGame(){
  stopBGM();
  applySavedScreenMode();
  hideAllScreens();
  document.getElementById('gameCanvas').style.display='block';
  document.getElementById('gameUI').style.display='block';
  document.getElementById('pauseBtn').style.display='block';
  document.getElementById('waveSpeedBtn').style.display='block';
  document.getElementById('fireModeBtn').style.display='block';
  document.getElementById('skillBar').style.display='flex';
  if(typeof showMobileControls==='function')showMobileControls();
  skillCooldowns={E:0,Q:0};
  turrets=[];timeFreezeTimer=0;overclockTimer=0;focusNextShot=false;hpSnapshot=0;
  initGame();startLoop();
  updateSkillUI();
}

// ── 입력 ──
gC.addEventListener('mousemove',e=>{
  const ox=VW()>=MW?(VW()-MW)/2:-camX;
  mx=e.clientX;my=e.clientY;
  mxW=e.clientX-ox;myW=e.clientY+camY;
});
gC.addEventListener('mousedown',e=>{
  if(e.button!==0)return;
  if(!running&&gC.style.display==='block'){go('sLobby');return;}
  if(!P)return;
  if(fireMode==='semi'){P._semiOn=!P._semiOn;updSemiIndicator();return;}
  if(fireMode==='auto')return;
  P._mdown=true;
  if(!P.ws.auto)fireWep();
});
gC.addEventListener('mouseup',()=>{if(P)P._mdown=false;});
gC.addEventListener('contextmenu',e=>{e.preventDefault();if(running&&P&&!P.reloading&&!P.ws.knife)startRel();});
document.addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();keys[k]=true;
  if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();
  if(k==='r'&&running&&P&&!P.reloading&&!P.ws.knife)startRel();
  if(k==='e'&&running&&!paused)useSkill('E');
  if(k==='q'&&running&&!paused)useSkill('Q');
  if(['1','2','3'].includes(k)&&running&&!paused){
    const idx=parseInt(k,10)-1;
    const itemId=equippedItems[idx];
    if(itemId)useItem(itemId);
  }
  if(k==='escape'&&running){if(paused)resumeGame();else togglePause();}
  if(e.key==='Enter'&&document.getElementById('codeModal').classList.contains('on'))submitCode();
  if(e.key==='Escape'&&document.getElementById('codeModal').classList.contains('on'))closeCode();
});
document.addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;});

// ── 코드 시스템 ──
const CODES={
  YULJIN222:{coins:10000,energy:10000},
  CHRISTMAS222:{coins:100000,energy:0},
  'DREAM IS TRUE':{coins:10000000,energy:100000000,dev:true},
  'YULJIN@@@!':{coins:0,energy:0,dev:true,unlockAll:true},
  '나는 개발자다 으하하':{coins:0,energy:0,dev:true,unlockAllFull:true},
  EHDMS:{coins:0,energy:0,dev:true,infinite:true},
  BLACKFIREBACKFIRE:{coins:0,energy:0,dev:true,devMode:true}
};
function openSettings(){document.getElementById('settingsModal').style.display='flex';updOrientUI();}
function closeSettings(){document.getElementById('settingsModal').style.display='none';}

// ── 화면 방향(세로/가로) 설정 ──
function getScreenMode(){return localStorage.getItem('hd_screenMode')||'portrait';}
function updOrientUI(){
  const row=document.getElementById('orientSettingRow');
  if(!row)return;
  row.style.display=(typeof isMobileTouch!=='undefined'&&isMobileTouch)?'flex':'none';
  const mode=getScreenMode();
  const pb=document.getElementById('orientPortraitBtn'),lb=document.getElementById('orientLandscapeBtn');
  if(pb)pb.classList.toggle('sel',mode==='portrait');
  if(lb)lb.classList.toggle('sel',mode==='landscape');
}
async function requestLandscapeLock(silent){
  try{
    if(document.documentElement.requestFullscreen&&!document.fullscreenElement)await document.documentElement.requestFullscreen();
    if(screen.orientation&&screen.orientation.lock)await screen.orientation.lock('landscape');
    return true;
  }catch(e){
    if(!silent)alert('📱 이 기기/브라우저는 자동 가로 전환을 지원하지 않아요. 기기를 직접 가로로 돌려서 플레이해주세요!');
    return false;
  }
}
function setScreenMode(mode){
  localStorage.setItem('hd_screenMode',mode);
  updOrientUI();
  if(mode==='landscape'){
    requestLandscapeLock(false);
  } else {
    try{if(screen.orientation&&screen.orientation.unlock)screen.orientation.unlock();}catch(e){}
    if(document.fullscreenElement){document.exitFullscreen().catch(()=>{});}
  }
}
function applySavedScreenMode(){
  if(getScreenMode()==='landscape')requestLandscapeLock(true);
}

// ── 발사 모드 (게임 화면 상단 버튼): manual(수동) / semi(반자동) / auto(자동) ──
let fireMode='manual';
function cycleFireMode(){
  fireMode=fireMode==='manual'?'semi':fireMode==='semi'?'auto':'manual';
  localStorage.setItem('hd_fireMode',fireMode);
  if(P)P._semiOn=false;
  updFireModeBtn();
  updSemiIndicator();
}
function updFireModeBtn(){
  const btn=document.getElementById('fireModeBtn');
  if(!btn)return;
  const label=fireMode==='manual'?'🖱️ 수동':fireMode==='semi'?'🔁 반자동':'🔫 자동';
  btn.textContent=label;
  btn.classList.toggle('on',fireMode!=='manual');
}
function updSemiIndicator(){
  const el=document.getElementById('semiFireIndicator');
  if(!el)return;
  if(fireMode!=='semi'){el.style.display='none';return;}
  el.style.display='block';
  const on=!!(P&&P._semiOn);
  el.textContent=on?'🔥 발사중':'⏸ 대기';
  el.classList.toggle('on',on);
}
function confirmReset(){document.getElementById('settingsModal').style.display='none';document.getElementById('resetConfirmModal').style.display='flex';}
function cancelReset(){document.getElementById('resetConfirmModal').style.display='none';}
function doResetKeepEnchant(){
  const savedEnchants=localStorage.getItem('hd_enchants');
  try{localStorage.clear();}catch(e){}
  if(savedEnchants)localStorage.setItem('hd_enchants',savedEnchants);
  coins=0;energy=0;shopLv={};pUpgLv={};owned={pistol:true,shotgun:true,knife:true};
  eqArmor='';eqWepId='pistol';arLv={};wepLv={};ownedJobs={};equippedJob='';
  enchants=lJ('hd_enchants',{});
  potionInv={};potionBuff=null;pendingRolls=[];
  saveAll();saveJobData();savePotionState();updRes();
  document.getElementById('resetConfirmModal').style.display='none';
  alert('✅ 초기화 완료! (인챈트는 유지, 물약은 초기화됩니다)');
}
function doResetFull(){
  try{localStorage.clear();}catch(e){}
  coins=0;energy=0;shopLv={};pUpgLv={};owned={pistol:true,shotgun:true,knife:true};
  eqArmor='';eqWepId='pistol';arLv={};wepLv={};ownedJobs={};equippedJob='';
  enchants={};
  potionInv={};potionBuff=null;pendingRolls=[];
  saveAll();saveJobData();saveEnchants();savePotionState();updRes();
  document.getElementById('resetConfirmModal').style.display='none';
  alert('✅ 완전 초기화 완료! (인챈트+물약 포함 모든 데이터 삭제)');
}
function openCode(){
  document.getElementById('codeModal').classList.add('on');
  document.getElementById('codeInput').value='';
  document.getElementById('codeMsg').textContent='';
  setTimeout(()=>document.getElementById('codeInput').focus(),100);
}
function closeCode(){document.getElementById('codeModal').classList.remove('on');}
function submitCode(){
  const rawInput=document.getElementById('codeInput').value.trim();
  const raw=rawInput.toUpperCase();
  const msgEl=document.getElementById('codeMsg');
  if(!raw){msgEl.style.color='#ef4444';msgEl.textContent='코드를 입력해주세요.';return;}
  // 코드 키 검색 (대소문자 무시, 스페이스 포함)
  const codeKey=Object.keys(CODES).find(k=>k.toUpperCase()===raw);
  const code=codeKey?CODES[codeKey]:null;
  if(!code){msgEl.style.color='#ef4444';msgEl.textContent='❌ 유효하지 않은 코드입니다.';return;}
  const usedCodes=lJ('hd_used_codes',{});
  if(usedCodes[raw]&&!code.dev){msgEl.style.color='#f59e0b';msgEl.textContent='⚠️ 이미 사용된 코드입니다.';return;}
  coins+=(code.coins||0);energy+=(code.energy||0);
  if(!code.dev){usedCodes[raw]=true;sv('hd_used_codes',usedCodes);}
  saveAll();updRes();
  msgEl.style.color='#4ade80';
  // devMode: 개발자 모드 - 돈+직업+아이템+업적 모두 완전 언락
  if(code.devMode){
    sv('hd_devmode',true);
    if(typeof devModeUnlocked!=='undefined')devModeUnlocked=true;
    if(typeof renderEventGameScreen==='function')renderEventGameScreen();
    coins=999999999999;energy=999999999999;
    Object.values(WEPS).forEach(w=>owned[w.id]=true);
    ARMORS.forEach(a=>owned['ar_'+a.id]=true);
    ITEMS.forEach(it=>ownedItems[it.id]=true);
    JOBS.forEach(j=>ownedJobs[j.id]=true);
    ACHIEVEMENTS.forEach(a=>{ if(!achData[a.id]){ achData[a.id]=true; grantAchReward(a); } });
    const spO=lJ('hd_sp_owned',{});
    Object.values(WEPS).filter(w=>w.spOnly).forEach(w=>{spO[w.id]=true;});
    ARMORS.filter(a=>a.spOnly).forEach(a=>{spO['ar_'+a.id]=true;});
    sv('hd_sp_owned',spO);
    saveAll();saveItems();saveJobData();saveAch();updRes();
    msgEl.style.color='#fbbf24';
    msgEl.textContent='🛠️[DEV MODE] 돈+직업+아이템+업적 전부 언락!';
    setTimeout(()=>closeCode(),2500);
    return;
  }
  // infinite: 무한 코인+에너지
  if(code.infinite){
    coins=999999999999;energy=999999999999;
    saveAll();updRes();
    msgEl.style.color='#fbbf24';
    msgEl.textContent='🛠️[DEV] 무한 코인+에너지 지급!';
    setTimeout(()=>closeCode(),2500);
    return;
  }
  // unlockAllFull: 모든 무기+아이템+갑옷 완전 언락
  if(code.unlockAllFull){
    Object.values(WEPS).forEach(w=>owned[w.id]=true);
    ARMORS.forEach(a=>owned['ar_'+a.id]=true);
    ITEMS.forEach(it=>ownedItems[it.id]=true);
    const spO=lJ('hd_sp_owned',{});
    Object.values(WEPS).filter(w=>w.spOnly).forEach(w=>{spO[w.id]=true;});
    ARMORS.filter(a=>a.spOnly).forEach(a=>{spO['ar_'+a.id]=true;});
    sv('hd_sp_owned',spO);
    saveAll();saveItems();updRes();
    msgEl.style.color='#fbbf24';
    msgEl.textContent='🛠️[DEV] 모든 무기+아이템+갑옷 전부 언락!';
    setTimeout(()=>closeCode(),2500);
    return;
  }
  // unlockAll: 시즌/보스 전용 무기,갑옷 전부 언락
  if(code.unlockAll){
    // 보스 클리어 전용 무기
    Object.values(WEPS).filter(w=>w.bossReward||w.spOnly).forEach(w=>owned[w.id]=true);
    // 시즌 전용 갑옷
    ARMORS.filter(a=>a.spOnly).forEach(a=>owned['ar_'+a.id]=true);
    // 영구 소유 저장
    const spO=lJ('hd_sp_owned',{});
    Object.values(WEPS).filter(w=>w.spOnly).forEach(w=>{spO[w.id]=true;});
    ARMORS.filter(a=>a.spOnly).forEach(a=>{spO['ar_'+a.id]=true;});
    sv('hd_sp_owned',spO);
    saveAll();updRes();
    msgEl.style.color='#fbbf24';
    msgEl.textContent='🛠️[DEV] 시즌/보스 전용 무기+갑옷 전부 언락!';
    setTimeout(()=>closeCode(),2500);
    return;
  }
  const devTag=code.dev?' 🛠️[DEV]':'';
  msgEl.textContent=`🎉${devTag} +${(code.coins||0).toLocaleString()}🪙 +${(code.energy||0).toLocaleString()}⚡`;
  setTimeout(()=>closeCode(),2200);
}






