<template lang="pug">
div
  checkbox-item2(v-model='checked' :item='item')
  div
    //- checkbox-list(:items='items' v-model='selectedCodes' @input='hi')
  //- div {{arr}}
  div {{selectedCodes}}
    //- checkbox-item(v-model='checked' :item='item' :value='item.code' @change='changeItem')
    //- checkbox-item(v-model='checked1' :item='item1' :value='item.code' @change='changeItem')
    checkbox-item2(v-model='selectedCodes' :item='item' :value='item.code' @change='changeItem')
    checkbox-item2(v-model='selectedCodes' :item='item1' :value='item1.code' @change='changeItem')
    //- label 111
    //-   input(@change='change($event)' type='checkbox' value='1')
    //- label 222
    //-   input(@change='change($event)' type='checkbox' value='2')

</template>

<script>
// @ is an alias to /src
import CheckboxItem2 from "@/components/CheckboxItem2.vue";
import CheckboxItem from "@/components/CheckboxItem.vue";
import CheckboxList from "@/components/CheckboxList.vue";

export default {
  name: "Home",
  components: {
    CheckboxItem,
    CheckboxItem2,
    CheckboxList
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
      console.log($event.target, item);
      let { value } = $event.target;
      console.log(checked, value);
      if (checked) {
        this.arr.push(value);
      } else {
        let index = this.arr.indexOf(value);
        index !== -1 && this.arr.splice(index, 1);
      }
    },
    change($event) {
      console.log($event);
      let checkbox = $event.target;
      console.log(checkbox);
      if (checkbox.checked) {
        this.arr.push(checkbox.value);
      } else {
        let index = this.arr.indexOf(checkbox.value);
        index !== -1 && this.arr.splice(index, 1);
      }
    },
    hi(valueCopy, item, event) {
      console.log(valueCopy, item, event);
    }
  }
};
</script>
