<template lang="pug">
div
  h2 boolean
  div {{checked}}
  checkbox-boolean(v-model='checked' :item='item')
  div {{selectedCodes}}
    checkbox-array(v-model='selectedCodes' :item='item' :value='item.code' @change='changeItem' key='1')
    checkbox-array(v-model='selectedCodes' :item='item1' :value='item1.code' @change='changeItem' key='2')

</template>

<script>
// @ is an alias to /src
import CheckboxItem2 from "@/components/CheckboxItem2.vue";
import CheckboxBoolean from "@/components/CheckboxBoolean.vue";
import CheckboxArray from "@/components/CheckboxArray.vue";
import CheckboxItem from "@/components/CheckboxItem.vue";
import CheckboxList from "@/components/CheckboxList.vue";

export default {
  name: "Home",
  components: {
    CheckboxItem,
    CheckboxItem2,
    CheckboxList,
    CheckboxBoolean,
    CheckboxArray
  },
  data() {
    return {
      item: {
        code: 1,
        name: "huahua"
      },
      item1: {
        code: 2,
        name: "huahua2"
      },
      items: [
        { code: 1, name: "huahua" },
        { code: 2, name: "huahua2" }
      ],
      selectedCodes: [],
      checked: true,
      checked1: false,
      arr: []
    };
  },
  methods: {
    changeItem(checked, item, $event) {
      console.log(1234, checked, $event.target, item);
      // let { value } = $event.target;
      // console.log(checked, value);
      // if (checked) {
      //   this.arr.push(value);
      // } else {
      //   let index = this.arr.indexOf(value);
      //   index !== -1 && this.arr.splice(index, 1);
      // }
    },
    change($event) {
      console.log(123, $event);
      // let checkbox = $event.target;
      // console.log(checkbox);
      // if (checkbox.checked) {
      //   this.arr.push(checkbox.value);
      // } else {
      //   let index = this.arr.indexOf(checkbox.value);
      //   index !== -1 && this.arr.splice(index, 1);
      // }
    },
    hi(valueCopy, item, event) {
      console.log(valueCopy, item, event);
    }
  }
};
</script>
