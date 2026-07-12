// ══════════════ 디펜스 모드: 건설 / 제작(도구·무기·방어구) / 상자 확률 ══════════════
// 23-defense-mode.js의 상태(sack, campfire, axeTier/pickaxeTier/weaponTier/armorTier 등)를 그대로 사용한다.

// ── 건설(구조물) ──
const BUILD_RECIPES=[
  {id:'build_craft_table',kind:'build_once',flagGet:()=>craftTableBuilt,unlockGet:()=>craftTableUnlocked,name:'제작대',icon:'🔨',cost:{wood:15},
    apply:()=>{craftTableBuilt=true;}},
  {id:'build_weapon_table',kind:'build_once',flagGet:()=>weaponTableBuilt,unlockGet:()=>weaponTableUnlocked,name:'무기제작대',icon:'⚔️',cost:{wood:20,stone:15},
    apply:()=>{weaponTableBuilt=true;}},
  {id:'build_barricade',kind:'build_repeat',placeKind:'barricade',unlockGet:()=>craftTableBuilt,name:'바리케이드',icon:'🚧',cost:{wood:20,stone:10},desc:'좀비가 캠프파이어보다 먼저 공격하는 방어 구조물 · 클릭한 위치에 설치'},
  {id:'build_torch',kind:'build_repeat',placeKind:'torch',unlockGet:()=>craftTableBuilt,name:'횃불',icon:'🔥',cost:{wood:8},desc:'밤에 주변을 밝혀주는 고정 조명 · 클릭한 위치에 설치'},
  {id:'build_trap',kind:'build_repeat',placeKind:'trap',unlockGet:()=>craftTableBuilt,name:'덫',icon:'⚠️',cost:{iron:6,wood:4},desc:'밟은 좀비에게 피해를 주는 1회용 함정 · 클릭한 위치에 설치'},
  {id:'build_heater',kind:'build_repeat',placeKind:'heater',unlockGet:()=>craftTableBuilt,name:'온열기',icon:'🔥',cost:{iron:12,wood:6},desc:'주변의 추위를 식혀주는 이동형 열원 · 클릭한 위치에 설치',themeOnly:'snow'},
  {id:'build_igloo',kind:'build_repeat',placeKind:'igloo',unlockGet:()=>craftTableBuilt,name:'이글루',icon:'🧊',cost:{ice:40,wood:10},desc:'넓은 범위를 완전히 데워주는 대형 쉼터 · 클릭한 위치에 설치',themeOnly:'snow'},
];

