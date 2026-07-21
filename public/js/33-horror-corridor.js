// ══════════════ 공포 복도 미니게임: 에일리언 차원의 ESCAPE (1인칭 3D 터널) ══════════════
// 좌우 이동 없는 일직선 세로 복도를 1인칭 시점(가짜 3D 원근 터널)으로 걷는다.
// 마우스로 시점을 돌려 뒤를 돌아보면, 항상 접근해오는 엔티티(눈)를 직접 볼 수 있다.
const HC_DOOR_Y=9000;
const HC_PLAYER_SPEED=4.2;
const HC_ENTITY_SPEED=3.0;
const HC_DANGER_START=900; // 이 거리부터 위험 이펙트 시작
const HC_PERSP_K=300;       // 원근 소실 계수 (작을수록 가까운 것이 더 크게 보임)
const HC_MAX_DEPTH=2600;    // 터널 렌더 거리
const HC_TILE=220;          // 터널 링 간격
const HC_CORRIDOR_HALF_W=170;
const HC_MOUSE_SENS=0.0028;

let hc=null;
// 엔티티 눈 이미지: /images/entity/entity.png 에 파일만 넣으면 코드 수정 없이 자동 적용된다.
// 로드 전/실패 시엔 회색 공막+검은 동공+하이라이트 두 점을 그리는 절차적 placeholder를 대신 그린다.
const hcEntityImg=new Image();
let hcEntityImgOk=false;
hcEntityImg.onload=()=>{hcEntityImgOk=true;};
hcEntityImg.src='/images/entity/entity.png';

