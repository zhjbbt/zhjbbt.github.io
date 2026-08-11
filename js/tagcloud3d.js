// 3D 球形标签云 —— 鼠标悬停跟随旋转
// 同时作用于 .tag-cloud-list（标签页）和 .card-tag-cloud（侧栏）
;(function () {
  function createTagCloud(container, opts) {
    var tags = container.querySelectorAll('a')
    if (tags.length === 0) return

    // 容器基础样式
    container.style.position = 'relative'
    container.style.width = '100%'
    container.style.height = (opts.height || 360) + 'px'
    container.style.overflow = 'visible'
    container.style.perspective = '800px'
    container.style.marginLeft = 'auto'
    container.style.marginRight = 'auto'

    var radius = opts.radius || 140

    // 彩色调色板：每个标签分配不同颜色
    var palette = opts.palette || [
      '#667eea', '#764ba2', '#36d1dc', '#5b86e5', '#f093fb',
      '#f5576c', '#4facfe', '#00c6fb', '#fa709a', '#fee140',
      '#30cfd0', '#a18cd1', '#ff9a9e', '#ffecd2', '#43e97b'
    ]

    // 黄金螺旋均匀分布球面坐标
    var tagData = []
    for (var i = 0; i < tags.length; i++) {
      var phi = Math.acos(-1 + (2 * i) / tags.length)
      var theta = Math.sqrt(tags.length * Math.PI) * phi

      tagData.push({
        el: tags[i],
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi)
      })
    }

    // 当前悬停的标签（用于隐藏其他标签）
    var hoveredTag = null

    // 每个标签初始样式：定位到容器 50% 处，靠 transform 居中自身
    tagData.forEach(function (item, idx) {
      item.el.style.position = 'absolute'
      item.el.style.left = '50%'
      item.el.style.top = '50%'
      item.el.style.whiteSpace = 'nowrap'
      item.el.style.cursor = 'pointer'
      item.el.style.transition = 'transform 0.15s ease-out, opacity 0.15s ease-out'
      item.el.style.padding = (opts.padding || '4px 12px')
      item.el.style.borderRadius = '16px'
      item.el.style.textDecoration = 'none'
      item.el.style.fontWeight = '500'
      item.el.style.display = 'inline-block'
      item.el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)'
      // 分配调色板颜色（important 覆盖主题默认样式）
      item.el.style.setProperty('background', palette[idx % palette.length], 'important')
      item.el.style.color = '#fff'
      item.el.style.border = 'none'

      // 悬停某标签时隐藏其他标签
      item.el.addEventListener('mouseenter', function () { hoveredTag = item })
      item.el.addEventListener('mouseleave', function () {
        if (hoveredTag === item) hoveredTag = null
      })
    })

    // 旋转状态
    var angleX = 0
    var angleY = 0
    var targetAngleX = 0
    var targetAngleY = 0
    var autoSpeedX = opts.speedX || 0.006
    var autoSpeedY = opts.speedY || 0.008
    var isHovering = false
    var mouseX = 0
    var mouseY = 0

    // 渲染一帧
    function render() {
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
        var rx = item.x * cosY + item.z * sinY
        var rz = -item.x * sinY + item.z * cosY
        var ry = item.y * cosX - rz * sinX
        var rz2 = item.y * sinX + rz * cosX

        var scale = (rz2 + radius) / (2 * radius)
        scale = Math.max(0.4, Math.min(1.4, scale))
        var opacity = 0.35 + scale * 0.65

        // 悬停时让其他标签变暗/隐藏
        if (hoveredTag && hoveredTag !== item) {
          opacity = 0.06
          scale = Math.max(0.4, scale)
        }

        item.el.style.transform =
          'translate(-50%, -50%) translate3d(' + rx + 'px,' + ry + 'px,' + rz2 + 'px) scale(' + scale + ')'
        item.el.style.opacity = opacity
        item.el.style.zIndex = hoveredTag === item ? 300 : Math.round(scale * 100)

        var fontSizeBase = opts.fontSizeBase || 14
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

  function initAll() {
    // 标签页：大球体
    var pageTags = document.querySelector('.tag-cloud-list')
    if (pageTags) createTagCloud(pageTags, { radius: 140, height: 360, fontSizeBase: 14, padding: '4px 12px' })

    // 侧栏标签：小球体，紧凑样式
    var sideTags = document.querySelector('.card-tag-cloud')
    if (sideTags) createTagCloud(sideTags, { radius: 80, height: 220, fontSizeBase: 11, padding: '2px 8px', bgColor: 'linear-gradient(135deg, #667eea, #764ba2)', speedX: 0.008, speedY: 0.01 })
  }

  // 页面加载后初始化（兼容 PJAX）
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll)
  } else {
    initAll()
  }
  // PJAX 切换时重新初始化
  document.addEventListener('pjax:complete', initAll)
})()
