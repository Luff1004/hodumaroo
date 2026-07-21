// ══════════════ 더 백룸스: 무한 절차 생성 레이캐스팅 1인칭 탐험 ══════════════
// 백룸은 "출구를 찾는 미로"가 아니라 "끝없이 반복되는 노란 방"이다.
// 청크 단위로 무한히 생성되는 공간(기둥+칸막이 배치)을 자유롭게 걸어다니며 멀리 갈수록 위험해진다.
// LEVEL 0(1레벨)에는 두 가지 갈림길이 숨어있다:
//   - 드라이버를 찾아 환풍구를 열면 → 끝없는 주차장
//   - 바닥의 구멍에 빠지면 → 수영장 → 파란 미끄럼틀 → 끝없는 도시 → (멀리 걸으면) 끝없는 갈대밭
// 그리고 분홍 문을 찾으면 완전히 다른 무한 차원 LEVEL FUN=)(생일파티룸+미로)으로 넘어간다.
// 진짜 탈출구(초록 EXIT 문)는 숨겨진 레버 2개를 모두 올려야만 세상에 나타난다.
const BR_R=0.24;            // 플레이어 충돌 반경 (셀 단위)
const BR_SPEED=0.058;       // 이동 속도 (셀/프레임)
const BR_MOUSE_SENS=0.0026;
const BR_FOV=1.15;          // 시야각(라디안) ≈ 66°
const BR_MAX_DEPTH=22;      // 레이캐스팅 최대 탐색 거리(셀)
const BR_WALL_SCALE=0.62;   // 벽 높이 축소 비율 - 낮을수록 천장이 더 높아 보임
const BR_CH=16;             // 청크 크기(셀)
const BR_GEN_RADIUS=2;      // 플레이어 주변 몇 청크까지 미리 생성할지
const BR_DEPTH_KEY='hd_brMaxDepth';
const BR_FUN_KEY='hd_brFunVisited';
let br=null;

function brBestDepth(){ return parseInt(localStorage.getItem(BR_DEPTH_KEY)||'0',10); }
function brSaveBestDepth(d){ if(d>brBestDepth())localStorage.setItem(BR_DEPTH_KEY,String(d)); }

function renderBackroomsHub(){
  const el=document.getElementById('brBestLevel');
  if(!el)return;
  const best=brBestDepth();
  const fun=localStorage.getItem(BR_FUN_KEY)==='1';
  el.textContent=(best>0?('최고 도달 거리: '+best+'m'):'아직 도달한 기록이 없다')+(fun?' · 🎉 LEVEL FUN 발견':'');
  const replayBtn=document.getElementById('brEscapeReplayBtn');
  if(replayBtn)replayBtn.style.display=(typeof achData!=='undefined'&&achData['br_realexit'])?'inline-block':'none';
}
function replayBackroomsEscapeCutscene(){
  const foundFun=localStorage.getItem(BR_FUN_KEY)==='1';
  playBackroomsEscapeCutscene(brBestDepth(),foundFun,0,0,()=>{});
}

function devEnterBackrooms(){
  startBackroomsRun();
}

function startBackroomsRun(){
  selMap={backroomsEngine:true,noWeapons:true,noJobs:true,noItems:true,noWaveSpeed:true,id:'backrooms'};
  startGame();
  requestBackroomsPointerLock();
}
function requestBackroomsPointerLock(){
  if(gC.requestPointerLock)gC.requestPointerLock();
}
document.addEventListener('mousemove',e=>{
  if(!br||!selMap||!selMap.backroomsEngine)return;
  if(document.pointerLockElement!==gC)return;
  br.angle+=(e.movementX||0)*BR_MOUSE_SENS;
});
gC.addEventListener('mousedown',()=>{
  if(selMap&&selMap.backroomsEngine&&document.pointerLockElement!==gC)requestBackroomsPointerLock();
});

// ── 시드 기반 난수 (청크를 다시 방문해도 항상 같은 모양이 나오도록) ──
function mulberry32(seed){
  return function(){
    seed|=0;seed=seed+0x6D2B79F5|0;
    let t=Math.imul(seed^seed>>>15,1|seed);
    t=t+Math.imul(t^t>>>7,61|t)^t;
    return ((t^t>>>14)>>>0)/4294967296;
  };
}
function brChunkSeed(cx,cy,salt){ return ((cx*374761393)^(cy*668265263)^salt)>>>0; }

// ── 특정 셀 주변을 완전 무작위(각도 기반) 방향/거리에 배치하고 벽을 정리한다. 모든 "숨겨진 무언가" 배치의 공통 헬퍼 ──
function brPlaceGuaranteedAt(wallsSet,ensureChunkFn,distMin,distRange){
  const ang=Math.random()*Math.PI*2;
  const dist=distMin+Math.random()*distRange;
  const gx=Math.round(Math.cos(ang)*dist), gy=Math.round(Math.sin(ang)*dist);
  ensureChunkFn(Math.floor(gx/BR_CH),Math.floor(gy/BR_CH));
  for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++)wallsSet.delete((gx+ox)+','+(gy+oy));
  return {x:gx+0.5,y:gy+0.5};
}

// ── LEVEL 0 청크 생성: 백룸 특유의 반복 기둥 + 짧은 칸막이 벽(문틈 有) ──
function brEnsureChunk(cx,cy){
  const key=cx+','+cy;
  if(br.doneChunks.has(key))return;
  br.doneChunks.add(key);
  const rnd=mulberry32(brChunkSeed(cx,cy,0x9E3779B9));
  const baseX=cx*BR_CH, baseY=cy*BR_CH;
  const spacing=3;
  const jitterX=Math.floor(rnd()*spacing), jitterY=Math.floor(rnd()*spacing);
  for(let ly=jitterY;ly<BR_CH;ly+=spacing){
    for(let lx=jitterX;lx<BR_CH;lx+=spacing){
      if(rnd()<0.7)br.walls.add((baseX+lx)+','+(baseY+ly));
    }
  }
  const partitions=1+Math.floor(rnd()*3);
  for(let p=0;p<partitions;p++){
    const horiz=rnd()<0.5;
    const len=3+Math.floor(rnd()*4);
    const gapAt=Math.floor(rnd()*len);
    const sx=Math.floor(rnd()*Math.max(1,BR_CH-len));
    const sy=Math.floor(rnd()*BR_CH);
    for(let i=0;i<len;i++){
      if(i===gapAt)continue;
      const gx=horiz?baseX+sx+i:baseX+sx;
      const gy=horiz?baseY+sy:baseY+sy+i;
      br.walls.add(gx+','+gy);
    }
  }
  if(cx===0&&cy===0){
    for(let ly=0;ly<4;ly++)for(let lx=0;lx<4;lx++)br.walls.delete((baseX+lx)+','+(baseY+ly));
  }
}
function brEnsureArea(px,py){
  const ccx=Math.floor(px/BR_CH), ccy=Math.floor(py/BR_CH);
  for(let dy=-BR_GEN_RADIUS;dy<=BR_GEN_RADIUS;dy++)
    for(let dx=-BR_GEN_RADIUS;dx<=BR_GEN_RADIUS;dx++)
      brEnsureChunk(ccx+dx,ccy+dy);
}
function brPlaceGuaranteedDoor(){ br.doors.push(brPlaceGuaranteedAt(br.walls,brEnsureChunk,28,16)); }
function brPlaceGuaranteedScrewdriver(){ br.screwdrivers.push({...brPlaceGuaranteedAt(br.walls,brEnsureChunk,10,10),taken:false}); }
function brPlaceGuaranteedVent(){ br.vents.push(brPlaceGuaranteedAt(br.walls,brEnsureChunk,22,12)); }
function brPlaceGuaranteedPit(){ br.pits.push(brPlaceGuaranteedAt(br.walls,brEnsureChunk,18,14)); }
function brPlaceGuaranteedLever(distMin,distRange){ br.levers.push({...brPlaceGuaranteedAt(br.walls,brEnsureChunk,distMin,distRange),up:false}); }

