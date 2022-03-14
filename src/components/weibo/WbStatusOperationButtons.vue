<template>
  <div><!--  被转发微博 、 评论模式-->
    <div v-if="isRetweeted || isComment" style="text-align: right">
      <span class="operation-button">
        <el-icon>
          <share />
        </el-icon>
        快
      </span>
      <span class="operation-button">
        <el-icon>
          <share />
        </el-icon>
        <span v-if="counts"> ({{ counts.reposts }})</span>
      </span>
      <span :class="`operation-button ${showComment?'selected':''}`" @click="clickComment">
        <el-icon>
          <comment />
        </el-icon>
        <span v-if="counts"> ({{ counts.comments }})</span></span>
      <span :class="`operation-button ${liked?'selected':''}`" @click="switchLike">
        <el-icon>
          <circle-check />
        </el-icon>
        <span v-if="counts"> ({{ counts.attitudes }})</span></span>
    </div>
       <!--  完整模式 -->
    <div v-else>
      <el-row>
        <el-col :span="6 " class="operation-button"><!--todo 快转-->
          <el-icon>
            <share />
          </el-icon>
                                                    快转
        </el-col>
        <el-col :class="`operation-button ${showRepost?'selected':''}`" :span="6 " @click="clickRepost"><!--todo 转发-->
          <el-icon>
            <share />
          </el-icon>
                                                                                                        转发
          <span v-if="counts"> ({{ counts.reposts }})</span>
        </el-col>
        <el-col :class="`operation-button ${showComment?'selected':''}`" :span="6 " @click="clickComment"><!--todo 评论-->
          <el-icon>
            <comment />
          </el-icon>
                                                                                                          评论
          <span v-if="counts"> ({{ counts.comments }})</span>
        </el-col>
        <el-col :class="`operation-button ${liked?'selected':''}`" :span="6 " @click="switchLike"><!--todo 点赞-->
          <el-icon>
            <circle-check />
          </el-icon>
          <span v-if="counts"> ({{ counts.attitudes }})</span>
        </el-col>
      </el-row>
    </div>


       <!--    评论-->
    <div v-if="showComment || showRepost" v-loading="loading"
         :element-loading-spinner="svg"
         element-loading-background="rgba(0, 0, 0, 0.8)"
         element-loading-svg-view-box="-10, -10, 50, 50"
         element-loading-text="加载中..."
    >
      <el-scrollbar ref="scrollbar" height="400px">
        <div v-infinite-scroll="getStatusComments" :infinite-scroll-disabled="(showComment?comments:(showRepost?reposts:{})).params.maxId===0">
          <div v-for="id in (showComment?comments:(showRepost?reposts:{})).data" style="margin-top: 2px">
            <wb-status-card :id="id" is-comment />
          </div>
          <div style="text-align: center">
            <div v-if="(showComment?comments:(showRepost?reposts:{})).params.maxId!==0">
              加载中...
            </div>
            <div v-else>
              已加载全部评论
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>

</template>
<script>
import {CircleCheck, Comment, Share} from "@element-plus/icons-vue";
import {cancelLike, destroyLike, setLike, updateLike} from "@/assets/js/request/statuses";
import {ElMessage} from "element-plus";
import {mapActions, mapState} from "vuex";
import WbStatusCard from "@/components/weibo/WbStatusCard";

export default {
  name: "WbStatusOperationButtons",
  components: {WbStatusCard, Share, Comment, CircleCheck},
  data() {
    return {
      liked: false,
      loading: false,
      showComment: false,
      showRepost: false,
      comments: {
        params: {
          flow: 1,
          maxId: undefined,
        },
        data: [],
      },
      reposts: {
        params: {
          flow: 1,
          maxId: undefined,
        },
        data: [],
      },
    }
  },
  computed: {
    ...mapState("Loading", [`svg`]),
  },
  methods: {
    ...mapActions("Groups", [`getComments`]),
    clickRepost() {
      this.showComment = false;
      this.showRepost = !this.showRepost;

      //  todo 请求转发内容
    },
    clickComment() {
      this.showComment = !this.showComment;
      this.showRepost = false;

      //  todo 请求评论内容
      if (this.showComment && this.comments.data.length === 0) {
        this.getStatusComments()
      }
      if (!this.showComment) {
        this.comments.data = []
        this.comments.params.maxId = undefined
      }
    },
    getStatusComments() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      const {flow, maxId} = this.comments.params
      this.getComments({id: this.id, flow, maxId,}).then(res => {
        const {contents, total, maxId} = res
        this.counts.comments = total;
        this.comments.params.maxId = maxId;
        this.comments.data.push(...contents)
        this.loading = false;
      })
    },
    switchLike() {
      if (this.isComment) {
        if (this.liked) {
          destroyLike(this.id).then(() => {
            ElMessage.success("取消成功")
            this.counts.attitudes--
            return this.liked = !this.liked;
          })
        } else {
          updateLike(this.id).then(() => {
            this.liked = !this.liked
            this.counts.attitudes++
            ElMessage.success("点赞成功")
          })
        }
      } else {

        if (this.liked) {
          cancelLike(this.id).then(() => {
            ElMessage.success("取消成功")
            return this.liked = !this.liked;
          })
        } else {
          setLike(this.id).then(res => {
            this.liked = !this.liked
            this.counts.attitudes = res
            ElMessage.success("点赞成功")
          })
        }
      }
    }
  },
  mounted() {
    this.liked = !!this.counts.attitudesStatus

    if (this.$route.name === '单个动态' && !this.isComment && !this.isRetweeted && this.counts.comments > 0) {
      this.clickComment()
    }
  },
  watch: {
    counts(to) {
      this.liked = to.attitudesStatus
    }
  },
  props: {
    isRetweeted: {type: Boolean, default: false},
    isComment: {type: Boolean, default: false},
    counts: {type: Object},
    id: {type: Number, required: true,},
  },
}

</script>

<style scoped>
.operation-button {
  text-align: center;
  border-width: 1px;
  border-style: dashed;
  border-color: white;
  cursor: pointer;
}

.selected {
  border-color: #f59315;
  color: #f59315;
}

.operation-button:hover {
  border-width: 1px;
  border-style: solid;
  border-color: #f59315;
  color: #f59315;
}
</style>