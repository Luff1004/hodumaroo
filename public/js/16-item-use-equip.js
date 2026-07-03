// ════════════════════════════════════════════
// ══ 아이템 사용 ══
// ════════════════════════════════════════════

let itemCooldowns = {}; // {itemId: remainingFrames}
let activeBuffs = {};   // {buffId: framesLeft}
let reviveReady = false;

function useItem(itemId){
  const it = ITEMS.find(i=>i.id===itemId);
  if(!it||!ownedItems[itemId]) return;
  if(itemCooldowns[itemId]>0){ setMsg('⏳ 쿨다운: '+Math.ceil(itemCooldowns[itemId]/60)+'초'); return; }
  if(!running){ setMsg('게임 중에만 사용 가능'); return; }
  itemCooldowns[itemId] = it.cd;
  achStats.totalItemUses=(achStats.totalItemUses||0)+1;
  checkAchievements();

  switch(itemId){
    case 'bomb':
      addExp(P.x,P.y,200,'#f97316');
      zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<200**2)hitZ(z,80);}); break;
    case 'grenade':
      addExp(P.x,P.y,150,'#ef4444');
      zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<150**2){hitZ(z,60);z._burnT=180;}}); break;
    case 'shuriken':
      for(let i=0;i<8;i++){const a=i/8*Math.PI*2;buls.push({x:P.x,y:P.y,vx:Math.cos(a)*12,vy:Math.sin(a)*12,r:5,l:150,en:false,dmg:30,col:'#facc15',pierce:true});}; break;
    case 'lightning':
      zoms.filter(z=>!z.dead).sort((a,b)=>d2(a.x,a.y,P.x,P.y)-d2(b.x,b.y,P.x,P.y)).slice(0,3).forEach(z=>{hitZ(z,60);for(let i=0;i<5;i++)parts.push({x:z.x,y:z.y,vx:(Math.random()-.5)*8,vy:(Math.random()-.5)*8,l:12,ml:12,r:4,col:'#facc15'});});  break;
    case 'freeze_bomb':
      zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<250**2)z._frz=Math.max(z._frz||0,180);}); addExp(P.x,P.y,250,'#bae6fd'); break;
    case 'poison_cloud':
      effs.push({type:'cloud',x:P.x,y:P.y,l:600,ml:600,r:100,dmgMult:1,dmgT:0}); break;
    case 'nuke':
      zoms.forEach(z=>{if(!z.dead)hitZ(z,999);}); addExp(MW/2,camY+300,400,'#ef4444'); break;
    case 'black_hole':
      activeBuffs.blackHole=300;
      effs.push({type:'ring',x:P.x,y:P.y,r:10,maxR:200,l:40,ml:40,col:'#000'}); break;
    case 'soul_shard':
      for(let i=0;i<12;i++){const a=i/12*Math.PI*2;buls.push({x:P.x,y:P.y,vx:Math.cos(a)*10,vy:Math.sin(a)*10,r:6,l:160,en:false,dmg:45,col:'#818cf8',pierce:true});}; break;
    case 'star_rain':
      for(let i=0;i<30;i++){gTimeout(()=>{if(!running)return;const rx=Math.random()*MW,ry=camY-20;buls.push({x:rx,y:ry,vx:0,vy:10,r:7,l:120,en:false,dmg:40,col:'#fbbf24',_explosive:true});},i*80);} break;
    case 'medkit': P.hp=Math.min(P.maxHp,P.hp+50); break;
    case 'shield': activeBuffs.shield=180; P._invincible=Math.max(P._invincible||0,180); break;
    case 'bandage': P.hp=Math.min(P.maxHp,P.hp+30); activeBuffs.regen=600; break;
    case 'elixir': P.hp=P.maxHp; activeBuffs.regen=1800; break;
    case 'barrier': activeBuffs.barrier=300; break;
    case 'dash_boot':
      P.x=Math.max(P.r,Math.min(MW-P.r,P.x+Math.cos(P.angle)*120));
      P.y=Math.max(P.r,Math.min(MH-P.r,P.y+Math.sin(P.angle)*120)); break;
    case 'blink': P.x=Math.max(P.r,Math.min(MW-P.r,mxW));P.y=Math.max(P.r,Math.min(MH-P.r,myW)); break;
    case 'ghost_step': activeBuffs.ghost=300; P._invincible=Math.max(P._invincible||0,300); break;
    case 'magnet': activeBuffs.magnet=600; break;
    case 'time_stop': zoms.forEach(z=>{if(!z.dead&&!z.isBoss)z._frz=Math.max(z._frz||0,300);}); break;
    case 'turret': turrets.push({x:P.x,y:P.y,l:900,ml:900,fireT:0}); break;
    case 'clone_item': effs.push({type:'shadow',x:P.x+50,y:P.y,l:600,ml:600,ang:0,idx:0,cnt:1,col:'#818cf8',fireT:0}); break;
    case 'rage': activeBuffs.rage=600; break;
    case 'adrenaline': activeBuffs.adrenaline=600; break;
    case 'berserker': activeBuffs.berserker=1200; break;
    case 'stealth': activeBuffs.stealth=480; zoms.forEach(z=>{z._igP=480;}); break;
    case 'overclock': activeBuffs.overclock=900; break;
    case 'coin_rain': coins+=5000; sv('hd_c',coins); updRes(); break;
    case 'revive': reviveReady=true; setMsg('🪶 부활 깃털 대기 중'); break;
    case 'ammo_box': P.ammo=P.maxAmmo; updHUD(); break;
    case 'xp_boost': addSeasonXP(500); break;
    case 'energy_can': energy+=1000; sv('hd_e',energy); updRes(); break;
    case 'coin_bag': coins+=2000; sv('hd_c',coins); updRes(); break;
    case 'lucky_clover': for(let i=0;i<24;i++){const a=i/24*Math.PI*2;parts.push({x:P.x,y:P.y,vx:Math.cos(a)*6,vy:Math.sin(a)*6,l:40,ml:40,r:6,col:'#4ade80'});} setMsg('🍀 행운이 함께하길!'); break;
    case 'spatial_path': blink(); break;
    case 'sp_item_jan': zoms.forEach(z=>{if(!z.dead)z._frz=Math.max(z._frz||0,300);}); addExp(MW/2,camY+300,350,'#bae6fd'); break;
    case 'sp_item_jun': for(let i=-2;i<=2;i++)for(let j=0;j<8;j++){const a=j/8*Math.PI*2;buls.push({x:P.x+i*60,y:P.y,vx:Math.cos(a)*9,vy:Math.sin(a)*9,r:7,l:130,en:false,dmg:35,col:'#38bdf8',_freezeAtk:true,_explosive:true});} break;
    case 'sp_item_dec': for(let i=0;i<50;i++){gTimeout(()=>{if(!running)return;const rx=Math.random()*MW,ry=camY-10;buls.push({x:rx,y:ry,vx:0,vy:8,r:6,l:100,en:false,dmg:25,col:'#fbbf24'});},i*60);} P.hp=P.maxHp; break;
  }
  setMsg('✨ '+it.name+' 사용!');
  setTimeout(()=>{if(running&&P)setMsg('');},1500);
  renderItemBar();
}

