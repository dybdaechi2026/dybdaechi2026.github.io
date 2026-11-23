/* ===== DYB Christmas Market — shared rules (used by the website preview AND the Google Apps Script) ===== */
var HEADERS = {
  items:  ['ID','카테고리','이름','가격','초기재고','현재고','당일판매수량','당일재고','1인최대','이미지','판매','설명'],
  users:  ['이름','비밀번호','포인트','학년','담임'],
  orders: ['지급완료','시간','주문번호','이름','상품ID','상품명','수량','단가','금액','주문후포인트','학생코드'],
  box:    ['등급','상품명','이미지','가중치','남은수량','처음수량'],
  roul:   ['칸','상품명','이미지','남은수량'],
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
    ['ticket_box','참가권','랜덤박스 참가권',1000,100,3,'ticket_box','Y'],
    ['ticket_roul','참가권','룰렛 게임 참가권',1000,100,3,'ticket_roul','Y'],
    ['ticket_rps','참가권','선생님과 가위바위보 참가권',500,100,1,'ticket_rps','Y','선생님과 가위바위보를 해서 이기면 특별 간식 제공!'],
    ['cp_word','쿠폰','단어커트 +5',2500,100,1,'cp_word','Y',''],
    ['cp_oral','쿠폰','구두 면제권',3000,100,1,'cp_oral','Y',''],
    ['cp_hw','쿠폰','한과목 숙제 면제권',4000,100,1,'cp_hw','Y',''],
    ['cp_retest','쿠폰','재시험 면제권',4500,100,1,'cp_retest','Y',''],
    ['snack_a','간식','랜덤 사탕 or 젤리',500,100,'','snack_a','Y','사탕 또는 젤리 중 하나를 랜덤으로 받아요!'],
    ['snack_b','간식','추억의 옛날과자 (짭짤)',1500,100,'','snack_b','Y','짭짤한 옛날과자 중 하나를 랜덤으로 받아요!'],
    ['snack_c','간식','추억의 옛날과자 (달콤)',1500,100,'','snack_c','Y','달콤한 옛날과자 중 하나를 랜덤으로 받아요!'],
    ['charpen','문구','크리스마스 4색 볼펜',5000,100,'','charpen','Y',''],
    ['pencil_rand','문구','랜덤 연필',3000,100,'','pencil_rand','Y','크리스마스 연필 또는 DYB 연필 중 하나를 랜덤으로 받아요!'],
    ['highlighter','문구','형광펜',3000,100,'','highlighter','Y',''],
    ['pouch','문구','수정테이프',4500,100,'','pouch','Y',''],
    ['pen','문구','볼펜',2500,100,'','pen','Y',''],
    ['ring','굿즈','크리스마스 불빛 반지',5000,100,'','ring','Y',''],
    ['squishy','굿즈','크리스마스 스쿼시',4000,100,'','squishy','Y',''],
    ['eraser_gacha','굿즈','랜덤 지우개 뽑기',3000,100,'','eraser_gacha','Y','치이카와 또는 짱구 지우개 중 하나를 랜덤으로 뽑아요!']
  ],
  users: [
    ['김민준','1234',10000,'샘플',''],['이서연','1234',10000,'샘플',''],['박지호','1234',10000,'샘플',''],['최하은','1234',10000,'샘플',''],['정도윤','1234',10000,'샘플',''],
    ['강서윤','1234',10000,'샘플',''],['조예준','1234',10000,'샘플',''],['윤지우','1234',10000,'샘플',''],['장시우','1234',10000,'샘플',''],['임하린','1234',10000,'샘플','']
  ],
  box: [
    ['1등','배달의민족 3만원권','baemin',1,1,1],
    ['2등','크리스마스 불빛 반지','ring',5,100,100],
    ['2등','크리스마스 스쿼시','squishy',5,100,100],
    ['3등','랜덤 지우개 뽑기','eraser_gacha',15,100,100],
    ['3등','크리스마스 4색 볼펜','charpen',15,100,100],
    ['4등','랜덤 사탕 or 젤리','snack_a',59,100,100]
  ],
  roul: [
    [1,'랜덤 사탕 or 젤리','snack_a',100],[2,'추억의 옛날과자 (짭짤)','snack_b',100],[3,'랜덤 연필','pencil_rand',100],
    [4,'추억의 옛날과자 (달콤)','snack_c',100],[5,'형광펜','highlighter',100],[6,'단어커트 +5','cp_word',100]
  ]
};

