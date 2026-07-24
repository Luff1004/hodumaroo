// ══════════════ 보스 데이터 ══════════════
const BOSSES={
  10:{name:'감자 왕',icon:'🥔',hp:300,r:30,col:'#a0762c',ol:'#5c4a0e',phases:[{t:.5,m:'⚡ 감자가 분노했다!'}],atk:['burst8','summon'],reward:{c:200,e:150}},
  20:{name:'오리 대왕',icon:'🦆',hp:650,r:28,col:'#f59e0b',ol:'#92400e',phases:[{t:.6,m:'🌊 날개를 펼쳤다!'},{t:.3,m:'💨 광란의 돌진!'}],atk:['burst12','charge','poisonRing'],reward:{c:380,e:270}},
  30:{name:'선인장 황제',icon:'🌵',hp:1000,r:33,col:'#16a34a',ol:'#14532d',phases:[{t:.5,m:'🌵 가시 폭발!'}],atk:['burst8','spikeField','summon'],reward:{c:550,e:430}},
  40:{name:'유령 왕',icon:'👻',hp:1400,r:31,col:'#818cf8',ol:'#4338ca',phases:[{t:.7,m:'👻 사라진다!'},{t:.3,m:'💀 차원 붕괴!'}],atk:['blink','burst8','summon'],reward:{c:750,e:580}},
  50:{name:'얼음 거인',icon:'🧊',hp:2000,r:38,col:'#7dd3fc',ol:'#0369a1',phases:[{t:.5,m:'❄️ 절대 영도!'},{t:.2,m:'🌨️ 눈보라!'}],atk:['freeze','burst12','summon'],reward:{c:1100,e:850}},
  60:{name:'독 여왕',icon:'🐍',hp:2800,r:33,col:'#84cc16',ol:'#4d7c0f',phases:[{t:.6,m:'☠️ 독이 진해진다!'},{t:.3,m:'💀 치명독 방출!'}],atk:['poisonCloud','poisonRing','burst8'],reward:{c:1500,e:1150}},
  70:{name:'뇌신',icon:'⚡',hp:3800,r:36,col:'#facc15',ol:'#a16207',phases:[{t:.5,m:'⚡ 뇌격 발동!'},{t:.25,m:'🌩️ 천둥 폭풍!'}],atk:['lightning','burst12','summon'],reward:{c:2100,e:1600}},
  80:{name:'암흑 악마',icon:'😈',hp:5200,r:40,col:'#7c3aed',ol:'#4c1d95',phases:[{t:.6,m:'😈 차원문 개방!'},{t:.4,m:'💀 분열!'},{t:.2,m:'☠️ 최후의 분노!'}],atk:['burst16','blink','summonAll'],reward:{c:2800,e:2200}},
  90:{name:'고대 용',icon:'🐉',hp:7000,r:46,col:'#dc2626',ol:'#7f1d1d',phases:[{t:.7,m:'🔥 화염 숨결!'},{t:.4,m:'🐉 날아오른다!'},{t:.2,m:'💀 최후의 불꽃!'}],atk:['fireBreath','burst16','summonAll'],reward:{c:3800,e:3000}},
  100:{name:'호두마루',icon:'🌰',hp:18000,r:54,col:'#0f172a',ol:'#7c3aed',phases:[{t:.8,m:'🌑 1페이즈: 어둠이 내린다...'},{t:.6,m:'🌊 2페이즈: 파동 공격!'},{t:.4,m:'⚡ 3페이즈: 에너지 폭발!'},{t:.2,m:'💀 4페이즈: 최후의 각성!!!'},{t:.05,m:'☠️ 절망의 불꽃 — 살아남아라!'}],atk:['burst16','burst8','summonAll','blink','poisonCloud','lightning'],reward:{c:12000,e:9000}},
  // ── 보스맵 전용 ──
  sun_boss:{id:'sun_boss',name:'THE SUN',icon:'☀️',hp:8000,r:70,col:'#fbbf24',ol:'#f59e0b',
    phases:[{t:.7,m:'🔥 2페이즈: 경계 불꽃벽!'},{t:.4,m:'☀️ 3페이즈: 맵 전체 노바!!'},{t:.1,m:'💀 SUPERNOVA'}],
    atk:['sunRay','sunWall','sunSpiral','sunOrb','sunNova','laserBeam','sunWall','summon'],reward:{c:5000,e:2000}},
  machine_boss:{id:'machine_boss',name:'THE MACHINE',icon:'⚙️',hp:12000,r:65,col:'#60a5fa',ol:'#1d4ed8',
    phases:[{t:.65,m:'⚙️ 2페이즈: 격자 지뢰!'},{t:.35,m:'💻 3페이즈: 코너 레이저!'},{t:.1,m:'💀 OVERLOAD'}],
    atk:['laserAim','machineGrid','overdrive','horiBeam','missileLock','bombDrop','vertBeam','overdrive'],reward:{c:6000,e:2500}},
  bacteria_boss:{id:'bacteria_boss',name:'BACTERIA',icon:'🦠',hp:10000,r:60,col:'#4ade80',ol:'#15803d',
    phases:[{t:.6,m:'🦠 맵 독 확산!'},{t:.3,m:'☠️ 독성 폭발!'},{t:.1,m:'💀 슈퍼 셀'}],
    atk:['splitShot','acidRain','spiderSwarm','cellDivide','poisonCloud','acidRain','spiderSwarm','bombDrop'],reward:{c:5500,e:2200}},
  clock_boss:{id:'clock_boss',name:'CLOCK',icon:'🕐',hp:11000,r:62,col:'#a78bfa',ol:'#6d28d9',
    phases:[{t:.65,m:'🕐 세로 시계 레이저!'},{t:.35,m:'⏰ 시간 가속!'},{t:.1,m:'💀 시간 붕괴'}],
    atk:['clockHand','timeLaser','timeStop','clockBurst','horiBeam','clockHand','timeLaser','bombDrop'],reward:{c:6000,e:2500}},
  skeleton_boss:{id:'skeleton_boss',name:'SKELETON',icon:'💀',hp:11500,r:60,col:'#d1d5db',ol:'#4b5563',
    phases:[{t:.6,m:'💀 뼈 폭우 + 벽 반사!'},{t:.3,m:'☠️ 해골 군단!'},{t:.1,m:'💀 최종형'}],
    atk:['boneRain','boneCross','boneArmy','gravityPull','boneRing','boneCross','boneRain','vertBeam'],reward:{c:6000,e:2500}},
  reanimation_boss:{id:'reanimation_boss',name:'REANIMATION',icon:'☠️',hp:20000,r:68,col:'#ef4444',ol:'#991b1b',
    phases:[{t:.7,m:'☠️ 파동 강화!'},{t:.5,m:'💀 전군 부활!'},{t:.3,m:'☠️ 완전 죽음의 장!!'},{t:.1,m:'💀 FINAL DEATH'}],
    atk:['deathWave','undead','waveRing','deathWave','bombDrop','undead','deathWave','waveRing','summonAll','deathWave','undead','bombDrop'],reward:{c:8000,e:3500}},
  kraken_boss:{id:'kraken_boss',name:'KRAKEN',icon:'🐙',hp:15000,r:72,col:'#22d3ee',ol:'#0891b2',
    phases:[{t:.65,m:'🐙 구역 촉수 강타!'},{t:.35,m:'🌊 가장자리 촉수!'},{t:.1,m:'💀 크라켄 분노'}],
    atk:['tentacle','tentacleGrid','deepPull','inkExplosion','homingMissile','tentacleGrid','inkExplosion'],reward:{c:8000,e:3500}},
  symphony_boss:{id:'symphony_boss',name:'FANTASTIC SYMPHONY',icon:'🎵',hp:50000,r:75,col:'#fbbf24',ol:'#d97706',
    phases:[{t:.75,m:'🎵 2악장: 격자 폭탄'},{t:.5,m:'🎶 3악장: 수평 레이저'},{t:.25,m:'🎷 4악장'},{t:.05,m:'💀 OMEGA FINALE!!!'}],
    atk:['noteBurst','crescendo','symphonyGrid','noteStorm','noteRing','omegaFinale','crescendo','symphonyGrid','noteStorm','omegaFinale'],reward:{c:30000,e:15000}},
  // ── 신규 보스맵 3종 ──
  volcano_boss:{id:'volcano_boss',name:'VOLCANO',icon:'🌋',hp:17000,r:66,col:'#f97316',ol:'#7c2d12',
    phases:[{t:.65,m:'🌋 2페이즈: 용암 폭발!'},{t:.35,m:'🔥 3페이즈: 대분화!'},{t:.1,m:'💀 마그마 폭풍'}],
    atk:['lavaPool','burst16','fireBreath','spikeField','lavaPool','burst16','fireBreath'],reward:{c:9000,e:4000}},
  frost_boss:{id:'frost_boss',name:'FROST EMPRESS',icon:'🧊',hp:19000,r:64,col:'#7dd3fc',ol:'#0369a1',
    phases:[{t:.6,m:'❄️ 2페이즈: 절대 빙결!'},{t:.3,m:'🌨️ 3페이즈: 블리자드!'},{t:.1,m:'💀 영원한 겨울'}],
    atk:['iceSpear','freeze','burst12','blink','iceSpear','freeze','burst12'],reward:{c:9500,e:4200}},
  void_boss:{id:'void_boss',name:'VOID REAPER',icon:'🌌',hp:21000,r:70,col:'#7c3aed',ol:'#1e1b4b',
    phases:[{t:.65,m:'🌌 2페이즈: 차원 균열!'},{t:.35,m:'⚫ 3페이즈: 소멸장!'},{t:.1,m:'💀 완전한 공허'}],
    atk:['voidRift','poisonCloud','lightning','summonAll','blink','voidRift','lightning'],reward:{c:10000,e:4500}},
  // ── 월드2(2) 전용 보스맵 9종: 기본 난이도가 SYMPHONY(월드1 최종보스, hp 50000)급 이상 ──
  toxic_queen_boss:{id:'toxic_queen_boss',name:'TOXIC QUEEN',icon:'🐍',hp:50000,r:68,col:'#84cc16',ol:'#3f6212',
    phases:[{t:.75,m:'🐍 2페이즈: 맹독 확산!'},{t:.5,m:'☠️ 3페이즈: 세포 폭증!'},{t:.25,m:'🧬 4페이즈: 여왕의 분노!'},{t:.1,m:'💀 여왕의 최후 발작'}],
    atk:['poisonCloud','acidRain','poisonRing','cellDivide','spiderSwarm','acidRain','poisonCloud','splitShot','cellDivide','poisonRing'],reward:{c:30000,e:15000}},
  iron_warden_boss:{id:'iron_warden_boss',name:'IRON WARDEN',icon:'⚙️',hp:58000,r:66,col:'#94a3b8',ol:'#334155',
    phases:[{t:.75,m:'⚙️ 2페이즈: 전방위 미사일!'},{t:.5,m:'🔩 3페이즈: 초과부하!'},{t:.25,m:'🛰️ 4페이즈: 전 무장 가동!'},{t:.1,m:'💀 시스템 붕괴'}],
    atk:['machineGrid','overdrive','laserAim','missileLock','horiBeam','vertBeam','overdrive','bombDrop','machineGrid','missileLock'],reward:{c:34000,e:17500}},
  plague_mother_boss:{id:'plague_mother_boss',name:'PLAGUE MOTHER',icon:'🦠',hp:66000,r:70,col:'#65a30d',ol:'#365314',
    phases:[{t:.75,m:'🦠 2페이즈: 세포 분열!'},{t:.5,m:'☠️ 3페이즈: 역병 창궐!'},{t:.25,m:'🧫 4페이즈: 대발생!'},{t:.1,m:'💀 최후의 숙주'}],
    atk:['cellDivide','acidRain','undead','deathWave','spiderSwarm','poisonCloud','undead','acidRain','cellDivide','deathWave'],reward:{c:38000,e:19500}},
  storm_reaver_boss:{id:'storm_reaver_boss',name:'STORM REAVER',icon:'⚡',hp:74000,r:68,col:'#facc15',ol:'#78350f',
    phases:[{t:.75,m:'⚡ 2페이즈: 뇌격 폭풍!'},{t:.5,m:'🌩️ 3페이즈: 중력 붕괴!'},{t:.25,m:'🌪️ 4페이즈: 초강력 폭풍!'},{t:.1,m:'💀 종말의 뇌전'}],
    atk:['lightning','burst16','gravityPull','timeLaser','lightning','burst16','deathWave','lightning','gravityPull'],reward:{c:43000,e:22000}},
  neon_specter_boss:{id:'neon_specter_boss',name:'NEON SPECTER',icon:'👾',hp:82000,r:68,col:'#ec4899',ol:'#831843',
    phases:[{t:.75,m:'👾 2페이즈: 광속 점멸!'},{t:.5,m:'🎯 3페이즈: 유도 폭격!'},{t:.25,m:'💾 4페이즈: 시스템 폭주!'},{t:.1,m:'💀 데이터 붕괴'}],
    atk:['blink','splitShot','laserBeam','homingMissile','noteBurst','blink','laserBeam','homingMissile','blink','splitShot'],reward:{c:47000,e:24500}},
  blood_colossus_boss:{id:'blood_colossus_boss',name:'BLOOD COLOSSUS',icon:'🩸',hp:90000,r:74,col:'#991b1b',ol:'#450a0a',
    phases:[{t:.75,m:'🩸 2페이즈: 뼈의 군세!'},{t:.5,m:'💥 3페이즈: 광란의 돌진!'},{t:.25,m:'🔥 4페이즈: 최후의 광기!'},{t:.1,m:'💀 최후의 포효'}],
    atk:['boneRain','boneArmy','charge','burst16','gravityPull','boneCross','charge','burst16','boneArmy','charge'],reward:{c:52000,e:27000}},
  abyss_leviathan_boss:{id:'abyss_leviathan_boss',name:'ABYSS LEVIATHAN',icon:'🐋',hp:100000,r:76,col:'#0e7490',ol:'#083344',
    phases:[{t:.75,m:'🐋 2페이즈: 촉수 격자!'},{t:.5,m:'🌊 3페이즈: 심연의 흡입!'},{t:.25,m:'🌀 4페이즈: 해구의 격노!'},{t:.1,m:'💀 절대 심해'}],
    atk:['tentacle','tentacleGrid','deepPull','inkExplosion','waveRing','tentacleGrid','deepPull','homingMissile','tentacle','deepPull'],reward:{c:58000,e:30000}},
  gravity_rend_boss:{id:'gravity_rend_boss',name:'GRAVITY REND',icon:'🕳️',hp:115000,r:74,col:'#7c3aed',ol:'#1e1b4b',
    phases:[{t:.75,m:'🕳️ 2페이즈: 중력 붕괴!'},{t:.5,m:'⏳ 3페이즈: 시간 정지!'},{t:.25,m:'🌌 4페이즈: 특이점 붕괴!'},{t:.1,m:'💀 특이점 폭주'}],
    atk:['voidRift','gravityPull','timeStop','deathWave','burst16','voidRift','gravityPull','summonAll','voidRift','timeStop'],reward:{c:66000,e:34000}},
  omega_zero_boss:{id:'omega_zero_boss',name:'OMEGA ZERO',icon:'♾️',hp:140000,r:80,col:'#f8fafc',ol:'#0f172a',
    phases:[{t:.8,m:'♾️ 1페이즈: 각성...'},{t:.6,m:'⚡ 2페이즈: 에너지 폭주!'},{t:.4,m:'🌀 3페이즈: 차원 파괴!'},{t:.2,m:'💀 4페이즈: 최종 형태!!!'},{t:.05,m:'☠️ 오메가 피날레 — 살아남아라!'}],
    atk:['omegaFinale','symphonyGrid','crescendo','noteStorm','voidRift','deathWave','burst16','summonAll','omegaFinale','crescendo'],reward:{c:80000,e:40000}},
};

