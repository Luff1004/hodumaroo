// ══════════════════════════════════════════════════════════════════
//  20-storm-zone.js — 폭풍구역 (World 2 Open World Survival)
// ══════════════════════════════════════════════════════════════════

// ── 상수 ──
const SZ_W = 18000, SZ_H = 18000;  // 섬 맵 전체 크기 (7~8분 걷기)
const SZ_PLAYER_SPEED = 3.8;
const SZ_MOB_COUNT    = 4;         // 자연 스폰 유지 수

// ── 상태 변수 ──
let sz = null;  // null이면 폭풍구역 비활성

// ── ㅈ자 섬 정의 (18000x18000 맵) ──
const SZ_LAND = [
  {x:2500, y:1200, w:13000, h:4000}, // 윗 가로줄 (북쪽)
  {x:2200, y:4500, w:4500, h:11500}, // 왼쪽 팔 (서쪽)
  {x:12000,y:4500, w:5500, h:12500}, // 오른쪽 팔 (동/남)
  {x:6500, y:4000, w:6000, h:2500},  // 가운데 연결 (상)
  {x:6700, y:6000, w:5300, h:6500},  // 중앙 섬 (건물·시작 구역)
];

function szIsOnLand(wx, wy) {
  for (const r of SZ_LAND) {
    if (wx >= r.x && wx <= r.x + r.w && wy >= r.y && wy <= r.y + r.h) return true;
  }
  return false;
}

// ── 보스 정의 (18000x18000 맵 기준) ──
const SZ_BOSS_DEFS = {
  golem: {
    name: '폭풍의 골렘', dir: '동',
    x: 14200, y: 8800,   // 오른쪽 팔 중앙
    dungeonEntry: {x:13500, y:6800}, // 플레이어가 가까이 오면 입장 프롬프트
    dungeonRect:  {x:12200, y:5200, w:3500, h:3000}, // 입장 감지 영역 (큰 구역)
    bossRect:     {x:13000, y:8000, w:2400, h:1800},
    col: '#b45309', col2: '#78350f',
    hp: 3200, r: 70,
    keyId: 'west_key', keyName: '서쪽 열쇠',
    keyCol: '#818cf8',
    locked: false,
  },
  shadow: {
    name: '폭풍의 그림자', dir: '서',
    x: 3600, y: 8800,   // 왼쪽 팔
    dungeonEntry: {x:4200, y:6800},
    dungeonRect:  {x:2200, y:5200, w:3500, h:3000},
    bossRect:     {x:2400, y:8000, w:2400, h:1800},
    col: '#4338ca', col2: '#1e1b4b',
    hp: 4200, r: 64,
    keyId: 'south_key', keyName: '남쪽 열쇠',
    keyCol: '#34d399',
    locked: true,
    requiredKey: 'west_key',
  },
  wanderer: {
    name: '폭풍의 방랑자', dir: '남',
    x: 14200, y: 14500, // 오른쪽 팔 남쪽
    dungeonEntry: {x:13500, y:12500},
    dungeonRect:  {x:12200, y:12000, w:3500, h:2500},
    bossRect:     {x:13000, y:14000, w:2400, h:1800},
    col: '#065f46', col2: '#022c22',
    hp: 5400, r: 62,
    keyId: 'north_key', keyName: '북쪽 열쇠',
    keyCol: '#fbbf24',
    locked: true,
    requiredKey: 'south_key',
  },
  spider: {
    name: '폭풍의 사이클론 거미', dir: '북',
    x: 9000, y: 2200,   // 윗 가로줄 북쪽
    dungeonEntry: {x:9000, y:3600},
    dungeonRect:  {x:6800, y:1200, w:4500, h:2500},
    bossRect:     {x:7800, y:1800, w:2400, h:1500},
    col: '#7c3aed', col2: '#2e1065',
    hp: 7000, r: 80,
    keyId: 'rooftop_key', keyName: '옥상 열쇠',
    keyCol: '#f472b6',
    locked: true,
    requiredKey: 'north_key',
  },
};

// 섬 위 건물 (엔딩 상호작용)
const SZ_BUILDING = {x: 8600, y: 10500, w: 1000, h: 750};

// ── 던전 동굴 레이아웃 (각 보스별 미로 복도) ──
// 좌표계: 0~4000 x 0~5000 (로컬 동굴 공간)
// 복도(rects)가 미로를 형성, player가 걸어서 이동
const SZ_CAVE_DEFS = {
  golem: {
    // 골렘 동굴 — 넓은 석굴, 십자형 미로
    w: 4000, h: 5000,
    entrance: {x: 2000, y: 4600},
    bossPos:  {x: 2000, y: 1200},
    col: '#5c3a10', floorCol: '#3d2b0f',
    corridors: [
      {x:1400, y:4000, w:1200, h:1000},  // 입구 (넓음)
      {x:1400, y:3200, w:1200, h:900},   // 메인 통로
      {x:400,  y:3200, w:1100, h:700},   // 서쪽 분기
      {x:400,  y:2500, w:700,  h:800},   // 서쪽 막힌길
      {x:2500, y:3200, w:1100, h:700},   // 동쪽 분기
      {x:2800, y:2500, w:700,  h:800},   // 동쪽 막힌길
      {x:1100, y:2200, w:1800, h:1100},  // 넓은 홀 (중앙)
      {x:1400, y:1200, w:1200, h:1100},  // 보스 접근로
      {x:1000, y:700,  w:2000, h:700},   // 보스룸
    ],
  },
  shadow: {
    // 그림자 동굴 — 구불구불 미로
    w: 4000, h: 5000,
    entrance: {x: 2000, y: 4600},
    bossPos:  {x: 2000, y: 1100},
    col: '#1e1b4b', floorCol: '#13113a',
    corridors: [
      {x:1400, y:4000, w:1200, h:1000},  // 입구
      {x:400,  y:3500, w:1100, h:600},   // 서쪽 우회
      {x:400,  y:2800, w:700,  h:800},   // 서쪽 막힌길
      {x:1400, y:3200, w:1200, h:900},   // 메인 통로
      {x:2500, y:3200, w:1100, h:600},   // 동쪽 우회
      {x:2800, y:2400, w:700,  h:900},   // 동쪽 막힌길
      {x:1000, y:2200, w:2000, h:1100},  // 중앙 홀
      {x:1400, y:1300, w:1200, h:1000},  // 보스 접근로
      {x:1000, y:700,  w:2000, h:700},   // 보스룸
    ],
  },
  wanderer: {
    // 방랑자 동굴 — 열린 넓은 공간
    w: 4000, h: 5000,
    entrance: {x: 2000, y: 4600},
    bossPos:  {x: 2000, y: 1050},
    col: '#022c22', floorCol: '#011a14',
    corridors: [
      {x:1300, y:3900, w:1400, h:1100},  // 입구 (매우 넓음)
      {x:300,  y:3100, w:3400, h:900},   // 가로 홀
      {x:300,  y:2200, w:800,  h:1000},  // 서쪽 통로
      {x:2900, y:2200, w:800,  h:1000},  // 동쪽 통로
      {x:1200, y:1800, w:1600, h:1500},  // 중앙 대형 홀
      {x:1200, y:700,  w:1600, h:1200},  // 보스룸
    ],
  },
  spider: {
    // 거미 동굴 — 방사형 거미줄 구조
    w: 4000, h: 5000,
    entrance: {x: 2000, y: 4600},
    bossPos:  {x: 2000, y: 1100},
    col: '#2e1065', floorCol: '#1a0a3d',
    corridors: [
      {x:1400, y:4000, w:1200, h:1000},  // 입구
      {x:400,  y:3400, w:1100, h:700},   // 서쪽 branch
      {x:2500, y:3400, w:1100, h:700},   // 동쪽 branch
      {x:400,  y:2700, w:700,  h:800},   // 서쪽 막힌길
      {x:2900, y:2700, w:700,  h:800},   // 동쪽 막힌길
      {x:1200, y:3000, w:1600, h:500},   // 연결 통로
      {x:1000, y:2000, w:2000, h:1100},  // 중앙 거미 홀
      {x:1400, y:1200, w:1200, h:900},   // 보스 접근로
      {x:1000, y:700,  w:2000, h:700},   // 보스룸
    ],
  },
};

// ── 폭풍구역 진입 ──
function enterStormZone() {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;

  // 로비/맵선택 UI 숨기기
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('on');
    s.style.display = '';
  });
  canvas.style.display = 'block';
  // 캔버스 크기 보장 (엔진 resize 함수 재호출)
  if (typeof resize === 'function') resize();
  if (!canvas.width || !canvas.height) {
    canvas.width  = window.innerWidth  || 1280;
    canvas.height = window.innerHeight || 720;
  }
  document.getElementById('gameUI').style.display = 'block';
  document.getElementById('pauseBtn').style.display = 'block';
  // 웨이브 버튼 숨기기 (파도 없음)
  const wsBtn = document.getElementById('waveSpeedBtn');
  if (wsBtn) wsBtn.style.display = 'none';

  // 업적 진입 기록 (폭풍 진입 업적만 직접 처리, 전체 checkAchievements 호출 금지)
  if (typeof achStats !== 'undefined') {
    achStats.stormEntries = (achStats.stormEntries || 0) + 1;
    if (typeof saveAch === 'function') saveAch();
    if ((achStats.stormEntries) >= 1 && typeof achData !== 'undefined' && !achData['storm_enter']) {
      achData['storm_enter'] = true;
      const _ach = ACHIEVEMENTS.find(a => a.id === 'storm_enter');
      if (_ach) { grantAchReward(_ach); if (typeof setMsg === 'function') setMsg('🏆 업적 달성: 폭풍 속으로!'); }
      if (typeof saveAch === 'function') saveAch();
    }
  }

  // 상태 초기화
  sz = {
    // 플레이어
    px: 9000, py: 10500,   // 중앙 섬 시작
    pa: 0,
    pHp: 200, pMaxHp: 200,
    pSpd: SZ_PLAYER_SPEED,
    pAmmo: 30, pMaxAmmo: 30,
    pReload: 0, pReloadMax: 90,
    pFireT: 0,

    // 카메라
    camX: 0, camY: 0,

    // 오브젝트
    mobs: [], bullets: [], parts: [], effects: [],
    keys: [],   // 획득한 열쇠 목록

    // 보스 상태
    bossState: {},   // { golem: 'idle'|'dungeon'|'boss'|'dead', ... }
    activeBoss: null,
    bossHp: 0,
    bossMaxHp: 0,
    bossDoor: false, // 보스방 문 닫힘 여부

    // 던전 상태
    dungeonActive: null,   // null | 'golem' | 'shadow' | 'wanderer' | 'spider'
    dungeonMobs: 0,
    dungeonDone: false,

    // 동굴 모드 (던전 진입 시)
    caveMode: false,
    cave: null,            // { def, px, py, camX, camY, mobs, bossSpawned }
    savedWorldPx: 9000, savedWorldPy: 10500, // 동굴 진입 전 월드 좌표 저장

    // 보라색 연기 파티클
    smokeTimer: 0,
    smokeParticles: [],

    // 데미지 쿨다운
    playerDmgT: 0,

    // 폭풍 지속 피해 (갑옷 없으면)
    stormDmgT: 0,
    hasStormArmor: (typeof eqArmor !== 'undefined' && (eqArmor === 'storm_worksuit' || eqArmor === 'storm_worksuit_ultimate')),
    hasToxicAK: (typeof eqWepId !== 'undefined' && eqWepId === 'toxic_ak'),
    // HP 재생 타이머 (3초=180프레임마다 2HP)
    regenT: 0,

    // 기타
    interactPrompt: null,
    score: 0,
    running: true,
    mobSpawnT: 0,

    // 알림 메시지
    msg: '', msgT: 0,

    // 마우스 초기 위치 (캔버스 중앙)
    _mouseX: (document.getElementById('gameCanvas')?.width  || 1280) / 2,
    _mouseY: (document.getElementById('gameCanvas')?.height || 720)  / 2,
    _mdown: false,
  };

  // 초기 보스 상태 설정
  for (const id of Object.keys(SZ_BOSS_DEFS)) {
    sz.bossState[id] = 'idle';
  }

  // BGM
  if (typeof stopBGM === 'function') stopBGM();

  // 스톰 루프 시작
  szRunLoop();
}

// ── [DEV] 폭풍구역 엔딩 바로 확인 ──
function devStormEnding() {
  enterStormZone();
  setTimeout(() => { if (sz && sz.running) szTriggerEnding(); }, 300);
}

// ── 폭풍구역 종료 ──
function exitStormZone(won) {
  if (!sz) return;
  sz.running = false;
  sz = null;
  szStopLoop();

  // UI 복원
  document.getElementById('gameCanvas').style.display = 'none';
  document.getElementById('gameUI').style.display = 'none';
  document.getElementById('pauseBtn').style.display = 'none';
  if (typeof go === 'function') go('sLobby');
}

// ── 메인 루프 (hidden tab 폴백 포함) ──
function szRunLoop(ts) {
  if (!sz || !sz.running) return;
  szUpdate();
  szDraw();
  if (document.hidden) {
    // 탭이 숨겨진 경우 setTimeout으로 ~60fps 폴백
    _szRaf = setTimeout(() => szRunLoop(performance.now()), 16);
  } else {
    _szRaf = requestAnimationFrame(szRunLoop);
  }
}
function szStopLoop() {
  if (_szRaf !== null) { cancelAnimationFrame(_szRaf); clearTimeout(_szRaf); _szRaf = null; }
}

