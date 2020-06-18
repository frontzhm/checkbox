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
/**
 * 组件用法
 * import FileItem from './components/FileItem'
 * file-item(:file='file'  @delFile='delFile(index)')
 * 或者
 * li.file-item(is='file-item' :file='file'  @delFile='delFile(index)')
 * mime
  .docx  application/vnd.openxmlformats-officedocument.wordprocessingml.document
  .pptx  application/vnd.openxmlformats-officedocument.presentationml.presentation
  .xlsx  application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
  .pdf   application/pdf
  .gif类  image/*

file属性：
  lastModified: 1587098152140
  lastModifiedDate: Fri Apr 17 2020 12:35:52 GMT+0800 (China Standard Time) {}
  name: "QK0457.png"
  size: 192294
  type: "image/png"
  webkitRelativePath: "",
  url:'a/a?fileName=xx&fileSize=xxx',
  fullPath:'a/a/'

 */
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
      // this.$emit('downloadFile')
      // 两种方式选一个
      // this.$utils.openDownloadDialog(file.url, file.name)
      this.$api.teacherTask.AjaxDownLoadFile({
        fileName: this.file.name,
        fileFullPath: this.file.fullPath
      });
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