// ── 도구(도끼/곡괭이) + 소모품 + 장비형 아이템 ──
const CRAFT_RECIPES=[
  {id:'axe_0',kind:'tool',toolType:'axe',tierIdx:0,name:'나무 도끼',icon:'🪓',cost:{wood:10},minCfLevel:2},
  {id:'pick_0',kind:'tool',toolType:'pickaxe',tierIdx:0,name:'나무 곡괭이',icon:'⛏',cost:{wood:10},minCfLevel:2},
  {id:'axe_1',kind:'tool',toolType:'axe',tierIdx:1,name:'돌 도끼',icon:'🪓',cost:{wood:5,stone:10},minCfLevel:2},
  {id:'pick_1',kind:'tool',toolType:'pickaxe',tierIdx:1,name:'돌 곡괭이',icon:'⛏',cost:{wood:5,stone:10},minCfLevel:2},
  {id:'axe_2',kind:'tool',toolType:'axe',tierIdx:2,name:'철 도끼',icon:'🪓',cost:{stone:10,iron:8},minCfLevel:3},
  {id:'pick_2',kind:'tool',toolType:'pickaxe',tierIdx:2,name:'철 곡괭이',icon:'⛏',cost:{stone:10,iron:8},minCfLevel:3},
  {id:'axe_3',kind:'tool',toolType:'axe',tierIdx:3,name:'금 도끼',icon:'🪓',cost:{iron:10,gold:6},minCfLevel:4},
  {id:'pick_3',kind:'tool',toolType:'pickaxe',tierIdx:3,name:'금 곡괭이',icon:'⛏',cost:{iron:10,gold:6},minCfLevel:4},
  {id:'axe_4',kind:'tool',toolType:'axe',tierIdx:4,name:'다이아 도끼',icon:'🪓',cost:{gold:10,diamond:5},minCfLevel:5},
  {id:'pick_4',kind:'tool',toolType:'pickaxe',tierIdx:4,name:'다이아 곡괭이',icon:'⛏',cost:{gold:10,diamond:5},minCfLevel:5},
  {id:'item_bandage',kind:'consumable',outputId:'bandage',outputQty:1,name:'붕대',icon:'🩹',cost:{pelt:3},desc:'사용 시 체력 +30'},
  {id:'item_jerky',kind:'consumable',outputId:'jerky',outputQty:1,name:'육포',icon:'🥩',cost:{meat:2},desc:'사용 시 배고픔 +15'},
  {id:'item_battery',kind:'consumable',outputId:'battery',outputQty:1,name:'배터리',icon:'🔋',cost:{iron:5},desc:'손전등 배터리 완전 충전'},
  {id:'item_waterskin',kind:'consumable',outputId:'waterskin',outputQty:1,name:'물통',icon:'💧',cost:{ice:2},desc:'사용 시 배고픔 +10'},
  {id:'item_warm_coat',kind:'equip_once',flagGet:()=>hasWarmCoat,name:'방한 코트',icon:'🧥',cost:{pelt:6,ice:2},desc:'설원 지대 이동속도 감소 해제',
    apply:()=>{hasWarmCoat=true;},themeExclude:'snow'},
  {id:'item_desert_hood',kind:'equip_once',flagGet:()=>hasDesertHood,name:'사막 두건',icon:'🧣',cost:{pelt:4,desert_crystal:3},desc:'사막 지대 이동속도 감소 해제',
    apply:()=>{hasDesertHood=true;},themeExclude:'snow'},
  {id:'item_better_sack',kind:'equip_once',flagGet:()=>sack.slots>=6,name:'튼튼한 자루',icon:'🎒',cost:{pelt:5,stone:10},desc:'자루 칸을 6칸으로 확장',
    apply:()=>{sack.slots=Math.max(sack.slots,6);}},
  {id:'item_fur_lining',kind:'equip_once',flagGet:()=>hasFurLining,name:'방한 털안감',icon:'🧣',cost:{pelt:6,ice:4},desc:'추위 상승 속도 50% 감소',
    apply:()=>{hasFurLining=true;},themeOnly:'snow'},
  {id:'item_hot_cocoa',kind:'consumable',outputId:'hot_cocoa',outputQty:1,name:'따뜻한 코코아',icon:'☕',cost:{meat:1,wood:2},desc:'사용 시 추위 -40, 배고픔 +5',themeOnly:'snow'},
];

// ── 무기(투창) ──
const WEAPON_RECIPES=[
  {id:'wep_0',kind:'tool',toolType:'weapon',tierIdx:0,name:'돌 투창',icon:'🗡',cost:{wood:10,stone:15},minCfLevel:3},
  {id:'wep_1',kind:'tool',toolType:'weapon',tierIdx:1,name:'철 투창',icon:'🗡',cost:{stone:10,iron:15},minCfLevel:3},
  {id:'wep_2',kind:'tool',toolType:'weapon',tierIdx:2,name:'금 투창',icon:'🗡',cost:{iron:10,gold:15},minCfLevel:4},
  {id:'wep_3',kind:'tool',toolType:'weapon',tierIdx:3,name:'다이아 투창',icon:'🗡',cost:{gold:10,diamond:10,desert_crystal:5,ice:5},minCfLevel:5},
];
const WEAPON_RECIPES_SNOW=[
  {id:'wep_0',kind:'tool',toolType:'weapon',tierIdx:0,name:'서리 투창',icon:'🗡',cost:{wood:10,ice:15},minCfLevel:3},
  {id:'wep_1',kind:'tool',toolType:'weapon',tierIdx:1,name:'얼음 투창',icon:'🗡',cost:{ice:10,iron:15},minCfLevel:3},
  {id:'wep_2',kind:'tool',toolType:'weapon',tierIdx:2,name:'빙하 투창',icon:'🗡',cost:{ice:15,gold:15},minCfLevel:4},
  {id:'wep_3',kind:'tool',toolType:'weapon',tierIdx:3,name:'예티엄니 투창',icon:'🗡',cost:{ice:20,diamond:10,pelt:10},minCfLevel:5},
];

