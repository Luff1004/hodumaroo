// ════════════════════════════════════════════
// ══ 플레이어 레벨 + 차원의 별(스타드롭) 뽑기 시스템 ══
// ════════════════════════════════════════════

// ── 플레이어 레벨/경험치 (시즌패스와 별개, 무한 레벨) ──
let plData = lJ('hd_pl', {lv:1, xp:0, stardrops:0});
function getPLXPForLv(lv){ return Math.floor(150 + lv*70 + Math.pow(lv,1.5)*6); }
const PL_XP_MULT = 0.4; // 레벨업 속도 하향(전체 XP 획득량 축소)
function addPlayerXP(xp){
  if(!xp||xp<0||!isFinite(xp)) return;
  plData.xp += xp*PL_XP_MULT;
  let leveledUp=false;
  let guard=0;
  const crossedLevels=[];
  while(guard++<1000){
    const needed=getPLXPForLv(plData.lv);
    if(!needed||needed<=0||!isFinite(needed)) break;
    if(plData.xp>=needed){ plData.xp-=needed; plData.lv++; plData.stardrops=(plData.stardrops||0)+1; leveledUp=true; crossedLevels.push(plData.lv); }
    else break;
  }
  sv('hd_pl', plData);
  renderPlayerLevelBar();
  if(leveledUp){
    const bar=document.getElementById('plLevelBar');
    if(bar){
      bar.classList.remove('pl-levelup-flash');
      void bar.offsetWidth;
      bar.classList.add('pl-levelup-flash');
    }
    crossedLevels.forEach(lv=>{ if(typeof grantLevelMilestoneReward==='function') grantLevelMilestoneReward(lv); });
  }
}
function renderPlayerLevelBar(){
  const lvEl=document.getElementById('plLv'); if(!lvEl) return;
  lvEl.textContent=plData.lv;
  const needed=getPLXPForLv(plData.lv);
  const pct=Math.max(0,Math.min(100, Math.floor(plData.xp/needed*100)));
  const fill=document.getElementById('plBarFill'); if(fill) fill.style.width=pct+'%';
  const txt=document.getElementById('plBarTxt'); if(txt) txt.textContent=plData.xp.toLocaleString()+' / '+needed.toLocaleString();
  const badge=document.getElementById('plStarBadge');
  if(badge){
    if((plData.stardrops||0)>0){ badge.style.display='flex'; badge.textContent=plData.stardrops; }
    else badge.style.display='none';
  }
}

// ── 차원의 별: 등급 테이블 (희귀→차원, 갈수록 확률 낮아짐) ──
const SD_TIERS = [
  {key:'rare',      label:'희귀',   icon:'🔹', color:'#6366f1', upProb:100, coin:2000,   energy:2000  },
  {key:'epic',      label:'초희귀', icon:'🔷', color:'#a855f7', upProb:55,  coin:8000,   energy:8000  },
  {key:'legendary', label:'영웅',   icon:'🥇', color:'#f59e0b', upProb:35,  coin:20000,  energy:20000 },
  {key:'mythic',    label:'신화',   icon:'🌈', color:'#ec4899', upProb:20,  coin:60000,  energy:60000 },
  {key:'ancient',   label:'전설',   icon:'🔥', color:'#d97706', upProb:10,  coin:150000, energy:150000},
  {key:'divine',    label:'초월',   icon:'😇', color:'#0ea5e9', upProb:5,   coin:400000, energy:400000},
  {key:'absolute',  label:'차원',   icon:'👑', color:'#ffffff', upProb:0,   coin:1000000,energy:1000000},
];
// 등급이 높을수록 이펙트(링/광선/파편/흔들림)를 더 화려하게 - 0(약함)~3(최강)
function sdEffectLevel(tierIdx){ return tierIdx<2?0 : tierIdx<4?1 : tierIdx<6?2 : 3; }
// 인덱스0~6: 등급별 전용 갑옷 (전 등급 지급)
const SD_ARMOR_IDS   = ['sd_ar_rare','sd_ar_epic','sd_ar_legend','sd_ar_mythic','sd_ar_ancient','sd_ar_divine','sd_ar_absolute'];
// 인덱스2~6(영웅~차원): 등급별 전용 무기
const SD_WEP_IDS      = ['sd_wep_legend','sd_wep_mythic','sd_wep_ancient','sd_wep_divine','sd_wep_absolute'];
// 인덱스3~6(신화~차원): 등급별 전용 직업/아이템
const SD_JOB_IDS       = ['sd_job_mythic','sd_job_ancient','sd_job_divine','sd_job_absolute'];
const SD_ITEM_IDS      = ['sd_item_mythic','sd_item_ancient','sd_item_divine','sd_item_absolute'];

