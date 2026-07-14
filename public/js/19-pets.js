// ════════════════════════════════════════════
// ══ 펫(반려동물) 시스템 ══
// ════════════════════════════════════════════

function isPetUnlocked(){
  if(typeof devModeUnlocked!=='undefined'&&devModeUnlocked)return true;
  return (achStats.dreamEntered||0)>=1;
}
function updatePetButton(){
  const btn=document.getElementById('btn-pet');if(!btn)return;
  if(isPetUnlocked()){
    btn.textContent='🐾 펫';
    btn.style.background='linear-gradient(135deg,#be185d,#831843)';
    btn.style.color='#fce7f3';
    btn.style.border='1.5px solid #ec4899';
  } else {
    btn.textContent='🔒 ???';
    btn.style.background='linear-gradient(135deg,#334155,#1e293b)';
    btn.style.color='#94a3b8';
    btn.style.border='1.5px solid #475569';
  }
}
function openPetScreen(){
  if(!isPetUnlocked()){
    const btn=document.getElementById('btn-pet');
    if(btn&&!btn._petMsgT){
      const prev=btn.textContent;
      btn.textContent='드림코어 방문 시 해금!';
      btn._petMsgT=setTimeout(()=>{btn.textContent=prev;btn._petMsgT=null;},1800);
    }
    return;
  }
  go('sPets');
}

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
  // ── 이벤트 전용 (상점 구매로만 획득) ──
  {id:'pet_event_carnival', name:'축제 마스코트', icon:'🎪', rarity:'event', bonus:{dmgPct:20,hpPct:20,coinPct:20,xpPct:20}},
  // ── 시즌 이벤트(2개월 순환) 전용 알/펫 ──
  {id:'pet_ev_cookwar',     name:'미식가 고양이', icon:'🐈', rarity:'event', bonus:{hpPct:15,coinPct:15}},
  {id:'pet_ev_garden',      name:'텃밭 꿀벌',     icon:'🐝', rarity:'event', bonus:{spdFlat:0.4,xpPct:15}},
  {id:'pet_ev_treasure',    name:'보물 앵무새',   icon:'🦜', rarity:'event', bonus:{coinPct:25}},
  {id:'pet_ev_watermelon',  name:'수박 요정',     icon:'🍉', rarity:'event', bonus:{dmgPct:10,hpPct:10}},
  {id:'pet_ev_slingshot',   name:'사과 다람쥐',   icon:'🐿️', rarity:'event', bonus:{critPct:10}},
  {id:'pet_ev_giftrhythm',  name:'루돌프 새끼',   icon:'🦌', rarity:'event', bonus:{hpPct:20,dmgPct:10}},
];
// ── 극악 확률 초레어 등급 50종 (신화보다 훨씬 희귀, 5개 신규 등급 x 10종) ──
const PET_ULTRA_TIERS = [
  {key:'ancient',       label:'고대',   color:'#78350f', scale:1.5},
  {key:'divine',        label:'신성',   color:'#0ea5e9', scale:2.2},
  {key:'ethereal',      label:'천계',   color:'#67e8f9', scale:3.2},
  {key:'transcendent',  label:'초월',   color:'#f472b6', scale:4.5},
  {key:'absolute',      label:'절대',   color:'#ffffff', scale:7},
];
{
  const adj2=['태초의','만물의','불멸하는','전능한','초자연적인','우주적인','시공을 초월한','신비로운','절대적인','영원불멸의',
    '근원적인','창세의','종말의','섭리의','불가침의'];
  const noun2=['용','불사조','기린','신수','정령','수호자','파괴자','창조자','현자','군주',
    '드래곤킹','피닉스로드','스핑크스','케르베로스','레비아탄'];
  const bonusKeys=['dmgPct','hpPct','coinPct','xpPct','critPct','lifestealFlat','luckPct','spdFlat'];
  const bonusBase={dmgPct:40,hpPct:40,coinPct:25,xpPct:45,critPct:12,lifestealFlat:5,luckPct:60,spdFlat:0.6};
  const AN=adj2.length, NN=noun2.length, COMBO=AN*NN; // 15x15=225, i=0..49 유니크 보장
  let idx=0;
  PET_ULTRA_TIERS.forEach(tier=>{
    for(let j=0;j<10;j++){
      const c=(idx*97+13)%COMBO;
      const a=adj2[c%AN], n=noun2[Math.floor(c/AN)%NN];
      const bk=bonusKeys[idx%bonusKeys.length];
      const bonus={}; bonus[bk]=+(bonusBase[bk]*tier.scale).toFixed(2);
      PETS.push({id:'pet_ultra_'+idx, name:`${a} ${n}`, icon:'👑', rarity:tier.key, bonus});
      idx++;
    }
  });
}

