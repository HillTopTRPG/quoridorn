<template>
  <div class="container">
    <div class="deck" ref="deck" @mouseover="mouseOver" @mouseout="mouseOut" :class="{hover: isHover}">
      <Card v-for="(card, index) in cardList" :key="card.key" :objKey="card.key" :index="index" :ref="card.key"></Card>
    </div>
    <button id="BTN" @click="clkBtn">1枚めくる</button>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Card from './Card'

export default {
  name: 'deck',
  mixins: [],
  components: {
    Card
  },
  data () {
    return {
      isHover: false
    }
  },
  methods: {
    clkBtn () {
      console.log('click btn')
      const deckElm = this.$refs.deck
      const cardElm = deckElm.lastElementChild

      if (cardElm.classList.contains('turnCard')) {
        cardElm.classList.remove('turnCard')
        cardElm.classList.remove('turnMove')
      } else {
        cardElm.classList.add('turnCard')
        cardElm.classList.add('turnMove')
      }
    },
    mouseOver () {
      this.setHover(true)
    },
    mouseOut () {
      this.setHover(false)
    },
    setHover (hover) {
      this.isHover = hover
      for (const key in this.$refs) {
        if (!this.$refs.hasOwnProperty(key)) continue
        const card = this.$refs[key][0]
        if (!card) continue
        card.setHover(hover)
      }
    }
  },
  computed: mapState({
    ...mapGetters([]),
    cardList: state => state.public.deck.cards.list
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    position: absolute;
    top: 100px;
    left: 200px;
    /*border: 1px solid cyan;*/
  }
  .deck {
    display: inline-block;
    width: 64px;
    height: 96px;
    perspective: 800px;
    -webkit-perspective: 800px;
    font-size: 8px;
    /*border: 1px solid magenta;*/
  }
  #card1 {
    top: 0;
    left: 0;
  }
  #card2 {
    top: 2px;
    left: 2px;
  }
  #card3 {
    top: 4px;
    left: 4px;
  }
  #card4 {
    top: 6px;
    left: 6px;
  }
  #card5 {
    top: 8px;
    left: 8px;
  }
  #card6 {
    top: 10px;
    left: 10px;
  }
  button {
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }
</style>