// ══════════════ 지형 그리기 ══════════════
function drawTerrain(ctx,m){
  if(!m)return;
  const t=m.type;

  if(t==='city'){
    // 도시: 단순한 회색 블록 건물들
    ctx.fillStyle='#555555';
    // 세로로 긴 건물들
    [[30,0,80,600],[160,200,70,800],[280,0,90,500],[420,300,75,700],[560,0,85,650],[680,200,60,800]].forEach(([x,y,w,h])=>{
      ctx.fillRect(x,y,w,h);
      // 창문 (어두운 회색)
      ctx.fillStyle='#3a3a3a';
      for(let wy=y+30;wy<y+h-20;wy+=55){
        for(let wx=x+10;wx<x+w-10;wx+=25){
          ctx.fillRect(wx,wy,15,20);
        }
      }
      ctx.fillStyle='#555555';
    });
    // 도로 (건물 사이 공간 - 밝은 회색)
    ctx.fillStyle='#888888';
    [[140,0,20,MH],[250,0,30,MH],[380,0,40,MH],[510,0,50,MH],[650,0,30,MH]].forEach(([x,y,w,h])=>ctx.fillRect(x,y,w,h));

  } else if(t==='forest'){
    // 숲: 나무들 - 경계 안쪽(50~750)에만 배치
    const treeGroups=[
      [100,150],[220,320],[80,620],[320,520],[680,220],[640,720],
      [120,920],[500,820],[720,620],[200,1120],[580,1020],
      [90,1420],[400,1320],[690,1220],[160,1720],[540,1620],
      [300,2020],[680,1920],[110,2220],[580,2320],[700,2120],
      [210,2620],[490,2520],[720,2720],[90,2920],
    ];
    treeGroups.forEach(([tx,ty])=>{
      [[-22,0],[22,8],[0,-14]].slice(0,2).forEach(([ox,oy])=>{
        const x=Math.max(50,Math.min(750,tx+ox));
        const y=ty+oy;
        ctx.fillStyle='#5c3d1a';ctx.fillRect(x-5,y+25,10,32);
        ctx.fillStyle='#1a4a1a';ctx.beginPath();ctx.arc(x,y,26,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#206020';ctx.beginPath();ctx.arc(x-4,y-7,18,0,Math.PI*2);ctx.fill();
      });
    });

  } else if(t==='lab'){
    // 바이오 실험실: 넓은 개방형 실험실 구조
    // 외벽
    ctx.strokeStyle='rgba(30,120,200,0.4)';ctx.lineWidth=3;
    ctx.fillStyle='rgba(20,60,120,0.08)';

    // 큰 실험실 방 3개 (가로로 넓음)
    const labs=[
      [20,50,760,350],   // 상단 대형 실험실
      [20,450,350,300],  // 좌측 소형
      [430,450,350,300], // 우측 소형
      [20,800,760,380],  // 중간 대형
      [20,1230,350,300],
      [430,1230,350,300],
      [20,1580,760,380],
      [20,2010,760,380],
      [20,2440,760,380],
      [20,2870,760,100],
    ];
    labs.forEach(([x,y,w,h])=>{
      ctx.fillRect(x,y,w,h);
      ctx.strokeRect(x,y,w,h);
      // 실험 장비 (테이블)
      ctx.fillStyle='rgba(50,100,180,0.15)';
      if(w>500){
        ctx.fillRect(x+30,y+30,120,60);
        ctx.fillRect(x+w-150,y+30,120,60);
        ctx.fillRect(x+w/2-60,y+h-80,120,50);
      } else {
        ctx.fillRect(x+20,y+20,80,50);
      }
      ctx.fillStyle='rgba(20,60,120,0.08)';
    });

    // 복도 연결 (방 사이)
    ctx.fillStyle='rgba(30,80,160,0.12)';
    [[370,450,60,300],[370,1230,60,300]].forEach(([x,y,w,h])=>{ctx.fillRect(x,y,w,h);ctx.strokeRect(x,y,w,h);});

    // 빨간 경고 구역 표시
    ctx.fillStyle='rgba(220,30,30,0.08)';
    ctx.fillRect(20,800,760,380);
    ctx.strokeStyle='rgba(200,0,0,0.3)';ctx.lineWidth=2;
    ctx.strokeRect(20,800,760,380);
    ctx.fillStyle='rgba(220,50,50,0.5)';ctx.font='bold 13px sans-serif';ctx.textAlign='left';
    ctx.fillText('⚠ BIOHAZARD ZONE',30,830);

  } else if(t==='desert'){
    // 사막: 정사각형 협곡 + 관통 안되는 바위
    // 협곡 벽 (어두운 갈색)
    ctx.fillStyle='#5c3d00';
    // 바위 장애물들 (충돌 처리는 별도이지만 시각적으로)
    const rocks=[
      [120,100,80,80],[350,80,70,90],[600,120,90,75],
      [50,350,65,85],[280,300,75,80],[500,280,80,70],[720,320,70,85],
      [150,600,85,80],[400,550,70,90],[650,580,80,75],
      [80,850,70,80],[320,800,85,75],[580,820,75,85],[750,800,60,90],
      [200,1100,80,70],[450,1050,70,85],[700,1080,85,70],
      [100,1350,75,85],[380,1300,80,70],[620,1320,70,80],
      [150,1600,85,75],[430,1550,70,90],[680,1570,80,80],
      [80,1850,70,80],[350,1800,85,70],[600,1820,75,85],
      [200,2100,80,85],[480,2050,70,80],[730,2080,85,70],
      [100,2350,75,80],[400,2300,80,85],[650,2320,70,75],
      [150,2600,85,80],[430,2550,80,70],[700,2570,70,85],
      [80,2850,70,75],[380,2800,85,85],[620,2820,75,80],
    ];
    rocks.forEach(([x,y,w,h])=>{
      // 바위 그라디언트 느낌
      ctx.fillStyle='#4a3000';ctx.fillRect(x,y,w,h);
      ctx.fillStyle='#6b4700';ctx.fillRect(x+4,y+4,w-8,h-8);
      ctx.fillStyle='#7c5500';ctx.fillRect(x+8,y+8,w-16,10);
      ctx.strokeStyle='#3a2000';ctx.lineWidth=2;ctx.strokeRect(x,y,w,h);
    });
    // 모래 문양
    ctx.strokeStyle='rgba(200,150,50,0.15)';ctx.lineWidth=1;
    for(let sy=50;sy<MH;sy+=180){
      ctx.beginPath();ctx.moveTo(0,sy);ctx.lineTo(MW,sy);ctx.stroke();
    }

  } else if(t==='tower'){
    // 무한의 탑: 돌바닥 던전 + 벽면 횃불 + 중앙 층수 룬 (10층 단위로 테마가 바뀜)
    const TOWER_THEMES=[
      {bg:'#1c1730',grid:'rgba(196,181,253,0.12)',wall:'rgba(76,29,149,0.5)',flame:'#f97316',flame2:'#fde68a',rune:'rgba(167,139,250,0.35)',runeRing:'rgba(196,181,253,0.5)'},
      {bg:'#0c2230',grid:'rgba(103,232,249,0.12)',wall:'rgba(8,145,178,0.5)',flame:'#38bdf8',flame2:'#e0f2fe',rune:'rgba(56,189,248,0.35)',runeRing:'rgba(103,232,249,0.5)'},
      {bg:'#2a0e0c',grid:'rgba(248,113,113,0.12)',wall:'rgba(153,27,27,0.5)',flame:'#ef4444',flame2:'#fecaca',rune:'rgba(239,68,68,0.35)',runeRing:'rgba(248,113,113,0.5)'},
      {bg:'#100c1c',grid:'rgba(251,191,36,0.12)',wall:'rgba(120,53,15,0.5)',flame:'#fbbf24',flame2:'#fff7ed',rune:'rgba(251,191,36,0.35)',runeRing:'rgba(251,191,36,0.5)'},
    ];
    const th=TOWER_THEMES[(typeof wave!=='undefined'?Math.floor((wave-1)/10):0)%TOWER_THEMES.length];
    ctx.fillStyle=th.bg;ctx.fillRect(0,0,MW,MH);
    ctx.strokeStyle=th.grid;ctx.lineWidth=1;
    for(let gy=0;gy<MH;gy+=50){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(MW,gy);ctx.stroke();}
    for(let gx=0;gx<MW;gx+=60){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,MH);ctx.stroke();}
    ctx.strokeStyle=th.wall;ctx.lineWidth=6;
    ctx.strokeRect(6,6,MW-12,MH-12);
    for(let ty=60;ty<MH;ty+=260){
      [16,MW-16].forEach(tx=>{
        ctx.fillStyle='#5c3a1e';ctx.fillRect(tx-3,ty-6,6,20);
        ctx.fillStyle=th.flame;ctx.beginPath();ctx.ellipse(tx,ty-14,6,9,0,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=th.flame2;ctx.beginPath();ctx.ellipse(tx,ty-15,3,5,0,0,Math.PI*2);ctx.fill();
      });
    }
    if(typeof wave!=='undefined'){
      const rx=MW/2, ry=MH/2;
      ctx.save();
      const rg=ctx.createRadialGradient(rx,ry,5,rx,ry,90);
      rg.addColorStop(0,th.rune);rg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=rg;ctx.beginPath();ctx.arc(rx,ry,90,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle=th.runeRing;ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(rx,ry,70,0,Math.PI*2);ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='bold 22px sans-serif';ctx.textAlign='center';
      ctx.fillText(`${wave}층`,rx,ry+8);
      ctx.restore();
    }
  } else if(t==='space'){
    // 우주: 별 + 소행성 + 어두운 배경
    ctx.fillStyle='rgba(255,255,255,0.8)';
    // 별 (작고 많이)
    for(let i=0;i<200;i++){
      const sx=(i*173+37)%MW, sy=(i*97+53)%MH;
      const size=i%5===0?2:i%3===0?1.5:1;
      ctx.beginPath();ctx.arc(sx,sy,size,0,Math.PI*2);ctx.fill();
    }
    // 소행성 (회색 불규칙 형태)
    const asteroids=[
      [80,200,40],[250,450,35],[600,180,45],[720,600,38],
      [150,800,42],[450,700,36],[700,900,44],[50,1100,38],
      [350,1200,40],[650,1100,35],[100,1500,44],[500,1400,38],
      [750,1600,40],[200,1800,36],[600,1900,42],[80,2100,38],
      [400,2200,44],[700,2100,36],[150,2400,40],[550,2500,38],
      [750,2400,42],[100,2700,36],[450,2800,44],[700,2700,38],
    ];
    asteroids.forEach(([ax,ay,ar])=>{
      ctx.fillStyle='#3a3a4a';ctx.beginPath();
      // 불규칙한 소행성 모양
      for(let i=0;i<8;i++){const a=i/8*Math.PI*2;const r2=ar*(0.7+Math.sin(ax+i)*0.3);ctx.lineTo(ax+Math.cos(a)*r2,ay+Math.sin(a)*r2);}
      ctx.closePath();ctx.fill();
      ctx.strokeStyle='#5a5a6a';ctx.lineWidth=2;ctx.stroke();
      // 하이라이트
      ctx.fillStyle='#4a4a5a';ctx.beginPath();ctx.arc(ax-ar*.2,ay-ar*.2,ar*.4,0,Math.PI*2);ctx.fill();
    });
    // 성운 효과
    ctx.fillStyle='rgba(80,0,120,0.06)';ctx.fillRect(0,0,MW,MH);
    ctx.fillStyle='rgba(0,50,120,0.04)';ctx.fillRect(200,0,400,MH);

  // ══ 월드2 웨이브맵 지형 ══

  } else if(t==='ruin_metro'){
    // 붕괴한 메트로: 지하철 터널 — 아치, 기둥, 철로, 잔해
    for(let sy=0;sy<MH;sy+=400){
      // 천장·바닥 콘크리트 띠
      ctx.fillStyle='rgba(40,60,20,.25)';ctx.fillRect(0,sy,MW,28);ctx.fillRect(0,sy+372,MW,28);
      // 지지 기둥 4개
      [100,300,500,700].forEach(px=>{
        ctx.fillStyle='#2a3a18';ctx.fillRect(px-10,sy+28,20,344);
        ctx.fillStyle='#3a5020';ctx.fillRect(px-14,sy+24,28,14);ctx.fillRect(px-14,sy+362,28,14);
      });
      // 철로 (좌·우)
      ctx.fillStyle='#3a2a10';ctx.fillRect(155,sy+358,14,42);ctx.fillRect(618,sy+358,14,42);
      ctx.fillStyle='#5a4a22';ctx.fillRect(152,sy+360,20,4);ctx.fillRect(615,sy+360,20,4);
      // 잔해 더미
      [[45,sy+295,65,25],[340,sy+275,50,32],[645,sy+305,58,22]].forEach(([rx,ry,rw,rh])=>{
        ctx.fillStyle='#222e10';ctx.fillRect(rx,ry,rw,rh);
        ctx.fillStyle='#323f18';ctx.fillRect(rx+4,ry+4,rw-8,rh-8);
      });
      // 균열
      ctx.strokeStyle='rgba(90,130,40,.15)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(175,sy+50);ctx.lineTo(195,sy+130);ctx.lineTo(165,sy+210);ctx.stroke();
      ctx.beginPath();ctx.moveTo(605,sy+75);ctx.lineTo(580,sy+155);ctx.lineTo(615,sy+245);ctx.stroke();
    }
    // 바닥 타일 세로선
    ctx.strokeStyle='rgba(60,90,25,.18)';ctx.lineWidth=1;
    for(let gx=0;gx<MW;gx+=80){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,MH);ctx.stroke();}

  } else if(t==='toxic_swamp'){
    // 독소 늪지대: 독 웅덩이, 갈대, 썩은 나무그루터기
    const pools=[[120,150,70,28],[450,310,88,34],[660,185,62,25],[85,510,78,30],[555,490,72,28],
      [205,760,82,32],[710,715,64,25],[355,960,88,36],[105,1110,68,27],[610,1060,78,30],
      [255,1360,74,29],[705,1310,84,33],[155,1610,64,25],[505,1560,88,34],[725,1760,68,27],
      [105,1910,82,31],[405,2010,74,29],[655,2110,60,25],[205,2310,78,32],[555,2260,68,27],
      [355,2510,88,35],[705,2560,64,25],[155,2760,74,29],[505,2910,78,31]];
    pools.forEach(([px,py,pr,pb])=>{
      const g=ctx.createRadialGradient(px,py,0,px,py,pr);
      g.addColorStop(0,'rgba(40,90,10,.55)');g.addColorStop(1,'rgba(20,50,5,.12)');
      ctx.beginPath();ctx.ellipse(px,py,pr,pb,0,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
      ctx.strokeStyle='rgba(60,130,20,.3)';ctx.lineWidth=1.5;ctx.stroke();
    });
    // 갈대
    for(let i=0;i<90;i++){
      const rx=(i*139+17)%MW,ry=(i*83+31)%(MH-120)+60;
      ctx.strokeStyle='rgba(75,120,20,.35)';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(rx,ry+32);ctx.quadraticCurveTo(rx+(i%2?8:-8),ry+15,rx+(i%3-1)*5,ry);ctx.stroke();
      ctx.fillStyle='rgba(95,150,28,.4)';ctx.beginPath();ctx.ellipse(rx+(i%3-1)*5,ry-5,3,8,0,0,Math.PI*2);ctx.fill();
    }
    // 썩은 나무
    [[55,410],[725,620],[48,920],[735,1120],[75,1520],[710,1820],[55,2220],[730,2630]].forEach(([tx,ty])=>{
      ctx.fillStyle='#201808';ctx.beginPath();ctx.arc(tx,ty,18,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#403018';ctx.lineWidth=2;ctx.stroke();
      ctx.fillStyle='#18100a';ctx.fillRect(tx-5,ty-32,10,32);
    });
    // 독 안개 얼룩
    for(let i=0;i<35;i++){
      ctx.fillStyle=`rgba(70,140,18,${.018+.012*(i%3)})`;
      ctx.beginPath();ctx.arc((i*181)%MW,(i*97+i*53)%MH,38+i%28,0,Math.PI*2);ctx.fill();
    }

  } else if(t==='neon_ruins'){
    // 네온 폐허: 사이버도시 잔해 + 네온 불빛
    // 무너진 건물 실루엣
    [[20,0,100,500],[170,300,80,700],[300,100,90,600],[460,0,70,450],[570,200,110,800],[700,50,80,600],
     [20,900,90,600],[180,1100,80,700],[320,800,100,500],[480,900,70,550],[590,1000,100,800],[720,800,70,600],
     [20,1800,90,600],[180,1900,80,700],[320,1700,100,500],[480,1800,70,550],[590,1900,100,800],[720,1700,70,600],
     [20,2700,90,400],[180,2800,80,300],[320,2600,100,400],[480,2700,70,400],[590,2800,100,300],[720,2600,70,400]].forEach(([x,y,w,h])=>{
      ctx.fillStyle='#0e0015';ctx.fillRect(x,y,w,h);
      ctx.strokeStyle='rgba(120,0,80,.25)';ctx.lineWidth=1;ctx.strokeRect(x,y,w,h);
      for(let wy=y+40;wy<y+h-30;wy+=75){
        for(let wx=x+12;wx<x+w-12;wx+=28){
          if((wx+wy)%3!==0){ctx.fillStyle='rgba(200,30,140,.10)';ctx.fillRect(wx,wy,14,18);}
        }
      }
    });
    // 네온 사인
    const neons=[[60,280,'#ec4899'],[360,120,'#22d3ee'],[580,380,'#f472b6'],[140,620,'#a78bfa'],
      [500,560,'#ec4899'],[700,200,'#22d3ee'],[250,850,'#f472b6'],[620,820,'#a78bfa'],
      [80,1100,'#ec4899'],[420,1050,'#22d3ee'],[680,1200,'#f472b6'],[180,1400,'#a78bfa'],
      [550,1380,'#ec4899'],[730,1550,'#22d3ee'],[120,1600,'#f472b6'],[400,1750,'#a78bfa'],
      [640,1700,'#ec4899'],[200,1950,'#22d3ee'],[500,1920,'#f472b6'],[100,2100,'#a78bfa'],
      [720,2200,'#ec4899'],[300,2350,'#22d3ee'],[600,2300,'#f472b6'],[150,2500,'#a78bfa'],
      [480,2550,'#ec4899'],[700,2700,'#22d3ee'],[200,2800,'#f472b6'],[550,2850,'#a78bfa']];
    neons.forEach(([nx,ny,nc])=>{
      ctx.save();ctx.globalAlpha=0.55;ctx.strokeStyle=nc;ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(nx,ny);ctx.lineTo(nx+55+((nx*7)%45),ny);ctx.stroke();
      ctx.globalAlpha=0.25;ctx.lineWidth=8;ctx.stroke();
      ctx.restore();
    });
    // 사이버 바닥 격자
    ctx.strokeStyle='rgba(200,50,150,.05)';ctx.lineWidth=1;
    for(let gx=0;gx<MW;gx+=55){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,MH);ctx.stroke();}
    for(let gy=0;gy<MH;gy+=55){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(MW,gy);ctx.stroke();}

  } else if(t==='blood_moon'){
    // 핏빛 월식: 달빛 글로우 + 크레이터 + 피 웅덩이
    for(let sy=0;sy<MH;sy+=800){
      const g=ctx.createRadialGradient(MW/2,sy+400,20,MW/2,sy+400,340);
      g.addColorStop(0,'rgba(180,0,0,.13)');g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g;ctx.fillRect(0,sy,MW,800);
    }
    // 크레이터
    [[150,200,50],[600,350,40],[300,600,55],[700,800,42],[100,1000,48],[500,1100,52],
     [250,1350,44],[680,1500,50],[120,1700,46],[450,1900,54],[700,2050,40],
     [200,2200,52],[550,2400,48],[100,2600,44],[680,2750,50],[350,2900,46]].forEach(([cx,cy,cr])=>{
      ctx.fillStyle='rgba(60,0,0,.32)';ctx.beginPath();ctx.ellipse(cx,cy,cr,cr*.5,0,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='rgba(110,0,0,.3)';ctx.lineWidth=2;ctx.stroke();
      ctx.strokeStyle='rgba(80,10,10,.4)';ctx.lineWidth=3;
      ctx.beginPath();ctx.ellipse(cx,cy,cr+4,cr*.5+2,0,0,Math.PI*2);ctx.stroke();
    });
    // 피 웅덩이
    [[200,450,36,14],[500,250,46,17],[700,700,38,14],[80,950,42,16],[600,1200,40,15],
     [300,1500,36,14],[720,1800,44,17],[150,2100,38,15],[520,2300,42,16],[280,2700,36,14]].forEach(([bx,by,br,bry])=>{
      const bg=ctx.createRadialGradient(bx,by,0,bx,by,br);
      bg.addColorStop(0,'rgba(140,0,0,.65)');bg.addColorStop(1,'rgba(80,0,0,.12)');
      ctx.beginPath();ctx.ellipse(bx,by,br,bry,0,0,Math.PI*2);ctx.fillStyle=bg;ctx.fill();
    });
    // 균열
    ctx.strokeStyle='rgba(100,0,0,.14)';ctx.lineWidth=1;
    for(let i=0;i<22;i++){
      const cx=(i*127+43)%MW,cy=(i*89+61)%MH;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+(i%2?32:-32),cy+(i*7)%60+18);ctx.stroke();
    }

  // ══ 월드2 챌린지맵 지형 ══

  } else if(t==='quarantine_infinite'){
    // 무한 격리구역: 격리 시설 — 셀 블록, 경고 줄무늬, 바이오해저드 마크
    ctx.strokeStyle='rgba(90,140,25,.18)';ctx.lineWidth=1;
    for(let gy=0;gy<MH;gy+=55){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(MW,gy);ctx.stroke();}
    for(let gx=0;gx<MW;gx+=55){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,MH);ctx.stroke();}
    for(let sy=0;sy<MH;sy+=480){
      // 격리 셀 4칸
      [[8,sy+8,370,215],[422,sy+8,370,215],[8,sy+260,370,215],[422,sy+260,370,215]].forEach(([cx2,cy2,cw,ch])=>{
        ctx.fillStyle='rgba(110,180,25,.1)';ctx.fillRect(cx2,cy2,cw,ch);
        ctx.strokeStyle='rgba(100,180,28,.28)';ctx.lineWidth=2;ctx.strokeRect(cx2,cy2,cw,ch);
      });
      // 경고 줄무늬 (중간 띠)
      const wy=sy+234;
      for(let x=0;x<MW;x+=38){
        if(Math.floor(x/38)%2===0){ctx.fillStyle='rgba(140,200,18,.10)';ctx.fillRect(x,wy,38,18);}
      }
      // 바이오해저드 기호 ×2
      [190,590].forEach(bx=>{
        const by=wy+9;
        ctx.strokeStyle='rgba(140,210,28,.22)';ctx.lineWidth=2;
        ctx.beginPath();ctx.arc(bx,by,12,0,Math.PI*2);ctx.stroke();
        ctx.beginPath();ctx.arc(bx,by,5,0,Math.PI*2);ctx.stroke();
        [0,120,240].forEach(deg=>{
          const a=deg*Math.PI/180;
          ctx.beginPath();ctx.moveTo(bx+Math.cos(a)*5,by+Math.sin(a)*5);ctx.lineTo(bx+Math.cos(a)*12,by+Math.sin(a)*12);ctx.stroke();
        });
      });
    }

  } else if(t==='abyss_experiment'){
    // 심연의 실험체: 보라빛 심연 실험실 — 에너지 도관, 동심원 공허, 룬
    for(let i=0;i<18;i++){
      const ay=(i*233+77)%MH;
      const g=ctx.createRadialGradient(MW/2,ay,5,MW/2,ay,160+i*18);
      g.addColorStop(0,'rgba(90,35,220,.09)');g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g;ctx.fillRect(0,Math.max(0,ay-200),MW,400);
    }
    // 수직 에너지 도관
    [[80,'#7c3aed'],[285,'#5b21b6'],[505,'#4c1d95'],[685,'#7c3aed']].forEach(([ex,ec])=>{
      ctx.strokeStyle=ec+'44';ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(ex,0);ctx.lineTo(ex,MH);ctx.stroke();
      for(let ny=80;ny<MH;ny+=280){
        ctx.fillStyle=ec+'33';ctx.beginPath();ctx.arc(ex,ny,9,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle=ec+'77';ctx.lineWidth=1.5;ctx.stroke();
      }
    });
    // 룬 원 + 방사선
    for(let i=0;i<14;i++){
      const rx=(i*181+35)%(MW-100)+50,ry=(i*137+67)%(MH-100)+50;
      ctx.strokeStyle='rgba(160,110,255,.11)';ctx.lineWidth=1;
      ctx.beginPath();ctx.arc(rx,ry,22,0,Math.PI*2);ctx.stroke();
      for(let j=0;j<6;j++){const a=j/6*Math.PI*2;ctx.beginPath();ctx.moveTo(rx+Math.cos(a)*8,ry+Math.sin(a)*8);ctx.lineTo(rx+Math.cos(a)*22,ry+Math.sin(a)*22);ctx.stroke();}
    }
    // 어두운 격자
    ctx.strokeStyle='rgba(80,30,160,.09)';ctx.lineWidth=1;
    for(let gy=0;gy<MH;gy+=75){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(MW,gy);ctx.stroke();}
    for(let gx=0;gx<MW;gx+=75){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,MH);ctx.stroke();}

  } else {
    // 보스맵 - 정사각형 아레나
    drawBossArena(ctx,m);
  }
}


function drawBossArena(ctx,m){
  // 드림코어 보스맵 아레나
  if(m&&(m.type||m.id||'').startsWith('dream_')||( selMap&&selMap.dream)){
    ctx.fillStyle='#000';ctx.fillRect(0,0,MW,MH);
    // 노이즈 라인
    for(let i=0;i<6;i++){if(Math.random()>.6){ctx.fillStyle=`rgba(255,255,255,${Math.random()*.04})`;ctx.fillRect(0,Math.random()*MH,MW,1+Math.random()*3);}}
    const gc=document.getElementById('gameCanvas');
    if(gc)gc.style.filter='grayscale(100%)';
    return;
  }
  const t=m.type;
  // 보스맵: 정사각형 아레나 (800x800씩 반복)
  const sz=780;
  const colors={
    sun:'rgba(251,191,36,',machine:'rgba(59,130,246,',bacteria:'rgba(34,197,94,',
    clock:'rgba(139,92,246,',skeleton:'rgba(156,163,175,',reanimation:'rgba(239,68,68,',
    kraken:'rgba(8,145,178,',symphony:'rgba(251,191,36,',
    volcano:'rgba(249,115,22,',frost:'rgba(125,211,252,',void:'rgba(124,58,237,',
    toxic_queen:'rgba(132,204,22,',iron_warden:'rgba(148,163,184,',plague_mother:'rgba(101,163,13,',
    storm_reaver:'rgba(250,204,21,',neon_specter:'rgba(236,72,153,',blood_colossus:'rgba(153,27,27,',
    abyss_leviathan:'rgba(14,116,144,',gravity_rend:'rgba(124,58,237,',omega_zero:'rgba(248,250,252,'
  };
  const col=colors[t]||'rgba(255,255,255,';
  const fills={
    sun:'rgba(80,40,0,0.12)',machine:'rgba(0,20,60,0.15)',bacteria:'rgba(0,40,10,0.12)',
    clock:'rgba(30,0,60,0.15)',skeleton:'rgba(10,10,10,0.2)',reanimation:'rgba(60,0,0,0.18)',
    kraken:'rgba(0,30,50,0.2)',symphony:'rgba(20,0,40,0.15)',
    volcano:'rgba(80,20,0,0.15)',frost:'rgba(0,40,60,0.15)',void:'rgba(20,0,50,0.2)',
    toxic_queen:'rgba(20,40,0,0.15)',iron_warden:'rgba(10,15,25,0.18)',plague_mother:'rgba(15,35,0,0.15)',
    storm_reaver:'rgba(40,30,0,0.15)',neon_specter:'rgba(40,0,25,0.18)',blood_colossus:'rgba(40,0,0,0.2)',
    abyss_leviathan:'rgba(0,25,35,0.2)',gravity_rend:'rgba(20,0,40,0.2)',omega_zero:'rgba(20,20,25,0.22)'
  };

  for(let sec=0;sec<4;sec++){
    const sy=sec*800+10;
    const ax=10;
    // 아레나 배경
    ctx.fillStyle=fills[t]||'rgba(20,20,20,0.1)';
    ctx.fillRect(ax,sy,sz,sz);
    // 테두리 (두껍게)
    ctx.strokeStyle=col+'0.6)';ctx.lineWidth=4;
    ctx.strokeRect(ax,sy,sz,sz);
    // 내부 장식선
    ctx.strokeStyle=col+'0.15)';ctx.lineWidth=1;
    ctx.strokeRect(ax+20,sy+20,sz-40,sz-40);

    // 보스별 아레나 장식
    const cx=ax+sz/2, cy=sy+sz/2;
    if(t==='sun'){
      // 중앙 태양 문양
      for(let i=0;i<8;i++){const a=i/8*Math.PI*2;ctx.strokeStyle=col+'0.08)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*300,cy+Math.sin(a)*300);ctx.stroke();}
    } else if(t==='machine'){
      // 기계 격자
      ctx.strokeStyle=col+'0.1)';ctx.lineWidth=1;
      for(let i=ax+100;i<ax+sz;i+=100){ctx.beginPath();ctx.moveTo(i,sy);ctx.lineTo(i,sy+sz);ctx.stroke();}
      for(let j=sy+100;j<sy+sz;j+=100){ctx.beginPath();ctx.moveTo(ax,j);ctx.lineTo(ax+sz,j);ctx.stroke();}
    } else if(t==='clock'){
      // 시계 원형
      ctx.strokeStyle=col+'0.1)';ctx.lineWidth=1;
      ctx.beginPath();ctx.arc(cx,cy,280,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.arc(cx,cy,200,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.arc(cx,cy,100,0,Math.PI*2);ctx.stroke();
    } else if(t==='skeleton'){
      // X자 무늬
      ctx.strokeStyle=col+'0.08)';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(ax,sy);ctx.lineTo(ax+sz,sy+sz);ctx.stroke();
      ctx.beginPath();ctx.moveTo(ax+sz,sy);ctx.lineTo(ax,sy+sz);ctx.stroke();
    } else if(t==='reanimation'){
      // 동심원 파동
      for(let r=80;r<350;r+=80){ctx.strokeStyle=col+'0.08)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();}
    } else if(t==='kraken'){
      // 물 잔물결
      for(let r=60;r<320;r+=60){ctx.strokeStyle=col+'0.07)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();}
      ctx.fillStyle=col+'0.04)';ctx.fillRect(ax,sy,sz,sz);
    } else if(t==='symphony'){
      // 무지개 동심원
      for(let i=0;i<6;i++){ctx.strokeStyle=`hsla(${i*60},70%,60%,0.06)`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,50+i*50,0,Math.PI*2);ctx.stroke();}
    } else if(t==='volcano'){
      // 균열 무늬 + 용암 웅덩이
      ctx.strokeStyle=col+'0.1)';ctx.lineWidth=2;
      for(let i=0;i<6;i++){const a=i/6*Math.PI*2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*320,cy+Math.sin(a)*320);ctx.stroke();}
      [[cx-200,cy-150,40],[cx+180,cy+120,50],[cx-100,cy+200,35]].forEach(([px,py,pr])=>{ctx.fillStyle='rgba(249,115,22,0.1)';ctx.beginPath();ctx.arc(px,py,pr,0,Math.PI*2);ctx.fill();});
    } else if(t==='frost'){
      // 눈꽃 육각 무늬
      ctx.strokeStyle=col+'0.1)';ctx.lineWidth=1;
      for(let i=0;i<6;i++){const a=i/6*Math.PI*2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*260,cy+Math.sin(a)*260);ctx.stroke();}
      ctx.beginPath();ctx.arc(cx,cy,180,0,Math.PI*2);ctx.stroke();
    } else if(t==='void'){
      // 소용돌이 균열
      for(let r=40;r<340;r+=50){ctx.strokeStyle=col+'0.09)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*1.6);ctx.stroke();}
    }
  }
}
