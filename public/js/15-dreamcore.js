// ════════════════════════════════════════════
// ══ DREAMCORE WORLD SYSTEM ══
// ════════════════════════════════════════════

let isDreamMode = false;

// 드림코어 진입 버튼 초기화
function initDreamBtn(){
  const img = document.getElementById('dreamBtnImg');
  if(img) img.src = EYE1;
  checkDreamUnlock();
  // 글리치 텍스트 data-text 동기화
  document.querySelectorAll('.glitch-text').forEach(el=>{
    if(!el.dataset.text) el.dataset.text = el.textContent;
  });
}

// 버튼 호버 - 화면 글리치
let _glitchItv = null;
function dreamBtnHover(on){
  const btn = document.getElementById('dreamBtn');
  if(on){
    btn.style.opacity='1';btn.style.filter='grayscale(0%) brightness(1.2)';
    startGlitchOverlay();
  } else {
    btn.style.opacity='0.7';btn.style.filter='grayscale(60%)';
    stopGlitchOverlay();
  }
}

let _glitchOverlay = null;
function startGlitchOverlay(){
  if(_glitchOverlay) return;
  _glitchOverlay = document.createElement('div');
  _glitchOverlay.id = 'glitchOverlay';
  _glitchOverlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:8999;mix-blend-mode:difference;';
  document.body.appendChild(_glitchOverlay);

  // WAKE UP 텍스트
  const wakeup = document.createElement('div');
  wakeup.id = 'wakeupText';
  wakeup.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-family:"Courier New",monospace;font-size:clamp(32px,6vw,72px);color:#fff;letter-spacing:12px;font-weight:700;pointer-events:none;z-index:9000;mix-blend-mode:difference;opacity:0;text-shadow:2px 0 #0ff,-2px 0 #f0f;';
  wakeup.textContent = 'WAKE UP';
  document.body.appendChild(wakeup);

  let t=0;
  _glitchItv = setInterval(()=>{
    t++;
    // 화면 흑백 + 글리치
    const shift = (Math.random()-.5)*8;
    const skew = (Math.random()-.5)*2;
    document.body.style.filter = `grayscale(${40+Math.random()*60}%) contrast(${1+Math.random()*.5})`;
    document.body.style.transform = `translateX(${shift}px) skewX(${skew}deg)`;
    // WAKE UP 텍스트 지지직
    const wakeEl = document.getElementById('wakeupText');
    if(wakeEl){
      wakeEl.style.opacity = Math.random() > .4 ? (0.5+Math.random()*.5) : '0';
      wakeEl.style.letterSpacing = (8+Math.random()*16)+'px';
      wakeEl.style.left = (50+(Math.random()-.5)*4)+'%';
      wakeEl.style.textShadow = `${(Math.random()-.5)*6}px 0 #0ff, ${(Math.random()-.5)*6}px 0 #f0f`;
    }
  }, 60);
}

function stopGlitchOverlay(){
  if(_glitchItv){ clearInterval(_glitchItv); _glitchItv=null; }
  document.body.style.filter = '';
  document.body.style.transform = '';
  const go2 = document.getElementById('glitchOverlay');
  if(go2) go2.remove();
  const wu = document.getElementById('wakeupText');
  if(wu) wu.remove();
}

// 드림코어 세계 진입
function enterDreamworld(){
  achStats.dreamEntered=(achStats.dreamEntered||0)+1;
  saveAch(); checkAchievements();
  stopGlitchOverlay();
  isDreamMode = true;
  // 이미지 설정
  document.getElementById('dEye1').src = EYE1;
  document.getElementById('dEye2').src = EYE2;
  document.getElementById('dEye3').src = EYE3;
  // 돈 표시
  document.getElementById('dlc').textContent = coins.toLocaleString();
  document.getElementById('dle').textContent = energy.toLocaleString();
  // 화면 전환 (글리치와 함께)
  triggerGlitchTransition(()=>{
    hideAllScreens();
    const sc = document.getElementById('sDream');
    sc.classList.add('on');
    startDreamAmbient('dreamCanvas');
    positionDreamEyes();
    animateDreamTitle();
    startScanline();
  });
}

function positionDreamEyes(){
  // 배경 이미지 숨김
  ['dEye1','dEye2','dEye3'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.style.opacity='0';
  });
}

function animateDreamTitle(){
  const el = document.getElementById('dreamTitle');
  const sub = document.getElementById('dreamSub');
  const phrases = ['WAKE UP','ARE YOU DREAMING','THE SUN IS RISING','RUN','THEY SEE YOU','OPEN YOUR EYES'];
  let idx=0;
  if(window._dreamTitleItv) clearInterval(window._dreamTitleItv);
  window._dreamTitleItv = setInterval(()=>{
    if(!isDreamMode){clearInterval(window._dreamTitleItv);return;}
    el.classList.add('active');
    setTimeout(()=>{
      el.textContent = phrases[idx%phrases.length];
      el.dataset.text = el.textContent;
      idx++;
    },80);
    setTimeout(()=>el.classList.remove('active'),200);
  }, 3500);
}

