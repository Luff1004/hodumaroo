// ══════════════ 히든 이스터에그 16종 ══════════════
// 찾기 어렵지만, 찾으면 게임의 세계관(드림코어/시크릿코드)과 이어지는 보상.

// ── 개발자 전용: 이스터에그 전체 공개 (연출 없이 한번에) ──
function devRevealAllEggs(){
  if(typeof devModeUnlocked==='undefined'||!devModeUnlocked)return;
  ACHIEVEMENTS.filter(a=>a.id.startsWith('secret_')).forEach(a=>{
    if(!achData[a.id]){
      achData[a.id]=true;
      grantAchReward(a);
    }
  });
  saveAch();
  checkTitles();
  showEggToast('🛠️ 모든 이스터에그가 공개되었습니다 (DEV)');
}

// ── 개발자 전용: 이스터에그 프리뷰 패널 — 조건을 실제로 재현해서 연출까지 재생 ──
function devEnsureGame(mapId){
  go('sLobby');
  selMap=MAPS.find(m=>m.id===mapId)||MAPS.find(m=>m.id==='city');
  confirmMapSelect();
  startGame();
}
const DEV_EGG_PREVIEWS={
  secret_1:()=>{
    if(!achData['secret_1']){achData['secret_1']=true;grantAchReward(ACHIEVEMENTS.find(a=>a.id==='secret_1'));saveAch();checkTitles();}
    showEggToast('🏆 ???');
  },
  secret_2:()=>{ achStats.dreamCloseKill=1; saveAch(); checkAchievements(); },
  secret_3:()=>{ go('sLobby'); setTimeout(()=>triggerVersionEgg(),200); },
  secret_4:()=>{
    go('sLobby');
    setTimeout(()=>{
      const used=lJ('hd_used_codes',{});
      delete used['ITSEESYOU'];
      sv('hd_used_codes',used);
      openCode();
      document.getElementById('codeInput').value='ITSEESYOU';
      submitCode();
    },200);
  },
  secret_5:()=>{
    go('sLobby');
    setTimeout(()=>{
      ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']
        .forEach(k=>document.dispatchEvent(new KeyboardEvent('keydown',{key:k,bubbles:true})));
    },200);
  },
  secret_6:()=>{
    go('sLobby');
    setTimeout(()=>{
      showIdleEye();
      setTimeout(()=>{
        const el=[...document.querySelectorAll('img')].find(i=>i.style.zIndex==='9997');
        if(el)el.dispatchEvent(new MouseEvent('click',{bubbles:true}));
      },200);
    },200);
  },
  secret_7:()=>{
    devEnsureGame('city');
    setTimeout(()=>{ spawnGlitchCameo(); unlockEgg('egg_stillness','secret_7'); },300);
  },
  secret_8:()=>{ triggerTrueWake(); },
  secret_9:()=>{ go('sLobby'); setTimeout(()=>triggerLogoEgg(),200); },
  secret_10:()=>{ for(let i=0;i<8;i++)trackEnchantStreak(0); },
  secret_11:()=>{ for(let i=0;i<50;i++)trackPetStreak('common'); },
  secret_12:()=>{ go('sLobby'); unlockEgg('egg_midnight','secret_12'); showEggToast('🌙 자정의 로비. 아무도 없는 줄 알았는데...'); },
  secret_13:()=>{
    go('sLobby');
    setTimeout(()=>{
      spawnSantaCameo('dev_preview_'+Date.now());
      setTimeout(()=>{
        const el=[...document.querySelectorAll('div')].find(d=>d.textContent==='🎅');
        if(el)el.dispatchEvent(new MouseEvent('click',{bubbles:true}));
      },300);
    },200);
  },
  secret_14:()=>{
    devEnsureGame('city');
    setTimeout(()=>{
      eqArmor='';
      onBossDie({bd:{name:'호두마루',hp:100,reward:{c:0,e:0}},bossMapId:null});
    },300);
  },
  secret_15:()=>{
    go('sLobby');
    setTimeout(()=>{
      const btn=document.getElementById('bgmToggleBtn');
      for(let i=0;i<7;i++)btn.dispatchEvent(new MouseEvent('click',{bubbles:true}));
    },200);
  },
  secret_16:()=>{
    let rec={lastDate:'',streak:0};
    const base=new Date(2020,0,1);
    const origToday=todayKey;
    for(let i=0;i<7;i++){
      const d=new Date(base.getTime()+i*86400000);
      const key=`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
      dailyQuestData={quests:['kill10'],claimed:{kill10:true},date:key};
      sv('hd_egg_dailystreak',rec);
      todayKey=()=>key;
      trackDailyStreak();
      rec=lJ('hd_egg_dailystreak',{});
    }
    todayKey=origToday;
  },
  secret_17:()=>{ for(let i=0;i<10;i++)cancelReset(); },
  secret_18:()=>{
    devEnsureGame('city');
    setTimeout(()=>{
      coins=0;
      zoms.push({x:P.x+40,y:P.y,type:'normal',r:16,hp:1,maxHp:10,spd:1,angle:0,dead:false,dT:0,isMinion:false,_frz:0});
      hitZ(zoms[zoms.length-1],999);
    },300);
  },
  secret_19:()=>{
    devEnsureGame('city');
    setTimeout(()=>{ P.hp=1; triggerBehindYou(); },300);
  },
  secret_20:()=>{
    sv('hd_egg_lastseen',{ts:Date.now()-15*24*60*60*1000});
    checkReturnedEgg();
  },
  secret_21:()=>{
    devEnsureGame('tower');
    setTimeout(()=>{
      wave=66; spawnedCnt=totalSpawn; betweenWave=false;
      zoms=zoms.filter(z=>z.isMinion);
      update();
    },300);
  },
  secret_22:()=>{
    devEnsureGame('city');
    setTimeout(()=>{
      zoms.push({x:P.x+40,y:P.y,type:'ghost',r:15,hp:1,maxHp:1,spd:0.4,angle:0,dead:false,dT:0,isMinion:false,_dshC:999,_dsh:false,_dvx:0,_dvy:0,_healT:0,_phT:9999,_phased:false,_frz:0,wob:0,_cursedVisitor:true});
      hitZ(zoms[zoms.length-1],999);
    },300);
  },
  secret_23:()=>{ triggerFinalLetter(); },
  secret_24:()=>{
    devEnsureGame('city');
    setTimeout(()=>{
      ownedJobs['necromancer']=true;equippedJob='necromancer';
      achStats.necroTotalSaved=495;
      for(let i=0;i<3;i++){
        for(let j=0;j<5;j++)zoms.push({x:P.x+20,y:P.y,type:'normal',r:16,hp:10,maxHp:10,spd:1,angle:0,dead:false,dT:0,isMinion:false,_frz:0});
        execJobSkill('necromancer','E');
      }
    },300);
  },
  secret_25:()=>{
    const petId='dev_preview_pet';
    equippedPetId=petId;
    const rec=lJ('hd_egg_petgames',{});
    rec[petId]=99;
    sv('hd_egg_petgames',rec);
    devEnsureGame('city');
  },
  secret_26:()=>{
    devEnsureGame('city');
    setTimeout(()=>{
      achStats.finalBossKills=9;saveAch();
      onBossDie({bd:{name:'호두마루',hp:100,reward:{c:0,e:0}},bossMapId:null});
    },300);
  },
  secret_27:()=>{
    go('sLobby');
    selMap=MAPS.find(m=>m.theme==='snow')||MAPS.find(m=>m.campEngine);
    confirmMapSelect();
    startGame();
    setTimeout(()=>{ dnDay=249; startDay(); },300);
  },
  secret_28:()=>{
    achStats.soloGames=99;saveAch();
    partyBonus=1.0;
    devEnsureGame('city');
  },
  secret_29:()=>{ go('sLobby'); unlockEgg('egg_newyear','secret_29'); showEggToast('🌅 새해 복 많이 받으세요, 생존자님.'); },
};
function openDevEggPreview(){
  const modal=document.getElementById('devEggPreviewModal');
  if(!modal)return;
  const list=document.getElementById('devEggPreviewList');
  list.innerHTML='';
  ACHIEVEMENTS.filter(a=>a.id.startsWith('secret_')).forEach(a=>{
    const isDone=!!achData[a.id];
    const row=document.createElement('div');
    row.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:8px;background:#1e1033;border-radius:8px;padding:8px 10px;';
    row.innerHTML=`<div style="flex:1;min-width:0;"><div style="font-size:11px;font-weight:700;color:${isDone?'#4ade80':'#e5e7eb'};">${isDone?'✅ ':''}${a.name}</div><div style="font-size:9px;color:#9ca3af;">${a.desc}</div></div>`;
    const btn=document.createElement('button');
    btn.textContent='▶ 재생';
    btn.style.cssText='flex-shrink:0;padding:5px 10px;border:none;border-radius:6px;font-size:10px;font-weight:700;cursor:pointer;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;';
    btn.onclick=()=>{
      closeDevEggPreview();
      const fn=DEV_EGG_PREVIEWS[a.id];
      if(fn)fn();
    };
    row.appendChild(btn);
    list.appendChild(row);
  });
  modal.style.display='flex';
}
function closeDevEggPreview(){
  const modal=document.getElementById('devEggPreviewModal');
  if(modal)modal.style.display='none';
}

// ── 공통 헬퍼: 히든 업적 해금 + 알림 ──
function showEggToast(html){
  let t=document.getElementById('eggToast');
  if(!t){
    t=document.createElement('div');
    t.id='eggToast';
    t.style.cssText='position:fixed;top:14px;left:50%;transform:translateX(-50%) translateY(-20px);background:linear-gradient(135deg,#1e1033,#4c1d95);color:#f0abfc;padding:12px 22px;border-radius:14px;border:1.5px solid #a855f7;font-size:13px;font-weight:800;z-index:9999;box-shadow:0 8px 30px rgba(0,0,0,.5);opacity:0;transition:all .4s;text-align:center;pointer-events:none;max-width:90vw;';
    document.body.appendChild(t);
  }
  t.innerHTML=html;
  requestAnimationFrame(()=>{t.style.opacity='1';t.style.transform='translateX(-50%) translateY(0)';});
  clearTimeout(t._hideT);
  t._hideT=setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(-50%) translateY(-20px)';},4200);
}
function unlockEgg(flagKey,achId){
  const wasDone=!!achData[achId];
  const wasDoneFinal=!!achData['secret_23'];
  achStats[flagKey]=1;
  saveAch();
  checkAchievements();
  if(!wasDone&&achData[achId]){
    const a=ACHIEVEMENTS.find(x=>x.id===achId);
    if(a)showEggToast('🏆 히든 업적: '+a.name+'<br><span style="font-size:11px;font-weight:600;color:#c4b5fd;">'+a.desc+'</span>');
    if(typeof EGG_STORY_TEXT!=='undefined'&&EGG_STORY_TEXT[achId]){
      const s=EGG_STORY_TEXT[achId];
      setTimeout(()=>showStoryOverlay(s.icon,s.lines),1200);
    }
  }
  if(!wasDoneFinal&&achData['secret_23']&&typeof triggerFinalLetter==='function'){
    setTimeout(triggerFinalLetter,1500);
  }
}
const EGG_STORY_TEXT={
  secret_24:{icon:'🕊️',lines:[
    '당신이 되살린 오백 번째 그림자가, 조용히 무릎을 꿇습니다.',
    '그들에게도 한때는 이름이 있었고,',
    '함께 저녁을 먹을 사람이, 돌아오길 기다리는 사람이 있었을 겁니다.',
    '당신은 그들을 죽이지 않았습니다.',
    '아주 잠깐의, 목적을 돌려주었을 뿐입니다.',
    '말도 표정도 없는 존재가 — 처음으로 그렇게 들렸습니다.',
    '"고마워요."'
  ]},
  secret_25:{icon:'🐕',lines:[
    '백 번째 전장이 끝나고,',
    '당신의 발밑에서 조용히 숨을 고르는 작은 존재를 바라봅니다.',
    '처음 만났을 때는 그저 알을 깨고 나온 여린 생명이었습니다.',
    '백 번의 생사를 함께 넘고 나니,',
    '이제는 이름을 부르지 않아도 서로의 걸음을 압니다.',
    '말은 못해도 — 그 걸음은 언제나, 당신 곁에 있었습니다.'
  ]},
  secret_26:{icon:'🌒',lines:[
    '열 번째, 당신은 다시 그 앞에 섰습니다.',
    '"호두마루" — 이 세계의 이름이자, 이 존재의 이름이기도 합니다.',
    '어쩌면 처음부터 이건 싸움이 아니었을지도 모릅니다.',
    '당신이 매번 다시 일어나 이 존재 앞에 선 건,',
    '무언가를 이기기 위해서가 아니라 — 놓아주기 위해서였는지도 모릅니다.',
    '쓰러지기 직전, 그 존재가 남긴 마지막 말:',
    '"이제, 나를 기억 속에 남겨줘."',
    '그리고 처음으로 — 이름 그대로의 세계가, 조용해집니다.'
  ]},
  secret_27:{icon:'❄️',lines:[
    '눈이 그친 250일째 아침, 캠프파이어 옆에 낡은 수첩 하나가 놓여 있었습니다.',
    '마지막 장에는 이렇게 적혀 있습니다.',
    '"249일째. 조금만 더 버티면 될 것 같다. 내일은 꼭—"',
    '문장은 거기서 끝나 있었습니다.',
    '당신은 그 사람이 다 쓰지 못한 하루를, 대신 살아냈습니다.'
  ]},
  secret_28:{icon:'👣',lines:[
    '백 번의 전장을 홀로 걸었다고 생각했습니까.',
    '돌이켜보면, 당신의 발소리는 언제나 둘이었습니다.',
    '당신이 뒤를 돌아볼 때마다 조용히 걸음을 멈추던 그 존재는,',
    '아마 처음부터 당신을 해칠 생각이 없었을 겁니다.',
    '그저 — 혼자 걷게 두고 싶지 않았을 뿐.'
  ]},
  secret_29:{icon:'🌅',lines:[
    '올해도, 당신은 여기 있습니다.',
    '수많은 밤을 버텨내고, 수많은 이름을 떠나보내고,',
    '그래도 다시 총을 들었습니다.',
    '좀비들의 세계는 여전히 끝나지 않았지만—',
    '그래도 오늘은, 새로운 태양이 뜹니다.',
    '새해 복 많이 받으세요, 생존자님.'
  ]}
};
function showStoryOverlay(icon,lines){
  if(window._storyOverlayRunning)return;
  window._storyOverlayRunning=true;
  const overlay=document.createElement('div');
  overlay.style.cssText='position:fixed;inset:0;background:rgba(8,8,14,.96);z-index:9700;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 1.3s;padding:24px;';
  const box=document.createElement('div');
  box.style.cssText='max-width:540px;text-align:center;font-family:"Courier New",monospace;color:#e5e7eb;line-height:2;font-size:clamp(13px,2vw,15px);opacity:0;transition:opacity 1.6s;';
  box.innerHTML='<div style="font-size:28px;margin-bottom:16px;">'+icon+'</div>'+lines.map(l=>'<div>'+l+'</div>').join('');
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  requestAnimationFrame(()=>{overlay.style.opacity='1';});
  setTimeout(()=>{box.style.opacity='1';},800);
  const dur=Math.max(7000,lines.length*1500);
  setTimeout(()=>{
    overlay.style.opacity='0';
    setTimeout(()=>{overlay.remove();window._storyOverlayRunning=false;},1400);
  },dur);
}

// ══ 1. 버전 표기 클릭 — "빌드 번호는 거짓말이다" ══
// 로비 하단 "호두마루 v1.0" 문구를 짧은 시간 안에 10번 누르면 화면이 잠깐 글리치되며 진실을 드러낸다.
(function(){
  const verEl=document.querySelector('.ver');
  if(!verEl)return;
  let clicks=0,resetT=null;
  verEl.addEventListener('click',()=>{
    clicks++;
    clearTimeout(resetT);
    resetT=setTimeout(()=>{clicks=0;},1500);
    if(clicks>=10){
      clicks=0;
      triggerVersionEgg();
    }
  });
})();
function triggerVersionEgg(){
  if(window._versionEggRunning||typeof triggerGlitchTransition!=='function')return;
  window._versionEggRunning=true;
  const verEl=document.querySelector('.ver');
  const orig=verEl?verEl.textContent:'';
  if(verEl)verEl.textContent='v0.0 ― UNSTABLE BUILD';
  triggerGlitchTransition(()=>{
    if(verEl)verEl.textContent=orig;
    window._versionEggRunning=false;
    unlockEgg('egg_version','secret_3');
  });
}

// ══ 2. 개발자 콘솔 힌트 — "그들이 보고 있었다" ══
// 콘솔을 여는 사람에게만 보이는 코드 힌트. 코드 입력창(CODE)에 넣으면 히든 업적 해금.
console.log('%c호두마루','font-size:34px;font-weight:900;color:#7c3aed;');
console.log('%c개발자 도구를 여신 걸 보니, 뭔가를 찾고 계시는군요.','font-size:12px;color:#a855f7;');
console.log('%c...누군가는, 항상 지켜보고 있습니다.','font-size:11px;color:#6b7280;font-style:italic;');
console.log('%c로비의 🔑 CODE 입력창에 이걸 넣어보세요 → %cITSEESYOU','font-size:11px;color:#e5e7eb;','font-size:14px;font-weight:900;color:#4ade80;background:#111;padding:2px 8px;border-radius:4px;');

// ══ 3. 코나미 커맨드 — "낡은 커맨드" ══
// 로비 화면에서 ↑↑↓↓←→←→B A 입력 시 낙서 스마일 컨페티가 쏟아진다 (리소스팩 DOODLE!~과 연결).
(function(){
  const seq=['arrowup','arrowup','arrowdown','arrowdown','arrowleft','arrowright','arrowleft','arrowright','b','a'];
  let idx=0;
  document.addEventListener('keydown',e=>{
    const scr=document.querySelector('.screen.on')?.id;
    if(scr!=='sLobby'){idx=0;return;}
    const k=e.key.toLowerCase();
    if(k===seq[idx]){
      idx++;
      if(idx===seq.length){idx=0;triggerKonamiEgg();}
    } else {
      idx=(k===seq[0])?1:0;
    }
  });
})();
function triggerKonamiEgg(){
  unlockEgg('egg_konami','secret_5');
  spawnDoodleConfetti();
}
function spawnDoodleConfetti(){
  const n=22;
  for(let i=0;i<n;i++){
    const img=document.createElement('img');
    img.src='/images/resourcepacks/doodle_face.png';
    const startRot=Math.random()*360;
    img.style.cssText=`position:fixed;top:-60px;left:${Math.random()*96}vw;width:${26+Math.random()*28}px;z-index:9998;pointer-events:none;opacity:.92;transform:rotate(${startRot}deg);`;
    document.body.appendChild(img);
    const dur=2000+Math.random()*1400;
    const drift=(Math.random()-0.5)*180;
    if(img.animate){
      img.animate([
        {transform:`translate(0,0) rotate(${startRot}deg)`,opacity:.92},
        {transform:`translate(${drift}px, 108vh) rotate(${startRot+Math.random()*540-270}deg)`,opacity:.85}
      ],{duration:dur,easing:'ease-in'});
    }
    setTimeout(()=>img.remove(),dur+50);
  }
}

// ══ 4. 로비의 눈 — "누군가 지켜보고 있다" ══
// 로비에서 3분간 아무 조작도 하지 않으면, 드림코어의 눈이 잠깐 나타났다 사라진다. 클릭해서 붙잡으면 성공.
let _eggLastInteract=Date.now();
['click','keydown','mousemove','touchstart'].forEach(ev=>document.addEventListener(ev,()=>{_eggLastInteract=Date.now();},{passive:true}));
let _eggEyeShown=false;
setInterval(()=>{
  const scr=document.querySelector('.screen.on')?.id;
  if(scr!=='sLobby'||_eggEyeShown)return;
  if(Date.now()-_eggLastInteract>=180000)showIdleEye();
},5000);
function showIdleEye(){
  if(typeof EYE1==='undefined')return;
  _eggEyeShown=true;
  const eyeSrcs=[EYE1,EYE2,EYE3].filter(Boolean);
  const src=eyeSrcs[Math.floor(Math.random()*eyeSrcs.length)];
  const el=document.createElement('img');
  el.src=src;
  const pos=[
    'top:16px;left:16px;','top:16px;right:16px;',
    'bottom:16px;left:16px;','bottom:16px;right:16px;'
  ][Math.floor(Math.random()*4)];
  el.style.cssText=`position:fixed;${pos}width:64px;height:64px;object-fit:cover;border-radius:50%;z-index:9997;opacity:0;filter:grayscale(100%) brightness(.5);cursor:pointer;transition:opacity 1.1s;box-shadow:0 0 24px rgba(0,0,0,.65);`;
  document.body.appendChild(el);
  requestAnimationFrame(()=>{el.style.opacity='0.85';});
  let caught=false;
  el.addEventListener('click',ev=>{
    ev.stopPropagation();
    if(caught)return;
    caught=true;
    el.style.transition='opacity .3s,filter .3s';
    el.style.filter='grayscale(0%) brightness(1.1)';
    unlockEgg('egg_eye','secret_6');
    setTimeout(()=>{el.style.opacity='0';setTimeout(()=>el.remove(),400);},250);
  });
  setTimeout(()=>{
    if(!caught){el.style.opacity='0';setTimeout(()=>el.remove(),1200);}
    _eggEyeShown=false;
    _eggLastInteract=Date.now();
  },3200);
}

// ══ 5. 정지된 시간 — "정지된 시간 속에서" ══
// 게임 플레이 중 60초간 완전히 움직이지 않으면 글리치 엔티티가 스쳐 지나간다.
let _eggStillSec=0,_eggStillLastX=null,_eggStillLastY=null,_eggStillTriggered=false;
setInterval(()=>{
  if(typeof running==='undefined'||!running||(typeof paused!=='undefined'&&paused)||typeof P==='undefined'||!P){
    _eggStillSec=0;_eggStillLastX=null;_eggStillTriggered=false;return;
  }
  if(_eggStillLastX===P.x&&_eggStillLastY===P.y){
    _eggStillSec++;
  } else {
    _eggStillSec=0;_eggStillTriggered=false;
  }
  _eggStillLastX=P.x;_eggStillLastY=P.y;
  if(_eggStillSec>=60&&!_eggStillTriggered){
    _eggStillTriggered=true;
    spawnGlitchCameo();
    unlockEgg('egg_stillness','secret_7');
  }
},1000);
function spawnGlitchCameo(){
  if(typeof effs==='undefined'||typeof P==='undefined'||!P)return;
  const ang=Math.random()*Math.PI*2,dist=140+Math.random()*60;
  effs.push({type:'glitchCameo',x:P.x+Math.cos(ang)*dist,y:P.y+Math.sin(ang)*dist,l:180,ml:180});
}

// ══ 6. 진짜 각성 — 드림코어에서 "WAKEUP" 타이핑 ══
// 반복되던 "WAKE UP" 문구를 직접 되뇌면, 꿈이 스스로 답한다.
(function(){
  let buf='';
  document.addEventListener('keydown',e=>{
    const scr=document.querySelector('.screen.on')?.id;
    if(scr!=='sDream'){buf='';return;}
    if(/^[a-zA-Z]$/.test(e.key)){
      buf=(buf+e.key.toUpperCase()).slice(-8);
      if(buf.includes('WAKEUP')){
        buf='';
        triggerTrueWake();
      }
    }
  });
})();
function triggerTrueWake(){
  if(window._trueWakeRunning||typeof triggerGlitchTransition!=='function')return;
  window._trueWakeRunning=true;
  triggerGlitchTransition(()=>{
    const overlay=document.createElement('div');
    overlay.id='trueWakeOverlay';
    overlay.style.cssText='position:fixed;inset:0;background:#000;z-index:9500;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 1.2s;';
    const line=document.createElement('div');
    line.style.cssText='font-family:"Courier New",monospace;color:#e5e7eb;font-size:clamp(14px,2.2vw,20px);letter-spacing:2px;text-align:center;padding:20px;max-width:80vw;opacity:0;transition:opacity 1s;';
    line.textContent='당신은 이미 알고 있었다.';
    overlay.appendChild(line);
    document.body.appendChild(overlay);
    requestAnimationFrame(()=>{overlay.style.opacity='1';});
    setTimeout(()=>{line.style.opacity='1';},900);
    setTimeout(()=>{line.style.opacity='0';setTimeout(()=>{line.textContent='이 모든 것이 반복되어 왔다는 것을.';line.style.opacity='1';},250);},3200);
    setTimeout(()=>{line.style.opacity='0';setTimeout(()=>{line.textContent='그래도, 오늘은 조금 더 깨어있다.';line.style.opacity='1';},250);},5800);
    setTimeout(()=>{
      overlay.style.opacity='0';
      setTimeout(()=>{
        overlay.remove();
        window._trueWakeRunning=false;
        unlockEgg('egg_trueawaken','secret_8');
      },1200);
    },8600);
  });
}

// ══ 7. 로고 롱프레스 — "이 세계를 만든 이" ══
// 로비의 "호두마루" 로고를 2.5초간 꾹 누르고 있으면 희미한 헌사가 떠오른다.
(function(){
  const logoEl=document.querySelector('.logo');
  if(!logoEl)return;
  let pressT=null;
  const start=()=>{
    clearTimeout(pressT);
    pressT=setTimeout(triggerLogoEgg,2500);
  };
  const cancel=()=>clearTimeout(pressT);
  logoEl.addEventListener('mousedown',start);
  logoEl.addEventListener('touchstart',start,{passive:true});
  ['mouseup','mouseleave','touchend','touchcancel'].forEach(ev=>logoEl.addEventListener(ev,cancel));
})();
function triggerLogoEgg(){
  if(window._logoEggRunning)return;
  window._logoEggRunning=true;
  const el=document.createElement('div');
  el.textContent='― 이 세계를 만든 이가, 조용히 지켜보고 있다 ―';
  el.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);color:#c4b5fd;font-size:12px;letter-spacing:1px;opacity:0;transition:opacity 1.4s;z-index:9998;text-align:center;pointer-events:none;text-shadow:0 0 12px rgba(124,58,237,.8);';
  document.body.appendChild(el);
  requestAnimationFrame(()=>{el.style.opacity='0.9';});
  setTimeout(()=>{el.style.opacity='0';setTimeout(()=>el.remove(),1500);},3200);
  unlockEgg('egg_logo','secret_9');
  window._logoEggRunning=false;
}

// ══ 8. 인챈트 불운의 인장 — "불운의 인장" ══
// 인챈트 결과가 최하위 등급으로 8번 연속 나오면, 불운조차 하나의 증표가 된다.
let _eggEnchantStreak=0;
function trackEnchantStreak(tier){
  if(tier===0){
    _eggEnchantStreak++;
    if(_eggEnchantStreak>=8){
      _eggEnchantStreak=0;
      unlockEgg('egg_badluck','secret_10');
    }
  } else {
    _eggEnchantStreak=0;
  }
}

// ══ 9. 펫의 위로 — "위로의 선물" ══
// 레전더리/신화 없이 펫을 50마리 부화시키면, 운이 아니어도 곁을 지킨 마음에 보답한다.
let _eggPetStreak=0;
function trackPetStreak(rarity){
  if(rarity==='legendary'||rarity==='mythic'){
    _eggPetStreak=0;
  } else {
    _eggPetStreak++;
    if(_eggPetStreak>=50){
      _eggPetStreak=0;
      unlockEgg('egg_petcomfort','secret_11');
    }
  }
}

// ══ 10. 새벽의 방문자 & 11. 크리스마스 손님 — 실시간 날짜 기반 ══
setInterval(checkDateBasedEggs,7000);
function checkDateBasedEggs(){
  const scr=document.querySelector('.screen.on')?.id;
  if(scr!=='sLobby')return;
  const now=new Date();
  // 자정(00:00~00:04) 방문
  if(now.getHours()===0&&now.getMinutes()<5){
    const key='hd_egg_midnight_'+now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
    if(!localStorage.getItem(key)){
      localStorage.setItem(key,'1');
      unlockEgg('egg_midnight','secret_12');
      showEggToast('🌙 자정의 로비. 아무도 없는 줄 알았는데...');
    }
  }
  // 크리스마스(12/24~12/25) 산타 카메오
  if(now.getMonth()===11&&(now.getDate()===24||now.getDate()===25)){
    const dayKey='hd_egg_xmas_'+now.getFullYear()+'-'+now.getDate();
    if(!localStorage.getItem(dayKey)&&!_eggSantaShown){
      spawnSantaCameo(dayKey);
    }
  }
  // 새해 첫날(1/1) 방문
  if(now.getMonth()===0&&now.getDate()===1){
    const nyKey='hd_egg_newyear_'+now.getFullYear();
    if(!localStorage.getItem(nyKey)){
      localStorage.setItem(nyKey,'1');
      unlockEgg('egg_newyear','secret_29');
      showEggToast('🌅 새해 복 많이 받으세요, 생존자님.');
    }
  }
}
let _eggSantaShown=false;
function spawnSantaCameo(dayKey){
  _eggSantaShown=true;
  const el=document.createElement('div');
  el.textContent='🎅';
  el.style.cssText='position:fixed;bottom:60px;left:-60px;font-size:32px;z-index:9997;cursor:pointer;transition:left 9s linear;filter:drop-shadow(0 0 6px rgba(0,0,0,.4));';
  document.body.appendChild(el);
  requestAnimationFrame(()=>{el.style.left='calc(100vw + 60px)';});
  let caught=false;
  el.addEventListener('click',()=>{
    if(caught)return;
    caught=true;
    localStorage.setItem(dayKey,'1');
    unlockEgg('egg_xmas','secret_13');
    el.remove();
  });
  setTimeout(()=>{if(!caught)el.remove();_eggSantaShown=false;},9200);
}

// ══ 12. 고요 속의 외침 — BGM ON/OFF 연타 ══
(function(){
  const btn=document.getElementById('bgmToggleBtn');
  if(!btn)return;
  let clicks=0,resetT=null;
  btn.addEventListener('click',()=>{
    clicks++;
    clearTimeout(resetT);
    resetT=setTimeout(()=>{clicks=0;},3000);
    if(clicks>=7){
      clicks=0;
      unlockEgg('egg_bgmtoggle','secret_15');
    }
  });
})();

// ══ 13. 성실함의 증표 — 일일 퀘스트 7일 연속 올클리어 ══
function trackDailyStreak(){
  if(typeof dailyQuestData==='undefined'||!dailyQuestData)return;
  const allClaimed=dailyQuestData.quests.every(qid=>dailyQuestData.claimed[qid]);
  if(!allClaimed)return;
  const rec=lJ('hd_egg_dailystreak',{lastDate:'',streak:0});
  const today=todayKey();
  if(rec.lastDate===today)return;
  const[y,m,d]=today.split('-').map(Number);
  const yst=new Date(y,m-1,d-1);
  const yKey=`${yst.getFullYear()}-${yst.getMonth()+1}-${yst.getDate()}`;
  rec.streak=(rec.lastDate===yKey)?rec.streak+1:1;
  rec.lastDate=today;
  sv('hd_egg_dailystreak',rec);
  if(rec.streak>=7){
    rec.streak=0;
    sv('hd_egg_dailystreak',rec);
    unlockEgg('egg_dailystreak','secret_16');
  }
}

// ══ 14. 포기하지 않는 마음 — 초기화 취소 10연속 ══
let _eggCancelStreak=0;
function trackCancelReset(){
  _eggCancelStreak++;
  if(_eggCancelStreak>=10){
    _eggCancelStreak=0;
    unlockEgg('egg_nevergiveup','secret_17');
  }
}

// ══════════════ 신규 5종 (스토리 / 감동 / 호러) ══════════════

// ══ 15. (호러) 누군가 당신 뒤에 있다 — HP 1로 5초간 생존 ══
let _eggHp1Sec=0,_eggHp1Triggered=false;
setInterval(()=>{
  if(typeof running==='undefined'||!running||(typeof paused!=='undefined'&&paused)||typeof P==='undefined'||!P){
    _eggHp1Sec=0;_eggHp1Triggered=false;return;
  }
  if(P.hp>0&&P.hp<=1){
    _eggHp1Sec++;
  } else {
    _eggHp1Sec=0;_eggHp1Triggered=false;
  }
  if(_eggHp1Sec>=5&&!_eggHp1Triggered){
    _eggHp1Triggered=true;
    triggerBehindYou();
  }
},1000);
function triggerBehindYou(){
  const flash=document.createElement('div');
  flash.style.cssText='position:fixed;inset:0;background:#000;z-index:9600;opacity:0;transition:opacity .08s;pointer-events:none;';
  document.body.appendChild(flash);
  const eyeImg=(typeof EYE1!=='undefined')?[EYE1,EYE2,EYE3].filter(Boolean)[Math.floor(Math.random()*3)]:null;
  const silhouette=document.createElement('div');
  silhouette.style.cssText='position:fixed;top:50%;left:50%;width:120px;height:120px;transform:translate(-50%,-50%) scale(0.8);border-radius:50%;background:#000;opacity:0;z-index:9601;pointer-events:none;box-shadow:0 0 60px 20px rgba(0,0,0,.8);overflow:hidden;';
  if(eyeImg){
    const img=document.createElement('img');
    img.src=eyeImg;
    img.style.cssText='width:100%;height:100%;object-fit:cover;filter:grayscale(100%) contrast(1.3) brightness(.6);opacity:.85;';
    silhouette.appendChild(img);
  }
  document.body.appendChild(silhouette);
  requestAnimationFrame(()=>{flash.style.opacity='0.9';silhouette.style.opacity='1';});
  setTimeout(()=>{
    flash.style.transition='opacity .5s';silhouette.style.transition='opacity .5s,transform .5s';
    flash.style.opacity='0';silhouette.style.opacity='0';silhouette.style.transform='translate(-50%,-50%) scale(1.3)';
  },140);
  setTimeout(()=>{flash.remove();silhouette.remove();},700);
  unlockEgg('egg_behind','secret_19');
}

// ══ 16. (감동) 돌아온 자리 — 14일 이상의 공백 뒤 복귀 ══
function checkReturnedEgg(){
  const rec=lJ('hd_egg_lastseen',{ts:0});
  const now=Date.now();
  const gap=now-(rec.ts||0);
  const FOURTEEN_DAYS=14*24*60*60*1000;
  if(rec.ts>0&&gap>=FOURTEEN_DAYS){
    setTimeout(()=>{
      unlockEgg('egg_returned','secret_20');
      showEggToast('🕯️ 오랜만이에요. 이 자리는 계속 당신을 기다리고 있었어요.');
    },2000);
  }
  sv('hd_egg_lastseen',{ts:now});
}
checkReturnedEgg();

// ══ 17. (호러/사냥) 13일의 금요일 — 낯선 방문객을 직접 사냥 ══
// ══ 19. (감동) 영원한 동반자 — 같은 펫과 100판 ══
// ══ 20. (호러/감동) 다른 발소리 — 솔로 100판 ══
(function(){
  if(typeof startGame!=='function')return;
  const _origStartGame=startGame;
  startGame=function(){
    _origStartGame();
    trySpawnCursedVisitor();
    trackPetLoyaltyAndSolo();
  };
})();
function trackPetLoyaltyAndSolo(){
  if(selMap&&selMap.campEngine)return; // 디펜스맵은 별도 세션 성격이라 제외
  // 펫 동행 기록
  if(typeof equippedPetId!=='undefined'&&equippedPetId){
    const rec=lJ('hd_egg_petgames',{});
    rec[equippedPetId]=(rec[equippedPetId]||0)+1;
    sv('hd_egg_petgames',rec);
    if(rec[equippedPetId]>=100)unlockEgg('egg_petloyalty','secret_25');
  }
  // 솔로(파티 아님) 게임 기록
  const isPartyGame=(typeof partyBonus!=='undefined')&&partyBonus>1;
  if(!isPartyGame){
    achStats.soloGames=(achStats.soloGames||0)+1;saveAch();
    if(achStats.soloGames>=100)unlockEgg('egg_sologhost','secret_28');
  }
}
let _eggFridaySpawnedToday=false;
function trySpawnCursedVisitor(){
  const now=new Date();
  const isFriday13=now.getDay()===5&&now.getDate()===13;
  if(!isFriday13||_eggFridaySpawnedToday)return;
  if(!selMap||selMap.campEngine||selMap.dream||typeof isDreamMode!=='undefined'&&isDreamMode)return;
  if(typeof zoms==='undefined'||typeof P==='undefined'||!P)return;
  _eggFridaySpawnedToday=true;
  const vx=P.r+Math.random()*(MW-P.r*2), vy=P.r+Math.random()*(MH-P.r*2);
  zoms.push({
    x:vx,y:vy,type:'ghost',r:15,hp:1,maxHp:1,spd:0.4,angle:0,dead:false,dT:0,
    isMinion:false,_dshC:999,_dsh:false,_dvx:0,_dvy:0,_healT:0,_phT:9999,_phased:false,_frz:0,wob:0,
    _cursedVisitor:true
  });
}

// ══ 18. (감동, 캡스톤) 마지막 편지 — 위 16개 이스터에그를 모두 찾은 자에게만 ══
function triggerFinalLetter(){
  if(window._finalLetterRunning)return;
  window._finalLetterRunning=true;
  const overlay=document.createElement('div');
  overlay.style.cssText='position:fixed;inset:0;background:rgba(10,5,20,.97);z-index:9700;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 1.5s;padding:20px;';
  const box=document.createElement('div');
  box.style.cssText='max-width:520px;text-align:center;font-family:"Courier New",monospace;color:#e5e7eb;line-height:2;font-size:clamp(13px,2vw,16px);opacity:0;transition:opacity 2s;';
  box.innerHTML=
    '<div style="font-size:26px;margin-bottom:18px;">🕊️</div>'+
    '<div>당신은 소문만 무성하던 열여섯 개의 흔적을,</div>'+
    '<div>전부 직접 찾아냈습니다.</div><br>'+
    '<div>버전 표기 뒤에서, 콘솔의 어둠 속에서,</div>'+
    '<div>자정의 로비에서, 정지된 전장 한복판에서—</div>'+
    '<div>당신은 매번 멈춰 서서 자세히 들여다봤습니다.</div><br>'+
    '<div style="color:#fbbf24;">그게, 이 세계를 만든 이가 가장 바랐던 것입니다.</div><br>'+
    '<div>여기까지 와줘서, 고마워요.</div>'+
    '<div style="margin-top:18px;font-size:11px;color:#6b7280;">— 호두마루 —</div>';
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  requestAnimationFrame(()=>{overlay.style.opacity='1';});
  setTimeout(()=>{box.style.opacity='1';},900);
  setTimeout(()=>{
    overlay.style.opacity='0';
    setTimeout(()=>{overlay.remove();window._finalLetterRunning=false;},1600);
  },9500);
}

