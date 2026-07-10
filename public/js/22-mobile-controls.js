// ════════════════════════════════════════════
// ══ 모바일 터치 컨트롤 (가상 조이스틱 + 발사/재장전) ══
// ════════════════════════════════════════════
const isMobileTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

function showMobileControls(){
  const el=document.getElementById('mobileControls');
  if(el) el.style.display = isMobileTouch ? 'block' : 'none';
}
function hideMobileControls(){
  const el=document.getElementById('mobileControls');
  if(el) el.style.display='none';
  touchDX=0; touchDY=0;
  resetJoystickKnob();
}
function mobileReload(){
  if(running && typeof startRel==='function') startRel();
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
    e.preventDefault();
    const t=e.changedTouches[0];
    joyTouchId=t.identifier;
    updateJoystick(t.clientX,t.clientY);
  },{passive:false});
  base.addEventListener('touchmove',e=>{
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
    if(!P) return;
    if(fireMode==='semi'){P._semiOn=!P._semiOn;updSemiIndicator();return;}
    if(fireMode==='auto')return;
    P._mdown=true;
    if(!P.ws.auto) fireWep();
  },{passive:false});
  fireBtn.addEventListener('touchend',e=>{ e.preventDefault(); if(P)P._mdown=false; });
  fireBtn.addEventListener('touchcancel',e=>{ if(P)P._mdown=false; });
})();

function resetJoystickKnob(){
  const knob=document.getElementById('joystickKnob');
  if(knob) knob.style.transform='translate(0,0)';
}
