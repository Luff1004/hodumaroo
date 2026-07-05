// ════════════════════════════════════════════
// ══ 펫(반려동물) 시스템 ══
// ════════════════════════════════════════════

const PETS = [
  // ── 커먼 (4) ──
  {id:'pet_slime',  name:'슬라임',   icon:'🟢', rarity:'common', bonus:{dmgPct:4}},
  {id:'pet_chick',  name:'병아리',   icon:'🐤', rarity:'common', bonus:{hpPct:4}},
  {id:'pet_mouse',  name:'생쥐',     icon:'🐭', rarity:'common', bonus:{spdFlat:0.15}},
  {id:'pet_frog',   name:'개구리',   icon:'🐸', rarity:'common', bonus:{coinPct:4}},
  // ── 레어 (4) ──
  {id:'pet_cat',    name:'고양이',   icon:'🐱', rarity:'rare', bonus:{dmgPct:8}},
  {id:'pet_owl',    name:'부엉이',   icon:'🦉', rarity:'rare', bonus:{xpPct:10}},
  {id:'pet_fox',    name:'여우',     icon:'🦊', rarity:'rare', bonus:{critPct:4}},
  {id:'pet_rabbit', name:'토끼',     icon:'🐰', rarity:'rare', bonus:{spdFlat:0.35}},
  // ── 에픽 (4) ──
  {id:'pet_wolf',    name:'늑대',     icon:'🐺', rarity:'epic', bonus:{dmgPct:15}},
  {id:'pet_eagle',   name:'독수리',   icon:'🦅', rarity:'epic', bonus:{coinPct:12}},
  {id:'pet_panther', name:'흑표범',   icon:'🐆', rarity:'epic', bonus:{critPct:8}},
  {id:'pet_bear',    name:'곰',       icon:'🐻', rarity:'epic', bonus:{hpPct:15}},
  // ── 레전더리 (4) ──
  {id:'pet_dragon',  name:'새끼 드래곤', icon:'🐉', rarity:'legendary', bonus:{dmgPct:25}},
  {id:'pet_phoenix', name:'불사조 새끼', icon:'🔥', rarity:'legendary', bonus:{lifestealFlat:3}},
  {id:'pet_unicorn', name:'유니콘',      icon:'🦄', rarity:'legendary', bonus:{hpPct:25,spdFlat:0.5}},
  {id:'pet_griffin', name:'그리핀',      icon:'🦁', rarity:'legendary', bonus:{coinPct:20,xpPct:20}},
  // ── 신화 (4) ──
  {id:'pet_cosmic',  name:'우주적 존재', icon:'🌌', rarity:'mythic', bonus:{dmgPct:40,critPct:12}},
  {id:'pet_voidcat', name:'공허의 냥이', icon:'🐈‍⬛', rarity:'mythic', bonus:{luckPct:60}},
  {id:'pet_whale',   name:'별고래',      icon:'🐋', rarity:'mythic', bonus:{hpPct:40,coinPct:25}},
  {id:'pet_turtle',  name:'시간의 거북', icon:'🐢', rarity:'mythic', bonus:{xpPct:45,energyPct:35}},
];
const PET_RARITY_LABEL={common:'커먼',rare:'레어',epic:'에픽',legendary:'레전더리',mythic:'신화'};
const PET_RARITY_COLOR={common:'#9ca3af',rare:'#3b82f6',epic:'#a855f7',legendary:'#f59e0b',mythic:'#ec4899'};

const PET_EGGS = [
  {id:'egg_common',    name:'평범한 알',  icon:'🥚', price:5000,    weights:{common:70,rare:25,epic:4,legendary:0.9,mythic:0.1}},
  {id:'egg_rare',      name:'빛나는 알',  icon:'🥚', price:30000,   weights:{common:30,rare:50,epic:16,legendary:3.5,mythic:0.5}},
  {id:'egg_epic',      name:'신비한 알',  icon:'🌟', price:150000,  weights:{common:5,rare:30,epic:45,legendary:18,mythic:2}},
  {id:'egg_legendary', name:'전설의 알',  icon:'✨', price:800000,  weights:{common:0,rare:10,epic:35,legendary:45,mythic:10}},
];

