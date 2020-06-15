<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div @click="clickShowHello">点击显示hello</div>
  </div>
</template>

<script>
import Vue from "vue";
import Hello from "@/components/Hello.vue";
import CreateAPI from "vue-create-api";
Vue.use(CreateAPI);

// create this.$createHello API
Vue.createAPI(Hello, true);
export default {
  created() {
    // 这边因为create只创建一次实例，之后需要自己remove然后再出现
    this.instanceHello = null;
  },

  methods: {
    clickShowHello() {
      this.showHello();
    },
    hideHello() {
      // 移除
      this.instanceHello && this.instanceHello.remove();
    },
    showHello() {
      let renderFn = createElement => {
        return [
          createElement(
            "p",
            {
              slot: "other"
            },
            "other content"
          )
        ];
      };
      this.hideHello();
      this.instanceHello = this.$createHello(
        {
          $props: {
            content: "I am from a vue component"
          },
          $events: {
            // 弹出层想消失的话 调用这里的hide
            click1: this.hideHello
          }
        },
        renderFn
      );
    }
  }
};
</script>
