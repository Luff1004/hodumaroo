// ══════════════ 맵 ══════════════
const MAPS=[
  // ── 일반 맵 (웨이브맵) ──
  {id:'city',name:'폐허 도시',desc:'입문 맵. 무너진 건물 사이 골목을 누비며 생존하라.',
   tags:[{t:'⭐ 초급',c:'#4ade80',bg:'#052e16'},{t:'권장:권총',c:'#93c5fd',bg:'#1e3a5f'}],
   type:'city',diff:1,boss:null,category:'wave'},
  {id:'forest',name:'저주받은 숲',desc:'나무들이 시야를 막는다. 유령·독 좀비 강화.',
   tags:[{t:'⭐⭐ 중급',c:'#fde68a',bg:'#431407'},{t:'권장:칼/샷건',c:'#d8b4fe',bg:'#2e1065'}],
   type:'forest',diff:2,boss:null,category:'wave'},
  {id:'lab',name:'바이오 실험실',desc:'연구소 복도·실험실·격리구역. 폭발·마법사 주의.',
   tags:[{t:'⭐⭐⭐ 고급',c:'#fca5a5',bg:'#450a0a'},{t:'ROB 25웨이브~',c:'#fff',bg:'#991b1b'}],
   type:'lab',diff:3,boss:null,category:'wave'},
  {id:'desert',name:'불타는 사막',desc:'정사각형 협곡 지형. 사방에서 거미·수퍼탱커 쏟아짐.',
   tags:[{t:'⭐⭐⭐⭐ 극악',c:'#fdba74',bg:'#7c2d12'},{t:'거미+수퍼탱커',c:'#fde68a',bg:'#431407'}],
   type:'desert',diff:4,boss:null,category:'wave'},
  {id:'space',name:'우주 전쟁',desc:'중력이 없는 우주. 수퍼탱커·ROB·악마가 동시에 쏟아진다.',
   tags:[{t:'☠️ 지옥',c:'#c4b5fd',bg:'#0f0020'},{t:'사막보다 어려움',c:'#fde68a',bg:'#1a0040'}],
   type:'space',diff:5,boss:null,category:'wave'},
  {id:'apocalypse',name:'아포칼립스',desc:'문명이 무너진 폐허. 수퍼좀비와 자폭좀비가 끝없이 몰려온다.',
   tags:[{t:'☢️ 재앙',c:'#fca5a5',bg:'#450a0a'},{t:'우주보다 어려움',c:'#fff',bg:'#7f1d1d'}],
   type:'apocalypse',diff:6,boss:null,category:'wave'},
  {id:'dimension_heart',name:'차원의 심장',desc:'현실이 뒤틀리는 균열지대. 차원 몬스터들이 공간을 찢고 나타난다.',
   tags:[{t:'💠 붕괴',c:'#c4b5fd',bg:'#2e1065'},{t:'아포칼립스보다 어려움',c:'#fff',bg:'#4c1d95'}],
   type:'dimension_heart',diff:7,boss:null,category:'wave'},
  {id:'eternal_space',name:'ETERNAL SPACE',desc:'끝없는 우주의 심연. 신조차 두려워하는 존재들이 도사린다.',
   tags:[{t:'🌠 절대 공포',c:'#fbbf24',bg:'#1a0a00'},{t:'최종 난이도',c:'#fff',bg:'#000'}],
   type:'eternal_space',diff:8,boss:null,category:'wave'},
  // ── 보스 맵 (난이도 순) ──
  {id:'sun',name:'THE SUN',desc:'불꽃 태양신. 불꽃 장벽과 나선 공격을 피해라.',
   tags:[{t:'🔥 HARD',c:'#fde68a',bg:'#7c2d12'},{t:'보스전',c:'#fff',bg:'#b45309'}],
   type:'sun',diff:6,boss:'sun',category:'boss'},
  {id:'machine',name:'THE MACHINE',desc:'강철 기계의 격자 레이저. 패턴을 외워라.',
   tags:[{t:'⚙️ VERY HARD',c:'#7dd3fc',bg:'#1e3a5f'},{t:'보스전',c:'#fff',bg:'#1e40af'}],
   type:'machine',diff:7,boss:'machine',category:'boss'},
  {id:'bacteria',name:'BACTERIA',desc:'거미 50마리 소환. 독이 맵을 뒤덮는다.',
   tags:[{t:'🦠 HELL',c:'#86efac',bg:'#052e16'},{t:'보스전',c:'#fff',bg:'#166534'}],
   type:'bacteria',diff:7.5,boss:'bacteria',category:'boss'},
  {id:'skeleton',name:'SKELETON',desc:'8방향 X자 뼈 240발. 중력 붕괴 주의.',
   tags:[{t:'💀 HELL',c:'#d1d5db',bg:'#111827'},{t:'보스전',c:'#fff',bg:'#374151'}],
   type:'skeleton',diff:8,boss:'skeleton',category:'boss'},
  {id:'clock',name:'CLOCK',desc:'8방향 시간 레이저. 시간 정지 폭탄 조합.',
   tags:[{t:'🕐 HELL',c:'#c4b5fd',bg:'#2e1065'},{t:'보스전',c:'#fff',bg:'#4c1d95'}],
   type:'clock',diff:8.5,boss:'clock',category:'boss'},
  {id:'reanimation',name:'REANIMATION',desc:'죽은 좀비 30마리 부활. 3연속 파동 반복.',
   tags:[{t:'☠️ SUPER HELL',c:'#f87171',bg:'#450a0a'},{t:'보스전',c:'#fff',bg:'#7f1d1d'}],
   type:'reanimation',diff:9,boss:'reanimation',category:'boss'},
  {id:'kraken',name:'KRAKEN',desc:'격자 촉수 + 흡수 방출. 심해에서 살아남아라.',
   tags:[{t:'🐙 EXTREME',c:'#22d3ee',bg:'#0c4a6e'},{t:'보스전',c:'#fff',bg:'#0369a1'}],
   type:'kraken',diff:9.5,boss:'kraken',category:'boss'},
  {id:'symphony',name:'FANTASTIC SYMPHONY',desc:'OMEGA FINALE. 피할 방법이 없다.',
   tags:[{t:'🎵 SSSSSSS EXTREME DEMON',c:'#fbbf24',bg:'#1a0a00'},{t:'최종 보스',c:'#fff',bg:'#7c2d12'}],
   type:'symphony',diff:10,boss:'symphony',category:'boss'},
  {id:'volcano',name:'VOLCANO',desc:'용암 웅덩이 + 화염 폭발. 발밑을 조심하라.',
   tags:[{t:'🌋 HELL',c:'#fdba74',bg:'#7c2d12'},{t:'보스전',c:'#fff',bg:'#c2410c'}],
   type:'volcano',diff:10.2,boss:'volcano',category:'boss'},
  {id:'frost',name:'FROST EMPRESS',desc:'절대 빙결의 여제. 얼음창과 블리자드를 버텨라.',
   tags:[{t:'🧊 SUPER HELL',c:'#bae6fd',bg:'#0c4a6e'},{t:'보스전',c:'#fff',bg:'#0369a1'}],
   type:'frost',diff:10.5,boss:'frost',category:'boss'},
  {id:'void',name:'VOID REAPER',desc:'차원 균열과 소멸장. 완전한 공허가 기다린다.',
   tags:[{t:'🌌 EXTREME',c:'#c4b5fd',bg:'#1e1b4b'},{t:'보스전',c:'#fff',bg:'#4c1d95'}],
   type:'void',diff:10.8,boss:'void',category:'boss'},
  // ── 챌린지 맵 (전용 몹, 웨이브당 100마리 고정 소환, 10웨이브 완주, 특성 선택 없음) ──
  {id:'robot_factory',name:'로봇 공장',desc:'끝없이 쏟아지는 전투 로봇들. 특성 선택 없이 웨이브당 100마리씩, 10웨이브를 버텨라.',
   tags:[{t:'🤖 CHALLENGE',c:'#93c5fd',bg:'#0f172a'},{t:'10웨이브·100마리',c:'#fff',bg:'#1e3a8a'}],
   type:'robot_factory',diff:11,boss:null,category:'challenge',challenge:true,waveLimit:10},
  {id:'underwater',name:'UNDER WATER',desc:'심해에 잠긴 좀비 바다. 오징어·물고기·불가사리·크라켄이 특성 선택 없이 웨이브당 100마리씩 몰려온다.',
   tags:[{t:'🐙 CHALLENGE',c:'#67e8f9',bg:'#083344'},{t:'10웨이브·100마리',c:'#fff',bg:'#155e75'}],
   type:'underwater',diff:11.5,boss:null,category:'challenge',challenge:true,waveLimit:10},
  {id:'hardest_world',name:'HARDEST OF THE WORLD',desc:'세상에서 가장 어려운 지옥. 촉수 괴물·에일리언·기생수·THE THING이 특성 선택 없이 웨이브당 100마리씩 덤빈다.',
   tags:[{t:'👽 CHALLENGE',c:'#f87171',bg:'#450a0a'},{t:'10웨이브·100마리',c:'#fff',bg:'#7f1d1d'}],
   type:'hardest_world',diff:12,boss:null,category:'challenge',challenge:true,waveLimit:10},
  // ── 디펜스 맵 (낮/밤 생존·채집·제작, 직업/무기/아이템/2배속 없음, 250일 클리어) ──
  {id:'danger_camp',name:'위험한 캠핑',desc:'정사각형의 광활한 야생. 낮엔 채집·제작, 밤엔 좀비로부터 캠프파이어를 지켜라. 250일차 생존이 목표다.',
   tags:[{t:'🏕 DEFENSE',c:'#a3e635',bg:'#1a2e05'},{t:'무기 없음·채집/제작',c:'#fde68a',bg:'#422006'}],
   type:'danger_camp',diff:1,boss:null,category:'defense',noJobs:true,noWeapons:true,noItems:true,noWaveSpeed:true},
  // ── 무한의 탑 (로그라이크. 3층마다 갈림길에서 문 선택, 끝없이 상승) ──
  {id:'tower',name:'무한의 탑',desc:'끝없이 오르는 시련의 탑. 3층마다 갈림길에서 전투·보물·휴식 중 하나를 골라 다음 층으로 향하라. 오를수록 강한 존재가 기다린다.',
   tags:[{t:'🗼 TOWER',c:'#c4b5fd',bg:'#1e1b4b'},{t:'무한 로그라이크',c:'#fde68a',bg:'#422006'}],
   type:'tower',diff:1,boss:null,category:'tower'},
];
let mapCategory='wave',mapIdx=0,selMap=MAPS[0];
function catMaps(){return MAPS.filter(m=>m.category===mapCategory).sort((a,b)=>(a.diff||0)-(b.diff||0));}
function openMapSelect(){
  mapCategory='wave';mapIdx=0;
  go('sMap');
  document.querySelectorAll('#sMap .stab').forEach(b=>b.classList.remove('on'));
  const firstTab=document.querySelector('#sMap .stab');if(firstTab)firstTab.classList.add('on');
}
function mapTab(cat,btn){
  mapCategory=cat;mapIdx=0;
  document.querySelectorAll('#sMap .stab').forEach(b=>b.classList.remove('on'));
  if(btn)btn.classList.add('on');
  const list=catMaps();
  selMap=list[0];
  drawMP();
}
function chMap(d){
  const list=catMaps();
  let ni=(mapIdx+d+list.length)%list.length;
  // bob 맵 잠금 확인
  if(list[ni].locked){
    const unlocked=lJ('hd_unlocked',{});
    if(!unlocked['bob']){
      setMapMsg('🔒 폐허도시 35웨이브 클리어 필요');
      return;
    }
  }
  mapIdx=ni;selMap=list[mapIdx];drawMP();
}
function setMapMsg(t){const el=document.getElementById('mapMsg');if(el){el.textContent=t;setTimeout(()=>{if(el.textContent===t)el.textContent='';},2500);}}
function confirmMapSelect(){
  if(selMap&&selMap.noWeapons){startGame();return;}
  go('sWeapon');
}
function drawMP(){
  const list=catMaps();
  const m=list[mapIdx]||list[0];
  if(!m)return;
  document.getElementById('mn').textContent=m.name;
  document.getElementById('md').textContent=m.desc;
  document.getElementById('mt').innerHTML=m.tags.map(t=>`<span class="mtag" style="color:${t.c};background:${t.bg}">${t.t}</span>`).join('');
  const c=document.getElementById('mpC'),x=c.getContext('2d');
  // 배경
  const BG={city:'#23201c',forest:'#0d1a0d',lab:'#0a0e1a',desert:'#1c1000',space:'#000010',
   apocalypse:'#2a0a00',dimension_heart:'#150826',eternal_space:'#050008',
   sun:'#1a0800',machine:'#060e1a',bacteria:'#041008',clock:'#0c0818',
   skeleton:'#101010',reanimation:'#1a0000',kraken:'#000d1a',symphony:'#0a0008',
   robot_factory:'#0f172a',underwater:'#083344',hardest_world:'#1a0000',
   volcano:'#2a0a00',frost:'#04202e',void:'#0f0620',danger_camp:'#0c1a08',tower:'#12102a'};
  x.fillStyle=BG[m.type]||'#111';x.fillRect(0,0,400,210);

  if(m.type==='city'){
    // 회색 건물들
    x.fillStyle='#666';
    [[10,10,65,180],[90,30,55,160],[165,5,70,190],[250,20,60,170],[325,10,65,185]].forEach(([a,b,w,h])=>{
      x.fillRect(a,b,w,h);
      x.fillStyle='#444';
      for(let f=0;f<5;f++){x.fillRect(a+8,b+15+f*30,12,18);if(a+w-28>a+25)x.fillRect(a+w-25,b+15+f*30,12,18);}
      x.fillStyle='#666';
    });
    // 도로 (회색)
    x.fillStyle='#888';x.fillRect(80,0,12,210);x.fillRect(160,0,12,210);x.fillRect(245,0,12,210);x.fillRect(320,0,12,210);
  } else if(m.type==='forest'){
    // 단순 나무 군집
    [[60,80],[140,60],[220,90],[310,70],[380,85],[30,160],[100,150],[200,170],[290,155],[360,165]].forEach(([tx,ty])=>{
      x.fillStyle='#5c3d1a';x.fillRect(tx-5,ty+22,10,28);
      x.fillStyle='#1a5c1a';x.beginPath();x.arc(tx,ty,28,0,Math.PI*2);x.fill();
      x.fillStyle='#226622';x.beginPath();x.arc(tx-6,ty-8,18,0,Math.PI*2);x.fill();
    });
  } else if(m.type==='lab'){
    // 넓은 실험실 구조
    x.strokeStyle='rgba(30,120,200,0.5)';x.lineWidth=1.5;
    x.fillStyle='rgba(20,60,120,0.1)';
    [[8,8,384,90],[8,108,175,90],[220,108,175,90]].forEach(([a,b,w,h])=>{x.fillRect(a,b,w,h);x.strokeRect(a,b,w,h);});
    x.fillStyle='rgba(30,80,160,0.15)';x.fillRect(190,98,20,110);x.strokeRect(190,98,20,110);
    x.fillStyle='rgba(50,150,220,0.2)';x.fillRect(20,20,60,30);x.fillRect(180,20,60,30);x.fillRect(300,20,60,30);
    x.fillStyle='rgba(220,30,30,0.15)';x.fillRect(8,108,175,90);
    x.fillStyle='rgba(200,0,0,0.5)';x.font='8px sans-serif';x.textAlign='center';x.fillText('⚠ BIO',95,158);
  } else if(m.type==='desert'){
    // 사막 + 바위 장애물
    x.fillStyle='rgba(180,130,50,0.15)';x.fillRect(0,0,400,210);
    [[50,40,55,50],[160,80,60,55],[280,30,50,60],[350,120,55,50],
     [80,150,50,45],[200,160,60,40],[310,170,55,45],[30,95,45,50]].forEach(([a,b,w,h])=>{
      x.fillStyle='#4a3000';x.fillRect(a,b,w,h);
      x.fillStyle='#6b4700';x.fillRect(a+4,b+4,w-8,h-8);
      x.strokeStyle='#3a2000';x.lineWidth=1.5;x.strokeRect(a,b,w,h);
    });
    x.strokeStyle='rgba(180,130,50,0.2)';x.lineWidth=1;
    for(let sy=30;sy<210;sy+=40){x.beginPath();x.moveTo(0,sy);x.lineTo(400,sy);x.stroke();}
  } else if(m.type==='space'){
    x.fillStyle='#000010';x.fillRect(0,0,400,210);
    x.fillStyle='rgba(255,255,255,0.7)';
    for(let i=0;i<80;i++){const sx=(i*137+50)%400,sy=(i*89+20)%210;x.beginPath();x.arc(sx,sy,i%5===0?2:1,0,Math.PI*2);x.fill();}
    x.fillStyle='#3a3a4a';
    [[60,60,30],[200,120,35],[320,50,28],[100,170,32],[280,160,30]].forEach(([ax,ay,ar])=>{
      x.beginPath();for(let i=0;i<8;i++){const a=i/8*Math.PI*2;x.lineTo(ax+Math.cos(a)*ar*(0.7+Math.sin(ax+i)*.3),ay+Math.sin(a)*ar*(0.7+Math.sin(ay+i)*.3));}x.closePath();x.fill();x.strokeStyle='#5a5a6a';x.lineWidth=1.5;x.stroke();
    });
    x.fillStyle='rgba(80,0,120,0.15)';x.fillRect(0,0,400,210);
    x.fillStyle='rgba(255,255,255,0.1)';x.font='bold 14px sans-serif';x.textAlign='center';x.fillText('우주 전쟁',200,195);
  } else if(m.type==='apocalypse'){
    x.fillStyle='#2a0a00';x.fillRect(0,0,400,210);
    const ag=x.createRadialGradient(200,105,10,200,105,160);ag.addColorStop(0,'rgba(220,38,38,0.25)');ag.addColorStop(1,'transparent');x.fillStyle=ag;x.fillRect(0,0,400,210);
    x.fillStyle='#3a1a0a';
    [[30,60,60,150],[110,90,50,120],[220,50,55,160],[300,100,60,110]].forEach(([a,b,w,h])=>{x.fillRect(a,b,w,h);x.strokeStyle='#1a0800';x.lineWidth=2;x.strokeRect(a,b,w,h);});
    x.fillStyle='rgba(120,20,20,0.4)';for(let i=0;i<10;i++){const sx=Math.random()*400,sy=Math.random()*210;x.beginPath();x.arc(sx,sy,3+Math.random()*4,0,Math.PI*2);x.fill();}
    x.fillStyle='rgba(255,255,255,0.12)';x.font='bold 14px sans-serif';x.textAlign='center';x.fillText('아포칼립스',200,195);
  } else if(m.type==='dimension_heart'){
    x.fillStyle='#150826';x.fillRect(0,0,400,210);
    const dg=x.createRadialGradient(200,105,5,200,105,140);dg.addColorStop(0,'rgba(168,85,247,0.4)');dg.addColorStop(1,'transparent');x.fillStyle=dg;x.fillRect(0,0,400,210);
    for(let i=0;i<8;i++){x.strokeStyle=`rgba(196,181,253,${0.2+Math.random()*0.3})`;x.lineWidth=2;const a=i/8*Math.PI*2;x.beginPath();x.moveTo(200,105);x.lineTo(200+Math.cos(a)*90,105+Math.sin(a)*90);x.stroke();}
    x.fillStyle='rgba(255,255,255,0.15)';x.font='bold 13px sans-serif';x.textAlign='center';x.fillText('차원의 심장',200,195);
  } else if(m.type==='eternal_space'){
    x.fillStyle='#050008';x.fillRect(0,0,400,210);
    x.fillStyle='rgba(255,255,255,0.8)';
    for(let i=0;i<120;i++){const sx=(i*151+30)%400,sy=(i*83+10)%210;x.beginPath();x.arc(sx,sy,i%7===0?2.5:1,0,Math.PI*2);x.fill();}
    const eg=x.createRadialGradient(200,105,5,200,105,150);eg.addColorStop(0,'rgba(251,191,36,0.25)');eg.addColorStop(1,'transparent');x.fillStyle=eg;x.fillRect(0,0,400,210);
    x.fillStyle='rgba(255,255,255,0.15)';x.font='bold 13px sans-serif';x.textAlign='center';x.fillText('ETERNAL SPACE',200,195);
  } else if(m.type==='sun'){
    x.fillStyle='#1a0500';x.fillRect(0,0,400,210);
    const grad=x.createRadialGradient(200,105,20,200,105,100);
    grad.addColorStop(0,'rgba(251,191,36,0.6)');grad.addColorStop(0.5,'rgba(239,68,68,0.3)');grad.addColorStop(1,'transparent');
    x.fillStyle=grad;x.fillRect(0,0,400,210);
    x.beginPath();x.arc(200,105,45,0,Math.PI*2);x.fillStyle='#fbbf24';x.fill();
    x.strokeStyle='#f59e0b';x.lineWidth=3;x.stroke();
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2;x.strokeStyle='rgba(251,191,36,0.5)';x.lineWidth=2;x.beginPath();x.moveTo(200+Math.cos(a)*52,105+Math.sin(a)*52);x.lineTo(200+Math.cos(a)*85,105+Math.sin(a)*85);x.stroke();}
    x.fillStyle='rgba(255,255,255,0.15)';x.font='bold 14px sans-serif';x.textAlign='center';x.fillText('THE SUN',200,195);
  } else if(m.type==='machine'){
    x.fillStyle='#060e1a';x.fillRect(0,0,400,210);
    x.strokeStyle='rgba(59,130,246,0.5)';x.lineWidth=1;
    for(let i=0;i<5;i++)for(let j=0;j<4;j++){x.strokeRect(i*80+2,j*52+2,76,48);x.fillStyle='rgba(30,58,138,0.2)';x.fillRect(i*80+2,j*52+2,76,48);}
    x.strokeStyle='rgba(96,165,250,0.4)';x.lineWidth=1.5;
    for(let i=0;i<8;i++){x.beginPath();x.moveTo(Math.random()*400,0);x.lineTo(Math.random()*400,210);x.stroke();}
    x.fillStyle='rgba(255,255,255,0.12)';x.font='bold 13px sans-serif';x.textAlign='center';x.fillText('THE MACHINE',200,105);
  } else if(m.type==='bacteria'){
    x.fillStyle='#041008';x.fillRect(0,0,400,210);
    const cols=['rgba(34,197,94,0.5)','rgba(74,222,128,0.3)','rgba(22,163,74,0.4)'];
    for(let i=0;i<18;i++){x.fillStyle=cols[i%3];x.beginPath();const bx=30+Math.random()*340,by=20+Math.random()*170,br=8+Math.random()*20;x.arc(bx,by,br,0,Math.PI*2);x.fill();}
    x.fillStyle='rgba(255,255,255,0.1)';x.font='bold 14px sans-serif';x.textAlign='center';x.fillText('BACTERIA',200,195);
  } else if(m.type==='clock'){
    x.fillStyle='#0c0818';x.fillRect(0,0,400,210);
    x.beginPath();x.arc(200,105,80,0,Math.PI*2);x.fillStyle='rgba(109,40,217,0.2)';x.fill();x.strokeStyle='rgba(139,92,246,0.7)';x.lineWidth=3;x.stroke();
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2-Math.PI/2;x.fillStyle='#c4b5fd';x.beginPath();x.arc(200+Math.cos(a)*65,105+Math.sin(a)*65,4,0,Math.PI*2);x.fill();}
    x.strokeStyle='#fff';x.lineWidth=3;x.lineCap='round';
    x.beginPath();x.moveTo(200,105);x.lineTo(200,40);x.stroke();
    x.beginPath();x.moveTo(200,105);x.lineTo(255,105);x.stroke();
    x.fillStyle='rgba(255,255,255,0.1)';x.font='bold 13px sans-serif';x.textAlign='center';x.fillText('CLOCK',200,195);
  } else if(m.type==='skeleton'){
    x.fillStyle='#101010';x.fillRect(0,0,400,210);
    x.fillStyle='rgba(209,213,219,0.15)';
    x.beginPath();x.arc(200,90,40,0,Math.PI*2);x.fill();
    x.fillRect(185,130,30,40);x.fillRect(178,170,20,25);x.fillRect(202,170,20,25);
    x.fillStyle='rgba(0,0,0,0.8)';x.beginPath();x.arc(185,88,8,0,Math.PI*2);x.fill();x.beginPath();x.arc(215,88,8,0,Math.PI*2);x.fill();
    x.fillStyle='rgba(255,255,255,0.08)';x.font='bold 14px sans-serif';x.textAlign='center';x.fillText('SKELETON',200,195);
  } else if(m.type==='reanimation'){
    x.fillStyle='#1a0000';x.fillRect(0,0,400,210);
    const rg=x.createRadialGradient(200,105,0,200,105,120);rg.addColorStop(0,'rgba(239,68,68,0.3)');rg.addColorStop(1,'transparent');x.fillStyle=rg;x.fillRect(0,0,400,210);
    for(let i=0;i<8;i++){x.fillStyle='rgba(239,68,68,0.4)';x.beginPath();x.arc(30+i*50,80+Math.sin(i)*40,15,0,Math.PI*2);x.fill();}
    x.fillStyle='rgba(255,255,255,0.1)';x.font='bold 13px sans-serif';x.textAlign='center';x.fillText('REANIMATION',200,195);
  } else if(m.type==='kraken'){
    x.fillStyle='#000d1a';x.fillRect(0,0,400,210);
    const kg=x.createRadialGradient(200,105,10,200,105,100);kg.addColorStop(0,'rgba(8,145,178,0.3)');kg.addColorStop(1,'transparent');x.fillStyle=kg;x.fillRect(0,0,400,210);
    for(let i=0;i<6;i++){x.strokeStyle='rgba(22,163,74,0.4)';x.lineWidth=6;x.beginPath();const sx=200+Math.cos(i/6*Math.PI*2)*30,sy=105+Math.sin(i/6*Math.PI*2)*30;x.moveTo(sx,sy);x.bezierCurveTo(sx+(Math.random()-.5)*80,sy+(Math.random()-.5)*80,sx+(Math.random()-.5)*80,sy+(Math.random()-.5)*80,10+Math.random()*380,10+Math.random()*190);x.stroke();}
    x.fillStyle='rgba(255,255,255,0.1)';x.font='bold 13px sans-serif';x.textAlign='center';x.fillText('KRAKEN',200,195);
  } else if(m.type==='symphony'){
    x.fillStyle='#0a0008';x.fillRect(0,0,400,210);
    const sg=x.createRadialGradient(200,105,5,200,105,140);sg.addColorStop(0,'rgba(251,191,36,0.5)');sg.addColorStop(0.4,'rgba(167,139,250,0.3)');sg.addColorStop(0.8,'rgba(239,68,68,0.2)');sg.addColorStop(1,'transparent');x.fillStyle=sg;x.fillRect(0,0,400,210);
    for(let i=0;i<20;i++){x.strokeStyle=`hsla(${i*18},80%,70%,0.3)`;x.lineWidth=1;x.beginPath();x.arc(200,105,20+i*6,i*.5,i*.5+Math.PI*1.4);x.stroke();}
    x.fillStyle='rgba(255,255,255,0.12)';x.font='bold 11px sans-serif';x.textAlign='center';x.fillText('FANTASTIC SYMPHONY',200,195);
  } else if(m.type==='robot_factory'){
    x.fillStyle='#0f172a';x.fillRect(0,0,400,210);
    x.strokeStyle='rgba(147,197,253,0.4)';x.lineWidth=1;
    for(let i=0;i<6;i++){x.beginPath();x.moveTo(i*70,0);x.lineTo(i*70,210);x.stroke();}
    for(let i=0;i<4;i++){x.beginPath();x.moveTo(0,i*55);x.lineTo(400,i*55);x.stroke();}
    [[80,60],[200,100],[320,60],[140,150],[280,150]].forEach(([rx,ry])=>{
      x.fillStyle='#334155';x.fillRect(rx-16,ry-20,32,40);x.strokeStyle='#93c5fd';x.lineWidth=2;x.strokeRect(rx-16,ry-20,32,40);
      x.fillStyle='#ef4444';x.beginPath();x.arc(rx,ry-8,4,0,Math.PI*2);x.fill();
    });
    x.fillStyle='rgba(147,197,253,0.15)';x.font='bold 13px sans-serif';x.textAlign='center';x.fillText('ROBOT FACTORY',200,195);
  } else if(m.type==='underwater'){
    x.fillStyle='#083344';x.fillRect(0,0,400,210);
    const ug=x.createRadialGradient(200,105,10,200,105,160);ug.addColorStop(0,'rgba(103,232,249,0.2)');ug.addColorStop(1,'transparent');x.fillStyle=ug;x.fillRect(0,0,400,210);
    for(let i=0;i<10;i++){x.strokeStyle='rgba(103,232,249,0.25)';x.lineWidth=1.5;const bx=(i*47+20)%400;x.beginPath();x.moveTo(bx,210);x.quadraticCurveTo(bx+10,140,bx-6,60);x.stroke();}
    x.fillStyle='rgba(167,139,250,0.5)';x.beginPath();x.ellipse(280,90,20,26,0,0,Math.PI*2);x.fill();
    x.fillStyle='rgba(255,255,255,0.1)';x.font='bold 13px sans-serif';x.textAlign='center';x.fillText('UNDER WATER',200,195);
  } else if(m.type==='hardest_world'){
    x.fillStyle='#1a0000';x.fillRect(0,0,400,210);
    const hg=x.createRadialGradient(200,105,5,200,105,150);hg.addColorStop(0,'rgba(239,68,68,0.35)');hg.addColorStop(1,'transparent');x.fillStyle=hg;x.fillRect(0,0,400,210);
    for(let i=0;i<7;i++){x.strokeStyle='rgba(124,45,146,0.4)';x.lineWidth=4;const sx=200+Math.cos(i/7*Math.PI*2)*20,sy=105+Math.sin(i/7*Math.PI*2)*20;x.beginPath();x.moveTo(sx,sy);x.bezierCurveTo(sx+(Math.random()-.5)*90,sy+(Math.random()-.5)*90,sx+(Math.random()-.5)*90,sy+(Math.random()-.5)*90,20+Math.random()*360,20+Math.random()*170);x.stroke();}
    x.fillStyle='rgba(255,255,255,0.12)';x.font='bold 12px sans-serif';x.textAlign='center';x.fillText('HARDEST OF THE WORLD',200,195);
  } else if(m.type==='danger_camp'){
    // 정사각형 야생 지형 미리보기: 중앙 캠프파이어 + 나무/바위 + 가장자리 눈/사막 힌트
    x.fillStyle='#0c1a08';x.fillRect(0,0,400,210);
    x.fillStyle='rgba(74,222,128,0.08)';x.fillRect(40,5,320,200);
    x.strokeStyle='rgba(163,230,53,0.35)';x.lineWidth=2;x.strokeRect(40,5,320,200);
    // 좌상단 눈 지형 힌트
    x.fillStyle='rgba(224,242,254,0.15)';x.fillRect(0,0,70,60);
    // 우하단 사막 지형 힌트
    x.fillStyle='rgba(217,119,6,0.18)';x.fillRect(330,150,70,60);
    // 나무 군집
    [[90,60],[140,100],[300,50],[260,140],[110,160]].forEach(([tx,ty])=>{
      x.fillStyle='#3d2a12';x.fillRect(tx-4,ty+16,8,20);
      x.fillStyle='#1a5c1a';x.beginPath();x.arc(tx,ty,20,0,Math.PI*2);x.fill();
    });
    // 바위
    [[200,80,16],[230,150,14]].forEach(([rx,ry,rr])=>{x.fillStyle='#555';x.beginPath();x.arc(rx,ry,rr,0,Math.PI*2);x.fill();});
    // 캠프파이어(중앙, 반경 표시)
    x.strokeStyle='rgba(251,191,36,0.5)';x.lineWidth=2;x.beginPath();x.arc(200,105,38,0,Math.PI*2);x.stroke();
    x.fillStyle='#f97316';x.beginPath();x.arc(200,105,10,0,Math.PI*2);x.fill();
    x.fillStyle='#fde68a';x.beginPath();x.arc(200,105,5,0,Math.PI*2);x.fill();
    x.fillStyle='rgba(255,255,255,0.15)';x.font='bold 13px sans-serif';x.textAlign='center';x.fillText('위험한 캠핑',200,195);
  } else if(m.type==='tower'){
    // 무한의 탑: 위로 갈수록 좁아지는 탑 실루엣 + 창문 불빛 + 계단
    x.fillStyle='#12102a';x.fillRect(0,0,400,210);
    const tg=x.createRadialGradient(200,60,10,200,60,160);tg.addColorStop(0,'rgba(196,181,253,0.25)');tg.addColorStop(1,'transparent');x.fillStyle=tg;x.fillRect(0,0,400,210);
    x.fillStyle='#2e2a55';
    x.beginPath();
    x.moveTo(160,210);x.lineTo(175,10);x.lineTo(225,10);x.lineTo(240,210);
    x.closePath();x.fill();
    x.strokeStyle='#4c1d95';x.lineWidth=2;x.stroke();
    x.fillStyle='rgba(251,191,36,0.55)';
    for(let i=0;i<8;i++){const wy=190-i*22,ww=26-i*1.6;x.fillRect(200-ww/2,wy,ww,10);}
    x.strokeStyle='rgba(196,181,253,0.4)';x.lineWidth=1.5;
    for(let sy=205;sy>15;sy-=16){x.beginPath();x.moveTo(160+(210-sy)/195*15,sy);x.lineTo(240-(210-sy)/195*15,sy);x.stroke();}
    x.fillStyle='rgba(255,255,255,0.15)';x.font='bold 13px sans-serif';x.textAlign='center';x.fillText('무한의 탑',200,195);
  } else if(m.type==='volcano'){
    x.fillStyle='#2a0a00';x.fillRect(0,0,400,210);
    const vg=x.createRadialGradient(200,105,10,200,105,140);vg.addColorStop(0,'rgba(249,115,22,0.5)');vg.addColorStop(0.5,'rgba(220,38,38,0.25)');vg.addColorStop(1,'transparent');x.fillStyle=vg;x.fillRect(0,0,400,210);
    x.beginPath();x.arc(200,105,42,0,Math.PI*2);const vg2=x.createRadialGradient(200,105,5,200,105,42);vg2.addColorStop(0,'#fed7aa');vg2.addColorStop(.6,'#f97316');vg2.addColorStop(1,'#7c2d12');x.fillStyle=vg2;x.fill();
    x.strokeStyle='#ea580c';x.lineWidth=3;x.stroke();
    [[80,60,10],[320,70,8],[60,160,9],[340,150,7]].forEach(([bx,by,br])=>{x.fillStyle='rgba(249,115,22,0.5)';x.beginPath();x.arc(bx,by,br,0,Math.PI*2);x.fill();});
    x.fillStyle='rgba(255,255,255,0.15)';x.font='bold 14px sans-serif';x.textAlign='center';x.fillText('VOLCANO',200,195);
  } else if(m.type==='frost'){
    x.fillStyle='#04202e';x.fillRect(0,0,400,210);
    const fg=x.createRadialGradient(200,105,10,200,105,140);fg.addColorStop(0,'rgba(224,242,254,0.4)');fg.addColorStop(0.5,'rgba(125,211,252,0.25)');fg.addColorStop(1,'transparent');x.fillStyle=fg;x.fillRect(0,0,400,210);
    x.beginPath();x.arc(200,105,40,0,Math.PI*2);const fg2=x.createRadialGradient(200,105,5,200,105,40);fg2.addColorStop(0,'#f0f9ff');fg2.addColorStop(.6,'#7dd3fc');fg2.addColorStop(1,'#0369a1');x.fillStyle=fg2;x.fill();
    x.strokeStyle='#38bdf8';x.lineWidth=3;x.stroke();
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2;x.strokeStyle='rgba(224,242,254,0.5)';x.lineWidth=2;x.beginPath();x.moveTo(200+Math.cos(a)*48,105+Math.sin(a)*48);x.lineTo(200+Math.cos(a)*75,105+Math.sin(a)*75);x.stroke();}
    x.fillStyle='rgba(255,255,255,0.15)';x.font='bold 14px sans-serif';x.textAlign='center';x.fillText('FROST EMPRESS',200,195);
  } else if(m.type==='void'){
    x.fillStyle='#0f0620';x.fillRect(0,0,400,210);
    const vg3=x.createRadialGradient(200,105,5,200,105,150);vg3.addColorStop(0,'rgba(196,181,253,0.35)');vg3.addColorStop(0.5,'rgba(124,58,237,0.25)');vg3.addColorStop(1,'transparent');x.fillStyle=vg3;x.fillRect(0,0,400,210);
    for(let r=15;r<90;r+=18){x.strokeStyle='rgba(124,58,237,0.3)';x.lineWidth=2;x.beginPath();x.arc(200,105,r,0,Math.PI*1.6);x.stroke();}
    x.beginPath();x.arc(200,105,38,0,Math.PI*2);const vg4=x.createRadialGradient(200,105,3,200,105,38);vg4.addColorStop(0,'#c4b5fd');vg4.addColorStop(.6,'#7c3aed');vg4.addColorStop(1,'#1e1b4b');x.fillStyle=vg4;x.fill();
    x.fillStyle='#000';x.beginPath();x.arc(200,105,14,0,Math.PI*2);x.fill();
    x.fillStyle='rgba(255,255,255,0.15)';x.font='bold 14px sans-serif';x.textAlign='center';x.fillText('VOID REAPER',200,195);
  }
  // 플레이어 점
  x.fillStyle='#1D9E75';x.beginPath();x.arc(200,195,7,0,Math.PI*2);x.fill();
  x.strokeStyle='#085041';x.lineWidth=1.5;x.stroke();
}
