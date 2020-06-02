<template>
  <v-content>
    <v-container>
      <v-card>
        <v-card-title>
          {{ userInfo.email }}
        </v-card-title>
        <v-card-text>
          <div>Registered on: {{ formattedDate() }}</div>
          <div>Successfully Trade: {{ userInfo.successTrade }}</div>
          <v-row>
            <v-col cols="3" md="2" lg="1">
              <v-icon>thumb_up</v-icon>
              {{ userInfo.goodRate }}
            </v-col>
            <v-col cols="3" md="2" lg="1">
              <v-icon>thumb_down</v-icon>
              {{ userInfo.badRate }}
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card class="mt-5 pb-1">
        <v-tabs v-model="tab">
          <v-tab>Item</v-tab>
          <v-tab>Comment</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <item-card
              v-for="i in userInfo.items"
              :key="i.id"
              :item="i"
              :show-user="false"
            >
              <template v-slot:inner-bottom>
                <v-row no-gutters class="grey--text mb-2" align="center">
                  <v-col cols="12" sm="auto" class="pr-1">Post On: </v-col>
                  <v-col cols="12" sm="auto">{{
                    formattedDate(i.createdOn)
                  }}</v-col>
                </v-row>
                <v-row no-gutters class="grey--text" align="center">
                  <v-col cols="12" sm="auto" class="pr-1">Status: </v-col>
                  <v-col cols="12" sm="auto">
                    {{ getTradeStatus(i.tradeStatus) }}
                  </v-col>
                </v-row>
                <v-row
                  no-gutters
                  v-if="
                    i.tradeStatus == 0 &&
                      userInfo.userId == $store.state.userInfo.userId
                  "
                >
                  <v-btn
                    class="grey darken-2"
                    dark
                    @click="popCancelItemDialog(i)"
                    >Cancel Item</v-btn
                  >
                </v-row>
              </template>
            </item-card>
          </v-tab-item>
          <v-tab-item>
            <v-card
              class="ma-2 pa-3"
              v-for="c in userInfo.comments"
              :key="c.id"
            >
              <div>
                <v-chip small v-if="c.type == 0">Seller</v-chip>
                <v-chip small v-else>Buyer</v-chip>
                <router-link :to="`/profile/${c.fromUser.id}`" class="ml-3">{{
                  c.fromUser.email
                }}</router-link>
              </div>
              <div>
                <v-row justify="center">
                  <v-col cols="auto">
                    <v-icon v-if="c.rate == 0">thumb_up</v-icon>
                    <v-icon v-else>thumb_down</v-icon>
                  </v-col>
                  <v-col>
                    <pre>{{ c.comment }}</pre>
                  </v-col>
                </v-row>
              </div>
              <div class="caption grey--text">
                Item:
                <router-link :to="`/item/${c.item.id}`">{{
                  c.item.name
                }}</router-link>
              </div>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-container>
    <v-dialog v-model="showCancelDialog" max-width="400">
      <v-card>
        <v-card-title>
          Cancel Item
        </v-card-title>
        <v-card-text>
          <p>Are you sure to cancel the item?</p>
          <p>All trade request of this item will be cancelled.</p>
        </v-card-text>
        <v-card-actions>
          <v-btn class="primary" @click="cancelItem">Confirm</v-btn>
          <v-btn @click="showCancelDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script lang="ts">
import Vue from "vue";
import Axios from "axios";
import moment from "moment";
import ItemCardVue from "../components/ItemCard.vue";
export default Vue.extend({
  components: {
    "item-card": ItemCardVue
  },
  name: "Profile",
  props: {
    id: {
      type: [String],
      required: false,
      default: null
    }
  },
  watch: {
    id: {
      immediate: true,
      handler() {
        this.getUserInfo();
      }
    }
  },
  methods: {
    popCancelItemDialog(item: any) {
      this.dialogItem = item;
      this.showCancelDialog = true;
    },
    cancelItem() {
      Axios.post(`/item/${this.dialogItem.id}/cancel`);
      this.showCancelDialog = false;
      this.getUserInfo();
    },
    async getUserInfo() {
      const resp = await Axios.get(
        `/user/info/${this.id || this.$store.state.userInfo.userId}`
      );
      const data = resp.data;
      if (!data.success) {
        this.$router.replace("/");
      }
      this.userInfo = data.result;
    },
    formattedDate() {
      return moment(this.userInfo.createdOn).format("YYYY-MM-DD HH:mm");
    },
    getTradeStatus(s: number) {
      if (s == 0) {
        return "Available";
      }
      if (s == 1) {
        return "Trading";
      }
      if (s == 2) {
        return "Trade Successfuly";
      }
      if (s == 3) {
        return "Cancelled";
      }
    },
    createdTime(t: number) {
      return moment(t).format("YYYY-MM-DD HH:mm");
    }
  },
  data() {
    return {
      showCancelDialog: false,
      tab: 0,
      dialogItem: {
        id: ""
      },
      userInfo: {
        id: "",
        email: "",
        phoneNumber: "",
        createdOn: "",
        items: [
          {
            id: "",
            name: "",
            price: ""
          }
        ]
      }
    };
  }
});
</script>

