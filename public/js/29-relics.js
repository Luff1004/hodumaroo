// ══════════════ 유물(Relics) — 수집 + 실전 발동 효과 ══════════════
const RELICS=[
  {id:'relic_greed',    name:'탐욕의 인장',       icon:'💰', rarity:'common',
   desc:'처치 시 일정 확률로 소량의 코인을 추가로 획득합니다.', type:'greed', base:5, inc:1, price:40000},
  {id:'relic_claw',     name:'사냥꾼의 발톱',     icon:'🐾', rarity:'common',
   desc:'공격력이 영구적으로 증가합니다.', type:'dmgBoost', base:3, inc:0.6, price:40000},
  {id:'relic_wind',     name:'바람의 날개',       icon:'🪽', rarity:'common',
   desc:'이동속도가 영구적으로 증가합니다.', type:'spdBoost', base:0.3, inc:0.05, price:40000},
  {id:'relic_phoenix',  name:'불사조의 깃털',     icon:'🪶', rarity:'rare',
   desc:'8초마다 최대체력의 일정 %를 자동 회복합니다.', type:'regen', base:4, inc:0.4, price:250000},
  {id:'relic_turtle',   name:'거북의 등껍질',     icon:'🐢', rarity:'rare',
   desc:'최대체력이 영구적으로 증가합니다.', type:'hpBoost', base:6, inc:1, price:250000},
  {id:'relic_hawk',     name:'매의 눈',           icon:'🦅', rarity:'rare',
   desc:'치명타 확률이 영구적으로 증가합니다.', type:'critBoost', base:3, inc:0.6, price:250000},
  {id:'relic_guard',    name:'수호의 방패',       icon:'🛡️', rarity:'epic',
   desc:'체력이 25% 이하로 떨어지면(쿨타임 20초) 잠시 무적이 됩니다.', type:'guard', base:2, inc:0.1, price:1200000},
  {id:'relic_thunder',  name:'번개의 파편',       icon:'⚡', rarity:'epic',
   desc:'피격 시 일정 확률로 가장 가까운 적에게 번개 반격을 가합니다.', type:'thunder', base:4, inc:0.8, price:1200000},
  {id:'relic_sage',     name:'현자의 돌',         icon:'📘', rarity:'epic',
   desc:'시즌 경험치 획득량이 영구적으로 증가합니다.', type:'xpBoost', base:8, inc:1.5, price:1200000},
  {id:'relic_fortune',  name:'재화의 축복',       icon:'🧿', rarity:'epic',
   desc:'웨이브 클리어 및 보스 처치 코인 보상이 영구적으로 증가합니다.', type:'coinBoost', base:8, inc:1.5, price:1200000},
  {id:'relic_chain',    name:'연쇄 폭발의 유물',  icon:'💥', rarity:'legendary',
   desc:'처치 시 일정 확률로 주변 적들에게 연쇄 피해를 입힙니다.', type:'chain', base:2, inc:0.3, price:5000000},
  {id:'relic_frost',    name:'서리의 파편',       icon:'❄️', rarity:'legendary',
   desc:'처치 시 일정 확률로 주변 적들을 잠시 얼립니다.', type:'frost', base:6, inc:0.6, price:5000000},
  {id:'relic_immortal', name:'불멸의 심장',       icon:'❤️‍🔥', rarity:'mythic',
   desc:'치명적인 피해를 판당 1회 막고 체력 일부로 되살아납니다.', type:'immortal', base:10, inc:1, price:25000000},
  {id:'relic_storm',    name:'폭풍의 심장',       icon:'🌪️', rarity:'mythic',
   desc:'공격력·최대체력·이동속도가 모두 영구적으로 증가합니다.', type:'allBoost', base:5, inc:0.8, price:25000000},
  // ── 유물함 전용 (직접 구매 불가, 뽑기로만 획득) ──
  {id:'relic_root',     name:'재생의 뿌리',       icon:'🌱', rarity:'rare',
   desc:'처치 시 일정 확률로 최대체력의 일부를 즉시 회복합니다.', type:'lifeburst', base:5, inc:1, boxOnly:true},
  {id:'relic_stormeye',   name:'폭풍의 눈',         icon:'🌀', rarity:'epic',
   desc:'처치 시 일정 확률로 화면의 모든 적을 짧게 얼립니다.', type:'novafreeze', base:3, inc:0.5, boxOnly:true},
  {id:'relic_judgment', name:'최후의 심판',       icon:'⚖️', rarity:'mythic',
   desc:'처치 시 일정 확률로 체력이 낮은 적을 즉시 처형합니다.', type:'execute', base:2, inc:0.3, boxOnly:true},
];
const RELIC_RARITY_LABEL={common:'커먼',rare:'레어',epic:'에픽',legendary:'레전더리',mythic:'신화'};
const RELIC_RARITY_COLOR={common:'#9ca3af',rare:'#3b82f6',epic:'#a855f7',legendary:'#f59e0b',mythic:'#ec4899'};
const RELIC_BOXES=[
  {id:'relic_box_common',name:'낡은 유물함',   icon:'📦',price:20000,  weights:{common:60,rare:25,epic:12,legendary:2.5,mythic:0.5}},
  {id:'relic_box_rare',  name:'빛나는 유물함', icon:'🎁',price:150000, weights:{common:20,rare:40,epic:28,legendary:10,mythic:2}},
  {id:'relic_box_epic',  name:'신비한 유물함', icon:'✨',price:800000, weights:{common:5, rare:20,epic:40,legendary:28,mythic:7}},
];
const RELIC_MAX_SLOTS=3;

