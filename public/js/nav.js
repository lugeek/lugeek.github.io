/* 控制导航按钮动作 */
function nav_click(button) {
  if(document.getElementById("nav_btn").value=="off"){
    document.getElementById("nav_btn").value="on";
     /* 显示左侧aside */
    $('.aside')
      .addClass('visible-md visible-lg visible-sm visible-xs')
      .removeClass('hidden-md hidden-lg hidden-sm hidden-xs')
    /* 调整右侧内容 */
    $('.aside3')
      .removeClass('col-md-12 col-lg-12 col-sm-12 col-xs-12')
      .addClass('col-md-10 col-lg-10 col-sm-9 col-xs-9');
    /*调整按钮*/
    $('.menu-btn')
      .removeClass('btn-off')
      .addClass('btn-on');
  } else {
    document.getElementById("nav_btn").value="off";
     /* 隐藏左侧aside */
    $('.aside')
      .removeClass('visible-md visible-lg visible-sm visible-xs')
      .addClass('hidden-md hidden-lg hidden-sm hidden-xs');
    /* 右侧内容最大化 */
    $('.aside3')
      .removeClass('col-md-10 col-lg-10 col-sm-9 col-xs-9')
      .addClass('col-md-12 col-lg-12 col-sm-12 col-xs-12');
    /*调整按钮*/
    $('.menu-btn')
      .removeClass('btn-on')
      .addClass('btn-off');
  }
}
