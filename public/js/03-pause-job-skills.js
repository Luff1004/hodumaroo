// ══════════════ 일시정지 시스템 ══════════════
let paused = false;

function togglePause() {
  if(!running && !paused) return;
  paused = !paused;
  if(paused) {
    stopLoop();
    document.getElementById('pauseMenu').style.display='flex';
  } else {
    document.getElementById('pauseMenu').style.display='none';
    startLoop();
  }
}
function resumeGame() {
  paused = false;
  document.getElementById('pauseMenu').style.display='none';
  startLoop();
}
function quitGame() {
  paused = false;
  const wasDream = selMap && selMap.dream;
  document.getElementById('pauseMenu').style.display='none';
  stopGame();
  if(wasDream){
    isDreamMode=true;
    enterDreamworld();
  } else {
    go('sLobby');
  }
}

// ══════════════ 직업 스킬 시스템 ══════════════
let skillCooldowns = {E:0, Q:0};
let jobMinions = []; // 아군 좀비/소환수
let hpSnapshot = 0; // 시간마법사 HP 되감기용
let turrets = [];   // 엔지니어 포탑
let berserkMode = false;
let overclockTimer = 0;
let focusNextShot = false;
let timeFreezeTimer = 0;

function useSkill(key) {
  if(!running || paused) return;
  const job = JOBS.find(x=>x.id===equippedJob);
  if(!job) return;
  const skill = job.skills.find(s=>s.key===key);
  if(!skill) return;
  if(skillCooldowns[key] > 0) return; // 쿨타임 중
  skillCooldowns[key] = Math.floor(skill.cd*(P&&P._skillCdMult||1));
  // 스킬 실행
  execJobSkill(job.id, key);
  // 쿨타임 UI 업데이트
  updateSkillUI();
}

