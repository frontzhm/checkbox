<template lang="pug">
div
  component(v-if="isBoolean" is='CheckboxBoolean' v-bind='$attrs' v-on='$listeners')
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
    this.isBoolean = typeof this.$attrs.checked === "boolean";
  },
  data() {
    return {
      isBoolean: false
    };
  }
};
</script>
