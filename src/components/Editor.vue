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
