// ════════════════════════════════════════════
// ══ 업적 시스템 ══
// ════════════════════════════════════════════

const ACHIEVEMENTS = [
  // ── 킬 업적 ──
  {id:'kill_10',    name:'첫 걸음',            desc:'좀비 10마리 처치',                    reward:{coins:500},     cond:'kills>=10'},
  {id:'kill_100',   name:'학살자',             desc:'좀비 100마리 처치',                   reward:{item:'soul_hope'},cond:'kills>=100'},
  {id:'kill_500',   name:'대학살',             desc:'좀비 500마리 처치',                   reward:{coins:5000},    cond:'kills>=500'},
  {id:'kill_1000',  name:'전설의 사냥꾼',      desc:'좀비 1000마리 처치',                  reward:{energy:50000}, cond:'kills>=1000'},
  {id:'kill_5000',  name:'절멸자',             desc:'좀비 5000마리 처치',                  reward:{coins:100000}, cond:'kills>=5000'},
  {id:'kill_10000', name:'학살의 왕',          desc:'좀비 10000마리 처치',                 reward:{energy:200000},cond:'kills>=10000'},
  // ── 웨이브 업적 ──
  {id:'wave_5',     name:'입문자',             desc:'웨이브 5 달성',                       reward:{coins:300},    cond:'maxWave>=5'},
  {id:'wave_10',    name:'생존자',             desc:'웨이브 10 달성',                      reward:{coins:1000},   cond:'maxWave>=10'},
  {id:'wave_25',    name:'베테랑',             desc:'웨이브 25 달성',                      reward:{coins:3000},   cond:'maxWave>=25'},
  {id:'wave_50',    name:'철벽',               desc:'웨이브 50 달성',                      reward:{energy:10000}, cond:'maxWave>=50'},
  {id:'wave_100',   name:'불멸',               desc:'웨이브 100 달성',                     reward:{item:'revive'}, cond:'maxWave>=100'},
  // ── 맵별 웨이브 업적 ──
  {id:'city_w10',   name:'도시 탐험가',        desc:'폐허 도시에서 웨이브 10 달성',        reward:{coins:1000},   cond:'(mapWave.city||0)>=10'},
  {id:'city_w25',   name:'도시 정복자',        desc:'폐허 도시에서 웨이브 25 달성',        reward:{coins:5000},   cond:'(mapWave.city||0)>=25'},
  {id:'forest_w10', name:'숲의 생존자',        desc:'저주받은 숲에서 웨이브 10 달성',      reward:{coins:1500},   cond:'(mapWave.forest||0)>=10'},
  {id:'forest_w20', name:'숲의 지배자',        desc:'저주받은 숲에서 웨이브 20 달성',      reward:{coins:5000},   cond:'(mapWave.forest||0)>=20'},
  {id:'lab_w15',    name:'실험실 생존자',      desc:'바이오 실험실에서 웨이브 15 달성',    reward:{coins:2000},   cond:'(mapWave.lab||0)>=15'},
  {id:'lab_w25',    name:'실험실 정복자',      desc:'바이오 실험실에서 웨이브 25 달성',    reward:{coins:8000},   cond:'(mapWave.lab||0)>=25'},
  {id:'desert_w10', name:'사막의 방랑자',      desc:'불타는 사막에서 웨이브 10 달성',      reward:{coins:3000},   cond:'(mapWave.desert||0)>=10'},
  {id:'desert_w20', name:'사막의 제왕',        desc:'불타는 사막에서 웨이브 20 달성',      reward:{energy:15000}, cond:'(mapWave.desert||0)>=20'},
  {id:'space_w10',  name:'우주 비행사',        desc:'우주 전쟁에서 웨이브 10 달성',        reward:{coins:5000},   cond:'(mapWave.space||0)>=10'},
  {id:'space_w20',  name:'우주 정복자',        desc:'우주 전쟁에서 웨이브 20 달성',        reward:{energy:30000}, cond:'(mapWave.space||0)>=20'},
  // ── 보스 업적 ──
  {id:'boss_sun',   name:'태양을 삼킨 자',     desc:'THE SUN 보스 처치',                   reward:{coins:5000},   cond:'bossKills.sun>=1'},
  {id:'boss_machine',name:'기계를 멈춘 자',    desc:'THE MACHINE 보스 처치',               reward:{coins:8000},   cond:'bossKills.machine>=1'},
  {id:'boss_bacteria',name:'세균 박멸자',      desc:'BACTERIA 보스 처치',                  reward:{coins:10000},  cond:'bossKills.bacteria>=1'},
  {id:'boss_skeleton',name:'뼈를 부순 자',     desc:'SKELETON 보스 처치',                  reward:{coins:12000},  cond:'bossKills.skeleton>=1'},
  {id:'boss_clock', name:'시간을 깨뜨린 자',   desc:'CLOCK 보스 처치',                     reward:{coins:15000},  cond:'bossKills.clock>=1'},
  {id:'boss_reanim',name:'죽음을 이긴 자',     desc:'REANIMATION 보스 처치',               reward:{coins:18000},  cond:'bossKills.reanimation>=1'},
  {id:'boss_kraken',name:'심해 정복자',        desc:'KRAKEN 처치',                         reward:{coins:20000},  cond:'bossKills.kraken>=1'},
  {id:'boss_sym',   name:'심포니의 끝',        desc:'FANTASTIC SYMPHONY 처치',             reward:{energy:50000}, cond:'bossKills.symphony>=1'},
  {id:'boss_all',   name:'보스 사냥꾼',        desc:'일반 보스 8종 모두 처치',             reward:{item:'spatial_path'}, cond:'Object.keys(bossKills).filter(k=>!k.startsWith("dream")).length>=8'},
  {id:'boss_volcano',name:'화산을 잠재운 자',  desc:'VOLCANO 보스 처치',                   reward:{coins:22000},  cond:'bossKills.volcano>=1'},
  {id:'boss_frost', name:'겨울을 끝낸 자',     desc:'FROST EMPRESS 보스 처치',             reward:{coins:24000},  cond:'bossKills.frost>=1'},
  {id:'boss_void',  name:'공허를 가른 자',     desc:'VOID REAPER 보스 처치',               reward:{energy:60000}, cond:'bossKills.void>=1'},
  {id:'boss_all_new',name:'신규 보스 정복자',  desc:'VOLCANO·FROST·VOID 모두 처치',       reward:{item:'black_hole'}, cond:'bossKills.volcano>=1&&bossKills.frost>=1&&bossKills.void>=1'},
  // ── 드림코어 업적 ──
  {id:'dream_enter',name:'THE DREAMCORE',      desc:'드림코어 세계에 진입',                reward:{item:'spatial_path'}, cond:'dreamEntered>=1'},
  {id:'dream_sun',  name:'태양이 뜨지 않는다', desc:'THE SUN IS RISE 처치',                reward:{coins:50000},  cond:'bossKills.dream_sun>=1'},
  {id:'dream_eye',  name:'눈을 감아라',        desc:'E Y E 처치',                          reward:{coins:100000}, cond:'bossKills.dream_eye>=1'},
  {id:'dream_wakeup',name:'WAKE UP',           desc:'WAKE UP 보스 처치',                   reward:{item:'black_hole'}, cond:'bossKills.dream_wakeup>=1'},
  {id:'dream_all',  name:'꿈에서 깨어나라',    desc:'드림코어 보스 4종 모두 처치',         reward:{energy:500000},cond:'["dream_sun","dream_limbo","dream_eye","dream_wakeup"].every(k=>bossKills[k]>=1)'},
  // ── 코인/에너지 업적 ──
  {id:'coin_1k',    name:'첫 수입',            desc:'코인 1,000 보유',                     reward:{coins:500},    cond:'coins>=1000'},
  {id:'coin_10k',   name:'부자 입문',          desc:'코인 10,000 보유',                    reward:{energy:5000},  cond:'coins>=10000'},
  {id:'coin_100k',  name:'재벌',               desc:'코인 100,000 보유',                   reward:{energy:15000}, cond:'coins>=100000'},
  {id:'coin_1m',    name:'백만장자',           desc:'코인 1,000,000 보유',                 reward:{energy:50000}, cond:'coins>=1000000'},
  {id:'energy_10k', name:'에너지 입문',        desc:'에너지 10,000 보유',                  reward:{coins:3000},   cond:'energy>=10000'},
  {id:'energy_100k',name:'에너지 충전',        desc:'에너지 100,000 보유',                 reward:{coins:10000},  cond:'energy>=100000'},
  // ── 시즌패스 업적 ──
  {id:'season_10',  name:'시즌 입문자',        desc:'시즌패스 레벨 10 달성',               reward:{coins:3000},   cond:'spData.lv>=10'},
  {id:'season_25',  name:'시즌 도전자',        desc:'시즌패스 레벨 25 달성',               reward:{coins:10000},  cond:'spData.lv>=25'},
  {id:'season_50',  name:'시즌 마스터',        desc:'시즌패스 레벨 50 달성',               reward:{item:'sp_item_dec'},cond:'spData.lv>=50'},
  // ── 장비 업적 ──
  {id:'wep_5',      name:'무기 입문',          desc:'무기 5종 보유',                       reward:{coins:2000},   cond:'Object.keys(owned).filter(k=>!k.startsWith("ar_")).length>=5'},
  {id:'wep_10',     name:'무기 수집가',        desc:'무기 10종 보유',                      reward:{coins:5000},   cond:'Object.keys(owned).filter(k=>!k.startsWith("ar_")).length>=10'},
  {id:'wep_20',     name:'무기 마스터',        desc:'무기 20종 보유',                      reward:{energy:20000}, cond:'Object.keys(owned).filter(k=>!k.startsWith("ar_")).length>=20'},
  {id:'armor_5',    name:'갑옷 입문',          desc:'갑옷 5종 보유',                       reward:{coins:3000},   cond:'Object.keys(owned).filter(k=>k.startsWith("ar_")).length>=5'},
  {id:'armor_all',  name:'갑옷 마스터',        desc:'갑옷 20종 이상 보유',                 reward:{energy:20000}, cond:'Object.keys(owned).filter(k=>k.startsWith("ar_")).length>=20'},
  {id:'job_3',      name:'직업 입문',          desc:'직업 3종 보유',                       reward:{coins:1500},   cond:'Object.keys(ownedJobs).length>=3'},
  {id:'job_5',      name:'직업 탐구자',        desc:'직업 5종 보유',                       reward:{coins:3000},   cond:'Object.keys(ownedJobs).length>=5'},
  {id:'job_10',     name:'직업 마스터',        desc:'직업 10종 보유',                      reward:{energy:15000}, cond:'Object.keys(ownedJobs).length>=10'},
  // ── 아이템 업적 ──
  {id:'item_5',     name:'아이템 입문',        desc:'아이템 5종 보유',                     reward:{coins:2000},   cond:'Object.keys(ownedItems).length>=5'},
  {id:'item_10',    name:'아이템 수집가',      desc:'아이템 10종 보유',                    reward:{coins:5000},   cond:'Object.keys(ownedItems).length>=10'},
  {id:'item_use_10',name:'아이템 활용가',      desc:'아이템 10회 사용',                    reward:{coins:3000},   cond:'totalItemUses>=10'},
  {id:'item_use_50',name:'아이템 달인',        desc:'아이템 50회 사용',                    reward:{energy:10000}, cond:'totalItemUses>=50'},
  // ── 특수 업적 ──
  {id:'no_dmg_wave',name:'무적',              desc:'피해 없이 웨이브 1회 클리어',           reward:{item:'shield'}, cond:'noDmgWave>=1'},
  {id:'boss_nodmg', name:'퍼펙트 클리어',     desc:'피해 없이 보스 처치',                  reward:{energy:30000}, cond:'noDmgBoss>=1'},
  {id:'party_play', name:'우리 함께',          desc:'파티 플레이 1회',                     reward:{coins:5000},   cond:'partyPlayed>=1'},
  {id:'all_maps',   name:'탐험가',             desc:'모든 일반 맵에서 웨이브 10 달성',     reward:{energy:15000}, cond:'clearedMaps.length>=5'},
  // ── 확장 업적 (인챈트/펫/도전/플레이) ──
  {id:'enchant_10', name:'행운의 초보',        desc:'인챈트 10회 시도',                    reward:{coins:5000},   cond:'(achStats.enchantAttempts||0)>=10'},
  {id:'enchant_100',name:'인챈트 중독자',      desc:'인챈트 100회 시도',                   reward:{energy:20000}, cond:'(achStats.enchantAttempts||0)>=100'},
  {id:'enchant_1000',name:'운명의 도박사',     desc:'인챈트 1000회 시도',                  reward:{energy:150000},cond:'(achStats.enchantAttempts||0)>=1000'},
  {id:'games_10',   name:'단골 생존자',        desc:'게임 10회 플레이',                    reward:{coins:5000},   cond:'(achStats.gamesPlayed||0)>=10'},
  {id:'games_100',  name:'끝없는 생존',        desc:'게임 100회 플레이',                   reward:{energy:40000}, cond:'(achStats.gamesPlayed||0)>=100'},
  {id:'challenge_all',name:'챌린지 정복자',    desc:'챌린지 맵 3종 모두 클리어',           reward:{item:'spatial_path'}, cond:'(achStats.challengeCleared||[]).length>=3'},
  {id:'pet_first',  name:'첫 반려동물',        desc:'펫 1마리 획득',                       reward:{coins:5000},   cond:'typeof ownedPets!=="undefined"&&Object.keys(ownedPets).length>=1'},
  {id:'pet_10',     name:'펫 애호가',          desc:'펫 10종 획득',                        reward:{energy:25000}, cond:'typeof ownedPets!=="undefined"&&Object.keys(ownedPets).length>=10'},
  {id:'pet_30',     name:'펫 마스터',          desc:'펫 30종 획득',                        reward:{energy:100000},cond:'typeof ownedPets!=="undefined"&&Object.keys(ownedPets).length>=30'},
  // ── 운 업적 ──
  {id:'lucky',      name:'오늘은 운이 좋군요', desc:'매 1초마다 20000분의 1 확률로 획득',  reward:{item:'lucky_clover'}, cond:'luckyAchieved>=1'},
  // ── 히든 ──
  {id:'secret_1',   name:'???',               desc:'???',                                  reward:{item:'soul_hope'},cond:'kills>=9999',hidden:true},
  {id:'secret_2',   name:'꿈과 현실 사이',    desc:'보스를 플레이어 체력 10% 이하로 잡기', reward:{energy:200000},cond:'dreamCloseKill>=1',hidden:true},
  {id:'secret_3',   name:'빌드 번호는 거짓말이다', desc:'로비 하단의 버전 표기를 집요하게 눌러보았다', reward:{job:'egg_job_debugger', item:'time_stop'}, cond:'(achStats.egg_version||0)>=1', hidden:true},
  {id:'secret_4',   name:'그들이 보고 있었다', desc:'개발자 콘솔 깊은 곳에 숨겨진 말을 찾아냈다', reward:{job:'egg_job_observer', wep:'sniper'}, cond:'(achStats.egg_console||0)>=1', hidden:true},
  {id:'secret_5',   name:'낡은 커맨드',       desc:'아주 오래전에 잊혀진 명령어를 로비에서 입력했다', reward:{job:'egg_job_retro', item:'star_rain'}, cond:'(achStats.egg_konami||0)>=1', hidden:true},
  {id:'secret_6',   name:'누군가 지켜보고 있다', desc:'아무도 없는 로비, 잠깐 나타난 눈과 마주쳤다', reward:{job:'egg_job_owl', armor:'shadow'}, cond:'(achStats.egg_eye||0)>=1', hidden:true},
  {id:'secret_7',   name:'정지된 시간 속에서', desc:'전장 한복판에서 미동도 하지 않고 1분을 버텼다', reward:{job:'egg_job_statue', armor:'steel'}, cond:'(achStats.egg_stillness||0)>=1', hidden:true},
  {id:'secret_8',   name:'진짜 각성',         desc:'꿈 속에서 스스로 깨어나는 법을 알아냈다', reward:{job:'egg_job_awakened', wep:'laser_gun'}, cond:'(achStats.egg_trueawaken||0)>=1', hidden:true},
  {id:'secret_9',   name:'이 세계를 만든 이', desc:'로비의 로고를 오래도록 붙잡고 있었다', reward:{job:'egg_job_developer', item:'turret'}, cond:'(achStats.egg_logo||0)>=1', hidden:true},
  {id:'secret_10',  name:'불운의 인장',       desc:'인챈트가 8번 연속으로 가장 낮은 결과만 내놓았다', reward:{job:'egg_job_cursed', wep:'darksword'}, cond:'(achStats.egg_badluck||0)>=1', hidden:true},
  {id:'secret_11',  name:'위로의 선물',       desc:'행운 없이도 50마리의 펫을 품에 안았다', reward:{job:'egg_job_beastfriend', item:'wolf'}, cond:'(achStats.egg_petcomfort||0)>=1', hidden:true},
  {id:'secret_12',  name:'새벽의 방문자',     desc:'아무도 없는 시간, 자정의 로비를 찾았다', reward:{job:'egg_job_sleepwalker', item:'blink'}, cond:'(achStats.egg_midnight||0)>=1', hidden:true},
  {id:'secret_13',  name:'메리 크리스마스, 생존자', desc:'크리스마스, 로비에 몰래 다녀간 손님을 붙잡았다', reward:{job:'egg_job_xmasmiracle', armor:'frost'}, cond:'(achStats.egg_xmas||0)>=1', hidden:true},
  {id:'secret_14',  name:'이름을 걸고',       desc:'갑옷 하나 없이 자신의 이름을 가진 자를 쓰러뜨렸다', reward:{job:'egg_job_barewarrior', wep:'sword'}, cond:'(achStats.egg_nakedboss||0)>=1', hidden:true},
  {id:'secret_15',  name:'고요 속의 외침',    desc:'음악을 미친 듯이 껐다 켰다 반복했다', reward:{job:'egg_job_soundlord', item:'static_field'}, cond:'(achStats.egg_bgmtoggle||0)>=1', hidden:true},
  {id:'secret_16',  name:'성실함의 증표',     desc:'7일 연속으로 하루도 거르지 않았다', reward:{job:'egg_job_persistent', armor:'holy'}, cond:'(achStats.egg_dailystreak||0)>=1', hidden:true},
  {id:'secret_17',  name:'포기하지 않는 마음', desc:'초기화 버튼 앞에서 열 번이나 마음을 고쳐먹었다', reward:{job:'egg_job_unyielding', item:'revive'}, cond:'(achStats.egg_nevergiveup||0)>=1', hidden:true},
  {id:'secret_18',  name:'무일푼 생존자',     desc:'동전 한 닢 없이도 살아남아 좀비를 쓰러뜨렸다', reward:{job:'egg_job_penniless', item:'magnet'}, cond:'(achStats.egg_broke||0)>=1', hidden:true},
  {id:'secret_19',  name:'누군가 당신 뒤에 있다', desc:'체력 1로 5초간 버틴 순간, 등 뒤에서 무언가를 느꼈다', reward:{job:'egg_job_shadowsurvivor', armor:'ghost_ar'}, cond:'(achStats.egg_behind||0)>=1', hidden:true},
  {id:'secret_20',  name:'돌아온 자리',       desc:'오랜 공백 끝에, 이 자리는 여전히 당신을 기다리고 있었다', reward:{job:'egg_job_returned', armor:'wind'}, cond:'(achStats.egg_returned||0)>=1', hidden:true},
  {id:'secret_21',  name:'66층의 속삭임',     desc:'무한의 탑 66층에서, 오르지 말라는 속삭임을 들었다', reward:{job:'egg_job_abysswanderer', wep:'scythe'}, cond:'(achStats.egg_tower66||0)>=1', hidden:true},
  {id:'secret_22',  name:'13일의 금요일',     desc:'불길한 날, 낯선 방문객을 직접 사냥했다', reward:{job:'egg_job_fridayhunter', wep:'needle'}, cond:'(achStats.egg_friday13||0)>=1', hidden:true},
  {id:'secret_23',  name:'마지막 편지',       desc:'모든 흔적을 다 찾은 자에게만 남겨진, 만든 이의 마지막 인사', reward:{job:'egg_job_laststanding', armor:'nightmare', wep:'egg_letter_wep'}, cond:'["secret_3","secret_4","secret_5","secret_6","secret_7","secret_8","secret_9","secret_10","secret_11","secret_12","secret_13","secret_14","secret_15","secret_16","secret_17","secret_18"].every(id=>achData[id])', hidden:true},
  {id:'secret_24',  name:'그들도 누군가였다', desc:'네크로맨서로 오백 번째 그림자를 되살렸다', reward:{job:'egg_job_restgiver', item:'soul_shard'}, cond:'(achStats.egg_necrosaved||0)>=1', hidden:true},
  {id:'secret_25',  name:'영원한 동반자',     desc:'같은 펫과 백 번의 전장을 함께 넘었다', reward:{job:'egg_job_petbond', item:'drone_item'}, cond:'(achStats.egg_petloyalty||0)>=1', hidden:true},
  {id:'secret_26',  name:'다시 만난 사람',     desc:'이 세계와 같은 이름을 가진 존재를, 열 번째로 떠나보냈다', reward:{job:'egg_job_letgo', wep:'godspear', armor:'omnipotent', coins:100000, energy:100000}, cond:'(achStats.egg_bossreunion||0)>=1', hidden:true},
  {id:'secret_27',  name:'빈 방',             desc:'눈 속에서 250일을 살아내고, 다 쓰지 못한 하루를 대신 살았다', reward:{job:'egg_job_wintersurvivor', wep:'icegen'}, cond:'(achStats.egg_wintersurvivor||0)>=1', hidden:true},
  {id:'secret_28',  name:'다른 발소리',       desc:'혼자라고 생각했던 백 번의 전장, 사실은 둘이었다', reward:{job:'egg_job_shadowcompanion', item:'clone_item'}, cond:'(achStats.egg_sologhost||0)>=1', hidden:true},
  {id:'secret_29',  name:'새로운 새벽',       desc:'새해 첫날, 여전히 이 자리를 지키고 있었다', reward:{job:'egg_job_newdawn', item:'phoenix_feather'}, cond:'(achStats.egg_newyear||0)>=1', hidden:true},
  {id:'secret_30',  name:'선지자의 진심',     desc:'선지자 백 명을 떠나보내고서야, 그들이 도망치려 했을 뿐임을 알았다', reward:{job:'egg_job_prophet', wep:'epistol'}, cond:'(achStats.egg_prophet||0)>=1', hidden:true},
  {id:'secret_31',  name:'첫 번째 어둠 너머', desc:'생애 첫 죽음. 그리고 다시 눈을 떴다', reward:{job:'egg_job_firstlight', item:'elixir'}, cond:'(achStats.egg_firstdeath||0)>=1', hidden:true},
  {id:'secret_32',  name:'아무도 다치지 않았다', desc:'단 한 마리도 해치지 않고 웨이브를 끝냈다', reward:{job:'egg_job_pacifist', armor:'angel'}, cond:'(achStats.egg_pacifist||0)>=1', hidden:true},
  {id:'secret_33',  name:'이제는 눈을 감아도 돼', desc:'E Y E를 떠나보낸 뒤, 꿈 속에서 조용히 1분을 머물렀다', reward:{job:'egg_job_closedeyes', wep:'moonshard'}, cond:'(achStats.egg_closedeyes||0)>=1', hidden:true},
  {id:'secret_34',  name:'가장 단순한 것',    desc:'오십 판이 넘도록, 처음 쥔 권총 하나만으로 버텼다', reward:{job:'egg_job_simpleweapon', item:'berserker'}, cond:'(achStats.egg_simpleweapon||0)>=1', hidden:true},
  {id:'secret_35',  name:'새벽 세시',         desc:'가장 깊은 새벽, 아무도 없어야 할 로비를 찾았다', reward:{job:'egg_job_3am', item:'stealth'}, cond:'(achStats.egg_3am||0)>=1', hidden:true},
  {id:'secret_36',  name:'정적 속의 목소리',  desc:'음악 없이 열 판을 버텼다. 그 정적 속에서 무언가 속삭였다', reward:{job:'egg_job_silentvoice', item:'smoke_screen'}, cond:'(achStats.egg_silentvoice||0)>=1', hidden:true},
  {id:'secret_37',  name:'나를 닮은 것',      desc:'무한의 탑 99층에서, 당신과 똑같이 생긴 것과 마주쳤다', reward:{job:'egg_job_mirror99', wep:'dualkatana'}, cond:'(achStats.egg_mirror99||0)>=1', hidden:true},
  {id:'secret_38',  name:'무(無)의 파편',     desc:'인챈트가 존재조차 희미한 등급을 토해냈다', reward:{job:'egg_job_void', armor:'void'}, cond:'(achStats.egg_void||0)>=1', hidden:true},
  {id:'secret_39',  name:'움직인 그림자',     desc:'로비에 오래 머문 어느 순간, 구석의 그림자가 분명히 움직였다', reward:{job:'egg_job_shadowmove', item:'decoy_item'}, cond:'(achStats.egg_shadowmove||0)>=1', hidden:true},
];