// 드림코어 앰비언트 노이즈 캔버스 (필름 그레인)
function startDreamAmbient(canvasId){
  const cv = document.getElementById(canvasId);
  if(!cv)return;
  const sw=Math.min(window.innerWidth,200),sh=Math.min(window.innerHeight,150);
  cv.width=sw; cv.height=sh;
  const cx2=cv.getContext('2d');
  let frame=0;
  function grain(){
    if(!isDreamMode&&canvasId==='dreamCanvas')return;
    frame++;
    if(frame%6!==0){requestAnimationFrame(grain);return;}
    cx2.clearRect(0,0,sw,sh);
    const id=cx2.createImageData(sw,sh);
    const d=id.data;
    for(let i=0;i<d.length;i+=16){
      const v=Math.random()*40|0;
      d[i]=d[i+1]=d[i+2]=v;d[i+3]=Math.random()>0.85?30:0;
    }
    cx2.putImageData(id,0,0);
    if(Math.random()>.92){
      cx2.fillStyle='rgba(255,255,255,0.06)';
      cx2.fillRect(0,Math.random()*sh,sw,2);
    }
    requestAnimationFrame(grain);
  }
  grain();
}

// 스캔라인
function startScanline(){
  if(document.getElementById('dreamScanline'))return;
  const sl=document.createElement('div');
  sl.id='dreamScanline'; document.body.appendChild(sl);
}
function stopScanline(){
  const sl=document.getElementById('dreamScanline');
  if(sl)sl.remove();
}

// 글리치 전환 효과
function triggerGlitchTransition(cb){
  const body=document.body;
  let step=0;
  function tick(){
    step++;
    if(step<8){
      body.style.filter=`grayscale(${Math.random()*100}%) contrast(${1+Math.random()*2})`;
      body.style.transform=`translateX(${(Math.random()-.5)*20}px) scaleY(${.98+Math.random()*.04})`;
      setTimeout(tick,40);
    } else {
      body.style.filter=''; body.style.transform='';
      if(cb) cb();
    }
  }
  setTimeout(tick,40);
}

// 드림코어 맵 선택
const DREAM_MAPS = [
  {id:'dream_sun',name:'THE SUN IS RISE',sub:'태양이 뜨지 않는다', boss:'dream_sun',  diff:'∞∞∞∞'},
  {id:'dream_limbo',name:'THE LIMBO',     sub:'끝이 없는 복도',   boss:'dream_limbo',diff:'∞∞∞∞∞'},
  {id:'dream_eye',name:'EYE',             sub:'그것이 너를 본다', boss:'dream_eye',  diff:'∞∞∞∞∞∞'},
  {id:'dream_wakeup',name:'WAKE UP',      sub:'깨어나라',         boss:'dream_wakeup',diff:'∞∞∞∞∞∞∞'},
];

function openDreamMapSelect(){
  triggerGlitchTransition(()=>{
    hideAllScreens();
    const sc=document.getElementById('sDreamMap');
    sc.classList.add('on');
    startDreamAmbient('dreamCanvas2');
    const list=document.getElementById('dreamMapList');
    list.innerHTML='';
    DREAM_MAPS.forEach((m,i)=>{
      const btn=document.createElement('div');
      btn.className='dream-map-card';
      btn.innerHTML=`<span>${m.name}</span><span class="card-diff">${m.sub} &nbsp; ${m.diff}</span>`;
      btn.onclick=()=>{ startDreamGame(m); };
      // 스태거 페이드인
      btn.style.opacity='0';
      setTimeout(()=>{btn.style.transition='opacity .3s';btn.style.opacity='1';},i*120);
      list.appendChild(btn);
    });
  });
}

function dreamGo(target,mode){
  if(target==='sMap'&&mode==='dream'){
    openDreamMapSelect();
  } else {
    go(target);
  }
}

// 드림코어 상점 오버레이
function dreamShop(){
  const ov=document.getElementById('dreamOverlay');
  document.getElementById('dreamOverlayTitle').textContent='WAKE UP... ITEMS';
  document.getElementById('dreamOverlayTitle').dataset.text='WAKE UP... ITEMS';
  const ct=document.getElementById('dreamOverlayContent');
  ct.innerHTML='';
  // 글리치 텍스트들로 상점 표시
  const glitchWords=['WAKE UP','THE SUN IS RISE','RUN','THEY SEE YOU','OPEN YOUR EYES','DO NOT LOOK','ERROR ERROR','YOU ARE DREAMING'];
  Object.values(WEPS).filter(w=>!DFLT.includes(w.id)&&!w.spOnly&&!w.bossReward).slice(0,20).forEach((w,i)=>{
    const card=document.createElement('div');
    card.className='dream-item-card'+(owned[w.id]?' owned':'');
    const gword=glitchWords[i%glitchWords.length];
    card.innerHTML=`<span class="dico">${w.icon}</span><span style="display:block;color:#222;font-size:8px;letter-spacing:1px;">${gword}</span><span style="display:block;margin-top:4px;font-size:9px;">${owned[w.id]?'■ OBTAINED':'🪙'+w.price.toLocaleString()}</span>`;
    if(!owned[w.id]&&coins>=w.price){
      card.style.cursor='pointer';
      card.onclick=()=>{if(coins>=w.price&&!owned[w.id]){coins-=w.price;owned[w.id]=true;saveAll();dreamShop();}};
    }
    ct.appendChild(card);
  });
  ov.style.display='flex';
  startDreamAmbient('dreamCanvas3');
  // 글리치 반복 애니메이션
  startDreamOverlayGlitch();
}