// ── 울트라 진화: 전설/초월/차원 등급 확정 시 극악 확률(3%)로 별이 깨지며 초록빛으로 폭주 ──
const SD_ULTRA_BASE_IDX     = [4, 5, 6]; // ancient(전설), divine(초월), absolute(차원)
const SD_ULTRA_CRACK_PROB   = 1;         // %
const SD_ULTRA_STAGE_LABELS = ['울트라', '하이퍼', '슈퍼 하이퍼'];
const SD_ULTRA_STAGE_UPPROB = [22, 10];  // 0→1단계, 1→2단계로 오를 터치 성공확률(%)
const SD_ULTRA_STAGE_COLORS = ['#4ade80', '#22c55e', '#bef264'];
const SD_ULTRA_STAGE_MULT   = [4, 7, 12]; // 코인/에너지 배율
const SD_ULTRA_WEP_IDS = {
  ancient:  ['sd_u_wep_ancient_ultra',  'sd_u_wep_ancient_hyper',  'sd_u_wep_ancient_shyper'],
  divine:   ['sd_u_wep_divine_ultra',   'sd_u_wep_divine_hyper',   'sd_u_wep_divine_shyper'],
  absolute: ['sd_u_wep_absolute_ultra', 'sd_u_wep_absolute_hyper', 'sd_u_wep_absolute_shyper'],
};
const SD_ULTRA_ARMOR_IDS = {
  ancient:  ['sd_u_ar_ancient_ultra',  'sd_u_ar_ancient_hyper',  'sd_u_ar_ancient_shyper'],
  divine:   ['sd_u_ar_divine_ultra',   'sd_u_ar_divine_hyper',   'sd_u_ar_divine_shyper'],
  absolute: ['sd_u_ar_absolute_ultra', 'sd_u_ar_absolute_hyper', 'sd_u_ar_absolute_shyper'],
};
const SD_ULTRA_FAMILY_KEYS = ['ancient', 'divine', 'absolute'];

// ── 레벨 마일스톤 확정 보상: 10/50/100레벨마다 확정 울트라 드롭 지급 ──
const SD_MILESTONE_TIERS = {
  10:  { label:'울트라 드롭',          family:null,        stage:0 }, // family null = 전설/초월/차원 중 랜덤
  50:  { label:'차원 울트라 드롭',      family:'absolute',  stage:0 },
  100: { label:'차원 슈퍼 울트라 드롭', family:'absolute',  stage:2 },
};
const SD_MILESTONE_DOUBLE_PROB = [30, 15, 6]; // 1→2, 2→4, 4→8개로 늘어날 확률(%), 최대 8개

let sdGame = { running:false, tier:-1, clicksLeft:4, finishing:false, ultra:null };

function isStardropUnlocked(){ return true; }

function openStarDrop(){
  if((plData.stardrops||0)<=0){
    const btn=document.getElementById('plStarBtn');
    if(btn&&!btn._sdMsgT){
      const bar=document.getElementById('plBarTxt');
      if(bar){
        const prev=bar.textContent;
        bar.textContent='레벨업으로 차원의 별 획득!';
        btn._sdMsgT=setTimeout(()=>{bar.textContent=prev;btn._sdMsgT=null;},1500);
      }
    }
    return;
  }
  sdGame = { running:true, tier:-1, clicksLeft:4, finishing:false, ultra:null };
  go('sStarDrop');
  const stage=document.getElementById('sdStage');
  const wrap=document.getElementById('sdStarWrap');
  const resultEl=document.getElementById('sdResult');
  if(stage) stage.classList.remove('sd-stage-hide','sd-chaos-shake');
  if(wrap){ wrap.classList.remove('sd-final-burst','sd-ultra-crack'); wrap.style.setProperty('--sd-crack-progress','0'); wrap.querySelectorAll('.sd-spark').forEach(s=>s.remove()); }
  if(resultEl) resultEl.classList.remove('show');
  const starEl=document.getElementById('sdStar');
  if(starEl) starEl.style.display='flex';
  const bulkBtn=document.getElementById('sdBulkBtn');
  if(bulkBtn) bulkBtn.style.display=(plData.stardrops||0)>=10 ? 'block':'none';
  renderStarDropScreen();
}

function closeStarDrop(){
  go('sLobby');
}

