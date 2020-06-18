<template lang="pug">
div
  editor(:content.sync='content' :files.sync='files')
  div {{content}}
  div {{files}}
</template>

<script type="text/ecmascript-6">
import Editor from '@/components/Editor'
export default {
  name: 'edit',
  components:{Editor},
  data(){
    const fileCommonPre = 'https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/'
    return {
      content:'<p>111</p>',
      files:[
        {name:'1.pdf',size:12,url:`${fileCommonPre}demo.pdf`},
        {name:'1.docx',size:12,url:`${fileCommonPre}1.docx`},
        {name:'1.pptx',size:12,url:`${fileCommonPre}1.pptx`}
      ]
    }
  }
}
</script>
<style scoped></style>
