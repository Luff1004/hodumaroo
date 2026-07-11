// ══════════════ 디펜스 모드: 위험한 캠핑 ══════════════
// 기존 웨이브/보스 엔진(zoms/buls/MW/MH)과 완전히 분리된 독립 월드.
// update()/draw()가 selMap.id==='danger_camp'일 때 이 파일의 함수로 조기 위임한다.

const DMW=8000, DMH=8000; // 정사각형 대형 월드 (기존 MW/MH와 무관)
let dCamX=0, dCamY=0;

// 낮/밤 사이클 — 60fps 고정 스텝 기준 프레임 카운터 (setInterval 아님)
const DAY_FRAMES=5400, NIGHT_FRAMES=1800; // 낮 90초 / 밤 30초 (낮이 훨씬 길게)
let dnDay=1, dnPhase='day', dnTimer=0;

// 캠프파이어(베이스)
let campfire={x:DMW/2,y:DMH/2,radius:250,level:1,dep:{},hp:200,maxHp:200};
const CF_INTERACT_RANGE=90;
// 나무 = 캠프파이어 XP. 인덱스 i = 레벨(i+1)에 도달하기 위한 누적 나무 투입량.
const CF_WOOD_REQ=[0,30,100,250,500,900];
const CF_MAX_LEVEL=CF_WOOD_REQ.length;
let craftTableUnlocked=false, craftTableBuilt=false;
let weaponTableUnlocked=false, weaponTableBuilt=false;

// 자루(스택형 인벤토리)
let sack={slots:5,stacks:{}};

// 도구/무기/방어구 등급
const TOOL_TIERS=['wood','stone','iron','gold','diamond'];
const TOOL_LABEL=['나무','돌','철','금','다이아'];
let axeTier=-1, pickaxeTier=-1, weaponTier=-1, armorTier=-1;
const WEAPON_DMG=[10,18,28,42];
const WEAPON_LABEL=['돌 투창','철 투창','금 투창','다이아 투창'];
const ARMOR_LABEL=['가죽','철','금','다이아'];
const ARMOR_DEFENSE=[8,18,30,45];
const ARMOR_HP_BONUS=[20,40,70,110];
let hasWarmCoat=false, hasDesertHood=false;

// 배고픔 / 손전등 / 스태미나
let hunger=100;
let flashlightOn=false, flashlightBattery=100;
let stamina=100, sprinting=false;
let pFaceAngle=Math.PI/2; // 손전등 방향(마지막 이동 방향 기준)

// 연출용 부가 상태(파티클/화면흔들림/낮밤 전환 틴트/앰비언트)
let fxParticles=[], ambientParticles=[];
let shakeT=0, shakeMag=0;
let transitionT=0, transitionRGB=[0,0,0], transitionMaxA=0;

// 핫바
let hotbar=[], selectedSlot=0;

// 자원 노드 / 드랍 / 좀비 / 구조물 / 장식
let resNodes=[], drops=[], dzoms=[], structures=[], decor=[];
const NODE_ICON={tree:'🌳',rock_stone:'🪨',rock_iron:'⛰️',rock_gold:'⛰️',rock_diamond:'⛰️',rabbit:'🐇',wolf:'🐺',crystal:'🔶',ice:'🧊',golden_rabbit:'🐇'};
const HITS_REQ={tree:5,rock_stone:5,rock_iron:7,rock_gold:9,rock_diamond:12,crystal:5,ice:5};
const TIER_REQ_IDX={rock_stone:0,rock_iron:1,rock_gold:2,rock_diamond:3};
const YIELD={tree:{kind:'wood',qty:3},rock_stone:{kind:'stone',qty:2},rock_iron:{kind:'iron',qty:2},rock_gold:{kind:'gold',qty:1},rock_diamond:{kind:'diamond',qty:1},crystal:{kind:'desert_crystal',qty:2},ice:{kind:'ice',qty:2}};
const RESOURCE_ICON={wood:'🪵',stone:'🪨',iron:'⛓️',gold:'🟡',diamond:'💎',desert_crystal:'🔶',ice:'🧊',pelt:'🦫',meat:'🍖',cooked_meat:'🍗',bandage:'🩹',jerky:'🥩',battery:'🔋',waterskin:'💧'};
const DROP_ICON=RESOURCE_ICON;
const CHEST_TIER_COLOR={common:'#8b5a2b',iron:'#94a3b8',gold:'#fbbf24',diamond:'#22d3ee',ruby:'#f43f5e'};
const DECOR_ICONS=['🪦','🏚️','🛖','🗿','⚱️','🪵','🦴'];

const DEFENSE_BOSSES=[
  {name:'폐허의 파수꾼',icon:'🗿',hp:900,spd:0.9,dmg:9,atkDmg:26,col:'#9ca3af'},
  {name:'심연의 파괴자',icon:'👹',hp:2000,spd:1.0,dmg:13,atkDmg:38,col:'#dc2626'},
  {name:'재앙의 화신',icon:'💀',hp:3300,spd:1.1,dmg:17,atkDmg:50,col:'#7c3aed'},
];

let defenseWon=false, defenseOver=false;

function dClampX(x){return Math.max(0,Math.min(Math.max(0,DMW-VW()),x));}
function dClampY(y){return Math.max(0,Math.min(Math.max(0,DMH-VH()),y));}

function setDefenseMsg(t){
  setMsg(t);
  clearTimeout(window._dmsgT);
  window._dmsgT=setTimeout(()=>{if(running)setMsg('');},2500);
}

// ── 연출 유틸(파티클/화면흔들림) ──
function spawnFx(x,y,color,count,speed){
  for(let i=0;i<count;i++){
    const a=Math.random()*Math.PI*2, s=(speed||3)*(0.5+Math.random());
    fxParticles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:18+Math.random()*10,maxLife:28,color,size:2+Math.random()*2});
  }
}
function addShake(mag){shakeMag=Math.max(shakeMag,mag);shakeT=10;}
function tickAutoPickup(){
  if(!drops.length)return;
  drops=drops.filter(d=>{
    if(Math.hypot(d.x-P.x,d.y-P.y)<34)return !sackAdd(d.kind,d.qty);
    return true;
  });
}
function tickAmbientFx(){
  fxParticles=fxParticles.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.vx*=0.92;p.vy*=0.92;p.life--;return p.life>0;});
  if(Math.random()<0.35){
    fxParticles.push({x:campfire.x+(Math.random()-.5)*12,y:campfire.y-8,vx:(Math.random()-.5)*.3,vy:-0.6-Math.random()*.5,life:45,maxLife:45,color:'#f97316',size:1.5+Math.random()*1.5});
  }
  if(window._lastPHp==null)window._lastPHp=P.hp;
  if(P.hp<window._lastPHp-0.01)addShake(7);
  window._lastPHp=P.hp;
  if(shakeT>0){shakeT--;if(shakeT<=0)shakeMag=0;}
  if(ambientParticles.length<14&&Math.random()<0.05){
    const a=Math.random()*Math.PI*2, d=250+Math.random()*450;
    ambientParticles.push({x:P.x+Math.cos(a)*d,y:P.y+Math.sin(a)*d,phase:Math.random()*Math.PI*2,night:dnPhase==='night'});
  }
  ambientParticles.forEach(a=>{
    a.phase+=0.05;
    a.x+=Math.cos(a.phase)*0.6;
    a.y+=Math.sin(a.phase*1.3)*0.6;
  });
  ambientParticles=ambientParticles.filter(a=>Math.hypot(a.x-P.x,a.y-P.y)<1000);
  if(transitionT>0)transitionT--;
}
function drawFx(){
  fxParticles.forEach(p=>{
    ctx.globalAlpha=Math.max(0,p.life/p.maxLife);
    ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();
  });
  ctx.globalAlpha=1;
  ambientParticles.forEach(a=>{
    if(a.night){
      const flick=0.5+0.5*Math.sin(Date.now()/300+a.phase*5);
      ctx.fillStyle=`rgba(253,224,71,${0.35+0.45*flick})`;
      ctx.beginPath();ctx.arc(a.x,a.y,2.2,0,Math.PI*2);ctx.fill();
    } else {
      ctx.font='12px sans-serif';ctx.textAlign='center';ctx.globalAlpha=0.75;
      ctx.fillText('🦋',a.x,a.y);ctx.globalAlpha=1;
    }
  });
}

function inSnowZone(x,y){return x<DMW*0.4&&y<DMH*0.4;}
function inDesertZone(x,y){return x>DMW*0.6&&y>DMH*0.6;}

