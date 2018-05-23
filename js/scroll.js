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

  function scrollEvent(isHeaderScrolling){
    txtEditor = getInput()[0];
    spPreview = getPreview()[0];

    if(txtEditor == undefined || spPreview == undefined) {
      return;
    }

    let edtFlag = false; // 抵消两个滚动事件之间互相触发
    let preFlag = false; // 如果两个 flag 都为 true，证明是反弹过来的事件引起的

    function scrolling(who){
      if(who == 'pre'){
        preFlag = true;
        if (edtFlag === true){ // 抵消两个滚动事件之间互相触发
          edtFlag = false;
          preFlag = false;
          return;
        }
        //txtEditor.scrollTop = Math.round((spPreview.scrollTop + spPreview.clientHeight) * txtEditor.scrollHeight  / spPreview.scrollHeight - txtEditor.clientHeight);
        txtEditor.scrollTop = Math.round(spPreview.scrollTop * (txtEditor.scrollHeight-spPreview.clientHeight) / (spPreview.scrollHeight-txtEditor.clientHeight)  );
        return;
      }
      if(who == 'main'){
        edtFlag = true;
        if (preFlag === true){ // 抵消两个滚动事件之间互相触发
          edtFlag = false;
          preFlag = false;
          return;
        }
        //spPreview.scrollTop = Math.round((txtEditor.scrollTop + txtEditor.clientHeight) * spPreview.scrollHeight / txtEditor.scrollHeight - spPreview.clientHeight* spPreview.scrollHeight / txtEditor.scrollHeight);
        spPreview.scrollTop = Math.round(txtEditor.scrollTop * (spPreview.scrollHeight-txtEditor.clientHeight) / (txtEditor.scrollHeight-spPreview.clientHeight) );
        return;
      }
    }

    function mainOnscroll(){
      scrolling('main');
    }

    function preOnscroll(){
      scrolling('pre');
    }

    getInput().on('scroll', () => mainOnscroll());
    if(!isHeaderScrolling){
      getPreview().on('scroll', () => preOnscroll());
    }
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
    return true;
  }

  function cycle() {
    var isHeaderScrolling = false;
    isHeaderScrolling = $(CM_HEADER).on('click', scrollToHeader);
    scrollEvent(isHeaderScrolling);
    window.setTimeout(cycle, 1000);
  }

  cycle();
})();
