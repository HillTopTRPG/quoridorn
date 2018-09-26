<template>
  <WindowFrame class="container" title="キャラクター追加" display-property="addCharacterWindow" align="center" fixSize="485, 195">
    <button v-show="!isOpenSelect" @click="isOpenSelect = !isOpenSelect">画像変更</button>
    <div class="currentImage"></div>
    <div v-show="isOpenSelect" class="tagImages"></div>
    <div v-show="isOpenSelect" class="selectedImage"><label>タグ名：</label><select></select><span>{{selectedTagIndexText}}</span></div>
    <button v-show="isOpenSelect">隠し画像</button>
    <button v-show="isOpenSelect">反</button>
    <button v-show="!isOpenSwitch" @click="isOpenSwitch = !isOpenSwitch">画像切替設定</button>
    <div v-show="isOpenSwitch" class="switchImage"></div>
    <button v-show="isOpenSwitch" @click.prevent="addSwitch">追加</button>
    <button v-show="isOpenSwitch" @click.prevent="deleteSwitch">削除</button>
    <label>名前：</label><input type="text" class="name"/>
    <label>サイズ：</label><input type="number" class="size"/>
    <label><input type="checkbox" class="hide"/>マップマスクの下に隠す<br>（イニシアティブ表で非表示）：</label>
    <label>参照URL：</label><input type="text" class="url"/>
    <textarea class="text"></textarea>
    <button>変更</button>
    <button>キャンセル</button>
  </WindowFrame>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import WindowFrame from '../../WindowFrame'

export default {
  name: 'addMapMask',
  components: {
    WindowFrame: WindowFrame
  },
  data () {
    return {
      imageList: '',
      isOpenSelect: false,
      isOpenSwitch: false,
      name: '',
      size: 1,
      isHide: false,
      url: '',
      text: ''
    }
  },
  methods: {
    ...mapMutations([]),
    dragStart: function (event) {
      event.dataTransfer.setData('kind', 'mapMask')
      event.dataTransfer.setData('name', this.name)
      event.dataTransfer.setData('color', this.rgba)
      event.dataTransfer.setData('fontColor', this.fontColor)
      event.dataTransfer.setData('columns', this.width)
      event.dataTransfer.setData('rows', this.height)
      console.log(`  [methods] drag start mapMask => {name:"${this.name}", color:${this.color}, size:(${this.width}, ${this.height}), transparency:${this.transparency}`)
    }
  },
  computed: {
    ...mapGetters([
      'parseColor'
    ]),
    mapMaskStyle: function () {
      let width = this.width * this.gridSize
      let height = this.height * this.gridSize
      let zoom = 1
      if (Math.max(width, height) > 160) {
        zoom = 160 / Math.max(width, height)
        width *= zoom
        height *= zoom
      }
      let result = {
        width: width + 'px',
        height: height + 'px',
        'background-color': this.rgba,
        color: this.fontColor
      }
      return result
    },
    rgba: function () {
      const colorObj = this.parseColor(this.color)
      colorObj.a = (100 - this.transparency) / 100
      return colorObj.getRGBA()
    },
    fontColor: function () {
      const colorObj = this.parseColor(this.color)
      return colorObj.getColorCodeReverse()
    },
    gridSize: function () {
      return this.$store.state.map.grid.size
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  display: grid;
}
table {
  font-size: 12px;
  white-space: nowrap;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  border-collapse: collapse;
}
th, td {
  padding: 0;
  border: none;
}
th {
  text-align: right;
  font-weight: normal;
}
td.multi {
  text-align: center;
}
td.mapMaskGrid {
  width: 161px;
  height: 161px;
  max-width: 161px;
  max-height: 161px;
  text-align: center;
  border: none;
}
.mapMask {
  max-width: 161px;
  max-height: 161px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  border: solid yellow 2px;
}
input[type=number] {
  width: 46px;
}
input[type=text] {
  width: 60px;
}
input[type=range] {
  width: 60px;
}
</style>
