// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'bcdice-js/lib/preload-dicebots'
import Vue from 'vue'
import Vuex from 'vuex'
import deckList from '../assets/deck.yaml'

Vue.use(Vuex)

/**
 * Store
 */
const storeModuleSetting = {
  // FIXME settingのデータは別経路で保存する？
  state: {
    /** カードセット */
    version: '1.0.0b2',
    /** カードセット */
    cardSet: deckList
  }, /* end of state */
  actions: {
    // /**
    //  * 指定されたプロパティパスの子画面を開く
    //  * @param state
    //  * @param getters
    //  * @param property
    //  */
    // onSettingMount ({ state }) {
    //   deckList.forEach(deck => state.cardSet.push(deck))
    // }
  } /* end of actions */
}
export default storeModuleSetting
