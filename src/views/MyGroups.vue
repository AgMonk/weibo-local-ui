<template>
  <el-container direction="vertical">
    <el-main>
      <el-container direction="horizontal">
        <el-aside width="150px">
          <el-button @click="setCookie">cookie</el-button>

          <wb-groups-menu />
        </el-aside>
      <el-main>
        <router-view />
      </el-main>
      </el-container>
    </el-main>
  </el-container>

</template>

<script>
import {setTitle} from "@/assets/js/request/request";
import WbGroupsMenu from "@/views/groups/WbGroupsMenu";
import {ElMessageBox} from "element-plus";
import {getCookieMap, setCookies} from "@/assets/js/utils/CookieUtils";
import {putCache} from "@/assets/js/utils/StorageUtils";

export default {
  name: "MyGroups",
  components: {WbGroupsMenu},
  data() {
    return {}
  },
  computed: {},
  methods: {
    setCookie() {
      ElMessageBox.prompt("请输入cookie").then(res=> {
        const cookieMap = getCookieMap(res.value);
        putCache("token", cookieMap['XSRF-TOKEN'])
        setCookies(res.value, 30, '/wb-api')
      })
    },
  },
  mounted() {
    setTitle('首页')
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>