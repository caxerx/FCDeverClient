<template>
  <div>
    <v-navigation-drawer app clipped v-model="drawer">
      <v-list dense rounded>
        <v-list-item class="primary" dark link @click="routerTo('/sell')">
          <v-list-item-icon>
            <v-icon>add</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Sell Item</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click="routerTo('/myprofile')">
          <v-list-item-icon>
            <v-icon>person</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>My Profile</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click="routerTo('/mytrade/sell')">
          <v-list-item-icon>
            <v-icon>shopping_bag</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title
              >My Trades
              {{ unreadTrade > 0 ? `(${unreadTrade})` : "" }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app elevate-on-scroll clipped-left class="grey-darken-2" dark>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        v-if="$vuetify.breakpoint.mdAndDown"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>
        <v-img
          src="@/assets/logo.png"
          height="60px"
          width="150px"
          @click="routerTo('/')"
        ></v-img>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="$store.state.loggedIn">
        <div class="mr-2">
          {{ $store.state.userInfo.email }}
        </div>
        <v-btn icon @click="routerTo('/message')"
          ><v-badge dot color="red" v-if="unreadMessage > 0">
            <v-icon>email</v-icon>
          </v-badge>
          <v-icon v-else>email</v-icon>
        </v-btn>
        <v-btn icon @click="logout">
          <v-icon>exit_to_app</v-icon>
        </v-btn>
      </template>
      <div v-else>
        <v-btn icon @click="login">
          <v-icon>lock</v-icon>
        </v-btn>
      </div>
    </v-app-bar>
    <router-view></router-view>
    <v-dialog v-model="showSendMessageDialog" max-width="500">
      <v-card>
        <v-card-title>
          <v-text-field
            label="Message Title"
            outlined
            v-model="message.title"
          ></v-text-field>
        </v-card-title>
        <v-card-text>
          <v-text-field
            outlined
            label="Message To"
            v-model="message.to"
          ></v-text-field>
          <v-textarea
            hide-details
            outlined
            v-model="message.message"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="sendMessage()">Send</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="messageSentSnackbar">
      Message Sent
      <v-btn color="pink" text @click="messageSentSnackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Axios from "axios";
export default Vue.extend({
  name: "AppFrame",
  mounted() {
    this.interval = setInterval(async () => {
      const res = await Axios.get("/trade/unread");
      if (res.data.success) {
        this.unreadTrade = res.data.result;
      } else {
        this.unreadTrade = 0;
      }
    }, 5000);

    this.interval2 = setInterval(async () => {
      const res = await Axios.get("/message/unread");
      if (res.data.success) {
        this.unreadMessage = res.data.result;
      } else {
        this.unreadMessage = 0;
      }
    }, 5000);
  },
  beforeDestroy() {
    if (this.interval != null) {
      clearInterval(this.interval as any);
    }
    if (this.interval2 != null) {
      clearInterval(this.interval2 as any);
    }
  },
  data() {
    return {
      interval: null as any,
      interval2: null as any,
      messageSentSnackbar: false,
      unreadTrade: 0,
      unreadMessage: 0,
      drawer: true,
      showSendMessageDialog: false,
      message: {
        title: "",
        to: "",
        message: ""
      }
    };
  },
  watch: {
    "$store.state.showSendMessageDialog"(val) {
      this.showSendMessageDialog = val;
      if (val) {
        this.message.to = this.$store.state.messageTo;
        this.message.title = this.$store.state.messageTitle;
      }
    },
    showSendMessageDialog(val) {
      if (!val) {
        this.$store.commit("showSendMessageDialog", false);
        this.message.to = "";
        this.message.title = "";
        this.message.message = "";
      }
    }
  },
  methods: {
    login() {
      this.$router.push({
        path: "/login",
        query: {
          goto: this.$route.fullPath
        }
      });
    },
    logout() {
      this.$store.dispatch("logout");
    },
    routerTo(url: string) {
      this.$router.push(url);
    },
    async sendMessage() {
      if (!this.$store.state.loggedIn) {
        this.login();
        return;
      }
      const res = await Axios.post("/message", this.message);
      if (res.data.success) {
        this.messageSentSnackbar = true;
        this.showSendMessageDialog = false;
      }
    }
  }
});
</script>
