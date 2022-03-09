<template>
 <el-button v-clipboard:copy="text" v-clipboard:error="onError"
            v-clipboard:success="onCopy"
            :size="size"
            :type="type"
 >
   <slot/>
 </el-button>

</template>

<script>
import {ElMessage} from "element-plus";

export default {
  name: "my-copy-button",
  data() {
    return {}
  },
  computed: {},
  methods: {
    onCopy() {
      ElMessage.success("复制成功")
    },
    onError(e) {
      ElMessage.error("复制失败")
      console.error(e)
    },
  },
  mounted() {
  },
  watch: {},
  props: {
    type: {
      type: String,
      default: 'primary',
    },
    size: {
      type: String,
      default: 'small',
    },
    text: {
      required:true,
    },
  },
}

</script>

<style scoped>

</style>