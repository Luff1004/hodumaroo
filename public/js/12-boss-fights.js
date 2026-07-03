// ══════════════ 보스 시스템 (개별) ══════════════
const BOSS_MAP_DATA={
  sun:{name:'THE SUN',icon:'☀️',col:'#fbbf24',hp:500000,maxHp:500000,phase:1,t:0,stunTimer:0,orbs:[],rays:[],nova:0},
  machine:{name:'THE MACHINE',icon:'⚙️',col:'#60a5fa',hp:800000,maxHp:800000,phase:1,t:0,lasers:[],missiles:[],shield:0},
  bacteria:{name:'BACTERIA',icon:'🦠',col:'#4ade80',hp:600000,maxHp:600000,phase:1,t:0,cells:[],split:0},
  clock:{name:'CLOCK',icon:'🕐',col:'#a78bfa',hp:750000,maxHp:750000,phase:1,t:0,hands:[],slowZone:0,rewind:false},
  skeleton:{name:'SKELETON',icon:'💀',col:'#d1d5db',hp:700000,maxHp:700000,phase:1,t:0,bones:[],summon:0},
  reanimation:{name:'REANIMATION',icon:'☠️',col:'#ef4444',hp:900000,maxHp:900000,phase:1,t:0,waves:[],revive:0},
  kraken:{name:'KRAKEN',icon:'🐙',col:'#22d3ee',hp:850000,maxHp:850000,phase:1,t:0,tentacles:[],ink:0},
  symphony:{name:'FANTASTIC SYMPHONY',icon:'🎵',col:'#fbbf24',hp:9999999,maxHp:9999999,phase:1,t:0,notes:[],beam:[],burst:0,omega:false},
};
let activeBossMap=null;
let bossMapData=null;

function startBossMap(id){
  const bossKey=id+'_boss';
  const bd=BOSSES[bossKey];
  if(!bd){console.error('보스 없음:',bossKey);return;}
  // spawnBoss와 동일한 방식으로 좀비 배열에 추가
  const bz={
    x:MW/2, y:camY+VH()*.18,
    isBoss:true, bd,
    r:bd.r, hp:bd.hp, maxHp:bd.hp,
    spd:id==='kraken'?0.5:id==='symphony'?0.2:id==='machine'?0.4:0.6,
    angle:0, dead:false, dT:0,
    _aT:0, _aI:0, phT:[],
    _chargeV:null, _chargeT:0,
    bossMapId:id  // 보스맵 구분용
  };
  zoms.unshift(bz);
  activeBoss=bz;
  activeBossMap=id;
  bossMapData=bz;  // 참조 공유
  document.getElementById('bossBar').style.display='block';
  updBossBar();
  setMsg('⚠️ '+bd.icon+' '+bd.name+' 등장!');
  for(let i=0;i<40;i++)parts.push({x:bz.x,y:bz.y,vx:(Math.random()-.5)*14,vy:(Math.random()-.5)*14,l:60,ml:60,r:5,col:bd.col});
  setTimeout(()=>{if(running)setMsg('');},3000);
  perkLv={};
}

function updateBossMap(){/* 좀비 기반으로 자동 처리 */}
function doBossAtkDirect(z,ab2){
  const saved=z._aI;z._aI=0;
  const origAtk=z.bd.atk;z.bd={...z.bd,atk:[ab2]};
  doBossAtk(z);
  z.bd={...z.bd,atk:origAtk};z._aI=saved;
}

