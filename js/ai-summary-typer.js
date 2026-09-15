/**
 * AI 摘要卡片打字机效果
 * 读取每张 .ai-summary-card 内 .ai-summary-text 的 data-text 属性，逐字播放。
 * - 默认保留 HTML 中的完整文本（SEO / 无 JS 降级可见）。
 * - 仅在用户未设置「减少动态效果」偏好时启用打字机，完成后光标停止闪烁。
 */
(function () {
  'use strict';

  var SPEED = 22; // 每个字符间隔（毫秒）

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function typeWriter(el, text, speed) {
    var cursor = el.parentNode ? el.parentNode.querySelector('.ai-summary-cursor') : null;
    if (cursor) cursor.classList.add('typing');
    el.textContent = '';
    var i = 0;
    (function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(step, speed);
      } else if (cursor) {
        cursor.classList.remove('typing');
        cursor.classList.add('done');
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
      if (text) typeWriter(p, text, SPEED);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
