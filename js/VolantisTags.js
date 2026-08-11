// 去除 banner 背景（若存在）
var full_page = document.getElementsByClassName("full_page");
if (full_page.length != 0) {
  full_page[0].style.background = "transparent";
}

// 手机侧边栏默认不展开
// 注意：#mobile-sidebar-menus 是 Volantis 的主题结构，Butterfly 中通常不存在，
// 因此此处增加 null 守卫，避免 getElementsByClassName 在 null 上调用而报错。
var mobile_sidebar_menus = document.getElementById("mobile-sidebar-menus");
if (mobile_sidebar_menus) {
  var menus_item_child = mobile_sidebar_menus.getElementsByClassName("menus_item_child");
  var menus_expand = mobile_sidebar_menus.getElementsByClassName("menus-expand");
  for (var i = 0; i < menus_item_child.length; i++) {
    menus_item_child[i].style.display = "none";
    menus_expand[i].className += " menus-closed";
  }
}

// 浏览器搞笑标题（使用原生 DOM，不再依赖 jQuery）
var OriginTitle = document.title;
var titleTime;
document.addEventListener('visibilitychange', function () {
  var icon = document.querySelector('[rel="icon"]');
  if (document.hidden) {
    if (icon) icon.setAttribute('href', "/funny.ico");
    document.title = 'ヽ(●-`Д´-)ノ你要走嘛我好伤心！';
    clearTimeout(titleTime);
  } else {
    if (icon) icon.setAttribute('href', "/favicon.ico");
    document.title = '(Ő∀Ő3)ノ哇喔！欢迎！' + OriginTitle;
    titleTime = setTimeout(function () {
      document.title = OriginTitle;
    }, 2000);
  }
});

// 添加八毛卡通人物（已废弃，不再加载外部 gif）