function E_num(v){ var n = Number(v); return isNaN(n) ? 0 : n; }
function E_str(v){ return v === null || v === undefined ? '' : String(v).trim(); }
function E_mark(o,k){ (o._dirty = o._dirty || []).indexOf(k) < 0 && o._dirty.push(k); }
function E_limit(i){ var l = E_num(i['1인최대']); return E_str(i['카테고리']) === '쿠폰' ? (l > 0 ? Math.min(l,1) : 1) : l; }
function E_onSale(i){ return E_str(i['판매']).toUpperCase() !== 'N' && E_str(i['ID']) !== ''; }

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
  return db.wins.filter(function(w){ return E_isMe(w,u) && E_str(w['게임'])===game; }).length;
}
function E_tickets(db, u){
  return { box: E_bought(db,u,'ticket_box') - E_used(db,u,'랜덤박스'),
           roul: E_bought(db,u,'ticket_roul') - E_used(db,u,'룰렛') };
}
function E_state(db, u){
  var name = E_str(u['이름']);
  return {
    user: { name: name, points: E_num(u['포인트']), tickets: E_tickets(db,u), grade: E_str(u['학년']), teacher: E_str(u['담임']) },
    items: db.items.filter(function(i){ return E_str(i['ID']) !== ''; }).map(function(i){ var id=E_str(i['ID']), st=E_stock(db,i); return { off: !E_onSale(i), prep: E_num(i['가격']) <= 0,
      id:id, cat:E_str(i['카테고리']), name:E_str(i['이름']), price:E_num(i['가격']), stock:st.day, base:st.base,
      limit:E_limit(i), img:E_str(i['이미지']), desc:E_str(i['설명']), mine:E_bought(db,u,id) }; }),
    box: db.box.filter(function(b){ return E_str(b['상품명']); }).map(function(b){ var l = E_num(b['남은수량']); return {grade:E_str(b['등급']), name:E_str(b['상품명']), img:E_str(b['이미지']), left:l, init:Math.max(E_num(b['처음수량']), l)}; }),
    roul: db.roul.filter(function(r){ return E_str(r['상품명']); }).map(function(r){ return {name:E_str(r['상품명']), img:E_str(r['이미지']), left:E_num(r['남은수량'])}; }),
    wins: (function(){ var m = function(w){ return {t:E_str(w['시간']), who:E_who(db,w), nm:E_mask(w['이름']), g:E_gradeOf(db,w), game:E_str(w['게임']), grade:E_str(w['등급']), prize:E_str(w['상품명']), img:E_str(w['이미지'])}; };
      var top = db.wins.filter(function(w){ return E_str(w['등급']) === '1등'; }), rest = db.wins.slice(-60).filter(function(w){ return E_str(w['등급']) !== '1등'; });
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
  var total = 0, lines = [];
  cart.forEach(function(c){
    var it = db.items.filter(function(i){ return E_str(i['ID']) === E_str(c.id) && E_onSale(i); })[0];
    if (!it) throw new Error('지금 팔지 않는 물건이 장바구니에 있어요.');
    if (E_num(it['가격']) <= 0) throw new Error(E_str(it['이름']) + '은(는) 아직 판매 준비 중이에요!');
    var q = Math.floor(E_num(c.qty)), stock = E_stock(db,it).day, lim = E_limit(it);
    if (stock < q) throw new Error(stock <= 0 ? E_str(it['이름']) + '은(는) 오늘 다 팔렸어요!' : E_str(it['이름']) + ' 수량이 부족해요! 조금만 줄여 주세요.');
    if (lim > 0 && E_bought(db,u,E_str(it['ID'])) + q > lim) throw new Error(E_str(it['이름']) + '은(는) 한 사람당 ' + lim + '개까지만 살 수 있어요!');
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
  list.forEach(function(r,i){ if (E_num(r['남은수량']) > 0 && (isRoul || E_num(r['가중치']) > 0)) cand.push(i); });
  if (!cand.length) throw new Error('상품이 모두 소진되었어요. 선생님께 알려 주세요!');
  var idx;
  if (isRoul) idx = cand[Math.floor(rand() * cand.length)];
  else {
    var tw = cand.reduce(function(s,i){ return s + E_num(list[i]['가중치']); }, 0), x = rand() * tw;
    idx = cand[cand.length-1];
    for (var k = 0; k < cand.length; k++){ x -= E_num(list[cand[k]]['가중치']); if (x < 0){ idx = cand[k]; break; } }
  }
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

/* ===== Google Apps Script 부분 (시트와 연결) ===== */

/** 처음 한 번만 실행: 탭과 샘플 데이터를 만들어요. 이미 내용이 있는 탭은 건드리지 않아요. */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var seedFor = { items: E_seedItems(), users: SEED.users, orders: [], box: SEED.box, roul: SEED.roul, wins: [], letters: [], comments: [], banned: [] };
  var colors = { items:'#e5403a', users:'#1f7a4d', orders:'#b50005', box:'#ffc83d', roul:'#2fa36b', wins:'#7cc8ff', letters:'#ff8fab', comments:'#9575cd', banned:'#616161' };
  Object.keys(TAB_NAMES).forEach(function(k){
    var sh = ss.getSheetByName(TAB_NAMES[k]) || ss.insertSheet(TAB_NAMES[k]);
    if (sh.getLastRow() > 0) { if (k === 'items') migrateStock_(sh); if (k === 'letters' || k === 'items' || k === 'orders' || k === 'wins') reorderCols_(sh, HEADERS[k]); ensureCols_(sh, HEADERS[k]); return; }
    var h = HEADERS[k];
    sh.getRange(1,1,1,h.length).setValues([h]).setFontWeight('bold').setBackground(colors[k]).setFontColor(k==='box'?'#3a2420':'#ffffff');
    sh.setFrozenRows(1);
    if (k === 'users') sh.getRange('B:B').setNumberFormat('@');
    var rows = seedFor[k];
    if (rows.length) sh.getRange(2,1,rows.length,h.length).setValues(rows.map(function(r){ var o = r.slice(0, h.length); while (o.length < h.length) o.push(''); return o; }));
    sh.autoResizeColumns(1, h.length);
  });
  setupRosters_();
  migrate_(ss);
  var first = ss.getSheetByName('시트1') || ss.getSheetByName('Sheet1');
  if (first && first.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(first);
  SpreadsheetApp.getUi && SpreadsheetApp.flush();
}

function loadDB_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), db = { _sh:{}, _hdr:{}, newOrders:[], newWins:[], today: Utilities.formatDate(new Date(), 'Asia/Seoul', 'MM/dd') };
  Object.keys(TAB_NAMES).forEach(function(k){
    var sh = ss.getSheetByName(TAB_NAMES[k]);
    if (!sh) { setup(); sh = ss.getSheetByName(TAB_NAMES[k]); }
    if (!sh) throw new Error('"' + TAB_NAMES[k] + '" 탭이 없어요. setup을 먼저 실행해 주세요.');
    var vals = sh.getDataRange().getValues(), h = vals[0].map(function(x){ return String(x).trim(); });
    db._sh[k] = sh; db._hdr[k] = h;
    db[k] = vals.slice(1).map(function(r, i){
      var o = { _r: i + 2 }; h.forEach(function(name, j){ var v = r[j]; o[name] = (v instanceof Date) ? Utilities.formatDate(v, 'Asia/Seoul', 'MM/dd HH:mm:ss') : v; }); return o;
    }).filter(function(o){ return h.some(function(name){ return name !== '지급완료' && o[name] !== '' && o[name] !== null; }); });
  });
  try { db.pools = loadPools_(ss); } catch (x) { db.pools = {}; }
  // 랜덤박스 '처음수량'이 비어 있으면 지금 남은수량으로 채워요 (재고 퍼센트 계산용)
  db.box.forEach(function(b){ if (E_str(b['처음수량']) === '' && E_str(b['상품명'])) { b['처음수량'] = E_num(b['남은수량']); var c = db._hdr.box.indexOf('처음수량') + 1; if (c > 0) db._sh.box.getRange(b._r, c).setValue(b['처음수량']); } });
  return db;
}

function saveDB_(db) {
  ['items','users','box','roul'].forEach(function(k){
    db[k].forEach(function(o){
      (o._dirty || []).forEach(function(name){
        var c = db._hdr[k].indexOf(name) + 1;
        if (c > 0) db._sh[k].getRange(o._r, c).setValue(o[name]);
      });
    });
  });
  [['orders', db.newOrders], ['wins', db.newWins], ['letters', db.newLetters], ['comments', db.newComments]].forEach(function(p){
    var k = p[0], rows = p[1] || [];
    if (!rows.length) return;
    var h = db._hdr[k], sh = db._sh[k], start = sh.getLastRow() + 1, tc = h.indexOf('시간') + 1;
    if (tc > 0) sh.getRange(start, tc, rows.length, 1).setNumberFormat('@');
    var pc = h.indexOf('지급완료') + 1;
    if (pc > 0) { var cb = sh.getRange(start, pc, rows.length, 1); cb.insertCheckboxes(); rows.forEach(function(o){ o['지급완료'] = false; }); }
    sh.getRange(start, 1, rows.length, h.length).setValues(rows.map(function(o){ return h.map(function(name){ return o[name] === undefined ? '' : o[name]; }); }));
  });
  SpreadsheetApp.flush();
}

function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function doGet() { return json_({ ok: true, msg: 'DYB Christmas Market 연결 성공! 🎄' }); }

function doPost(e) {
  var req;
  try { req = JSON.parse(e.postData.contents); } catch (x) { return json_({ ok:false, err:'잘못된 요청이에요.' }); }
  var write = ['order','play','letter','comment'].indexOf(req.action) >= 0;
  var lock = LockService.getScriptLock();
  try {
    if (write) lock.waitLock(25000);
    var db = loadDB_(), now = Utilities.formatDate(new Date(), 'Asia/Seoul', 'MM/dd HH:mm:ss'), res = { ok: true };
    try { var P = PropertiesService.getScriptProperties(); if (P.getProperty('stockDay') !== db.today) { writeStock_(db); P.setProperty('stockDay', db.today); } } catch (x) {}
    if (req.action === 'login' || req.action === 'state') {
      res.state = E_state(db, E_findUser(db, req.name, req.pw));
    } else if (req.action === 'order') {
      res.result = E_order(db, req, now); saveDB_(db); writeStock_(db);
      res.state = E_state(db, E_findUser(db, req.name, req.pw));
    } else if (req.action === 'play') {
      res.result = E_play(db, req, now, Math.random); saveDB_(db);
      res.state = E_state(db, E_findUser(db, req.name, req.pw));
    } else if (req.action === 'letter') {
      res.result = E_letter(db, req, now); saveDB_(db);
      res.state = E_state(db, E_findUser(db, req.name, req.pw));
    } else if (req.action === 'comment') {
      res.result = E_comment(db, req, now); saveDB_(db);
      res.state = E_state(db, E_findUser(db, req.name, req.pw));
    } else throw new Error('알 수 없는 요청이에요.');
    return json_(res);
  } catch (err) {
    return json_({ ok:false, err: String(err && err.message || err) });
  } finally {
    if (write) { try { lock.releaseLock(); } catch (x) {} }
  }
}

/** 기존 탭에 새 제목 칸이 없으면 맨 오른쪽에 추가해요 (데이터는 그대로). */
function ensureCols_(sh, want) {
  var lc = Math.max(sh.getLastColumn(), 1);
  var h = sh.getRange(1,1,1,lc).getValues()[0].map(function(x){ return String(x).trim(); });
  want.forEach(function(name){
    if (h.indexOf(name) < 0) { h.push(name); sh.getRange(1, h.length).setValue(name).setFontWeight('bold'); }
  });
  return h;
}

/** 탭의 칸 순서를 원하는 제목 순서로 바꿔요 (데이터는 제목을 따라 함께 옮겨져요). */
function reorderCols_(sh, want) {
  var lr = sh.getLastRow(), lc = sh.getLastColumn(); if (lr < 1 || lc < 1) return;
  var v = sh.getRange(1,1,lr,lc).getValues(), h = v[0].map(function(x){ return String(x).trim(); });
  if (h['이름'] === undefined && h.indexOf('이름') >= 0 && want.indexOf('학생 이름') >= 0) h[h.indexOf('이름')] = '학생 이름';
  if (h.indexOf('담임') >= 0 && want.indexOf('명단 담임') >= 0) h[h.indexOf('담임')] = '명단 담임';
  var order = want.concat(h.filter(function(x){ return x && want.indexOf(x) < 0; }));
  if (order.join('|') === h.join('|')) return;
  var out = [order].concat(v.slice(1).map(function(r){ return order.map(function(name){ var i = h.indexOf(name); return i >= 0 ? r[i] : ''; }); }));
  sh.getRange(1,1,lr,Math.max(lc, order.length)).clearContent();
  sh.getRange(1,1,out.length,order.length).setValues(out);
}

/** 이미 쓰던 시트를 새 규칙에 맞게 고쳐요 (여러 번 실행해도 안전해요). */
function migrate_(ss) {
  // 1) 스페셜 메뉴(떡볶이·돌려돌려 랜덤 룰렛) 물품 삭제
  var it = ss.getSheetByName(TAB_NAMES.items);
  if (it && it.getLastRow() > 1) {
    var h = it.getRange(1,1,1,it.getLastColumn()).getValues()[0].map(function(x){ return String(x).trim(); });
    var ic = h.indexOf('ID'), cc = h.indexOf('카테고리');
    var v = it.getRange(2,1,it.getLastRow()-1,h.length).getValues();
    for (var i = v.length - 1; i >= 0; i--) {
      var id = String(v[i][ic]).trim();
      if (id === 'tteok' || id === 'roulette' || String(v[i][cc]).trim() === '스페셜') it.deleteRow(i + 2);
    }
    // 2) 가위바위보 참가권 추가 (없을 때만), 룰렛 참가권 바로 아래에
    v = it.getLastRow() > 1 ? it.getRange(2,1,it.getLastRow()-1,h.length).getValues() : [];
    var ids = v.map(function(r){ return String(r[ic]).trim(); });
    if (ids.indexOf('ticket_rps') < 0) {
      var seed = E_seedItems().filter(function(r){ return r[0] === 'ticket_rps'; })[0];
      var row = h.map(function(name){ var j = HEADERS.items.indexOf(name); return j >= 0 && seed[j] !== undefined ? seed[j] : ''; });
      var at = ids.indexOf('ticket_roul'); at = at >= 0 ? at + 2 : 1;
      it.insertRowAfter(at); it.getRange(at + 1, 1, 1, h.length).setValues([row]);
    }
  }
  // 3) 룰렛 칸의 떡볶이 → 감자알칩
  var ro = ss.getSheetByName(TAB_NAMES.roul);
  if (ro && ro.getLastRow() > 1) {
    var rh = ro.getRange(1,1,1,ro.getLastColumn()).getValues()[0].map(function(x){ return String(x).trim(); });
    var nc = rh.indexOf('상품명'), mc = rh.indexOf('이미지');
    var rv = ro.getRange(2,1,ro.getLastRow()-1,rh.length).getValues();
    rv.forEach(function(r, i){ if (String(r[nc]).trim() === '떡볶이') { ro.getRange(i+2, nc+1).setValue('감자알칩'); if (mc >= 0) ro.getRange(i+2, mc+1).setValue('potato'); } });
  }
}

/** 물품 탭의 현재고·당일재고 칸을 계산해서 채워요 (바뀐 칸만 씀). */
function writeStock_(db) {
  var h = db._hdr.items, sh = db._sh.items, cc = h.indexOf('현재고') + 1, dc = h.indexOf('당일재고') + 1;
  if (!cc || !dc) return;
  db.items.forEach(function(i){
    if (!E_str(i['ID'])) return;
    var st = E_stock(db, i);
    if (E_num(i['현재고']) !== st.cur || E_str(i['현재고']) === '') { sh.getRange(i._r, cc).setValue(st.cur); i['현재고'] = st.cur; }
    if (E_num(i['당일재고']) !== st.day || E_str(i['당일재고']) === '') { sh.getRange(i._r, dc).setValue(st.day); i['당일재고'] = st.day; }
  });
}
/** 메뉴/편집 시 재고 다시 계산 */
function 재고반영() { var db = loadDB_(); writeStock_(db); SpreadsheetApp.flush(); }

/** 예전 '재고' 칸 → 초기재고(100)·현재고·당일판매수량·당일재고 칸으로 나눠요 (한 번만). */
function migrateStock_(sh) {
  var lc = sh.getLastColumn(); if (lc < 1) return;
  var h = sh.getRange(1,1,1,lc).getValues()[0].map(function(x){ return String(x).trim(); });
  if (h.indexOf('초기재고') >= 0) return;
  if (sh.getMaxRows() > 1) sh.getRange(2, 1, sh.getMaxRows() - 1, sh.getMaxColumns()).clearDataValidations();
  var oc = h.indexOf('재고');
  if (oc >= 0) sh.getRange(1, oc + 1).setValue('현재고');
  ['초기재고','당일판매수량','당일재고'].forEach(function(name){ lc++; sh.getRange(1, lc).setValue(name); });
  var n = sh.getLastRow() - 1;
  if (n > 0) {
    var ic = h.indexOf('ID') + 1, ids = sh.getRange(2, ic, n, 1).getValues();
    var initCol = lc - 2;
    sh.getRange(2, initCol, n, 1).setValues(ids.map(function(r){ return [String(r[0]).trim() ? 100 : '']; }));
  }
}

/** [물품 구매] 탭에서 랜덤 지급 물품의 구성(무엇이 들어있는지)을 읽어요. */
function loadPools_(ss) {
  var sh = ss.getSheetByName(BUY_TAB), out = {};
  if (!sh || sh.getLastRow() < 4) return out;
  var h = sh.getRange(3,1,1,Math.max(sh.getLastColumn(),2)).getValues()[0].map(function(x){ return String(x).trim(); });
  var nc = h.indexOf('물품'), cc = h.indexOf('카테고리'); if (nc < 0 || cc < 0) return out;
  sh.getRange(4,1,sh.getLastRow()-3,h.length).getValues().forEach(function(r){
    var nm = String(r[nc]).trim(), cat = String(r[cc]).trim(), target = BUY_POOL[cat];
    if (!nm || !target) return;
    var label = (/미정/.test(nm) && /과자/.test(cat)) ? cat : nm;
    out[target] = out[target] || [];
    if (out[target].indexOf(label) < 0) out[target].push(label);
  });
  return out;
}

/* ===== 학년 명단 (다른 선생님들이 입력) → 학생 탭 자동 반영 ===== */
var ROSTERS = [{tab:'4학년 명단', grade:'4학년', color:'#ff8a65'}, {tab:'5학년 명단', grade:'5학년', color:'#4fc3f7'}, {tab:'6학년 명단', grade:'6학년', color:'#ba68c8'}];
var R_HDR = ['담임선생님','이름','포인트','초대장 번호','남은 포인트','상태','반영포인트'];
var R_IN = 3;   // A~C: 선생님이 입력하는 칸

function setupRosters_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ROSTERS.forEach(function(R){
    var sh = ss.getSheetByName(R.tab);
    if (!sh) sh = ss.insertSheet(R.tab);
    if (sh.getLastRow() === 0) sh.getRange(1,1,1,R_HDR.length).setValues([R_HDR]);
    styleRoster_(sh, R);
  });
}

function styleRoster_(sh, R) {
  var rows = Math.max(sh.getMaxRows() - 1, 1);
  if (sh.getMaxRows() < 101) sh.insertRowsAfter(sh.getMaxRows(), 101 - sh.getMaxRows());
  rows = sh.getMaxRows() - 1;
  sh.setTabColor(R.color); sh.setFrozenRows(1);
  sh.getRange(1,1,1,R_IN).setBackground(R.color).setFontColor('#ffffff');
  sh.getRange(1,R_IN+1,1,R_HDR.length-R_IN).setBackground('#9e9e9e').setFontColor('#ffffff');
  sh.getRange(1,1,1,R_HDR.length).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  sh.setRowHeight(1, 34);
  [130,120,100,120,110,170,90].forEach(function(w,i){ sh.setColumnWidth(i+1, w); });
  sh.getRange(2,1,rows,R_HDR.length).setHorizontalAlignment('center').setVerticalAlignment('middle');
  sh.getRange(2,R_IN+1,rows,R_HDR.length-R_IN).setBackground('#f3f3f3').setFontColor('#555555');
  sh.getRange(2,3,rows,1).setNumberFormat('#,##0').setDataValidation(
    SpreadsheetApp.newDataValidation().requireNumberGreaterThanOrEqualTo(0).setAllowInvalid(false).setHelpText('포인트는 숫자만 넣어 주세요').build());
  sh.getRange(2,4,rows,1).setNumberFormat('@').setFontWeight('bold').setFontColor('#b50005');
  sh.getRange(2,5,rows,1).setNumberFormat('#,##0');
  var notes = ['담임선생님 이름','학생 이름 (같은 반에 같은 이름이 있으면 김민준A 처럼 구분해 주세요)',
    '줄 포인트. 나중에 숫자를 올리면 그만큼 추가로 지급돼요 (내리면 그만큼 빠져요)',
    '자동으로 만들어져요 (DYB+숫자 5자리). 학생에게 알려 주세요!','학생이 지금 가지고 있는 포인트 (자동)','자동','자동 (건드리지 마세요)'];
  notes.forEach(function(n,i){ sh.getRange(1,i+1).setNote(n); });
  sh.hideColumns(7);
  if (!sh.getFilter()) sh.getRange(1,1,sh.getMaxRows(),R_HDR.length-1).createFilter();
  sh.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(function(p){ if (p.getDescription()==='자동 칸') p.remove(); });
  sh.getRange(1,R_IN+1,sh.getMaxRows(),R_HDR.length-R_IN).protect().setDescription('자동 칸').setWarningOnly(true);
  sh.getRange(1,1,1,R_IN).protect().setDescription('자동 칸').setWarningOnly(true);
}

function newCode_(used) {
  var c;
  do { c = 'DYB' + ('0000' + Math.floor(Math.random() * 100000)).slice(-5); } while (used[c]);
  used[c] = true; return c;
}

/** 4·5·6학년 명단을 학생 탭에 반영해요. 명단을 고치면 자동으로 실행돼요. */
function 명단반영() {
  var lock = LockService.getScriptLock();
  try { lock.waitLock(25000); } catch (x) { return; }
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var us = ss.getSheetByName(TAB_NAMES.users); if (!us) { setup(); us = ss.getSheetByName(TAB_NAMES.users); }
    var uh = ensureCols_(us, HEADERS.users);
    var ci = function(n){ return uh.indexOf(n); };
    var uv = us.getLastRow() > 1 ? us.getRange(2,1,us.getLastRow()-1,uh.length).getValues() : [];
    var used = {}, byCode = {};
    uv.forEach(function(r,i){ var c = E_pw(r[ci('비밀번호')]); if (c) { used[c] = true; byCode[c] = i; } });
    var added = [], usersChanged = false, seen = {};
    var gradeSet = {}; ROSTERS.forEach(function(R){ gradeSet[R.grade] = true; });

    ROSTERS.forEach(function(R){
      var sh = ss.getSheetByName(R.tab); if (!sh || sh.getLastRow() < 2) return;
      var n = sh.getLastRow() - 1, vals = sh.getRange(2,1,n,R_HDR.length).getValues(), out = [];
      vals.forEach(function(r){
        var teacher = E_str(r[0]), name = E_str(r[1]), ptsRaw = r[2], code = E_pw(r[3]), applied = r[6];
        if (!name) { out.push(['', '', (teacher || ptsRaw !== '') ? '⏳ 이름을 넣어 주세요' : '', '']); return; }
        if (ptsRaw !== '' && isNaN(Number(ptsRaw))) { out.push([code, r[4], '⚠️ 포인트는 숫자만!', applied]); return; }
        var pts = E_num(ptsRaw), row;
        if (code && byCode[code] !== undefined) {
          row = uv[byCode[code]];
          if (E_str(row[ci('이름')]) !== name) { row[ci('이름')] = name; usersChanged = true; }
          if (E_str(row[ci('학년')]) !== R.grade) { row[ci('학년')] = R.grade; usersChanged = true; }
          if (E_str(row[ci('담임')]) !== teacher) { row[ci('담임')] = teacher; usersChanged = true; }
          var delta = pts - E_num(applied);
          if (applied !== '' && delta !== 0) { row[ci('포인트')] = E_num(row[ci('포인트')]) + delta; usersChanged = true; }
          if (applied === '') { /* 예전에 이어진 줄: 지금 값을 기준으로 삼아요 */ }
          seen[code] = true;
          out.push([code, E_num(row[ci('포인트')]), '✅ 등록됨', pts]);
        } else {
          if (!code) code = newCode_(used); else used[code] = true;
          row = uh.map(function(){ return ''; });
          row[ci('이름')] = name; row[ci('비밀번호')] = code; row[ci('포인트')] = pts; row[ci('학년')] = R.grade; row[ci('담임')] = teacher;
          uv.push(row); byCode[code] = uv.length - 1; added.push(row); usersChanged = true;
          seen[code] = true;
          out.push([code, pts, '✅ 등록됨', pts]);
        }
      });
      sh.getRange(2, R_IN+1, n, R_HDR.length-R_IN).setValues(out);
    });

    // 명단에서 지워진 학생(이름을 지웠거나 줄을 삭제함)은 학생 탭에서도 빼요. 샘플·직접 넣은 학생은 그대로 둬요.
    var oldLen = uv.length;
    var kept = uv.filter(function(r){ return !(gradeSet[E_str(r[ci('학년')])] && !seen[E_pw(r[ci('비밀번호')])]); });
    if (kept.length !== oldLen) usersChanged = true;
    if (usersChanged) {
      if (oldLen) us.getRange(2,1,oldLen,uh.length).clearContent();
      if (kept.length) {
        us.getRange(2,1,kept.length,uh.length).setValues(kept);
        us.getRange(2, ci('비밀번호')+1, kept.length, 1).setNumberFormat('@');
      }
    }
    SpreadsheetApp.flush();
    return added.length;
  } finally { try { lock.releaseLock(); } catch (x) {} }
}

/** 줄 삭제처럼 onEdit이 못 잡는 변화도 반영 (꾸미기 실행 시 자동 설치) */
function onChangeSync(e) { if (e && e.changeType === 'EDIT') return; try { 명단반영(); } catch (x) {} }
function installTriggers_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ts = ScriptApp.getProjectTriggers();
  if (!ts.some(function(t){ return t.getHandlerFunction() === 'onChangeSync'; })) ScriptApp.newTrigger('onChangeSync').forSpreadsheet(ss).onChange().create();
  // 시트 주인 권한으로 실행돼서, 잠긴 탭이 있어도 다른 선생님이 명단을 고치면 반영돼요
  if (!ts.some(function(t){ return t.getHandlerFunction() === 'onEditSync'; })) ScriptApp.newTrigger('onEditSync').forSpreadsheet(ss).onEdit().create();
}

/** 명단 탭에서 이름·포인트를 고치면 자동 반영 */
function onEditSync(e) {
  try {
    var sh = e && e.range && e.range.getSheet(); if (!sh) return;
    var isRoster = ROSTERS.some(function(R){ return R.tab === sh.getName(); });
    if (isRoster && e.range.getColumn() <= R_IN) 명단반영();
    if (sh.getName() === TAB_NAMES.items) 재고반영();
  } catch (x) {}
}

/** 시트를 열면 위쪽에 '🎄 마켓 관리' 메뉴가 생겨요 */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('🎄 마켓 관리')
    .addItem('명단 → 학생 탭 반영하기 (남은 포인트 새로고침)', '명단반영')
    .addItem('재고 다시 계산하기', '재고반영')
    .addItem('물품 구매 탭 만들기/정리하기', '물품구매시트')
    .addItem('★ 새 물품 목록 적용 (물품·물품 구매·경품)', '새물품목록적용')
    .addSeparator()
    .addItem('지금 탭: 이름순 정렬 (가나다)', '이름순정렬')
    .addItem('지금 탭: 선생님 → 이름순 정렬 (명단·편지)', '담임순정렬')
    .addItem('지금 탭: 포인트 많은 순 정렬', '포인트순정렬')
    .addSeparator()
    .addItem('시트 꾸미기', '꾸미기')
    .addToUi();
}
function sortActive_(spec) {
  var sh = SpreadsheetApp.getActiveSheet(), name = sh.getName();
  var h = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(function(x){ return String(x).trim(); });
  if (sh.getLastRow() < 3) return;
  var cols = spec.map(function(s){ var c = h.indexOf(s[0]) + 1; return c ? {column:c, ascending:s[1]} : null; }).filter(Boolean);
  if (!cols.length) { SpreadsheetApp.getUi().alert('"' + name + '" 탭에는 정렬할 칸이 없어요.'); return; }
  sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).sort(cols);
}
function 이름순정렬() { sortActive_([['이름',true]]); }
function 담임순정렬() { sortActive_([['담임선생님',true],['선생님',true],['담임',true],['이름',true],['학생 이름',true]]); }
function 포인트순정렬() { sortActive_([['남은 포인트',false],['포인트',false]]); }

