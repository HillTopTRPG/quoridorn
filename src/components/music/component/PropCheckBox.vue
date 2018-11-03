<template>
  <input type="checkbox"
    @change="event => changeProperty(event.target.checked)"
    :checked="storePropertyValue"
    @dblclick.stop>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'propCheckBox',
  props: {
    baseProperty: { type: String, required: true },
    objKey: { type: String, required: true },
    property: { type: String, required: true }
  },
  methods: {
    ...mapActions([
      'setProperty'
    ]),
    changeProperty (value) {
      const useProperty = this.useProperty
      if (!useProperty) return
      this.setProperty({property: useProperty, value: value, isNotice: true, logOff: true})
    }
  },
  computed: mapState({
    ...mapGetters([
      'getState'
    ]),
    useProperty (state) {
      const targetList = this.getState(this.baseProperty)
      const targetObj = targetList.filter(obj => obj.key === this.objKey)[0]
      if (!targetObj) return
      const index = targetList.indexOf(targetObj)
      return `${this.baseProperty}.${index}.${this.property}`
    },
    storePropertyValue (state) {
      const useProperty = this.useProperty
      if (!useProperty) return false
      return this.getState(useProperty)
    }
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
