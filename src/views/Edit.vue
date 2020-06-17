<template lang="pug">
div
  editor(:content.sync='content')
  div {{content}}
</template>

<script type="text/ecmascript-6">
import Editor from '@/components/Editor'
export default {
  name: 'edit',
  components:{Editor},
  data(){
    return {
      content:'<p>111</p>'
    }
  }
}
</script>
<style scoped></style>