function dreamJob(){
  const ov=document.getElementById('dreamOverlay');
  document.getElementById('dreamOverlayTitle').textContent='ENTITY SELECT';
  document.getElementById('dreamOverlayTitle').dataset.text='ENTITY SELECT';
  const ct=document.getElementById('dreamOverlayContent');
  ct.innerHTML='';
  const glitchWords=['WAKE UP','THE SUN IS RISE','RUN','THEY SEE YOU','OPEN YOUR EYES','DO NOT LOOK','ERROR'];
  JOBS.filter(j=>!j.spOnly).slice(0,20).forEach((j,i)=>{
    const card=document.createElement('div');
    const isOwned=ownedJobs[j.id]||false;
    card.className='dream-item-card'+(isOwned?' owned':'');
    const gword=glitchWords[i%glitchWords.length];
    card.innerHTML=`<span class="dico">${j.icon}</span><span style="display:block;color:#222;font-size:8px;">${gword}</span><span style="display:block;margin-top:4px;font-size:9px;">${isOwned?'■ OBTAINED':'🪙'+j.price.toLocaleString()}</span>`;
    ct.appendChild(card);
  });
  ov.style.display='flex';
  startDreamAmbient('dreamCanvas3');
  startDreamOverlayGlitch();
}

let _dreamOvGlitch=null;
function startDreamOverlayGlitch(){
  if(_dreamOvGlitch) return;
  _dreamOvGlitch=setInterval(()=>{
    document.querySelectorAll('#dreamOverlayContent .dream-item-card').forEach(c=>{
      if(Math.random()>.85){
        c.style.transform=`translateX(${(Math.random()-.5)*4}px)`;
        c.style.filter=`brightness(${0.8+Math.random()*.4}) hue-rotate(${Math.random()*360}deg)`;
        setTimeout(()=>{c.style.transform='';c.style.filter='';},80);
      }
    });
    const title=document.getElementById('dreamOverlayTitle');
    if(title&&Math.random()>.7){
      title.classList.add('active');
      setTimeout(()=>title.classList.remove('active'),150);
    }
  },200);
}

function closeDreamOverlay(){
  document.getElementById('dreamOverlay').style.display='none';
  if(_dreamOvGlitch){clearInterval(_dreamOvGlitch);_dreamOvGlitch=null;}
}

// ── 드림코어 보스 정의 ──
const DREAM_BOSSES = {
  dream_sun_boss:{
    id:'dream_sun_boss',name:'THE SUN IS RISE',icon:'☀️',hp:80000,r:80,col:'#fffff0',ol:'#888',
    phases:[{t:.7,m:'̷T̷H̷E̷ ̷S̷U̷N̷ ̷B̷U̷R̷N̷S̷'},{t:.4,m:'WAKE UP WAKE UP'},{t:.1,m:'̷̷̷̷̷̷̷̷̷̷'}],
    atk:['sunBlind','sunPillar','sunMadness','sunEye','sunBlind','sunPillar'],
    reward:{c:200000,e:100000}
  },
  dream_limbo_boss:{
    id:'dream_limbo_boss',name:'THE LIMBO',icon:'🚪',hp:90000,r:70,col:'#e0e0e0',ol:'#444',
    phases:[{t:.65,m:'THERE IS NO EXIT'},{t:.3,m:'LOOPING...'},{t:.05,m:'...'}],
    atk:['limboWall','limboClone','limboVoid','limboWall','limboClone'],
    reward:{c:300000,e:150000}
  },
  dream_eye_boss:{
    id:'dream_eye_boss',name:'E Y E',icon:'👁️',hp:100000,r:90,col:'#c8b8a2',ol:'#555',
    phases:[{t:.6,m:'IT SEES YOU'},{t:.3,m:'YOU CANNOT HIDE'},{t:.05,m:'̶̶̶̶̶̶'}],
    atk:['eyeGaze','eyeBeam','eyeTears','eyeGaze','eyeBeam','eyeTears'],
    reward:{c:500000,e:250000}
  },
  dream_wakeup_boss:{
    id:'dream_wakeup_boss',name:'WAKE UP',icon:'🌑',hp:120000,r:100,col:'#fff',ol:'#000',
    phases:[{t:.75,m:'WAKE UP'},{t:.5,m:'WAKE UP WAKE UP'},{t:.25,m:'WAKE. UP.'},{t:.05,m:'̶W̶A̶K̶E̶ ̶U̶P̶'}],
    atk:['wakeGlitch','wakePulse','wakeShadow','wakeEye','wakeGlitch','wakePulse','wakeGlitch'],
    reward:{c:1000000,e:500000}
  },
};

