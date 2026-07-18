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
    case 'clone_item': effs.push({type:'shadow',x:P.x+50,y:P.y,l:600,ml:600,ang:0,idx:0,cnt:1,col:'#818cf8',fireT:0,fromItem:true}); break;
    case 'wolf':
      for(let i=0;i<3;i++){const wa=i/3*Math.PI*2;zoms.push({x:P.x+Math.cos(wa)*50,y:P.y+Math.sin(wa)*50,type:'wolf_ally',r:14,hp:40,maxHp:40,spd:3.2,angle:0,dead:false,dT:0,isMinion:true,minionTimer:1800,_dshC:999,_dsh:false,_dvx:0,_dvy:0,_healT:0,_phT:60,_phased:false,_frz:0,wob:0,col:'#78716c'});}
      break;
    case 'drone_item':
      zoms.push({x:P.x,y:P.y-40,type:'drone_ally',r:14,hp:60,maxHp:60,spd:2.6,angle:0,dead:false,dT:0,isMinion:true,isRangedMinion:true,minionTimer:1200,_dshC:999,_dsh:false,_dvx:0,_dvy:0,_healT:0,_phT:60,_phased:false,_frz:0,wob:0,fireT:0,col:'#60a5fa'});
      break;
    case 'golem_item':
      zoms.push({x:P.x-40,y:P.y,type:'golem_ally',r:26,hp:400,maxHp:400,spd:1.2,angle:0,dead:false,dT:0,isMinion:true,minionTimer:3600,_dshC:999,_dsh:false,_dvx:0,_dvy:0,_healT:0,_phT:60,_phased:false,_frz:0,wob:0,col:'#6b7280'});
      break;
    case 'rage': activeBuffs.rage=600; break;
    case 'adrenaline': activeBuffs.adrenaline=600; break;
    case 'berserker': activeBuffs.berserker=1200; break;
    case 'stealth': activeBuffs.stealth=480; zoms.forEach(z=>{z._igP=480;}); break;
    case 'overclock': activeBuffs.overclock=900; break;
    case 'revive': reviveReady=true; setMsg('🪶 부활 깃털 대기 중'); break;
    case 'ammo_box': P.ammo=P.maxAmmo; updHUD(); break;
    case 'vortex_bomb':
      zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<220**2){z.x+=(P.x-z.x)*.3;z.y+=(P.y-z.y)*.3;}});
      gTimeout(()=>{if(!running)return;addExp(P.x,P.y,180,'#a855f7');zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<180**2)hitZ(z,90);});},400);
      break;
    case 'chain_orb':{
      const tgts=zoms.filter(z=>!z.dead).sort((a,b)=>d2(a.x,a.y,P.x,P.y)-d2(b.x,b.y,P.x,P.y)).slice(0,5);
      tgts.forEach((z,i)=>{gTimeout(()=>{if(!running||z.dead)return;hitZ(z,40);for(let k=0;k<5;k++)parts.push({x:z.x,y:z.y,vx:(Math.random()-.5)*8,vy:(Math.random()-.5)*8,l:14,ml:14,r:4,col:'#facc15'});},i*100);});
      break;}
    case 'mirror_shield': activeBuffs.mirror=360; break;
    case 'vampiric_orb': activeBuffs.vampiric=720; break;
    case 'smoke_screen': activeBuffs.smoke=480; zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<260**2)z._frz=Math.max(z._frz||0,0);}); effs.push({type:'cloud',x:P.x,y:P.y,l:480,ml:480,r:130,dmgMult:0,dmgT:0}); break;
    case 'homing_missile':{
      const tgts=zoms.filter(z=>!z.dead).sort((a,b)=>d2(a.x,a.y,P.x,P.y)-d2(b.x,b.y,P.x,P.y)).slice(0,5);
      tgts.forEach((z,i)=>{gTimeout(()=>{if(!running)return;const ang=Math.atan2(z.y-P.y,z.x-P.x);buls.push({x:P.x,y:P.y,vx:Math.cos(ang)*8,vy:Math.sin(ang)*8,r:6,l:180,en:false,dmg:35,col:'#f97316',_homing:true,homingTarget:z});},i*120);});
      break;}
    case 'iron_wall': zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<220**2)z._frz=Math.max(z._frz||0,240);}); addExp(P.x,P.y,200,'#9ca3af'); break;
    case 'meteor_call':
      for(let i=0;i<5;i++){const mx=P.x+(Math.random()-.5)*400,my=P.y+(Math.random()-.5)*400;effs.push({type:'warn',x:mx,y:my,l:i*20+40,ml:i*20+40});gTimeout(()=>{if(!running)return;addExp(mx,my,60,'#f97316');zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,mx,my)<(60+z.r)**2)hitZ(z,70);});},i*180+700);}
      break;
    case 'static_field': activeBuffs.staticField=600; break;
    case 'phoenix_feather': P.hp=Math.min(P.maxHp,P.hp+P.maxHp*.4); P._invincible=Math.max(P._invincible||0,240); break;
    case 'lucky_clover': for(let i=0;i<24;i++){const a=i/24*Math.PI*2;parts.push({x:P.x,y:P.y,vx:Math.cos(a)*6,vy:Math.sin(a)*6,l:40,ml:40,r:6,col:'#4ade80'});} setMsg('🍀 행운이 함께하길!'); break;
    case 'spatial_path': P.x=Math.max(P.r,Math.min(MW-P.r,mxW));P.y=Math.max(P.r,Math.min(MH-P.r,myW)); break;
    case 'dream_key': P.x=Math.max(P.r,Math.min(MW-P.r,mxW));P.y=Math.max(P.r,Math.min(MH-P.r,myW)); break;
    case 'sp_item_jan': zoms.forEach(z=>{if(!z.dead)z._frz=Math.max(z._frz||0,300);}); addExp(MW/2,camY+300,350,'#bae6fd'); break;
    case 'sp_item_jun': for(let i=-2;i<=2;i++)for(let j=0;j<8;j++){const a=j/8*Math.PI*2;buls.push({x:P.x+i*60,y:P.y,vx:Math.cos(a)*9,vy:Math.sin(a)*9,r:7,l:130,en:false,dmg:35,col:'#38bdf8',_freezeAtk:true,_explosive:true});} break;
    case 'sp_item_dec': for(let i=0;i<50;i++){gTimeout(()=>{if(!running)return;const rx=Math.random()*MW,ry=camY-10;buls.push({x:rx,y:ry,vx:0,vy:8,r:6,l:100,en:false,dmg:25,col:'#fbbf24'});},i*60);} P.hp=P.maxHp; break;
    case 'sd_item_mythic':
      addExp(P.x,P.y,240,'#ec4899');
      zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<240**2)hitZ(z,130);});
      P.hp=Math.min(P.maxHp,P.hp+Math.ceil(P.maxHp*.3));
      break;
    case 'sd_item_ancient':
      zoms.forEach(z=>{if(!z.dead)z._frz=Math.max(z._frz||0,240);});
      addExp(MW/2,camY+300,400,'#d97706');
      break;
    case 'sd_item_divine':
      P.hp=P.maxHp;
      P._invincible=Math.max(P._invincible||0,360);
      break;
    case 'sd_item_absolute':
      zoms.forEach(z=>{if(!z.dead)hitZ(z,200);});
      addExp(MW/2,camY+300,450,'#f472b6');
      break;
    case 'ev_charm':
      addExp(P.x,P.y,220,'#ec4899');
      zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<220**2)hitZ(z,90);});
      for(let i=0;i<20;i++){const a=i/20*Math.PI*2;parts.push({x:P.x,y:P.y,vx:Math.cos(a)*7,vy:Math.sin(a)*7,l:35,ml:35,r:5,col:['#ec4899','#fbbf24','#22d3ee'][i%3]});}
      break;
    // ── 이벤트 상점(상시) 아이템 10종 ──
    case 'ev_shop_item1':
      addExp(P.x,P.y,200,'#fbbf24');
      zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<200**2)hitZ(z,70);});
      break;
    case 'ev_shop_item2':
      P.hp=P.maxHp; activeBuffs.regen=900;
      break;
    case 'ev_shop_item3':
      P._invincible=Math.max(P._invincible||0,300);
      break;
    case 'ev_shop_item4':
      activeBuffs.stealth=300; P._stealthDmgMult=3; zoms.forEach(z=>{z._igP=300;});
      break;
    case 'ev_shop_item5':{
      const amt=500+Math.floor(Math.random()*2501);
      coins+=amt; sv('hd_c',coins); updRes();
      for(let i=0;i<14;i++){const a=i/14*Math.PI*2;parts.push({x:P.x,y:P.y,vx:Math.cos(a)*5,vy:Math.sin(a)*5,l:28,ml:28,r:4,col:'#fbbf24'});}
      break;}
    case 'ev_shop_item6':
      P.dmgB=(P.dmgB||0)+6; setTimeout(()=>{P.dmgB-=6;},10000);
      break;
    case 'ev_shop_item7':
      addExp(P.x,P.y,260,'#f97316');
      zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<260**2)hitZ(z,120);});
      break;
    case 'ev_shop_item8':
      P.spd+=2; setTimeout(()=>{P.spd-=2;},10000);
      break;
    case 'ev_shop_item9':{
      const amt2=1000+Math.floor(Math.random()*4001);
      coins+=amt2; sv('hd_c',coins); updRes();
      for(let i=0;i<18;i++){const a=i/18*Math.PI*2;parts.push({x:P.x,y:P.y,vx:Math.cos(a)*6,vy:Math.sin(a)*6,l:32,ml:32,r:4,col:'#a855f7'});}
      break;}
    case 'ev_shop_item10':
      zoms.push({x:P.x-40,y:P.y,type:'lion_ally',r:20,hp:180,maxHp:180,spd:3.4,angle:0,dead:false,dT:0,isMinion:true,minionTimer:1800,_dshC:999,_dsh:false,_dvx:0,_dvy:0,_healT:0,_phT:60,_phased:false,_frz:0,wob:0,col:'#d97706'});
      break;
    // ── 요리전쟁 아이템 3종 ──
    case 'ev_cw_item1':
      addExp(P.x,P.y,180,'#ea580c');
      zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<180**2){hitZ(z,50);z._burnT=180;}});
      break;
    case 'ev_cw_item2':
      P.hp=Math.min(P.maxHp,P.hp+P.maxHp*.4); activeBuffs.regen=600;
      break;
    case 'ev_cw_item3':
      P.dmgB=(P.dmgB||0)+5; setTimeout(()=>{P.dmgB-=5;},8000);
      break;
    // ── 봄맞이 텃밭 가꾸기 아이템 3종 ──
    case 'ev_gd_item1':
      addExp(P.x,P.y,180,'#84cc16');
      zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<180**2)hitZ(z,50);});
      break;
    case 'ev_gd_item2':
      P.hp=Math.min(P.maxHp,P.hp+P.maxHp*.4); activeBuffs.regen=600;
      break;
    case 'ev_gd_item3':
      zoms.push({x:P.x+40,y:P.y,type:'fairy_ally',r:12,hp:35,maxHp:35,spd:3.6,angle:0,dead:false,dT:0,isMinion:true,isRangedMinion:true,minionTimer:1500,_dshC:999,_dsh:false,_dvx:0,_dvy:0,_healT:0,_phT:60,_phased:false,_frz:0,wob:0,fireT:0,col:'#bef264'});
      break;
    // ── 보물찾기 대회 아이템 3종 ──
    case 'ev_tr_item1':
      addExp(P.x,P.y,200,'#b45309');
      zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<200**2)hitZ(z,60);});
      break;
    case 'ev_tr_item2':
      addExp(P.x,P.y,150,'#4ade80');
      zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<150**2)hitZ(z,40);});
      coins+=800; sv('hd_c',coins); updRes();
      break;
    case 'ev_tr_item3':
      P.x=Math.max(P.r,Math.min(MW-P.r,mxW)); P.y=Math.max(P.r,Math.min(MH-P.r,myW));
      break;
    // ── 여름 수박격파 대회 아이템 3종 ──
    case 'ev_wm_item1':
      addExp(P.x,P.y,180,'#22c55e');
      zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<180**2)hitZ(z,50);});
      break;
    case 'ev_wm_item2':
      P.hp=Math.min(P.maxHp,P.hp+P.maxHp*.3); P.spd+=1.5; setTimeout(()=>{P.spd-=1.5;},10000);
      break;
    case 'ev_wm_item3':
      for(let i=0;i<24;i++){const a=i/24*Math.PI*2;buls.push({x:P.x,y:P.y,vx:Math.cos(a)*9,vy:Math.sin(a)*9,r:7,l:120,en:false,dmg:14+(P.dmgB||0),col:['#f97316','#fbbf24','#22c55e','#ec4899'][i%4]});}
      break;
    // ── 가을 사과 슬링샷 대회 아이템 3종 ──
    case 'ev_as_item1':
      addExp(P.x,P.y,180,'#dc2626');
      zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<180**2)hitZ(z,50);});
      break;
    case 'ev_as_item2':
      P.hp=Math.min(P.maxHp,P.hp+P.maxHp*.4);
      break;
    case 'ev_as_item3':
      zoms.push({x:P.x-40,y:P.y,type:'scarecrow_ally',r:18,hp:120,maxHp:120,spd:1.6,angle:0,dead:false,dT:0,isMinion:true,minionTimer:1500,_dshC:999,_dsh:false,_dvx:0,_dvy:0,_healT:0,_phT:60,_phased:false,_frz:0,wob:0,col:'#78350f'});
      break;
    // ── 산타의 선물배달 아이템 3종 ──
    case 'ev_gr_item1':
      addExp(P.x,P.y,190,'#ef4444');
      zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<190**2)hitZ(z,55);});
      break;
    case 'ev_gr_item2':
      P.hp=Math.min(P.maxHp,P.hp+P.maxHp*.4); activeBuffs.regen=600;
      break;
    case 'ev_gr_item3':
      zoms.push({x:P.x+40,y:P.y,type:'rudolph_ally',r:16,hp:70,maxHp:70,spd:4.2,angle:0,dead:false,dT:0,isMinion:true,minionTimer:1500,_dshC:999,_dsh:false,_dvx:0,_dvy:0,_healT:0,_phT:60,_phased:false,_frz:0,wob:0,col:'#ef4444'});
      break;
  }
  setMsg('✨ '+it.name+' 사용!');
  setTimeout(()=>{if(running&&P)setMsg('');},1500);
  renderItemBar();
}

