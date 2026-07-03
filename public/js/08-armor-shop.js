// ══════════════ 갑옷 ══════════════
const ARMORS=[
  {id:'wood',name:'나무',icon:'🪵',price:10000,def:5,bc:'#a0522d',ac:'#8B6914',desc:'방어력+5%'},
  {id:'stone',name:'돌',icon:'🪨',price:30000,def:12,bc:'#9ca3af',ac:'#6b7280',desc:'방어력+12%'},
  {id:'iron',name:'철',icon:'⚙️',price:80000,def:20,bc:'#d1d5db',ac:'#9ca3af',desc:'방어력+20%'},
  {id:'gold',name:'금',icon:'✨',price:150000,def:15,bc:'#fbbf24',ac:'#f59e0b',desc:'방어력+15%, 코인+10%'},
  {id:'diamond',name:'다이아',icon:'💎',price:300000,def:35,bc:'#67e8f9',ac:'#06b6d4',desc:'방어력+35%'},
  {id:'netherite',name:'네더라이트',icon:'🔥',price:600000,def:50,bc:'#78716c',ac:'#44403c',desc:'방어력+50%'},
  // ── 신규 특성 갑옷 16종 ──
  {id:'shadow',name:'그림자',icon:'🌑',price:500000,def:20,bc:'#1a1a2e',ac:'#0d0d1a',desc:'방어+20%, 이동속도+0.5',bonus:{spd:0.5}},
  {id:'flame',name:'화염',icon:'🔥',price:550000,def:15,bc:'#b45309',ac:'#92400e',desc:'방어+15%, 근접 공격 시 화염 데미지',bonus:{fireAura:true}},
  {id:'frost',name:'얼음',icon:'❄️',price:550000,def:18,bc:'#bae6fd',ac:'#7dd3fc',desc:'방어+18%, 접촉 좀비 감속',bonus:{coldAura:true}},
  {id:'thunder',name:'번개',icon:'⚡',price:600000,def:22,bc:'#fbbf24',ac:'#d97706',desc:'방어+22%, 피격 시 주변 적 감전',bonus:{thunderAura:true}},
  {id:'holy',name:'신성',icon:'✨',price:700000,def:30,bc:'#fef9c3',ac:'#fde047',desc:'방어+30%, 재생속도+2',bonus:{regen:2}},
  {id:'poison_ar',name:'독',icon:'☠️',price:450000,def:12,bc:'#84cc16',ac:'#65a30d',desc:'방어+12%, 접촉 좀비 독 상태',bonus:{poisonAura:true}},
  {id:'steel',name:'강철',icon:'🔩',price:750000,def:40,bc:'#9ca3af',ac:'#6b7280',desc:'방어+40%, 이동속도-0.3 (무거움)',bonus:{spd:-0.3}},
  {id:'dragon',name:'드래곤',icon:'🐉',price:1000000,def:45,bc:'#dc2626',ac:'#991b1b',desc:'방어+45%, 최대HP+100',bonus:{hp:100}},
  {id:'crystal',name:'수정',icon:'💎',price:900000,def:35,bc:'#67e8f9',ac:'#22d3ee',desc:'방어+35%, 치명타+15%',bonus:{crit:15}},
  {id:'ghost_ar',name:'유령',icon:'👻',price:650000,def:10,bc:'#e2e8f0',ac:'#cbd5e1',desc:'방어+10%, 10% 확률 피해 무시',bonus:{dodge:10}},
  {id:'blood',name:'피의',icon:'🩸',price:700000,def:25,bc:'#7f1d1d',ac:'#450a0a',desc:'방어+25%, 처치 시 HP+3',bonus:{lifesteal:3}},
  {id:'earth',name:'대지',icon:'🌍',price:550000,def:28,bc:'#78350f',ac:'#451a03',desc:'방어+28%, 낙하 데미지 면역',bonus:{sturdy:true}},
  {id:'wind',name:'바람',icon:'💨',price:500000,def:8,bc:'#bfdbfe',ac:'#93c5fd',desc:'방어+8%, 이동속도+1.2',bonus:{spd:1.2}},
  {id:'void',rarity:'epic',name:'공허',icon:'🌌',price:1500000,def:55,bc:'#312e81',ac:'#1e1b4b',desc:'방어+55%, 모든 데미지+2',bonus:{dmg:2}},
  {id:'titan',rarity:'epic',name:'타이탄',icon:'⚙️',price:2000000,def:60,bc:'#374151',ac:'#1f2937',desc:'방어+60%, 최대HP+200',bonus:{hp:200}},
  {id:'angel',rarity:'legendary',name:'천사',icon:'👼',price:3000000,def:35,bc:'#fffbeb',ac:'#fef3c7',desc:'방어+35%, 재생+5, 치명타+20%',bonus:{regen:5,crit:20}},
  // ── 추가 갑옷 18종 (총 40종) ──
  {id:'magma',name:'마그마',icon:'🌋',price:800000,def:32,bc:'#7f1d1d',ac:'#991b1b',desc:'방어+32%, 접촉 적 화상 데미지 2배',bonus:{fireAura:true,def:32}},
  {id:'ocean',name:'심해',icon:'🌊',price:750000,def:28,bc:'#0369a1',ac:'#0284c7',desc:'방어+28%, 이동속도+0.8 이동 중',bonus:{spd:0.8}},
  {id:'space_ar',name:'우주복',icon:'🚀',price:1000000,def:38,bc:'#1e1b4b',ac:'#312e81',desc:'방어+38%, 모든 데미지+3',bonus:{dmg:3}},
  {id:'plague',name:'역병',icon:'☣️',price:850000,def:22,bc:'#365314',ac:'#3f6212',desc:'방어+22%, 접촉 적 독+데미지',bonus:{poisonAura:true}},
  {id:'cyber',name:'사이버',icon:'🤖',price:1200000,def:42,bc:'#0f172a',ac:'#1e293b',desc:'방어+42%, 재장전속도+50%',bonus:{reload:true}},
  {id:'pharaoh',name:'파라오',icon:'🏺',price:1000000,def:33,bc:'#b45309',ac:'#d97706',desc:'방어+33%, 코인획득+25%',bonus:{coinBonus:0.25}},
  {id:'werewolf',name:'늑대인간',icon:'🐺',price:900000,def:25,bc:'#374151',ac:'#1f2937',desc:'방어+25%, HP낮을수록 공격력 증가',bonus:{berserk:true}},
  {id:'skeleton_ar',name:'해골',icon:'💀',price:780000,def:18,bc:'#d1d5db',ac:'#9ca3af',desc:'방어+18%, 처치 시 뼈 파편 발사',bonus:{boneShot:true}},
  {id:'ancient',name:'고대',icon:'🗿',price:1800000,def:48,bc:'#78350f',ac:'#92400e',desc:'방어+48%, 최대HP+150',bonus:{hp:150}},
  {id:'phoenix',rarity:'legendary',name:'불사조',icon:'🦅',price:2500000,def:30,bc:'#dc2626',ac:'#f97316',desc:'방어+30%, 1회 부활+재생+8',bonus:{regen:8,revive:true}},
  {id:'storm',name:'폭풍',icon:'⛈️',price:1400000,def:26,bc:'#1e40af',ac:'#1d4ed8',desc:'방어+26%, 이동속도+1.5',bonus:{spd:1.5}},
  {id:'lich',name:'리치',icon:'🧟',price:1600000,def:35,bc:'#4c1d95',ac:'#5b21b6',desc:'방어+35%, 흡혈+5',bonus:{lifesteal:5}},
  {id:'golem_ar',name:'골렘',icon:'🗿',price:1800000,def:52,bc:'#6b7280',ac:'#4b5563',desc:'방어+52%, 이동속도-0.5',bonus:{spd:-0.5}},
  {id:'celestial',rarity:'legendary',name:'천상',icon:'🌠',price:2200000,def:40,bc:'#fef9c3',ac:'#fbbf24',desc:'방어+40%, 치명타+25%, 재생+4',bonus:{crit:25,regen:4}},
  {id:'abyssal',rarity:'epic',name:'심연',icon:'🕳️',price:2800000,def:58,bc:'#030712',ac:'#111827',desc:'방어+58%, 회피+20%',bonus:{dodge:20}},
  {id:'rainbow',rarity:'epic',name:'무지개',icon:'🌈',price:2000000,def:38,bc:'#fbbf24',ac:'#f59e0b',desc:'방어+38%, 모든 특성 강화+1',bonus:{perkBoost:1}},
  {id:'nightmare',rarity:'legendary',name:'악몽',icon:'😱',price:4000000,def:45,bc:'#1c1917',ac:'#0c0a09',desc:'방어+45%, 적 처치 시 HP+5, 데미지+3',bonus:{lifesteal:5,dmg:3}},
  {id:'omnipotent',rarity:'mythic',name:'전능',icon:'⭐',price:9990000,def:70,bc:'#fbbf24',ac:'#f59e0b',desc:'방어+70%, 모든 능력치 최대',bonus:{spd:2,hp:300,dmg:10,regen:10,crit:30,dodge:25,lifesteal:8}},
  // ── 시즌패스 전용 갑옷 6종 (짝수월 Lv25) ──
  {id:'sp_armor_feb',name:'[시즌] 눈꽃 갑옷',icon:'❄️',price:0,def:70,bc:'#bae6fd',ac:'#7dd3fc',desc:'2월 시즌Lv.25. 방어+70%, 냉기오라, HP+200',bonus:{hp:200,coldAura:true,regen:5},spOnly:true,rarity:'legendary',spMonth:2,spLv:25},
  {id:'sp_armor_apr',name:'[시즌] 봄꽃 갑옷',icon:'🌸',price:0,def:72,bc:'#fbcfe8',ac:'#f9a8d4',desc:'4월 시즌Lv.25. 방어+72%, HP+250, 재생+8',bonus:{hp:250,regen:8,dodge:15},spOnly:true,rarity:'legendary',spMonth:4,spLv:25},
  {id:'sp_armor_jun',name:'[시즌] 파도 갑옷',icon:'🌊',price:0,def:74,bc:'#38bdf8',ac:'#0ea5e9',desc:'6월 시즌Lv.25. 방어+74%, 이동속도+1.5, 냉기오라',bonus:{spd:1.5,coldAura:true,hp:200},spOnly:true,rarity:'legendary',spMonth:6,spLv:25},
  {id:'sp_armor_aug',name:'[시즌] 용암 갑옷',icon:'🌋',price:0,def:76,bc:'#f97316',ac:'#ea580c',desc:'8월 시즌Lv.25. 방어+76%, 화염오라, 데미지+8',bonus:{dmg:8,fireAura:true,hp:300},spOnly:true,rarity:'legendary',spMonth:8,spLv:25},
  {id:'sp_armor_oct',name:'[시즌] 달빛 갑옷',icon:'🌙',price:0,def:78,bc:'#8b5cf6',ac:'#7c3aed',desc:'10월 시즌Lv.25. 방어+78%, 치명타+30%, 흡혈+8',bonus:{crit:30,lifesteal:8,dodge:20},spOnly:true,rarity:'mythic',spMonth:10,spLv:25},
  {id:'sp_armor_dec',name:'[시즌] 별빛 갑옷',icon:'⭐',price:0,def:82,bc:'#fbbf24',ac:'#f59e0b',desc:'12월 시즌Lv.25. 방어+82%, 모든 스탯 대폭 강화',bonus:{hp:400,dmg:12,crit:40,lifesteal:10,regen:12,spd:1},spOnly:true,rarity:'mythic',spMonth:12,spLv:25},
  {id:'sp_armor25',name:'[시즌] 성흔의 갑옷',rarity:'legendary',icon:'🌠',price:0,def:70,bc:'#6366f1',ac:'#4338ca',desc:'【시즌Lv.25 전용】방어+70%, HP+300, 재생+10, 회피+25%',bonus:{hp:300,regen:10,dodge:25},spOnly:true},
  {id:'sp_armor50',name:'[시즌] 별의 화신',rarity:'mythic',icon:'💫',price:0,def:88,bc:'#fbbf24',ac:'#f59e0b',desc:'【시즌Lv.50 전용】방어+88%, HP+999, 데미지+20, 치명타+50%, 흡혈+15, 재생+20',bonus:{hp:999,dmg:20,crit:50,lifesteal:15,regen:20},spOnly:true},
];

