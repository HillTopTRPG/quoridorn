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
    doAddChatLog: ({ rootState, rootGetters }, payload) => {
      const peerId = payload.peerId ? payload.peerId : rootState.private.connect.peerId
      const activeChatTab = rootGetters.activeChatTab
      let name = payload.name
      let text = payload.text
      let color = payload.color
      let tab = payload.tab ? payload.tab : activeChatTab.name
      let htmlText = '<span style="color: ' + color + '"><b>' + name + '</b>：' + text.replace(/\r?\n/g, '<br>') + '</span>'
      let logObj = {
        peerId: peerId,
        viewHtml: htmlText
      }
      if (tab !== activeChatTab.name) {
        const tabObj = rootState.public.chat.tabs.filter(tabObj => tabObj.name === tab)[0]
        tabObj.unRead++
        const index = rootState.public.chat.tabs.indexOf(tabObj)
        rootState.public.chat.tabs.splice(index, 1, tabObj)
      }
      rootState.public.chat.logs[tab].push(logObj)
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
     * マップマスク情報を変更する
     */
    changeMapMaskInfo: ({ dispatch }, payload) => { dispatch('sendNoticeOperation', { value: payload, method: 'doChangeMapMaskInfo' }) },
    doChangeMapMaskInfo: ({ rootState, rootGetters }, payload) => {
      let key = payload.key

      const mapMaskObj = rootGetters.getPieceObj('mapMask', key)
      for (let prop in payload) {
        if (prop === 'key') { continue }
        if (mapMaskObj[prop] !== payload[prop]) {
          console.log(`[mutations] update mapMask(${key}) => ${prop}: ${mapMaskObj[prop]} -> ${payload[prop]}`)
          mapMaskObj[prop] = payload[prop]
        }
      }
      const index = rootState.public['mapMask'].list.indexOf(mapMaskObj)
      rootState.public['mapMask'].list.splice(index, 1, mapMaskObj)
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
