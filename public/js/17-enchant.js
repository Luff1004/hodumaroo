// ════════════════════════════════════════════
// ══ 인챈트 시스템 ══
// ════════════════════════════════════════════

// enchants: {itemKey: tierIndex}  itemKey = 무기id / 'ar_'+갑옷id / 'job_'+직업id
let enchants = lJ('hd_enchants', {});
function saveEnchants(){ sv('hd_enchants', enchants); }

const ENCHANT_COST = 50000;

// 등급표 (commonest → rarest)
const ENCHANT_TIERS = [
  {chance:70,     name:'화염의 손길'},
  {chance:60,     name:'불의 손길'},
  {chance:50,     name:'나노 파워'},
  {chance:45,     name:'돌연변이'},
  {chance:40,     name:'수퍼(무지개빛)'},
  {chance:35,     name:'무지개'},
  {chance:30,     name:'하늘의 무기'},
  {chance:25,     name:'천상'},
  {chance:23.5,   name:'잉크'},
  {chance:20,     name:'HELL'},
  {chance:15,     name:'THE TURE'},
  {chance:10,     name:'이 무기는 좋아요!~'},
  {chance:8,      name:'IOT'},
  {chance:7,      name:'LOL',        cutscene:180},
  {chance:5,      name:'오이',       cutscene:180},
  {chance:3,      name:'???',        cutscene:180},
  {chance:2,      name:'XXX',        cutscene:180},
  {chance:1,      name:'공간',       cutscene:600},
  {chance:0.2,    name:'차원',       cutscene:1200},
  {chance:0.002,  name:'신',         cutscene:1800},
  {chance:0.0001,                             name:'초월의 신',   cutscene:2400},
  {chance:0.00002,                            name:'창조주',      cutscene:2700},
  {chance:0.0000002,                          name:'태초',        cutscene:3000},
  {chance:0.0000000004,                       name:'무(無)',      cutscene:3600},
  {chance:0.000000000000000000000000001,     name:'존재 그 자체',cutscene:5400},
];

// ── 행운(potion) 시스템 ──
// pendingRollLuck: 다음 인챈트 "1회"에만 적용되는 강력한 행운 (SOL'S RNG의 천상의 물약 컨셉)
let pendingRollLuck = lJ('hd_pending_luck', 0);
let potionInv = lJ('hd_potion_inv', {}); // {potionId: count}
let potionBuff = lJ('hd_potion_buff', null); // {mult, expiresAt} - 5분 임시 버프
function savePotionState(){ sv('hd_pending_luck', pendingRollLuck); sv('hd_potion_inv', potionInv); sv('hd_potion_buff', potionBuff); }

function currentLuckMult(){
  let m = 1;
  if(potionBuff && potionBuff.expiresAt > Date.now()) m += potionBuff.mult;
  else if(potionBuff) { potionBuff = null; savePotionState(); }
  return m;
}

// 30종 물약: 23종 반복 구매형(5분 임시버프) + 7종 1회용 "단발 대박 행운"형
const POTIONS = [];
for(let i=0;i<23;i++){
  const luck = +(0.15 + i*0.13).toFixed(2);
  const price = Math.round(3000*(i+1)*(i+1)*3 + 2000);
  POTIONS.push({id:'pot_temp_'+i, name:`행운의 물약 Lv.${i+1}`, icon:'🧪', price, luck, burst:false,
    desc:`5분간 행운 +${luck}`});
}
const BURST_POTIONS = [
  {id:'pot_perm_1', name:'축복의 물약', icon:'✨', price:2000000,   luck:20},
  {id:'pot_perm_2', name:'성스러운 물약', icon:'🕊️', price:5000000,   luck:50},
  {id:'pot_perm_3', name:'기적의 물약', icon:'🌈', price:8000000,   luck:100},
  {id:'pot_perm_4', name:'천상의 물약', icon:'☁️', price:10000000,  luck:200},
  {id:'pot_perm_5', name:'초월의 물약', icon:'🌠', price:20000000,  luck:500},
  {id:'pot_perm_6', name:'전능의 물약', icon:'👁️', price:50000000,  luck:2000},
  {id:'pot_perm_7', name:'신화의 물약', icon:'🌌', price:100000000, luck:10000},
];
BURST_POTIONS.forEach(p=>{p.burst=true;p.desc=`다음 인챈트 1회에만 행운 x${p.luck} 적용 (1회용, 영구 아님)`;POTIONS.push(p);});

