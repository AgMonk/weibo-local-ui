<!--解析回复正文 需要处理的内容： 话题 、@ -->

<template>
  <div>
    <div v-for="(line,i) in textHtml">
      <!--          todo 解析回复-->
      <!--      {{ line }}-->
      <span v-html="line"></span>
      <!--          todo 展开请求-->
      <span v-if="isLongText && i===textHtml.length-1" class="clickable" style="color:#a3ffcc" @click="getLongText">...[展开]</span>
    </div>
  </div>
</template>

<script>
import {getLongText} from "@/assets/js/request/statuses";
import {mapGetters} from "vuex";
import {getUrlHtml} from "@/assets/js/request/feed";

export default {
  name: "WbStatusContent",
  data() {
    return {
      text: [],
      textHtml: [],
      isLongText: false,
    }
  },
  computed: {},
  methods: {
    ...mapGetters("Emotions", [`getEmotionFromMap`]),
    parse(data) {
      this.text = data.text
      this.textHtml = data.textHtml
          .map(i => this.replaceEmotions(i))
          .map(i => this.replaceUrl(i))
      this.isLongText = data.isLongText
    },
    getLongText() {
      getLongText(this.data.blog.uuid).then(res => {
        this.data.textHtml = res
        this.textHtml = res
            .map(i => this.replaceEmotions(i))
            .map(i => this.replaceUrl(i))
        this.isLongText = false;
      })
    },
    replaceUrl(t) {
      if (!this.data.urlStruct) {
        return t
      }
      this.data.urlStruct.forEach(item => {
        const {shortUrl, text, url, color} = item
        t = t.replace(shortUrl, getUrlHtml(url, text, color));
      })
      return t;
    },
    replaceEmotions(text) {
      let t = text;
      const pattern = /\[.+?]/g
      let res;
      while (res = pattern.exec(text)) {
        const m = res[0]
        const e = this.getEmotionFromMap()(m);
        if (e) {
          t = t.replace(m, `<img alt="" src="${e.url}"/>`)
        }
      }
      return t;
    }
  },
  mounted() {
    this.parse(this.data)
  },
  watch: {
    data(to) {
      if (to) {
        this.parse(to)
      }
    }
  },
  props: {
    data: {type: Object, required: true,},
  },
}

</script>

<style scoped>
a {
  color: red;
}
</style>