// BOSSES 객체에 드림코어 보스 추가
Object.assign(BOSSES, {
  dream_sun_boss:  DREAM_BOSSES.dream_sun_boss,
  dream_limbo_boss:DREAM_BOSSES.dream_limbo_boss,
  dream_eye_boss:  DREAM_BOSSES.dream_eye_boss,
  dream_wakeup_boss:DREAM_BOSSES.dream_wakeup_boss,
});
// BOSS_MAP_DATA에도 추가 (HP바 등에서 참조)
Object.assign(BOSS_MAP_DATA, {
  dream_sun:   {name:'THE SUN IS RISE',icon:'☀️',col:'#fffff0',hp:80000,maxHp:80000,phase:1,t:0},
  dream_limbo: {name:'THE LIMBO',icon:'🚪',col:'#e0e0e0',hp:90000,maxHp:90000,phase:1,t:0},
  dream_eye:   {name:'E Y E',icon:'👁️',col:'#c8b8a2',hp:100000,maxHp:100000,phase:1,t:0},
  dream_wakeup:{name:'WAKE UP',icon:'🌑',col:'#fff',hp:120000,maxHp:120000,phase:1,t:0},
});

// ── 드림코어 보스 공격 패턴 ──
function doDreamBossAtk(z,ab){
  if(!z||z.dead)return;
  const cx=z.x, cy=z.y;

  if(ab==='sunBlind'){
    // 태양 섬광 - 전체화면 화이트아웃 + 방사형
    setMsg('̷T̷H̷E̷ ̷S̷U̷N̷');
    for(let i=0;i<16;i++){const a=i/16*Math.PI*2;buls.push({x:cx,y:cy,vx:Math.cos(a)*9,vy:Math.sin(a)*9,r:7,l:160,en:true,dmg:80,col:'#fffff0'});}
    effs.push({type:'ring',x:cx,y:cy,r:10,maxR:300,l:40,ml:40,col:'#fff'});
  }
  else if(ab==='sunPillar'){
    // 수직 광선 6개
    setMsg('LOOK AWAY');
    for(let i=0;i<6;i++){
      const lx=80+i*(MW-160)/5;
      effs.push({type:'warn',x:lx,y:camY+200,l:50,ml:50});
      gTimeout(()=>{if(!running)return;for(let y2=0;y2<800;y2+=22)buls.push({x:lx,y:camY+y2,vx:0,vy:2,r:9,l:100,en:true,dmg:90,col:'#fffff0',laser:true});},700);
    }
  }
  else if(ab==='sunMadness'){
    // 화면 왜곡 + 난사
    setMsg('̷̷̷̷̷̷̷̷');
    for(let i=0;i<25;i++){gTimeout(()=>{if(!running)return;const a=Math.random()*Math.PI*2;buls.push({x:cx,y:cy,vx:Math.cos(a)*11,vy:Math.sin(a)*11,r:6,l:140,en:true,dmg:75,col:'#fffff0'});},i*80);}
  }
  else if(ab==='sunEye'){
    // 눈 추적탄
    setMsg('IT WATCHES');
    for(let i=0;i<3;i++){gTimeout(()=>{if(!running)return;const ang=Math.atan2(P.y-cy,P.x-cx);buls.push({x:cx,y:cy,vx:Math.cos(ang)*8,vy:Math.sin(ang)*8,r:10,l:180,en:true,dmg:100,col:'#fff',_homing:true,homing:{x:P.x,y:P.y,dead:false}});},i*300);}
  }
  else if(ab==='limboWall'){
    // 벽처럼 가로 탄막
    setMsg('NO EXIT');
    for(let k=0;k<3;k++){gTimeout(()=>{if(!running)return;for(let x2=0;x2<MW;x2+=28)buls.push({x:x2,y:camY-20,vx:0,vy:9,r:8,l:130,en:true,dmg:85,col:'#e0e0e0'});},k*600);}
  }
  else if(ab==='limboClone'){
    // 보스가 분열하는 척 탄환
    setMsg('WHICH ONE IS REAL');
    [[-200,0],[200,0],[0,-150],[0,150]].forEach(([dx2,dy2])=>{
      for(let i=0;i<8;i++){const a=i/8*Math.PI*2;buls.push({x:cx+dx2,y:cy+dy2,vx:Math.cos(a)*8,vy:Math.sin(a)*8,r:6,l:140,en:true,dmg:70,col:'#ccc'});}
    });
  }
  else if(ab==='limboVoid'){
    // 중앙 흡수 후 방출
    setMsg('...');
    let t4=0;const pull=setInterval(()=>{if(!running||t4++>60){clearInterval(pull);const _i=gameTimers.indexOf(pull);if(_i>=0)gameTimers.splice(_i,1);if(running){for(let i=0;i<20;i++){const a=i/20*Math.PI*2;buls.push({x:cx,y:cy,vx:Math.cos(a)*14,vy:Math.sin(a)*14,r:9,l:150,en:true,dmg:95,col:'#fff'});}}return;}P.x+=(cx-P.x)*.04;P.y+=(cy-P.y)*.04;},16);
    gameTimers.push(pull);
  }
  else if(ab==='eyeGaze'){
    // 플레이어 응시 후 집중 빔
    setMsg('I SEE YOU');
    effs.push({type:'warn',x:P.x,y:P.y,l:55,ml:55});
    gTimeout(()=>{if(!running)return;const ang=Math.atan2(P.y-cy,P.x-cx);for(let k=-2;k<=2;k++)buls.push({x:cx,y:cy,vx:Math.cos(ang+k*.08)*13,vy:Math.sin(ang+k*.08)*13,r:9,l:160,en:true,dmg:100,col:'#c8b8a2'});},800);
  }
  else if(ab==='eyeBeam'){
    // 회전 레이저
    setMsg('̶̶̶̶̶̶̶̶');
    for(let i=0;i<3;i++){gTimeout(()=>{if(!running)return;const base=Date.now()/200;for(let j=0;j<12;j++){const a=base+j/12*Math.PI*2;buls.push({x:cx,y:cy,vx:Math.cos(a)*11,vy:Math.sin(a)*11,r:7,l:140,en:true,dmg:85,col:'#b0a090'});}},i*400);}
  }
  else if(ab==='eyeTears'){
    // 아래로 눈물 탄막
    setMsg('CRYING');
    for(let x3=60;x3<MW-60;x3+=40){gTimeout(()=>{if(!running)return;buls.push({x:x3,y:camY-10,vx:(Math.random()-.5)*2,vy:8+Math.random()*4,r:7,l:150,en:true,dmg:80,col:'#a0b0c0'});},Math.random()*500);}
  }
  else if(ab==='wakeGlitch'){
    // 화면 글리치 + 전방위
    setMsg('WAKE UP');
    // 글리치 시각효과
    let gt2=0;const giv=setInterval(()=>{if(!running||gt2++>12){clearInterval(giv);const _i=gameTimers.indexOf(giv);if(_i>=0)gameTimers.splice(_i,1);document.getElementById('gameCanvas').style.filter='';return;}document.getElementById('gameCanvas').style.filter=`grayscale(${Math.random()*100}%) contrast(${1+Math.random()*3}) hue-rotate(${Math.random()*360}deg)`;document.getElementById('gameCanvas').style.transform=`translateX(${(Math.random()-.5)*10}px)`;},50);
    gameTimers.push(giv);
    for(let i=0;i<20;i++){const a=i/20*Math.PI*2;buls.push({x:cx,y:cy,vx:Math.cos(a)*10,vy:Math.sin(a)*10,r:8,l:150,en:true,dmg:90,col:'#fff'});}
    gTimeout(()=>{if(document.getElementById('gameCanvas'))document.getElementById('gameCanvas').style.filter='';},700);
  }
  else if(ab==='wakePulse'){
    // 동심원 펄스
    setMsg('WAKE UP WAKE UP WAKE UP');
    for(let i=0;i<4;i++){gTimeout(()=>{if(!running)return;effs.push({type:'ring',x:cx,y:cy,r:10,maxR:400,l:50,ml:50,col:'#fff'});for(let j=0;j<12;j++){const a=j/12*Math.PI*2;buls.push({x:cx,y:cy,vx:Math.cos(a)*9,vy:Math.sin(a)*9,r:7,l:140,en:true,dmg:85,col:'#fff'});}},i*500);}
  }
  else if(ab==='wakeShadow'){
    // 그림자 분신들
    setMsg('THEY ARE EVERYWHERE');
    [[-300,-150],[300,-150],[-300,150],[300,150],[-200,200],[200,200]].forEach(([dx3,dy3])=>{
      for(let i=0;i<6;i++){const a=i/6*Math.PI*2;buls.push({x:cx+dx3,y:cy+dy3,vx:Math.cos(a)*8,vy:Math.sin(a)*8,r:7,l:140,en:true,dmg:80,col:'#555'});}
    });
  }
  else if(ab==='wakeEye'){
    // 눈 이미지로 추적탄
    setMsg('I̶T̶ ̶S̶E̶E̶S̶ ̶Y̶O̶U̶');
    for(let i=0;i<5;i++){gTimeout(()=>{if(!running)return;const ang=Math.atan2(P.y-cy,P.x-cx);buls.push({x:cx+(Math.random()-.5)*100,y:cy+(Math.random()-.5)*100,vx:Math.cos(ang)*7,vy:Math.sin(ang)*7,r:12,l:200,en:true,dmg:110,col:'#c8b8a2',_homing:true,homing:{x:P.x,y:P.y,dead:false}});},i*200);}
  }
}

