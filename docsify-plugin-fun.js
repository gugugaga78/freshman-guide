// docsify-plugin-fun.js — 迎新网站趣味功能插件
// 1. 开学倒计时  2. 今天吃什么（美食卡片）  3. 入学清单  4. 西唯兵 BTI 测试（20人格×20题）
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
    // 校内
    { name: '快乐食间', dish: '藤椒钵钵鸡 · 肉丝烫饭 · 铁板意面', taste: '酸辣/番茄/黑椒多口味', addr: '校内（环境比一食堂好）', tag: '校内' },
    { name: '德保', dish: '烤鸭饭（半只鸭只要15元）', taste: '鸭皮脆，性价比之王', addr: '校内', tag: '校内' },
    { name: '快乐时间', dish: '铁板烧（孜然爆肉 · 脆皮鸭）', taste: '孜然香，酱汁酸甜口', addr: '校内', tag: '校内' },
    { name: '一食堂（稻香坊）', dish: '套饭 · 冒菜 · 砂锅米线 · 干锅', taste: '大众餐为主，选择多', addr: '校内（两层）', tag: '校内' },
    { name: '二食堂（麦馨坊）', dish: '云南米线 · 冒菜 · 清真餐', taste: '小吃 + 中炒', addr: '校内（两层）', tag: '校内' },
    { name: '西域美食', dish: '土豆丝炒肉盖饭 · 牛肉面', taste: '面食清淡，汤好喝，价格便宜', addr: '校内', tag: '校内' },
    // 校外
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

  // ============ 4. 西唯兵 BTI 测试（20人格 × 20题） ============
  var PERSONAS = {
    // 设施维度
    map:    { icon: '🗺️', name: '校园活地图兵', dim: '设施', desc: '校园每栋楼、每条近道、每个快递点你都门儿清，同学迷路都问你。' },
    lib:    { icon: '📚', name: '图书馆钉子户', dim: '设施', desc: '图书馆常驻人口，占座王。你的座位比宿舍还熟。' },
    dorm:   { icon: '🏠', name: '宿舍宅兵', dim: '设施', desc: '宿舍是你的快乐老家，床是最佳伙伴，外卖续命。' },
    morning:{ icon: '🌅', name: '早八特种兵', dim: '设施', desc: '早八全勤，从不迟到，甚至还能早起晨读锻炼。' },
    // 美食维度
    food:   { icon: '🍚', name: '干饭兵', dim: '美食', desc: '食堂活地图、美食雷达。一顿不吃饿得慌，吃这件事你从没输过。' },
    foodie: { icon: '🍜', name: '探店兵', dim: '美食', desc: '美食博主预备役，新店开业必有你，点评达人。' },
    dragon: { icon: '🐉', name: '威龙兵', dim: '美食', desc: '操作拉满、样样精通，吃也要吃最好的。你就是那个"威龙"本龙。' },
    worm:   { icon: '🐛', name: '威虫兵', dim: '美食', desc: '操作感人但自嘲乐观，外卖续命，菜得可爱。没事，威虫也是虫中龙凤。' },
    // 八卦维度
    gossip: { icon: '📢', name: '八卦兵', dim: '八卦', desc: '校园八卦通，消息灵通到离谱。没有你不知道的秘密。' },
    social: { icon: '🎉', name: '社牛兵', dim: '八卦', desc: '社交达人，朋友遍校园，走到哪都能打成一片。' },
    shy:    { icon: '🤐', name: '社恐兵', dim: '八卦', desc: 'i人本i，低调安静，但内心世界丰富得很。' },
    love:   { icon: '💘', name: '恋爱脑兵', dim: '八卦', desc: '满脑子粉红泡泡，校园恋爱观察员。' },
    mystery:{ icon: '🤫', name: '神秘兵', dim: '八卦', desc: '深藏不露，低调高手。你知道很多，但从不轻易开口。' },
    // 抽象维度
    nailong:{ icon: '🦖', name: '奶龙兵', dim: '抽象', desc: '魔性整活大师，烂梗之王。奶龙视频十级学者，抽象文化代言人。' },
    gugu:   { icon: '🐧', name: '咕咕嘎嘎兵', dim: '抽象', desc: '萌系抽象担当，AI配音整活小能手。咕咕嘎嘎是你的接头暗号。' },
    chill:  { icon: '😴', name: '摆烂兵', dim: '抽象', desc: '佛系躺平，随缘过活。快乐就好，你深谙"生活不必太卷"的真谛。' },
    fish:   { icon: '🐟', name: '摸鱼兵', dim: '抽象', desc: '上课划水大师，摸鱼十级学者。人在教室，魂在远方。' },
    night:  { icon: '🌙', name: '熬夜兵', dim: '抽象', desc: '夜猫子本猫，凌晨才是你的主场。' },
    roll:   { icon: '🏆', name: '卷王兵', dim: '抽象', desc: '图书馆钉子户、绩点之神。卷，是你的代名词。' },
    niu:    { icon: '🐮', name: '牛来兵', dim: '抽象', desc: '牛人降临，深藏不露的大佬。平时低调，关键时刻"牛来"！' }
  };

  var BTI_QUESTIONS = [
    // —— 维度1：设施熟悉度 ——
    { q: '第一次去图书馆自习，你能顺利找到位置吗？', opts: [
      { t: 'A. 闭着眼都能找到，每层布局门儿清', s: 'map' },
      { t: 'B. 早就在开馆前排队占座了', s: 'lib' },
      { t: 'C. 图书馆？我更喜欢宿舍', s: 'dorm' },
      { t: 'D. 早起去，顺便晨读', s: 'morning' } ]},
    { q: '快递到了，你的取件姿势是？', opts: [
      { t: 'A. 三个快递点门儿清，走最快路线', s: 'map' },
      { t: 'B. 让同学帮忙带一下', s: 'lib' },
      { t: 'C. 攒一周一起取，或让室友带', s: 'dorm' },
      { t: 'D. 下课顺路取，高效解决', s: 'morning' } ]},
    { q: '从宿舍到教学楼，你？', opts: [
      { t: 'A. 抄近道，5分钟就到', s: 'map' },
      { t: 'B. 边走边背单词', s: 'lib' },
      { t: 'C. 能骑车绝不走路', s: 'dorm' },
      { t: 'D. 永远第一个到教室', s: 'morning' } ]},
    { q: '想找个安静的地方学习，你去？', opts: [
      { t: 'A. 图书馆顶楼人少区', s: 'map' },
      { t: 'B. 图书馆常驻座位（我的地盘）', s: 'lib' },
      { t: 'C. 宿舍床上', s: 'dorm' },
      { t: 'D. 教室早自习', s: 'morning' } ]},
    { q: '体测要跑 800/1000 米，你？', opts: [
      { t: 'A. 知道最省力的路线和节奏', s: 'map' },
      { t: 'B. 及格就行，别耽误我学习', s: 'lib' },
      { t: 'C. 能躲就躲，不能就慢跑', s: 'dorm' },
      { t: 'D. 提前一个月开练，冲刺满分', s: 'morning' } ]},
    // —— 维度2：美食了解度 ——
    { q: '午饭不知道吃啥，你？', opts: [
      { t: 'A. 食堂活地图，闭眼推荐', s: 'food' },
      { t: 'B. 打开点评，找新店打卡', s: 'foodie' },
      { t: 'C. 吃最好的，从不将就', s: 'dragon' },
      { t: 'D. 外卖解决，懒得下楼', s: 'worm' } ]},
    { q: '校门口美食街，你最想打卡？', opts: [
      { t: 'A. 铁板烧，必吃！', s: 'food' },
      { t: 'B. 一家家吃过去，写点评', s: 'foodie' },
      { t: 'C. 蝴蝶山奇味干锅，老店味道顶配', s: 'dragon' },
      { t: 'D. 豆干苕皮，3块钱的快乐', s: 'worm' } ]},
    { q: '发现一家新店，你会？', opts: [
      { t: 'A. 马上推荐给所有同学', s: 'food' },
      { t: 'B. 拍照发小红书/朋友圈', s: 'foodie' },
      { t: 'C. 尝遍所有招牌菜', s: 'dragon' },
      { t: 'D. 等别人先试，好吃再去', s: 'worm' } ]},
    { q: '食堂吃腻了怎么办？', opts: [
      { t: 'A. 换着吃，每个窗口都熟', s: 'food' },
      { t: 'B. 探店校外，寻找宝藏店', s: 'foodie' },
      { t: 'C. 下馆子，吃顿好的', s: 'dragon' },
      { t: 'D. 继续外卖，能吃饱就行', s: 'worm' } ]},
    { q: '有人约你吃饭，你？', opts: [
      { t: 'A. 我推荐，保证好吃', s: 'food' },
      { t: 'B. 走，我知道一家宝藏店', s: 'foodie' },
      { t: 'C. 我来安排，规格拉满', s: 'dragon' },
      { t: 'D. 都行，你们定', s: 'worm' } ]},
    // —— 维度3：八卦了解度 ——
    { q: '班里有新八卦，你？', opts: [
      { t: 'A. 消息灵通，我第一个知道', s: 'gossip' },
      { t: 'B. 第一时间和好朋友分享', s: 'social' },
      { t: 'C. 与我无关，不关心', s: 'shy' },
      { t: 'D. 只和 TA 悄悄说', s: 'love' } ]},
    { q: '同学聚会，你？', opts: [
      { t: 'A. 趁机打听最新消息', s: 'gossip' },
      { t: 'B. 全场最活跃的那个', s: 'social' },
      { t: 'C. 角落里安静吃饭', s: 'shy' },
      { t: 'D. 只想坐在喜欢的人旁边', s: 'love' } ]},
    { q: '知道某老师的"秘密"，你？', opts: [
      { t: 'A. 已列入我的八卦档案', s: 'gossip' },
      { t: 'B. 讲给大家听，气氛担当', s: 'social' },
      { t: 'C. 烂在肚子里', s: 'shy' },
      { t: 'D. 笑而不语，保持神秘', s: 'mystery' } ]},
    { q: '别人来问你八卦，你？', opts: [
      { t: 'A. 交换情报，互通有无', s: 'gossip' },
      { t: 'B. 知无不言，聊得火热', s: 'social' },
      { t: 'C. 装傻，说不知道', s: 'shy' },
      { t: 'D. 深藏不露，点到为止', s: 'mystery' } ]},
    { q: '朋友圈看到同学官宣，你？', opts: [
      { t: 'A. 我早猜到了', s: 'gossip' },
      { t: 'B. 立刻点赞评论祝福', s: 'social' },
      { t: 'C. 默默划过', s: 'shy' },
      { t: 'D. 心里想：我的呢？', s: 'love' } ]},
    // —— 维度4：抽象梗了解度 ——
    { q: '刷到奶龙视频，你？', opts: [
      { t: 'A. 笑死，魔性整活还得看奶龙', s: 'nailong' },
      { t: 'B. 用"咕咕嘎嘎"回应', s: 'gugu' },
      { t: 'C. 无感，继续躺平', s: 'chill' },
      { t: 'D. 上课摸鱼偷偷看', s: 'fish' } ]},
    { q: '深夜 12 点，你还在？', opts: [
      { t: 'A. 刷抽象视频，越看越精神', s: 'nailong' },
      { t: 'B. 和网友咕咕嘎嘎对线', s: 'gugu' },
      { t: 'C. 早就睡了，养生', s: 'chill' },
      { t: 'D. 夜猫子，越夜越精神', s: 'night' } ]},
    { q: '打游戏被队友坑了，你？', opts: [
      { t: 'A. 无所谓，整活才是真谛', s: 'nailong' },
      { t: 'B. 咕咕嘎嘎，不生气', s: 'gugu' },
      { t: 'C. 菜就菜吧，开心就好', s: 'chill' },
      { t: 'D. 卷起来，带飞队友', s: 'roll' } ]},
    { q: '期末复习周，你的状态？', opts: [
      { t: 'A. 边复习边刷梗', s: 'nailong' },
      { t: 'B. 用抽象梗缓解焦虑', s: 'gugu' },
      { t: 'C. 随缘复习，快乐躺平', s: 'chill' },
      { t: 'D. 通宵卷，绩点冲 4.0', s: 'roll' } ]},
    { q: '你觉得自己是"牛人"吗？', opts: [
      { t: 'A. 牛来！我就是那个大佬', s: 'niu' },
      { t: 'B. 我是威龙，操作拉满', s: 'dragon' },
      { t: 'C. 我是威虫，菜但快乐', s: 'worm' },
      { t: 'D. 我是卷王，卷就完了', s: 'roll' } ]}
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
      var best = 'map', max = -1;
      Object.keys(score).forEach(function (k) {
        if (score[k] > max) { max = score[k]; best = k; }
      });
      var r = PERSONAS[best];
      box.innerHTML =
        '<div class="bti-result">' +
        '<div class="bti-icon">' + r.icon + '</div>' +
        '<div class="bti-name">' + r.name + '</div>' +
        '<div class="bti-dim">所属维度：' + r.dim + '</div>' +
        '<div class="bti-desc">' + r.desc + '</div>' +
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
