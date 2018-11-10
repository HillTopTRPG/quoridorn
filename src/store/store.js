// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'bcdice-js/lib/preload-dicebots'
import Vue from 'vue'
import Vuex from 'vuex'
import statePrivate from './state_private'
import statePublic from './state_public'
import actionFile from './action_file'
import actionPeer from './action_peer'
import actionOperation from './action_operation'

Vue.use(Vuex)

/**
 * Store
 * @type {Store}
 */
const store = new Vuex.Store({
  modules: {
    private: statePrivate,
    public: statePublic,
    file: actionFile,
    peer: actionPeer,
    operation: actionOperation
  },
  state: {
    // 以下は揮発性データ（操作中の一時的な記憶領域として使うだけなので、保存データには含めない）
    mouse: { x: 0, y: 0, drag: { from: {x: 0, y: 0}, move: {x: 0, y: 0} } },
    connect: { webRtcPeer: null },
    room: {
      webRtcRoom: null
    },
    map: {
      grid: { c: 0, r: 0 },
      mouse: { onScreen: { x: 0, y: 0 }, onTable: { x: 0, y: 0 }, onCanvas: { x: 0, y: 0 } },
      isDraggingLeft: false,
      isMouseDownRight: false,
      isDraggingRight: false,
      isOverEvent: false,
      move: {
        from: { x: 0, y: 0 },
        total: { x: 0, y: 0 },
        dragging: { x: 0, y: 0 }
      },
      rollObj: {
        isRolling: false,
        propName: '',
        key: 0
      },
      angle: {
        dragging: 0,
        dragStart: 0
      }
    },
    operationQueue: [],
    volatilSaveData: {
      members: []
    }
  },
  actions: {
    /**
     * =================================================================================================================
     * 起動時の最初の処理
     * @param dispatch
     * @param state
     */
    onMount ({ dispatch, state }) {
      // 特定の画面は最初に開く
      setTimeout(() => {
        dispatch('windowOpen', 'private.display.chatWindow')
        // dispatch('windowOpen', 'private.display.initiativeWindow')
        // dispatch('windowOpen', 'private.display.resourceWindow')
        // dispatch('windowOpen', 'private.display.chatPaletteWindow')
        // dispatch('windowOpen', 'private.display.counterRemoConWindow')
        dispatch('windowOpen', 'private.display.functionListWindow')
      }, 0)

      // URLパラメータの処理
      // const webif = getParam('webif')
      const roomId = window['getUrlParam']('roomId')
      const peerId = window['getUrlParam']('peerId')
      const password = window['getUrlParam']('password')
      state.private.connect.password = !password ? '' : password

      // 部屋が指定されていたら接続しにいく
      if (roomId) {
        dispatch('createPeer', {
          roomId: roomId,
          peerId: peerId
        })
      }
    },

    /**
     * =================================================================================================================
     * ルームメンバがいる場合は部屋主に対して処理の通知を出し、そうでない場合はこの場で処理を実行する
     * @param dispatch
     * @param state
     * @param method
     * @param value
     */
    sendNoticeOperation ({ dispatch, state }, { method, value }) {
      let type = null
      if (state.public.room.members[0]) {
        value.ownerPeerId = state.private.connect.peerId
        if (state.public.room.members[0].peerId === state.private.connect.peerId) {
          type = 'DO_METHOD'
          dispatch(method, value)
        } else {
          type = 'NOTICE_OPERATION'
        }
        dispatch('sendRoomData', { type: type, value: value, method: method })
      } else {
        value.ownerPeerId = null
        dispatch(method, value)
      }
    },

    /**
     * =================================================================================================================
     * 指定されたプロパティパスの値を反転させる
     * @param dispatch
     * @param payload
     * @returns {*}
     */
    changeDisplay: ({ dispatch }, payload) =>
      dispatch('sendNoticeOperation', { value: payload, method: 'doChangeDisplay' }),
    /**
     * 指定されたプロパティパスの値を反転させる
     * @param getters
     * @param commit
     * @param property
     */
    doChangeDisplay: ({ getters, commit }, { property }) => {
      const target = getters.getStateValue(property)
      const payload = {}
      if (typeof target === 'boolean') {
        payload.property = property
        payload.value = !target
      } else {
        payload.property = `${property}.isDisplay`
        payload.value = !target.isDisplay
      }
      commit('doSetProperty', payload)
    },

    /**
     * =================================================================================================================
     * stateに対するあらゆるデータ格納を代理する関数
     * @param dispatch
     * @param payload
     */
    setProperty: ({ dispatch }, payload) => {
      if (payload.isNotice) {
        dispatch('sendNoticeOperation', { value: payload, method: 'doSetProperty' })
      } else {
        dispatch('doSetProperty', payload)
      }
    },
    /**
     * stateに対するあらゆるデータ格納を代理する関数
     * @param commit
     * @param payload
     * @returns {*}
     */
    doSetProperty: ({ commit }, payload) => commit('doSetProperty', payload),

    /**
     * =================================================================================================================
     * 指定されたプロパティパスにある配列を空にする
     * @param dispatch
     * @param payload
     */
    emptyProperty: ({ dispatch }, payload) => {
      if (payload.isNotice) {
        dispatch('sendNoticeOperation', { value: payload, method: 'doEmptyProperty' })
      } else {
        dispatch('doEmptyProperty', payload)
      }
    },
    /**
     * 指定されたプロパティパスにある配列を空にする
     * @param getters
     * @param property
     * @param logOff
     */
    doEmptyProperty: ({ getters }, { property, logOff }) => {
      if (!logOff) {
        console.log(`#empty ${property}:`)
      }
      const target = getters.getStateValue(property)
      target.splice(0, target.length)
    }
  },
  mutations: {
    /**
     * stateに対するあらゆるデータ格納を代理する関数
     * @param state
     * @param property プロパティパス
     * @param value 代入する値
     * @param logOff true:ログを出力しない
     */
    doSetProperty: (state, {property, value, logOff = false}) => {
      if (!logOff) {
        console.log(`#set ${property}:`, value)
      }

      const propProc = (target, props, value) => {
        const prop = props.shift()
        if (props.length > 0) {
          propProc(target[prop], props, value)
        } else {
          // 値の適用
          if (!(value instanceof Object) || (value instanceof Array)) {
            target[prop] = value
          } else {
            const propProc2 = (target, props) => {
              for (const prop in props) {
                if (!props.hasOwnProperty(prop)) continue
                const val = props[prop]
                if (!(val instanceof Object) || (val instanceof Array)) {
                  target[prop] = val
                } else {
                  if (!target[prop]) {
                    target[prop] = {}
                  }
                  propProc2(target[prop], val)
                }
                // 配列の場合、リアクティブになるよう、splice関数で更新する
                if (target instanceof Array) {
                  const index = parseInt(prop, 10)
                  target.splice(index, 1, target[index])
                }
              }
            }
            if (!target[prop]) {
              target[prop] = {}
            }
            propProc2(target[prop], value)
          }
        }
        // 配列の場合、リアクティブになるよう、splice関数で更新する
        if (target instanceof Array) {
          const index = parseInt(prop, 10)
          target.splice(index, 1, target[index])
        }
      }
      propProc(state, property.split('.'), value)
    }
  },
  getters: {
    getStateValue: state =>
      /**
       * stateから指定されたプロパティパスの値を取得する
       * @param property
       * @returns {*}
       */
      (property) => {
        let target = state
        property.split('.').forEach(prop => {
          target = target[prop]
        })
        return target
      },

    isWindowOpen: (state, getters) =>
      /**
       * isDisplayに相当するプロパティ値を取得する
       * @param displayProperty
       * @returns {*}
       */
      (displayProperty) => {
        const target = getters.getStateValue(displayProperty)
        return typeof target === 'boolean' ? target : target.isDisplay
      },

    getKeyObj: () =>
      /**
       * keyをプロパティとして持つオブジェクトの配列から指定されたkeyを持つオブジェクトを検索する
       * @param list
       * @param key
       * @returns {*}
       */
      (list, key) => {
        const filteredList = list.filter(obj => obj.key === key)
        if (filteredList.length === 0) {
          console.warn(`key:"${key}" is not find.`)
          return null
        }
        if (filteredList.length > 1) {
          console.warn(`key:"(${key})" is duplicate.`)
          return null
        }
        return filteredList[0]
      },

    parseColor: () =>
      /**
       * 文字をparseしてカラー編集オブジェクトを生成する
       * @param colorText
       * @returns {*}
       */
      (colorText) => {
        let _c = null
        if (colorText.startsWith('rgb')) {
          let splits = colorText.replace(/(rgba?\()|\)/g, '').split(',')
          _c = { r: parseInt(splits[0].trim(), 10), g: parseInt(splits[1].trim(), 10), b: parseInt(splits[2].trim(), 10), a: colorText.startsWith('rgb(') ? 1 : parseFloat(splits[3].trim()) }
        } else if (colorText.startsWith('#')) {
          _c = { r: parseInt(colorText.substr(1, 2), 16), g: parseInt(colorText.substr(3, 2), 16), b: parseInt(colorText.substr(5, 2), 16), a: 1 }
        }
        _c.getColorCode = () =>
          `#${('00' + _c.r.toString(16)).slice(-2)}${('00' + _c.g.toString(16)).slice(-2)}${('00' + _c.b.toString(16)).slice(-2)}`
        _c.getColorCodeReverse = () =>
          `#${('00' + (255 - _c.r).toString(16)).slice(-2)}${('00' + (255 - _c.g).toString(16)).slice(-2)}${('00' + (255 - _c.b).toString(16)).slice(-2)}`
        _c.getRGB = () =>
          `rgb(${_c.r}, ${_c.g}, ${_c.b})`
        _c.getRGBA = () =>
          `rgba(${_c.r}, ${_c.g}, ${_c.b}, ${_c.a})`
        _c.getRGBReverse = () =>
          `rgb(${255 - _c.r}, ${255 - _c.g}, ${255 - _c.b})`
        return _c
      },

    objToString: () =>
      /**
       * 指定されたオブジェクトの内容を示す文字列を生成する
       * @param obj
       * @returns {string}
       */
      (obj) => {
        let text = '{ '
        for (const key in obj) {
          if (!obj.hasOwnProperty(key)) continue
          let val = obj[key]
          if (typeof val === 'string') {
            val = `"${val}"`
          }
          text += `${key}:${val}, `
        }
        text = text.substr(0, text.length - 2)
        text += ' }'
        return text
      }
  }
})
export default store
