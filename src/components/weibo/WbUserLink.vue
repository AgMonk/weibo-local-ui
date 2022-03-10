<template>
  <el-tooltip placement="top">
    <!--    <router-link :to>-->
    <el-link :style="`font-size: ${size}px;`" :type="type" :underline="false">
      {{ data.name }}
    </el-link>
    <!--    </router-link>-->

  </el-tooltip>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "WbUserLink",
  data() {
    return {
      data:{},
    }
  },
  computed: {},
  methods: {
    ...mapGetters('User', [`getUserFromCache`]),
    load(id) {
      this.data = this.getUserFromCache()(id)
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
      default: 15,
    },
    type: {
      type: String,
      default: 'primary'
    }
  },
}

</script>

<style scoped>

</style>