// 업적 진행도 저장
let achData = lJ('hd_ach', {});  // {id: true/false}
let achStats = lJ('hd_ach_stats', {
  kills:0, maxWave:0, mapWave:{}, bossKills:{}, dreamEntered:0,
  noDmgWave:0, noDmgBoss:0, partyPlayed:0, clearedMaps:[],
  totalItemUses:0, luckyAchieved:0, dreamCloseKill:0
});
function saveAch(){ sv('hd_ach',achData); sv('hd_ach_stats',achStats); }

// 업적 체크 함수
function checkAchievements(){
  let newUnlock = false;
  const kills=achStats.kills, maxWave=achStats.maxWave, bossKills=achStats.bossKills||{};
  const mapWave=achStats.mapWave||{}, dreamEntered=achStats.dreamEntered||0;
  const noDmgWave=achStats.noDmgWave||0, noDmgBoss=achStats.noDmgBoss||0;
  const partyPlayed=achStats.partyPlayed||0, clearedMaps=achStats.clearedMaps||[];
  const totalItemUses=achStats.totalItemUses||0, luckyAchieved=achStats.luckyAchieved||0;
  const dreamCloseKill=achStats.dreamCloseKill||0;
  const jobLvs=lJ('hd_jlv',{});
  ACHIEVEMENTS.forEach(a=>{
    if(achData[a.id]) return;
    try {
      if(eval(a.cond)){
        achData[a.id]=true;
        newUnlock=true;
        grantAchReward(a);
        setMsg('🏆 업적 달성: '+a.name+'!');
        setTimeout(()=>{if(running)setMsg('');},3000);
      }
    } catch(e){}
  });
  if(newUnlock) saveAch();
  checkTitles();
}

