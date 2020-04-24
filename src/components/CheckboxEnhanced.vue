<template lang="pug">
div
  component(v-if="!isArray" is='CheckboxBoolean' v-bind='$attrs' v-on='$listeners')
  component(v-else is='CheckboxArray' v-bind='$attrs' v-on='$listeners')
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
