<template>
  <v-content>
    <v-container>
      <v-row>
        <v-col cols="12"><h1 class="display-1">My Message</h1></v-col>
        <v-col cols="12">
          <v-divider> </v-divider>
        </v-col>
      </v-row>
      <v-card>
        <v-tabs v-model="tab">
          <v-tab>Received</v-tab>
          <v-tab>Sent</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-list>
              <v-list-item
                three-line
                v-for="i in messageReceived"
                :key="i.key"
                @click="showMessage(i, true)"
              >
                <v-list-item-content>
                  <v-list-item-title
                    ><v-chip color="red" dark v-if="!i.read" small>New</v-chip>
                    {{ i.title }}</v-list-item-title
                  >
                  <v-list-item-subtitle>
                    From: {{ i.fromUser.email }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    {{ substr(i.message) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-tab-item>
          <v-tab-item>
            <v-list>
              <v-list-item
                three-line
                v-for="i in messageSent"
                :key="i.key"
                @click="showMessage(i, false)"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ i.title }}</v-list-item-title>
                  <v-list-item-subtitle>
                    To: {{ i.toUser.email }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    {{ substr(i.message) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-container>
    <v-dialog v-model="showMessageDialog" max-width="500">
      <v-card>
        <v-card-title>
          {{ dialogMessage.title }}
        </v-card-title>
        <v-card-text>
          <div>
            From:
            <router-link :to="`/profile/${dialogMessage.fromUser.id}`">{{
              dialogMessage.fromUser.email
            }}</router-link>
          </div>
          <div>
            To:
            <router-link :to="`/profile/${dialogMessage.toUser.id}`">{{
              dialogMessage.toUser.email
            }}</router-link>
          </div>
          <div>
            Send Time:
            {{ formatDate(dialogMessage.createdOn) }}
          </div>
          <v-textarea
            hide-details
            readonly
            outlined
            v-model="dialogMessage.message"
          ></v-textarea>
        </v-card-text>
        <v-card-actions v-if="replyBtn">
          <v-spacer></v-spacer>
          <v-btn @click="replyMessage()">Reply</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script lang="ts">
import Vue from "vue";
import Axios from "axios";
import moment from "moment";
export default Vue.extend({
  name: "Message",
  async mounted() {
    const received = await Axios.get("/message/received");
    if (received.data.success) {
      this.$set(this, "messageReceived", received.data.result);
    }

    const sent = await Axios.get("/message/sent");
    if (sent.data.success) {
      this.$set(this, "messageSent", sent.data.result);
    }
  },
  data() {
    return {
      tab: 0,
      messageReceived: [],
      messageSent: [],
      replyBtn: false,
      dialogMessage: {
        title: "",
        message: "",
        fromUser: {
          email: ""
        },
        toUser: {
          email: ""
        }
      },
      showMessageDialog: false
    };
  },
  methods: {
    formatDate(date: string) {
      return moment(date).format("YYYY-MM-DD HH:mm");
    },
    replyMessage() {
      this.showMessageDialog = false;
      this.$store.commit("sendMessageTo", {
        to: this.dialogMessage.fromUser.email,
        title: `Re: ${this.dialogMessage.title}`
      });
    },
    showMessage(i: any, reply: boolean) {
      this.replyBtn = reply;
      this.dialogMessage = i;
      this.showMessageDialog = true;
    },
    substr(msg: string) {
      return msg.substring(0, 50);
    }
  }
});
</script>