function isRelicUnlocked(){
  if(typeof devModeUnlocked!=='undefined'&&devModeUnlocked)return true;
  return !!achData['enchant_1000'];
}
function updateRelicButton(){
  const btn=document.getElementById('btn-relics');if(!btn)return;
  if(isRelicUnlocked()){
    btn.textContent='🏺 유물';
    btn.style.background='linear-gradient(135deg,#581c87,#1e1b4b)';
    btn.style.color='#f3e8ff';
    btn.style.border='1.5px solid #a855f7';
  } else {
    btn.textContent='🔒 ???';
    btn.style.background='linear-gradient(135deg,#334155,#1e293b)';
    btn.style.color='#94a3b8';
    btn.style.border='1.5px solid #475569';
  }
}
function openRelicScreen(){
  if(!isRelicUnlocked()){
    const btn=document.getElementById('btn-relics');
    if(btn&&!btn._relicMsgT){
      const prev=btn.textContent;
      btn.textContent='업적 "운명의 도박사" 달성 시 해금!';
      btn._relicMsgT=setTimeout(()=>{btn.textContent=prev;btn._relicMsgT=null;},1800);
    }
    return;
  }
  go('sRelics');
}

let ownedRelics=lJ('hd_relics',{});          // {relicId:{count,level}}
let equippedRelicIds=lJ('hd_eq_relics',[]);  // up to RELIC_MAX_SLOTS ids
function saveRelicData(){ sv('hd_relics',ownedRelics); sv('hd_eq_relics',equippedRelicIds); }

function relicLevel(id){ return (ownedRelics[id]&&ownedRelics[id].level)||0; }
function relicLevelCost(id){ const lv=relicLevel(id); return Math.floor(8000*(lv+1)*(lv+1)); }
function relicVal(relic){ return relic.base+relic.inc*relicLevel(relic.id); }

function rollRelicRarity(weights){
  const entries=Object.entries(weights).filter(([,w])=>w>0);
  const total=entries.reduce((a,[,w])=>a+w,0);
  let r=Math.random()*total;
  for(const [rarity,w] of entries){ r-=w; if(r<=0) return rarity; }
  return entries[entries.length-1][0];
}

