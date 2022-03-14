import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import Clipboard from 'v-clipboard3';

import './assets/js/base/DateEnhancement'
import './assets/js/base/ArrayEnhancement'
import './assets/css/global.css'
import VideoPlayer from 'vue-video-player/src'
import WbStatusOperationButtons from "@/components/weibo/WbStatusOperationButtons";
import WbStatusCard from "@/components/weibo/WbStatusCard";

require('vue-video-player/src/custom-theme.css')
require('video.js/dist/video-js.css')

createApp(App)
    .component(WbStatusOperationButtons.name, WbStatusOperationButtons)
    .component(WbStatusCard.name, WbStatusCard)
    .use(VideoPlayer)
    .use(Clipboard)
    .use(ElementPlus, {locale: zhCn,})
    .use(store).use(router)
    .mount('#app')