const PET_RARITY_LABEL={common:'커먼',rare:'레어',epic:'에픽',legendary:'레전더리',mythic:'신화',event:'이벤트 한정'};
const PET_RARITY_COLOR={common:'#9ca3af',rare:'#3b82f6',epic:'#a855f7',legendary:'#f59e0b',mythic:'#ec4899',event:'#22d3ee'};
PET_ULTRA_TIERS.forEach(t=>{PET_RARITY_LABEL[t.key]=t.label;PET_RARITY_COLOR[t.key]=t.color;});

const PET_EGGS = [
  {id:'egg_common',    name:'평범한 알',  icon:'🥚', price:5000,
    weights:{common:70,rare:25,epic:4,legendary:0.9,mythic:0.1,ancient:0.0005,divine:0.00003,ethereal:0.000002,transcendent:0.0000001,absolute:0.000000005}},
  {id:'egg_rare',      name:'빛나는 알',  icon:'🥚', price:30000,
    weights:{common:30,rare:50,epic:16,legendary:3.5,mythic:0.5,ancient:0.003,divine:0.0002,ethereal:0.00001,transcendent:0.0000008,absolute:0.00000003}},
  {id:'egg_epic',      name:'신비한 알',  icon:'🌟', price:150000,
    weights:{common:5,rare:30,epic:45,legendary:18,mythic:2,ancient:0.02,divine:0.0015,ethereal:0.0001,transcendent:0.000006,absolute:0.0000002}},
  {id:'egg_legendary', name:'전설의 알',  icon:'✨', price:800000,
    weights:{common:0,rare:10,epic:35,legendary:45,mythic:10,ancient:0.15,divine:0.015,ethereal:0.0012,transcendent:0.00008,absolute:0.000003}},
];

// ── 신규 알 15종 (전설의 알보다 비싸고 상위 등급 확률이 점점 좋아짐) ──
{
  const EGG_NAMES_NEW=['심연의 알','기적의 알','천상의 알','창세의 알','만물의 알','시공의 알','신화의 알','태초의 알','불멸의 알','섭리의 알','절대의 알','초월의 알','무한의 알','근원의 알','종말의 알'];
  const total=EGG_NAMES_NEW.length;
  for(let i=0;i<total;i++){
    const t=i/(total-1); // 0(가장 저렴) ~ 1(최고가)
    const price=Math.round(2000000*Math.pow(100000,t)); // 200만 ~ 2000억
    const weights={
      common:+Math.max(0,20*(1-t)).toFixed(4),
      rare:+Math.max(0,30*(1-t)).toFixed(4),
      epic:+Math.max(1,30-10*t).toFixed(4),
      legendary:+(15+10*t).toFixed(4),
      mythic:+(5+15*t).toFixed(4),
      ancient:+(0.5+3*t).toFixed(6),
      divine:+(0.05+1*t).toFixed(6),
      ethereal:+(0.005+0.3*t).toFixed(8),
      transcendent:+(0.0005+0.05*t).toFixed(9),
      absolute:+(0.00005+0.01*t).toFixed(10),
    };
    PET_EGGS.push({id:'egg_new_'+i, name:EGG_NAMES_NEW[i], icon:i<8?'🥚':'🌠', price, weights});
  }
}

