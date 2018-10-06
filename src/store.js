// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'bcdice-js/lib/preload-dicebots'
import Vue from 'vue'
import Vuex from 'vuex'
import defaultImage from './assets/background-default.jpg'
import pawnBlack from './assets/charactor/pawnBlack.png'
import pawnBlue from './assets/charactor/pawnBlue.png'
import pawnGreen from './assets/charactor/pawnGreen.png'
import pawnLightBlue from './assets/charactor/pawnLightBlue.png'
import pawnOrange from './assets/charactor/pawnOrange.png'
import pawnPink from './assets/charactor/pawnPink.png'
import pawnPurple from './assets/charactor/pawnPurple.png'
import pawnRed from './assets/charactor/pawnRed.png'
import pawnWhite from './assets/charactor/pawnWhite.png'
import pawnYellow from './assets/charactor/pawnYellow.png'
import floorTiles001 from './assets/floorTiles/floorTile_001.jpg'
import floorTiles002 from './assets/floorTiles/floorTile_008.jpg'
import floorTiles003 from './assets/floorTiles/floorTile_011.jpg'
import floorTiles004 from './assets/floorTiles/floorTile_012.jpg'
import floorTiles005 from './assets/floorTiles/floorTile_027.jpg'
import floorTiles006 from './assets/floorTiles/floorTile_038.jpg'
import floorTiles007 from './assets/floorTiles/floorTile_047.jpg'
import floorTiles008 from './assets/floorTiles/floorTile_059.jpg'
import standGlassAngry from './assets/stand/glass_angry.png'
import standGlassNormal from './assets/stand/glass_normal.png'
import standGlassSmile from './assets/stand/glass_smile.png'
import standSportsAngry from './assets/stand/sports_angry.png'
import standSportsNormal from './assets/stand/sports_normal.png'
import standSportsSmile from './assets/stand/sports_smile.png'

