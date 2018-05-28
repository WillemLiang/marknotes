// ==UserScript==
// @name            简书 Markdown 预览同步滚动
// @name:en         Jianshu MD AUTO Scroll
// @namespace       https://github.com/BlindingDark/JianshuMDAutoScroll
// @include         *://www.jianshu.com/writer*
// @version         1.3
// @description:en  jianshu Markdown preview AUTO scroll
// @description     给简书的在线 Markdown 编辑器增加输入预览同步滚动的功能
// @author          BlindingDark
// @grant           none
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.js
// ==/UserScript==

(function() {
  'use strict';
  var spSwitchMain; // 切换的那个按钮所在的窗体
  var txtEditor;    // 输入框
  var spPreview;    // 预览框

  const CM_HEADER = '.cm-header';

  function getInput() {
    return $('.CodeMirror-scroll');
  }

  function getPreview() {
    return $('.render');
  }

  function scrollEvent(){
    txtEditor = getInput()[0];
    spPreview = getPreview()[0];

    if(txtEditor == undefined || spPreview == undefined) {
      return;
    }

    function scrolling(){
        //spPreview.scrollTop = Math.round((txtEditor.scrollTop + txtEditor.clientHeight) * spPreview.scrollHeight / txtEditor.scrollHeight - spPreview.clientHeight* spPreview.scrollHeight / txtEditor.scrollHeight);
        spPreview.scrollTop = Math.round(txtEditor.scrollTop * (spPreview.scrollHeight-txtEditor.clientHeight) / (txtEditor.scrollHeight-spPreview.clientHeight) );
    }

    getInput().on('scroll', () => scrolling());
  }

  function scrollToHeader(){
    var header_text = $(this).text().replace(/ +$/g,'').replace(/^[#]+ /g,'');
    var pre_head_pattern = ':header:contains("' + header_text + '")';
    var topOffset = getPreview()[0].scrollTop + $(pre_head_pattern).offset().top - $(pre_head_pattern).height() - parseInt($(pre_head_pattern).css('marginTop'));
    getPreview().animate({
          scrollTop: topOffset + "px"
          }, {
          duration: 300,
          easing: "swing"  //"linear"
        });
  }

  function cycle() {
    scrollEvent();
    $(CM_HEADER).on('click', scrollToHeader);
    window.setTimeout(cycle, 1000);
  }

  cycle();
})();
