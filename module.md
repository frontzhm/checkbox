---
title: 模块的使用
tags: js
categories: js
---

node自带的模块化功能：require/module.exports/common.js规范
模块化的好处：命名冲突(自执行函数，高内聚低耦合)
模块：一个js文件就是一个模块
cmd seajs 玉伯
amd requirejs
umd 统一模块 模块做整合，兼容所有模块

* node模块 commonjs规范:require module.exports
* es6模块规范 esmodule umd:import exports
* webpack的环境下通用这两个规范

## es6的模块

import export

import的特点

* 变量提升
* 不能放到作用域下，比如`{import xxx}`
* import是静态语法，一旦有这句直接加载import的模块，放在顶级作用域
* import()是动态语法，有这句不一定会直接加载import的模块，当运行到这句的时候才开始加载

* 重命名使用as
* export default相当于export了一个default变量出去，`export default obj`等价于`export {obj as default}`

导出的特点

* export导出的是接口，是变量
* export default导出的是一个具体的内容，具体的值
* import进来的变量，变量是不能修改的
* 只能导出一次default

## export import-1

```js
// a.js

export let a = 1
export let b = 1
export let c = 1

// index.js
import {a,b,c} from './a'
console.log(a,b,c)

```

## export import-*-2

```js
// a.js

export let a = 1
export let b = 1
export let c = 1

// index.js
// *表示将所有export的内容放到一个对象里
import * as obj from './a'
console.log(obj.a,obj.b,obj.c)

```

## export{}-import-3

```js
// a.js

let a = 1
let b = 1
let c = 1
// export导出的是变量，不是具体的值如 export {a:1},可以用setInterval试试
setInterval(()=>{a++},1000)
export {
  a,
  b,
  c
}

// index.js
import * as obj from './a'
console.log(obj.a,obj.b,obj.c)

```

## export default-import-4

```js
// a.js
let a = 1
let b = 1
let c = 1
export {
  a
}
// export default就是默认导出，导出的是值
export default {b,c}

// index.js
import * as obj from './a'
console.log(obj.a,obj.default)

```

## export default-import-5

```js
// a.js
let a = 1
let b = 1
let c = 1
export {
  a
}
// export default就是默认导出，导出的是值
export default {b,c}

// index.js
import obj,{a} from './a'
setInterval(()=>{
  // {b:2,c:3}
  console.log(obj)
  // 1
  console.log(a)
},1000)

```

## export default-import-6

```js
// a.js
let a = 1
let b = 1
let c = 1
export {
  a
}
// export default就是默认导出，导出的是值
export default {b,c}

// index.js
import {a,default as d} from './a'
setInterval(()=>{
  // {b:2,c:3}
  console.log(d)
  // 1
  console.log(a)
},1000)

```

## export default-import-7

```js
// a.js
let a = 1
let b = 1
let c = 1
export {
  a
}
let obj = {a:1,b:2}

export {
  obj as default
}

// index.js
import {a,default as d} from './a'
setInterval(()=>{
  // {b:2,c:3}
  console.log(d)
  // 1
  console.log(a)
},1000)

```

## 整合-v1

```js
// x.js
export let x = 'x'
// y.js
export let y = 'y'
// z.js
// 这里希望整合x,y
import {x} from './x'
import {y} from './y'
export {
  x,
  y
}
// index.js
import {x,y} from './z'
console.log(x,y)
```

## 整合-v2

```js
// x.js
export let x = 'x'
// y.js
export let y = 'y'
// z.js
// 这里希望整合x,y，导入立刻导出，没有使用import，文件里是不能使用变量的
export * from './x'
// * 导出全部变量
// export * from './y'
// 也可以导出局部变量
export {y} from './y'
// index.js
import * as obj from './z'
console.log(obj)
```

## import() 懒加载

```js
// a.js
export let a = 1
// index.js
var a =1
if(a===1){
  let res = await import('./a')
  console.log(res)
}
```

## 总结

import/export/export default/export xx from ''/ import ()
