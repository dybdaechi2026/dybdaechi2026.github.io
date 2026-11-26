/* ===== DYB Christmas Market — shared rules (used by the website preview AND the Google Apps Script) ===== */
var HEADERS = {
  items:  ['ID','카테고리','이름','가격','초기재고','현재고','당일판매수량','당일재고','1인최대','이미지','판매','설명'],
  users:  ['이름','비밀번호','포인트','학년','담임'],
  orders: ['지급완료','시간','주문번호','이름','상품ID','상품명','수량','단가','금액','주문후포인트','학생코드'],
  box:    ['등급','상품명','이미지','가중치','남은수량','처음수량'],
  roul:   ['칸','표시','상품명','이미지','확률','남은수량'],
  wins:   ['지급완료','시간','이름','게임','등급','상품명','이미지','학생코드'],
  letters:['선생님','학생 이름','내용','학년','시간','편지에 쓴 이름','명단 담임','지급포인트','학생코드'],
  comments:['시간','학년','이름','내용','상태','지급포인트','학생코드'],
  banned: ['금지어']
};
var TAB_NAMES = {items:'물품',users:'학생',orders:'주문',box:'랜덤박스',roul:'룰렛',wins:'당첨기록',letters:'편지',comments:'댓글',banned:'금지어'};
var LETTER_POINTS = 1000;   // 편지 한 번에 주는 포인트
var LETTER_MAX = 1;         // 포인트를 받을 수 있는 편지 수 (1인)
var COMMENT_MAX = 2;        // 1인 댓글 최대 개수
var COMMENT_POINTS = 500;   // 첫 댓글 포인트

