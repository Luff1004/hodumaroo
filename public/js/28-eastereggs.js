// ══════════════ 히든 이스터에그 6종 ══════════════
// 찾기 어렵지만, 찾으면 게임의 세계관(드림코어/시크릿코드)과 이어지는 보상.

// ── 공통 헬퍼: 히든 업적 해금 + 알림 ──
function showEggToast(html){
  let t=document.getElementById('eggToast');
  if(!t){
    t=document.createElement('div');
    t.id='eggToast';
    t.style.cssText='position:fixed;top:14px;left:50%;transform:translateX(-50%) translateY(-20px);background:linear-gradient(135deg,#1e1033,#4c1d95);color:#f0abfc;padding:12px 22px;border-radius:14px;border:1.5px solid #a855f7;font-size:13px;font-weight:800;z-index:9999;box-shadow:0 8px 30px rgba(0,0,0,.5);opacity:0;transition:all .4s;text-align:center;pointer-events:none;max-width:90vw;';
    document.body.appendChild(t);
  }
  t.innerHTML=html;
  requestAnimationFrame(()=>{t.style.opacity='1';t.style.transform='translateX(-50%) translateY(0)';});
  clearTimeout(t._hideT);
  t._hideT=setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(-50%) translateY(-20px)';},4200);
}
function unlockEgg(flagKey,achId){
  const wasDone=!!achData[achId];
  achStats[flagKey]=1;
  saveAch();
  checkAchievements();
  if(!wasDone&&achData[achId]){
    const a=ACHIEVEMENTS.find(x=>x.id===achId);
    if(a)showEggToast('🏆 히든 업적: '+a.name+'<br><span style="font-size:11px;font-weight:600;color:#c4b5fd;">'+a.desc+'</span>');
  }
}

// ══ 1. 버전 표기 클릭 — "빌드 번호는 거짓말이다" ══
// 로비 하단 "호두마루 v1.0" 문구를 짧은 시간 안에 10번 누르면 화면이 잠깐 글리치되며 진실을 드러낸다.
(function(){
  const verEl=document.querySelector('.ver');
  if(!verEl)return;
  let clicks=0,resetT=null;
  verEl.addEventListener('click',()=>{
    clicks++;
    clearTimeout(resetT);
    resetT=setTimeout(()=>{clicks=0;},1500);
    if(clicks>=10){
      clicks=0;
      triggerVersionEgg();
    }
  });
})();
function triggerVersionEgg(){
  if(window._versionEggRunning||typeof triggerGlitchTransition!=='function')return;
  window._versionEggRunning=true;
  const verEl=document.querySelector('.ver');
  const orig=verEl?verEl.textContent:'';
  if(verEl)verEl.textContent='v0.0 ― UNSTABLE BUILD';
  triggerGlitchTransition(()=>{
    if(verEl)verEl.textContent=orig;
    window._versionEggRunning=false;
    unlockEgg('egg_version','secret_3');
  });
}

// ══ 2. 개발자 콘솔 힌트 — "그들이 보고 있었다" ══
// 콘솔을 여는 사람에게만 보이는 코드 힌트. 코드 입력창(CODE)에 넣으면 히든 업적 해금.
console.log('%c호두마루','font-size:34px;font-weight:900;color:#7c3aed;');
console.log('%c개발자 도구를 여신 걸 보니, 뭔가를 찾고 계시는군요.','font-size:12px;color:#a855f7;');
console.log('%c...누군가는, 항상 지켜보고 있습니다.','font-size:11px;color:#6b7280;font-style:italic;');
console.log('%c로비의 🔑 CODE 입력창에 이걸 넣어보세요 → %cITSEESYOU','font-size:11px;color:#e5e7eb;','font-size:14px;font-weight:900;color:#4ade80;background:#111;padding:2px 8px;border-radius:4px;');

