// ══════════════ 특성 데이터 ══════════════
const PERK_DEF=[
  {id:'grenade',name:'수류탄',icon:'💣',col:'#f59e0b',isW:true,
   lvs:['5초마다 수류탄 1개 (범위40)','4초마다 2개','3초마다 3개','2.5초마다, 범위+20','2초마다 4개'],
   mg:'1.5초마다 6개, 보라색 메가수류탄 (범위100)'},
  {id:'magnet',name:'자기장',icon:'🌀',col:'#38bdf8',isW:true,
   lvs:['자기장(범위50) 안 좀비 1초마다 피해','범위+20','범위+20','범위+20','데미지 2배'],
   mg:'범위 대폭(180), 0.5초마다 피해, 보라색'},
  {id:'laser',name:'레이저',icon:'⚡',col:'#facc15',isW:true,
   lvs:['3초마다 전방 레이저 발사 (길이200)','길이+80, 0.5초 지속','관통 무제한','2초마다 발사','3갈래 분사'],
   mg:'360도 회전 레이저 — 쿨타임 0.8초'},
  {id:'missile',name:'유도탄',icon:'🚀',col:'#f43f5e',isW:true,
   lvs:['8초마다 가장 가까운 적에게 유도탄','6초, 데미지+1','4초, 2발 동시','3초, 폭발범위+15','2초, 3발, 관통'],
   mg:'1.5초마다 5발 동시 완전 추적'},
  {id:'freeze',name:'냉각탄',icon:'❄️',col:'#7dd3fc',isW:true,
   lvs:['탄환이 좀비 1초 둔화','둔화 2초','50% 확률 완전동결','냉각 폭발 추가','동결 1.5초, 피해 2배'],
   mg:'3초마다 전체화면 냉각 폭발'},
  {id:'chain',name:'체인번개',icon:'🌩️',col:'#818cf8',isW:true,
   lvs:['탄환 적중 시 2마리 연쇄','3마리','5마리, 데미지+0.5','피해감소 없음','8마리, 스턴'],
   mg:'체인 무한, 전기장 지속피해'},
  {id:'bomb_rain',name:'폭격',icon:'☄️',col:'#fb923c',isW:true,
   lvs:['7초마다 랜덤 폭탄 1개','6초, 2개','5초, 3개, 범위+20','4초, 5개','3초, 8개'],
   mg:'2초마다 화면 전체 포화폭격'},
  {id:'vampiric',name:'흡혈',icon:'🧛',col:'#c084fc',isW:true,
   lvs:['처치 시 HP 0.5 회복','HP 1','HP 2, 독 무효화','HP 3, 최대HP+20','HP 5'],
   mg:'HP 10 회복, 항상 흡혈'},
  {id:'homing',name:'추적탄',icon:'🎪',col:'#fbbf24',isW:true,
   lvs:['탄환이 적을 약하게 추적','추적 강도 증가','추적 범위 확대','탄환 속도+30%','3마리 연속 추적'],
   mg:'완벽 유도, 관통 5마리'},
  {id:'ricochet',name:'도탄',icon:'🎯',col:'#f472b6',isW:true,
   lvs:['탄환 벽 1회 반사','2회','좀비 관통 후 도탄','3회, 데미지 유지','5회, 범위 데미지'],
   mg:'무한 반사, 탄환수명 3배'},
  {id:'shield',name:'방어펄스',icon:'🛡️',col:'#34d399',isW:true,
   lvs:['5초마다 무적 방어막 0.3초','지속 0.5초','방어막이 좀비 밀어냄','쿨다운 4초','지속 1초, 반사 데미지'],
   mg:'항상 방어막 활성, 접촉 좀비 즉사'},
  {id:'cluster',name:'집속탄',icon:'🎆',col:'#fb7185',isW:true,
   lvs:['적중 시 파편 3개 분열','파편 5개','파편 데미지+1','파편도 분열','파편 8개, 폭발'],
   mg:'폭발탄 연속발사, 파편 무한분열'},
  {id:'time_warp',name:'시간감속',icon:'⏱️',col:'#a78bfa',isW:true,
   lvs:['10초마다 3초간 좀비 50% 감속','감속 4초','감속율 70%','쿨다운 8초','감속 중 데미지 2배'],
   mg:'7초마다 2초간 완전 시간 정지'},
  {id:'poison_cloud',name:'독구름',icon:'☁️',col:'#84cc16',isW:true,
   lvs:['이동경로에 독구름 생성','독 지속+1초','독 데미지 2배','구름 범위 확대','독구름 폭발 추가'],
   mg:'맵 전체를 독 안개로'},
  {id:'multi',name:'멀티샷',icon:'🎯',col:'#38bdf8',isW:true,
   lvs:['탄환 2발 발사','3발','4발','5발, 중앙탄 데미지+1','7발 부채꼴'],
   mg:'12발 전방위, 발사속도 최대'},
  {id:'decoy',name:'미끼드론',icon:'🤖',col:'#67e8f9',isW:true,
   lvs:['미끼드론 배치 (30초)','지속+15초','드론 2기','드론이 공격도 함','드론 3기, 자폭'],
   mg:'드론 5기, 무한지속, 최강화'},
  {id:'speed',name:'신속',icon:'👟',col:'#4ade80',isW:false,
   lvs:['이동속도 +0.5','이동속도 +0.5','이동속도 +0.5','이동속도 +0.5, 대시 추가','이동속도 +1, 대시 2회'],
   mg:'속도 최대화, 무적대시 3회'},
  {id:'armor_perk',name:'방어구',icon:'🛡️',col:'#60a5fa',isW:false,
   lvs:['피해 -10%','피해 -10%','피해 -10%','피해 -15%, 넉백 면역','피해 -20%'],
   mg:'피해 -60%, 강철피부'},
  {id:'hp_perk',name:'체력증가',icon:'❤️',col:'#f43f5e',isW:false,
   lvs:['최대HP +20','최대HP +20','최대HP +20, 즉시 회복','최대HP +30','최대HP +50, 전체 회복'],
   mg:'최대HP +200, 초당 1 재생'},
  {id:'regen',name:'회복력',icon:'💚',col:'#34d399',isW:false,
   lvs:['5초마다 HP 1 재생','4초마다 HP 1','3초마다 HP 2','2초마다 HP 3','1초마다 HP 5'],
   mg:'0.5초마다 HP 8, 치명상 1회 무시'},
  {id:'dmg_perk',name:'화력강화',icon:'🔥',col:'#f59e0b',isW:false,
   lvs:['모든 데미지 +1','모든 데미지 +1','모든 데미지 +2','모든 데미지 +2, 치명타 10%','모든 데미지 +3, 치명타 20%'],
   mg:'데미지 +15, 치명타 50%, 피해 3배'},
  {id:'reload_perk',name:'신속장전',icon:'🔄',col:'#a78bfa',isW:false,
   lvs:['재장전 -0.3초','재장전 -0.3초','재장전 -0.3초, 탄약+5','재장전 -0.5초','재장전 -1초, 탄약+10'],
   mg:'즉시 재장전, 무한 탄약'},
  {id:'dodge',name:'회피',icon:'🌪️',col:'#c084fc',isW:false,
   lvs:['5% 확률 피해 회피','10%','15%','20%, 회피 시 무적','30%'],
   mg:'50% 회피, 회피 시 반격 발동'},
  {id:'aoe',name:'폭발반경',icon:'💥',col:'#fb923c',isW:false,
   lvs:['모든 폭발 범위 +10','범위 +10','범위 +15','범위 +20, 연쇄 폭발','범위 +30'],
   mg:'폭발 범위 2배, 화염 잔여'},
  {id:'crit',name:'치명타',icon:'⚔️',col:'#f472b6',isW:false,
   lvs:['5% 확률 치명타 (2배)','10%','15%, 2.5배','20%','30%, 3배'],
   mg:'50% 치명타, 5배 피해, 스턴'},
  {id:'knockback',name:'넉백',icon:'💨',col:'#86efac',isW:false,
   lvs:['근접 공격 시 넉백','거리 +20','원거리도 넉백','거리 +30, 넉백 피해','날아간 좀비 폭발'],
   mg:'모든 공격 강력 넉백'},
  {id:'adrenaline',name:'아드레날린',icon:'⚡',col:'#facc15',isW:false,
   lvs:['HP 30% 이하 속도 +1','속도 +2','데미지 +2','HP 50% 이하 발동','속도 +3, 데미지 +3'],
   mg:'HP 80% 이하 모든 능력 최대화'},
  {id:'magcol',name:'수집자석',icon:'🧲',col:'#fbbf24',isW:false,
   lvs:['수집 범위 +30','범위 +30','범위 +50','점수 +15%','범위 +100, 점수 +30%'],
   mg:'전체 자동수집, 점수 2배'},
  {id:'clone',name:'분신',icon:'👥',col:'#818cf8',isW:false,
   lvs:['30초마다 3초간 분신 생성','지속 5초','분신도 공격','분신 2개','분신 3개 독립이동'],
   mg:'분신 5개, 항상 활성'},
  {id:'bestvest',name:'폭발조끼',icon:'🧨',col:'#f43f5e',isW:false,
   lvs:['피격 시 10% 반격 폭발','20%','범위 +20','30%, 피해 +5','40%, 기절'],
   mg:'모든 피격 시 반격 폭발'},
  {id:'vision',name:'탐지',icon:'👁️',col:'#67e8f9',isW:false,
   lvs:['미니맵 전적 표시','종류별 색상 구분','유령 항상 보임','보스 사전 경고','약점 표시'],
   mg:'전지전능 탐지'},
];

