<!--解析回复正文 需要处理的内容： 话题 、@ -->

<template>
  <div>
    <div v-for="(line,i) in text">
      <!--          todo 解析回复-->
      {{ line }}
      <!--          todo 展开请求-->
      <span v-if="isLongText && i===text.length-1" class="clickable" style="color:#a3ffcc">...[展开]</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "WbStatusContent",
  data() {
    return {
      text: [],
      isLongText: false,
    }
  },
  computed: {},
  methods: {
    parse(data) {
      this.text = data.text
      this.isLongText = data.isLongText

    }
  },
  mounted() {
    this.parse(this.data)
  },
  watch: {
    text(to) {
      this.parse(to)
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