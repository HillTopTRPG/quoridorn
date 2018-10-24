// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'bcdice-js/lib/preload-dicebots'
import Vue from 'vue'
import Vuex from 'vuex'
import Peer from 'skyway-js'

Vue.use(Vuex)

/**
 * Store
 * @type {Vuex}
 */
const actionPeer = {
  actions: {
    /** ========================================================================
     * WebRTCでPeer接続し、Roomにも接続する
     */
    createPeer ({ rootState, dispatch }, payload) {
      const options = {
        key: window.__SKYWAY_KEY__,
        debug: 1
      }
      console.log(`PeerId: ${payload.peerId}, RoomId: ${payload.roomId}`)
      const peer = new Peer(payload.peerId, options)
      // Await connections from others
      peer.on('connection', () => dispatch('connectFunc'))

      /* ------------------------------
       * Peer接続成功時
       */
      peer.on('open', id => {
        // セーブデータからの復元の場合は既にpeerIdが格納されており、接続
        if (rootState.private.connect.peerId !== id) {
          rootState.private.connect.peerId = id
          console.log(`RoomPassword:'${rootState.private.connect.password}'`)
          rootState.public.room.password = rootState.private.connect.password
          console.log(`RoomPassword:'${rootState.public.room.password}'`)
          rootState.public.room.members.push({
            peerId: id,
            name: rootState.private.connect.playerName,
            color: 'black',
            isCame: true
          })
        }
        const roomId = payload.roomId
        if (roomId) {
          console.log(`Room: ${roomId} に接続を試みます...`)
          const room = rootState.connect.webRtcPeer.joinRoom(roomId)
          room.on('open', function () {
            rootState.room.webRtcRoom = room
            dispatch('connectFunc', room)
          })
        } else {
          console.error(`RoomIdは必須項目です。`)
          alert(`RoomIdは必須項目です。`)
        }
      })

      // Peer接続に関するエラーはこちらにてハンドリング
      peer.on('error', err => {
        console.error(err)
        if (err.message.indexOf('is already in use') > 0) {
          alert(`接続に失敗しました。\npeerId:${payload.peerId}は既に使われています。\n異なるpeerIdを指定してください。`)
        } else {
          // alert(`接続に失敗しました。\n原因は不明です。\nF12を押して、表示されるコンソールに書かれている赤い文字をコピーして、開発者にご展開ください。`)
        }
      })

      // 既にPeer接続していたら、その接続は破棄する
      if (rootState.connect.webRtcPeer && !rootState.connect.webRtcPeer.destroyed) {
        rootState.connect.webRtcPeer.destroy()
      }
      rootState.connect.webRtcPeer = peer

      // 画面が閉じられたらPeer接続を破棄
      window.onunload = window.onbeforeunload = e => {
        if (peer && !peer.destroyed) {
          peer.destroy()
        }
      }
    },
    /** ========================================================================
     * 接続後の処理
     */
    connectFunc: ({ rootState, dispatch }, room) => {
      // Handle a chat connection.
      console.log(room)
      const roomName = room.name.replace('sfu_text_', '')

      const logName = 'SYSTEM'
      const logColor = 'red'
      const logTab = 'メイン'

      rootState.public.room.id = roomName

      // 誰かが入室してきた場合
      room.on('peerJoin', peerId => {
        const filtered = rootState.public.room.members.filter(memberObj => memberObj.peerId === peerId)
        if (filtered.length > 0) {
        } else {
          rootState.public.room.members.push({
            peerId: peerId,
            name: '',
            color: 'black',
            isCame: false
          })
        }
        // 自分が親だったら、入ってきた人に部屋情報を教えてあげる
        console.log(`EVENT[peerJoin] ${rootState.private.connect.peerId} -> ${peerId}`)
        if (rootState.public.room.members[0].peerId === rootState.private.connect.peerId) {
          rootState.room.webRtcRoom.send({ type: 'NOTICE_OTHER_PLAYER', value: rootState.public, targets: [peerId] })
        }
      })

      // 誰かが退室した場合
      room.on('peerLeave', peerId => {
        // console.log(peerId, rootState.public.room.members)
        const memberObj = rootState.public.room.members.filter(member => member.peerId === peerId)[0]
        if (!memberObj) { return }
        const index = rootState.public.room.members.indexOf(memberObj)
        if (memberObj.isCame) {
          dispatch('addChatLog', {
            peerId: peerId,
            name: logName,
            text: `${memberObj.name}(${peerId}) が退室しました。`,
            color: logColor,
            tab: logTab
          })
        }
        rootState.public.room.members.splice(index, 1)
      })

      // 誰かがデータを送信した場合
      room.on('data', message => {
        const peerId = message.src
        const sendData = message.data
        const memberObj = rootState.public.room.members.filter(member => member.peerId === peerId)[0]
        const index = rootState.public.room.members.indexOf(memberObj)
        const targets = sendData.targets
        if (!targets || targets.length === 0 || targets.filter(target => target === rootState.private.connect.peerId).length > 0) {
          const type = sendData.type
          const value = sendData.value
          if (type === 'DO_METHOD') {
            console.log(`$$ Data has been sent -> TYPE:${type} METHOD:${sendData.method} VALUE:`, value)
          } else {
            console.log(`$$ Data has been sent -> TYPE:${type} VALUE:`, value)
          }
          switch (type) {
            // ルームメンバーの情報を受け取ったとき
            case 'NOTICE_OTHER_PLAYER':
              const roomPassword = value.room.password
              if (roomPassword !== rootState.private.connect.password) {
                alert('入力されたパスワードが部屋のパスワードと一致しません。')
                dispatch('logout')
                break
              }

              console.log(`Room: ${roomName} に接続しました。`)
              // チャット追加
              dispatch('addChatLog', {
                name: logName,
                text: `Room: ${roomName} に接続しました！！`,
                color: logColor,
                tab: logTab
              })

              let me = null
              value.room.members.forEach(memberObj => {
                if (memberObj.peerId === rootState.private.connect.peerId) {
                  memberObj.isCame = true
                  rootState.private.connect.playerName = memberObj.name
                  me = memberObj
                }
              })
              if (!me) {
                me = rootState.public.room.members[0]
                // 自分を一番後ろにする
                value.room.members.push(me)
              }
              rootState.public = value
              // ルームメンバーに自己紹介する
              rootState.room.webRtcRoom.send({ type: 'NOTICE_MY_INFO', value: { name: me.name, color: me.color } })
              break
            // ルームメンバーの名前が変わったとき
            case 'CHANGE_PLAYER_NAME':
              memberObj.name = value
              rootState.public.room.members.splice(index, 1, memberObj)
              break
            // ルームメンバーの自己紹介を受け取ったとき
            case 'NOTICE_MY_INFO':
              memberObj.name = value.name
              memberObj.color = value.color
              memberObj.isCame = true
              dispatch('addChatLog', {
                peerId: peerId,
                name: logName,
                text: `PeerId: ${peerId} が入室しました。`,
                color: logColor,
                tab: logTab
              })
              rootState.public.room.members.splice(index, 1, memberObj)
              break
            // チャット発言を受け取ったとき
            case 'SEND_CHAT':
              dispatch('addChatLog', {
                peerId: peerId,
                name: memberObj.name,
                text: value.text,
                color: memberObj.color,
                tab: value.tab
              })
              break
            // 画面操作を受け取ったとき
            case 'DO_METHOD':
              const method = sendData.method
              delete value.isNotice
              dispatch(method, value)
              break
            // privateデータの要求を受けたとき
            case 'REQUEST_PRIVATE_DATA':
              rootState.room.webRtcRoom.send({ type: 'SEND_PRIVATE_DATA', value: rootState.private, targets: [peerId] })
              break
            // privateデータの要求を受けたとき
            case 'SEND_PRIVATE_DATA':
              rootState.volatilSaveData.members.push(value)
              if (rootState.volatilSaveData.members.length === rootState.public.room.members.length) {
                dispatch('doExport')
              }
              break
            case 'NOTICE_OPERATION':
              // 自分が親だったら、この通知を処理して、ルームメンバーに土管する
              if (rootState.public.room.members[0].peerId === rootState.private.connect.peerId) {
                const method = sendData.method
                dispatch('sendRoomData', { type: 'DO_METHOD', value: value, method: method })
                dispatch(method, value)
              }
              break
            default:
          }
        }
      })
    },
    /** ========================================================================
     * 部屋の存在確認チェック
     */
    checkRoomName ({ rootState }, payload) {
      const roomName = payload.roomName
      const roomFindFunc = payload.roomFindFunc
      const roomNonFindFunc = payload.roomNonFindFunc

      let peer = new Peer({
        key: window.__SKYWAY_KEY__,
        debug: 1
      })
      let peerId = null
      const connectFunc = room => {
        room.on('data', message => {
          const sendData = message.data
          const targets = sendData.targets
          if (!targets || targets.length === 0 || targets.filter(target => target === peerId).length > 0) {
            if (sendData.type === 'NOTICE_OTHER_PLAYER') {
              const filtered = sendData.value.room.members.filter(memberObj => memberObj.peerId === rootState.private.connect.peerId)
              if (filtered.length > 0) {
                roomFindFunc('この部屋は現在あなたが入室している部屋です。')
              } else {
                roomFindFunc('この部屋は既に存在します。決定を押すと参加できます。')
              }
              if (peer && !peer.destroyed) {
                peer.destroy()
                peer = null
              }
            }
          }
        })
      }
      peer.on('connection', connectFunc)
      peer.on('open', id => {
        peerId = id
        const room = peer.joinRoom(roomName)
        room.on('open', function () {
          connectFunc(room)
          setTimeout(() => {
            if (peer && !peer.destroyed) {
              peer.destroy()
              peer = null
              if (roomNonFindFunc) {
                roomNonFindFunc()
              }
            }
          }, 1000)
        })
      })
      peer.on('error', err => {
        console.error(err)
      })
    },
    /** ========================================================================
     * ログアウト処理（画面遷移なし）
     */
    logout ({ rootState }) {
      console.log('ログアウト')
      rootState.private.peerId = null
      rootState.public.room.id = ''
      rootState.public.room.members.splice(0, rootState.public.room.members.length)
      rootState.public.room.system = 'DiceBot'
      rootState.room.webRtcRoom = null
      if (rootState.connect.webRtcPeer) {
        rootState.connect.webRtcPeer.destroy()
        rootState.connect.webRtcPeer = null
      }
    },
    /** ========================================================================
     * データ送信
     */
    sendRoomData ({ rootState }, payload) {
      rootState.room.webRtcRoom.send(payload)
    }
  }
}
export default actionPeer
