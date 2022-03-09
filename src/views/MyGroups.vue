<template>
  <el-container direction="vertical">
    <el-main>
      <el-container direction="horizontal">
        <el-aside width="150px">
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

export default {
  name: "MyGroups",
  components: {WbGroupsMenu},
  data() {
    return {}
  },
  computed: {},
  methods: {},
  mounted() {
    setTitle('首页')
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>