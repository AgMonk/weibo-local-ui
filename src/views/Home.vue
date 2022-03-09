<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <el-button @click="setCookie">cookie</el-button>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import {getAllGroups} from "@/assets/js/request/feed";
import {ElMessageBox} from "element-plus";
import {setCookies} from "@/assets/js/utils/CookieUtils";

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  methods: {
    setCookie() {
      ElMessageBox.prompt("请输入cookie").then(res=>{
        setCookies(res.value,30,'/wb-api')
      })
    },
  },
  mounted() {
  }
}
</script>
