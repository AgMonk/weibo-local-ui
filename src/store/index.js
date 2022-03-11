import {createStore} from 'vuex'
import Loading from "@/store/Loading";
import Groups from "@/store/Groups";
import User from "@/store/User";
import Emotions from "@/store/Emotions";

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    Loading, Groups, User, Emotions
  }
})
