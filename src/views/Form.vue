<template>
  <form action="http:// xxx.com/register" id="registerForm" method="post">
    <div>请输入用户名：<input type="text" name="userName" /></div>
    <div>请输入密码：<input type="text" name="password" /></div>
    <div>请输入手机号码：<input type="text" name="phoneNumber" /></div>
    <button>提交</button>
  </form>
</template>
<script>
export default {
  name: "form"
};
</script>
<style scoped></style>
