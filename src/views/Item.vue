<template>
  <v-content>
    <v-container>
      <v-card>
        <v-row>
          <v-col cols="auto">
            <v-img
              :src="`/images/${itemData.images[0]}`"
              width="256"
              height="256"
              contain
              v-if="imageAvaliable"
            ></v-img>
            <v-img
              src="@/assets/no-image.png"
              width="256"
              height="256"
              contain
              v-else
            ></v-img>
          </v-col>
          <v-col class="pl-6">
            <v-row>
              <v-col class="headline">{{ itemData.name }}</v-col>
            </v-row>
            <v-row justify="center" align="center" no-gutters>
              <v-col cols="auto" class="pr-2">
                <v-chip v-if="itemData.status == '0'" class="success"
                  >New</v-chip
                >
                <v-chip v-if="itemData.status == '1'">Used</v-chip>
              </v-col>
              <v-col class="headline orange--text"
                >HK${{ itemData.price }}
                {{ itemData.negotiable ? "(Negotiable)" : "" }}</v-col
              >
            </v-row>
            <v-row>
              <v-col class="grey--text" cols="12">
                Seller:
                <router-link :to="`/profile/${itemData.owner.id}`">{{
                  itemData.owner.email
                }}</router-link>
                <v-btn
                  small
                  class="ml-3"
                  @click="sendMessage(itemData.owner.email, itemData.name)"
                  >Contact</v-btn
                >
              </v-col>
              <v-col class="grey--text" cols="12">
                Posted On: {{ createdTime() }}
              </v-col>
              <v-col class="grey--text" cols="12">
                Status: {{ getTradeStatus() }}
              </v-col>
              <v-col class="grey--text" cols="12">
                Warranty: {{ itemData.warranty == 0 ? "No" : "Yes" }}
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  class="orange"
                  :dark="!getOfferAvailable()"
                  :disabled="getOfferAvailable()"
                  @click="showSendTradeDialog()"
                >
                  Send Trade Request
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
      <v-card class="mt-4" v-if="imageAvaliable">
        <v-card-title>
          Tags
        </v-card-title>
        <v-divider></v-divider>
        <v-row class="mx-4" v-if="itemData.tags.length > 0">
          <v-col v-for="(tag, idx) in itemData.tags" :key="idx" cols="auto">
            <v-chip>{{ tag }}</v-chip>
          </v-col>
        </v-row>
        <v-card-text v-else>
          Not tags available in this item
        </v-card-text>
      </v-card>

      <v-card class="mt-4" v-if="imageAvaliable">
        <v-card-title>
          Images
        </v-card-title>
        <v-row class="mx-4">
          <v-col v-for="(img, idx) in itemData.images" :key="idx" cols="auto">
            <div>
              <v-img
                height="128"
                width="128"
                :src="`/images/${img}`"
                @click="selectedImage = idx"
              ></v-img>
            </div>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col>
            <div>
              <v-img
                :src="`/images/${itemData.images[selectedImage]}`"
                height="512"
                contain
              ></v-img>
            </div>
          </v-col>
        </v-row>
      </v-card>

      <v-card class="mt-4">
        <v-card-title>
          Description
        </v-card-title>
        <v-card-text>
          <v-row class="mx-5">
            <pre style="word-wrap: break-word; white-space: pre-wrap;">{{
              itemData.description
            }}</pre>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
    <v-dialog max-width="400" v-model="showTradeRequestDialog">
      <v-card>
        <v-card-title>
          Send Trade Request
        </v-card-title>
        <v-card-text>
          <p>Are you sure to send a trade request to the seller?</p>
          <p>
            You are recommended to contact the seller before make a request.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn class="primary" @click="sendTradeRequest">Confirm</v-btn>
          <v-btn @click="showTradeRequestDialog = false">Cancel</v-btn>
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
  name: "Item",
  props: {
    id: {
      type: [String],
      required: true
    }
  },
  watch: {
    id: {
      immediate: true,
      handler() {
        this.getItem();
      }
    }
  },
  methods: {
    sendMessage(to: string, title: string) {
      this.$store.commit("sendMessageTo", {
        to: to,
        title: `Enquiry: ${title}`
      });
    },
    showSendTradeDialog() {
      if (!this.$store.state.loggedIn) {
        this.$router.push({
          path: "/login",
          query: {
            goto: this.$route.path
          }
        });
        return;
      }
      this.showTradeRequestDialog = true;
    },
    async sendTradeRequest() {
      this.showTradeRequestDialog = false;
      const resp = await Axios.post(`/item/${this.itemData.id}/trade`);
      if (resp.data.success) {
        this.$router.push(`/mytrade/buy`);
      }
    },
    getOfferAvailable() {
      return !(
        this.getTradeStatus() == "Available" &&
        this.$store.state.userInfo.userId != this.itemData.owner.id
      );
    },
    getTradeStatus() {
      if (this.itemData.tradeStatus == 0) {
        return "Available";
      }
      if (this.itemData.tradeStatus == 1) {
        return "Trading";
      }
      if (this.itemData.tradeStatus == 2) {
        return "Trade Successfuly";
      }
      if (this.itemData.tradeStatus == 3) {
        return "Cancelled";
      }
    },
    createdTime() {
      return moment(this.itemData.createdOn).format("YYYY-MM-DD HH:mm");
    },
    async getItem() {
      const item = await Axios.get(`/item/${this.id}`);
      if (!item.data.success) {
        this.$router.replace("/");
      }
      item.data.result.images = JSON.parse(item.data.result.images);
      item.data.result.tags = JSON.parse(item.data.result.tags);
      this.itemData = item.data.result;
    },
    imageAvaliable() {
      return this.itemData.images.length > 0 && this.itemData.images[0] != "";
    }
  },
  data() {
    return {
      showTradeRequestDialog: false,
      selectedImage: 0,
      itemData: {
        tradeStatus: 0,
        trade: {
          status: "0"
        },
        createdOn: "",
        id: "",
        images: [""],
        status: "0",
        name: "",
        description: "",
        warranty: true,
        price: 0,
        negotiable: false,
        tags: [""],
        owner: {
          id: "",
          email: "",
          phoneNumber: ""
        }
      }
    };
  }
});
</script>