// doBossAtk에서 드림코어 보스 분기
const _origDoBossAtk = doBossAtk;
// 실제로는 BOSSES에 추가했으니 bossMapId로 드림여부 판단

// ── 드림코어 보스 그리기 ──
function drawDreamBoss(z,t){
  const cx=z.x, cy=z.y, r=z.r, pct=z.hp/z.bd.hp;
  const bid=z.bd.id;

  ctx.save();ctx.translate(cx,cy);

  if(bid==='dream_sun_boss'){
    // 태양 - 흰 원 + 광선 + 글리치
    const p2=ctx.createRadialGradient(0,0,0,0,0,r);
    p2.addColorStop(0,'#fff');p2.addColorStop(0.5,'#fffff0');p2.addColorStop(1,'rgba(255,255,240,0)');
    ctx.fillStyle=p2;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();
    // 광선
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2+t/200;ctx.strokeStyle='rgba(255,255,240,0.3)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(Math.cos(a)*(r+5),Math.sin(a)*(r+5));ctx.lineTo(Math.cos(a)*(r+25+Math.sin(t/60)*8),Math.sin(a)*(r+25+Math.sin(t/60)*8));ctx.stroke();}
    // 글리치
    if(Math.random()>.7){ctx.fillStyle=`rgba(0,255,255,${Math.random()*.2})`;ctx.fillRect(-r+(Math.random()-.5)*10,-4,r*2,3);}
  }
  else if(bid==='dream_limbo_boss'){
    // 문 실루엣 - 흑백 사각형
    ctx.fillStyle='#111';ctx.fillRect(-r*.6,-r,r*1.2,r*2);
    ctx.strokeStyle='#e0e0e0';ctx.lineWidth=3;ctx.strokeRect(-r*.6,-r,r*1.2,r*2);
    // 문 안 빛
    ctx.fillStyle=`rgba(255,255,255,${0.05+Math.sin(t/40)*.05})`;ctx.fillRect(-r*.55,-r*.95,r*1.1,r*1.9);
    // 글리치 라인
    for(let i=0;i<3;i++){if(Math.random()>.5){const gy=-(Math.random()-.5)*r*2;ctx.fillStyle=`rgba(255,255,255,${Math.random()*.3})`;ctx.fillRect(-r*.6,gy,r*1.2,2);}}
  }
  else if(bid==='dream_eye_boss'){
    // 날개 (좌우 대칭, 흰 깃털)
    function drawWing(side){
      ctx.save();ctx.scale(side,1);
      const wx=r*.55,wy=0;
      ctx.translate(wx,wy);
      for(let f=0;f<7;f++){
        const fa=-.55+f*.16;
        const flen=r*(1.05-Math.abs(f-3)*.08);
        const fx=Math.cos(fa)*flen, fy=Math.sin(fa)*flen*.7-r*.05;
        const g=ctx.createLinearGradient(0,0,fx,fy);
        g.addColorStop(0,'rgba(255,255,255,0.95)');g.addColorStop(1,'rgba(220,220,230,0.55)');
        ctx.fillStyle=g;
        ctx.beginPath();ctx.moveTo(0,0);
        ctx.quadraticCurveTo(fx*.5,fy*.3-8,fx,fy);
        ctx.quadraticCurveTo(fx*.5,fy*.3+8,0,0);
        ctx.fill();
        ctx.strokeStyle='rgba(200,200,210,0.4)';ctx.lineWidth=1;ctx.stroke();
      }
      ctx.restore();
    }
    drawWing(-1);drawWing(1);
    // 눈 - 핑크빛 아몬드형
    const eyeW=r*.62,eyeH=r*.5;
    ctx.beginPath();
    ctx.moveTo(-eyeW,0);
    ctx.quadraticCurveTo(-eyeW*.4,-eyeH,0,-eyeH*.85);
    ctx.quadraticCurveTo(eyeW*.4,-eyeH,eyeW,0);
    ctx.quadraticCurveTo(eyeW*.4,eyeH,0,eyeH*.85);
    ctx.quadraticCurveTo(-eyeW*.4,eyeH,-eyeW,0);
    ctx.closePath();
    const eyeGrad=ctx.createRadialGradient(0,0,0,0,0,eyeW);
    eyeGrad.addColorStop(0,'#f7d9e0');eyeGrad.addColorStop(0.55,'#e8899f');eyeGrad.addColorStop(0.85,'#c14f6b');eyeGrad.addColorStop(1,'#8a2f45');
    ctx.fillStyle=eyeGrad;ctx.fill();
    ctx.strokeStyle='#7a2438';ctx.lineWidth=2;ctx.stroke();
    // 혈관 느낌 라인
    ctx.strokeStyle='rgba(180,40,60,0.35)';ctx.lineWidth=1;
    for(let i=0;i<5;i++){const a2=(i/5)*Math.PI*2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a2)*eyeW*.9,Math.sin(a2)*eyeH*.9);ctx.stroke();}
    // 동공 추적 (플레이어 방향)
    const ea=Math.atan2(P.y-cy,P.x-cx);
    const px2=Math.cos(ea)*r*.14, py2=Math.sin(ea)*r*.1;
    ctx.fillStyle='#000';ctx.beginPath();ctx.arc(px2,py2,r*.22,0,Math.PI*2);ctx.fill();
    // 하이라이트
    ctx.fillStyle='rgba(255,255,255,0.7)';ctx.beginPath();ctx.arc(px2-r*.07,py2-r*.07,r*.05,0,Math.PI*2);ctx.fill();
    // 글리치
    if(Math.random()>.8){ctx.fillStyle=`rgba(255,255,255,${Math.random()*.15})`;ctx.fillRect(-r,-(Math.random()-.5)*r*.6*2,r*2,2);}
  }
  else if(bid==='dream_wakeup_boss'){
    // 완전한 공허 - 검은 원 + 텍스트 글리치
    const wg=ctx.createRadialGradient(0,0,0,0,0,r);
    wg.addColorStop(0,'#000');wg.addColorStop(0.8,'#050505');wg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=wg;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=`rgba(255,255,255,${0.1+Math.sin(t/30)*.1})`;ctx.lineWidth=1;ctx.stroke();
    // WAKE UP 텍스트
    if(Math.random()>.4){
      ctx.fillStyle=`rgba(255,255,255,${Math.random()*.6})`;
      ctx.font=`${8+Math.random()*6}px "Courier New"`;
      ctx.textAlign='center';
      const words=['WAKE','UP','W̶A̶K̶E̶','Ṳ̸͢P̶','WAKE UP','...'];
      ctx.fillText(words[Math.floor(Math.random()*words.length)],(Math.random()-.5)*r*1.5,(Math.random()-.5)*r);
    }
    // 글리치 노이즈
    for(let i=0;i<5;i++){if(Math.random()>.6){ctx.fillStyle=`rgba(255,255,255,${Math.random()*.1})`;ctx.fillRect(-r+(Math.random()-.5)*20,-(Math.random()-.5)*r*2,r*2*(Math.random()*.5+.5),1+Math.random()*3);}}
  }

  ctx.restore();

  // HP바
  const bw=r*2+20,bh=5;
  ctx.fillStyle='rgba(0,0,0,0.7)';ctx.fillRect(cx-bw/2,cy-r-22,bw,bh+2);
  ctx.fillStyle='#fff';ctx.fillRect(cx-bw/2,cy-r-22,bw*pct,bh+2);
  // 보스 이름 글리치
  ctx.fillStyle=`rgba(255,255,255,${0.5+Math.random()*.3})`;
  ctx.font=`bold 12px "Courier New"`;ctx.textAlign='center';
  ctx.fillText(z.bd.name,cx+(Math.random()-.5)*3,cy-r-28+(Math.random()-.5)*2);
}