Vue.use(Vuex)

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
      functionListWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
      addMapMaskWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
      editMapMaskWindow: { isDisplay: false, doResetPosition: false, zIndex: 1, key: -1 },
      mapMaskContext: { isDisplay: false, doResetPosition: false, key: -1, x: 0, y: 0 },
      characterContext: { isDisplay: false, doResetPosition: false, key: -1, x: 0, y: 0 },
      gameTableContext: { isDisplay: false, doResetPosition: false, x: 0, y: 0 },
      devLogWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
      publicMemoWindow: { isDisplay: false, doResetPosition: false, zIndex: 1, key: -1 },
      secretDiceWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
      addCharacterSettingWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
      editCharacterWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
      dropChooseWindow: { isDisplay: false, doResetPosition: false, zIndex: 1, imageDataList: null },
      addCharacterWindow: {
        isDisplay: false,
        doResetPosition: false,
        zIndex: 1,
        name: '',
        size: 1,
        useImageList: '',
        isHide: false,
        url: '',
        text: '',
        useImageIndex: 0,
        currentImageTag: '',
        isContinuous: false,
        continuousNum: 1
      }
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
        { key: 4, name: '立ち絵' }
      ],
      data: [
        { key: 0, tag: 'マップ', data: defaultImage, password: '' },
        { key: 1, tag: 'キャラクター', data: pawnBlack, password: '' },
        { key: 2, tag: 'キャラクター', data: pawnBlue, password: '' },
        { key: 3, tag: 'キャラクター', data: pawnGreen, password: '' },
        { key: 4, tag: 'キャラクター', data: pawnLightBlue, password: '' },
        { key: 5, tag: 'キャラクター', data: pawnOrange, password: '' },
        { key: 6, tag: 'キャラクター', data: pawnPink, password: '' },
        { key: 7, tag: 'キャラクター', data: pawnPurple, password: '' },
        { key: 8, tag: 'キャラクター', data: pawnRed, password: '' },
        { key: 9, tag: 'キャラクター', data: pawnWhite, password: '' },
        { key: 10, tag: 'キャラクター', data: pawnYellow, password: '' },
        { key: 11, tag: 'フロアタイル', data: floorTiles001, password: '' },
        { key: 12, tag: 'フロアタイル', data: floorTiles002, password: '' },
        { key: 13, tag: 'フロアタイル', data: floorTiles003, password: '' },
        { key: 14, tag: 'フロアタイル', data: floorTiles004, password: '' },
        { key: 15, tag: 'フロアタイル', data: floorTiles005, password: '' },
        { key: 16, tag: 'フロアタイル', data: floorTiles006, password: '' },
        { key: 17, tag: 'フロアタイル', data: floorTiles007, password: '' },
        { key: 18, tag: 'フロアタイル', data: floorTiles008, password: '' },
        { key: 19, tag: '立ち絵', data: standGlassAngry, password: '' },
        { key: 20, tag: '立ち絵', data: standGlassNormal, password: '' },
        { key: 21, tag: '立ち絵', data: standGlassSmile, password: '' },
        { key: 22, tag: '立ち絵', data: standSportsAngry, password: '' },
        { key: 23, tag: '立ち絵', data: standSportsNormal, password: '' },
        { key: 24, tag: '立ち絵', data: standSportsSmile, password: '' }
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
      grid: { c: 0, r: 0, totalColumn: 20, totalRow: 15, size: 48, color: 'rgba(0, 0, 0, 1)' },
      mouse: { onScreen: { x: 0, y: 0 }, onTable: { x: 0, y: 0 }, onCanvas: { x: 0, y: 0 } },
      imageIndex: 0,
      mapMasks: [],
      characters: [],
      marginGridNum: 60,
      isDraggingLeft: false,
      isMouseDownRight: false,
      isDraggingRight: false,
      isOverEvent: false,
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
      rollObj: {
        isRolling: false,
        propName: '',
        key: 0
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
      // store._mutations.windowOpen[0]('addCharacterSettingWindow')
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
    addImage (state, payload) {
      // キーを決める(欠番を埋めるスタイル)
      let key = -1
      let isFind
      do {
        key++
        isFind = false
        for (let imageObj of state.images.data) {
          if (imageObj.key === key) {
            isFind = true
            break
          }
        }
      } while (isFind)

      state.images.data.push({
        tag: payload.tag,
        data: payload.image,
        key: key
      })
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
        console.log(`# ${propStr} = ${value}`)
      }
    },
    /**
     * マップマスク情報を追加する
     * @param {object} state   state of Vuex
     * @param {object} payload payload of Vuex
     */
    addPieceInfo (state, payload) {
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
        for (let pieceObj of state.map[payload.propName]) {
          if (pieceObj.key === `${payload.kind}-${key}`) {
            isFind = true
            break
          }
        }
      } while (isFind)
      obj.key = `${payload.kind}-${key}`

      console.log(`[mutations] add ${payload.kind} => {key:${obj.key}, name:"${obj.name}", locate(${obj.top}, ${obj.left}), CsRs(${obj.columns}, ${obj.rows}), bg:"${obj.color}", font:"${obj.fontColor}"}`)

      state.map[payload.propName].push(obj)
    },
    imageTagChange (state, payload) {
      const key = payload.key
      const imageList = payload.imageList
      const imageObj = imageList.filter(imageObj => imageObj.key === key)[0]
      const useTexts = []
      /* eslint no-control-regex: 0 */
      const regExp = new RegExp('[　\t \r\n,]+', 'g')
      console.log(imageList)
      imageList.forEach(imageObj => {
        console.log(`######### `, imageObj)
        const tags = imageObj.currentTag.replace(regExp, ',').split(',')
        console.log(tags.join(', '))
        Array.prototype.push.apply(useTexts, tags)
      })

      const tags = state.images.tags
      const images = state.images.data
      const deleteList = []
      let addList = useTexts.concat()
      tags.forEach(tag => {
        if (tag.key === 0) {
          return
        }
        let findFlg = false
        useTexts.forEach(text => {
          if (findFlg) return
          if (tag.name === text) {
            findFlg = true
            addList = addList.filter(item => item !== text)
          }
        })
        if (!findFlg) {
          images.forEach(imageObj => {
            if (findFlg) return
            imageObj.tag.split(',').forEach(imgTag => {
              if (imgTag === tag.name) {
                findFlg = true
              }
            })
          })
        }
        if (!findFlg) {
          deleteList.push(tag)
        }
      })
      deleteList.forEach(delTagObj => {
        const index = tags.indexOf(delTagObj)
        tags.splice(index, 1)
      })
      addList.forEach(add => {
        let nextKey = -1
        let isFind
        do {
          nextKey++
          isFind = false
          for (const tag of tags) {
            if (tag.key === nextKey) {
              isFind = true
              break
            }
          }
        } while (isFind)
        tags.push({
          name: add,
          key: nextKey
        })
      })
      const tagTexts = imageObj.currentTag.replace(regExp, ',').split(',')
      imageObj.selectTag = tagTexts[tagTexts.length - 1]
      const index = imageList.indexOf(imageObj)
      imageList.splice(index, 1, imageObj)
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
     * @param {object} payload state of Vuex
     */
    deletePieceInfo (state, payload) {
      const obj = this.getters.getPieceObj(payload.propName, payload.key)
      const index = state.map[payload.propName].indexOf(obj)
      state.map[payload.propName].splice(index, 1)
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
export default store
