<template lang="pug">
div
  div(ref="editor")
</template>

<script>
import E from "wangeditor";
export default {
  name: "editor",
  data() {
    return {
      // 富文本内容
      editorContent: ""
    };
  },
  mounted() {
    // 初始化容器
    var editor = new E(this.$refs.editor);
    // 预先配置内容
    // 当内容变化的时候，将内容扔出去
    editor.customConfig.onchange = html => {
      this.editorContent = html;
      this.$emit("update:content", html);
    };
    // 创建编辑器
    editor.create();
  }
};
</script>
