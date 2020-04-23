<template lang="pug">
ul
  li.item(v-for='(item,index) in items' :key='index')
    checkbox-item(:item='item' v-model='item.checked'  :value='item.code' @change='setChecked')
</template>
<script>
/**
 * 
这个组件是希望能直接使用类似 v-mode = 'arr'的效果

实现逻辑：
- 需要传入 items 所有的选项，value是选中值的列表
- watch监听value，将每项的checked变化
- 当改变input的时候，监听到改变的值，然后复制一份value，得到最新的value，再传给父组件，改变父组件的value，自然组件的也就变化了
- 这里注意，为了不影响原来的，只能先复制一份，然后得到新的选中数组

使用的时候，不需要在methods里监听checkbox-list-teacher组件的事件了
  checkbox-list(:items='items' v-model='value')
如果需要监听选中的事件
  checkbox-list(:items='items' v-model='value' @input='hi')

  methods: {
    hi(valueCopy, item, event) {
      console.log(valueCopy, item, event);
    }
  }
*/
import CheckboxItem from "@/components/CheckboxItem";
export default {
  name: "checkbox-list",
  components: { CheckboxItem },
  props: {
    items: {
      type: Array,
      required: true,
      default() {
        return [];
      }
    },
    value: {
      type: Array,
      required: true,
      default() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  watch: {
    value: {
      handler(newVal) {
        this.items.forEach(item => {
          item.checked = newVal.includes(item.code);
        });
        // 这行必须要，数组对象变化的时候，splice能强制更新，不然检测不到更新
        this.items.splice(0, 1, this.items[0]);
      },
      // 组件一开始就计算
      immediate: true
    }
  },

  methods: {
    setChecked(checked, item, event) {
      let valueCopy = [...this.value];
      let index = valueCopy.indexOf(event.target.value);
      checked ? valueCopy.push(event.target.value) : valueCopy.splice(index, 1);
      this.$emit("input", valueCopy, item, event);
    }
  }
};
</script>
<style scoped>
.item {
  background-color: #fff;
  border-bottom: 1px solid #efefef;
}
</style>
