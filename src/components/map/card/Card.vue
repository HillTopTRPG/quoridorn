<template>
  <div class="card" :style="cardStyle" :class="{hover: isHover}">
    <figure class="front">{{card.front.text}}</figure>
    <div class="back" v-html="card.back.text.replace(/\n/g, '<br>')"></div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'card',
  props: {
    'objKey': { type: String, required: true },
    'index': { type: Number, required: true }
  },
  data () {
    return {
      isHover: false
    }
  },
  methods: {
    setHover (hover) {
      this.isHover = hover
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
        transformOrigin: `50% calc(100% + ${this.cardList.length}px)`
      }
      const useIndex = this.cardList.length - this.index - 1
      if (this.isHover) {
        // obj.border = '1px solid red'
        const deg = Math.min(340 / (this.cardList.length), 25)
        obj.transform = `translate(0%, 0px) rotate(${useIndex * deg}deg)`
      } else {
        if (useIndex < 6) {
          obj.top = useIndex * 2 + 'px'
          obj.left = useIndex * 2 + 'px'
        } else {
          obj.top = '10px'
          obj.left = '10px'
        }
      }
      obj.transitionDuration = `0.3s`
      return obj
    }
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .card {
    position: absolute;
    display: inline-block;
    width: 64px;
    height: 96px;
    box-sizing: border-box;
    border-radius: 5%;
    line-height: 1.2em;

    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;

    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
    font-size: 100%;
  }
  .card > * {
    width: 100%;
    height: 100%;
    border: 1px solid rgba(100, 100, 100, 0.5);
    border-radius: 5%;
    box-sizing: border-box;
    margin: 0;
    padding: 3px;
    position: absolute;
    top: 0px;
    left: 0px;
    text-align: center;

    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }
  .card > *:hover {
    transform: translateY(-30px);
  }
  .card .front { background-color: rgba(255, 255, 0, 1); }
  .card .back {
    transform: rotateY(180deg);
    -webkit-transform: rotateY(180deg);
    background-color: rgba(0, 255, 0, 1);
  }
  .card.turnCard{
    animation-name: turnCard;
    animation-duration: 1.5s;
    transition-timing-function : linear;

    width: 96px;
    height: 144px;
    font-size: 150%;
    transform: rotateY(-180deg);
    -webkit-transform: rotateY(-180deg);
  }
  @keyframes turnCard {
    0% {
      width: 64px;
      height: 96px;
      font-size: 100%;
      transform: rotateY(0deg) translateY(0px);
      -webkit-transform: rotateY(0deg) translateY(0px);
    }
    40% {
      width: 64px;
      height: 96px;
      font-size: 100%;
      transform: translateY(20px);
      -webkit-transform: translateY(20px);
    }
    /*
    50% {
      width: 96px;
      height: 144px;
      font-size: 150%;
      transform: rotateY(-90deg) translateY(-5px);
      -webkit-transform: rotateY(-90deg) translateY(-5px);
    }
    */
    100% {
      font-size: 150%;
      transform: rotateY(-180deg);
      -webkit-transform: rotateY(-180deg);
    }
  }
</style>