function updateSun(bd,pct){
  const cx=MW/2,cy=camY+VH()*.28;
  // 페이즈
  if(pct<.3&&bd.phase===2){bd.phase=3;document.getElementById('bPhase').textContent='💀 3페이즈: 노바!';}
  else if(pct<.6&&bd.phase===1){bd.phase=2;document.getElementById('bPhase').textContent='🔥 2페이즈!';}
  // 공전 불덩이
  const orbCnt=bd.phase===1?4:bd.phase===2?8:12;
  if(bd.t%60===0){for(let i=0;i<2;i++){const ang=Math.random()*Math.PI*2;buls.push({x:cx+Math.cos(ang)*80,y:cy+Math.sin(ang)*80,vx:Math.cos(ang+Math.PI/2)*3.5*(1+bd.phase*.4),vy:Math.sin(ang+Math.PI/2)*3.5*(1+bd.phase*.4),r:9,l:300,en:true,dmg:18,col:'#f97316'});}}
  // 광선 공격
  if(bd.t%180===0){for(let i=0;i<orbCnt;i++){const a=i/orbCnt*Math.PI*2;buls.push({x:cx,y:cy,vx:Math.cos(a)*7,vy:Math.sin(a)*7,r:7,l:150,en:true,dmg:25,col:'#fbbf24'});}}
  // 3페이즈: 노바
  if(bd.phase===3&&bd.t%240===0){setMsg('☀️ 태양 노바!');for(let i=0;i<24;i++){const a=i/24*Math.PI*2;buls.push({x:cx,y:cy,vx:Math.cos(a)*9,vy:Math.sin(a)*9,r:10,l:180,en:true,dmg:35,col:'#ff6600'});}}
  // 접촉 피해 (태양 중심)
  if(d2(P.x,P.y,cx,cy)<80**2)takeDmg(.8);
  // 파티클
  if(bd.t%8===0)parts.push({x:cx+(Math.random()-.5)*60,y:cy+(Math.random()-.5)*60,vx:(Math.random()-.5)*3,vy:-2-Math.random()*2,l:40,ml:40,r:6,col:'#f59e0b'});
  drawSun(cx,cy,bd,pct);
  checkBossMapBulHit(bd);
}

// ── MACHINE ──
function updateMachine(bd,pct){
  const cx=MW/2,cy=camY+VH()*.25;
  if(pct<.3&&bd.phase===2){bd.phase=3;document.getElementById('bPhase').textContent='💀 오버로드!';}
  else if(pct<.6&&bd.phase===1){bd.phase=2;document.getElementById('bPhase').textContent='⚙️ 2페이즈: 미사일!';}
  // 레이저 탄막
  const rate=bd.phase===1?70:bd.phase===2?50:35;
  if(bd.t%rate===0){const ang=Math.atan2(P.y-cy,P.x-cx);for(let i=-1;i<=1;i++){const a=ang+i*.12;buls.push({x:cx,y:cy,vx:Math.cos(a)*10,vy:Math.sin(a)*10,r:5,l:120,en:true,dmg:20,col:'#60a5fa'});}}
  // 회전 탄막
  if(bd.t%90===0){const base=bd.t/90*.4;for(let i=0;i<8;i++){const a=base+i/8*Math.PI*2;buls.push({x:cx,y:cy,vx:Math.cos(a)*6,vy:Math.sin(a)*6,r:6,l:160,en:true,dmg:15,col:'#3b82f6'});}}
  // 2페이즈: 미사일
  if(bd.phase>=2&&bd.t%200===0){for(let i=0;i<3;i++){const ang=Math.atan2(P.y-cy,P.x-cx)+(i-1)*.3;buls.push({x:cx,y:cy,vx:Math.cos(ang)*8,vy:Math.sin(ang)*8,r:8,l:200,en:true,dmg:30,col:'#1d4ed8'});}}
  // 3페이즈: 전방위
  if(bd.phase===3&&bd.t%60===0){for(let i=0;i<16;i++){const a=i/16*Math.PI*2+bd.t/120;buls.push({x:cx,y:cy,vx:Math.cos(a)*8,vy:Math.sin(a)*8,r:5,l:150,en:true,dmg:22,col:'#93c5fd'});}}
  if(bd.t%6===0)parts.push({x:cx+(Math.random()-.5)*40,y:cy+(Math.random()-.5)*40,vx:(Math.random()-.5)*4,vy:(Math.random()-.5)*4,l:20,ml:20,r:4,col:'#60a5fa'});
  drawMachineBody(cx,cy,bd,pct);
  checkBossMapBulHit(bd);
}