/* ===== 시트 꾸미기: 데이터는 그대로 두고 모양·입력 규칙만 정리해요. 여러 번 실행해도 괜찮아요. ===== */
function 꾸미기() {
  setup();
  try { installTriggers_(); } catch (x) {}
  명단반영();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var NOTES = {
    items: {'ID':'사이트가 물건을 구분하는 이름표예요. 이미 팔린 물건은 바꾸지 마세요!','카테고리':'참가권 / 쿠폰 / 간식 / 문구 / 굿즈 중 하나','설명':'적어 두면 사이트 물건 이름 옆에 ? 버튼이 생기고, 누르면 이 설명이 보여요','초기재고':'처음 준비한 전체 수량 (직접 입력)','현재고':'자동: 초기재고 − 지금까지 팔린 수량','당일판매수량':'오늘 팔 수량 (직접 입력). 비워 두면 현재고만큼 팔아요','당일재고':'자동: 당일판매수량 − 오늘 팔린 수량. 사이트에는 이 숫자로 남은 정도가 보여요','이름':'사이트에 보이는 물건 이름','가격':'숫자만 (예: 3000)','1인최대':'한 사람이 살 수 있는 최대 개수. 비워 두면 제한 없음','이미지':'사진 파일 이름 (보통 ID와 같아요)','판매':'Y = 판매 / N = 사이트에서 숨기기'},
    users: {'이름':'학생이 입장할 때 쓰는 이름. 같은 이름 두 명은 안 돼요!','비밀번호':'초대장 번호','포인트':'남은 포인트. 주문하면 자동으로 줄어요'},
    box:   {'등급':'1등, 2등 …','가중치':'숫자가 클수록 잘 나와요 (확률)','남은수량':'0이 되면 더 이상 안 나와요'},
    roul:  {'칸':'룰렛 칸 번호 (순서)','남은수량':'0이 되면 회색 칸이 되고 안 나와요'},
    orders:{'주문번호':'학생이 선생님께 보여주는 번호'},
    wins:  {},
    letters: {'선생님':'학생이 직접 쓴 받는 선생님 이름 (▼ 필터로 내 이름만 골라 보세요)','학생 이름':'편지를 쓴 학생 (로그인 이름)','내용':'편지 내용','지급포인트':'편지로 받은 포인트'},
    comments: {'상태':'"숨김"이라고 쓰면 사이트에서 사라져요. "자동삭제"는 비속어로 자동으로 지워진 댓글이에요'},
    banned: {'금지어':'여기에 단어를 추가하면 그 단어가 들어간 댓글·편지는 막혀요 (한 칸에 한 단어)'}
  };
  var THEME = {
    items:{head:'#e5403a',band:'#fff1ef',tab:'#e5403a'}, users:{head:'#1f7a4d',band:'#eefbf2',tab:'#1f7a4d'},
    orders:{head:'#b50005',band:'#fff6f0',tab:'#b50005'}, box:{head:'#ffc83d',band:'#fff9e3',tab:'#ffc83d'},
    roul:{head:'#2fa36b',band:'#effaf3',tab:'#2fa36b'}, wins:{head:'#3a8dde',band:'#eef6ff',tab:'#3a8dde'},
    letters:{head:'#ff8fab',band:'#fff0f4',tab:'#ff8fab'}, comments:{head:'#9575cd',band:'#f4f0fb',tab:'#9575cd'}, banned:{head:'#616161',band:'#f5f5f5',tab:'#616161'}
  };
  var WIDTH = {'ID':110,'카테고리':80,'이름':170,'가격':90,'초기재고':80,'현재고':80,'당일판매수량':100,'당일재고':80,'1인최대':70,'이미지':100,'판매':60,'비밀번호':90,'포인트':100,
    '시간':120,'주문번호':100,'상품ID':100,'상품명':170,'수량':60,'단가':80,'금액':90,'주문후포인트':110,'등급':60,'가중치':70,'남은수량':80,'칸':50,'게임':80};
  var money = '#,##0"원"', count = '#,##0"개"';

  Object.keys(TAB_NAMES).forEach(function(k){
    var sh = ss.getSheetByName(TAB_NAMES[k]); if (!sh) return;
    var h = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(function(x){ return String(x).trim(); });
    var n = h.length, rows = Math.max(sh.getMaxRows()-1, 1), t = THEME[k] || {head:'#757575',band:'#f5f5f5',tab:'#757575'};
    var col = function(name){ return h.indexOf(name) + 1; };
    var body = function(name){ var c = col(name); return c ? sh.getRange(2, c, rows, 1) : null; };
    sh.getRange(2,1,rows,sh.getMaxColumns()).clearDataValidations();

    sh.setTabColor(t.tab);
    sh.setFrozenRows(1);
    if (k === 'users' || k === 'items') sh.setFrozenColumns(k === 'items' ? 3 : 1);
    var head = sh.getRange(1,1,1,n);
    head.setBackground(t.head).setFontColor(k==='box' ? '#3a2420' : '#ffffff').setFontWeight('bold')
        .setHorizontalAlignment('center').setVerticalAlignment('middle').setFontSize(11);
    sh.setRowHeight(1, 34);
    sh.getRange(2,1,rows,n).setVerticalAlignment('middle').setFontSize(11);
    h.forEach(function(name, i){
      if (WIDTH[name]) sh.setColumnWidth(i+1, WIDTH[name]);
      var note = (NOTES[k]||{})[name]; if (note) sh.getRange(1,i+1).setNote(note);
      if (['이름','상품명'].indexOf(name) < 0) sh.getRange(2,i+1,rows,1).setHorizontalAlignment('center');
    });

    // banding
    sh.getBandings().forEach(function(b){ b.remove(); });
    sh.getRange(1,1,sh.getMaxRows(),n).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false)
      .setHeaderRowColor(t.head).setFirstRowColor('#ffffff').setSecondRowColor(t.band);

    // number formats
    ['가격','포인트','단가','금액','주문후포인트'].forEach(function(nm){ var r = body(nm); if (r) r.setNumberFormat(money); });
    ['초기재고','현재고','당일판매수량','당일재고','남은수량'].forEach(function(nm){ var r = body(nm); if (r) r.setNumberFormat(count); });
    if (k === 'items') ['현재고','당일재고'].forEach(function(nm){ var c = col(nm); if (c) { sh.getRange(1,c).setBackground('#9e9e9e'); sh.getRange(2,c,rows,1).setFontColor('#555555').setFontWeight('bold'); } });
    if (k === 'users') { var pw = body('비밀번호'); if (pw) pw.setNumberFormat('@'); }

    // input rules (stop text in number cells)
    var num = SpreadsheetApp.newDataValidation().requireNumberGreaterThanOrEqualTo(0).setAllowInvalid(false)
      .setHelpText('숫자만 넣어 주세요 (0 이상)').build();
    ['가격','초기재고','당일판매수량','1인최대','포인트','가중치','남은수량'].forEach(function(nm){
      if (k==='orders'||k==='wins') return; var r = body(nm); if (r) r.setDataValidation(num);
    });
    if (k === 'items') {
      var yn = body('판매'); if (yn) yn.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['Y','N'], true).setAllowInvalid(false).build());
      var cat = body('카테고리'); if (cat) cat.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['참가권','쿠폰','간식','문구','굿즈','기타'], true).setAllowInvalid(true).build());
    }
    if (k === 'comments') {
      var stc = body('상태'); if (stc) stc.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['','숨김','자동삭제'], true).setAllowInvalid(true).build());
      var stl = col('상태'); if (stl) { var Lc = String.fromCharCode(64+stl);
        sh.setConditionalFormatRules([SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=OR($'+Lc+'2="숨김",$'+Lc+'2="자동삭제")').setFontColor('#aaaaaa').setStrikethrough(true).setRanges([sh.getRange(2,1,rows,n)]).build()]); }
    }
    if (k === 'letters') { var ct = body('내용'); if (ct) { ct.setWrap(true).setHorizontalAlignment('left'); sh.setColumnWidth(col('내용'), 360); }
      if (col('선생님')) sh.setColumnWidth(col('선생님'), 110); if (col('학생 이름')) sh.setColumnWidth(col('학생 이름'), 100);
      sh.setFrozenColumns(2); if (sh.getFilter()) sh.getFilter().remove(); sh.getRange(1,1,sh.getMaxRows(),n).createFilter(); }
    if (k === 'comments') { var cc = body('내용'); if (cc) { cc.setWrap(true).setHorizontalAlignment('left'); sh.setColumnWidth(col('내용'), 320); } }
    if (k === 'box') {
      var gr = body('등급'); if (gr) gr.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['1등','2등','3등','4등','5등'], true).setAllowInvalid(true).build());
    }

    // colour rules
    var rules = [];
    var stockCol = col('당일재고') || col('남은수량');
    if (stockCol && (k==='items'||k==='box'||k==='roul')) {
      var L = String.fromCharCode(64 + stockCol), whole = sh.getRange(2,1,rows,n);
      rules.push(SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND($'+L+'2<>"",$'+L+'2<=0)').setBackground('#d9d9d9').setFontColor('#888888').setStrikethrough(true).setRanges([whole]).build());
      rules.push(SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND($'+L+'2<>"",$'+L+'2<=10)').setBackground('#ffd6d3').setFontColor('#b50005').setBold(true).setRanges([sh.getRange(2,stockCol,rows,1)]).build());
    }
    if (k === 'items') {
      var sc = col('판매'); if (sc) { var Ls = String.fromCharCode(64+sc);
        rules.push(SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$'+Ls+'2="N"').setFontColor('#aaaaaa').setItalic(true).setRanges([sh.getRange(2,1,rows,n)]).build()); }
    }
    if (k === 'users') {
      var pc = col('포인트'); if (pc) rules.push(SpreadsheetApp.newConditionalFormatRule().whenNumberLessThan(1000).setBackground('#fff3b0').setRanges([sh.getRange(2,pc,rows,1)]).build());
    }
    if (k === 'box' || k === 'wins') {
      var gc = col('등급'); if (gc) { var Lg = String.fromCharCode(64+gc);
        rules.push(SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$'+Lg+'2="1등"').setBackground('#ffe066').setBold(true).setRanges([sh.getRange(2,1,rows,n)]).build()); }
    }
    var payC = col('지급완료');
    if (payC && (k === 'orders' || k === 'wins')) {
      if (sh.getLastRow() >= 2) sh.getRange(2, payC, sh.getLastRow() - 1, 1).insertCheckboxes();
      sh.getRange(1, payC).setNote('선생님이 물건을 주면 체크하세요. 체크하면 그 줄이 회색이 돼요.');
      sh.setColumnWidth(payC, 80); sh.setFrozenColumns(1);
      var Lp = String.fromCharCode(64 + payC);
      rules.unshift(SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$' + Lp + '2=TRUE').setBackground('#cfcfcf').setFontColor('#8a8a8a').setStrikethrough(true).setRanges([sh.getRange(2,1,rows,n)]).build());
      if (sh.getFilter()) sh.getFilter().remove(); sh.getRange(1,1,sh.getMaxRows(),n).createFilter();
    }
    if (k !== 'comments') sh.setConditionalFormatRules(rules);

    // warn before editing the header row
    sh.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(function(p){ if (p.getDescription()==='제목줄') p.remove(); });
    head.protect().setDescription('제목줄').setWarningOnly(true);
  });

  // 안내 tab
  var g = ss.getSheetByName('안내') || ss.insertSheet('안내', 0);
  g.clear(); g.setTabColor('#ffc83d'); g.setHiddenGridlines(true);
  var lines = [
    ['🎄 DYB 크리스마스 마켓 관리 시트'],[''],
    ['📦 물품','초기재고·당일판매수량·가격·1인최대·판매(Y/N)는 직접 입력해요. 현재고·당일재고(회색 제목)는 자동으로 계산돼요. 사이트에는 당일재고로 남은 정도가 문구로 보여요.'],
    ['','예) 초기재고 30, 당일판매수량 10 → 오늘은 10개까지만 팔려요. 당일판매수량을 비우면 남은 수량을 모두 팔아요. 날짜가 바뀌면 당일재고가 자동으로 다시 채워져요.'],
    ['📝 학년 명단','4·5·6학년 명단 탭에 담임선생님·이름·포인트만 넣으면 학생 탭에 자동으로 들어가고 초대장 번호(DYB+숫자 5자리)가 만들어져요. 이름을 지우거나 줄을 삭제하면 번호와 학생 정보도 함께 지워져요.'],
    ['','포인트 숫자를 나중에 올리면 그만큼 추가 지급돼요. 정렬은 제목줄의 ▼(필터) 또는 위쪽 [🎄 마켓 관리] 메뉴에서!'],
    ['🧒 학생','명단에서 자동으로 채워져요. 샘플 학생(비밀번호 1234)은 연습용이니 행사 전에 지워도 돼요.'],
    ['🧾 주문','사이트에서 주문하면 자동으로 쌓여요. 학생이 보여주는 주문번호로 찾고(Ctrl+F), 물건을 준 뒤 맨 앞 [지급완료] 칸을 체크하면 그 줄이 회색이 돼요.'],
    ['🎁 랜덤박스','가중치가 클수록 잘 나와요. 남은수량이 0이면 안 나와요. 1등은 노란 줄이에요.'],
    ['🎡 룰렛','칸을 추가·삭제하면 룰렛 칸 수가 자동으로 바뀌어요.'],
    ['🏆 당첨기록','룰렛·랜덤박스 결과가 자동으로 쌓여요. 상품을 준 뒤 맨 앞 [지급완료] 칸을 체크하세요.'],
    ['💌 편지 / 💬 댓글','편지는 [선생님 / 학생 이름 / 내용] 순서예요. 선생님 칸 ▼ 필터로 내 학생 편지만 볼 수 있어요. 댓글 상태 칸에 "숨김"을 쓰면 사이트에서 사라져요.'],
    ['🚫 금지어','여기에 단어를 추가하면 그 단어가 든 댓글·편지가 막혀요. (기본 비속어 필터는 이미 켜져 있어요)'],[''],
    ['⚠️ 주의','탭 이름과 1행 제목은 바꾸지 마세요. 물품 ID와 학생 이름도 행사 중에는 바꾸지 마세요.'],
    ['⚠️ 주의','주문·당첨기록 줄을 지우면 참가권이 되살아날 수 있어요. 연습 기록 정리할 때만 지우세요.'],
    ['🛒 물품 구매','선생님이 산 물건·가격·수량을 적는 탭이에요 (사이트와 무관). 오른쪽 위 [전체 예산]만 적으면 사용한 금액·남은 예산이 자동 계산돼요.'],
    ['💡 팁','칸 위 제목에 마우스를 올리면 설명이 나와요. 행사 전에 [파일 → 사본 만들기]로 백업해 두세요.']
  ];
  lines.forEach(function(r,i){ g.getRange(i+1,1,1,r.length).setValues([r]); });
  g.getRange('A1').setFontSize(20).setFontWeight('bold').setFontColor('#b50005');
  g.getRange(3,1,lines.length-2,1).setFontWeight('bold').setFontSize(12);
  g.getRange(3,2,lines.length-2,1).setFontSize(12).setWrap(true);
  g.getRange('A16:B17').setBackground('#ffe9e7'); g.getRange('A18:B18').setBackground('#fff6d6'); g.getRange('A5:B6').setBackground('#eef6ff');
  g.setColumnWidth(1,120); g.setColumnWidth(2,620);
  ss.setActiveSheet(g); ss.moveActiveSheet(1);
  SpreadsheetApp.flush();
  재고반영();
  try { 물품구매시트(); } catch (x) {}
}

/* ===== [물품 구매] 탭: 선생님이 산 물건과 예산 관리 (사이트와는 연결되지 않아요) ===== */
var BUY_TAB = '물품 구매';
var BUY_H = ['물품','카테고리','묶음 수량 및 가격','개별 가격','구매량','총액','초기 재고','현 재고','구매 링크','판매 여부'];
function 물품구매시트() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), sh = ss.getSheetByName(BUY_TAB);
  var ROWS = 120, first = 4, last = first + ROWS - 1, carry = [], prevBudget = null;
  if (sh && sh.getLastRow() > 0) {
    // 이전에 적어 둔 총 예산 찾기
    [['J3','K3','전체 예산'],['J3','J4','총 예산'],['N4','N5','총 예산']].forEach(function(p){
      try { if (prevBudget === null && String(sh.getRange(p[0]).getValue()).trim() === p[2]) prevBudget = Number(sh.getRange(p[1]).getValue()) || 0; } catch (x) {}
    });
    var lc = Math.max(sh.getLastColumn(), 10);
    var hdr = sh.getRange(3,1,1,lc).getValues()[0].map(function(x){ return String(x).trim(); });
    if (hdr.slice(0, BUY_H.length).join('|') !== BUY_H.join('|')) {
      // 예전 모양: 백업해 두고, 적어 둔 물건은 새 칸으로 옮김
      var bk = sh.copyTo(ss); bk.setName(BUY_TAB + '_백업_' + Utilities.formatDate(new Date(), 'Asia/Seoul', 'MMdd_HHmm'));
      if (sh.getLastRow() >= first) {
        var v = sh.getRange(first,1,sh.getLastRow()-first+1,lc).getValues(), h = function(n){ return hdr.indexOf(n); };
        v.forEach(function(r){
          var nm = String(r[Math.max(h('물품명'), h('물품'))] || '').trim(); if (!nm) return;
          var c0 = String(r[h('카테고리')] || '').trim(), cat = ['간식','문구','면제권'].indexOf(c0) >= 0 ? c0 : (c0 ? '기타' : '');
          var bq = h('묶음 수량') >= 0 ? r[h('묶음 수량')] : '', bp = h('묶음 가격') >= 0 ? r[h('묶음 가격')] : '';
          var unit = h('개별 가격') >= 0 ? r[h('개별 가격')] : '', qty = h('수량') >= 0 ? r[h('수량')] : '';
          var bmix = h('묶음 수량 및 가격') >= 0 ? r[h('묶음 수량 및 가격')] : '';
          var buyq = h('구매량') >= 0 ? r[h('구매량')] : '';
          var sale = h('판매 여부') >= 0 ? String(r[h('판매 여부')]).trim().toUpperCase() : '';
          var bundle = bmix !== '' ? String(bmix) : (bq !== '' || bp !== '') ? (bq !== '' ? Number(bq).toLocaleString() + '개' : '') + (bq !== '' && bp !== '' ? ' / ' : '') + (bp !== '' ? Number(bp).toLocaleString() + '원' : '') : '';
          if (unit === '' && bq && bp) unit = Math.round(Number(bp) / Number(bq));
          var link = h('구매 링크') >= 0 ? r[h('구매 링크')] : '';
          var init = h('초기 재고') >= 0 ? r[h('초기 재고')] : qty;
          if (buyq === '') buyq = init;      // 예전 표는 초기 재고 = 구매 수량으로 봄
          carry.push([nm, cat, bundle, unit === '' ? '' : Number(unit), buyq === '' ? '' : Number(buyq), '', init === '' ? '' : Number(init), '', link, sale === 'N' ? 'N' : 'Y']);
        });
      }
      var all = sh.getRange(1,1,sh.getMaxRows(),sh.getMaxColumns());
      all.breakApart(); sh.clear(); sh.clearConditionalFormatRules(); all.clearDataValidations(); all.clearNote();
      sh.getBandings().forEach(function(b){ b.remove(); });
    }
  }
  if (!sh) sh = ss.insertSheet(BUY_TAB);
  if (sh.getMaxRows() < last + 2) sh.insertRowsAfter(sh.getMaxRows(), last + 2 - sh.getMaxRows());
  if (sh.getMaxColumns() < 19) sh.insertColumnsAfter(sh.getMaxColumns(), 19 - sh.getMaxColumns());
  sh.setTabColor('#ff9800');

  sh.getRange('A1').setValue('🛒 물품 구매 · 예산 관리').setFontSize(18).setFontWeight('bold').setFontColor('#b50005');
  sh.getRange('A2').setValue('흰 칸 직접 입력. 총액(개별 가격 × 구매량)·현 재고(물품 탭 연동)는 자동. 사용 예산 = 총액 합계. 판매 여부 N = 사이트 미판매(경품 등).').setFontColor('#777777').setFontSize(10);

  sh.getRange(3,1,1,BUY_H.length).setValues([BUY_H]).setFontWeight('bold').setFontColor('#ffffff').setHorizontalAlignment('center').setVerticalAlignment('middle');
  sh.getRange(3,1,1,10).setBackground('#ff9800'); sh.getRange(3,6).setBackground('#9e9e9e'); sh.getRange(3,8).setBackground('#9e9e9e');
  sh.getRange(3,11,1,3).clearContent().clearFormat();
  sh.setRowHeight(3, 32); sh.setFrozenRows(3);
  [170,80,150,90,80,100,80,80,200,80].forEach(function(w,i){ sh.setColumnWidth(i+1, w); });

  // 예전 수식 칸 정리 (함수 없이 직접 입력하도록)
  if (carry.length) { sh.getRange(first,1,ROWS,13).clearContent(); sh.getRange(first,1,carry.length,10).setValues(carry); }
  else {
    var fm = sh.getRange(first,3,ROWS,3).getFormulas();   // 직접 입력 칸에 남은 수식 정리
    fm.forEach(function(row, i){ row.forEach(function(f, j){ if (f) sh.getRange(first+i, 3+j).clearContent(); }); });
  }
  sh.getRange(first,11,ROWS,3).clearContent().clearFormat().clearDataValidations();

  var fF = [], hF = [];
  for (var r = first; r <= last; r++) {
    fF.push(['=IF(OR($D' + r + '="",$E' + r + '=""),"",$D' + r + '*$E' + r + ')']);
    hF.push(['=IF($A' + r + '="","",IFERROR(INDEX(\'물품\'!$A:$Z, MATCH($A' + r + ', INDEX(\'물품\'!$A:$Z,0,MATCH("이름",\'물품\'!$1:$1,0)),0), MATCH("현재고",\'물품\'!$1:$1,0)),IFERROR(INDEX(\'물품\'!$A:$Z, MATCH(SWITCH($B' + r + ',"사탕/젤리","랜덤 사탕 or 젤리","짭짤과자 A","추억의 옛날과자 (짭짤)","짭짤과자 B","추억의 옛날과자 (짭짤)","달콤과자 A","추억의 옛날과자 (달콤)","달콤과자 B","추억의 옛날과자 (달콤)","랜덤 연필","랜덤 연필","랜덤 지우개","랜덤 지우개 뽑기",""), INDEX(\'물품\'!$A:$Z,0,MATCH("이름",\'물품\'!$1:$1,0)),0), MATCH("현재고",\'물품\'!$1:$1,0)),"없음")))']);
  }
  sh.getRange(first,6,ROWS,1).setFormulas(fF);
  sh.getRange(first,8,ROWS,1).setFormulas(hF);
  var sv = sh.getRange(first,1,ROWS,10).getValues();
  sv.forEach(function(row, i){ if (String(row[0]).trim() && String(row[9]).trim() === '') sh.getRange(first+i,10).setValue('Y'); });

  sh.getBandings().forEach(function(b){ b.remove(); });
  sh.getRange(3,1,ROWS+1,10).applyRowBanding(SpreadsheetApp.BandingTheme.ORANGE, true, false).setHeaderRowColor('#ff9800').setFirstRowColor('#ffffff').setSecondRowColor('#fff6e5');
  sh.getRange(first,1,ROWS,10).setVerticalAlignment('middle');
  sh.getRange(first,2,ROWS,9).setHorizontalAlignment('center').setFontColor('#000000').setFontWeight('normal');
  sh.getRange(first,3,ROWS,1).setNumberFormat('@');
  sh.getRange(first,4,ROWS,1).setNumberFormat('#,##0"원"');
  sh.getRange(first,5,ROWS,1).setNumberFormat('#,##0"개"');
  sh.getRange(first,6,ROWS,1).setNumberFormat('#,##0"원"').setBackground('#f3f3f3').setFontColor('#333333').setFontWeight('bold');
  sh.getRange(first,7,ROWS,1).setNumberFormat('#,##0"개"');
  sh.getRange(first,8,ROWS,1).setNumberFormat('#,##0"개"').setBackground('#f3f3f3').setFontColor('#555555').setFontWeight('bold');
  sh.getRange(first,9,ROWS,1).setHorizontalAlignment('left').setFontColor('#1565c0').setNumberFormat('@');

  sh.getRange(first,1,ROWS,10).clearDataValidations();
  sh.getRange(first,2,ROWS,1).setDataValidation(SpreadsheetApp.newDataValidation()
    .requireValueInList(BUY_CATS, true).setAllowInvalid(true).build());
  var it = ss.getSheetByName(TAB_NAMES.items);
  if (it) {
    var ih = it.getRange(1,1,1,it.getLastColumn()).getValues()[0].map(function(x){ return String(x).trim(); });
    var nc = ih.indexOf('이름') + 1;
    if (nc > 0) sh.getRange(first,1,ROWS,1).setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInRange(it.getRange(2, nc, Math.max(it.getMaxRows()-1,1), 1), true).setAllowInvalid(true)
      .setHelpText('[물품] 탭 이름과 동일하게 입력 시 현 재고 자동 표시됨. 다른 이름도 입력 가능함.').build());
  }
  var num = SpreadsheetApp.newDataValidation().requireNumberGreaterThanOrEqualTo(0).setAllowInvalid(false).setHelpText('숫자만 입력 가능함').build();
  sh.getRange(first,4,ROWS,2).setDataValidation(num);
  sh.getRange(first,7,ROWS,1).setDataValidation(num);
  sh.getRange(first,10,ROWS,1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['Y','N'], true).setAllowInvalid(false).build());
  sh.getRange(3,1,1,13).clearNote();
  sh.getRange(3,1).setNote('[물품] 탭의 "이름"과 동일하게 입력 시 현 재고 자동 연동됨');
  sh.getRange(3,3).setNote('자유 입력 (예: 100개 / 10,000원). 계산에는 쓰이지 않음');
  sh.getRange(3,4).setNote('1개당 가격 직접 입력');
  sh.getRange(3,5).setNote('실제 구매한 개수 직접 입력');
  sh.getRange(3,6).setNote('자동 계산: 개별 가격 × 구매량. 사용 예산은 이 칸의 합계임');
  sh.getRange(3,7).setNote('사이트 판매 시작 수량. 면제권은 미리 재단한 매수 입력');
  sh.getRange(3,8).setNote('자동 연동: [물품] 탭의 현재고 (판매 시 차감됨). 랜덤 지급 묶음(사탕/젤리·짭짤/달콤과자·랜덤 연필·랜덤 지우개)은 사이트 판매 물품의 공통 재고로 표시됨. 사이트 미판매 물품은 "없음"');
  sh.getRange(3,9).setNote('구매처 주소 입력 (클릭 시 바로 열림)');
  sh.getRange(3,10).setNote('Y = 사이트 마켓에서 판매 / N = 사이트 미판매 (경품·현장 지급용). [물품 구매 목록 → 사이트 물품 맞추기] 실행 시 반영됨');

  // ---- 오른쪽: 큰 예산 박스 (N~R, 3행부터) ----
  var Fr = 'F' + first + ':F' + last;
  if (prevBudget === null) prevBudget = 0;
  var area = sh.getRange('K1:S25');
  area.breakApart(); area.clear(); area.clearDataValidations(); area.clearNote();
  for (var cn = 11; cn <= 13; cn++) sh.setColumnWidth(cn, 30);
  for (var cn2 = 14; cn2 <= 18; cn2++) sh.setColumnWidth(cn2, 85);
  var L = function(a1, text, bg){ return sh.getRange(a1).merge().setValue(text).setFontWeight('bold').setFontSize(14).setHorizontalAlignment('center').setVerticalAlignment('middle').setBackground(bg).setFontColor('#ffffff'); };
  var V = function(a1, bg, size){ return sh.getRange(a1).merge().setFontWeight('bold').setFontSize(size).setHorizontalAlignment('center').setVerticalAlignment('middle').setBackground(bg).setNumberFormat('#,##0"원"'); };
  sh.getRange('N3:R3').merge().setValue('💰 예산 현황').setFontSize(16).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle').setBackground('#b50005').setFontColor('#ffffff');
  L('N4:R4', '총 예산 (직접 입력)', '#5c6bc0');
  V('N5:R6', '#ffffff', 26).setValue(prevBudget).setFontColor('#283593').setNote('총 예산 직접 입력');
  L('N7:R7', '사용 예산', '#ef6c00');
  V('N8:R9', '#fff3e0', 26).setFontColor('#e65100').setFormula('=SUM(' + Fr + ')')
    .setNote('자동 계산: 왼쪽 표 총액의 합계');
  L('N10:R10', '남은 예산', '#2e7d32');
  V('N11:R12', '#e8f5e9', 30).setFontColor('#1b5e20').setFormula('=N5-N8').setNote('자동 계산: 총 예산 − 사용 예산');
  sh.getRange('N14:O14').merge().setValue('총 인원').setFontWeight('bold').setHorizontalAlignment('center').setBackground('#fff3e0');
  sh.getRange('P14:R14').merge().setFontWeight('bold').setHorizontalAlignment('center').setBackground('#f3f3f3').setNumberFormat('#,##0"명"')
    .setFormula('=IFERROR(COUNTIFS(INDEX(\'학생\'!$A:$Z,0,MATCH("이름",\'학생\'!$1:$1,0)),"<>",INDEX(\'학생\'!$A:$Z,0,MATCH("학년",\'학생\'!$1:$1,0)),"<>샘플")-1,0)')
    .setNote('자동 집계: [학생] 탭 학생 수 (샘플 학생 제외)');
  sh.getRange('N15:O15').merge().setValue('1인당 사용 금액').setFontWeight('bold').setHorizontalAlignment('center').setBackground('#fff3e0');
  sh.getRange('P15:R15').merge().setFontWeight('bold').setHorizontalAlignment('center').setBackground('#f3f3f3').setNumberFormat('#,##0"원"')
    .setFormula('=IF(P14>0,N8/P14,"")');
  for (var rr = 4; rr <= 12; rr++) sh.setRowHeight(rr, 30);
  sh.getRange('N3:R12').setBorder(true,true,true,true,false,false,'#5c2b10',SpreadsheetApp.BorderStyle.SOLID_THICK);
  ['N4:R6','N7:R9','N10:R12'].forEach(function(a){ sh.getRange(a).setBorder(true,true,true,true,false,false,'#5c2b10',SpreadsheetApp.BorderStyle.SOLID_MEDIUM); });
  sh.getRange('N14:R15').setBorder(true,true,true,true,true,true,'#bdbdbd',SpreadsheetApp.BorderStyle.SOLID);
  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$N$11<0').setBackground('#ffcdd2').setFontColor('#b50005').setRanges([sh.getRange('N11:R12')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND($N$5>0,$N$11>=0,$N$11<=$N$5*0.1)').setBackground('#ffe0b2').setFontColor('#e65100').setRanges([sh.getRange('N11:R12')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$H' + first + '="없음"').setFontColor('#bbbbbb').setRanges([sh.getRange(first,8,ROWS,1)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND(ISNUMBER($H' + first + '),$H' + first + '<=10)').setBackground('#ffd6d3').setFontColor('#b50005').setRanges([sh.getRange(first,8,ROWS,1)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$J' + first + '="N"').setBackground('#eeeeee').setFontColor('#888888').setRanges([sh.getRange(first,1,ROWS,10)]).build()
  ]);
  SpreadsheetApp.flush();
}

