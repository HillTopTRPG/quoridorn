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
 * @type {Vuex}
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
    onMount ({ dispatch, state }) {
      dispatch('windowOpen', 'private.display.chatWindow')
      // dispatch('windowOpen', 'private.display.initiativeWindow')
      // dispatch('windowOpen', 'private.display.resourceWindow')
      // dispatch('windowOpen', 'private.display.chatpaletteWindow')
      // dispatch('windowOpen', 'private.display.counterRemoConWindow')
      dispatch('windowOpen', 'private.display.functionListWindow')
      const getParam = (name, url = window.location.href) => {
        name = name.replace(/[[\]]/g, '\\$&')
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
        var results = regex.exec(url)
        if (!results) return null
        if (!results[2]) return ''
        return decodeURIComponent(results[2].replace(/\+/g, ' '))
      }
      // const webif = getParam('webif')
      const roomId = getParam('roomId')
      const peerId = getParam('peerId')
      const password = getParam('password')
      state.private.connect.password = password
      if (roomId) {
        dispatch('createPeer', {
          roomId: roomId,
          peerId: peerId
        })
      }
    },
    sendNoticeOperation ({ dispatch, state }, payload) {
      let type = null
      if (state.public.room.members[0]) {
        payload.value.ownerPeerId = state.private.connect.peerId
        if (state.public.room.members[0].peerId === state.private.connect.peerId) {
          type = 'DO_METHOD'
          dispatch(payload.method, payload.value)
        } else {
          type = 'NOTICE_OPERATION'
        }
        dispatch('sendRoomData', { type: type, value: payload.value, method: payload.method })
      } else {
        payload.value.ownerPeerId = null
        dispatch(payload.method, payload.value)
      }
    },
    changeDisplay ({ dispatch }, payload) {
      dispatch('sendNoticeOperation', { value: payload, method: 'doChangeDisplay' })
    },
    doChangeDisplay ({ getters, commit }, {property}) {
      const target = getters.getState(property)
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
    setProperty ({ dispatch }, payload) {
      if (payload.isNotice) {
        dispatch('sendNoticeOperation', { value: payload, method: 'doSetProperty' })
      } else {
        dispatch('doSetProperty', payload)
      }
    },
    /**
     * stateに対するあらゆるデータ格納を代理する関数
     */
    doSetProperty ({ commit }, payload) {
      commit('doSetProperty', payload)
    },
    emptyProperty ({ dispatch }, payload) {
      if (payload.isNotice) {
        dispatch('sendNoticeOperation', { value: payload, method: 'doEmptyProperty' })
      } else {
        dispatch('doEmptyProperty', payload)
      }
    },
    doEmptyProperty ({ getters }, payload) {
      if (!payload.logOff) {
        console.log(`#empty ${payload.property}:`)
      }
      const target = getters.getState(payload.property)
      target.splice(0, target.length)
    }
  },
  mutations: {
    /**
     * stateに対するあらゆるデータ格納を代理する関数
     */
    doSetProperty (state, payload) {
      if (!payload.logOff) {
        console.log(`#set ${payload.property}:`, payload.value)
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
                const val = props[prop]
                if (!(val instanceof Object) || (val instanceof Array)) {
                  target[prop] = val
                } else {
                  propProc2(target[prop], val)
                }
              }
            }
            propProc2(target[prop], value)
          }
        }
        // 配列の場合、リアクティブになるよう、splice関数で更新する
        if (target instanceof Array) {
          const index = parseInt(prop)
          target.splice(index, 1, target[index])
        }
      }
      propProc(state, payload.property.split('.'), payload.value)
    }
  },
  getters: {
    getState: (state) => (property) => {
      const props = property.split('.')
      let target = state
      props.forEach((prop, index) => {
        target = target[prop]
      })
      return target
    },
    isWindowOpen: (state, getters) => (displayProperty) => {
      const target = getters.getState(displayProperty)
      if (typeof target === 'boolean') {
        return target
      } else {
        return target.isDisplay
      }
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
    }
  }
})
export default store
