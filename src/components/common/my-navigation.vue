<template>
  <el-menu
      :default-active.sync="activeIndex"
      mode="horizontal"
      active-text-color="#ffd04b"
      background-color="#545c64"
      router
      text-color="#fff"
      @select="select"
  >
    <my-navigation-item v-for="(route,i) in routes" :key="i" :route="route" parent-path="" />
  </el-menu>
</template>

<script>
import MyNavigationItem from "@/components/common/my-navigation-item";

export default {
  name: "my-navigation",
  components: {MyNavigationItem},
  data() {
    return {
      routes: [
        {path: '/', name: '首页'},
        {path: "/config", name: "配置"},
      ],
      activeIndex: "",
      url: "",
    }
  },
  computed: {},
  methods: {
    handleClick(e) {
      console.log(e)
    },
    select(index, indexPath) {
      // console.log(this.activeIndex)
    }
  },
  mounted() {
    this.activeIndex = this.$route.path
  },
  watch: {
    $route(to, from) {
      this.activeIndex = to.path
    }
  }
}

</script>

<style scoped>

</style>