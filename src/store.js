// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'bcdice-js/lib/preload-dicebots'
import Vue from 'vue'
import Vuex from 'vuex'
import Peer from 'skyway-js'
import JSZip from 'jszip'
import saveAs from 'file-saver'

Vue.use(Vuex)

/**
 * Store
 * @type {Vuex}
 */
const store = new Vuex.Store({
  state: {
    // privateデータは、データ保存時に public.room.members に含める
    private: {
      connect: { peerId: null, playerName: '' },
      setting: {
        standImage: true, // 立ち絵を表示するか
        dice: true, // ダイスを表示するか
        cutIn: true, // カットインを表示するか
        standImageAutoResize: true // 立ち絵のサイズを自動調節する
      },
      map: {
        angle: {
          total: 0
        },
        wheel: 0
      },
      display: {
        unSupportWindow: { isDisplay: false, doResetPosition: false, zIndex: 1, title: 'default' },
        chatWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
        initiativeWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
        resourceWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
        chatpaletteWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
        counterRemoConWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
        functionListWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
        addMapMaskWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
        editMapMaskWindow: { isDisplay: false, doResetPosition: false, zIndex: 1, key: -1 },
        devLogWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
        publicMemoWindow: { isDisplay: false, doResetPosition: false, zIndex: 1, key: -1 },
        secretDiceWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
        addCharacterSettingWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
        editCharacterWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
        roomInfoWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
        dropImageWindow: { isDisplay: false, doResetPosition: false, zIndex: 1, imageDataList: null },
        dropZipWindow: { isDisplay: false, doResetPosition: false, zIndex: 1, zipList: null },
        inviteLinkWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
        createRoomWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
        selectPeerWindow: { isDisplay: false, doResetPosition: false, zIndex: 1 },
        confirmLoadRoomWindow: { isDisplay: false, doResetPosition: false, zIndex: 1, importData: null },
        mapMaskContext: { isDisplay: false, doResetPosition: false, key: -1, x: 0, y: 0 },
        characterContext: { isDisplay: false, doResetPosition: false, key: -1, x: 0, y: 0 },
        gameTableContext: { isDisplay: false, doResetPosition: false, x: 0, y: 0 },
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
      }
    },
    // publicデータは、ルーム参加者に展開したりデータ保存に利用するデータ
    public: {
      setting: {
        gridLine: true, // マス目を表示するか
        gridId: true, // 座標を表示するか
        pieceRotateMarker: true, // 回転マーカーを表示するかどうか
        isFitGrid: true // マス目に合わせて動かすかどうか
      },
      images: {
        tags: [ { key: 0, name: '(全て)' }, { key: 1, name: 'マップ' }, { key: 2, name: 'キャラクター' }, { key: 3, name: 'フロアタイル' }, { key: 4, name: '立ち絵' } ],
        data: [
          { key: 0, tag: 'マップ', data: require('./assets/background-default.jpg'), password: '' },
          { key: 1, tag: 'キャラクター', data: require('./assets/charactor/pawnBlack.png'), password: '' },
          { key: 2, tag: 'キャラクター', data: require('./assets/charactor/pawnBlue.png'), password: '' },
          { key: 3, tag: 'キャラクター', data: require('./assets/charactor/pawnGreen.png'), password: '' },
          { key: 4, tag: 'キャラクター', data: require('./assets/charactor/pawnLightBlue.png'), password: '' },
          { key: 5, tag: 'キャラクター', data: require('./assets/charactor/pawnOrange.png'), password: '' },
          { key: 6, tag: 'キャラクター', data: require('./assets/charactor/pawnPink.png'), password: '' },
          { key: 7, tag: 'キャラクター', data: require('./assets/charactor/pawnPurple.png'), password: '' },
          { key: 8, tag: 'キャラクター', data: require('./assets/charactor/pawnRed.png'), password: '' },
          { key: 9, tag: 'キャラクター', data: require('./assets/charactor/pawnWhite.png'), password: '' },
          { key: 10, tag: 'キャラクター', data: require('./assets/charactor/pawnYellow.png'), password: '' },
          { key: 11, tag: 'フロアタイル', data: require('./assets/floorTiles/floorTile_001.jpg'), password: '' },
          { key: 12, tag: 'フロアタイル', data: require('./assets/floorTiles/floorTile_008.jpg'), password: '' },
          { key: 13, tag: 'フロアタイル', data: require('./assets/floorTiles/floorTile_011.jpg'), password: '' },
          { key: 14, tag: 'フロアタイル', data: require('./assets/floorTiles/floorTile_012.jpg'), password: '' },
          { key: 15, tag: 'フロアタイル', data: require('./assets/floorTiles/floorTile_027.jpg'), password: '' },
          { key: 16, tag: 'フロアタイル', data: require('./assets/floorTiles/floorTile_038.jpg'), password: '' },
          { key: 17, tag: 'フロアタイル', data: require('./assets/floorTiles/floorTile_047.jpg'), password: '' },
          { key: 18, tag: 'フロアタイル', data: require('./assets/floorTiles/floorTile_059.jpg'), password: '' },
          { key: 19, tag: '立ち絵', data: require('./assets/stand/glass_angry.png'), password: '' },
          { key: 20, tag: '立ち絵', data: require('./assets/stand/glass_normal.png'), password: '' },
          { key: 21, tag: '立ち絵', data: require('./assets/stand/glass_smile.png'), password: '' },
          { key: 22, tag: '立ち絵', data: require('./assets/stand/sports_angry.png'), password: '' },
          { key: 23, tag: '立ち絵', data: require('./assets/stand/sports_normal.png'), password: '' },
          { key: 24, tag: '立ち絵', data: require('./assets/stand/sports_smile.png'), password: '' }
        ]
      },
      room: { id: '', members: [], system: 'DiceBot' },
      map: {
        imageKey: 0,
        marginGridNum: 60,
        borderWidth: 60,
        grid: { totalColumn: 20, totalRow: 15, size: 48, color: 'rgba(0, 0, 0, 1)' }
      },
      mapMasks: [],
      characters: [],
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
    volatilSaveData: {
      members: []
    }
  },
  mutations: {
    exportStart (state) {
      // 配列の中身を空にする
      state.volatilSaveData.members.splice(0, state.volatilSaveData.members.length)
      state.volatilSaveData.members.push(state.private)
      if (state.public.room.members.length <= 1) {
        store._mutations.doExport[0]()
      } else {
        state.room.webRtcRoom.send({ type: 'REQUEST_PRIVATE_DATA', value: null })
      }
    },
    doExport (state) {
      const saveData = JSON.parse(JSON.stringify({
        private: state.private,
        public: state.public,
        dataVersion: '1.0.0'
      }))
      for (const key in saveData.private.display) {
        if (!saveData.private.display[key].isDisplay) {
          delete saveData.private.display[key]
        }
      }
      state.volatilSaveData.members.forEach(memberData => {
        const peerId = memberData.connect.peerId
        const saveMemObj = saveData.public.room.members.filter(saveMemObj => saveMemObj.peerId === peerId)[0]
        if (saveMemObj) {
          saveMemObj.private = memberData
        }
      })
      const zip = new JSZip()
      zip.file('save.json', JSON.stringify(saveData, undefined, 2))
      zip.generateAsync({ type: 'blob' })
        .then(blob => {
          const d = new Date()
          const yr = d.getFullYear()
          const mt = d.getMonth() + 1
          const dt = d.getDate()
          const hr = d.getHours()
          const mn = d.getMinutes()
          const sc = d.getSeconds()
          const fileName = `Quoridorn_${yr}${mt}${dt}_${hr}${mn}${sc}.zip`
          saveAs(blob, fileName)
        })
    },
    importStart (state, zipFiles) {
      const zip = new JSZip()
      const zipList = []
      const promiseList = []
      for (const file of zipFiles) {
        promiseList.push(new Promise((resolve, reject) => {
          zip.loadAsync(file)
            .then(zip => {
              // you now have every files contained in the loaded zip
              zip.file('save.json').async('string')
                .then(jsonStr => {
                  const saveData = JSON.parse(jsonStr)
                  zipList.push({
                    fileName: file.name,
                    saveData: saveData
                  })
                  resolve()
                })
            })
        }))
      }
      Promise.all(promiseList).then(() => {
        state.private.display.dropZipWindow.zipList = zipList
        store._mutations.windowOpen[0]('private.display.dropZipWindow')
      })
    },
    updateCame (state, peerId) {
      state.public.room.members.forEach(memberObj => {
        if (memberObj.peerId === peerId) {
          memberObj.isCame = true
        } else {
          memberObj.isCame = false
        }
      })
    },
    doImport (state, importData) {
      const publicData = importData.public
      const privateData = importData.private
      const importFunc = () => {
        if (publicData.setting) {
          state.public.setting = publicData.setting
        }
        if (publicData.chat) {
          state.public.chat = publicData.chat
        }
        if (publicData.images) {
          state.public.images = publicData.images
        }
        if (publicData.map) {
          state.public.map = publicData.map
        }
        if (publicData.mapMasks) {
          state.public.mapMasks = publicData.mapMasks
        }
        if (publicData.characters) {
          state.public.characters = publicData.characters
        }
        if (publicData.publicMemo) {
          state.public.publicMemo = publicData.publicMemo
        }
        if (publicData.room.members.length > 0) {
          store._mutations.windowOpen[0]('private.display.selectPeerWindow')
        }
      }
      console.log(publicData.room)
      if (publicData.room && publicData.room.id !== '') {
        const roomId = publicData.room.id
        const peerId = privateData.connect.peerId
        store._mutations.checkRoomName[0]({
          roomName: roomId,
          roomFindFunc: () => {
            // 部屋が見つかったら接続しにいく。他のセーブデータは使わない。
            state.private.display.confirmLoadRoomWindow.importData = importData
            store._mutations.windowOpen[0]('private.display.confirmLoadRoomWindow')
          },
          roomNonFindFunc: () => {
            publicData.room.members.forEach(memberObj => {
              memberObj.isCame = false
            })
            state.public.room = publicData.room
            store._mutations.updateCame[0]('')
            console.log(`peerId:${peerId}, roomId:${roomId}`, importData)
            if (peerId) {
              store._mutations.createPeer[0]({
                peerId: peerId,
                roomId: roomId
              })
            }
            importFunc()
          }
        })
      } else {
        store._mutations.logout[0]()
        importFunc()
      }
    },
    /**
     * 設定を変更する
     * @param {object} state    state of Vuex
     * @param {string} property 設定のプロパティ名
     */
    changeDisplay (state, property) {
      const props = property.split('.')
      let target = state
      props.forEach((prop, index) => {
        if (index < props.length - 1) {
          target = target[prop]
        }
      })
      const lastProp = props[props.length - 1]
      if (typeof target[lastProp] === 'boolean') {
        target[lastProp] = !target[lastProp]
      } else {
        target[lastProp].isDisplay = !target[lastProp].isDisplay
      }
      store._mutations.sendDoMethod[0]({ type: 'DO_METHOD', value: property, method: 'changeDisplay' })
    },
    windowOpen (state, property) {
      const props = property.split('.')
      const lastProp = props[props.length - 1]
      if (state.private.display[lastProp].isDisplay) {
        state.private.display[lastProp].doResetPosition = true
      } else {
        state.private.display[lastProp].isDisplay = true
      }
      let maxIndex = 0
      for (const key in state.private.display) {
        if (key === lastProp) { continue }
        const value = state.private.display[key]
        if (!value.isDisplay) { continue }
        if (maxIndex < value.zIndex) { maxIndex = value.zIndex }
      }
      state.private.display[lastProp].zIndex = maxIndex + 1
    },
    windowClose (state, property) {
      const props = property.split('.')
      const lastProp = props[props.length - 1]
      state.private.display[lastProp].isDisplay = false
      if (state.private.display[lastProp].key !== undefined) {
        state.private.display[lastProp].key = -1
      }
      for (const key in state.private.display) {
        const value = state.private.display[key]
        if (!value.isDisplay) { continue }
        if (value.zIndex > state.private.display[lastProp].zIndex) { value.zIndex-- }
      }
    },
    deleteMember (state) {
      state.public.room.members.splice(0, state.public.room.members.length)
    },
    setProperty (state, payload) {
      let propStr = payload.property
      let value = payload.value
      let isLogOff = payload.logOff
      const props = propStr.split('.')
      let target = state
      if (!isLogOff) {
        console.log(`# ${propStr}:`, value)
      }

      const propProc = (target, props, value, isLogOff) => {
        const prop = props.shift()
        if (props.length > 0) {
          propProc(target[prop], props, value, isLogOff)
        } else {
          // 値の適用
          if (!(value instanceof Object) || (value instanceof Array)) {
            target[prop] = value
          } else {
            const propProc2 = (target, props, isLogOff) => {
              for (const prop in props) {
                const val = props[prop]
                if (!(val instanceof Object) || (val instanceof Array)) {
                  target[prop] = val
                } else {
                  propProc2(target[prop], val, isLogOff)
                }
              }
            }
            propProc2(target[prop], value, isLogOff)
          }
        }
        // プロパティ名が数字だった場合は配列の更新として扱い、リアクティブになるよう、splice関数で更新する
        if (/^[0-9]+$/.test(prop)) {
          const index = parseInt(prop)
          target.splice(index, 1, target[index])
        }
      }

      propProc(target, props, value, isLogOff)
      store._mutations.sendDoMethod[0]({ type: 'DO_METHOD', value: payload, method: 'setProperty' })
    },
    joinRoom (state, roomName) {
      if (!roomName) { return }
      const room = state.connect.webRtcPeer.joinRoom(roomName)
      room.on('open', function () {
        state.room.webRtcRoom = room
        store._mutations.connectFunc[0](room)
      })
    },
    closeRoom (state) {
      state.room.webRtcRoom.close()
    },
    checkRoomName (state, payload) {
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
              const filtered = sendData.value.room.members.filter(memberObj => memberObj.peerId === state.private.connect.peerId)
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
    createPeer (state, payload) {
      // Connect to SkyWay, have server assign an ID instead of providing one
      // Showing off some of the configs available with SkyWay :).
      const options = {
        // Set API key for cloud server (you don't need this if you're running your
        // own.
        key: window.__SKYWAY_KEY__,
        // Set highest debug level (log everything!).
        debug: 1
        // Set a logging function:
        // logFunction: args => {
        //   const copy = [...args].join(' ')
        //   console.log(copy)
        // }
      }
      console.log(`PeerId: ${payload.peerId}, RoomId: ${payload.roomId}`)
      /* eslint no-undef: 0 */
      // const peer = payload.peerId ? new Peer(payload.peerId, options) : new Peer(options)
      const peer = new Peer(payload.peerId, options)
      // Await connections from others
      peer.on('connection', store._mutations.connectFunc[0])

      // Show this peer's ID.
      peer.on('open', id => {
        // console.log(`Peer opened!!!! ${id}`)
        if (state.private.connect.peerId !== id) {
          state.private.connect.peerId = id
          state.public.room.password = state.private.connect.password
          state.public.room.members.push({
            peerId: id,
            name: state.private.connect.playerName,
            color: 'black',
            isCame: true
          })
        }
        const roomId = payload.roomId ? payload.roomId : 'ああああ'
        console.log(`Room: ${roomId} に接続を試みます...`)
        store._mutations.joinRoom[0](roomId)
      })
      peer.on('error', err => {
        console.error(err)
        if (err.message.indexOf('is already in use') > 0) {
          alert(`接続に失敗しました。\npeerId:${payload.peerId}は既に使われています。\n異なるpeerIdを指定してください。`)
        } else {
          // alert(`接続に失敗しました。\n原因は不明です。\nF12を押して、表示されるコンソールに書かれている赤い文字をコピーして、開発者にご展開ください。`)
        }
      })
      if (!!state.connect.webRtcPeer && !state.connect.webRtcPeer.destroyed) {
        state.connect.webRtcPeer.destroy()
      }
      state.connect.webRtcPeer = peer

      // Make sure things clean up properly.
      window.onunload = window.onbeforeunload = function (e) {
        if (!!peer && !peer.destroyed) {
          peer.destroy()
        }
      }
    },
    onMount (state) {
      store._mutations.windowOpen[0]('private.display.chatWindow')
      // store._mutations.windowOpen[0]('private.display.initiativeWindow')
      // store._mutations.windowOpen[0]('private.display.resourceWindow')
      // store._mutations.windowOpen[0]('private.display.chatpaletteWindow')
      // store._mutations.windowOpen[0]('private.display.counterRemoConWindow')
      store._mutations.windowOpen[0]('private.display.functionListWindow')
      const getParam = (name, url) => {
        if (!url) url = window.location.href
        name = name.replace(/[[\]]/g, '\\$&')
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
        var results = regex.exec(url)
        if (!results) return null
        if (!results[2]) return ''
        return decodeURIComponent(results[2].replace(/\+/g, ' '))
      }
      const roomId = getParam('roomId')
      const peerId = getParam('peerId')
      const password = getParam('password')
      state.private.connect.password = password
      if (roomId) {
        store._mutations.createPeer[0]({
          roomId: roomId,
          peerId: peerId
        })
      }
    },
    /**
     * チャットログを追加する（発言の記録）
     * @param {object} state   state of Vuex
     * @param {object} payload state of Vuex
     */
    addChatLog (state, payload) {
      const peerId = payload.peerId ? payload.peerId : state.private.connect.peerId
      const activeChatTab = store.getters.activeChatTab
      let name = payload.name
      let text = payload.text
      let color = payload.color
      let tab = payload.tab ? payload.tab : activeChatTab.name
      let isOperation = payload.isOperation
      let htmlText = '<span style="color: ' + color + '"><b>' + name + '</b>：' + text.replace(/\r?\n/g, '<br>') + '</span>'
      let logObj = {
        peerId: peerId,
        viewHtml: htmlText
      }
      if (tab !== activeChatTab.name) {
        const tabObj = state.public.chat.tabs.filter(tabObj => tabObj.name === tab)[0]
        tabObj.unRead++
        const index = state.public.chat.tabs.indexOf(tabObj)
        state.public.chat.tabs.splice(index, 1, tabObj)
      }
      state.public.chat.logs[tab].push(logObj)
      if (isOperation && !!state.room.webRtcRoom) {
        state.room.webRtcRoom.send({
          type: 'SEND_CHAT',
          value: {
            text: text,
            tab: tab
          }
        })
      }
    },
    // Handle a connection object.
    connectFunc: (state, room) => {
      // Handle a chat connection.
      const roomName = room.name.replace('sfu_text_', '')

      console.log(`Room: ${roomName} に接続しました。`)

      const logName = 'SYSTEM'
      const logColor = 'red'
      const logTab = 'メイン'

      // console.log(`Room: ${roomName} に接続しました！！`)
      state.public.room.id = roomName
      store._mutations.addChatLog[0]({
        name: logName,
        text: `Room: ${roomName} に接続しました！！`,
        color: logColor,
        tab: logTab
      })

      // 誰かが入室してきた場合
      room.on('peerJoin', peerId => {
        const filtered = state.public.room.members.filter(memberObj => memberObj.peerId === peerId)
        if (filtered.length > 0) {
        } else {
          state.public.room.members.push({
            peerId: peerId,
            name: '',
            color: 'black',
            isCame: false
          })
        }
        // 自分が親だったら、入ってきた人に部屋情報を教えてあげる
        console.log(`EVENT[peerJoin] ${state.private.connect.peerId} -> ${peerId}`)
        if (state.public.room.members[0].peerId === state.private.connect.peerId) {
          state.room.webRtcRoom.send({ type: 'NOTICE_OTHER_PLAYER', value: state.public, targets: [peerId] })
        }
      })

      // 誰かが退室した場合
      room.on('peerLeave', peerId => {
        // console.log(peerId, state.public.room.members)
        const memberObj = state.public.room.members.filter(member => member.peerId === peerId)[0]
        if (!memberObj) { return }
        const index = state.public.room.members.indexOf(memberObj)
        if (memberObj.isCame) {
          store._mutations.addChatLog[0]({
            peerId: peerId,
            name: logName,
            text: `${memberObj.name}(${peerId}) が退室しました。`,
            color: logColor,
            tab: logTab
          })
        }
        state.public.room.members.splice(index, 1)
      })

      // 誰かがデータを送信した場合
      room.on('data', message => {
        const peerId = message.src
        const sendData = message.data
        const memberObj = state.public.room.members.filter(member => member.peerId === peerId)[0]
        const index = state.public.room.members.indexOf(memberObj)
        const targets = sendData.targets
        if (!targets || targets.length === 0 || targets.filter(target => target === state.private.connect.peerId).length > 0) {
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
              if (roomPassword !== state.private.connect.password) {
                alert('入力されたパスワードが部屋のパスワードと一致しません。')
                store._mutations.logout[0]()
                break
              }
              let me = null
              value.room.members.forEach(memberObj => {
                if (memberObj.peerId === state.private.connect.peerId) {
                  memberObj.isCame = true
                  state.private.connect.playerName = memberObj.name
                  me = memberObj
                }
              })
              if (!me) {
                me = state.public.room.members[0]
                // 自分を一番後ろにする
                value.room.members.push(me)
              }
              state.public = value
              // ルームメンバーに自己紹介する
              state.room.webRtcRoom.send({ type: 'NOTICE_MY_INFO', value: { name: me.name, color: me.color } })
              break
            // ルームメンバーの名前が変わったとき
            case 'CHANGE_PLAYER_NAME':
              memberObj.name = value
              state.public.room.members.splice(index, 1, memberObj)
              break
            // ルームメンバーの自己紹介を受け取ったとき
            case 'NOTICE_MY_INFO':
              memberObj.name = value.name
              memberObj.color = value.color
              memberObj.isCame = true
              store._mutations.addChatLog[0]({
                peerId: peerId,
                name: logName,
                text: `PeerId: ${peerId} が入室しました。`,
                color: logColor,
                tab: logTab
              })
              state.public.room.members.splice(index, 1, memberObj)
              break
            // チャット発言を受け取ったとき
            case 'SEND_CHAT':
              store._mutations.addChatLog[0]({
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
              store._mutations[method][0](value)
              break
            // privateデータの要求を受けたとき
            case 'REQUEST_PRIVATE_DATA':
              state.room.webRtcRoom.send({ type: 'SEND_PRIVATE_DATA', value: state.private, targets: [peerId] })
              break
            // privateデータの要求を受けたとき
            case 'SEND_PRIVATE_DATA':
              state.volatilSaveData.members.push(value)
              if (state.volatilSaveData.members.length === state.public.room.members.length) {
                store._mutations.doExport[0]()
              }
              break
            default:
          }
        }
      })
    },
    logout (state) {
      console.log('ログアウト')
      state.private.peerId = null
      state.public.room.id = ''
      state.public.room.members.splice(0, state.public.room.members.length)
      state.public.room.system = 'DiceBot'
      state.room.webRtcRoom = null
      if (state.connect.webRtcPeer) {
        state.connect.webRtcPeer.destroy()
        state.connect.webRtcPeer = null
      }
    },
    sendDoMethod (state, payload) {
      if (payload.value.isNotice && state.room.webRtcRoom) {
        delete payload.value.isNotice
        state.room.webRtcRoom.send(payload)
      }
    },
    sendRoomData (state, payload) {
      state.room.webRtcRoom.send(payload)
    },
    windowActive (state, property) {
      let current = 0
      let maxIndex = 0
      for (const key in state.private.display) {
        const value = state.private.display[key]
        if (!value.isDisplay) { continue }
        if (key === property) {
          current = value.zIndex
        }
        if (maxIndex < value.zIndex) {
          maxIndex = value.zIndex
        }
      }
      for (const key in state.private.display) {
        const value = state.private.display[key]
        if (!value.isDisplay) { continue }
        if (key === property) {
          value.zIndex = maxIndex
        } else {
          if (current <= value.zIndex) {
            value.zIndex--
          }
        }
      }
      for (const key in state.private.display) {
        const value = state.private.display[key]
        if (!value.isDisplay) { continue }
        // console.log(`${key}:${value.zIndex}`)
      }
      // console.log(`windowActive:${property} max:${maxIndex}`)
    },
    addImage (state, payload) {
      // キーを決める(欠番を埋めるスタイル)
      let key = -1
      let isFind
      do {
        key++
        isFind = false
        for (let imageObj of state.public.images.data) {
          if (imageObj.key === key) {
            isFind = true
            break
          }
        }
      } while (isFind)

      state.public.images.data.push({
        tag: payload.tag,
        data: payload.image,
        key: key
      })
      store._mutations.sendDoMethod[0]({ type: 'DO_METHOD', value: payload, method: 'addImage' })
    },
    doResetWindowLocate (state) {
      alert('未実装の機能です。')
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
        for (let pieceObj of state.public[payload.propName]) {
          if (pieceObj.key === `${payload.kind}-${key}`) {
            isFind = true
            break
          }
        }
      } while (isFind)
      obj.key = `${payload.kind}-${key}`

      console.log(`[mutations] add ${payload.propName} => {key:${obj.key}, name:"${obj.name}", locate(${obj.top}, ${obj.left}), CsRs(${obj.columns}, ${obj.rows}), bg:"${obj.color}", font:"${obj.fontColor}"}`)

      state.public[payload.propName].push(obj)
      store._mutations.sendDoMethod[0]({ type: 'DO_METHOD', value: payload, method: 'addPieceInfo' })
    },
    imageTagChange (state, payload) {
      const key = payload.key
      const imageList = payload.imageList
      const imageObj = imageList.filter(imageObj => imageObj.key === key)[0]
      const useTexts = []
      /* eslint no-control-regex: 0 */
      const regExp = new RegExp('[　\t \r\n,]+', 'g')
      // console.log(imageList)
      imageList.forEach(imageObj => {
        const tags = imageObj.currentTag.replace(regExp, ',').split(',')
        // console.log(tags.join(', '))
        Array.prototype.push.apply(useTexts, tags)
      })

      const tags = state.public.images.tags
      const images = state.public.images.data
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
      const index = state.public['mapMasks'].indexOf(mapMaskObj)
      state.public['mapMasks'].splice(index, 1, mapMaskObj)
      store._mutations.sendDoMethod[0]({ type: 'DO_METHOD', value: payload, method: 'changeMapMaskInfo' })
    },
    /**
     * マップマスク情報の削除
     * @param {object} state state of Vuex
     * @param {object} payload state of Vuex
     */
    deletePieceInfo (state, payload) {
      // console.log(`delete pieceInfo -> ${payload.propName}(${payload.key})`)
      const obj = this.getters.getPieceObj(payload.propName, payload.key)
      const index = state.public[payload.propName].indexOf(obj)
      state.public[payload.propName].splice(index, 1)
      store._mutations.sendDoMethod[0]({ type: 'DO_METHOD', value: payload, method: 'deletePieceInfo' })
    },
    /**
     * チャットのタブの構成を変更する
     * @param {object} state    state of Vuex
     * @param {string} tabsText タブ構成を意味する、スペース区切りの文字列
     */
    changeChatTab (state, tabsText) {
      // 配列を空にする
      state.public.chat.tabs.splice(0, state.public.chat.tabs.length)

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
          isActive: isActive,
          isHover: false,
          unRead: 0
        }
        state.public.chat.tabs.push(tabObj)
      }
      if (!lastActiveTab) {
        state.public.chat.tabs[0].isActive = true
      }

      // 削除されたタブの検知
      let deleteLogTabList = []
      for (let tab in state.public.chat.logs) {
        let findFlg = false
        for (let tabsTab of state.public.chat.tabs) {
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
        delete state.public.chat.logs[delTabName]
      }

      // 追加されたタブの検知
      for (let tabsTab of state.public.chat.tabs) {
        if (!state.public.chat.logs[tabsTab.name]) {
          state.public.chat.logs[tabsTab.name] = []
        }
      }
    },
    /**
     * チャットタブの選択を記録する
     * @param {object} state state of Vuex
     * @param {string} tab   state of Vuex
     */
    chatTabSelect (state, tab) {
      for (let tabObj of state.public.chat.tabs) {
        tabObj.isActive = tab === tabObj.name
        if (tabObj.isActive) {
          tabObj.unRead = 0
        }
      }
    }
  },
  getters: {
    activeChatTab: function (state) {
      let filtered = state.public.chat.tabs.filter(function (tabObj) { return tabObj.isActive })
      return filtered.length > 0 ? filtered[0] : null
    },
    chatLogs: function (state) {
      let result = state.public.chat.logs[store.getters.activeChatTab.name]
      return result
    },
    isFitGrid: function (state) {
      return state.public.setting.isFitGrid
    },
    getState: (state) => (property) => {
      const props = property.split('.')
      let target = state
      props.forEach((prop, index) => {
        target = target[prop]
      })
      return target
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
      const filteredList = state.public[type].filter(obj => obj.key === key)
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
    doResetPosition: (state) => (displayProperty) => {
      const props = displayProperty.split('.')
      let target = state
      props.forEach((prop, index) => {
        target = target[prop]
      })
      return target.doResetPosition
    },
    isWindowOpen: (state) => (displayProperty) => {
      const props = displayProperty.split('.')
      let target = state
      props.forEach((prop, index) => {
        if (index < props.length - 1) {
          target = target[prop]
        }
      })
      const lastProp = props[props.length - 1]
      if (typeof target[lastProp] === 'boolean') {
        return target[lastProp]
      } else {
        return target[lastProp].isDisplay
      }
    },
    pieceList: (state) => (type) => {
      const result = []
      for (let pieceObj of state.public[type]) {
        result.push({
          key: pieceObj.key
        })
      }
      return result
    },
    getBackgroundImage: function (state) {
      return state.public.images.data.filter(d => d.key === state.public.map.imageKey)[0].data
    }
  }
})
export default store
