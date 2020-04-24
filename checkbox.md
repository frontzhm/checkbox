---
title: 拆解checkbox的v-model
tags: js
categories: js
---

项目中，原始使用checkbox的话，一般绑定v-model就行，但是，如果想实现类似微信从通讯录选中好友来建群的效果，如下图，加上可以组里面再选择，就需要将v-model拆解成checked和change事件，然后封装单项组件。
![通讯录](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/contact.jpeg)

v-model可以绑定两种类型的值，`Boolean`和`Array`。所以组件封装之后希望能这样使用：

```pug
//- item是内容区的相关信息，比如头像 昵称 uid
//- 1 boolean类型的时候，通常用于全选 组选的情况
checkboxEnhanced(v-model='bool' :item='item')
//- 2 array类型的时候，这时候可以循环
checkboxEnhanced(v-model='arr' :item='item1' :value='item1.code')
checkboxEnhanced(v-model='arr' :item='item2' :value='item2.code')

```

## v-mode是boolean的时候

```vue
<!-- checkboxBoolean.vue -->
<template lang="pug">
div.checkbox-box
  div.checkbox-content-box(@click='$refs.input.click()')
    //- 自定义选中图标
    div.icon-box
      img.icon(alt='' :src='checked?"https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/icon_selected.png":"https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/icon_not_selected.png"')
    div.content
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
      type: [Boolean, String, Number],
      default() {
        return "";
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

```

## v-model是Array的时候

```vue
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
  input(ref='input' hidden type='checkbox' :checked='curChecked' :value='value' @change='changeInput($event)')

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

```

## 将两种情况合并

这里简单使用component组件。[vue官网介绍](https://cn.vuejs.org/v2/guide/components-dynamic-async.html)

```vue
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

```
