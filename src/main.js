// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import Menu from './components/Menu'
import ChatWindow from './components/ChatWindow'
import AddMapMaskWindow from './components/AddMapMaskWindow'
import EditMapMaskWindow from './components/EditMapMaskWindow'
import MapMaskContext from './components/MapMaskContext'

Vue.use(Vuex)

Vue.config.productionTip = false

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
      gridOn: true,
      pieceRotateMarker: true,
      standImageAutoResize: true,
      chatWindow: { isDisplay: true, doResetPosition: false },
      initiativeWindow: { isDisplay: true, doResetPosition: false },
      resourceWindow: { isDisplay: true, doResetPosition: false },
      chatpaletteWindow: { isDisplay: true, doResetPosition: false },
      counterRemoConWindow: { isDisplay: true, doResetPosition: false },
      addMapMaskWindow: { isDisplay: false, doResetPosition: false },
      editMapMaskWindow: { isDisplay: false, doResetPosition: false, index: -1 },
      mapMaskContext: { isDisplay: false, doResetPosition: false, index: -1 }
    },
    room: {
      id: '1a2b3c4d5e6f', member: []
    },
    map: {
      grid: { c: 20, r: 16, size: 50, color: 'rgb(255, 255, 255)' },
      mapMasks: [],
      draggingMapMask: null
    },
    charactors: [],
    chat: {
      tabs: [
        { text: 'メイン', isActive: true, isHover: false }
      ],
      logs: {
        'メイン': [
          { peerId: 12345, viewHtml: '<b>HillTop</b>：Hello World!!' },
          { peerId: 12345, viewHtml: '<span style="color: red;"><b>SYSTEM</b>：おはようございますだぜぇ</span>' },
          { peerId: 12345, viewHtml: '<span style="color: red;"><b>SYSTEM</b>：ワイルドだろぉ？</span>' },
          { peerId: 12345, viewHtml: '<span style="color: red;"><b>SYSTEM</b>：時代遅れとか言ってんじゃないぜぇ？</span>' },
          { peerId: 12345, viewHtml: '<span style="color: black;"><b>HillTop</b>：テストメッセージのセンス（ぇ</span>' }
        ]
      }
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
    windowOpen (state, property) {
      if (state.display[property].isDisplay) {
        state.display[property].doResetPosition = true
      } else {
        state.display[property].isDisplay = true
      }
    },
    /**
     * 設定を変更する
     * @param {object} state   state of Vuex
     * @param {object} payload payload of Vuex
     */
    changeDisplayValue (state, payload) {
      let main = payload.main
      let sub = payload.sub
      let value = payload.value
      console.log(`display[${main}][${sub}] = ${value}`)
      state.display[main][sub] = value
    },
    /**
     * マップマスク情報を追加する
     * @param {object} state   state of Vuex
     * @param {object} payload payload of Vuex
     */
    addMapMaskInfo (state, payload) {
      const copyProps = ['name', 'gridC', 'gridR', 'gridW', 'gridH', 'color', 'fontColor']

      const mapMaskObj = { isLock: false }
      for (let prop of copyProps) {
        mapMaskObj[prop] = payload[prop]
      }

      state.map.mapMasks.push(mapMaskObj)
    },
    /**
     * ストアされているマップマスク情報を変更する
     * @param {object} state   state of Vuex
     * @param {object} payload state of Vuex
     */
    changeMapMaskInfo (state, payload) {
      const copyProps = ['name', 'gridC', 'gridR', 'gridW', 'gridH', 'color', 'fontColor', 'isLock']
      let index = payload.index
      console.log(`マップマスクの情報を変更(${index})`, payload)

      const lastMapMaskObj = state.map.mapMasks[index]
      const mapMaskObj = {}
      for (let prop of copyProps) {
        if (payload[prop] !== undefined) {
          console.log(`prop:${prop}を${payload[prop]}で上書き`, index, lastMapMaskObj)
          lastMapMaskObj[prop] = payload[prop]
        } else {
          mapMaskObj[prop] = lastMapMaskObj[prop]
        }
      }
      // setTimeout(function () { state.map.mapMasks.splice(index, 0, state.map.mapMasks.splice(index, 1)) }, 0)
    },
    /**
     * ドラッグ中のマップマスクの登録
     * @param {object} state state of Vuex
     * @param {number} index マップマスクを管理する配列のインデックス
     */
    setDraggingMapMask (state, index) {
      // console.log(`mapMask drag start ${index}`)
      const mapMaskObj = state.map.mapMasks.splice(index, 1)[0]
      state.map.draggingMapMask = mapMaskObj
    },
    /**
     * ドラッグ中のマップマスクの位置情報を変更し、表示状態にする
     * @param {object} state   state of Vuex
     * @param {object} payload state of Vuex
     */
    moveMapMask (state, payload) {
      // console.log(`mapMask drag end`)
      const mapMaskObj = state.map.draggingMapMask
      mapMaskObj.gridC = payload.gridC
      mapMaskObj.gridR = payload.gridR
      state.map.mapMasks.push(mapMaskObj)
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
      let htmlText = '<span style="font-color: ' + color + '"><b>' + name + '</b>：' + text.replace(/\r?\n/g, '<br>') + '</span>'
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
    isWindowOpen: (state) => (displayProperty) => {
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
    mapMaskList: function (state) {
      const result = []
      for (let mapMaskObj of state.map.mapMasks) {
        let styleObj = {
          top: (mapMaskObj.gridR - 1) * state.map.grid.size + 'px',
          left: (mapMaskObj.gridC - 1) * state.map.grid.size + 'px',
          width: mapMaskObj.gridW * state.map.grid.size - 2 + 'px',
          height: mapMaskObj.gridH * state.map.grid.size - 2 + 'px',
          'background-color': mapMaskObj.color,
          color: mapMaskObj.fontColor
        }
        let name = mapMaskObj.name
        result.push({
          name: name,
          style: styleObj,
          isLock: mapMaskObj.isLock
        })
      }
      return result
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: {
    Menu: Menu,
    ChatWindow: ChatWindow,
    App: App,
    AddMapMaskWindow: AddMapMaskWindow,
    EditMapMaskWindow: EditMapMaskWindow,
    MapMaskContext: MapMaskContext
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
  template: `
  <div>
    <ChatWindow title="ChatWindow"/>
    <App/>
    <Menu/>
    <AddMapMaskWindow title="AddMapMaskWindow"/>
    <EditMapMaskWindow title="EditMapMaskWindow"/>
    <MapMaskContext displayProperty="mapMaskContext"/>
  </div>
  `
})