// dream doBossAtk 분기는 원본 함수에 직접 추가됨

// drawBossMapBoss dream 분기는 원본에 직접 추가됨

// drawBossArena dream 분기는 원본에 직접 추가됨

// stopGame dream 처리는 원본에 추가됨

// 초기화
setTimeout(initDreamBtn, 100);


function renderDreamEquip(){
  const sc=document.getElementById('sEquip');
  sc.style.background='#000';sc.style.color='#fff';
  // 기존 내용 지우고 드림코어 스타일로
  sc.innerHTML=`
    <canvas id="dreamEquipCanvas" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.4;"></canvas>
    <div style="position:relative;z-index:10;width:100%;padding:12px;box-sizing:border-box;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <div class="glitch-text" style="font-family:'Courier New',monospace;font-size:16px;color:#555;letter-spacing:4px;" data-text="EQUIPMENT">EQUIPMENT</div>
        <button onclick="go('sDream')" style="background:transparent;border:1px solid #222;color:#333;font-family:'Courier New',monospace;font-size:10px;padding:6px 12px;cursor:pointer;letter-spacing:2px;" onmouseover="this.style.color='#fff';this.style.borderColor='#fff'" onmouseout="this.style.color='#333';this.style.borderColor='#222'">← BACK</button>
      </div>
      <div style="display:flex;gap:10px;height:calc(100vh - 100px);">
        <div id="dEquipWepList" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:3px;"></div>
        <div id="dEquipArList" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:3px;"></div>
        <div id="dEquipDetail" style="width:160px;border-left:1px solid #111;padding-left:10px;font-family:'Courier New',monospace;font-size:10px;color:#333;"></div>
      </div>
    </div>`;
  // 배경 그레인
  startDreamAmbient('dreamEquipCanvas');
  // 무기 목록
  const wl=document.getElementById('dEquipWepList');
  if(wl){
    const glitchW=['WAKE UP','RUN','THE SUN IS RISE','DO NOT LOOK','ERROR','THEY SEE YOU'];
    Object.keys(WEPS).filter(id=>owned[id]).forEach((id,i)=>{
      const w=WEPS[id]; const isEq=eqWepId===id;
      const div=document.createElement('div');
      div.style.cssText=`padding:8px 10px;border:1px solid ${isEq?'#fff':'#111'};cursor:pointer;font-family:'Courier New',monospace;font-size:9px;color:${isEq?'#fff':'#222'};letter-spacing:2px;background:${isEq?'rgba(255,255,255,0.03)':'transparent'};display:flex;justify-content:space-between;`;
      div.innerHTML=`<span>${w.icon} ${glitchW[i%glitchW.length]}</span>${isEq?'<span style="color:#555">■</span>':''}`;
      div.onmouseover=()=>{div.style.color='#888';div.style.borderColor='#444';};
      div.onmouseout=()=>{div.style.color=isEq?'#fff':'#222';div.style.borderColor=isEq?'#fff':'#111';};
      div.onclick=()=>{eqWepId=id;saveAll();checkDreamUnlock();renderDreamEquip();};
      wl.appendChild(div);
    });
  }
  // 갑옷 목록
  const al=document.getElementById('dEquipArList');
  if(al){
    const glitchA=['WAKE UP','THE LIMBO','EYE','OPEN YOUR EYES','...','RUNNING'];
    ARMORS.filter(a=>owned['ar_'+a.id]).forEach((ar,i)=>{
      const isEq=eqArmor===ar.id;
      const div=document.createElement('div');
      div.style.cssText=`padding:8px 10px;border:1px solid ${isEq?'#fff':'#111'};cursor:pointer;font-family:'Courier New',monospace;font-size:9px;color:${isEq?'#fff':'#222'};letter-spacing:2px;background:${isEq?'rgba(255,255,255,0.03)':'transparent'};display:flex;justify-content:space-between;`;
      div.innerHTML=`<span>${ar.icon} ${glitchA[i%glitchA.length]}</span>${isEq?'<span style="color:#555">■</span>':''}`;
      div.onmouseover=()=>{div.style.color='#888';div.style.borderColor='#444';};
      div.onmouseout=()=>{div.style.color=isEq?'#fff':'#222';div.style.borderColor=isEq?'#fff':'#111';};
      div.onclick=()=>{eqArmor=ar.id;saveAll();renderDreamEquip();checkDreamUnlock();};
      al.appendChild(div);
    });
  }
  // 드림 해금 체크
  checkDreamUnlock();
}