// ── BACTERIA ──
function updateBacteria(bd,pct){
  const cx=MW/2,cy=camY+VH()*.28;
  if(pct<.4&&bd.phase===1){bd.phase=2;document.getElementById('bPhase').textContent='🦠 분열!';}
  // 세포 분열 공격
  if(bd.t%100===0){const ang=Math.random()*Math.PI*2;for(let i=0;i<(bd.phase===1?3:6);i++){const a=ang+i/(bd.phase===1?3:6)*Math.PI*2;buls.push({x:cx,y:cy,vx:Math.cos(a)*5,vy:Math.sin(a)*5,r:10,l:200,en:true,dmg:14,col:'#4ade80',split:bd.phase===2});}}
  // 독 살포
  if(bd.t%50===0)effs.push({type:'cloud',x:cx+(Math.random()-.5)*200,y:cy+(Math.random()-.5)*200,l:180,ml:180,r:50,dmgMult:1,dmgT:0});
  // 잔몹 소환
  if(bd.t%200===0)spawnZType('poison');
  if(bd.t%8===0)parts.push({x:cx+(Math.random()-.5)*80,y:cy+(Math.random()-.5)*80,vx:(Math.random()-.5)*3,vy:(Math.random()-.5)*3,l:30,ml:30,r:7,col:'rgba(74,222,128,0.4)'});
  drawBacteriaBody(cx,cy,bd,pct);
  // 탄환 분열
  buls.forEach(b=>{if(b.split&&b.l<b.l-30){b.split=false;const a=Math.atan2(b.vy,b.vx);for(let i=0;i<3;i++){const sa=a+i/3*Math.PI*2;buls.push({x:b.x,y:b.y,vx:Math.cos(sa)*4,vy:Math.sin(sa)*4,r:6,l:80,en:true,dmg:8,col:'#86efac'});}}});
  checkBossMapBulHit(bd);
}

// ── CLOCK ──
function updateClock(bd,pct){
  const cx=MW/2,cy=camY+VH()*.28;
  if(pct<.3&&bd.phase===2){bd.phase=3;document.getElementById('bPhase').textContent='⏰ 시간 역전!';}
  else if(pct<.6&&bd.phase===1){bd.phase=2;document.getElementById('bPhase').textContent='🕐 2페이즈: 시계 역방향!';}
  // 시계바늘 공격
  const handAngle=bd.t/(bd.phase===1?40:bd.phase===2?25:15)*Math.PI*2;
  if(bd.t%3===0){const a=handAngle;buls.push({x:cx+Math.cos(a)*20,y:cy+Math.sin(a)*20,vx:Math.cos(a)*8,vy:Math.sin(a)*8,r:5,l:100,en:true,dmg:18,col:'#c4b5fd'});}
  // 분침 공격
  if(bd.t%6===0){const a=handAngle*.1+Math.PI/2;buls.push({x:cx+Math.cos(a)*20,y:cy+Math.sin(a)*20,vx:Math.cos(a)*6,vy:Math.sin(a)*6,r:6,l:130,en:true,dmg:22,col:'#a78bfa'});}
  // 3페이즈: 시간 폭풍
  if(bd.phase===3&&bd.t%40===0){for(let i=0;i<6;i++){const a=i/6*Math.PI*2+handAngle*.5;buls.push({x:cx,y:cy,vx:Math.cos(a)*7,vy:Math.sin(a)*7,r:6,l:120,en:true,dmg:25,col:'#7c3aed'});}}
  if(bd.t%6===0)parts.push({x:cx+(Math.random()-.5)*40,y:cy+(Math.random()-.5)*40,vx:0,vy:0,l:25,ml:25,r:4,col:'rgba(139,92,246,0.5)'});
  drawClockBody(cx,cy,bd,pct,handAngle);
  checkBossMapBulHit(bd);
}

// ── SKELETON ──
function updateSkeleton(bd,pct){
  const cx=MW/2,cy=camY+VH()*.28;
  if(pct<.3&&bd.phase===2){bd.phase=3;setMsg('💀 해골 군주 최종 형태!');}
  else if(pct<.6&&bd.phase===1){bd.phase=2;document.getElementById('bPhase').textContent='💀 2페이즈!';}
  // 뼈 파편
  if(bd.t%80===0){const cnt=bd.phase===1?6:bd.phase===2?10:16;for(let i=0;i<cnt;i++){const a=i/cnt*Math.PI*2+(bd.t/200);buls.push({x:cx,y:cy,vx:Math.cos(a)*7*(1+pct*.5),vy:Math.sin(a)*7*(1+pct*.5),r:7,l:140,en:true,dmg:20,col:'#d1d5db'});}}
  // 소환
  if(bd.t%180===0){spawnZType(bd.phase===1?'normal':bd.phase===2?'tanker':'supertank');}
  // 3페이즈: 뼈 비
  if(bd.phase===3&&bd.t%15===0){const x2=Math.random()*MW;buls.push({x:x2,y:camY-20,vx:0,vy:8,r:6,l:100,en:true,dmg:18,col:'#e5e7eb'});}
  if(bd.t%6===0)parts.push({x:cx+(Math.random()-.5)*60,y:cy+(Math.random()-.5)*60,vx:(Math.random()-.5)*4,vy:(Math.random()-.5)*4,l:22,ml:22,r:5,col:'#9ca3af'});
  drawSkeletonBody(cx,cy,bd,pct);
  checkBossMapBulHit(bd);
}

