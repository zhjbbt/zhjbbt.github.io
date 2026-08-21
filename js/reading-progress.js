(function () {
  'use strict';

  // 只在文章页启用
  var bodyWrap = document.getElementById('body-wrap');
  if (!bodyWrap || !bodyWrap.classList.contains('post')) return;

  // 右侧垂直进度条
  var bar = document.createElement('div');
  bar.className = 'reading-progress-bar';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  // 右下角「阅读进度」按钮（追加到右侧工具栏）
  var btn = document.createElement('button');
  btn.id = 'reading-progress-btn';
  btn.type = 'button';
  btn.title = '阅读进度';
  btn.innerHTML = '<span class="rp-num">0</span>%';

  var rightsideShow = document.getElementById('rightside-config-show');
  if (rightsideShow) {
    rightsideShow.appendChild(btn);
  } else {
    var rightside = document.getElementById('rightside');
    if (rightside) rightside.appendChild(btn);
  }

  function getScrollProgress() {
    var docEl = document.documentElement;
    var scrollTop = window.pageYOffset || docEl.scrollTop || document.body.scrollTop || 0;
    var scrollHeight = docEl.scrollHeight - docEl.clientHeight;

    if (scrollHeight <= 0) return 0;

    var ratio = scrollTop / scrollHeight;
    if (ratio < 0) ratio = 0;
    if (ratio > 1) ratio = 1;

    return Math.round(ratio * 100);
  }

  var ticking = false;
  function updateProgress() {
    var percent = getScrollProgress();
    bar.style.height = percent + '%';
    var num = btn.querySelector('.rp-num');
    if (num) num.textContent = percent;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateProgress();
})();
