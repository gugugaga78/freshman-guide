// docsify-plugin-fun.js — 迎新网站趣味功能插件
// 1. 开学倒计时  2. 今天吃什么  3. 入学清单  4. 西唯兵 BTI 测试
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

  // ============ 2. 今天吃什么（随机食堂推荐） ============
  var FOODS = [
    { name: '一食堂三楼', note: '⭐ 综合评价最高，公认最好吃' },
    { name: '一食堂二楼', note: '干锅出名，老学长念念不忘' },
    { name: '二食堂', note: '大锅饭为主，中规中矩' },
    { name: '校门口美食街', note: '⭐ 铁板烧等小吃必吃' }
  ];
  function initFoodPicker() {
    var btn = document.getElementById('food-picker-btn');
    if (!btn) return;
    var out = document.getElementById('food-picker-result');
    function roll() {
      var pick = FOODS[Math.floor(Math.random() * FOODS.length)];
      out.innerHTML = '<strong>' + pick.name + '</strong><br><span>' + pick.note + '</span>';
    }
    btn.addEventListener('click', roll);
    roll(); // 初始也随机一次
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

  // ============ 4. 西唯兵 BTI 测试 ============
  var BTI = {
    questions: [
      { q: '早八的课，你会？', opts: [
        { t: 'A. 提前占座，前排就位', s: 'roll' },
        { t: 'B. 闹钟响了，继续睡', s: 'chill' },
        { t: 'C. 先去食堂吃个饱', s: 'food' },
        { t: 'D. 约同学一起走', s: 'social' }
      ]},
      { q: '中午下课，你的第一站？', opts: [
        { t: 'A. 图书馆抢座', s: 'roll' },
        { t: 'B. 宿舍床上躺平', s: 'chill' },
        { t: 'C. 食堂干饭', s: 'food' },
        { t: 'D. 和朋友约饭', s: 'social' }
      ]},
      { q: '周末怎么过？', opts: [
        { t: 'A. 图书馆自习刷题', s: 'roll' },
        { t: 'B. 睡到自然醒', s: 'chill' },
        { t: 'C. 探店美食地图', s: 'food' },
        { t: 'D. 出去玩社交', s: 'social' }
      ]},
      { q: '期末周你的状态？', opts: [
        { t: 'A. 通宵复习，卷到飞起', s: 'roll' },
        { t: 'B. 临抱佛脚，能过就行', s: 'chill' },
        { t: 'C. 复习也要吃好喝好', s: 'food' },
        { t: 'D. 组队复习，互相监督', s: 'social' }
      ]}
    ],
    results: {
      roll:   { icon: '🏆', name: '卷王兵', desc: '图书馆钉子户、绩点之神。早八占座、通宵刷题，你是同学眼中"卷"的代名词。' },
      food:   { icon: '🍚', name: '干饭兵', desc: '食堂活地图、美食雷达。一顿不吃饿得慌，你对校园美食如数家珍。' },
      social: { icon: '🎉', name: '社牛兵', desc: '社交达人、社团骨干。朋友遍校园，走到哪都能打成一片。' },
      chill:  { icon: '😴', name: '摆烂兵', desc: '佛系躺平、随缘过活。快乐就好，你深谙"生活不必太卷"的真谛。' }
    }
  };
  function initBTI() {
    var box = document.getElementById('bti-test');
    if (!box) return;
    var idx = 0, score = { roll: 0, food: 0, social: 0, chill: 0 };

    function renderQ() {
      var q = BTI.questions[idx];
      var html = '<div class="bti-progress">第 ' + (idx + 1) + ' / ' + BTI.questions.length + ' 题</div>';
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
          if (idx < BTI.questions.length) renderQ();
          else renderResult();
        });
      });
    }

    function renderResult() {
      var best = 'roll', max = -1;
      Object.keys(score).forEach(function (k) {
        if (score[k] > max) { max = score[k]; best = k; }
      });
      var r = BTI.results[best];
      box.innerHTML =
        '<div class="bti-result">' +
        '<div class="bti-icon">' + r.icon + '</div>' +
        '<div class="bti-name">' + r.name + '</div>' +
        '<div class="bti-desc">' + r.desc + '</div>' +
        '<button class="bti-restart">再测一次</button>' +
        '</div>';
      box.querySelector('.bti-restart').addEventListener('click', function () {
        idx = 0; score = { roll: 0, food: 0, social: 0, chill: 0 };
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
