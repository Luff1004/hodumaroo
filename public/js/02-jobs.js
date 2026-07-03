// ══════════════ 직업 시스템 ══════════════
const JOBS = [
  {
    id:'necromancer', name:'네크로맨서', icon:'💀', price:100000,
    desc:'죽은 좀비를 부하로 만들어 싸우게 한다.\n처치한 좀비 10%가 아군으로 부활.',
    color:'#7c3aed', skinBg:'linear-gradient(135deg,#1e0a3c,#3d1278)',
    skills:[
      {key:'E',name:'부활 소환',icon:'💀',desc:'주변 좀비 3마리를 즉시 아군으로 전환',cd:600,fn:'jobSkillE'},
      {key:'Q',name:'해골 폭풍',icon:'🌀',desc:'모든 아군 좀비가 폭발하며 범위 피해',cd:900,fn:'jobSkillQ'},
    ]
  },
  {
    id:'miner', name:'광부', icon:'⛏️', price:50000,
    desc:'코인 획득량 +20%\n적 처치 시 추가 코인 드롭.',
    color:'#f59e0b', skinBg:'linear-gradient(135deg,#451a03,#92400e)',
    skills:[
      {key:'E',name:'황금 채굴',icon:'💰',desc:'10초간 코인 획득량 3배',cd:720,fn:'jobSkillE'},
    ]
  },
  {
    id:'ninja', name:'닌자', icon:'🥷', price:200000,
    desc:'이동속도 +1, 회피율 +15%\n적에게 들키지 않고 순간이동.',
    color:'#1f2937', skinBg:'linear-gradient(135deg,#111827,#374151)',
    skills:[
      {key:'E',name:'순간이동',icon:'⚡',desc:'마우스 위치로 즉시 순간이동 + 1초 무적',cd:480,fn:'jobSkillE'},
      {key:'Q',name:'분신술',icon:'👥',desc:'3초간 잔상 분신 생성, 피해 분산',cd:900,fn:'jobSkillQ'},
    ]
  },
  {
    id:'pyro', name:'파이로맨서', icon:'🔥', price:150000,
    desc:'모든 공격에 화염 효과 추가\n불꽃이 주변 좀비에게 번진다.',
    color:'#dc2626', skinBg:'linear-gradient(135deg,#450a0a,#7f1d1d)',
    skills:[
      {key:'E',name:'화염 폭풍',icon:'🌪️',desc:'화면 전체에 불길 발사',cd:600,fn:'jobSkillE'},
    ]
  },
  {
    id:'medic', name:'메딕', icon:'💉', price:180000,
    desc:'최대 HP +50, 초당 HP 재생 +2\n위기 시 자동 회복 발동.',
    color:'#22c55e', skinBg:'linear-gradient(135deg,#052e16,#166534)',
    skills:[
      {key:'E',name:'긴급 치료',icon:'❤️',desc:'즉시 HP 50% 회복',cd:900,fn:'jobSkillE'},
    ]
  },
  {
    id:'engineer', name:'엔지니어', icon:'🔧', price:250000,
    desc:'포탑을 설치해 자동으로 사격\n탄환 관통 효과 추가.',
    color:'#0284c7', skinBg:'linear-gradient(135deg,#0c4a6e,#075985)',
    skills:[
      {key:'E',name:'포탑 설치',icon:'🏗️',desc:'현재 위치에 15초 지속 포탑 설치',cd:600,fn:'jobSkillE'},
      {key:'Q',name:'오버클럭',icon:'⚙️',desc:'10초간 발사속도 3배',cd:720,fn:'jobSkillQ'},
    ]
  },
  {
    id:'berserker', name:'버서커', icon:'⚔️', price:200000,
    desc:'HP가 낮을수록 공격력 증가\nHP 30% 이하: 데미지 2배.',
    color:'#dc2626', skinBg:'linear-gradient(135deg,#450a0a,#991b1b)',
    skills:[
      {key:'E',name:'광전사 질주',icon:'💢',desc:'5초간 무적+속도3배+데미지2배',cd:900,fn:'jobSkillE'},
    ]
  },
  {
    id:'sniper_job', name:'스나이퍼', icon:'🔭', price:280000,
    desc:'조준 시 적의 약점 표시\n치명타 확률 +25%, 치명타 피해 3배.',
    color:'#15803d', skinBg:'linear-gradient(135deg,#052e16,#14532d)',
    skills:[
      {key:'E',name:'집중 조준',icon:'🎯',desc:'다음 탄환 확정 치명타 + 피해 5배',cd:480,fn:'jobSkillE'},
    ]
  },
  {
    id:'time_mage', name:'시간마법사', icon:'⏳', price:500000,
    desc:'시간감속 특성 강화\n이동 중 시간이 느려지는 효과.',
    color:'#6d28d9', skinBg:'linear-gradient(135deg,#2e1065,#4c1d95)',
    skills:[
      {key:'E',name:'시간 정지',icon:'⏸️',desc:'3초간 모든 좀비 완전 정지',cd:900,fn:'jobSkillE'},
      {key:'Q',name:'시간 되감기',icon:'⏪',desc:'5초 전으로 HP 되돌리기',cd:1200,fn:'jobSkillQ'},
    ]
  },

  {id:'gunslinger',name:'건슬링거',icon:'🔫',price:150000,desc:'재장전 속도 2배. 치명타 확률+10%.',color:'#f59e0b',skinBg:'linear-gradient(135deg,#451a03,#92400e)',
   skills:[{key:'E',name:'급사',icon:'🔫',desc:'2초간 무한탄약+발사속도 3배',cd:720,fn:'jobSkillE'}]},
  {id:'paladin',name:'성기사',icon:'🛡️',price:200000,desc:'방어력+20%, 피격 시 주변 적 밀어냄.',color:'#fde047',skinBg:'linear-gradient(135deg,#713f12,#ca8a04)',
   skills:[{key:'E',name:'신성 방패',icon:'✨',desc:'3초간 완전 무적+주변 적 밀어냄',cd:900,fn:'jobSkillE'}]},
  {id:'rogue',name:'로그',icon:'🗡️',price:220000,desc:'이동속도+0.8, 백스탭 시 데미지 3배.',color:'#1f2937',skinBg:'linear-gradient(135deg,#0f172a,#1e293b)',
   skills:[{key:'E',name:'은신',icon:'👤',desc:'3초간 은신. 첫 공격 데미지 5배',cd:600,fn:'jobSkillE'},{key:'Q',name:'연막탄',icon:'💨',desc:'주변에 연막 생성. 적 이동 방해',cd:480,fn:'jobSkillQ'}]},
  {id:'shaman',name:'주술사',icon:'🌀',price:250000,desc:'독/화염 데미지 2배. 주변 독 구름 상시 유지.',color:'#16a34a',skinBg:'linear-gradient(135deg,#052e16,#166534)',
   skills:[{key:'E',name:'주술 폭발',icon:'🌀',desc:'주변 전체 독+화염 동시 폭발',cd:600,fn:'jobSkillE'},{key:'Q',name:'독구름',icon:'☁️',desc:'대형 독구름 3개 생성',cd:480,fn:'jobSkillQ'}]},
  {id:'knight',name:'기사',icon:'⚔️',price:280000,desc:'최대HP+80. 근접 공격 범위 2배.',color:'#94a3b8',skinBg:'linear-gradient(135deg,#1e293b,#334155)',
   skills:[{key:'E',name:'돌진',icon:'🚀',desc:'적 방향으로 돌진. 충돌 시 100 데미지',cd:480,fn:'jobSkillE'}]},
  {id:'witch',name:'마녀',icon:'🧙‍♀️',price:300000,desc:'마법 데미지+50%. 마법탄 자동 발사.',color:'#7c3aed',skinBg:'linear-gradient(135deg,#2e1065,#4c1d95)',
   skills:[{key:'E',name:'마법 폭풍',icon:'✨',desc:'16방향 마법탄 발사',cd:480,fn:'jobSkillE'},{key:'Q',name:'저주',icon:'🔮',desc:'가장 강한 적 HP 50% 즉시 감소',cd:900,fn:'jobSkillQ'}]},
  {id:'viking',name:'바이킹',icon:'🪓',price:250000,desc:'근접 공격 데미지+4. 체력 낮을수록 공격속도 증가.',color:'#b45309',skinBg:'linear-gradient(135deg,#451a03,#78350f)',
   skills:[{key:'E',name:'전투 함성',icon:'⚔️',desc:'5초간 이동+공격 모두 2배',cd:720,fn:'jobSkillE'}]},
  {id:'archer',name:'궁수',icon:'🏹',price:180000,desc:'화살 관통. 원거리 데미지+3.',color:'#15803d',skinBg:'linear-gradient(135deg,#052e16,#14532d)',
   skills:[{key:'E',name:'화살 폭풍',icon:'🏹',desc:'360도 화살 24발 발사',cd:540,fn:'jobSkillE'}]},
  {id:'vampire',name:'뱀파이어',icon:'🧛',price:350000,desc:'처치 시 HP+5. 어둠 속에서 강해짐.',color:'#7f1d1d',skinBg:'linear-gradient(135deg,#1a0000,#450a0a)',
   skills:[{key:'E',name:'피의 폭풍',icon:'🩸',desc:'8방향 흡혈탄. 명중 시 HP+8',cd:600,fn:'jobSkillE'},{key:'Q',name:'박쥐 떼',icon:'🦇',desc:'박쥐 12마리 소환 (15초)',cd:900,fn:'jobSkillQ'}]},
  {id:'scientist',name:'과학자',icon:'🧪',price:320000,desc:'특수 폭탄 투척. 화학 무기 강화.',color:'#06b6d4',skinBg:'linear-gradient(135deg,#0c4a6e,#0e7490)',
   skills:[{key:'E',name:'화학 폭탄',icon:'🧪',desc:'대형 독+화염 복합 폭탄 투척',cd:540,fn:'jobSkillE'},{key:'Q',name:'로봇 드론',icon:'🤖',desc:'공격 드론 3기 30초 배치',cd:720,fn:'jobSkillQ'}]},
  {id:'demon_job',name:'악마 계약자',icon:'😈',price:450000,desc:'데미지+5, 최대HP-50. 처치마다 강해짐.',color:'#991b1b',skinBg:'linear-gradient(135deg,#450a0a,#7f1d1d)',
   skills:[{key:'E',name:'악마 형태',icon:'😈',desc:'5초간 데미지 3배+무적',cd:900,fn:'jobSkillE'}]},
  {id:'pirate',name:'해적',icon:'🏴‍☠️',price:180000,desc:'코인+30%. 운이 좋아짐.',color:'#ca8a04',skinBg:'linear-gradient(135deg,#1c1917,#292524)',
   skills:[{key:'E',name:'함포 사격',icon:'💣',desc:'전방 대형 포탄 3발',cd:480,fn:'jobSkillE'}]},
  {id:'monk',name:'수도사',icon:'🧘',price:380000,desc:'재생+3, 방어+15%. 명상으로 강해짐.',color:'#d97706',skinBg:'linear-gradient(135deg,#292524,#44403c)',
   skills:[{key:'E',name:'기공탄',icon:'🌐',desc:'강력한 기공탄 5연발',cd:540,fn:'jobSkillE'},{key:'Q',name:'명상',icon:'🧘',desc:'3초간 완전 회복+방어막',cd:900,fn:'jobSkillQ'}]},
  {id:'robot',name:'로봇',icon:'🤖',price:800000,desc:'탄약 무제한. 발사속도+50%.',color:'#0ea5e9',skinBg:'linear-gradient(135deg,#0c4a6e,#1e40af)',
   skills:[{key:'E',name:'레이저 빔',icon:'⚡',desc:'전방 레이저 빔 3초 지속',cd:720,fn:'jobSkillE'},{key:'Q',name:'자폭 드론',icon:'💥',desc:'자폭 드론 5기 발사',cd:600,fn:'jobSkillQ'}]},
  {id:'dragon_job',name:'용기사',icon:'🐉',price:600000,desc:'화염 공격+4. 용 소환 강화.',color:'#dc2626',skinBg:'linear-gradient(135deg,#7f1d1d,#b91c1c)',
   skills:[{key:'E',name:'용의 숨결',icon:'🔥',desc:'전방 화염 빔 발사',cd:480,fn:'jobSkillE'},{key:'Q',name:'대용 소환',icon:'🐉',desc:'대형 드래곤 1기 소환 (30초)',cd:1200,fn:'jobSkillQ'}]},
  {id:'god',name:'신',icon:'⭐',price:9990000,desc:'모든 스탯+50%. 전지전능.',color:'#fbbf24',skinBg:'linear-gradient(135deg,#fef9c3,#fde047)',
   skills:[{key:'E',name:'신의 심판',icon:'⭐',desc:'맵 전체 적 50% HP 감소+전멸 탄막',cd:1200,fn:'jobSkillE'},{key:'Q',name:'부활',icon:'✨',desc:'즉시 HP 전체 회복+10초 무적',cd:1800,fn:'jobSkillQ'}]},
  {
    id:'summoner', name:'소환사', icon:'🌟', price:500000,
    desc:'강력한 동물 소환수를 불러낸다\n소환수가 함께 싸운다.',
    color:'#d97706', skinBg:'linear-gradient(135deg,#451a03,#78350f)',
    skills:[
      {key:'E',name:'늑대 소환',icon:'🐺',desc:'전투 늑대 2마리 소환 (20초)',cd:600,fn:'jobSkillE'},
      {key:'Q',name:'드래곤 소환',icon:'🐲',desc:'미니 드래곤 소환 (10초), 강력한 화염',cd:1200,fn:'jobSkillQ'},
    ]
  },
  // ── 추가 직업 14종 (총 40종) ──
  {id:'alchemist',name:'연금술사',icon:'⚗️',price:350000,
   desc:'물약 제조. 다양한 효과의 물약 투척.',
   color:'#10b981',skinBg:'linear-gradient(135deg,#052e16,#065f46)',
   skills:[{key:'E',name:'힐 포션',icon:'💚',desc:'HP 70% 즉시 회복 + 10초 재생',cd:720,fn:'jobSkillE'},{key:'Q',name:'폭발 포션',icon:'🧪',desc:'범위 200 폭발탄 3개 투척',cd:480,fn:'jobSkillQ'}]},
  {id:'tamer',name:'조련사',icon:'🐾',price:420000,
   desc:'동물들을 조련. 다양한 동물 소환.',
   color:'#92400e',skinBg:'linear-gradient(135deg,#1c1917,#44403c)',
   skills:[{key:'E',name:'호랑이 소환',icon:'🐯',desc:'강력한 호랑이 소환 (25초)',cd:600,fn:'jobSkillE'},{key:'Q',name:'독수리 공격',icon:'🦅',desc:'독수리 5마리 공중 급습',cd:480,fn:'jobSkillQ'}]},
  {id:'gladiator',name:'검투사',icon:'🏟️',price:380000,
   desc:'아레나 전사. 피해를 입을수록 강해짐.',
   color:'#dc2626',skinBg:'linear-gradient(135deg,#450a0a,#7f1d1d)',
   skills:[{key:'E',name:'전투 광기',icon:'⚔️',desc:'5초간 HP낮을수록 공격력 최대 5배',cd:600,fn:'jobSkillE'}]},
  {id:'oracle',name:'오라클',icon:'🔮',price:500000,
   desc:'미래를 본다. 적의 움직임 예측+회피율↑.',
   color:'#7c3aed',skinBg:'linear-gradient(135deg,#2e1065,#4c1d95)',
   skills:[{key:'E',name:'예언 방패',icon:'🔮',desc:'3초간 완전 회피+반격 데미지',cd:720,fn:'jobSkillE'},{key:'Q',name:'운명 역전',icon:'🌀',desc:'현재 HP와 가장 강한 적 HP 교환',cd:1500,fn:'jobSkillQ'}]},
  {id:'reaper',name:'사신',icon:'💀',price:600000,
   desc:'죽음의 사자. 즉사 확률+처치마다 강해짐.',
   color:'#1f2937',skinBg:'linear-gradient(135deg,#030712,#111827)',
   skills:[{key:'E',name:'죽음의 낫',icon:'☠️',desc:'전방 낫 공격. 5% 즉사 확률',cd:480,fn:'jobSkillE'},{key:'Q',name:'영혼 수확',icon:'💀',desc:'화면 내 모든 적 동시 5% HP 감소',cd:900,fn:'jobSkillQ'}]},
  {id:'templar',name:'성전사',icon:'✝️',price:550000,
   desc:'신의 가호. 방어+공격 동시 강화.',
   color:'#fbbf24',skinBg:'linear-gradient(135deg,#713f12,#92400e)',
   skills:[{key:'E',name:'신성 검격',icon:'✝️',desc:'신성 에너지 검격 5연타',cd:480,fn:'jobSkillE'},{key:'Q',name:'성역',icon:'⛪',desc:'5초간 반경 150 이내 적 접근 불가',cd:900,fn:'jobSkillQ'}]},
  {id:'hunter',name:'사냥꾼',icon:'🏹',price:400000,
   desc:'원거리 전문가. 이동 중 정확도↑.',
   color:'#15803d',skinBg:'linear-gradient(135deg,#052e16,#166534)',
   skills:[{key:'E',name:'독화살 폭풍',icon:'🏹',desc:'독화살 10발 연속 발사',cd:480,fn:'jobSkillE'}]},
  {id:'berserker2',name:'광전사',icon:'😤',price:430000,
   desc:'분노 게이지. 처치마다 스택 쌓임.',
   color:'#b45309',skinBg:'linear-gradient(135deg,#451a03,#78350f)',
   skills:[{key:'E',name:'분노 폭발',icon:'💢',desc:'스택 소모, 스택×10 데미지 전방 방출',cd:600,fn:'jobSkillE'},{key:'Q',name:'피의 함성',icon:'🩸',desc:'주변 적에게 공포. 5초간 도망침',cd:720,fn:'jobSkillQ'}]},
  {id:'chrono',name:'시간술사',icon:'⌛',price:700000,
   desc:'시간 조작 전문가. 과거로 회귀 가능.',
   color:'#6d28d9',skinBg:'linear-gradient(135deg,#1e0a3c,#2e1065)',
   skills:[{key:'E',name:'시간 역행',icon:'⏪',desc:'10초 전 위치+HP로 귀환',cd:900,fn:'jobSkillE'},{key:'Q',name:'시간 가속',icon:'⏩',desc:'5초간 시간 2배 속도(이동+공격)',cd:720,fn:'jobSkillQ'}]},
  {id:'illusionist',name:'환술사',icon:'🎭',price:480000,
   desc:'환영으로 적을 혼란. 분신 5개 생성.',
   color:'#ec4899',skinBg:'linear-gradient(135deg,#500724,#831843)',
   skills:[{key:'E',name:'환영 폭발',icon:'🎭',desc:'환영 5개 생성, 각각 폭발',cd:600,fn:'jobSkillE'},{key:'Q',name:'혼란의 장',icon:'🌀',desc:'화면 내 모든 적 방향 혼란 5초',cd:720,fn:'jobSkillQ'}]},
  {id:'bard',name:'음유시인',icon:'🎵',price:300000,
   desc:'음악으로 버프. 주변 아군 강화.',
   color:'#f59e0b',skinBg:'linear-gradient(135deg,#1c1917,#292524)',
   skills:[{key:'E',name:'전쟁의 노래',icon:'🎵',desc:'15초간 이동+데미지+재생 모두+50%',cd:900,fn:'jobSkillE'}]},
  {id:'warlord',name:'군주',icon:'👑',price:900000,
   desc:'전장의 지배자. 모든 소환수 강화×2.',
   color:'#fbbf24',skinBg:'linear-gradient(135deg,#1c1917,#292524)',
   skills:[{key:'E',name:'군주 선언',icon:'👑',desc:'10초간 모든 능력+40%+소환수 강화',cd:1200,fn:'jobSkillE'},{key:'Q',name:'제국의 군대',icon:'⚔️',desc:'골렘+늑대+드래곤 동시 소환',cd:1500,fn:'jobSkillQ'}]},
  {id:'trickster',name:'트릭스터',icon:'🃏',price:420000,
   desc:'변덕스러운 운명. 랜덤 강력 효과 발동.',
   color:'#ec4899',skinBg:'linear-gradient(135deg,#500724,#9d174d)',
   skills:[{key:'E',name:'운명의 카드',icon:'🃏',desc:'랜덤 효과: 무적/전멸/부활/폭발 중 1개',cd:480,fn:'jobSkillE'}]},
  {id:'demigod',name:'반신',icon:'🌟',price:2000000,
   desc:'신의 피. 모든 스탯+30%, 부활 가능.',
   color:'#fbbf24',skinBg:'linear-gradient(135deg,#1a0a00,#451a03)',
   skills:[{key:'E',name:'신격화',icon:'🌟',desc:'10초간 무적+데미지×5+전방위 탄막',cd:1200,fn:'jobSkillE'},{key:'Q',name:'신의 심판2',icon:'⚡',desc:'화면 전체 적 즉시 30% HP 감소',cd:900,fn:'jobSkillQ'}]},
  // ── 시즌패스 전용 직업 12종 (월별) ──
  {id:'sp_job_jan',name:'[시즌] 빙하술사',icon:'🧊',price:0,desc:'1월 시즌Lv.50. 냉기 마법사. 모든 적 동결+극강 빙결 공격.',color:'#7dd3fc',skinBg:'linear-gradient(135deg,#0c4a6e,#0ea5e9)',spOnly:true,rarity:'legendary',spMonth:1,spLv:50,
    skills:[{key:'E',name:'빙하 폭발',icon:'🧊',desc:'반경 350 전체 동결+120 데미지',cd:600,fn:'jobSkillE'},{key:'Q',name:'눈보라',icon:'❄️',desc:'15초간 모든 적 이동속도 -70%',cd:900,fn:'jobSkillQ'}]},
  {id:'sp_job_feb',name:'[시즌] 눈의 여왕',icon:'👸',price:0,desc:'2월 시즌Lv.50. 얼음 지배자. 처치 시 HP+8, 빙결 지속.',color:'#bae6fd',skinBg:'linear-gradient(135deg,#1e3a5f,#3b82f6)',spOnly:true,rarity:'legendary',spMonth:2,spLv:50,
    skills:[{key:'E',name:'얼음 왕관',icon:'👑',desc:'5초간 완전무적+주변 360도 얼음탄 연속 발사',cd:720,fn:'jobSkillE'},{key:'Q',name:'빙결 지배',icon:'🏔️',desc:'맵 전체 적 영구 동결 5초',cd:1200,fn:'jobSkillQ'}]},
  {id:'sp_job_mar',name:'[시즌] 우주인',icon:'👨‍🚀',price:0,desc:'3월 시즌Lv.50. 우주 전투원. 중력 조작+에너지 무기 강화.',color:'#6366f1',skinBg:'linear-gradient(135deg,#0f0020,#2e1065)',spOnly:true,rarity:'legendary',spMonth:3,spLv:50,
    skills:[{key:'E',name:'중력 붕괴',icon:'🌌',desc:'반경 400 모든 적 중앙으로 흡수+150 데미지',cd:600,fn:'jobSkillE'},{key:'Q',name:'우주 포격',icon:'🚀',desc:'무작위 위치 30발 운석 폭격',cd:900,fn:'jobSkillQ'}]},
  {id:'sp_job_apr',name:'[시즌] 봄의 정령',icon:'🌸',price:0,desc:'4월 시즌Lv.50. 자연의 정령. 꽃잎 소환+치유 오라.',color:'#f9a8d4',skinBg:'linear-gradient(135deg,#4a044e,#9d174d)',spOnly:true,rarity:'legendary',spMonth:4,spLv:50,
    skills:[{key:'E',name:'꽃잎 폭풍',icon:'🌸',desc:'꽃잎 72발 전방위 발사+3초간 HP 매초 10 회복',cd:540,fn:'jobSkillE'},{key:'Q',name:'봄 소생',icon:'🌱',desc:'즉시 HP 완전회복+20초간 HP 재생',cd:1200,fn:'jobSkillQ'}]},
  {id:'sp_job_may',name:'[시즌] 태양 전사',icon:'☀️',price:0,desc:'5월 시즌Lv.50. 태양의 전사. 화염 데미지 3배+솔라 빔.',color:'#fbbf24',skinBg:'linear-gradient(135deg,#7c2d12,#b45309)',spOnly:true,rarity:'legendary',spMonth:5,spLv:50,
    skills:[{key:'E',name:'솔라 빔',icon:'☀️',desc:'전방 솔라 레이저 빔 200 데미지',cd:480,fn:'jobSkillE'},{key:'Q',name:'일식',icon:'🌑',desc:'5초간 무적+전체화면 화염 폭발',cd:1000,fn:'jobSkillQ'}]},
  {id:'sp_job_jun',name:'[시즌] 파도 술사',icon:'🌊',price:0,desc:'6월 시즌Lv.50. 바다 지배자. 물 속성 공격+흡수.',color:'#0ea5e9',skinBg:'linear-gradient(135deg,#0c4a6e,#164e63)',spOnly:true,rarity:'legendary',spMonth:6,spLv:50,
    skills:[{key:'E',name:'해일',icon:'🌊',desc:'전방 대형 파도 150 데미지+밀어내기',cd:500,fn:'jobSkillE'},{key:'Q',name:'조류',icon:'💧',desc:'10초간 이동속도+2+처치시HP+15',cd:900,fn:'jobSkillQ'}]},
  {id:'sp_job_jul',name:'[시즌] 낙엽 검사',icon:'🍂',price:0,desc:'7월 시즌Lv.50. 가을 검사. 낙엽 베기+데미지 누적.',color:'#d97706',skinBg:'linear-gradient(135deg,#451a03,#92400e)',spOnly:true,rarity:'legendary',spMonth:7,spLv:50,
    skills:[{key:'E',name:'낙엽 폭풍',icon:'🍂',desc:'낙엽 48발 360도+근접 130 데미지',cd:480,fn:'jobSkillE'},{key:'Q',name:'가을 폭풍',icon:'🌪️',desc:'회오리바람 소환 - 적 10초간 추적',cd:900,fn:'jobSkillQ'}]},
  {id:'sp_job_aug',name:'[시즌] 용암 왕',icon:'🌋',price:0,desc:'8월 시즌Lv.50. 용암 지배자. 화염+폭발 최강.',color:'#f97316',skinBg:'linear-gradient(135deg,#7f1d1d,#b91c1c)',spOnly:true,rarity:'legendary',spMonth:8,spLv:50,
    skills:[{key:'E',name:'용암 분출',icon:'🌋',desc:'반경 300 용암 범람+200 데미지',cd:540,fn:'jobSkillE'},{key:'Q',name:'화산 폭발',icon:'💥',desc:'맵 전체 화산탄 30발 동시 낙하',cd:1000,fn:'jobSkillQ'}]},
  {id:'sp_job_sep',name:'[시즌] 폭풍의 신',icon:'⛈️',price:0,desc:'9월 시즌Lv.50. 폭풍 지배자. 번개+바람 복합.',color:'#a3e635',skinBg:'linear-gradient(135deg,#1a2e05,#365314)',spOnly:true,rarity:'mythic',spMonth:9,spLv:50,
    skills:[{key:'E',name:'폭풍 번개',icon:'⚡',desc:'8방향 번개+연쇄 무한 반복 2초',cd:480,fn:'jobSkillE'},{key:'Q',name:'태풍',icon:'🌀',desc:'맵 전체 회오리+모든 적 기절 4초',cd:1200,fn:'jobSkillQ'}]},
  {id:'sp_job_oct',name:'[시즌] 달빛 사신',icon:'🌙',price:0,desc:'10월 시즌Lv.50. 달빛 사신. 암살+흡혈 특화.',color:'#a78bfa',skinBg:'linear-gradient(135deg,#1e1b4b,#4c1d95)',spOnly:true,rarity:'mythic',spMonth:10,spLv:50,
    skills:[{key:'E',name:'월식 참격',icon:'🌙',desc:'전방 200 데미지+암흑 구역 생성(적 이동불가)',cd:540,fn:'jobSkillE'},{key:'Q',name:'달빛 형태',icon:'✨',desc:'10초간 이동속도 3배+처치시HP+20+무적',cd:1200,fn:'jobSkillQ'}]},
  {id:'sp_job_nov',name:'[시즌] 성운 마법사',icon:'🌌',price:0,desc:'11월 시즌Lv.50. 우주 마법사. 성운 폭발+중력 지배.',color:'#818cf8',skinBg:'linear-gradient(135deg,#0f0020,#1e1b4b)',spOnly:true,rarity:'mythic',spMonth:11,spLv:50,
    skills:[{key:'E',name:'성운 폭발',icon:'🌌',desc:'반경 500 전체 160 데미지+에너지 충전',cd:600,fn:'jobSkillE'},{key:'Q',name:'은하 폭발',icon:'💫',desc:'맵 전체 별빛 탄막 60발+적 HP 50% 감소',cd:1200,fn:'jobSkillQ'}]},
  {id:'sp_job_dec',name:'[시즌] 별의 왕',icon:'⭐',price:0,desc:'12월 시즌Lv.50. 우주의 왕. 최강 시즌 직업.',color:'#fbbf24',skinBg:'linear-gradient(135deg,#1a0a00,#451a03)',spOnly:true,rarity:'mythic',spMonth:12,spLv:50,
    skills:[{key:'E',name:'별의 심판',icon:'⭐',desc:'전체 적 HP 80% 제거+황금 탄막 72발',cd:720,fn:'jobSkillE'},{key:'Q',name:'빅뱅',icon:'💥',desc:'맵 전체 폭발+15초 무적+완전회복',cd:1800,fn:'jobSkillQ'}]},
  // ── 시즌패스 전용 직업 (짝수월 보상) ──
  {
    id:'sp_job25', name:'[시즌] 성흔의 전사',spMonth:'짝수월', spLv:25, icon:'🌠', price:0,
    desc:'시즌패스 Lv.25 전용. 성흔의 힘으로 모든 능력 강화.',
    color:'#6366f1', skinBg:'linear-gradient(135deg,#1e1b4b,#4338ca)',
    spOnly:true,
    skills:[
      {key:'E',name:'성흔 폭발',icon:'🌠',desc:'반경 300 모든 적에게 200 데미지 + 기절 2초',cd:600,fn:'jobSkillE'},
      {key:'Q',name:'성흔 방패',icon:'🛡️',desc:'5초간 피해 90% 감소 + 반사 데미지',cd:900,fn:'jobSkillQ'},
    ]
  },
  {
    id:'sp_job50', name:'[시즌] 별의 신',spMonth:'짝수월', spLv:50, icon:'💫', price:0,
    desc:'시즌패스 Lv.50 전용. 별의 힘으로 전지전능.',
    color:'#fbbf24', skinBg:'linear-gradient(135deg,#1a0a00,#78350f)',
    spOnly:true,
    skills:[
      {key:'E',name:'별의 심판',icon:'💫',desc:'맵 전체 모든 적 HP 70% 제거 + 무지개 탄막 48발',cd:900,fn:'jobSkillE'},
      {key:'Q',name:'신성 부활',icon:'✨',desc:'즉시 HP 완전회복 + 30초 무적 + 이동속도 2배',cd:1800,fn:'jobSkillQ'},
    ]
  },
];