// 아이템 쿨다운 틱 (update에서 호출)
function tickItems(){
  let cdChanged=false;
  Object.keys(itemCooldowns).forEach(k=>{if(itemCooldowns[k]>0){itemCooldowns[k]--;if(itemCooldowns[k]%60===0)cdChanged=true;}});
  if(cdChanged)renderItemBar();
  // 버프 틱
  if(activeBuffs.regen>0){activeBuffs.regen--;P.hp=Math.min(P.maxHp,P.hp+0.05);}
  if(activeBuffs.blackHole>0){activeBuffs.blackHole--;zoms.forEach(z=>{if(!z.dead){z.x+=(P.x-z.x)*.04;z.y+=(P.y-z.y)*.04;}});}
  if(activeBuffs.magnet>0){activeBuffs.magnet--;/* 코인 자동수집은 update에서 */}
  if(activeBuffs.rage>0){activeBuffs.rage--;P.dmgB=(P.dmgB||0);} // rage 배율은 hitZ에서 체크
  if(activeBuffs.adrenaline>0){activeBuffs.adrenaline--;}
  if(activeBuffs.berserker>0){activeBuffs.berserker--;}
  if(activeBuffs.stealth>0){activeBuffs.stealth--;if(activeBuffs.stealth<=0)zoms.forEach(z=>{z._igP=0;});}
  if(activeBuffs.overclock>0){activeBuffs.overclock--;}
  if(activeBuffs.mirror>0){activeBuffs.mirror--;}
  if(activeBuffs.vampiric>0){activeBuffs.vampiric--;}
  if(activeBuffs.staticField>0){
    activeBuffs.staticField--;
    if(activeBuffs.staticField%20===0)zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<140**2)hitZ(z,4);});
  }
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
    div.innerHTML='<span class="item-key">'+(i+1)+'</span><span class="item-ico">'+it.icon+'</span>'+(cd>0?'<span class="item-cd">'+Math.ceil(cd/60)+'</span>':'');
    div.title=it.name+' ['+( i+1)+'] - '+it.desc;
    div.onclick=()=>useItem(id);
    bar.appendChild(div);
  });
}