// ── 업데이트 ──
function szUpdate() {
  if (!sz || !sz.running) return;
  if (sz._dying) return;
  if (sz.caveMode) { szUpdateCave(); return; }
  const s = sz;

  // ── 입력 ──
  let dx = 0, dy = 0;
  if (keys['w'] || keys['arrowup'])    dy--;
  if (keys['s'] || keys['arrowdown'])  dy++;
  if (keys['a'] || keys['arrowleft'])  dx--;
  if (keys['d'] || keys['arrowright']) dx++;
  if (typeof touchDX !== 'undefined') { dx += touchDX; dy += touchDY; }
  const mag = Math.hypot(dx, dy);
  if (mag > 1) { dx /= mag; dy /= mag; }

  // ── 플레이어 이동 (육지 체크) ──
  const nx = Math.max(50, Math.min(SZ_W - 50, s.px + dx * s.pSpd));
  const ny = Math.max(50, Math.min(SZ_H - 50, s.py + dy * s.pSpd));
  if (szIsOnLand(nx, ny)) { s.px = nx; s.py = ny; }
  else if (szIsOnLand(nx, s.py)) { s.px = nx; }
  else if (szIsOnLand(s.px, ny)) { s.py = ny; }

  // ── 카메라 ──
  const canvas = document.getElementById('gameCanvas');
  const cvW = canvas.width, cvH = canvas.height;
  const targCamX = s.px - cvW / 2;
  const targCamY = s.py - cvH / 2;
  s.camX += (Math.max(0, Math.min(SZ_W - cvW, targCamX)) - s.camX) * 0.12;
  s.camY += (Math.max(0, Math.min(SZ_H - cvH, targCamY)) - s.camY) * 0.12;

  // ── 플레이어 조준 (마우스 화면 좌표 기준) ──
  if (s._mouseX !== undefined) {
    const screenPX = s.px - s.camX;
    const screenPY = s.py - s.camY;
    s.pa = Math.atan2(s._mouseY - screenPY, s._mouseX - screenPX);
  }

  // ── 폭풍 지속 피해 ──
  if (!s.hasStormArmor) {
    s.stormDmgT++;
    if (s.stormDmgT >= 18) {
      s.stormDmgT = 0;
      szDamagePlayer(4, '#ff4444');
      if (!s._stormWarnShown) {
        szSetMsg('⚠️ 폭풍 작업복 없이 폭풍구역 진입! 폭풍의 영향으로 지속 피해!', 4000);
        s._stormWarnShown = true;
      }
    }
  }

  // ── HP 재생 (3초=180프레임마다 2HP) ──
  s.regenT++;
  if (s.regenT >= 180) {
    s.regenT = 0;
    if (s.pHp < s.pMaxHp) {
      s.pHp = Math.min(s.pMaxHp, s.pHp + 2);
    }
  }

  // ── 상호작용 [E] ──
  s.interactPrompt = null;
  if (!s.activeBoss) {
    szCheckInteract();
  }

  // ── 보스 업데이트 ──
  if (s.activeBoss) {
    szUpdateBoss();
  } else {
    // ── 일반 몹 스폰 (섬에 4마리 유지) ──
    const liveMobs = s.mobs.filter(m => !m.dead);
    if (liveMobs.length < SZ_MOB_COUNT) {
      s.mobSpawnT++;
      if (s.mobSpawnT >= 120) {
        s.mobSpawnT = 0;
        szSpawnMob();
      }
    }
  }

  // ── 몹 업데이트 ──
  szUpdateMobs();

  // ── 총알 업데이트 ──
  szUpdateBullets();

  // ── 파티클 ──
  s.parts = s.parts.filter(p => p.l > 0);
  s.parts.forEach(p => { p.x += p.vx; p.y += p.vy; p.l--; p.vy *= 0.95; });

  // ── 보라색 연기 ──
  s.smokeTimer++;
  if (s.smokeTimer % 8 === 0) {
    s.smokeParticles.push({
      x: s.px + (Math.random() - 0.5) * 600,
      y: s.py + (Math.random() - 0.5) * 500,
      r: 20 + Math.random() * 40,
      a: 0.12 + Math.random() * 0.08,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.3 - Math.random() * 0.3,
      l: 180 + Math.random() * 120,
      ml: 200,
    });
  }
  s.smokeParticles = s.smokeParticles.filter(p => p.l > 0);
  s.smokeParticles.forEach(p => { p.x += p.vx; p.y += p.vy; p.l--; });

  // ── 이펙트 ──
  s.effects = s.effects.filter(e => e.l > 0);
  s.effects.forEach(e => e.l--);

  // ── 메시지 타이머 ──
  if (s.msgT > 0) s.msgT--;
  if (s.msgT <= 0) s.msg = '';

  // ── 데미지 타이머 ──
  if (s.playerDmgT > 0) s.playerDmgT--;

  // ── ESC: 폭풍구역 종료 ──
  if (keys['escape']) { keys['escape'] = false; exitStormZone(false); return; }

  // ── 죽음 판정 ──
  if (s.pHp <= 0 && !s._dying) {
    szDie();
  }

  // ── 재장전 ──
  if (s.pReload > 0) {
    s.pReload--;
    if (s.pReload <= 0) {
      s.pAmmo = s.pMaxAmmo;
      szSetMsg('장전 완료!', 800);
    }
  }

  // R키 수동 재장전
  if ((keys['r'] || keys['R']) && s.pReload <= 0 && s.pAmmo < s.pMaxAmmo) {
    keys['r'] = false; keys['R'] = false;
    s.pReload = s.pReloadMax;
    szSetMsg('재장전 중...', 1500);
  }

  // ── 발사 ──
  s.pFireT++;
  if (s._mdown) {
    if (s.pReload <= 0 && s.pAmmo > 0 && s.pFireT >= 8) {
      s.pFireT = 0;
      szFirePlayer();
    } else if (s.pReload <= 0 && s.pAmmo <= 0) {
      s.pReload = s.pReloadMax;
      szSetMsg('재장전 중...', 1500);
    }
  }
}

// ── 상호작용 체크 ──
function szCheckInteract() {
  const s = sz;
  const pr = 180;

  for (const [id, bd] of Object.entries(SZ_BOSS_DEFS)) {
    if (s.bossState[id] === 'dead') continue;
    const bs = s.bossState[id];

    if (bs === 'idle') {
      // 던전 입구
      const dr = bd.dungeonRect;
      if (s.px > dr.x && s.px < dr.x + dr.w && s.py > dr.y && s.py < dr.y + dr.h) {
        if (bd.locked) {
          // 필요한 열쇠를 가진 보스 이름 찾기
          const reqBoss = Object.values(SZ_BOSS_DEFS).find(b => b.keyId === bd.requiredKey);
          s.interactPrompt = `🔒 ${reqBoss ? reqBoss.name + ' 처치 필요' : '잠김'}`;
        } else {
          s.interactPrompt = `[E] ${bd.dir}쪽 던전 입장 — ${bd.name}`;
          if (keys['e'] || keys['E']) {
            keys['e'] = false; keys['E'] = false;
            szEnterDungeon(id);
          }
        }
        return;
      }
    }
  }

  // 건물 상호작용 (옥상 열쇠 가지고 있으면)
  const bl = SZ_BUILDING;
  if (s.px > bl.x && s.px < bl.x + bl.w && s.py > bl.y && s.py < bl.y + bl.h) {
    if (s.keys.includes('rooftop_key')) {
      s.interactPrompt = '[E] 건물 진입 — 엔딩';
      if (keys['e'] || keys['E']) {
        keys['e'] = false; keys['E'] = false;
        szTriggerEnding();
      }
    } else {
      s.interactPrompt = '🔒 옥상 열쇠 필요 — 북쪽 보스를 처치하세요';
    }
    return;
  }
}

// ── 던전 진입 (동굴 미로) ──
function szEnterDungeon(bossId) {
  const s = sz;
  const bd = SZ_BOSS_DEFS[bossId];
  const caveDef = SZ_CAVE_DEFS[bossId];

  s.bossState[bossId] = 'dungeon';
  s.dungeonActive = bossId;

  // 월드 위치 저장
  s.savedWorldPx = s.px;
  s.savedWorldPy = s.py;

  // 동굴 모드 진입
  s.caveMode = true;
  s.mobs = [];
  s.bullets = [];

  // 보스 테마별 초기 동굴 몹
  const caveMobs = [];
  const mobCfg = {
    golem:    { count:5, hp:60,  r:14, col:'#b45309', desc:'돌 조각' },
    shadow:   { count:5, hp:45,  r:12, col:'#4338ca', desc:'그림자 조각' },
    wanderer: { count:4, hp:50,  r:13, col:'#065f46', desc:'방랑 슬라임' },
    spider:   { count:6, hp:35,  r:10, col:'#5b21b6', desc:'아기 거미' },
  }[bossId] || { count:4, hp:50, r:12, col:'#6b7280', desc:'동굴 몹' };

  // 입구 주변 복도 (0~2번)에서만 스폰 — 입구에서 가까운 곳에 배치
  const spawnCorridors = caveDef.corridors.slice(0, 3);
  for (let i = 0; i < mobCfg.count; i++) {
    const corr = spawnCorridors[i % spawnCorridors.length];
    // 입구(entrance.y)와 가까운 쪽에 스폰
    const mx = corr.x + 20 + Math.random() * Math.max(0, corr.w - 40);
    const my = corr.y + 20 + Math.random() * Math.max(0, corr.h - 40);
    caveMobs.push({
      x: mx, y: my,
      hp: mobCfg.hp, maxHp: mobCfg.hp,
      r: mobCfg.r, angle: 0,
      atkT: Math.floor(Math.random() * 40),
      dead: false,
      col: mobCfg.col,
      cave: true,
    });
  }

  // 카메라를 플레이어 시작 위치에 즉시 맞춤 (0,0에서 시작하면 화면 밖에서 시작해 막혀 보임)
  const cvW0 = (document.getElementById('gameCanvas') || {}).width || 1280;
  const cvH0 = (document.getElementById('gameCanvas') || {}).height || 720;
  const initCamX = Math.max(0, Math.min(caveDef.w - cvW0, caveDef.entrance.x - cvW0 / 2));
  const initCamY = Math.max(0, Math.min(caveDef.h - cvH0, caveDef.entrance.y - cvH0 / 2));

  s.cave = {
    bossId,
    def: caveDef,
    px: caveDef.entrance.x,
    py: caveDef.entrance.y,
    camX: initCamX, camY: initCamY,
    mobs: caveMobs,
    bullets: [],
    bossSpawned: false,
    boss: null,
  };

  szSetMsg(`🕳️ ${bd.name}의 동굴에 진입했다! 보스를 찾아라.`, 3000);
}

// ── 동굴에서 나가기 ──
function szExitCave(victory) {
  const s = sz;
  if (!s.caveMode) return;
  s.caveMode = false;
  s.cave = null;
  s.bullets = [];
  // 월드 위치 복원
  s.px = s.savedWorldPx;
  s.py = s.savedWorldPy;
  if (!victory) {
    szSetMsg('동굴에서 탈출했다.', 2000);
  }
}