// ── LEVEL FUN 청크 생성: 미로 + 생일파티룸. 풍선/테이블 소품과 빨간 EXIT 문이 무작위로 흩어져 있다 ──
const BR_BALLOON_COLORS=['#ef4444','#3b82f6','#eab308','#22c55e','#ec4899','#a855f7','#f97316'];
const BR_FUN_PROP_CAP=320; // 무한 탐험 중 소품이 끝없이 쌓여 렉 걸리는 것을 방지
function brEnsureFunChunk(cx,cy){
  const key=cx+','+cy;
  if(br.funDoneChunks.has(key))return;
  br.funDoneChunks.add(key);
  const rnd=mulberry32(brChunkSeed(cx,cy,0x51ED270B));
  const baseX=cx*BR_CH, baseY=cy*BR_CH;
  const spacing=3;
  const jitterX=Math.floor(rnd()*spacing), jitterY=Math.floor(rnd()*spacing);
  for(let ly=jitterY;ly<BR_CH;ly+=spacing){
    for(let lx=jitterX;lx<BR_CH;lx+=spacing){
      if(rnd()<0.5)br.funWalls.add((baseX+lx)+','+(baseY+ly));
    }
  }
  const partitions=1+Math.floor(rnd()*2);
  for(let p=0;p<partitions;p++){
    const horiz=rnd()<0.5;
    const len=3+Math.floor(rnd()*4);
    const gapAt=Math.floor(rnd()*len);
    const sx=Math.floor(rnd()*Math.max(1,BR_CH-len));
    const sy=Math.floor(rnd()*BR_CH);
    for(let i=0;i<len;i++){
      if(i===gapAt)continue;
      const gx=horiz?baseX+sx+i:baseX+sx;
      const gy=horiz?baseY+sy:baseY+sy+i;
      br.funWalls.add(gx+','+gy);
    }
  }
  if(cx===0&&cy===0){
    for(let ly=0;ly<4;ly++)for(let lx=0;lx<4;lx++)br.funWalls.delete((baseX+lx)+','+(baseY+ly));
  }
  // 풍선/테이블 소품 (백룸 파티룸 특유의 분위기) - 총량 상한으로 성능 보호
  if(br.funProps.length<BR_FUN_PROP_CAP){
    const balloonCount=1+Math.floor(rnd()*3);
    for(let i=0;i<balloonCount&&br.funProps.length<BR_FUN_PROP_CAP;i++){
      const lx=Math.floor(rnd()*BR_CH), ly=Math.floor(rnd()*BR_CH);
      const gx=baseX+lx, gy=baseY+ly;
      if(!br.funWalls.has(gx+','+gy)){
        const color=BR_BALLOON_COLORS[Math.floor(rnd()*BR_BALLOON_COLORS.length)];
        br.funProps.push({x:gx+0.5,y:gy+0.5,kind:'balloon',color});
      }
    }
    if(rnd()<0.4){
      const lx=2+Math.floor(rnd()*(BR_CH-4)), ly=2+Math.floor(rnd()*(BR_CH-4));
      const gx=baseX+lx, gy=baseY+ly;
      if(!br.funWalls.has(gx+','+gy))br.funProps.push({x:gx+0.5,y:gy+0.5,kind:'table'});
    }
  }
  // 빨간 EXIT 문: 랜덤 배치
  const chunkDist=Math.hypot(cx,cy);
  if(chunkDist>=2&&br.funDoors.length<6&&rnd()<0.05){
    for(let tries=0;tries<20;tries++){
      const lx=1+Math.floor(rnd()*(BR_CH-2)), ly=1+Math.floor(rnd()*(BR_CH-2));
      const gx=baseX+lx, gy=baseY+ly;
      if(!br.funWalls.has(gx+','+gy)){ br.funDoors.push({x:gx+0.5,y:gy+0.5}); break; }
    }
  }
}
function brEnsureFunArea(px,py){
  const ccx=Math.floor(px/BR_CH), ccy=Math.floor(py/BR_CH);
  for(let dy=-BR_GEN_RADIUS;dy<=BR_GEN_RADIUS;dy++)
    for(let dx=-BR_GEN_RADIUS;dx<=BR_GEN_RADIUS;dx++)
      brEnsureFunChunk(ccx+dx,ccy+dy);
}
function brPlaceGuaranteedFunDoor(){ br.funDoors.push(brPlaceGuaranteedAt(br.funWalls,brEnsureFunChunk,20,10)); }
function brEnsureFunWorld(){
  if(br.funWalls)return;
  br.funWalls=new Set();br.funDoneChunks=new Set();br.funDoors=[];br.funProps=[];
  brEnsureFunChunk(0,0);
  brPlaceGuaranteedFunDoor();
  localStorage.setItem(BR_FUN_KEY,'1');
}

