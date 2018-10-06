// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'bcdice-js/lib/preload-dicebots'
import Vue from 'vue'
import App from './App'
import store from './store.js'

import Menu from './components/menu/Menu'
import AddMapMaskWindow from './components/map/mapMask/AddMapMaskWindow'
import EditMapMaskWindow from './components/map/mapMask/EditMapMaskWindow'
import MapMaskContext from './components/map/mapMask/MapMaskContext'
import UnSupportWindo from './components/UnSupportWindow'
import GameTableContext from './components/map/GameTableContext'
import DevLogWindow from './components/simple/DevLogWindow'
import FunctionListWindow from './components/simple/FunctionListWindow'
import PublicMemoWindow from './components/public-memo/PublicMemoWindow'
import AddCharacterSettingWindow from './components/map/character/AddCharacterSettingWindow'
import AddCharacterWindow from './components/map/character/AddCharacterWindow'
import CharacterContext from './components/map/character/CharacterContext'
import DropChooseWindow from './components/simple/DropChooseWindow'

// const ChatWindow = asyncComponent(() => import(/* webpackChunkName: 'chatWindow' */ './components/chat/ChatWindow'))
import ChatWindow from './components/chat/ChatWindow'

Vue.config.productionTip = false

Vue.directive('img', function (el, binding, compornent) {
  const imgData = binding.value
  if (imgData === '') {
    el.src = ''
    return
  }
  var img = new Image()
  img.src = imgData

  img.onload = function () {
    el.src = imgData
    el.style.opacity = 1
    el.classList.add('loaded')
    if (el.className.indexOf('anime') >= 0) {
      el.style.transition = 'all 0.5s ease'
    }
  }
})

Vue.directive('bg-img', function (el, binding, compornent) {
  const imgData = binding.value
  var img = new Image()
  img.src = imgData

  img.onload = function () {
    el.style['background-image'] = `url(${imgData})`
    el.style.opacity = 1
    el.classList.add('loaded')
    if (el.className.indexOf('anime') >= 0) {
      el.style.transition = 'all 0.5s ease'
    }
  }
})

const app = new Vue({
  store,
  components: { App: App },
  data: { scrollY: 0 },
  mounted: function () { window.addEventListener('scroll', this.handleScroll) },
  methods: {
    handleScroll () {
      this.scrollY = window.scrollY
      console.log('scroll', this.scrollY)
    }
  },
  template: `<App/>`
})
app.$mount('#app')

const chatWindow = new Vue({ store, components: { ChatWindow: ChatWindow }, template: `<ChatWindow/>` })
chatWindow.$mount('#chatWindow')

const menu = new Vue({ store, components: { Menu: Menu }, template: `<Menu/>` })
menu.$mount('#menu')

const addMapMaskWindow = new Vue({ store, components: { AddMapMaskWindow: AddMapMaskWindow }, template: `<AddMapMaskWindow/>` })
addMapMaskWindow.$mount('#addMapMaskWindow')

const editMapMaskWindow = new Vue({ store, components: { EditMapMaskWindow: EditMapMaskWindow }, template: `<EditMapMaskWindow/>` })
editMapMaskWindow.$mount('#editMapMaskWindow')

const mapMaskContext = new Vue({ store, components: { MapMaskContext: MapMaskContext }, template: `<MapMaskContext/>` })
mapMaskContext.$mount('#mapMaskContext')

const unSupportWindo = new Vue({ store, components: { UnSupportWindo: UnSupportWindo }, template: `<UnSupportWindo/>` })
unSupportWindo.$mount('#unSupportWindo')

const gameTableContext = new Vue({ store, components: { GameTableContext: GameTableContext }, template: `<GameTableContext/>` })
gameTableContext.$mount('#gameTableContext')

const devLogWindow = new Vue({ store, components: { DevLogWindow: DevLogWindow }, template: `<DevLogWindow/>` })
devLogWindow.$mount('#devLogWindow')

const functionListWindow = new Vue({ store, components: { FunctionListWindow: FunctionListWindow }, template: `<FunctionListWindow/>` })
functionListWindow.$mount('#functionListWindow')

const publicMemoWindow = new Vue({ store, components: { PublicMemoWindow: PublicMemoWindow }, template: `<PublicMemoWindow/>` })
publicMemoWindow.$mount('#publicMemoWindow')

const addCharacterSettingWindow = new Vue({ store, components: { AddCharacterSettingWindow: AddCharacterSettingWindow }, template: `<AddCharacterSettingWindow/>` })
addCharacterSettingWindow.$mount('#addCharacterSettingWindow')

const addCharacterWindow = new Vue({ store, components: { AddCharacterWindow: AddCharacterWindow }, template: `<AddCharacterWindow/>` })
addCharacterWindow.$mount('#addCharacterWindow')

const characterContext = new Vue({ store, components: { CharacterContext: CharacterContext }, template: `<CharacterContext/>` })
characterContext.$mount('#characterContext')

const dropChooseWindow = new Vue({ store, components: { DropChooseWindow: DropChooseWindow }, template: `<DropChooseWindow/>` })
dropChooseWindow.$mount('#dropChooseWindow')
