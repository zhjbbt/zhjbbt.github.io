// 3D 球形标签云 —— 鼠标悬停跟随旋转
// 自动查找 .tag-cloud-list 容器内的 <a> 标签，转换为 3D 球面分布
;(function () {
  function initTagCloud() {
    var container = document.querySelector('.tag-cloud-list')
    if (!container) return

    var tags = container.querySelectorAll('a')
    if (tags.length === 0) return

    // 读取容器已有样式（Butterfly 可能已设 text-center 等）
    container.style.position = 'relative'
    container.style.width = '100%'
    container.style.height = '360px'
    container.style.overflow = 'visible'
    container.style.perspective = '800px'
    container.style.marginLeft = 'auto'
    container.style.marginRight = 'auto'

    // 半径用固定值，避免 offsetWidth 测量时机不准导致偏移
    var radius = 140

    // 黄金螺旋均匀分布球面坐标
    var tagData = []
    for (var i = 0; i < tags.length; i++) {
      var phi = Math.acos(-1 + (2 * i) / tags.length)
      var theta = Math.sqrt(tags.length * Math.PI) * phi

      tagData.push({
        el: tags[i],
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        baseColor: tags[i].style.backgroundColor || ''
      })
    }

    // 每个标签的初始样式：定位到容器 50% 处，靠 transform 居中自身
    tagData.forEach(function (item) {
      item.el.style.position = 'absolute'
      item.el.style.left = '50%'
      item.el.style.top = '50%'
      item.el.style.whiteSpace = 'nowrap'
      item.el.style.cursor = 'pointer'
      item.el.style.transition = 'transform 0.15s ease-out, opacity 0.15s ease-out'
      item.el.style.padding = '4px 12px'
      item.el.style.borderRadius = '16px'
      item.el.style.textDecoration = 'none'
      item.el.style.fontWeight = '500'
      item.el.style.display = 'inline-block'
      item.el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)'
    })

    // 旋转状态
    var angleX = 0
    var angleY = 0
    var targetAngleX = 0
    var targetAngleY = 0
    var autoSpeedX = 0.006
    var autoSpeedY = 0.008
    var isHovering = false
    var mouseX = 0
    var mouseY = 0

    // 渲染一帧
    function render() {
      // 自动旋转 + 鼠标影响
      if (!isHovering) {
        targetAngleX += autoSpeedX
        targetAngleY += autoSpeedY
      } else {
        targetAngleX = mouseY * 0.004
        targetAngleY = mouseX * 0.004
      }

      angleX += (targetAngleX - angleX) * 0.08
      angleY += (targetAngleY - angleY) * 0.08

      var cosX = Math.cos(angleX)
      var sinX = Math.sin(angleX)
      var cosY = Math.cos(angleY)
      var sinY = Math.sin(angleY)

      tagData.forEach(function (item) {
        // 绕 Y 轴再绕 X 轴旋转
        var x1 = item.x * cosY - item.z * sinY
        var z1 = item.x * sinY + item.z * cosY
        var y1 = item.y * cosX - z1 * sinX
        var z2 = item.y * cosX + z1 * sinX // 修正：y 不变，z' = y*sin + z*cos

        // 正确的 3D 旋转公式
        var rx = item.x * cosY + item.z * sinY
        var rz = -item.x * sinY + item.z * cosY
        var ry = item.y * cosX - rz * sinX
        var rz2 = item.y * sinX + rz * cosX

        var scale = (rz2 + radius) / (2 * radius)
        scale = Math.max(0.4, Math.min(1.4, scale))
        var opacity = 0.35 + scale * 0.65

        item.el.style.transform =
          'translate(-50%, -50%) translate3d(' + rx + 'px,' + ry + 'px,' + rz2 + 'px) scale(' + scale + ')'
        item.el.style.opacity = opacity
        item.el.style.zIndex = Math.round(scale * 100)

        // 前面的标签更亮、更大字体
        var fontSizeBase = 14
        item.el.style.fontSize = fontSizeBase * (0.75 + scale * 0.5) + 'px'
      })

      requestAnimationFrame(render)
    }

    render()

    // 鼠标交互
    container.addEventListener('mouseenter', function () { isHovering = true })
    container.addEventListener('mouseleave', function () { isHovering = false })
    container.addEventListener('mousemove', function (e) {
      var rect = container.getBoundingClientRect()
      mouseX = e.clientX - rect.left - rect.width / 2
      mouseY = e.clientY - rect.top - rect.height / 2
    })

    // 触摸支持
    container.addEventListener('touchmove', function (e) {
      if (e.touches.length > 0) {
        isHovering = true
        var rect = container.getBoundingClientRect()
        mouseX = e.touches[0].clientX - rect.left - rect.width / 2
        mouseY = e.touches[0].clientY - rect.top - rect.height / 2
      }
    }, { passive: true })
    container.addEventListener('touchend', function () { isHovering = false })
  }

  // 页面加载后初始化（兼容 PJAX）
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTagCloud)
  } else {
    initTagCloud()
  }
  // PJAX 切换时重新初始化
  document.addEventListener('pjax:complete', initTagCloud)
})()
