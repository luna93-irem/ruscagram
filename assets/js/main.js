/* ============================================================
   RusçaGram — Tek JavaScript dosyası
   Sıra:
     1) Yardımcılar
     2) Veri (isim/fiil/sıfat)
     3) Çekim motoru
     4) Soru üreticileri
     5) Referans içerikleri
     6) Uygulama akışı
     7) init()
   ============================================================ */

/* ============================================================
   1) YARDIMCILAR
   ============================================================ */
const $ = id => document.getElementById(id);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const shuffle = arr => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const norm = s => (s || '').toLowerCase().trim()
  .replace(/ё/g, 'е').replace(/\s+/g, ' ').replace(/[.,!?;:]+$/, '');
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

const G_TR = { m: 'Eril', f: 'Dişil', n: 'Nötr' };
const C_TR = {
  nom: 'Nominative (Yalın)',
  gen: 'Genitive (Tamlayan)',
  dat: 'Dative (Yönelme)',
  acc: 'Accusative (Belirtme)',
  ins: 'Instrumental (Araç)',
  pre: 'Prepositional (Bulunma)'
};

const LVLS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const LVL_NAME = {
  A1: 'Başlangıç', A2: 'Temel', B1: 'Orta',
  B2: 'Orta-İleri', C1: 'İleri', C2: 'Ustalık'
};
const NEED = 10; // Ustalık için gereken ardışık doğru

/* ============================================================
   2) VERİ
   ============================================================ */

const NOUNS = [
  /* --- ERİL SERT --- */
  { nom:'стол',     g:'m', soft:false, anim:false, tr:'masa' },
  { nom:'дом',      g:'m', soft:false, anim:false, tr:'ev' },
  { nom:'город',    g:'m', soft:false, anim:false, tr:'şehir' },
  { nom:'язык',     g:'m', soft:false, anim:false, tr:'dil' },
  { nom:'вопрос',   g:'m', soft:false, anim:false, tr:'soru' },
  { nom:'ответ',    g:'m', soft:false, anim:false, tr:'cevap' },
  { nom:'урок',     g:'m', soft:false, anim:false, tr:'ders' },
  { nom:'кот',      g:'m', soft:false, anim:true,  tr:'kedi' },
  { nom:'студент',  g:'m', soft:false, anim:true,  tr:'öğrenci' },
  { nom:'солдат',   g:'m', soft:false, anim:true,  tr:'asker' },
  { nom:'работник', g:'m', soft:false, anim:true,  tr:'işçi' },
  { nom:'друг',     g:'m', soft:false, anim:true,  tr:'arkadaş',
    ov:{ pl:{ nom:'друзья', gen:'друзей', dat:'друзьям', acc:'друзей', ins:'друзьями', pre:'друзьях' } } },
  { nom:'брат',     g:'m', soft:false, anim:true,  tr:'erkek kardeş',
    ov:{ pl:{ nom:'братья', gen:'братьев', dat:'братьям', acc:'братьев', ins:'братьями', pre:'братьях' } } },

  /* --- ERİL YUMUŞAK --- */
  { nom:'день',     g:'m', soft:true, anim:false, tr:'gün',
    ov:{ pl:{ nom:'дни', gen:'дней', dat:'дням', acc:'дни', ins:'днями', pre:'днях' } } },
  { nom:'гость',    g:'m', soft:true, anim:true,  tr:'misafir' },
  { nom:'писатель', g:'m', soft:true, anim:true,  tr:'yazar' },
  { nom:'учитель',  g:'m', soft:true, anim:true,  tr:'öğretmen' },
  { nom:'читатель', g:'m', soft:true, anim:true,  tr:'okuyucu' },
  { nom:'словарь',  g:'m', soft:true, anim:false, tr:'sözlük' },
  { nom:'музей',    g:'m', soft:true, anim:false, tr:'müze' },
  { nom:'медведь',  g:'m', soft:true, anim:true,  tr:'ayı' },
  { nom:'конь',     g:'m', soft:true, anim:true,  tr:'at' },

  /* --- DİŞİL SERT --- */
  { nom:'книга',    g:'f', soft:false, anim:false, tr:'kitap' },
  { nom:'мама',     g:'f', soft:false, anim:true,  tr:'anne' },
  { nom:'девочка',  g:'f', soft:false, anim:true,  tr:'kız çocuğu',
    ov:{ pl:{ gen:'девочек', acc:'девочек' } } },
  { nom:'девушка',  g:'f', soft:false, anim:true,  tr:'genç kız',
    ov:{ pl:{ gen:'девушек', acc:'девушек' } } },
  { nom:'кошка',    g:'f', soft:false, anim:true,  tr:'dişi kedi',
    ov:{ pl:{ gen:'кошек', acc:'кошек' } } },
  { nom:'страна',   g:'f', soft:false, anim:false, tr:'ülke' },
  { nom:'вода',     g:'f', soft:false, anim:false, tr:'su' },
  { nom:'рука',     g:'f', soft:false, anim:false, tr:'el' },
  { nom:'нога',     g:'f', soft:false, anim:false, tr:'bacak' },
  { nom:'голова',   g:'f', soft:false, anim:false, tr:'baş' },
  { nom:'работа',   g:'f', soft:false, anim:false, tr:'iş' },
  { nom:'школа',    g:'f', soft:false, anim:false, tr:'okul' },
  { nom:'комната',  g:'f', soft:false, anim:false, tr:'oda' },
  { nom:'сестра',   g:'f', soft:false, anim:true,  tr:'kız kardeş',
    ov:{ pl:{ nom:'сёстры', gen:'сестёр', dat:'сёстрам', acc:'сестёр', ins:'сёстрами', pre:'сёстрах' } } },

  /* --- DİŞİL YUMUŞAK --- */
  { nom:'неделя',   g:'f', soft:true, anim:false, tr:'hafta' },
  { nom:'деревня',  g:'f', soft:true, anim:false, tr:'köy' },
  { nom:'семья',    g:'f', soft:true, anim:false, tr:'aile' },
  { nom:'земля',    g:'f', soft:true, anim:false, tr:'toprak' },
  { nom:'тетрадь',  g:'f', soft:true, anim:false, tr:'defter' },
  { nom:'ночь',     g:'f', soft:true, anim:false, tr:'gece' },
  { nom:'мышь',     g:'f', soft:true, anim:true,  tr:'fare' },
  { nom:'дверь',    g:'f', soft:true, anim:false, tr:'kapı' },
  { nom:'жизнь',    g:'f', soft:true, anim:false, tr:'hayat' },
  { nom:'площадь',  g:'f', soft:true, anim:false, tr:'meydan' },
  { nom:'дочь',     g:'f', soft:true, anim:true,  tr:'kız evlat',
    ov:{ pl:{ nom:'дочери', gen:'дочерей', dat:'дочерям', acc:'дочерей', ins:'дочерьми', pre:'дочерях' } } },
  { nom:'мать',     g:'f', soft:true, anim:true,  tr:'anne',
    ov:{ pl:{ nom:'матери', gen:'матерей', dat:'матерям', acc:'матерей', ins:'матерями', pre:'матерях' } } },

  /* --- NÖTR --- */
  { nom:'окно',     g:'n', soft:false, anim:false, tr:'pencere', ov:{ pl:{ gen:'окон' } } },
  { nom:'письмо',   g:'n', soft:false, anim:false, tr:'mektup',  ov:{ pl:{ gen:'писем' } } },
  { nom:'слово',    g:'n', soft:false, anim:false, tr:'kelime',  ov:{ pl:{ gen:'слов' } } },
  { nom:'дело',     g:'n', soft:false, anim:false, tr:'iş',      ov:{ pl:{ gen:'дел' } } },
  { nom:'место',    g:'n', soft:false, anim:false, tr:'yer',     ov:{ pl:{ gen:'мест' } } },
  { nom:'лицо',     g:'n', soft:false, anim:false, tr:'yüz',     ov:{ pl:{ gen:'лиц' } } },
  { nom:'сердце',   g:'n', soft:true,  anim:false, tr:'kalp',    ov:{ pl:{ gen:'сердец' } } },
  { nom:'здание',   g:'n', soft:true,  anim:false, tr:'bina',    ov:{ pl:{ gen:'зданий' } } },
  { nom:'знание',   g:'n', soft:true,  anim:false, tr:'bilgi',   ov:{ pl:{ gen:'знаний' } } },
  { nom:'море',     g:'n', soft:true,  anim:false, tr:'deniz',   ov:{ pl:{ gen:'морей' } } },
  { nom:'время',    g:'n', soft:true,  anim:false, tr:'zaman', sp:'-мя',
    ov:{ sg:{ gen:'времени', dat:'времени', acc:'время', ins:'временем', pre:'времени' },
         pl:{ nom:'времена', gen:'времён', dat:'временам', acc:'времена', ins:'временами', pre:'временах' } } },
  { nom:'имя',      g:'n', soft:true,  anim:false, tr:'isim', sp:'-мя',
    ov:{ sg:{ gen:'имени', dat:'имени', acc:'имя', ins:'именем', pre:'имени' },
         pl:{ nom:'имена', gen:'имён', dat:'именам', acc:'имена', ins:'именами', pre:'именах' } } }
];