// ── 초기화 / 정리 ──
function initDefenseMode(){
  dCamX=0;dCamY=0;
  dnDay=1;dnPhase='day';dnTimer=0;
  campfire={x:DMW/2,y:DMH/2,radius:250,level:1,dep:{},hp:200,maxHp:200};
  sack={slots:5,stacks:{}};
  axeTier=0;pickaxeTier=-1;weaponTier=-1;armorTier=-1; // 시작 지급: 나무 도끼
  hasWarmCoat=false;hasDesertHood=false;
  craftTableUnlocked=false;craftTableBuilt=false;
  weaponTableUnlocked=false;weaponTableBuilt=false;
  defenseWon=false;defenseOver=false;
  hunger=100;
  flashlightOn=false;flashlightBattery=100;
  stamina=100;sprinting=false;pFaceAngle=Math.PI/2;
  selectedSlot=0;
  fxParticles=[];ambientParticles=[];shakeT=0;shakeMag=0;transitionT=0;
  window._lastPHp=null;
  resNodes=[];drops=[];dzoms=[];structures=[];decor=[];
  P.x=campfire.x;P.y=campfire.y+60;
  spawnDefenseWorld();
  sackAdd('wood',35); // 캠핑 시작 키트: 나무를 챙겨왔다는 설정 (바로 캠프파이어 레벨업 가능)
  rebuildHotbar();
  const axeIdx=hotbar.findIndex(h=>h.type==='axe');
  if(axeIdx>=0)selectedSlot=axeIdx; // 시작 도끼를 바로 장착한 상태로 시작
}
function resetDefenseMode(){
  resNodes=[];drops=[];dzoms=[];structures=[];decor=[];
}

function randPointAnnulus(cx,cy,rMin,rMax){
  const a=Math.random()*Math.PI*2, r=rMin+Math.random()*(rMax-rMin);
  return {x:Math.max(0,Math.min(DMW,cx+Math.cos(a)*r)), y:Math.max(0,Math.min(DMH,cy+Math.sin(a)*r))};
}
function randPointRect(x0,y0,x1,y1){
  return {x:x0+Math.random()*(x1-x0), y:y0+Math.random()*(y1-y0)};
}

function spawnDefenseWorld(){
  const cx=campfire.x, cy=campfire.y;
  const addNode=(kind,x,y,scaleMin,scaleMax)=>{
    const n={kind,x,y,dead:false,_flash:0,scale:scaleMin+Math.random()*(scaleMax-scaleMin)};
    if(HITS_REQ[kind]){n.hits=HITS_REQ[kind];n.hitsLeft=n.hits;n.respawnT=0;}
    if(kind==='rabbit'){n.hp=4;n.maxHp=4;n.vx=0;n.vy=0;n.wanderT=0;}
    if(kind==='wolf'){n.hp=10;n.maxHp=10;n.vx=0;n.vy=0;n.wanderT=0;n._pAtkT=0;}
    resNodes.push(n);
    return n;
  };
  for(let i=0;i<380;i++){const p=randPointAnnulus(cx,cy,300,3500);addNode('tree',p.x,p.y,1.5,2.8);}
  for(let i=0;i<150;i++){const p=randPointAnnulus(cx,cy,300,4000);addNode('rock_stone',p.x,p.y,0.7,1.5);}
  for(let i=0;i<80;i++){const p=randPointAnnulus(cx,cy,1500,4500);addNode('rock_iron',p.x,p.y,0.7,1.5);}
  for(let i=0;i<50;i++){const p=randPointAnnulus(cx,cy,2500,5500);addNode('rock_gold',p.x,p.y,0.7,1.4);}
  for(let i=0;i<25;i++){const p=randPointAnnulus(cx,cy,3500,6500);addNode('rock_diamond',p.x,p.y,0.7,1.4);}
  for(let i=0;i<10;i++){const p=randPointAnnulus(cx,cy,300,2600);addNode('rabbit',p.x,p.y,1,1);}
  for(let i=0;i<12;i++){const p=randPointAnnulus(cx,cy,900,4000);addNode('wolf',p.x,p.y,1,1);}
  for(let i=0;i<40;i++){const p=randPointRect(0,0,DMW*0.38,DMH*0.38);addNode('ice',p.x,p.y,0.8,1.4);}
  for(let i=0;i<40;i++){const p=randPointRect(DMW*0.62,DMH*0.62,DMW,DMH);addNode('crystal',p.x,p.y,0.8,1.4);}
  // 상자 — 스폰 시점에 등급을 미리 굴려서 고정(색상으로 구분 가능하도록)
  for(let i=0;i<18;i++){
    const p=randPointAnnulus(cx,cy,300,6800);
    const n={kind:'chest',x:p.x,y:p.y,dead:false,_flash:0,scale:1,tier:rollDefenseChest()};
    resNodes.push(n);
  }
  // 장식용 구조물(기능 없음, 비주얼 다양성)
  for(let i=0;i<50;i++){
    const p=randPointAnnulus(cx,cy,400,7000);
    decor.push({x:p.x,y:p.y,icon:DECOR_ICONS[Math.floor(Math.random()*DECOR_ICONS.length)],scale:0.8+Math.random()*0.8});
  }
}

// ── 자루 ──
function sackAdd(type,qty){
  if(!(type in sack.stacks)){
    if(Object.keys(sack.stacks).length>=sack.slots) return false;
    sack.stacks[type]=0;
  }
  sack.stacks[type]+=qty;
  rebuildHotbar();
  return true;
}
function sackHasEnough(cost){return Object.entries(cost).every(([k,v])=>(sack.stacks[k]||0)>=v);}
function sackConsume(cost){Object.entries(cost).forEach(([k,v])=>{sack.stacks[k]=(sack.stacks[k]||0)-v;if(sack.stacks[k]<=0)delete sack.stacks[k];});rebuildHotbar();}

// ── 캠프파이어 (나무 = XP) ──
let campfireLevelUpFx=0; // 레벨업 시 잠깐 반짝이는 이펙트 타이머
function checkCampfireLevelUp(){
  let leveled=true;
  while(leveled){
    leveled=false;
    const nextLevel=campfire.level+1;
    if(nextLevel<=CF_MAX_LEVEL && (campfire.dep.wood||0)>=CF_WOOD_REQ[nextLevel-1]){
      campfire.level=nextLevel;campfire.radius+=150;leveled=true;campfireLevelUpFx=45;
      P.maxHp+=15;P.hp+=15; // 레벨업 시 영구 최대체력 증가
      if(nextLevel===2){craftTableUnlocked=true;sackAdd('wood',40);setDefenseMsg('🔥 캠프파이어 Lv.2! 최대체력 +15 · 🔨 건설 버튼에서 제작대를 지어보세요 (+나무 40)');}
      else if(nextLevel===3){weaponTableUnlocked=true;setDefenseMsg('🔥 캠프파이어 Lv.3! 최대체력 +15 · 🔨 건설 버튼에서 무기제작대를 지어보세요');}
      else setDefenseMsg(`🔥 캠프파이어 Lv.${nextLevel}! 최대체력 +15 · 반경 확대`);
    }
  }
}
function campfireLevelProgress(){
  if(campfire.level>=CF_MAX_LEVEL)return {cur:1,max:1,pct:1,maxed:true};
  const curReq=CF_WOOD_REQ[campfire.level-1];
  const nextReq=CF_WOOD_REQ[campfire.level];
  const dep=campfire.dep.wood||0;
  return {cur:Math.max(0,dep-curReq),max:nextReq-curReq,pct:Math.max(0,Math.min(1,(dep-curReq)/(nextReq-curReq))),maxed:false};
}
function damageCampfire(dmg){
  if(defenseWon||defenseOver)return;
  campfire.hp-=dmg;
  if(campfire.hp<=0){campfire.hp=0;loseDefenseGame();}
}