// 업적 보상 지급
function grantAchReward(a){
  const r=a.reward;
  if(!r) return;
  if(r.coins){ coins+=r.coins; sv('hd_c',coins); }
  if(r.energy){ energy+=r.energy; sv('hd_e',energy); }
  if(r.item){ ownedItems[r.item]=true; saveItems(); }
  if(r.job){ ownedJobs[r.job]=true; saveJobData(); }
  if(r.wep){ owned[r.wep]=true; saveAll(); }
  if(r.armor){ owned['ar_'+r.armor]=true; saveAll(); }
  updRes();
}

// 업적 카드/프리뷰 공용: 보상 요약 텍스트
function achRewardText(a){
  const r=a.reward||{};
  let parts=[];
  if(r.coins)parts.push('🪙 '+r.coins.toLocaleString()+'코인');
  if(r.energy)parts.push('⚡ '+r.energy.toLocaleString()+'에너지');
  if(r.item){const it=ITEMS.find(x=>x.id===r.item);if(it)parts.push(it.icon+' '+it.name);}
  if(r.wep){const w=WEPS[r.wep];if(w)parts.push(w.icon+' '+w.name);}
  if(r.armor){const ar=ARMORS.find(x=>x.id===r.armor);if(ar)parts.push(ar.icon+' '+ar.name+'갑옷');}
  if(r.job){const j=JOBS.find(x=>x.id===r.job);if(j)parts.push(j.icon+' '+j.name+'(전용 직업)');}
  return '보상: '+(parts.length?parts.join(' + '):'-');
}

