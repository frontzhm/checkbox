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
![效果图](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/upload_file.png)

这里注意！！！

1. 编辑区一般设置最大高度，超过这个高度的时候就内部滚动条，所以用容器包裹编辑区，且内外容器设置高度
2. 文件size会动态变化单位
3. 不同后缀显示不同文件类型
4. 文件上传完之后，可以下载或者预览，当然父组件也可以传进files

```vue
<!-- Editor.vue -->
<template lang="pug">
div
    //- 编辑栏
    div.editor-bar(ref='editorBar')
      div.file-icon
        //- 点img触发实际的input
        img(@click='$refs.inputFile.click()' src='https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/file_icon.png' alt='')
        //- 实际的input,click事件是解决同一个文件上传两次无效的问题，因为文件可以被删除，所以这里加上这样的事件
        input(ref='inputFile' hidden  type='file' multiple accept='.docx,.pptx,.xlsx,.pdf' @click='$event.target.value = null'  @change='uploadFile')
    //- 编辑区域 编辑区一般设置最大高度，超过这个高度的时候就内部滚动条，所以用容器包裹编辑区，且内外容器设置高度
    div.editor-text-wrap
      div.editor-text(ref='editorText')
    //- 附件区域
    ul.file-list(v-if='editorFiles.length')
      li.file-item(v-for='(item,index) in editorFiles' :key='index' is='file-item' :file='item'  @delFile='delFile(index)')

</template>

<script>
import E from "wangeditor";
import FileItem from "./FileItem";
export default {
  name: "editor",
  components: { FileItem },
  props: {
    // 增加content，有内容的时候直接传进来
    content: {
      type: String,
      default() {
        return "";
      }
    },
    // files，在有附件的时候可以传过来
    files: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      // 富文本内容
      editorContent: "",
      // 附件
      editorFiles: []
    };
  },
  // 这里直接监控同步数据，当然也可以用store
  watch: {
    editorContent(newValue) {
      this.$emit("update:content", newValue);
    },
    editorFiles(newValue) {
      this.$emit("update:files", newValue);
    }
  },
  mounted() {
    // 将content赋值，editorContent变化的时候，不改变父组件的content
    this.editorContent = this.content;
    // 拷贝，注意设置上传状态 name: file.name, size: file.size, isUploaded: false, url: ""
    let files = [...this.files];
    files.length && files.forEach(item => (item.isUploaded = true));
    this.editorFiles = [...files];
    // 创建编辑器
    this.createEditor();
    // 设置内容
    this._setInitContent(this.editorContent);
  },
  methods: {
    async uploadFile(e) {
      let files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        await this._handleSingleFile(files[i]);
      }
    },
    async _handleSingleFile(file) {
      // 存一份 name是下载的时候显示的名字 size一样 isUploaded是不是上传完
      this.curFile = {
        name: file.name,
        size: file.size,
        isUploaded: false,
        url: ""
      };
      this.editorFiles.push(this.curFile);
      // 上传,上传成功之后设置状态和下载地址
      // let res = await this._uploadSingleFile(file)
      this.curFile.isUploaded = true;
      this.curFile.url = "服务器返回的地址";
    },
    // 删除文件的时候
    delFile(index) {
      this.editorFiles.splice(index, 1);
    },
    // 配置参数 创建编辑器
    createEditor() {
      // 初始化容器
      let editor = new E(this.$refs.editorBar, this.$refs.editorText);
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
      // 设置在create之前，当内容变化的时候，同步editorContent
      this.editor.customConfig.onchange = html => {
        this.editorContent = html;
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
        // 上传文件需要参数转化成formData形式
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
<style scoped>
/* 编辑区 */
.editor-bar {
  position: relative;
  border: 1px solid #eee;
}
/* 附件图标 */
.file-icon {
  position: absolute;
  top: 12px;
  width: 36px;
  height: 36px;
  z-index: 3;
  cursor: pointer;
  left: 1480px;
}
/* 附件图标图片 */
.file-icon img {
  width: 100%;
  height: 100%;
  display: block;
}
/* 文本区 */
.editor-text-wrap {
  height: 600px;
  margin-top: -1px;
}
.editor-text {
  border: 1px solid #eee;
  height: 100%;
}
/* 文件区 */
.file-list {
  padding: 20px 0 0 20px;
  display: flex;
  border: 1px solid #eee;
  flex-wrap: wrap;
}
.file-item {
  margin: 0 20px 20px 0;
}
</style>

```

