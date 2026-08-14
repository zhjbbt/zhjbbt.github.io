(function () {
  // 起始时间：根据截图反推（2024-12-14 10:41:49 GMT+8）
  // 如需调整，请修改此处时间字符串
  var startTime = new Date('2024-12-14T10:41:49+08:00');
  var el = document.getElementById('site-runtime-display');
  if (!el) return;

  function pad(n) {
    return n < 10 ? '0' + n : n;
  }

  function update() {
    var now = new Date();
    var diff = Math.floor((now - startTime) / 1000);
    if (diff < 0) diff = 0;

    var days = Math.floor(diff / 86400);
    diff %= 86400;
    var hours = Math.floor(diff / 3600);
    diff %= 3600;
    var minutes = Math.floor(diff / 60);
    var seconds = diff % 60;

    el.textContent = '本站已稳定运行：' + days + ' 天 ' + hours + ' 小时 ' + minutes + ' 分 ' + pad(seconds) + ' 秒';
  }

  update();
  setInterval(update, 1000);
})();