// ════════════════════════════════════════════
// ══ 칭호 시스템 ══
// ════════════════════════════════════════════
const TITLES = [
  {id:'t_novice',      icon:'🔰', name:'새내기 생존자',   desc:'좀비 10마리 처치',                 cond:'achStats.kills>=10'},
  {id:'t_slayer',      icon:'⚔️', name:'좀비 학살자',     desc:'좀비 1,000마리 처치',              cond:'achStats.kills>=1000'},
  {id:'t_annihilator', icon:'☠️', name:'절멸자',         desc:'좀비 10,000마리 처치',             cond:'achStats.kills>=10000'},
  {id:'t_veteran',     icon:'🎖️', name:'베테랑',         desc:'웨이브 25 달성',                  cond:'achStats.maxWave>=25'},
  {id:'t_survivor',    icon:'🏕️', name:'생존왕',         desc:'웨이브 50 달성',                  cond:'achStats.maxWave>=50'},
  {id:'t_immortal',    icon:'♾️', name:'불멸자',         desc:'웨이브 100 달성',                 cond:'achStats.maxWave>=100'},
  {id:'t_bosshunter',  icon:'👹', name:'보스 사냥꾼',     desc:'일반 보스 모두 처치',              cond:'Object.keys(achStats.bossKills||{}).filter(k=>!k.startsWith("dream")).length>=8'},
  {id:'t_dreamwalker', icon:'🌙', name:'드림워커',       desc:'드림코어 세계 진입',               cond:'(achStats.dreamEntered||0)>=1'},
  {id:'t_dreamender',  icon:'🌌', name:'꿈의 종결자',     desc:'드림코어 보스 4종 모두 처치',       cond:'["dream_sun","dream_limbo","dream_eye","dream_wakeup"].every(k=>(achStats.bossKills||{})[k]>=1)'},
  {id:'t_rich',        icon:'💰', name:'대부호',         desc:'코인 1,000,000 보유',              cond:'coins>=1000000'},
  {id:'t_energized',   icon:'⚡', name:'에너지 마스터',   desc:'에너지 100,000 보유',              cond:'energy>=100000'},
  {id:'t_collector',   icon:'🗃️', name:'무기 수집가',     desc:'무기 20종 보유',                  cond:'Object.keys(owned).filter(k=>!k.startsWith("ar_")).length>=20'},
  {id:'t_armormaster', icon:'🛡️', name:'갑옷 마스터',     desc:'갑옷 20종 보유',                  cond:'Object.keys(owned).filter(k=>k.startsWith("ar_")).length>=20'},
  {id:'t_jobmaster',   icon:'🎭', name:'직업 마스터',     desc:'직업 10종 보유',                  cond:'Object.keys(ownedJobs).length>=10'},
  {id:'t_gambler',     icon:'🎰', name:'도박사',         desc:'인챈트 100회 시도',               cond:'(achStats.enchantAttempts||0)>=100'},
  {id:'t_petlover',    icon:'🐾', name:'펫 애호가',       desc:'펫 10종 보유',                    cond:'typeof ownedPets!=="undefined"&&Object.keys(ownedPets).length>=10'},
  {id:'t_hardcore',    icon:'🔥', name:'하드코어 게이머', desc:'50회 플레이',                     cond:'(achStats.gamesPlayed||0)>=50'},
  {id:'t_perfectionist',icon:'✨', name:'완벽주의자',      desc:'피해 없이 보스 처치',              cond:'(achStats.noDmgBoss||0)>=1'},
  {id:'t_challenger',  icon:'🏆', name:'챌린저',         desc:'챌린지 맵 모두 클리어',            cond:'(achStats.challengeCleared||[]).length>=3'},
  {id:'t_legend',      icon:'👑', name:'전설',           desc:'모든 업적 달성',                  cond:'ACHIEVEMENTS.every(a=>achData[a.id])'},
  {id:'t_event',       icon:'🎉', name:'축제의 주인공',   desc:'이벤트 상점에서 구매',            cond:'false'},
  {id:'t_awakened',    icon:'👁️', name:'진짜로 깨어난 자', desc:'꿈 속에서 WAKE UP을 되뇌었다',   cond:'!!achData["secret_8"]'},
];
let titleData = lJ('hd_titles', {unlocked:{}, equipped:''});
function saveTitles(){ sv('hd_titles', titleData); }
function checkTitles(){
  let newUnlock=false;
  TITLES.forEach(t=>{
    if(titleData.unlocked[t.id]) return;
    try{
      if(eval(t.cond)){
        titleData.unlocked[t.id]=true;
        newUnlock=true;
        setMsg('👑 칭호 획득: '+t.name+'!');
        setTimeout(()=>{if(running)setMsg('');},3000);
      }
    } catch(e){}
  });
  if(newUnlock) saveTitles();
}
function equipTitle(id){
  titleData.equipped = titleData.equipped===id ? '' : id;
  saveTitles();
  updateTitleDisp();
  renderTitleList();
}
function updateTitleDisp(){
  const el=document.getElementById('titleDisp');
  if(!el) return;
  const t=TITLES.find(x=>x.id===titleData.equipped);
  el.textContent = t ? (t.icon+' '+t.name) : '';
  el.style.display = t ? 'inline-block' : 'none';
}
function renderTitleList(){
  const list=document.getElementById('titleList');
  if(!list) return;
  checkTitles();
  list.innerHTML='';
  const doneCnt=TITLES.filter(t=>titleData.unlocked[t.id]).length;
  const prog=document.getElementById('titleProgress');
  if(prog) prog.textContent=doneCnt+'/'+TITLES.length+' 칭호 보유';
  TITLES.forEach(t=>{
    const isDone=!!titleData.unlocked[t.id];
    const isEq=titleData.equipped===t.id;
    const card=document.createElement('div');
    card.className='ach-card'+(isDone?' done':'');
    card.innerHTML=
      '<div class="ach-ico">'+(isDone?t.icon:'⬜')+'</div>'+
      '<div class="ach-info">'+
        '<div class="ach-name">'+(isDone?t.name:'???')+'</div>'+
        '<div class="ach-desc">'+(isDone?t.desc:'???')+'</div>'+
      '</div>'+
      (isDone
        ? '<button onclick="equipTitle(\''+t.id+'\')" style="padding:6px 10px;border:none;border-radius:8px;font-size:10px;font-weight:700;cursor:pointer;background:'+(isEq?'#fee2e2':'linear-gradient(135deg,#7c3aed,#a855f7)')+';color:'+(isEq?'#dc2626':'#fff')+';">'+(isEq?'해제':'장착')+'</button>'
        : '<div style="font-size:10px;color:#374151;">미달성</div>');
    list.appendChild(card);
  });
}
let curAchTab='ach';
function setAchTab(tab,btn){
  curAchTab=tab;
  document.querySelectorAll('#sAch .stab').forEach(b=>b.classList.remove('on'));
  if(btn) btn.classList.add('on');
  const achEl=document.getElementById('achList'), titleEl=document.getElementById('titleList');
  if(achEl) achEl.style.display = tab==='ach' ? 'flex' : 'none';
  if(titleEl) titleEl.style.display = tab==='title' ? 'flex' : 'none';
  if(tab==='ach') renderAchievements(); else renderTitleList();
}

