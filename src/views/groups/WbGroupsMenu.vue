<template>
  <el-menu v-loading="loading" :element-loading-spinner="svg"
           active-text-color="#ffd04b"
           background-color="#545c64"
           direction="vertical"
           element-loading-background="rgba(0, 0, 0, 0.8)"
           element-loading-svg-view-box="-10, -10, 50, 50"
           element-loading-text="加载中..."
           router
           text-color="#fff"
           :default-openeds="['默认分组']"
           unique-opened
           :default-active="findIndexByTitle(defaultTitle)"
  >
    <el-sub-menu v-for="group in groups" :index="group.title" style="min-width:150px">
      <template #title>
        <el-icon>
          <folder />
        </el-icon>
        <span class="group-title">{{ group.title }}</span>
        <!--        todo 隐藏该分组按钮-->
      </template>
      <el-menu-item v-for="item in group.data" :index="`/my-groups/${item.gid}`" style="min-width:150px">
        {{ item.title }}
        <!--        todo 隐藏该分组按钮-->
      </el-menu-item>
    </el-sub-menu>

  </el-menu>
</template>

<script>
import {mapActions, mapState} from "vuex";
import {autoRetry} from "@/assets/js/utils/RequestUtils";
import {Folder} from "@element-plus/icons-vue";

export default {
  name: "WbGroupsMenu",
  components: {Folder},
  data() {
    return {
      defaultTitle:'最新微博',
      loading: false,
      groups: [],
    }
  },
  computed: {
    ...mapState("Loading", [`svg`]),

  },
  methods: {
    ...mapActions("Groups", [`getAllGroups`]),
    findIndexByTitle(title){
      for (let i = 0; i < this.groups.length; i++) {
        const data = this.groups[i].data
        for (let j = 0; j < data.length; j++) {
          const item = data[j]
          if (item.title===title){
            return `/my-groups/${item.gid}`
          }
        }
      }
    },
    loadGroups(force) {
      this.loading = true;
      this.getAllGroups(force).then(res => {
        this.groups = res.filter(res => res.data && res.data.length > 0);
        this.loading = false;
        console.log(this.groups)
        if (this.$route.name==='我的分组'){
          this.$router.push(this.findIndexByTitle(this.defaultTitle))
        }
      }).catch(reason => autoRetry(reason, () => this.loadGroups(force)))
    }
  },
  mounted() {
    this.loadGroups()
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