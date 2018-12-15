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
const actionOperation = {
  actions: {
    /** ========================================================================
     * チャットログを追加する
     */
    addChatLog: ({ dispatch }, payload) => { dispatch('sendNoticeOperation', { value: payload, method: 'doAddChatLog' }) },
    doAddChatLog: ({ dispatch, rootState, rootGetters }, payload) => {
      let text = payload.text
      if (!text.startsWith('@')) {
        const activeChatTab = rootGetters.activeChatTab
        const name = payload.name
        const color = payload.color
        const tab = payload.tab ? payload.tab : activeChatTab.name
        const logObj = {
          owner: payload.owner,
          viewHtml: '<span style="color: ' + color + ';"><b>' + name + '</b>：' + text.replace(/\r?\n/g, '<br>') + '</span>'
        }
        // 未読カウントアップ
        if (tab !== activeChatTab.name) {
          const tabObj = rootState.public.chat.tabs.filter(tabObj => tabObj.name === tab)[0]
          tabObj.unRead++
          const index = rootState.public.chat.tabs.indexOf(tabObj)
          rootState.public.chat.tabs.splice(index, 1, tabObj)
        }
        rootState.public.chat.logs[tab].push(logObj)
      }

      // チャット文字連携処理
      dispatch('chatLinkage', text)
    },
    /** ========================================================================
     * チャット文字色変更
     */
    changeChatFontColor: ({ dispatch }, payload) => { dispatch('sendNoticeOperation', { value: payload, method: 'doChangeChatFontColor' }) },
    doChangeChatFontColor: ({ dispatch, rootState, rootGetters }, { key, color, historyChange }) => {
      console.log('doChangeChatFontColor', key, color, historyChange)
      const kind = key.split('-')[0]
      const target = rootState.public[kind].list.filter(obj => obj.key === key)[0]
      console.log(target, rootState.public[kind])
      if (!target) return
      target.fontColor = color
      if (!historyChange) return
      const change = {}
      for (const tab in rootState.public.chat.logs) {
        if (!rootState.public.chat.logs.hasOwnProperty(tab)) continue
        const changeTab = {}
        change[tab] = changeTab
        rootState.public.chat.logs[tab]
          .forEach((log, index) => {
            console.log('chatLogs', tab, log.owner, target.key, log.owner !== target.key, log.viewHtml)
            if (log.owner !== target.key) return
            console.log('push')
            changeTab[index] = {
              viewHtml: log.viewHtml.replace(/^(<span style="color: )([^;]+)(;">)/, `$1${color}$3`)
            }
          })
      }
      dispatch('setProperty', {property: `public.chat.logs`, value: change, isNotice: false, logOff: false})
    },
    /** ========================================================================
     * チャット文字連携処理
     */
    chatLinkage: ({ dispatch, rootState, rootGetters }, text) => {
      rootState.public.bgm.list
        .filter(bgmObj => {
          if (bgmObj.chatLinkage === 1 && text.endsWith(bgmObj.chatLinkageSearch)) {
            return true
          }
          return bgmObj.chatLinkage === 2 && new RegExp(bgmObj.chatLinkageSearch).test(text)
        })
        .sort((a, b) => {
          if (a.title.length > b.title.length) return -1
          if (a.title.length < b.title.length) return 1
          return 0
        })
        .filter((bgmObj, index, self) => self.filter((s, i) => (index > i) && (s.tag === bgmObj.tag)).length === 0)
        .forEach(bgmObj => {
          dispatch('setProperty', {property: 'private.display.jukeboxWindow.command', isNotice: true, value: {command: 'add', payload: bgmObj.key}})
        })
    },
    /** ========================================================================
     * 画像を追加する
     */
    addImage: ({ dispatch }, payload) => { dispatch('sendNoticeOperation', { value: payload, method: 'doAddImage' }) },
    doAddImage: ({ rootState }, { tag, data, ownerPeerId }) => {
      // 欠番を埋める方式は不採用
      let maxKey = rootState.public.image.maxKey
      const key = `image-${++maxKey}`
      rootState.public.image.maxKey = maxKey
      rootState.public.image.list.push({
        tag: tag,
        data: data,
        key: key
      })
      if (rootState.private.self.peerId === ownerPeerId) {
        rootState.private.history.push({ type: 'add', key: key })
      }
    },
    /** ========================================================================
     * 名前を変更する
     */
    changeName: ({ dispatch, rootState }, name) => {
      dispatch('setProperty', {property: 'private.self.currentChatName', value: name, logOff: false})
      // const myPeerId = rootState.private.self.peerId
      // const members = rootState.public.room.members
      // const myMemberObjList = members.filter(memberObj => memberObj.peerId === myPeerId)
      // if (myMemberObjList.length > 0) {
      //   const memberObj = myMemberObjList[0]
      //   const index = members.indexOf(memberObj)
      //   dispatch('setProperty', {property: `public.room.members.${index}.name`, value: name, logOff: true})
      //   dispatch('sendRoomData', { type: 'CHANGE_PLAYER_NAME', value: name })
      // }
    },
    /** ========================================================================
     * BGMを追加する
     */
    addBGM: ({ dispatch }, payload) => { dispatch('sendNoticeOperation', { value: payload, method: 'doAddBGM' }) },
    doAddBGM: ({ rootState }, payload) => {
      // 欠番を埋める方式は不採用
      let maxKey = rootState.public.bgm.maxKey
      const key = `bgm-${++maxKey}`
      rootState.public.bgm.maxKey = maxKey
      payload.key = key
      rootState.public.bgm.list.push(payload)
    },
    /** ========================================================================
     * マップオブジェクトを追加する
     */
    addPieceInfo: ({ dispatch }, payload) => { dispatch('sendNoticeOperation', { value: payload, method: 'doAddPieceInfo' }) },
    doAddPieceInfo: ({ rootState }, payload) => {
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
        if (!payload.hasOwnProperty(prop)) continue
        obj[prop] = payload[prop]
      }

      // 欠番を埋める方式は不採用
      let maxKey = rootState.public[payload.propName].maxKey
      const key = `${payload.kind}-${++maxKey}`
      obj.key = key
      rootState.public[payload.propName].maxKey = maxKey

      console.qLog(`[mutations] doAddPieceInfo => {type: ${obj.type}, key:${obj.key}, name:"${obj.name}", locate:(${obj.top}, ${obj.left}), CsRs:(${obj.columns}, ${obj.rows}), bg:"${obj.color}", font:"${obj.fontColor}"}`)

      rootState.public[payload.propName].list.push(obj)
      if (rootState.private.self.peerId === payload.ownerPeerId) {
        rootState.private.history.push({ type: 'add', key: key })
      }
    },
    /** ========================================================================
     * マップオブジェクト情報を変更する
     */
    changePieceInfo: ({ dispatch }, payload) => { dispatch('sendNoticeOperation', { value: payload, method: 'doChangePieceInfo' }) },
    doChangePieceInfo: ({ rootState, rootGetters }, payload) => {
      const key = payload.key
      const propName = payload.propName

      const pieceObj = rootGetters.getPieceObj(propName, key)
      for (let prop in payload) {
        if (!payload.hasOwnProperty(prop)) continue
        if (prop === 'key' || prop === 'propName') { continue }
        if (pieceObj[prop] !== payload[prop]) {
          console.qLog(`[mutations] update ${propName}(${key}) => ${prop}: ${pieceObj[prop]} -> ${payload[prop]}`)
          pieceObj[prop] = payload[prop]
        }
      }
      const index = rootState.public[propName].list.indexOf(pieceObj)
      rootState.public[propName].list.splice(index, 1, pieceObj)
    },
    /** ========================================================================
     * マップオブジェクトの削除
     */
    deletePieceInfo: ({ dispatch }, payload) => { dispatch('sendNoticeOperation', { value: payload, method: 'doDeletePieceInfo' }) },
    doDeletePieceInfo: ({ rootState, rootGetters }, payload) => {
      // console.qLog(`delete pieceInfo -> ${payload.propName}(${payload.key})`)
      const obj = rootGetters.getPieceObj(payload.propName, payload.key)
      const index = rootState.public[payload.propName].list.indexOf(obj)
      rootState.public[payload.propName].list.splice(index, 1)

      if (rootState.private.self.peerId === payload.ownerPeerId) {
        const delHistoryObj = rootState.private.history.filter(hisObj => hisObj.key === payload.key)[0]
        const delHistoryIndex = rootState.private.history.indexOf(delHistoryObj)
        rootState.private.history.splice(delHistoryIndex, 1)
      }
    },
    /** ========================================================================
     * デッキのシャッフル
     */
    shuffleDeck: ({ dispatch }) => { dispatch('sendNoticeOperation', { value: {}, method: 'doShuffleDeck' }) },
    doShuffleDeck: ({ rootState }) => {
      const cardList = rootState.public.deck.cards.list.concat()
      for (let i = cardList.length - 1; i >= 0; i--) {
        // 0~iのランダムな数値を取得
        const rand = Math.floor(Math.random() * (i + 1))

        // [cardList[i], cardList[rand]] = [cardList[rand], cardList[i]]
        const tmp = cardList[i]
        cardList[i] = cardList[rand]
        cardList[rand] = tmp
        // cardList.splice(i, 1, cardList[rand])
        // cardList.splice(rand, 1, tmp)
      }
      rootState.public.deck.cards.list = cardList
      // cardList.splice(0, 1, cardList[0])
    },
    /** ========================================================================
     * カードのドロー
     */
    drawCard: ({ dispatch }, payload) => { dispatch('sendNoticeOperation', { value: payload, method: 'doDrawCard' }) },
    doDrawCard: ({ rootState, rootGetters }, payload) => {
      const index = payload.index
      // const cardKey = payload.key

      const cardList = rootState.public.deck.cards.list
      const card = cardList[index]
      cardList.splice(index, 1)

      // TODO 手札に加える処理
      rootState.private.self.cards.push(card)

      // const obj = rootGetters.getPieceObj(payload.propName, payload.key)
      // const index = rootState.public[payload.propName].list.indexOf(obj)
      // rootState.public[payload.propName].list.splice(index, 1)
      //
      // if (rootState.private.self.peerId === payload.ownerPeerId) {
      //   const delHistoryObj = rootState.private.history.filter(hisObj => hisObj.key === payload.key)[0]
      //   const delHistoryIndex = rootState.private.history.indexOf(delHistoryObj)
      //   rootState.private.history.splice(delHistoryIndex, 1)
      // }
    }
  }
}
export default actionOperation