// ══ 3. 코나미 커맨드 — "낡은 커맨드" ══
// 로비 화면에서 ↑↑↓↓←→←→B A 입력 시 낙서 스마일 컨페티가 쏟아진다 (리소스팩 DOODLE!~과 연결).
(function(){
  const seq=['arrowup','arrowup','arrowdown','arrowdown','arrowleft','arrowright','arrowleft','arrowright','b','a'];
  let idx=0;
  document.addEventListener('keydown',e=>{
    const scr=document.querySelector('.screen.on')?.id;
    if(scr!=='sLobby'){idx=0;return;}
    const k=e.key.toLowerCase();
    if(k===seq[idx]){
      idx++;
      if(idx===seq.length){idx=0;triggerKonamiEgg();}
    } else {
      idx=(k===seq[0])?1:0;
    }
  });
})();
function triggerKonamiEgg(){
  unlockEgg('egg_konami','secret_5');
  spawnDoodleConfetti();
}
function spawnDoodleConfetti(){
  const n=22;
  for(let i=0;i<n;i++){
    const img=document.createElement('img');
    img.src='/images/resourcepacks/doodle_face.png';
    const startRot=Math.random()*360;
    img.style.cssText=`position:fixed;top:-60px;left:${Math.random()*96}vw;width:${26+Math.random()*28}px;z-index:9998;pointer-events:none;opacity:.92;transform:rotate(${startRot}deg);`;
    document.body.appendChild(img);
    const dur=2000+Math.random()*1400;
    const drift=(Math.random()-0.5)*180;
    if(img.animate){
      img.animate([
        {transform:`translate(0,0) rotate(${startRot}deg)`,opacity:.92},
        {transform:`translate(${drift}px, 108vh) rotate(${startRot+Math.random()*540-270}deg)`,opacity:.85}
      ],{duration:dur,easing:'ease-in'});
    }
    setTimeout(()=>img.remove(),dur+50);
  }
}

// ══ 4. 로비의 눈 — "누군가 지켜보고 있다" ══
// 로비에서 3분간 아무 조작도 하지 않으면, 드림코어의 눈이 잠깐 나타났다 사라진다. 클릭해서 붙잡으면 성공.
let _eggLastInteract=Date.now();
['click','keydown','mousemove','touchstart'].forEach(ev=>document.addEventListener(ev,()=>{_eggLastInteract=Date.now();},{passive:true}));
let _eggEyeShown=false;
setInterval(()=>{
  const scr=document.querySelector('.screen.on')?.id;
  if(scr!=='sLobby'||_eggEyeShown)return;
  if(Date.now()-_eggLastInteract>=180000)showIdleEye();
},5000);
function showIdleEye(){
  if(typeof EYE1==='undefined')return;
  _eggEyeShown=true;
  const eyeSrcs=[EYE1,EYE2,EYE3].filter(Boolean);
  const src=eyeSrcs[Math.floor(Math.random()*eyeSrcs.length)];
  const el=document.createElement('img');
  el.src=src;
  const pos=[
    'top:16px;left:16px;','top:16px;right:16px;',
    'bottom:16px;left:16px;','bottom:16px;right:16px;'
  ][Math.floor(Math.random()*4)];
  el.style.cssText=`position:fixed;${pos}width:64px;height:64px;object-fit:cover;border-radius:50%;z-index:9997;opacity:0;filter:grayscale(100%) brightness(.5);cursor:pointer;transition:opacity 1.1s;box-shadow:0 0 24px rgba(0,0,0,.65);`;
  document.body.appendChild(el);
  requestAnimationFrame(()=>{el.style.opacity='0.85';});
  let caught=false;
  el.addEventListener('click',ev=>{
    ev.stopPropagation();
    if(caught)return;
    caught=true;
    el.style.transition='opacity .3s,filter .3s';
    el.style.filter='grayscale(0%) brightness(1.1)';
    unlockEgg('egg_eye','secret_6');
    setTimeout(()=>{el.style.opacity='0';setTimeout(()=>el.remove(),400);},250);
  });
  setTimeout(()=>{
    if(!caught){el.style.opacity='0';setTimeout(()=>el.remove(),1200);}
    _eggEyeShown=false;
    _eggLastInteract=Date.now();
  },3200);
}

