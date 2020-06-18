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

## 设置初始状态有内容

一般创建和编辑页面总是同一个，那么当编辑的时候，内容区一开始是有数据的，这里稍微改下组件的写法，增加设置内容，顺便稍微改良写原有的写法。

```vue
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

```

## 增加本地图片上传

默认上传图片只有网络链接，如果需要上传本地图片，需要增加额外参数。 这里编辑器实现了拖拽图片功能，超方便！！！  
[上传图片的详细文档参照这里](https://www.kancloud.cn/wangfupeng/wangeditor3/335782)。  
项目里，我用的是自定义上传：

```js
editor.customConfig.customUploadImg = async (files, insert) => {
  // files 是 input 中选中的文件列表，遍历上传
  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    // 上传服务器拿到图片链接
    let imgUrl = (await this._uploadSingleFile(file))
    // 获取图片 url 后，插入到编辑器
    insert(imgUrl)
  }
}
```

```vue
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
      // 设置上传本地图片
      this._setUploadLocalImg();
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
    },
    _setUploadLocalImg() {
      this.editor.customConfig.customUploadImg = async (files, insert) => {
        // files 是 input 中选中的文件列表，遍历上传
        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          // 上传服务器拿到图片链接,这里_uploadSingleFile就是上传图片接口，
          let imgUrl = await this._uploadSingleFile(file);
          // 获取图片 url 后，插入到编辑器
          insert(imgUrl);
        }
      };
    },
    // 因项目而异
    async _uploadSingleFile(file) {
      let options = {
        url: "/xx/yy",
        method: "POST",
        data: { sign: "xxx", file },
        // 转化成formData形式
        transformRequest: [
          function(data) {
            let formData = new FormData();
            for (const key in data) {
              const value = data[key];
              formData.append(key, value);
            }
            return formData;
          }
        ]
      };
      let url = (await "axios"(options)).data.url;
      return url;
    }
  }
};
</script>

```

## 增加上传非图片的附件

其实稍微有点复杂。
这里说下，编辑区和编辑栏可以分开，并且可以写各自的样式，这里很灵活。  
拆开之后，可以这样`this.editor = new E(this.$refs.editorBar, this.$refs.editorText)`
为啥说这个，因为我想把附件的小图标也放在菜单栏里，这里就需要用到一点定位了。
而且因为上传附件，所以需要一个展示附件的区域，就称为附件区好了
这边处理逻辑是，点击附件小图标之后，触发点击`input(type='file')`，拿到files，去上传，然后显示在文件区
![效果图](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/upload.png)
这里注意！！！

1. 编辑区一般设置最大高度，超过这个高度的时候就内部滚动条，所以用容器包裹编辑区，且内外容器设置高度
2. 文件size会动态变化单位
3. 不同后缀显示不同文件类型
4. 文件上传完之后，可以下载或者预览