// ── 보스 업데이트 ──
function szUpdateBoss() {
  const s = sz;
  const b = s.activeBoss;
  if (!b || b.dead) return;

  b.stateT++;
  const px = s.px, py = s.py;
  const dx = px - b.x, dy = py - b.y;
  const dist = Math.hypot(dx, dy) || 1;
  const id = b.id;

  if (b.state === 'intro') {
    if (b.stateT > 90) { b.state = 'fight'; b.stateT = 0; }
    return;
  }

  // ── 골렘: 황소 돌진 ──
  if (id === 'golem') {
    if (b._chargeT > 0) {
      b._chargeT--;
      b.x += b._chargeV.vx;
      b.y += b._chargeV.vy;
      b.x = Math.max(b.def.bossRect.x + b.r, Math.min(b.def.bossRect.x + b.def.bossRect.w - b.r, b.x));
      b.y = Math.max(b.def.bossRect.y + b.r, Math.min(b.def.bossRect.y + b.def.bossRect.h - b.r, b.y));
      // 플레이어와 충돌
      if (Math.hypot(px - b.x, py - b.y) < b.r + 20) {
        szDamagePlayer(25, '#b45309');
      }
    } else {
      b._atkT++;
      // 플레이어 방향 천천히 이동
      const spd = 0.8 + b.phase * 0.4;
      b.x += (dx / dist) * spd;
      b.y += (dy / dist) * spd;
      if (b._atkT >= Math.max(80, 200 - b.phase * 30)) {
        b._atkT = 0;
        b._chargeV = { vx: dx / dist * 11, vy: dy / dist * 11 };
        b._chargeT = 28;
        // 경고 파티클
        for (let i = 0; i < 8; i++) {
          s.parts.push({ x: b.x, y: b.y, vx: Math.cos(i / 8 * Math.PI * 2) * 4, vy: Math.sin(i / 8 * Math.PI * 2) * 4, l: 18, col: '#fbbf24', r: 4 });
        }
      }
      // 근접 피해
      if (dist < b.r + 22) szDamagePlayer(8, '#b45309');
    }
    b.angle = Math.atan2(dy, dx);
  }

  // ── 그림자: 빠른 이동 + 분신 소환 ──
  else if (id === 'shadow') {
    b._atkT++;
    // 빠른 이동 (페이즈별로 빨라짐)
    const spd = 2.5 + b.phase * 0.8;
    const wobble = Math.sin(b.stateT * 0.08) * 80;
    const tx = px + Math.cos(b.stateT * 0.04) * wobble;
    const ty = py + Math.sin(b.stateT * 0.04) * wobble;
    const tdx = tx - b.x, tdy = ty - b.y;
    const td = Math.hypot(tdx, tdy) || 1;
    b.x += (tdx / td) * spd;
    b.y += (tdy / td) * spd;
    b.x = Math.max(b.def.bossRect.x + b.r, Math.min(b.def.bossRect.x + b.def.bossRect.w - b.r, b.x));
    b.y = Math.max(b.def.bossRect.y + b.r, Math.min(b.def.bossRect.y + b.def.bossRect.h - b.r, b.y));

    // 5발 탄 발사
    if (b._atkT >= Math.max(40, 100 - b.phase * 15)) {
      b._atkT = 0;
      const ang = Math.atan2(py - b.y, px - b.x);
      for (let i = -2; i <= 2; i++) {
        const a = ang + i * 0.18;
        s.bullets.push({ x: b.x, y: b.y, vx: Math.cos(a) * 9, vy: Math.sin(a) * 9, w: 4, h: 14, angle: a, col: '#818cf8', en: true, dmg: 12, l: 200, isRect: true });
      }
    }
    // 분신 소환 (페이즈 2 이상)
    if (b.phase >= 1 && b._atkT === 0 && Math.random() < 0.05) {
      szSpawnShadowClone(b);
    }
    if (dist < b.r + 20) szDamagePlayer(6, '#4338ca');
    b.angle = Math.atan2(dy, dx);
  }

  // ── 방랑자: 저격 + 이동 회피 ──
  else if (id === 'wanderer') {
    b._atkT++;
    b._sniperT++;
    // 플레이어 반대로 이동 (회피)
    const evadeDx = -dx / dist, evadeDy = -dy / dist;
    const perpX = -evadeDy, perpY = evadeDx;
    const evade = Math.sin(b.stateT * 0.05);
    const spd = 1.8 + b.phase * 0.5;
    b.x += (evadeDx * 0.6 + perpX * evade) * spd;
    b.y += (evadeDy * 0.6 + perpY * evade) * spd;
    b.x = Math.max(b.def.bossRect.x + b.r, Math.min(b.def.bossRect.x + b.def.bossRect.w - b.r, b.x));
    b.y = Math.max(b.def.bossRect.y + b.r, Math.min(b.def.bossRect.y + b.def.bossRect.h - b.r, b.y));

    // 저격탄 (빠른 직선)
    if (b._sniperT >= Math.max(60, 160 - b.phase * 25)) {
      b._sniperT = 0;
      // 경고 선 (미리 조준 효과)
      s.effects.push({ type: 'sniper_aim', x1: b.x, y1: b.y, x2: px, y2: py, l: 30, ml: 30 });
      const ang = Math.atan2(py - b.y, px - b.x);
      // 0.5초 후 실제 발사
      setTimeout(() => {
        if (!sz || !sz.activeBoss) return;
        s.bullets.push({ x: b.x, y: b.y, vx: Math.cos(ang) * 16, vy: Math.sin(ang) * 16, w: 4, h: 22, angle: ang, col: '#10b981', en: true, dmg: 40, l: 200, isRect: true });
      }, 500);
    }
    b.angle = Math.atan2(dy, dx);
  }

  // ── 사이클론 거미: 미니 거미 소환 + 독 ──
  else if (id === 'spider') {
    b._atkT++;
    b._spiderT++;
    // 느린 이동
    const spd = 0.6 + b.phase * 0.3;
    b.x += (dx / dist) * spd;
    b.y += (dy / dist) * spd;
    b.x = Math.max(b.def.bossRect.x + b.r, Math.min(b.def.bossRect.x + b.def.bossRect.w - b.r, b.x));
    b.y = Math.max(b.def.bossRect.y + b.r, Math.min(b.def.bossRect.y + b.def.bossRect.h - b.r, b.y));

    // 독 안개 발산
    if (b._atkT >= 90) {
      b._atkT = 0;
      s.effects.push({ type: 'poison_cloud', x: b.x, y: b.y, r: 80, l: 300, ml: 300, dmgT: 0 });
    }
    // 미니 거미 소환
    if (b._spiderT >= Math.max(120, 300 - b.phase * 60)) {
      b._spiderT = 0;
      for (let i = 0; i < 3 + b.phase * 2; i++) {
        const ang = Math.random() * Math.PI * 2;
        const d = 50 + Math.random() * 80;
        szSpawnMiniSpider(b.x + Math.cos(ang) * d, b.y + Math.sin(ang) * d);
      }
    }
    if (dist < b.r + 22) { szDamagePlayer(4, '#7c3aed'); }
    b.angle = Math.atan2(dy, dx);
  }

  // ── 공통: 페이즈 전환 ──
  const hpPct = b.hp / b.maxHp;
  const newPhase = hpPct < 0.25 ? 3 : hpPct < 0.5 ? 2 : hpPct < 0.75 ? 1 : 0;
  if (newPhase > b.phase) {
    b.phase = newPhase;
    szSetMsg(`💀 페이즈 ${b.phase + 1}!`, 2000);
  }

  // ── 보스 플레이어 총알 판정 ──
  s.bullets = s.bullets.filter(bul => {
    if (bul.en) return true;
    if (b.dead) return true;
    if (Math.hypot(bul.x - b.x, bul.y - b.y) < b.r + (bul.r || 6)) {
      b.hp -= bul.dmg;
      for (let i = 0; i < 4; i++) s.parts.push({ x: bul.x, y: bul.y, vx: (Math.random()-0.5)*5, vy: (Math.random()-0.5)*5, l: 14, col: b.def.col, r: 3 });
      if (b.hp <= 0) szBossDie();
      return false;
    }
    return true;
  });

  // ── 미니언 업데이트 ──
  if (b.minions) {
    b.minions = b.minions.filter(m => !m.dead);
    b.minions.forEach(m => szUpdateMinion(m));
  }
}

// ── 보스 사망 ──
function szBossDie() {
  const s = sz;
  const b = s.activeBoss;
  if (!b) return;
  b.dead = true;
  b.hp = 0;
  s.bossState[b.id] = 'dead';

  // 업적 기록
  if (typeof achStats !== 'undefined') {
    if (!achStats.stormBossKills) achStats.stormBossKills = {};
    achStats.stormBossKills[b.id] = (achStats.stormBossKills[b.id] || 0) + 1;
    if (typeof saveAch === 'function') saveAch();
    if (typeof checkAchievements === 'function') checkAchievements();
  }

  // 열쇠 드롭
  const keyId = b.def.keyId;
  if (!s.keys.includes(keyId)) {
    s.keys.push(keyId);
    szSetMsg(`🗝️ ${b.def.keyName} 획득!`, 4000);
  }

  // 다음 보스 잠금 해제
  for (const [id, bd] of Object.entries(SZ_BOSS_DEFS)) {
    if (bd.requiredKey === keyId) {
      bd.locked = false;
    }
  }

  // 대량 파티클
  for (let i = 0; i < 40; i++) {
    const ang = Math.random() * Math.PI * 2;
    s.parts.push({ x: b.x, y: b.y, vx: Math.cos(ang) * (2 + Math.random() * 8), vy: Math.sin(ang) * (2 + Math.random() * 8), l: 40 + Math.random() * 30, col: b.def.col, r: 3 + Math.random() * 5 });
  }

  setTimeout(() => {
    if (!sz) return;
    sz.activeBoss = null;
    sz.bossDoor = false;
    sz.dungeonActive = null;
  }, 2000);
}

// ── 분신 소환 (그림자) ──
function szSpawnShadowClone(boss) {
  const s = sz;
  const br = boss.def.bossRect;
  const cx = br.x + Math.random() * br.w;
  const cy = br.y + Math.random() * br.h;
  if (!boss.minions) boss.minions = [];
  boss.minions.push({
    x: cx, y: cy, hp: 80, maxHp: 80, r: 20,
    angle: 0, atkT: 0, dead: false, type: 'clone',
    col: '#4338ca',
  });
}

// ── 미니 거미 소환 ──
function szSpawnMiniSpider(x, y) {
  const s = sz;
  if (!sz.activeBoss.minions) sz.activeBoss.minions = [];
  sz.activeBoss.minions.push({
    x, y, hp: 40, maxHp: 40, r: 12,
    angle: 0, atkT: 0, dead: false, type: 'spider_mini',
    col: '#7c3aed', poisonT: 0,
  });
}

// ── 미니언 업데이트 ──
function szUpdateMinion(m) {
  const s = sz;
  const px = s.px, py = s.py;
  const dx = px - m.x, dy = py - m.y;
  const dist = Math.hypot(dx, dy) || 1;
  m.angle = Math.atan2(dy, dx);

  if (m.type === 'clone') {
    // 분신: 5발 탄 발사
    const spd = 3.0;
    m.x += (dx / dist) * spd * 0.6;
    m.y += (dy / dist) * spd * 0.6;
    m.atkT++;
    if (m.atkT >= 60) {
      m.atkT = 0;
      const ang = Math.atan2(dy, dx);
      for (let i = -2; i <= 2; i++) {
        const a = ang + i * 0.22;
        s.bullets.push({ x: m.x, y: m.y, vx: Math.cos(a) * 7, vy: Math.sin(a) * 7, w: 3, h: 12, angle: a, col: '#818cf8', en: true, dmg: 8, l: 150, isRect: true });
      }
    }
  } else if (m.type === 'spider_mini') {
    // 미니 거미: 돌진 + 독
    const spd = 2.8;
    m.x += (dx / dist) * spd;
    m.y += (dy / dist) * spd;
    m.poisonT++;
    if (dist < m.r + 20) {
      szDamagePlayer(3, '#7c3aed');
      if (m.poisonT >= 30) { m.poisonT = 0; /* 독 효과 */ }
    }
  }

  // 플레이어 총알 판정
  s.bullets = s.bullets.filter(bul => {
    if (bul.en || m.dead) return true;
    if (Math.hypot(bul.x - m.x, bul.y - m.y) < m.r + (bul.r || 6)) {
      m.hp -= bul.dmg;
      if (m.hp <= 0) m.dead = true;
      return false;
    }
    return true;
  });
}

// ── 일반 몹 스폰 ──
function szSpawnMob() {
  const s = sz;
  // 플레이어 주변 300~600px에 스폰
  let tries = 0;
  while (tries++ < 20) {
    const ang = Math.random() * Math.PI * 2;
    const d = 350 + Math.random() * 250;
    const sx = s.px + Math.cos(ang) * d;
    const sy = s.py + Math.sin(ang) * d;
    if (szIsOnLand(sx, sy)) {
      // 50% 확률로 방사형 몹 (360도 8방향 발사, 저활동)
      if (Math.random() < 0.50) {
        s.mobs.push({
          x: sx, y: sy,
          hp: 60, maxHp: 60,
          r: 16, angle: 0,
          atkT: 0, dead: false,
          col: '#dc2626',
          type: 'radial',   // 방사형 몹
        });
      } else {
        s.mobs.push({
          x: sx, y: sy,
          hp: 80 + Math.random() * 40, maxHp: 120,
          r: 14, angle: 0,
          atkT: 0, dead: false,
          col: '#7c3aed',
        });
      }
      break;
    }
  }
}

// ── 일반 몹 업데이트 ──
function szUpdateMobs() {
  const s = sz;
  s.mobs = s.mobs.filter(m => !m.dead);
  s.mobs.forEach(m => {
    const dx = s.px - m.x, dy = s.py - m.y;
    const dist = Math.hypot(dx, dy) || 1;
    m.angle = Math.atan2(dy, dx);

    // ── 방사형 몹 (저활동, 360도 8발) ──
    if (m.type === 'radial') {
      // 거의 움직이지 않음 (10% 확률로 살짝 이동)
      if (Math.random() < 0.006) {
        const ra = Math.random() * Math.PI * 2;
        m.x += Math.cos(ra) * 0.8;
        m.y += Math.sin(ra) * 0.8;
        if (!szIsOnLand(m.x, m.y)) { m.x -= Math.cos(ra)*0.8; m.y -= Math.sin(ra)*0.8; }
      }
      // 360도 8방향 발사 (180프레임=3초마다)
      m.atkT++;
      if (m.atkT >= 180) {
        m.atkT = 0;
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2;
          s.bullets.push({
            x: m.x, y: m.y,
            vx: Math.cos(a) * 7, vy: Math.sin(a) * 7,
            r: 5, l: 260, en: true, dmg: 5,
            col: '#ef4444',
          });
        }
      }
      // 피격 판정
      s.bullets = s.bullets.filter(bul => {
        if (bul.en || m.dead) return true;
        if (Math.hypot(bul.x - m.x, bul.y - m.y) < m.r + (bul.r || 6)) {
          m.hp -= bul.dmg;
          s.parts.push({ x: bul.x, y: bul.y, vx: (Math.random()-0.5)*4, vy: (Math.random()-0.5)*4, l: 12, col: '#ef4444', r: 3 });
          if (m.hp <= 0) m.dead = true;
          return false;
        }
        return true;
      });
      return;
    }

    // ── 일반 몹 AI: 150~300px 거리 유지 ──
    const keepDist = 200;
    if (dist < keepDist - 20) {
      m.x -= (dx / dist) * 2.2;
      m.y -= (dy / dist) * 2.2;
    } else if (dist > keepDist + 30) {
      m.x += (dx / dist) * 2.8;
      m.y += (dy / dist) * 2.8;
    } else {
      m.x += (-dy / dist) * 1.5 * (Math.sin(Date.now() * 0.001 + m.x) > 0 ? 1 : -1);
      m.y += (dx / dist) * 1.5 * (Math.sin(Date.now() * 0.001 + m.x) > 0 ? 1 : -1);
    }

    // 육지 경계
    if (!szIsOnLand(m.x, m.y)) {
      m.x -= (dx / dist) * 3;
      m.y -= (dy / dist) * 3;
    }

    // 발사 (보라색 직사각형 탄)
    m.atkT++;
    if (m.atkT >= 70 + Math.random() * 40) {
      m.atkT = 0;
      const ang = Math.atan2(dy, dx);
      const noise = (Math.random() - 0.5) * 0.3;
      s.bullets.push({
        x: m.x, y: m.y,
        vx: Math.cos(ang + noise) * 8.5,
        vy: Math.sin(ang + noise) * 8.5,
        w: 3, h: 14, angle: ang + noise,
        col: '#a855f7', en: true, dmg: 4, l: 220,
        isRect: true,
      });
    }

    // 플레이어 총알 판정
    s.bullets = s.bullets.filter(bul => {
      if (bul.en || m.dead) return true;
      if (Math.hypot(bul.x - m.x, bul.y - m.y) < m.r + (bul.r || 6)) {
        m.hp -= bul.dmg;
        s.parts.push({ x: bul.x, y: bul.y, vx: (Math.random()-0.5)*4, vy: (Math.random()-0.5)*4, l: 12, col: '#a855f7', r: 3 });
        if (m.hp <= 0) m.dead = true;
        return false;
      }
      return true;
    });
  });
}

// ── 총알 업데이트 ──
function szUpdateBullets() {
  const s = sz;
  s.bullets = s.bullets.filter(b => b.l > 0);
  s.bullets.forEach(b => {
    b.x += b.vx; b.y += b.vy; b.l--;
    // 플레이어 피격 (적 총알)
    if (b.en && s.playerDmgT <= 0) {
      if (Math.hypot(b.x - s.px, b.y - s.py) < 18 + (b.r || 4)) {
        szDamagePlayer(b.dmg, '#a855f7');
        b.l = 0;
      }
    }
  });

  // 이펙트 독 구름 플레이어 피해
  s.effects.forEach(e => {
    if (e.type === 'poison_cloud') {
      e.dmgT = (e.dmgT || 0) + 1;
      if (e.dmgT >= 40) {
        e.dmgT = 0;
        if (Math.hypot(s.px - e.x, s.py - e.y) < e.r + 18) {
          szDamagePlayer(5, '#7c3aed');
        }
      }
    }
  });
}