// ══ 5. 정지된 시간 — "정지된 시간 속에서" ══
// 게임 플레이 중 60초간 완전히 움직이지 않으면 글리치 엔티티가 스쳐 지나간다.
let _eggStillSec=0,_eggStillLastX=null,_eggStillLastY=null,_eggStillTriggered=false;
setInterval(()=>{
  if(typeof running==='undefined'||!running||(typeof paused!=='undefined'&&paused)||typeof P==='undefined'||!P){
    _eggStillSec=0;_eggStillLastX=null;_eggStillTriggered=false;return;
  }
  if(_eggStillLastX===P.x&&_eggStillLastY===P.y){
    _eggStillSec++;
  } else {
    _eggStillSec=0;_eggStillTriggered=false;
  }
  _eggStillLastX=P.x;_eggStillLastY=P.y;
  if(_eggStillSec>=60&&!_eggStillTriggered){
    _eggStillTriggered=true;
    spawnGlitchCameo();
    unlockEgg('egg_stillness','secret_7');
  }
},1000);
function spawnGlitchCameo(){
  if(typeof effs==='undefined'||typeof P==='undefined'||!P)return;
  const ang=Math.random()*Math.PI*2,dist=140+Math.random()*60;
  effs.push({type:'glitchCameo',x:P.x+Math.cos(ang)*dist,y:P.y+Math.sin(ang)*dist,l:180,ml:180});
}

// ══ 6. 진짜 각성 — 드림코어에서 "WAKEUP" 타이핑 ══
// 반복되던 "WAKE UP" 문구를 직접 되뇌면, 꿈이 스스로 답한다.
(function(){
  let buf='';
  document.addEventListener('keydown',e=>{
    const scr=document.querySelector('.screen.on')?.id;
    if(scr!=='sDream'){buf='';return;}
    if(/^[a-zA-Z]$/.test(e.key)){
      buf=(buf+e.key.toUpperCase()).slice(-8);
      if(buf.includes('WAKEUP')){
        buf='';
        triggerTrueWake();
      }
    }
  });
})();
function triggerTrueWake(){
  if(window._trueWakeRunning||typeof triggerGlitchTransition!=='function')return;
  window._trueWakeRunning=true;
  triggerGlitchTransition(()=>{
    const overlay=document.createElement('div');
    overlay.id='trueWakeOverlay';
    overlay.style.cssText='position:fixed;inset:0;background:#000;z-index:9500;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 1.2s;';
    const line=document.createElement('div');
    line.style.cssText='font-family:"Courier New",monospace;color:#e5e7eb;font-size:clamp(14px,2.2vw,20px);letter-spacing:2px;text-align:center;padding:20px;max-width:80vw;opacity:0;transition:opacity 1s;';
    line.textContent='당신은 이미 알고 있었다.';
    overlay.appendChild(line);
    document.body.appendChild(overlay);
    requestAnimationFrame(()=>{overlay.style.opacity='1';});
    setTimeout(()=>{line.style.opacity='1';},900);
    setTimeout(()=>{line.style.opacity='0';setTimeout(()=>{line.textContent='이 모든 것이 반복되어 왔다는 것을.';line.style.opacity='1';},250);},3200);
    setTimeout(()=>{line.style.opacity='0';setTimeout(()=>{line.textContent='그래도, 오늘은 조금 더 깨어있다.';line.style.opacity='1';},250);},5800);
    setTimeout(()=>{
      overlay.style.opacity='0';
      setTimeout(()=>{
        overlay.remove();
        window._trueWakeRunning=false;
        unlockEgg('egg_trueawaken','secret_8');
      },1200);
    },8600);
  });
}
