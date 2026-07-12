// ══════════════ 영구 업그레이드 ══════════════
const PUGR=[
  {id:'ph',name:'체력 회복속도',icon:'💗',d:lv=>`재생 ${(lv*.1).toFixed(1)}/초`,b:500,i:500,m:10},
  {id:'ps',name:'이동속도',icon:'💨',d:lv=>`속도 +${(lv*.2).toFixed(1)}`,b:600,i:600,m:10},
  {id:'pd',name:'총 데미지',icon:'🔥',d:lv=>`데미지 +${lv}`,b:800,i:700,m:10},
  {id:'pmh',name:'최대 체력',icon:'❤️',d:lv=>`최대HP +${lv*20}`,b:700,i:600,m:10},
  {id:'pa',name:'방어력',icon:'🛡️',d:lv=>`피해감소 ${lv*2}%`,b:900,i:800,m:10},
  {id:'pr',name:'재장전 속도',icon:'🔄',d:lv=>`재장전 -${(lv*.15).toFixed(2)}초`,b:500,i:500,m:10},
  {id:'pc',name:'코인 획득',icon:'🪙',d:lv=>`코인 +${lv*5}%`,b:1000,i:800,m:10},
  {id:'pe',name:'에너지 획득',icon:'⚡',d:lv=>`에너지 +${lv*5}%`,b:1000,i:800,m:10},
  {id:'pct',name:'치명타',icon:'⚔️',d:lv=>`치명타 ${lv*2}%`,b:1200,i:900,m:10},
  {id:'pl',name:'아이템 운',icon:'🍀',d:lv=>`HP아이템 +${lv*2}개`,b:800,i:700,m:5},
  {id:'px',name:'특성 선택지',icon:'📖',d:lv=>`선택지 +${lv}개`,b:2000,i:1500,m:3},
  {id:'pxp',name:'경험치 증폭',icon:'✨',d:lv=>`점수 +${lv*10}%`,b:300,i:250,m:10},
  {id:'pbm',name:'폭발 범위',icon:'💥',d:lv=>`폭발 +${lv*10}px`,b:400,i:350,m:8},
  {id:'pbs',name:'발사 쿨다운',icon:'⚡',d:lv=>`자동화기 쿨다운 -${lv*5}%`,b:500,i:450,m:8},
  {id:'psk',name:'스킬 쿨다운',icon:'🔄',d:lv=>`스킬 쿨다운 -${lv*8}%`,b:600,i:500,m:8},
  {id:'pmv',name:'탄속 증가',icon:'🚀',d:lv=>`탄환 속도 +${lv*15}%`,b:350,i:300,m:10},
  {id:'pah',name:'자동 회복',icon:'💊',d:lv=>`${lv}초마다 HP+1 자동 회복`,b:800,i:700,m:5},
  {id:'pcp',name:'코인 보호',icon:'🛡️',d:lv=>`사망 시 코인 ${lv*20}% 보존`,b:500,i:400,m:5},
  {id:'pmg',name:'마그넷 범위',icon:'🧲',d:lv=>`수집 범위 +${lv*40}px`,b:300,i:250,m:8},
];
function gpC(u){return u.b+(pUpgLv[u.id]||0)*u.i;}
function renderUpg(){
  updRes();const g=document.getElementById('uGrid');g.innerHTML='';
  PUGR.forEach(u=>{
    const lv=pUpgLv[u.id]||0,mx=lv>=u.m,cost=gpC(u),cb=!mx&&energy>=cost;
    const d=document.createElement('div');d.className='ui2'+(mx?' mx':cb?' cb3':'');
    const ico=document.createElement('div');ico.className='uico2';ico.textContent=u.icon;d.appendChild(ico);
    const nm=document.createElement('div');nm.className='unm2';nm.textContent=u.name;d.appendChild(nm);
    const lvel=document.createElement('div');lvel.className='ulv2';lvel.textContent=mx?'✅MAX':('Lv.'+lv+'/'+u.m);d.appendChild(lvel);
    const ds=document.createElement('div');ds.className='uds2';ds.textContent=lv>0?u.d(lv):'업그레이드하여 효과 획득';d.appendChild(ds);
    if(!mx){
      const pr=document.createElement('div');pr.className='uprc';pr.textContent='⚡'+cost;d.appendChild(pr);
      const btn=document.createElement('button');btn.className='ugbtn';btn.disabled=!cb;btn.textContent='강화';
      btn.onclick=()=>byUpg(u.id);d.appendChild(btn);
    }
    g.appendChild(d);
  });
}
function byUpg(id){const u=PUGR.find(x=>x.id===id);if(!u)return;const lv=pUpgLv[id]||0,cost=gpC(u);if(energy<cost||lv>=u.m)return;energy-=cost;pUpgLv[id]=lv+1;saveAll();renderUpg();if(typeof updateRPButton==='function')updateRPButton();}

