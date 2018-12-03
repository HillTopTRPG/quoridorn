<template>
  <div class="logo metal linear oval">
    <div id="mainTitle">
      <span class="hoverDeco">Quoridorn</span>
    </div>
    <div id="phonetic">~ <span class="hoverDeco">コリドーン</span> ~</div>
    <div id="subTitle">The <abbr title="Table-talk Role-Playing Game">TRPG</abbr> session tool.</div>
    <div class="deco boltShadow lt"></div>
    <div class="deco boltShadow rt"></div>
    <div class="deco boltShadow lb"></div>
    <div class="deco boltShadow rb"></div>
    <div class="deco bolt lt"></div>
    <div class="deco bolt rt"></div>
    <div class="deco bolt lb"></div>
    <div class="deco bolt rb"></div>
  </div>
</template>

<script>

export default {
  name: 'logo',
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .logoContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    /*padding: 2em;*/
  }
  .logo {
    display: inline-block;
    font-size: 16px;
    /*padding: 0 1em;*/
    padding: 1em 2.5em;
    position: relative;
    user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
  }
  .logo > * {
    color: black;
  }
  #mainTitle {
    font-size: 2.2em;
    line-height: 1em;
    letter-spacing: 1px;
    display: flex;
    /*justify-content: center;*/
    /*align-items: center;*/
  }
  .hoverDeco {

  }
  #phonetic {
    font-size: 1em;
    line-height: 1em;
  }
  #subTitle {
    color: #333;
    font-size: 1em;
    line-height: 1em;
    margin-top: 0.5em;
  }
  abbr {
    text-decoration: none;
  }
  abbr:hover {
    text-decoration: underline dotted;
  }
  .deco {
    position: absolute;
  }
  .deco.lt,
  .deco.rt {
    top: 0.8em;
  }
  .deco.lb,
  .deco.rb {
    bottom: 0.8em;
  }
  .deco.lt,
  .deco.lb {
    left: 0.8em;
  }
  .deco.rt,
  .deco.rb {
    right: 0.8em;
  }
  .bolt {
    border-radius: 50%;
    width: 0.7em;
    height: 0.7em;
    background-color: #d0d0d0;
    /*box-shadow: hsla(0, 0%, 15%, .3) 0 1px 0 0;*/
    border: 1px solid #c0c0c0;
  }
  .boltShadow {
    border-radius: 50%;
    width: 0.7em;
    height: 0.7em;
    background-color: #d0d0d0;
    box-shadow: hsla(0, 0%, 15%, .3) 0 1px 0 0;
    border: 1px solid #c0c0c0;
  }
  .bolt:before,
  .bolt:after {
    content: '';
    background-color: #999;
    position: absolute;
    box-sizing: border-box;
    border-left: 1px solid #aaa;
    left: 41%;
    top: 20%;
    width: 18%;
    height: 60%;
    border-radius: 100%;
    transform-origin: center;
  }
  .bolt:before {
    transform: rotate(45deg);
  }
  .bolt:after {
    transform: rotate(-45deg);
  }

  .bolt {
    animation: rotate-anime 3s linear infinite;
  }
  @keyframes rotate-anime {
    0%  {transform: rotate(0);}
    100%  {transform: rotate(360deg);}
  }

  /* Metal ------------------------- */

  .metal {
    position: relative;
    outline: none;

    font: bold 6em/2em "Helvetica Neue", Arial, Helvetica, Geneva, sans-serif;
    text-align: center;
    color: hsla(0, 0%, 20%, 1);
    text-shadow: hsla(0, 0%, 40%, .5) 0 -1px 0, hsla(0, 0%, 100%, .6) 0 2px 1px;

    background-color: hsl(0, 0%, 90%);
    box-shadow:
      inset hsla(0, 0%,  15%,   1) 0  0   0   3px, /* border */
      inset hsla(0, 0%,  15%,  .8) 0  1px 5px 3px, /* soft SD */
      inset hsla(0, 0%,   0%, .25) 0 -1px 0   7px, /* bottom SD */
      inset hsla(0, 0%, 100%,  .7) 0  2px 1px 7px; /* top HL */
    /*hsla(0,0%, 0%,.15) 0 -5px 6px 4px, !* outer SD *!*/
    /*hsla(0,0%,100%,.5) 0  5px 6px 4px; !* outer HL *!*/

    transition: color .2s;
  }

  /* Radial ------------------------- */

  .radial.metal {
    background-size: 100px 100px;
    border-radius: 80px;
    background-image:
      -webkit-radial-gradient(  50%   0%,  8% 50%, hsla(0, 0%, 100%, .5) 0%, hsla(0, 0%, 100%, 0) 100%),
      -webkit-radial-gradient(  50% 100%, 12% 50%, hsla(0, 0%, 100%, .6) 0%, hsla(0, 0%, 100%, 0) 100%),
      -webkit-radial-gradient(   0%  50%, 50%  7%, hsla(0, 0%, 100%, .5) 0%, hsla(0, 0%, 100%, 0) 100%),
      -webkit-radial-gradient( 100%  50%, 50%  5%, hsla(0, 0%, 100%, .5) 0%, hsla(0, 0%, 100%, 0) 100%),

      -webkit-repeating-radial-gradient( 50% 50%, 100% 100%, hsla(0,0%,  0%,0) 0%, hsla(0,0%,  0%,0)   3%, hsla(0,0%,  0%,.1) 3.5%),
      -webkit-repeating-radial-gradient( 50% 50%, 100% 100%, hsla(0,0%,100%,0) 0%, hsla(0,0%,100%,0)   6%, hsla(0,0%,100%,.1) 7.5%),
      -webkit-repeating-radial-gradient( 50% 50%, 100% 100%, hsla(0,0%,100%,0) 0%, hsla(0,0%,100%,0) 1.2%, hsla(0,0%,100%,.2) 2.2%),

      -webkit-radial-gradient( 50% 50%, 200% 50%, hsla(0,0%,90%,1) 5%, hsla(0,0%,85%,1) 30%, hsla(0,0%,60%,1) 100%);
  }

  .metal.radial:before, .metal.radial:after {
    content: "";
    top: 0;
    left: 0;
    position: absolute;
    width: inherit;
    height: inherit;
    border-radius: inherit;

    /* fake conical gradients */
    background-image: -webkit-radial-gradient(50% 0%, 10% 50%, hsla(0, 0%, 0%, .1) 0%, hsla(0, 0%, 0%, 0) 100%),
    -webkit-radial-gradient(50% 100%, 10% 50%, hsla(0, 0%, 0%, .1) 0%, hsla(0, 0%, 0%, 0) 100%),
    -webkit-radial-gradient(0% 50%, 50% 10%, hsla(0, 0%, 0%, .1) 0%, hsla(0, 0%, 0%, 0) 100%),
    -webkit-radial-gradient(100% 50%, 50% 06%, hsla(0, 0%, 0%, .1) 0%, hsla(0, 0%, 0%, 0) 100%);
  }
  .metal.radial:before { transform: rotate( 65deg); }
  .metal.radial:after { transform: rotate(-65deg); }

  /* Linear ------------------------- */

  .metal.linear {
    background-size: 100%;
    border-radius: .5em;
    background-image:
      -webkit-repeating-linear-gradient(left, hsla(0,0%,100%,0) 0%, hsla(0,0%,100%,0)   6%, hsla(0,0%,100%, .1) 7.5%),
      -webkit-repeating-linear-gradient(left, hsla(0,0%,  0%,0) 0%, hsla(0,0%,  0%,0)   4%, hsla(0,0%,  0%,.03) 4.5%),
      -webkit-repeating-linear-gradient(left, hsla(0,0%,100%,0) 0%, hsla(0,0%,100%,0) 1.2%, hsla(0,0%,100%,.15) 2.2%),
      linear-gradient(180deg, hsl(0,0%,78%)  0%,
      hsl(0,0%,90%) 47%,
      hsl(0,0%,78%) 53%,
      hsl(0,0%,70%)100%);
  }

  /* Oval ------------------------- */

  .metal.linear.oval {
    background-size: 100px 100%;
    border-radius: 1.5em;
    font: italic bold 1em/1em Georgia, "Times New Roman", Times, serif;
  }

  /* active ------------------------- */
  /*
  */
  .metal .hoverDeco:hover {
    color: hsl(210, 100%, 40%);
    text-shadow:
      hsla(210, 100%, 20%, .3) 0 -1px 0,
      hsl(210, 100%, 85%) 0 2px 1px,
      hsla(200, 100%, 80%, 1) 0 0 5px,
      hsla(210, 100%, 50%, .6) 0 0 20px;
    /*box-shadow:*/
      /*inset hsla(210, 100%, 30%, 1) 0 0 0 4px,*/
      /*inset hsla(210, 100%, 15%, .4) 0 -1px 5px 4px,*/
      /*inset hsla(210, 100%, 20%, .25) 0 -1px 0 7px,*/
      /*inset hsla(210, 100%, 100%, .7) 0 2px 1px 7px,*/
      /*hsla(210, 100%, 75%, .8) 0 0 3px 2px,*/
      /*hsla(210, 50%, 40%, .25) 0 -5px 6px 4px,*/
      /*hsla(210, 80%, 95%, 1) 0 5px 6px 4px;*/
  }

</style>