function openRelicBox(boxId){
  const box=RELIC_BOXES.find(b=>b.id===boxId);
  if(!box||coins<box.price) return;
  coins-=box.price; sv('hd_c',coins); updRes();
  const rarity=rollRelicRarity(box.weights);
  const pool=RELICS.filter(r=>r.rarity===rarity);
  const relic=pool.length?pool[Math.floor(Math.random()*pool.length)]:RELICS[0];
  if(!ownedRelics[relic.id]) ownedRelics[relic.id]={count:0,level:0};
  ownedRelics[relic.id].count++;
  saveRelicData();
  showRelicResult(relic);
  renderRelicScreen();
}

function showRelicResult(relic){
  const el=document.getElementById('relicResult');
  if(!el) return;
  el.style.color=RELIC_RARITY_COLOR[relic.rarity];
  el.textContent=relic.icon+' '+RELIC_RARITY_LABEL[relic.rarity]+' - '+relic.name+' 획득!';
  el.style.opacity='1';
  clearTimeout(el._hideT);
  el._hideT=setTimeout(()=>{el.style.opacity='0';},2500);
}

function buyRelic(id){
  const relic=RELICS.find(r=>r.id===id);
  if(!relic||relic.boxOnly||coins<relic.price) return;
  coins-=relic.price; sv('hd_c',coins); updRes();
  if(!ownedRelics[id]) ownedRelics[id]={count:0,level:0};
  ownedRelics[id].count++;
  saveRelicData();
  showRelicResult(relic);
  renderRelicScreen();
}

function levelUpRelic(id){
  const d=ownedRelics[id]; if(!d) return;
  const cost=relicLevelCost(id);
  if(d.level>=10||coins<cost) return;
  coins-=cost; sv('hd_c',coins); updRes();
  d.level++;
  saveRelicData();
  renderRelicScreen();
}

function toggleRelicEquip(id){
  if(!ownedRelics[id]) return;
  const idx=equippedRelicIds.indexOf(id);
  if(idx>=0){ equippedRelicIds.splice(idx,1); }
  else{
    if(equippedRelicIds.length>=RELIC_MAX_SLOTS) return;
    equippedRelicIds.push(id);
  }
  saveRelicData();
  renderRelicScreen();
}

