<!--单个动态-->
<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->
    <el-main>
      <wb-status-card v-if="id" :id="id" ref="user-status" />
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions} from "vuex";
import WbStatusCard from "@/components/weibo/WbStatusCard";
import {setTitle} from "@/assets/js/request/request";

export default {
  name: "UserStatus",
  components: {WbStatusCard},
  data() {
    return {
      id: undefined,
    }
  },
  computed: {},
  methods: {
    ...mapActions("Groups", [`getStatusDetail`]),
    load(route) {
      setTitle("动态")
      const {uid, uuid} = route.params
      this.getStatusDetail(uuid).then(res => {
        this.id = res;

      })
    },
  },
  mounted() {
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      this.load(to)
    }
  },
  props: {},
}

</script>

<style scoped>

</style>