function renderStarDropScreen(){
  const wrapEl=document.getElementById('sdStarWrap');
  const labelEl=document.getElementById('sdStarTierLabel');
  const infoEl=document.getElementById('sdInfo');
  const clicksBox=document.getElementById('sdClicksBox');
  if(clicksBox) clicksBox.textContent='남은 클릭 기회: '+sdGame.clicksLeft;
  const curColor=sdGame.tier>=0?SD_TIERS[sdGame.tier].color:'#fbbf24';
  if(wrapEl){
    wrapEl.style.setProperty('--sd-glow', curColor);
    wrapEl.style.setProperty('--sd-tier-level', sdGame.tier>=0?sdEffectLevel(sdGame.tier):0);
  }
  if(labelEl){
    if(sdGame.tier>=0){
      const t=SD_TIERS[sdGame.tier];
      labelEl.textContent=t.icon+' '+t.label;
      labelEl.classList.add('show');
    } else {
      labelEl.classList.remove('show');
    }
  }
  if(infoEl){
    if(sdGame.tier===-1){
      infoEl.textContent='별을 클릭해 차원의 별을 깨워보세요!';
      infoEl.style.color='#e5e7eb';
    } else {
      const t=SD_TIERS[sdGame.tier];
      infoEl.textContent=t.label+' 등급 도달! 클릭해서 더 높은 등급에 도전하세요';
      infoEl.style.color=t.color;
    }
  }
}

// 개발자 전용(devMode 코드 입력자만 해당, 테스터킷 코드는 제외): 뽑을 때마다 무조건 울트라 등급 확정
function isDevUltraForced(){ return typeof devModeUnlocked!=='undefined' && devModeUnlocked; }

function clickStarDrop(){
  if(!sdGame.running || sdGame.finishing) return;
  const bulkBtn0=document.getElementById('sdBulkBtn'); if(bulkBtn0) bulkBtn0.style.display='none';
  if(sdGame.ultra && sdGame.ultra.active){ clickUltraStar(); return; }
  sdGame.clicksLeft--;
  const prob = sdGame.tier===-1 ? 100 : SD_TIERS[sdGame.tier].upProb;
  const success = sdGame.tier>=6 ? false : (isDevUltraForced() || Math.random()*100<prob);
  if(success){
    sdGame.tier++;
    sdGame.clicksLeft=4;
    flashStarDrop(true);
  } else {
    flashStarDrop(false);
  }
  if(sdGame.tier>=6 || sdGame.clicksLeft<=0){
    sdGame.finishing=true;
    const canCrack = SD_ULTRA_BASE_IDX.includes(sdGame.tier) && (isDevUltraForced() || Math.random()*100<SD_ULTRA_CRACK_PROB);
    if(canCrack){
      setTimeout(()=>startUltraCrack(sdGame.tier), 260);
    } else {
      setTimeout(()=>finishStarDrop(), 260);
    }
    return;
  }
  renderStarDropScreen();
}

// ── 별이 깨지며 초록빛으로 폭주하는 울트라 진화 모드 ──
function startUltraCrack(tierIdx){
  sdGame.finishing=false;
  sdGame.ultra = { active:true, baseTier:tierIdx, stage:0, touchesLeft:5 };
  const wrap=document.getElementById('sdStarWrap');
  if(wrap){
    wrap.classList.add('sd-ultra-crack');
    wrap.style.setProperty('--sd-crack-progress','0');
    wrap.style.setProperty('--sd-tier-level', 3);
  }
  spawnStarDropSparks(3);
  renderUltraScreen();
}

function renderUltraScreen(){
  const u=sdGame.ultra; if(!u) return;
  const wrap=document.getElementById('sdStarWrap');
  const labelEl=document.getElementById('sdStarTierLabel');
  const infoEl=document.getElementById('sdInfo');
  const clicksBox=document.getElementById('sdClicksBox');
  const baseLabel=SD_TIERS[u.baseTier].label;
  const stageLabel=SD_ULTRA_STAGE_LABELS[u.stage];
  const color=SD_ULTRA_STAGE_COLORS[u.stage];
  if(wrap) wrap.style.setProperty('--sd-glow', color);
  if(labelEl){ labelEl.textContent='💚 '+stageLabel+' '+baseLabel; labelEl.classList.add('show'); }
  if(clicksBox) clicksBox.textContent='별이 깨어나는 중! 터치 '+u.touchesLeft+'회 남음';
  if(infoEl){ infoEl.textContent='초록빛이 폭주합니다! 계속 터치해서 등급을 더 끌어올리세요'; infoEl.style.color=color; }
}