const VERBS = [
  { inf:'читать',   c:1, tr:'okumak',        perf:'прочитать',
    pr:['читаю','читаешь','читает','читаем','читаете','читают'],
    pa:{ m:'читал', f:'читала', n:'читало', pl:'читали' },
    im:{ sg:'читай', pl:'читайте' } },
  { inf:'знать',    c:1, tr:'bilmek',        perf:'узнать',
    pr:['знаю','знаешь','знает','знаем','знаете','знают'],
    pa:{ m:'знал', f:'знала', n:'знало', pl:'знали' },
    im:{ sg:'знай', pl:'знайте' } },
  { inf:'работать', c:1, tr:'çalışmak',      perf:'поработать',
    pr:['работаю','работаешь','работает','работаем','работаете','работают'],
    pa:{ m:'работал', f:'работала', n:'работало', pl:'работали' },
    im:{ sg:'работай', pl:'работайте' } },
  { inf:'думать',   c:1, tr:'düşünmek',      perf:'подумать',
    pr:['думаю','думаешь','думает','думаем','думаете','думают'],
    pa:{ m:'думал', f:'думала', n:'думало', pl:'думали' },
    im:{ sg:'думай', pl:'думайте' } },
  { inf:'делать',   c:1, tr:'yapmak',        perf:'сделать',
    pr:['делаю','делаешь','делает','делаем','делаете','делают'],
    pa:{ m:'делал', f:'делала', n:'делало', pl:'делали' },
    im:{ sg:'делай', pl:'делайте' } },
  { inf:'понимать', c:1, tr:'anlamak',       perf:'понять',
    pr:['понимаю','понимаешь','понимает','понимаем','понимаете','понимают'],
    pa:{ m:'понимал', f:'понимала', n:'понимало', pl:'понимали' },
    im:{ sg:'понимай', pl:'понимайте' } },
  { inf:'гулять',   c:1, tr:'gezmek',        perf:'погулять',
    pr:['гуляю','гуляешь','гуляет','гуляем','гуляете','гуляют'],
    pa:{ m:'гулял', f:'гуляла', n:'гуляло', pl:'гуляли' },
    im:{ sg:'гуляй', pl:'гуляйте' } },
  { inf:'играть',   c:1, tr:'oynamak',       perf:'поиграть',
    pr:['играю','играешь','играет','играем','играете','играют'],
    pa:{ m:'играл', f:'играла', n:'играло', pl:'играли' },
    im:{ sg:'играй', pl:'играйте' } },
  { inf:'говорить', c:2, tr:'konuşmak',      perf:'сказать',
    pr:['говорю','говоришь','говорит','говорим','говорите','говорят'],
    pa:{ m:'говорил', f:'говорила', n:'говорило', pl:'говорили' },
    im:{ sg:'говори', pl:'говорите' } },
  { inf:'любить',   c:2, tr:'sevmek',        perf:'полюбить',
    pr:['люблю','любишь','любит','любим','любите','любят'],
    pa:{ m:'любил', f:'любила', n:'любило', pl:'любили' },
    im:{ sg:'люби', pl:'любите' } },
  { inf:'видеть',   c:2, tr:'görmek',        perf:'увидеть',
    pr:['вижу','видишь','видит','видим','видите','видят'],
    pa:{ m:'видел', f:'видела', n:'видело', pl:'видели' },
    im:{ sg:'смотри', pl:'смотрите' } },
  { inf:'смотреть', c:2, tr:'izlemek',       perf:'посмотреть',
    pr:['смотрю','смотришь','смотрит','смотрим','смотрите','смотрят'],
    pa:{ m:'смотрел', f:'смотрела', n:'смотрело', pl:'смотрели' },
    im:{ sg:'смотри', pl:'смотрите' } },
  { inf:'помнить',  c:2, tr:'hatırlamak',    perf:'запомнить',
    pr:['помню','помнишь','помнит','помним','помните','помнят'],
    pa:{ m:'помнил', f:'помнила', n:'помнило', pl:'помнили' },
    im:{ sg:'помни', pl:'помните' } },
  { inf:'учить',    c:2, tr:'öğrenmek',      perf:'выучить',
    pr:['учу','учишь','учит','учим','учите','учат'],
    pa:{ m:'учил', f:'учила', n:'учило', pl:'учили' },
    im:{ sg:'учи', pl:'учите' } },
  { inf:'строить',  c:2, tr:'inşa etmek',    perf:'построить',
    pr:['строю','строишь','строит','строим','строите','строят'],
    pa:{ m:'строил', f:'строила', n:'строило', pl:'строили' },
    im:{ sg:'строй', pl:'стройте' } },
  { inf:'готовить', c:2, tr:'hazırlamak',    perf:'приготовить',
    pr:['готовлю','готовишь','готовит','готовим','готовите','готовят'],
    pa:{ m:'готовил', f:'готовила', n:'готовило', pl:'готовили' },
    im:{ sg:'готовь', pl:'готовьте' } },
  { inf:'звонить',  c:2, tr:'telefon etmek', perf:'позвонить',
    pr:['звоню','звонишь','звонит','звоним','звоните','звонят'],
    pa:{ m:'звонил', f:'звонила', n:'звонило', pl:'звонили' },
    im:{ sg:'звони', pl:'звоните' } }
];

const ADJS = [
  { m:'новый',      tr:'yeni' },
  { m:'старый',     tr:'eski' },
  { m:'большой',    tr:'büyük' },
  { m:'маленький',  tr:'küçük' },
  { m:'хороший',    tr:'iyi' },
  { m:'плохой',     tr:'kötü' },
  { m:'красивый',   tr:'güzel' },
  { m:'интересный', tr:'ilginç' },
  { m:'важный',     tr:'önemli' },
  { m:'трудный',    tr:'zor' },
  { m:'молодой',    tr:'genç' },
  { m:'русский',    tr:'Rus' },
  { m:'белый',      tr:'beyaz' },
  { m:'чёрный',     tr:'siyah' },
  { m:'холодный',   tr:'soğuk' },
  { m:'тёплый',     tr:'ılık' },
  { m:'добрый',     tr:'iyi kalpli' }
];

