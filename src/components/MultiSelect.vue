<template lang="pug">
div
  div.option-box(@click='$refs.input.click()')
    slot(:selected='curChecked') 
  //- 原始input隐藏，这里的value看情况使用，可以不传，change是将选择事件抛出去，让父组件知晓
  input(ref='input' hidden type='checkbox' :checked='curChecked' :value='value' @change='changeInput($event)')
</template>
<script>
/**
 * *

  使用方法：
  import MultiSelect from "@/components/MultiSelect.vue";

  multi-select(v-model='selectedCodes' :value='item.code')
    template(#default="{ selected }")
      div.option-content(:class='{ selected }') {{item.name}}
  
  .option-content可以是任意复杂的dom，selected是当前项选中与否的值，这样可以灵活增加选中的样式
  如果需要动态根据选中得到节点信息，可以加个监听事件 change
    multi-select(v-model='selectedCodes' :value='item.code' @change='changeItem')
    changeItem(...args){
      console.log(...args)
      // 两个值，第一个是选中的列表，第二个是原生input的信息
    }



  组件逻辑：
  1. 当父组件传过来的checked是数组类型的时候，当前组件的初始状态curChecked是，看数组里有没有当前value，有就是选中，没有就不选中
  2. 数组是引用类型，为了不改变父组件的值，这里使用selectedList复制一份checked
  3. 当checkbox有change事件的时候，选中就将value值push到selectedList，否则删掉，然后将selectedList抛给父组件
  4. !!! 注意这里使用computed,因为别的复选框选择的时候，selectedList也会跟着变化
  5. slot里面就是具体的dom了，此组件只提供逻辑
 *
 */
export default {
  name: "multi-select",
  model: {
    prop: "checked",
    event: "change"
  },
  props: {
    checked: {
      required: true,
      default() {
        return [];
      }
    },
    value: {
      required: true,
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
    changeInput($event) {
      let { checked } = $event.target;
      // 看下选中的值在数组中的索引，这里不用原生的value，因为$event.target.value始终是字符串类型
      let index = this.selectedList.indexOf(this.value);
      // 选择的时候,selectedList跟着变化
      checked
        ? this.selectedList.push(this.value)
        : index !== -1 && this.selectedList.splice(index, 1);
      this.$emit("change", this.selectedList, $event);
    }
  }
};
</script>