// ════════════════════════════════════════════
// ══ 장비탭 3단 분류 ══
// ════════════════════════════════════════════

let curEquipTab = 'wep'; // 'wep' | 'armor' | 'item' | 'star'

function setEquipTab(tab){
  curEquipTab = tab;
  document.querySelectorAll('.etab').forEach(b=>b.classList.remove('on'));
  const tabMap={wep:'eTabWep',armor:'eTabArmor',item:'eTabItem',star:'eTabStar'};
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
      wB.onclick=()=>{equippedItems=equippedItems.filter(x=>x!==it.id);saveItems();renderEquip();renderItemBar();checkDreamUnlock();};
    } else if(equippedItems.length<3){
      wB.style.background='#7c3aed';wB.style.color='#fff';wB.textContent='장착';
      wB.onclick=()=>{equippedItems.push(it.id);saveItems();renderEquip();renderItemBar();checkDreamUnlock();};
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
  const devBtn=document.getElementById('devEggRevealBtn');
  if(devBtn)devBtn.style.display=(typeof devModeUnlocked!=='undefined'&&devModeUnlocked)?'inline-block':'none';
  const devMerchBtn=document.getElementById('devMerchSummonBtn');
  if(devMerchBtn)devMerchBtn.style.display=(typeof devModeUnlocked!=='undefined'&&devModeUnlocked)?'inline-block':'none';
  checkAchievements();
  ACHIEVEMENTS.forEach(a=>{
    const isDone=!!achData[a.id];
    if(a.hidden&&!isDone) return; // 히든은 달성 전까지 숨김
    const card=document.createElement('div');
    card.className='ach-card'+(isDone?' done':'')+(a.hidden?' hidden':'');
    // 보상 텍스트
    const rTxt=achRewardText(a);
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