function renderRelicScreen(){
  const coinEl=document.getElementById('relicCoinDisp');
  if(coinEl) coinEl.textContent=coins.toLocaleString();

  const slotsEl=document.getElementById('relicSlots');
  if(slotsEl){
    slotsEl.innerHTML='';
    for(let i=0;i<RELIC_MAX_SLOTS;i++){
      const id=equippedRelicIds[i];
      const relic=id?RELICS.find(r=>r.id===id):null;
      const box=document.createElement('div');
      box.style.cssText='width:56px;height:56px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:26px;border:2px solid '+(relic?RELIC_RARITY_COLOR[relic.rarity]:'#374151')+';background:'+(relic?'#1a1030':'#0f0f1a')+';cursor:'+(relic?'pointer':'default')+';';
      box.textContent=relic?relic.icon:'➕';
      if(relic) box.onclick=()=>toggleRelicEquip(id);
      slotsEl.appendChild(box);
    }
  }

  const boxesEl=document.getElementById('relicBoxList');
  if(boxesEl){
    boxesEl.innerHTML='';
    RELIC_BOXES.forEach(box=>{
      const cb=coins>=box.price;
      const d=document.createElement('div');
      d.className='si'+(cb?' cb2':'');
      d.innerHTML='<div class="sico">'+box.icon+'</div><div class="snm">'+box.name+'</div>'+
        '<div style="font-size:10px;font-weight:700;color:'+(cb?'#d97706':'#9ca3af')+';margin-top:4px;">🪙'+box.price.toLocaleString()+'</div>';
      const btn=document.createElement('button'); btn.className='bybtn'; btn.textContent='개봉'; btn.disabled=!cb;
      btn.style.marginTop='6px';
      btn.onclick=()=>openRelicBox(box.id);
      d.appendChild(btn);
      boxesEl.appendChild(d);
    });
  }

  const listEl=document.getElementById('relicList');
  if(listEl){
    listEl.innerHTML='';
    RELICS.forEach(relic=>{
      const owned=ownedRelics[relic.id];
      const isEq=equippedRelicIds.includes(relic.id);
      const card=document.createElement('div');
      card.className='ach-card'+(isEq?' done':'');
      const lv=relicLevel(relic.id);
      const cost=relicLevelCost(relic.id);
      let valTxt='';
      const vv=relicVal(relic).toFixed(1);
      if(relic.type==='greed') valTxt='확률 '+vv+'%';
      else if(relic.type==='regen') valTxt='8초마다 '+vv+'% 회복';
      else if(relic.type==='guard') valTxt='무적 '+vv+'초 (쿨타임 20초)';
      else if(relic.type==='thunder') valTxt='확률 '+vv+'%';
      else if(relic.type==='chain') valTxt='확률 '+vv+'%';
      else if(relic.type==='immortal') valTxt='체력 '+vv+'%로 부활';
      else if(relic.type==='dmgBoost') valTxt='공격력 +'+vv+'%';
      else if(relic.type==='spdBoost') valTxt='이동속도 +'+vv;
      else if(relic.type==='hpBoost') valTxt='최대체력 +'+vv+'%';
      else if(relic.type==='critBoost') valTxt='치명타 확률 +'+vv+'%';
      else if(relic.type==='xpBoost') valTxt='시즌 경험치 +'+vv+'%';
      else if(relic.type==='coinBoost') valTxt='코인 보상 +'+vv+'%';
      else if(relic.type==='frost') valTxt='확률 '+vv+'%';
      else if(relic.type==='allBoost') valTxt='공격력/체력 +'+vv+'% · 이동속도 +'+(vv*0.06).toFixed(2);
      else if(relic.type==='lifeburst') valTxt='확률 '+vv+'%';
      else if(relic.type==='novafreeze') valTxt='확률 '+vv+'%';
      else if(relic.type==='execute') valTxt='확률 '+vv+'%';
      card.innerHTML='<div class="ach-ico">'+relic.icon+'</div>'+
        '<div class="ach-info">'+
          '<div class="ach-name" style="color:'+RELIC_RARITY_COLOR[relic.rarity]+';">'+relic.name+' <span style="font-size:9px;color:#6b7280;">['+RELIC_RARITY_LABEL[relic.rarity]+']</span></div>'+
          '<div class="ach-desc">'+relic.desc+'</div>'+
          (owned?'<div class="ach-reward">Lv.'+lv+' · '+valTxt+' (보유 '+owned.count+'개)</div>':'')+
        '</div>';
      const btnCol=document.createElement('div'); btnCol.style.cssText='display:flex;flex-direction:column;gap:4px;';
      if(owned){
        const eqBtn=document.createElement('button'); eqBtn.className='bybtn'; eqBtn.textContent=isEq?'해제':'장착';
        eqBtn.onclick=()=>toggleRelicEquip(relic.id);
        btnCol.appendChild(eqBtn);
        const lvBtn=document.createElement('button'); lvBtn.className='bybtn';
        lvBtn.textContent=lv>=10?'MAX':'강화(🪙'+cost.toLocaleString()+')';
        lvBtn.disabled=lv>=10||coins<cost;
        lvBtn.onclick=()=>levelUpRelic(relic.id);
        btnCol.appendChild(lvBtn);
      } else if(relic.boxOnly){
        const tag=document.createElement('div');
        tag.style.cssText='font-size:10px;font-weight:700;color:#c4b5fd;padding:6px 8px;border:1px dashed #7c3aed;border-radius:8px;text-align:center;';
        tag.textContent='🎁 유물함 전용';
        btnCol.appendChild(tag);
      } else {
        const buyBtn=document.createElement('button'); buyBtn.className='bybtn';
        buyBtn.textContent='구매(🪙'+relic.price.toLocaleString()+')';
        buyBtn.disabled=coins<relic.price;
        buyBtn.onclick=()=>buyRelic(relic.id);
        btnCol.appendChild(buyBtn);
      }
      card.appendChild(btnCol);
      listEl.appendChild(card);
    });
  }
}