// ── REANIMATION ──
function updateReanimation(bd,pct){
  const cx=MW/2,cy=camY+VH()*.28;
  if(pct<.25&&bd.phase===2){bd.phase=3;setMsg('☠️ 죽음의 파동!');}
  else if(pct<.6&&bd.phase===1){bd.phase=2;}
  // 파동 공격
  if(bd.t%60===0){const spd=5+bd.phase;for(let i=0;i<(6+bd.phase*4);i++){const a=i/(6+bd.phase*4)*Math.PI*2;buls.push({x:cx,y:cy,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,r:8,l:160,en:true,dmg:22+bd.phase*5,col:'#ef4444'});}}
  // 좀비 대량 소환
  if(bd.t%120===0){for(let i=0;i<bd.phase+1;i++)spawnZType(['normal','runner','ghost','poison','tanker'][Math.floor(Math.random()*5)]);}
  // 부활 (죽은 좀비)
  if(bd.t%200===0&&bd.phase>=2)zoms.filter(z=>z.dead&&z.dT>10).slice(0,3).forEach(z=>{z.dead=false;z.hp=z.maxHp*.5;});
  if(bd.t%5===0)parts.push({x:cx+(Math.random()-.5)*100,y:cy+(Math.random()-.5)*100,vx:(Math.random()-.5)*3,vy:(Math.random()-.5)*3,l:35,ml:35,r:8,col:'rgba(239,68,68,0.3)'});
  drawReanimationBody(cx,cy,bd,pct);
  checkBossMapBulHit(bd);
}

// ── KRAKEN ──
function updateKraken(bd,pct){
  const cx=MW/2,cy=camY+VH()*.285;
  if(pct<.3&&bd.phase===2){bd.phase=3;setMsg('🐙 크라켄 분노!');}
  else if(pct<.6&&bd.phase===1){bd.phase=2;}
  // 촉수 공격
  const tentCnt=bd.phase===1?4:bd.phase===2?6:8;
  if(bd.t%80===0){for(let i=0;i<tentCnt;i++){const ang=i/tentCnt*Math.PI*2+bd.t/300;const tx=cx+Math.cos(ang)*120;const ty=cy+Math.sin(ang)*80;effs.push({type:'warn',x:tx,y:ty,l:40,ml:40});setTimeout(()=>{if(!running)return;zoms.push({x:tx,y:ty,type:'runner',r:11,hp:8,maxHp:8,spd:2.8,angle:0,dead:false,dT:0,_dshC:999,_dsh:false,_dvx:0,_dvy:0,_healT:0,_phT:60,_phased:false,_frz:0,wob:0});},660);}}
  // 먹물
  if(bd.t%120===0){effs.push({type:'cloud',x:P.x,y:P.y,l:160,ml:160,r:60,dmgMult:1.5,dmgT:0});}
  // 탄막
  if(bd.t%50===0){const ang=Math.atan2(P.y-cy,P.x-cx);buls.push({x:cx,y:cy,vx:Math.cos(ang)*8,vy:Math.sin(ang)*8,r:8,l:130,en:true,dmg:28,col:'#0891b2'});}
  if(bd.t%8===0)parts.push({x:cx+(Math.random()-.5)*100,y:cy+(Math.random()-.5)*80,vx:(Math.random()-.5)*3,vy:(Math.random()-.5)*3,l:30,ml:30,r:8,col:'rgba(8,145,178,0.4)'});
  drawKrakenBody(cx,cy,bd,pct);
  checkBossMapBulHit(bd);
}

