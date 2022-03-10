<template>
  <div>
    <!--          todo 解析回复-->

    <span v-html="data"></span>
    <!--          todo 展开请求-->
    <span v-if="html&&html.endsWith('...展开')" class="clickable" style="color:#a3ffcc">...[展开]</span>
  </div>
</template>

<script>
export default {
  name: "WbStatusContent",
  data() {
    return {
      data: "",
    }
  },
  computed: {},
  methods: {
    parse(html) {
      this.data = html.replace('...展开', '')
    }
  },
  mounted() {
    this.parse(this.html)
  },
  watch: {
    html(to) {
      this.parse(to)
    }
  },
  props: {
    html: {type: String, required: true,}
  },
}

</script>

<style scoped>
a{
  color:red;
}
</style>