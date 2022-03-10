<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->
    <el-main>
      <div v-loading="loadingMore"
           element-loading-background="rgba(0, 0, 0, 0.8)"
           element-loading-svg-view-box="-10, -10, 50, 50"
           element-loading-text="加载中..."
           style="margin-left: 5px;"
      >
        <div style="text-align: left">
          <el-button size="small" type="success" @click="clearTimeline(gid);load($route)">刷新</el-button>
        </div>
        <div style="border: 3px dashed #ec7878">

          <div id="动态">
            <el-scrollbar ref="scrollbar" height="650px">
              <div v-infinite-scroll="getMore">
                <div v-for="id in data" style="border: 1px solid #949494;margin-bottom: 2px">
                  <wb-status-card :id="id" />
                </div>
                <div class="common-text">
                  <h4>加载中...</h4>
                </div>
              </div>
            </el-scrollbar>

          </div>
        </div>
      </div>
    </el-main>
  </el-container>

</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import WbStatusCard from "@/components/weibo/WbStatusCard";

export default {
  name: "WbGroupMessages",
  components: {WbStatusCard},
  data() {
    return {
      gid: undefined,
      loadingMore: false,
      data: [],
    }
  },
  computed: {
    ...mapState("Groups", [`timeline`]),
    ...mapState("Loading", [`svg`]),
  },
  methods: {
    ...mapActions("Groups", [`getFirstTimeline`, `getTimeline`, `getMoreTimeline`]),
    ...mapMutations("Groups", [`clearTimeline`]),
    getParams(route) {
      const listId = Number(route.params.gid)
      const type = route.params.type
      return {listId, type}
    },
    getMore() {
      if (!this.loadingMore) {
        this.loadingMore = true
        this.getMoreTimeline(this.getParams(this.$route)).then(res => {
          this.loadingMore = false
          this.data = res;
        })
      }
    },
    load(route) {
      this.loadingMore = true
      this.getFirstTimeline(this.getParams(route)).then(res => {
        this.data = res;
        this.$nextTick(() => this.loadingMore = false)
        this.$nextTick(() => this.$refs['scrollbar'].setScrollTop(0))
      })
    }
  },
  mounted() {
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      console.log(to)
      if (to.name === '分组消息') {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>