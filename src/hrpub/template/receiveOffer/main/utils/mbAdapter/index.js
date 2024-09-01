// reset font-size
(function (doc, win) {
  console.log("cccc")
    var docEl = doc.documentElement,
      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc  = function () {
          var clientWidth = win.screen.width;
          var clientHeight = win.screen.height;
          //考勤横屏window要用height比例rem
          // if( clientHeight < clientWidth ){ // 在弹出键盘的时候，这个数据就不对了
          if( win.screen.height < win.screen.width ){
            clientWidth = clientHeight;
          }
  
          if (clientWidth>=750) {
              clientWidth = 750;
          };
          if (!clientWidth) return;
            docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
            window.fontSize = 100 * (clientWidth / 750)
          };
        if (!doc.addEventListener) return;
        win.addEventListener(resizeEvt, recalc, false);
        doc.addEventListener('DOMContentLoaded', recalc, false);
  })(document, window);
  