var SEED_ITEM_COLS = ['ID','카테고리','이름','가격','재고','1인최대','이미지','판매','설명'];
var SEED = {
  items: [
    ['ticket_box','참가권','랜덤박스 참가권',1000,100,2,'ticket_box','Y'],
    ['ticket_roul','참가권','룰렛 게임 참가권',1000,100,2,'ticket_roul','Y'],
    ['ticket_rps','참가권','선생님과 가위바위보 참가권',500,100,1,'ticket_rps','Y','선생님과 가위바위보를 해서 이기면 특별 간식 제공!'],
    ['cp_word','쿠폰','단어커트 +5',2500,100,1,'cp_word','Y',''],
    ['cp_oral','쿠폰','구두 면제권',3000,100,1,'cp_oral','Y',''],
    ['cp_hw','쿠폰','한과목 숙제 면제권',4000,100,1,'cp_hw','숨김',''],
    ['cp_retest','쿠폰','재시험 면제권',4500,100,1,'cp_retest','Y',''],
    ['snack_b','간식','이브의 랜덤 짭짤 과자',1500,100,'','snack_b','Y','이브가 고른 짭짤한 과자 중 하나를 랜덤으로 받아요!'],
    ['snack_c','간식','와비의 랜덤 달콤 과자',1500,100,'','snack_c','Y','와비가 고른 달콤한 과자 중 하나를 랜덤으로 받아요!'],
    ['snack_a','간식','디비의 랜덤 사탕과 젤리',500,100,'','snack_a','Y','디비가 고른 사탕 또는 젤리 중 하나를 랜덤으로 받아요!'],
    ['charpen','문구','크리스마스 4색 볼펜',5000,100,'','charpen','Y',''],
    ['pencil_rand','문구','꼬미의 랜덤 연필',3000,100,'','pencil_rand','Y','꼬미가 고른 크리스마스 연필 or DYB 연필 중 하나를 랜덤으로 받아요!'],
    ['highlighter','문구','형광펜',3000,100,'','highlighter','Y',''],
    ['pouch','문구','수정테이프',4500,100,'','pouch','Y',''],
    ['pen','문구','볼펜',2500,100,'','pen','Y',''],
    ['ring','굿즈','크리스마스 불빛 반지',5000,100,'','ring','Y',''],
    ['squishy','굿즈','크리스마스 스쿼시',4000,100,'','squishy','Y',''],
    ['eraser_gacha','굿즈','포스의 랜덤 지우개',3000,100,'','eraser_gacha','Y','포스가 고른 치이카와 or 짱구 or DYB 지우개 중 하나를 랜덤으로 받아요!'],
    ['candy','간식','캔디 (담라)',0,100,'','damla','숨김','랜덤박스 7등 경품 (사이트 판매 X)']
  ],
  users: [
    ['김민준','1234',10000,'샘플',''],['이서연','1234',10000,'샘플',''],['박지호','1234',10000,'샘플',''],['최하은','1234',10000,'샘플',''],['정도윤','1234',10000,'샘플',''],
    ['강서윤','1234',10000,'샘플',''],['조예준','1234',10000,'샘플',''],['윤지우','1234',10000,'샘플',''],['장시우','1234',10000,'샘플',''],['임하린','1234',10000,'샘플','']
  ],
  // 가중치 = 확률(%)
  box: [
    ['1등','배달의 민족 3만원권','baemin',0.7,3,3],
    ['2등','한과목 숙제 면제권','cp_hw',2.8,100,100],
    ['3등','이브의 랜덤 짭짤 과자','snack_b',7,100,100],
    ['4등','크리스마스 사탕','lollipop',10.5,100,100],
    ['5등','랜덤 필기구','stationery_rand',21,100,100],
    ['6등','구두 면제권','cp_oral',28,100,100],
    ['7등','캔디','damla',30,100,100]
  ],
  // 칸, 표시(룰렛 글자), 상품명(시트·당첨 기록), 이미지(비우면 글자만 + 작은 칸), 확률(%), 남은수량
  roul: [
    [1,'랜덤 연필','꼬미의 랜덤 연필','pencil_rand',10,100],
    [2,'랜덤 사탕','디비의 랜덤 사탕과 젤리','snack_a',10,100],
    [3,'랜덤 달콤과자','와비의 랜덤 달콤 과자','snack_c',10,100],
    [4,'구두 면제권','구두 면제권','cp_oral',10,100],
    [5,'재시험 면제권','재시험 면제권','cp_retest',10,100],
    [6,'단어 커트 +5','단어커트 +5','cp_word',10,100],
    [7,'한번 더','한번 더','again',10,9999],
    [8,'랜덤 지우개','포스의 랜덤 지우개','eraser_gacha',10,100],
    [9,'꽝','꽝','miss',19,9999],
    [10,'전체 숙제 면제권','전체 숙제 면제권','',1,100]
  ]
};

function E_num(v){ var n = Number(v); return isNaN(n) ? 0 : n; }
function E_str(v){ return v === null || v === undefined ? '' : String(v).trim(); }
function E_mark(o,k){ (o._dirty = o._dirty || []).indexOf(k) < 0 && o._dirty.push(k); }
// 참가권 3종만 '1인최대'대로, 나머지 모든 물품은 종류별 1개까지
// 1인 구매 제한 (시트 '1인최대' 값과 상관없이 고정): 룰렛·랜덤박스 참가권 2개, 나머지 모두(가위바위보·면제권 포함) 1개
var LIMIT_FIXED = {ticket_box:2, ticket_roul:2};
function E_limit(i){ return LIMIT_FIXED[E_str(i['ID'])] || 1; }
function E_hidden(i){ return E_str(i['판매']) === '숨김'; }
function E_onSale(i){ var s = E_str(i['판매']).toUpperCase(); return s !== 'N' && s !== '숨김' && E_str(i['ID']) !== ''; }
var ROUL_AGAIN = '한번 더', ROUL_MISS = '꽝';