const PERF_FUT = {
  'прочитать':   ['прочитаю','прочитаешь','прочитает','прочитаем','прочитаете','прочитают'],
  'узнать':      ['узнаю','узнаешь','узнает','узнаем','узнаете','узнают'],
  'поработать':  ['поработаю','поработаешь','поработает','поработаем','поработаете','поработают'],
  'подумать':    ['подумаю','подумаешь','подумает','подумаем','подумаете','подумают'],
  'сделать':     ['сделаю','сделаешь','сделает','сделаем','сделаете','сделают'],
  'понять':      ['пойму','поймёшь','поймёт','поймём','поймёте','поймут'],
  'погулять':    ['погуляю','погуляешь','погуляет','погуляем','погуляете','погуляют'],
  'поиграть':    ['поиграю','поиграешь','поиграет','поиграем','поиграете','поиграют'],
  'сказать':     ['скажу','скажешь','скажет','скажем','скажете','скажут'],
  'полюбить':    ['полюблю','полюбишь','полюбит','полюбим','полюбите','полюбят'],
  'увидеть':     ['увижу','увидишь','увидит','увидим','увидите','увидят'],
  'посмотреть':  ['посмотрю','посмотришь','посмотрит','посмотрим','посмотрите','посмотрят'],
  'запомнить':   ['запомню','запомнишь','запомнит','запомним','запомните','запомнят'],
  'выучить':     ['выучу','выучишь','выучит','выучим','выучите','выучат'],
  'построить':   ['построю','построишь','построит','построим','построите','построят'],
  'приготовить': ['приготовлю','приготовишь','приготовит','приготовим','приготовите','приготовят'],
  'позвонить':   ['позвоню','позвонишь','позвонит','позвоним','позвоните','позвонят']
};

/* ============================================================
   3) ÇEKİM MOTORU
   ============================================================ */

function afterWriteRule(stem) {
  return 'кгхжчшщ'.includes(stem.slice(-1).toLowerCase());
}

function getStem(n) {
  const s = n.nom;
  if (n.sp === '-мя') return s.slice(0, -2);
  if (/[аяоеё]$/.test(s)) return s.slice(0, -1);
  if (/[ьй]$/.test(s)) return s.slice(0, -1);
  return s;
}

function declineSg(n, c) {
  if (n.ov && n.ov.sg && n.ov.sg[c]) return n.ov.sg[c];

  const st = getStem(n);
  const g = n.g, sf = n.soft, an = n.anim;
  const isA  = n.nom.endsWith('а');
  const isYa = n.nom.endsWith('я');
  const isY  = n.nom.endsWith('ь');

  switch (c) {
    case 'nom': return n.nom;

    case 'gen':
      if (g === 'm') return st + (sf ? 'я' : 'а');
      if (g === 'f') {
        if (isA) return st + (afterWriteRule(st) ? 'и' : 'ы');
        return st + 'и';
      }
      return st + (sf ? 'я' : 'а');

    case 'dat':
      if (g === 'm') return st + (sf ? 'ю' : 'у');
      if (g === 'f') {
        if (isA || isYa) return st + 'е';
        return st + 'и';
      }
      return st + (sf ? 'ю' : 'у');

    case 'acc':
      if (g === 'm') return an ? (st + (sf ? 'я' : 'а')) : n.nom;
      if (g === 'f') {
        if (isA)  return st + 'у';
        if (isYa) return st + 'ю';
        return n.nom;
      }
      return n.nom;

    case 'ins':
      if (g === 'm') return st + (sf ? 'ем' : 'ом');
      if (g === 'f') {
        if (isA)  return st + 'ой';
        if (isYa) return st + 'ей';
        if (isY)  return st + 'ью';
        return st + 'ей';
      }
      return st + (sf ? 'ем' : 'ом');

    case 'pre':
      if (n.nom.endsWith('ия') || n.nom.endsWith('ие') || n.nom.endsWith('ий')) {
        return st + 'и';
      }
      return st + 'е';
  }
  return n.nom;
}

function declinePl(n, c) {
  if (n.ov && n.ov.pl && n.ov.pl[c]) return n.ov.pl[c];

  const st = getStem(n);
  const g = n.g, sf = n.soft, an = n.anim;
  const isA  = n.nom.endsWith('а');
  const isYy = n.nom.endsWith('й');

  switch (c) {
    case 'nom':
      if (g === 'm') {
        if (isYy || sf) return st + 'и';
        return st + (afterWriteRule(st) ? 'и' : 'ы');
      }
      if (g === 'f') {
        if (isA) return st + (afterWriteRule(st) ? 'и' : 'ы');
        return st + 'и';
      }
      return st + (sf ? 'я' : 'а');

    case 'gen':
      if (g === 'm') {
        if (isYy) return st + 'ев';
        if (sf)   return st + 'ей';
        return st + 'ов';
      }
      if (g === 'f') {
        if (isA) return st;
        return st + 'ей';
      }
      return st;

    case 'dat':
      return sf ? st + 'ям' : st + 'ам';

    case 'acc':
      return an ? declinePl(n, 'gen') : declinePl(n, 'nom');

    case 'ins':
      return sf ? st + 'ями' : st + 'ами';

    case 'pre':
      return sf ? st + 'ях' : st + 'ах';
  }
  return n.nom;
}

function declineNoun(n, c, pl) {
  return pl ? declinePl(n, c) : declineSg(n, c);
}

function declineAdj(a, c, gender, pl) {
  const base = a.m;
  let st = base;
  if (base.endsWith('ий')) st = base.slice(0, -2);
  else if (base.endsWith('ый')) st = base.slice(0, -2);
  else if (base.endsWith('ой')) st = base.slice(0, -2);

  const T = {
    nom: { m: base,       f: st + 'ая',  n: st + 'ое',  p: st + 'ые' },
    gen: { m: st + 'ого', f: st + 'ой',  n: st + 'ого', p: st + 'ых' },
    dat: { m: st + 'ому', f: st + 'ой',  n: st + 'ому', p: st + 'ым' },
    acc: { m: base,       f: st + 'ую',  n: st + 'ое',  p: st + 'ые' },
    ins: { m: st + 'ым',  f: st + 'ой',  n: st + 'ым',  p: st + 'ыми' },
    pre: { m: st + 'ом',  f: st + 'ой',  n: st + 'ом',  p: st + 'ых' }
  };
  const r = T[c];
  if (pl) return r.p;
  if (gender === 'm') return r.m;
  if (gender === 'f') return r.f;
  return r.n;
}

function caseRuleBrief(n, c, pl) {
  if (pl) {
    return {
      gen: 'Çoğul Gen: -ов/-ев/-ей (bazıları ∅)',
      dat: 'Çoğul Dat: -ам / -ям',
      acc: n.anim ? 'Canlı → çoğul Gen gibi' : 'Cansız → çoğul Nom gibi',
      ins: 'Çoğul Ins: -ами / -ями',
      pre: 'Çoğul Pre: -ах / -ях'
    }[c];
  }
  const R = {
    gen: { m: n.soft ? '-я' : '-а', f: '-ы/-и', n: n.soft ? '-я' : '-а' },
    dat: { m: n.soft ? '-ю' : '-у', f: '-е',     n: n.soft ? '-ю' : '-у' },
    acc: { m: n.anim ? (n.soft ? '-я' : '-а') : '= Nom', f: n.soft ? '-ю / ∅' : '-у', n: '= Nom' },
    ins: { m: n.soft ? '-ем' : '-ом', f: n.soft ? '-ей/-ью' : '-ой', n: n.soft ? '-ем' : '-ом' },
    pre: { m: '-е', f: '-е', n: '-е' }
  };
  return R[c][n.g];
}

/* ============================================================
   4) SORU ÜRETİCİLERİ
   ============================================================ */

