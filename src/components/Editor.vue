<template>
  <div>
    <div ref="editor"></div>
  </div>
</template>

<script>
import E from "wangeditor";
export default {
  name: "editor",
  data() {
    return {
      // this.editorContent就是富文本内容
      editorContent: ""
    };
  },
  mounted() {
    var editor = new E(this.$refs.editor);
    editor.customConfig.onchange = html => {
      this.editorContent = html;
      this.$emit("update:content", html);
    };
    editor.create();
  }
};
</script>
