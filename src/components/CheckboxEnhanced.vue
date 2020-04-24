<template lang="pug">
div
  component(v-if="!isArray" is='CheckboxBoolean' v-bind='$attrs' v-on='$listeners')
    //- 自定义后面的内容
    slot
  component(v-else is='CheckboxArray' v-bind='$attrs' v-on='$listeners')
    slot
</template>
<script>
import CheckboxBoolean from "@/components/CheckboxBoolean";
import CheckboxArray from "@/components/CheckboxArray";

export default {
  name: "checkbox-enhanced",
  components: {
    CheckboxArray,
    CheckboxBoolean
  },
  model: {
    prop: "checked",
    event: "change"
  },
  created() {
    this.isArray = Array.isArray(this.$attrs.checked);
  },
  data() {
    return {
      isArray: false
    };
  }
};
</script>