/* ---------- A1 ---------- */
function qA1_gender() {
  const n = pick(NOUNS.filter(x => x.sp !== '-мя'));
  const full = G_TR[n.g] + (n.g === 'm' ? ' (мужской)' : n.g === 'f' ? ' (женский)' : ' (средний)');
  return {
    level: 'A1', topic: 'Cinsiyet', type: 'choice',
    q: 'Bu kelimenin cinsiyeti nedir?',
    word: n.nom,
    choices: shuffle(['Eril (мужской)', 'Dişil (женский)', 'Nötr (средний)']),
    answer: full,
    exp: `<b>${n.nom}</b> = ${n.tr}. Son harfe bakarak cinsiyet belirlenir.`,
    rule: n.g === 'm' ? 'Ünsüzle veya -й/-ь ile biten isimler çoğunlukla erildir.'
        : n.g === 'f' ? '-а / -я ile biten isimler dişildir; -ь ile bitenlerin çoğu da dişidir.'
        : '-о / -е (ve -мя) ile biten isimler nötrdür.',
    ex: '',
    sig: 'a1g-' + n.nom
  };
}

function qA1_plural() {
  const n = pick(NOUNS.filter(x => x.sp !== '-мя'));
  const correct = declineNoun(n, 'nom', true);
  return {
    level: 'A1', topic: 'Çoğul', type: 'text',
    q: 'Bu kelimeyi çoğul yap:',
    word: n.nom,
    hint: `(${n.tr} → ${n.tr}lar)`,
    answer: correct,
    exp: `${n.nom} → <b>${correct}</b>. Cinsiyet: ${G_TR[n.g]}, gövde: ${n.soft ? 'yumuşak' : 'sert'}.`,
    rule: n.g === 'm' ? (n.soft ? 'Eril yumuşak → -и.' : 'Eril sert → -ы (к/г/х/ж/ч/ш/щ sonrası -и).')
        : n.g === 'f' ? '-а → -ы (к/г/х/ж/ч/ш/щ sonrası -и); -я/-ь → -и.'
        : 'Nötr: -о → -а, -е → -я.',
    ex: `<span class="ru">Вот ${correct}.</span><span class="tr">İşte ${n.tr}lar.</span>`,
    sig: 'a1p-' + n.nom
  };
}

function qA1_adjnom() {
  const n = pick(NOUNS);
  const a = pick(ADJS);
  const adjF = declineAdj(a, 'nom', n.g, false);
  const correct = adjF + ' ' + n.nom;
  return {
    level: 'A1', topic: 'Sıfat Uyumu', type: 'text',
    q: "Sıfatı Nominative'de isme uygun hâle getir:",
    word: `${a.m} + ${n.nom}`,
    hint: `(${a.tr} ${n.tr})`,
    answer: correct,
    exp: `<b>${n.nom}</b> → ${G_TR[n.g]} → sıfat <b>${adjF}</b>.`,
    rule: 'Sıfat isimle cinsiyet/sayı/case uyumundadır.',
    ex: `<span class="ru">${correct}.</span><span class="tr">${cap(a.tr)} ${n.tr}.</span>`,
    sig: 'a1an-' + a.m + '-' + n.nom
  };
}

function qA1_meaning() {
  const n = pick(NOUNS);
  const pool = [...new Set(NOUNS.filter(x => x.tr !== n.tr).map(x => x.tr))];
  const wrongs = shuffle(pool).slice(0, 3);
  return {
    level: 'A1', topic: 'Kelime', type: 'choice',
    q: 'Bu kelimenin Türkçe anlamı hangisi?',
    word: n.nom,
    choices: shuffle([n.tr, ...wrongs]),
    answer: n.tr,
    exp: `<b>${n.nom}</b> = <b>${n.tr}</b>. Cinsiyet: ${G_TR[n.g]}.`,
    rule: 'Temel kelime bilgisi.',
    ex: '',
    sig: 'a1m-' + n.nom
  };
}

/* ---------- A2 ---------- */
function qA2_case(c) {
  const n = pick(NOUNS.filter(x => x.sp !== '-мя'));
  const correct = declineNoun(n, c, false);
  const prefix = {
    gen: 'Genitive (tamlayan)', dat: 'Dative (yönelme)',
    acc: 'Accusative (belirtme)', ins: 'Instrumental (araç)',
    pre: 'Prepositional (bulunma)'
  }[c];
  const exs = {
    gen: 'У меня нет ' + correct + '.',
    dat: 'Я иду к ' + correct + '.',
    acc: 'Я вижу ' + correct + '.',
    ins: 'Я горжусь ' + correct + '.',
    pre: 'Я думаю о ' + correct + '.'
  };
  return {
    level: 'A2', topic: 'Case: ' + prefix, type: 'text',
    q: `Bu kelimeyi ${prefix} hâline getir:`,
    word: n.nom,
    hint: `(${n.tr})`,
    answer: correct,
    exp: `${n.nom} → <b>${correct}</b>. Cinsiyet: ${G_TR[n.g]}, gövde: ${n.soft ? 'yumuşak' : 'sert'}${c === 'acc' ? ', ' + (n.anim ? 'canlı' : 'cansız') : ''}.`,
    rule: `${C_TR[c]} → ${caseRuleBrief(n, c, false)}`,
    ex: `<span class="ru">${exs[c]}</span>`,
    sig: 'a2-' + c + '-' + n.nom
  };
}

/* ---------- B1 ---------- */
function qB1_plcase() {
  const c = pick(['gen', 'dat', 'acc', 'ins', 'pre']);
  const n = pick(NOUNS);
  const correct = declineNoun(n, c, true);
  const exs = {
    gen: 'Много ' + correct + '.', dat: 'К ' + correct + '.',
    acc: 'Я вижу ' + correct + '.', ins: 'С ' + correct + '.',
    pre: 'О ' + correct + '.'
  };
  return {
    level: 'B1', topic: 'Çoğul Case', type: 'text',
    q: `Çoğul ${C_TR[c]} hâline getir:`,
    word: n.nom,
    hint: `(${n.tr})`,
    answer: correct,
    exp: `${n.nom} → çoğul ${C_TR[c]} → <b>${correct}</b>.`,
    rule: caseRuleBrief(n, c, true),
    ex: `<span class="ru">${exs[c]}</span>`,
    sig: 'b1p-' + c + '-' + n.nom
  };
}

function qB1_adjcase() {
  const c = pick(['gen', 'dat', 'ins', 'pre']);
  const n = pick(NOUNS);
  const a = pick(ADJS);
  const adjF = declineAdj(a, c, n.g, false);
  const nounF = declineNoun(n, c, false);
  const correct = adjF + ' ' + nounF;
  return {
    level: 'B1', topic: 'Sıfat + Case', type: 'text',
    q: `Sıfatı ve ismi ${C_TR[c]} hâlinde yaz:`,
    word: `${a.m} + ${n.nom}`,
    hint: `(${a.tr} ${n.tr})`,
    answer: correct,
    exp: `<b>${n.nom}</b> (${G_TR[n.g]}) → sıfat <b>${adjF}</b> + isim <b>${nounF}</b>.`,
    rule: 'Sıfat ve isim her zaman aynı cinsiyet/sayı/case uyumundadır.',
    ex: `<span class="ru">${correct}.</span>`,
    sig: 'b1a-' + c + '-' + a.m + '-' + n.nom
  };
}

function qB1_verb_pres() {
  const v = pick(VERBS);
  const i = Math.floor(Math.random() * 6);
  const pron   = ['я', 'ты', 'он', 'мы', 'вы', 'они'][i];
  const pronTR = ['ben', 'sen', 'o', 'biz', 'siz', 'onlar'][i];
  const correct = v.pr[i];
  return {
    level: 'B1', topic: 'Fiil Şimdiki', type: 'text',
    q: `"${v.tr}" fiilini "${pronTR}" için çekimle:`,
    word: v.inf + ' → ' + pron,
    hint: '(şimdiki zaman)',
    answer: correct,
    exp: `<b>${v.inf}</b> (${v.c}. çekim) → ${pron} → <b>${correct}</b>.`,
    rule: v.c === 1
      ? 'I. çekim: -ю, -ешь, -ет, -ем, -ете, -ют.'
      : 'II. çekim: -ю, -ишь, -ит, -им, -ите, -ят.',
    ex: `<span class="ru">${pron} ${correct}.</span>`,
    sig: 'b1vp-' + v.inf + '-' + i
  };
}