/* ===== 2026 새 물품 목록 한 번에 적용 (물품 · 물품 구매 · 랜덤박스 · 룰렛) ===== */
var BUY_CATS = ['사탕/젤리','짭짤과자 A','짭짤과자 B','달콤과자 A','달콤과자 B','랜덤 연필','랜덤 지우개','문구','면제권','굿즈','기타'];
// 물품 구매 카테고리 → 사이트 판매 물품 이름 (랜덤 지급 묶음)
var BUY_POOL = {'사탕/젤리':'랜덤 사탕 or 젤리','짭짤과자 A':'추억의 옛날과자 (짭짤)','짭짤과자 B':'추억의 옛날과자 (짭짤)',
  '달콤과자 A':'추억의 옛날과자 (달콤)','달콤과자 B':'추억의 옛날과자 (달콤)','랜덤 연필':'랜덤 연필','랜덤 지우개':'랜덤 지우개 뽑기'};
var BUY_SEED = [
  ['단어커트 +5','면제권'],['구두 면제권','면제권'],['한과목 숙제 면제권','면제권'],['재시험 면제권','면제권'],
  ['다믈라 젤리','사탕/젤리'],['젤리 (미정)','사탕/젤리'],
  ['과자 미정','짭짤과자 A'],['과자 미정','짭짤과자 B'],['과자 미정','달콤과자 A'],['과자 미정','달콤과자 B'],
  ['크리스마스 4색 볼펜','문구'],['크리스마스 연필','랜덤 연필'],['DYB 연필','랜덤 연필'],['형광펜','문구'],['수정테이프','문구'],['볼펜','문구'],
  ['크리스마스 불빛 반지','굿즈'],['크리스마스 스쿼시','굿즈'],['치이카와 지우개','랜덤 지우개'],['짱구 지우개','랜덤 지우개']
];
function 새물품목록적용() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), ui = null;
  try { ui = SpreadsheetApp.getUi(); ui.alert; } catch (x) { ui = null; }
  // Apps Script 편집기에서 실행하면 확인 창을 띄울 수 없어서 바로 진행함
  var ask = function(){ try { return ui.alert.apply(ui, arguments); } catch (x) { ui = null; return 'YES'; } };
  if (ui && ask('새 물품 목록 적용',
      '[물품] · [물품 구매] · [랜덤박스] · [룰렛] 탭의 물품 목록을 새 목록으로 교체함.\n' +
      '(게임 참가권 3종은 유지 · 기존 탭은 백업 탭으로 복사됨 · 물품 구매에 적어 둔 가격·수량·링크는 같은 이름이면 유지됨)\n\n진행하시겠습니까?',
      ui.ButtonSet.YES_NO) !== (ui ? ui.Button.YES : 'YES')) return;
  setup();
  var stamp = Utilities.formatDate(new Date(), 'Asia/Seoul', 'MMdd_HHmm');
  var bk = function(name){ var sh = ss.getSheetByName(name); if (sh && sh.getLastRow() > 0) sh.copyTo(ss).setName(name + '_백업_' + stamp); return sh; };

  // 1) 물품 탭
  var it = bk(TAB_NAMES.items);
  var ih = it.getRange(1,1,1,it.getLastColumn()).getValues()[0].map(function(x){ return String(x).trim(); });
  var oldRows = it.getLastRow() > 1 ? it.getRange(2,1,it.getLastRow()-1,ih.length).getValues() : [];
  var keep = {};   // 참가권은 선생님이 바꾼 값 유지
  oldRows.forEach(function(r){ var id = String(r[ih.indexOf('ID')]).trim(); if (id.indexOf('ticket_') === 0) keep[id] = r; });
  var seed = E_seedItems();
  var rows = seed.map(function(sr){
    var o = {}; HEADERS.items.forEach(function(h,k){ o[h] = sr[k]; });
    if (keep[o['ID']]) return keep[o['ID']];
    return ih.map(function(h){ return o[h] === undefined ? '' : o[h]; });
  });
  if (oldRows.length) it.getRange(2,1,oldRows.length,ih.length).clearContent();
  if (it.getMaxRows() > rows.length + 1 && oldRows.length > rows.length) it.getRange(rows.length+2,1,oldRows.length-rows.length,ih.length).setBackground(null);
  it.getRange(2,1,rows.length,ih.length).setValues(rows).setBackground(null);

  // 2) 랜덤박스 · 룰렛 탭
  [['box', SEED.box], ['roul', SEED.roul]].forEach(function(p){
    var sh = bk(TAB_NAMES[p[0]]), h = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(function(x){ return String(x).trim(); });
    if (sh.getLastRow() > 1) sh.getRange(2,1,sh.getLastRow()-1,h.length).clearContent();
    var rr = p[1].map(function(r){ var o = {}; HEADERS[p[0]].forEach(function(k,i){ o[k] = r[i]; }); return h.map(function(k){ return o[k] === undefined ? '' : o[k]; }); });
    sh.getRange(2,1,rr.length,h.length).setValues(rr);
  });

  // 3) 물품 구매 탭
  var buy = ss.getSheetByName(BUY_TAB);
  if (!buy || String(buy.getRange(3,1).getValue()).trim() !== '물품') { 물품구매시트(); buy = ss.getSheetByName(BUY_TAB); }
  else bk(BUY_TAB);
  var first = 4, bh = buy.getRange(3,1,1,BUY_H.length).getValues()[0].map(function(x){ return String(x).trim(); });
  var prev = {}, used = {};
  if (buy.getLastRow() >= first) buy.getRange(first,1,buy.getLastRow()-first+1,BUY_H.length).getValues().forEach(function(r){
    var k = String(r[0]).trim() + '|' + String(r[1]).trim(); if (String(r[0]).trim()) (prev[k] = prev[k] || []).push(r); });
  var out = BUY_SEED.map(function(sr){
    var k = sr[0] + '|' + sr[1], old = (prev[k] || []).shift();
    var get = function(name){ return old ? old[bh.indexOf(name)] : ''; };
    return [sr[0], sr[1], get('묶음 수량 및 가격'), get('개별 가격'), get('구매량'), null, get('초기 재고'), null, get('구매 링크'), 'Y'];
  });
  buy.getRange(first,1,120,5).clearContent(); buy.getRange(first,7,120,1).clearContent(); buy.getRange(first,9,120,2).clearContent();
  out.forEach(function(r, i){
    buy.getRange(first+i,1,1,5).setValues([r.slice(0,5)]);
    buy.getRange(first+i,7).setValue(r[6]);
    buy.getRange(first+i,9,1,2).setValues([[r[8], r[9]]]);
  });
  물품구매시트();      // 카테고리 목록·현 재고 수식 다시 적용
  재고반영();
  Logger.log('새 물품 목록 적용 완료');
  if (ui) ask('완료됨', '새 물품 목록 적용 완료.\n• 사이트 물품 ' + rows.length + '개 (참가권 포함)\n• 물품 구매 ' + out.length + '줄\n• 랜덤박스·룰렛 경품 교체\n\n가격(포인트)·경품 확률은 [물품]·[랜덤박스] 탭에서 확인 바람.', ui.ButtonSet.OK);
}