// ── 상호작용(E) ──
const STRUCT_INTERACT_RANGE=70;
function craftTablePos(){return {x:campfire.x+180,y:campfire.y};}
function weaponTablePos(){return {x:campfire.x-180,y:campfire.y};}
function interactDefense(){
  if(!P||!running)return;
  // 제작대/무기제작대는 캠프파이어와 겹치지 않도록 별도 위치·범위로 우선 확인한다
  if(craftTableBuilt){
    const p=craftTablePos();
    if(Math.hypot(P.x-p.x,P.y-p.y)<STRUCT_INTERACT_RANGE){openDefenseCraft('craft');return;}
  }
  if(weaponTableBuilt){
    const p=weaponTablePos();
    if(Math.hypot(P.x-p.x,P.y-p.y)<STRUCT_INTERACT_RANGE){openDefenseCraft('weapon');return;}
  }
  const cfDist=Math.hypot(P.x-campfire.x,P.y-campfire.y);
  if(cfDist<CF_INTERACT_RANGE){
    if((sack.stacks.wood||0)>0){
      const added=sack.stacks.wood;
      campfire.dep.wood=(campfire.dep.wood||0)+added;
      delete sack.stacks.wood;
      const healAmt=Math.min(P.maxHp-P.hp,Math.round(added*0.6));
      if(healAmt>0)P.hp+=healAmt;
      checkCampfireLevelUp();
      rebuildHotbar();
      setDefenseMsg(`🔥 나무 ${added}개를 넣었습니다 (XP +${added}${healAmt>0?`, 체력 +${healAmt}`:''})`);
      return;
    }
    if((sack.stacks.meat||0)>0){
      sack.stacks.meat--;if(sack.stacks.meat<=0)delete sack.stacks.meat;
      sackAdd('cooked_meat',1);
      setDefenseMsg('🍗 고기를 구웠습니다!');
      return;
    }
    if(craftTableUnlocked&&!craftTableBuilt){setDefenseMsg('🔨 건설 버튼을 눌러 제작대를 지어보세요!');return;}
    setDefenseMsg('자원을 모아 캠프파이어에 넣어보세요 (E)');
    return;
  }
  const chest=resNodes.find(n=>!n.dead&&n.kind==='chest'&&Math.hypot(n.x-P.x,n.y-P.y)<60);
  if(chest){openChest(chest);return;}
  let picked=false;
  drops=drops.filter(d=>{
    if(Math.hypot(d.x-P.x,d.y-P.y)<60){
      if(sackAdd(d.kind,d.qty)){picked=true;return false;}
      setDefenseMsg('🎒 자루가 가득 찼습니다');return true;
    }
    return true;
  });
  if(!picked)setDefenseMsg('주변에 상호작용할 대상이 없습니다');
}

function openChest(node){
  node.dead=true;
  showDefenseChestResult(node.tier);
}

// ── 핫바 ──
function rebuildHotbar(){
  const prevType=hotbar[selectedSlot]&&hotbar[selectedSlot].type;
  hotbar=[{type:'fists',icon:'✊',label:'맨손 (전투용)'}];
  if(axeTier>=0)hotbar.push({type:'axe',icon:'🪓',label:TOOL_LABEL[axeTier]+' 도끼'});
  if(pickaxeTier>=0)hotbar.push({type:'pickaxe',icon:'⛏',label:TOOL_LABEL[pickaxeTier]+' 곡괭이'});
  if(weaponTier>=0)hotbar.push({type:'weapon',icon:'🗡',label:WEAPON_LABEL[weaponTier]});
  hotbar.push({type:'flashlight',icon:'🔦',label:'손전등'});
  if((sack.stacks.meat||0)>0)hotbar.push({type:'food',food:'meat',icon:'🍖',label:'고기'});
  if((sack.stacks.cooked_meat||0)>0)hotbar.push({type:'food',food:'cooked_meat',icon:'🍗',label:'익힌 고기'});
  if((sack.stacks.jerky||0)>0)hotbar.push({type:'food',food:'jerky',icon:'🥩',label:'육포'});
  if((sack.stacks.waterskin||0)>0)hotbar.push({type:'food',food:'waterskin',icon:'💧',label:'물통'});
  if((sack.stacks.bandage||0)>0)hotbar.push({type:'bandage',icon:'🩹',label:'붕대'});
  if((sack.stacks.battery||0)>0)hotbar.push({type:'battery',icon:'🔋',label:'배터리'});
  if(prevType){const ni=hotbar.findIndex(h=>h.type===prevType);if(ni>=0)selectedSlot=ni;else selectedSlot=0;}
  if(selectedSlot>=hotbar.length)selectedSlot=0;
}
function selectDefenseSlot(i){
  if(i<0||i>=hotbar.length)return;
  selectedSlot=i;
  // 손전등은 별도 on/off 토글이 아니라 "장착 중일 때만 켜짐" — 장착 즉시 배터리 있으면 자동 점등, 다른 슬롯으로 바꾸면 자동 소등
  if(hotbar[i].type==='flashlight'){
    if(flashlightBattery<=0)setDefenseMsg('🔋 배터리가 없습니다');
    else setDefenseMsg('🔦 손전등 장착 (다른 슬롯 선택 시 꺼짐)');
  }
}
function useSelectedConsumable(){
  const slot=hotbar[selectedSlot];if(!slot)return;
  if(slot.type==='food'){
    const eff={meat:{hunger:20},cooked_meat:{hunger:35},jerky:{hunger:15},waterskin:{hunger:10}}[slot.food];
    if(!eff||(sack.stacks[slot.food]||0)<=0)return;
    sack.stacks[slot.food]--;if(sack.stacks[slot.food]<=0)delete sack.stacks[slot.food];
    hunger=Math.min(100,hunger+eff.hunger);
    rebuildHotbar();
    setDefenseMsg(`${slot.icon} 배고픔 +${eff.hunger}`);
  } else if(slot.type==='bandage'){
    if((sack.stacks.bandage||0)<=0)return;
    sack.stacks.bandage--;if(sack.stacks.bandage<=0)delete sack.stacks.bandage;
    P.hp=Math.min(P.maxHp,P.hp+30);
    rebuildHotbar();
    setDefenseMsg('🩹 체력 +30');
  } else if(slot.type==='battery'){
    if((sack.stacks.battery||0)<=0)return;
    sack.stacks.battery--;if(sack.stacks.battery<=0)delete sack.stacks.battery;
    flashlightBattery=100;
    rebuildHotbar();
    setDefenseMsg('🔋 배터리 충전 완료');
  }
}

// ── 도구 채집 / 근접 전투 (좌클릭, 선택된 핫바 슬롯 기준) ──
function currentAttackDmg(){
  const slot=hotbar[selectedSlot];
  if(!slot)return 3;
  if(slot.type==='weapon')return WEAPON_DMG[weaponTier];
  if(slot.type==='axe')return axeTier>=0?4+axeTier*2.5:3;
  return 3; // 맨손
}
function swingTool(){
  if(!P||!running)return;
  if(placingStructure){confirmPlacing();return;}
  const slot=hotbar[selectedSlot];
  if(!slot)return;
  const range=70;
  if(slot.type==='flashlight'){return;}
  if(slot.type==='food'||slot.type==='bandage'||slot.type==='battery'){useSelectedConsumable();return;}
  if(slot.type==='weapon'||slot.type==='fists'){
    // 맨손/무기: 오직 전투 전용(늑대·좀비). 채집은 도끼/곡괭이로만 한다.
    let target=null,td=Infinity;
    dzoms.forEach(z=>{if(z.dead)return;const d=Math.hypot(z.x-P.x,z.y-P.y);if(d<range&&d<td){td=d;target=z;}});
    resNodes.forEach(n=>{if(n.dead||(n.kind!=='wolf'&&n.kind!=='golden_rabbit'))return;const d=Math.hypot(n.x-P.x,n.y-P.y);if(d<range&&d<td){td=d;target=n;}});
    if(target){attackHostile(target);return;}
    if(slot.type==='fists'){
      // 도끼/곡괭이 없이 채집을 시도한 경우 — 아무 반응 없이 넘어가지 않고 이유를 알려준다.
      const near=resNodes.find(n=>!n.dead&&['tree','rock_stone','rock_iron','rock_gold','rock_diamond','crystal','ice'].includes(n.kind)&&Math.hypot(n.x-P.x,n.y-P.y)<range);
      if(near){
        const isAxeType=(near.kind==='tree'||near.kind==='crystal'||near.kind==='ice');
        setDefenseMsg(isAxeType?'🪓 도끼가 필요합니다! 핫바에서 도끼를 만들고 장착하세요':'⛏ 곡괭이가 필요합니다! 핫바에서 곡괭이를 만들고 장착하세요');
      }
    }
    return;
  }
  if(slot.type==='axe'){
    let node=null,nd=Infinity;
    resNodes.forEach(n=>{if(n.dead)return;if(!['tree','crystal','ice','rabbit','golden_rabbit'].includes(n.kind))return;const d=Math.hypot(n.x-P.x,n.y-P.y);if(d<range&&d<nd){nd=d;node=n;}});
    if(node)harvestNode(node);
    return;
  }
  if(slot.type==='pickaxe'){
    let node=null,nd=Infinity;
    resNodes.forEach(n=>{if(n.dead)return;if(!n.kind.startsWith('rock_'))return;const d=Math.hypot(n.x-P.x,n.y-P.y);if(d<range&&d<nd){nd=d;node=n;}});
    if(node)harvestNode(node);
    return;
  }
}