function buyPotion(id){
  const p = POTIONS.find(x=>x.id===id);
  if(!p||coins<p.price) return;
  coins-=p.price; sv('hd_c',coins); updRes();
  potionInv[id]=(potionInv[id]||0)+1;
  savePotionState();
  renderPotionShop();
}
function drinkPotion(id){
  const p = POTIONS.find(x=>x.id===id);
  if(!p||!potionInv[id]) return;
  potionInv[id]--;
  if(potionInv[id]<=0) delete potionInv[id];
  if(p.burst){
    pendingRollLuck = p.luck; // 단발성 - 덮어쓰기(가장 최근 마신 것 적용)
  } else {
    const curMult = potionBuff&&potionBuff.expiresAt>Date.now()?potionBuff.mult:0;
    potionBuff = {mult: curMult+p.luck, expiresAt: Date.now()+300000};
  }
  savePotionState();
  renderPotionShop();
}

function openPotionShop(){ go('sPotionShop'); }
function renderPotionShop(){
  const g=document.getElementById('potionGrid'); if(!g) return;
  g.innerHTML='';
  document.getElementById('potionLuckDisp').textContent = '현재 행운 배율: x'+currentLuckMult().toFixed(2)+(pendingRollLuck>0?' · 다음 인챈트 대박 행운 대기중: x'+pendingRollLuck:'');
  POTIONS.forEach(p=>{
    const owned = potionInv[p.id]||0;
    const cb = coins>=p.price;
    const d=document.createElement('div');
    d.className='si'+(owned?' own':cb?' cb2':'')+(p.burst?' rar-legendary':'');
    d.innerHTML = `<div class="sico">${p.icon}</div><div class="snm">${p.name}</div>`+
      `<div style="font-size:9px;color:#c4b5fd;margin-top:3px;">${p.desc}</div>`+
      `<div style="font-size:10px;font-weight:700;color:${cb?'#fbbf24':'#6b7280'};margin-top:4px;">🪙${p.price.toLocaleString()}</div>`+
      (owned?`<div style="font-size:9px;color:#4ade80;margin-top:2px;">보유 ${owned}개</div>`:'');
    const btnRow=document.createElement('div');btnRow.style.cssText='display:flex;gap:4px;margin-top:6px;justify-content:center;';
    const buyBtn=document.createElement('button');buyBtn.className='bybtn';buyBtn.textContent='구매';buyBtn.disabled=!cb;
    buyBtn.onclick=()=>buyPotion(p.id);
    btnRow.appendChild(buyBtn);
    if(owned){
      const drinkBtn=document.createElement('button');drinkBtn.className='bybtn';drinkBtn.style.background='linear-gradient(135deg,#7c3aed,#a855f7)';drinkBtn.textContent='마시기';
      drinkBtn.onclick=()=>drinkPotion(p.id);
      btnRow.appendChild(drinkBtn);
    }
    d.appendChild(btnRow);
    g.appendChild(d);
  });
}

