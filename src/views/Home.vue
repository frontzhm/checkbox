<template lang="pug">
div
  h2 boolean
  div
    div {{checked}}
    checkbox-boolean(v-model='checked' :item='item' @change='change1')
  h2 array
  div
    div {{selectedCodes}}
    checkbox-array(v-for='(item,index) in items' :key='index' v-model='selectedCodes' :item='item' :value='item.code' @change='changeItem' )
  h2 通用--array
  div
    div {{selectedCodes}}
    checkbox-enhanced(v-for='(item,index) in items' :key='index' v-model='selectedCodes' :item='item' :value='item.code' @change='changeItem')
  h2 通用--boolean
  div
    div {{checked}}
    checkbox-enhanced(v-model='checked'  :item='item' @change='change')
</template>

<script>
// @ is an alias to /src
import CheckboxBoolean from "@/components/CheckboxBoolean.vue";
import CheckboxArray from "@/components/CheckboxArray.vue";
import CheckboxEnhanced from "@/components/CheckboxEnhanced.vue";

export default {
  name: "Home",
  components: {
    CheckboxBoolean,
    CheckboxArray,
    CheckboxEnhanced
  },
  data() {
    return {
      item: { code: 6, name: "组" },
      items: [
        { code: 1, name: "huahua" },
        { code: 2, name: "huahua2" }
      ],
      selectedCodes: [],
      checked: true
    };
  },
  methods: {
    changeItem(checked, $event) {
      console.log(1234, checked, $event.target);
    },
    change($event) {
      console.log(123, $event);
    },
    change1($event) {
      console.log(123, $event);
    }
  }
};
</script>
