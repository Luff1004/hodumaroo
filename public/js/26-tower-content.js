// ══════════════ 무한의 탑: 전용 콘텐츠 (유물/정수 상점/반복 보스) ══════════════
// 기존 웨이브 엔진(zoms/hitZ/takeDmg/showUpgOv 등)에 최소한의 훅만 추가하고,
// 신규 상태(towerRelics/towerEssence/towerUpgLv)는 전부 이 파일에서 관리한다.

// ── 유물(보물의 문에서 선택) ──
let towerRelics={};
const TOWER_RELICS=[
  {id:'dmg',name:'관통의 유물',icon:'🗡',desc:'모든 공격 데미지 +3',apply:()=>{P.dmgB=(P.dmgB||0)+3;}},
  {id:'speed',name:'질풍의 유물',icon:'💨',desc:'이동속도 +15%',apply:()=>{P.spd*=1.15;}},
  {id:'armor',name:'철갑의 유물',icon:'🛡',desc:'방어력 +12',apply:()=>{P.armor=(P.armor||0)+12;}},
  {id:'vampiric',name:'흡혈의 유물',icon:'🩸',desc:'좀비 처치 시 체력 1 회복',apply:()=>{towerRelics.vampiric=true;}},
  {id:'greed',name:'탐욕의 유물',icon:'💰',desc:'층 클리어 보상 대폭 증가, 대신 받는 피해 +10%',apply:()=>{towerRelics.greedCoin=(towerRelics.greedCoin||0)+0.5;towerRelics.greedDmg=(towerRelics.greedDmg||0)+0.1;}},
  {id:'regen',name:'재생의 유물',icon:'💚',desc:'초당 체력 자동 회복 +1',apply:()=>{towerRelics.regen=(towerRelics.regen||0)+1;}},
  {id:'crit',name:'냉철의 유물',icon:'❄',desc:'크리티컬 확률 +10%',apply:()=>{P._wepCrit=(P._wepCrit||0)+0.1;}},
  {id:'revive',name:'불사조의 유물',icon:'👼',desc:'이번 등반에서 한 번 부활',apply:()=>{reviveReady=true;}},
  {id:'reload',name:'탄환 폭풍의 유물',icon:'🌀',desc:'재장전 속도 향상',apply:()=>{P.reloadBonus=(P.reloadBonus||0)+18;}},
  {id:'maxhp',name:'심장의 유물',icon:'❤️',desc:'최대체력 +25 (즉시 회복 포함)',apply:()=>{P.maxHp+=25;P.hp+=25;}},
];
function rndTowerRelics(n){
  const sh=[...TOWER_RELICS].sort(()=>Math.random()-.5);
  return sh.slice(0,n);
}
function showTowerRelicChoice(){
  stopLoop();
  const con=document.getElementById('towerRelicCards');
  con.innerHTML='';
  rndTowerRelics(3).forEach(r=>{
    const d=document.createElement('div');
    d.className='ucard';
    d.innerHTML=`<div class="uc-ico">${r.icon}</div><div class="uc-nm">${r.name}</div><div class="uc-ds">${r.desc}</div>`;
    d.onclick=()=>{
      r.apply();
      document.getElementById('towerRelicOv').style.display='none';
      setMsg(`✨ ${r.icon} ${r.name} 획득!`);
      setTimeout(()=>{if(running||betweenWave)setMsg('');},2000);
      nextWave();
    };
    con.appendChild(d);
  });
  document.getElementById('towerRelicOv').style.display='flex';
}
function tickTowerRelics(){
  if(!P)return;
  if(towerRelics.regen&&P.hp<P.maxHp){
    if(!(window._towerRegenT>=0))window._towerRegenT=0;
    window._towerRegenT++;
    if(window._towerRegenT>=60){window._towerRegenT=0;P.hp=Math.min(P.maxHp,P.hp+towerRelics.regen);}
  }
}

