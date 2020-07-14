---
title: 优雅的写表单校验 -- 策略模式的运用
tags: js
categories: js
---

假设我们正在编写一个注册的页面，在点击注册按钮之前，有如下几条校验逻辑。

- 用户名不能为空。
- 密码长度不能少于 6 位。
- 手机号码必须符合格式。

```html
<form action="http:// xxx.com/register" id="registerForm" method="post">
  <div>请输入用户名：<input type="text" name="userName" /></div>
  <div>请输入密码：<input type="text" name="password" /></div>
  <div>请输入手机号码：<input type="text" name="phoneNumber" /></div>
  <button>提交</button>
</form>
```

html 的部分很简单，主要想想提交里怎么写？

来，简单构思下~
来，简单构思下~
来，简单构思下~

## 凭直觉写的表单校验 - v1

```js
let form = document.querySelector("#registerForm");
form.onsubmit = () => {
  if (form.userName.value === "") {
    alert("用户名不能为空");
    return false;
  }
  if (form.password.value.length < 6) {
    alert("密码不能少于6位");
    return false;
  }
  if (!/[0-9]{11,11}/.test(form.phoneNumber.value)) {
    alert("手机号码格式不正确");
    return false;
  }
};
```

一顿操作猛如虎，好，写完之后，看看代码有何不妥：

- registerForm.onsubmit 函数比较庞大，包含了很多 if-else 语句，这些语句需要覆盖所有
  的校验规则。
- registerForm.onsubmit 函数缺乏弹性，如果增加了一种新的校验规则，或者想把密码的长
  度校验从 6 改成 8，我们都必须深入 registerForm.onsubmit 函数的内部实现，这是违反开
  放—封闭原则的。
- 算法的复用性差，如果在程序中增加了另外一个表单，这个表单也需要进行一些类似的
  校验，那我们很可能将这些校验逻辑复制得漫天遍野。

联系之前说过的策略模式，来改进代码~

## 改进版的表单校验 - v2

```js
// 将算法的实现单独封装起来
var strategies = {
  isNonEmpty: function(value, errorMsg) {
    // 不为空
    if (value === "") {
      return errorMsg;
    }
  },
  // 这里把length作为参数
  minLength: function(value, length, errorMsg) {
    // 限制最小长度
    if (value.length < length) {
      return errorMsg;
    }
  },
  isMobile: function(value, errorMsg) {
    // 手机号码格式
    if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
      return errorMsg;
    }
  }
};
// 算法的使用
let form = document.querySelector("#registerForm");
form.onsubmit = function() {
  var errorMsg = "用户名不能为空";
  if ((strategies.isNonEmpty(registerForm.userName.value), errorMsg)) {
    alert(errorMsg);
    return false;
  }
  var errorMsg = "密码长度不能少于6 位";
  if ((strategies.minLength(registerForm.password.value), 6, errorMsg)) {
    alert(errorMsg);
    return false;
  }
  var errorMsg = "手机号码格式不正确";
  if ((strategies.isMobile(registerForm.phoneNumber.value), errorMsg)) {
    alert(errorMsg);
    return false;
  }
  // 这里开始ajax请求。。。
};
```

写完之后，我屮艸芔茻！！！这好像和第一版也没什么大的区别。看起来一点也不优雅！！！

但这里提供了关键性思路，提交部分明显就是重复，很容易想到列表循环，这里将其抽象成 validator 的类。

也就是 validator 类提供 add 和 start,，add 负责将每种校验方式放进一个数组，start 负责遍历数组，一旦有返回值直接返回且终止返回。

。。。我觉得有点难度，可以试试写写。

## 改进版的表单校验 - v3

```js
var strategies = {
  isNonEmpty(value, errorMsg) {
    // 不为空
    if (value === "") {
      return errorMsg;
    }
  },
  minLength(value, length, errorMsg) {
    // 限制最小长度
    if (value.length < length) {
      return errorMsg;
    }
  },
  isMobile(value, errorMsg) {
    // 手机号码格式
    if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
      return errorMsg;
    }
  }
};
class Validator {
  constructor() {
    this.cache = [];
  }
  add(dom, rule, msg) {
    // 把单个验证表单的fn存下来
    let [strategy, length] = rule.split(":");
    let params = length ? [dom.value, length, msg] : [dom.value, msg];
    console.log(params);
    let fn = () => {
      return strategies[strategy](...params);
    };
    this.cache.push(fn);
  }
  start() {
    for (var i = 0; i < this.cache.length; i++) {
      let errMsg = this.cache[i]();
      if (errMsg) {
        return errMsg;
      }
    }
  }
}
// 应用
let form = document.querySelector("#registerForm");
function validateData() {
  let validator = new Validator();
  validator.add(form.userName, "isNonEmpty", "用户名不能为空");
  validator.add(form.password, "minLength:6", "密码不能少于6位");
  validator.add(form.phoneNumber, "isMobile", "手机号码格式不正确");
  // 需要加新的校验规则，直接添加这里就好
  let errMsg = validator.start();
  return errMsg;
}
// submit里面就很优雅了
form.onsubmit = () => {
  let errMsg = validateData();
  if (errMsg) {
    alert(errMsg);
    return false;
  }
};
```

写完这些之后，其实。。。还有点缺点，比如用户名想同时验证其为空和长度的话，需要单个列出，显然又累赘了，接下来试着将其改成`validator.add(form.userName, {isNonEmpty:'用户名不能为空','minLength:6':'用户名长度不能少于6位'})`

```js
validator.add(form.userName, "isNonEmpty", "用户名不能为空");
validator.add(form.userName, "minLength:6", "用户名长度不能少于6位");
```

## 改进版的表单校验 - v4

