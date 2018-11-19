<template>
  <div class="container" :style="containerStyle">
    <fieldset>
      <legend>{{deck.name}}</legend>
      <div class="refArea">
        【出典元情報】
        <div v-if="deck.author">作者：{{deck.author}}</div>
        <div v-if="deck.title">作品名：{{deck.title}}</div>
        <div class="refUrlContainer"><a v-for="(ref, index) in deck.refs" :key="index" :href="ref.url" target="_blank" :title="createRefStr(ref, index)">{{createRefStr(ref, index)}}</a></div>
      </div>
      <div class="deck" ref="deck" :style="deckStyle">
        <Card v-for="(card, index) in cardList" :class="[card.key]" :key="card.key" :objKey="card.key" :index="index" :ref="card.key"></Card>
        <Card :objKey="hoverKey" :isViewer="true" :index="hoverIndex" ref="centerCard"></Card>
        カードなし
      </div>
    </fieldset>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Card from './Card'

export default {
  name: 'deck',
  mixins: [],
  components: {
    Card
  },
  data () {
    return {}
  },
  methods: {
    ...mapActions([
      'setProperty'
    ]),
    createRefStr ({author, title}, index) {
      if (!author && !title) return `link-${index}`
      if (author && title) return `${title}(${author})`
      if (author) return `${author}`
      if (title) return `${title}`
      return ''
    }
  },
  watch: {
    command: {
      handler (command) {
        if (!command) return
        if (command.type === 'draw') {
          let cards = Array.prototype.slice.call(this.$refs.deck.getElementsByClassName(this.hoverKey))
          console.log(this.hoverKey, cards)
          let cardElm = cards[0]
          if (!cardElm) {
            const key = this.cardList[this.cardList.length - 1].key
            cards = Array.prototype.slice.call(this.$refs.deck.getElementsByClassName(key))
            console.log(key, cards)
            cardElm = cards[0]
          }
          if (cardElm.classList.contains('turn-animation')) {
            cardElm.classList.remove('turn-animation')
          } else {
            cardElm.classList.add('turn-animation')
          }
          this.setProperty({
            property: 'deck',
            value: {
              hoverIndex: -1,
              hoverKey: ''
            },
            logOff: true
          })
        } else if (command.type === 'changeViewMode') {
          this.setProperty({property: 'deck.viewMode', value: command.value, logOff: true})
        } else if (command.type === 'shuffle') {
          const cards = Array.prototype.slice.call(this.$refs.deck.getElementsByClassName('card'))
          if (cards.length) {
            cards.forEach(cardElm => {
              if (cardElm.classList.contains('shuffle-animation')) {
                cardElm.classList.remove('shuffle-animation')
              } else {
                cardElm.classList.add('shuffle-animation')
              }
            })
          }
        }
        this.setProperty({property: 'deck.command', value: null, logOff: true})
      },
      deep: true
    }
  },
  computed: mapState({
    ...mapGetters([]),
    deck: state => state.public.deck,
    cardList: state => state.public.deck.cards.list,
    command: state => state.deck.command,
    hoverIndex: state => state.deck.hoverIndex,
    viewMode: state => state.deck.viewMode,
    hoverKey: state => state.deck.hoverKey,
    width: state => state.public.deck.width,
    height: state => state.public.deck.height,
    containerStyle () {
      const obj = {}
      obj.width = this.width * 0.8 + 22 + 'px'
      return obj
    },
    deckStyle () {
      const obj = {}
      obj.width = this.width * 0.8 + 15 + 'px'
      obj.height = this.height * 0.8 + 15 + 'px'
      return obj
    }
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    position: absolute;
    top: 130px;
    left: 240px;
    padding: 0;
    perspective: 800px;
    -webkit-perspective: 800px;
    font-size: 8px;
    border: 1px solid cyan;
    box-sizing: border-box;
  }
  fieldset {
    background-color: rgba(0, 255, 0, 0);
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    border: 2px solid black;
  }
  legend {
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid black;
    border-bottom: none;
    box-sizing: border-box;
    margin: -0.8em 5px;
    padding: 0 5px;
    top: -0.8em;
    /*margin-top: -1em;*/
    position: absolute;
  }
  .refArea {
    background-color: rgba(255, 255, 255, 0.8);
    box-sizing: border-box;
  }
  .refUrlContainer {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 5px;
    border-bottom: 1px solid black;
    box-sizing: border-box;
  }
  a {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 50px;
    border-radius: 0.5em;
    border: 1px solid black;
    padding: 0 2px;
    box-sizing: border-box;
  }
  .deck {
    position: relative;
    box-sizing: border-box;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
  }
  button {
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }
</style>