let perkLv={};
function rndPerks(){
  const extra=3+(shopLv['sh_xp']||0)+(pUpgLv['px']||0);
  const sh=[...PERK_DEF].sort(()=>Math.random()-.5);
  const out=[];
  for(const p of sh){const lv=perkLv[p.id]??-1;if(lv>=5)continue;out.push(p);if(out.length>=extra)break;}
  return out;
}

// ══════════════ 업그레이드 오버레이 ══════════════
function showUpgOv(){
  if(selMap.boss)return; // 보스맵: 클리어 보상 별도
  stopLoop();
  const coinMult=1+(pUpgLv['pc']||0)*.05,enMult=1+(pUpgLv['pe']||0)*.05;
  const ec=Math.floor((100+(shopLv['sh_coin']||0)*20)*coinMult*(partyBonus||1));
  const ee=Math.floor((100+(shopLv['sh_energy']||0)*30)*enMult*(partyBonus||1));
  coins+=ec;energy+=ee;saveAll();
  document.getElementById('uvw').textContent=`웨이브 ${wave} 완료 → 웨이브 ${wave+1}`;
  document.getElementById('ucn').textContent=`${ec} (총 ${coins})`;
  document.getElementById('uen').textContent=`${ee} (총 ${energy})`;
  updHUD();
  const perks=rndPerks();
  const con=document.getElementById('uCards');con.innerHTML='';
  if(!perks.length){
    const d=document.createElement('div');d.style.cssText='color:#fbbf24;font-size:16px;padding:24px;text-align:center;';
    d.textContent='🏆 모든 특성 최대레벨!';con.appendChild(d);
    setTimeout(()=>{hideUpgOv();nextWave();},2000);
    document.getElementById('upgOv').classList.add('on');return;
  }
  perks.forEach(p=>{
    const lv=perkLv[p.id]??-1,next=lv+1,isMG=next>=5;
    const desc=isMG?p.mg:p.lvs[next];
    const col=isMG?'#9333ea':p.col;const isNew=lv===-1;
    const d=document.createElement('div');d.className='ucard'+(isMG?' mg-card':'');
    d.innerHTML=`${isNew?'<div class="uc-new">NEW</div>':''}<div class="uc-ico">${p.icon}</div><div class="uc-nm">${p.name}</div><div class="uc-tp" style="background:${col}22;color:${col}">${p.isW?'무기 특성':'버프 특성'}</div><div class="uc-lv">${isNew?'신규':('Lv.'+(lv+1)+' →')} ${isMG?'<span style="color:#c084fc;font-weight:800">✨MG</span>':'Lv.'+(next+1)}</div><div class="uc-ds">${desc}</div>`;
    d.onclick=()=>{
      perkLv[p.id]=next;
      // 즉시 적용
      if(p.id==='speed')P.spd+=next===4?1.5:.5;
      if(p.id==='hp_perk'){const add=next<3?20:next===3?30:50;P.maxHp+=add;if(next===2)P.hp=Math.min(P.maxHp,P.hp+20);if(next===4)P.hp=P.maxHp;}
      if(p.id==='armor_perk')P.armor=(P.armor||0)+(next===3?15:next===4?20:10);
      if(p.id==='dmg_perk')P.dmgB=(P.dmgB||0)+(next<2?1:next<4?2:3);
      if(p.id==='aoe')P._aoeB=(P._aoeB||0)+[10,10,15,20,30][Math.min(next,4)];
      updBadges();hideUpgOv();nextWave();
    };
    con.appendChild(d);
  });
  document.getElementById('upgOv').classList.add('on');
}
function hideUpgOv(){document.getElementById('upgOv').classList.remove('on');}
function nextWave(){
  wave++;totalSpawn=calcWZ();
  spawnInt=selMap.challenge?60:Math.round(Math.max(15,80-wave*5)/(HARD_WAVE_MUL[selMap.id]||1));
  spawnedCnt=0;spawnT=0;betweenWave=false;
  setMsg(`🌊 웨이브 ${wave} 시작!`);setTimeout(()=>{if(running)setMsg('');},2000);
  startLoop();
}
function updBadges(){
  document.getElementById('perks').innerHTML=Object.entries(perkLv).map(([id,lv])=>{
    const p=PERK_DEF.find(x=>x.id===id);
    return p?`<div class="pb">${p.icon} ${p.name} ${lv>=5?'✨MG':'Lv.'+(lv+1)}</div>`:'';
  }).join('');
}