let ownedJobs = lJ('hd_jobs', {});
let jobLv = lJ('hd_jlv', {});
let equippedJob = lS('hd_job', '');
let selJobId = '';

function getJobUpgCost(id){const lv2=jobLv[id]||0;return lv2<10?500*(lv2+1):lv2<21?5000*(lv2-8):20000*(lv2-19);}
function upgradeJob(id){
  const cost=getJobUpgCost(id);
  if(energy<cost||!ownedJobs[id])return;
  energy-=cost;
  jobLv[id]=(jobLv[id]||0)+1;
  saveJobData();sv('hd_e',energy);updRes();
  renderJob();
}
function saveJobData() {
  sv('hd_jobs', ownedJobs);
  sv('hd_job', equippedJob || '');
  sv('hd_jlv', jobLv);
}

function renderJob() {
  const jcEl=document.getElementById('jc');if(jcEl)jcEl.textContent=coins;
  const jeEl=document.getElementById('je');if(jeEl)jeEl.textContent=energy;
  const list=document.getElementById('jobList');
  if(!list)return;
  list.innerHTML='';

  JOBS.forEach(job=>{
    const isOwned=ownedJobs[job.id]||false;
    const isEq=equippedJob===job.id;
    const canBuy=!isOwned&&coins>=job.price;
    const isSel=selJobId===job.id;
    const lv2=jobLv[job.id]||0;
    const isHyper=lv2>21;

    const div=document.createElement('div');
    div.style.cssText='background:#fff;border-radius:12px;padding:10px 12px;cursor:pointer;display:flex;align-items:flex-start;gap:10px;transition:all .15s;border:2px solid '+(isEq?job.color:isOwned?'#6ee7b7':'#e5e7eb')+(isSel?';box-shadow:0 0 0 3px '+job.color+'44':'');

    const ico=document.createElement('div');
    ico.style.cssText='font-size:28px;flex-shrink:0;margin-top:2px';ico.textContent=job.icon;div.appendChild(ico);

    const info=document.createElement('div');info.style.flex='1';info.style.minWidth='0';
    const nm=document.createElement('div');nm.style.cssText='font-size:12px;font-weight:800;color:#1f2937';
    nm.textContent=job.name+(lv2>0?(isHyper?' ✨HYPER Lv.'+(lv2-21):' Lv.'+lv2):'');info.appendChild(nm);
    const ds=document.createElement('div');ds.style.cssText='font-size:9px;color:#6b7280;margin-top:2px;line-height:1.3';ds.textContent=job.desc.split('\n')[0];info.appendChild(ds);
    if(isEq||isOwned){const tg=document.createElement('div');tg.style.cssText='font-size:9px;margin-top:3px;font-weight:700;color:'+job.color;tg.textContent=isEq?'✅ 장착중':'보유';info.appendChild(tg);}
    div.appendChild(info);

    // 버튼 영역
    const bw=document.createElement('div');bw.style.cssText='flex-shrink:0;display:flex;flex-direction:column;gap:4px;min-width:80px';

    if(job.spOnly&&!isOwned){
      const sbtn=document.createElement('button');
      sbtn.style.cssText='padding:5px 8px;border:none;border-radius:7px;font-size:9px;font-weight:700;width:100%;background:#1e1b4b;color:#a78bfa;cursor:default;';
      const mStr2=job.spMonth?job.spMonth+'월 Lv.'+job.spLv+' 보상':'시즌패스 전용';
      sbtn.textContent='🌟 '+mStr2;
      bw.appendChild(sbtn);
    } else if(isOwned){
      // 장착/해제 버튼
      const btn=document.createElement('button');
      btn.style.cssText='padding:5px 8px;border:none;border-radius:7px;font-size:10px;font-weight:700;cursor:pointer;width:100%;background:'+(isEq?'#fee2e2':isHyper?'linear-gradient(135deg,#9333ea,#fbbf24)':'linear-gradient(135deg,'+job.color+','+job.color+'bb)')+';color:'+(isEq?'#dc2626':'#fff');
      btn.textContent=isEq?'해제':'장착';
      btn.onclick=(e)=>{e.stopPropagation();equipJob(job.id);};
      bw.appendChild(btn);

      // 업그레이드 버튼
      const upgCost=getJobUpgCost(job.id);
      const canUpg=energy>=upgCost;
      const ubtn=document.createElement('button');
      ubtn.style.cssText='padding:4px 8px;border:none;border-radius:7px;font-size:9px;font-weight:700;cursor:pointer;width:100%;background:'+(canUpg?(lv2>=21?'linear-gradient(135deg,#9333ea,#fbbf24)':'linear-gradient(135deg,#7c3aed,#a855f7)'):'#e5e7eb')+';color:'+(canUpg?'#fff':'#9ca3af');
      ubtn.disabled=!canUpg;
      ubtn.textContent=(lv2>=21?'✨HYPER':'⬆ Lv.'+(lv2+1))+' ⚡'+upgCost.toLocaleString();
      ubtn.onclick=(e)=>{e.stopPropagation();upgradeJob(job.id);};
      bw.appendChild(ubtn);
    } else {
      const btn=document.createElement('button');
      btn.style.cssText='padding:5px 8px;border:none;border-radius:7px;font-size:10px;font-weight:700;cursor:pointer;width:100%;background:'+(canBuy?'linear-gradient(135deg,#f59e0b,#d97706)':'#e5e7eb')+';color:'+(canBuy?'#fff':'#9ca3af');
      btn.disabled=!canBuy;
      btn.textContent='🪙'+job.price.toLocaleString();
      btn.onclick=(e)=>{e.stopPropagation();buyJob(job.id);};
      bw.appendChild(btn);
    }
    div.appendChild(bw);
    div.onclick=()=>{selJobId=job.id;renderJob();showJobPreview(job);};
    list.appendChild(div);
  });

  const preview=selJobId?JOBS.find(x=>x.id===selJobId):equippedJob?JOBS.find(x=>x.id===equippedJob):null;
  if(preview)showJobPreview(preview);
}