let ownedPets = lJ('hd_pets', {}); // {petId: {count, level}}
let equippedPetId = lS('hd_eq_pet', '');
function savePetData(){ sv('hd_pets', ownedPets); sv('hd_eq_pet', equippedPetId||''); }

function petLevel(petId){ return (ownedPets[petId]&&ownedPets[petId].level)||0; }
function petLevelCost(petId){ const lv=petLevel(petId); return Math.floor(5000*(lv+1)*(lv+1)); }

function rollPetRarity(weights){
  const entries=Object.entries(weights).filter(([,w])=>w>0);
  const total=entries.reduce((a,[,w])=>a+w,0);
  let r=Math.random()*total;
  for(const [rarity,w] of entries){ r-=w; if(r<=0) return rarity; }
  return entries[entries.length-1][0];
}

function hatchEgg(eggId){
  const egg=PET_EGGS.find(e=>e.id===eggId);
  if(!egg||coins<egg.price) return;
  coins-=egg.price; sv('hd_c',coins); updRes();
  const rarity=rollPetRarity(egg.weights);
  const pool=PETS.filter(p=>p.rarity===rarity);
  const pet=pool[Math.floor(Math.random()*pool.length)];
  if(!ownedPets[pet.id]) ownedPets[pet.id]={count:0,level:0};
  ownedPets[pet.id].count++;
  savePetData();
  showPetHatchResult(pet);
  renderPetScreen();
}

function showPetHatchResult(pet){
  const el=document.getElementById('petHatchResult');
  if(!el) return;
  el.style.color=PET_RARITY_COLOR[pet.rarity];
  el.textContent=`${pet.icon} ${PET_RARITY_LABEL[pet.rarity]} - ${pet.name} 획득!`;
  el.style.opacity='1';
  clearTimeout(el._hideT);
  el._hideT=setTimeout(()=>{el.style.opacity='0';},2500);
}

function levelUpPet(petId){
  const d=ownedPets[petId]; if(!d) return;
  const cost=petLevelCost(petId);
  if(d.level>=10||coins<cost) return;
  coins-=cost; sv('hd_c',coins); updRes();
  d.level++;
  savePetData();
  renderPetScreen();
}

function equipPet(petId){
  equippedPetId = equippedPetId===petId ? '' : petId;
  savePetData();
  renderPetScreen();
}

let curPetTab='collection'; // 'collection' | 'eggs'
function setPetTab(tab,btn){
  curPetTab=tab;
  document.querySelectorAll('#sPets .stab').forEach(b=>b.classList.remove('on'));
  if(btn)btn.classList.add('on');
  renderPetScreen();
}

function petBonusDesc(pet){
  const b=pet.bonus, parts=[];
  if(b.dmgPct)parts.push(`데미지+${b.dmgPct}%`);
  if(b.hpPct)parts.push(`최대HP+${b.hpPct}%`);
  if(b.spdFlat)parts.push(`이동속도+${b.spdFlat}`);
  if(b.coinPct)parts.push(`코인+${b.coinPct}%`);
  if(b.energyPct)parts.push(`에너지+${b.energyPct}%`);
  if(b.xpPct)parts.push(`시즌XP+${b.xpPct}%`);
  if(b.critPct)parts.push(`치명타+${b.critPct}%`);
  if(b.lifestealFlat)parts.push(`처치시 HP+${b.lifestealFlat}`);
  if(b.luckPct)parts.push(`인챈트 행운+${b.luckPct}%`);
  return parts.join(' · ');
}

