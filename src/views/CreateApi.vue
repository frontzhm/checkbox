<template lang="pug">
div
  div 111

</template>

<script>
import Vue from "vue";
import Hello from "@/components/Hello.vue";
import CreateAPI from "vue-create-api";
Vue.use(CreateAPI);

// create this.$createHello API
Vue.createAPI(Hello, true);
// Hello.$create(config, renderFn);
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
    this.$createHello(
      {
        $props: {
          content: "I am from a vue component"
        },
        $events: {
          click1() {
            console.log("1");
          }
        }
      },
      renderFn
    );
  }
};
</script>