function qB1_verb_past() {
  const v = pick(VERBS);
  const g = pick(['m', 'f', 'n', 'pl']);
  const correct = v.pa[g];
  const lbl = { m: 'eril (он)', f: 'dişil (она)', n: 'nötr (оно)', pl: 'çoğul (они)' }[g];
  return {
    level: 'B1', topic: 'Geçmiş Zaman', type: 'text',
    q: `"${v.tr}" fiilini geçmiş zamanda ${lbl} için çekimle:`,
    word: v.inf,
    hint: `(geçmiş — ${lbl})`,
    answer: correct,
    exp: `<b>${v.inf}</b> → ${lbl} → <b>${correct}</b>.`,
    rule: 'Geçmiş: eril -л, dişil -ла, nötr -ло, çoğul -ли.',
    ex: `<span class="ru">${correct}.</span>`,
    sig: 'b1vpa-' + v.inf + '-' + g
  };
}

/* ---------- B2 ---------- */
function qB2_aspect() {
  const v = pick(VERBS);
  const perf = Math.random() < 0.5;
  const adv = perf
    ? pick(['вчера', 'уже', 'наконец', 'за час', 'быстро'])
    : pick(['весь вечер', 'долго', 'часто', 'всегда', 'иногда']);
  const correct = perf ? v.perf : v.inf;
  return {
    level: 'B2', topic: 'Fiil Görünüşü', type: 'choice',
    q: `"${adv}" ifadesine hangi görünüş uygun? (${v.tr})`,
    word: v.inf + ' / ' + v.perf,
    choices: shuffle([v.inf, v.perf]),
    answer: correct,
    exp: perf
      ? `"${adv}" → tamamlanmış/sonuç → Совершенный: <b>${v.perf}</b>.`
      : `"${adv}" → süreç/alışkanlık → Несовершенный: <b>${v.inf}</b>.`,
    rule: 'Несов. = süreç, alışkanlık, tekrar. Сов. = tek seferlik tamamlanmış sonuç.',
    ex: `<span class="ru">Я ${adv} ${correct}…</span>`,
    sig: 'b2as-' + v.inf + '-' + adv
  };
}

function qB2_future() {
  const v = pick(VERBS);
  const i = Math.floor(Math.random() * 6);
  const pron   = ['я', 'ты', 'он', 'мы', 'вы', 'они'][i];
  const pronTR = ['ben', 'sen', 'o', 'biz', 'siz', 'onlar'][i];
  const perf = Math.random() < 0.5;

  let correct;
  if (perf) {
    correct = (PERF_FUT[v.perf] || ['—','—','—','—','—','—'])[i];
  } else {
    correct = ['буду','будешь','будет','будем','будете','будут'][i] + ' ' + v.inf;
  }

  return {
    level: 'B2', topic: 'Gelecek Zaman', type: 'text',
    q: `"${v.tr}" fiilini "${pronTR}" için ${perf ? 'Совершенный' : 'Несовершенный'} gelecek zamanda çekimle:`,
    word: v.inf + ' → ' + pron,
    hint: perf ? '(tamamlanmış gelecek — tek kelime)' : '(süreç gelecek — быть + mastar)',
    answer: correct,
    exp: perf
      ? `Сов. gelecek = şimdiki çekimi: <b>${correct}</b>.`
      : `Несов. gelecek = "быть + mastar": <b>${correct}</b>.`,
    rule: 'Несов. gelecek: буду/будешь/… + mastar. Сов. gelecek: tek kelime (şimdiki çekimi).',
    ex: `<span class="ru">${pron} ${correct}.</span>`,
    sig: 'b2f-' + v.inf + '-' + i + '-' + perf
  };
}

function qB2_imper() {
  const v = pick(VERBS);
  const siz = Math.random() < 0.5;
  const correct = siz ? v.im.pl : v.im.sg;
  return {
    level: 'B2', topic: 'Emir Kipi', type: 'text',
    q: `"${v.tr}" fiilinin emir kipini yaz (${siz ? 'siz/kibar' : 'sen'}):`,
    word: v.inf,
    hint: siz ? '(okuyun!)' : '(oku!)',
    answer: correct,
    exp: `<b>${v.inf}</b> → emir (${siz ? 'siz' : 'sen'}) → <b>${correct}</b>.`,
    rule: 'Sen → -й/-и. Siz → -йте/-ите.',
    ex: `<span class="ru">${correct}!</span>`,
    sig: 'b2i-' + v.inf + '-' + siz
  };
}

/* ---------- C1 ---------- */
function qC1_adjfull() {
  const c = pick(['gen', 'dat', 'ins', 'pre']);
  const n = pick(NOUNS);
  const a = pick(ADJS);
  const pl = Math.random() < 0.4;
  const adjF = declineAdj(a, c, n.g, pl);
  const nounF = declineNoun(n, c, pl);
  const correct = adjF + ' ' + nounF;
  return {
    level: 'C1', topic: 'Sıfat Tam Çekim', type: 'text',
    q: `"${a.tr} ${n.tr}" ifadesini ${pl ? 'çoğul ' : ''}${C_TR[c]} hâline getir:`,
    word: `${a.m} + ${n.nom}`,
    hint: `(${a.tr} ${n.tr})`,
    answer: correct,
    exp: `Sıfat <b>${adjF}</b> + isim <b>${nounF}</b>.`,
    rule: 'Sıfat + isim her zaman aynı cinsiyet/sayı/case uyumunda.',
    ex: `<span class="ru">${correct}.</span>`,
    sig: 'c1a-' + c + '-' + a.m + '-' + n.nom + '-' + pl
  };
}

function qC1_gerund() {
  const v = pick(VERBS);
  const perf = Math.random() < 0.4;
  const nsG = v.pr[5].replace(/[юя]т$/, 'я');
  const sG = v.perf.replace(/ть$/, 'в');
  const correct = perf ? sG : nsG;
  return {
    level: 'C1', topic: 'Ulaç', type: 'text',
    q: `"${v.tr}" fiilinin ${perf ? 'geçmiş (сов.)' : 'şimdiki (несов.)'} ulaç biçimini yaz:`,
    word: v.inf,
    hint: perf ? '(okuyup)' : '(okuyarak)',
    answer: correct,
    exp: perf
      ? `Сов. ulaç → -в/-вши → <b>${correct}</b>.`
      : `Несов. ulaç → -я/-а → <b>${correct}</b>.`,
    rule: 'Несов. → -я/-а. Сов. → -в/-вши.',
    ex: `<span class="ru">Он сидел, ${correct}.</span>`,
    sig: 'c1g-' + v.inf + '-' + perf
  };
}

/* ---------- C2 ---------- */
function qC2_prep() {
  const preps = [
    { p:'в',   c:'pre', tr:'-de (yer)' },
    { p:'в',   c:'acc', tr:'-e (yön)' },
    { p:'на',  c:'pre', tr:'-de (yer)' },
    { p:'на',  c:'acc', tr:'-e (yön)' },
    { p:'у',   c:'gen', tr:'yanında/bende' },
    { p:'к',   c:'dat', tr:'-e doğru' },
    { p:'с',   c:'ins', tr:'ile' },
    { p:'о',   c:'pre', tr:'hakkında' },
    { p:'из',  c:'gen', tr:'-den (içinden)' },
    { p:'от',  c:'gen', tr:'-den (kişiden)' },
    { p:'до',  c:'gen', tr:'-e kadar' },
    { p:'без', c:'gen', tr:'-sız' },
    { p:'для', c:'gen', tr:'için' }
  ];
  const it = pick(preps);
  const n = pick(NOUNS.filter(x => x.sp !== '-мя'));
  const nounF = declineNoun(n, it.c, false);
  const correct = it.p + ' ' + nounF;
  return {
    level: 'C2', topic: 'Edat + Case', type: 'text',
    q: `"${n.tr}" ismini "${it.p}" edatıyla kullan (${it.tr}):`,
    word: it.p + ' + ' + n.nom,
    hint: `(${it.tr})`,
    answer: correct,
    exp: `<b>${it.p}</b> edatı ${C_TR[it.c]} ister → <b>${nounF}</b>.`,
    rule: `${it.p} edatı → ${C_TR[it.c]}.`,
    ex: `<span class="ru">${correct}.</span>`,
    sig: 'c2p-' + it.p + '-' + n.nom
  };
}

