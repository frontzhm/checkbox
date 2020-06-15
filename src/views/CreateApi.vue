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
// 这行就是创建 this.$createHello，常用的话直接在main那边创建，也可Hello.$create(config, renderFn);
Vue.createAPI(Hello, true);
export default {
  created() {
    // 这边因为create只创建一次实例，一旦移除需要将实例移除
    this.instanceHello = null;
  },

  methods: {
    clickShowHello() {
      // 先定义移除hello组件的方法，在点击取消的时候调用
      const removeHello = () => {
        this.instanceHello && this.instanceHello.remove();
      };
      // 这里就是使用，使用之后在body那边就插入了Hello组件，和#app同级
      this.instanceHello = this.$createHello(
        {
          //   Hello组件里的props在这里传递
          $props: {
            content: "I am from a vue component"
          },
          //   Hello组件里的向外派发的事件在这里
          $events: {
            hidePage: removeHello
          }
        },
        // Hello组件里的slot需要在这里，没有slot就不需要这个
        createElement => {
          return [
            createElement(
              "p",
              {
                slot: "other"
              },
              "other content"
            )
          ];
        }
      );
    }
  }
};
</script>