// ── 방어구 ──
const ARMOR_RECIPES=[
  {id:'ar_0',kind:'tool',toolType:'armor',tierIdx:0,name:'가죽 갑옷',icon:'🦺',cost:{pelt:8},minCfLevel:2},
  {id:'ar_1',kind:'tool',toolType:'armor',tierIdx:1,name:'철 갑옷',icon:'🦺',cost:{iron:15,pelt:4},minCfLevel:3},
  {id:'ar_2',kind:'tool',toolType:'armor',tierIdx:2,name:'금 갑옷',icon:'🦺',cost:{gold:15,iron:5},minCfLevel:4},
  {id:'ar_3',kind:'tool',toolType:'armor',tierIdx:3,name:'다이아 갑옷',icon:'🦺',cost:{diamond:12,gold:5},minCfLevel:5},
];
const ARMOR_RECIPES_SNOW=[
  {id:'ar_0',kind:'tool',toolType:'armor',tierIdx:0,name:'여우털 코트',icon:'🦺',cost:{pelt:8},minCfLevel:2},
  {id:'ar_1',kind:'tool',toolType:'armor',tierIdx:1,name:'늑대털 코트',icon:'🦺',cost:{pelt:12,ice:4},minCfLevel:3},
  {id:'ar_2',kind:'tool',toolType:'armor',tierIdx:2,name:'북극곰털 코트',icon:'🦺',cost:{pelt:16,ice:8,iron:5},minCfLevel:4},
  {id:'ar_3',kind:'tool',toolType:'armor',tierIdx:3,name:'예티가죽 코트',icon:'🦺',cost:{pelt:20,ice:15,diamond:5},minCfLevel:5},
];
function curWeaponRecipes(){return isSnowTheme()?WEAPON_RECIPES_SNOW:WEAPON_RECIPES;}
function curArmorRecipes(){return isSnowTheme()?ARMOR_RECIPES_SNOW:ARMOR_RECIPES;}

let _dcTab='build';

function curTierOf(toolType){
  if(toolType==='axe')return axeTier;
  if(toolType==='pickaxe')return pickaxeTier;
  if(toolType==='weapon')return weaponTier;
  if(toolType==='armor')return armorTier;
  return -1;
}
function setTierOf(toolType,idx){
  if(toolType==='axe')axeTier=idx;
  else if(toolType==='pickaxe')pickaxeTier=idx;
  else if(toolType==='weapon')weaponTier=idx;
  else if(toolType==='armor'){
    const oldBonus=armorTier>=0?ARMOR_HP_BONUS[armorTier]:0;
    armorTier=idx;
    const newBonus=ARMOR_HP_BONUS[armorTier];
    P.maxHp+=(newBonus-oldBonus);P.hp+=(newBonus-oldBonus);
    P.armor=ARMOR_DEFENSE[armorTier];
  }
}

function findRecipe(id){
  return BUILD_RECIPES.find(r=>r.id===id)||CRAFT_RECIPES.find(r=>r.id===id)||curWeaponRecipes().find(r=>r.id===id)||curArmorRecipes().find(r=>r.id===id);
}
function themeVisible(r){
  const t=(selMap&&selMap.theme)||'camp';
  if(r.themeOnly&&r.themeOnly!==t)return false;
  if(r.themeExclude&&r.themeExclude===t)return false;
  return true;
}