function qC2_number() {
  const nums = [
    { n:1,  ru:'один',   rule:'tekil Nom' },
    { n:2,  ru:'два',    rule:'tekil Gen' },
    { n:3,  ru:'три',    rule:'tekil Gen' },
    { n:4,  ru:'четыре', rule:'tekil Gen' },
    { n:5,  ru:'пять',   rule:'çoğul Gen' },
    { n:6,  ru:'шесть',  rule:'çoğul Gen' },
    { n:10, ru:'десять', rule:'çoğul Gen' }
  ];
  const it = pick(nums);
  const n = pick(NOUNS.filter(x => x.sp !== '-мя'));

  let correct;
  if (it.n === 1) {
    const numF = n.g === 'f' ? 'одна' : n.g === 'n' ? 'одно' : 'один';
    correct = numF + ' ' + n.nom;
  } else if (it.n >= 2 && it.n <= 4) {
    const numF = (n.g === 'f' && it.n === 2) ? 'две' : it.ru;
    correct = numF + ' ' + declineNoun(n, 'gen', false);
  } else {
    correct = it.ru + ' ' + declineNoun(n, 'gen', true);
  }

  return {
    level: 'C2', topic: 'Sayı + Case', type: 'text',
    q: `"${it.n}" sayısıyla "${n.tr}" ifadesini yaz:`,
    word: it.ru + ' + ' + n.nom,
    hint: `(${it.rule})`,
    answer: correct,
    exp: `${it.n} → ${it.rule}. Cinsiyet: ${G_TR[n.g]}. Sonuç: <b>${correct}</b>.`,
    rule: '1 → tekil Nom; 2-4 → tekil Gen; 5+ → çoğul Gen. 2 için dişi "две".',
    ex: `<span class="ru">${correct}.</span>`,
    sig: 'c2n-' + it.n + '-' + n.nom
  };
}

/* ---------- Seviye → generator haritası ---------- */
const GENS = {
  A1: [
    { topicKey:'gender',  fn: qA1_gender },
    { topicKey:'plural',  fn: qA1_plural },
    { topicKey:'adj',     fn: qA1_adjnom },
    { topicKey:'meaning', fn: qA1_meaning }
  ],
  A2: [
    { topicKey:'case-gen', fn: () => qA2_case('gen') },
    { topicKey:'case-dat', fn: () => qA2_case('dat') },
    { topicKey:'case-acc', fn: () => qA2_case('acc') },
    { topicKey:'case-ins', fn: () => qA2_case('ins') },
    { topicKey:'case-pre', fn: () => qA2_case('pre') }
  ],
  B1: [
    { topicKey:'plcase', fn: qB1_plcase },
    { topicKey:'adjcase', fn: qB1_adjcase },
    { topicKey:'vpres',  fn: qB1_verb_pres },
    { topicKey:'vpast',  fn: qB1_verb_past }
  ],
  B2: [
    { topicKey:'aspect', fn: qB2_aspect },
    { topicKey:'future', fn: qB2_future },
    { topicKey:'imper',  fn: qB2_imper }
  ],
  C1: [
    { topicKey:'adjfull', fn: qC1_adjfull },
    { topicKey:'gerund',  fn: qC1_gerund }
  ],
  C2: [
    { topicKey:'prep',   fn: qC2_prep },
    { topicKey:'number', fn: qC2_number }
  ]
};

/* ============================================================
   5) REFERANS İÇERİKLERİ
   ============================================================ */

