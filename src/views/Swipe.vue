<template>
  <!-- Slider main container -->
  <div ref="swiperContainer" class="swiper-container">
    <!-- Additional required wrapper -->
    <div class="swiper-wrapper">
      <!-- Slides -->
      <div
        class="swiper-slide"
        v-for="(pageImg, index) in pagesImg"
        :key="index"
      >
        <div class="img-list">
          <div
            class="img-item"
            v-for="(img, innerindex) in pageImg"
            :key="innerindex"
          >
            <a href="javascript:;">
              <img :src="img" alt="" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
</template>
<script>
// import Swiper JS
import Swiper, { Pagination } from "swiper";
// import Swiper styles
import "swiper/swiper-bundle.css";
Swiper.use([Pagination]);
export default {
  name: "swipe",
  data() {
    return {
      pagesImg: []
    };
  },
  mounted() {
    this.initSwipe();
    this.handleImg();
  },
  methods: {
    // 初始化swipe
    initSwipe() {
      var mySwiper = new Swiper(this.$refs.swiperContainer, {
        loop: true,
        // 500ms之后播放下一张
        autoplay: {
          delay: 500
        },
        pagination: {
          el: ".swiper-pagination"
        }
      });
      console.log(mySwiper);
    },
    // 请求图片并每25个就是新的分组
    handleImg() {
      let imgUrl = "https://uniev.com/static/logo.c3f02181.png";
      let imgs = Array(75).fill(imgUrl);
      // 拿到图片地址之后开始分组，每25个一组
      let pagesImg = [];
      let pageSize = 25;
      for (let i = 0; i < imgs.length; i += pageSize) {
        pagesImg.push(imgs.slice(i, i + pageSize));
      }
      // 二维数组：[[25个图片地址],[],[]]
      this.pagesImg = pagesImg;
      console.log(pagesImg);
    }
  }
};
</script>
<style scoped>
/* prettier-ignore */
.swiper-container {
  width: 1180PX;
  height: 360PX;
}
/* prettier-ignore */
.img-list {
  display: flex;
  list-style: none;
  flex-wrap: wrap;
}
/* prettier-ignore */
.img-item {
  width: 235PX;
  height: 71PX;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* prettier-ignore */
.img-item img {
  height: 60PX;
  display: block;
}
</style>