// ── 플레이어 발사 ──
function szFirePlayer() {
  const s = sz;
  if (s.pAmmo <= 0) {
    s.pReload = s.pReloadMax;
    szSetMsg('재장전 중...', 1500);
    return;
  }
  s.pAmmo--;
  const ang = s.pa;
  // 독성AK 없으면 데미지 0 (맞춰도 피해 없음)
  const dmg = s.hasToxicAK ? 18 : 0;
  const col = s.hasToxicAK ? '#a855f7' : '#6b7280';
  s.bullets.push({
    x: s.px, y: s.py,
    vx: Math.cos(ang) * 14,
    vy: Math.sin(ang) * 14,
    r: 5, l: 180, en: false, dmg,
    col,
  });
  if (!s.hasToxicAK && s.pFireT % 60 === 0) {
    szSetMsg('☠️ 독성 AK가 없어 데미지가 없음!', 1200);
  }
  s.parts.push({ x: s.px + Math.cos(ang) * 20, y: s.py + Math.sin(ang) * 20, vx: Math.cos(ang) * 3, vy: Math.sin(ang) * 3, l: 6, col, r: 3 });
}

// ── 플레이어 피해 ──
function szDamagePlayer(dmg, col) {
  const s = sz;
  if (s.playerDmgT > 0 && col !== '#ff4444') return; // 무적 (폭풍 피해는 무적 무시)
  s.pHp -= dmg;
  s.playerDmgT = 20;
  // 피격 파티클
  for (let i = 0; i < 5; i++) {
    s.parts.push({ x: s.px + (Math.random()-0.5)*20, y: s.py + (Math.random()-0.5)*20, vx: (Math.random()-0.5)*4, vy: (Math.random()-0.5)*4, l: 14, col: col || '#ef4444', r: 3 });
  }
}

// ── 메시지 ──
function szSetMsg(msg, ms) {
  if (!sz) return;
  sz.msg = msg;
  sz.msgT = Math.round((ms || 2000) / (1000 / 60));
}

// ── 죽음 ──
function szDie() {
  const s = sz;
  if (!s || s._dying) return;
  s._dying = true;
  s.pHp = 0;
  // 사망 오버레이 표시 후 2.5초 뒤 로비
  setTimeout(() => {
    if (!sz) return;
    sz.running = false;
    sz = null;
    szStopLoop();
    const canvas = document.getElementById('gameCanvas');
    if (canvas) canvas.style.display = 'none';
    document.getElementById('gameUI').style.display = 'none';
    document.getElementById('pauseBtn').style.display = 'none';
    if (typeof go === 'function') go('sLobby');
  }, 2500);
}

// ── 엔딩 ──
// ══════════════════════════════════════════════════════
//  폭풍구역 엔딩 시네마틱
// ══════════════════════════════════════════════════════

let _szEndRaf = null;
let _szEndLightnings = []; // 사전계산 번개 볼트

function _szLerp(a, b, t) { return a + (b - a) * t; }
function _szClamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

function _szBuildLightnings(w, h) {
  // 폭풍 구간(t=0~0.48) 에 등장할 번개 8개를 사전계산
  const times = [0.04, 0.09, 0.15, 0.20, 0.26, 0.31, 0.37, 0.44];
  _szEndLightnings = times.map((t, i) => {
    const x0 = w * (0.15 + ((i * 137 + 53) % 70) / 100);
    const pts = [];
    let cx = x0, cy = 0;
    for (let j = 0; j < 9; j++) {
      cy += h * (0.09 + ((i * 7 + j * 13) % 5) * 0.01);
      cx += (((i * 11 + j * 7) % 7) - 3) * (w * 0.035);
      cx = _szClamp(cx, w * 0.05, w * 0.95);
      pts.push([cx, cy]);
    }
    return { t, pts, a: 1 - i * 0.07 };
  });
}

function _szDrawStormFrame(ctx, w, h, t) {
  ctx.clearRect(0, 0, w, h);
  // calm = 0(폭풍) → 1(새벽), 후반부에 빠르게 진행
  const calm = _szClamp(Math.pow(_szClamp((t - 0.38) / 0.62, 0, 1), 0.65), 0, 1);
  const storm = Math.max(0, 1 - calm * 1.7);

  // ── 하늘 그라데이션 ──
  const sg = ctx.createLinearGradient(0, 0, 0, h);
  const sT = [_szLerp(8,18,calm),  _szLerp(2,6,calm),  _szLerp(28,45,calm)];
  const sM = [_szLerp(22,200,calm),_szLerp(8,90,calm), _szLerp(55,40,calm)];
  const sB = [_szLerp(14,255,calm),_szLerp(4,155,calm),_szLerp(28,55,calm)];
  sg.addColorStop(0,   `rgb(${sT[0]|0},${sT[1]|0},${sT[2]|0})`);
  sg.addColorStop(0.45,`rgb(${(sM[0]*.6)|0},${(sM[1]*.6)|0},${(sM[2]*.7)|0})`);
  sg.addColorStop(0.75,`rgb(${sM[0]|0},${sM[1]|0},${sM[2]|0})`);
  sg.addColorStop(1,   `rgb(${sB[0]|0},${sB[1]|0},${sB[2]|0})`);
  ctx.fillStyle = sg;
  ctx.fillRect(0, 0, w, h);

  // ── 폭풍 구름 (3레이어) ──
  if (storm > 0.01) {
    const layers = [
      { fy:0.04, fh:0.26, speed:t*0.035, a:0.93, col:[38,16,72] },
      { fy:0.18, fh:0.24, speed:-t*0.055,a:0.88, col:[26,10,58] },
      { fy:0.30, fh:0.22, speed:t*0.048, a:0.78, col:[48,22,80] },
    ];
    layers.forEach(ly => {
      const [r,g,b] = ly.col;
      const offX = (ly.speed * w * 0.18) % w;
      // bumpy cloud silhouette
      for (let pass = 0; pass < 2; pass++) {
        const ox = pass === 0 ? offX : offX - w;
        ctx.beginPath();
        ctx.moveTo(ox - 60, h * (ly.fy + ly.fh));
        const segs = 14;
        for (let i = 0; i <= segs; i++) {
          const px = ox + (w + 120) * i / segs - 60;
          const bumpT = i / segs * Math.PI * 2;
          const bump = (Math.sin(bumpT * 2.3 + ly.speed * 12) * 0.028 +
                        Math.sin(bumpT * 5.1 + ly.speed * 7) * 0.012) * h;
          ctx.lineTo(px, h * ly.fy + bump);
        }
        ctx.lineTo(ox + w + 60, h * (ly.fy + ly.fh));
        ctx.closePath();
        ctx.fillStyle = `rgba(${r},${g},${b},${ly.a * storm})`;
        ctx.fill();
      }
    });
  }

  // ── 번개 볼트 ──
  _szEndLightnings.forEach(bolt => {
    const dt = Math.abs(t - bolt.t);
    if (dt > 0.013) return;
    const ba = (1 - dt / 0.013) * bolt.a;
    // 화면 섬광
    ctx.fillStyle = `rgba(210,170,255,${ba * 0.18})`;
    ctx.fillRect(0, 0, w, h);
    // 볼트 본체
    ctx.save();
    ctx.lineJoin = 'round';
    // 외곽 glow
    ctx.strokeStyle = `rgba(180,130,255,${ba * 0.7})`;
    ctx.lineWidth = 5;
    ctx.shadowBlur = 28;
    ctx.shadowColor = 'rgba(200,140,255,.9)';
    ctx.beginPath();
    ctx.moveTo(bolt.pts[0][0], 0);
    bolt.pts.forEach(([px,py]) => ctx.lineTo(px, py));
    ctx.stroke();
    // 내부 흰색 코어
    ctx.strokeStyle = `rgba(240,220,255,${ba * 0.95})`;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(bolt.pts[0][0], 0);
    bolt.pts.forEach(([px,py]) => ctx.lineTo(px, py));
    ctx.stroke();
    ctx.restore();
  });

  // ── 새벽 빛 (calm 구간) ──
  if (calm > 0.05) {
    const rA = _szClamp((calm - 0.05) / 0.95, 0, 1);
    const sunY = h * _szLerp(0.52, 0.28, calm);
    // 중심 광원
    const rg = ctx.createRadialGradient(w*0.5,sunY,0, w*0.5,sunY, w*0.75);
    rg.addColorStop(0,   `rgba(255,215,85,${rA * 0.72})`);
    rg.addColorStop(0.28,`rgba(255,155,35,${rA * 0.35})`);
    rg.addColorStop(0.65,`rgba(255,100,10,${rA * 0.10})`);
    rg.addColorStop(1,   'rgba(255,80,0,0)');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, w, h);
    // 빛 줄기 (8개)
    if (calm > 0.28) {
      const rayA = _szClamp((calm - 0.28) / 0.72, 0, 1);
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2 + t * 0.3;
        const wid = 0.055 + (i % 3) * 0.02;
        const len = w * 1.3;
        const rg2 = ctx.createLinearGradient(w*0.5, sunY,
          w*0.5 + Math.cos(ang)*len, sunY + Math.sin(ang)*len);
        const baseA = rayA * (0.06 + (i%2)*0.03) * (0.7 + 0.3*Math.sin(t*1.8+i*1.1));
        rg2.addColorStop(0,   `rgba(255,220,80,${baseA * 2.5})`);
        rg2.addColorStop(0.25,`rgba(255,180,40,${baseA})`);
        rg2.addColorStop(1,   'rgba(255,140,10,0)');
        ctx.beginPath();
        ctx.moveTo(w*0.5, sunY);
        ctx.lineTo(w*0.5 + Math.cos(ang-wid)*len, sunY + Math.sin(ang-wid)*len);
        ctx.lineTo(w*0.5 + Math.cos(ang+wid)*len, sunY + Math.sin(ang+wid)*len);
        ctx.closePath();
        ctx.fillStyle = rg2;
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // ── 섬 실루엣 ──
  const silA = _szClamp(0.96 - calm * 0.28, 0.3, 0.96);
  ctx.fillStyle = `rgba(7,2,16,${silA})`;
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, h*0.87);
  ctx.quadraticCurveTo(w*0.07,h*0.81, w*0.14,h*0.79);
  ctx.quadraticCurveTo(w*0.21,h*0.77, w*0.27,h*0.78);
  // 나무 실루엣
  ctx.quadraticCurveTo(w*0.295,h*0.74,w*0.30,h*0.75);
  ctx.quadraticCurveTo(w*0.315,h*0.71,w*0.33,h*0.73);
  ctx.quadraticCurveTo(w*0.345,h*0.76,w*0.36,h*0.77);
  // 중앙 건물 (플레이어가 들어간 건물)
  ctx.lineTo(w*0.43, h*0.77);
  ctx.lineTo(w*0.43, h*0.63);
  ctx.lineTo(w*0.455,h*0.58);   // 지붕 왼쪽
  ctx.lineTo(w*0.48, h*0.54);   // 첨탑
  ctx.lineTo(w*0.505,h*0.58);   // 지붕 오른쪽
  ctx.lineTo(w*0.52, h*0.63);
  ctx.lineTo(w*0.52, h*0.77);
  // 오른쪽 나무
  ctx.quadraticCurveTo(w*0.545,h*0.76,w*0.57,h*0.77);
  ctx.quadraticCurveTo(w*0.595,h*0.72,w*0.61,h*0.74);
  ctx.quadraticCurveTo(w*0.625,h*0.70,w*0.64,h*0.73);
  ctx.quadraticCurveTo(w*0.66,h*0.76, w*0.70,h*0.78);
  ctx.quadraticCurveTo(w*0.78,h*0.80, w*0.86,h*0.82);
  ctx.quadraticCurveTo(w*0.94,h*0.84, w,h*0.88);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();
  // 건물 창문 불빛 (calm 구간에 켜짐)
  if (calm > 0.4) {
    const winA = _szClamp((calm - 0.4) / 0.6, 0, 1);
    [[w*0.455,h*0.665],[w*0.495,h*0.665],[w*0.455,h*0.70],[w*0.495,h*0.70]].forEach(([wx,wy]) => {
      const wg = ctx.createRadialGradient(wx,wy,0, wx,wy, 18);
      wg.addColorStop(0, `rgba(255,220,80,${winA*0.9})`);
      wg.addColorStop(1, 'rgba(255,180,30,0)');
      ctx.fillStyle = wg;
      ctx.fillRect(wx-9, wy-7, 14, 10);
    });
  }

  // ── 최종 골든 페이드 ──
  if (t > 0.855) {
    const fd = Math.pow((t - 0.855) / 0.145, 1.6);
    ctx.fillStyle = `rgba(255,210,75,${fd * 0.8})`;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = `rgba(255,255,240,${fd * 0.35})`;
    ctx.fillRect(0, 0, w, h);
  }
}

function _szRunEndingCanvas(duration, cb) {
  const canvas = document.getElementById('szEndingCanvas');
  if (!canvas) { cb(); return; }
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  _szBuildLightnings(canvas.width, canvas.height);
  const ctx = canvas.getContext('2d');
  const start = performance.now();
  function frame(now) {
    const t = _szClamp((now - start) / duration, 0, 1);
    _szDrawStormFrame(ctx, canvas.width, canvas.height, t);
    if (t < 1) { _szEndRaf = requestAnimationFrame(frame); }
    else { _szEndRaf = null; cb(); }
  }
  _szEndRaf = requestAnimationFrame(frame);
}

function _szSpawnSparks(fx) {
  for (let i = 0; i < 22; i++) {
    const s = document.createElement('div');
    s.className = 'sz-spark';
    const x = 20 + Math.random() * 60, y = 10 + Math.random() * 80;
    const tx = (Math.random() - 0.5) * 200, ty = (Math.random() - 0.5) * 160;
    s.style.cssText = `left:${x}%;top:${y}%;width:${2+Math.random()*4}px;height:${2+Math.random()*4}px;`+
      `background:rgba(${160+Math.random()*90|0},${100+Math.random()*80|0},255,${.7+Math.random()*.3});`+
      `--sx:${tx}px;--sy:${ty}px;animation-duration:${.6+Math.random()*.8}s;animation-delay:${Math.random()*.4}s;`;
    fx.appendChild(s);
  }
}

