<template>
 <div style="color:white">
   <el-container direction="horizontal">
     <el-aside width="50px" v-if="!disableAvatar">
<!--       todo 头像-->
       <el-avatar :size="50" />
     </el-aside>
     <el-main style="text-align: left">
<!--      微博名 -->
         <h4>{{data.author.name}}</h4>
<!--      时间 来自 -->
<!--       正文-->
<!--       媒体-->
<!--       转发、评论、点赞-->
     </el-main>
   </el-container>
 </div>
</template>

<script>
export default {
  name: "WbStatusCard",
  data() {
    return {}
  },
  computed: {},
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    data:{type:Object,required:true,},
    disableAvatar:{type:Boolean,default:false},
  },
}

</script>

<style scoped>

</style>