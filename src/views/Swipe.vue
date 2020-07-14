<template>
  <cm-swipe v-if="imgs.length" :imgs="imgs"></cm-swipe>
</template>
<script>
import CmSwipe from "./CmSwipe";

export default {
  name: "xx",
  components: { CmSwipe },
  created() {
    // 请求到所有图片数据 imgs是所有图片链接
    setTimeout(() => {
      let imgUrl = "https://uniev.com/static/logo.c3f02181.png";
      this.imgs = Array(75).fill(imgUrl);
    }, 1000);
  },
  data() {
    return {
      imgs: []
    };
  }
};
</script>