```js
// var strategies = 。。。;
class Validator {
  constructor() {
    this.cache = [];
  }
  // 没事原先的add提取出来
  _handleRule(dom, rule, msg) {
    // 把单个验证表单的fn存下来
    let [strategy, length] = rule.split(":");
    let params = length ? [dom.value, length, msg] : [dom.value, msg];
    console.log(params);
    let fn = () => {
      return strategies[strategy](...params);
    };
    this.cache.push(fn);
  }
  add(dom, rules) {
    rules.forEach(item => {
      for (let rule in item) {
        let msg = item[rule];
        // 遍历的时候，直接使用就好
        this._handleRule(dom, rule, msg);
      }
    });
  }
  start() {
    for (var i = 0; i < this.cache.length; i++) {
      let errMsg = this.cache[i]();
      if (errMsg) {
        return errMsg;
      }
    }
  }
}
// 应用
let form = document.querySelector("#registerForm");

function validateData() {
  let validator = new Validator();
  validator.add(form.userName, [
    { isNonEmpty: "用户名不能为空" },
    { "minLength:6": "用户名不能少于6位" }
  ]);
  validator.add(form.password, [{ "minLength:6": "密码不能少于6位" }]);
  validator.add(form.phoneNumber, [{ isMobile: "手机号码格式不正确" }]);
  console.log(validator);
  let errMsg = validator.start();
  return errMsg;
}
form.onsubmit = () => {
  let errMsg = validateData();
  if (errMsg) {
    alert(errMsg);
    return false;
  }
};
```

完结，下次看表单验证的一些插件可能就能加深理解了！

## 引用

这里的案例是《JavaScript的设计模式与开发实践》里面的，写的非常好，强烈安利！！！

<!-- 
## 改进版的表单校验 - v3

```js
// minLength这个统一传 'minLength:6'，所以这里简单做下判断
function validateRule(dom, strategy, errorMsg) {
  // minLength:6 => [minLength,6]
  var params = strategy.split(":");
  // 相当于 strategy = params[0] ; params=params.slice(1) 此操作甚秒
  strategy = params.shift();
  // params是传入到strategy的参数，第一个参数是value 第二个可能是另外的参数，这就看params上面的操作了，最后一个是errMsg
  params.unshift(dom.value);
  params.push(errorMsg);
  /*
  if (strategies.isNonEmpty(registerForm.userName.value)) {
    alert("用户名不能为空");
    return false;
  }
*/
  // errorMsg还是返回出来更好，这样更加容易复用
  if (strategies[strategy](...params)) {
    return errorMsg;
  }
}
// 算法的使用
submitBtn.onclick = function() {
  var errorMsg = validateRule(
    registerForm.userName,
    "isNonEmpty",
    "用户名不能为空"
  );
  if (errorMsg) {
    alert(errorMsg);
    return false;
  }
  var errorMsg = validateRule(
    registerForm.password,
    "minLength:6",
    "密码长度不能少于6 位"
  );
  if (errorMsg) {
    alert(errorMsg);
    return false;
  }
  var errorMsg = validateRule(
    registerForm.phoneNumber,
    "isMobile",
    "手机号码格式不正确"
  );
  if (errorMsg) {
    alert(errorMsg);
    return false;
  }

  // 这里开始ajax请求。。。
};
```

..........  
..........  
..........

继续来，我们是工匠，致力打造最美代码~~

## 改进版的表单校验 - v4

```js
let cache = [];
cache.push(validateRule(registerForm.userName, "isNonEmpty", "用户名不能为空"));
cache.push(
  validateRule(registerForm.password, "minLength:6", "密码度不能少于6 位")
);
cache.push(
  validateRule(registerForm.phoneNumber, "isMobile", "手机号码格式不正确")
);

function start() {
  for (let i = 0; i < cache.length; i++) {
    let cur = cache[i];
    if (cur) {
      return cur;
    }
  }
}
submitBtn.onclick = function() {
  let errorMsg = start();
  if (errorMsg) {
    alert(errorMsg);
    return false;
  }
  // 这里开始ajax请求。。。
};
```

代码到了这里增加规则的话就已经方便很多了，只需要 push 相关规则即可，下面的 start 和 click 就不用动了。其实算是封装了变与不变，但是这里`strategies cache start`都是紧密相关的，可以提取一个 Validator 的类，将他们封装在每个实例里，这样就很方便了。

## 改进版的表单校验 - v5

```js
class Validator {
  constructor() {
    this.cache = [];
  }
  add(dom, strategy, errorMsg) {
    let params = strategy.split(":");
    strategy = params.shift();
    params.unshift(dom.value);
    params.push(errorMsg);
    // 把校验的函数放进cache里，这里不直接存结果，而是存要运行的函数
    let res = () => strategies[strategy](...params);
    // 数组每项结构类似于 function(){return isNonEmpty()},运行之后相当于isNonEmpty()
    this.cache.push(res);
  }

  start() {
    for (let i = 0; i < this.cache.length; i++) {
      let validatorFn = this.cache[i];
      var errorMsg = validatorFn();
      if (errorMsg) {
        return errorMsg;
      }
    }
  }
}

var validataFunc = function() {
  // 创建一个validator 对象
  var validator = new Validator();
  /***************添加一些校验规则****************/
  validator.add(registerForm.userName, "isNonEmpty", "用户名不能为空");
  validator.add(registerForm.password, "minLength:6", "密码长度不能少于6 位");
  validator.add(registerForm.phoneNumber, "isMobile", "手机号码格式不正确");
  var errorMsg = validator.start();
  return errorMsg;
};

submitBtn.onclick = function() {
  // 如果errorMsg 有确切的返回值，说明未通过校验
  var errorMsg = validataFunc();
  if (errorMsg) {
    alert(errorMsg);
    return false;
  }
  // 这里开始ajax请求。。。
};
``` -->
