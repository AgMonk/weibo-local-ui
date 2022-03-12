<!--解析回复正文 需要处理的内容： 话题 、@ -->

<template>
  <div>
    <div v-for="(line,i) in textHtml">
      <!--          todo 解析回复-->
      <!--      {{ line }}-->
      <span v-html="line"></span>
      <!--          todo 展开请求-->
      <span v-if="isLongText && i===textHtml.length-1" class="clickable" style="color:#a3ffcc" @click="getLongText">...[展开]</span>
    </div>
  </div>
</template>

<script>
import {getLongText} from "@/assets/js/request/statuses";

export default {
  name: "WbStatusContent",
  data() {
    return {
      text: [],
      textHtml: [],
      isLongText: false,
    }
  },
  computed: {},
  methods: {
    parse(data) {
      this.text = data.text
      //todo 替换表情icon
      this.textHtml = data.textHtml
      this.isLongText = data.isLongText
    },
    getLongText() {
      getLongText(this.data.blog.uuid).then(res => {
        this.data.textHtml = res
        //todo 替换表情icon
        this.textHtml = res
        this.isLongText = false;
      })
    }
  },
  mounted() {
    this.parse(this.data)
  },
  watch: {
    data(to) {
      if (to) {
        this.parse(to)
      }
    }
  },
  props: {
    data: {type: Object, required: true,},
  },
}

</script>

<style scoped>
a {
  color: red;
}
</style>