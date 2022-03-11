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
    <span class="operation-button">
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
    <el-col :span="6 " class="operation-button"><!--todo 转发-->
      <el-icon>
        <share />
      </el-icon>
                                                转发
      <span v-if="counts"> ({{ counts.reposts }})</span>
    </el-col>
    <el-col :span="6 " class="operation-button"><!--todo 评论-->
      <el-icon>
        <comment />
      </el-icon>
                                                评论
      <span v-if="counts"> ({{ counts.comments }})</span>
    </el-col>
    <el-col :span="6 " class="operation-button"><!--todo 点赞-->
      <el-icon>
        <circle-check />
      </el-icon>
      <span v-if="counts"> ({{ counts.attitudes }})</span>
    </el-col>
  </el-row>

</template>
<script>
import {CircleCheck, Comment, Share} from "@element-plus/icons-vue";

export default {
  name: "WbStatusOperationButtons",
  components: {Share, Comment, CircleCheck},
  data() {
    return {}
  },
  computed: {},
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    isRetweeted: {type: Boolean, default: false},
    counts: {type: Object},
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

.operation-button:hover {
  border-width: 1px;
  border-style: solid;
  border-color: #f59315;
  color: #f59315;
}
</style>