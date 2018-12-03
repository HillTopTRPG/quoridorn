// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'bcdice-js/lib/preload-dicebots'
import Vue from 'vue'
import App from './App'
import { mapActions } from 'vuex'
import store from './store/store.js'

import Menu from './components/menu/Menu'
import AddMapMaskWindow from './components/map/mapMask/AddMapMaskWindow'
import EditMapMaskWindow from './components/map/mapMask/EditMapMaskWindow'
import MapMaskContext from './components/map/mapMask/MapMaskContext'
import UnSupportWindow from './components/UnSupportWindow'
import GameTableContext from './components/map/GameTableContext'
import DevLogWindow from './components/simple/DevLogWindow'
import FunctionListWindow from './components/simple/FunctionListWindow'
import PublicMemoWindow from './components/public-memo/PublicMemoWindow'
import AddCharacterSettingWindow from './components/map/character/AddCharacterSettingWindow'
import AddCharacterWindow from './components/map/character/AddCharacterWindow'
import CharacterContext from './components/map/character/CharacterContext'
import DropImageWindow from './components/simple/DropImageWindow'
import RoomInfoWindow from './components/simple/RoomInfoWindow'
import DropZipWindow from './components/simple/DropZipWindow'
import SelectPeerWindow from './components/simple/SelectPeerWindow'
import InviteLinkWindow from './components/simple/InviteLinkWindow'
import CreateRoomWindow from './components/simple/CreateRoomWindow'
import ConfirmLoadRoomWindow from './components/simple/ConfirmLoadRoomWindow'
import AddChitWindow from './components/map/chit/AddChitWindow'
import EditChitWindow from './components/map/chit/EditChitWindow'
import ChitContext from './components/map/chit/ChitContext'
import EditMapWindow from './components/map/EditMapWindow'
import EditCharacterWindow from './components/map/character/EditCharacterWindow'
import SettingBGMWindow from './components/music/SettingBGMWindow'
import JukeboxWindow from './components/music/JukeboxWindow'
import EditBGMWindow from './components/music/EditBGMWindow'
import AddBGMWindow from './components/music/AddBGMWindow'
import SettingChatTabWindow from './components/chat/SettingChatTabWindow'
import SettingChatFontWindow from './components/chat/SettingChatFontWindow'
import CardContext from './components/map/card/CardContext'
import WelcomeWindow from './components/welcome/WelcomeWindow'
import VersionWindow from './components/simple/VersionWindow'

// const ChatWindow = asyncComponent(() => import(/* webpackChunkName: 'chatWindow' */ './components/chat/ChatWindow'))
import ChatWindow from './components/chat/ChatWindow'

Vue.config.productionTip = false

Vue.directive('img', (el, binding) => {
  const imgData = binding.value
  if (imgData === '') {
    el.src = ''
    return
  }
  const img = new Image()
  img.src = imgData

  img.onload = () => {
    el.src = imgData
    el.style.opacity = '1'
    el.classList.add('loaded')
    if (el.className.indexOf('anime') >= 0) {
      el.style.transition = 'all 0.5s ease'
    }
  }
})

Vue.directive('bg-img', (el, binding) => {
  const imgData = binding.value
  const img = new Image()
  img.src = imgData

  img.onload = () => {
    el.style['background-image'] = `url(${imgData})`
    el.style.opacity = '1'
    el.classList.add('loaded')
    if (el.className.indexOf('anime') >= 0) {
      el.style.transition = 'all 0.5s ease'
    }
  }
})

const app = new Vue({
  store,
  components: {
    App: App,
    JukeboxWindow: JukeboxWindow
  },
  methods: {
    ...mapActions([])
  },
  // render: h => h(App),
  template: `<div style="width: 100%; height: 100%;"><App/><JukeboxWindow ref="jukeboxWindow"/></div>`
})
app.$mount('#app')

const chatWindow = new Vue({ store, components: { ChatWindow }, template: `<ChatWindow/>` })
chatWindow.$mount('#chatWindow')

const menu = new Vue({ store, components: { Menu }, template: `<Menu/>` })
menu.$mount('#menu')

const addMapMaskWindow = new Vue({ store, components: { AddMapMaskWindow }, template: `<AddMapMaskWindow/>` })
addMapMaskWindow.$mount('#addMapMaskWindow')

const editMapMaskWindow = new Vue({ store, components: { EditMapMaskWindow }, template: `<EditMapMaskWindow/>` })
editMapMaskWindow.$mount('#editMapMaskWindow')

const mapMaskContext = new Vue({ store, components: { MapMaskContext }, template: `<MapMaskContext/>` })
mapMaskContext.$mount('#mapMaskContext')

const unSupportWindow = new Vue({ store, components: { UnSupportWindow }, template: `<UnSupportWindow/>` })
unSupportWindow.$mount('#unSupportWindow')