function harvestNode(node){
  if(node.kind==='rabbit'||node.kind==='golden_rabbit'){attackHostile(node);return;}
  const isAxeType=(node.kind==='tree'||node.kind==='crystal'||node.kind==='ice');
  if(isAxeType){
    const power=axeTier>=0?1+axeTier*0.5:0.5;
    node.hitsLeft-=power;
  } else {
    const reqIdx=TIER_REQ_IDX[node.kind]||0;
    if(pickaxeTier<0){setDefenseMsg('⛏ 곡괭이가 필요합니다 (건설→도구)');return;}
    if(pickaxeTier<reqIdx){setDefenseMsg('⛏ 더 높은 등급의 곡괭이가 필요합니다');return;}
    const power=1+pickaxeTier*0.5;
    node.hitsLeft-=power;
  }
  node._flash=6;
  spawnFx(node.x,node.y,isAxeType?'#8b5a2b':'#9ca3af',4,2.2);
  if(node.hitsLeft<=0){
    const y=YIELD[node.kind];
    if(y)drops.push({kind:y.kind,x:node.x,y:node.y,qty:y.qty});
    node.dead=true;node.respawnT=2400;
    spawnFx(node.x,node.y,isAxeType?'#a16207':'#cbd5e1',8,3);
  }
}

function attackHostile(target){
  const dmg=currentAttackDmg();
  target.hp-=dmg;target._flash=6;
  spawnFx(target.x,target.y,'#ef4444',3,2);
  addShake(3);
  if(target.hp<=0&&!target.dead){
    target.dead=true;
    spawnFx(target.x,target.y,'#fbbf24',10,4);
    if(target.kind==='wolf'){drops.push({kind:'pelt',x:target.x,y:target.y,qty:1});drops.push({kind:'meat',x:target.x,y:target.y,qty:2});}
    else if(target.kind==='rabbit'){drops.push({kind:'meat',x:target.x,y:target.y,qty:1});}
    else if(target.kind==='golden_rabbit'){
      drops.push({kind:'meat',x:target.x,y:target.y,qty:5});
      drops.push({kind:'pelt',x:target.x,y:target.y,qty:3});
      drops.push({kind:'gold',x:target.x,y:target.y,qty:3});
      setDefenseMsg('✨ 황금 토끼를 잡았습니다! 큰 보상 획득!');
    }
    else if(target.isBoss){setDefenseMsg(`🎉 ${target.icon} ${target.name} 처치!`);addShake(9);}
  }
}

// ── 건설(구조물) — 직접 위치를 지정해서 설치 ──
const PLACE_MAX_DIST=420;
let placingStructure=null; // {kind,cost,icon,name}
function startPlacing(kind,cost,icon,name){
  placingStructure={kind,cost,icon,name};
  closeDefenseCraft();
  setDefenseMsg(`📍 ${icon||''} ${name||''} 설치 위치를 클릭하세요 (우클릭: 취소)`);
}
function cancelPlacing(){
  if(placingStructure){placingStructure=null;setDefenseMsg('❌ 설치를 취소했습니다');}
}
function defenseWorldMouse(){
  const ox=VW()>=DMW?(VW()-DMW)/2:-dCamX;
  const oy=VH()>=DMH?(VH()-DMH)/2:-dCamY;
  return {x:Math.max(0,Math.min(DMW,mx-ox)),y:Math.max(0,Math.min(DMH,my-oy)),ox,oy};
}
function confirmPlacing(){
  if(!placingStructure)return;
  const p=placingStructure;
  if(!sackHasEnough(p.cost)){setDefenseMsg('재료가 부족합니다');placingStructure=null;return;}
  const wm=defenseWorldMouse();
  const d=Math.hypot(wm.x-P.x,wm.y-P.y);
  if(d>PLACE_MAX_DIST){setDefenseMsg('플레이어와 너무 멉니다 (더 가까이서 클릭하세요)');return;}
  sackConsume(p.cost);
  if(p.kind==='barricade')structures.push({kind:'barricade',x:wm.x,y:wm.y,hp:80,maxHp:80});
  else if(p.kind==='torch')structures.push({kind:'torch',x:wm.x,y:wm.y});
  else if(p.kind==='trap')structures.push({kind:'trap',x:wm.x,y:wm.y,armed:true});
  setDefenseMsg(`✅ ${p.icon} ${p.name} 설치 완료!`);
  placingStructure=null;
  rebuildHotbar();
}
function drawPlacementGhost(ox,oy){
  if(!placingStructure)return;
  const wm=defenseWorldMouse();
  const d=Math.hypot(wm.x-P.x,wm.y-P.y);
  const ok=d<=PLACE_MAX_DIST;
  // 설치 가능 반경 표시(플레이어 기준, 화면 좌표)
  ctx.save();
  ctx.strokeStyle=ok?'rgba(74,222,128,.5)':'rgba(239,68,68,.5)';
  ctx.lineWidth=2;ctx.setLineDash([6,6]);
  ctx.beginPath();ctx.arc(P.x+ox,P.y+oy,PLACE_MAX_DIST,0,Math.PI*2);ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
  ctx.globalAlpha=0.55;
  if(placingStructure.kind==='barricade')drawBarricadeShape(wm.x+ox,wm.y+oy,null,null,ok?1:0.5);
  else if(placingStructure.kind==='torch')drawTorchShape(wm.x+ox,wm.y+oy,ok?1:0.5);
  else if(placingStructure.kind==='trap')drawTrapShape(wm.x+ox,wm.y+oy,true,ok?1:0.5);
  ctx.globalAlpha=1;
  if(!ok){
    ctx.fillStyle='#ef4444';ctx.font='bold 12px sans-serif';ctx.textAlign='center';
    ctx.fillText('너무 멉니다',wm.x+ox,wm.y+oy-40);
  }
}

// ── 낮/밤 사이클 ──
function tickDayNight(){
  dnTimer++;
  if(dnPhase==='day'){
    if(dnTimer>=DAY_FRAMES)startNight();
  } else {
    if(dnTimer>=NIGHT_FRAMES)startDay();
  }
}
const SURVIVAL_MILESTONES=[10,50,100,150,200];
function startNight(){
  dnPhase='night';dnTimer=0;
  spawnNightZombies();
  if(dnDay%10===0)spawnEscalationWave();
  if(dnDay%100===0)spawnDefenseBoss();
  transitionT=40;transitionRGB=[30,10,60];transitionMaxA=0.4;
  setDefenseMsg(`🌙 ${dnDay}일차 밤이 되었습니다... (좀비 ${dzoms.length}마리 접근 중)`);
}
function startDay(){
  dnPhase='day';dnTimer=0;dnDay++;
  dzoms=[];
  transitionT=40;transitionRGB=[135,206,250];transitionMaxA=0.3;
  if(dnDay>=250){winDefenseGame();return;}
  sackAdd('wood',2); // 아침 생존 보너스
  let msg=`☀️ ${dnDay}일차 낮이 밝았습니다.`;
  if(SURVIVAL_MILESTONES.includes(dnDay))msg=`🎉🎉 ${dnDay}일차 생존 달성! 대단한 기록입니다!`;
  if(Math.random()<0.15){
    const p=randPointAnnulus(campfire.x,campfire.y,300,1800);
    resNodes.push({kind:'golden_rabbit',x:p.x,y:p.y,dead:false,_flash:0,hp:8,maxHp:8,vx:0,vy:0,wanderT:0,scale:1.4});
    msg+=' ✨ 근처에 황금 토끼가 나타났습니다!';
  }
  setDefenseMsg(msg);
}

