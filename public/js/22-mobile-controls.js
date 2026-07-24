// ════════════════════════════════════════════
// ══ 모바일 터치 컨트롤 (가상 조이스틱 + 발사/재장전) ══
// ════════════════════════════════════════════
const isMobileTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

function showMobileControls(){
  const el=document.getElementById('mobileControls');
  if(el) el.style.display = isMobileTouch ? 'block' : 'none';
  if(typeof applyControlMode==='function')applyControlMode();
  const noWeapons=typeof selMap!=='undefined'&&selMap&&selMap.noWeapons;
  const fireBtn=document.getElementById('mobileFireBtn'),reloadBtn=document.getElementById('mobileReloadBtn');
  if(noWeapons){ if(fireBtn)fireBtn.style.display='none'; if(reloadBtn)reloadBtn.style.display='none'; }
}
function hideMobileControls(){
  const el=document.getElementById('mobileControls');
  if(el) el.style.display='none';
  touchDX=0; touchDY=0;
  resetJoystickKnob();
  if(typeof resetFreeJoystick==='function')resetFreeJoystick();
}
function mobileReload(){
  if(running && typeof startRel==='function') startRel();
}

// ── 조작 모드 적용: 간단 모드에서는 고정 조이스틱/발사 버튼을 숨기고 발사 모드를 자동으로 고정 ──
function applyControlMode(){
  if(!isMobileTouch)return;
  const simple=typeof getControlMode==='function'&&getControlMode()==='simple';
  const base=document.getElementById('joystickBase');
  const fireBtn=document.getElementById('mobileFireBtn');
  const reloadBtn=document.getElementById('mobileReloadBtn');
  const fmBtn=document.getElementById('fireModeBtn');
  if(base)base.style.display=simple?'none':'block';
  if(fireBtn)fireBtn.style.display=simple?'none':'block';
  if(reloadBtn)reloadBtn.style.display=simple?'none':'block';
  if(simple){
    if(typeof fireMode!=='undefined'&&fireMode!=='auto'){
      fireMode='auto';
      localStorage.setItem('hd_fireMode','auto');
      if(typeof updFireModeBtn==='function')updFireModeBtn();
      if(typeof updSemiIndicator==='function')updSemiIndicator();
    }
    if(fmBtn)fmBtn.style.display='none';
  } else {
    if(fmBtn&&running)fmBtn.style.display='block';
  }
}

(function(){
  if(!isMobileTouch) return;
  const base=document.getElementById('joystickBase');
  const knob=document.getElementById('joystickKnob');
  const fireBtn=document.getElementById('mobileFireBtn');
  if(!base||!knob||!fireBtn) return;

  const JOY_RADIUS=45; // 최대 이동 반경(px)
  let joyTouchId=null;

  function joyCenter(){
    const r=base.getBoundingClientRect();
    return {x:r.left+r.width/2, y:r.top+r.height/2};
  }
  function updateJoystick(clientX,clientY){
    const c=joyCenter();
    let dx=clientX-c.x, dy=clientY-c.y;
    const dist=Math.hypot(dx,dy);
    if(dist>JOY_RADIUS){ dx=dx/dist*JOY_RADIUS; dy=dy/dist*JOY_RADIUS; }
    knob.style.transform=`translate(${dx}px,${dy}px)`;
    touchDX=dx/JOY_RADIUS; touchDY=dy/JOY_RADIUS;
  }
  base.addEventListener('touchstart',e=>{
    if(getControlMode()==='simple')return;
    e.preventDefault();
    const t=e.changedTouches[0];
    joyTouchId=t.identifier;
    updateJoystick(t.clientX,t.clientY);
  },{passive:false});
  base.addEventListener('touchmove',e=>{
    if(getControlMode()==='simple')return;
    for(const t of e.changedTouches){
      if(t.identifier===joyTouchId){ e.preventDefault(); updateJoystick(t.clientX,t.clientY); }
    }
  },{passive:false});
  function endJoyTouch(e){
    for(const t of e.changedTouches){
      if(t.identifier===joyTouchId){ joyTouchId=null; touchDX=0; touchDY=0; resetJoystickKnob(); }
    }
  }
  base.addEventListener('touchend',endJoyTouch);
  base.addEventListener('touchcancel',endJoyTouch);

  fireBtn.addEventListener('touchstart',e=>{
    e.preventDefault();
    // 폭풍구역 모드
    if(typeof sz!=='undefined'&&sz&&sz.running){ sz._mdown=true; return; }
    if(getControlMode()==='simple')return;
    if(typeof selMap!=='undefined'&&selMap&&selMap.noWeapons)return;
    if(!P) return;
    if(fireMode==='semi'){P._semiOn=!P._semiOn;updSemiIndicator();return;}
    if(fireMode==='auto')return;
    P._mdown=true;
    if(!P.ws.auto) fireWep();
  },{passive:false});
  fireBtn.addEventListener('touchend',e=>{
    e.preventDefault();
    if(typeof sz!=='undefined'&&sz&&sz.running){ sz._mdown=false; return; }
    if(P) P._mdown=false;
  });
  fireBtn.addEventListener('touchcancel',e=>{
    if(typeof sz!=='undefined'&&sz&&sz.running){ sz._mdown=false; return; }
    if(P) P._mdown=false;
  });
})();

