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
          peerId: payload.peerId ? payload.peerId : rootState.private.connect.peerId,
          viewHtml: '<span style="color: ' + color + '"><b>' + name + '</b>：' + text.replace(/\r?\n/g, '<br>') + '</span>'
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
     * チャット文字連携処理
     */
    chatLinkage: ({ dispatch, rootState, rootGetters }, text) => {
      rootState.public.bgm.list
        .filter(bgmObj => bgmObj.chatLinkage && text.endsWith(bgmObj.title))
        .sort((a, b) => {
          if( a.title.length > b.title.length ) return -1;
          if( a.title.length < b.title.length ) return 1;
          return 0;
        })
        .filter((bgmObj, index, self) => self.filter((s, i) => (index > i) && (s.tag === bgmObj.tag)).length === 0)
        .forEach(bgmObj => {
          dispatch('windowOperation', { displayProperty: 'private.display.jukeboxWindow', method: 'add', args: [ bgmObj.key ] })
        })
    },
    /** ========================================================================
     * 画像を追加する
     */
    addImage: ({ dispatch }, payload) => { dispatch('sendNoticeOperation', { value: payload, method: 'doAddImage' }) },
    doAddImage: ({ rootState }, payload) => {
      // 欠番を埋める方式は不採用
      let maxKey = rootState.public.image.maxKey
      const key = `image-${++maxKey}`
      rootState.public.image.maxKey = maxKey
      rootState.public.image.list.push({
        tag: payload.tag,
        data: payload.data,
        key: key
      })
      if (rootState.private.connect.peerId === payload.ownerPeerId) {
        rootState.private.history.push({ type: 'add', key: key })
      }
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
        obj[prop] = payload[prop]
      }

      // 欠番を埋める方式は不採用
      let maxKey = rootState.public[payload.propName].maxKey
      const key = `${payload.kind}-${++maxKey}`
      obj.key = key
      rootState.public[payload.propName].maxKey = maxKey

      console.log(`[mutations] add ${payload.propName} => {key:${obj.key}, name:"${obj.name}", locate(${obj.top}, ${obj.left}), CsRs(${obj.columns}, ${obj.rows}), bg:"${obj.color}", font:"${obj.fontColor}"}`)

      rootState.public[payload.propName].list.push(obj)
      if (rootState.private.connect.peerId === payload.ownerPeerId) {
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
        if (prop === 'key' || prop === 'propName') { continue }
        if (pieceObj[prop] !== payload[prop]) {
          console.log(`[mutations] update ${propName}(${key}) => ${prop}: ${pieceObj[prop]} -> ${payload[prop]}`)
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
      // console.log(`delete pieceInfo -> ${payload.propName}(${payload.key})`)
      const obj = rootGetters.getPieceObj(payload.propName, payload.key)
      const index = rootState.public[payload.propName].list.indexOf(obj)
      rootState.public[payload.propName].list.splice(index, 1)

      if (rootState.private.connect.peerId === payload.ownerPeerId) {
        const delHistoryObj = rootState.private.history.filter(hisObj => hisObj.key === payload.key)[0]
        const delHistoryIndex = rootState.private.history.indexOf(delHistoryObj)
        rootState.private.history.splice(delHistoryIndex, 1)
      }
    }
  }
}
export default actionOperation
