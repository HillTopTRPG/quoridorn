
<template>
  <ContextFrame displayProperty="private.display.cardContext">
    <div class="item" @click.left.prevent="draw">1枚引く</div>
    <div class="item" @click.left.prevent="choice">展開する</div>
    <div class="item" @click.left.prevent="reverse">裏返す</div>
    <div class="item" @click.left.prevent="shuffle">シャッフル</div>
  </ContextFrame>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import ContextFrame from '../../ContextFrame'
import WindowMixin from '../../WindowMixin'

export default {
  mixins: [WindowMixin],
  components: {
    ContextFrame
  },
  methods: {
    ...mapActions([
      'windowOpen',
      'setProperty',
      'deletePieceInfo',
      'windowClose'
    ]),
    draw () {
      if (this.viewMode !== 'normal') {
        this.setProperty({property: 'deck.command', value: {type: 'changeViewMode', value: 'normal'}, logOff: false})
        setTimeout(() => {
          this.setProperty({property: 'deck.command', value: {type: 'draw'}, logOff: false})
        }, 200)
      } else {
        this.setProperty({property: 'deck.command', value: {type: 'draw'}, logOff: false})
      }
      this.windowClose('private.display.cardContext')
    },
    choice () {
      this.setProperty({property: 'deck.command', value: { type: 'changeViewMode', value: 'choice' }, logOff: false})
      this.windowClose('private.display.cardContext')
    },
    reverse () {
      this.setProperty({property: 'deck.isReverse', value: !this.isReverse, logOff: false})
      this.windowClose('private.display.cardContext')
    },
    shuffle () {
      if (this.viewMode !== 'normal') {
        this.setProperty({property: 'deck.command', value: { type: 'changeViewMode', value: 'normal' }, logOff: false})
        setTimeout(() => {
          this.setProperty({property: 'deck.command', value: { type: 'shuffle' }, logOff: false})
        }, 1000)
      } else {
        this.setProperty({property: 'deck.command', value: { type: 'shuffle' }, logOff: false})
      }
      this.windowClose('private.display.cardContext')
    }
  },
  computed: mapState({
    ...mapGetters([
      'getPieceObj'
    ]),
    objKey: state => state.private.display['chitContext'].key,
    storeObj () {
      const type = 'chit'
      const key = this.objKey
      // console.log(`key:${key}`)
      return this.getPieceObj(type, key)
    },
    isReverse: state => state.deck.isReverse,
    viewMode: state => state.deck.viewMode
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
