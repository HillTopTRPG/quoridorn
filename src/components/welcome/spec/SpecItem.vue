<template>
  <fieldset :class="classStr">
    <legend>{{labelStr}}</legend>
    <ol>
      <slot></slot>
    </ol>
  </fieldset>
</template>

<script>
export default {
  props: {
    'classStr': { type: String, required: true },
    'labelStr': { type: String, required: true }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="./spec.css">
</style>
