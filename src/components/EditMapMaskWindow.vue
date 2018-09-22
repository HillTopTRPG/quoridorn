<template>
  <WindowBase title="マスク変更" display-property="editMapMaskWindow" align="center" fixSize="285, 195" @open="initWindow" @reset="initWindow" @close="closeWindow">
    <table>
      <tbody>
        <tr>
          <th>文字：</th>
          <td><input type="text" v-model="name"></td>
          <td rowspan="6" class="mapMaskGrid"><div class="mapMask" :style="mapMaskStyle">{{name}}</div></td>
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
  </WindowBase>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import WindowBase from './WindowBase'

export default {
  name: 'editMapMask',
  components: {
    WindowBase: WindowBase
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
      this.changeDisplayValue({ main: 'editMapMaskWindow', sub: 'index', value: -1 })
      this.windowClose('editMapMaskWindow')
    },
    commitEdit: function () {
      const mapMaskObj = {
        index: this.value.index,
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
      let mapMaskObj = this.$store.state.map.mapMasks[this.value.index]
      this.name = mapMaskObj.name
      this.width = mapMaskObj.gridW
      this.height = mapMaskObj.gridH
      let rgba = mapMaskObj.color
      let r = parseInt(rgba.replace(/(rgba\()|\)/g, '').split(',')[0].trim())
      let g = parseInt(rgba.replace(/(rgba\()|\)/g, '').split(',')[1].trim())
      let b = parseInt(rgba.replace(/(rgba\()|\)/g, '').split(',')[2].trim())
      let a = parseFloat(rgba.replace(/(rgba\()|\)/g, '').split(',')[3].trim())
      let rt = ('00' + r.toString(16)).slice(-2)
      let gt = ('00' + g.toString(16)).slice(-2)
      let bt = ('00' + b.toString(16)).slice(-2)
      this.color = `#${rt}${gt}${bt}`
      this.transparency = 100 - Math.floor(a * 100)
      console.log(`name:${this.name}, width:${this.width}, height:${this.height}, color:${this.color}, transparency:${this.transparency}`)
    }
  },
  computed: {
    ...mapGetters([
      'doResetPosition'
    ]),
    value: function () {
      const propValue = this.$store.state.display['editMapMaskWindow']
      return propValue
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
    r: function () {
      let result
      if (this.color.startsWith('rgb(')) {
        result = this.color.replace(/(rgba\()|\)/g, '').split(',')[0].trim()
      } else {
        result = parseInt(this.color.substr(1, 2), 16)
      }
      return result
    },
    g: function () {
      let result
      if (this.color.startsWith('rgb(')) {
        result = this.color.replace(/(rgba\()|\)/g, '').split(',')[1].trim()
      } else {
        result = parseInt(this.color.substr(3, 2), 16)
      }
      return result
    },
    b: function () {
      let result
      if (this.color.startsWith('rgb(')) {
        result = this.color.replace(/(rgba\()|\)/g, '').split(',')[2].trim()
      } else {
        result = parseInt(this.color.substr(5, 2), 16)
      }
      return result
    },
    a: function () {
      return (100 - this.transparency) / 100
    },
    rgba: function () {
      return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + this.a + ')'
    },
    fontColor: function () {
      return 'rgb(' + (255 - this.r) + ', ' + (255 - this.g) + ', ' + (255 - this.b) + ')'
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