function showJobPreview(job) {
  const iconEl = document.getElementById('jpIcon');
  const nameEl = document.getElementById('jpName');
  const descEl = document.getElementById('jpDesc');
  const skillEl = document.getElementById('jpSkills');
  if(!iconEl) return;
  iconEl.textContent = job.icon;
  nameEl.textContent = job.name;
  nameEl.style.color = job.color;
  descEl.textContent = job.desc.replace('\n','\n');
  descEl.style.whiteSpace = 'pre-line';
  skillEl.innerHTML = job.skills.map(s=>`
    <div style="background:#f3f4f6;border-radius:8px;padding:7px 10px;margin-bottom:6px;border-left:3px solid ${job.color}">
      <div style="font-size:12px;font-weight:700;color:#1f2937">${s.icon} [${s.key}] ${s.name}</div>
      <div style="font-size:10px;color:#6b7280;margin-top:2px">${s.desc}</div>
      <div style="font-size:9px;color:#9ca3af;margin-top:1px">쿨타임 ${(s.cd/60).toFixed(0)}초</div>
    </div>`).join('');
  // 미리보기 배경
  const prev = document.getElementById('jobPreview');
  if(prev) prev.style.background = job.skinBg || '#f8f4ff';
  nameEl.style.color = '#fff';
  descEl.style.color = 'rgba(255,255,255,0.8)';
}

function buyJob(id) {
  const job = JOBS.find(x=>x.id===id);
  if(!job || ownedJobs[id] || coins<job.price) return;
  coins -= job.price; ownedJobs[id]=true; saveJobData(); saveAll(); renderJob();
}
function equipJob(id) {
  equippedJob = equippedJob===id ? '' : id;
  saveJobData(); renderJob();
}