// ── 신규 레벨(주차장/수영장/도시/갈대밭) 공용 무한 청크 생성기 ──
const BR_LEVEL_THEME={
  level0:{floor:[96,80,42], ceil:[52,42,18], wallLo:[120,98,52], wallHi:[184,152,80], fog:'rgba(20,15,4,'},
  garage:{floor:[34,34,38], ceil:[16,16,18], wallLo:[42,42,48],  wallHi:[68,68,76],   fog:'rgba(4,4,6,'},
  pool:  {floor:[18,95,150],ceil:[70,130,170],wallLo:[26,80,120],wallHi:[54,140,190], fog:'rgba(3,18,30,'},
  city:  {floor:[46,46,50], ceil:[120,165,215],wallLo:[38,38,44],wallHi:[60,60,70],   fog:'rgba(8,10,16,'},
  field: {floor:[95,135,60],ceil:[150,190,235],wallLo:[80,120,55],wallHi:[110,160,80],fog:'rgba(18,26,12,'},
};
const BR_MODE_SALT={garage:0x2545F491,pool:0x27D4EB2F,city:0x165667B1,field:0x85EBCA6B};
const BR_MODE_PILLAR_PROB={garage:0.5,pool:0.22,city:0.4,field:0.02};
function brGetWorld(mode){
  if(!br.worlds[mode])br.worlds[mode]={walls:new Set(),doneChunks:new Set(),slides:[]};
  return br.worlds[mode];
}
function brEnsureGenericChunk(mode,cx,cy){
  const w=brGetWorld(mode);
  const key=cx+','+cy;
  if(w.doneChunks.has(key))return;
  w.doneChunks.add(key);
  const rnd=mulberry32(brChunkSeed(cx,cy,BR_MODE_SALT[mode]));
  const baseX=cx*BR_CH, baseY=cy*BR_CH;
  const pillarProb=BR_MODE_PILLAR_PROB[mode]||0.4;
  const spacing=3;
  const jitterX=Math.floor(rnd()*spacing), jitterY=Math.floor(rnd()*spacing);
  for(let ly=jitterY;ly<BR_CH;ly+=spacing)for(let lx=jitterX;lx<BR_CH;lx+=spacing){
    if(rnd()<pillarProb)w.walls.add((baseX+lx)+','+(baseY+ly));
  }
  const partitions=Math.floor(rnd()*3);
  for(let p=0;p<partitions;p++){
    const horiz=rnd()<0.5, len=3+Math.floor(rnd()*4), gapAt=Math.floor(rnd()*len);
    const sx=Math.floor(rnd()*Math.max(1,BR_CH-len)), sy=Math.floor(rnd()*BR_CH);
    for(let i=0;i<len;i++){
      if(i===gapAt)continue;
      const gx=horiz?baseX+sx+i:baseX+sx, gy=horiz?baseY+sy:baseY+sy+i;
      w.walls.add(gx+','+gy);
    }
  }
  if(cx===0&&cy===0)for(let ly=0;ly<4;ly++)for(let lx=0;lx<4;lx++)w.walls.delete((baseX+lx)+','+(baseY+ly));
  if(mode==='pool'){
    const chunkDist=Math.hypot(cx,cy);
    if(chunkDist>=1&&w.slides.length<3&&rnd()<0.06){
      for(let tries=0;tries<20;tries++){
        const lx=1+Math.floor(rnd()*(BR_CH-2)), ly=1+Math.floor(rnd()*(BR_CH-2));
        const gx=baseX+lx, gy=baseY+ly;
        if(!w.walls.has(gx+','+gy)){ w.slides.push({x:gx+0.5,y:gy+0.5}); break; }
      }
    }
  }
}
function brEnsureGenericArea(mode,px,py){
  const ccx=Math.floor(px/BR_CH), ccy=Math.floor(py/BR_CH);
  for(let dy=-BR_GEN_RADIUS;dy<=BR_GEN_RADIUS;dy++)
    for(let dx=-BR_GEN_RADIUS;dx<=BR_GEN_RADIUS;dx++)
      brEnsureGenericChunk(mode,ccx+dx,ccy+dy);
}

function brIsWallGlobal(gx,gy){
  if(br.mode==='fun')return br.funWalls.has(gx+','+gy);
  if(br.mode==='level0')return br.walls.has(gx+','+gy);
  return brGetWorld(br.mode).walls.has(gx+','+gy);
}
function brCollide(px,py){
  const chk=(x,y)=>brIsWallGlobal(Math.floor(x),Math.floor(y));
  return chk(px-BR_R,py-BR_R)||chk(px+BR_R,py-BR_R)||chk(px-BR_R,py+BR_R)||chk(px+BR_R,py+BR_R);
}

function brEnterFun(){
  br.savedLevel0={px:br.px,py:br.py,angle:br.angle};
  brEnsureFunWorld();
  br.px=2.5;br.py=2.5;br.angle=Math.PI*0.25;
  br.mode='fun';
  br.entity=null;br.entityTimer=90;
  showMerchantToast('🎉 파티에 오신 것을 환영합니다...!');
}
function brExitFun(){
  br.mode='level0';
  br.px=br.savedLevel0.px;br.py=br.savedLevel0.py;br.angle=br.savedLevel0.angle;
  br.entity=null;br.entityTimer=brNextEntityDelay();
  showMerchantToast('🚪 다시 백룸으로...');
  achStats.brFunEscapes=(achStats.brFunEscapes||0)+1;saveAch();checkAchievements();
}
function brEnterGarage(){
  br.mode='garage';br.px=2.5;br.py=2.5;br.angle=Math.PI*0.25;
  br.entity=null;br.entityTimer=260;
  showMerchantToast('🔧 환풍구를 열고 기어들어갔다... 끝없는 주차장이다');
}
function brEnterPool(){
  br.mode='pool';br.px=2.5;br.py=2.5;br.angle=Math.PI*0.25;
  br.entity=null;br.entityTimer=260;
  const w=brGetWorld('pool');
  if(!w._guaranteedSlide){
    w._guaranteedSlide=true;
    w.slides.push(brPlaceGuaranteedAt(w.walls,(cx,cy)=>brEnsureGenericChunk('pool',cx,cy),18,10));
  }
  showMerchantToast('🕳️ 끝없이 떨어지다... 물속에 빠졌다');
}
function brEnterCity(){
  br.mode='city';br.px=2.5;br.py=2.5;br.angle=Math.PI*0.25;
  br.entity=null;br.entityTimer=260;
  showMerchantToast('🏙️ 미끄럼틀 끝에 낯선 도시가 있었다');
}
function brEnterField(){
  br.mode='field';br.px=2.5;br.py=2.5;br.angle=Math.PI*0.25;
  br.entity=null;br.entityTimer=260;
  showMerchantToast('🌾 어느새 도시가 사라지고 갈대만 가득하다');
}

function initBackroomsMode(){
  br={
    mode:'level0',
    px:2.5,py:2.5,angle:0.4,
    walls:new Set(),doneChunks:new Set(),doors:[],realExits:[],
    vents:[],pits:[],screwdrivers:[],levers:[],leversUp:0,hasScrewdriver:false,
    worlds:{},fieldTriggered:false,
    entity:null,entityTimer:240,frame:0,depthMax:0,
  };
  brEnsureChunk(0,0);
  brPlaceGuaranteedDoor();
  brPlaceGuaranteedScrewdriver();
  brPlaceGuaranteedVent();
  brPlaceGuaranteedPit();
  brPlaceGuaranteedLever(16,10);
  brPlaceGuaranteedLever(20,16);
  showMerchantToast('...여기가 어디지...');
  achStats.brEntries=(achStats.brEntries||0)+1;saveAch();checkAchievements();
}

