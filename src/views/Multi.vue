<template lang="pug">
div
  h2 array
  div
    div {{selectedCodes}}
    ul
      li(v-for='(item,index) in items' :key='index')
        multi-select(v-model='selectedCodes'  :value='item.code' @change='changeItem')
          template(#default="{ selected }")
            div.checkbox-box
              div.checkbox-content-box
                div.icon-box
                  img.icon(alt='' :src='selected?"https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/icon_selected.png":"https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/icon_not_selected.png"')
                div.content
                    div.avatar-box
                      img.img-avatar(alt='' :src='item.avatar || " https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/default_avatar.png"')
                    .name {{item.name}}
            //- div.option-content(:class='{ selected }') {{item.name}}

</template>

<script>
// @ is an alias to /src
import CheckboxEnhanced from "@/components/CheckboxEnhanced.vue";
import MultiSelect from "@/components/MultiSelect.vue";

export default {
  name: "Home",
  components: {
    CheckboxEnhanced,
    MultiSelect
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
<style scoped>
/* .content {
  padding: 14px 38px;
  border: 2px solid #ccc;
  color: #333;
  font-size: 28px;
  line-height: 40px;
  background-color: #fff;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 10px;
}
.selected {
  background-color: rgba(0, 186, 151, 0.06);
  border-color: rgba(0, 186, 151, 1);
} */
.checkbox-box {
  display: flex;
  margin-left: 30px;
  margin-right: 30px;
}

.checkbox-content-box {
  display: flex;
  height: 80px;
  line-height: 80px;
  margin-top: 12px;
  margin-bottom: 12px;
  width: 100%;
}

.icon {
  width: 34px;
  height: 34px;
  display: inline-block;
  vertical-align: middle;
}

.content {
  display: flex;
  margin-left: 20px;
}

.img-avatar {
  display: block;
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.name {
  margin-left: 15px;
  color: #333;
  font-size: 30px;
}
</style>