// ── 탑의 정수(전용 화폐) + 영구 업그레이드 상점 ──
let towerUpgLv=lJ('hd_tower_upg',{});
function saveTowerUpg(){sv('hd_tower_upg',towerUpgLv);}
function gainTowerEssence(n){
  const cur=lN('hd_tower_essence',0);
  sv('hd_tower_essence',cur+n);
  const lbl=document.getElementById('towerEssenceLbl');if(lbl)lbl.textContent=cur+n;
  const lbl2=document.getElementById('towerShopEssence');if(lbl2)lbl2.textContent=cur+n;
}
const TOWER_SHOP_UPG=[
  {id:'hp',name:'생명력 강화',icon:'❤️',max:5,costBase:5,effect:lv=>`최대체력 +${lv*10}`},
  {id:'dmg',name:'공격력 강화',icon:'⚔️',max:5,costBase:6,effect:lv=>`데미지 +${lv}`},
  {id:'spd',name:'기동력 강화',icon:'💨',max:3,costBase:8,effect:lv=>`이동속도 +${lv*3}%`},
  {id:'coin',name:'시작 자금',icon:'🪙',max:5,costBase:4,effect:lv=>`등반 시작 시 코인 +${lv*200}`},
];
function openTowerShop(){
  document.getElementById('towerShopOv').style.display='flex';
  document.getElementById('towerShopEssence').textContent=lN('hd_tower_essence',0);
  renderTowerShop();
}
function closeTowerShop(){document.getElementById('towerShopOv').style.display='none';}
function renderTowerShop(){
  const list=document.getElementById('towerShopList');
  if(!list)return;
  const essence=lN('hd_tower_essence',0);
  list.innerHTML=TOWER_SHOP_UPG.map(u=>{
    const lv=towerUpgLv[u.id]||0;
    const maxed=lv>=u.max;
    const cost=u.costBase*(lv+1);
    const disabled=maxed||essence<cost;
    return `<div style="display:flex;justify-content:space-between;align-items:center;background:#1f1a3a;border:1px solid #4c1d95;border-radius:10px;padding:10px 14px;gap:10px;">
      <div>
        <div style="font-weight:800;color:#c4b5fd;">${u.icon} ${u.name} (Lv.${lv}/${u.max})</div>
        <div style="font-size:11px;color:#a78bfa;">${u.effect(lv)}${maxed?' · 최대':''}</div>
      </div>
      <button ${disabled?'disabled':''} onclick="buyTowerUpg('${u.id}')" style="padding:8px 16px;border:none;border-radius:8px;font-weight:800;flex-shrink:0;cursor:${disabled?'default':'pointer'};background:${disabled?'#374151':'linear-gradient(135deg,#7c3aed,#4c1d95)'};color:${disabled?'#6b7280':'#fff'};">${maxed?'완료':'✨'+cost}</button>
    </div>`;
  }).join('');
}
function buyTowerUpg(id){
  const u=TOWER_SHOP_UPG.find(x=>x.id===id);if(!u)return;
  const lv=towerUpgLv[id]||0;
  if(lv>=u.max)return;
  const cost=u.costBase*(lv+1);
  const essence=lN('hd_tower_essence',0);
  if(essence<cost)return;
  sv('hd_tower_essence',essence-cost);
  towerUpgLv[id]=lv+1;
  saveTowerUpg();
  document.getElementById('towerShopEssence').textContent=essence-cost;
  renderTowerShop();
}

// ── 등반 시작 시 영구 강화 적용 + 상태 초기화 ──
function initTowerRun(){
  towerRelics={};
  window._lastPHp=null;window._towerRegenT=0;
  if(!P)return;
  const hpLv=towerUpgLv.hp||0,dmgLv=towerUpgLv.dmg||0,spdLv=towerUpgLv.spd||0,coinLv=towerUpgLv.coin||0;
  if(hpLv){P.maxHp+=hpLv*10;P.hp+=hpLv*10;}
  if(dmgLv)P.dmgB=(P.dmgB||0)+dmgLv;
  if(spdLv)P.spd*=(1+spdLv*.03);
  if(coinLv){coins+=coinLv*200;saveAll();}
}

// ── 100층 이후 반복 등장하는 "탑의 군주" ──
function spawnTowerLordBoss(wave){
  const tier=Math.floor(wave/10);
  const hp=Math.round(18000*Math.pow(1.35,tier-10));
  const bd={name:`탑의 군주 (${wave}층)`,icon:'👑',hp,r:52,col:'#4c1d95',ol:'#1e1b4b',
    phases:[{t:.6,m:'👑 탑의 군주가 위엄을 드러낸다!'},{t:.3,m:'💀 최후의 격노!'}],
    atk:['burst16','burst8','summonAll','blink'],
    reward:{c:Math.round(3000*tier),e:Math.round(2200*tier)}};
  const bz={x:MW/2,y:camY+VH()*.12,isBoss:true,bd,r:bd.r,hp:bd.hp,maxHp:bd.hp,spd:.9,angle:0,dead:false,dT:0,_aT:0,_aI:0,phT:[],_chargeV:null,_chargeT:0};
  zoms.unshift(bz);activeBoss=bz;
  document.getElementById('bossBar').style.display='block';updBossBar();
  setMsg(`⚠️ ${bd.icon} ${bd.name} 등장!`);
  for(let i=0;i<30;i++)parts.push({x:bz.x,y:bz.y,vx:(Math.random()-.5)*12,vy:(Math.random()-.5)*12,l:55,ml:55,r:5,col:bd.col});
  setTimeout(()=>{if(running)setMsg('');},3000);
}
