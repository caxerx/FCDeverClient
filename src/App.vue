<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Axios from "axios";
export default Vue.extend({
  name: "App",
  async created() {
    console.log(process.env.VUE_APP_API_BASE_URL);
    const myInfo = await Axios.get("/user/info");
    if (myInfo.data.success) {
      this.$store.commit("setLoggedIn", true);
      this.$store.commit("setUserState", myInfo.data.result);
      if (this.$route.path == "/login") {
        const goto = `${this.$route.query.goto || "/"}`;
        this.$router.replace(goto);
      }
    }
  },
  data() {
    return {};
  },
  methods: {}
});
</script>
