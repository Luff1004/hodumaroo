// ══════════════ 맵 ══════════════
const MAPS=[
  // ── 일반 맵 ──
  {id:'city',name:'폐허 도시',desc:'입문 맵. 무너진 건물 사이 골목을 누비며 생존하라.',
   tags:[{t:'⭐ 초급',c:'#4ade80',bg:'#052e16'},{t:'권장:권총',c:'#93c5fd',bg:'#1e3a5f'}],
   type:'city',diff:1,boss:null},
  {id:'forest',name:'저주받은 숲',desc:'나무들이 시야를 막는다. 유령·독 좀비 강화.',
   tags:[{t:'⭐⭐ 중급',c:'#fde68a',bg:'#431407'},{t:'권장:칼/샷건',c:'#d8b4fe',bg:'#2e1065'}],
   type:'forest',diff:2,boss:null},
  {id:'lab',name:'바이오 실험실',desc:'연구소 복도·실험실·격리구역. 폭발·마법사 주의.',
   tags:[{t:'⭐⭐⭐ 고급',c:'#fca5a5',bg:'#450a0a'},{t:'ROB 25웨이브~',c:'#fff',bg:'#991b1b'}],
   type:'lab',diff:3,boss:null},
  {id:'desert',name:'불타는 사막',desc:'정사각형 협곡 지형. 사방에서 거미·수퍼탱커 쏟아짐.',
   tags:[{t:'⭐⭐⭐⭐ 극악',c:'#fdba74',bg:'#7c2d12'},{t:'거미+수퍼탱커',c:'#fde68a',bg:'#431407'}],
   type:'desert',diff:4,boss:null},
  {id:'space',name:'우주 전쟁',desc:'중력이 없는 우주. 수퍼탱커·ROB·악마가 동시에 쏟아진다.',
   tags:[{t:'☠️ 지옥',c:'#c4b5fd',bg:'#0f0020'},{t:'사막보다 어려움',c:'#fde68a',bg:'#1a0040'}],
   type:'space',diff:5,boss:null},
  // ── 보스 맵 (난이도 순) ──
  {id:'sun',name:'THE SUN',desc:'불꽃 태양신. 불꽃 장벽과 나선 공격을 피해라.',
   tags:[{t:'🔥 HARD',c:'#fde68a',bg:'#7c2d12'},{t:'보스전',c:'#fff',bg:'#b45309'}],
   type:'sun',diff:6,boss:'sun'},
  {id:'machine',name:'THE MACHINE',desc:'강철 기계의 격자 레이저. 패턴을 외워라.',
   tags:[{t:'⚙️ VERY HARD',c:'#7dd3fc',bg:'#1e3a5f'},{t:'보스전',c:'#fff',bg:'#1e40af'}],
   type:'machine',diff:7,boss:'machine'},
  {id:'bacteria',name:'BACTERIA',desc:'거미 50마리 소환. 독이 맵을 뒤덮는다.',
   tags:[{t:'🦠 HELL',c:'#86efac',bg:'#052e16'},{t:'보스전',c:'#fff',bg:'#166534'}],
   type:'bacteria',diff:7.5,boss:'bacteria'},
  {id:'skeleton',name:'SKELETON',desc:'8방향 X자 뼈 240발. 중력 붕괴 주의.',
   tags:[{t:'💀 HELL',c:'#d1d5db',bg:'#111827'},{t:'보스전',c:'#fff',bg:'#374151'}],
   type:'skeleton',diff:8,boss:'skeleton'},
  {id:'clock',name:'CLOCK',desc:'8방향 시간 레이저. 시간 정지 폭탄 조합.',
   tags:[{t:'🕐 HELL',c:'#c4b5fd',bg:'#2e1065'},{t:'보스전',c:'#fff',bg:'#4c1d95'}],
   type:'clock',diff:8.5,boss:'clock'},
  {id:'reanimation',name:'REANIMATION',desc:'죽은 좀비 30마리 부활. 3연속 파동 반복.',
   tags:[{t:'☠️ SUPER HELL',c:'#f87171',bg:'#450a0a'},{t:'보스전',c:'#fff',bg:'#7f1d1d'}],
   type:'reanimation',diff:9,boss:'reanimation'},
  {id:'kraken',name:'KRAKEN',desc:'격자 촉수 + 흡수 방출. 심해에서 살아남아라.',
   tags:[{t:'🐙 EXTREME',c:'#22d3ee',bg:'#0c4a6e'},{t:'보스전',c:'#fff',bg:'#0369a1'}],
   type:'kraken',diff:9.5,boss:'kraken'},
  {id:'symphony',name:'FANTASTIC SYMPHONY',desc:'OMEGA FINALE. 피할 방법이 없다.',
   tags:[{t:'🎵 SSSSSSS EXTREME DEMON',c:'#fbbf24',bg:'#1a0a00'},{t:'최종 보스',c:'#fff',bg:'#7c2d12'}],
   type:'symphony',diff:10,boss:'symphony'},];
