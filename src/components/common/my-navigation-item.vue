<template>
  <el-sub-menu v-if="route&&route.children" :index="path">
    <template #title>{{ route.name }}</template>
    <my-navigation-item v-for="(child,i) in route.children" :key="i" :route="child" :parent-path="path"/>
  </el-sub-menu>
  <el-menu-item v-else-if="route && (!route.permission || isPermitted(route.permission))" :index="path">
    {{ route.name }}
  </el-menu-item>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "my-navigation-item",
  data() {
    return {
      path: this.parentPath + (this.route.path.startsWith(`/`) ? `` : `/`) + this.route.path
    }
  },
  methods: {
  },
  computed: {
    ...mapGetters({
      isPermitted: `user/isPermitted`,
    }),
  },
  mounted() {
    // console.log(this.route.children)
  },
  props: {
    route: {
      required: true
    },
    parentPath: {
      type: String,
    }
  },
}

</script>

<style scoped>

</style>