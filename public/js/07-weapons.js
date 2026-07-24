// ══════════════ 무기 데이터 ══════════════
const WEPS={
  pistol:{id:'pistol',name:'권총',icon:'🔫',price:0,ammo:12,max:12,rel:90,spd:13,dmg:1,r:4,life:100,knife:false,sg:false,desc:'기본 권총. 균형잡힌 성능'},
  shotgun:{id:'shotgun',name:'샷건',icon:'💥',price:0,ammo:6,max:6,rel:130,spd:10,dmg:2.5,r:5,life:60,knife:false,sg:true,desc:'근거리 강력. 5발 동시 (데미지 2.5×5)'},
  knife:{id:'knife',name:'칼',icon:'🗡️',price:0,ammo:999,max:999,rel:0,spd:0,dmg:2,r:0,life:0,knife:true,sg:false,desc:'근접 무기. 무한 사용 가능'},
  katana:{id:'katana',name:'카타나',icon:'⚔️',price:20000,ammo:999,max:999,rel:0,spd:0,dmg:2,r:0,life:0,knife:true,sg:false,desc:'강력한 참격. 넓은 범위'},
  uzi:{id:'uzi',name:'우지',icon:'🔫',price:30000,ammo:30,max:30,rel:60,spd:15,dmg:1,r:3,life:70,knife:false,sg:false,auto:true,desc:'자동 연사 기관단총'},
  burst:{id:'burst',name:'점사소총',icon:'🎯',price:50000,ammo:18,max:18,rel:100,spd:16,dmg:2,r:4,life:120,knife:false,sg:false,burst:true,desc:'3점사. 정확도 높음'},
  rifle:{id:'rifle',name:'소총',icon:'🔭',price:80000,ammo:10,max:10,rel:110,spd:20,dmg:5,r:4,life:200,knife:false,sg:false,rarity:'rare',desc:'고데미지 소총'},
  spear:{id:'spear',name:'창',icon:'🏹',price:40000,ammo:999,max:999,rel:0,spd:0,dmg:5,r:0,life:0,knife:true,sg:false,desc:'긴 사거리 근접 무기'},
  epistol:{id:'epistol',name:'에너지 권총',icon:'🔮',price:100000,ammo:20,max:20,rel:80,spd:14,dmg:3,r:5,life:90,knife:false,sg:false,energy:true,rarity:'rare',desc:'관통 에너지 탄환'},
  smg:{id:'smg',name:'SMG',icon:'💫',price:120000,ammo:40,max:40,rel:70,spd:14,dmg:2,r:4,life:80,knife:false,sg:false,auto:true,rarity:'rare',desc:'초고속 자동 연사'},
  sniper:{id:'sniper',name:'저격총',icon:'🎯',price:150000,ammo:5,max:5,rel:150,spd:25,dmg:10,r:5,life:400,knife:false,sg:false,rarity:'rare',desc:'초고데미지 저격'},
  minigun:{id:'minigun',name:'미니건',icon:'🌀',price:300000,ammo:100,max:100,rel:200,spd:12,dmg:6,r:4,life:250,knife:false,sg:false,auto:true,rarity:'epic',desc:'100발 연속 화력'},
  flamer:{id:'flamer',name:'화염방사기',icon:'🔥',price:250000,ammo:60,max:60,rel:180,spd:7,dmg:3,r:8,life:40,knife:false,sg:false,auto:true,rarity:'epic',desc:'화염 연속 분사. 짧은 사거리 광역'},
  railgun:{id:'railgun',name:'레일건',icon:'⚡',price:500000,ammo:3,max:3,rel:300,spd:30,dmg:30,r:4,life:300,knife:false,sg:false,energy:true,pierce:true,rarity:'legendary',desc:'초고속 관통탄. 탄수 3발'},
  crossbow:{id:'crossbow',name:'석궁',icon:'🏹',price:80000,ammo:8,max:8,rel:120,spd:18,dmg:8,r:5,life:180,knife:false,sg:false,desc:'조용하고 강력한 화살'},
  axe:{id:'axe',name:'도끼',icon:'🪓',price:60000,ammo:999,max:999,rel:0,spd:0,dmg:7,r:0,life:0,knife:true,sg:false,rarity:'rare',desc:'넓은 범위 근접 공격'},
  dualgun:{id:'dualgun',name:'쌍권총',icon:'🔫',price:150000,ammo:24,max:24,rel:80,spd:14,dmg:2,r:4,life:100,knife:false,sg:false,dual:true,rarity:'rare',desc:'양손 권총. 동시에 2발 발사'},
  grenadel:{id:'grenadel',name:'유탄발사기',icon:'💥',price:280000,ammo:6,max:6,rel:160,spd:8,dmg:15,r:6,life:80,knife:false,sg:false,explosive:true,rarity:'epic',desc:'폭발탄 발사. 범위 피해'},
  laser_gun:{id:'laser_gun',name:'레이저건',icon:'🔮',price:450000,ammo:30,max:30,rel:60,spd:20,dmg:4,r:5,life:150,knife:false,sg:false,auto:true,energy:true,rarity:'legendary',desc:'연속 레이저. 관통 효과'},
  hammer:{id:'hammer',name:'전투 망치',icon:'🔨',price:100000,ammo:999,max:999,rel:0,spd:0,dmg:12,r:0,life:0,knife:true,sg:false,rarity:'rare',desc:'강력한 타격. 적 밀어내기'},
  machinegun:{id:'machinegun',name:'기관총',icon:'🎯',price:380000,ammo:80,max:80,rel:250,spd:14,dmg:4,r:4,life:90,knife:false,sg:false,auto:true,rarity:'epic',desc:'80발 연속 기관총'},
  plasma:{id:'plasma',name:'플라즈마 캐논',icon:'🌐',price:600000,ammo:10,max:10,rel:140,spd:9,dmg:15,r:8,life:120,knife:false,sg:false,explosive:true,energy:true,rarity:'legendary',desc:'플라즈마 폭발탄. 범위+관통'},
  sword:{id:'sword',name:'대검',icon:'⚔️',price:150000,ammo:999,max:999,rel:0,spd:0,dmg:9,r:0,life:0,knife:true,sg:false,rarity:'epic',desc:'긴 도달 범위의 대검'},
  shotgun2:{id:'shotgun2',name:'산탄총',icon:'💢',price:180000,ammo:4,max:4,rel:140,spd:9,dmg:4,r:6,life:60,knife:false,sg:true,spread:8,rarity:'epic',desc:'8발 산탄. 극근거리 특화'},
  rocket:{id:'rocket',name:'로켓런처',icon:'🚀',price:500000,ammo:4,max:4,rel:200,spd:7,dmg:18,r:7,life:120,knife:false,sg:false,explosive:true,rarity:'legendary',desc:'로켓 발사. 폭발 범위 대형'},
  icegen:{id:'icegen',name:'냉동총',icon:'❄️',price:200000,ammo:20,max:20,rel:90,spd:11,dmg:2,r:5,life:100,knife:false,sg:false,freeze:true,rarity:'epic',desc:'냉동탄. 피격 적 속도 감소'},
  thunderbolt:{id:'thunderbolt',name:'번개창',icon:'🌩️',price:700000,ammo:8,max:8,rel:120,spd:16,dmg:14,r:5,life:140,knife:false,sg:false,chain:true,energy:true,rarity:'legendary',desc:'번개 연쇄. 2마리 추가 피해'},
  scythe:{id:'scythe',name:'낫',icon:'🌙',price:350000,ammo:999,max:999,rel:0,spd:0,dmg:14,r:0,life:0,knife:true,sg:false,rarity:'epic',desc:'360도 회전 참격'},
  // ── 추가 무기 12종 (총 40종) ──
  harpoon:{id:'harpoon',name:'작살총',icon:'🪝',price:22000,ammo:5,max:5,rel:150,spd:15,dmg:12,r:6,life:200,knife:false,sg:false,pierce:true,rarity:'rare',desc:'관통 작살. 사거리 최장'},
  flintlock:{id:'flintlock',name:'플린트락',icon:'🔫',price:200000,ammo:1,max:1,rel:200,spd:22,dmg:20,r:5,life:250,knife:false,sg:false,rarity:'epic',desc:'단발 고데미지. 장전 느림'},
  trident:{id:'trident',name:'삼지창',icon:'🔱',price:28000,ammo:999,max:999,rel:0,spd:0,dmg:11,r:0,life:0,knife:true,sg:false,desc:'3방향 동시 참격'},
  buster:{id:'buster',name:'버스터 건',icon:'💠',price:42000,ammo:8,max:8,rel:170,spd:11,dmg:22,r:7,life:100,knife:false,sg:false,explosive:true,desc:'대형 폭발탄'},
  needle:{id:'needle',name:'바늘총',icon:'📍',price:16000,ammo:40,max:40,rel:45,spd:18,dmg:1,r:3,life:120,knife:false,sg:false,auto:true,poison:true,desc:'초고속 독침 연사'},
  toxic_ak:{id:'toxic_ak',name:'독성 AK',icon:'☠️',price:89990000,ammo:60,max:60,rel:110,spd:17,dmg:7,r:5,life:160,knife:false,sg:false,auto:true,poison:true,rarity:'transcendent',desc:'자동 독성탄 연사. 보라색 연기 오라. 월드2 진입 필수',aura:'purple_smoke'},
  magnum:{id:'magnum',name:'매그넘',icon:'🔫',price:32000,ammo:6,max:6,rel:130,spd:20,dmg:16,r:5,life:200,knife:false,sg:false,desc:'강력한 리볼버. 관통'},
  boomerang:{id:'boomerang',name:'부메랑',icon:'🪃',price:25000,ammo:999,max:999,rel:0,spd:0,dmg:8,r:0,life:0,knife:true,sg:false,desc:'투척 후 돌아오는 무기'},
  autocannon:{id:'autocannon',name:'자동포',icon:'💣',price:800000,ammo:20,max:20,rel:100,spd:10,dmg:18,r:7,life:100,knife:false,sg:false,auto:true,explosive:true,rarity:'legendary',desc:'자동 폭발탄 20발'},
  whip:{id:'whip',name:'채찍',icon:'〰️',price:120000,ammo:999,max:999,rel:0,spd:0,dmg:6,r:0,life:0,knife:true,sg:false,rarity:'rare',desc:'긴 도달 범위+넉백'},
  antimatter:{id:'antimatter',name:'반물질 총',icon:'⚫',price:1000000,ammo:5,max:5,rel:180,spd:16,dmg:25,r:6,life:180,knife:false,sg:false,energy:true,pierce:true,rarity:'mythic',desc:'반물질탄. 최강 관통'},
  kunai:{id:'kunai',name:'쿠나이',icon:'🗡️',price:80000,ammo:999,max:999,rel:0,spd:0,dmg:5,r:0,life:0,knife:true,sg:false,rarity:'rare',desc:'빠른 근접+투척 가능'},
  gatling:{id:'gatling',name:'개틀링건',icon:'🌀',price:900000,ammo:200,max:200,rel:300,spd:13,dmg:5,r:4,life:300,knife:false,sg:false,auto:true,rarity:'mythic',desc:'200발 최대 화력'},
  halberd:{id:'halberd',name:'할버드',icon:'🔱',price:400000,ammo:999,max:999,rel:0,spd:0,dmg:16,r:0,life:0,knife:true,sg:false,rarity:'epic',desc:'긴 장병기. 광역 참격'},
  boltgun:{id:'boltgun',name:'볼트건',icon:'⚙️',price:550000,ammo:12,max:12,rel:130,spd:19,dmg:11,r:5,life:180,knife:false,sg:false,rarity:'legendary',desc:'관통+폭발 탄환',explosive:true,pierce:true},
  soulreaper:{id:'soulreaper',name:'영혼 낫',icon:'☽',price:700000,ammo:999,max:999,rel:0,spd:0,dmg:22,r:0,life:0,knife:true,sg:false,rarity:'legendary',desc:'처치 시 HP+5'},
  beamrifle:{id:'beamrifle',name:'빔 소총',icon:'🔴',price:1200000,ammo:6,max:6,rel:120,spd:25,dmg:20,r:4,life:400,knife:false,sg:false,energy:true,pierce:true,rarity:'mythic',desc:'초고속 관통 빔'},
  moonshard:{id:'moonshard',name:'달의 파편',icon:'🌙',price:600000,ammo:999,max:999,rel:0,spd:0,dmg:20,r:0,life:0,knife:true,sg:false,rarity:'legendary',desc:'360도 참격'},
  cryocannon:{id:'cryocannon',name:'냉동포',icon:'🧊',price:800000,ammo:8,max:8,rel:150,spd:8,dmg:18,r:9,life:100,knife:false,sg:false,freeze:true,explosive:true,rarity:'mythic',desc:'냉동 폭발탄'},
  volcanogun:{id:'volcanogun',name:'화산포',icon:'🌋',price:1000000,ammo:5,max:5,rel:180,spd:7,dmg:22,r:10,life:110,knife:false,sg:false,explosive:true,rarity:'mythic',desc:'거대 화염 폭발탄'},
  sniperex:{id:'sniperex',name:'저격총 EX',icon:'🎯',price:1500000,ammo:3,max:3,rel:200,spd:32,dmg:30,r:5,life:500,knife:false,sg:false,pierce:true,rarity:'mythic',desc:'초강력 저격 관통총'},
  dualkatana:{id:'dualkatana',name:'쌍칼',icon:'⚔️',price:750000,ammo:999,max:999,rel:0,spd:0,dmg:12,r:0,life:0,knife:true,sg:false,dual:true,rarity:'legendary',desc:'쌍 카타나 이중 참격'},
  omegagun:{id:'omegagun',name:'오메가건',icon:'🌐',price:2000000,ammo:20,max:20,rel:80,spd:15,dmg:16,r:6,life:150,knife:false,sg:false,auto:true,energy:true,explosive:true,rarity:'mythic',desc:'에너지+폭발+연사'},
  godspear:{id:'godspear',name:'신의 창',icon:'✨',price:5000000,ammo:999,max:999,rel:0,spd:0,dmg:30,r:0,life:0,knife:true,sg:false,chain:true,rarity:'mythic',desc:'번개 연쇄 신의 무기'},
  darksword:{id:'darksword',name:'어둠검',icon:'🌑',price:1800000,ammo:999,max:999,rel:0,spd:0,dmg:22,r:0,life:0,knife:true,sg:false,rarity:'mythic',desc:'어둠 극강 데미지'},
  quantumgun:{id:'quantumgun',name:'양자총',icon:'⚛️',price:3000000,ammo:10,max:10,rel:90,spd:20,dmg:22,r:6,life:200,knife:false,sg:false,energy:true,pierce:true,explosive:true,rarity:'mythic',desc:'관통+폭발+에너지 최강'},

  // ── 보스 클리어 전용 무기 8종 ──
  sun_drop:{id:'sun_drop',name:'태양의 심장',icon:'☀️',price:0,ammo:8,max:8,rel:110,spd:11,dmg:20,r:7,life:140,knife:false,sg:false,explosive:true,energy:true,rarity:'rare',bossReward:'sun',desc:'SUN 클리어 보상. 8방향 분열탄+에너지'},
  machine_drop:{id:'machine_drop',name:'강철 심장',icon:'⚙️',price:0,ammo:30,max:30,rel:60,spd:17,dmg:16,r:5,life:160,knife:false,sg:false,auto:true,pierce:true,rarity:'epic',bossReward:'machine',desc:'MACHINE 클리어 보상. 초고속 관통 연사+레이저'},
  bacteria_drop:{id:'bacteria_drop',name:'독의 핵',icon:'🦠',price:0,ammo:40,max:40,rel:120,spd:6,dmg:8,r:9,life:80,knife:false,sg:false,explosive:true,auto:true,rarity:'epic',bossReward:'bacteria',desc:'BACTERIA 클리어 보상. [자동] 독구름 폭발탄 연사. 착탄 시 독구름 생성'},
  skeleton_drop:{id:'skeleton_drop',name:'해골왕의 검',icon:'💀',price:0,ammo:999,max:999,rel:0,spd:0,dmg:32,r:0,life:0,knife:true,sg:false,chain:true,rarity:'epic',bossReward:'skeleton',desc:'SKELETON 클리어 보상. 참격+뼈 파편 8방향'},
  clock_drop:{id:'clock_drop',name:'시간의 바늘',icon:'🕐',price:0,ammo:12,max:12,rel:80,spd:14,dmg:24,r:6,life:180,knife:false,sg:false,freeze:true,rarity:'epic',bossReward:'clock',desc:'CLOCK 클리어 보상. 피격 적 시간 정지'},
  reanimation_drop:{id:'reanimation_drop',name:'죽음의 낫',icon:'☠️',price:0,ammo:999,max:999,rel:0,spd:0,dmg:42,r:0,life:0,knife:true,sg:false,rarity:'legendary',bossReward:'reanimation',desc:'REANIMATION 클리어 보상. 처치 시 아군 소환'},
  kraken_drop:{id:'kraken_drop',name:'심해의 눈',icon:'🐙',price:0,ammo:10,max:10,rel:100,spd:10,dmg:35,r:8,life:180,knife:false,sg:false,explosive:true,rarity:'legendary',bossReward:'kraken',desc:'KRAKEN 클리어 보상. 폭발+촉수 소환'},
  symphony_drop:{id:'symphony_drop',name:'오메가 지휘봉',icon:'🎵',price:0,ammo:999,max:999,rel:0,spd:0,dmg:55,r:0,life:0,knife:true,sg:false,chain:true,rarity:'mythic',bossReward:'symphony',desc:'SYMPHONY 클리어 보상. [근접] 공격 시 무지개 탄막 48발 동시 방사. 데미지100'},
  // ── 월드1 보스 클리어 전용 무기 보완 3종 (volcano/frost/void) ──
  volcano_drop:{id:'volcano_drop',name:'화산의 심장',icon:'🌋',price:0,ammo:12,max:12,rel:95,spd:10,dmg:30,r:8,life:170,knife:false,sg:false,explosive:true,rarity:'legendary',bossReward:'volcano',desc:'VOLCANO 클리어 보상. 착탄 시 용암 웅덩이 생성'},
  frost_drop:{id:'frost_drop',name:'빙결의 심장',icon:'🧊',price:0,ammo:14,max:14,rel:85,spd:12,dmg:28,r:7,life:180,knife:false,sg:false,freeze:true,rarity:'legendary',bossReward:'frost',desc:'FROST EMPRESS 클리어 보상. 피격 적 즉시 동결+주변 냉기 확산'},
  void_drop:{id:'void_drop',name:'공허의 파편',icon:'🌌',price:0,ammo:10,max:10,rel:100,spd:11,dmg:34,r:8,life:190,knife:false,sg:false,energy:true,explosive:true,rarity:'legendary',bossReward:'void',desc:'VOID REAPER 클리어 보상. 관통+폭발, 착탄 시 차원 균열 생성'},
  // ── 월드2("2") 보스 클리어 전용 무기 9종: 기본 등급이 SYMPHONY(오메가 지휘봉, mythic)급 이상 ──
  toxic_queen_drop:{id:'toxic_queen_drop',name:'여왕의 독침',icon:'🐍',price:0,ammo:18,max:18,rel:90,spd:9,dmg:34,r:7,life:130,knife:false,sg:false,explosive:true,rarity:'legendary',bossReward:'toxic_queen',desc:'TOXIC QUEEN 클리어 보상. 착탄 시 맹독 구름 생성'},
  iron_warden_drop:{id:'iron_warden_drop',name:'파수관의 코어',icon:'⚙️',price:0,ammo:40,max:40,rel:50,spd:18,dmg:20,r:5,life:150,knife:false,sg:false,auto:true,pierce:true,rarity:'legendary',bossReward:'iron_warden',desc:'IRON WARDEN 클리어 보상. [자동] 초고속 관통 연사'},
  plague_mother_drop:{id:'plague_mother_drop',name:'역병의 씨앗',icon:'🦠',price:0,ammo:35,max:35,rel:110,spd:7,dmg:16,r:9,life:90,knife:false,sg:false,explosive:true,auto:true,rarity:'legendary',bossReward:'plague_mother',desc:'PLAGUE MOTHER 클리어 보상. [자동] 폭발마다 독포자 살포'},
  storm_reaver_drop:{id:'storm_reaver_drop',name:'폭풍의 파편',icon:'⚡',price:0,ammo:14,max:14,rel:70,spd:20,dmg:38,r:6,life:160,knife:false,sg:false,pierce:true,chain:true,rarity:'legendary',bossReward:'storm_reaver',desc:'STORM REAVER 클리어 보상. 관통+인접 적 번개 연쇄'},
  neon_specter_drop:{id:'neon_specter_drop',name:'네온 잔상',icon:'👾',price:0,ammo:16,max:16,rel:75,spd:16,dmg:36,r:6,life:150,knife:false,sg:false,freeze:true,rarity:'legendary',bossReward:'neon_specter',desc:'NEON SPECTER 클리어 보상. 피격 적 시스템 오류로 잠시 정지'},
  blood_colossus_drop:{id:'blood_colossus_drop',name:'거신의 파편',icon:'🩸',price:0,ammo:999,max:999,rel:0,spd:0,dmg:60,r:0,life:0,knife:true,sg:false,chain:true,rarity:'legendary',bossReward:'blood_colossus',desc:'BLOOD COLOSSUS 클리어 보상. [근접] 참격+피의 파편 8방향'},
  abyss_leviathan_drop:{id:'abyss_leviathan_drop',name:'심연의 눈',icon:'🐋',price:0,ammo:10,max:10,rel:110,spd:9,dmg:50,r:9,life:190,knife:false,sg:false,explosive:true,rarity:'mythic',bossReward:'abyss_leviathan',desc:'ABYSS LEVIATHAN 클리어 보상. 폭발+촉수 소환'},
  gravity_rend_drop:{id:'gravity_rend_drop',name:'특이점의 파편',icon:'🕳️',price:0,ammo:9,max:9,rel:120,spd:8,dmg:58,r:8,life:190,knife:false,sg:false,energy:true,explosive:true,rarity:'mythic',bossReward:'gravity_rend',desc:'GRAVITY REND 클리어 보상. 착탄 시 주변 적을 끌어당기는 중력장 생성'},
  omega_zero_drop:{id:'omega_zero_drop',name:'오메가 파동',icon:'♾️',price:0,ammo:999,max:999,rel:0,spd:0,dmg:85,r:0,life:0,knife:true,sg:false,chain:true,rarity:'mythic',bossReward:'omega_zero',desc:'OMEGA ZERO 클리어 보상. [근접] 공격 시 전방위 파동 62발 동시 방사. 데미지140'},
  event_firework:{id:'event_firework',name:'축제의 폭죽포',icon:'🎆',price:0,ammo:20,max:20,rel:70,spd:12,dmg:22,r:8,life:150,knife:false,sg:false,explosive:true,auto:true,rarity:'mythic',bossReward:'event',desc:'이벤트 상점 획득. [자동] 폭죽 연사, 착탄 시 화려한 폭발'},
  // ── 시즌 이벤트(2개월 순환) 전용 무기 ──
  ev_cw_wep:{id:'ev_cw_wep',name:'셰프의 식칼',icon:'🔪',price:0,ammo:999,max:999,rel:0,spd:0,dmg:38,r:0,life:0,knife:true,sg:false,chain:true,rarity:'legendary',bossReward:'ev_cookwar',desc:'요리전쟁 이벤트 보상. [근접] 참격+화염 번짐'},
  ev_gd_wep:{id:'ev_gd_wep',name:'농부의 낫',icon:'🌱',price:0,ammo:999,max:999,rel:0,spd:0,dmg:34,r:0,life:0,knife:true,sg:false,pierce:true,rarity:'legendary',bossReward:'ev_garden',desc:'봄맞이 텃밭 가꾸기 이벤트 보상. [근접] 관통 참격+새싹 흩날림'},
  ev_tr_wep:{id:'ev_tr_wep',name:'보물의 곡괭이',icon:'⛏️',price:0,ammo:999,max:999,rel:0,spd:0,dmg:40,r:0,life:0,knife:true,sg:false,explosive:true,rarity:'legendary',bossReward:'ev_treasure',desc:'보물찾기 대회 이벤트 보상. [근접] 폭발 강타'},
  ev_wm_wep:{id:'ev_wm_wep',name:'수박 격파포',icon:'🍉',price:0,ammo:18,max:18,rel:80,spd:12,dmg:30,r:9,life:180,knife:false,sg:false,explosive:true,rarity:'legendary',bossReward:'ev_watermelon',desc:'여름 수박격파 대회 이벤트 보상. 폭발 과육탄 연사'},
  ev_as_wep:{id:'ev_as_wep',name:'사과 폭탄 슬링',icon:'🍎',price:0,ammo:16,max:16,rel:85,spd:12,dmg:30,r:8,life:180,knife:false,sg:false,explosive:true,rarity:'legendary',bossReward:'ev_slingshot',desc:'가을 사과 슬링샷 대회 이벤트 보상. 폭발 사과탄 연사'},
  ev_gr_wep:{id:'ev_gr_wep',name:'선물상자 발사기',icon:'🎁',price:0,ammo:14,max:14,rel:90,spd:11,dmg:32,r:9,life:180,knife:false,sg:false,explosive:true,freeze:true,rarity:'legendary',bossReward:'ev_giftrhythm',desc:'산타의 선물배달 이벤트 보상. 폭발+동결 선물상자탄'},

  // ── 시즌패스 전용 무기 6종 ──
  sp_winter:{id:'sp_winter',name:'[시즌] 겨울의 창',icon:'❄️',price:0,ammo:999,max:999,rel:0,spd:0,dmg:35,r:0,life:0,knife:true,sg:false,freeze:true,chain:true,spOnly:true,rarity:'legendary',spMonth:1,spLv:25,desc:'1월 시즌Lv.25. 데미지70, 동결+번개연쇄'},
  sp_space:{id:'sp_space',name:'[시즌] 우주 포',icon:'🚀',price:0,ammo:12,max:12,rel:110,spd:16,dmg:45,r:8,life:200,knife:false,sg:false,energy:true,pierce:true,explosive:true,spOnly:true,rarity:'legendary',spMonth:3,spLv:25,desc:'3월 시즌Lv.25. 데미지90, 관통+폭발+에너지'},
  sp_summer:{id:'sp_summer',name:'[시즌] 여름 파도',icon:'🌊',price:0,ammo:20,max:20,rel:80,spd:13,dmg:30,r:7,life:150,knife:false,sg:false,explosive:true,freeze:true,spOnly:true,rarity:'legendary',spMonth:5,spLv:25,desc:'5월 시즌Lv.25. 데미지60, 파도 폭발+냉각'},
  sp_autumn:{id:'sp_autumn',name:'[시즌] 낙엽 낫',icon:'🍂',price:0,ammo:999,max:999,rel:0,spd:0,dmg:38,r:0,life:0,knife:true,sg:false,chain:true,spOnly:true,rarity:'legendary',spMonth:7,spLv:25,desc:'7월 시즌Lv.25. 데미지75, 360도 낙엽 참격'},
  sp_storm:{id:'sp_storm',name:'[시즌] 폭풍의 검',icon:'⚡',price:0,ammo:999,max:999,rel:0,spd:0,dmg:42,r:0,life:0,knife:true,sg:false,chain:true,spOnly:true,rarity:'mythic',spMonth:9,spLv:25,desc:'9월 시즌Lv.25. 데미지85, 번개 무한연쇄'},
  sp_nova:{id:'sp_nova',name:'[시즌] 성운 포',icon:'🌌',price:0,ammo:8,max:8,rel:120,spd:14,dmg:55,r:9,life:180,knife:false,sg:false,energy:true,pierce:true,explosive:true,spOnly:true,rarity:'mythic',spMonth:11,spLv:25,desc:'11월 시즌Lv.25. 데미지110, 성운 폭발'},
  sp_blade:{id:'sp_blade',name:'[시즌] 성흔의 검',icon:'🌠',price:0,ammo:999,max:999,rel:0,spd:0,dmg:45,r:0,life:0,knife:true,sg:false,chain:true,spOnly:true,rarity:'legendary',desc:'시즌Lv.25 전용(홀수월). 데미지88, 처치시HP+10'},
  sp_cannon:{id:'sp_cannon',name:'[시즌] 별의 포',icon:'💫',price:0,ammo:15,max:15,rel:100,spd:18,dmg:60,r:8,life:200,knife:false,sg:false,energy:true,pierce:true,explosive:true,spOnly:true,rarity:'mythic',desc:'시즌Lv.50 전용(홀수월). 데미지120, 관통+폭발+에너지'},

  // ── 이스터에그 전용 무기 (secret:true → 이름/등급 항상 ???/SECRET 표기) ──
  egg_letter_wep:{id:'egg_letter_wep',name:'마지막 인사',icon:'📜',price:0,ammo:999,max:999,rel:0,spd:0,dmg:40,r:0,life:0,knife:true,sg:false,chain:true,pierce:true,secret:true,desc:'모든 이스터에그를 찾아낸 자에게만 전해지는, 만든 이의 마지막 무기'},

  // ── 차원의 별(스타드롭) 전용 무기 5종 (영웅 등급 이상 전용 보상) ──
  sd_wep_legend:{id:'sd_wep_legend',name:'영웅왕의 검',icon:'🗡️',price:0,ammo:999,max:999,rel:0,spd:0,dmg:50,r:0,life:0,knife:true,sg:false,chain:true,sdOnly:true,rarity:'legendary',desc:'차원의 별【영웅】보상. 데미지100, 광역 참격 연쇄'},
  sd_wep_mythic:{id:'sd_wep_mythic',name:'신화의 대지팡이',icon:'🪄',price:0,ammo:14,max:14,rel:110,spd:15,dmg:35,r:8,life:190,knife:false,sg:false,energy:true,explosive:true,pierce:true,sdOnly:true,rarity:'mythic',desc:'차원의 별【신화】보상. 관통+폭발 에너지탄'},
  sd_wep_ancient:{id:'sd_wep_ancient',name:'태초의 창',icon:'🔱',price:0,ammo:999,max:999,rel:0,spd:0,dmg:70,r:0,life:0,knife:true,sg:false,chain:true,pierce:true,sdOnly:true,rarity:'ancient',desc:'차원의 별【전설】보상. 데미지140, 관통+연쇄 참격'},
  sd_wep_divine:{id:'sd_wep_divine',name:'초월의 성스러운 활',icon:'🏹',price:0,ammo:10,max:10,rel:95,spd:22,dmg:60,r:7,life:260,knife:false,sg:false,energy:true,pierce:true,explosive:true,sdOnly:true,rarity:'divine',desc:'차원의 별【초월】보상. 관통+폭발 신성 화살'},
  sd_wep_absolute:{id:'sd_wep_absolute',name:'차원 종결자',icon:'🌌',price:0,ammo:999,max:999,rel:0,spd:0,dmg:100,r:0,life:0,knife:true,sg:false,chain:true,pierce:true,freeze:true,sdOnly:true,rarity:'absolute',desc:'차원의 별【차원】최종 보상. 데미지200, 관통+연쇄+동결'},

  // ── 울트라 진화 전용 무기 9종 (전설/초월/차원 등급 확정 시 극악 확률로 별이 깨지며 지급) ──
  sd_u_wep_ancient_ultra:{id:'sd_u_wep_ancient_ultra',name:'울트라 태초의 창',icon:'🔱',price:0,ammo:999,max:999,rel:0,spd:0,dmg:120,r:0,life:0,knife:true,sg:false,chain:true,pierce:true,explosive:true,sdOnly:true,ultra:true,rarity:'ancient_ultra',desc:'별이 깨져 초록빛을 내며 진화한 태초의 창. 데미지240, 관통+연쇄+폭발'},
  sd_u_wep_ancient_hyper:{id:'sd_u_wep_ancient_hyper',name:'하이퍼 태초의 창',icon:'🔱',price:0,ammo:999,max:999,rel:0,spd:0,dmg:170,r:0,life:0,knife:true,sg:false,chain:true,pierce:true,explosive:true,freeze:true,sdOnly:true,ultra:true,rarity:'ancient_hyper',desc:'더욱 폭주한 태초의 창. 데미지340, 관통+연쇄+폭발+동결'},
  sd_u_wep_ancient_shyper:{id:'sd_u_wep_ancient_shyper',name:'슈퍼 하이퍼 태초의 창',icon:'🔱',price:0,ammo:999,max:999,rel:0,spd:0,dmg:240,r:0,life:0,knife:true,sg:false,chain:true,pierce:true,explosive:true,freeze:true,burst:true,sdOnly:true,ultra:true,rarity:'ancient_shyper',desc:'극한까지 폭주한 태초의 창. 데미지480, 관통+연쇄+폭발+동결'},
  sd_u_wep_divine_ultra:{id:'sd_u_wep_divine_ultra',name:'울트라 초월의 성스러운 활',icon:'🏹',price:0,ammo:12,max:12,rel:85,spd:25,dmg:95,r:8,life:320,knife:false,sg:false,energy:true,pierce:true,explosive:true,sdOnly:true,ultra:true,rarity:'divine_ultra',desc:'별이 깨져 초록빛을 내며 진화한 신성한 활. 관통+폭발 신성 화살 강화'},
  sd_u_wep_divine_hyper:{id:'sd_u_wep_divine_hyper',name:'하이퍼 초월의 성스러운 활',icon:'🏹',price:0,ammo:14,max:14,rel:75,spd:28,dmg:130,r:9,life:380,knife:false,sg:false,energy:true,pierce:true,explosive:true,freeze:true,sdOnly:true,ultra:true,rarity:'divine_hyper',desc:'더욱 폭주한 신성한 활. 관통+폭발+동결 신성 화살',},
  sd_u_wep_divine_shyper:{id:'sd_u_wep_divine_shyper',name:'슈퍼 하이퍼 초월의 성스러운 활',icon:'🏹',price:0,ammo:16,max:16,rel:65,spd:32,dmg:180,r:10,life:450,knife:false,sg:false,energy:true,pierce:true,explosive:true,freeze:true,chain:true,sdOnly:true,ultra:true,rarity:'divine_shyper',desc:'극한까지 폭주한 신성한 활. 관통+폭발+동결+연쇄'},
  sd_u_wep_absolute_ultra:{id:'sd_u_wep_absolute_ultra',name:'울트라 차원 종결자',icon:'🌌',price:0,ammo:999,max:999,rel:0,spd:0,dmg:160,r:0,life:0,knife:true,sg:false,chain:true,pierce:true,freeze:true,explosive:true,sdOnly:true,ultra:true,rarity:'absolute_ultra',desc:'별이 깨져 초록빛을 내며 진화한 차원 종결자. 데미지320, 관통+연쇄+동결+폭발'},
  sd_u_wep_absolute_hyper:{id:'sd_u_wep_absolute_hyper',name:'하이퍼 차원 종결자',icon:'🌌',price:0,ammo:999,max:999,rel:0,spd:0,dmg:230,r:0,life:0,knife:true,sg:false,chain:true,pierce:true,freeze:true,explosive:true,burst:true,sdOnly:true,ultra:true,rarity:'absolute_hyper',desc:'더욱 폭주한 차원 종결자. 데미지460, 관통+연쇄+동결+폭발'},
  sd_u_wep_absolute_shyper:{id:'sd_u_wep_absolute_shyper',name:'슈퍼 하이퍼 차원 종결자',icon:'🌌',price:0,ammo:999,max:999,rel:0,spd:0,dmg:320,r:0,life:0,knife:true,sg:false,chain:true,pierce:true,freeze:true,explosive:true,burst:true,auto:true,sdOnly:true,ultra:true,rarity:'absolute_shyper',desc:'모든 차원을 초월한 궁극의 무기. 데미지640, 관통+연쇄+동결+폭발'},
};
const DFLT=['pistol','shotgun','knife'];
let selWepId='pistol';

