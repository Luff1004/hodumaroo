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
  {chance:0.0001, name:'초월의 신',  cutscene:2400},
];

function enchantPowerPct(tier){ return Math.round((tier+1)*10); }

// ── 행운(potion) 시스템 ──
let permLuckBonus = lJ('hd_perm_luck', 0); // 영구 행운 배율 보너스
let potionInv = lJ('hd_potion_inv', {}); // {potionId: count}
let potionBuff = lJ('hd_potion_buff', null); // {mult, expiresAt}
function savePotionState(){ sv('hd_perm_luck', permLuckBonus); sv('hd_potion_inv', potionInv); sv('hd_potion_buff', potionBuff); }

function currentLuckMult(){
  let m = 1 + permLuckBonus;
  if(potionBuff && potionBuff.expiresAt > Date.now()) m += potionBuff.mult;
  else if(potionBuff) { potionBuff = null; savePotionState(); }
  return m;
}

// 30종 물약: 23종 반복 구매형(5분 임시버프) + 7종 1회용 영구형
const POTIONS = [];
for(let i=0;i<23;i++){
  const luck = +(0.15 + i*0.13).toFixed(2);
  const price = Math.round(3000*(i+1)*(i+1)*3 + 2000);
  POTIONS.push({id:'pot_temp_'+i, name:`행운의 물약 Lv.${i+1}`, icon:'🧪', price, luck, perm:false,
    desc:`5분간 행운 +${luck}`});
}
const PERM_POTIONS = [
  {id:'pot_perm_1', name:'축복의 물약', icon:'✨', price:2000000,  luck:0.3},
  {id:'pot_perm_2', name:'성스러운 물약', icon:'🕊️', price:5000000,  luck:0.5},
  {id:'pot_perm_3', name:'기적의 물약', icon:'🌈', price:8000000,  luck:0.8},
  {id:'pot_perm_4', name:'천상의 물약', icon:'☁️', price:10000000, luck:1.2},
  {id:'pot_perm_5', name:'초월의 물약', icon:'🌠', price:20000000, luck:2.0},
  {id:'pot_perm_6', name:'전능의 물약', icon:'👁️', price:50000000, luck:3.5},
  {id:'pot_perm_7', name:'신화의 물약', icon:'🌌', price:100000000,luck:6.0},
];
PERM_POTIONS.forEach(p=>{p.perm=true;p.desc=`영구 행운 +${p.luck} (1회용, 시간제 아님)`;POTIONS.push(p);});

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
  if(p.perm){
    permLuckBonus += p.luck;
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
  document.getElementById('potionLuckDisp').textContent = '현재 행운 배율: x'+currentLuckMult().toFixed(2);
  POTIONS.forEach(p=>{
    const owned = potionInv[p.id]||0;
    const cb = coins>=p.price;
    const d=document.createElement('div');
    d.className='si'+(owned?' own':cb?' cb2':'')+(p.perm?' rar-legendary':'');
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
    d.innerHTML=`<div class="eico">${it.icon}</div><div><div class="enm" style="color:#e9d5ff;">${it.name}</div><div class="elv" style="color:#c4b5fd;">${tier!=null?'✨ '+ENCHANT_TIERS[tier].name+' (+'+enchantPowerPct(tier)+'%)':'미인챈트'}</div></div>`;
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
    <div style="font-size:14px;color:#fbbf24;font-weight:800;margin-bottom:6px;">${tier!=null?'✨ '+ENCHANT_TIERS[tier].name+' (+'+enchantPowerPct(tier)+'%)':'미인챈트 상태'}</div>
    <div style="font-size:11px;color:#c4b5fd;margin-bottom:10px;">인챈트 비용: 🪙${ENCHANT_COST.toLocaleString()} · 현재 행운 배율: x${currentLuckMult().toFixed(2)}</div>
    <button class="mok" id="doEnchantBtn" style="background:linear-gradient(135deg,#6d28d9,#a855f7);" ${cb?'':'disabled'}>🔮 인챈트하기</button>
    <button class="mok" style="background:linear-gradient(135deg,#4c1d95,#7c3aed);margin-left:8px;" onclick="openPotionShop()">🧪 물약</button>
  `;
  document.getElementById('doEnchantBtn').onclick=doEnchant;
}
function rollEnchantTier(){
  const luck=currentLuckMult();
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
  spin.textContent=tier.name+' 획득! (+'+enchantPowerPct(resultTier)+'%)';
  const cutDur=tier.cutscene||0;
  if(cutDur>0){
    const cs=document.getElementById('enchantCutscene');
    cs.style.display='flex';
    document.getElementById('cutsceneTierName').textContent=tier.name;
    setTimeout(()=>{
      cs.style.display='none';
      ov.style.display='none';
      renderEnchantList();
    }, cutDur/60*1000);
  } else {
    setTimeout(()=>{ov.style.display='none';renderEnchantList();},1200);
  }
}