// ── SYMPHONY ──
function updateSymphony(bd,pct){
  const cx=MW/2,cy=camY+VH()*.28;
  if(pct<.1&&bd.phase<4){bd.phase=4;bd.omega=true;setMsg('🎵 오메가 피날레!!!');document.getElementById('bPhase').textContent='💀 OMEGA FINALE';}
  else if(pct<.25&&bd.phase<3){bd.phase=3;setMsg('🎵 3악장!');}
  else if(pct<.5&&bd.phase<2){bd.phase=2;setMsg('🎵 2악장!');}
  // 음표 탄막 (회전)
  const noteSpd=4+bd.phase*1.5;
  if(bd.t%(35-bd.phase*6)===0){const base=bd.t*.03;for(let i=0;i<(4+bd.phase*3);i++){const a=base+i/(4+bd.phase*3)*Math.PI*2;buls.push({x:cx,y:cy,vx:Math.cos(a)*noteSpd,vy:Math.sin(a)*noteSpd,r:7,l:200,en:true,dmg:20+bd.phase*8,col:`hsl(${bd.t*2%360},80%,65%)`});}}
  // 3페이즈: 레이저 + 전방위
  if(bd.phase>=3&&bd.t%40===0){const ang=Math.atan2(P.y-cy,P.x-cx);for(let i=-2;i<=2;i++)buls.push({x:cx,y:cy,vx:Math.cos(ang+i*.08)*12,vy:Math.sin(ang+i*.08)*12,r:6,l:120,en:true,dmg:35,col:'#fbbf24'});}
  // 오메가: 화면 전체 채우기
  if(bd.omega&&bd.t%20===0){for(let i=0;i<24;i++){const a=i/24*Math.PI*2+bd.t*.05;buls.push({x:cx,y:cy,vx:Math.cos(a)*10,vy:Math.sin(a)*10,r:8,l:250,en:true,dmg:50,col:`hsl(${i*15},90%,60%)`});}}
  // 소환
  if(bd.t%100===0){for(let i=0;i<bd.phase;i++)spawnZType(['wizard','spider','ghost'][i%3]);}
  if(bd.t%4===0)parts.push({x:cx+(Math.random()-.5)*80,y:cy+(Math.random()-.5)*80,vx:(Math.random()-.5)*5,vy:(Math.random()-.5)*5,l:30,ml:30,r:6,col:`hsl(${bd.t*3%360},80%,60%)`});
  drawSymphonyBody(cx,cy,bd,pct);
  checkBossMapBulHit(bd);
}

// ── 보스 피격 체크 ──
function checkBossMapBulHit(bd){
  buls=buls.filter(b=>{
    if(b.en)return true;
    const cx=MW/2,cy=camY+VH()*.28;
    if(d2(b.x,b.y,cx,cy)<(70+b.r)**2){
      bd.hp-=(b.dmg||1)*10;
      parts.push({x:b.x,y:b.y,vx:(Math.random()-.5)*6,vy:(Math.random()-.5)*6,l:15,ml:15,r:4,col:'#fff'});
      return false;
    }
    return true;
  });
}

