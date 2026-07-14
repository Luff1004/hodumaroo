// ══════════════ 리소스팩 (이스터에그) ══════════════
const RESOURCE_PACKS=[
  {id:'doodle',name:'DOODLE!~',icon:'😃',desc:'모든 몬스터 얼굴에 낙서 스마일을 덧씌워요',face:true},
  {id:'neon',name:'네온 나이트',icon:'🌃',desc:'네온사인처럼 화려한 색감의 밤거리 테마',filter:'hue-rotate(280deg) saturate(220%) brightness(1.15) contrast(1.1)'},
  {id:'retro',name:'레트로 필름',icon:'📼',desc:'옛날 영화 필름 같은 세피아 톤',filter:'sepia(0.75) contrast(1.15) brightness(0.9) saturate(1.3)'},
  {id:'noir',name:'흑백 느와르',icon:'🎬',desc:'그림자 짙은 흑백 영화 분위기',filter:'grayscale(1) contrast(1.35) brightness(1.05)'},
  {id:'invert',name:'인버트 유니버스',icon:'🌀',desc:'색이 전부 뒤집힌 이상한 차원',filter:'invert(1) hue-rotate(180deg)'},
  {id:'pastel',name:'몽환 파스텔',icon:'🍬',desc:'몽글몽글 부드러운 파스텔 꿈나라',filter:'saturate(55%) brightness(1.2) contrast(0.85) blur(0.4px)'},
  {id:'glitch',name:'글리치 매트릭스',icon:'🟢',desc:'초록빛으로 물든 디지털 오류 공간',filter:'hue-rotate(100deg) saturate(180%) contrast(1.3) brightness(0.95)'},
];
let selectedRP=lS('hd_rp','');
function saveRP(){sv('hd_rp',selectedRP||'');}
function isRPUnlocked(){
  if(typeof devModeUnlocked!=='undefined'&&devModeUnlocked)return true;
  return typeof PUGR!=='undefined'&&PUGR.every(u=>(pUpgLv[u.id]||0)>=u.m);
}
function updateRPButton(){
  const btn=document.getElementById('btn-rpack');if(!btn)return;
  if(isRPUnlocked()){
    btn.textContent='🎨 리소스팩';
    btn.style.background='linear-gradient(135deg,#7c3aed,#c026d3)';
    btn.style.color='#fff';
    btn.style.border='1.5px solid #f0abfc';
  } else {
    btn.textContent='🔒 ???';
    btn.style.background='linear-gradient(135deg,#334155,#1e293b)';
    btn.style.color='#94a3b8';
    btn.style.border='1.5px solid #475569';
  }
}
function openResourcePack(){
  if(!isRPUnlocked()){
    const btn=document.getElementById('btn-rpack');
    if(btn&&!btn._rpMsgT){
      const prev=btn.textContent;
      btn.textContent='영구업그레이드 전부 MAX 시 해금!';
      btn._rpMsgT=setTimeout(()=>{btn.textContent=prev;btn._rpMsgT=null;},1800);
    }
    return;
  }
  go('sResourcePack');
}
function selectRP(id){selectedRP=id;saveRP();renderResourcePackList();}
function renderResourcePackList(){
  const g=document.getElementById('rpList');if(!g)return;
  g.innerHTML='';
  const none=document.createElement('div');
  none.className='si'+(!selectedRP?' own':' cb2');
  none.innerHTML=`<div class="sico">🎮</div><div class="snm">기본</div>`+
    `<div style="font-size:9px;color:#6b7280;margin-top:2px;">원래 몬스터 모습 그대로</div>`+
    `<div style="font-size:9px;font-weight:800;color:${!selectedRP?'#16a34a':'#a855f7'};margin-top:6px;">${!selectedRP?'✅ 적용중':'적용하기'}</div>`;
  none.onclick=()=>selectRP('');
  g.appendChild(none);
  RESOURCE_PACKS.forEach(rp=>{
    const isSel=selectedRP===rp.id;
    const d=document.createElement('div');
    d.className='si'+(isSel?' own':' cb2');
    const icoHtml=rp.face
      ?`<div class="sico"><img src="/images/resourcepacks/doodle_face.png" style="width:32px;height:auto;display:block;margin:0 auto;"></div>`
      :`<div class="sico">${rp.icon}</div>`;
    d.innerHTML=icoHtml+
      `<div class="snm">${rp.name}</div>`+
      `<div style="font-size:9px;color:#6b7280;margin-top:2px;">${rp.desc}</div>`+
      `<div style="font-size:9px;font-weight:800;color:${isSel?'#16a34a':'#a855f7'};margin-top:6px;">${isSel?'✅ 적용중':'적용하기'}</div>`;
    d.onclick=()=>selectRP(rp.id);
    g.appendChild(d);
  });
}
function getActiveRPFilter(){
  if(!isRPUnlocked()||!selectedRP)return 'none';
  const rp=RESOURCE_PACKS.find(r=>r.id===selectedRP);
  if(!rp||rp.face)return 'none';
  return rp.filter||'none';
}
const RP_DOODLE_IMG=new Image();
RP_DOODLE_IMG.src='/images/resourcepacks/doodle_face.png';
function drawRPFace(z){
  if(!isRPUnlocked()||selectedRP!=='doodle'||z.dead)return;
  if(z.type==='ghost'&&z._phased)return;
  if(!RP_DOODLE_IMG.complete||!RP_DOODLE_IMG.naturalWidth)return;
  const ar=RP_DOODLE_IMG.naturalWidth/RP_DOODLE_IMG.naturalHeight;
  const w=Math.max(20,Math.min(z.r*1.7,70));
  const h=w/ar;
  ctx.drawImage(RP_DOODLE_IMG,z.x-w/2,z.y-h/2,w,h);
}
updateRPButton();