// ── 인챈트 홀 ──
let enchantCat = 'wep'; // wep | armor | job
let enchantSelId = null;
function setEnchantCat(cat,btn){
  enchantCat=cat; enchantSelId=null;
  document.querySelectorAll('#sEnchant .stab').forEach(b=>b.classList.remove('on'));
  if(btn)btn.classList.add('on');
  renderEnchantList();
  renderEnchantProbTable();
}
function renderEnchantProbTable(){
  const t=document.getElementById('enchantProbTable'); if(!t) return;
  t.innerHTML = ENCHANT_TIERS.map(x=>`<div>${x.chance}% : ${x.name}</div>`).join('');
}
function enchantKey(){
  if(!enchantSelId) return null;
  if(enchantCat==='wep') return enchantSelId;
  if(enchantCat==='armor') return 'ar_'+enchantSelId;
  return 'job_'+enchantSelId;
}
// 장비칸/목록에 표시할 보라빛 "성능 향상" 설명 텍스트
function enchantStatText(itemKey,cat){
  const tier=enchants[itemKey];
  if(tier==null) return '';
  const pct=(tier+1)*10;
  const label = cat==='wep'?'데미지가':cat==='armor'?'방어력이':'능력치가';
  return `<div style="color:#c084fc;font-size:9px;font-weight:700;margin-top:2px;">✨ 인챈트로 ${label} ${pct}% 강화됨</div>`;
}
function renderEnchantList(){
  const list=document.getElementById('enchantList'); if(!list) return;
  list.innerHTML='';
  let items=[];
  if(enchantCat==='wep') items=Object.keys(WEPS).filter(id=>owned[id]).map(id=>({id,name:WEPS[id].name,icon:WEPS[id].icon}));
  else if(enchantCat==='armor') items=ARMORS.filter(a=>owned['ar_'+a.id]).map(a=>({id:a.id,name:a.name+'갑옷',icon:a.icon}));
  else items=JOBS.filter(j=>ownedJobs[j.id]).map(j=>({id:j.id,name:j.name,icon:j.icon}));
  if(items.length===0){list.innerHTML='<div style="color:#c4b5fd;font-size:12px;padding:20px;text-align:center;">보유한 항목이 없습니다</div>';return;}
  items.forEach(it=>{
    const key = enchantCat==='wep'?it.id:enchantCat==='armor'?'ar_'+it.id:'job_'+it.id;
    const tier = enchants[key];
    const isSel = enchantSelId===it.id;
    const d=document.createElement('div');
    d.className='ei'+(isSel?' eq':'');
    d.style.cursor='pointer';
    d.innerHTML=`<div class="eico">${it.icon}</div><div><div class="enm" style="color:#e9d5ff;">${it.name}</div><div class="elv" style="color:#c4b5fd;">${tier!=null?'✨ '+ENCHANT_TIERS[tier].name:'미인챈트'}</div>${enchantStatText(key,enchantCat)}</div>`;
    d.onclick=()=>{enchantSelId=it.id;renderEnchantList();renderEnchantDetail();};
    list.appendChild(d);
  });
  renderEnchantDetail();
}
function renderEnchantDetail(){
  const det=document.getElementById('enchantDetail'); if(!det) return;
  if(!enchantSelId){ det.innerHTML='<div style="color:#c4b5fd;font-size:13px;">왼쪽에서 인챈트할 대상을 선택하세요</div>'; return; }
  const key=enchantKey();
  const tier=enchants[key];
  const cb = coins>=ENCHANT_COST;
  det.innerHTML = `
    <div style="font-size:16px;color:#fbbf24;font-weight:800;margin-bottom:8px;">${tier!=null?'✨ '+ENCHANT_TIERS[tier].name:'미인챈트 상태'}</div>
    ${tier!=null?enchantStatText(key,enchantCat):''}
    <div style="font-size:12px;color:#c4b5fd;margin:12px 0;">인챈트 비용: 🪙${ENCHANT_COST.toLocaleString()}<br>현재 행운 배율: x${currentLuckMult().toFixed(2)}${pendingRollLuck>0?' <span style="color:#fbbf24;">(대박 행운 x'+pendingRollLuck+' 대기중)</span>':''}</div>
    <button class="mok" id="doEnchantBtn" style="width:100%;padding:22px 0;font-size:20px;background:linear-gradient(135deg,#6d28d9,#a855f7);box-shadow:0 4px 24px #a855f760;" ${cb?'':'disabled'}>🔮 인챈트하기</button>
    <button class="mok" style="width:100%;padding:14px 0;margin-top:10px;background:linear-gradient(135deg,#4c1d95,#7c3aed);" onclick="openPotionShop()">🧪 물약 상점</button>
  `;
  document.getElementById('doEnchantBtn').onclick=doEnchant;
}
function rollEnchantTier(){
  const luck=currentLuckMult()*(pendingRollLuck>0?pendingRollLuck:1);
  const sorted=[...ENCHANT_TIERS].map((t,i)=>({...t,idx:i})).sort((a,b)=>a.chance-b.chance);
  for(const t of sorted){
    if(Math.random()*100 < t.chance*luck) return t.idx;
  }
  return 0;
}
function doEnchant(){
  const key=enchantKey();
  if(!key||coins<ENCHANT_COST) return;
  coins-=ENCHANT_COST; sv('hd_c',coins); updRes();
  const resultTier=rollEnchantTier();
  pendingRollLuck = 0; savePotionState(); // 단발 행운 소모
  runEnchantRoulette(resultTier);
}
function runEnchantRoulette(resultTier){
  const ov=document.getElementById('enchantRouletteOv');
  const spin=document.getElementById('enchantSpinName');
  ov.style.display='flex';
  let t=0;
  const itv=setInterval(()=>{
    t++;
    const rnd=ENCHANT_TIERS[Math.floor(Math.random()*ENCHANT_TIERS.length)];
    spin.textContent=rnd.name;
    if(t>=45){
      clearInterval(itv);
      finishEnchant(resultTier);
    }
  },66); // 약 3초 (45*66ms)
}
function finishEnchant(resultTier){
  const key=enchantKey();
  enchants[key]=resultTier;
  saveEnchants();
  const tier=ENCHANT_TIERS[resultTier];
  const ov=document.getElementById('enchantRouletteOv');
  const spin=document.getElementById('enchantSpinName');
  spin.textContent=tier.name+' 획득!';
  const cutDur=tier.cutscene||0;
  if(cutDur>0){
    ov.style.display='none';
    playEnchantCutscene(resultTier, cutDur/60*1000, ()=>{ renderEnchantList(); });
  } else {
    setTimeout(()=>{ov.style.display='none';renderEnchantList();},1200);
  }
}

