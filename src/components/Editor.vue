<!-- Editor.vue -->
<template lang="pug">
div
  div(ref="editor")
</template>

<script>
import E from "wangeditor";
export default {
  name: "editor",
  props: {
    // 增加content，有内容的时候直接传进来
    content: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      // 富文本内容
      editorContent: ""
    };
  },
  mounted() {
    // 将content赋值，editorContent变化的时候，不改变父组件的content
    this.editorContent = this.content;
    // 创建编辑器
    this.createEditor();
    // 设置内容
    this._setInitContent(this.editorContent);
  },
  methods: {
    // 配置参数 创建编辑器
    createEditor() {
      // 初始化容器
      let editor = new E(this.$refs.editor);
      // 方便将配置拆开写
      this.editor = editor;
      // 将富文本的html的内容变化时赋值同步到editorContent，这里的change事件将值赋值给editorContent
      this._syncContent();
      // 创建编辑器
      editor.create();
    },
    _syncContent() {
      // 设置在create之前，当内容变化的时候，将内容扔出去，同步父组件的content
      this.editor.customConfig.onchange = html => {
        this.editorContent = html;
        this.$emit("update:content", html);
      };
    },
    _setInitContent(content) {
      this.editor.txt.html(content);
    }
  }
};
</script>