function E_pw(v){ return E_str(v).replace(/\s/g,'').toUpperCase(); }
function E_key(u){ return E_str(u['이름']) + '|' + E_pw(u['비밀번호']); }
function E_isMe(row, u){ var c = E_str(row['학생코드']); return c ? c === E_key(u) : E_str(row['이름']) === E_str(u['이름']); }
function E_findUser(db, name, pw){
  name = E_str(name); pw = E_pw(pw);
  if (!name) throw new Error('이름을 적어 줘!');
  var same = db.users.filter(function(x){ return E_str(x['이름']) === name; });
  if (!same.length) throw new Error('명단에 없는 이름이에요. 선생님께 확인해 주세요!');
  var u = same.filter(function(x){ return E_pw(x['비밀번호']) === pw; })[0];
  if (!u) throw new Error('초대장 번호가 틀렸어요!');
  return u;
}
function E_bought(db, u, id){
  return db.orders.reduce(function(s,o){ return (E_isMe(o,u) && E_str(o['상품ID'])===id) ? s + E_num(o['수량']) : s; }, 0);
}
function E_used(db, u, game){
  // '한번 더'는 참가권을 쓰지 않은 것으로 쳐요 (= 참가권 1장 돌려받기)
  return db.wins.filter(function(w){ return E_isMe(w,u) && E_str(w['게임'])===game && E_str(w['상품명'])!==ROUL_AGAIN; }).length;
}
function E_tickets(db, u){
  return { box: E_bought(db,u,'ticket_box') - E_used(db,u,'랜덤박스'),
           roul: E_bought(db,u,'ticket_roul') - E_used(db,u,'룰렛') };
}
function E_state(db, u){
  var name = E_str(u['이름']);
  return {
    user: { name: name, points: E_num(u['포인트']), tickets: E_tickets(db,u), grade: E_str(u['학년']), teacher: E_str(u['담임']) },
    items: db.items.filter(function(i){ return E_str(i['ID']) !== '' && !E_hidden(i); }).map(function(i){ var id=E_str(i['ID']), st=E_stock(db,i); return { off: !E_onSale(i), prep: E_num(i['가격']) <= 0,
      id:id, cat:E_str(i['카테고리']), name:E_str(i['이름']), price:E_num(i['가격']), stock:st.day, base:st.base,
      limit:E_limit(i), img:E_str(i['이미지']), desc:E_str(i['설명']), mine:E_bought(db,u,id) }; }),
    box: db.box.filter(function(b){ return E_str(b['상품명']); }).map(function(b){ var l = E_num(b['남은수량']); return {grade:E_str(b['등급']), name:E_str(b['상품명']), img:E_str(b['이미지']), left:l, init:Math.max(E_num(b['처음수량']), l)}; }),
    roul: db.roul.filter(function(r){ return E_str(r['상품명']); }).map(function(r){ return {name:E_str(r['표시']) || E_str(r['상품명']), full:E_str(r['상품명']), img:E_str(r['이미지']), left:E_num(r['남은수량'])}; }),
    wins: (function(){ var m = function(w){ return {t:E_str(w['시간']), who:E_who(db,w), nm:E_mask(w['이름']), g:E_gradeOf(db,w), game:E_str(w['게임']), grade:E_str(w['등급']), prize:E_str(w['상품명']), img:E_str(w['이미지'])}; };
      var top = db.wins.filter(function(w){ return E_str(w['등급']) === '1등'; }), rest = db.wins.filter(function(w){ var n = E_str(w['상품명']); return n !== ROUL_MISS && n !== ROUL_AGAIN; }).slice(-60).filter(function(w){ return E_str(w['등급']) !== '1등'; });
      return top.reverse().map(m).concat(rest.reverse().map(m)); })(),
    popular: E_popular(db),
    pools: db.pools || {},
    comments: db.comments.filter(function(c){ var st = E_str(c['상태']); return st !== '숨김' && st !== '자동삭제' && !E_bad(E_str(c['내용']), E_bannedList(db)); })
      .slice(-60).reverse().map(function(c){ return {t:E_str(c['시간']), who:E_who(db,c), text:E_str(c['내용']), mine:E_isMe(c,u)}; }),
    letter: { sent: db.letters.filter(function(l){ return E_isMe(l,u); }).length, max: LETTER_MAX, points: LETTER_POINTS },
    comment: { mine: db.comments.filter(function(c){ return E_isMe(c,u) && E_str(c['상태']) !== '자동삭제'; }).length, max: COMMENT_MAX, points: COMMENT_POINTS },
    myOrders: db.orders.filter(function(o){ return E_isMe(o,u); }).slice(-30).reverse().map(function(o){ return {t:E_str(o['시간']), no:E_str(o['주문번호']), name:E_str(o['상품명']), qty:E_num(o['수량']), sum:E_num(o['금액'])}; })
  };
}
function E_order(db, req, now){
  var u = E_findUser(db, req.name, req.pw), name = E_str(u['이름']);
  var cart = (req.cart || []).filter(function(c){ return c && E_num(c.qty) > 0; });
  if (!cart.length) throw new Error('장바구니가 비어 있어요!');
  var total = 0, lines = [], inCart = {};
  cart.forEach(function(c){
    var it = db.items.filter(function(i){ return E_str(i['ID']) === E_str(c.id) && E_onSale(i); })[0];
    if (!it) throw new Error('지금 팔지 않는 물건이 장바구니에 있어요.');
    if (E_num(it['가격']) <= 0) throw new Error(E_str(it['이름']) + '은(는) 아직 판매 준비 중이에요!');
    var q = Math.floor(E_num(c.qty)), stock = E_stock(db,it).day, lim = E_limit(it);
    if (stock < q) throw new Error(stock <= 0 ? E_str(it['이름']) + '은(는) 오늘 다 팔렸어요!' : E_str(it['이름']) + ' 수량이 부족해요! 조금만 줄여 주세요.');
    if (!(q >= 1)) throw new Error('수량을 다시 확인해 주세요.');
    inCart[E_str(it['ID'])] = (inCart[E_str(it['ID'])] || 0) + q;
    if (E_bought(db,u,E_str(it['ID'])) + inCart[E_str(it['ID'])] > lim) throw new Error(E_str(it['이름']) + '은(는) 한 사람당 ' + lim + '개까지만 살 수 있어요!');
    total += E_num(it['가격']) * q; lines.push({it:it, q:q});
  });
  if (total > E_num(u['포인트'])) throw new Error('포인트가 부족해요! (필요 ' + total.toLocaleString() + ' / 내 포인트 ' + E_num(u['포인트']).toLocaleString() + ')');
  var no = 'D' + String(Date.now()).slice(-6) + Math.floor(Math.random()*90+10);
  u['포인트'] = E_num(u['포인트']) - total; E_mark(u,'포인트');
  lines.forEach(function(l){
    var o = {'시간':now,'주문번호':no,'이름':name,'상품ID':E_str(l.it['ID']),'상품명':E_str(l.it['이름']),'수량':l.q,'단가':E_num(l.it['가격']),'금액':E_num(l.it['가격'])*l.q,'주문후포인트':u['포인트'],'학생코드':E_key(u)};
    db.orders.push(o); (db.newOrders = db.newOrders || []).push(o);
  });
  return { orderNo: no, total: total, lines: lines.map(function(l){ return {name:E_str(l.it['이름']), qty:l.q, img:E_str(l.it['이미지'])}; }) };
}
function E_play(db, req, now, rand){
  var u = E_findUser(db, req.name, req.pw), name = E_str(u['이름']);
  var isRoul = req.game === 'roul', game = isRoul ? '룰렛' : '랜덤박스';
  var t = E_tickets(db, u);
  if ((isRoul ? t.roul : t.box) < 1) throw new Error(game + ' 참가권이 없어요! 마켓에서 참가권을 먼저 사 주세요 🎟️');
  var list = isRoul ? db.roul.filter(function(r){ return E_str(r['상품명']); }) : db.box.filter(function(b){ return E_str(b['상품명']); });
  var cand = [];
  var wk = isRoul ? '확률' : '가중치';
  var useW = !isRoul || list.some(function(r){ return E_str(r['확률']) !== ''; });
  var wt = function(r){ return useW ? E_num(r[wk]) : 1; };
  list.forEach(function(r,i){ if (E_num(r['남은수량']) > 0 && wt(r) > 0) cand.push(i); });
  if (!cand.length) throw new Error('상품이 모두 소진되었어요. 선생님께 알려 주세요!');
  var idx;
  var tw = cand.reduce(function(s,i){ return s + wt(list[i]); }, 0), x = rand() * tw;
  idx = cand[cand.length-1];
  for (var k = 0; k < cand.length; k++){ x -= wt(list[cand[k]]); if (x < 0){ idx = cand[k]; break; } }
  var row = list[idx];
  row['남은수량'] = E_num(row['남은수량']) - 1; E_mark(row,'남은수량');
  var w = {'시간':now,'이름':name,'게임':game,'등급':E_str(row['등급']),'상품명':E_str(row['상품명']),'이미지':E_str(row['이미지']),'학생코드':E_key(u)};
  db.wins.push(w); (db.newWins = db.newWins || []).push(w);
  return { index: idx, prize: { grade: E_str(row['등급']), name: E_str(row['상품명']), img: E_str(row['이미지']) } };
}