function craftItem(id){
  const r=findRecipe(id);
  if(!r)return;
  if(r.kind==='tool'){
    if(!craftTableBuilt){setDefenseMsg('제작대를 먼저 건설하세요');return;}
    if(r.toolType==='weapon'&&!weaponTableBuilt){setDefenseMsg('무기제작대를 먼저 건설하세요');return;}
    const cur=curTierOf(r.toolType);
    if(cur>=r.tierIdx)return;
    if(cur!==r.tierIdx-1){setDefenseMsg('이전 단계를 먼저 제작하세요');return;}
    if(campfire.level<r.minCfLevel){setDefenseMsg(`캠프파이어 Lv.${r.minCfLevel} 필요`);return;}
    if(!sackHasEnough(r.cost)){setDefenseMsg('재료가 부족합니다');return;}
    sackConsume(r.cost);
    setTierOf(r.toolType,r.tierIdx);
    rebuildHotbar();
    const newIdx=hotbar.findIndex(h=>h.type===r.toolType);
    if(newIdx>=0)selectDefenseSlot(newIdx); // 제작 즉시 자동 장착
    setDefenseMsg(`✅ ${r.icon} ${r.name} 제작 완료! (자동 장착됨)`);
  } else if(r.kind==='consumable'){
    if(!craftTableBuilt){setDefenseMsg('제작대를 먼저 건설하세요');return;}
    if(!sackHasEnough(r.cost)){setDefenseMsg('재료가 부족합니다');return;}
    sackConsume(r.cost);
    if(!sackAdd(r.outputId,r.outputQty)){setDefenseMsg('🎒 자루가 가득 찼습니다');return;}
    setDefenseMsg(`✅ ${r.icon} ${r.name} 제작 완료!`);
  } else if(r.kind==='equip_once'){
    if(!craftTableBuilt){setDefenseMsg('제작대를 먼저 건설하세요');return;}
    if(r.flagGet())return;
    if(!sackHasEnough(r.cost)){setDefenseMsg('재료가 부족합니다');return;}
    sackConsume(r.cost);
    r.apply();
    setDefenseMsg(`✅ ${r.icon} ${r.name} 획득!`);
  } else if(r.kind==='build_once'){
    if(r.flagGet()){setDefenseMsg('이미 건설했습니다');return;}
    if(!r.unlockGet()){setDefenseMsg('아직 해금되지 않았습니다 (캠프파이어 레벨업 필요)');return;}
    if(!sackHasEnough(r.cost)){setDefenseMsg('재료가 부족합니다');return;}
    sackConsume(r.cost);
    r.apply();
    setDefenseMsg(`✅ ${r.icon} ${r.name} 건설 완료!`);
  } else if(r.kind==='build_repeat'){
    if(!r.unlockGet()){setDefenseMsg('제작대를 먼저 건설하세요');return;}
    if(!sackHasEnough(r.cost)){setDefenseMsg('재료가 부족합니다');return;}
    startPlacing(r.placeKind,r.cost,r.icon,r.name); // 자원은 실제로 설치를 확정할 때 소모됨
  }
  rebuildHotbar();
  renderDefenseCraftList();
}

function openDefenseCraft(tab){
  document.getElementById('defenseCraftModal').style.display='flex';
  switchDefenseCraftTab(tab||'build');
}
function closeDefenseCraft(){
  document.getElementById('defenseCraftModal').style.display='none';
}
function switchDefenseCraftTab(tab){
  _dcTab=tab;
  document.getElementById('dcTabBuild').classList.toggle('on',tab==='build');
  document.getElementById('dcTabCraft').classList.toggle('on',tab==='craft');
  document.getElementById('dcTabWeapon').classList.toggle('on',tab==='weapon');
  document.getElementById('dcTabArmor').classList.toggle('on',tab==='armor');
  const titles={build:'🏗 건설',craft:'🪓 도구',weapon:'⚔️ 무기',armor:'🛡 방어구'};
  document.getElementById('defenseCraftTitle').textContent=titles[tab];
  renderDefenseCraftList();
}

function renderRecipeCard(html_cost,name,icon,note,disabled,btnLabel,onclickAttr){
  return `<div style="display:flex;justify-content:space-between;align-items:center;background:#1f1a10;border:1px solid #3a2f18;border-radius:10px;padding:10px 14px;gap:10px;">
    <div>
      <div style="font-weight:800;color:#fde68a;">${icon} ${name}</div>
      <div style="font-size:11px;color:#9ca3af;">필요: ${html_cost}${note?' · '+note:''}</div>
    </div>
    <button ${disabled?'disabled':''} ${onclickAttr} style="padding:8px 16px;border:none;border-radius:8px;font-weight:800;flex-shrink:0;cursor:${disabled?'default':'pointer'};background:${disabled?'#374151':'linear-gradient(135deg,#a3853a,#78350f)'};color:${disabled?'#6b7280':'#fff'};">${btnLabel}</button>
  </div>`;
}
function costTxt(cost){return Object.entries(cost).map(([k,v])=>`${RESOURCE_ICON[k]||k}${v}`).join(' ');}