// 랜덤 행운 업적 체크 (1초마다)
setInterval(()=>{
  if(!achData['lucky'] && Math.random() < 1/20000){
    achStats.luckyAchieved=1; checkAchievements();
  }
},1000);

const SCREENS=['sLobby','sMap','sWeapon','sShop','sJob','sUpg','sEquip','sParty','sSeason','sDream','sDreamMap','sAch','sEnchant','sPotionShop','sDailyQuest','sPets','sEvent','sRecords'];
function go(id){
  SCREENS.forEach(s=>{const el=document.getElementById(s);if(el)el.classList.toggle('on',s===id);});
  document.getElementById('gameCanvas').style.display='none';
  document.getElementById('gameUI').style.display='none';
  if(id==='sLobby'){updRes();stopGame();if(typeof stopEventPresentation==='function')stopEventPresentation();if(bgmUnlocked)startBGM();updateTitleDisp();}
  if(id==='sMap')drawMP();
  if(id==='sWeapon')renderWepSel();
  if(id==='sShop'){curShopTab='items';renderShop();}
  if(id==='sJob')renderJob();
  if(id==='sUpg')renderUpg();
  if(id==='sEquip')renderEquip();
  if(id==='sAch')setAchTab(curAchTab,document.querySelector('#sAch .stab[data-tab="'+curAchTab+'"]'));
  if(id==='sEnchant'){updRes();setEnchantCat('wep',document.querySelector('#sEnchant .stab'));}
  if(id==='sPotionShop'){updRes();renderPotionShop();}
  if(id==='sDailyQuest'){updRes();renderDailyQuest();}
  if(id==='sPets'){curPetTab='collection';renderPetScreen();}
  if(id==='sEvent')setEventTab(curEventTab,document.querySelector('#sEvent .stab[data-tab="'+curEventTab+'"]'));
  if(id==='sRecords')renderRecordsScreen();
  if(id==='sDream'){
    document.getElementById('dlc').textContent=coins.toLocaleString();
    document.getElementById('dle').textContent=energy.toLocaleString();
    startDreamAmbient('dreamCanvas');
    positionDreamEyes();
    animateDreamTitle();
    startScanline();
  }
  if(id==='sLobby'){
    stopScanline();
    const gc=document.getElementById('gameCanvas');if(gc)gc.style.filter='';
    if(window._dreamTitleItv){clearInterval(window._dreamTitleItv);window._dreamTitleItv=null;}
  }
}
function showGame(){
  SCREENS.forEach(s=>{const el=document.getElementById(s);if(el)el.classList.remove('on');});
  document.getElementById('gameCanvas').style.display='block';
  document.getElementById('gameUI').style.display='block';
}
function updRes(){
  ['lc','sc','jc'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=coins;});
  ['le','se','ue','je'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=energy;});
  
}
updRes();
updateTitleDisp();