/* ---------- 이름 가리기 / 학년 ---------- */
function E_mask(name){
  var c = Array.from(E_str(name)); if (c.length <= 1) return c.join('');
  if (c.length === 2) return c[0] + '*';
  return c[0] + new Array(c.length - 1).join('*') + c[c.length-1];
}
function E_gradeOf(db, row){
  var code = E_str(row['학생코드']), g = E_str(row['학년']);
  if (!g) { var u = db.users.filter(function(x){ return code ? E_key(x) === code : E_str(x['이름']) === E_str(row['이름']); })[0]; g = u ? E_str(u['학년']) : ''; }
  return /학년/.test(g) ? g : '';
}
function E_who(db, row){ var g = E_gradeOf(db, row); return E_mask(row['이름']) + (g ? ' (' + g + ')' : ''); }

/* ---------- 비속어 필터 ---------- */
var BAD_KO = ['야르','밤티','아자스','쌰갈','샤갈','샤걀','샤발','쌰발','쉬발','쒸발','씌발','씨바','시바','씌바','시이발','씨이발','쉬바','쉬벌','슈벌','시벌탱','십새','씹새','니미럴','개씨','개시키','개쉑','개섹','쉑','좆밥','ㅈ밥','존맛','존잼','존귀','존버','개노잼','느그','니애비','앰창','엠생','병맛','븅딱','찐찌버거','응애','딱대','시발','씨발','씨팔','시팔','씨빨','시빨','쓰발','쓰벌','씨벌','시벌','십알','씹','ㅅㅂ','ㅆㅂ','ㅅㅃ','ㅆㅃ','ㅅ발','시ㅂ','씨ㅂ','슈발','수발럼',
  '병신','븅신','빙신','병쉰','ㅂㅅ','ㅄ','븅','존나','졸라','존내','졸래','ㅈㄴ','좆','좃','ㅈ같','지랄','ㅈㄹ','지럴','염병','옘병','ㅇㅂ',
  '개새','개색','개세','개쉐','개섀','개샛','새끼','색끼','섀끼','쌔끼','ㅅㄲ','개같','개년','개놈','개소리','개빡','개좆','개씹',
  '미친','미칀','미췬','ㅁㅊ','또라이','돌아이','도라이','ㄸㄹㅇ','꺼져','닥쳐','닥치','ㄲㅈ','ㄷㅊ','엿먹','엠창','니애미','니미','느금','니엄','애미','애비','에미','애자',
  '찐따','장애인','등신','멍청','바보','쪼다','머저리','빡대가리','대가리','돼지새','뒤져','뒤지','죽어','죽을래','죽여','자살','꺼지',
  '썅','쌍놈','쌍년','년아','놈아','니가뭔데','패드립','섹스','야동','젖꼭','sexy','엉덩이','변태','성기','일베','틀딱','한남','김치녀','메갈','급식충','맘충','충새끼',
  'tlqkf','tlqk','qudtls','whssk','wlfkf','rotoRl','rotori','ehfdk','ckwl','alcls','tq'];