function clickUltraStar(){
  const u=sdGame.ultra; if(!u || !u.active) return;
  u.touchesLeft--;
  const wrap=document.getElementById('sdStarWrap');
  const crackProgress=Math.min(1,(5-u.touchesLeft)/5);
  if(wrap) wrap.style.setProperty('--sd-crack-progress', crackProgress.toFixed(2));
  let success=false;
  if(u.stage<2){
    success=Math.random()*100<SD_ULTRA_STAGE_UPPROB[u.stage];
    if(success) u.stage++;
  }
  const starEl=document.getElementById('sdStar');
  if(starEl){
    starEl.classList.remove('sd-flash-ok','sd-flash-fail');
    void starEl.offsetWidth;
    starEl.classList.add(success?'sd-flash-ok':'sd-flash-fail');
  }
  spawnStarDropSparks(3);
  renderUltraScreen();
  if(u.touchesLeft<=0 || u.stage>=2){
    sdGame.finishing=true;
    setTimeout(()=>finishUltraStarDrop(), 260);
  }
}

// 클릭 UI 없이 확률만으로 별 하나를 즉시 개봉 (일괄 까기 전용)
function simulateOneStarPull(){
  let tier=-1, clicksLeft=4;
  while(true){
    clicksLeft--;
    const prob = tier===-1 ? 100 : SD_TIERS[tier].upProb;
    const success = tier>=6 ? false : (isDevUltraForced() || Math.random()*100<prob);
    if(success){ tier++; clicksLeft=4; }
    if(tier>=6 || clicksLeft<=0) break;
  }
  let ultra=null;
  if(SD_ULTRA_BASE_IDX.includes(tier) && (isDevUltraForced() || Math.random()*100<SD_ULTRA_CRACK_PROB)){
    let stage=0, touches=5;
    while(touches>0 && stage<2){
      touches--;
      if(Math.random()*100<SD_ULTRA_STAGE_UPPROB[stage]) stage++;
    }
    ultra={baseTier:tier, stage};
  }
  return {tier, ultra};
}