// ── SOL'S RNG 스타일 컷씬 연출 ──
function tierColors(idx){
  // 등급이 높을수록(희귀할수록) 더 화려한 색 팔레트
  const palettes=[
    ['#f97316','#fbbf24'],           // 낮은 등급
    ['#a855f7','#818cf8'],
    ['#38bdf8','#22d3ee','#a855f7'],
    ['#fbbf24','#ef4444','#a855f7','#38bdf8'], // 최상위 - 레인보우
  ];
  const total=ENCHANT_TIERS.length;
  const r=idx/(total-1); // 0(흔함)~1(희귀)
  if(r<0.55) return palettes[0];
  if(r<0.75) return palettes[1];
  if(r<0.92) return palettes[2];
  return palettes[3];
}
function playEnchantCutscene(resultTier, durationMs, onDone){
  const tier=ENCHANT_TIERS[resultTier];
  const cs=document.getElementById('enchantCutscene');
  const cv=document.getElementById('cutsceneCanvas');
  const flash=document.getElementById('cutsceneFlash');
  const shakeWrap=document.getElementById('cutsceneShakeWrap');
  const label=document.getElementById('cutsceneRarityLabel');
  const nameEl=document.getElementById('cutsceneTierName');
  const subEl=document.getElementById('cutsceneSub');
  const colors=tierColors(resultTier);
  const isTop=resultTier>=ENCHANT_TIERS.length-4;

  cs.style.display='block';
  cv.width=window.innerWidth; cv.height=window.innerHeight;
  const cx2=cv.getContext('2d');
  const W=cv.width,H=cv.height,cxp=W/2,cyp=H/2;

  // 초기 상태 리셋
  flash.style.opacity='0';
  nameEl.style.transform='scale(0)';
  nameEl.style.background=`linear-gradient(135deg,${colors.join(',')})`;
  nameEl.style.webkitBackgroundClip='text'; nameEl.style.backgroundClip='text';
  nameEl.textContent=tier.name;
  nameEl.classList.remove('cutpulse');
  label.style.opacity='0'; label.textContent='✨ '+tier.chance+'% RARE ENCHANT ✨';
  subEl.style.opacity='0'; subEl.textContent=isTop?'전설이 되었다':'등급 확정!';
  shakeWrap.classList.remove('cutshake');

  const startT=Date.now();
  let particles=[];
  for(let i=0;i<80;i++){
    const a=Math.random()*Math.PI*2, spd=1+Math.random()*4;
    particles.push({x:cxp,y:cyp,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,r:2+Math.random()*4,col:colors[Math.floor(Math.random()*colors.length)],life:1});
  }
  let running_=true;
  function frame(){
    if(!running_) return;
    const t=Date.now()-startT;
    cx2.fillStyle='rgba(0,0,0,0.18)';
    cx2.fillRect(0,0,W,H);
    // 회전 광선
    const rays=isTop?24:14;
    for(let i=0;i<rays;i++){
      const a=(i/rays)*Math.PI*2 + t/500;
      const len=Math.max(W,H);
      const col=colors[i%colors.length];
      cx2.strokeStyle=col+'33';
      cx2.lineWidth=isTop?6:3;
      cx2.beginPath();
      cx2.moveTo(cxp,cyp);
      cx2.lineTo(cxp+Math.cos(a)*len,cyp+Math.sin(a)*len);
      cx2.stroke();
    }
    // 확장 링
    const ringR=(t/6)%Math.max(W,H);
    cx2.strokeStyle=colors[0]+'55';
    cx2.lineWidth=3;
    cx2.beginPath();cx2.arc(cxp,cyp,ringR,0,Math.PI*2);cx2.stroke();
    // 파티클
    particles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy; p.life-=0.006;
      if(p.life<=0){
        const a=Math.random()*Math.PI*2, spd=1+Math.random()*4;
        p.x=cxp;p.y=cyp;p.vx=Math.cos(a)*spd;p.vy=Math.sin(a)*spd;p.life=1;
      }
      cx2.globalAlpha=Math.max(0,p.life);
      cx2.fillStyle=p.col;
      cx2.beginPath();cx2.arc(p.x,p.y,p.r,0,Math.PI*2);cx2.fill();
    });
    cx2.globalAlpha=1;
    if(running_) requestAnimationFrame(frame);
  }
  frame();

  // 초반 스트로브 플래시 (0~700ms)
  let flashN=0;
  const flashItv=setInterval(()=>{
    flashN++;
    flash.style.transition='opacity .05s';
    flash.style.opacity=flashN%2===0?'0.7':'0';
    if(flashN>=(isTop?10:6)){ clearInterval(flashItv); flash.style.opacity='0'; }
  },90);

  // 흔들림 (0~600ms)
  shakeWrap.classList.add('cutshake');
  setTimeout(()=>shakeWrap.classList.remove('cutshake'), isTop?900:600);

  // 텍스트 등장 (라벨 → 이름 zoom-in → 서브)
  setTimeout(()=>{ label.style.transition='opacity .4s'; label.style.opacity='1'; }, 500);
  setTimeout(()=>{
    nameEl.style.fontSize = isTop?'56px':'42px';
    nameEl.style.transform='scale(1)';
    nameEl.classList.add('cutpulse');
    // 등장 순간 추가 플래시
    flash.style.transition='opacity .08s';
    flash.style.opacity='0.9';
    setTimeout(()=>{flash.style.opacity='0';},120);
  }, 850);
  setTimeout(()=>{ subEl.style.opacity='1'; }, 1300);

  setTimeout(()=>{
    running_=false;
    cs.style.display='none';
    if(onDone) onDone();
  }, durationMs);
}
