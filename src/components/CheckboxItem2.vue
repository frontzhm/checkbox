<template lang="pug">
div.checkbox-box
  div.checkbox-content-box(@click='clickContent')
    //- 自定义选中图标
    div.icon-box
      img.icon(alt='' :src='checkedCopy?"https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/icon_selected.png":"https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/icon_not_selected.png"')
    div.content
      //- 这里可以灵活改变
      div.avatar-box
        img.img-avatar(alt='' :src='item.avatar || " https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/default_avatar.png"')
      .name {{item.name}}
  //- 原始input隐藏，这里的value看情况使用，可以不传，change是将选择事件抛出去，让父组件知晓
  input(ref='input' hidden type='checkbox' :checked='checkedCopy' :value='value' @change='changeInput(item,$event)')

</template>
<script>
/**
 * 这个组件是利用了checkbox
 组件逻辑
 - 需要传入checked，value属性，item以项目传
 - 将原始的input隐藏，通过点击内容区触发input的click事件，从而达到控制其change事件
 - change事件会改变元素的checked属性，再向父组件派发事件，父组件根据传递的值更新组件的checked
 - 组件的checked再决定显示选中或者不选中的图标
 - 特别注意，表单元素本身的checked属性变化和组件的checked属性不一样，别弄混淆。希望两者关联，是需要做处理的！
 - 这里为了方便您父组件使用v-model，将model设置为change事件和checked，官网文档https://cn.vuejs.org/v2/guide/components-custom-events.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E7%9A%84-v-model


使用的时候如果只需要checked的话
checkbox-item(:item='item' v-model='item.checked')

使用的时候，当然可以加value和change事件
checkbox-item(:item='item' :checked='item.checked' :value='item.code' @change='setChecked')

methods: {
  setChecked(checked, item, event) {
    console.log(checked, item, event)
  }
}
 */
export default {
  name: "checkbox-item",
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
      required: true,
      default() {
        return false;
      }
    },
    value: {
      type: [Boolean, String, Number],
      default() {
        return "";
      }
    }
  },
  created() {
    console.log(this.checked);
    this.isArray = Array.isArray(this.checked);
    if (this.isArray) {
      this.valueList = [...this.checked];
      // 初始值是由选中数组决定的
      this.checkedCopy = this.valueList.includes(this.value);
    } else {
      this.checkedCopy = this.checked;
      console.log(this.value, this.checkedCopy);
    }
  },

  data() {
    return {
      valueList: [],
      checkedCopy: false
    };
  },

  methods: {
    clickContent() {
      this.$refs.input.click();
    },
    changeInput(item, $event) {
      // 选择的时候,原生表单的this.checked变化，然后其改变valueList
      this.checkedCopy = event.target.checked;
      let index = this.valueList.indexOf(event.target.value);
      this.checkedCopy
        ? this.valueList.push(event.target.value)
        : this.valueList.splice(index, 1);
      this.isArray
        ? this.$emit("change", this.valueList, item, $event)
        : this.$emit("change", $event.target.checked, item, $event);
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
