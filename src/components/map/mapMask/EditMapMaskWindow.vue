<template>
  <WindowFrame title="マスク変更" display-property="editMapMaskWindow" align="center" fixSize="285, 195" @open="initWindow" @reset="initWindow" @close="closeWindow">
    <table>
      <tbody>
        <tr>
          <th>文字：</th>
          <td><input type="text" v-model="name"></td>
          <td rowspan="6" class="mapMaskGrid"><div class="mapMask" :style="mapMaskStyle">{{name}}<br>({{this.key}})</div></td>
        </tr>
        <tr>
          <th>色：</th>
          <td><input type="color" v-model="color"></td>
        </tr>
        <tr>
          <th>高さ：</th>
          <td><input type="number" min="1" v-model="height"></td>
        </tr>
        <tr>
          <th>幅：</th>
          <td><input type="number" min="1" v-model="width"></td>
        </tr>
        <tr>
          <th>透明度：</th>
          <td><input type="range" v-model="transparency"></td>
        </tr>
        <tr>
          <td colspan="2" class="multi"><button @click="commitEdit">編集</button><button @click="cancelEdit">キャンセル</button></td>
        </tr>
      </tbody>
    </table>
  </WindowFrame>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import WindowFrame from '../../WindowFrame'

export default {
  name: 'editMapMask',
  components: {
    WindowFrame: WindowFrame
  },
  data () {
    return {
      name: '',
      width: 1,
      height: 1,
      color: '#000000',
      transparency: 0
    }
  },
  methods: {
    ...mapMutations([
      'windowClose',
      'changeDisplayValue',
      'changeMapMaskInfo'
    ]),
    closeWindow: function () {
      console.log('★★★ override closeWindow!!!!')
      this.changeDisplayValue({ main: 'editMapMaskWindow', sub: 'key', value: -1 })
      this.windowClose('editMapMaskWindow')
    },
    commitEdit: function () {
      const mapMaskObj = {
        key: this.key,
        name: this.name,
        gridW: this.width,
        gridH: this.height,
        color: this.rgba,
        fontColor: this.fontColor
      }

      this.changeMapMaskInfo(mapMaskObj)
      this.closeWindow()
    },
    cancelEdit: function () {
      this.closeWindow()
    },
    initWindow: function () {
      console.log(`initWindow`)
      let mapMaskObj = this.getPieceObj('mapMasks', this.key)
      this.name = mapMaskObj.name
      this.width = mapMaskObj.gridW
      this.height = mapMaskObj.gridH
      const colorObj = this.parseColor(mapMaskObj.color)
      this.color = colorObj.getColorCode()
      this.transparency = 100 - Math.floor(colorObj.a * 100)
      console.log(`  [methods] init window => EditMapMask:{name:"${this.name}", color:${this.color}, size:(${this.width}, ${this.height}), transparency:${this.transparency}}`)
    }
  },
  computed: {
    ...mapGetters([
      'doResetPosition',
      'parseColor',
      'getPieceObj'
    ]),
    key: function () {
      return this.$store.state.display['editMapMaskWindow'].key
    },
    mapMaskStyle: function () {
      let width = this.width * 50
      let height = this.height * 50
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