```vue
<!-- FileItem.vue -->
<template lang="pug">
div.file-item(@click='clickFile')
  //- 关闭按钮
  img.icon-delete(alt='' src='https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/icon_close.png' @click.stop='clickDelete')
  div.file-item-left
    img.icon-file(alt='' :src="'https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/icon_'+suffix+'.png'")
  div.file-item-right
    h3.file-name {{nameShow}}
    div.file-other
      span.file-size {{sizeShow}}
      span.file-upload-status {{file.isUploaded?'上传完成':'正在上传...'}}
</template>
<script>

export default {
  name: "file-item",
  props: {
    file: {
      default() {
        return {};
      }
    }
  },
  computed: {
    suffix() {
      // this.name如 1.2.pptx
      // [1,2,pptx]
      let arr = this.file.name.split(".");
      // pptx
      let suffix = arr.slice(-1)[0];
      return suffix;
    },
    // name超过10的话就变成xx。。。xx
    nameShow() {
      // 1.2
      let name = this.file.name.slice(
        0,
        this.file.name.indexOf(this.suffix) - 1
      );
      console.log(name);
      let pre =
        name.length < 10 ? name : `${name.slice(0, 8)}...${name.slice(-2)}`;
      return `${pre}.${this.suffix}`;
    },
    sizeShow() {
      let nBytes = this.file.size;
      let sOutput = nBytes + " bytes";
      // optional code for multiples approximation
      const aMultiples = ["k", "m", "g", "t", "p", "e", "z", "y"];
      for (
        let nMultiple = 0, nApprox = nBytes / 1024;
        nApprox > 1;
        nApprox /= 1024, nMultiple++
      ) {
        sOutput = nApprox.toFixed(0) + aMultiples[nMultiple];
      }
      return sOutput;
    }
  },
  data() {
    return {
      x: "close"
    };
  },
  methods: {
    clickDelete() {
      this.$emit("delFile");
    },
    clickFile() {
      window.open(this.file.url);
    }
  }
};
</script>
<style scoped>
h1,
h2,
h3 {
  padding: 0;
  margin: 0;
}
/* prettier-ignore */
.file-item {
  background-color: #f0f1f1;
  padding: 13PX 10PX;
  display: flex;
  position: relative;
  width: 260PX;
}
/* prettier-ignore */
.icon-file {
  width: 26PX;
  height: 34PX;
}
/* prettier-ignore */
.file-item-right {
  margin-left: 10PX;
}
/* prettier-ignore */
.file-name {
  font-size: 14PX;
  color: #222;
}
/* prettier-ignore */
.file-other {
  margin-top: 1PX;
  color: #999;
  font-size: 12PX;
}
/* prettier-ignore */
.file-upload-status {
  margin-left: 5PX;
}
/* prettier-ignore */
.icon-delete {
  position: absolute;
  width: 24PX;
  height: 24PX;
  right: 0;
  top: 0;
  z-index: 2;
}
/* PXtorem-disable-next-line */
</style>

```

## 辅助资料

* [前端下载文件的5种方法的对比(附加获取文件名)](https://juejin.im/post/5e50fa23518825494b3cccd7)
* [从选择上传文件缩略图预览到提交上传全流程总结方案](https://juejin.im/post/5e3f793551882549554857c7)
* accept写法有两种，一种筛选后缀，一种筛选mime类型，多种条件逗号分隔。如`accept='image/*,.docx'`

  * .docx  application/vnd.openxmlformats-officedocument.wordprocessingml.document
  * .pptx  application/vnd.openxmlformats-officedocument.presentationml.presentation
  * .xlsx  application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
  * .pdf   application/pdf
  * .gif类  image/*

