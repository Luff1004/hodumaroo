// ══════════════ 월드3: 갤러그 스타일 슈팅게임 ══════════════
// 우주선은 화면 하단에서 좌우로만 이동, 스페이스바로 위쪽 사격. 몹은 위에서 아래로 내려온다.
const SH_PLAYER_SPEED=6;
const SH_BULLET_SPEED=10;
const SH_FIRE_COOLDOWN=10; // 프레임 단위
let shooter=null;

function initShooterMode(){
  const pat=(selMap&&selMap.enemyPattern)||{spawnInt:80,speed:2,hp:1,driftAmp:40,waves:8};
  shooter={
    x:VW()/2,
    lives:3,
    score:0,
    bullets:[],
    enemies:[],
    spawnTimer:0,
    spawnInt:pat.spawnInt,
    enemySpeed:pat.speed,
    enemyHp:pat.hp,
    driftAmp:pat.driftAmp,
    totalEnemies:pat.waves*6,
    spawnedCount:0,
    killedCount:0,
    fireCd:0,
    over:false,
  };
}
function updateShooterMode(){
  if(!shooter||shooter.over)return;
  const w=VW();
  if(keys['arrowleft']||keys['a'])shooter.x-=SH_PLAYER_SPEED;
  if(keys['arrowright']||keys['d'])shooter.x+=SH_PLAYER_SPEED;
  shooter.x=Math.max(24,Math.min(w-24,shooter.x));

  if(shooter.fireCd>0)shooter.fireCd--;
  if(keys[' ']&&shooter.fireCd<=0){
    shooter.bullets.push({x:shooter.x,y:VH()-70,vy:-SH_BULLET_SPEED});
    shooter.fireCd=SH_FIRE_COOLDOWN;
  }
  shooter.bullets.forEach(b=>b.y+=b.vy);
  shooter.bullets=shooter.bullets.filter(b=>b.y>-20);

  if(shooter.spawnedCount<shooter.totalEnemies){
    shooter.spawnTimer++;
    if(shooter.spawnTimer>=shooter.spawnInt){
      shooter.spawnTimer=0;
      shooter.spawnedCount++;
      shooter.enemies.push({
        x:40+Math.random()*(w-80), y:-30,
        baseX:40+Math.random()*(w-80),
        hp:shooter.enemyHp, maxHp:shooter.enemyHp,
        phase:Math.random()*Math.PI*2,
      });
    }
  }
  shooter.enemies.forEach(en=>{
    en.y+=shooter.enemySpeed;
    en.phase+=0.05;
    en.x=en.baseX+Math.sin(en.phase)*shooter.driftAmp;
  });

  // 총알-적 충돌
  shooter.enemies.forEach(en=>{
    if(en.dead)return;
    shooter.bullets.forEach(b=>{
      if(b.dead)return;
      const d=Math.hypot(b.x-en.x,b.y-en.y);
      if(d<22){
        b.dead=true; en.hp--;
        if(en.hp<=0){ en.dead=true; shooter.killedCount++; shooter.score+=100; }
      }
    });
  });
  shooter.bullets=shooter.bullets.filter(b=>!b.dead);

  // 적-플레이어 충돌 / 화면 이탈
  const py=VH()-70;
  shooter.enemies=shooter.enemies.filter(en=>{
    if(en.dead)return false;
    const d=Math.hypot(en.x-shooter.x,en.y-py);
    if(d<30){ shooter.lives--; return false; }
    if(en.y>VH()+40)return false;
    return true;
  });

  if(shooter.lives<=0){ shooter.over=true; loseShooterMap(); return; }
  if(shooter.spawnedCount>=shooter.totalEnemies&&shooter.enemies.length===0){
    shooter.over=true; winShooterMap();
  }
}
function loseShooterMap(){
  running=false;window._needLastDraw=true;
  showMerchantToast('💥 우주선이 격추당했다...');
  setTimeout(()=>{ stopGame(); go('sLobby3'); }, 900);
}
function winShooterMap(){
  running=false;window._needLastDraw=true;
  showMerchantToast('🏆 임무 완료! 점수 '+shooter.score);
  achStats.shooterWins=(achStats.shooterWins||0)+1;saveAch();checkAchievements();
  setTimeout(()=>{ stopGame(); go('sLobby3'); }, 900);
}
function drawShooterMode(){
  if(!shooter)return;
  const w=VW(),h=VH();
  const g=ctx.createLinearGradient(0,0,0,h);
  g.addColorStop(0,'#020617');g.addColorStop(1,'#0f172a');
  ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  ctx.fillStyle='rgba(255,255,255,.5)';
  for(let i=0;i<40;i++){
    const sx=(i*97)%w, sy=(i*53+Date.now()*0.05)%h;
    ctx.fillRect(sx,sy,1.6,1.6);
  }

  // 플레이어
  const py=h-70;
  ctx.save();
  ctx.translate(shooter.x,py);
  ctx.fillStyle='#38bdf8';
  ctx.beginPath();
  ctx.moveTo(0,-20);ctx.lineTo(16,18);ctx.lineTo(0,10);ctx.lineTo(-16,18);ctx.closePath();ctx.fill();
  ctx.fillStyle='#bae6fd';
  ctx.beginPath();ctx.ellipse(0,0,5,8,0,0,Math.PI*2);ctx.fill();
  ctx.restore();

  // 총알
  ctx.fillStyle='#fde68a';
  shooter.bullets.forEach(b=>{ ctx.fillRect(b.x-2,b.y-8,4,12); });

  // 적
  shooter.enemies.forEach(en=>{
    ctx.save();
    ctx.translate(en.x,en.y);
    ctx.fillStyle='#dc2626';
    ctx.beginPath();
    ctx.moveTo(0,16);ctx.lineTo(14,-12);ctx.lineTo(0,-4);ctx.lineTo(-14,-12);ctx.closePath();ctx.fill();
    if(en.maxHp>1){
      ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(-16,-22,32,4);
      ctx.fillStyle='#4ade80';ctx.fillRect(-16,-22,32*(en.hp/en.maxHp),4);
    }
    ctx.restore();
  });

  // HUD
  ctx.fillStyle='#fff';
  ctx.font='14px monospace';
  ctx.fillText('❤️ '+Math.max(0,shooter.lives), 14, 24);
  ctx.fillText('⭐ '+shooter.score, 14, 44);
  ctx.fillText('👾 '+shooter.killedCount+'/'+shooter.totalEnemies, 14, 64);
}
