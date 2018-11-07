
/**
 * Javascriptを動的にロードする。
 * {@link http://blog.yuhiisk.com/archive/2014/12/20/dynamic-loading-and-complete-processing-of-script.html 参考URL}
 * @param  {string}    src      - 読み込むJavascriptのパス
 * @param  {Function}  callback - 読み込み完了後に呼び出されるコールバック関数
 * @return {undefined}          - なし
 */
function loadScript(src, callback) {
  let done = false
  let head = document.getElementsByTagName('head')[0]
  let script = document.createElement('script')
  script.src = src
  head.appendChild(script)
  // Attach handlers for all browsers
  script.onload = script.onreadystatechange = function () {
    if (!done && (!this.readyState ||
      this.readyState === 'loaded' || this.readyState === 'complete')) {
      done = true
      callback()
      // Handle memory leak in IE
      script.onload = script.onreadystatechange = null
      if (head && script.parentNode) {
        head.removeChild(script)
      }
    }
  }
}