let mapIdx=0,selMap=MAPS[0];
function chMap(d){
  let ni=(mapIdx+d+MAPS.length)%MAPS.length;
  // bob 맵 잠금 확인
  if(MAPS[ni].locked){
    const unlocked=lJ('hd_unlocked',{});
    if(!unlocked['bob']){
      setMapMsg('🔒 폐허도시 35웨이브 클리어 필요');
      return;
    }
  }
  mapIdx=ni;selMap=MAPS[mapIdx];drawMP();
}
function setMapMsg(t){const el=document.getElementById('mapMsg');if(el){el.textContent=t;setTimeout(()=>el.textContent='',2500);}}
function drawMP(){
  const m=MAPS[mapIdx];
  document.getElementById('mn').textContent=m.name;
  document.getElementById('md').textContent=m.desc;
  document.getElementById('mt').innerHTML=m.tags.map(t=>`<span class="mtag" style="color:${t.c};background:${t.bg}">${t.t}</span>`).join('');
  const c=document.getElementById('mpC'),x=c.getContext('2d');
  // 배경
  const BG={city:'#23201c',forest:'#0d1a0d',lab:'#0a0e1a',desert:'#1c1000',
   sun:'#1a0800',machine:'#060e1a',bacteria:'#041008',clock:'#0c0818',
   skeleton:'#101010',reanimation:'#1a0000',kraken:'#000d1a',symphony:'#0a0008'};
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
    // 큰 방 2개 + 복도
    [[8,8,384,90],[8,108,175,90],[220,108,175,90]].forEach(([a,b,w,h])=>{x.fillRect(a,b,w,h);x.strokeRect(a,b,w,h);});
    x.fillStyle='rgba(30,80,160,0.15)';x.fillRect(190,98,20,110);x.strokeRect(190,98,20,110);
    // 실험 장비
    x.fillStyle='rgba(50,150,220,0.2)';x.fillRect(20,20,60,30);x.fillRect(180,20,60,30);x.fillRect(300,20,60,30);
    x.fillStyle='rgba(220,30,30,0.15)';x.fillRect(8,108,175,90);
    x.fillStyle='rgba(200,0,0,0.5)';x.font='8px sans-serif';x.textAlign='center';x.fillText('⚠ BIO',95,158);
  } else if(m.type==='desert'){
    // 사막 + 바위 장애물
    x.fillStyle='rgba(180,130,50,0.15)';x.fillRect(0,0,400,210);
    // 바위들
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
  } else if(m.type==='sun'){
    x.fillStyle='#1a0500';x.fillRect(0,0,400,210);
    const grad=x.createRadialGradient(200,105,20,200,105,100);
    grad.addColorStop(0,'rgba(251,191,36,0.6)');grad.addColorStop(0.5,'rgba(239,68,68,0.3)');grad.addColorStop(1,'transparent');
    x.fillStyle=grad;x.fillRect(0,0,400,210);
    // 태양
    x.beginPath();x.arc(200,105,45,0,Math.PI*2);x.fillStyle='#fbbf24';x.fill();
    x.strokeStyle='#f59e0b';x.lineWidth=3;x.stroke();
    // 광선
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2;x.strokeStyle='rgba(251,191,36,0.5)';x.lineWidth=2;x.beginPath();x.moveTo(200+Math.cos(a)*52,105+Math.sin(a)*52);x.lineTo(200+Math.cos(a)*85,105+Math.sin(a)*85);x.stroke();}
    x.fillStyle='rgba(255,255,255,0.15)';x.font='bold 14px sans-serif';x.textAlign='center';x.fillText('THE SUN',200,195);
  } else if(m.type==='machine'){
    x.fillStyle='#060e1a';x.fillRect(0,0,400,210);
    // 기계 패널
    x.strokeStyle='rgba(59,130,246,0.5)';x.lineWidth=1;
    for(let i=0;i<5;i++)for(let j=0;j<4;j++){x.strokeRect(i*80+2,j*52+2,76,48);x.fillStyle='rgba(30,58,138,0.2)';x.fillRect(i*80+2,j*52+2,76,48);}
    // 회로
    x.strokeStyle='rgba(96,165,250,0.4)';x.lineWidth=1.5;
    for(let i=0;i<8;i++){x.beginPath();x.moveTo(Math.random()*400,0);x.lineTo(Math.random()*400,210);x.stroke();}
    x.fillStyle='rgba(255,255,255,0.12)';x.font='bold 13px sans-serif';x.textAlign='center';x.fillText('THE MACHINE',200,105);
  } else if(m.type==='bacteria'){
    x.fillStyle='#041008';x.fillRect(0,0,400,210);
    // 세포들
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
    // 해골 실루엣
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
    // 촉수
    for(let i=0;i<6;i++){x.strokeStyle='rgba(22,163,74,0.4)';x.lineWidth=6;x.beginPath();const sx=200+Math.cos(i/6*Math.PI*2)*30,sy=105+Math.sin(i/6*Math.PI*2)*30;x.moveTo(sx,sy);x.bezierCurveTo(sx+(Math.random()-.5)*80,sy+(Math.random()-.5)*80,sx+(Math.random()-.5)*80,sy+(Math.random()-.5)*80,10+Math.random()*380,10+Math.random()*190);x.stroke();}
    x.fillStyle='rgba(255,255,255,0.1)';x.font='bold 13px sans-serif';x.textAlign='center';x.fillText('KRAKEN',200,195);
  } else if(m.type==='symphony'){
    x.fillStyle='#0a0008';x.fillRect(0,0,400,210);
    const sg=x.createRadialGradient(200,105,5,200,105,140);sg.addColorStop(0,'rgba(251,191,36,0.5)');sg.addColorStop(0.4,'rgba(167,139,250,0.3)');sg.addColorStop(0.8,'rgba(239,68,68,0.2)');sg.addColorStop(1,'transparent');x.fillStyle=sg;x.fillRect(0,0,400,210);
    for(let i=0;i<20;i++){x.strokeStyle=`hsla(${i*18},80%,70%,0.3)`;x.lineWidth=1;x.beginPath();x.arc(200,105,20+i*6,i*.5,i*.5+Math.PI*1.4);x.stroke();}
    x.fillStyle='rgba(255,255,255,0.12)';x.font='bold 11px sans-serif';x.textAlign='center';x.fillText('FANTASTIC SYMPHONY',200,195);
  }
  // 플레이어 점
  x.fillStyle='#1D9E75';x.beginPath();x.arc(200,195,7,0,Math.PI*2);x.fill();
  x.strokeStyle='#085041';x.lineWidth=1.5;x.stroke();
}