function renderWepSel(){
  const con=document.getElementById('wCards');con.innerHTML='';
  DFLT.forEach(id=>{
    const w=WEPS[id];const d=document.createElement('div');
    d.className='wcard'+(selWepId===id?' sel':'');
    d.innerHTML=`<div class="wico">${w.icon}</div><div class="wnm">${w.name}</div><div class="wst">${w.desc}</div>`;
    d.onclick=()=>{
      selWepId=id;
      // 인게임 중이면 P.ws 즉시 업데이트
      if(running&&P){const nw=getWep();P.ws=nw;P.ammo=Math.min(P.ammo,nw.max);P.maxAmmo=nw.max;}
      renderWepSel();
    };con.appendChild(d);
  });
  const isC=eqWepId&&!DFLT.includes(eqWepId)&&owned[eqWepId];
  const ew=isC?WEPS[eqWepId]:null,lv=isC?(wepLv[eqWepId]||0):0;
  const d4=document.createElement('div');
  if(ew){
    d4.className='wcard eqslot'+(selWepId===ew.id?' sel':'');
    d4.innerHTML=`<div class="wbdg">🎒 장착무기</div><div class="wico">${ew.icon}</div><div class="wnm">${ew.name}${lv>0?' Lv.'+lv:''}</div><div class="wst">${ew.desc}</div>`;
    d4.onclick=()=>{
      selWepId=ew.id;
      if(running&&P){const nw=getWep();P.ws=nw;P.ammo=Math.min(P.ammo,nw.max);P.maxAmmo=nw.max;}
      renderWepSel();
    };
  } else {
    d4.className='wcard';
    d4.innerHTML=`<div class="wico">🎒</div><div class="wnm" style="color:#9ca3af">장착무기 없음</div><div class="wst" style="color:#9ca3af">장비탭에서<br>무기를 장착하세요</div>`;
  }
  con.appendChild(d4);
}
