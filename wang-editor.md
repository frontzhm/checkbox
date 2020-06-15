---
title: vues使用富文本编辑器wangEditor，且增加附件功能
tags: js
categories: js
---

* [官网](www.wangEditor.com)
* [文档](www.kancloud.cn/wangfupeng/wangeditor3/332599)
* [github](github.com/wangfupeng1988/wangEditor)

## 最简单的使用

### 封装组件

```vue
<template lang='pug'>
div
  div(ref="editor")
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

```

### 调用组件

```vue

<template lang="pug">
div
  editor(:content.sync='content')
  div {{content}}
</template>

<script type="text/ecmascript-6">
import Editor from '@/components/Editor'
export default {
  name: 'edit',
  components:{Editor},
  data(){
    return {
      content:''
    }
  }
}
</script>
<style scoped></style>

```