function brNextEntityDelay(){
  const depth=Math.hypot(br.px,br.py);
  return Math.max(180,480-Math.floor(depth*1.2));
}
function brSpawnEntity(){
  const ang=Math.random()*Math.PI*2;
  let dist=9+Math.random()*5;
  let ex=br.px+Math.cos(ang)*dist, ey=br.py+Math.sin(ang)*dist;
  for(let i=0;i<12&&brIsWallGlobal(Math.floor(ex),Math.floor(ey));i++){
    dist+=1; ex=br.px+Math.cos(ang)*dist; ey=br.py+Math.sin(ang)*dist;
  }
  const depth=Math.hypot(br.px,br.py);
  const baseSpeed=br.mode==='fun'?0.046:0.026+Math.min(0.02,depth*0.00025);
  br.entity={x:ex,y:ey,speed:baseSpeed,life:1400};
}
function brEntitySteer(e,speed){
  const desired=Math.atan2(br.py-e.y,br.px-e.x);
  const offsets=[0,0.4,-0.4,0.8,-0.8,1.2,-1.2,1.6,-1.6];
  for(const off of offsets){
    const ang=desired+off;
    const nx=e.x+Math.cos(ang)*speed, ny=e.y+Math.sin(ang)*speed;
    if(!brCollide(nx,ny)){ e.x=nx; e.y=ny; return; }
  }
}
function brUpdateEntity(){
  if(br.entity){
    brEntitySteer(br.entity,br.entity.speed);
    const d=Math.hypot(br.entity.x-br.px,br.entity.y-br.py);
    if(d<0.5){ loseBackrooms(); return; }
    br.entity.life--;
    if(br.entity.life<=0||d>18){ br.entity=null; br.entityTimer=brNextEntityDelay(); }
  } else {
    br.entityTimer--;
    if(br.entityTimer<=0)brSpawnEntity();
  }
}

function updateBackroomsMode(){
  if(!br)return;
  br.frame++;
  const fwdX=Math.cos(br.angle), fwdY=Math.sin(br.angle);
  const strX=Math.cos(br.angle+Math.PI/2), strY=Math.sin(br.angle+Math.PI/2);
  let mx=0,my=0;
  if(keys['w']||keys['arrowup']){mx+=fwdX;my+=fwdY;}
  if(keys['s']||keys['arrowdown']){mx-=fwdX;my-=fwdY;}
  if(keys['d']){mx+=strX;my+=strY;}
  if(keys['a']){mx-=strX;my-=strY;}
  if(keys['arrowleft'])br.angle-=0.035;
  if(keys['arrowright'])br.angle+=0.035;
  const mlen=Math.hypot(mx,my);
  if(mlen>0.0001){mx=mx/mlen*BR_SPEED;my=my/mlen*BR_SPEED;}
  const nx=br.px+mx;
  if(!brCollide(nx,br.py))br.px=nx;
  const ny=br.py+my;
  if(!brCollide(br.px,ny))br.py=ny;

  if(br.mode==='level0'){
    brEnsureArea(br.px,br.py);
    const depth=Math.hypot(br.px-2.5,br.py-2.5);
    if(depth>br.depthMax){br.depthMax=depth;brSaveBestDepth(Math.floor(depth));}
    for(const d of br.doors)if(Math.hypot(d.x-br.px,d.y-br.py)<0.6){ brEnterFun(); return; }
    for(const r of br.realExits)if(Math.hypot(r.x-br.px,r.y-br.py)<0.6){ brRealExit(); return; }
    for(const v of br.vents){
      if(Math.hypot(v.x-br.px,v.y-br.py)<0.7){
        if(br.hasScrewdriver){ brEnterGarage(); return; }
        else if(br.frame-(v._toastF||-999)>180){ v._toastF=br.frame; showMerchantToast('🔩 잠긴 환풍구... 도구가 필요할 것 같다'); }
      }
    }
    for(const p of br.pits)if(Math.hypot(p.x-br.px,p.y-br.py)<0.5){ brEnterPool(); return; }
    for(const s of br.screwdrivers){
      if(!s.taken&&Math.hypot(s.x-br.px,s.y-br.py)<0.5){ s.taken=true; br.hasScrewdriver=true; showMerchantToast('🔧 드라이버를 주웠다'); }
    }
    for(const l of br.levers){
      if(!l.up&&Math.hypot(l.x-br.px,l.y-br.py)<0.6){
        l.up=true; br.leversUp=(br.leversUp||0)+1;
        showMerchantToast('⚡ 레버가 올라갔다 ('+br.leversUp+'/2)');
        if(br.leversUp>=2&&br.realExits.length===0){
          br.realExits.push(brPlaceGuaranteedAt(br.walls,brEnsureChunk,26,16));
          showMerchantToast('🚪 차원이 흔들리며... 어딘가에 문이 나타났다');
        }
      }
    }
  } else if(br.mode==='fun'){
    brEnsureFunArea(br.px,br.py);
    for(const d of br.funDoors)if(Math.hypot(d.x-br.px,d.y-br.py)<0.6){ brExitFun(); return; }
  } else if(br.mode==='pool'){
    brEnsureGenericArea('pool',br.px,br.py);
    const w=brGetWorld('pool');
    for(const s of w.slides)if(Math.hypot(s.x-br.px,s.y-br.py)<0.6){ brEnterCity(); return; }
  } else if(br.mode==='city'){
    brEnsureGenericArea('city',br.px,br.py);
    const depth=Math.hypot(br.px-2.5,br.py-2.5);
    if(depth>55&&!br.fieldTriggered){ br.fieldTriggered=true; brEnterField(); return; }
  } else if(br.mode==='garage'||br.mode==='field'){
    brEnsureGenericArea(br.mode,br.px,br.py);
  }
  brUpdateEntity();
}

function loseBackrooms(){
  running=false;window._needLastDraw=true;
  const msg=br.mode==='fun'?'🎉 파티고어에게 붙잡혔다...':'👁️ 더 백룸에게 붙잡혔다...';
  showMerchantToast(msg);
  setTimeout(()=>{ if(document.exitPointerLock)document.exitPointerLock(); stopGame(); go('sBackrooms'); },900);
}
function brRealExit(){
  running=false;window._needLastDraw=true;
  achStats.brRealExits=(achStats.brRealExits||0)+1;saveAch();checkAchievements();
  const depth=Math.floor(Math.hypot(br.px-2.5,br.py-2.5));
  const foundFun=localStorage.getItem(BR_FUN_KEY)==='1';
  // 탈출 성공 보상: 매번 지급, 도달 거리가 멀수록 더 큰 보상
  const rewardCoins=15000+depth*250;
  const rewardEnergy=6000+depth*120;
  coins+=rewardCoins; energy+=rewardEnergy;
  sv('hd_c',coins); sv('hd_e',energy); updRes();
  if(document.exitPointerLock)document.exitPointerLock();
  playBackroomsEscapeCutscene(depth,foundFun,rewardCoins,rewardEnergy,()=>{ stopGame(); go('sBackrooms'); });
}