function spawnOneZombie(type){
  const ang=Math.random()*Math.PI*2, dist=900+Math.random()*300;
  const x=Math.max(0,Math.min(DMW,campfire.x+Math.cos(ang)*dist));
  const y=Math.max(0,Math.min(DMH,campfire.y+Math.sin(ang)*dist));
  const base={normal:{hp:14,spd:1.1,dmg:2,atkDmg:5,col:'#4ade80'},cultist:{hp:26,spd:1.3,dmg:3,atkDmg:7,col:'#a855f7'},mage:{hp:20,spd:1.0,dmg:4,atkDmg:8,col:'#38bdf8'}}[type]||{hp:14,spd:1.1,dmg:2,atkDmg:5,col:'#4ade80'};
  const scale=1+dnDay*0.01;
  dzoms.push({type,kind:'zombie',x,y,r:16,hp:base.hp*scale,maxHp:base.hp*scale,spd:base.spd,dmg:base.dmg,atkDmg:base.atkDmg,col:base.col,dead:false,_atkT:0,_pAtkT:0,_flash:0,_attackingBase:false,_target:null});
}
function spawnNightZombies(){
  const cnt=Math.min(40,3+Math.floor(dnDay/2));
  for(let i=0;i<cnt;i++)spawnOneZombie('normal');
}
function spawnEscalationWave(){
  const cnt=Math.min(20,4+Math.floor(dnDay/10));
  for(let i=0;i<cnt;i++)spawnOneZombie(Math.random()<0.5?'cultist':'mage');
  setDefenseMsg(`⚠️ ${dnDay}일차 강화 웨이브! 신도/마법사 출현`);
}
function spawnDefenseBoss(){
  const idx=Math.max(0,Math.min(DEFENSE_BOSSES.length-1,Math.floor(dnDay/100)-1));
  const bd=DEFENSE_BOSSES[idx];
  const ang=Math.random()*Math.PI*2,dist=1000;
  const x=Math.max(0,Math.min(DMW,campfire.x+Math.cos(ang)*dist));
  const y=Math.max(0,Math.min(DMH,campfire.y+Math.sin(ang)*dist));
  dzoms.push({type:'boss',kind:'zombie',isBoss:true,x,y,r:34,hp:bd.hp,maxHp:bd.hp,spd:bd.spd,dmg:bd.dmg,atkDmg:bd.atkDmg,col:bd.col,name:bd.name,icon:bd.icon,dead:false,_atkT:0,_pAtkT:0,_flash:0,_attackingBase:false,_target:null});
  setDefenseMsg(`⚠️⚠️ ${bd.icon} ${bd.name} 등장! (${dnDay}일차)`);
}

// ── 좀비 AI: 캠프파이어 반경 진입 불가, 바리케이드가 있으면 우선 공격, 경계에서 베이스 공격 ──
function tickDzombies(){
  dzoms=dzoms.filter(z=>{
    if(z.dead)return false;
    if(z._flash>0)z._flash--;
    // 가장 가까운 바리케이드가 캠프파이어보다 가까우면 그쪽을 우선 노림
    let nearestBar=null,nbd=Infinity;
    structures.forEach(s=>{if(s.kind!=='barricade'||s.hp<=0)return;const d=Math.hypot(s.x-z.x,s.y-z.y);if(d<nbd){nbd=d;nearestBar=s;}});
    const cfDist=Math.hypot(campfire.x-z.x,campfire.y-z.y);
    if(nearestBar&&nbd<cfDist&&nbd<500){
      const ddx=nearestBar.x-z.x,ddy=nearestBar.y-z.y,dist=Math.hypot(ddx,ddy)||1;
      if(dist>40){z.x+=ddx/dist*z.spd;z.y+=ddy/dist*z.spd;}
      else{z._atkT++;if(z._atkT>=90){z._atkT=0;nearestBar.hp-=z.atkDmg;if(nearestBar.hp<=0){const si=structures.indexOf(nearestBar);if(si>=0)structures.splice(si,1);}}}
      z._attackingBase=false;
      return true;
    }
    const ddx=campfire.x-z.x,ddy=campfire.y-z.y,dist=cfDist||1;
    if(dist>campfire.radius){
      z.x+=ddx/dist*z.spd;z.y+=ddy/dist*z.spd;z._attackingBase=false;
    } else {
      z.x=campfire.x-ddx/dist*campfire.radius;z.y=campfire.y-ddy/dist*campfire.radius;
      z._attackingBase=true;
      z._atkT++;
      if(z._atkT>=90){z._atkT=0;damageCampfire(z.atkDmg);}
    }
    // 덫 체크
    for(const s of structures){
      if(s.kind==='trap'&&s.armed&&Math.hypot(s.x-z.x,s.y-z.y)<24){
        z.hp-=25;s.armed=false;
        const si=structures.indexOf(s);if(si>=0)structures.splice(si,1);
        if(z.hp<=0){z.dead=true;return false;}
      }
    }
    const pd=Math.hypot(P.x-z.x,P.y-z.y);
    if(pd<z.r+P.r+4){
      z._pAtkT++;
      if(z._pAtkT>=60){z._pAtkT=0;takeDmg(z.dmg);}
    }
    return true;
  });
}

// ── 야생동물(토끼/늑대) ──
function tickWildlife(){
  resNodes.forEach(n=>{
    if(n.dead)return;
    if(n._flash>0)n._flash--;
    if(n.kind!=='rabbit'&&n.kind!=='wolf'&&n.kind!=='golden_rabbit')return;
    n.wanderT--;
    if(n.wanderT<=0){
      n.wanderT=60+Math.random()*120;
      const a=Math.random()*Math.PI*2;
      const spd=n.kind==='wolf'?0.6:0.4;
      n.vx=Math.cos(a)*spd;n.vy=Math.sin(a)*spd;
    }
    n.x=Math.max(0,Math.min(DMW,n.x+n.vx));
    n.y=Math.max(0,Math.min(DMH,n.y+n.vy));
    if(n.kind==='wolf'&&dnPhase==='day'){
      const pd=Math.hypot(P.x-n.x,P.y-n.y);
      if(pd<220){
        const dx=(P.x-n.x)/(pd||1),dy=(P.y-n.y)/(pd||1);
        n.x+=dx*1.0;n.y+=dy*1.0;
        if(pd<30){
          n._pAtkT++;
          if(n._pAtkT>=70){n._pAtkT=0;takeDmg(3);}
        }
      }
    }
  });
}

function tickNodeRespawn(){
  resNodes.forEach(n=>{
    if(!n.dead||n.kind==='chest'||n.kind==='rabbit'||n.kind==='wolf'||n.kind==='golden_rabbit')return;
    n.respawnT--;
    if(n.respawnT<=0){n.dead=false;n.hitsLeft=n.hits;}
  });
}

// ── 배고픔 / 손전등 배터리 틱 ──
function tickSurvivalStats(){
  if(!(window._hungerT>=0))window._hungerT=0;
  window._hungerT++;
  if(window._hungerT>=500){
    window._hungerT=0;
    hunger=Math.max(0,hunger-1);
  }
  if(hunger<=0){
    if(!(window._starveT>=0))window._starveT=0;
    window._starveT++;
    if(window._starveT>=60){window._starveT=0;takeDmg(1);}
  }
  // 손전등은 핫바에서 "장착" 중일 때만 자동으로 켜진다(별도 on/off 토글 없음)
  flashlightOn=hotbar[selectedSlot]&&hotbar[selectedSlot].type==='flashlight'&&flashlightBattery>0;
  const cfDist=Math.hypot(P.x-campfire.x,P.y-campfire.y);
  if(flashlightOn){
    flashlightBattery=Math.max(0,flashlightBattery-100/1800); // 약 30초에 100% 소모
    if(flashlightBattery<=0)setDefenseMsg('🔋 배터리가 방전되었습니다');
  } else if(cfDist<campfire.radius){
    flashlightBattery=Math.min(100,flashlightBattery+100/3600); // 캠프파이어 근처에서 서서히 재충전
  }
  if(cfDist<campfire.radius&&P.hp<P.maxHp){
    P.hp=Math.min(P.maxHp,P.hp+0.04); // 캠프파이어 안전지대에서 서서히 자연 회복
  }
}

// ── 승리 / 패배 ──
function loseDefenseGame(){
  if(!running)return;
  running=false;defenseOver=true;
  window._needLastDraw=true;
  requestAnimationFrame(loop);
}
function winDefenseGame(){
  if(!running)return;
  running=false;defenseWon=true;
  stopLoop();
  document.getElementById('clearTitle').textContent='🏕 위험한 캠핑 클리어!';
  document.getElementById('clearSub').textContent=`${dnDay}일차까지 생존에 성공했습니다!`;
  document.getElementById('clearReward').innerHTML=`<div style="background:#fef3c7;border:2px solid #f59e0b;color:#92400e;padding:8px 20px;border-radius:20px;font-weight:800;font-size:18px;">🏆 생존 성공</div>`;
  document.getElementById('clearScreen').style.display='flex';
}

