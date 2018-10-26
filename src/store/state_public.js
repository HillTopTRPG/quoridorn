// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'bcdice-js/lib/preload-dicebots'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/**
 * Store
 * @type {Vuex}
 */
const storeModulePublic = {
  // publicデータは、ルーム参加者に展開したりデータ保存に利用するデータ
  state: {
    setting: {
      gridLine: true, // マス目を表示するか
      gridId: true, // 座標を表示するか
      pieceRotateMarker: true, // 回転マーカーを表示するかどうか
      isFitGrid: true // マス目に合わせて動かすかどうか
    },
    image: {
      tags: {
        list: [
          { key: 'imgTag-0', name: '(全て)' },
          { key: 'imgTag-1', name: 'マップ' },
          { key: 'imgTag-2', name: 'キャラクター' },
          { key: 'imgTag-3', name: 'フロアタイル' },
          { key: 'imgTag-4', name: '立ち絵' }
        ],
        maxKey: 4
      },
      list: [
        { key: 'image-0', tag: 'マップ', data: require('../assets/background-default.jpg'), password: '' },
        { key: 'image-1', tag: 'キャラクター', data: require('../assets/charactor/pawnBlack.png'), password: '' },
        { key: 'image-2', tag: 'キャラクター', data: require('../assets/charactor/pawnBlue.png'), password: '' },
        { key: 'image-3', tag: 'キャラクター', data: require('../assets/charactor/pawnGreen.png'), password: '' },
        { key: 'image-4', tag: 'キャラクター', data: require('../assets/charactor/pawnLightBlue.png'), password: '' },
        { key: 'image-5', tag: 'キャラクター', data: require('../assets/charactor/pawnOrange.png'), password: '' },
        { key: 'image-6', tag: 'キャラクター', data: require('../assets/charactor/pawnPink.png'), password: '' },
        { key: 'image-7', tag: 'キャラクター', data: require('../assets/charactor/pawnPurple.png'), password: '' },
        { key: 'image-8', tag: 'キャラクター', data: require('../assets/charactor/pawnRed.png'), password: '' },
        { key: 'image-9', tag: 'キャラクター', data: require('../assets/charactor/pawnWhite.png'), password: '' },
        { key: 'image-10', tag: 'キャラクター', data: require('../assets/charactor/pawnYellow.png'), password: '' },
        { key: 'image-11', tag: 'フロアタイル', data: require('../assets/floorTiles/floorTile_001.jpg'), password: '' },
        { key: 'image-12', tag: 'フロアタイル', data: require('../assets/floorTiles/floorTile_008.jpg'), password: '' },
        { key: 'image-13', tag: 'フロアタイル', data: require('../assets/floorTiles/floorTile_011.jpg'), password: '' },
        { key: 'image-14', tag: 'フロアタイル', data: require('../assets/floorTiles/floorTile_012.jpg'), password: '' },
        { key: 'image-15', tag: 'フロアタイル', data: require('../assets/floorTiles/floorTile_027.jpg'), password: '' },
        { key: 'image-16', tag: 'フロアタイル', data: require('../assets/floorTiles/floorTile_038.jpg'), password: '' },
        { key: 'image-17', tag: 'フロアタイル', data: require('../assets/floorTiles/floorTile_047.jpg'), password: '' },
        { key: 'image-18', tag: 'フロアタイル', data: require('../assets/floorTiles/floorTile_059.jpg'), password: '' },
        { key: 'image-19', tag: '立ち絵', data: require('../assets/stand/glass_angry.png'), password: '' },
        { key: 'image-20', tag: '立ち絵', data: require('../assets/stand/glass_normal.png'), password: '' },
        { key: 'image-21', tag: '立ち絵', data: require('../assets/stand/glass_smile.png'), password: '' },
        { key: 'image-22', tag: '立ち絵', data: require('../assets/stand/sports_angry.png'), password: '' },
        { key: 'image-23', tag: '立ち絵', data: require('../assets/stand/sports_normal.png'), password: '' },
        { key: 'image-24', tag: '立ち絵', data: require('../assets/stand/sports_smile.png'), password: '' }
      ],
      maxKey: 24
    },
    room: { id: '', members: [], system: 'DiceBot', password: '' },
    map: {
      imageKey: 'image-0',
      marginGridNum: 60,
      borderWidth: 60,
      grid: { totalColumn: 20, totalRow: 15, size: 48, color: 'rgba(0, 0, 0, 1)' }
    },
    mapMask: { list: [], maxKey: -1 },
    character: { list: [], maxKey: -1 },
    chit: { list: [], maxKey: -1 },
    chat: {
      tabs: [ { name: 'メイン', isActive: true, isHover: false, unRead: 0 } ],
      logs: {
        'メイン': [
          { peerId: 12345, viewHtml: '<b>HillTop</b>：Hello World!!' },
          { peerId: 12345, viewHtml: '<span style="color: red;"><b>SYSTEM</b>：こちらデモ版です。</span>' },
          { peerId: 12345, viewHtml: '<span style="color: black;"><b>HillTop</b>：どどんとふの仕様にできるだけ近づけるように努力しています。</span>' },
          { peerId: 12345, viewHtml: '<span style="color: black;"><b>HillTop</b>：Twitterで私が困ってたらいろいろ教えていただけると嬉しいです。</span>' },
          { peerId: 12345, viewHtml: '<span style="color: black;"><b>HillTop</b>：9月末までは休みを利用して開発できますが、10月からは新しい仕事が始まるので、開発スピードが落ちます。</span>' }
        ]
      },
      inputting: {}
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
  actions: {
    emptyMember: ({ commit }) => commit('emptyMember'),
    chatTabSelect: ({ commit }, tab) => commit('chatTabSelect', tab),
    imageTagChange: ({ commit }, payload) => commit('imageTagChange', payload),
    changeChatTab ({ getters, commit }, tabsText) {
      commit('changeChatTab', {
        tabsText: tabsText,
        lastActiveTab: getters.activeChatTab
      })
    },
    noticeInput: ({ commit, state }, peerId) => {
      commit('inputPeerId', { peerId: peerId, add: 1 })
      setTimeout(() => {
        commit('inputPeerId', { peerId: peerId, add: -1 })
      }, 400)
    }
  },
  mutations: {
    emptyMember: state => state.room.members.splice(0, state.room.members.length),
    /** チャットのタブを選択したことをデータに反映する */
    chatTabSelect (state, tab) {
      for (let tabObj of state.chat.tabs) {
        tabObj.isActive = tab === tabObj.name
        // 未読数をリセット
        if (tabObj.isActive) {
          tabObj.unRead = 0
        }
      }
    },
    inputPeerId (state, payload) {
      if (!state.chat.inputting[payload.peerId]) {
        this._vm.$set(state.chat.inputting, payload.peerId, 0)
      }
      state.chat.inputting[payload.peerId] += payload.add
    },
    /** チャットのタブの構成を変更する */
    imageTagChange (state, payload) {
      const key = payload.key
      const imageList = payload.imageList
      const imageObj = imageList.filter(imageObj => imageObj.key === key)[0]
      const useTexts = []
      /* eslint no-control-regex: 0 */
      const regExp = new RegExp('[　\t \r\n,]+', 'g')
      // console.log(imageList)
      imageList.forEach(imageObj => {
        Array.prototype.push.apply(useTexts, imageObj.currentTag.replace(regExp, ',').split(','))
      })

      let addList = useTexts.concat() // 配列をシャロ―コピー
      const deleteList = state.image.tags.list.filter(tag => {
        // 「(全て)」は消させない
        if (tag.key === 'tagImg-0') { return }

        let findFlg = false
        const filteredList = useTexts.filter(txt => txt === tag.name)
        if (filteredList.length > 0) {
          findFlg = true
          addList = addList.filter(item => item !== filteredList[0])
        }
        if (!findFlg) {
          state.image.list.forEach(imageObj => {
            if (findFlg) return
            const filteredList = imageObj.tag.split(',').filter(imgTag => imgTag === tag.name)
            if (filteredList.length > 0) {
              findFlg = true
            }
          })
        }
        return !findFlg
      })
      // 削除リストに基づいてタグを消していく
      deleteList.forEach(delTagObj => state.image.tags.list.splice(state.image.tags.list.indexOf(delTagObj), 1))
      // 追加リストに基づいてタグを追加していく
      let maxKey = state.image.tags.maxKey
      addList.forEach(add => {
        // 欠番を埋める方式は不採用
        state.image.tags.list.push({
          name: add,
          key: `imgTag-${++maxKey}`
        })
      })
      state.image.tags.maxKey = maxKey
      // セレクトボックスに表示される項目は、入力された内容の末尾の指定を使う
      const tagTexts = imageObj.currentTag.replace(regExp, ',').split(',')
      imageObj.selectTag = tagTexts[tagTexts.length - 1]
      // リアクティブ発火
      imageList.splice(imageList.indexOf(imageObj), 1, imageObj)
    },
    /** チャットのタブの構成を変更する */
    changeChatTab (state, {tabsText, lastActiveTab}) {
      // 配列を空にする
      state.chat.tabs.splice(0, state.chat.tabs.length)

      tabsText = 'メイン ' + tabsText
      let tabs = tabsText.split(' ')
      for (let tab of tabs) {
        let isActive = false
        if (lastActiveTab && lastActiveTab.name === tab) {
          isActive = true
        }
        let tabObj = {
          name: tab,
          isActive: isActive,
          isHover: false,
          unRead: 0
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
    }
  },
  getters: {
    activeChatTab: state => state.chat.tabs.filter(tabObj => tabObj.isActive)[0],
    chatLogs: (state, getters) => state.chat.logs[getters.activeChatTab.name],
    isFitGrid: state => state.setting.isFitGrid,
    getPieceObj: (state, getters) => (type, key, logFlg) => {
      const filteredList = state[type].list.filter(obj => obj.key === key)
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
        console.log(`  [getters] pieceObj[${type}]#${key} => ${getters.objToString(filteredList[0])}`)
      }
      return filteredList[0]
    },
    pieceList: state => type => state[type].list.map(pieceObj => ({ key: pieceObj.key })),
    getBackgroundImage: state => state.image.list.filter(d => d.key === state.map.imageKey)[0].data
  }
}
export default storeModulePublic
