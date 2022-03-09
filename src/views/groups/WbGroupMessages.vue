<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
<!--    <el-header></el-header>-->
    <el-main>
      <div style="margin-left: 5px;border: 3px dashed #ec7878">
        <div v-if="friendsTimeline[gid]">
          <el-scrollbar height="650px">
            <!--          <div v-infinite-scroll="getMoreTimeline(gid)">-->
            <wb-status-card v-for="item in friendsTimeline[gid].data" :data="item" />
            <!--          </div>-->
          </el-scrollbar>

        </div>
      </div>
    </el-main>
  </el-container>

</template>

<script>
import {mapActions, mapState} from "vuex";
import WbStatusCard from "@/components/weibo/WbStatusCard";

export default {
  name: "WbGroupMessages",
  components: {WbStatusCard},
  data() {
    return {
      gid:undefined,
    }
  },
  computed: {
    ...mapState("Groups", [`friendsTimeline`]),
  },
  methods: {
    ...mapActions("Groups", [`getFirstTimeline`, `getFriendsTimeline`, `getMoreTimeline`]),
  },
  mounted() {
    this.gid = Number(this.$route.params.gid)
    this.getFirstTimeline(this.gid).then(() => {
      this.getMoreTimeline(this.gid)
    })
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>