// ══════════════ 무한의 탑: 갈림길(문) 선택 ══════════════
// 기존 웨이브/특성 시스템(showUpgOv/nextWave/calcWZ 등)을 그대로 재사용하고,
// 3층마다 이 갈림길 UI만 추가로 끼워넣는다.

function showTowerDoorChoice(){
  stopLoop();
  const el=document.getElementById('towerDoorFloor');
  if(el)el.textContent=`${wave}층 클리어! 다음 층으로 가는 문을 고르세요`;
  const ov=document.getElementById('towerDoorOv');
  if(ov)ov.style.display='flex';
}
function hideTowerDoorChoice(){
  const ov=document.getElementById('towerDoorOv');
  if(ov)ov.style.display='none';
}
function chooseTowerDoor(kind){
  hideTowerDoorChoice();
  if(kind==='combat'){
    const bonus=100+wave*5;
    coins+=bonus;saveAll();updHUD();
    showUpgOv();
  } else if(kind==='treasure'){
    const c=200+wave*10, e=80+wave*5;
    coins+=c;energy+=e;saveAll();updHUD();
    setMsg(`💰 보물의 문: 코인 +${c}, 에너지 +${e}`);
    setTimeout(()=>{if(running||betweenWave)setMsg('');},2000);
    nextWave();
  } else if(kind==='rest'){
    if(P)P.hp=P.maxHp;
    updHUD();
    setMsg('💤 휴식의 문: 체력을 완전히 회복했습니다!');
    setTimeout(()=>{if(running||betweenWave)setMsg('');},2000);
    nextWave();
  }
}
