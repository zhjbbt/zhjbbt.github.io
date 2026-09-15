/**
 * AI 摘要卡片打字机效果
 * 读取每张 .ai-summary-card 内 .ai-summary-text 的 data-text 属性，逐字播放。
 * - 默认保留 HTML 中的完整文本（SEO / 无 JS 降级可见）。
 * - 仅在用户未设置「减少动态效果」偏好时启用打字机，完成后光标停止闪烁。
 * - 打字速度随机（每字 45~115ms，遇标点额外停顿），结束时末尾字符跳动。
 */
(function () {
  'use strict';

  // 随机间隔范围（毫秒），整体偏慢、自然，不会一闪而过
  var MIN_DELAY = 45;
  var RAND_DELAY = 70;     // 实际间隔 = 45 + 0~70 => 45~115ms
  var PUNCT_PAUSE = 180;   // 标点后额外停顿
  var PUNCT_RE = /[，。！？、；：,.!?;:…—]/;

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  // 末尾有意义（非标点）字符的下标，用于跳动高亮
  function lastBounceIndex(text) {
    var i = text.length - 1;
    while (i > 0 && PUNCT_RE.test(text.charAt(i))) i--;
    return i;
  }

  // 打字结束后：把末尾字符单独包成跳动 span，其余保持纯文本
  function finishWithBounce(el, text) {
    if (!text) return;
    var idx = lastBounceIndex(text);
    if (idx < 0) { el.textContent = text; return; }
    el.textContent = '';
    el.appendChild(document.createTextNode(text.slice(0, idx)));
    var span = document.createElement('span');
    span.className = 'ai-summary-bounce';
    span.textContent = text.charAt(idx);
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
        finishWithBounce(el, text);
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
