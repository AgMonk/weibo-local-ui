<template>
  <el-menu v-loading="loading"
           :default-active="$route.path"
           :default-openeds="['默认分组','我的分组']"
           :element-loading-spinner="svg"
           active-text-color="#ffd04b"
           background-color="#545c64"
           direction="vertical"
           element-loading-background="rgba(0, 0, 0, 0.8)"
           element-loading-svg-view-box="-10, -10, 50, 50"
           element-loading-text="加载中..."
           router
           text-color="#fff"
           @select="select"
  >
    <el-sub-menu v-for="group in groups" :index="group.title" style="min-width:150px">
      <template #title>
        <el-icon>
          <folder />
        </el-icon>
        <span class="group-title">{{ group.title }}</span>
      </template>
      <el-menu-item v-for="item in group.data" :index="`/my-groups/${item.prefix}/${item.gid}`" style="min-width:150px">
        {{ item.title }}
        <el-tag v-if="item.unread" effect="dark" style="padding:0 2px;margin-left: 5px" type="danger">{{ item.unread }}</el-tag>
      </el-menu-item>
    </el-sub-menu>

  </el-menu>
</template>

<script>
import {mapActions, mapState} from "vuex";
import {autoRetry} from "@/assets/js/utils/RequestUtils";
import {Folder} from "@element-plus/icons-vue";
import {getUnreadHint} from "@/assets/js/request/message";

export default {
  name: "WbGroupsMenu",
  components: {Folder},
  data() {
    return {
      defaultTitle: '最新微博',
      loading: false,
      groups: [],
      interval: undefined,
    }
  },
  computed: {
    ...mapState("Loading", [`svg`]),

  },
  methods: {
    ...mapActions("Groups", [`getAllGroups`]),
    findIndexByTitle(title) {
      for (let i = 0; i < this.groups.length; i++) {
        const data = this.groups[i].data
        for (let j = 0; j < data.length; j++) {
          const item = data[j]
          if (item.title === title) {
            return `/my-groups/${item.prefix}/${item.gid}`
          }
        }
      }
    },
    findGroupByGid(gid) {
      for (let i = 0; i < this.groups.length; i++) {
        const data = this.groups[i].data
        for (let j = 0; j < data.length; j++) {
          const item = data[j]
          if (item.gid === gid) {
            return item
          }
        }
      }
    },
    select(index) {
      const gid = Number(index.substring(index.lastIndexOf('/') + 1))
      const group = this.findGroupByGid(gid)
      delete group.unread
    },
    loadGroups(force) {
      this.loading = true;
      this.getAllGroups(force).then(res => {
        //移除多余分组
        res[0].data.splice(3, res[0].data.length - 3)
        console.log(res)
        this.groups = res.filter(res => res.data && res.data.length > 0);
        this.loading = false;
        if (this.$route.name === '我的分组') {
          this.$router.push(this.findIndexByTitle(this.defaultTitle))
        }
      }).catch(reason => autoRetry(reason, () => this.loadGroups(force)))
    },
    getUnreadHint() {
      const groupIds = [
        ...this.groups[0].data.slice(1, 3).map(i => i.gid),
        ...this.groups[1].data.map(i => i.gid)
      ]
      getUnreadHint(groupIds).then(map => {
        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < this.groups[i].data.length; j++) {
            const group = this.groups[i].data[j]
            if (map.hasOwnProperty(group.gid)) {
              group.unread = map[group.gid];
            }
          }
        }
      })
    },
  },
  mounted() {
    this.loadGroups()

    this.interval = setInterval(() => {
      this.getUnreadHint()
    }, 60000)
  },
  unmounted() {
    clearInterval(this.interval)
  },
  watch: {},
  props: {},
}

</script>

<style scoped>
.group-title {
  color: #6adc92;
}
</style>