// 아이템 쿨다운 틱 (update에서 호출)
function tickItems(){
  Object.keys(itemCooldowns).forEach(k=>{if(itemCooldowns[k]>0)itemCooldowns[k]--;});
  // 버프 틱
  if(activeBuffs.regen>0){activeBuffs.regen--;P.hp=Math.min(P.maxHp,P.hp+0.05);}
  if(activeBuffs.blackHole>0){activeBuffs.blackHole--;zoms.forEach(z=>{if(!z.dead){z.x+=(P.x-z.x)*.04;z.y+=(P.y-z.y)*.04;}});}
  if(activeBuffs.magnet>0){activeBuffs.magnet--;/* 코인 자동수집은 update에서 */}
  if(activeBuffs.rage>0){activeBuffs.rage--;P.dmgB=(P.dmgB||0);} // rage 배율은 hitZ에서 체크
  if(activeBuffs.adrenaline>0){activeBuffs.adrenaline--;}
  if(activeBuffs.berserker>0){activeBuffs.berserker--;}
  if(activeBuffs.stealth>0){activeBuffs.stealth--;if(activeBuffs.stealth<=0)zoms.forEach(z=>{z._igP=0;});}
  if(activeBuffs.overclock>0){activeBuffs.overclock--;}
}

// 아이템 바 렌더링 (장착 슬롯 UI)
function renderItemBar(){
  const bar = document.getElementById('itemBar');
  if(!bar) return;
  bar.innerHTML='';
  equippedItems.slice(0,3).forEach((id,i)=>{
    if(!id){const slot=document.createElement('div');slot.className='item-slot empty';slot.textContent='['+( i+1)+']';bar.appendChild(slot);return;}
    const it=ITEMS.find(x=>x.id===id);if(!it)return;
    const cd=itemCooldowns[id]||0;
    const div=document.createElement('div');
    div.className='item-slot'+(cd>0?' cooling':'');
    div.innerHTML='<span class="item-ico">'+it.icon+'</span>'+(cd>0?'<span class="item-cd">'+Math.ceil(cd/60)+'</span>':'');
    div.title=it.name+' ['+( i+1)+']';
    div.onclick=()=>useItem(id);
    bar.appendChild(div);
  });
}

// ════════════════════════════════════════════
// ══ 장비탭 3단 분류 ══
// ════════════════════════════════════════════

let curEquipTab = 'wep'; // 'wep' | 'armor' | 'item'

function setEquipTab(tab){
  curEquipTab = tab;
  document.querySelectorAll('.etab').forEach(b=>b.classList.remove('on'));
  const tabMap={wep:'eTabWep',armor:'eTabArmor',item:'eTabItem'};
  const el=document.getElementById(tabMap[tab]);
  if(el)el.classList.add('on');
  renderEquip();
}

