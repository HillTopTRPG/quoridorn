// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Menu from './components/Menu'
import ChatWindow from './components/ChatWindow'

Vue.config.productionTip = false

// ミックスインオブジェクトを定義
/* eslint-disable */
const mixInWindow = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('Window Created!!')
    }
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: {
    Menu: Menu,
    ChatWindow: ChatWindow,
    App: App
  },
  data: {
    scrollY: 0
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
        this.scrollY = window.scrollY;
        console.log('scroll', this.scrollY)
    }
  },
  template: `
  <div>
    <ChatWindow></ChatWindow>
    <App></App>
    <Menu></Menu>
  </div>
  `
})