// ══════════════ 상점 ══════════════
const SITEMS=[
  {id:'sh_hp',name:'체력 강화',icon:'❤️',desc:'시작 HP +30',price:150,max:5,ld:lv=>`시작 HP +${lv*30}`},
  {id:'sh_spd',name:'부츠',icon:'👟',desc:'시작 속도 +0.3',price:120,max:5,ld:lv=>`시작 속도 +${(lv*.3).toFixed(1)}`},
  {id:'sh_dmg',name:'강화 탄약',icon:'🔥',desc:'시작 데미지 +1',price:200,max:5,ld:lv=>`시작 데미지 +${lv}`},
  {id:'sh_ammo',name:'탄약 벨트',icon:'🎒',desc:'최대 탄약 +4',price:100,max:5,ld:lv=>`최대 탄약 +${lv*4}`},
  {id:'sh_coin',name:'황금 손',icon:'🪙',desc:'클리어 보너스 +20',price:300,max:5,ld:lv=>`클리어 +${lv*20}코인`},
  {id:'sh_energy',name:'에너지 탱크',icon:'⚡',desc:'클리어 에너지 +50',price:400,max:5,ld:lv=>`클리어 +${50+lv*50}에너지`},
  {id:'sh_xp',name:'경험의 서',icon:'📖',desc:'특성 선택지 4개',price:400,max:1,ld:lv=>'선택지 4개'},
  {id:'sh_grenade',name:'시작 수류탄',icon:'💣',desc:'시작 수류탄 Lv.1',price:350,max:1,ld:lv=>'시작 수류탄'},
  {id:'sh_magnet',name:'시작 자기장',icon:'🌀',desc:'시작 자기장 Lv.1',price:350,max:1,ld:lv=>'시작 자기장'},
  {id:'sh_reload',name:'속사 부품',icon:'🔧',desc:'재장전 -0.5초',price:160,max:3,ld:lv=>`재장전 -${(lv*.5).toFixed(1)}초`},
  {id:'sh_regen',name:'회복의 반지',icon:'💍',desc:'패시브 HP 재생',price:250,max:3,ld:lv=>['3초마다 HP1','2초마다 HP2','1초마다 HP3'][lv-1]},
  {id:'sh_multi',name:'분리 총신',icon:'🎯',desc:'시작 멀티샷',price:500,max:1,ld:lv=>'시작 멀티샷'},
];
let curShopTab='items';
function stab(t,btn){curShopTab=t;document.querySelectorAll('.stab').forEach(b=>b.classList.remove('on'));btn.classList.add('on');renderShop();}
function renderShop(){
  updRes();const g=document.getElementById('sGrid');g.innerHTML='';
  if(curShopTab==='items'){
    SITEMS.forEach(item=>{
      const lv=shopLv[item.id]||0,mx=lv>=item.max,cost=item.price*(lv+1),cb=!mx&&coins>=cost;
      const d=document.createElement('div');d.className='si'+(mx?' mx':cb?' cb2':'');
      const ico=document.createElement('div');ico.className='sico';ico.textContent=item.icon;d.appendChild(ico);
      const nm=document.createElement('div');nm.className='snm';nm.textContent=item.name;d.appendChild(nm);
      const lvel=document.createElement('div');lvel.className='slv';lvel.textContent=mx?'✅MAX':('Lv.'+lv+'/'+item.max);d.appendChild(lvel);
      const ds=document.createElement('div');ds.className='sds';ds.textContent=lv>0?item.ld(lv):item.desc;d.appendChild(ds);
      if(!mx){
        const pr=document.createElement('div');pr.className='sprc';pr.style.color=cb?'#d97706':'#9ca3af';pr.textContent='🪙'+cost;d.appendChild(pr);
        const btn=document.createElement('button');btn.className='bybtn';btn.disabled=!cb;btn.textContent='구매';
        btn.onclick=()=>bySI(item.id);d.appendChild(btn);
      } else {
        const done=document.createElement('div');done.style.cssText='font-size:9px;color:#7c3aed;font-weight:700';done.textContent='완료';d.appendChild(done);
      }
      g.appendChild(d);
    });
  } else if(curShopTab==='armor'){
    ARMORS.filter(ar=>!ar.spOnly).forEach(ar=>{
      const ow=owned['ar_'+ar.id]||false,eq=eqArmor===ar.id,cb=!ow&&coins>=ar.price;
      const d=document.createElement('div');const arRarCls=ar.rarity?' rar-'+ar.rarity:'';d.className='si'+(eq?' own':cb?' cb2':ow?' own':'')+arRarCls;
      const ico=document.createElement('div');ico.className='sico';ico.textContent=ar.icon;d.appendChild(ico);
      const nm=document.createElement('div');nm.className='snm';nm.textContent=ar.name+'갑옷';d.appendChild(nm);
      const lvel=document.createElement('div');lvel.className='slv';lvel.textContent=eq?'✅장착중':ow?'보유':'미구매';d.appendChild(lvel);
      const ds=document.createElement('div');ds.className='sds';ds.textContent=ar.desc;d.appendChild(ds);
      if(!ow){
        const pr=document.createElement('div');pr.className='sprc';pr.style.color=cb?'#d97706':'#9ca3af';pr.textContent='🪙'+ar.price;d.appendChild(pr);
        const btn=document.createElement('button');btn.className='bybtn';btn.disabled=!cb;btn.textContent='구매';
        btn.onclick=()=>byAr(ar.id);d.appendChild(btn);
      } else {
        const done=document.createElement('div');done.style.cssText='font-size:9px;color:#7c3aed';done.textContent='장비탭에서 장착';d.appendChild(done);
      }
      g.appendChild(d);
    });
    // ── 시즌패스 전용 갑옷 섹션 ──
    const _saHdr=document.createElement('div');
    _saHdr.style.cssText='grid-column:1/-1;padding:6px 10px;background:linear-gradient(90deg,#1a0a3e,#1e1b4b);color:#fbbf24;border-radius:8px;font-size:11px;font-weight:800;text-align:center;margin-top:8px;border:1px solid #4c1d95;';
    _saHdr.textContent='🌟 시즌패스 전용 갑옷';g.appendChild(_saHdr);
    ARMORS.filter(ar=>ar.spOnly).forEach(ar=>{
      const ow=owned['ar_'+ar.id]||false;
      const rarCls=ar.rarity?' rar-'+ar.rarity:'';
      const d=document.createElement('div');
      d.className='si'+(ow?' own':'')+rarCls;
      if(!ow)d.style.cssText+='background:#0d0d1a;opacity:0.75;';
      const ico=document.createElement('div');ico.className='sico';ico.textContent=ar.icon;d.appendChild(ico);
      const nm=document.createElement('div');nm.className='snm';nm.textContent=ar.name;d.appendChild(nm);
      const ds=document.createElement('div');ds.className='sds';ds.textContent=ar.desc;d.appendChild(ds);
      if(ow){
        const done=document.createElement('div');done.style.cssText='font-size:9px;color:#fbbf24;font-weight:700;margin-top:3px;';done.textContent='✅ 보유 (장비탭에서 장착)';d.appendChild(done);
      } else {
        const lock=document.createElement('div');lock.style.cssText='font-size:9px;background:#1a0a3e;color:#c084fc;padding:3px 6px;border-radius:6px;border:1px solid #7c3aed;margin-top:3px;';
        const mStr=ar.spMonth?ar.spMonth+'월 시즌패스 Lv.'+ar.spLv+' 보상':'시즌패스 보상';
        lock.textContent='🌟 '+mStr;d.appendChild(lock);
      }
      g.appendChild(d);
    });
  } else if(curShopTab==='gameitem'){
    // 게임 아이템 상점
    const glitch=['ITEMS','아이템','SHOP'];
    const hdr=document.createElement('div');hdr.style.cssText='grid-column:1/-1;font-size:11px;color:#6b7280;margin-bottom:4px;';hdr.textContent='✨ 사용 가능 아이템 (장비탭에서 슬롯에 장착)';g.appendChild(hdr);
    ITEMS.filter(it=>!it.spOnly&&!it.achievement).forEach(it=>{
      const ow=ownedItems[it.id]||false;
      const cb=!ow&&coins>=it.price&&it.price>0;
      const rarCls=it.rarity?' rar-'+it.rarity:'';
      const d=document.createElement('div');
      d.className='si'+(ow?' own':cb?' cb2':'')+rarCls;
      const ico=document.createElement('div');ico.className='sico';ico.textContent=it.icon;d.appendChild(ico);
      const nm=document.createElement('div');nm.className='snm';
      const rBdg={rare:'<span style="font-size:7px;padding:1px 4px;border-radius:4px;background:#6366f1;color:#fff">RARE</span>',epic:'<span style="font-size:7px;padding:1px 4px;border-radius:4px;background:#a855f7;color:#fff">EPIC</span>',legendary:'<span style="font-size:7px;padding:1px 4px;border-radius:4px;background:#f59e0b;color:#fff">✨LEGEND</span>',mythic:'<span style="font-size:7px;padding:1px 4px;border-radius:4px;background:linear-gradient(90deg,#ec4899,#8b5cf6);color:#fff">🌈MYTHIC</span>'};
      nm.innerHTML=it.name+(rBdg[it.rarity]||'');d.appendChild(nm);
      const ds=document.createElement('div');ds.className='sds';ds.textContent=it.desc;d.appendChild(ds);
      if(ow){
        const done=document.createElement('div');done.style.cssText='font-size:9px;color:#4ade80;font-weight:700;margin-top:3px;';done.textContent='✅ 보유';d.appendChild(done);
      } else if(it.price>0){
        const pr=document.createElement('div');pr.className='sprc';pr.style.color=cb?'#d97706':'#9ca3af';pr.textContent='🪙'+it.price.toLocaleString();d.appendChild(pr);
        const btn=document.createElement('button');btn.className='bybtn';btn.disabled=!cb;btn.textContent='구매';
        btn.onclick=()=>{if(coins>=it.price&&!ownedItems[it.id]){coins-=it.price;ownedItems[it.id]=true;saveItems();sv('hd_c',coins);updRes();renderShop();}};d.appendChild(btn);
      } else {
        const lock=document.createElement('div');lock.style.cssText='font-size:9px;color:#9ca3af;margin-top:3px;';lock.textContent='업적으로 획득';d.appendChild(lock);
      }
      g.appendChild(d);
    });
    // 시즌 아이템 섹션
    const spHdr=document.createElement('div');spHdr.style.cssText='grid-column:1/-1;padding:6px 10px;background:linear-gradient(90deg,#1a0a3e,#7c2d12);color:#fbbf24;border-radius:8px;font-size:11px;font-weight:800;text-align:center;margin-top:8px;border:1px solid #92400e;';spHdr.textContent='🌟 시즌패스 전용 아이템';g.appendChild(spHdr);
    ITEMS.filter(it=>it.spOnly).forEach(it=>{
      const ow=ownedItems[it.id]||false;
      const d=document.createElement('div');d.className='si'+(ow?' own':'')+(it.rarity?' rar-'+it.rarity:'');
      if(!ow)d.style.cssText+='opacity:0.75;';
      const ico=document.createElement('div');ico.className='sico';ico.textContent=it.icon;d.appendChild(ico);
      const nm=document.createElement('div');nm.className='snm';nm.textContent=it.name;d.appendChild(nm);
      const ds=document.createElement('div');ds.className='sds';ds.textContent=it.desc;d.appendChild(ds);
      if(ow){const done=document.createElement('div');done.style.cssText='font-size:9px;color:#fbbf24;font-weight:700;margin-top:3px;';done.textContent='✅ 보유';d.appendChild(done);}
      else{const lock=document.createElement('div');lock.style.cssText='font-size:9px;background:#1a0a3e;color:#c084fc;padding:3px 6px;border-radius:6px;border:1px solid #7c3aed;margin-top:3px;';lock.textContent='🌟 '+(it.spMonth||'?')+'월 시즌 Lv.'+( it.spLv||15)+' 보상';d.appendChild(lock);}
      g.appendChild(d);
    });
  } else {
    Object.values(WEPS).filter(w=>!DFLT.includes(w.id)&&!w.spOnly&&!w.bossReward).forEach(w=>{
      const isBossWep=!!w.bossReward;
      const ow=owned[w.id]||false;
      const cb=!ow&&!isBossWep&&coins>=w.price;
      const d=document.createElement('div');
      const rarCls=w.rarity?' rar-'+w.rarity:'';
      d.className='si'+(ow?' own':cb?' cb2':'')+rarCls;
      if(isBossWep)d.style.cssText+='background:'+(ow?'#1a0a3c':'#0f0020')+';';
      const ico=document.createElement('div');ico.className='sico';ico.textContent=w.icon;d.appendChild(ico);
      const nm=document.createElement('div');nm.className='snm';nm.textContent=w.name;d.appendChild(nm);
      const lvel=document.createElement('div');lvel.className='slv';lvel.textContent=ow?'✅보유':'미구매';d.appendChild(lvel);
      const ds=document.createElement('div');ds.className='sds';ds.textContent=w.desc;d.appendChild(ds);
      // 이름에 희귀도 뱃지
      if(w.rarity){const bdg=document.createElement('span');bdg.style.cssText='font-size:7px;padding:1px 4px;border-radius:4px;margin-left:3px;font-weight:800;color:#fff;background:'+(w.rarity==='mythic'?'linear-gradient(90deg,#ec4899,#8b5cf6)':w.rarity==='legendary'?'#f59e0b':w.rarity==='epic'?'#a855f7':'#6366f1');bdg.textContent={rare:'RARE',epic:'EPIC',legendary:'✨LEGEND',mythic:'🌈MYTHIC'}[w.rarity]||'';nm.appendChild(bdg);}
      if(!ow){
        if(isBossWep){
          // 보스 클리어 잠금 표시
          const bossNames={sun:'THE SUN',machine:'MACHINE',bacteria:'BACTERIA',skeleton:'SKELETON',clock:'CLOCK',reanimation:'REANIMATION',kraken:'KRAKEN',symphony:'SYMPHONY'};
          const lockDiv=document.createElement('div');lockDiv.style.cssText='font-size:9px;background:#1e1b4b;color:#a78bfa;padding:4px 6px;border-radius:6px;border:1px solid #4c1d95;text-align:center;margin-top:3px;';
          lockDiv.textContent='🔒 '+( bossNames[w.bossReward]||w.bossReward)+' 처치 보상';d.appendChild(lockDiv);
        } else {
          const pr=document.createElement('div');pr.className='sprc';pr.style.color=cb?'#d97706':'#9ca3af';pr.textContent='🪙'+w.price.toLocaleString();d.appendChild(pr);
          const btn=document.createElement('button');btn.className='bybtn';btn.disabled=!cb;btn.textContent='구매';
          btn.onclick=()=>byWep(w.id);d.appendChild(btn);
        }
      } else {
        const done=document.createElement('div');done.style.cssText='font-size:9px;color:#4ade80;font-weight:700';done.textContent=isBossWep?'✅ 보스 클리어 획득!':'장비탭에서 장착';d.appendChild(done);
      }
      g.appendChild(d);
    });
    // ── 보스 클리어 보상 섹션 ──
    const _bHdr=document.createElement('div');
    _bHdr.style.cssText='grid-column:1/-1;padding:6px 10px;background:linear-gradient(90deg,#1e1b4b,#4c1d95);color:#c4b5fd;border-radius:8px;font-size:11px;font-weight:800;text-align:center;margin-top:8px;border:1px solid #6d28d9;';
    _bHdr.textContent='⚔️ 보스 클리어 전용 무기';g.appendChild(_bHdr);
    Object.values(WEPS).filter(w=>w.bossReward).forEach(w=>{
      const ow=owned[w.id]||false;
      const rarCls=w.rarity?' rar-'+w.rarity:'';
      const d=document.createElement('div');
      d.className='si'+(ow?' own':'')+rarCls;
      if(!ow)d.style.cssText+='background:#0f0020;';
      const ico=document.createElement('div');ico.className='sico';ico.textContent=w.icon;d.appendChild(ico);
      const nm=document.createElement('div');nm.className='snm';
      const _rBdg={'rare':'<span style="font-size:7px;padding:1px 4px;border-radius:4px;background:#6366f1;color:#fff">RARE</span>','epic':'<span style="font-size:7px;padding:1px 4px;border-radius:4px;background:#a855f7;color:#fff">EPIC</span>','legendary':'<span style="font-size:7px;padding:1px 4px;border-radius:4px;background:#f59e0b;color:#fff">✨LEGEND</span>','mythic':'<span style="font-size:7px;padding:1px 4px;border-radius:4px;background:linear-gradient(90deg,#ec4899,#8b5cf6);color:#fff">🌈MYTHIC</span>'};
      nm.innerHTML=w.name+(_rBdg[w.rarity]||'');d.appendChild(nm);
      const ds=document.createElement('div');ds.className='sds';ds.textContent=w.desc;d.appendChild(ds);
      const bossNames={sun:'THE SUN',machine:'MACHINE',bacteria:'BACTERIA',skeleton:'SKELETON',clock:'CLOCK',reanimation:'REANIMATION',kraken:'KRAKEN',symphony:'SYMPHONY'};
      if(ow){
        const done=document.createElement('div');done.style.cssText='font-size:9px;color:#4ade80;font-weight:700;margin-top:3px;';done.textContent='✅ 보스 클리어 획득';d.appendChild(done);
      } else {
        const lock=document.createElement('div');lock.style.cssText='font-size:9px;background:#1e1b4b;color:#a78bfa;padding:3px 6px;border-radius:6px;border:1px solid #4c1d95;margin-top:3px;';
        lock.textContent='🔒 '+(bossNames[w.bossReward]||w.bossReward)+' 처치 보상';d.appendChild(lock);
      }
      d.onclick=()=>{selWepId=ow?w.id:selWepId;renderShop();showWepDetail&&showWepDetail(w);};
      g.appendChild(d);
    });

    // ── 시즌패스 전용 무기 섹션 ──
    const _spHdr=document.createElement('div');
    _spHdr.style.cssText='grid-column:1/-1;padding:6px 10px;background:linear-gradient(90deg,#1a0a3e,#7c2d12);color:#fbbf24;border-radius:8px;font-size:11px;font-weight:800;text-align:center;margin-top:8px;border:1px solid #92400e;';
    _spHdr.textContent='🌟 시즌패스 전용 무기';g.appendChild(_spHdr);
    Object.values(WEPS).filter(w=>w.spOnly).forEach(w=>{
      const ow=owned[w.id]||false;
      const rarCls=w.rarity?' rar-'+w.rarity:'';
      const d=document.createElement('div');
      d.className='si'+(ow?' own':'')+rarCls;
      if(!ow)d.style.cssText+='background:#0d0d1a;opacity:0.7;';
      const ico=document.createElement('div');ico.className='sico';ico.textContent=w.icon;d.appendChild(ico);
      const nm=document.createElement('div');nm.className='snm';nm.textContent=w.name;d.appendChild(nm);
      const ds=document.createElement('div');ds.className='sds';ds.textContent=w.desc;d.appendChild(ds);
      if(ow){
        const done=document.createElement('div');done.style.cssText='font-size:9px;color:#fbbf24;font-weight:700;margin-top:3px;';done.textContent='✅ 보유 (장비탭에서 장착)';d.appendChild(done);
      } else {
        const lock=document.createElement('div');lock.style.cssText='font-size:9px;background:#1a0a3e;color:#c084fc;padding:3px 6px;border-radius:6px;border:1px solid #7c3aed;margin-top:3px;';
        const mStr=w.spMonth?w.spMonth+'월 시즌패스 Lv.'+w.spLv+' 보상':'시즌패스 보상';
        lock.textContent='🌟 '+mStr;d.appendChild(lock);
      }
      g.appendChild(d);
    });
  }
}
function bySI(id){const it=SITEMS.find(x=>x.id===id);if(!it)return;const lv=shopLv[id]||0,cost=it.price*(lv+1);if(coins<cost||lv>=it.max)return;coins-=cost;shopLv[id]=lv+1;saveAll();renderShop();}
function byAr(id){const a=ARMORS.find(x=>x.id===id);if(!a||coins<a.price)return;coins-=a.price;owned['ar_'+id]=true;saveAll();renderShop();}
function byWep(id){const w=WEPS[id];if(!w||coins<w.price)return;coins-=w.price;owned[id]=true;saveAll();renderShop();}
