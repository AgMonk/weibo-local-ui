<template>
  <div v-if="data" style="color:white;">
    <el-container direction="horizontal">
      <el-aside v-if="!disableAvatar" width="50px">
        <!--       todo 头像-->
        <wb-user-avatar v-if="data.authorId" :id="data.authorId" />
      </el-aside>
      <el-main style="text-align: left">
        <!--      微博名 -->
        <b><wb-user-link v-if="data.authorId" :id="data.authorId" /></b>
        <!--      时间 来自 -->
        <div v-if="data.timestamp" class="common-text">
          <span>{{ data.timestamp.create.before || data.timestamp.create.datetime }}</span>
          <span v-if="data.source"> 来自：{{ data.source }}</span>
        </div>
        <!--       正文-->
        <div  style="color:#c5c5c5">
          {{ data.text }}
          <!--          todo 展开请求-->
          <span v-if="data.isLongText" class="clickable" style="color:#a3ffcc">...[展开]</span>
        </div>
        <!--        被转发微博-->
        <div v-if="data.retweeted">
          <el-divider content-position="left">转发</el-divider>
          <wb-status-card :id="data.retweeted" disable-avatar />
        </div>
        <!--       媒体-->
        <!--       转发、评论、点赞-->
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import WbUserLink from "@/components/weibo/WbUserLink";
import WbUserAvatar from "@/components/weibo/WbUserAvatar";

export default {
  name: "WbStatusCard",
  components: {WbUserAvatar, WbUserLink},

  data() {
    return {
      data: {},
    }
  },
  computed: {},
  methods: {
    ...mapGetters('Groups', [`getStatusFromCache`]),
    load(id) {
      this.data = this.getStatusFromCache()(id)
    }
  },
  mounted() {
    this.load(this.id)
  },
  watch: {
    id(to) {
      this.load(to)
    },
  },
  props: {
    id: {type: Number, required: true,},
    disableAvatar: {type: Boolean, default: false},
  },
}

</script>

<style scoped>

</style>