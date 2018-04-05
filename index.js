(function(root, factory) {
  // commonJS 规范
  if (typeof module === 'object' && module && module.exports) {
    module.exports = factory();
  }

  // 浏览器实现
  else {
    root.X1Scale = factory();
  }
}(this, function(){

  var X1Scale = function(opt){
    this.opt = opt;
  }

  X1Scale.prototype.realize = function(){
    var self = this;
    var dom = document.getElementById(self.opt.id)
    if(!dom) return console.log("error: dom id is not found")
    var scaleBox = dom.parentNode;

    var zoomIntensity = 0.2;
    var scale = 1;
    var originx = 0;
    var originy = 0;
    var nowTranX = 0;
    var nowTranY = 0;

    var mousedown = false;
    var mouseStartX = 0;
    var mouseStartY = 0;
    var mouseMoveX = 0;
    var mouseMoveY = 0;
    var realMouseX = 0;
    var realMouseY = 0;


    dom.style.webkitTransformOrigin = `0px 0px 0px`
    dom.style.webkitTransition = `all 0.1s ease-out`
    dom.style.cursor = `pointer`
    dom.setAttribute("draggable","false")


    dom.addEventListener("mousedown", down)
    dom.parentNode.addEventListener("mousemove", move)
    dom.addEventListener("mouseup", up)
    // dom.addEventListener("mouseleave", up)
    dom.addEventListener("touchstart", down)
    dom.parentNode.addEventListener("touchmove", move)
    dom.addEventListener("touchend", up)


    function down(e){
      mousedown = true;
      var eX = (e.clientX || e.clientX == 0)?e.clientX:e.touches[0].clientX;
      var eY = (e.clientY || e.clientY == 0)?e.clientY:e.touches[0].clientY;
      mouseStartX = eX - dom.offsetLeft;
      mouseStartY = eY - dom.offsetTop;
    }
    function move(e){
      if(!mousedown) return
      e.preventDefault()
      var eX = (e.clientX || e.clientX == 0)?e.clientX:e.touches[0].clientX;
      var eY = (e.clientY || e.clientY == 0)?e.clientY:e.touches[0].clientY;
      mouseMoveX = eX - mouseStartX;
      mouseMoveY = eY - mouseStartY;

      var tranX = nowTranX + mouseMoveX;
      var tranY = nowTranY + mouseMoveY;

      dom.style.webkitTransition = `all 0s ease-out`
      dom.style.webkitTransform = `translate(${tranX}px,${tranY}px) scale(${scale})`
    }
    function up(e){
      if(!mousedown) return
      mousedown = false

      realMouseX += mouseMoveX/scale
      realMouseY += mouseMoveY/scale
      nowTranX += mouseMoveX
      nowTranY += mouseMoveY
    }

    dom.onmousewheel = function (event){
        event.preventDefault();
        var mouseX = event.clientX - dom.offsetLeft;
        var mouseY = event.clientY - dom.offsetTop;
        var wheel = event.wheelDelta/120;
        var zoom = Math.exp(wheel*zoomIntensity);

        if(scale*zoom > 4) return
        if(scale*zoom < 0.5) return

        goScale(mouseX, mouseY, zoom)

    }

    function goScale(mouseX, mouseY, zoom){ //缩放计算||双指缩放
      var realX = originx+mouseX/scale - realMouseX;
      var realY = originy+mouseY/scale - realMouseY;
      nowTranX = mouseX -realX*(scale*zoom)
      nowTranY = mouseY -realY*(scale*zoom)
      dom.style.webkitTransition = `all 0.1s ease-out`
      dom.style.webkitTransform = `translate(${nowTranX}px,${nowTranY}px) scale(${scale*zoom})`

      originx -= mouseX/(scale*zoom) - mouseX/scale;
      originy -= mouseY/(scale*zoom) - mouseY/scale;

      scale *= zoom;
    }
  }

  return X1Scale
}));