var BAD_EN = ['sibal','ssibal','shibal','sibbal','byungsin','byeongsin','jonna','jonnna','gaesaekki','gaesaeki','michin','jiral','fuck','fuk','fck','phuck','fvck','shit','sh1t','bitch','biatch','b1tch','asshole','bastard','cunt','motherf','dickhead','nigg','whore','slut','pussy','retard','faggot','bullshit','jackass','wanker','twat','douche','stfu','wtf','porn','penis','vagina','boob'];
var BAD_EN_WORD = ['ass','dick','damn','hell','crap','sex','idiot','stupid','dumb','loser','ugly','shut up','kill','die','gay','fat','moron','suck','sucks','screw'];
function E_bannedList(db){ return (db.banned || []).map(function(b){ return E_str(b['금지어']); }).filter(String); }
function E_norm(t){
  return String(t || '').toLowerCase()
    .replace(/[@4]/g,'a').replace(/[$5]/g,'s').replace(/0/g,'o').replace(/[1!|]/g,'i').replace(/3/g,'e').replace(/7/g,'t')
    .replace(/[^a-z가-힣ㄱ-ㅎㅏ-ㅣ]/g,'');
}
function E_bad(text, extra){
  var raw = String(text || ''), n = E_norm(raw), rawLower = raw.toLowerCase(), ko = n.replace(/[a-z]/g,'');
  var list = BAD_KO.concat(BAD_EN).concat(extra || []);
  for (var i = 0; i < list.length; i++){ var w = E_norm(list[i]); if (!w) continue;
    if (n.indexOf(w) >= 0 || ko.indexOf(w) >= 0) return true; }
  var words = rawLower.replace(/[@4]/g,'a').replace(/[$5]/g,'s').replace(/0/g,'o').replace(/[1!]/g,'i').replace(/3/g,'e').replace(/[^a-z\s]/g,' ');
  for (var j = 0; j < BAD_EN_WORD.length; j++){
    if (new RegExp('(^|\\s)' + BAD_EN_WORD[j] + '(\\s|$)').test(words)) return true;
  }
  return false;
}

