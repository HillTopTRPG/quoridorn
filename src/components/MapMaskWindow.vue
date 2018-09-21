<template>
  <WindowBase title="マップマスク" displayPropery="mapMaskWindow" align="right-bottom" fixSize="285, 165">
    <table>
      <tbody>
        <tr>
          <th>文字：</th>
          <td><input type="text" v-model="name"></td>
          <td rowspan="6" class="mapMaskGrid"><div class="mapMask" draggable="true" :style="mapMaskStyle" @dragstart="dragStart"></div></td>
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
          <td colspan="2" class="multi"><label><input type="checkbox" v-model="isMulti">複数作成</label></td>
        </tr>
      </tbody>
    </table>
  </WindowBase>
</template>

<script>
import { mapMutations } from 'vuex'
import WindowBase from './WindowBase'

export default {
  name: 'mapMask',
  mixins: [WindowBase],
  components: {
    WindowBase: WindowBase
  },
  data () {
    return {
      transparency: 0,
      width: 1,
      height: 1,
      name: '',
      isMulti: true,
      color: '#000000'
    }
  },
  methods: {
    ...mapMutations([
      'chatTabSelect',
      'addChatLog'
    ]),
    addTab: function () {
      alert('タブの追加は未実装')
    },
    dragStart: function (event) {
      event.dataTransfer.setData('kind', 'mapMask')
      event.dataTransfer.setData('name', this.name)
      event.dataTransfer.setData('color', this.rgba)
      event.dataTransfer.setData('fontColor', this.fontColor)
      event.dataTransfer.setData('width', this.width)
      event.dataTransfer.setData('height', this.height)
    }
  },
  computed: {
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
        'background-color': this.rgba
      }
      return result
    },
    r: function () {
      let result
      if (this.color.startsWith('rgb(')) {
        result = this.color.replace('rgb(', '').replace(')', '').split(',')[0].trim()
      } else {
        result = parseInt(this.color.substr(1, 2), 16)
      }
      return result
    },
    g: function () {
      let result
      if (this.color.startsWith('rgb(')) {
        result = this.color.replace('rgb(', '').replace(')', '').split(',')[1].trim()
      } else {
        result = parseInt(this.color.substr(3, 2), 16)
      }
      return result
    },
    b: function () {
      let result
      if (this.color.startsWith('rgb(')) {
        result = this.color.replace('rgb(', '').replace(')', '').split(',')[2].trim()
      } else {
        console.log(this.color.substr(5, 2))
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