function execJobSkill(jobId, key) {
  switch(jobId) {
    case 'necromancer':
      if(key==='E') {
        // 주변 좀비 3마리 아군으로
        let converted=0;
        for(const z of zoms) {
          if(!z.dead && !z.isMinion && converted<3) {
            z.isMinion=true; z.hp=z.maxHp; converted++;
            for(let i=0;i<8;i++) parts.push({x:z.x,y:z.y,vx:(Math.random()-.5)*5,vy:(Math.random()-.5)*5,l:20,ml:20,r:4,col:'#a855f7'});
          }
        }
        setMsg(`💀 ${converted}마리를 아군으로 전환!`);
      } else if(key==='Q') {
        // 아군 좀비 전원 폭발
        let cnt=0;
        zoms.forEach(z=>{
          if(z.isMinion){cnt++;addExp(z.x,z.y,80,'#9333ea');z.dead=true;z.dT=30;
            zoms.forEach(e=>{if(!e.dead&&!e.isMinion&&Math.hypot(e.x-z.x,e.y-z.y)<80)hitZ(e,15);});}
        });
        setMsg(`🌀 해골 폭풍! ${cnt}기 폭발`);
      }
      break;
    case 'miner':
      if(key==='E') { P._goldRush=(P._goldRush||0)+600; setMsg('💰 황금 채굴! 10초간 코인 3배!'); }
      break;
    case 'ninja':
      if(key==='E') {
        P.x=Math.max(P.r,Math.min(MW-P.r,mxW)); P.y=Math.max(P.r,Math.min(MH-P.r,myW));
        P._invincible=(P._invincible||0)+60;
        for(let i=0;i<15;i++) parts.push({x:P.x,y:P.y,vx:(Math.random()-.5)*8,vy:(Math.random()-.5)*8,l:18,ml:18,r:3,col:'#1f2937'});
        setMsg('⚡ 순간이동! 1초 무적');
      } else if(key==='Q') { P._shadow=(P._shadow||0)+180; setMsg('👥 분신술! 3초간 피해 분산'); }
      break;
    case 'pyro':
      if(key==='E') {
        for(let i=0;i<16;i++){const a=i/16*Math.PI*2;buls.push({x:P.x,y:P.y,vx:Math.cos(a)*9,vy:Math.sin(a)*9,r:7,l:100,en:false,dmg:8+(P.dmgB||0),col:'#ff6600',fire:true});}
        setMsg('🌪️ 화염 폭풍!');
      }
      break;
    case 'medic':
      if(key==='E') { const heal=Math.ceil(P.maxHp*.5); P.hp=Math.min(P.maxHp,P.hp+heal); setMsg(`❤️ 긴급 치료! +${heal}HP`); for(let i=0;i<12;i++) parts.push({x:P.x,y:P.y,vx:(Math.random()-.5)*4,vy:(Math.random()-.5)*4,l:25,ml:25,r:5,col:'#22c55e'}); }
      break;
    case 'engineer':
      if(key==='E') { turrets.push({x:P.x,y:P.y,timer:900,fireT:0,r:18}); setMsg('🏗️ 포탑 설치!'); }
      else if(key==='Q') { overclockTimer=600; setMsg('⚙️ 오버클럭! 발사속도 3배'); }
      break;
    case 'berserker':
      if(key==='E') { P._berserk=(P._berserk||0)+300; P._invincible=(P._invincible||0)+300; setMsg('💢 광전사 질주!'); }
      break;
    case 'sniper_job':
      if(key==='E') { focusNextShot=true; setMsg('🎯 집중 조준 준비! 다음 탄환 확정 치명타 5배'); }
      break;
    case 'time_mage':
      if(key==='E') { timeFreezeTimer=180; setMsg('⏸️ 시간 정지! 3초'); }
      else if(key==='Q') {
        const restoreHp=hpSnapshot||P.hp; P.hp=Math.min(P.maxHp,restoreHp);
        setMsg(`⏪ 시간 되감기! HP ${Math.ceil(restoreHp)} 복구`);
        for(let i=0;i<20;i++) parts.push({x:P.x,y:P.y,vx:(Math.random()-.5)*6,vy:(Math.random()-.5)*6,l:30,ml:30,r:5,col:'#818cf8'});
      }
      break;

    case 'gunslinger':
      if(key==='E'){P._infiniteAmmo=true;P._fastFire=true;setTimeout(()=>{P._infiniteAmmo=false;P._fastFire=false;},2000);setMsg('🔫 급사! 2초간 무한탄약!');}
      break;
    case 'paladin':
      if(key==='E'){P._invincible=(P._invincible||0)+180;zoms.forEach(z=>{if(!z.dead){const dx=z.x-P.x,dy=z.y-P.y,dl=Math.sqrt(d2(z.x,z.y,P.x,P.y))||1;if(dl<120){z.x+=dx/dl*60;z.y+=dy/dl*60;}}});setMsg('✨ 신성 방패!');}
      break;
    case 'rogue':
      if(key==='E'){P._stealth=true;P._stealthDmgMult=5;setTimeout(()=>{P._stealth=false;P._stealthDmgMult=1;},3000);for(let i=0;i<12;i++)parts.push({x:P.x,y:P.y,vx:(Math.random()-.5)*5,vy:(Math.random()-.5)*5,l:20,ml:20,r:4,col:'#1f2937'});setMsg('👤 은신! 첫 공격 5배');}
      else if(key==='Q'){addExp(P.x,P.y,80,'rgba(100,100,100,0.5)');zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<80**2){z.spd*=0.3;setTimeout(()=>{if(!z.dead)z.spd/=0.3;},3000);}});setMsg('💨 연막탄!');}
      break;
    case 'shaman':
      if(key==='E'){addExp(P.x,P.y,150,'#84cc16');zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<150**2){hitZ(z,15);if(poison<=0)poison=300;}});setMsg('🌀 주술 폭발!');}
      else if(key==='Q'){for(let i=0;i<3;i++)effs.push({type:'cloud',x:P.x+(Math.random()-.5)*200,y:P.y+(Math.random()-.5)*200,l:300,ml:300,r:80,dmgMult:2,dmgT:0});setMsg('☁️ 독구름 3개!');}
      break;
    case 'knight':
      if(key==='E'){const ang=P.angle;const dashX=P.x+Math.cos(ang)*200,dashY=P.y+Math.sin(ang)*200;P.x=Math.max(P.r,Math.min(MW-P.r,dashX));P.y=Math.max(P.r,Math.min(MH-P.r,dashY));zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<(P.r+z.r+30)**2)hitZ(z,100);});setMsg('🚀 돌진!');}
      break;
    case 'witch':
      if(key==='E'){for(let i=0;i<16;i++){const a=i/16*Math.PI*2;buls.push({x:P.x,y:P.y,vx:Math.cos(a)*9,vy:Math.sin(a)*9,r:6,l:130,en:false,dmg:8+(P.dmgB||0),col:'#9333ea',magic:true});}setMsg('✨ 마법 폭풍!');}
      else if(key==='Q'){const tgt=zoms.filter(z=>!z.dead).sort((a,b)=>b.hp-a.hp)[0];if(tgt){tgt.hp=Math.floor(tgt.hp*.5);for(let i=0;i<10;i++)parts.push({x:tgt.x,y:tgt.y,vx:(Math.random()-.5)*6,vy:(Math.random()-.5)*6,l:20,ml:20,r:5,col:'#7c3aed'});setMsg('🔮 저주! 가장 강한 적 HP 반감');}}
      break;
    case 'viking':
      if(key==='E'){P._berserk=(P._berserk||0)+300;P.spd+=1.5;P._invincible=(P._invincible||0)+60;setTimeout(()=>{P.spd-=1.5;},5000);setMsg('⚔️ 전투 함성!');}
      break;
    case 'archer':
      if(key==='E'){for(let i=0;i<24;i++){const a=i/24*Math.PI*2;buls.push({x:P.x,y:P.y,vx:Math.cos(a)*10,vy:Math.sin(a)*10,r:5,l:160,en:false,dmg:6+(P.dmgB||0),pierce:true});}setMsg('🏹 화살 폭풍!');}
      break;
    case 'vampire':
      if(key==='E'){for(let i=0;i<8;i++){const a=i/8*Math.PI*2;buls.push({x:P.x,y:P.y,vx:Math.cos(a)*8,vy:Math.sin(a)*8,r:7,l:120,en:false,dmg:5+(P.dmgB||0),col:'#dc2626',_vamp:true});}setMsg('🩸 피의 폭풍!');}
      else if(key==='Q'){for(let i=0;i<12;i++){const ang=Math.random()*Math.PI*2;zoms.push({x:P.x+Math.cos(ang)*60,y:P.y+Math.sin(ang)*60,type:'runner',r:10,hp:15,maxHp:15,spd:3,angle:0,dead:false,dT:0,isMinion:true,minionTimer:900,_dshC:999,_dsh:false,_dvx:0,_dvy:0,_healT:0,_phT:60,_phased:false,_frz:0,wob:0,col:'#dc2626'});}setMsg('🦇 박쥐 떼 소환!');}
      break;
    case 'scientist':
      if(key==='E'){const ang=Math.atan2(myW-P.y,mxW-P.x);const tx=P.x+Math.cos(ang)*200,ty=P.y+Math.sin(ang)*200;effs.push({type:'warn',x:tx,y:ty,l:30,ml:30});setTimeout(()=>{if(!running)return;addExp(tx,ty,100,'#06b6d4');effs.push({type:'cloud',x:tx,y:ty,l:250,ml:250,r:90,dmgMult:3,dmgT:0});if(d2(P.x,P.y,tx,ty)<(100+P.r)**2)takeDmg(5);},500);setMsg('🧪 화학 폭탄!');}
      else if(key==='Q'){for(let i=0;i<3;i++){setTimeout(()=>{if(!running)return;zoms.push({x:P.x+(Math.random()-.5)*60,y:P.y+(Math.random()-.5)*60,type:'runner',r:12,hp:25,maxHp:25,spd:2,angle:0,dead:false,dT:0,isMinion:true,minionTimer:1800,_dshC:999,_dsh:false,_dvx:0,_dvy:0,_healT:0,_phT:60,_phased:false,_frz:0,wob:0});},i*100);}setMsg('🤖 드론 3기 배치!');}
      break;
    case 'demon_job':
      if(key==='E'){P._berserk=(P._berserk||0)+300;P._invincible=(P._invincible||0)+300;P.dmgB=(P.dmgB||0)+8;setTimeout(()=>{P.dmgB-=8;},5000);setMsg('😈 악마 형태! 데미지 3배');}
      break;
    case 'pirate':
      if(key==='E'){for(let i=-1;i<=1;i++){const ang=P.angle+i*.25;buls.push({x:P.x,y:P.y,vx:Math.cos(ang)*6,vy:Math.sin(ang)*6,r:12,l:120,en:false,dmg:20+(P.dmgB||0),explosive:true,_explosive:true});}setMsg('💣 함포 사격!');}
      break;
    case 'monk':
      if(key==='E'){for(let i=0;i<5;i++){setTimeout(()=>{if(!running)return;const ang=P.angle;buls.push({x:P.x,y:P.y,vx:Math.cos(ang)*13,vy:Math.sin(ang)*13,r:8,l:140,en:false,dmg:12+(P.dmgB||0),energy:true});},i*80);}setMsg('🌐 기공탄 5연발!');}
      else if(key==='Q'){P.hp=P.maxHp;P._invincible=(P._invincible||0)+600;setMsg('🧘 명상 - 완전 회복+10초 무적');}
      break;
    case 'robot':
      if(key==='E'){fireLaser(P.angle,500,5,false);fireLaser(P.angle,500,5,false);setTimeout(()=>{if(!running)return;fireLaser(P.angle,500,5,false);},500);setMsg('⚡ 레이저 빔!');}
      else if(key==='Q'){for(let i=0;i<5;i++){const ang=i/5*Math.PI*2;buls.push({x:P.x+Math.cos(ang)*40,y:P.y+Math.sin(ang)*40,vx:Math.cos(ang)*7,vy:Math.sin(ang)*7,r:9,l:150,en:false,dmg:15+(P.dmgB||0),_explosive:true});}setMsg('💥 자폭 드론 5기!');}
      break;
    case 'dragon_job':
      if(key==='E'){for(let i=-2;i<=2;i++){const ang=P.angle+i*.1;buls.push({x:P.x,y:P.y,vx:Math.cos(ang)*11,vy:Math.sin(ang)*11,r:9,l:100,en:false,dmg:10+(P.dmgB||0),col:'#ff6600'});}setMsg('🔥 용의 숨결!');}
      else if(key==='Q'){zoms.push({x:P.x,y:P.y-80,type:'boss',r:30,hp:150,maxHp:150,spd:2.5,angle:0,dead:false,dT:0,isMinion:true,minionTimer:1800,bd:{col:'#dc2626',icon:'🐉',phases:[],atk:[]},_aT:999,_aI:0,phT:[],_chargeV:null,_chargeT:0,isDragon:true});setMsg('🐉 대용 소환!');}
      break;
    case 'god':
      if(key==='E'){setMsg('⭐ 신의 심판!');zoms.forEach(z=>{if(!z.dead&&!z.isMinion)z.hp=Math.floor(z.hp*.5);});for(let i=0;i<32;i++){const a=i/32*Math.PI*2;buls.push({x:P.x,y:P.y,vx:Math.cos(a)*12,vy:Math.sin(a)*12,r:8,l:180,en:false,dmg:30+(P.dmgB||0),col:'#fbbf24'});}for(let i=0;i<8;i++)setTimeout(()=>{if(!running)return;const ang=Math.random()*Math.PI*2;buls.push({x:P.x,y:P.y,vx:Math.cos(ang)*10,vy:Math.sin(ang)*10,r:10,l:160,en:false,dmg:40});},i*100);}
      else if(key==='Q'){P.hp=P.maxHp;P._invincible=(P._invincible||0)+600;for(let i=0;i<20;i++)parts.push({x:P.x+(Math.random()-.5)*100,y:P.y+(Math.random()-.5)*100,vx:(Math.random()-.5)*8,vy:-4-Math.random()*4,l:40,ml:40,r:6,col:'#fbbf24'});setMsg('✨ 부활! 완전 회복+10초 무적');}
      break;
    case 'alchemist':
      if(key==='E'){const h=Math.ceil(P.maxHp*.7);P.hp=Math.min(P.maxHp,P.hp+h);P._armorRegen=8;setTimeout(()=>{P._armorRegen=0;},10000);setMsg('💚 힐 포션! HP+'+h);}
      else if(key==='Q'){for(let i=0;i<3;i++){const ang=P.angle+(i-1)*.3;const tx=P.x+Math.cos(ang)*200,ty=P.y+Math.sin(ang)*200;effs.push({type:'warn',x:tx,y:ty,l:30,ml:30});setTimeout(()=>{if(!running)return;addExp(tx,ty,120,'#10b981');zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,tx,ty)<120**2)hitZ(z,30);});},500);}}
      break;
    case 'tamer':
      if(key==='E'){for(let i=0;i<1;i++)zoms.push({x:P.x+(Math.random()-.5)*80,y:P.y+(Math.random()-.5)*80,type:'runner',r:18,hp:60,maxHp:60,spd:3.5,angle:0,dead:false,dT:0,isMinion:true,minionTimer:1500,_dshC:999,_dsh:false,_dvx:0,_dvy:0,_healT:0,_phT:0,_phased:false,_frz:0,wob:0});setMsg('🐯 호랑이 소환!');}
      else if(key==='Q'){for(let i=0;i<5;i++){const tgt=zoms.filter(z=>!z.dead&&!z.isMinion)[Math.floor(Math.random()*zoms.filter(z=>!z.dead&&!z.isMinion).length)];if(tgt)hitZ(tgt,25+(P.dmgB||0));}setMsg('🦅 독수리 5마리 공습!');}
      break;
    case 'gladiator':
      if(key==='E'){const hpPct=P.hp/P.maxHp;const mult=Math.max(1,5*(1-hpPct));P.dmgB=(P.dmgB||0)+Math.floor(mult*5);setTimeout(()=>{P.dmgB-=Math.floor(mult*5);},5000);setMsg('⚔️ 전투 광기! 데미지×'+mult.toFixed(1));}
      break;
    case 'oracle':
      if(key==='E'){P._armorDodge=1;P._invincible=(P._invincible||0)+180;setTimeout(()=>{P._armorDodge=0;},3000);setMsg('🔮 예언 방패! 3초 완전 회피');}
      else if(key==='Q'){const strongest=zoms.filter(z=>!z.dead&&!z.isMinion).sort((a,b)=>b.hp-a.hp)[0];if(strongest){const tmp=P.hp;P.hp=Math.min(P.maxHp,strongest.hp*.1);strongest.hp=tmp;setMsg('🌀 운명 역전!');}}
      break;
    case 'reaper':
      if(key==='E'){doMelee(100,Math.PI*.8);zoms.forEach(z=>{if(!z.dead&&!z.isMinion&&d2(z.x,z.y,P.x,P.y)<100**2&&Math.random()<.05){z.hp=0;hitZ(z,0);}});setMsg('☠️ 죽음의 낫!');}
      else if(key==='Q'){zoms.forEach(z=>{if(!z.dead&&!z.isMinion)z.hp-=z.hp*.05;});addExp(P.x,P.y,300,'#1f2937');setMsg('💀 영혼 수확!');}
      break;
    case 'templar':
      if(key==='E'){for(let i=0;i<5;i++)setTimeout(()=>{if(!running)return;const ang=P.angle+(Math.random()-.5)*.2;buls.push({x:P.x,y:P.y,vx:Math.cos(ang)*14,vy:Math.sin(ang)*14,r:7,l:130,en:false,dmg:12+(P.dmgB||0),col:'#fbbf24',energy:true});},i*80);setMsg('✝️ 신성 검격 5연타!');}
      else if(key==='Q'){P._invincible=(P._invincible||0)+300;zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<150**2){const ang=Math.atan2(z.y-P.y,z.x-P.x);z.x+=Math.cos(ang)*80;z.y+=Math.sin(ang)*80;}});setMsg('⛪ 성역!');}
      break;
    case 'hunter':
      if(key==='E'){for(let i=0;i<10;i++)setTimeout(()=>{if(!running)return;const ang=P.angle+(Math.random()-.5)*.3;buls.push({x:P.x,y:P.y,vx:Math.cos(ang)*14,vy:Math.sin(ang)*14,r:5,l:160,en:false,dmg:5+(P.dmgB||0),pierce:true,poison:true});},i*60);setMsg('🏹 독화살 10발!');}
      break;
    case 'berserker2':
      if(key==='E'){const stk=P._rageStack||0;for(let i=0;i<8;i++){const a=i/8*Math.PI*2;buls.push({x:P.x,y:P.y,vx:Math.cos(a)*10,vy:Math.sin(a)*10,r:7,l:130,en:false,dmg:stk*10+(P.dmgB||0),col:'#b45309'});}P._rageStack=0;setMsg('💢 분노 폭발! 스택×10='+stk*10+'데미지');}
      else if(key==='Q'){zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<200**2){const ang=Math.atan2(z.y-P.y,z.x-P.x);z.x+=Math.cos(ang)*150;z.y+=Math.sin(ang)*150;}});setMsg('🩸 피의 함성! 적 도주');}
      break;
    case 'chrono':
      if(key==='E'){P._chronoX=P.x;P._chronoY=P.y;P._chronoHP=P.hp;setTimeout(()=>{if(!running)return;P.x=P._chronoX;P.y=P._chronoY;P.hp=Math.min(P.maxHp,P._chronoHP);for(let i=0;i<15;i++)parts.push({x:P.x,y:P.y,vx:(Math.random()-.5)*6,vy:(Math.random()-.5)*6,l:25,ml:25,r:5,col:'#6d28d9'});},10000);setMsg('⏪ 10초 후 현재 위치+HP로 귀환!');}
      else if(key==='Q'){zoms.forEach(z=>{if(!z.dead)z.spd*=2;});P.spd+=1.5;setTimeout(()=>{zoms.forEach(z=>{if(!z.dead)z.spd/=2;});P.spd-=1.5;},5000);setMsg('⏩ 시간 2배 가속!');}
      break;
    case 'illusionist':
      if(key==='E'){for(let i=0;i<5;i++){const ang=P.angle+i/5*Math.PI*2;const ix=P.x+Math.cos(ang)*60,iy=P.y+Math.sin(ang)*60;effs.push({type:'warn',x:ix,y:iy,l:30,ml:30});setTimeout(()=>{if(!running)return;addExp(ix,iy,60,'#ec4899');zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,ix,iy)<60**2)hitZ(z,20+(P.dmgB||0));});},500);}setMsg('🎭 환영 폭발!');}
      else if(key==='Q'){zoms.forEach(z=>{if(!z.dead){z._frz=(z._frz||0)+300;for(let i=0;i<4;i++)parts.push({x:z.x,y:z.y,vx:(Math.random()-.5)*4,vy:(Math.random()-.5)*4,l:15,ml:15,r:3,col:'#ec4899'});}});setMsg('🌀 혼란의 장! 모든 적 5초 혼란');}
      break;
    case 'bard':
      if(key==='E'){P.spd+=1.5;P.dmgB=(P.dmgB||0)+5;P._armorRegen=5;setTimeout(()=>{P.spd-=1.5;P.dmgB-=5;P._armorRegen=0;},15000);for(let i=0;i<20;i++)parts.push({x:P.x+(Math.random()-.5)*200,y:P.y+(Math.random()-.5)*200,vx:(Math.random()-.5)*5,vy:-3,l:30,ml:30,r:5,col:'#f59e0b'});setMsg('🎵 전쟁의 노래! 15초 버프');}
      break;
    case 'warlord':
      if(key==='E'){P._invincible=(P._invincible||0)+600;P.dmgB=(P.dmgB||0)+8;P.spd+=1;setTimeout(()=>{P.dmgB-=8;P.spd-=1;},10000);setMsg('👑 군주 선언! 10초 강화');}
      else if(key==='Q'){for(let i=0;i<2;i++)zoms.push({x:P.x+(Math.random()-.5)*60,y:P.y+(Math.random()-.5)*60,type:'runner',r:22,hp:80,maxHp:80,spd:2.8,angle:0,dead:false,dT:0,isMinion:true,minionTimer:1800,_dshC:999,_dsh:false,_dvx:0,_dvy:0,_healT:0,_phT:0,_phased:false,_frz:0,wob:0});setMsg('⚔️ 제국의 군대 소환!');}
      break;
    case 'trickster':
      if(key==='E'){const r4=Math.floor(Math.random()*4);if(r4===0){P._invincible=(P._invincible||0)+300;setMsg('🃏 운명: 무적!');}else if(r4===1){zoms.forEach(z=>{if(!z.dead&&!z.isMinion)z.hp=0;});setMsg('🃏 운명: 전멸!');}else if(r4===2){P.hp=P.maxHp;setMsg('🃏 운명: 부활!');}else{addExp(P.x,P.y,300,'#ec4899');setMsg('🃏 운명: 폭발!');}}
      break;
    case 'demigod':
      if(key==='E'){P._invincible=(P._invincible||0)+600;P.dmgB=(P.dmgB||0)+15;for(let i=0;i<24;i++){const a=i/24*Math.PI*2;buls.push({x:P.x,y:P.y,vx:Math.cos(a)*12,vy:Math.sin(a)*12,r:9,l:200,en:false,dmg:25+(P.dmgB),col:'#fbbf24'});}setTimeout(()=>{P.dmgB-=15;},10000);setMsg('🌟 신격화! 10초 무적+데미지×5');}
      else if(key==='Q'){zoms.forEach(z=>{if(!z.dead&&!z.isMinion){z.hp-=z.hp*.3;for(let i=0;i<5;i++)parts.push({x:z.x,y:z.y,vx:(Math.random()-.5)*6,vy:(Math.random()-.5)*6,l:15,ml:15,r:4,col:'#fbbf24'});}});setMsg('⚡ 신의 심판! 전체 적 HP 30% 감소');}
      break;
    case 'sp_job25':
      if(key==='E'){
        addExp(P.x,P.y,300,'#6366f1');
        zoms.forEach(z=>{if(!z.dead&&d2(z.x,z.y,P.x,P.y)<300**2){hitZ(z,200);z._frz=Math.max(z._frz||0,120);}});
        setMsg('🌠 성흔 폭발! 범위 200 데미지+기절!');
      } else if(key==='Q'){
        P._spShield=true;P._invincible=(P._invincible||0)+300;
        setTimeout(()=>{P._spShield=false;},5000);
        setMsg('🛡️ 성흔 방패! 5초간 피해 90% 감소!');
      }
      break;
    case 'sp_job50':
      if(key==='E'){
        zoms.forEach(z=>{if(!z.dead)z.hp=Math.ceil(z.hp*0.30);});
        for(let i=0;i<48;i++){const a=i/48*Math.PI*2;buls.push({x:P.x,y:P.y,vx:Math.cos(a)*12,vy:Math.sin(a)*12,r:9,l:200,en:false,dmg:50+(P.dmgB||0),col:`hsl(${i*7.5},90%,65%)`});}
        setMsg('💫 별의 심판! 전체 적 HP 70% 제거!');
      } else if(key==='Q'){
        P.hp=P.maxHp;P._invincible=(P._invincible||0)+1800;P.spd+=1;
        setTimeout(()=>{P.spd-=1;},30000);
        for(let i=0;i<30;i++)parts.push({x:P.x+(Math.random()-.5)*120,y:P.y+(Math.random()-.5)*120,vx:(Math.random()-.5)*8,vy:-4-Math.random()*4,l:50,ml:50,r:7,col:'#fbbf24'});
        setMsg('✨ 신성 부활! 완전회복+30초 무적!');
      }
      break;
    case 'summoner':
      if(key==='E') {
        for(let i=0;i<2;i++) {
          const ang=i/2*Math.PI*2;
          zoms.push({x:P.x+Math.cos(ang)*50,y:P.y+Math.sin(ang)*50,type:'runner',r:14,hp:30,maxHp:30,spd:2.5,angle:0,dead:false,dT:0,isMinion:true,minionTimer:1200,_dshC:999,_dsh:false,_dvx:0,_dvy:0,_healT:0,_phT:60,_phased:false,_frz:0,wob:0,col:'#22c55e'});
        }
        setMsg('🐺 늑대 2마리 소환!');
      } else if(key==='Q') {
        zoms.push({x:P.x,y:P.y-60,type:'boss',r:22,hp:80,maxHp:80,spd:2,angle:0,dead:false,dT:0,isMinion:true,minionTimer:600,bd:{col:'#dc2626',icon:'🐲',phases:[],atk:[]},_aT:999,_aI:0,phT:[],_chargeV:null,_chargeT:0,col:'#dc2626',isBoss:false,isDragon:true});
        setMsg('🐲 드래곤 소환!');
      }
      break;
  }
  setTimeout(()=>{if(running)setMsg('');},2500);
}