// ── 진짜 탈출구 컷신: 드림코어풍 연출 ──
function playBackroomsEscapeCutscene(depth,foundFun,rewardCoins,rewardEnergy,cb){
  const el=document.getElementById('brEscapeCutscene');
  if(!el){ cb(); return; }
  const light=document.getElementById('brCsLight');
  const flash=document.getElementById('brCsFlash');
  const vign=document.getElementById('brCsVignette');
  const scan=document.getElementById('brCsScanline');
  const lines=document.getElementById('brCsLines');
  const title=document.getElementById('brCsTitle');
  const sub=document.getElementById('brCsSub');
  const stats=document.getElementById('brCsStats');
  el.style.transition='';el.style.opacity='';
  el.classList.remove('shake');
  [light,flash,vign,scan,lines,title,sub,stats].forEach(x=>x.classList.remove('go','show','run','grow'));
  lines.textContent='';title.textContent='';sub.textContent='';stats.textContent='';
  el.classList.add('on');
  void el.offsetWidth;

  // 1) 빛을 향해 걸어들어가는 느낌으로 화면 전체가 서서히 빛에 잠식됨
  light.classList.add('grow');
  let t=1500;
  setTimeout(()=>{ flash.classList.add('go'); },t);
  t+=550;
  setTimeout(()=>{
    el.classList.add('shake');
    vign.classList.add('show');
    scan.classList.add('run');
  },t);

  // 2) 어둠 속, 회상하듯 대사가 하나씩 떠오른다
  const LINES=[
    '...문이 열렸다...',
    '뒤에서는 이제, 아무 소리도 들리지 않는다',
    '셀 수 없이 걸었던 그 모든 노란 방들이',
    '이제는 흐릿한 꿈처럼 멀어진다',
    '이곳은 곧, 기억이 될 것이다',
  ];
  t+=450;
  LINES.forEach(txt=>{
    const at=t;
    setTimeout(()=>{ lines.textContent=txt; lines.classList.add('show'); el.classList.add('shake'); },at);
    setTimeout(()=>{ lines.classList.remove('show'); el.classList.remove('shake'); },at+1000);
    t+=1300;
  });

  // 3) 글리치와 함께 타이틀이 강렬하게 떠오른다
  setTimeout(()=>{
    scan.classList.remove('run');
    title.textContent='ESCAPED';
    title.classList.add('show');
    sub.textContent='THE BACKROOMS';
    sub.classList.add('show');
  },t);
  t+=1800;
  setTimeout(()=>{
    let s='도달 거리 '+depth+'m'+(foundFun?' · LEVEL FUN=) 발견':'');
    if(rewardCoins)s+='  ·  🪙+'+rewardCoins.toLocaleString()+' ⚡+'+rewardEnergy.toLocaleString();
    stats.textContent=s;
    stats.classList.add('show');
  },t);
  t+=2200;
  setTimeout(()=>{
    el.style.transition='opacity 1.1s ease';
    el.style.opacity='0';
  },t);
  t+=1150;
  setTimeout(()=>{
    el.classList.remove('on');
    el.style.opacity='';el.style.transition='';
    cb();
  },t);
}

const BR_FUN_THEME={ceil:[255,150,190],fog:'rgba(60,10,50,'};
const BR_FUN_WALL_COLORS=[[224,196,90],[46,120,150]];
const BR_FUN_FLOOR_COLORS=[[240,200,60],[46,120,150],[220,120,40],[235,235,225]];

function brShade(rgb,f){
  return 'rgb('+Math.round(rgb[0]*f)+','+Math.round(rgb[1]*f)+','+Math.round(rgb[2]*f)+')';
}
function brCurTheme(){ return BR_LEVEL_THEME[br.mode]||BR_LEVEL_THEME.level0; }
function brWallColor(mapX,mapY,side,shadeF){
  if(br.mode==='fun'){
    const c=BR_FUN_WALL_COLORS[(mapX+mapY)%2];
    return brShade(c,shadeF);
  }
  const theme=brCurTheme();
  return brShade(side===1?theme.wallLo:theme.wallHi,shadeF);
}
function brHashCell(gx,gy){ return Math.abs((gx*928371)^(gy*123457)); }

// ── 레이캐스팅 (DDA) ──
function brCastRay(px,py,angle){
  const rayDirX=Math.cos(angle), rayDirY=Math.sin(angle);
  let mapX=Math.floor(px), mapY=Math.floor(py);
  const deltaDistX=Math.abs(1/rayDirX), deltaDistY=Math.abs(1/rayDirY);
  let stepX,stepY,sideDistX,sideDistY;
  if(rayDirX<0){stepX=-1;sideDistX=(px-mapX)*deltaDistX;}else{stepX=1;sideDistX=(mapX+1-px)*deltaDistX;}
  if(rayDirY<0){stepY=-1;sideDistY=(py-mapY)*deltaDistY;}else{stepY=1;sideDistY=(mapY+1-py)*deltaDistY;}
  let side=0,dist=BR_MAX_DEPTH;
  for(let i=0;i<80;i++){
    if(sideDistX<sideDistY){sideDistX+=deltaDistX;mapX+=stepX;side=0;}
    else{sideDistY+=deltaDistY;mapY+=stepY;side=1;}
    const d=side===0?(sideDistX-deltaDistX):(sideDistY-deltaDistY);
    if(d>BR_MAX_DEPTH){dist=BR_MAX_DEPTH;break;}
    if(brIsWallGlobal(mapX,mapY)){dist=d;break;}
  }
  return {dist:Math.max(dist,0.0001),side,mapX,mapY};
}

// FUN 전용: 체크무늬 파티 바닥을 근사 레이캐스팅으로 그린다(다른 레벨은 저비용 단색 바닥 유지 - 렉 방지)
function brDrawFunFloor(w,h){
  const rowStep=10,colStep=13;
  const halfH=h/2;
  for(let y=Math.ceil(halfH/rowStep)*rowStep;y<h;y+=rowStep){
    const p=y-halfH; if(p<=1)continue;
    const rowDist=h/(2*p);
    if(rowDist>BR_MAX_DEPTH)continue;
    for(let x=0;x<w;x+=colStep){
      const rel=-BR_FOV/2+BR_FOV*(x/w);
      const dist=rowDist/Math.max(0.2,Math.cos(rel));
      const wxp=br.px+Math.cos(br.angle+rel)*dist, wyp=br.py+Math.sin(br.angle+rel)*dist;
      const gx=Math.floor(wxp),gy=Math.floor(wyp);
      const col=BR_FUN_FLOOR_COLORS[brHashCell(gx,gy)%BR_FUN_FLOOR_COLORS.length];
      const shade=Math.max(0.55,1-dist/BR_MAX_DEPTH);
      ctx.fillStyle=brShade(col,shade);
      ctx.fillRect(x,y,colStep+1,rowStep+1);
    }
  }
}

