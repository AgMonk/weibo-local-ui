<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header></el-header>
    <el-main>
      <el-button @click="setCookie">cookie</el-button>

    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {ElMessageBox} from "element-plus";
import {getCookieMap, setCookies} from "@/assets/js/utils/CookieUtils";
import {putCache} from "@/assets/js/utils/StorageUtils";

export default {
  name: "Config",
  data() {
    return {}
  },
  computed: {},
  methods: {
    setCookie() {
      ElMessageBox.prompt("请输入cookie").then(res => {
        const cookieMap = getCookieMap(res.value);
        putCache("token", cookieMap['XSRF-TOKEN'])
        setCookies(res.value, 30, '/wb-api')
      })
    },
  },
  mounted() {
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>