// ── 신규 알 20종 추가 (종말의 알보다도 더 위, 최상위 등급 위주로만 편성) ──
{
  const EGG_NAMES_NEW2=['공허의 알','파멸의 알','섭리 파괴자의 알','완전한 알','절대자의 알','신들의 알','창조주의 알','파괴신의 알','현실 초월의 알','인과율의 알',
    '무한회랑의 알','확률 조작자의 알','기적 그 자체의 알','존재 그 자체의 알','시간 밖의 알','차원 너머의 알','근원 최심부의 알','태초 이전의 알','만물 이후의 알','궁극의 알'];
  const total2=EGG_NAMES_NEW2.length;
  for(let i=0;i<total2;i++){
    const t=i/(total2-1); // 0 ~ 1
    const price=Math.round(500000000000*Math.pow(10000,t)); // 5000억 ~ 5000조
    const weights={
      epic:+Math.max(0,10*(1-t)).toFixed(4),
      legendary:+Math.max(1,25-15*t).toFixed(4),
      mythic:+(20+10*t).toFixed(4),
      ancient:+(3.5+6.5*t).toFixed(6),
      divine:+(1+4*t).toFixed(6),
      ethereal:+(0.3+1.7*t).toFixed(8),
      transcendent:+(0.05+0.45*t).toFixed(9),
      absolute:+(0.01+0.29*t).toFixed(10),
    };
    PET_EGGS.push({id:'egg_new2_'+i, name:EGG_NAMES_NEW2[i], icon:'💫', price, weights});
  }
}

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
  if(typeof trackPetStreak==='function')trackPetStreak(rarity);
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

function petBonusDesc(pet,lv){
  const b=pet.bonus, parts=[];
  const scale=1+(lv||0)*0.15;
  const n=(v,d)=>{const r=Math.round(v*scale*10)/10;return d?r.toFixed(1):r;};
  if(b.dmgPct)parts.push(`데미지+${n(b.dmgPct)}%`);
  if(b.hpPct)parts.push(`최대HP+${n(b.hpPct)}%`);
  if(b.spdFlat)parts.push(`이동속도+${n(b.spdFlat,true)}`);
  if(b.coinPct)parts.push(`코인+${n(b.coinPct)}%`);
  if(b.energyPct)parts.push(`에너지+${n(b.energyPct)}%`);
  if(b.xpPct)parts.push(`시즌XP+${n(b.xpPct)}%`);
  if(b.critPct)parts.push(`치명타+${n(b.critPct)}%`);
  if(b.lifestealFlat)parts.push(`처치시 HP+${n(b.lifestealFlat)}`);
  if(b.luckPct)parts.push(`인챈트 행운+${n(b.luckPct)}%`);
  return parts.join(' · ');
}

function renderPetScreen(){
  updRes();
  const g=document.getElementById('petGrid'); if(!g) return;
  g.innerHTML='';
  const eqPet=PETS.find(p=>p.id===equippedPetId);
  document.getElementById('petEquipDisp').textContent = eqPet?`장착중: ${eqPet.icon} ${eqPet.name} Lv.${petLevel(eqPet.id)}`:'장착중인 펫 없음';

  if(curPetTab==='eggs'){
    const RARITY_ORDER=['common','rare','epic','legendary','mythic','ancient','divine','ethereal','transcendent','absolute'];
    const RARITY_ABBR={common:'커먼',rare:'레어',epic:'에픽',legendary:'레전',mythic:'신화',ancient:'고대',divine:'신성',ethereal:'천계',transcendent:'초월',absolute:'절대'};
    PET_EGGS.forEach(egg=>{
      const cb=coins>=egg.price;
      const d=document.createElement('div');
      d.className='si'+(cb?' cb2':'');
      const parts=RARITY_ORDER.filter(r=>egg.weights[r]>0).map(r=>`${RARITY_ABBR[r]}${egg.weights[r]}%`);
      let oddsHtml='';
      for(let i=0;i<parts.length;i+=3) oddsHtml+=parts.slice(i,i+3).join(' ')+'<br>';
      d.innerHTML=`<div class="sico">${egg.icon}</div><div class="snm">${egg.name}</div>`+
        `<div style="font-size:8px;color:#6b7280;margin-top:3px;">${oddsHtml}</div>`+
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
        (owned?`<div style="font-size:8px;color:#6b7280;margin-top:2px;">${petBonusDesc(pet,owned.level)}</div><div style="font-size:9px;color:#7c3aed;font-weight:700;margin-top:2px;">Lv.${owned.level} (보유 ${owned.count}개)</div>`:'');
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
updatePetButton();