const gameTableContext = new Vue({ store, components: { GameTableContext }, template: `<GameTableContext/>` })
gameTableContext.$mount('#gameTableContext')

const devLogWindow = new Vue({ store, components: { DevLogWindow }, template: `<DevLogWindow/>` })
devLogWindow.$mount('#devLogWindow')

const functionListWindow = new Vue({ store, components: { FunctionListWindow }, template: `<FunctionListWindow/>` })
functionListWindow.$mount('#functionListWindow')

const publicMemoWindow = new Vue({ store, components: { PublicMemoWindow }, template: `<PublicMemoWindow/>` })
publicMemoWindow.$mount('#publicMemoWindow')

const addCharacterSettingWindow = new Vue({ store, components: { AddCharacterSettingWindow }, template: `<AddCharacterSettingWindow/>` })
addCharacterSettingWindow.$mount('#addCharacterSettingWindow')

const addCharacterWindow = new Vue({ store, components: { AddCharacterWindow }, template: `<AddCharacterWindow/>` })
addCharacterWindow.$mount('#addCharacterWindow')

const characterContext = new Vue({ store, components: { CharacterContext }, template: `<CharacterContext/>` })
characterContext.$mount('#characterContext')

const dropImageWindow = new Vue({ store, components: { DropImageWindow }, template: `<DropImageWindow/>` })
dropImageWindow.$mount('#dropImageWindow')

const roomInfoWindow = new Vue({ store, components: { RoomInfoWindow }, template: `<RoomInfoWindow/>` })
roomInfoWindow.$mount('#roomInfoWindow')

const dropZipWindow = new Vue({ store, components: { DropZipWindow }, template: `<DropZipWindow/>` })
dropZipWindow.$mount('#dropZipWindow')

const selectPeerWindow = new Vue({ store, components: { SelectPeerWindow }, template: `<SelectPeerWindow/>` })
selectPeerWindow.$mount('#selectPeerWindow')

const inviteLinkWindow = new Vue({ store, components: { InviteLinkWindow }, template: `<InviteLinkWindow/>` })
inviteLinkWindow.$mount('#inviteLinkWindow')

const createRoomWindow = new Vue({ store, components: { CreateRoomWindow }, template: `<CreateRoomWindow/>` })
createRoomWindow.$mount('#createRoomWindow')

const confirmLoadRoomWindow = new Vue({ store, components: { ConfirmLoadRoomWindow }, template: `<ConfirmLoadRoomWindow/>` })
confirmLoadRoomWindow.$mount('#confirmLoadRoomWindow')

const addChitWindow = new Vue({ store, components: { AddChitWindow }, template: `<AddChitWindow/>` })
addChitWindow.$mount('#addChitWindow')

const editChitWindow = new Vue({ store, components: { EditChitWindow }, template: `<EditChitWindow/>` })
editChitWindow.$mount('#editChitWindow')

const chitContext = new Vue({ store, components: { ChitContext }, template: `<ChitContext/>` })
chitContext.$mount('#chitContext')

const editMapWindow = new Vue({ store, components: { EditMapWindow }, template: `<EditMapWindow/>` })
editMapWindow.$mount('#editMapWindow')

const editCharacterWindow = new Vue({ store, components: { EditCharacterWindow }, template: `<EditCharacterWindow/>` })
editCharacterWindow.$mount('#editCharacterWindow')

const settingBGMWindow = new Vue({ store, components: { SettingBGMWindow }, template: `<SettingBGMWindow/>` })
settingBGMWindow.$mount('#settingBGMWindow')

const editBGMWindow = new Vue({ store, components: { EditBGMWindow }, template: `<EditBGMWindow/>` })
editBGMWindow.$mount('#editBGMWindow')

const addBGMWindow = new Vue({ store, components: { AddBGMWindow }, template: `<AddBGMWindow/>` })
addBGMWindow.$mount('#addBGMWindow')

const settingChatTabWindow = new Vue({ store, components: { SettingChatTabWindow }, template: `<SettingChatTabWindow/>` })
settingChatTabWindow.$mount('#settingChatTabWindow')

const settingChatFontWindow = new Vue({ store, components: { SettingChatFontWindow }, template: `<SettingChatFontWindow/>` })
settingChatFontWindow.$mount('#settingChatFontWindow')

const cardContext = new Vue({ store, components: { CardContext }, template: `<CardContext/>` })
cardContext.$mount('#cardContext')

const welcomeWindow = new Vue({ store, components: { WelcomeWindow }, template: `<WelcomeWindow/>` })
welcomeWindow.$mount('#welcomeWindow')

const versionWindow = new Vue({ store, components: { VersionWindow }, template: `<VersionWindow/>` })
versionWindow.$mount('#versionWindow')