// ── update ──
function updateDefenseMode(){
  if(!P||!running)return;
  let dx=0,dy=0;
  if(P._frozen>0){P._frozen--;}
  else{
    if(keys['w']||keys['arrowup'])dy--;if(keys['s']||keys['arrowdown'])dy++;
    if(keys['a']||keys['arrowleft'])dx--;if(keys['d']||keys['arrowright'])dx++;
    dx+=touchDX;dy+=touchDY;
    const mag=Math.hypot(dx,dy);if(mag>1){dx/=mag;dy/=mag;}
  }
  const moving=dx!==0||dy!==0;
  if(moving)pFaceAngle=Math.atan2(dy,dx);
  sprinting=!!keys['shift']&&moving&&stamina>0;
  let spd=P.spd*(sprinting?1.6:1);
  if(inSnowZone(P.x,P.y)&&!hasWarmCoat)spd*=0.7;
  if(inDesertZone(P.x,P.y)&&!hasDesertHood)spd*=0.7;
  P.x=Math.max(P.r,Math.min(DMW-P.r,P.x+dx*spd));
  P.y=Math.max(P.r,Math.min(DMH-P.r,P.y+dy*spd));
  dCamX+=(dClampX(P.x-VW()/2)-dCamX)*.1;
  dCamY+=(dClampY(P.y-VH()/2)-dCamY)*.1;
  if(sprinting){stamina=Math.max(0,stamina-100/240);} // 약 4초에 완전 소모
  else{stamina=Math.min(100,stamina+100/360);} // 가만히 있지 않아도 서서히 재생(약 6초)

  tickDayNight();
  tickNodeRespawn();
  tickWildlife();
  tickDzombies();
  tickSurvivalStats();
  tickAutoPickup();
  tickAmbientFx();
  updDefenseHUD();
}