// ── 전투 훅 (13-engine.js에서 호출) ──
let _relicState={ guardCd:0, immortalReady:false, regenT:0, chaining:false };

function initRelics(){
  _relicState={ guardCd:0, immortalReady:equippedRelicIds.includes('relic_immortal'), regenT:0, chaining:false };
  applyRelicPassives();
}

function tickRelics(){
  if(!running) return;
  if(_relicState.guardCd>0) _relicState.guardCd--;
  if(equippedRelicIds.includes('relic_phoenix')){
    _relicState.regenT++;
    if(_relicState.regenT>=480){ // 8초(60fps 기준)
      _relicState.regenT=0;
      const relic=RELICS.find(r=>r.id==='relic_phoenix');
      const heal=Math.ceil(P.maxHp*relicVal(relic)/100);
      P.hp=Math.min(P.maxHp,P.hp+heal);
      for(let i=0;i<8;i++)parts.push({x:P.x,y:P.y,vx:(Math.random()-.5)*3,vy:-1-Math.random()*2,l:20,ml:20,r:3,col:'#f472b6'});
    }
  } else {
    _relicState.regenT=0;
  }
}

function procRelicOnKill(z){
  if(_relicState.chaining) return;
  if(equippedRelicIds.includes('relic_greed')){
    const relic=RELICS.find(r=>r.id==='relic_greed');
    if(Math.random()*100<relicVal(relic)){
      const bonus=Math.floor((z.isBoss?z.bd.reward.c:(ZT[z.type]?.sc||10)));
      coins+=bonus;
      setMsg('💰 탐욕의 인장 발동! +'+bonus.toLocaleString()+' 코인');
      setTimeout(()=>{if(running)setMsg('');},900);
    }
  }
  if(equippedRelicIds.includes('relic_chain')&&!z.isBoss){
    const relic=RELICS.find(r=>r.id==='relic_chain');
    if(Math.random()*100<relicVal(relic)){
      _relicState.chaining=true;
      addExp(z.x,z.y,60,'#a855f7');
      zoms.forEach(zz=>{ if(!zz.dead&&zz!==z&&!zz.isBoss&&d2(zz.x,zz.y,z.x,z.y)<60**2) hitZ(zz,8+Math.floor(relicLevel('relic_chain')*0.5)); });
      _relicState.chaining=false;
    }
  }
  if(equippedRelicIds.includes('relic_frost')){
    const relic=RELICS.find(r=>r.id==='relic_frost');
    if(Math.random()*100<relicVal(relic)){
      zoms.forEach(zz=>{ if(!zz.dead&&!zz.isBoss&&d2(zz.x,zz.y,z.x,z.y)<90**2) zz._frz=Math.max(zz._frz||0,90); });
    }
  }
  if(equippedRelicIds.includes('relic_root')){
    const relic=RELICS.find(r=>r.id==='relic_root');
    if(Math.random()*100<relicVal(relic)){
      const heal=Math.ceil(P.maxHp*(3+relicLevel('relic_root')*0.3)/100);
      P.hp=Math.min(P.maxHp,P.hp+heal);
      for(let i=0;i<6;i++)parts.push({x:P.x,y:P.y,vx:(Math.random()-.5)*3,vy:-1-Math.random()*2,l:16,ml:16,r:3,col:'#4ade80'});
    }
  }
  if(equippedRelicIds.includes('relic_stormeye')){
    const relic=RELICS.find(r=>r.id==='relic_stormeye');
    if(Math.random()*100<relicVal(relic)){
      const dur=30+relicLevel('relic_stormeye')*6;
      zoms.forEach(zz=>{ if(!zz.dead&&!zz.isBoss) zz._frz=Math.max(zz._frz||0,dur); });
      setMsg('🌀 폭풍의 눈 발동!');
      setTimeout(()=>{if(running)setMsg('');},900);
    }
  }
  if(equippedRelicIds.includes('relic_judgment')&&!_relicState.chaining){
    const relic=RELICS.find(r=>r.id==='relic_judgment');
    if(Math.random()*100<relicVal(relic)){
      const tgt=zoms.find(zz=>!zz.dead&&zz!==z&&!zz.isBoss&&zz.hp>0&&zz.hp<=zz.maxHp*0.15);
      if(tgt){
        _relicState.chaining=true;
        hitZ(tgt,tgt.hp);
        _relicState.chaining=false;
        setMsg('⚖️ 최후의 심판 발동!');
        setTimeout(()=>{if(running)setMsg('');},900);
      }
    }
  }
}