function szPlayEnding(onDone) {
  const modal = document.getElementById('szEndingModal');
  const fx    = document.getElementById('szEndingFx');
  const vign  = document.getElementById('szEndingVign');
  const lines = document.getElementById('szEndingLines');
  const title = document.getElementById('szEndingTitle');
  const sub   = document.getElementById('szEndingSub');
  const stats = document.getElementById('szEndingStats');
  if (!modal) { onDone && onDone(); return; }

  // 초기화
  [lines,title,sub,stats].forEach(el => { el.textContent=''; el.className=el.className.replace(/\bshow\b/g,'').trim(); });
  fx.innerHTML = '';
  vign.classList.remove('show');
  modal.classList.add('on');

  const PRE  = ['마지막 봉인이 풀렸다','동쪽... 서쪽... 남쪽... 북쪽...','네 수호자가 무너졌다','폭풍이... 그친다'];
  const POST = ['이 섬은 봉인된 땅이었다','폭풍은 감옥이 아니었다','그것은... 기억이었다','이제, 잊혀도 괜찮다','바람이 분다. 이번엔, 따뜻하다'];
  const SHOW_DUR = 1050, LINE_GAP = 1280;

  function showLine(txt, t) {
    setTimeout(() => {
      lines.textContent = txt;
      lines.classList.add('show');
    }, t);
    setTimeout(() => lines.classList.remove('show'), t + SHOW_DUR);
  }

  // === 타임라인 ===
  let cursor = 500;
  vign.classList.add('show');

  // 전기 파티클 (도입부)
  setTimeout(() => _szSpawnSparks(fx), 200);

  // 전반부 대사
  PRE.forEach(txt => { showLine(txt, cursor); cursor += LINE_GAP; });

  // 캔버스 시네마틱 (4.6초)
  cursor += 300;
  const canvasStart = cursor;
  setTimeout(() => {
    const flashEl = document.createElement('div');
    flashEl.className = 'sz-flash';
    fx.appendChild(flashEl);
    void flashEl.offsetWidth;
    flashEl.classList.add('go');
    _szRunEndingCanvas(4600, afterCanvas);
  }, canvasStart);
  cursor += 4600;

  function afterCanvas() {
    // 황금빛 wake 효과
    const wake = document.createElement('div');
    wake.className = 'sz-wake';
    fx.appendChild(wake);
    void wake.offsetWidth;
    wake.classList.add('expand');

    // 후반부 대사
    let t2 = 800;
    POST.forEach(txt => { showLine(txt, t2); t2 += LINE_GAP; });

    // 타이틀
    setTimeout(() => {
      title.textContent = "STORM'S END";
      title.classList.add('show');
    }, t2 + 200);
    setTimeout(() => {
      sub.textContent = '폭풍의 기억이 잠들었다';
      sub.classList.add('show');
    }, t2 + 600);

    // 통계
    setTimeout(() => {
      const bossCleared = Object.values(sz ? (sz.bossState || {}) : {})
        .filter(v => v === 'dead').length;
      stats.textContent = `보스 ${bossCleared} / 4 · 폭풍구역 완전 클리어`;
      stats.classList.add('show');
    }, t2 + 2000);

    // 페이드아웃
    setTimeout(() => {
      modal.style.transition = 'opacity 1.4s ease';
      modal.style.opacity = '0';
    }, t2 + 3800);
    setTimeout(() => {
      modal.style.opacity = '';
      modal.style.transition = '';
      modal.classList.remove('on');
      fx.innerHTML = '';
      vign.classList.remove('show');
      if (_szEndRaf) { cancelAnimationFrame(_szEndRaf); _szEndRaf = null; }
      onDone && onDone();
    }, t2 + 5200);
  }
}

function szTriggerEnding() {
  // 업적·저장
  if (typeof localStorage !== 'undefined') localStorage.setItem('hd_storm_cleared','1');
  if (typeof achStats !== 'undefined') {
    achStats.stormCleared = (achStats.stormCleared || 0) + 1;
    if (typeof saveAch === 'function') saveAch();
    if (typeof checkAchievements === 'function') checkAchievements();
  }
  // 보상 지급 (엔딩 달성 시)
  if (typeof coins !== 'undefined') {
    coins += 500000;
    if (typeof sv === 'function') sv('hd_c', coins);
    if (typeof energy !== 'undefined') { energy += 300000; if (typeof sv === 'function') sv('hd_e', energy); }
    if (typeof updRes === 'function') updRes();
  }
  // 폭풍구역 루프 일시정지 (화면은 유지)
  if (sz) sz._dying = true;
  // 컷씬 재생 → 완료 후 로비
  szPlayEnding(() => {
    exitStormZone(true);
  });
}

// ══════════════ 그리기 ══════════════