// ── 간단 모드: 화면 아무 곳이나 터치해서 이동(터치 지점에 동적 가상패드 표시) ──
(function(){
  if(!isMobileTouch) return;
  const canvas=document.getElementById('gameCanvas');
  if(!canvas) return;

  const FREE_RADIUS=45;
  let freeTouchId=null, originX=0, originY=0;
  function resetFreeJoystick(){
    touchDX=0;touchDY=0;
  }
  window.resetFreeJoystick=resetFreeJoystick;

  function updateFree(clientX,clientY){
    let dx=clientX-originX, dy=clientY-originY;
    const dist=Math.hypot(dx,dy);
    if(dist>FREE_RADIUS){ dx=dx/dist*FREE_RADIUS; dy=dy/dist*FREE_RADIUS; }
    touchDX=dx/FREE_RADIUS; touchDY=dy/FREE_RADIUS;
  }

  // 폭풍구역 조준 (오른손 터치 → 조준 방향)
  let szAimTouchId = null;
  function szUpdateAim(clientX, clientY) {
    if(typeof sz==='undefined'||!sz||!sz.running) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    sz._mouseX = (clientX - rect.left) * scaleX;
    sz._mouseY = (clientY - rect.top) * scaleY;
  }

  canvas.addEventListener('touchstart',e=>{
    // 폭풍구역 모드: 오른쪽 터치 = 조준+발사
    if(typeof sz!=='undefined'&&sz&&sz.running){
      e.preventDefault();
      for(const t of e.changedTouches){
        const rect=canvas.getBoundingClientRect();
        if(t.clientX > rect.left + rect.width*0.45){ // 화면 오른쪽 절반
          szAimTouchId=t.identifier;
          szUpdateAim(t.clientX,t.clientY);
          sz._mdown=true;
        }
      }
      return;
    }
    if(!running||getControlMode()!=='simple')return;
    if(freeTouchId!==null)return;
    e.preventDefault();
    const t=e.changedTouches[0];
    freeTouchId=t.identifier;
    originX=t.clientX;originY=t.clientY;
    updateFree(t.clientX,t.clientY);
  },{passive:false});
  canvas.addEventListener('touchmove',e=>{
    // 폭풍구역 조준 이동
    if(typeof sz!=='undefined'&&sz&&sz.running){
      for(const t of e.changedTouches){
        if(t.identifier===szAimTouchId){ e.preventDefault(); szUpdateAim(t.clientX,t.clientY); }
      }
      return;
    }
    if(freeTouchId===null)return;
    for(const t of e.changedTouches){
      if(t.identifier===freeTouchId){ e.preventDefault(); updateFree(t.clientX,t.clientY); }
    }
  },{passive:false});
  function endFree(e){
    // 폭풍구역 발사 종료
    if(typeof sz!=='undefined'&&sz&&sz.running){
      for(const t of e.changedTouches){
        if(t.identifier===szAimTouchId){ szAimTouchId=null; if(sz)sz._mdown=false; }
      }
      return;
    }
    for(const t of e.changedTouches){
      if(t.identifier===freeTouchId){ freeTouchId=null; resetFreeJoystick(); }
    }
  }
  canvas.addEventListener('touchend',endFree);
  canvas.addEventListener('touchcancel',endFree);
})();

function resetJoystickKnob(){
  const knob=document.getElementById('joystickKnob');
  if(knob) knob.style.transform='translate(0,0)';
}
