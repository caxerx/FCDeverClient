import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loggedIn: false,
    userInfo: {
      userId: "",
      email: "",
      phoneNumber: "",
    },
    showSendMessageDialog: false,
    messageTo: "",
    messageTitle: "",
  },
  mutations: {
    sendMessageTo(state, s) {
      state.showSendMessageDialog = true;
      state.messageTo = s.to;
      state.messageTitle = s.title;
    },
    showSendMessageDialog(state, s) {
      state.showSendMessageDialog = s;
      state.messageTo = "";
      state.messageTitle = "";
    },
    setUserState(state, userState) {
      if (userState.id) {
        userState.userId = userState.id;
      }
      state.userInfo = userState;
    },
    setLoggedIn(state, loggedIn) {
      state.loggedIn = loggedIn;
    },
  },
  actions: {
    async login(context, loginInfo) {
      const data = await Axios.post("/user/login", loginInfo);
      if (data.data.success) {
        context.commit("setLoggedIn", true);
        context.commit("setUserState", data.data.result);
        return true;
      }
      return data.data.message;
    },
    async register(context, loginInfo) {
      const data = await Axios.post("/user/register", loginInfo);
      if (data.data.success) {
        context.commit("setLoggedIn", true);
        const uinfo = await Axios.get("/user/info");
        context.commit("setUserState", uinfo.data.result);
        return true;
      }
      return data.data.message;
    },
    async logout(context) {
      context.commit("setLoggedIn", false);
    },
  },
});