/* ---------- 편지 / 댓글 ---------- */
function E_letter(db, req, now){
  var u = E_findUser(db, req.name, req.pw), text = E_str(req.text), writer = E_str(req.writer) || E_str(u['이름']), teacher = E_str(req.teacher);
  if (!teacher) throw new Error('받는 선생님 이름을 써 줘! ✏️');
  if (Array.from(text).length < 10) throw new Error('편지를 조금만 더 길게 써 줄래? (10글자 이상) ✏️');
  if (Array.from(text).length > 600) throw new Error('편지가 너무 길어요! 600글자까지만 써 줘.');
  if (E_bad(text + ' ' + writer + ' ' + teacher, E_bannedList(db))) throw new Error('고운 말로 다시 써 줄래? 🙏');
  var sent = db.letters.filter(function(l){ return E_isMe(l,u); }).length;
  var reward = sent < LETTER_MAX ? LETTER_POINTS : 0;
  if (reward) { u['포인트'] = E_num(u['포인트']) + reward; E_mark(u,'포인트'); }
  var row = {'선생님':teacher,'학생 이름':E_str(u['이름']),'내용':text,'학년':E_str(u['학년']),'시간':now,'편지에 쓴 이름':writer,'명단 담임':E_str(u['담임']),'지급포인트':reward,'학생코드':E_key(u)};
  db.letters.push(row); (db.newLetters = db.newLetters || []).push(row);
  return { reward: reward, writer: writer, teacher: teacher };
}
function E_comment(db, req, now){
  var u = E_findUser(db, req.name, req.pw), text = E_str(req.text).replace(/\s+/g,' ');
  if (Array.from(text).length < 2) throw new Error('댓글을 써 줘!');
  if (Array.from(text).length > 100) throw new Error('댓글은 100글자까지만 쓸 수 있어요!');
  var mine = db.comments.filter(function(c){ return E_isMe(c,u) && E_str(c['상태']) !== '자동삭제'; }).length;
  var bad = E_bad(text, E_bannedList(db));
  if (!bad && mine >= COMMENT_MAX) throw new Error('댓글은 한 사람당 ' + COMMENT_MAX + '개까지 쓸 수 있어요!');
  var reward = (!bad && mine === 0) ? COMMENT_POINTS : 0;
  if (reward) { u['포인트'] = E_num(u['포인트']) + reward; E_mark(u,'포인트'); }
  var row = {'시간':now,'학년':E_str(u['학년']),'이름':E_str(u['이름']),'내용':text,'상태':bad ? '자동삭제' : '','지급포인트':reward,'학생코드':E_key(u)};
  db.comments.push(row); (db.newComments = db.newComments || []).push(row);
  return bad ? { bad: true, msg: '나쁜 말이 있어서 댓글이 바로 지워졌어요 🧹 고운 말로 다시 써 줘!' } : { bad: false, reward: reward };
}

