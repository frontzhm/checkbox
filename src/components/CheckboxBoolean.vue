<!-- checkboxBoolean.vue -->
<template lang="pug">
div.checkbox-box
  div.checkbox-content-box(@click='$refs.input.click()')
    //- 自定义选中图标
    div.icon-box
      img.icon(alt='' :src='checked?"https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/icon_selected.png":"https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/icon_not_selected.png"')
    div.content
      //- slot可以自定义后面的内容
      slot
        //- 这里可以根据自己的项目灵活改变
        div.avatar-box
          img.img-avatar(alt='' :src='item.avatar || " https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/default_avatar.png"')
        .name {{item.name}}
  //- 原始input隐藏，这里的value看情况使用，可以不传，change是将选择事件抛出去，让父组件知晓
  input(ref='input' hidden type='checkbox' :checked='checked' :value='value' @change='changeInput($event)')

</template>
<script>
/**
 * 这个组件是利用了checkbox
 组件逻辑
 - 需要传入checked，value属性，item以项目传
 - 将原始的input隐藏，通过点击内容区触发input的click事件，从而达到控制其change事件
 - change事件会改变元素的checked属性，再向父组件派发事件，父组件根据传递的值更新自己的checked，而更新后的值又会再影响这个组件的checked，形成闭环。
 - 这里为了方便父组件使用v-model，将model设置为change事件和checked
 官网文档 https://cn.vuejs.org/v2/guide/components-custom-events.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E7%9A%84-v-model

 使用方法
  checkbox-boolean(v-model='checked' :item='item')

 加上value和change事件也是没问题的
    checkbox-boolean(v-model='checked' :item='item' :value='item.code' @change='handleChange')
 */
export default {
  name: "checkbox-boolean",
  model: {
    prop: "checked",
    event: "change"
  },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    },
    checked: {
      type: Boolean,
      required: true,
      default() {
        return false;
      }
    },
    value: {
      // type: [Boolean, String, Number],
      default() {
        return this.item;
      }
    }
  },

  methods: {
    changeInput($event) {
      // 第一项就将是否选中扔出去，这里注意，扔出去之后，父组件用v-model的话，父组件的值会自动变化
      // v-model是个语法糖，本质上相当于父组件 checkbox-item(:checked='checked' @change='checked=$event')
      this.$emit("change", $event.target.checked, $event);
    }
  }
};
</script>
<style scoped>
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
