<template lang="pug">
div
    //- 编辑栏
    div.editor-bar(ref='editorBar')
      div.file-icon
        //- 点img触发实际的input
        img(@click='$refs.inputFile.click()' src='https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/file_icon.png' alt='')
        //- 实际的input,click事件是解决同一个文件上传两次无效的问题，因为文件可以被删除，所以这里加上这样的事件
        input(ref='inputFile' hidden  type='file' multiple accept='.docx,.pptx,.xlsx,.pdf' @click='$event.target.value = null'  @change='uploadFile')
    //- 编辑区域
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
      type: String,
      default() {
        return "";
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
  mounted() {
    // 将content赋值，editorContent变化的时候，不改变父组件的content
    this.editorContent = this.content;
    // 拷贝
    this.editorFiles = [...this.files];
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
      this.$emit("changeFiles", this.editorFiles);
      // 上传
      // let res = await this._uploadSingleFile(file)
      this.curFile.isUploaded = true;
      // this.curFile.url = this.$utils.joinUrl(res.fullpath, { fileName: file.name, fileSize: file.size })
      this.$emit("changeFiles", this.editorFiles);
      console.log(2222, this.editorFiles);
    },

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
.editor-text {
  border: 1px solid #eee;
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