/* ---------- 재고: 초기재고 / 현재고(자동) / 당일판매수량 / 당일재고(자동) ---------- */
function E_seedItems(){ return SEED.items.map(function(r){ var o = {}; SEED_ITEM_COLS.forEach(function(k,i){ o[k] = r[i] === undefined ? '' : r[i]; });
  o['초기재고'] = o['재고']; o['현재고'] = o['재고']; o['당일판매수량'] = ''; o['당일재고'] = o['재고'];
  return HEADERS.items.map(function(k){ return o[k] === undefined ? '' : o[k]; }); }); }
function E_day(t){ return E_str(t).slice(0,5); }   // '12/17 10:00:00' → '12/17'
function E_sold(db, id, today){
  if (!db._soldAll || db._soldN !== db.orders.length) {
    db._soldAll = {}; db._soldDay = {}; db._soldN = db.orders.length;
    db.orders.forEach(function(o){ var k = E_str(o['상품ID']), q = E_num(o['수량']);
      db._soldAll[k] = (db._soldAll[k] || 0) + q;
      if (E_day(o['시간']) === db.today) db._soldDay[k] = (db._soldDay[k] || 0) + q; });
  }
  return (today ? db._soldDay[id] : db._soldAll[id]) || 0;
}
function E_stock(db, i){
  var id = E_str(i['ID']), init = E_num(i['초기재고']), cur = Math.max(0, init - E_sold(db, id));
  var q = E_str(i['당일판매수량']);
  if (q === '') return { init: init, cur: cur, day: cur, base: init };
  var day = Math.max(0, Math.min(E_num(q) - E_sold(db, id, db.today), cur));
  return { init: init, cur: cur, day: day, base: E_num(q) };
}

/* ---------- 인기 상품 TOP 3 (참가권 제외, 팔린 수량 순) ---------- */
function E_popular(db){
  var cnt = {};
  db.orders.forEach(function(o){ var id = E_str(o['상품ID']); if (!id || id.indexOf('ticket_') === 0) return; cnt[id] = (cnt[id] || 0) + E_num(o['수량']); });
  return Object.keys(cnt).map(function(id){ var it = db.items.filter(function(i){ return E_str(i['ID']) === id; })[0];
      return it && E_onSale(it) ? {id:id, name:E_str(it['이름']), img:E_str(it['이미지']), sold:cnt[id]} : null; })
    .filter(Boolean).sort(function(a,b){ return b.sold - a.sold; }).slice(0,3);
}
