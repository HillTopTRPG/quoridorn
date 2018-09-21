// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import Menu from './components/Menu'
import ChatWindow from './components/ChatWindow'

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
      chatWindow: true,
      dice: true,
      initiativeWindow: true,
      resourceWindow: true,
      chatpaletteWindow: true,
      counterRemoConWindow: true,
      standImage: true,
      standImageAutoResize: true,
      cutIn: true,
      pieceRotateMarker: true,
      gridOn: true
    },
    room: {
      id: '1a2b3c4d5e6f',
      member: []
    },
    charactors: [

    ],
    chat: {
      tabs: [
        {
          text: 'メイン',
          isActive: true,
          isHover: false
        }
      ],
      logs: {
        'メイン': [
          {
            peerId: 12345,
            viewHtml: '<b>HillTop</b>：Hello World!!'
          },
          {
            peerId: 12345,
            viewHtml: '<span style="color: red;"><b>SYSTEM</b>：おはようございますだぜぇ</span>'
          },
          {
            peerId: 12345,
            viewHtml: '<span style="color: red;"><b>SYSTEM</b>：ワイルドだろぉ？</span>'
          },
          {
            peerId: 12345,
            viewHtml: '<span style="color: red;"><b>SYSTEM</b>：時代遅れとか言ってんじゃないぜぇ？</span>'
          },
          {
            peerId: 12345,
            viewHtml: '<span style="color: black;"><b>HillTop</b>：テストメッセージのセンス（ぇ</span>'
          }
        ]
      }
    }
  },
  mutations: {
    changeDisplay (state, property) {
      state.display[property] = !state.display[property]
    },
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
          name: tab,
          isActive: isActive
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
    chatTabSelect (state, tab) {
      for (let tabObj of state.chat.tabs) {
        tabObj.isActive = tab === tabObj.name
      }
    }
  },
  getters: {
    activeChatTab: (state) => {
      let filtered = state.chat.tabs.filter(tabObj => tabObj.isActive)
      return filtered.length > 0 ? filtered[0] : null
    },
    chatLogs: (state) => {
      let result = state.chat.logs[store.getters.activeChatTab.name]
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
  template: `
  <div>
    <ChatWindow></ChatWindow>
    <App></App>
    <Menu></Menu>
  </div>
  `
})