// 별을 10개씩 한번에 개봉: 별 깨지는 모션 한 번 + 결과 요약 화면만 표시
function bulkOpenStarDrop(count){
  const n=Math.min(count, plData.stardrops||0);
  if(n<=0) return;

  sdGame = { running:true, tier:-1, clicksLeft:4, finishing:true, ultra:null };
  go('sStarDrop');
  const stage=document.getElementById('sdStage');
  const wrap=document.getElementById('sdStarWrap');
  const resultEl=document.getElementById('sdResult');
  const bulkBtn=document.getElementById('sdBulkBtn');
  if(bulkBtn) bulkBtn.style.display='none';
  if(stage) stage.classList.remove('sd-stage-hide','sd-chaos-shake');
  if(wrap){ wrap.classList.remove('sd-final-burst','sd-ultra-crack'); wrap.style.setProperty('--sd-crack-progress','0'); wrap.querySelectorAll('.sd-spark').forEach(s=>s.remove()); }
  if(resultEl) resultEl.classList.remove('show');
  const starEl=document.getElementById('sdStar');
  if(starEl) starEl.style.display='flex';
  const labelEl=document.getElementById('sdStarTierLabel');
  if(labelEl) labelEl.classList.remove('show');
  const clicksBox=document.getElementById('sdClicksBox');
  if(clicksBox) clicksBox.textContent=n+'개의 별을 한꺼번에 개봉합니다...';
  const infoEl=document.getElementById('sdInfo');
  if(infoEl){ infoEl.textContent='별들이 한꺼번에 폭주합니다!'; infoEl.style.color='#e5e7eb'; }

  const pulls=[];
  let anyUltra=false, maxTier=-1, maxUltraStage=-1;
  for(let i=0;i<n;i++){
    const r=simulateOneStarPull();
    pulls.push(r);
    if(r.tier>maxTier) maxTier=r.tier;
    if(r.ultra){ anyUltra=true; if(r.ultra.stage>maxUltraStage) maxUltraStage=r.ultra.stage; }
  }
  plData.stardrops=Math.max(0,(plData.stardrops||0)-n);
  sv('hd_pl', plData);
  renderPlayerLevelBar();

  const color = anyUltra ? SD_ULTRA_STAGE_COLORS[maxUltraStage] : (SD_TIERS[maxTier]?SD_TIERS[maxTier].color:'#fbbf24');
  const bulkLvl = anyUltra ? 3 : sdEffectLevel(Math.max(0,maxTier));
  if(wrap){ wrap.style.setProperty('--sd-glow', color); wrap.style.setProperty('--sd-tier-level', bulkLvl); if(anyUltra) wrap.classList.add('sd-ultra-crack'); wrap.classList.add('sd-final-burst'); }
  if(stage && bulkLvl>=2){ stage.classList.remove('sd-chaos-shake'); void stage.offsetWidth; stage.classList.add('sd-chaos-shake'); }
  spawnStarDropSparks(bulkLvl);

  setTimeout(()=>{
    let totalCoin=0, totalEnergy=0;
    const tierCounts={};
    const itemMsgs=[];
    pulls.forEach(p=>{
      const coinsBefore=coins, energyBefore=energy;
      let msgs, key;
      if(p.ultra){
        msgs=claimUltraStardropReward(p.ultra.baseTier, p.ultra.stage);
        key=SD_ULTRA_STAGE_LABELS[p.ultra.stage]+' '+SD_TIERS[p.ultra.baseTier].label+' 💚';
      } else {
        msgs=claimStardropReward(p.tier);
        key=SD_TIERS[p.tier].icon+' '+SD_TIERS[p.tier].label;
      }
      totalCoin += coins-coinsBefore;
      totalEnergy += energy-energyBefore;
      tierCounts[key]=(tierCounts[key]||0)+1;
      msgs.forEach(m=>{ if(!m.startsWith('🪙') && !m.startsWith('⚡')) itemMsgs.push(m); });
    });

    sdGame.running=false;
    sdGame.finishing=false;
    const stageEl=document.getElementById('sdStage');
    if(stageEl) stageEl.classList.add('sd-stage-hide');
    const resEl=document.getElementById('sdResult');
    if(resEl){
      resEl.style.setProperty('--sd-glow', color+'55');
      resEl.style.setProperty('--sd-aurora', bulkLvl);
      const tierSummary=Object.entries(tierCounts).map(([k,v])=>'<div class="sd-reward-line">'+k+' × '+v+'</div>').join('');
      const itemSummary=itemMsgs.map(m=>'<div class="sd-reward-line">'+m+'</div>').join('');
      resEl.innerHTML=
        sdConfettiHTML(bulkLvl)+
        '<div class="sd-result-tier'+(anyUltra?' sd-result-tier-chaos':'')+'" style="color:'+color+'">✨ 별 '+n+'개 일괄 개봉 완료! ✨</div>'+
        '<div class="sd-result-list">'+
          '<div class="sd-reward-line">🪙 코인 +'+totalCoin.toLocaleString()+'</div>'+
          '<div class="sd-reward-line">⚡ 에너지 +'+totalEnergy.toLocaleString()+'</div>'+
          tierSummary+itemSummary+
        '</div>'+
        '<div class="sd-result-btns">'+
          ((plData.stardrops||0)>=10?'<button class="sd-again-btn" onclick="bulkOpenStarDrop(10)">⚡ 10개씩 까기 ('+plData.stardrops+')</button>':'')+
          ((plData.stardrops||0)>0?'<button class="sd-again-btn" onclick="openStarDrop()">🌠 하나씩 뽑기 ('+plData.stardrops+')</button>':'')+
          '<button class="sd-close-btn" onclick="closeStarDrop()">확인</button>'+
        '</div>';
      resEl.classList.add('show');
    }
  }, 900);
}

function flashStarDrop(success){
  const starEl=document.getElementById('sdStar');
  if(!starEl) return;
  starEl.classList.remove('sd-flash-ok','sd-flash-fail');
  void starEl.offsetWidth;
  starEl.classList.add(success?'sd-flash-ok':'sd-flash-fail');
  renderStarDropScreen();
}

// level: true/3=카오스(최강), 숫자 0~3 = 등급별 이펙트 강도, 그 외 falsy=0(기본)
const SD_SPARK_PRESETS=[
  {count:12, distBase:80,  distRange:35, big:false},
  {count:18, distBase:105, distRange:50, big:false},
  {count:26, distBase:130, distRange:70, big:true },
  {count:34, distBase:155, distRange:95, big:true },
];
function spawnStarDropSparks(level){
  const layer=document.getElementById('sdSparkLayer');
  if(!layer) return;
  layer.innerHTML='';
  const lvl = level===true ? 3 : (typeof level==='number' ? Math.max(0,Math.min(3,level)) : 0);
  const preset=SD_SPARK_PRESETS[lvl];
  const chaos = lvl>=3;
  for(let i=0;i<preset.count;i++){
    const ang=(i/preset.count)*Math.PI*2 + Math.random()*0.3;
    const dist=preset.distBase+Math.random()*preset.distRange;
    const sx=Math.round(Math.cos(ang)*dist), sy=Math.round(Math.sin(ang)*dist);
    const s=document.createElement('div');
    s.className='sd-spark'+(preset.big?' sd-spark-big':'')+(chaos?' sd-spark-chaos':'');
    s.style.setProperty('--sx', sx+'px');
    s.style.setProperty('--sy', sy+'px');
    s.style.animationDelay=(Math.random()*0.08)+'s';
    layer.appendChild(s);
  }
}

