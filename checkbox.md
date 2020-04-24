---
title: 拆解checkbox的v-model
tags: js
categories: js
---

项目中，原始使用 checkbox 的话，一般绑定 v-model 就行，但是，如果想实现类似微信从通讯录选中好友来建群的效果，如下图，加上可以组里面再选择，就需要将 v-model 拆解成 checked 和 change 事件，然后封装单项组件。
![通讯录](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/contact.jpeg)

v-model 可以绑定两种类型的值，`Boolean`和`Array`。所以组件封装之后可以这样使用：

```pug
//- item是内容区的相关信息，比如头像 昵称 uid
//- 1 boolean类型的时候，通常用于全选 组选的情况
checkboxEnhanced(v-model='bool') 同意协议
//- 2 array类型的时候，这时候可以循环
checkboxEnhanced(v-for="(item,index) in list" v-model='arr'  :value='item.code') {{item.name}}

```

[查看使用案例](https://frontzhm.github.io/checkbox/dist/index.html#/)

> [项目的github](https://github.com/frontzhm/checkbox)

## v-mode 是 boolean 的时候

```vue
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
    event: "change",
  },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    checked: {
      type: Boolean,
      required: true,
      default() {
        return false;
      },
    },
    value: {
      // type: [Boolean, String, Number],
      default() {
        return this.item;
      },
    },
  },

  methods: {
    changeInput($event) {
      // 第一项就将是否选中扔出去，这里注意，扔出去之后，父组件用v-model的话，父组件的值会自动变化
      // v-model是个语法糖，本质上相当于父组件 checkbox-item(:checked='checked' @change='checked=$event')
      this.$emit("change", $event.target.checked, $event);
    },
  },
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

## v-model 是 Array 的时候

```vue
<!-- checkboxArray.vue -->
<template lang="pug">
div.checkbox-box
  div.checkbox-content-box(@click='$refs.input.click()')
    //- 自定义选中图标
    div.icon-box
      img.icon(alt='' :src='curChecked?"https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/icon_selected.png":"https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/icon_not_selected.png"')
    div.content
      //- slot可以自定义后面的内容
      slot
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
    event: "change",
  },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    checked: {
      required: true,
      default() {
        return [];
      },
    },
    value: {
      default() {
        return this.item;
      },
    },
  },
  computed: {
    selectedList: {
      get() {
        return [...this.checked];
      },
      set() {
        console.log();
      },
    },
    curChecked() {
      return this.checked.includes(this.value);
    },
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
    },
  },
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

这里简单使用 component 组件。[vue 官网介绍](https://cn.vuejs.org/v2/guide/components-dynamic-async.html)

```vue
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
    CheckboxBoolean,
  },
  model: {
    prop: "checked",
    event: "change",
  },
  created() {
    this.isArray = Array.isArray(this.$attrs.checked);
  },
  data() {
    return {
      isArray: false,
    };
  },
};
</script>
```

## 综合使用

```pug
//- Home.vue
<template lang="pug">
div
  h2 boolean
  div
    div {{checked}}
    checkbox-enhanced(v-model='checked' @change='change') 同意协议
  h2 array
  div
    div {{selectedCodes}}
    checkbox-enhanced(v-for='(item,index) in items' :key='index' v-model='selectedCodes' :item='item' :value='item.code' @change='changeItem')
  h2 array 自定义传入的内容
  div
    div {{selectedCodes}}
    checkbox-enhanced(v-for='(item,index) in items' :key='index' v-model='selectedCodes' :value='item.code' @change='changeItem') {{item.name}}
  h3 group
    section(v-for='(group,index) in groups' :key='index')
      br
      div {{group.name}}
      checkbox-enhanced(v-for='(item,idx) in group.children' :key='idx' v-model='selectedCodes'  :item='item' :value='item.code'  @change='changeItem')

</template>

<script>
// @ is an alias to /src
import CheckboxEnhanced from "@/components/CheckboxEnhanced.vue";

export default {
  name: "Home",
  components: {
    CheckboxEnhanced
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

```
