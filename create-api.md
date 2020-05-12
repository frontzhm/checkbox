---
title: 怎么使用create-api，初级版
tags: js
categories: js
---

create-api是黄轶老师写的，[github地址](https://github.com/cube-ui/vue-create-api)。  
插件的意思是说，让某个组件以api的方式，能动态插入到body的下面，很像弹出层。  
我个人目前觉得，弹出全局页面非常适合。  
这边是使用的初级版。  
以下案例的[源码地址](https://github.com/frontzhm/checkbox)  

1. 安装：  

```shell
npm install vue-create-api
```

1. 写个普通的Hello组件：

```vue
<template>
  <div class="box" @click="clickHandler">
    {{ content }}
    <slot name="other"></slot>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'hello',
  props: {
    content: {
      type: String,
      default: 'Hello'
    }
  },
  methods: {
    clickHandler(e) {
      this.$emit('click1', e)
    }
  }
}
</script>
<style scoped>
.box {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 2;
  background-color: #fff;
}
</style>

```

1. 某页面用的时候

```vue
<!--xx.vue-->
<template lang="pug">
div
  div 111

</template>

<script>
import Vue from "vue";
import Hello from "@/components/Hello.vue";
import CreateAPI from "vue-create-api";
Vue.use(CreateAPI);
// 这行就是创建 this.$createHello，常用的话直接在main那边创建
Vue.createAPI(Hello, true);
export default {
  components: { Hello },
  mounted() {
    let renderFn = createElement => {
      return [
        createElement(
          "h1",
          {
            slot: "other"
          },
          "other content"
        )
      ];
    };
    // 这里就是使用，使用之后在body那边就插入了Hello组件，和#app同级
    this.$createHello(
      {
        //   Hello组件里的props在这里传递
        $props: {
          content: "I am from a vue component"
        },
        //   Hello组件里的向外派发的事件在这里
        $events: {
          click1() {
            console.log("1");
          }
        }
      },
    //   Hello组件里的slot需要在这里，没有slot就不需要这个
      renderFn
    );
  }
};
</script>

```

这里附上[renderFn的写法](https://cn.vuejs.org/v2/guide/render-function.html)