// 직업 패시브 및 틱
function tickJob() {
  if(!equippedJob) return;
  const job = JOBS.find(x=>x.id===equippedJob);
  if(!job) return;

  // 쿨타임 감소
  if(skillCooldowns.E>0){skillCooldowns.E--;if(skillCooldowns.E===0)updateSkillUI();}
  if(skillCooldowns.Q>0){skillCooldowns.Q--;if(skillCooldowns.Q===0)updateSkillUI();}
  // 60프레임마다 UI 업데이트
  if((skillCooldowns.E+skillCooldowns.Q)%4===0) updateSkillUI();

  // 시간마법사 HP 스냅샷 (5초 전)
  if(job.id==='time_mage'){if(!P._hpSnapT)P._hpSnapT=0;P._hpSnapT++;if(P._hpSnapT>=300){P._hpSnapT=0;hpSnapshot=P.hp;}}

  // 시간 정지
  if(timeFreezeTimer>0){timeFreezeTimer--;zoms.forEach(z=>{if(!z.isMinion&&!z.dead)z._frz=Math.max(z._frz||0,2);});}

  // 버서커 모드
  if(P._berserk>0){P._berserk--;P._invincible=Math.max(P._invincible||0,1);}

  // 오버클럭
  if(overclockTimer>0)overclockTimer--;

  // 무적 처리
  if(P._invincible>0)P._invincible--;

  // 아군 좀비(소환수) 틱
  zoms.forEach(z=>{
    if(!z.isMinion||z.dead)return;
    if(z.minionTimer!==undefined){z.minionTimer--;if(z.minionTimer<=0){z.dead=true;z.dT=20;return;}}
    // 가장 가까운 적 공격
    const enemy=zoms.filter(e=>!e.dead&&!e.isMinion).sort((a,b)=>Math.hypot(a.x-z.x,a.y-z.y)-Math.hypot(b.x-z.x,b.y-z.y))[0];
    if(enemy){
      const dx=enemy.x-z.x,dy=enemy.y-z.y,d=Math.hypot(dx,dy)||1;
      if(z.isRangedMinion){
        // 드론: 거리 유지 + 원거리 사격
        const keepDist=180;
        if(d>keepDist){z.x+=dx/d*z.spd;z.y+=dy/d*z.spd;}
        z.fireT=(z.fireT||0)+1;
        if(z.fireT>=40){z.fireT=0;const fa=Math.atan2(dy,dx);buls.push({x:z.x,y:z.y,vx:Math.cos(fa)*9,vy:Math.sin(fa)*9,r:4,l:120,en:false,dmg:6+(P.dmgB||0),pierce:false,col:'#60a5fa'});}
      } else {
        z.x+=dx/d*z.spd;z.y+=dy/d*z.spd;
        if(d<z.r+enemy.r+4){hitZ(enemy,2);z.x-=dx/d*3;z.y-=dy/d*3;}
      }
    }
    z.angle=Math.atan2((enemy||P).y-z.y,(enemy||P).x-z.x);
  });

  // 엔지니어 포탑
  turrets=turrets.filter(t=>{
    t.timer--;if(t.timer<=0)return false;
    t.fireT++;
    const fr=overclockTimer>0?8:25;
    if(t.fireT>=fr){t.fireT=0;
      const tgt=zoms.filter(z=>!z.dead&&!z.isMinion&&Math.hypot(z.x-t.x,z.y-t.y)<200).sort((a,b)=>Math.hypot(a.x-t.x,a.y-t.y)-Math.hypot(b.x-t.x,b.y-t.y))[0];
      if(tgt){const ang=Math.atan2(tgt.y-t.y,tgt.x-t.x);buls.push({x:t.x,y:t.y,vx:Math.cos(ang)*14,vy:Math.sin(ang)*14,r:4,l:60,en:false,dmg:3+(P.dmgB||0),pierce:false});}
    }
    return true;
  });

  // 드래곤 파이어
  zoms.forEach(z=>{
    if(!z.isDragon||z.dead)return;
    if(!z._fireT)z._fireT=0;z._fireT++;
    if(z._fireT>=20){z._fireT=0;
      const enemy=zoms.filter(e=>!e.dead&&!e.isMinion).sort((a,b)=>Math.hypot(a.x-z.x,a.y-z.y)-Math.hypot(b.x-z.x,b.y-z.y))[0];
      if(enemy){const ang=Math.atan2(enemy.y-z.y,enemy.x-z.x);for(let i=-1;i<=1;i++)buls.push({x:z.x,y:z.y,vx:Math.cos(ang+i*.1)*9,vy:Math.sin(ang+i*.1)*9,r:6,l:70,en:false,dmg:6,col:'#ff6600',fire:true});}}
    // 이동
    const enemy=zoms.filter(e=>!e.dead&&!e.isMinion)[0];
    if(enemy){const dx=enemy.x-z.x,dy=enemy.y-z.y,d=Math.hypot(dx,dy)||1;z.x+=dx/d*2;z.y+=dy/d*2;}
    z.angle=Math.atan2((zoms.find(e=>!e.dead&&!e.isMinion)||P).y-z.y,(zoms.find(e=>!e.dead&&!e.isMinion)||P).x-z.x);
  });

  // 패시브: 메딕 재생
  if(job.id==='medic'){if(!P._medicT)P._medicT=0;P._medicT++;if(P._medicT>=30){P._medicT=0;P.hp=Math.min(P.maxHp,P.hp+2);}}

  // 패시브: 버서커 - HP 낮을수록 데미지
  if(job.id==='berserker'){P._berserkDmg=(P.hp/P.maxHp<.3)?2:(P.hp/P.maxHp<.5)?1.5:1;}

  // 골드러시 타이머
  if(P._goldRush>0)P._goldRush--;
}