function startHorrorCorridor(){
  selMap={corridorEngine:true, noWeapons:true, noJobs:true, noItems:true, noWaveSpeed:true, id:'horror_corridor'};
  startGame();
  requestCorridorPointerLock();
}
function requestCorridorPointerLock(){
  if(gC.requestPointerLock)gC.requestPointerLock();
}
document.addEventListener('mousemove',e=>{
  if(!hc||!selMap||!selMap.corridorEngine)return;
  if(document.pointerLockElement!==gC)return;
  hc.yaw-=(e.movementX||0)*HC_MOUSE_SENS;
});
gC.addEventListener('mousedown',()=>{
  if(selMap&&selMap.corridorEngine&&document.pointerLockElement!==gC)requestCorridorPointerLock();
});
function initHorrorCorridor(){
  hc={
    y:0,
    yaw:0,
    entityY:null,
    entitySpawned:false,
    startTs:Date.now(),
    spawnDelay:9000+Math.random()*5000,
    caught:false,
  };
}
function updateHorrorCorridor(){
  if(!hc||hc.caught)return;
  const forward=keys['w']||keys['arrowup'];
  const backward=keys['s']||keys['arrowdown'];
  if(forward)hc.y+=HC_PLAYER_SPEED;
  if(backward)hc.y-=HC_PLAYER_SPEED;
  hc.y=Math.max(0,hc.y);

  if(!hc.entitySpawned&&Date.now()-hc.startTs>hc.spawnDelay){
    hc.entitySpawned=true;
    // 플레이어가 거의 안 움직인 상태라도 항상 700~1100 만큼의 안전 거리를 확보한 채 스폰한다
    hc.entityY=hc.y-(700+Math.random()*400);
  }
  if(hc.entitySpawned){
    hc.entityY+=HC_ENTITY_SPEED;
    const dist=hc.y-hc.entityY;
    if(dist<46){
      hc.caught=true;
      loseCorridor();
      return;
    }
  }
  if(hc.y>=HC_DOOR_Y){
    hc.caught=true;
    winCorridor();
  }
}
function loseCorridor(){
  running=false;window._needLastDraw=true;
  showMerchantToast('👁️ 붙잡혔다...');
  setTimeout(()=>{ if(document.exitPointerLock)document.exitPointerLock(); stopGame(); go('sLobby'); }, 900);
}
function winCorridor(){
  running=false;window._needLastDraw=true;
  showMerchantToast('🚪 노란 문을 통과했다...');
  achStats.corridorCleared=(achStats.corridorCleared||0)+1;saveAch();checkAchievements();
  setTimeout(()=>{ if(document.exitPointerLock)document.exitPointerLock(); stopGame(); go('sBackrooms'); }, 700);
}
function drawHorrorCorridor(){
  if(!hc)return;
  const w=VW(),h=VH();
  const cy=h/2;

  // 위험도(뒤에서 다가오는 엔티티와의 거리 기반) — 화면 흔들림·글리치·비네트에 사용 (바라보는 방향과 무관)
  let danger=0,entDist=Infinity;
  if(hc.entitySpawned){
    entDist=hc.y-hc.entityY;
    danger=Math.max(0,Math.min(1,(HC_DANGER_START-entDist)/HC_DANGER_START));
  }
  const shakeX=danger>0.15?(Math.random()-0.5)*10*danger:0;
  const shakeY=danger>0.15?(Math.random()-0.5)*6*danger:0;

  // 마우스로 시점 회전: 소실점이 좌우로 밀려나며 "고개를 돌리는" 느낌을 준다.
  // cos(yaw)>=0 이면 문(앞) 방향, 아니면 뒤(엔티티) 방향을 보고 있는 것으로 취급한다.
  const vpX=w/2+Math.sin(hc.yaw)*w*0.9;
  const facingForward=Math.cos(hc.yaw)>=0;

  ctx.save();
  ctx.translate(shakeX,shakeY);

  // 배경(천장/바닥)
  ctx.fillStyle='#0a0505';
  ctx.fillRect(-40,-40,w+80,cy+40);
  ctx.fillStyle='#120808';
  ctx.fillRect(-40,cy,w+80,h-cy+40);

  // 소실점을 향한 안내선
  ctx.strokeStyle='rgba(220,38,38,.18)';
  ctx.lineWidth=1;
  ctx.beginPath();
  ctx.moveTo(0,0);ctx.lineTo(vpX,cy);ctx.lineTo(w,0);
  ctx.moveTo(0,h);ctx.lineTo(vpX,cy);ctx.lineTo(w,h);
  ctx.stroke();

  // 터널 링(원근 사각형)들을 먼 곳부터 가까운 순서로.
  // 보고 있는 방향 기준으로 스크롤 방향을 뒤집어서, 뒤돌아본 채 전진하면 "뒤로 가는" 느낌이 나도록 한다.
  const dirSign=facingForward?1:-1;
  const effectiveY=hc.y*dirSign;
  const phase=((effectiveY%HC_TILE)+HC_TILE)%HC_TILE;
  const ringCount=Math.ceil(HC_MAX_DEPTH/HC_TILE)+1;
  for(let i=ringCount;i>=0;i--){
    const depth=i*HC_TILE-phase;
    if(depth<=2)continue;
    const scale=HC_PERSP_K/(HC_PERSP_K+depth);
    const rw=HC_CORRIDOR_HALF_W*2*scale;
    const rh=h*0.92*scale;
    const alpha=Math.max(0,1-depth/HC_MAX_DEPTH)*0.85;
    ctx.strokeStyle='rgba(220,38,38,'+alpha.toFixed(3)+')';
    ctx.lineWidth=2;
    ctx.strokeRect(vpX-rw/2,cy-rh/2,rw,rh);
  }

  // 문/엔티티는 방향이 바뀔 때 뚝 끊기지 않도록 각도에 따라 서서히 사라지고 나타난다(크로스페이드)
  const forwardAmt=Math.max(0,Math.cos(hc.yaw));
  const backwardAmt=Math.max(0,-Math.cos(hc.yaw));
  if(forwardAmt>0){
    // 문(도착 지점) — 원근 투영
    const doorDepth=HC_DOOR_Y-hc.y;
    if(doorDepth>2&&doorDepth<HC_MAX_DEPTH){
      const scale=HC_PERSP_K/(HC_PERSP_K+doorDepth);
      const dw=190*scale, dh=260*scale;
      ctx.globalAlpha=forwardAmt;
      const doorGlow=ctx.createRadialGradient(vpX,cy,0,vpX,cy,Math.max(dw,dh));
      doorGlow.addColorStop(0,'rgba(251,191,36,.35)');
      doorGlow.addColorStop(1,'rgba(251,191,36,0)');
      ctx.fillStyle=doorGlow;
      ctx.fillRect(vpX-dw,cy-dh,dw*2,dh*2);
      ctx.fillStyle='#fbbf24';
      ctx.fillRect(vpX-dw/2,cy+(h*0.46*scale)-dh,dw,dh);
      ctx.strokeStyle='#92400e';ctx.lineWidth=Math.max(1,3*scale);
      ctx.strokeRect(vpX-dw/2,cy+(h*0.46*scale)-dh,dw,dh);
      ctx.globalAlpha=1;
    }
  }
  if(backwardAmt>0&&hc.entitySpawned&&entDist<HC_MAX_DEPTH){
    // 뒤돌아보면 항상 접근해오는 커다란 외눈이 어둠 속에서 보인다
    // (사용자가 준 눈 이미지를 /images/entity/entity.png 에 넣으면 자동으로 그걸 그린다)
    const scale=HC_PERSP_K/(HC_PERSP_K+Math.max(2,entDist));
    const eyeW=90*scale, eyeH=54*scale;
    ctx.globalAlpha=backwardAmt;
    if(hcEntityImgOk){
      ctx.drawImage(hcEntityImg, vpX-eyeW, cy-eyeH, eyeW*2, eyeH*2);
    } else {
      const glow=ctx.createRadialGradient(vpX,cy,0,vpX,cy,eyeW*2.2);
      glow.addColorStop(0,'rgba(220,38,38,.35)');
      glow.addColorStop(1,'rgba(220,38,38,0)');
      ctx.fillStyle=glow;
      ctx.fillRect(vpX-eyeW*2.5,cy-eyeW*2,eyeW*5,eyeW*4);
      const scleraGrad=ctx.createRadialGradient(vpX,cy,eyeH*0.1,vpX,cy,eyeW);
      scleraGrad.addColorStop(0,'#e8e4dc');
      scleraGrad.addColorStop(0.6,'#c9c4b8');
      scleraGrad.addColorStop(1,'#8a8578');
      ctx.fillStyle=scleraGrad;
      ctx.beginPath();ctx.ellipse(vpX,cy,eyeW,eyeH,0,0,Math.PI*2);ctx.fill();
      const pupilR=eyeH*0.62;
      ctx.fillStyle='#050505';
      ctx.beginPath();ctx.arc(vpX,cy,pupilR,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,.85)';
      ctx.beginPath();ctx.arc(vpX-pupilR*0.28,cy-pupilR*0.22,pupilR*0.14,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(vpX+pupilR*0.05,cy-pupilR*0.3,pupilR*0.09,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
  }

  ctx.restore();

  // 위험 이펙트: 엔티티가 가까울수록 빨간 비네트 + 글리치
  if(danger>0){
    const vign=ctx.createRadialGradient(w/2,cy,h*0.2,w/2,cy,h*0.75);
    vign.addColorStop(0,'rgba(180,0,0,0)');
    vign.addColorStop(1,'rgba(180,0,0,'+(danger*0.55).toFixed(3)+')');
    ctx.fillStyle=vign;
    ctx.fillRect(0,0,w,h);
    ctx.fillStyle='rgba(180,0,0,'+(danger*0.18).toFixed(3)+')';
    ctx.fillRect(0,0,w,h);
    if(danger>0.35&&Math.random()<danger*0.5){
      for(let i=0;i<3;i++){
        const by=Math.random()*h, bh=6+Math.random()*18, dx=(Math.random()-0.5)*30*danger;
        ctx.drawImage(gC, 0, by, w, bh, dx, by, w, bh);
      }
    }
  }

  ctx.fillStyle='rgba(255,255,255,.55)';
  ctx.font='12px monospace';
  ctx.fillText('W/S 또는 ↑↓ : 이동   마우스 : 시점', 14, 24);

  // 방향 라벨: 지금 뭘 보고 있는지 글자로 명확히 표시
  ctx.font='bold 14px monospace';
  ctx.textAlign='center';
  if(forwardAmt>=backwardAmt){
    ctx.fillStyle='rgba(251,191,36,'+(0.5+forwardAmt*0.5).toFixed(2)+')';
    ctx.fillText('🚪 앞 (문 방향)', w/2, 46);
  } else {
    ctx.fillStyle='rgba(220,38,38,'+(0.5+backwardAmt*0.5).toFixed(2)+')';
    ctx.fillText('👁 뒤 (엔티티 접근 중)', w/2, 46);
  }
  ctx.textAlign='left';

  // 미니 나침반: 문(🚪)과 엔티티(👁)가 지금 내 시야 기준 어느 쪽에 있는지 항상 보여준다
  const barW=Math.min(240,w*0.6), barX0=w/2-barW/2, barY=64;
  ctx.fillStyle='rgba(0,0,0,.4)';
  ctx.fillRect(barX0,barY-8,barW,16);
  ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1;
  ctx.strokeRect(barX0,barY-8,barW,16);
  // 화면 정중앙 = 지금 내가 보고 있는 방향
  ctx.strokeStyle='rgba(255,255,255,.8)';
  ctx.beginPath();ctx.moveTo(w/2,barY-11);ctx.lineTo(w/2,barY+11);ctx.stroke();
  const normSigned=a=>{ a=((a%(2*Math.PI))+3*Math.PI)%(2*Math.PI)-Math.PI; return a; };
  const bearingX=bearing=>w/2+(normSigned(bearing)/Math.PI)*(barW/2);
  const doorBearing=-hc.yaw;
  const entBearing=-hc.yaw+Math.PI;
  ctx.font='13px monospace';ctx.textAlign='center';
  ctx.fillStyle='#fbbf24';ctx.fillText('🚪',bearingX(doorBearing),barY+5);
  if(hc.entitySpawned){ ctx.fillStyle='#dc2626'; ctx.fillText('👁',bearingX(entBearing),barY+5); }
  ctx.textAlign='left';
}