// ── draw ──
function drawBiomeZones(){
  ctx.fillStyle='rgba(224,242,254,.12)';ctx.fillRect(0,0,DMW*0.4,DMH*0.4);
  ctx.fillStyle='rgba(217,119,6,.14)';ctx.fillRect(DMW*0.6,DMH*0.6,DMW*0.4,DMH*0.4);
}
function drawNode(n){
  if(n.kind==='chest'){
    const col=CHEST_TIER_COLOR[n.tier]||'#8b5a2b';
    ctx.fillStyle=col;ctx.fillRect(n.x-15,n.y-11,30,22);
    ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.strokeRect(n.x-15,n.y-11,30,22);
    ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(n.x-15,n.y-3,30,4);
    return;
  }
  const NODE_BASE_SIZE={tree:34,rock_stone:26,rock_iron:26,rock_gold:26,rock_diamond:26,rabbit:22,wolf:24,crystal:24,ice:24,golden_rabbit:30};
  const size=(NODE_BASE_SIZE[n.kind]||28)*(n.scale||1);
  if(n.kind==='golden_rabbit'){
    const glow=ctx.createRadialGradient(n.x,n.y,2,n.x,n.y,30);
    glow.addColorStop(0,'rgba(251,191,36,.6)');glow.addColorStop(1,'rgba(251,191,36,0)');
    ctx.fillStyle=glow;ctx.beginPath();ctx.arc(n.x,n.y,30,0,Math.PI*2);ctx.fill();
  }
  ctx.font=size+'px sans-serif';ctx.textAlign='center';
  ctx.globalAlpha=n._flash>0?0.5:1;
  ctx.fillText(NODE_ICON[n.kind]||'❓',n.x,n.y);
  ctx.globalAlpha=1;
  if(n.hits&&n.hitsLeft<n.hits){
    ctx.fillStyle='#000';ctx.fillRect(n.x-16,n.y-size*0.9,32,4);
    ctx.fillStyle='#4ade80';ctx.fillRect(n.x-16,n.y-size*0.9,32*Math.max(0,n.hitsLeft/n.hits),4);
  }
  if((n.kind==='rabbit'||n.kind==='wolf'||n.kind==='golden_rabbit')&&n.hp<n.maxHp){
    ctx.fillStyle='#000';ctx.fillRect(n.x-16,n.y-size*0.9,32,4);
    ctx.fillStyle='#ef4444';ctx.fillRect(n.x-16,n.y-size*0.9,32*Math.max(0,n.hp/n.maxHp),4);
  }
}
function drawBarricadeShape(x,y,hp,maxHp,alpha){
  alpha=alpha==null?1:alpha;
  ctx.globalAlpha=alpha;
  ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(x,y+16,27,7,0,0,Math.PI*2);ctx.fill();
  for(let i=0;i<5;i++){
    const sx=x-24+i*12;
    ctx.save();
    ctx.translate(sx,y);
    ctx.rotate((i%2===0?-1:1)*0.1);
    ctx.fillStyle='#6b4423';ctx.fillRect(-4,-16,8,30);
    ctx.fillStyle='#3f2712';ctx.beginPath();ctx.moveTo(-4,-16);ctx.lineTo(4,-16);ctx.lineTo(0,-25);ctx.closePath();ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle='#4a2f14';ctx.fillRect(x-27,y-1,54,7);
  ctx.strokeStyle='#2a1808';ctx.lineWidth=1;ctx.strokeRect(x-27,y-1,54,7);
  if(hp!=null){
    ctx.fillStyle='#000';ctx.fillRect(x-24,y-34,48,5);
    ctx.fillStyle=hp/maxHp>.4?'#4ade80':'#ef4444';
    ctx.fillRect(x-24,y-34,48*Math.max(0,hp/maxHp),5);
  }
  ctx.globalAlpha=1;
}
function drawTorchShape(x,y,alpha){
  ctx.globalAlpha=alpha==null?1:alpha;
  ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(x,y+13,7,3,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#5c3a1e';ctx.fillRect(x-3,y-6,6,26);
  ctx.strokeStyle='#2a1808';ctx.lineWidth=1;ctx.strokeRect(x-3,y-6,6,26);
  const flick=Math.sin(Date.now()/130+x)*2;
  ctx.fillStyle='#dc2626';ctx.beginPath();ctx.ellipse(x,y-14+flick,9,13,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#f97316';ctx.beginPath();ctx.ellipse(x,y-15+flick,6,10,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fde68a';ctx.beginPath();ctx.ellipse(x,y-16+flick,3,6,0,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=1;
}
function drawTrapShape(x,y,armed,alpha){
  ctx.globalAlpha=(alpha==null?1:alpha)*(armed?1:0.35);
  ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(x,y+2,17,6,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#57534e';ctx.beginPath();ctx.arc(x,y,9,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#9ca3af';ctx.lineWidth=3;
  ctx.beginPath();ctx.arc(x,y,15,Math.PI*0.15,Math.PI*0.85);ctx.stroke();
  ctx.beginPath();ctx.arc(x,y,15,Math.PI*1.15,Math.PI*1.85);ctx.stroke();
  ctx.fillStyle='#e5e7eb';
  for(let i=0;i<4;i++){
    const a1=Math.PI*0.18+i*(Math.PI*0.64/3);
    ctx.beginPath();
    ctx.moveTo(x+Math.cos(a1)*15,y+Math.sin(a1)*15);
    ctx.lineTo(x+Math.cos(a1)*20,y+Math.sin(a1)*20);
    ctx.lineTo(x+Math.cos(a1+0.09)*15,y+Math.sin(a1+0.09)*15);
    ctx.closePath();ctx.fill();
    const a2=Math.PI*1.18+i*(Math.PI*0.64/3);
    ctx.beginPath();
    ctx.moveTo(x+Math.cos(a2)*15,y+Math.sin(a2)*15);
    ctx.lineTo(x+Math.cos(a2)*20,y+Math.sin(a2)*20);
    ctx.lineTo(x+Math.cos(a2+0.09)*15,y+Math.sin(a2+0.09)*15);
    ctx.closePath();ctx.fill();
  }
  ctx.globalAlpha=1;
}
function drawCraftTableShape(x,y){
  ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(x,y+13,22,5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#4a2f14';ctx.fillRect(x-16,y+2,4,14);ctx.fillRect(x+12,y+2,4,14);
  ctx.fillStyle='#8b5a2b';ctx.fillRect(x-20,y-8,40,12);
  ctx.strokeStyle='#4a2f14';ctx.lineWidth=1.5;ctx.strokeRect(x-20,y-8,40,12);
  ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=1;
  for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x-18,y-6+i*3);ctx.lineTo(x+18,y-6+i*3);ctx.stroke();}
  ctx.font='13px sans-serif';ctx.textAlign='center';
  ctx.fillText('🪓',x-8,y-11);ctx.fillText('⛏',x+8,y-11);
}
function drawWeaponTableShape(x,y){
  ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(x,y+13,20,5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#374151';
  ctx.beginPath();ctx.moveTo(x-16,y+9);ctx.lineTo(x+16,y+9);ctx.lineTo(x+9,y-1);ctx.lineTo(x-9,y-1);ctx.closePath();ctx.fill();
  ctx.fillRect(x-6,y-11,12,10);
  ctx.strokeStyle='#111827';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(x-16,y+9);ctx.lineTo(x+16,y+9);ctx.lineTo(x+9,y-1);ctx.lineTo(x-9,y-1);ctx.closePath();ctx.stroke();
  ctx.strokeRect(x-6,y-11,12,10);
  ctx.fillStyle='#fbbf24';
  for(let i=0;i<3;i++){const a=Math.random()*Math.PI*2;ctx.beginPath();ctx.arc(x+Math.cos(a)*13,y-11+Math.sin(a)*7,1.4,0,Math.PI*2);ctx.fill();}
  ctx.font='13px sans-serif';ctx.textAlign='center';ctx.fillText('🗡',x,y-18);
}
function drawStructures(){
  structures.forEach(s=>{
    if(s.kind==='barricade')drawBarricadeShape(s.x,s.y,s.hp,s.maxHp);
    else if(s.kind==='torch')drawTorchShape(s.x,s.y);
    else if(s.kind==='trap')drawTrapShape(s.x,s.y,s.armed);
  });
  decor.forEach(d=>{
    ctx.font=(24*d.scale)+'px sans-serif';ctx.textAlign='center';ctx.globalAlpha=0.85;
    ctx.fillText(d.icon,d.x,d.y);ctx.globalAlpha=1;
  });
}
function drawDefenseMode(){
  if(!P)return;
  const ox=VW()>=DMW?(VW()-DMW)/2:-dCamX;
  const oy=VH()>=DMH?(VH()-DMH)/2:-dCamY;
  const shakeOX=shakeT>0?(Math.random()-0.5)*shakeMag:0;
  const shakeOY=shakeT>0?(Math.random()-0.5)*shakeMag:0;
  ctx.save();ctx.translate(ox+shakeOX,oy+shakeOY);
  ctx.fillStyle='#1a2e0a';ctx.fillRect(0,0,DMW,DMH);
  drawBiomeZones();
  drawStructures();

  ctx.strokeStyle='rgba(251,191,36,.5)';ctx.lineWidth=3;
  ctx.beginPath();ctx.arc(campfire.x,campfire.y,campfire.radius,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='rgba(251,191,36,.05)';
  ctx.beginPath();ctx.arc(campfire.x,campfire.y,campfire.radius,0,Math.PI*2);ctx.fill();

  ctx.fillStyle='#78350f';ctx.fillRect(campfire.x-14,campfire.y-6,28,14);
  ctx.fillStyle='#f97316';ctx.beginPath();ctx.arc(campfire.x,campfire.y-10,12,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fde68a';ctx.beginPath();ctx.arc(campfire.x,campfire.y-12,6,0,Math.PI*2);ctx.fill();
  if(craftTableBuilt){const p=craftTablePos();drawCraftTableShape(p.x,p.y);}
  if(weaponTableBuilt){const p=weaponTablePos();drawWeaponTableShape(p.x,p.y);}
  // 캠프파이어 레벨 UI (아래쪽, 나무=XP)
  {
    const prog=campfireLevelProgress();
    const barW=90,barH=10,barY=campfire.y+20;
    ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(campfire.x-barW/2-3,barY-3,barW+6,barH+20);
    ctx.fillStyle='#000';ctx.fillRect(campfire.x-barW/2,barY,barW,barH);
    ctx.fillStyle=prog.maxed?'#fbbf24':'#4ade80';
    ctx.fillRect(campfire.x-barW/2,barY,barW*prog.pct,barH);
    ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.strokeRect(campfire.x-barW/2,barY,barW,barH);
    ctx.fillStyle='#fde68a';ctx.font='bold 12px sans-serif';ctx.textAlign='center';
    ctx.fillText('Lv.'+campfire.level,campfire.x,barY+9-2+10);
    ctx.fillStyle='#e5e7eb';ctx.font='10px sans-serif';
    ctx.fillText(prog.maxed?'MAX':`🪵 ${Math.floor(prog.cur)}/${prog.max}`,campfire.x,barY+9+14);
    if(campfireLevelUpFx>0){
      campfireLevelUpFx--;
      const t=1-campfireLevelUpFx/45;
      ctx.strokeStyle=`rgba(251,191,36,${1-t})`;ctx.lineWidth=4;
      ctx.beginPath();ctx.arc(campfire.x,campfire.y,20+t*60,0,Math.PI*2);ctx.stroke();
    }
  }

  const viewL=dCamX-100,viewR=dCamX+VW()+100,viewT=dCamY-100,viewB=dCamY+VH()+100;
  resNodes.forEach(n=>{
    if(n.dead)return;
    if(n.x<viewL||n.x>viewR||n.y<viewT||n.y>viewB)return;
    drawNode(n);
  });
  drops.forEach(d=>{
    if(d.x<viewL||d.x>viewR||d.y<viewT||d.y>viewB)return;
    ctx.font='18px sans-serif';ctx.textAlign='center';ctx.fillText(DROP_ICON[d.kind]||'📦',d.x,d.y);
  });
  dzoms.forEach(z=>{
    ctx.fillStyle=z._flash>0?'#fff':z.col;
    ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,Math.PI*2);ctx.fill();
    if(z.isBoss){ctx.font='22px sans-serif';ctx.textAlign='center';ctx.fillText(z.icon,z.x,z.y-z.r-10);}
    ctx.fillStyle='#000';ctx.fillRect(z.x-18,z.y-z.r-10,36,5);
    ctx.fillStyle='#ef4444';ctx.fillRect(z.x-18,z.y-z.r-10,36*Math.max(0,z.hp/z.maxHp),5);
  });
  ctx.fillStyle='#22c55e';ctx.beginPath();ctx.arc(P.x,P.y,P.r,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#15803d';ctx.lineWidth=2;ctx.stroke();
  drawFx();

  ctx.restore();

  if(placingStructure)drawPlacementGhost(ox,oy);

  if(dnPhase==='night'){
    const darkness=flashlightOn?0.72:0.85;
    ctx.fillStyle=`rgba(3,3,15,${darkness})`;ctx.fillRect(0,0,VW(),VH());
    const cfSx=campfire.x+ox, cfSy=campfire.y+oy;
    const cfGrad=ctx.createRadialGradient(cfSx,cfSy,10,cfSx,cfSy,campfire.radius*0.7);
    cfGrad.addColorStop(0,'rgba(251,191,36,.35)');cfGrad.addColorStop(1,'rgba(251,191,36,0)');
    ctx.fillStyle=cfGrad;ctx.fillRect(0,0,VW(),VH());
    structures.forEach(s=>{
      if(s.kind!=='torch')return;
      const sx=s.x+ox, sy=s.y+oy;
      const tg=ctx.createRadialGradient(sx,sy,5,sx,sy,140);
      tg.addColorStop(0,'rgba(251,146,60,.4)');tg.addColorStop(1,'rgba(251,146,60,0)');
      ctx.fillStyle=tg;ctx.fillRect(0,0,VW(),VH());
    });
    if(flashlightOn&&flashlightBattery>0){
      const psx=P.x+ox, psy=P.y+oy;
      const coneR=300, coneHalf=Math.PI/4.2;
      ctx.save();
      ctx.globalCompositeOperation='destination-out';
      // 발밑 약한 원형 시야
      const nearFg=ctx.createRadialGradient(psx,psy,4,psx,psy,55);
      nearFg.addColorStop(0,'rgba(0,0,0,.75)');nearFg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=nearFg;ctx.beginPath();ctx.arc(psx,psy,55,0,Math.PI*2);ctx.fill();
      // 바라보는 방향 부채꼴 조명
      const fg=ctx.createRadialGradient(psx,psy,10,psx,psy,coneR);
      fg.addColorStop(0,'rgba(0,0,0,.9)');fg.addColorStop(0.75,'rgba(0,0,0,.6)');fg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=fg;
      ctx.beginPath();
      ctx.moveTo(psx,psy);
      ctx.arc(psx,psy,coneR,pFaceAngle-coneHalf,pFaceAngle+coneHalf);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    // 위험 비네트: 가장 가까운 좀비가 가까울수록 화면 가장자리가 붉게
    let nearestZ=Infinity;
    dzoms.forEach(z=>{const d=Math.hypot(z.x-P.x,z.y-P.y);if(d<nearestZ)nearestZ=d;});
    if(nearestZ<260){
      const t=1-nearestZ/260;
      const vg=ctx.createRadialGradient(VW()/2,VH()/2,Math.min(VW(),VH())*0.3,VW()/2,VH()/2,Math.max(VW(),VH())*0.7);
      vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,`rgba(220,38,38,${0.35*t})`);
      ctx.fillStyle=vg;ctx.fillRect(0,0,VW(),VH());
    }
  }

  if(transitionT>0){
    const a=transitionMaxA*(transitionT/40);
    ctx.fillStyle=`rgba(${transitionRGB[0]},${transitionRGB[1]},${transitionRGB[2]},${a})`;
    ctx.fillRect(0,0,VW(),VH());
  }

  if(!running){
    ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(0,0,VW(),VH());
    ctx.fillStyle='#fbbf24';ctx.font='bold 36px sans-serif';ctx.textAlign='center';
    ctx.fillText(defenseWon?'🏕 클리어!':'☠ GAME OVER ☠',VW()/2,VH()/2-20);
    ctx.fillStyle='#fff';ctx.font='18px sans-serif';
    ctx.fillText(`생존 ${dnDay}일차`,VW()/2,VH()/2+16);
    ctx.fillStyle='rgba(255,255,255,.6)';ctx.font='14px sans-serif';
    ctx.fillText('클릭하면 로비로',VW()/2,VH()/2+44);
  }
}

// ── HUD ──
function updDefenseHUD(){
  if(!P)return;
  const hpFill=document.getElementById('defenseHpFill');
  if(hpFill){const pct=Math.max(0,P.hp/P.maxHp*100);hpFill.style.width=pct+'%';hpFill.style.background=pct>50?'linear-gradient(90deg,#ef4444,#f87171)':pct>25?'linear-gradient(90deg,#b91c1c,#f97316)':'linear-gradient(90deg,#7f1d1d,#ef4444)';}
  const hungerFill=document.getElementById('defenseHungerFill');
  if(hungerFill){hungerFill.style.width=Math.max(0,hunger)+'%';hungerFill.style.background=hunger>40?'linear-gradient(90deg,#b45309,#f59e0b)':'linear-gradient(90deg,#7f1d1d,#dc2626)';}
  const staminaFill=document.getElementById('defenseStaminaFill');
  if(staminaFill){staminaFill.style.width=Math.max(0,stamina)+'%';staminaFill.style.background=stamina>25?'linear-gradient(90deg,#16a34a,#4ade80)':'linear-gradient(90deg,#7f1d1d,#dc2626)';}
  const dayEl=document.getElementById('hDay');
  if(dayEl)dayEl.textContent=(dnPhase==='day'?'☀️ ':'🌙 ')+dnDay+'일차';
  const baseEl=document.getElementById('hBaseHp');
  if(baseEl){baseEl.textContent=`🏕 ${Math.ceil(campfire.hp)}/${campfire.maxHp}`;baseEl.style.color=campfire.hp/campfire.maxHp>.5?'#fb923c':'#ef4444';}
  const phaseInd=document.getElementById('defensePhaseIndicator');
  if(phaseInd){
    if(dnPhase==='day'){phaseInd.textContent='☀️ 낮 - 채집 시간';phaseInd.style.background='rgba(250,204,21,.25)';phaseInd.style.color='#fde68a';}
    else{phaseInd.textContent='🌙 밤 - 캠프파이어를 지키세요!';phaseInd.style.background='rgba(30,10,60,.5)';phaseInd.style.color='#fca5a5';}
  }
  const hintEl=document.getElementById('defenseInteractHint');
  if(hintEl){
    let hint='';
    if(craftTableBuilt){const p=craftTablePos();if(Math.hypot(P.x-p.x,P.y-p.y)<STRUCT_INTERACT_RANGE)hint='E : 🔨 제작대 열기';}
    if(!hint&&weaponTableBuilt){const p=weaponTablePos();if(Math.hypot(P.x-p.x,P.y-p.y)<STRUCT_INTERACT_RANGE)hint='E : ⚔️ 무기제작대 열기';}
    if(!hint){
      const cfDist=Math.hypot(P.x-campfire.x,P.y-campfire.y);
      if(cfDist<CF_INTERACT_RANGE){
        if((sack.stacks.wood||0)>0)hint='E : 🔥 캠프파이어에 나무 넣기';
        else if((sack.stacks.meat||0)>0)hint='E : 🍗 고기 굽기';
        else if(craftTableUnlocked&&!craftTableBuilt)hint='🔨 건설 버튼으로 제작대를 지어보세요';
      }
    }
    if(!hint){
      const chest=resNodes.find(n=>!n.dead&&n.kind==='chest'&&Math.hypot(n.x-P.x,n.y-P.y)<60);
      if(chest)hint='E : 📦 상자 열기';
    }
    if(!hint){
      const drop=drops.find(d=>Math.hypot(d.x-P.x,d.y-P.y)<60);
      if(drop)hint='E : 🎒 줍기';
    }
    hintEl.textContent=hint;
    hintEl.style.display=hint?'block':'none';
  }
  const sackBar=document.getElementById('defenseSackBar');
  if(sackBar){
    const full=Object.keys(sack.stacks).length>=sack.slots;
    let html='';
    Object.entries(sack.stacks).forEach(([k,v])=>{
      html+=`<div style="background:rgba(0,0,0,.55);color:#fff;padding:4px 8px;border-radius:8px;font-size:11px;">${RESOURCE_ICON[k]||k} ${v}</div>`;
    });
    html+=`<div style="background:rgba(0,0,0,.55);color:${full?'#ef4444':'#9ca3af'};padding:4px 8px;border-radius:8px;font-size:11px;font-weight:${full?'900':'400'};">🎒 ${Object.keys(sack.stacks).length}/${sack.slots}${full?' 가득!':''}</div>`;
    sackBar.innerHTML=html;
    sackBar.style.border=full?'2px solid #ef4444':'none';
    sackBar.style.borderRadius=full?'10px':'0';
    sackBar.style.padding=full?'4px':'0';
  }
  const hotbarEl=document.getElementById('defenseHotbar');
  if(hotbarEl){
    hotbarEl.innerHTML=hotbar.map((h,i)=>{
      const sel=i===selectedSlot;
      let extra='';
      if(h.type==='flashlight')extra=`<div style="position:absolute;bottom:2px;left:2px;right:2px;height:3px;background:#000;border-radius:2px;overflow:hidden;"><div style="height:100%;width:${flashlightBattery}%;background:${flashlightBattery>30?'#4ade80':'#ef4444'};"></div></div><div style="position:absolute;top:1px;right:2px;font-size:8px;">${flashlightOn?'🟢':'⚪'}</div>`;
      if(h.type==='food'||h.type==='bandage'||h.type==='battery'){
        const qty=h.type==='food'?(sack.stacks[h.food]||0):(sack.stacks[h.type]||0);
        extra=`<div style="position:absolute;bottom:1px;right:2px;font-size:9px;color:#fde68a;font-weight:900;">${qty}</div>`;
      }
      return `<div onclick="selectDefenseSlot(${i})" style="position:relative;width:46px;height:46px;border-radius:8px;background:${sel?'rgba(251,191,36,.35)':'rgba(0,0,0,.55)'};border:2px solid ${sel?'#fbbf24':'rgba(255,255,255,.3)'};display:flex;align-items:center;justify-content:center;font-size:22px;cursor:pointer;">
        ${h.icon}
        <div style="position:absolute;top:-6px;left:-6px;background:#000;color:#fff;font-size:9px;padding:0px 3px;border-radius:6px;">${i+1}</div>
        ${extra}
      </div>`;
    }).join('');
  }
}

// ── 핫바 번호키 (1~9) — 이 맵에서만 동작 ──
document.addEventListener('keydown',e=>{
  if(!running||!selMap||selMap.id!=='danger_camp')return;
  const k=e.key;
  if(/^[1-9]$/.test(k)){
    const idx=parseInt(k,10)-1;
    if(idx<hotbar.length)selectDefenseSlot(idx);
  }
});
// ── 우클릭: 설치 모드 취소 ──
gC.addEventListener('contextmenu',e=>{
  if(selMap&&selMap.id==='danger_camp'&&placingStructure){e.preventDefault();cancelPlacing();}
});
