<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->
    <el-main>
      <router-view />
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "User",
  data() {
    return {}
  },
  computed: {},
  methods: {
    ...mapGetters('User', [`getUserFromCache`]),
  },
  mounted() {
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>