const REF = {
  'Case': `
    <table>
      <tr><th>#</th><th>Case</th><th>Soru</th><th>Türkçe</th></tr>
      <tr><td>1</td><td class="ru">Именительный</td><td>Кто? Что?</td><td>Yalın (özne)</td></tr>
      <tr><td>2</td><td class="ru">Родительный</td><td>Кого? Чего?</td><td>-in / -den</td></tr>
      <tr><td>3</td><td class="ru">Дательный</td><td>Кому? Чему?</td><td>-e (yönelme)</td></tr>
      <tr><td>4</td><td class="ru">Винительный</td><td>Кого? Что?</td><td>-i (belirtme)</td></tr>
      <tr><td>5</td><td class="ru">Творительный</td><td>Кем? Чем?</td><td>-ile</td></tr>
      <tr><td>6</td><td class="ru">Предложный</td><td>О ком? Где?</td><td>-de / hakkında</td></tr>
    </table>`,

  'Ekler': `
    <table>
      <tr><th>Case</th><th>Eril</th><th>Dişil</th><th>Nötr</th></tr>
      <tr><td>Nom</td><td class="ru">-∅/-й/-ь</td><td class="ru">-а/-я/-ь</td><td class="ru">-о/-е</td></tr>
      <tr><td>Gen</td><td class="ru">-а/-я</td><td class="ru">-ы/-и</td><td class="ru">-а/-я</td></tr>
      <tr><td>Dat</td><td class="ru">-у/-ю</td><td class="ru">-е</td><td class="ru">-у/-ю</td></tr>
      <tr><td>Acc</td><td class="ru">canlı: Gen · cansız: Nom</td><td class="ru">-у/-ю</td><td class="ru">= Nom</td></tr>
      <tr><td>Ins</td><td class="ru">-ом/-ем</td><td class="ru">-ой/-ей/-ью</td><td class="ru">-ом/-ем</td></tr>
      <tr><td>Pre</td><td class="ru">-е</td><td class="ru">-е</td><td class="ru">-е</td></tr>
    </table>
    <table style="margin-top:12px">
      <tr><th>Çoğul</th><th>Ek</th></tr>
      <tr><td>Nom</td><td class="ru">-ы/-и · -а/-я</td></tr>
      <tr><td>Gen</td><td class="ru">-ов/-ев/-ей · bazen ∅</td></tr>
      <tr><td>Dat</td><td class="ru">-ам/-ям</td></tr>
      <tr><td>Ins</td><td class="ru">-ами/-ями</td></tr>
      <tr><td>Pre</td><td class="ru">-ах/-ях</td></tr>
    </table>`,

  'Zamir': `
    <table>
      <tr><th>Case</th><th>я</th><th>ты</th><th>он/она</th><th>мы</th><th>вы</th><th>они</th></tr>
      <tr><td>Nom</td><td class="ru">я</td><td class="ru">ты</td><td class="ru">он/она</td><td class="ru">мы</td><td class="ru">вы</td><td class="ru">они</td></tr>
      <tr><td>Gen</td><td class="ru">меня</td><td class="ru">тебя</td><td class="ru">его/её</td><td class="ru">нас</td><td class="ru">вас</td><td class="ru">их</td></tr>
      <tr><td>Dat</td><td class="ru">мне</td><td class="ru">тебе</td><td class="ru">ему/ей</td><td class="ru">нам</td><td class="ru">вам</td><td class="ru">им</td></tr>
      <tr><td>Acc</td><td class="ru">меня</td><td class="ru">тебя</td><td class="ru">его/её</td><td class="ru">нас</td><td class="ru">вас</td><td class="ru">их</td></tr>
      <tr><td>Ins</td><td class="ru">мной</td><td class="ru">тобой</td><td class="ru">им/ей</td><td class="ru">нами</td><td class="ru">вами</td><td class="ru">ими</td></tr>
      <tr><td>Pre</td><td class="ru">мне</td><td class="ru">тебе</td><td class="ru">нём/ней</td><td class="ru">нас</td><td class="ru">вас</td><td class="ru">них</td></tr>
    </table>
    <p style="margin-top:8px;font-size:13.5px"><b>Not:</b> Edat sonrası 3. şahıslara <b>н-</b> eklenir: <span class="ru">у него, к ней</span>.</p>`,

  'Sıfat': `
    <table>
      <tr><th>Cinsiyet</th><th>Ek</th><th>Örnek</th></tr>
      <tr><td>Eril</td><td class="ru">-ый/-ий/-ой</td><td class="ru">новый</td></tr>
      <tr><td>Dişil</td><td class="ru">-ая/-яя</td><td class="ru">новая</td></tr>
      <tr><td>Nötr</td><td class="ru">-ое/-ее</td><td class="ru">новое</td></tr>
      <tr><td>Çoğul</td><td class="ru">-ые/-ие</td><td class="ru">новые</td></tr>
    </table>
    <p style="margin-top:8px;font-size:13.5px"><b>новая книга</b> örneği:</p>
    <table>
      <tr><th>Case</th><th>Tekil</th><th>Çoğul</th></tr>
      <tr><td>Nom</td><td class="ru">новая книга</td><td class="ru">новые книги</td></tr>
      <tr><td>Gen</td><td class="ru">новой книги</td><td class="ru">новых книг</td></tr>
      <tr><td>Dat</td><td class="ru">новой книге</td><td class="ru">новым книгам</td></tr>
      <tr><td>Acc</td><td class="ru">новую книгу</td><td class="ru">новые книги</td></tr>
      <tr><td>Ins</td><td class="ru">новой книгой</td><td class="ru">новыми книгами</td></tr>
      <tr><td>Pre</td><td class="ru">новой книге</td><td class="ru">новых книгах</td></tr>
    </table>`,

  'Fiil': `
    <p style="font-weight:600;color:var(--primary);margin:4px 0">I. Çekim — читать</p>
    <table>
      <tr><td>я</td><td class="ru">читаю</td><td>мы</td><td class="ru">читаем</td></tr>
      <tr><td>ты</td><td class="ru">читаешь</td><td>вы</td><td class="ru">читаете</td></tr>
      <tr><td>он/она</td><td class="ru">читает</td><td>они</td><td class="ru">читают</td></tr>
    </table>
    <p style="font-weight:600;color:var(--primary);margin:12px 0 4px">II. Çekim — говорить</p>
    <table>
      <tr><td>я</td><td class="ru">говорю</td><td>мы</td><td class="ru">говорим</td></tr>
      <tr><td>ты</td><td class="ru">говоришь</td><td>вы</td><td class="ru">говорите</td></tr>
      <tr><td>он/она</td><td class="ru">говорит</td><td>они</td><td class="ru">говорят</td></tr>
    </table>
    <p style="font-weight:600;color:var(--primary);margin:12px 0 4px">Geçmiş Zaman</p>
    <table>
      <tr><td>Eril</td><td class="ru">читал</td></tr>
      <tr><td>Dişil</td><td class="ru">читала</td></tr>
      <tr><td>Nötr</td><td class="ru">читало</td></tr>
      <tr><td>Çoğul</td><td class="ru">читали</td></tr>
    </table>`,

  'Görünüş': `
    <table>
      <tr><th>Несов.</th><th>Сов.</th><th>Anlam</th></tr>
      <tr><td class="ru">читать</td><td class="ru">прочитать</td><td>okumak / okuyup bitirmek</td></tr>
      <tr><td class="ru">писать</td><td class="ru">написать</td><td>yazmak / yazıp bitirmek</td></tr>
      <tr><td class="ru">делать</td><td class="ru">сделать</td><td>yapmak / yapıp bitirmek</td></tr>
    </table>
    <p style="margin-top:10px;font-size:13.5px"><b>Gelecek zaman:</b> Несов. → <span class="ru">буду + mastar</span>; Сов. → tek kelime (<span class="ru">прочитаю</span>).</p>`,

  'Cinsiyet': `
    <table>
      <tr><th>Cinsiyet</th><th>Son</th><th>Örnek</th></tr>
      <tr><td>Eril</td><td>ünsüz/-й/-ь</td><td class="ru">стол, музей, словарь</td></tr>
      <tr><td>Dişil</td><td>-а/-я/-ь</td><td class="ru">книга, неделя, тетрадь</td></tr>
      <tr><td>Nötr</td><td>-о/-е/-мя</td><td class="ru">окно, море, время</td></tr>
    </table>
    <p style="margin-top:10px;font-size:13.5px"><b>Yazım:</b> к, г, х, ж, ч, ш, щ sonrası -ы değil -и: <span class="ru">книга → книги</span>.</p>`
};

function renderRef() {
  const tabs = $('ref-tabs');
  const content = $('ref-content');
  if (!tabs || !content) return;

  const keys = Object.keys(REF);
  tabs.innerHTML = keys.map((k, i) =>
    `<button type="button" data-k="${k}" class="${i === 0 ? 'active' : ''}">${k}</button>`
  ).join('');
  content.innerHTML = REF[keys[0]];

  tabs.querySelectorAll('button').forEach(b => {
    b.onclick = () => {
      tabs.querySelectorAll('button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      content.innerHTML = REF[b.dataset.k];
    };
  });
}

/* ============================================================
   6) UYGULAMA AKIŞI
   ============================================================ */

const S = {
  level: 'A1',
  q: null,
  locked: false,
  consec: 0,
  ok: 0,
  no: 0,
  streak: 0,
  retryTopic: null,
  mastered: {},
  recent: []
};

const STORAGE_KEY = 'rgram-v5';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    S.mastered = d.mastered || {};
    S.level    = d.level    || 'A1';
    S.ok       = d.ok       || 0;
    S.no       = d.no       || 0;
  } catch (e) { /* yoksay */ }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      mastered: S.mastered,
      level:    S.level,
      ok:       S.ok,
      no:       S.no
    }));
  } catch (e) { /* yoksay */ }
}

function renderLevels() {
  const el = $('levels');
  if (!el) return;
  el.innerHTML = LVLS.map(lv => {
    const isMastered = S.mastered[lv];
    const isActive   = S.level === lv;
    const cls = ['lv-btn'];
    if (isActive)   cls.push('active');
    if (isMastered) cls.push('done');
    return `<button type="button" class="${cls.join(' ')}" data-lv="${lv}" aria-pressed="${isActive}">
      ${isMastered ? '<span class="chk">✓</span>' : ''}
      ${lv}
    </button>`;
  }).join('');
  el.querySelectorAll('.lv-btn').forEach(btn => {
    btn.onclick = () => switchLevel(btn.dataset.lv);
  });
}

function switchLevel(lv) {
  if (S.level === lv) return;
  S.level = lv;
  S.consec = 0;
  S.retryTopic = null;
  S.recent = [];
  saveState();
  renderLevels();
  updateHUD();
  nextQ();
}

function updateHUD() {
  const cur = Math.min(S.consec, NEED);
  const mLabel = $('m-label');
  const mText  = $('m-text');
  const mFill  = $('m-fill');
  if (mLabel) mLabel.textContent = `${S.level} (${LVL_NAME[S.level]}) ustalığı`;
  if (mText)  mText.textContent  = `${cur} / ${NEED}`;
  if (mFill)  mFill.style.width  = (cur / NEED * 100) + '%';
  const so = $('st-ok'), sn = $('st-no'), ss = $('st-st');
  if (so) so.textContent = S.ok;
  if (sn) sn.textContent = S.no;
  if (ss) ss.textContent = S.streak;
}