function szDraw() {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas || !sz) return;
  const ctx = canvas.getContext('2d');
  if (sz.caveMode) { szDrawCave(ctx, canvas.width, canvas.height); return; }
  const s = sz;
  const cvW = canvas.width, cvH = canvas.height;
  const cx = s.camX, cy = s.camY;

  ctx.save();

  // ── 배경 (바다) ──
  ctx.fillStyle = '#071828';
  ctx.fillRect(0, 0, cvW, cvH);

  // 바다 파문 효과
  ctx.strokeStyle = 'rgba(0,80,140,0.18)';
  ctx.lineWidth = 1;
  for (let gx = -cx % 80; gx < cvW; gx += 80) {
    for (let gy = -cy % 80; gy < cvH; gy += 80) {
      ctx.beginPath();
      ctx.arc(gx, gy, 30, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // ── 섬 그리기 ──
  szDrawIsland(ctx, cx, cy, cvW, cvH);

  // ── 보라색 연기 파티클 ──
  s.smokeParticles.forEach(p => {
    const alpha = Math.max(0, p.a * (p.l / p.ml));
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.arc(p.x - cx, p.y - cy, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // ── 건물 ──
  szDrawBuilding(ctx, cx, cy);

  // ── 던전 입구 표시 ──
  for (const [id, bd] of Object.entries(SZ_BOSS_DEFS)) {
    if (s.bossState[id] === 'dead') continue;
    const dr = bd.dungeonRect;
    const sx = dr.x - cx, sy = dr.y - cy;
    if (sx > -dr.w - 100 && sx < cvW + 100 && sy > -dr.h - 100 && sy < cvH + 100) {
      // 던전 입구 시각화
      ctx.save();
      ctx.strokeStyle = bd.locked ? '#4b5563' : bd.col;
      ctx.lineWidth = 3;
      ctx.fillStyle = bd.locked ? 'rgba(30,30,30,0.4)' : `${bd.col}22`;
      ctx.fillRect(sx, sy, dr.w, dr.h);
      ctx.strokeRect(sx, sy, dr.w, dr.h);
      // 레이블
      ctx.fillStyle = bd.locked ? '#6b7280' : bd.col;
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText((bd.locked ? '🔒 ' : '⚔️ ') + bd.dir + '쪽 던전', sx + dr.w / 2, sy + dr.h / 2 + 5);
      ctx.restore();
    }
    // 보스방
    if (s.activeBoss && s.activeBoss.id === id) {
      szDrawBossRoom(ctx, cx, cy, bd, s.activeBoss);
    }
  }

  // ── 이펙트 ──
  s.effects.forEach(e => {
    if (e.type === 'sniper_aim') {
      const alpha = (e.l / e.ml) * 0.6;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(e.x1 - cx, e.y1 - cy);
      ctx.lineTo(e.x2 - cx, e.y2 - cy);
      ctx.stroke();
      ctx.restore();
    } else if (e.type === 'poison_cloud') {
      const alpha = (e.l / e.ml) * 0.22;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#7c3aed';
      ctx.beginPath();
      ctx.arc(e.x - cx, e.y - cy, e.r * (1 + (1 - e.l / e.ml) * 0.3), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  });

  // ── 파티클 ──
  s.parts.forEach(p => {
    const alpha = Math.max(0, p.l / 20);
    ctx.save();
    ctx.globalAlpha = Math.min(1, alpha);
    ctx.fillStyle = p.col || '#a855f7';
    ctx.beginPath();
    ctx.arc(p.x - cx, p.y - cy, p.r || 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // ── 총알 ──
  s.bullets.forEach(b => {
    const bx = b.x - cx, by = b.y - cy;
    if (b.isRect) {
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(b.angle);
      ctx.fillStyle = b.col;
      ctx.shadowColor = b.col;
      ctx.shadowBlur = 8;
      ctx.fillRect(-(b.w || 3) / 2, -(b.h || 14) / 2, b.w || 3, b.h || 14);
      ctx.restore();
    } else {
      ctx.save();
      ctx.fillStyle = b.col || '#fde047';
      ctx.shadowColor = b.col || '#fde047';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(bx, by, b.r || 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  });

  // ── 일반 몹 ──
  s.mobs.forEach(m => szDrawMob(ctx, m, cx, cy));

  // ── 보스 ──
  if (s.activeBoss && !s.activeBoss.dead) {
    szDrawBoss(ctx, s.activeBoss, cx, cy);
    if (s.activeBoss.minions) s.activeBoss.minions.forEach(mn => szDrawMinion(ctx, mn, cx, cy));
  }

  // ── 플레이어 ──
  szDrawPlayer(ctx, s, cx, cy, cvW, cvH);

  // ── HUD ──
  szDrawHUD(ctx, s, cvW, cvH);

  // ── 미니맵 ──
  szDrawMinimap(ctx, s, cvW, cvH);

  // ── 보라색 화면 테두리 효과 ──
  const vignette = ctx.createRadialGradient(cvW / 2, cvH / 2, cvH * 0.25, cvW / 2, cvH / 2, cvH * 0.8);
  vignette.addColorStop(0, 'rgba(100,10,180,0)');
  vignette.addColorStop(1, 'rgba(80,0,160,0.45)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, cvW, cvH);

  // 테두리 글로우 (상단/하단)
  const edgeGrad = ctx.createLinearGradient(0, 0, 0, cvH);
  edgeGrad.addColorStop(0, 'rgba(120,0,200,0.35)');
  edgeGrad.addColorStop(0.07, 'rgba(120,0,200,0)');
  edgeGrad.addColorStop(0.93, 'rgba(120,0,200,0)');
  edgeGrad.addColorStop(1, 'rgba(120,0,200,0.35)');
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(0, 0, cvW, cvH);

  // 좌우 테두리
  const sideGrad = ctx.createLinearGradient(0, 0, cvW, 0);
  sideGrad.addColorStop(0, 'rgba(120,0,200,0.3)');
  sideGrad.addColorStop(0.06, 'rgba(120,0,200,0)');
  sideGrad.addColorStop(0.94, 'rgba(120,0,200,0)');
  sideGrad.addColorStop(1, 'rgba(120,0,200,0.3)');
  ctx.fillStyle = sideGrad;
  ctx.fillRect(0, 0, cvW, cvH);

  // ── 상호작용 프롬프트 ──
  if (s.interactPrompt) {
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.72)';
    ctx.fillRect(cvW / 2 - 180, cvH - 80, 360, 36);
    ctx.fillStyle = '#e9d5ff';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(s.interactPrompt, cvW / 2, cvH - 57);
    ctx.restore();
  }

  // ── 메시지 ──
  if (s.msg && s.msgT > 0) {
    const alpha = Math.min(1, s.msgT / 20);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(cvW / 2 - 220, 60, 440, 38);
    ctx.fillStyle = '#e9d5ff';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(s.msg, cvW / 2, 85);
    ctx.restore();
  }

  // ── 사망 오버레이 ──
  if (s._dying) {
    ctx.save();
    ctx.fillStyle = 'rgba(120,0,0,0.72)';
    ctx.fillRect(0, 0, cvW, cvH);
    ctx.fillStyle = '#ff4444';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('☠️ 사망', cvW / 2, cvH / 2 - 20);
    ctx.fillStyle = '#ffaaaa';
    ctx.font = '20px monospace';
    ctx.fillText('폭풍구역에서 쓰러졌습니다...', cvW / 2, cvH / 2 + 24);
    ctx.fillStyle = 'rgba(255,170,170,0.6)';
    ctx.font = '14px monospace';
    ctx.fillText('잠시 후 로비로 돌아갑니다', cvW / 2, cvH / 2 + 56);
    ctx.restore();
  }

  ctx.restore();
}

// ── 섬 그리기 ──
// 사전 계산된 장식물 (시드 기반 고정 위치)
const _SZ_DECO = (() => {
  const items = [];
  const rng = (seed, max) => { let x=Math.sin(seed)*9301+49297; x-=Math.floor(x); return Math.floor(x*max); };
  let s = 42;
  for (let i = 0; i < 600; i++) {
    const land = SZ_LAND[rng(s++,5)];
    const mx = land.x + rng(s++, land.w);
    const my = land.y + rng(s++, land.h);
    const type = rng(s++, 10); // 0-3: 나무, 4-6: 바위, 7-9: 모래/풀
    items.push({x:mx, y:my, type, seed:s});
  }
  return items;
})();

function szDrawIsland(ctx, cx, cy, cvW, cvH) {
  const CULL = 100;
  SZ_LAND.forEach(r => {
    const sx = r.x - cx, sy = r.y - cy;
    if (sx + r.w < -CULL || sx > cvW + CULL || sy + r.h < -CULL || sy > cvH + CULL) return;

    // 모래 해변 테두리 (넓게)
    ctx.fillStyle = '#c8a96e';
    ctx.fillRect(sx - 28, sy - 28, r.w + 56, r.h + 56);

    // 모래+잔디 중간 테두리
    ctx.fillStyle = '#6b7c3a';
    ctx.fillRect(sx - 10, sy - 10, r.w + 20, r.h + 20);

    // 육지 본체 (어두운 풀)
    ctx.fillStyle = '#2d3d18';
    ctx.fillRect(sx, sy, r.w, r.h);

    // 풀 패턴 (거친 질감)
    ctx.fillStyle = 'rgba(60,100,20,0.12)';
    for (let gx = (sx % 80); gx < sx + r.w; gx += 80) {
      for (let gy = (sy % 80); gy < sy + r.h; gy += 80) {
        ctx.beginPath();
        ctx.arc(gx + 20, gy + 20, 22, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });

  // 장식물 그리기 (culling 포함)
  _SZ_DECO.forEach(d => {
    const sx = d.x - cx, sy = d.y - cy;
    if (sx < -80 || sx > cvW + 80 || sy < -80 || sy > cvH + 80) return;
    const t = d.type;
    if (t <= 3) {
      // 나무 (녹색 원 + 갈색 줄기)
      const treeR = 14 + (d.seed % 3) * 5;
      ctx.save();
      ctx.fillStyle = '#1a3a0a';
      ctx.fillRect(sx - 3, sy, 6, 16);
      ctx.fillStyle = t === 0 ? '#1e5c0a' : t === 1 ? '#2d7012' : '#166008';
      ctx.shadowColor = '#0f3d06';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(sx, sy - treeR * 0.6, treeR, 0, Math.PI * 2);
      ctx.fill();
      // 작은 상단
      ctx.fillStyle = t === 0 ? '#28780e' : '#1e6c0a';
      ctx.beginPath();
      ctx.arc(sx + (d.seed%5-2)*4, sy - treeR * 1.2, treeR * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (t <= 6) {
      // 바위 (회색 다각형)
      const rr = 10 + (d.seed % 4) * 6;
      ctx.save();
      ctx.fillStyle = t === 4 ? '#4a4a4a' : t === 5 ? '#5a5040' : '#3d3d3d';
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#222';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      const sides = 5 + (d.seed % 3);
      for (let i = 0; i < sides; i++) {
        const a = (i / sides) * Math.PI * 2 - 0.3;
        const pr = rr * (0.75 + (((d.seed * (i+7)) % 13) / 40));
        i === 0 ? ctx.moveTo(sx + Math.cos(a)*pr, sy + Math.sin(a)*pr)
                : ctx.lineTo(sx + Math.cos(a)*pr, sy + Math.sin(a)*pr);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    } else {
      // 모래 패치 / 풀 덤불
      const pr = 8 + (d.seed % 5) * 4;
      ctx.save();
      ctx.fillStyle = t === 7 ? 'rgba(200,170,110,0.35)' : 'rgba(80,130,30,0.3)';
      ctx.beginPath();
      ctx.arc(sx, sy, pr, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  });
}

// ── 건물 그리기 ──
function szDrawBuilding(ctx, cx, cy) {
  const bl = SZ_BUILDING;
  const sx = bl.x - cx, sy = bl.y - cy;
  if (sx > ctx.canvas?.width + 200 || sx + bl.w < -200) return;
  ctx.save();
  // 건물 그림자
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(sx + 8, sy + 8, bl.w, bl.h);
  // 건물 본체
  ctx.fillStyle = '#1e2d0a';
  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 4;
  ctx.fillRect(sx, sy, bl.w, bl.h);
  ctx.strokeRect(sx, sy, bl.w, bl.h);
  // 지붕 강조
  ctx.fillStyle = '#2d4a18';
  ctx.fillRect(sx, sy, bl.w, 40);
  // 문
  ctx.fillStyle = '#4ade80';
  ctx.shadowColor = '#4ade80';
  ctx.shadowBlur = 12;
  ctx.fillRect(sx + bl.w / 2 - 40, sy + bl.h - 120, 80, 120);
  ctx.fillStyle = '#22543d';
  ctx.shadowBlur = 0;
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('[ 진입 ]', sx + bl.w / 2, sy + 30);
  // 창문들
  ctx.fillStyle = 'rgba(74,222,128,0.25)';
  [[sx+80, sy+80], [sx+bl.w-160, sy+80], [sx+80, sy+200], [sx+bl.w-160, sy+200]].forEach(([wx,wy])=>{
    ctx.fillRect(wx, wy, 80, 60);
    ctx.strokeStyle='#4ade80'; ctx.lineWidth=2; ctx.strokeRect(wx,wy,80,60);
  });
  ctx.restore();
}

// ── 보스방 그리기 ──
function szDrawBossRoom(ctx, cx, cy, bd, boss) {
  const br = bd.bossRect;
  const sx = br.x - cx, sy = br.y - cy;
  // 어두운 보스방 배경
  ctx.save();
  ctx.fillStyle = 'rgba(5,0,15,0.85)';
  ctx.fillRect(sx, sy, br.w, br.h);
  ctx.strokeStyle = bd.col;
  ctx.lineWidth = 4;
  ctx.strokeRect(sx, sy, br.w, br.h);
  ctx.restore();
}

// ── 몹 그리기 ──
function szDrawMob(ctx, m, cx, cy) {
  const sx = m.x - cx, sy = m.y - cy;
  ctx.save();
  ctx.translate(sx, sy);
  ctx.rotate(m.angle);

  // 몸통
  ctx.fillStyle = m.col || '#7c3aed';
  ctx.shadowColor = m.col || '#7c3aed';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(0, 0, m.r, 0, Math.PI * 2);
  ctx.fill();

  // 앞쪽 표시 (총구 방향)
  ctx.fillStyle = '#e9d5ff';
  ctx.shadowBlur = 0;
  ctx.fillRect(m.r - 4, -3, 10, 6);

  ctx.restore();

  // HP바
  const hpPct = m.hp / m.maxHp;
  ctx.fillStyle = '#1f2937';
  ctx.fillRect(sx - m.r, sy - m.r - 8, m.r * 2, 4);
  ctx.fillStyle = '#a855f7';
  ctx.fillRect(sx - m.r, sy - m.r - 8, m.r * 2 * hpPct, 4);
}

// ── 보스 그리기 ──
function szDrawBoss(ctx, b, cx, cy) {
  const sx = b.x - cx, sy = b.y - cy;
  const t = Date.now() * 0.001;

  ctx.save();
  ctx.translate(sx, sy);

  if (b.id === 'golem') {
    // 골렘: 큰 육각형 갑옷
    ctx.rotate(b.angle);
    ctx.shadowColor = b.def.col;
    ctx.shadowBlur = 25;
    ctx.fillStyle = b.def.col;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const r = b.r + Math.sin(t * 3 + i) * 4;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * r * 0.6, Math.sin(a) * r * 0.6, r * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = b.def.col2;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      i === 0 ? ctx.moveTo(Math.cos(a) * b.r, Math.sin(a) * b.r) : ctx.lineTo(Math.cos(a) * b.r, Math.sin(a) * b.r);
    }
    ctx.closePath();
    ctx.fill();
    // 코어
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#fbbf24';
    ctx.beginPath();
    ctx.arc(0, 0, b.r * 0.35, 0, Math.PI * 2);
    ctx.fill();

  } else if (b.id === 'shadow') {
    // 그림자: 불규칙한 형태
    ctx.rotate(t * 2);
    ctx.shadowColor = b.def.col;
    ctx.shadowBlur = 30;
    ctx.fillStyle = b.def.col;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const r = b.r * (0.7 + Math.sin(t * 4 + i * 1.3) * 0.3);
      ctx.beginPath();
      ctx.arc(Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5, r * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(0, 0, b.r * 0.8, 0, Math.PI * 2);
    ctx.fill();
    // 에너지 코어
    ctx.fillStyle = '#818cf8';
    ctx.shadowColor = '#818cf8';
    ctx.beginPath();
    ctx.arc(0, 0, b.r * 0.25, 0, Math.PI * 2);
    ctx.fill();

  } else if (b.id === 'wanderer') {
    // 방랑자: 날카로운 삼각형 + 저격총 형태
    ctx.rotate(b.angle);
    ctx.shadowColor = b.def.col;
    ctx.shadowBlur = 20;
    ctx.fillStyle = b.def.col;
    ctx.beginPath();
    ctx.moveTo(b.r + 10, 0);
    ctx.lineTo(-b.r * 0.7, -b.r * 0.7);
    ctx.lineTo(-b.r * 0.7, b.r * 0.7);
    ctx.closePath();
    ctx.fill();
    // 총신
    ctx.fillStyle = '#065f46';
    ctx.fillRect(b.r * 0.4, -4, b.r * 0.9, 8);
    // 코어
    ctx.fillStyle = '#34d399';
    ctx.shadowColor = '#34d399';
    ctx.beginPath();
    ctx.arc(0, 0, b.r * 0.28, 0, Math.PI * 2);
    ctx.fill();

  } else if (b.id === 'spider') {
    // 거미: 8개 다리 + 몸통
    ctx.shadowColor = b.def.col;
    ctx.shadowBlur = 28;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + t;
      const legLen = b.r * 1.4;
      const x1 = Math.cos(a) * b.r * 0.5;
      const y1 = Math.sin(a) * b.r * 0.5;
      const x2 = Math.cos(a) * legLen;
      const y2 = Math.sin(a) * legLen;
      ctx.strokeStyle = b.def.col;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.fillStyle = b.def.col;
    ctx.beginPath();
    ctx.arc(0, 0, b.r * 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = b.def.col2;
    ctx.beginPath();
    ctx.arc(0, 0, b.r * 0.45, 0, Math.PI * 2);
    ctx.fill();
    // 코어
    ctx.fillStyle = '#c4b5fd';
    ctx.shadowColor = '#c4b5fd';
    ctx.beginPath();
    ctx.arc(0, 0, b.r * 0.22, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();

  // 보스 HP바
  const hpPct = Math.max(0, b.hp / b.maxHp);
  const barW = 220, barH = 14;
  const bx = sx - barW / 2, by = sy - b.r - 30;
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(bx - 2, by - 2, barW + 4, barH + 4);
  ctx.fillStyle = b.def.col2;
  ctx.fillRect(bx, by, barW, barH);
  ctx.fillStyle = b.def.col;
  ctx.fillRect(bx, by, barW * hpPct, barH);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${b.def.name}  ${Math.ceil(b.hp)} / ${b.maxHp}`, sx, by - 4);

  // 페이즈 표시
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = i < b.phase ? b.def.col : '#374151';
    ctx.beginPath();
    ctx.arc(bx + barW + 12 + i * 14, by + barH / 2, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ── 미니언 그리기 ──
function szDrawMinion(ctx, m, cx, cy) {
  const sx = m.x - cx, sy = m.y - cy;
  ctx.save();
  ctx.fillStyle = m.col;
  ctx.shadowColor = m.col;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(sx, sy, m.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ── 플레이어 그리기 ──
function szDrawPlayer(ctx, s, cx, cy, cvW, cvH) {
  const sx = s.px - cx, sy = s.py - cy;

  // 피격 플래시
  if (s.playerDmgT > 0 && s.playerDmgT % 4 < 2) {
    ctx.save();
    ctx.fillStyle = 'rgba(255,60,60,0.35)';
    ctx.fillRect(0, 0, cvW, cvH);
    ctx.restore();
  }

  ctx.save();
  ctx.translate(sx, sy);
  ctx.rotate(s.pa);

  // 폭풍 작업복 여부에 따라 색상 변경
  const playerCol = s.hasStormArmor ? '#22d3ee' : '#ef4444';
  ctx.shadowColor = playerCol;
  ctx.shadowBlur = 16;
  ctx.fillStyle = playerCol;

  // 몸통 (원)
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fill();

  // 총구
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(12, -4, 14, 8);

  ctx.restore();
}

// ── HUD 그리기 ──
function szDrawHUD(ctx, s, cvW, cvH) {
  const hpPct = Math.max(0, s.pHp / s.pMaxHp);

  // HP 바
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(14, cvH - 40, 180, 22);
  ctx.fillStyle = '#374151';
  ctx.fillRect(16, cvH - 38, 176, 18);
  const hpCol = hpPct > 0.5 ? '#22c55e' : hpPct > 0.25 ? '#f59e0b' : '#ef4444';
  ctx.fillStyle = hpCol;
  ctx.fillRect(16, cvH - 38, 176 * hpPct, 18);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`❤️ ${Math.ceil(s.pHp)} / ${s.pMaxHp}`, 20, cvH - 24);

  // 탄약
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(14, cvH - 66, 130, 22);
  ctx.fillStyle = '#fff';
  ctx.font = '12px monospace';
  ctx.fillText(`🔫 ${s.pAmmo} / ${s.pMaxAmmo}${s.pReload > 0 ? ' (재장전)' : ''}`, 18, cvH - 50);

  // 획득 열쇠 표시
  if (s.keys.length > 0) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(14, 14, 200, 28);
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('🗝️ ' + s.keys.map(k => {
      const entry = Object.values(SZ_BOSS_DEFS).find(bd => bd.keyId === k);
      return entry ? entry.keyName : k;
    }).join(', '), 18, 32);
  }

  // 폭풍구역 레이블
  ctx.fillStyle = 'rgba(80,0,160,0.55)';
  ctx.fillRect(cvW - 130, 14, 116, 28);
  ctx.fillStyle = '#e9d5ff';
  ctx.font = 'bold 13px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('⚡ 폭풍구역', cvW - 72, 32);
}

// ── 미니맵 ──
function szDrawMinimap(ctx, s, cvW, cvH) {
  const mm = { x: cvW - 225, y: cvH - 210, w: 210, h: 195 };
  const scaleX = mm.w / SZ_W, scaleY = mm.h / SZ_H;

  ctx.save();
  // 바깥 테두리
  ctx.fillStyle = 'rgba(0,0,0,0.85)';
  ctx.beginPath();
  ctx.roundRect(mm.x - 4, mm.y - 20, mm.w + 8, mm.h + 24, 6);
  ctx.fill();
  ctx.strokeStyle = '#7c3aed';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(mm.x - 4, mm.y - 20, mm.w + 8, mm.h + 24, 6);
  ctx.stroke();

  // 제목
  ctx.fillStyle = '#a78bfa';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚡ 폭풍구역 지도', mm.x + mm.w / 2, mm.y - 6);

  // 바다 배경
  ctx.fillStyle = '#071828';
  ctx.fillRect(mm.x, mm.y, mm.w, mm.h);

  // 섬 (밝은 녹색으로 가시성 향상)
  SZ_LAND.forEach(r => {
    ctx.fillStyle = '#4a7c2a';
    ctx.fillRect(mm.x + r.x * scaleX, mm.y + r.y * scaleY, r.w * scaleX, r.h * scaleY);
  });

  // 보스 표시 (더 큰 점)
  for (const [id, bd] of Object.entries(SZ_BOSS_DEFS)) {
    const bx = mm.x + bd.x * scaleX;
    const by = mm.y + bd.y * scaleY;
    if (s.bossState[id] === 'dead') {
      ctx.fillStyle = '#4b5563';
    } else {
      ctx.fillStyle = bd.locked ? '#374151' : bd.col;
    }
    ctx.beginPath();
    ctx.arc(bx, by, 5, 0, Math.PI * 2);
    ctx.fill();
    if (s.bossState[id] !== 'dead') {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(bx, by, 5, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // 건물 (초록 사각형)
  const blX = mm.x + SZ_BUILDING.x * scaleX;
  const blY = mm.y + SZ_BUILDING.y * scaleY;
  ctx.fillStyle = '#4ade80';
  ctx.fillRect(blX - 4, blY - 4, 8, 8);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.strokeRect(blX - 4, blY - 4, 8, 8);

  // 플레이어 (깜빡이는 흰 점 + 색상 점)
  const plx = mm.x + s.px * scaleX, ply = mm.y + s.py * scaleY;
  const blink = Math.floor(Date.now() / 400) % 2 === 0;
  ctx.shadowColor = '#fff';
  ctx.shadowBlur = blink ? 10 : 4;
  ctx.fillStyle = s.hasStormArmor ? '#22d3ee' : '#f87171';
  ctx.beginPath();
  ctx.arc(plx, ply, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(plx, ply, 5, 0, Math.PI * 2);
  ctx.stroke();

  // 미니맵 테두리 선
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(124,58,237,0.5)';
  ctx.lineWidth = 1;
  ctx.strokeRect(mm.x, mm.y, mm.w, mm.h);

  ctx.restore();
}

// ══════════════ 동굴 시스템 ══════════════

function szIsInCorridor(cave, x, y) {
  const r = cave.def.corridors;
  for (let i = 0; i < r.length; i++) {
    const c = r[i];
    if (x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h) return true;
  }
  return false;
}

function szUpdateCave() {
  const s = sz;
  const c = s.cave;
  if (!c) return;
  const def = c.def;

  // ── 입력 ──
  let dx = 0, dy = 0;
  if (keys['w'] || keys['arrowup'])    dy--;
  if (keys['s'] || keys['arrowdown'])  dy++;
  if (keys['a'] || keys['arrowleft'])  dx--;
  if (keys['d'] || keys['arrowright']) dx++;
  if (typeof touchDX !== 'undefined') { dx += touchDX; dy += touchDY; }
  const mag = Math.hypot(dx, dy);
  if (mag > 1) { dx /= mag; dy /= mag; }

  // 동굴 이동 (복도 안에서만)
  const spd = s.pSpd;
  const nx = c.px + dx * spd;
  const ny = c.py + dy * spd;
  if (szIsInCorridor(c, nx, ny)) { c.px = nx; c.py = ny; }
  else if (szIsInCorridor(c, nx, c.py)) { c.px = nx; }
  else if (szIsInCorridor(c, c.px, ny)) { c.py = ny; }
  c.px = Math.max(0, Math.min(def.w, c.px));
  c.py = Math.max(0, Math.min(def.h, c.py));

  // 카메라
  const canvas = document.getElementById('gameCanvas');
  const cvW = canvas.width, cvH = canvas.height;
  const targCamX = c.px - cvW / 2;
  const targCamY = c.py - cvH / 2;
  c.camX += (Math.max(0, Math.min(def.w - cvW, targCamX)) - c.camX) * 0.14;
  c.camY += (Math.max(0, Math.min(def.h - cvH, targCamY)) - c.camY) * 0.14;

  // 조준
  if (s._mouseX !== undefined) {
    s.pa = Math.atan2(s._mouseY - (c.py - c.camY), s._mouseX - (c.px - c.camX));
  }

  // 발사
  s.pFireT++;
  if (s._mdown && s.pReload <= 0 && s.pAmmo > 0 && s.pFireT >= 8) {
    s.pFireT = 0;
    const ang = s.pa;
    c.bullets.push({ x: c.px, y: c.py, vx: Math.cos(ang)*14, vy: Math.sin(ang)*14, r: 5, l: 220, en: false, dmg: 18, col: '#fde047' });
    s.parts.push({ x: c.px, y: c.py, vx: Math.cos(ang)*3, vy: Math.sin(ang)*3, l: 6, col: '#fde047', r: 3 });
    s.pAmmo--;
  } else if (s._mdown && s.pReload <= 0 && s.pAmmo <= 0) {
    s.pReload = s.pReloadMax;
    szSetMsg('재장전 중...', 1500);
  }

  // 재장전
  if (s.pReload > 0) { s.pReload--; if (s.pReload <= 0) { s.pAmmo = s.pMaxAmmo; szSetMsg('장전 완료!', 800); } }
  if ((keys['r'] || keys['R']) && s.pReload <= 0 && s.pAmmo < s.pMaxAmmo) { keys['r']=false;keys['R']=false; s.pReload=s.pReloadMax; szSetMsg('재장전 중...',1500); }

  // 폭풍 지속 피해 (동굴 내에서도)
  if (!s.hasStormArmor) { s.stormDmgT++; if (s.stormDmgT >= 18) { s.stormDmgT=0; szDamagePlayer(4,'#ff4444'); } }

  // 보스 스폰 (보스 위치 근처)
  if (!c.bossSpawned) {
    const bd = SZ_BOSS_DEFS[c.bossId];
    const distToBoss = Math.hypot(c.px - def.bossPos.x, c.py - def.bossPos.y);
    if (distToBoss < 500) {
      c.bossSpawned = true;
      s.activeBoss = {
        id: c.bossId, def: bd,
        x: def.bossPos.x, y: def.bossPos.y,
        hp: bd.hp, maxHp: bd.hp, r: bd.r,
        angle: 0, state: 'intro', stateT: 0, phase: 0,
        minions: [], _atkT: 0, _chargeV: null, _chargeT: 0, _sniperT: 0, _spiderT: 0, dead: false,
        _caveMode: true,  // 동굴 보스 표시
      };
      s.bossDoor = true;
      szSetMsg(`⚔️ ${bd.name} 등장!`, 3000);
    }
  }

  // 보스 업데이트 (동굴 좌표계 사용)
  if (s.activeBoss && !s.activeBoss.dead) {
    szUpdateCaveBoss(c);
  }

  // 몹 AI (동굴 안 소환된 몹들)
  c.mobs = c.mobs.filter(m => !m.dead);
  szUpdateCaveMobs(c);

  // 총알 업데이트
  c.bullets = c.bullets.filter(b => b.l > 0);
  c.bullets.forEach(b => {
    b.x += b.vx; b.y += b.vy; b.l--;
    if (!szIsInCorridor(c, b.x, b.y)) { b.l = 0; return; }
    if (b.en && s.playerDmgT <= 0) {
      if (Math.hypot(b.x - c.px, b.y - c.py) < 18) { szDamagePlayer(b.dmg,'#a855f7'); b.l = 0; }
    }
  });

  // 플레이어 총알 → 보스 판정
  if (s.activeBoss && !s.activeBoss.dead) {
    const b2 = s.activeBoss;
    c.bullets = c.bullets.filter(bul => {
      if (bul.en) return true;
      if (Math.hypot(bul.x - b2.x, bul.y - b2.y) < b2.r + 5) {
        b2.hp -= bul.dmg;
        s.parts.push({ x: bul.x, y: bul.y, vx:(Math.random()-0.5)*5, vy:(Math.random()-0.5)*5, l:14, col:b2.def.col, r:3 });
        if (b2.hp <= 0) szCaveBossDie();
        return false;
      }
      return true;
    });
  }

  // 파티클/이펙트
  s.parts = s.parts.filter(p => p.l > 0);
  s.parts.forEach(p => { p.x+=p.vx; p.y+=p.vy; p.l--; p.vy*=0.95; });
  s.effects = s.effects.filter(e => e.l > 0);
  s.effects.forEach(e => e.l--);
  if (s.msgT > 0) s.msgT--;
  if (s.msgT <= 0) s.msg = '';
  if (s.playerDmgT > 0) s.playerDmgT--;

  // HP 재생 (동굴 모드에서도 동일하게 3초마다 2HP)
  s.regenT = (s.regenT || 0) + 1;
  if (s.regenT >= 180) { s.regenT = 0; if (s.pHp < s.pMaxHp) s.pHp = Math.min(s.pMaxHp, s.pHp + 2); }

  // ESC로 동굴 탈출 (보스 아직 스폰 안됐으면)
  if (keys['escape'] && !s.activeBoss) { keys['escape']=false; szExitCave(false); }

  // 사망 판정
  if (s.pHp <= 0 && !s._dying) szDie();
}

function szClampCavePos(c, obj) {
  // 동굴 복도 안으로 보스 위치 보정
  if (!szIsInCorridor(c, obj.x, obj.y)) {
    // 가장 가까운 복도로 당기기
    let bestDist = Infinity, bestX = obj.x, bestY = obj.y;
    c.def.corridors.forEach(r => {
      const cx2 = Math.max(r.x, Math.min(r.x+r.w, obj.x));
      const cy2 = Math.max(r.y, Math.min(r.y+r.h, obj.y));
      const d = Math.hypot(obj.x-cx2, obj.y-cy2);
      if (d < bestDist) { bestDist=d; bestX=cx2; bestY=cy2; }
    });
    obj.x = bestX; obj.y = bestY;
  }
}

function szUpdateCaveBoss(c) {
  const s = sz;
  const b = s.activeBoss;
  if (!b || b.dead) return;
  b.stateT++;
  const px = c.px, py = c.py;
  const dx = px - b.x, dy = py - b.y;
  const dist = Math.hypot(dx, dy) || 1;

  if (b.state === 'intro') { if (b.stateT > 90) { b.state='fight'; b.stateT=0; } return; }

  const id = b.id;
  if (id === 'golem') {
    if (b._chargeT > 0) {
      b._chargeT--;
      b.x += b._chargeV.vx; b.y += b._chargeV.vy;
      szClampCavePos(c, b);
      if (Math.hypot(px - b.x, py - b.y) < b.r + 20) szDamagePlayer(25, '#b45309');
    } else {
      b._atkT++;
      b.x += (dx/dist) * (0.8 + b.phase*0.4);
      b.y += (dy/dist) * (0.8 + b.phase*0.4);
      szClampCavePos(c, b);
      if (b._atkT >= Math.max(80, 200 - b.phase*30)) {
        b._atkT = 0;
        b._chargeV = { vx: dx/dist*11, vy: dy/dist*11 };
        b._chargeT = 28;
        for (let i=0;i<8;i++) s.parts.push({x:b.x,y:b.y,vx:Math.cos(i/8*Math.PI*2)*4,vy:Math.sin(i/8*Math.PI*2)*4,l:18,col:'#fbbf24',r:4});
      }
      if (dist < b.r+22) szDamagePlayer(8,'#b45309');
    }
  } else if (id === 'shadow') {
    b._atkT++;
    const spd = 2.5 + b.phase*0.8;
    b.x += (dx/dist)*spd*0.7; b.y += (dy/dist)*spd*0.7;
    szClampCavePos(c, b);
    if (b._atkT >= Math.max(40,100-b.phase*15)) {
      b._atkT = 0;
      const ang = Math.atan2(dy,dx);
      for (let i=-2;i<=2;i++) {
        const a = ang + i*0.18;
        c.bullets.push({x:b.x,y:b.y,vx:Math.cos(a)*9,vy:Math.sin(a)*9,w:4,h:14,angle:a,col:'#818cf8',en:true,dmg:12,l:200,isRect:true});
      }
    }
    if (dist < b.r+20) szDamagePlayer(6,'#4338ca');
  } else if (id === 'wanderer') {
    b._atkT++; b._sniperT++;
    const evadeDx=-dx/dist, evadeDy=-dy/dist;
    const perpX=-evadeDy, perpY=evadeDx;
    const evade=Math.sin(b.stateT*0.05);
    const spd=1.8+b.phase*0.5;
    b.x += (evadeDx*0.6+perpX*evade)*spd; b.y += (evadeDy*0.6+perpY*evade)*spd;
    szClampCavePos(c, b);
    if (b._sniperT >= Math.max(60,160-b.phase*25)) {
      b._sniperT = 0;
      s.effects.push({type:'sniper_aim',x1:b.x,y1:b.y,x2:px,y2:py,l:30,ml:30});
      const ang=Math.atan2(dy,dx);
      setTimeout(()=>{
        if(!sz||!sz.cave||!sz.activeBoss)return;
        c.bullets.push({x:b.x,y:b.y,vx:Math.cos(ang)*16,vy:Math.sin(ang)*16,w:4,h:22,angle:ang,col:'#10b981',en:true,dmg:40,l:200,isRect:true});
      },500);
    }
  } else if (id === 'spider') {
    b._atkT++; b._spiderT++;
    const spd=0.6+b.phase*0.3;
    b.x += (dx/dist)*spd; b.y += (dy/dist)*spd;
    szClampCavePos(c, b);
    if (b._atkT >= 90) {
      b._atkT=0;
      s.effects.push({type:'poison_cloud',x:b.x,y:b.y,r:120,l:300,ml:300,dmgT:0});
    }
    if (b._spiderT >= Math.max(120,300-b.phase*60)) {
      b._spiderT=0;
      for(let i=0;i<3+b.phase*2;i++){
        const ang=Math.random()*Math.PI*2, d=60+Math.random()*100;
        c.mobs.push({x:b.x+Math.cos(ang)*d,y:b.y+Math.sin(ang)*d,hp:40,maxHp:40,r:12,angle:0,atkT:0,dead:false,col:'#7c3aed',type:'spider_mini'});
      }
    }
    if (dist < b.r+22) szDamagePlayer(4,'#7c3aed');
  }

  const hpPct=b.hp/b.maxHp;
  const newPhase = hpPct<0.25?3:hpPct<0.5?2:hpPct<0.75?1:0;
  if (newPhase>b.phase) { b.phase=newPhase; szSetMsg(`💀 페이즈 ${b.phase+1}!`,2000); }
  b.angle = Math.atan2(dy, dx);

  // 이펙트 독 구름
  s.effects.forEach(e => {
    if (e.type==='poison_cloud') {
      e.dmgT=(e.dmgT||0)+1;
      if(e.dmgT>=40){e.dmgT=0;if(Math.hypot(c.px-e.x,c.py-e.y)<e.r+18)szDamagePlayer(5,'#7c3aed');}
    }
  });
}

function szUpdateCaveMobs(c) {
  const s = sz;
  c.mobs.forEach(m => {
    const dx=c.px-m.x, dy=c.py-m.y;
    const dist=Math.hypot(dx,dy)||1;
    m.angle=Math.atan2(dy,dx);
    // 동굴 몹 AI - 플레이어 추적
    const spd = m.type==='spider_mini' ? 2.8 : 2.0;
    const nx=m.x+(dx/dist)*spd, ny=m.y+(dy/dist)*spd;
    if (szIsInCorridor(c, nx, ny)) { m.x=nx; m.y=ny; }
    else if (szIsInCorridor(c, nx, m.y)) m.x=nx;
    else if (szIsInCorridor(c, m.x, ny)) m.y=ny;

    if (dist < m.r+18) szDamagePlayer(m.type==='spider_mini'?3:8, '#7c3aed');

    // 총알 판정
    c.bullets = c.bullets.filter(bul => {
      if (bul.en||m.dead) return true;
      if (Math.hypot(bul.x-m.x,bul.y-m.y)<m.r+5){m.hp-=bul.dmg;if(m.hp<=0)m.dead=true;return false;}
      return true;
    });
  });
}

function szCaveBossDie() {
  const s = sz;
  const b = s.activeBoss;
  if (!b) return;
  b.dead = true; b.hp = 0;
  s.bossState[b.id] = 'dead';

  // 업적 기록
  if (typeof achStats !== 'undefined') {
    if (!achStats.stormBossKills) achStats.stormBossKills = {};
    achStats.stormBossKills[b.id] = (achStats.stormBossKills[b.id] || 0) + 1;
    if (typeof saveAch === 'function') saveAch();
    if (typeof checkAchievements === 'function') checkAchievements();
  }

  const keyId = b.def.keyId;
  if (!s.keys.includes(keyId)) { s.keys.push(keyId); szSetMsg(`🗝️ ${b.def.keyName} 획득! ESC로 동굴 탈출`, 5000); }
  for (const [id,bd] of Object.entries(SZ_BOSS_DEFS)) { if (bd.requiredKey===keyId) bd.locked=false; }
  for(let i=0;i<50;i++){const ang=Math.random()*Math.PI*2;s.parts.push({x:b.x,y:b.y,vx:Math.cos(ang)*(2+Math.random()*8),vy:Math.sin(ang)*(2+Math.random()*8),l:40+Math.random()*30,col:b.def.col,r:3+Math.random()*5});}
  setTimeout(()=>{if(!sz)return;s.activeBoss=null;s.bossDoor=false;szExitCave(true);},3000);
}

function szDrawCave(ctx, cvW, cvH) {
  const s = sz;
  const c = s.cave;
  if (!c) return;
  const def = c.def;
  const cx = c.camX, cy = c.camY;
  const t = Date.now() * 0.001;

  ctx.save();

  // 배경 (어두운 동굴)
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, cvW, cvH);

  // 복도 바닥 그리기
  def.corridors.forEach((r, i) => {
    const sx = r.x - cx, sy = r.y - cy;
    if (sx > cvW+50 || sx+r.w < -50 || sy > cvH+50 || sy+r.h < -50) return;
    // 바닥 (돌 질감)
    ctx.fillStyle = def.floorCol;
    ctx.fillRect(sx, sy, r.w, r.h);
    // 바닥 패턴
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    for (let gx = (sx % 60); gx < sx + r.w; gx += 60) {
      for (let gy = (sy % 60); gy < sy + r.h; gy += 60) {
        ctx.fillRect(gx, gy, 55, 55);
      }
    }
    // 벽 테두리 (두꺼운 돌)
    ctx.strokeStyle = def.col;
    ctx.lineWidth = 8;
    ctx.strokeRect(sx, sy, r.w, r.h);
  });

  // 보스 룸 강조 (근처면)
  if (c.bossSpawned && s.activeBoss && !s.activeBoss.dead) {
    const bd = s.activeBoss.def;
    const bsx = def.bossPos.x - cx - 300, bsy = def.bossPos.y - cy - 300;
    ctx.save();
    ctx.strokeStyle = bd.col;
    ctx.lineWidth = 4;
    ctx.shadowColor = bd.col;
    ctx.shadowBlur = 20;
    ctx.strokeRect(bsx, bsy, 600, 600);
    ctx.restore();
  }

  // 보스 스폰 포인트 표시 (아직 스폰 안됐으면)
  if (!c.bossSpawned) {
    const bsx = def.bossPos.x - cx, bsy = def.bossPos.y - cy;
    const pulse = 0.5 + 0.5 * Math.sin(t * 3);
    ctx.save();
    ctx.globalAlpha = pulse * 0.5;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(bsx, bsy, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('⚠️ 보스', bsx, bsy - 30);
    ctx.restore();
  }

  // 이펙트 (저격조준선, 독구름)
  s.effects.forEach(e => {
    if (e.type==='sniper_aim') {
      ctx.save(); ctx.globalAlpha=(e.l/e.ml)*0.6;
      ctx.strokeStyle='#10b981'; ctx.lineWidth=2; ctx.setLineDash([8,6]);
      ctx.beginPath(); ctx.moveTo(e.x1-cx,e.y1-cy); ctx.lineTo(e.x2-cx,e.y2-cy); ctx.stroke();
      ctx.restore();
    } else if (e.type==='poison_cloud') {
      ctx.save(); ctx.globalAlpha=(e.l/e.ml)*0.28;
      ctx.fillStyle='#7c3aed';
      ctx.beginPath(); ctx.arc(e.x-cx,e.y-cy,e.r*(1+(1-e.l/e.ml)*0.3),0,Math.PI*2); ctx.fill();
      ctx.restore();
    }
  });

  // 파티클
  s.parts.forEach(p => {
    ctx.save(); ctx.globalAlpha=Math.min(1,p.l/20);
    ctx.fillStyle=p.col||'#a855f7';
    ctx.beginPath(); ctx.arc(p.x-cx,p.y-cy,p.r||3,0,Math.PI*2); ctx.fill();
    ctx.restore();
  });

  // 총알
  c.bullets.forEach(b => {
    const bx=b.x-cx, by=b.y-cy;
    if (b.isRect) {
      ctx.save(); ctx.translate(bx,by); ctx.rotate(b.angle||0);
      ctx.fillStyle=b.col; ctx.shadowColor=b.col; ctx.shadowBlur=8;
      ctx.fillRect(-(b.w||3)/2,-(b.h||14)/2,b.w||3,b.h||14);
      ctx.restore();
    } else {
      ctx.save(); ctx.fillStyle=b.col||'#fde047'; ctx.shadowColor=b.col||'#fde047'; ctx.shadowBlur=10;
      ctx.beginPath(); ctx.arc(bx,by,b.r||5,0,Math.PI*2); ctx.fill(); ctx.restore();
    }
  });

  // 동굴 몹
  c.mobs.forEach(m => {
    const sx=m.x-cx, sy=m.y-cy;
    ctx.save(); ctx.translate(sx,sy); ctx.rotate(m.angle);
    ctx.fillStyle=m.col||'#7c3aed'; ctx.shadowColor=m.col; ctx.shadowBlur=10;
    ctx.beginPath(); ctx.arc(0,0,m.r,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#e9d5ff'; ctx.shadowBlur=0;
    ctx.fillRect(m.r-3,-2,7,4);
    ctx.restore();
  });

  // 보스
  if (s.activeBoss && !s.activeBoss.dead) {
    szDrawBoss(ctx, s.activeBoss, cx, cy);
    if (s.activeBoss.minions) s.activeBoss.minions.forEach(mn=>szDrawMinion(ctx,mn,cx,cy));
  }

  // 플레이어
  const psx = c.px - cx, psy = c.py - cy;
  if (s.playerDmgT > 0 && s.playerDmgT % 4 < 2) {
    ctx.save(); ctx.fillStyle='rgba(255,60,60,0.35)'; ctx.fillRect(0,0,cvW,cvH); ctx.restore();
  }
  ctx.save(); ctx.translate(psx,psy); ctx.rotate(s.pa);
  const pCol = s.hasStormArmor ? '#22d3ee' : '#ef4444';
  ctx.shadowColor=pCol; ctx.shadowBlur=16; ctx.fillStyle=pCol;
  ctx.beginPath(); ctx.arc(0,0,18,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#f8fafc'; ctx.fillRect(12,-4,14,8);
  ctx.restore();

  // 어두운 동굴 분위기 (주변 어둠)
  const radial = ctx.createRadialGradient(cvW/2,cvH/2,cvH*0.12,cvW/2,cvH/2,cvH*0.7);
  radial.addColorStop(0,'rgba(0,0,0,0)');
  radial.addColorStop(1,'rgba(0,0,0,0.88)');
  ctx.fillStyle=radial; ctx.fillRect(0,0,cvW,cvH);

  // HUD (동굴)
  szDrawCaveHUD(ctx, s, cvW, cvH);

  // 메시지
  if (s.msg && s.msgT > 0) {
    const alpha=Math.min(1,s.msgT/20);
    ctx.save(); ctx.globalAlpha=alpha;
    ctx.fillStyle='rgba(0,0,0,0.75)'; ctx.fillRect(cvW/2-220,60,440,38);
    ctx.fillStyle='#e9d5ff'; ctx.font='bold 16px monospace'; ctx.textAlign='center';
    ctx.fillText(s.msg, cvW/2, 85);
    ctx.restore();
  }

  // 사망 오버레이
  if (s._dying) {
    ctx.save(); ctx.fillStyle='rgba(120,0,0,0.72)'; ctx.fillRect(0,0,cvW,cvH);
    ctx.fillStyle='#ff4444'; ctx.font='bold 48px monospace'; ctx.textAlign='center';
    ctx.fillText('☠️ 사망',cvW/2,cvH/2-20);
    ctx.fillStyle='#ffaaaa'; ctx.font='20px monospace';
    ctx.fillText('폭풍구역에서 쓰러졌습니다...',cvW/2,cvH/2+24);
    ctx.restore();
  }

  ctx.restore();
}

function szDrawCaveHUD(ctx, s, cvW, cvH) {
  // HP바
  const hpPct=Math.max(0,s.pHp/s.pMaxHp);
  ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(14,cvH-40,180,22);
  ctx.fillStyle='#374151'; ctx.fillRect(16,cvH-38,176,18);
  const hpCol=hpPct>0.5?'#22c55e':hpPct>0.25?'#f59e0b':'#ef4444';
  ctx.fillStyle=hpCol; ctx.fillRect(16,cvH-38,176*hpPct,18);
  ctx.fillStyle='#fff'; ctx.font='bold 11px monospace'; ctx.textAlign='left';
  ctx.fillText(`❤️ ${Math.ceil(s.pHp)} / ${s.pMaxHp}`,20,cvH-24);
  // 탄약
  ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(14,cvH-66,150,22);
  ctx.fillStyle='#fff'; ctx.font='12px monospace';
  ctx.fillText(`🔫 ${s.pAmmo}/${s.pMaxAmmo}${s.pReload>0?' (재장전)':''}`,18,cvH-50);
  // 동굴 레이블
  const bd=SZ_BOSS_DEFS[sz.cave?.bossId];
  if (bd) {
    ctx.fillStyle=`${bd.col}cc`; ctx.fillRect(cvW-180,14,166,28);
    ctx.fillStyle='#fff'; ctx.font='bold 13px monospace'; ctx.textAlign='center';
    ctx.fillText(`🕳️ ${bd.name}의 동굴`, cvW-97, 32);
  }
  // 보스 HP바 (보스 스폰됐으면)
  if (s.activeBoss && !s.activeBoss.dead) {
    const bpct=Math.max(0,s.activeBoss.hp/s.activeBoss.maxHp);
    const bbd=s.activeBoss.def;
    ctx.fillStyle='rgba(0,0,0,0.8)'; ctx.fillRect(cvW/2-150,cvH-80,300,22);
    ctx.fillStyle=bbd.col2; ctx.fillRect(cvW/2-148,cvH-78,296,18);
    ctx.fillStyle=bbd.col; ctx.fillRect(cvW/2-148,cvH-78,296*bpct,18);
    ctx.fillStyle='#fff'; ctx.font='bold 11px monospace'; ctx.textAlign='center';
    ctx.fillText(`${bbd.name}  ${Math.ceil(s.activeBoss.hp)}/${s.activeBoss.maxHp}`,cvW/2,cvH-64);
  }
  // ESC 힌트 (보스 스폰 전)
  if (!s.activeBoss) {
    ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(cvW/2-100,cvH-108,200,22);
    ctx.fillStyle='#9ca3af'; ctx.font='11px monospace'; ctx.textAlign='center';
    ctx.fillText('[ESC] 동굴 탈출',cvW/2,cvH-91);
  }
}

// ══════════════ 로비 헬기 ══════════════

function updStormZoneHelicopter() {
  const hasStormArmor = (typeof eqArmor !== 'undefined' && eqArmor === 'storm_worksuit');
  const hasToxicAK    = (typeof eqWepId !== 'undefined' && eqWepId === 'toxic_ak');
  const el = document.getElementById('stormZoneHeliBtnWrap');
  if (!el) return;

  if (hasStormArmor) {
    el.style.display = 'flex';
    const lbl = el.querySelector('.sz-heli-label');
    if (hasToxicAK) {
      lbl.textContent = '⚡ 폭풍구역 진입';
      lbl.style.color = '#a855f7';
    } else {
      lbl.textContent = '⚡ 폭풍구역 진입 (독성AK 필요)';
      lbl.style.color = '#f59e0b';
    }
  } else {
    el.style.display = 'none';
  }
}

function onStormZoneHeliClick() {
  // 경고 없이 진입 허용 (갑옷 없으면 데미지)
  if (typeof stopBGM === 'function') stopBGM();
  // 워프 효과
  const warp = document.getElementById('warpFlashFx');
  if (warp) {
    warp.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#7c3aed;opacity:0;transition:opacity .3s;pointer-events:none;';
    setTimeout(() => { warp.style.opacity = '0.9'; }, 50);
    setTimeout(() => { warp.style.opacity = '0'; enterStormZone(); }, 600);
    setTimeout(() => { warp.style.cssText = ''; }, 1200);
  } else {
    enterStormZone();
  }
}

// 마우스 이벤트 (스톰존 전용)
document.addEventListener('mousedown', e => {
  if (!sz) return;
  if (e.button === 0) sz._mdown = true;
});
document.addEventListener('mouseup', e => {
  if (!sz) return;
  if (e.button === 0) sz._mdown = false;
});
document.addEventListener('mousemove', e => {
  if (!sz) return;
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  sz._mouseX = (e.clientX - rect.left) * scaleX;
  sz._mouseY = (e.clientY - rect.top) * scaleY;
});