// 결과 화면 배경에 색색의 별이 떨어지는 컨페티 연출 (등급이 높을수록 더 많이/화려하게)
const SD_RAINBOW_EMOJI=['⭐','✨','🌟','💫','🔮','💎','🌈'];
const SD_CONFETTI_COUNTS=[0, 8, 16, 26];
function sdConfettiHTML(level){
  const count=SD_CONFETTI_COUNTS[Math.max(0,Math.min(3,level))];
  if(count<=0) return '';
  let s='<div class="sd-confetti-layer">';
  for(let i=0;i<count;i++){
    const left=(Math.random()*100).toFixed(1);
    const emoji=SD_RAINBOW_EMOJI[Math.floor(Math.random()*SD_RAINBOW_EMOJI.length)];
    const dur=(2.4+Math.random()*1.8).toFixed(2);
    const delay=(Math.random()*0.7).toFixed(2);
    const size=(14+Math.random()*10).toFixed(0);
    s+='<div class="sd-confetti" style="left:'+left+'%;font-size:'+size+'px;animation-duration:'+dur+'s;animation-delay:'+delay+'s;">'+emoji+'</div>';
  }
  s+='</div>';
  return s;
}

function finishStarDrop(){
  sdGame.running=false;
  const t=SD_TIERS[sdGame.tier];
  const lvl=sdEffectLevel(sdGame.tier);
  const wrap=document.getElementById('sdStarWrap');
  const stageWrap=document.getElementById('sdStage');
  if(wrap){
    wrap.style.setProperty('--sd-glow', t.color);
    wrap.style.setProperty('--sd-tier-level', lvl);
    wrap.classList.add('sd-final-burst');
  }
  if(stageWrap && lvl>=2){
    stageWrap.classList.remove('sd-chaos-shake');
    void stageWrap.offsetWidth;
    stageWrap.classList.add('sd-chaos-shake');
  }
  spawnStarDropSparks(lvl);

  // 별이 터졌다가 한 점으로 빨려들어가는 연출이 끝난 뒤 보상 화면을 전체화면으로 표시
  setTimeout(()=>{
    plData.stardrops=Math.max(0,(plData.stardrops||0)-1);
    sv('hd_pl', plData);
    renderPlayerLevelBar();
    const rewards=claimStardropReward(sdGame.tier);

    const stage=document.getElementById('sdStage');
    if(stage) stage.classList.add('sd-stage-hide');
    const resultEl=document.getElementById('sdResult');
    if(resultEl){
      resultEl.style.setProperty('--sd-glow', t.color+'55');
      resultEl.style.setProperty('--sd-aurora', lvl);
      const tierCls = lvl>=3 ? ' sd-result-tier-rainbow' : lvl>=2 ? ' sd-result-tier-epic' : '';
      resultEl.innerHTML=
        sdConfettiHTML(lvl)+
        '<div class="sd-result-tier'+tierCls+'" style="color:'+t.color+'">'+t.icon+' '+t.label+' 등급 확정! '+t.icon+'</div>'+
        '<div class="sd-result-list">'+rewards.map(r=>'<div class="sd-reward-line">'+r+'</div>').join('')+'</div>'+
        '<div class="sd-result-btns">'+
          ((plData.stardrops||0)>0?'<button class="sd-again-btn" onclick="openStarDrop()">🌠 다시 뽑기 ('+plData.stardrops+')</button>':'')+
          '<button class="sd-close-btn" onclick="closeStarDrop()">확인</button>'+
        '</div>';
      resultEl.classList.add('show');
    }
  }, 900);
}

