<template lang="pug">
div
  h2 boolean
  div
    div {{checked}}
    checkbox-enhanced(v-model='checked' @change='change') 同意协议
  h2 array
  div
    div {{selectedCodes}}
    checkbox-enhanced(v-for='(item,index) in items' :key='index' v-model='selectedCodes' :item='item' :value='item.code' @change='changeItem')
  h3 group
    section(v-for='(group,index) in groups' :key='index')
      br
      div {{group.name}}
      checkbox-enhanced(v-for='(item,idx) in group.children' :key='idx' v-model='selectedCodes'  :item='item' :value='item.code'  @change='changeItem')
      
</template>

<script>
// @ is an alias to /src
import CheckboxEnhanced from "@/components/CheckboxEnhanced.vue";

export default {
  name: "Home",
  components: {
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
      checked: true,
      groups: [
        {
          name: "a组的成员",
          children: [{ code: 3, name: "huahua3" }]
        },
        {
          name: "b组的成员",
          children: [{ code: 4, name: "huahua4" }]
        }
      ]
    };
  },
  watch: {
    groups(newVal) {
      console.log(newVal);
    }
  },
  methods: {
    changeItem() {
      console.log(arguments);
    },
    change(group) {
      console.log(group);
    }
  }
};
</script>