// ── 보스 그리기 ──
function drawSun(cx,cy,bd,pct){
  const t2=Date.now()/1000;
  ctx.save();ctx.translate(cx,cy);
  // 광선 회전
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2+t2*.5;ctx.strokeStyle=`rgba(251,191,36,${.2+.1*Math.sin(t2+i)})`;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(Math.cos(a)*60,Math.sin(a)*60);ctx.lineTo(Math.cos(a)*120,Math.sin(a)*120);ctx.stroke();}
  // 본체
  const grad=ctx.createRadialGradient(0,0,0,0,0,60);grad.addColorStop(0,'#fff7ed');grad.addColorStop(.4,'#fbbf24');grad.addColorStop(1,'#dc2626');
  ctx.beginPath();ctx.arc(0,0,60,0,Math.PI*2);ctx.fillStyle=grad;ctx.fill();
  ctx.strokeStyle='#f59e0b';ctx.lineWidth=4;ctx.stroke();
  // 눈
  ctx.fillStyle='rgba(0,0,0,0.8)';ctx.beginPath();ctx.arc(-18,-8,10,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(18,-8,10,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-18,-8,4,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(18,-8,4,0,Math.PI*2);ctx.fill();
  ctx.restore();
  ctx.fillStyle='#fbbf24';ctx.font='bold 14px sans-serif';ctx.textAlign='center';ctx.shadowColor='#f59e0b';ctx.shadowBlur=10;ctx.fillText('THE SUN',cx,cy-75);ctx.shadowBlur=0;
  drawBossHPBar(cx,cy,bd,70);
}
function drawMachineBody(cx,cy,bd,pct){
  const t2=Date.now()/1000;
  ctx.save();ctx.translate(cx,cy);ctx.rotate(t2*.3);
  ctx.strokeStyle='rgba(59,130,246,0.6)';ctx.lineWidth=3;ctx.strokeRect(-55,-55,110,110);
  ctx.strokeStyle='rgba(96,165,250,0.4)';ctx.lineWidth=2;ctx.strokeRect(-40,-40,80,80);
  ctx.restore();
  ctx.save();ctx.translate(cx,cy);
  ctx.fillStyle='#1e3a5f';ctx.beginPath();ctx.arc(0,0,55,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#60a5fa';ctx.lineWidth=3;ctx.stroke();
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2+t2;ctx.fillStyle='#3b82f6';ctx.beginPath();ctx.arc(Math.cos(a)*30,Math.sin(a)*30,8,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle='#93c5fd';ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.fillText('⚙️',0,5);
  ctx.restore();
  ctx.fillStyle='#60a5fa';ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.shadowColor='#3b82f6';ctx.shadowBlur=8;ctx.fillText('THE MACHINE',cx,cy-70);ctx.shadowBlur=0;
  drawBossHPBar(cx,cy,bd,60);
}
function drawBacteriaBody(cx,cy,bd,pct){
  const t2=Date.now()/1000;
  ctx.save();ctx.translate(cx,cy);
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2+t2*.3;const r2=45+Math.sin(t2*2+i)*10;ctx.beginPath();ctx.arc(Math.cos(a)*20,Math.sin(a)*20,r2*.4,0,Math.PI*2);ctx.fillStyle=`rgba(34,197,94,${.15+.05*Math.sin(t2+i)})`;ctx.fill();}
  ctx.beginPath();ctx.arc(0,0,45,0,Math.PI*2);
  const g=ctx.createRadialGradient(0,0,0,0,0,45);g.addColorStop(0,'#4ade80');g.addColorStop(1,'#15803d');ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#22c55e';ctx.lineWidth=3;ctx.stroke();
  ctx.fillStyle='#fff';ctx.font='18px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🦠',0,0);ctx.textBaseline='alphabetic';
  ctx.restore();
  ctx.fillStyle='#4ade80';ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.shadowColor='#22c55e';ctx.shadowBlur=8;ctx.fillText('BACTERIA',cx,cy-60);ctx.shadowBlur=0;
  drawBossHPBar(cx,cy,bd,50);
}
function drawClockBody(cx,cy,bd,pct,handAngle){
  ctx.save();ctx.translate(cx,cy);
  ctx.beginPath();ctx.arc(0,0,60,0,Math.PI*2);ctx.fillStyle='#1e0a3c';ctx.fill();ctx.strokeStyle='#7c3aed';ctx.lineWidth=4;ctx.stroke();
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2-Math.PI/2;ctx.fillStyle='#c4b5fd';ctx.beginPath();ctx.arc(Math.cos(a)*48,Math.sin(a)*48,4,0,Math.PI*2);ctx.fill();}
  ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.lineCap='round';
  ctx.save();ctx.rotate(handAngle);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-42);ctx.stroke();ctx.restore();
  ctx.strokeStyle='#c4b5fd';ctx.lineWidth=2;ctx.save();ctx.rotate(handAngle*.1);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-30);ctx.stroke();ctx.restore();
  ctx.restore();
  ctx.fillStyle='#a78bfa';ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.shadowColor='#7c3aed';ctx.shadowBlur=8;ctx.fillText('CLOCK',cx,cy-72);ctx.shadowBlur=0;
  drawBossHPBar(cx,cy,bd,65);
}
function drawSkeletonBody(cx,cy,bd,pct){
  const t2=Date.now()/1000;
  ctx.save();ctx.translate(cx,cy);ctx.rotate(Math.sin(t2*.5)*.05);
  ctx.fillStyle='#d1d5db';ctx.beginPath();ctx.arc(0,-20,35,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#6b7280';ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle='#111';ctx.beginPath();ctx.arc(-12,-22,8,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(12,-22,8,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#d1d5db';ctx.fillRect(-12,20,24,40);
  ctx.strokeStyle='#9ca3af';ctx.lineWidth=3;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(-12,20);ctx.lineTo(-40,50);ctx.stroke();
  ctx.beginPath();ctx.moveTo(12,20);ctx.lineTo(40,50);ctx.stroke();
  ctx.restore();
  ctx.fillStyle='#d1d5db';ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.shadowColor='#6b7280';ctx.shadowBlur=8;ctx.fillText('SKELETON',cx,cy-70);ctx.shadowBlur=0;
  drawBossHPBar(cx,cy,bd,60);
}
function drawReanimationBody(cx,cy,bd,pct){
  const t2=Date.now()/1000;
  ctx.save();ctx.translate(cx,cy);
  const g2=ctx.createRadialGradient(0,0,0,0,0,60);g2.addColorStop(0,'rgba(239,68,68,0.8)');g2.addColorStop(1,'rgba(127,29,29,0.2)');
  ctx.fillStyle=g2;ctx.beginPath();ctx.arc(0,0,60+Math.sin(t2*2)*8,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#7f1d1d';ctx.beginPath();ctx.arc(0,0,45,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ef4444';ctx.lineWidth=3;ctx.stroke();
  ctx.fillStyle='#ef4444';ctx.font='22px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('☠️',0,0);ctx.textBaseline='alphabetic';
  ctx.restore();
  ctx.fillStyle='#f87171';ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.shadowColor='#ef4444';ctx.shadowBlur=10;ctx.fillText('REANIMATION',cx,cy-72);ctx.shadowBlur=0;
  drawBossHPBar(cx,cy,bd,65);
}
function drawKrakenBody(cx,cy,bd,pct){
  const t2=Date.now()/1000;
  ctx.save();ctx.translate(cx,cy);
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2+t2*.4;const len=60+Math.sin(t2+i)*20;ctx.strokeStyle='rgba(8,145,178,0.5)';ctx.lineWidth=10;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(Math.cos(a)*30,Math.sin(a)*30);const mx=Math.cos(a)*len+(Math.random()-.5)*20,my=Math.sin(a)*len+(Math.random()-.5)*20;ctx.quadraticCurveTo(mx*.5,my*.5,mx,my);ctx.stroke();}
  ctx.beginPath();ctx.arc(0,0,40,0,Math.PI*2);ctx.fillStyle='#0c4a6e';ctx.fill();ctx.strokeStyle='#0891b2';ctx.lineWidth=3;ctx.stroke();
  ctx.fillStyle='#22d3ee';ctx.font='20px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🐙',0,0);ctx.textBaseline='alphabetic';
  ctx.restore();
  ctx.fillStyle='#22d3ee';ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.shadowColor='#0891b2';ctx.shadowBlur=8;ctx.fillText('KRAKEN',cx,cy-65);ctx.shadowBlur=0;
  drawBossHPBar(cx,cy,bd,55);
}
function drawSymphonyBody(cx,cy,bd,pct){
  const t2=Date.now()/1000;
  ctx.save();ctx.translate(cx,cy);
  for(let i=0;i<16;i++){const a=i/16*Math.PI*2+t2*(1+i*.05);const r2=30+i*4;ctx.strokeStyle=`hsla(${i*22+t2*60},80%,65%,0.4)`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r2,a,a+Math.PI*.8);ctx.stroke();}
  ctx.beginPath();ctx.arc(0,0,45,0,Math.PI*2);
  const sg=ctx.createRadialGradient(0,0,0,0,0,45);sg.addColorStop(0,'#fff');sg.addColorStop(.5,'#fbbf24');sg.addColorStop(1,'rgba(109,40,217,.8)');ctx.fillStyle=sg;ctx.fill();
  ctx.strokeStyle=`hsl(${t2*120%360},80%,60%)`;ctx.lineWidth=3;ctx.stroke();
  ctx.fillStyle='rgba(0,0,0,0.7)';ctx.font='20px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🎵',0,0);ctx.textBaseline='alphabetic';
  ctx.restore();
  ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.shadowBlur=12;
  const hue=t2*80%360;ctx.fillStyle=`hsl(${hue},90%,70%)`;ctx.shadowColor=`hsl(${hue},90%,50%)`;
  ctx.fillText('FANTASTIC SYMPHONY',cx,cy-65);ctx.shadowBlur=0;
  drawBossHPBar(cx,cy,bd,55);
}

function drawBossHPBar(cx,cy,bd,r){
  const maxHp=BOSS_MAP_DATA[activeBossMap]?.maxHp||1;
  const pct2=Math.max(0,bd.hp/maxHp);
  const bw=160,bh=8;
  ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(cx-bw/2,cy-r-22,bw,bh);
  ctx.fillStyle=pct2>.5?'#22c55e':pct2>.25?'#f59e0b':'#ef4444';ctx.fillRect(cx-bw/2,cy-r-22,bw*pct2,bh);
}

function bossMapClear(){
  activeBossMap=null;bossMapData=null;
  // 보스가 죽으면 onBossDie → zoms에서 처리됨
}
