/* eslint-disable */
// 原生 JS 重写（不再依赖 jQuery），兼容 Butterfly 主题。
(function () {
  "use strict";

  function setTabs() {
    var tabs = document.querySelectorAll(".tabs");
    if (tabs.length === 0) return;
    Array.prototype.forEach.call(tabs, function (tab) {
      var navs = tab.querySelectorAll(".nav-tabs .tab");
      Array.prototype.forEach.call(navs, function (nav) {
        var a = nav.children[0];
        if (a) {
          var href = a.getAttribute("href");
          if (href) a.classList.add(href);
          a.removeAttribute("href");
        }
      });
      var navTabs = tab.querySelector(".nav-tabs");
      if (navTabs) {
        navTabs.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          var target = e.target;
          var tabEl = target.parentElement.parentElement.parentElement;
          if (!tabEl) return false;
          var actives = tabEl.querySelectorAll(".nav-tabs .active");
          Array.prototype.forEach.call(actives, function (el) { el.classList.remove("active"); });
          if (target.parentElement) target.parentElement.classList.add("active");
          var contents = tabEl.querySelectorAll(".tab-content .active");
          Array.prototype.forEach.call(contents, function (el) { el.classList.remove("active"); });
          var cls = target.getAttribute("class");
          if (cls) {
            var matched = tabEl.querySelectorAll("." + cls);
            Array.prototype.forEach.call(matched, function (el) { el.classList.add("active"); });
          }
          return false;
        });
      }
    });
  }

  function init() {
    setTabs();
    var scrollDown = document.querySelector(".scroll-down");
    if (scrollDown) {
      scrollDown.addEventListener("click", function () {
        var body = document.querySelector(".l_body");
        if (body) body.scrollIntoView({ behavior: "smooth" });
      });
    }
    var loadingBar = document.getElementById("loading-bar-wrapper");
    if (loadingBar) {
      setTimeout(function () {
        loadingBar.style.transition = "opacity 0.5s";
        loadingBar.style.opacity = "0";
      }, 300);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