function finishUltraStarDrop(){
  sdGame.running=false;
  const u=sdGame.ultra;
  const baseLabel=SD_TIERS[u.baseTier].label;
  const stageLabel=SD_ULTRA_STAGE_LABELS[u.stage];
  const color=SD_ULTRA_STAGE_COLORS[u.stage];
  const wrap=document.getElementById('sdStarWrap');
  const stageWrap=document.getElementById('sdStage');
  if(wrap){
    wrap.style.setProperty('--sd-glow', color);
    wrap.classList.add('sd-final-burst');
  }
  if(stageWrap){
    stageWrap.classList.remove('sd-chaos-shake');
    void stageWrap.offsetWidth;
    stageWrap.classList.add('sd-chaos-shake');
  }
  spawnStarDropSparks(3);

  setTimeout(()=>{
    plData.stardrops=Math.max(0,(plData.stardrops||0)-1);
    sv('hd_pl', plData);
    renderPlayerLevelBar();
    const rewards=claimUltraStardropReward(u.baseTier, u.stage);

    const stage=document.getElementById('sdStage');
    if(stage) stage.classList.add('sd-stage-hide');
    const resultEl=document.getElementById('sdResult');
    if(resultEl){
      resultEl.style.setProperty('--sd-glow', color+'55');
      resultEl.style.setProperty('--sd-aurora', 3);
      resultEl.innerHTML=
        sdConfettiHTML(3)+
        '<div class="sd-result-tier sd-result-tier-chaos" style="color:'+color+'">💚 별이 깨어났습니다! '+stageLabel+' '+baseLabel+' 확정! 💚</div>'+
        '<div class="sd-result-list">'+rewards.map(r=>'<div class="sd-reward-line">'+r+'</div>').join('')+'</div>'+
        '<div class="sd-result-btns">'+
          ((plData.stardrops||0)>0?'<button class="sd-again-btn" onclick="openStarDrop()">🌠 다시 뽑기 ('+plData.stardrops+')</button>':'')+
          '<button class="sd-close-btn" onclick="closeStarDrop()">확인</button>'+
        '</div>';
      resultEl.classList.add('show');
    }
  }, 900);
}

// 카오스 드롭(별이 깨지는 극악 확률 이벤트) 전용 보상: 딱 1개만 지급 (코인/에너지/무기/방어구 중 랜덤 1개)
function claimUltraStardropReward(baseTierIdx, stage){
  const t=SD_TIERS[baseTierIdx];
  const familyKey=t.key; // ancient / divine / absolute
  const mult=SD_ULTRA_STAGE_MULT[stage];
  const msgs=[];
  const coinGain=t.coin*mult, energyGain=t.energy*mult;
  const wId=(SD_ULTRA_WEP_IDS[familyKey]||[])[stage];
  const arId=(SD_ULTRA_ARMOR_IDS[familyKey]||[])[stage];

  const pool=['coin','energy'];
  if(wId) pool.push('weapon');
  if(arId) pool.push('armor');
  const pick=pool[Math.floor(Math.random()*pool.length)];

  if(pick==='coin'){
    const bigCoin=coinGain*3;
    coins+=bigCoin;
    msgs.push('🪙 코인 +'+bigCoin.toLocaleString());
  } else if(pick==='energy'){
    const bigEnergy=energyGain*3;
    energy+=bigEnergy;
    msgs.push('⚡ 에너지 +'+bigEnergy.toLocaleString());
  } else if(pick==='weapon'){
    const w=WEPS[wId];
    if(owned[wId]){ const c=coinGain*2; coins+=c; msgs.push('⚔️ ['+(w?w.name:wId)+'] (이미 보유, 대신 코인 +'+c.toLocaleString()+')'); }
    else { owned[wId]=true; msgs.push('⚔️ ['+(w?w.name:wId)+'] 획득!'); }
  } else {
    const ar=ARMORS.find(a=>a.id===arId);
    if(owned['ar_'+arId]){ const c=coinGain*2; coins+=c; msgs.push('🛡️ ['+(ar?ar.name:arId)+'] (이미 보유, 대신 코인 +'+c.toLocaleString()+')'); }
    else { owned['ar_'+arId]=true; msgs.push('🛡️ ['+(ar?ar.name:arId)+'] 획득!'); }
  }
  saveAll();
  updRes();
  return msgs;
}

// 레벨 마일스톤(10/50/100) 확정 울트라 드롭 전용 보상: 코인+에너지+무기 또는 방어구 1종
function claimLevelDropReward(baseTierIdx, stage){
  const t=SD_TIERS[baseTierIdx];
  const familyKey=t.key;
  const mult=SD_ULTRA_STAGE_MULT[stage];
  const msgs=[];
  const coinGain=t.coin*mult, energyGain=t.energy*mult;
  coins+=coinGain; energy+=energyGain;
  msgs.push('🪙 코인 +'+coinGain.toLocaleString());
  msgs.push('⚡ 에너지 +'+energyGain.toLocaleString());

  if(Math.random()<0.5){
    const wId=(SD_ULTRA_WEP_IDS[familyKey]||[])[stage];
    if(wId){
      const w=WEPS[wId];
      if(owned[wId]){ coins+=coinGain; msgs.push('⚔️ ['+(w?w.name:wId)+'] (이미 보유, 대신 코인 +'+coinGain.toLocaleString()+')'); }
      else { owned[wId]=true; msgs.push('⚔️ ['+(w?w.name:wId)+'] 획득!'); }
    }
  } else {
    const arId=(SD_ULTRA_ARMOR_IDS[familyKey]||[])[stage];
    if(arId){
      const ar=ARMORS.find(a=>a.id===arId);
      if(owned['ar_'+arId]){ coins+=coinGain; msgs.push('🛡️ ['+(ar?ar.name:arId)+'] (이미 보유, 대신 코인 +'+coinGain.toLocaleString()+')'); }
      else { owned['ar_'+arId]=true; msgs.push('🛡️ ['+(ar?ar.name:arId)+'] 획득!'); }
    }
  }
  saveAll();
  updRes();
  return msgs;
}