// renderEquip 내에서 아이템 탭 처리
function renderEquipItemTab(){
  const list=document.getElementById('eList');
  if(!list)return;
  list.innerHTML='';
  // 보유 아이템 목록
  const myItems=ITEMS.filter(it=>ownedItems[it.id]);
  if(myItems.length===0){
    const empty=document.createElement('div');
    empty.style.cssText='text-align:center;color:#6b7280;padding:20px;font-size:12px;';
    empty.textContent='아이템 없음 - 상점에서 구매하세요';
    list.appendChild(empty);
  }
  myItems.forEach((it,i)=>{
    const isEq=equippedItems.includes(it.id);
    const slot=equippedItems.indexOf(it.id)+1;
    const d=document.createElement('div');
    const rarCls=it.rarity?' rarity-'+it.rarity:'';
    d.className='ei'+(isEq?' eq':'')+rarCls;
    d.innerHTML='<div class="eico">'+it.icon+'</div><div><div class="enm">'+it.name+(isEq?' <span style="font-size:9px;background:#14532d;color:#4ade80;padding:1px 4px;border-radius:4px;">슬롯'+slot+'</span>':'')+'</div><div class="elv" style="color:#6b7280;font-size:9px;">'+it.desc+'</div></div>';
    // 장착/해제 버튼
    const wB=document.createElement('button');
    wB.style.cssText='margin-left:auto;padding:4px 8px;border-radius:6px;font-size:10px;font-weight:700;border:none;cursor:pointer;';
    if(isEq){
      wB.style.background='#ef4444';wB.style.color='#fff';wB.textContent='해제';
      wB.onclick=()=>{equippedItems=equippedItems.filter(x=>x!==it.id);saveItems();renderEquip();renderItemBar();};
    } else if(equippedItems.length<3){
      wB.style.background='#7c3aed';wB.style.color='#fff';wB.textContent='장착';
      wB.onclick=()=>{equippedItems.push(it.id);saveItems();renderEquip();renderItemBar();};
    } else {
      wB.style.background='#374151';wB.style.color='#9ca3af';wB.textContent='슬롯 가득';wB.disabled=true;
    }
    d.appendChild(wB);
    d.onclick=()=>{};
    list.appendChild(d);
  });
  // 아이템 슬롯 미리보기
  const prev=document.getElementById('eprev');
  if(prev){
    prev.innerHTML='<div style="font-size:11px;font-weight:700;color:#7c3aed;margin-bottom:8px;">장착 슬롯 (최대 3)</div>';
    for(let i=0;i<3;i++){
      const id=equippedItems[i];
      const it2=id?ITEMS.find(x=>x.id===id):null;
      const sl=document.createElement('div');
      sl.style.cssText='padding:8px;border:1px solid '+(it2?'#7c3aed':'#e5e7eb')+';border-radius:8px;margin-bottom:6px;text-align:center;font-size:11px;';
      sl.innerHTML=it2?'<div style="font-size:20px">'+it2.icon+'</div><div>'+it2.name+'</div><div style="color:#9ca3af;font-size:9px;">인게임 ['+( i+1)+'] 키</div>':'<div style="color:#9ca3af;">슬롯 '+(i+1)+' 비어있음</div>';
      prev.appendChild(sl);
    }
  }
}

function renderAchievements(){
  const list=document.getElementById('achList');
  if(!list)return;
  list.innerHTML='';
  const done=ACHIEVEMENTS.filter(a=>achData[a.id]).length;
  const prog=document.getElementById('achProgress');
  if(prog)prog.textContent=done+'/'+ACHIEVEMENTS.length+' 달성 · 업적 포인트 '+done*10;
  checkAchievements();
  ACHIEVEMENTS.forEach(a=>{
    const isDone=!!achData[a.id];
    if(a.hidden&&!isDone) return; // 히든은 달성 전까지 숨김
    const card=document.createElement('div');
    card.className='ach-card'+(isDone?' done':'')+(a.hidden?' hidden':'');
    // 보상 텍스트
    const r=a.reward||{};
    let rTxt='보상: ';
    if(r.coins)rTxt+='🪙 '+r.coins.toLocaleString()+'코인';
    if(r.energy)rTxt+='⚡ '+r.energy.toLocaleString()+'에너지';
    if(r.item){const it=ITEMS.find(x=>x.id===r.item);rTxt+=it?it.icon+' '+it.name:'아이템';}
    card.innerHTML=
      '<div class="ach-ico">'+(isDone?'🏆':'⬜')+'</div>'+
      '<div class="ach-info">'+
        '<div class="ach-name">'+(a.hidden&&!isDone?'???':a.name)+'</div>'+
        '<div class="ach-desc">'+(a.hidden&&!isDone?'???':a.desc)+'</div>'+
        '<div class="ach-reward">'+rTxt+'</div>'+
      '</div>'+
      (isDone?'<div class="ach-done">✅ 완료</div>':'<div style="font-size:10px;color:#374151;">미완료</div>');
    list.appendChild(card);
  });
}