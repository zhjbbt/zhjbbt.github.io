/**
 * AI 摘要卡片打字机效果
 * 读取每张 .ai-summary-card 内 .ai-summary-text 的 data-text 属性，逐字播放。
 * - 默认保留 HTML 中的完整文本（SEO / 无 JS 降级可见）。
 * - 仅在用户未设置「减少动态效果」偏好时启用打字机，完成后光标停止闪烁。
 * - 打字速度随机（每字 45~115ms，遇标点额外停顿）。
 * - 打字结束后，末尾追加一个「—」符号持续上下跳动（参考清羽 AI 摘要样式）。
 */
(function () {
  'use strict';

  // 随机间隔范围（毫秒），整体偏慢、自然，不会一闪而过
  var MIN_DELAY = 45;
  var RAND_DELAY = 70;     // 实际间隔 = 45 + 0~70 => 45~115ms
  var PUNCT_PAUSE = 180;   // 标点后额外停顿
  var PUNCT_RE = /[，。！？、；：,.!?;:…]/;
  var BOUNCE_CHAR = '—';   // 打字结束后末尾跳动的符号

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  // 打字结束后：在文本末尾追加一个跳动的「—」符号
  function appendBounce(el) {
    var span = document.createElement('span');
    span.className = 'ai-summary-bounce';
    span.textContent = BOUNCE_CHAR;
    el.appendChild(document.createTextNode(' '));
    el.appendChild(span);
  }

  function typeWriter(el, text) {
    var cursor = el.parentNode ? el.parentNode.querySelector('.ai-summary-cursor') : null;
    if (cursor) cursor.classList.add('typing');
    el.textContent = '';
    var i = 0;
    (function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        var ch = text.charAt(i - 1);
        // 随机间隔：基础随机 + 标点额外停顿
        var delay = MIN_DELAY + Math.random() * RAND_DELAY;
        if (PUNCT_RE.test(ch)) delay += PUNCT_PAUSE;
        i++;
        setTimeout(step, delay);
      } else {
        if (cursor) {
          cursor.classList.remove('typing');
          cursor.classList.add('done');
        }
        appendBounce(el);
      }
    })();
  }

  function init() {
    if (prefersReducedMotion()) return; // 保留完整文本，不做打字机
    var cards = document.querySelectorAll('.ai-summary-card');
    Array.prototype.forEach.call(cards, function (card) {
      var p = card.querySelector('.ai-summary-text');
      if (!p) return;
      var text = (p.getAttribute('data-text') || p.textContent || '').trim();
      if (text) typeWriter(p, text);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
