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

  const HEADERS   = ':header';

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
        txtEditor.scrollTop = Math.round((spPreview.scrollTop + spPreview.clientHeight) * txtEditor.scrollHeight  / spPreview.scrollHeight - txtEditor.clientHeight);
        return;
      }
      if(who == 'main'){
        edtFlag = true;
        if (preFlag === true){ // 抵消两个滚动事件之间互相触发
          edtFlag = false;
          preFlag = false;
          return;
        }
        spPreview.scrollTop = Math.round((txtEditor.scrollTop + txtEditor.clientHeight) * spPreview.scrollHeight / txtEditor.scrollHeight - spPreview.clientHeight);
        //if (txtEditor.scrollTop == 0) {
        //    spPreview.scrollTop = 0;
        //}
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
    getPreview().on('scroll', () => preOnscroll());
  }

  function cycle() {
    scrollEvent();
    $(HEADERS).on('click', scrollEvent);
    window.setTimeout(cycle, 1000);
  }

  cycle();
})();
