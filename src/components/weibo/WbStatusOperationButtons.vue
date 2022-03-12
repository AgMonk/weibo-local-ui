<template>
  <div v-if="isRetweeted" style="text-align: right">
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
    <span class="operation-button">
      <el-icon>
        <comment />
      </el-icon>
      <span v-if="counts"> ({{ counts.comments }})</span></span>
    <span :class="`operation-button ${liked?'liked':''}`" @click="switchLike">
      <el-icon>
        <circle-check />
      </el-icon>
      <span v-if="counts"> ({{ counts.attitudes }})</span></span>
  </div>
  <el-row v-else>
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

</template>
<script>
import {CircleCheck, Comment, Share} from "@element-plus/icons-vue";
import {cancelLike, setLike} from "@/assets/js/request/statuses";
import {ElMessage} from "element-plus";

export default {
  name: "WbStatusOperationButtons",
  components: {Share, Comment, CircleCheck},
  data() {
    return {
      liked: false,
      showComment: false,
      showRepost: false,
    }
  },
  computed: {},
  methods: {
    clickRepost() {
      this.showComment = false;
      this.showRepost = !this.showRepost;

      //  todo 请求转发内容
    },
    clickComment() {
      this.showComment = !this.showComment;
      this.showRepost = false;

      //  todo 请求评论内容
    },
    switchLike() {
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
  },
  mounted() {
    this.liked = !!this.counts.attitudesStatus
  },
  watch: {
    counts(to) {
      this.liked = to.attitudesStatus
    }
  },
  props: {
    isRetweeted: {type: Boolean, default: false},
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