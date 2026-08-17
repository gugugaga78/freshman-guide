// docsify-plugin-fun.js — 迎新网站趣味功能插件
// 1. 开学倒计时  2. 今天吃什么（美食卡片）  3. 入学清单  4. 西唯兵 SBTI 测试（20荒诞人格×20题）
(function () {
  'use strict';

  // ============ 1. 开学倒计时 ============
  function initCountdown() {
    var els = document.querySelectorAll('.countdown');
    if (!els.length) return;
    var target = new Date('2026-09-02T00:00:00+08:00');
    function tick() {
      var diff = target - new Date();
      var days = Math.ceil(diff / 86400000);
      els.forEach(function (el) {
        el.textContent = days > 0 ? days : (days === 0 ? '今天报到！🎉' : '已开学啦');
      });
    }
    tick();
    setInterval(tick, 60000);
  }

  // ============ 2. 今天吃什么（美食卡片） ============
  var FOODS = [
    { name: '快乐食间', dish: '藤椒钵钵鸡 · 肉丝烫饭 · 铁板意面', taste: '酸辣/番茄/黑椒多口味', addr: '校内（环境比一食堂好）', tag: '校内' },
    { name: '德保', dish: '烤鸭饭（半只鸭只要15元）', taste: '鸭皮脆，性价比之王', addr: '校内', tag: '校内' },
    { name: '快乐时间', dish: '铁板烧（孜然爆肉 · 脆皮鸭）', taste: '孜然香，酱汁酸甜口', addr: '校内', tag: '校内' },
    { name: '一食堂（稻香坊）', dish: '套饭 · 冒菜 · 砂锅米线 · 干锅', taste: '大众餐为主，选择多', addr: '校内（两层）', tag: '校内' },
    { name: '二食堂（麦馨坊）', dish: '云南米线 · 冒菜 · 清真餐', taste: '小吃 + 中炒', addr: '校内（两层）', tag: '校内' },
    { name: '西域美食', dish: '土豆丝炒肉盖饭 · 牛肉面', taste: '面食清淡，汤好喝，便宜', addr: '校内', tag: '校内' },
    { name: '校门口美食街', dish: '铁板烧', taste: '孜然香，酱汁酸甜，必吃！', addr: '校门口', tag: '校外·必吃' },
    { name: '蝴蝶山奇味干锅', dish: '干锅', taste: '麻辣鲜香，十几年老店', addr: '蝴蝶山', tag: '校外·老店' },
    { name: '豫津园油泼面', dish: '油泼面 · 刀削面', taste: '量大味道好', addr: '校外', tag: '校外' },
    { name: '溢香园', dish: '家常炒菜', taste: '吃过五六次，每道菜不踩雷', addr: '校外', tag: '校外' },
    { name: '功夫卷饼', dish: '卷饼', taste: '面食爱好者必冲', addr: '校外', tag: '校外' },
    { name: '豆干苕皮', dish: '豆干 · 苕皮', taste: '3元一个，平价好吃', addr: '校门口', tag: '校外·平价' },
    { name: '腊味煲仔饭', dish: '煲仔饭', taste: '小菜自助，辣酱好吃', addr: '校外', tag: '校外' },
    { name: '花雕醉鸡', dish: '花雕醉鸡', taste: '鲜香入味', addr: '大门外', tag: '校外' }
  ];
  function initFoodPicker() {
    var btn = document.getElementById('food-picker-btn');
    if (!btn) return;
    var out = document.getElementById('food-picker-result');
    function roll() {
      var f = FOODS[Math.floor(Math.random() * FOODS.length)];
      out.innerHTML =
        '<div class="food-card">' +
        '<div class="fc-tag">' + f.tag + '</div>' +
        '<div class="fc-name">' + f.name + '</div>' +
        '<div class="fc-dish">🍽️ ' + f.dish + '</div>' +
        '<div class="fc-meta"><span>😋 ' + f.taste + '</span><span>📍 ' + f.addr + '</span></div>' +
        '</div>';
    }
    btn.addEventListener('click', roll);
    roll();
  }

  // ============ 3. 入学清单 Checklist ============
  function initChecklist() {
    var wrap = document.querySelector('.checklist');
    if (!wrap) return;
    var boxes = wrap.querySelectorAll('input[type="checkbox"]');
    var key = 'cqut-checklist-v1';
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) {}
    boxes.forEach(function (box, i) {
      if (!box.getAttribute('data-id')) box.setAttribute('data-id', 'c' + i);
      var id = box.getAttribute('data-id');
      if (saved[id]) box.checked = true;
      box.addEventListener('change', function () {
        saved[id] = box.checked;
        localStorage.setItem(key, JSON.stringify(saved));
        update();
      });
    });
    function update() {
      var total = boxes.length;
      var done = wrap.querySelectorAll('input[type="checkbox"]:checked').length;
      var txt = document.getElementById('checklist-progress');
      var fill = document.getElementById('checklist-fill');
      if (txt) txt.textContent = done + ' / ' + total + ' 已备好';
      if (fill) fill.style.width = (total ? (done / total * 100) : 0) + '%';
    }
    update();
  }

  // ============ 4. 西唯兵 SBTI 测试（20荒诞人格 × 20题） ============
  // 风格参考 SBTI（Silly Big Personality Test）：荒诞代号 + 自嘲别称 + 一句名言
  var PERSONAS = {
    // 设施/校园生活
    juanwang: { icon: '🏆', code: 'JUAN-WANG', name: '卷王', dim: '校园', quote: '图书馆是我第二个宿舍，绩点就是我的命。' },
    tangping: { icon: '😴', code: 'TANG-PING', name: '躺平者', dim: '校园', quote: '能躺着绝不坐着，佛系是我的座右铭。' },
    ganfan:   { icon: '🍚', code: 'GAN-FAN', name: '干饭王', dim: '校园', quote: '一顿不吃饿得慌，天大地大吃饭最大。' },
    aoye:     { icon: '🌙', code: 'AO-YE', name: '熬夜冠军', dim: '校园', quote: '凌晨三点，才是我的高光时刻。' },
    zaoba:    { icon: '🌅', code: 'ZAO-BA', name: '早八战士', dim: '校园', quote: '早八全勤，但魂还没醒。' },
    // 美食
    weilong:  { icon: '🐉', code: 'WEI-LONG', name: '威龙本龙', dim: '美食', quote: '操作拉满，我就是威龙。' },
    weichong: { icon: '🐛', code: 'WEI-CHONG', name: '威虫本虫', dim: '美食', quote: '菜就菜吧，威虫也有虫的快乐。' },
    moyu:     { icon: '🐟', code: 'MO-YU', name: '摸鱼怪', dim: '美食', quote: '人在教室，魂在B站，鱼都摸麻了。' },
    // 八卦/社交
    bagua:    { icon: '📢', code: 'BA-GUA', name: '八卦精', dim: '八卦', quote: '校园没有我不知道的秘密，情报局局长。' },
    sheniu:   { icon: '🎉', code: 'SHE-NIU', name: '社牛', dim: '八卦', quote: '社交恐怖分子，路过条狗都能聊两句。' },
    shekong:  { icon: '🤐', code: 'SHE-KONG', name: '社恐', dim: '八卦', quote: '别找我，我社恐，手机是唯一的朋友。' },
    malou:    { icon: '🐒', code: 'MA-LOU', name: '吗喽', dim: '八卦', quote: '人生是副本，我是重理工的吗喽。' },
    // 抽象梗
    niulai:   { icon: '🐮', code: 'NIU-LAI', name: '牛来者', dim: '抽象', quote: '牛来！我就是那个传说中的人。' },
    nailong:  { icon: '🦖', code: 'NAI-LONG', name: '奶龙信徒', dim: '抽象', quote: '发奶龙的都是低智？那我第一个发。' },
    guguga:   { icon: '🐧', code: 'GUGU-GAGA', name: '咕咕嘎嘎', dim: '抽象', quote: '咕咕嘎嘎！我的语言只有这一句。' },
    yegou:    { icon: '🐶', code: 'YE-GOU', name: '野生狗奶', dim: '抽象', quote: '我的精神状态，就像野生狗奶一样抽象。' },
    xiongda:  { icon: '🐻', code: 'XIONG-DA', name: '熊大回眸', dim: '抽象', quote: '回眸一笑百媚生，然后继续 emo。' },
    haonv:    { icon: '👧', code: 'HAO-NV', name: '好女孩', dim: '抽象', quote: '我是好女孩，真的，信我。' },
    bazhi:    { icon: '🗿', code: 'BA-ZHI', name: '霸之意志', dim: '抽象', quote: '霸之意志：期末不挂科。' },
    nanbeng:  { icon: '💢', code: 'NAN-BENG', name: '难绷者', dim: '抽象', quote: '难绷，这个世界真的难绷。' }
  };

  var BTI_QUESTIONS = [
    { q: '早八的闹钟响了，你？', opts: [
      { t: 'A. 弹射起床，全勤战士从不迟到', s: 'zaoba' },
      { t: 'B. 按掉继续睡，能逃一节是一节', s: 'tangping' },
      { t: 'C. 先想想早饭吃啥', s: 'ganfan' },
      { t: 'D. 哦不，又要早起，难绷', s: 'nanbeng' } ]},
    { q: '深夜 12 点，你通常在？', opts: [
      { t: 'A. 图书馆/自习室卷绩点', s: 'juanwang' },
      { t: 'B. 床上刷手机刷到凌晨', s: 'aoye' },
      { t: 'C. 已经睡了，养生', s: 'tangping' },
      { t: 'D. 宿舍群聊八卦', s: 'bagua' } ]},
    { q: '校园里你最熟的地方是？', opts: [
      { t: 'A. 图书馆自习室（我的地盘）', s: 'juanwang' },
      { t: 'B. 食堂每个窗口（活地图）', s: 'ganfan' },
      { t: 'C. 宿舍的床（快乐老家）', s: 'tangping' },
      { t: 'D. 凌晨的操场（emo圣地）', s: 'aoye' } ]},
    { q: '午饭不知道吃啥，你？', opts: [
      { t: 'A. 食堂闭眼选，每个窗口都熟', s: 'ganfan' },
      { t: 'B. 点外卖，懒得出门', s: 'moyu' },
      { t: 'C. 随便，能吃就行', s: 'tangping' },
      { t: 'D. 下馆子，规格拉满', s: 'weilong' } ]},
    { q: '校门口美食街，你最想打卡？', opts: [
      { t: 'A. 铁板烧，必吃！', s: 'ganfan' },
      { t: 'B. 蝴蝶山奇味干锅，老店顶配', s: 'weilong' },
      { t: 'C. 豆干苕皮，3块钱的快乐', s: 'weichong' },
      { t: 'D. 有人请客就去，不然躺平', s: 'tangping' } ]},
    { q: '班里有新八卦，你？', opts: [
      { t: 'A. 我第一个知道，情报局局长', s: 'bagua' },
      { t: 'B. 转发给所有群', s: 'sheniu' },
      { t: 'C. 与我无关，社恐', s: 'shekong' },
      { t: 'D. 难绷', s: 'nanbeng' } ]},
    { q: '同学聚会，你？', opts: [
      { t: 'A. 全场最活跃，社交恐怖分子', s: 'sheniu' },
      { t: 'B. 角落安静吃饭', s: 'shekong' },
      { t: 'C. 趁机打听最新八卦', s: 'bagua' },
      { t: 'D. 装死不去', s: 'tangping' } ]},
    { q: '上课摸鱼时，你在？', opts: [
      { t: 'A. 刷B站看梗百科', s: 'moyu' },
      { t: 'B. 思考我为什么是只吗喽', s: 'malou' },
      { t: 'C. 偷偷刷题卷同学', s: 'juanwang' },
      { t: 'D. 睡觉补觉', s: 'aoye' } ]},
    { q: '刷到奶龙视频，你？', opts: [
      { t: 'A. 笑死，转发给朋友', s: 'nailong' },
      { t: 'B. 用"咕咕嘎嘎"回应', s: 'guguga' },
      { t: 'C. 无感，抽象', s: 'nanbeng' },
      { t: 'D. 吗喽看戏，雨我无瓜', s: 'malou' } ]},
    { q: '朋友发"牛来"，你？', opts: [
      { t: 'A. 牛来！我就是那个牛人', s: 'niulai' },
      { t: 'B. 咕咕嘎嘎', s: 'guguga' },
      { t: 'C. 什么梗？我out了', s: 'shekong' },
      { t: 'D. 难绷', s: 'nanbeng' } ]},
    { q: '打游戏时，你是？', opts: [
      { t: 'A. 威龙本龙，carry全场', s: 'weilong' },
      { t: 'B. 威虫本虫，下饭操作', s: 'weichong' },
      { t: 'C. 吗喽，随便玩玩', s: 'malou' },
      { t: 'D. 不玩，躺平', s: 'tangping' } ]},
    { q: '期末复习周，你？', opts: [
      { t: 'A. 通宵卷，绩点冲4.0', s: 'juanwang' },
      { t: 'B. 随缘复习，快乐躺平', s: 'tangping' },
      { t: 'C. 熬夜抱佛脚', s: 'aoye' },
      { t: 'D. 霸之意志：期末不挂科', s: 'bazhi' } ]},
    { q: '体测 800/1000 米，你？', opts: [
      { t: 'A. 提前一个月开练，冲刺满分', s: 'zaoba' },
      { t: 'B. 及格就行，别耽误我学习', s: 'juanwang' },
      { t: 'C. 能躲就躲，不能就慢跑', s: 'tangping' },
      { t: 'D. 跑完躺平，emo了', s: 'nanbeng' } ]},
    { q: '有人问你"是好人吗"？', opts: [
      { t: 'A. 我是好女孩，真的，信我', s: 'haonv' },
      { t: 'B. 咕咕嘎嘎', s: 'guguga' },
      { t: 'C. 难绷', s: 'nanbeng' },
      { t: 'D. 吗喽不语，只露出一丝苦笑', s: 'malou' } ]},
    { q: '看到"熊大回眸"梗，你？', opts: [
      { t: 'A. 回眸一笑百媚生，然后继续emo', s: 'xiongda' },
      { t: 'B. 抽象，难绷', s: 'nanbeng' },
      { t: 'C. 咕咕嘎嘎', s: 'guguga' },
      { t: 'D. 无感，继续躺平', s: 'tangping' } ]},
    { q: '你的精神状态最像？', opts: [
      { t: 'A. 野生狗奶，抽象得一批', s: 'yegou' },
      { t: 'B. 吗喽，打工魂', s: 'malou' },
      { t: 'C. 躺平，佛系', s: 'tangping' },
      { t: 'D. 卷，焦虑', s: 'juanwang' } ]},
    { q: '早八 vs 熬夜，你是？', opts: [
      { t: 'A. 早八战士，雷打不动', s: 'zaoba' },
      { t: 'B. 熬夜冠军，凌晨才睡', s: 'aoye' },
      { t: 'C. 都不行，我只想躺平', s: 'tangping' },
      { t: 'D. 都要，卷+熬，肝就完了', s: 'juanwang' } ]},
    { q: '你的社交状态？', opts: [
      { t: 'A. 社牛，朋友遍校园', s: 'sheniu' },
      { t: 'B. 社恐，i人本i', s: 'shekong' },
      { t: 'C. 八卦精，消息灵通', s: 'bagua' },
      { t: 'D. 吗喽，独自美丽', s: 'malou' } ]},
    { q: '看到"霸之意志"，你？', opts: [
      { t: 'A. 霸之意志：期末不挂科', s: 'bazhi' },
      { t: 'B. 牛来！', s: 'niulai' },
      { t: 'C. 难绷', s: 'nanbeng' },
      { t: 'D. 咕咕嘎嘎', s: 'guguga' } ]},
    { q: '最后，你觉得自己是？', opts: [
      { t: 'A. 牛人，深藏不露', s: 'niulai' },
      { t: 'B. 威龙，操作拉满', s: 'weilong' },
      { t: 'C. 威虫，菜但快乐', s: 'weichong' },
      { t: 'D. 卷王，卷就完了', s: 'juanwang' } ]}
  ];

  function initBTI() {
    var box = document.getElementById('bti-test');
    if (!box) return;
    var idx = 0, score = {};
    Object.keys(PERSONAS).forEach(function (k) { score[k] = 0; });

    function renderQ() {
      var q = BTI_QUESTIONS[idx];
      var html = '<div class="bti-progress">第 ' + (idx + 1) + ' / ' + BTI_QUESTIONS.length + ' 题</div>';
      html += '<div class="bti-q">' + q.q + '</div>';
      html += '<div class="bti-opts">';
      q.opts.forEach(function (o) {
        html += '<button class="bti-opt" data-s="' + o.s + '">' + o.t + '</button>';
      });
      html += '</div>';
      box.innerHTML = html;
      box.querySelectorAll('.bti-opt').forEach(function (btn) {
        btn.addEventListener('click', function () {
          score[btn.getAttribute('data-s')]++;
          idx++;
          if (idx < BTI_QUESTIONS.length) renderQ();
          else renderResult();
        });
      });
    }

    function renderResult() {
      var best = 'juanwang', max = -1;
      Object.keys(score).forEach(function (k) {
        if (score[k] > max) { max = score[k]; best = k; }
      });
      var r = PERSONAS[best];
      box.innerHTML =
        '<div class="bti-result">' +
        '<div class="bti-icon">' + r.icon + '</div>' +
        '<div class="bti-code">' + r.code + '</div>' +
        '<div class="bti-name">' + r.name + '</div>' +
        '<div class="bti-quote">「' + r.quote + '」</div>' +
        '<div class="bti-dim">所属维度：' + r.dim + '</div>' +
        '<button class="bti-restart">再测一次</button>' +
        '</div>';
      box.querySelector('.bti-restart').addEventListener('click', function () {
        idx = 0;
        Object.keys(score).forEach(function (k) { score[k] = 0; });
        renderQ();
      });
    }

    renderQ();
  }

  // ============ 注册 docsify hook ============
  function initAll() {
    initCountdown();
    initFoodPicker();
    initChecklist();
    initBTI();
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat([
    function (hook) {
      hook.doneEach(initAll);
    }
  ]);
})();
