<template>
  <el-avatar :size="size" :src="data[type]"/>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "WbUserAvatar",
  data() {
    return {
      data:{},
    }
  },
  computed: {},
  methods: {
    ...mapGetters('User', [`getUserFromCache`]),
    load(id) {
      this.data = this.getUserFromCache()(id).avatars
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
    size: {
      type: Number,
      default: 50,
    },
    type: {
      type: String,
      default: 'small'
    }
  },
}

</script>

<style scoped>

</style>