function checkDreamUnlock(){
  const btn=document.getElementById('dreamBtn');
  if(!btn)return;
  const unlocked = eqWepId==='clock_drop';
  btn.style.display = unlocked ? 'block' : 'none';
}


function exitDreamworld(){
  isDreamMode=false;
  stopScanline();
  if(window._dreamTitleItv){clearInterval(window._dreamTitleItv);window._dreamTitleItv=null;}
  triggerGlitchTransition(()=>{
    // gameCanvas 필터 초기화
    const gc=document.getElementById('gameCanvas');if(gc)gc.style.filter='';
    hideAllScreens();
    const lb=document.getElementById('sLobby');
    lb.classList.add('on');
    updRes();
  });
}

function startDreamGame(m){
  const dreamMap = {id:m.id, name:m.name, boss:m.boss, isBossMap:true, dream:true, bg:'#000', diff:99};
  triggerGlitchTransition(()=>{
    selMap = dreamMap;
    selWepId = 'minigun';
    // 게임 시작
    stopBGM();
    hideAllScreens();
    document.getElementById('gameCanvas').style.display='block';
    document.getElementById('gameUI').style.display='block';
    document.getElementById('pauseBtn').style.display='block';
    document.getElementById('skillBar').style.display='flex';
    skillCooldowns={E:0,Q:0};
    turrets=[];timeFreezeTimer=0;overclockTimer=0;focusNextShot=false;hpSnapshot=0;
    initGame();
    // 보스 즉시 스폰
    const bossKey = dreamMap.boss + '_boss';
    const bd = BOSSES[bossKey];
    if(bd){
      startBossMap(dreamMap.boss);
      spawnedCnt = 1;
    } else {
      console.error('드림 보스 없음:', bossKey, Object.keys(BOSSES).filter(k=>k.startsWith('dream')));
    }
    startLoop();
    updateSkillUI();
    // 드림코어 BGM 시작
    startDreamBGM();
  });
}

function startDreamBGM(){
  const el = document.getElementById('dreamBGM');
  if(!el) return;
  // 일반 BGM 정지
  const bgm = document.getElementById('bgmAudio');
  if(bgm){ bgm.pause(); bgm.currentTime=0; }
  el.volume = 0.6;
  el.play().catch(()=>{});
}
function stopDreamBGM(){
  const el = document.getElementById('dreamBGM');
  if(!el) return;
  el.pause(); el.currentTime=0;
}
