<template lang="pug">
div.checkbox-box
  div.checkbox-content-box(@click='$refs.input.click()')
    //- 自定义选中图标
    div.icon-box
      img.icon(alt='' :src='curChecked?"https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/icon_selected.png":"https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/icon_not_selected.png"')
    div.content
      //- 这里可以灵活改变
      div.avatar-box
        img.img-avatar(alt='' :src='item.avatar || " https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/default_avatar.png"')
      .name {{item.name}}
  //- 原始input隐藏，这里的value看情况使用，可以不传，change是将选择事件抛出去，让父组件知晓
  input(ref='input' hidden type='checkbox' :checked='curChecked' :value='value' @change='changeInput(item,$event)')

</template>
<script>
/*
  当父组件传过来的checked是数组类型的时候，
  当前组件的初始状态curChecked是，看数组里有没有当前value，有就是选中，没有就不选中
  数组是引用类型，为了不改变父组件的值，这里使用selectedList复制一份checked
  当checkbox有change事件的时候，选中就将value值push到selectedList，否则删掉，然后将selectedList抛给父组件
  !!! 注意这里使用computed,以为别的复选框选择的时候，selectedList也会跟着变化
 */
export default {
  name: "checkbox-array",
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
        return [];
      }
    },
    value: {
      type: [Boolean, String, Number],
      default() {
        return "";
      }
    }
  },
  computed: {
    selectedList: {
      get() {
        return [...this.checked];
      },
      set() {
        console.log();
      }
    },
    curChecked() {
      return this.checked.includes(this.value);
    }
  },

  methods: {
    changeInput(item, $event) {
      let { checked } = $event.target;
      // 看下选中的值在数组中的索引，这里不用原生的value，因为$event.target.value始终是字符串类型
      let index = this.selectedList.indexOf(this.value);
      // 选择的时候,selectedList跟着变化
      checked
        ? this.selectedList.push(this.value)
        : index !== -1 && this.selectedList.splice(index, 1);
      this.$emit("change", this.selectedList, item, $event);
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
