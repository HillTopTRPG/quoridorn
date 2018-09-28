// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'bcdice-js/lib/preload-dicebots'
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import defaultImage from './assets/background-default.jpg'
import charBlue from './assets/char-blue.png'
import charCyan from './assets/char-cyan.png'
import charGray from './assets/char-gray.png'
import charGreen from './assets/char-green.png'
import charMagenta from './assets/char-magenta.png'
import charRed from './assets/char-red.png'
import charWhite from './assets/char-white.png'
import charYellow from './assets/char-yellow.png'

Vue.use(Vuex)

Vue.config.productionTip = false

Vue.directive('img', function (el, binding, compornent) {
  const imgData = binding.value
  var img = new Image()
  img.src = imgData

  img.onload = function () {
    el.src = imgData
    el.style.opacity = 1
    el.classList.add('loaded')
    el.style.transition = 'all 0.5s ease'
  }
})

Vue.directive('bg-img', function (el, binding, compornent) {
  const imgData = binding.value
  var img = new Image()
  img.src = imgData

  img.onload = function () {
    el.style['background-image'] = imgData
    el.style.opacity = 1
    el.classList.add('loaded')
    el.style.transition = 'all 0.5s ease'
  }
})

/**
 * Store
 * @type {Vuex}
 */
const store = new Vuex.Store({
  state: {
    connect: {
      peerId: ''
    },
    display: {
      gridLine: true,
      gridId: true,
      standImage: true,
      dice: true,
      cutIn: true,
      isFitGrid: true,
      pieceRotateMarker: true,
      standImageAutoResize: true,
      unSupportWindow: { isDisplay: false, doResetPosition: false, zIndex: 1, title: 'default' },
      chatWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
      initiativeWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
      resourceWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
      chatpaletteWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
      counterRemoConWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
      addCharacterWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
      functionListWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
      addMapMaskWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
      editMapMaskWindow: { isDisplay: false, doResetPosition: false, zIndex: 1, key: -1 },
      mapMaskContext: { isDisplay: false, doResetPosition: false, key: -1, x: 0, y: 0 },
      gameTableContext: { isDisplay: false, doResetPosition: false, x: 0, y: 0 },
      addCharacterSettingWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
      devLogWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
      publicMemoWindow: { isDisplay: false, doResetPosition: false, zIndex: 1, key: -1 },
      secretDiceWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
      bugFormWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 }
    },
    images: {
      background: [
        { data: defaultImage }
      ],
      tags: [
        { key: 0, name: '(全て)' },
        { key: 1, name: 'マップ' },
        { key: 2, name: 'キャラクター' },
        { key: 3, name: 'フロアタイル' },
        { key: 4, name: '立ち絵画像' }
      ],
      data: [
        { key: 0, tag: 'マップ', data: defaultImage },
        { key: 1, tag: 'キャラクター', data: charBlue },
        { key: 2, tag: 'キャラクター', data: charCyan },
        { key: 3, tag: 'キャラクター', data: charGray },
        { key: 4, tag: 'キャラクター', data: charGreen },
        { key: 5, tag: 'キャラクター', data: charMagenta },
        { key: 6, tag: 'キャラクター', data: charRed },
        { key: 7, tag: 'キャラクター', data: charWhite },
        { key: 8, tag: 'キャラクター', data: charYellow }
      ]
    },
    mouse: {
      x: 0,
      y: 0,
      drag: {
        from: {x: 0, y: 0},
        move: {x: 0, y: 0}
      }
    },
    room: {
      id: '1a2b3c4d5e6f', member: []
    },
    map: {
      grid: { c: 0, r: 0, totalColumn: 20, totalRow: 15, size: 48, color: 'rgba(25, 25, 25, .4)' },
      mouse: { onScreen: { x: 0, y: 0 }, onTable: { x: 0, y: 0 }, onCanvas: { x: 0, y: 0 } },
      imageIndex: 0,
      mapMasks: [],
      characters: [],
      draggingMapMask: null,
      marginGridNum: 60,
      isDraggingLeft: false,
      isMouseDownRight: false,
      isDraggingRight: false,
      move: {
        from: { x: 0, y: 0 },
        total: { x: 0, y: 0 },
        dragging: { x: 0, y: 0 }
      },
      angle: {
        total: 0,
        dragging: 0,
        dragStart: 0
      },
      wheel: 0,
      borderWidth: 60
    },
    charactors: [],
    chat: {
      tabs: [
        { text: 'メイン', isActive: true, isHover: false }
      ],
      logs: {
        'メイン': [
          { peerId: 12345, viewHtml: '<b>HillTop</b>：Hello World!!' },
          { peerId: 12345, viewHtml: '<span style="color: red;"><b>SYSTEM</b>：こちらデモ版です。</span>' },
          { peerId: 12345, viewHtml: '<span style="color: black;"><b>HillTop</b>：どどんとふの仕様にできるだけ近づけるように努力しています。</span>' },
          { peerId: 12345, viewHtml: '<span style="color: black;"><b>HillTop</b>：Twitterで私が困ってたらいろいろ教えていただけると嬉しいです。</span>' },
          { peerId: 12345, viewHtml: '<span style="color: black;"><b>HillTop</b>：9月末までは休みを利用して開発できますが、10月からは新しい仕事が始まるので、開発スピードが落ちます。</span>' }
        ]
      }
    },
    publicMemo: {
      editTab: '',
      contents: [
        {
          key: 0,
          texts: [
            {tab: 'メイン', text: 'これは共有メモでーす！'}
          ]
        }
      ]
    }
  },
  mutations: {
    /**
     * 設定を変更する
     * @param {object} state    state of Vuex
     * @param {string} property 設定のプロパティ名
     */
    changeDisplay (state, property) {
      if (typeof state.display[property] === 'boolean') {
        state.display[property] = !state.display[property]
      } else {
        state.display[property].isDisplay = !state.display[property].isDisplay
      }
    },
    onMount (state) {
      store._mutations.windowOpen[0]('chatWindow')
      store._mutations.windowOpen[0]('initiativeWindow')
      store._mutations.windowOpen[0]('resourceWindow')
      store._mutations.windowOpen[0]('chatpaletteWindow')
      store._mutations.windowOpen[0]('counterRemoConWindow')
      store._mutations.windowOpen[0]('functionListWindow')
      store._mutations.windowOpen[0]('addCharacterSettingWindow')
    },
    windowActive (state, property) {
      let current = 0
      let maxIndex = 0
      for (const key in state.display) {
        const value = state.display[key]
        if (!value.isDisplay) { continue }
        if (key === property) {
          current = value.zIndex
        }
        if (maxIndex < value.zIndex) {
          maxIndex = value.zIndex
        }
      }
      for (const key in state.display) {
        const value = state.display[key]
        if (!value.isDisplay) { continue }
        if (key === property) {
          value.zIndex = maxIndex
        } else {
          if (current <= value.zIndex) {
            value.zIndex--
          }
        }
      }
      for (const key in state.display) {
        const value = state.display[key]
        if (!value.isDisplay) { continue }
        // console.log(`${key}:${value.zIndex}`)
      }
      // console.log(`windowActive:${property} max:${maxIndex}`)
    },
    windowOpen (state, property) {
      if (state.display[property].isDisplay) {
        state.display[property].doResetPosition = true
      } else {
        state.display[property].isDisplay = true
      }
      let maxIndex = 0
      for (const key in state.display) {
        if (key === property) { continue }
        const value = state.display[key]
        if (!value.isDisplay) { continue }
        if (maxIndex < value.zIndex) { maxIndex = value.zIndex }
      }
      state.display[property].zIndex = maxIndex + 1
    },
    windowClose (state, property) {
      state.display[property].isDisplay = false
      for (const key in state.display) {
        const value = state.display[key]
        if (!value.isDisplay) { continue }
        if (value.zIndex > state.display[property].zIndex) { value.zIndex-- }
      }
    },
    doResetWindowLocate (state) {
      alert('未実装の機能です。')
    },
    setProperty (state, payload) {
      let propStr = payload.property
      let value = payload.value
      let isLogOff = payload.logOff
      const props = propStr.split('.')
      let target = state

      const propProc = (target, props, value, isLogOff) => {
        const prop = props.shift()
        if (props.length > 0) {
          propProc(target[prop], props, value, isLogOff)
        } else {
          target[prop] = value
        }
        // プロパティ名が数字だった場合は配列の更新として扱い、リアクティブになるよう、splice関数で更新する
        if (/^[0-9]+$/.test(prop)) {
          const index = parseInt(prop)
          target.splice(index, 1, target[index])
        }
      }

      propProc(target, props, value, isLogOff)
      if (!isLogOff) {
        console.log(`${propStr} = ${value}`)
      }
    },
    /**
     * マップマスク情報を追加する
     * @param {object} state   state of Vuex
     * @param {object} payload payload of Vuex
     */
    addMapMaskInfo (state, payload) {
      const obj = {
        isDraggingLeft: false,
        move: {
          from: { x: 0, y: 0 },
          dragging: { x: 0, y: 0 },
          gridOffset: { x: 0, y: 0 }
        },
        angle: {
          total: 0,
          dragging: 0,
          dragStart: 0
        },
        isLock: false
      }
      for (let prop in payload) {
        obj[prop] = payload[prop]
      }

      // キーを決める(欠番を埋めるスタイル)
      let key = -1
      let isFind
      do {
        key++
        isFind = false
        for (let mapMaskObj of state.map.mapMasks) {
          if (mapMaskObj.key === key) {
            isFind = true
            break
          }
        }
      } while (isFind)
      obj.key = key

      console.log(`[mutations] add mapMask => {key:${key}, name:"${obj.name}", locate(${obj.top}, ${obj.left}), CsRs(${obj.columns}, ${obj.rows}), bg:"${obj.color}", font:"${obj.fontColor}"}`)

      state.map.mapMasks.push(obj)
    },
    /**
     * ストアされているマップマスク情報を変更する
     * @param {object} state   state of Vuex
     * @param {object} payload state of Vuex
     */
    changeMapMaskInfo (state, payload) {
      let key = payload.key

      const mapMaskObj = this.getters.getPieceObj('mapMasks', key)
      for (let prop in payload) {
        if (prop === 'key') { continue }
        if (mapMaskObj[prop] !== payload[prop]) {
          console.log(`[mutations] update mapMask(${key}) => ${prop}: ${mapMaskObj[prop]} -> ${payload[prop]}`)
          mapMaskObj[prop] = payload[prop]
        }
      }
      const index = state.map['mapMasks'].indexOf(mapMaskObj)
      state.map.mapMasks.splice(index, 1, mapMaskObj)
    },
    /**
     * マップマスク情報の削除
     * @param {object} state state of Vuex
     * @param {number} key   マップマスクのキー
     */
    deleteMapMaskInfo (state, key) {
      const obj = this.getters.getPieceObj('mapMasks', key)
      const index = state.map.mapMasks.indexOf(obj)
      state.map.mapMasks.splice(index, 1)
    },
    /**
     * チャットのタブの構成を変更する
     * @param {object} state    state of Vuex
     * @param {string} tabsText タブ構成を意味する、スペース区切りの文字列
     */
    changeChatTab (state, tabsText) {
      // 配列を空にする
      state.chat.tabs.splice(0, state.chat.tabs.length)

      let lastActiveTab = this.getters.activeChatTab

      tabsText = 'メイン ' + tabsText
      let tabs = tabsText.split(' ')
      for (let tab of tabs) {
        let isActive = false
        if (lastActiveTab && lastActiveTab.name === tab) {
          isActive = true
        }
        let tabObj = {
          name: tab, isActive: isActive
        }
        state.chat.tabs.push(tabObj)
      }
      if (!lastActiveTab) {
        state.chat.tabs[0].isActive = true
      }

      // 削除されたタブの検知
      let deleteLogTabList = []
      for (let tab in state.chat.logs) {
        let findFlg = false
        for (let tabsTab of state.chat.tabs) {
          if (tabsTab.name === tab) {
            findFlg = true
            break
          }
        }
        if (!findFlg) {
          deleteLogTabList.push(tab)
        }
      }
      for (let delTabName of deleteLogTabList) {
        delete state.chat.logs[delTabName]
      }

      // 追加されたタブの検知
      for (let tabsTab of state.chat.tabs) {
        if (!state.chat.logs[tabsTab.name]) {
          state.chat.logs[tabsTab.name] = []
        }
      }
    },
    /**
     * チャットログを追加する（発言の記録）
     * @param {object} state   state of Vuex
     * @param {object} payload state of Vuex
     */
    addChatLog (state, payload) {
      let name = payload.name
      let text = payload.text
      let color = payload.color
      let tab = store.getters.activeChatTab.name
      let htmlText = '<span style="color: ' + color + '"><b>' + name + '</b>：' + text.replace(/\r?\n/g, '<br>') + '</span>'
      let logObj = {
        peerId: state.connect.peerId,
        viewHtml: htmlText
      }
      state.chat.logs[tab].push(logObj)
    },
    /**
     * チャットタブの選択を記録する
     * @param {object} state state of Vuex
     * @param {string} tab   state of Vuex
     */
    chatTabSelect (state, tab) {
      for (let tabObj of state.chat.tabs) {
        tabObj.isActive = tab === tabObj.name
      }
    }
  },
  getters: {
    activeChatTab: function (state) {
      let filtered = state.chat.tabs.filter(function (tabObj) { return tabObj.isActive })
      return filtered.length > 0 ? filtered[0] : null
    },
    chatLogs: function (state) {
      let result = state.chat.logs[store.getters.activeChatTab.name]
      return result
    },
    isFitGrid: function (state) {
      return state.display.isFitGrid
    },
    parseColor: (state) => (colorText) => {
      let colorObj = null
      if (colorText.startsWith('rgb')) {
        let splits = colorText.replace(/(rgba?\()|\)/g, '').split(',')
        colorObj = { r: parseInt(splits[0].trim()), g: parseInt(splits[1].trim()), b: parseInt(splits[2].trim()), a: colorText.startsWith('rgb(') ? 1 : parseFloat(splits[3].trim()) }
      } else if (colorText.startsWith('#')) {
        colorObj = { r: parseInt(colorText.substr(1, 2), 16), g: parseInt(colorText.substr(3, 2), 16), b: parseInt(colorText.substr(5, 2), 16), a: 1 }
      }
      colorObj.getColorCode = function () {
        return `#${('00' + this.r.toString(16)).slice(-2)}${('00' + this.g.toString(16)).slice(-2)}${('00' + this.b.toString(16)).slice(-2)}`
      }.bind(colorObj)
      colorObj.getColorCodeReverse = function () {
        return `#${('00' + (255 - this.r).toString(16)).slice(-2)}${('00' + (255 - this.g).toString(16)).slice(-2)}${('00' + (255 - this.b).toString(16)).slice(-2)}`
      }.bind(colorObj)
      colorObj.getRGB = function () { return `rgb(${this.r}, ${this.g}, ${this.b})` }.bind(colorObj)
      colorObj.getRGBA = function () { return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})` }.bind(colorObj)
      colorObj.getRGBReverse = function () { return `rgb(${255 - this.r}, ${255 - this.g}, ${255 - this.b})` }.bind(colorObj)
      return colorObj
    },
    objToString: (state) => (obj) => {
      let text = '{ '
      for (let key in obj) {
        let val = obj[key]
        if (typeof val === 'string') {
          val = `"${val}"`
        }
        text += `${key}:${val}, `
      }
      text = text.substr(0, text.length - 2)
      text += ' }'
      return text
    },
    getPieceObj: (state) => (type, key, logFlg) => {
      const filteredList = state.map[type].filter(obj => obj.key === key)
      if (filteredList.length === 0) {
        console.error(`指定されたピースは見つからなかった。type:"${type}", key:"${key}"`)
        return null
      }
      if (filteredList.length > 1) {
        console.error(`指定されたピースは複数Hitした。type:"${type}", key:"${key}"`)
        for (let obj of filteredList) {
          console.log('$$$', obj)
        }
        return null
      }
      if (logFlg) {
        console.log(`  [getters] pieceObj[${type}]#${key} => ${store.getters.objToString(filteredList[0])}`)
      }
      return filteredList[0]
    },
    isWindowOpen: (state) => (displayProperty) => {
      if (state.display[displayProperty] === undefined) {
        console.error(`displayProperty:${displayProperty} is not find!!`)
      }
      if (typeof state.display[displayProperty] === 'boolean') {
        return state.display[displayProperty]
      } else {
        return state.display[displayProperty].isDisplay
      }
    },
    doResetPosition: (state) => (displayProperty) => {
      // console.log(`window: ${displayProperty}, 再配置かどうか:${state.display[displayProperty].doResetPosition}`)
      return state.display[displayProperty].doResetPosition
    },
    pieceList: (state) => (type) => {
      const result = []
      for (let pieceObj of state.map[type]) {
        result.push({
          key: pieceObj.key
        })
      }
      return result
    },
    getBackgroundImage: function (state) {
      return state.images.background[state.map.imageIndex].data
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: {
    App: App
  },
  data: {
    scrollY: 0
  },
  mounted: function () {
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll () {
      this.scrollY = window.scrollY
      console.log('scroll', this.scrollY)
    }
  },
  template: `<App/>`
})