function renderDefenseCraftList(){
  const list=document.getElementById('defenseCraftList');
  if(!list)return;
  if(_dcTab==='build'){
    if(!craftTableUnlocked){
      list.innerHTML=`<div style="color:#9ca3af;text-align:center;padding:20px;font-size:13px;">캠프파이어에 나무를 넣어 Lv.2를 달성하면<br>건설 메뉴가 열립니다.</div>`;
      return;
    }
    list.innerHTML=BUILD_RECIPES.filter(themeVisible).map(r=>{
      let disabled,note,btnLabel;
      if(r.kind==='build_once'){
        const built=r.flagGet(),unlocked=r.unlockGet();
        disabled=built||!unlocked||!sackHasEnough(r.cost);
        note=built?'건설 완료':(!unlocked?'미해금':'');
        btnLabel=built?'완료':'건설';
      } else {
        const unlocked=r.unlockGet();
        disabled=!unlocked||!sackHasEnough(r.cost);
        note=(!unlocked?'제작대 필요':(r.desc||''));
        btnLabel='설치';
      }
      return renderRecipeCard(costTxt(r.cost),r.name,r.icon,note,disabled,btnLabel,`onclick="craftItem('${r.id}')"`);
    }).join('');
    return;
  }
  if(!craftTableBuilt){
    list.innerHTML=`<div style="color:#9ca3af;text-align:center;padding:20px;font-size:13px;">🔨 건설 탭에서 제작대를 먼저 지어주세요.</div>`;
    return;
  }
  if(_dcTab==='weapon'&&!weaponTableBuilt){
    list.innerHTML=`<div style="color:#9ca3af;text-align:center;padding:20px;font-size:13px;">⚔️ 건설 탭에서 무기제작대를 먼저 지어주세요.<br>(캠프파이어 Lv.3 필요)</div>`;
    return;
  }
  const recipes=(_dcTab==='craft'?CRAFT_RECIPES:_dcTab==='weapon'?curWeaponRecipes():curArmorRecipes()).filter(themeVisible);
  list.innerHTML=recipes.map(r=>{
    let disabled,note,btnLabel;
    if(r.kind==='tool'){
      const cur=curTierOf(r.toolType);
      const owned=cur>=r.tierIdx, prereqOk=cur===r.tierIdx-1, lvOk=campfire.level>=r.minCfLevel, costOk=sackHasEnough(r.cost);
      disabled=owned||!prereqOk||!lvOk||!costOk;
      const notes=[];
      if(!lvOk)notes.push('캠프파이어 Lv.'+r.minCfLevel+' 필요');
      if(!prereqOk&&!owned)notes.push('이전 단계 필요');
      note=owned?'보유중':notes.join(' · ');
      btnLabel=owned?'완료':'제작';
    } else if(r.kind==='consumable'){
      disabled=!sackHasEnough(r.cost);
      note=r.desc||'';
      btnLabel='제작';
    } else {
      const owned=r.flagGet();
      disabled=owned||!sackHasEnough(r.cost);
      note=owned?'보유중':(r.desc||'');
      btnLabel=owned?'완료':'제작';
    }
    return renderRecipeCard(costTxt(r.cost),r.name,r.icon,note,disabled,btnLabel,`onclick="craftItem('${r.id}')"`);
  }).join('');
}

