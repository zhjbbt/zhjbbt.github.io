// 浏览器标签页标题「离开 / 回来」切换特效
// 恢复自 Butterfly 主题自带的 VolantisTags.js 的 visibilitychange 逻辑
// （原脚本被误删于 perf 优化；此处仅保留标题切换，去掉 banner 清空与 funny.ico 切换副作用）
(function () {
  var OriginTitle = document.title;
  var titleTimer;
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      document.title = 'ヽ(●-`Д´-)ノ你要走嘛我好伤心！';
      clearTimeout(titleTimer);
    } else {
      document.title = '(Ő∀Ő3)ノ哇喔！欢迎！ ' + OriginTitle;
      titleTimer = setTimeout(function () {
        document.title = OriginTitle;
      }, 2000);
    }
  });
})();
