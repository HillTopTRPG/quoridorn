<template>
  <div class="card" :style="cardStyle"
       :class="[viewMode, {isViewer: isViewer, isOdd: useIndex % 2 === 1, isEven: useIndex % 2 === 0}]"
       @mouseover="mouseOver" @mouseout="mouseOut"
       @click.right.prevent="openContext"
       ref="card"
  >
    <figure class="front" :style="frontStyle"></figure>
    <div class="back" :style="backStyle" v-html="card ? card.back.text.replace(/\n/g, '<br>') : ''"></div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'card',
  props: {
    'objKey': { type: String, required: true },
    'index': { type: Number, required: true },
    'isViewer': { type: Boolean, default: false }
  },
  data () {
    return {
      shuffleCount: 0
    }
  },
  mounted () {
    const cardElm = this.$refs.card
    const transitionEnd = () => {
      // console.qLog('transitionEnd')
    }
    const animationEnd = event => {
      const animationName = event.animationName
      // console.qLog(animationName)
      const className = animationName.replace(/^(.+animation).+$/, '$1')
      // console.qLog(className)
      if (animationName.startsWith('shuffle-animation-even') ||
        animationName.startsWith('shuffle-animation-odd')) {
        this.shuffleCount++
        if (this.shuffleCount >= 4) {
          this.shuffleCount = 1
        }
        if (this.shuffleCount === 3) {
          event.target.classList.remove(className)
          this.shuffleDeck()
        }
        if (this.shuffleCount < 3) {
          event.target.classList.remove(className)
          setTimeout(() => {
            event.target.classList.add(className)
          })
        }
      }
      if (animationName.startsWith('turn-animation')) {
        if (confirm('手札に加える')) {
          this.drawCard({
            index: this.index,
            cardKey: this.objKey
          })
        } else {

        }
      }
    }
    cardElm.addEventListener('animationEnd', animationEnd)
    cardElm.addEventListener('webkitAnimationEnd', animationEnd)
    cardElm.addEventListener('transitionEnd', transitionEnd)
    cardElm.addEventListener('webkitTransitionEnd', transitionEnd)
  },
  methods: {
    ...mapActions([
      'setProperty',
      'windowOpen',
      'drawCard',
      'shuffleDeck'
    ]),
    mouseOver () {
      if (this.viewMode === 'normal') {
        return
      }
      this.setProperty({
        property: 'deck',
        value: {
          hoverIndex: this.index,
          hoverKey: this.objKey
        },
        logOff: true
      })
    },
    mouseOut () {
      // Nothing
    },
    openContext (event) {
      let pageX = event.pageX
      let pageY = event.pageY

      const obj = {
        key: this.objKey,
        index: this.index,
        x: pageX,
        y: pageY
      }
      const contextProperty = 'private.display.cardContext'
      this.setProperty({property: contextProperty, value: obj})
      this.windowOpen(contextProperty)
    }
  },
  computed: mapState({
    ...mapGetters([]),
    cardList: state => state.public.deck.cards.list,
    card () {
      return this.cardList.filter(card => card.key === this.objKey)[0]
    },
    cardStyle () {
      let obj = {
        width: `${this.width}px`,
        height: `${this.height}px`
      }

      const transformList = []
      obj.transformOrigin = `50% 150%`

      if (this.isViewer) {
        transformList.push(`scale(1, 1)`)
        transformList.push(`translate(-10%, 75%)`)
        obj.opacity = this.viewMode === 'choice' && this.isViewer ? 1 : 0
      }
      obj.transitionDuration = `1s`
      if (this.viewMode === 'choice') {
        if (!this.isViewer) {
          transformList.push(`scale(0.8, 0.8)`)
          transformList.push(`translate(-10%, -30%)`)
          const degAvr = Math.min(335 / (this.cardList.length), 25)
          let deg = this.useIndex * degAvr
          transformList.push(`rotate(${deg}deg)`)
        }
      } else {
        if (!this.isViewer) {
          transformList.push(`translate(-10%, -30%)`)
          transformList.push(`scale(0.8, 0.8)`)
          if (this.useIndex < 6) {
            obj.top = this.useIndex * 2 + 'px'
            obj.left = this.useIndex * 2 + 'px'
          } else {
            obj.top = '10px'
            obj.left = '10px'
          }
        }
      }
      obj.transform = transformList.join(' ')
      return obj
    },
    frontStyle () {
      const obj = {
        backgroundImage: `url("${!this.isReverse ? this.backImage : this.card ? this.card.back.img : ''}")`,
        backgroundSize: '100% 100%'
      }
      if (this.viewMode === 'choice' && !this.isViewer) {
        if (this.hoverIndex === this.index) {
          obj.transform = `translateY(-50px)`
        }
      }
      return obj
    },
    backStyle () {
      if (!this.card) {
        return {}
      }
      const obj = {
        backgroundImage: `url("${!this.isReverse ? this.card ? this.card.back.img : '' : this.backImage}")`,
        backgroundSize: '100% 100%'
      }
      if (this.viewMode === 'choice' && !this.isViewer) {
        if (this.hoverIndex === this.index) {
          let flg = false
          // console.qLog(this.$refs.card.classList)
          if (this.$refs.card) {
            Array.prototype.slice.call(this.$refs.card.classList).forEach(cls => {
              // console.qLog(cls)
              if (flg) return
              flg = cls.startsWith('shuffle-animation')
            })
          }
          if (!flg) {
            obj.transform = `rotateY(180deg) translateY(-50px)`
          }
        }
      }
      return obj
    },
    backImage: state => state.public.deck.back,
    width: state => state.public.deck.width,
    height: state => state.public.deck.height,
    hoverIndex: state => state.deck.hoverIndex,
    viewMode: state => state.deck.viewMode,
    isReverse: state => state.deck.isReverse,
    useIndex () { return this.cardList.length - this.index - 1 },
    isShuffleMove () {
      console.qLog(this.useIndex, (this.useIndex < 6) && (this.useIndex % 2 === 1))
      return (this.useIndex < 6) && (this.useIndex % 2 === 0)
    }
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .card {
    position: absolute;
    display: inline-block;
    line-height: 1.2em;
    font-size: 100%;

    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;

    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
  }
  .card.isViewer {
    opacity: 0;
  }
  .card > * {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 3px;
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    background-size: cover;

    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }
  /*.card .front { background-color: rgba(255, 255, 0, 1); }*/
  .card .back {
    transform: rotateY(180deg);
    -webkit-transform: rotateY(180deg);
    /*background-color: rgba(0, 255, 0, 1);*/
  }

  .card.turn-animation {
    animation-name: turn-animation;
    animation-duration: 1.3s;
    animation-fill-mode: forwards;
    transition-timing-function: linear;
    -webkit-transition-timing-function: linear;
    z-index: 1;
  }
  @keyframes turn-animation {
    0% {
      top: 0;
      left: 0;
      transform: translate(-10%, -30%) rotateY(0deg) scale(0.8, 0.8);
      -webkit-transform: translate(-10%, -30%) rotateY(0deg) scale(0.8, 0.8);
    }
    30% {
      top: 0;
      left: 0;
      transform-origin: bottom;
      transform: translate(-30%, 0%) scale(0.8, 0.8);
      -webkit-transform: translate(-30% 0%) scale(0.8, 0.8);
    }
    100% {
      top: 0;
      left: 0;
      transform-origin: 80% bottom;
      transform: translate(0, 0) rotate3D(0, 1, 0, 179deg) scale(1, 1);
      -webkit-transform: translate(0, 0) rotate3D(0, 1, 0, 179deg) scale(1, 1);
    }
  }
  .card.shuffle-animation {
    animation-duration: 0.4s;
    animation-fill-mode: forwards;
    /*transition-timing-function : linear;*/
    /*transform-origin: 50% 0%;*/
  }
  .card.shuffle-animation.isOdd {
    animation-name: shuffle-animation-odd;
  }
  .card.shuffle-animation.isEven {
    animation-name: shuffle-animation-even;
  }
  @keyframes shuffle-animation-even {
    0% {
      transform: translate(-10%, -30%) scale(0.8, 0.8);
      -webkit-transform: translate(-10%, -30%) scale(0.8, 0.8);
      z-index: 0;
    }
    50% {
      transform: translate(calc(-10% + 50% + 5px + 1px), calc(-30% + 1px)) scale(0.8, 0.8);
      -webkit-transform: translate(calc(-10% + 50% + 5px + 1px), calc(-30% + 1px)) scale(0.8, 0.8);
    }
    100% {
      transform: translate(calc(-10% + 2px), calc(-30% + 2px)) scale(0.8, 0.8);
      -webkit-transform: translate(calc(-10% + 2px), calc(-30% + 2px)) scale(0.8, 0.8);
      z-index: 1;
    }
  }
  @keyframes shuffle-animation-odd {
    0% {
      transform: translate(-10%, -30%) scale(0.8, 0.8);
      -webkit-transform: translate(-10%, -30%) scale(0.8, 0.8);
      z-index: 0;
    }
    50% {
      transform: translate(calc(-10% - 50% - 5px - 1px), calc(-30% - 1px)) scale(0.8, 0.8);
      -webkit-transform: translate(calc(-10% - 50% - 5px - 1px), calc(-30% - 1px)) scale(0.8, 0.8);
    }
    100% {
      transform: translate(calc(-10% - 2px), calc(-30% - 2px)) scale(0.8, 0.8);
      -webkit-transform: translate(calc(-10% - 2px), calc(-30% - 2px)) scale(0.8, 0.8);
      z-index: 2;
    }
  }
</style>