// ── 인벤토리 / 장비 패널 ──
function openDefenseInventory(){
  document.getElementById('defenseInvModal').style.display='flex';
  renderDefenseInventory();
}
function closeDefenseInventory(){
  document.getElementById('defenseInvModal').style.display='none';
}
function renderDefenseInventory(){
  const list=document.getElementById('defenseInvList');
  if(!list)return;
  let html='';
  html+=`<div style="color:#fde68a;font-weight:800;margin-bottom:4px;">🎒 자루 (${Object.keys(sack.stacks).length}/${sack.slots})</div>`;
  const entries=Object.entries(sack.stacks);
  html+=entries.length?entries.map(([k,v])=>`<div style="display:flex;justify-content:space-between;background:#1f1a10;border:1px solid #3a2f18;border-radius:8px;padding:6px 12px;margin-bottom:4px;"><span>${RESOURCE_ICON[k]||k} ${k}</span><span style="color:#fde68a;font-weight:800;">${v}</span></div>`).join(''):'<div style="color:#6b7280;font-size:12px;">비어있음</div>';
  html+=`<div style="color:#fde68a;font-weight:800;margin:12px 0 4px;">🛠 장비</div>`;
  const eq=[
    ['🪓 도끼',axeTier>=0?TOOL_LABEL[axeTier]:'없음'],
    ['⛏ 곡괭이',pickaxeTier>=0?TOOL_LABEL[pickaxeTier]:'없음'],
    ['🗡 무기',weaponTier>=0?curWeaponLabel(weaponTier):'없음'],
    ['🦺 방어구',armorTier>=0?curArmorLabel(armorTier)+(isSnowTheme()?' 코트 (방어력 ':' 갑옷 (방어력 ')+ARMOR_DEFENSE[armorTier]+')':'없음'],
  ];
  if(isSnowTheme())eq.push(['🧣 방한 털안감',hasFurLining?'보유':'없음']);
  else eq.push(['🧥 방한 코트',hasWarmCoat?'보유':'없음'],['🧣 사막 두건',hasDesertHood?'보유':'없음']);
  eq.push(['🔦 손전등 배터리',Math.round(flashlightBattery)+'%']);
  html+=eq.map(([k,v])=>`<div style="display:flex;justify-content:space-between;background:#1f1a10;border:1px solid #3a2f18;border-radius:8px;padding:6px 12px;margin-bottom:4px;"><span>${k}</span><span style="color:#93c5fd;font-weight:800;">${v}</span></div>`).join('');
  html+=`<div style="color:#fde68a;font-weight:800;margin:12px 0 4px;">🏕 캠프파이어</div>`;
  html+=`<div style="display:flex;justify-content:space-between;background:#1f1a10;border:1px solid #3a2f18;border-radius:8px;padding:6px 12px;"><span>Lv.${campfire.level} · 반경 ${campfire.radius}</span><span style="color:#fb923c;font-weight:800;">${Math.ceil(campfire.hp)}/${campfire.maxHp}</span></div>`;
  list.innerHTML=html;
}

// ── 상자 확률 (기존 rollPetRarity() 재사용, 19-pets.js) — 100% 보상 보장 ──
const CHEST_WEIGHTS={common:30,iron:15,gold:7,diamond:4,ruby:2};
const CHEST_LOOT={
  common:{label:'📦 일반 상자',color:'#c8965a',give:()=>{sackAdd('wood',10);sackAdd('stone',5);}},
  iron:{label:'⬜ 철 상자',color:'#94a3b8',give:()=>{sackAdd('iron',8);sackAdd('stone',10);}},
  gold:{label:'🟨 금 상자',color:'#fbbf24',give:()=>{sackAdd('gold',6);sackAdd('iron',6);}},
  diamond:{label:'🟦 다이아 상자',color:'#22d3ee',give:()=>{sack.slots=Math.max(sack.slots,8);sackAdd('diamond',4);sackAdd('gold',6);}},
  ruby:{label:'🟥 루비 상자',color:'#f43f5e',give:()=>{sack.slots=8;sackAdd('diamond',8);sackAdd('desert_crystal',5);sackAdd('ice',5);}},
};
function rollDefenseChest(){return rollPetRarity(CHEST_WEIGHTS);}
function showDefenseChestResult(tier){
  const modal=document.getElementById('defenseChestModal');
  const tierEl=document.getElementById('defenseChestTier');
  const rewardEl=document.getElementById('defenseChestReward');
  if(!modal||!tierEl||!rewardEl)return;
  const info=CHEST_LOOT[tier]||CHEST_LOOT.common;
  info.give();
  tierEl.textContent=`${info.label} 발견!`;tierEl.style.color=info.color;
  rewardEl.textContent=(tier==='diamond'||tier==='ruby')?'자원을 획득하고 자루가 8칸으로 확장되었습니다!':'자원을 획득했습니다!';
  modal.style.display='flex';
}
function closeDefenseChest(){
  const modal=document.getElementById('defenseChestModal');
  if(modal)modal.style.display='none';
}