// 스킬 UI 업데이트
function updateSkillUI() {
  const job = JOBS.find(x=>x.id===equippedJob);
  const eBtn = document.getElementById('skillBtnE');
  const qBtn = document.getElementById('skillBtnQ');
  if(!eBtn) return;
  if(!job){eBtn.style.display='none';if(qBtn)qBtn.style.display='none';return;}
  const eSkill=job.skills.find(s=>s.key==='E');
  const qSkill=job.skills.find(s=>s.key==='Q');
  if(eSkill){
    eBtn.style.display='flex';
    const cdLeft=skillCooldowns.E;
    const cdPct=cdLeft/eSkill.cd;
    eBtn.innerHTML=`<div style="font-size:16px">${eSkill.icon}</div><div style="font-size:8px;font-weight:700;color:#fff">[E]</div>${cdLeft>0?`<div style="position:absolute;top:0;left:0;width:100%;height:${cdPct*100}%;background:rgba(0,0,0,.55);border-radius:8px;pointer-events:none"></div><div style="position:absolute;bottom:2px;font-size:9px;color:#fbbf24;font-weight:700">${(cdLeft/60).toFixed(1)}s</div>`:''}`;
    eBtn.title=eSkill.name+': '+eSkill.desc;
    eBtn.style.borderColor=cdLeft>0?'#6b7280':job.color;
  } else eBtn.style.display='none';
  if(qBtn){
    if(qSkill){
      qBtn.style.display='flex';
      const cdLeft=skillCooldowns.Q;
      const cdPct=cdLeft/qSkill.cd;
      qBtn.innerHTML=`<div style="font-size:16px">${qSkill.icon}</div><div style="font-size:8px;font-weight:700;color:#fff">[Q]</div>${cdLeft>0?`<div style="position:absolute;top:0;left:0;width:100%;height:${cdPct*100}%;background:rgba(0,0,0,.55);border-radius:8px;pointer-events:none"></div><div style="position:absolute;bottom:2px;font-size:9px;color:#fbbf24;font-weight:700">${(cdLeft/60).toFixed(1)}s</div>`:''}`;
      qBtn.title=qSkill.name+': '+qSkill.desc;
      qBtn.style.borderColor=cdLeft>0?'#6b7280':job.color;
    } else qBtn.style.display='none';
  }
}

