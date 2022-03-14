<template>
  <div v-if="data" style="color:white;">
    <el-container direction="horizontal">
      <el-aside v-if="!disableAvatar" width="50px">
        <wb-user-avatar v-if="data.authorId" :id="data.authorId" />
      </el-aside>
      <el-main style="text-align: left">
        <!--      微博名 -->
        <b>
          <wb-user-link v-if="data.authorId" :id="data.authorId" />
        </b>
        <span v-if="data && isComment">:</span>
        <wb-status-content v-if="data && isComment" :data="data" style="display:inline-block" />

        <!--      时间 来自 -->
        <div v-if="data.timestamp" class="common-text">
          <div v-if="isComment">
            <el-row>
              <el-col :span="12" style="text-align:left">
                <span class="common-text">{{ data.timestamp.create.before || data.timestamp.create.datetime }}</span>
              </el-col>
              <el-col :span="12" style="text-align:right">
                <wb-status-operation-buttons v-if="data.counts" :id="data.id" :counts="data.counts" is-comment style="display:inline-block" />
              </el-col>
            </el-row>
          </div>
          <el-tooltip v-else effect="light">
            <template #content>
              <div>{{ data.timestamp.create.datetime }}</div>
              <my-copy-button :text="`https://weibo.com/${data.authorId}/${data.blog.uuid}`">复制来源网址</my-copy-button>
            </template>
            <router-link :to="{name:'单个动态',params:{uid:data.authorId,uuid:data.blog.uuid}}">
              <el-link :underline="false" type="info">
                <span class="common-text">{{ data.timestamp.create.before || data.timestamp.create.datetime }}</span>
              </el-link>
            </router-link>
            <!--            </el-link>-->
          </el-tooltip>
          <span v-if="data.source"> 来自：{{ data.source }}</span>
          <span v-if="data.counts && data.counts.editCount" class="clickable" @click="getEditHistory(data.id)"> 已编辑({{ data.counts.editCount }})</span>

        </div>
        <!--       正文-->
        <wb-status-content v-if="data && !isComment" :data="data" />
        <!--        被转发微博-->
        <div v-if="data.retweeted">
          <el-divider content-position="left">转发</el-divider>
          <wb-status-card :id="data.retweeted" disable-avatar is-retweeted />
        </div>
        <!--       媒体-->
        <div v-if="pageInfo">
          <!--          文章-->
          <div v-if="pageInfo.type==='article'">
            <el-link :href="`https://weibo.com/ttarticle/p/show?id=${pageInfo.id}`" target="_blank">
              <div>
                <el-image :src="picBig.url" :style="picBig" />
                <span style="position: absolute; bottom: 20px; left: 20px;font-size: 20px;color:white;background-color: rgba(33,37,42,0.71)">{{ pageInfo.content[0] }}</span>
                <el-image :src="pageInfo.typeIcon" style="position: absolute; top: 20px; right: 20px;background-color: rgba(33,37,42,0.71)" />
              </div>
            </el-link>
          </div>
          <!--          直播-->
          <div v-if="pageInfo.type==='live'">
            <el-link :href="`https://weibo.com/l/wblive/p/show/${pageInfo.objectId}`" target="_blank">
              <div style="max-width: 50%">
                <el-image :src="pageInfo.backgroundImage" />
              </div>
            </el-link>
          </div>
          <!--       视频-->
          <div v-if="pageInfo.type==='video'">
            <div>
              <!--              <el-link :href="pageInfo.urls.h5" target="_blank" type="success">-->
              <!--                {{ pageInfo.content[0] }}-->
              <!--              </el-link>-->
              <wb-status-video :url="pageInfo.urls.mp4Hd" />
            </div>

          </div>

          <!--          todo 互动投票-->
          <div>

          </div>

        </div>
        <!--       图片-->
        <div v-if="data.pictures &&  data.pictures.length>0">
          <span v-for="(url,i) in thumbnail">
            <el-image
                :initial-index="i"
                :preview-src-list="largest"
                :src="url"
                :style="imageStyle"
                fit="cover"
                hide-on-click-modal
                referrer-policy="no-referrer"
            />
            <br v-if="thumbnail.length===9 && i%3===2" />
          </span>
        </div>
        <!--       转发、评论、点赞-->
        <div v-if="data && !disableOperationButtons && !isComment">
          <wb-status-operation-buttons v-if="data.counts" :id="data.id" :counts="data.counts" :is-retweeted="isRetweeted" />
        </div>


        <el-dialog v-model="showHistory" append-to-body title="编辑记录" width="70%">
          <div v-for="status in history" style="border: 1px solid #949494;margin-bottom: 2px">
            <wb-status-card :status="status" disable-avatar disable-operation-buttons />
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import WbUserLink from "@/components/weibo/WbUserLink";
import WbUserAvatar from "@/components/weibo/WbUserAvatar";
import WbStatusContent from "@/components/weibo/WbStatusContent";
import {replaceImageUrl} from "@/assets/js/request/feed";
import WbStatusVideo from "@/components/weibo/WbStatusVideo";
import WbStatusOperationButtons from "@/components/weibo/WbStatusOperationButtons";
import MyCopyButton from "@/components/common/my-copy-button";
import {getEditHistory} from "@/assets/js/request/statuses";

export default {
  name: "WbStatusCard",
  components: {MyCopyButton, WbStatusOperationButtons, WbStatusVideo, WbStatusContent, WbUserAvatar, WbUserLink},

  data() {
    return {
      data: undefined,
      thumbnail: [],
      largest: [],
      pageInfo: undefined,
      picBig: undefined,
      imageStyle: {
        width: "150px",
        height: "150px",
        "border-radius": "15px",
      },
      history: [],
      showHistory: false,
    }
  },
  computed: {},
  methods: {
    ...mapGetters('Groups', [`getStatusFromCache`]),
    getEditHistory(id) {
      getEditHistory(id).then(res => {
        this.history = res;
        this.showHistory = true;
      })
    },
    load(id) {
      const data = id > 0 ? this.getStatusFromCache()(id) : this.status;
      if (!data) {
        return;
      }
      this.data = data
      this.pageInfo = data.pageInfo
      if (data.pageInfo) {
        const picInfo = data.pageInfo.picInfo;
        if (picInfo) {
          this.picBig = picInfo.pic_big;
        }
      }
      const pics = data.pictures;
      this.largest = pics.map(i => replaceImageUrl(i.urls.largest.url))
      this.thumbnail = pics.map(i => replaceImageUrl(i.urls.bmiddle.url))
      if (pics.length !== 1) {
        this.imageStyle.width = "150px";
        this.imageStyle.height = "150px";
      } else {
        const {height, width} = pics[0].urls.bmiddle
        this.imageStyle.width = `${width}`;
        this.imageStyle.height = `${height}`;
      }
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
    status: {type: Object,},
    id: {type: Number,},
    disableAvatar: {type: Boolean, default: false},
    disableOperationButtons: {type: Boolean, default: false},
    isRetweeted: {type: Boolean, default: false},
    isComment: {type: Boolean, default: false},
  },
}

</script>

<style scoped>


</style>