// ══════════════ 장비 탭 ══════════════
let selEqId=null;
const WLC=[300,600,1000,1500,2000],ALC=[200,500,900,1400,2000];
function renderEquip(){
  if(isDreamMode){renderDreamEquip();return;}
  if(curEquipTab==='item'){renderEquipItemTab();return;}
  const list=document.getElementById('eList');list.innerHTML='';let has=false;
  if(curEquipTab==='armor'){
    ARMORS.forEach(ar=>{
      if(!owned['ar_'+ar.id])return;has=true;
      const lv=arLv[ar.id]||0,isEq=eqArmor===ar.id,eid='ar_'+ar.id;
      const _rar=ar.rarity||'';
      const _rarCls=_rar?(' rarity-'+_rar):'';
      const d=document.createElement('div');d.className='ei'+(isEq?' eq':'')+(selEqId===eid?' sel':'')+_rarCls;
      const _rarBadge={'rare':'<span class="rbadge rare">RARE</span>','epic':'<span class="rbadge epic">EPIC</span>','legendary':'<span class="rbadge legendary">✨ LEGEND</span>','mythic':'<span class="rbadge mythic">🌈 MYTHIC</span>'};
      d.innerHTML=`<div class="eico">${ar.icon}</div><div><div class="enm">${ar.name}갑옷 ${_rarBadge[_rar]||''}</div><div class="elv">${lv>0?'Lv.'+lv:''} ${isEq?'<span style="font-size:8px;background:#14532d;color:#4ade80;padding:1px 5px;border-radius:5px">장착중</span>':''}</div>${enchantStatText('ar_'+ar.id,'armor')}</div>`;
      d.onclick=()=>{selEqId=eid;renderEquip();showED('ar',ar.id);};list.appendChild(d);
    });
  } else {
    Object.keys(WEPS).filter(id=>owned[id]&&!DFLT.includes(id)).forEach(id=>{
      has=true;const w=WEPS[id],lv=wepLv[id]||0,isEq=eqWepId===id,eid='wep_'+id;
      const _rar=w.rarity||'';
      const _rarCls=_rar?(' rarity-'+_rar):'';
      const d=document.createElement('div');d.className='ei'+(isEq?' eq':'')+(selEqId===eid?' sel':'')+_rarCls;
      const _rarBadge2={'rare':'<span class="rbadge rare">RARE</span>','epic':'<span class="rbadge epic">EPIC</span>','legendary':'<span class="rbadge legendary">✨ LEGEND</span>','mythic':'<span class="rbadge mythic">🌈 MYTHIC</span>'};
      d.innerHTML=`<div class="eico">${w.icon}</div><div><div class="enm">${w.name} ${_rarBadge2[_rar]||''}</div><div class="elv">${lv>0?'Lv.'+lv:''} ${isEq?'<span style="font-size:8px;background:#14532d;color:#4ade80;padding:1px 5px;border-radius:5px">장착중</span>':''}</div>${enchantStatText(id,'wep')}</div>`;
      d.onclick=()=>{selEqId=eid;renderEquip();showED('wep',id);};list.appendChild(d);
    });
  }
  if(!has)list.innerHTML='<div style="color:#6b7280;font-size:12px;padding:24px;text-align:center;">상점에서 장비를 구매하세요</div>';
  drawPP();
}
function showED(type,id){
  document.getElementById('eDet').style.display='block';
  const wB=document.getElementById('edW'),uB=document.getElementById('edU');
  if(type==='ar'){
    const ar=ARMORS.find(x=>x.id===id),lv=arLv[id]||0,cost=lv<5?ALC[lv]:null;
    document.getElementById('edNm').textContent=ar.icon+' '+ar.name+'갑옷'+(lv>0?' Lv.'+lv:'');
    document.getElementById('edDs').textContent=ar.desc;
    wB.textContent=eqArmor===id?'🔓 해제':'✅ 장착';
    wB.onclick=()=>{eqArmor=eqArmor===id?null:id;saveAll();renderEquip();};
    uB.textContent=cost?`⚡ 강화 (${cost})`:'✅ 최대레벨';uB.disabled=!cost||energy<cost;
    uB.onclick=()=>{if(!cost||energy<cost)return;energy-=cost;arLv[id]=(lv+1);saveAll();updRes();renderEquip();showED('ar',id);};
  } else {
    const w=WEPS[id],lv=wepLv[id]||0,cost=lv<5?WLC[lv]:null;
    document.getElementById('edNm').textContent=w.icon+' '+w.name+(lv>0?' Lv.'+lv:'');
    document.getElementById('edDs').textContent=w.desc;
    wB.textContent=eqWepId===id?'🔓 해제':'✅ 장착';
    wB.onclick=()=>{eqWepId=eqWepId===id?'minigun':id;saveAll();renderEquip();checkDreamUnlock();renderWepSel();};
    uB.textContent=cost?`⚡ 강화 (${cost})`:'✅ MG레벨';uB.disabled=!cost||energy<cost;
    uB.onclick=()=>{if(!cost||energy<cost)return;energy-=cost;wepLv[id]=(lv+1);saveAll();updRes();renderEquip();showED('wep',id);};
  }
}
function drawPP(){
  const c=document.getElementById('ppC'),x=c.getContext('2d');
  x.clearRect(0,0,120,160);x.fillStyle='#0f172a';x.fillRect(0,0,120,160);
  const ar=ARMORS.find(a=>a.id===eqArmor);
  const bc=ar?ar.bc:'#1D9E75',ac=ar?ar.ac:null;
  x.fillStyle=bc;x.beginPath();x.ellipse(60,90,20,28,0,0,Math.PI*2);x.fill();
  if(ac){x.fillStyle=ac;x.globalAlpha=.6;x.beginPath();x.ellipse(60,90,22,30,0,0,Math.PI*2);x.fill();x.globalAlpha=1;x.strokeStyle=ac;x.lineWidth=2.5;x.beginPath();x.ellipse(60,90,22,30,0,0,Math.PI*2);x.stroke();}
  x.fillStyle=bc;x.beginPath();x.arc(60,54,16,0,Math.PI*2);x.fill();
  if(ac){x.strokeStyle=ac;x.lineWidth=2;x.beginPath();x.arc(60,54,18,0,Math.PI*2);x.stroke();}
  x.fillStyle='#fff';x.beginPath();x.arc(54,51,4,0,Math.PI*2);x.fill();x.beginPath();x.arc(66,51,4,0,Math.PI*2);x.fill();
  x.fillStyle='#1f2937';x.beginPath();x.arc(55,51,2,0,Math.PI*2);x.fill();x.beginPath();x.arc(67,51,2,0,Math.PI*2);x.fill();
  x.fillStyle=ac||bc;x.fillRect(36,76,10,24);x.fillRect(74,76,10,24);
  x.fillStyle=bc;x.fillRect(50,116,13,28);x.fillRect(57,116,13,28);
  if(ar){
    // 특수 갑옷 효과
    const t2=Date.now();
    if(ar.id==='rainbow'){
      // 무지개 갑옷: 무지개 오라
      for(let i=0;i<12;i++){
        const a=i/12*Math.PI*2+t2/800;
        const rx=60+Math.cos(a)*30, ry=80+Math.sin(a)*40;
        x.fillStyle=`hsla(${i*30},90%,60%,0.7)`;
        x.beginPath();x.arc(rx,ry,4,0,Math.PI*2);x.fill();
      }
      // 무지개 테두리
      const grad=x.createLinearGradient(30,40,90,130);
      for(let i=0;i<7;i++)grad.addColorStop(i/6,`hsl(${i*50},90%,60%)`);
      x.strokeStyle=grad;x.lineWidth=4;x.beginPath();x.arc(60,80,45,0,Math.PI*2);x.stroke();
    }
    if(ar.id==='celestial'||ar.id==='angel'){
      // 천상/천사: 날개 그리기
      x.save();x.globalAlpha=0.7;
      x.fillStyle=ar.id==='angel'?'#fef9c3':'#c4b5fd';
      // 왼쪽 날개
      x.beginPath();x.moveTo(38,70);x.quadraticCurveTo(5,50,10,100);x.quadraticCurveTo(15,80,38,90);x.closePath();x.fill();
      x.beginPath();x.moveTo(36,75);x.quadraticCurveTo(0,60,8,115);x.quadraticCurveTo(14,95,36,98);x.closePath();x.fill();
      // 오른쪽 날개
      x.beginPath();x.moveTo(82,70);x.quadraticCurveTo(115,50,110,100);x.quadraticCurveTo(105,80,82,90);x.closePath();x.fill();
      x.beginPath();x.moveTo(84,75);x.quadraticCurveTo(120,60,112,115);x.quadraticCurveTo(106,95,84,98);x.closePath();x.fill();
      // 후광
      x.strokeStyle=ar.id==='angel'?'#fbbf24':'#a78bfa';x.lineWidth=3;x.globalAlpha=0.6;
      x.beginPath();x.ellipse(60,30,20,8,0,0,Math.PI*2);x.stroke();
      x.restore();
    }
    if(ar.id==='nightmare'){
      // 악몽: 어두운 오라
      x.save();x.globalAlpha=0.5;
      for(let i=0;i<8;i++){const a=i/8*Math.PI*2+t2/600;x.fillStyle=`hsla(270,80%,30%,0.5)`;x.beginPath();x.arc(60+Math.cos(a)*35,80+Math.sin(a)*45,5,0,Math.PI*2);x.fill();}
      x.restore();
    }
    if(ar.id==='phoenix'){
      // 불사조: 화염 날개
      x.save();x.globalAlpha=0.65;
      const fc=`hsl(${20+Math.sin(t2/300)*15},100%,55%)`;
      x.fillStyle=fc;
      x.beginPath();x.moveTo(38,70);x.quadraticCurveTo(8,40,18,90);x.quadraticCurveTo(22,75,38,85);x.closePath();x.fill();
      x.fillStyle=`hsl(${40+Math.sin(t2/200)*10},100%,60%)`;
      x.beginPath();x.moveTo(82,70);x.quadraticCurveTo(112,40,102,90);x.quadraticCurveTo(98,75,82,85);x.closePath();x.fill();
      x.restore();
    }
    if(ar.id==='omnipotent'||ar.id==='sp_armor50'){
      // 전능/별의화신: 황금 오라+별
      x.save();
      for(let i=0;i<6;i++){const a=i/6*Math.PI*2+t2/500;x.fillStyle='rgba(251,191,36,0.8)';x.beginPath();x.arc(60+Math.cos(a)*38,80+Math.sin(a)*48,5,0,Math.PI*2);x.fill();}
      x.strokeStyle='#fbbf24';x.lineWidth=3;x.globalAlpha=0.4;
      x.beginPath();x.arc(60,80,52,0,Math.PI*2);x.stroke();
      x.restore();
    }
    x.fillStyle='#c4b5fd';x.font='bold 9px sans-serif';x.textAlign='center';x.fillText(ar.name,60,152);
  }
  else{x.fillStyle='#6b7280';x.font='9px sans-serif';x.textAlign='center';x.fillText('갑옷 없음',60,152);}
  document.getElementById('pLabel').textContent=ar?ar.icon+' '+ar.name:'기본 복장';
}
