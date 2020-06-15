<template>
  <div class="box">
    {{ content }}
    <div @click="hidePage">取消</div>
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
  data(){
      return {

      }
  },
  methods: {
    hidePage(e) {
      this.$emit('hidePage', e)
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
  /* 这里fixed布局全屏覆盖，之后设置背景色，这样就完全看不到下面图层的样式 */
  background-color: #69f;
}
</style>