function renderPetScreen(){
  updRes();
  const g=document.getElementById('petGrid'); if(!g) return;
  g.innerHTML='';
  const eqPet=PETS.find(p=>p.id===equippedPetId);
  document.getElementById('petEquipDisp').textContent = eqPet?`장착중: ${eqPet.icon} ${eqPet.name} Lv.${petLevel(eqPet.id)}`:'장착중인 펫 없음';

  if(curPetTab==='eggs'){
    PET_EGGS.forEach(egg=>{
      const cb=coins>=egg.price;
      const d=document.createElement('div');
      d.className='si'+(cb?' cb2':'');
      d.innerHTML=`<div class="sico">${egg.icon}</div><div class="snm">${egg.name}</div>`+
        `<div style="font-size:8px;color:#6b7280;margin-top:3px;">커먼${egg.weights.common}% 레어${egg.weights.rare}% 에픽${egg.weights.epic}%<br>레전${egg.weights.legendary}% 신화${egg.weights.mythic}%</div>`+
        `<div style="font-size:10px;font-weight:700;color:${cb?'#d97706':'#9ca3af'};margin-top:4px;">🪙${egg.price.toLocaleString()}</div>`;
      const btn=document.createElement('button');btn.className='bybtn';btn.textContent='부화';btn.disabled=!cb;
      btn.style.marginTop='6px';
      btn.onclick=()=>hatchEgg(egg.id);
      d.appendChild(btn);
      g.appendChild(d);
    });
  } else {
    PETS.forEach(pet=>{
      const owned=ownedPets[pet.id];
      const isEq=equippedPetId===pet.id;
      const d=document.createElement('div');
      d.className='si'+(isEq?' own':owned?' cb2':'')+' rar-'+(pet.rarity==='common'?'':pet.rarity);
      const lockedStyle=owned?'':'filter:grayscale(100%) brightness(.5);';
      d.innerHTML=`<div class="sico" style="${lockedStyle}">${pet.icon}</div>`+
        `<div class="snm" style="color:${PET_RARITY_COLOR[pet.rarity]};">${owned?pet.name:'???'}</div>`+
        `<div style="font-size:8px;color:#9ca3af;">${PET_RARITY_LABEL[pet.rarity]}</div>`+
        (owned?`<div style="font-size:8px;color:#6b7280;margin-top:2px;">${petBonusDesc(pet)}</div><div style="font-size:9px;color:#7c3aed;font-weight:700;margin-top:2px;">Lv.${owned.level} (보유 ${owned.count}개)</div>`:'');
      if(owned){
        const btnRow=document.createElement('div');btnRow.style.cssText='display:flex;gap:4px;margin-top:6px;justify-content:center;';
        const eqBtn=document.createElement('button');eqBtn.className='bybtn';eqBtn.textContent=isEq?'해제':'장착';
        eqBtn.style.background=isEq?'#ef4444':'';
        eqBtn.onclick=()=>equipPet(pet.id);
        btnRow.appendChild(eqBtn);
        const cost=petLevelCost(pet.id);
        const lvBtn=document.createElement('button');lvBtn.className='bybtn';
        lvBtn.textContent=owned.level>=10?'MAX':`강화(🪙${cost.toLocaleString()})`;
        lvBtn.disabled=owned.level>=10||coins<cost;
        lvBtn.onclick=()=>levelUpPet(pet.id);
        btnRow.appendChild(lvBtn);
        d.appendChild(btnRow);
      }
      g.appendChild(d);
    });
  }
}

// 펫 보너스를 실제 전투 스탯에 적용 (initGame에서 호출)
function applyPetBonus(){
  window._petCoinMult=1; window._petEnergyMult=1; window._petXpMult=1; window._petLifesteal=0;
  const pet=PETS.find(p=>p.id===equippedPetId);
  if(!pet) return;
  const lv=petLevel(pet.id);
  const scale=1+lv*0.15;
  const b=pet.bonus;
  if(b.dmgPct) P.dmgB=(P.dmgB||0)+Math.ceil(b.dmgPct*scale/2);
  if(b.hpPct){ const bonus=Math.floor(P.maxHp*b.hpPct*scale/100); P.maxHp+=bonus; P.hp+=bonus; }
  if(b.spdFlat) P.spd+=b.spdFlat*scale;
  if(b.critPct) P._wepCrit=(P._wepCrit||0)+b.critPct*scale/100;
  if(b.lifestealFlat) window._petLifesteal=b.lifestealFlat*scale;
  if(b.coinPct) window._petCoinMult=1+b.coinPct*scale/100;
  if(b.energyPct) window._petEnergyMult=1+b.energyPct*scale/100;
  if(b.xpPct) window._petXpMult=1+b.xpPct*scale/100;
}