// ── 진짜 3D 도어: 벽에 밀착된 문틀+문짝을 그리고, 가까이 가면 열리는 애니메이션 ──
function brDrawDoor(sxp,groundY,size,dist,style){
  const w=size*0.5, h=size*0.78;
  const swing=Math.max(0,Math.min(1,1-dist/2.6));
  ctx.fillStyle='rgba(18,13,6,.92)';
  ctx.fillRect(sxp-w/2-size*0.045,groundY-h,w+size*0.09,h);
  const doorW=w*(1-swing*0.62);
  let panelColor,knobColor;
  if(style==='entry'){panelColor='#8a5a2b';knobColor='#fde68a';}
  else if(style==='fun-exit'){panelColor='#7f1d1d';knobColor='#fecaca';}
  else{panelColor='#71717a';knobColor='#e5e7eb';}
  ctx.save();
  ctx.translate(sxp-w/2,0);
  ctx.fillStyle=panelColor;
  ctx.fillRect(0,groundY-h,doorW,h);
  ctx.strokeStyle='rgba(0,0,0,.5)';ctx.lineWidth=Math.max(1,size*0.012);
  ctx.strokeRect(doorW*0.12,groundY-h+h*0.08,doorW*0.76,h*0.36);
  ctx.strokeRect(doorW*0.12,groundY-h*0.5,doorW*0.76,h*0.36);
  if(style==='real-exit'){
    ctx.fillStyle='#d1d5db';
    ctx.fillRect(doorW*0.08,groundY-h*0.46,doorW*0.84,h*0.055);
  } else {
    ctx.fillStyle=knobColor;
    ctx.beginPath();ctx.arc(doorW*0.85,groundY-h*0.5,Math.max(2,size*0.022),0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
  if(style==='real-exit'){
    // 미국식 비상구 표지: 빨간 바탕에 흰 EXIT 글자, 문 위에 부착
    const signW=w*0.92, signH=size*0.17;
    const signY=groundY-h-signH-size*0.05;
    ctx.fillStyle='#dc2626';
    ctx.fillRect(sxp-signW/2,signY,signW,signH);
    ctx.strokeStyle='#450a0a';ctx.lineWidth=Math.max(1,size*0.008);
    ctx.strokeRect(sxp-signW/2,signY,signW,signH);
    ctx.fillStyle='#fff';
    ctx.font='bold '+Math.round(signH*0.62)+'px sans-serif';
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('EXIT',sxp,signY+signH*0.55);
    ctx.textAlign='left';ctx.textBaseline='alphabetic';
  }
}
function brDrawVent(sxp,cy,size){
  const w=size*0.4,h=size*0.3;
  ctx.fillStyle='#3f3f46';
  ctx.fillRect(sxp-w/2,cy-h/2,w,h);
  ctx.strokeStyle='#18181b';ctx.lineWidth=Math.max(1,size*0.01);
  for(let i=1;i<5;i++){
    const yy=cy-h/2+h*i/5;
    ctx.beginPath();ctx.moveTo(sxp-w/2+2,yy);ctx.lineTo(sxp+w/2-2,yy);ctx.stroke();
  }
}
function brDrawPit(sxp,cy,size){
  const g=ctx.createRadialGradient(sxp,cy,0,sxp,cy,size*0.32);
  g.addColorStop(0,'#000');g.addColorStop(0.7,'#0a0a0a');g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g;
  ctx.beginPath();ctx.ellipse(sxp,cy,size*0.32,size*0.14,0,0,Math.PI*2);ctx.fill();
}
function brDrawLever(sxp,cy,size,up){
  ctx.fillStyle='#57534e';
  ctx.fillRect(sxp-size*0.06,cy-size*0.02,size*0.12,size*0.22);
  const col=up?'#4ade80':'#dc2626';
  ctx.strokeStyle=col;ctx.lineWidth=Math.max(2,size*0.03);
  ctx.beginPath();ctx.moveTo(sxp,cy);
  if(up)ctx.lineTo(sxp+size*0.16,cy-size*0.32); else ctx.lineTo(sxp-size*0.16,cy-size*0.06);
  ctx.stroke();
  ctx.fillStyle=col;
  ctx.beginPath();ctx.arc(sxp+(up?size*0.16:-size*0.16),cy-(up?size*0.32:size*0.06),Math.max(2,size*0.03),0,Math.PI*2);ctx.fill();
}
function brDrawSlide(sxp,cy,size){
  ctx.fillStyle='#0ea5e9';
  ctx.beginPath();
  ctx.moveTo(sxp-size*0.22,cy+size*0.15);
  ctx.lineTo(sxp+size*0.22,cy+size*0.15);
  ctx.lineTo(sxp+size*0.1,cy-size*0.25);
  ctx.lineTo(sxp-size*0.1,cy-size*0.25);
  ctx.closePath();ctx.fill();
  ctx.strokeStyle='#0369a1';ctx.lineWidth=Math.max(1,size*0.015);ctx.stroke();
}

function brDrawBalloon(sx,cy,size,color,alpha){
  ctx.save();
  ctx.globalAlpha=alpha;
  ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=Math.max(1,size*0.01);
  ctx.beginPath();ctx.moveTo(sx,cy+size*0.14);ctx.lineTo(sx,cy+size*0.42);ctx.stroke();
  ctx.fillStyle=color;
  ctx.beginPath();ctx.ellipse(sx,cy,size*0.11,size*0.15,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.35)';
  ctx.beginPath();ctx.ellipse(sx-size*0.035,cy-size*0.05,size*0.03,size*0.045,0,0,Math.PI*2);ctx.fill();
  ctx.restore();
}
function brDrawTable(sx,cy,size,alpha){
  ctx.save();
  ctx.globalAlpha=alpha;
  ctx.fillStyle='#7c2d12';
  ctx.fillRect(sx-size*0.26,cy+size*0.06,size*0.04,size*0.2);
  ctx.fillRect(sx+size*0.22,cy+size*0.06,size*0.04,size*0.2);
  ctx.fillStyle='#f8fafc';
  ctx.fillRect(sx-size*0.32,cy-size*0.08,size*0.64,size*0.16);
  ctx.fillStyle='#ef4444';
  for(let i=0;i<4;i++)ctx.fillRect(sx-size*0.3+i*size*0.16,cy-size*0.08,size*0.08,size*0.16);
  ctx.restore();
}
function brDrawPartygoer(sx,cy,size,alpha){
  ctx.save();
  ctx.globalAlpha=alpha;
  const bodyH=size*0.85, bodyW=size*0.32;
  const headR=size*0.15;
  ctx.fillStyle='rgba(0,0,0,.35)';
  ctx.beginPath();ctx.ellipse(sx,cy+bodyH*0.4,bodyW*0.9,size*0.05,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#c9a227';
  ctx.beginPath();
  ctx.moveTo(sx-bodyW*0.5,cy+bodyH*0.38);
  ctx.lineTo(sx-bodyW*0.3,cy-bodyH*0.15);
  ctx.lineTo(sx+bodyW*0.3,cy-bodyH*0.15);
  ctx.lineTo(sx+bodyW*0.5,cy+bodyH*0.38);
  ctx.closePath();ctx.fill();
  ctx.fillStyle='#c9a227';
  ctx.beginPath();ctx.arc(sx,cy-bodyH*0.15-headR*0.9,headR,0,Math.PI*2);ctx.fill();
  const faceY=cy-bodyH*0.15-headR*0.62;
  ctx.fillStyle='#fdf6e3';
  ctx.beginPath();
  ctx.moveTo(sx-headR*0.68,faceY);
  ctx.quadraticCurveTo(sx,faceY+headR*0.62,sx+headR*0.68,faceY);
  ctx.quadraticCurveTo(sx,faceY+headR*0.3,sx-headR*0.68,faceY);
  ctx.closePath();ctx.fill();
  ctx.strokeStyle='#3a2a08';ctx.lineWidth=Math.max(1,size*0.014);ctx.stroke();
  ctx.beginPath();
  for(let i=-2;i<=2;i++){
    const tx=sx+i*headR*0.24;
    ctx.moveTo(tx,faceY+headR*0.06);
    ctx.lineTo(tx,faceY+headR*0.32);
  }
  ctx.lineWidth=Math.max(1,size*0.008);ctx.stroke();
  ctx.fillStyle='#e0245e';
  ctx.beginPath();
  ctx.moveTo(sx,cy-bodyH*0.15-headR*2.1);
  ctx.lineTo(sx-headR*0.7,cy-bodyH*0.15-headR*0.9);
  ctx.lineTo(sx+headR*0.7,cy-bodyH*0.15-headR*0.9);
  ctx.closePath();ctx.fill();
  const bx=sx+bodyW*0.75, by=cy-bodyH*0.5;
  ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=Math.max(1,size*0.01);
  ctx.beginPath();ctx.moveTo(bx,by+size*0.12);ctx.lineTo(sx+bodyW*0.4,cy);ctx.stroke();
  ctx.fillStyle='#dc2626';
  ctx.beginPath();ctx.ellipse(bx,by,size*0.09,size*0.12,0,0,Math.PI*2);ctx.fill();
  ctx.restore();
}

function brBuildSprites(){
  const list=[];
  if(br.mode==='level0'){
    for(const d of br.doors){const dd=Math.hypot(d.x-br.px,d.y-br.py);if(dd<BR_MAX_DEPTH)list.push({x:d.x,y:d.y,dist:dd,kind:'door-entry'});}
    for(const r of br.realExits){const dd=Math.hypot(r.x-br.px,r.y-br.py);if(dd<BR_MAX_DEPTH)list.push({x:r.x,y:r.y,dist:dd,kind:'door-real-exit'});}
    for(const v of br.vents){const dd=Math.hypot(v.x-br.px,v.y-br.py);if(dd<BR_MAX_DEPTH)list.push({x:v.x,y:v.y,dist:dd,kind:'vent'});}
    for(const p of br.pits){const dd=Math.hypot(p.x-br.px,p.y-br.py);if(dd<BR_MAX_DEPTH)list.push({x:p.x,y:p.y,dist:dd,kind:'pit'});}
    for(const s of br.screwdrivers){if(s.taken)continue;const dd=Math.hypot(s.x-br.px,s.y-br.py);if(dd<BR_MAX_DEPTH)list.push({x:s.x,y:s.y,dist:dd,kind:'screwdriver'});}
    for(const l of br.levers){const dd=Math.hypot(l.x-br.px,l.y-br.py);if(dd<BR_MAX_DEPTH)list.push({x:l.x,y:l.y,dist:dd,kind:'lever',up:l.up});}
  } else if(br.mode==='fun'){
    for(const d of br.funDoors){const dd=Math.hypot(d.x-br.px,d.y-br.py);if(dd<BR_MAX_DEPTH)list.push({x:d.x,y:d.y,dist:dd,kind:'door-exit'});}
    for(const p of br.funProps){const dd=Math.hypot(p.x-br.px,p.y-br.py);if(dd<12)list.push({x:p.x,y:p.y,dist:dd,kind:p.kind,color:p.color});}
  } else if(br.mode==='pool'){
    const w=brGetWorld('pool');
    for(const s of w.slides){const dd=Math.hypot(s.x-br.px,s.y-br.py);if(dd<BR_MAX_DEPTH)list.push({x:s.x,y:s.y,dist:dd,kind:'slide'});}
  }
  if(br.entity){const dd=Math.hypot(br.entity.x-br.px,br.entity.y-br.py);list.push({x:br.entity.x,y:br.entity.y,dist:dd,kind:'entity'});}
  list.sort((a,b)=>b.dist-a.dist);
  return list;
}

function drawBackroomsMode(){
  if(!br)return;
  const w=VW(),h=VH();
  let flick=1.15+Math.sin(Date.now()*0.01)*0.06+(Math.random()<0.02?-0.15:0);
  if(br.mode==='level0'){
    // 1레벨 형광등: 노란빛이 지속적으로 반짝거린다
    flick=1.22+Math.sin(Date.now()*0.014)*0.1+(Math.random()<0.05?-0.32:0)+(Math.random()<0.008?0.25:0);
  }

  if(br.mode==='fun'){
    ctx.fillStyle=brShade(BR_FUN_THEME.ceil,flick);ctx.fillRect(0,0,w,h/2);
    brDrawFunFloor(w,h);
  } else {
    const theme=brCurTheme();
    ctx.fillStyle=brShade(theme.ceil,flick);ctx.fillRect(0,0,w,h/2);
    ctx.fillStyle=brShade(theme.floor,flick);ctx.fillRect(0,h/2,w,h/2);
  }

  const rays=Math.max(220,Math.min(480,Math.floor(w*0.5)));
  const colW=w/rays;
  const zbuf=new Float32Array(rays);

  for(let i=0;i<rays;i++){
    const rel=-BR_FOV/2+BR_FOV*(i/(rays-1));
    const rayAngle=br.angle+rel;
    const hit=brCastRay(br.px,br.py,rayAngle);
    const perpDist=hit.dist*Math.cos(rel);
    zbuf[i]=perpDist;
    const lineH=Math.min(h*3,h/perpDist*BR_WALL_SCALE);
    const sx=i*colW;
    const sy=(h-lineH)/2;
    const shadeF=Math.max(0.38,1-perpDist/BR_MAX_DEPTH)*flick*(hit.side===1?0.8:1);
    ctx.fillStyle=brWallColor(hit.mapX,hit.mapY,hit.side,shadeF);
    ctx.fillRect(sx,sy,colW+1,lineH);
  }

  const sprites=brBuildSprites();
  for(const sp of sprites){
    let relAng=Math.atan2(sp.y-br.py,sp.x-br.px)-br.angle;
    while(relAng>Math.PI)relAng-=2*Math.PI;
    while(relAng<-Math.PI)relAng+=2*Math.PI;
    if(Math.abs(relAng)>BR_FOV/2+0.2||sp.dist>=BR_MAX_DEPTH)continue;
    const col=Math.max(0,Math.min(rays-1,Math.round((relAng+BR_FOV/2)/BR_FOV*(rays-1))));
    if(sp.dist>zbuf[col]+0.3)continue;
    const sxp=(relAng+BR_FOV/2)/BR_FOV*w;
    let size=Math.min(h*0.95,h/sp.dist*0.62);
    if(sp.kind==='entity'&&br.mode==='level0')size*=1.55;
    const alpha=Math.max(0.4,1-sp.dist/(BR_MAX_DEPTH*0.7));
    if(sp.kind==='door-entry'){
      const glow=ctx.createRadialGradient(sxp,h/2,0,sxp,h/2,size*0.55);
      glow.addColorStop(0,'rgba(251,191,36,.4)');glow.addColorStop(1,'rgba(251,191,36,0)');
      ctx.fillStyle=glow;ctx.fillRect(sxp-size*0.55,h/2-size*0.55,size*1.1,size*1.1);
      brDrawDoor(sxp,h/2+size*0.35,size,sp.dist,'entry');
    } else if(sp.kind==='door-exit'){
      brDrawDoor(sxp,h/2+size*0.35,size,sp.dist,'fun-exit');
    } else if(sp.kind==='door-real-exit'){
      const glow=ctx.createRadialGradient(sxp,h/2,0,sxp,h/2,size*0.6);
      glow.addColorStop(0,'rgba(74,222,128,.4)');glow.addColorStop(1,'rgba(74,222,128,0)');
      ctx.fillStyle=glow;ctx.fillRect(sxp-size*0.6,h/2-size*0.6,size*1.2,size*1.2);
      brDrawDoor(sxp,h/2+size*0.35,size,sp.dist,'real-exit');
    } else if(sp.kind==='vent'){
      brDrawVent(sxp,h/2,size);
    } else if(sp.kind==='pit'){
      brDrawPit(sxp,h/2+size*0.3,size);
    } else if(sp.kind==='screwdriver'){
      ctx.font=Math.round(size*0.5)+'px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText('🔧',sxp,h/2+size*0.1);ctx.textAlign='left';ctx.textBaseline='alphabetic';
    } else if(sp.kind==='lever'){
      brDrawLever(sxp,h/2+size*0.25,size,sp.up);
    } else if(sp.kind==='slide'){
      brDrawSlide(sxp,h/2+size*0.2,size);
    } else if(sp.kind==='balloon'){
      brDrawBalloon(sxp,h/2-size*0.1,size,sp.color,alpha);
    } else if(sp.kind==='table'){
      brDrawTable(sxp,h/2+size*0.2,size,alpha);
    } else if(sp.kind==='entity'){
      if(br.mode==='fun')brDrawPartygoer(sxp,h/2+size*0.25,size,1);
      else if(typeof hcEntityImgOk!=='undefined'&&hcEntityImgOk&&typeof hcEntityImg!=='undefined'){
        const ew=size*1.05, eh=size*0.68;
        ctx.drawImage(hcEntityImg,sxp-ew/2,h/2-eh/2,ew,eh);
      } else {
        ctx.font=Math.round(size*0.9)+'px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText('👁️',sxp,h/2+size*0.04);
        ctx.textAlign='left';ctx.textBaseline='alphabetic';
      }
    }
  }

  const fog=br.mode==='fun'?BR_FUN_THEME.fog:brCurTheme().fog;
  const vign=ctx.createRadialGradient(w/2,h/2,h*0.22,w/2,h/2,h*0.78);
  vign.addColorStop(0,fog+'0)');
  vign.addColorStop(1,fog+'0.58)');
  ctx.fillStyle=vign;ctx.fillRect(0,0,w,h);

  let entDist=br.entity?Math.hypot(br.entity.x-br.px,br.entity.y-br.py):Infinity;
  if(entDist<7){
    const danger=Math.max(0,1-entDist/7);
    ctx.fillStyle='rgba(180,0,0,'+(danger*0.32).toFixed(3)+')';
    ctx.fillRect(0,0,w,h);
    if(danger>0.4&&Math.random()<danger*0.4){
      for(let i=0;i<2;i++){
        const by=Math.random()*h, bh2=6+Math.random()*16, dxg=(Math.random()-0.5)*24*danger;
        ctx.drawImage(gC,0,by,w,bh2,dxg,by,w,bh2);
      }
    }
  }

  brDrawMinimap();

  ctx.fillStyle='#fbbf24';
  ctx.font='bold 16px monospace';
  const modeLabel={level0:'LEVEL 0',fun:'🎉 LEVEL FUN=)',garage:'🅿️ 끝없는 주차장',pool:'🏊 수영장',city:'🏙️ 끝없는 도시',field:'🌾 끝없는 갈대밭'}[br.mode]||br.mode;
  const depthTxt=(br.mode==='level0'||br.mode==='city')?(' · '+Math.floor(Math.hypot(br.px-2.5,br.py-2.5))+'m'):'';
  ctx.fillText(modeLabel+depthTxt,14,26);
  ctx.fillStyle='rgba(255,255,255,.6)';
  ctx.font='12px monospace';
  let hint='WASD 이동 · 마우스 시점';
  if(br.mode==='level0')hint+=' · 레버 '+(br.leversUp||0)+'/2';
  else if(br.mode==='fun')hint+=' · 🚪 빨간 EXIT을 찾아라';
  ctx.fillText(hint,14,46);
}

function brDrawMinimap(){
  const mmR=4,cell=8,size=(mmR*2+1)*cell;
  const ox=VW()-size-14, oy=14;
  ctx.save();
  ctx.globalAlpha=0.82;
  ctx.fillStyle='rgba(0,0,0,.55)';
  ctx.fillRect(ox-4,oy-4,size+8,size+8);
  const pcx=Math.floor(br.px),pcy=Math.floor(br.py);
  for(let dy=-mmR;dy<=mmR;dy++){
    for(let dx=-mmR;dx<=mmR;dx++){
      const gx=pcx+dx,gy=pcy+dy;
      const isWall=brIsWallGlobal(gx,gy);
      ctx.fillStyle=isWall?'rgba(255,255,255,.15)':'rgba(255,255,255,.5)';
      ctx.fillRect(ox+(dx+mmR)*cell,oy+(dy+mmR)*cell,cell-1,cell-1);
    }
  }
  const markers=[];
  if(br.mode==='level0'){
    for(const d of br.doors)markers.push({x:d.x,y:d.y,color:'#f472b6'});
    for(const r of br.realExits)markers.push({x:r.x,y:r.y,color:'#4ade80'});
    for(const l of br.levers)markers.push({x:l.x,y:l.y,color:l.up?'#4ade80':'#f59e0b'});
    for(const v of br.vents)markers.push({x:v.x,y:v.y,color:'#94a3b8'});
    for(const p of br.pits)markers.push({x:p.x,y:p.y,color:'#111827'});
  } else if(br.mode==='fun'){
    for(const d of br.funDoors)markers.push({x:d.x,y:d.y,color:'#ef4444'});
  } else if(br.mode==='pool'){
    for(const s of brGetWorld('pool').slides)markers.push({x:s.x,y:s.y,color:'#0ea5e9'});
  }
  if(br.entity)markers.push({x:br.entity.x,y:br.entity.y,color:'#dc2626'});
  for(const m of markers){
    const mdx=m.x-br.px, mdy=m.y-br.py;
    if(Math.abs(mdx)<=mmR&&Math.abs(mdy)<=mmR){
      ctx.fillStyle=m.color;
      ctx.beginPath();ctx.arc(ox+(mdx+mmR)*cell,oy+(mdy+mmR)*cell,3,0,Math.PI*2);ctx.fill();
    }
  }
  const px0=ox+mmR*cell+cell/2, py0=oy+mmR*cell+cell/2;
  ctx.translate(px0,py0);ctx.rotate(br.angle);
  ctx.fillStyle='#38bdf8';
  ctx.beginPath();ctx.moveTo(7,0);ctx.lineTo(-4,4.5);ctx.lineTo(-4,-4.5);ctx.closePath();ctx.fill();
  ctx.restore();
}