function genQ() {
  let pool = GENS[S.level];

  if (S.retryTopic) {
    const filtered = pool.filter(g => g.topicKey === S.retryTopic);
    if (filtered.length) pool = filtered;
  }

  let q, item, attempts = 0;
  do {
    item = pick(pool);
    q = item.fn();
    q.topicKey = item.topicKey;
    attempts++;
  } while (S.recent.includes(q.sig) && attempts < 25);

  S.recent.push(q.sig);
  if (S.recent.length > 20) S.recent.shift();
  return q;
}

function nextQ() {
  S.q = genQ();
  S.locked = false;
  renderQ(S.q);
}

function renderQ(q) {
  const meta   = $('q-meta');
  const prompt = $('q-prompt');
  const word   = $('q-word');
  const hint   = $('q-hint');
  const body   = $('q-body');
  const fb     = $('fb');
  if (!meta || !body) return;

  meta.innerHTML = `
    <span class="tag lvl">${q.level}</span>
    <span class="tag topic">${q.topic}</span>
    <span class="tag num">#${S.ok + S.no + 1}</span>
  `;
  prompt.textContent = q.q;
  word.textContent   = q.word;
  hint.textContent   = q.hint || '';

  if (q.type === 'choice') {
    body.innerHTML = `<div class="choices">${q.choices.map(c =>
      `<button type="button" class="choice-btn" data-v="${c.replace(/"/g, '&quot;')}">${c}</button>`
    ).join('')}</div>`;
    body.querySelectorAll('.choice-btn').forEach(b => {
      b.onclick = () => handleChoice(b, q);
    });
  } else {
    body.innerHTML = `
      <div class="trow">
        <input type="text" id="ans" autocomplete="off" spellcheck="false" placeholder="Rusça cevabı yaz…">
        <button type="button" class="btn" id="chk">Kontrol Et</button>
      </div>
      <div class="kb" id="kb"></div>
    `;
    $('chk').onclick = () => handleText(q);
    const inp = $('ans');
    inp.focus();
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') handleText(q); });
    buildKB();
  }

  fb.className = 'fb';
  fb.innerHTML = '';
}

function buildKB() {
  const rows = [
    'а б в г д е ё ж з и й',
    'к л м н о п р с т у ф',
    'х ц ч ш щ ъ ы ь э ю я'
  ];
  const kb = $('kb');
  if (!kb) return;
  kb.innerHTML = '';
  rows.forEach(r => {
    r.split(' ').forEach(ch => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = ch;
      b.onclick = () => {
        const inp = $('ans');
        inp.value += ch;
        inp.focus();
      };
      kb.appendChild(b);
    });
    const br = document.createElement('div');
    br.style.flexBasis = '100%';
    kb.appendChild(br);
  });
}

function handleChoice(btn, q) {
  if (S.locked) return;
  S.locked = true;
  const ok = btn.dataset.v === q.answer;

  btn.closest('.choices').querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    if (b.dataset.v === q.answer) b.classList.add('correct');
  });
  if (!ok) btn.classList.add('wrong');

  register(ok);
  showFB(ok, btn.dataset.v);
}

function handleText(q) {
  if (S.locked) return;
  const inp = $('ans');
  const v = inp.value;
  if (!v.trim()) { inp.focus(); return; }

  S.locked = true;
  const ok = norm(v) === norm(q.answer);
  inp.disabled = true;
  inp.classList.add(ok ? 'correct' : 'wrong');
  $('chk').disabled = true;

  register(ok);
  showFB(ok, v.trim());
}

function register(ok) {
  if (ok) {
    S.ok++;
    S.consec++;
    S.streak++;
    S.retryTopic = null;
  } else {
    S.no++;
    S.consec = 0;
    S.streak = 0;
    S.retryTopic = S.q.topicKey;
  }
  saveState();
  updateHUD();
}

function showFB(ok, userAns) {
  const q = S.q;
  const fb = $('fb');
  if (!fb) return;

  const consecTxt = `<span class="sublabel">${S.consec} / ${NEED} ardışık</span>`;
  const ruleHTML  = q.rule ? `<div class="rule"><b>📐 Kural:</b> ${q.rule}</div>` : '';
  const exHTML    = q.ex   ? `<div class="example">${q.ex}</div>` : '';

  if (ok) {
    fb.className = 'fb ok show';
    fb.innerHTML = `
      <h4>✅ Doğru! ${consecTxt}</h4>
      <div class="answer-row"><b>Cevabın:</b> <span class="ru" style="font-size:18px">${userAns}</span></div>
      <div class="explain"><b>Neden doğru?</b> ${q.exp}</div>
      ${ruleHTML}${exHTML}
      <div id="after"></div>
    `;
    if (S.consec >= NEED) celebrate();
  } else {
    fb.className = 'fb no show';
    fb.innerHTML = `
      <h4>❌ Yanlış</h4>
      <div class="answer-row"><b>Senin cevabın:</b> <span class="ru" style="font-size:18px;color:var(--red)">${userAns || '(boş)'}</span></div>
      <div class="answer-row"><b>Doğru cevap:</b> <span class="ru" style="font-size:18px;color:var(--green)">${q.answer}</span></div>
      <div class="explain"><b>Neden bu cevap doğru?</b> ${q.exp}</div>
      ${ruleHTML}${exHTML}
      <div class="explain" style="background:var(--soft-amber);margin-top:8px">
        <b>🔄 Aynı konudan yeni bir soru gelecek.</b> Cinsiyet, gövde ve kuralı kontrol et.
      </div>
      <div id="after"></div>
    `;
  }

  const after = $('after');
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn green';
  btn.style.marginTop = '12px';
  btn.textContent = 'Sonraki Soru →';
  btn.onclick = () => nextQ();
  after.appendChild(btn);

  fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function celebrate() {
  if (S.mastered[S.level]) return;
  S.mastered[S.level] = true;
  saveState();
  renderLevels();

  const idx  = LVLS.indexOf(S.level);
  const next = LVLS[idx + 1];
  const fb   = $('fb');
  if (!fb) return;

  const c = document.createElement('div');
  c.className = 'celebrate';

  if (next) {
    c.innerHTML = `
      <h3>🎉 ${S.level} seviyesini tamamladın!</h3>
      <p>10 ardışık doğru yaptın. Sıradaki: <b>${next} — ${LVL_NAME[next]}</b></p>
      <button type="button" class="btn green" id="adv">${next} seviyesine geç →</button>
      <button type="button" class="btn ghost" id="stay" style="margin-left:8px">Burada kal</button>
    `;
  } else {
    c.innerHTML = `
      <h3>🏆 C2 tamamlandı!</h3>
      <p>Tüm seviyeleri bitirdin. İstediğin seviyede pratik yapmaya devam edebilirsin.</p>
      <button type="button" class="btn green" id="stay">Pratiğe dön</button>
    `;
  }
  fb.appendChild(c);

  const advBtn = $('adv');
  if (advBtn) {
    advBtn.onclick = () => {
      S.level = next;
      S.consec = 0;
      S.retryTopic = null;
      saveState();
      renderLevels();
      updateHUD();
      nextQ();
    };
  }
  const stayBtn = $('stay');
  if (stayBtn) {
    stayBtn.onclick = () => {
      S.consec = 0;
      updateHUD();
      nextQ();
    };
  }
}

function bindRefToggle() {
  const t = $('ref-toggle');
  const b = $('ref-body');
  if (!t || !b) return;
  t.onclick = () => {
    const isOpen = t.classList.toggle('open');
    b.classList.toggle('open');
    t.setAttribute('aria-expanded', String(isOpen));
  };
}

/* ============================================================
   7) BAŞLAT
   ============================================================ */
function init() {
  loadState();
  renderLevels();
  renderRef();
  bindRefToggle();
  updateHUD();
  nextQ();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}