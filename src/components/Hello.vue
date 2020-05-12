<template>
  <div class="box" @click="clickHandler">
    {{ content }}
    <slot name="other"></slot>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'hello',
  props: {
    content: {
      type: String,
      default: 'Hello'
    }
  },
  methods: {
    clickHandler(e) {
      this.$emit('click1', e)
    }
  }
}
</script>
<style scoped>
.box {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 2;
  background-color: #fff;
}
</style>