// 레벨업으로 10/50/100 마일스톤을 넘을 때 확정 지급 (플레이 화면에 즉시 안내)
function grantLevelMilestoneReward(lv){
  let msKey=null;
  if(lv%100===0) msKey=100;
  else if(lv%50===0) msKey=50;
  else if(lv%10===0) msKey=10;
  if(!msKey) return;
  const cfg=SD_MILESTONE_TIERS[msKey];

  let count=1;
  for(let i=0;i<SD_MILESTONE_DOUBLE_PROB.length;i++){
    if(Math.random()*100<SD_MILESTONE_DOUBLE_PROB[i]) count*=2; else break;
  }

  const familyKey=cfg.family || SD_ULTRA_FAMILY_KEYS[Math.floor(Math.random()*SD_ULTRA_FAMILY_KEYS.length)];
  const baseTierIdx=SD_TIERS.findIndex(x=>x.key===familyKey);
  for(let i=0;i<count;i++) claimLevelDropReward(baseTierIdx, cfg.stage);

  if(typeof setMsg==='function'){
    const stageLabel=SD_ULTRA_STAGE_LABELS[cfg.stage];
    const baseLabel=SD_TIERS[baseTierIdx].label;
    const countTxt=count>1?(' × '+count):'';
    setMsg('🌟 Lv.'+lv+' 달성! '+cfg.label+' 획득 ('+stageLabel+' '+baseLabel+countTxt+')');
    setTimeout(()=>{ if(typeof running!=='undefined' && running) setMsg(''); }, 2500);
  }
}

function claimStardropReward(tierIdx){
  const t=SD_TIERS[tierIdx];
  const msgs=[];
  coins+=t.coin; energy+=t.energy;
  msgs.push('🪙 코인 +'+t.coin.toLocaleString());
  msgs.push('⚡ 에너지 +'+t.energy.toLocaleString());

  // 무기/갑옷/직업/아이템은 더 이상 등급 도달만으로 확정 지급되지 않고, 별도 확률을 통과해야 함
  const arId=SD_ARMOR_IDS[tierIdx];
  if(arId && Math.random()*100<40){
    const ar=ARMORS.find(a=>a.id===arId);
    if(owned['ar_'+arId]){ msgs.push('🛡️ ['+(ar?ar.name:arId)+'] (이미 보유 중)'); }
    else { owned['ar_'+arId]=true; msgs.push('🛡️ ['+(ar?ar.name:arId)+'] 획득!'); }
  }
  if(tierIdx>=2){
    const wId=SD_WEP_IDS[tierIdx-2];
    if(wId && Math.random()*100<25){
      const w=WEPS[wId];
      if(owned[wId]){ msgs.push('⚔️ ['+(w?w.name:wId)+'] (이미 보유 중)'); }
      else { owned[wId]=true; msgs.push('⚔️ ['+(w?w.name:wId)+'] 획득!'); }
    }
  }
  if(tierIdx>=3){
    const jId=SD_JOB_IDS[tierIdx-3];
    if(jId && Math.random()*100<18){
      const j=JOBS.find(x=>x.id===jId);
      if(ownedJobs[jId]){ msgs.push('🧙 ['+(j?j.name:jId)+'] (이미 보유 중)'); }
      else { ownedJobs[jId]=true; msgs.push('🧙 ['+(j?j.name:jId)+'] 획득!'); }
    }
    const itId=SD_ITEM_IDS[tierIdx-3];
    if(itId && Math.random()*100<18){
      const it=ITEMS.find(x=>x.id===itId);
      if(ownedItems[itId]){ msgs.push('🧪 ['+(it?it.name:itId)+'] (이미 보유 중)'); }
      else { ownedItems[itId]=true; msgs.push('🧪 ['+(it?it.name:itId)+'] 획득!'); }
    }
  }
  saveAll();
  if(typeof saveJobData==='function') saveJobData();
  if(typeof saveItems==='function') saveItems();
  updRes();
  return msgs;
}

setTimeout(()=>{ renderPlayerLevelBar(); },500);