// ── 패시브 스탯형 유물 (게임 시작 시 1회 적용, 펫 보너스와 동일한 방식) ──
function applyRelicPassives(){
  window._relicXpMult=1; window._relicCoinMult=1;
  equippedRelicIds.forEach(id=>{
    const relic=RELICS.find(r=>r.id===id);
    if(!relic) return;
    const v=relicVal(relic);
    if(relic.type==='dmgBoost') P.dmgB=(P.dmgB||0)+Math.ceil(v/2);
    else if(relic.type==='spdBoost') P.spd+=v;
    else if(relic.type==='hpBoost'){ const bonus=Math.floor(P.maxHp*v/100); P.maxHp+=bonus; P.hp+=bonus; }
    else if(relic.type==='critBoost') P._wepCrit=(P._wepCrit||0)+v/100;
    else if(relic.type==='xpBoost') window._relicXpMult=(window._relicXpMult||1)+v/100;
    else if(relic.type==='coinBoost') window._relicCoinMult=(window._relicCoinMult||1)+v/100;
    else if(relic.type==='allBoost'){
      P.dmgB=(P.dmgB||0)+Math.ceil(v/2);
      const bonus=Math.floor(P.maxHp*v/100); P.maxHp+=bonus; P.hp+=bonus;
      P.spd+=v*0.06;
    }
  });
}

function procRelicGuard(nextHp){
  if(!equippedRelicIds.includes('relic_guard')) return false;
  if(_relicState.guardCd>0) return false;
  if(nextHp>P.maxHp*0.25) return false;
  const relic=RELICS.find(r=>r.id==='relic_guard');
  P._shield=Math.ceil(relicVal(relic)*60); // 초 → 프레임
  _relicState.guardCd=1200; // 20초 쿨타임
  setMsg('🛡️ 수호의 방패 발동!');
  setTimeout(()=>{if(running)setMsg('');},1200);
  return true;
}

function procRelicOnHit(){
  if(!equippedRelicIds.includes('relic_thunder')) return;
  const relic=RELICS.find(r=>r.id==='relic_thunder');
  if(Math.random()*100>=relicVal(relic)) return;
  const tgt=zoms.filter(z=>!z.dead&&!z.isMinion).sort((a,b)=>d2(a.x,a.y,P.x,P.y)-d2(b.x,b.y,P.x,P.y))[0];
  if(!tgt) return;
  effs.push({type:'laser',x:P.x,y:P.y,ang:Math.atan2(tgt.y-P.y,tgt.x-P.x),len:Math.hypot(tgt.x-P.x,tgt.y-P.y),l:12,ml:12,col:'#67e8f9'});
  hitZ(tgt,15+relicLevel('relic_thunder')*2);
}

function procRelicDeathSave(){
  if(!_relicState.immortalReady) return false;
  const relic=RELICS.find(r=>r.id==='relic_immortal');
  _relicState.immortalReady=false;
  P.hp=Math.max(1,Math.floor(P.maxHp*relicVal(relic)/100));
  setMsg('❤️‍🔥 불멸의 심장 발동!');
  setTimeout(()=>{if(running)setMsg('');},2000);
  return true;
}
updateRelicButton();
