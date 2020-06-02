<template>
  <v-content>
    <v-container>
      <v-row>
        <v-col cols="12"><h1 class="display-1">My Trade</h1></v-col>
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-tabs v-model="tab">
              <v-tab>Sell</v-tab>
              <v-tab>Buy</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <item-card
                  :item="i.item"
                  :user="i.buyer"
                  user-title="Buyer"
                  v-for="i in sellTrade"
                  :key="i.id"
                >
                  <template v-slot:inner-bottom>
                    <v-row no-gutters class="grey--text mb-2" align="center">
                      <v-col cols="12" sm="auto" class="pr-1"
                        >Request Time:
                      </v-col>
                      <v-col cols="12" sm="auto">
                        {{ formatTime(i.createdOn) }}
                      </v-col>
                    </v-row>

                    <v-row no-gutters class="grey--text" align="center">
                      <v-col cols="12" sm="auto" class="pr-1">Status: </v-col>
                      <v-col cols="12" sm="auto">
                        {{ getSellStatus(i.status) }}
                      </v-col>
                    </v-row>
                  </template>
                  <template v-slot:outer-bottom>
                    <v-col cols="auto">
                      <v-row
                        justify="center"
                        align="center"
                        no-gutters
                        class="fill-height"
                        v-if="i.status == 0"
                      >
                        <v-col cols="12">
                          <v-btn icon @click="popAcceptTradeDialog(i)"
                            ><v-icon>check</v-icon></v-btn
                          >
                        </v-col>
                        <v-col cols="12">
                          <v-btn icon @click="popRejectTradeDialog(i)">
                            <v-icon>close</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-row
                        justify="center"
                        align="center"
                        no-gutters
                        class="fill-height"
                        v-if="i.status == 4 && !i.sellerComment"
                      >
                        <v-col cols="12" class="pr-3">
                          <v-btn icon @click="popCommentDialog(i, i.buyer)"
                            ><v-icon>comment</v-icon></v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-col>
                  </template>
                </item-card>
              </v-tab-item>
              <v-tab-item>
                <item-card
                  :item="i.item"
                  :user="i.seller"
                  v-for="i in buyTrade"
                  :key="i.id"
                >
                  <template v-slot:inner-bottom>
                    <v-row no-gutters class="grey--text mb-2" align="center">
                      <v-col cols="12" sm="auto" class="pr-1"
                        >Request Time:
                      </v-col>
                      <v-col cols="12" sm="auto">
                        {{ formatTime(i.createdOn) }}
                      </v-col>
                    </v-row>
                    <v-row no-gutters class="grey--text" align="center">
                      <v-col cols="12" sm="auto" class="pr-1">Status: </v-col>
                      <v-col cols="12" sm="auto">
                        {{ getBuyStatus(i.status) }}
                      </v-col>
                    </v-row>
                  </template>
                  <template v-slot:outer-bottom>
                    <v-col cols="auto">
                      <v-row
                        justify="center"
                        align="center"
                        no-gutters
                        class="fill-height"
                        v-if="i.status == 1"
                      >
                        <v-col cols="12" class="pr-3">
                          <v-btn icon @click="popConfirmTradeDialog(i)"
                            ><v-icon>check</v-icon></v-btn
                          >
                        </v-col>
                      </v-row>

                      <v-row
                        justify="center"
                        align="center"
                        no-gutters
                        class="fill-height"
                        v-if="i.status == 4 && !i.buyerComment"
                      >
                        <v-col cols="12" class="pr-3">
                          <v-btn icon @click="popCommentDialog(i, i.seller)"
                            ><v-icon>comment</v-icon></v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-col>
                  </template>
                </item-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog max-width="400" v-model="showAcceptTradeDialog">
      <v-card>
        <v-card-title>
          Accept Trade
        </v-card-title>
        <v-card-text>
          <p>Are you sure to accept the trade?</p>
          <p>Other request of same item will be rejected.</p>
        </v-card-text>
        <v-card-actions>
          <v-btn class="primary" @click="acceptTrade">Confirm</v-btn>
          <v-btn @click="showAcceptTradeDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog max-width="400" v-model="showRejectTradeDialog">
      <v-card>
        <v-card-title>
          Reject Trade
        </v-card-title>
        <v-card-text>
          <p>Are you sure to reject the trade?</p>
        </v-card-text>
        <v-card-actions>
          <v-btn class="primary" @click="rejectTrade">Confirm</v-btn>
          <v-btn @click="showRejectTradeDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog max-width="400" v-model="showConfirmTradeDialog">
      <v-card>
        <v-card-title>
          Confirm Trade
        </v-card-title>
        <v-card-text>
          <p>Are you sure to confirm the trade?</p>
          <p>Do NOT confirm the trade before you received the goods.</p>
        </v-card-text>
        <v-card-actions>
          <v-btn class="primary" @click="confirmTrade">Confirm</v-btn>
          <v-btn @click="showConfirmTradeDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog max-width="400" v-model="showCommentDialog">
      <v-card>
        <v-card-title>
          Comments
        </v-card-title>
        <v-card-text>
          <p>To: {{ dialogUser.email }}</p>
          <div>
            <v-radio-group v-model="rate">
              <v-row no-gutters>
                <v-col cols="auto">
                  <v-radio :value="0"></v-radio>
                </v-col>
                <v-col cols="auto">
                  <v-icon>thumb_up</v-icon>
                </v-col>
                <v-col cols="2"></v-col>
                <v-col cols="auto">
                  <v-radio :value="1"></v-radio>
                </v-col>
                <v-col cols="auto">
                  <v-icon>thumb_down</v-icon>
                </v-col>
              </v-row>
            </v-radio-group>
          </div>
          <v-textarea outlined hide-details v-model="comment"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn class="primary" @click="sendComment">Confirm</v-btn>
          <v-btn @click="showCommentDialog = false">Cancel</v-btn>
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
  name: "Trade",
  props: {
    type: {
      type: String,
      default: "sell"
    }
  },
  mounted() {
    this.reloadTrade();
  },
  watch: {
    type: {
      immediate: true,
      handler(val) {
        if (val == "sell" && this.tab != 0) {
          this.tab = 0;
        } else if (val == "buy" && this.tab != 1) {
          this.tab = 1;
        }
      }
    },
    tab: {
      immediate: true,
      handler(val) {
        if (val == 0) {
          this.$router.push("/mytrade/sell");
        } else {
          this.$router.push("/mytrade/buy");
        }
      }
    }
  },
  methods: {
    formatTime(time: string) {
      return moment(time).format("YYYY-MM-DD HH:mm");
    },
    reloadTrade() {
      this.getSellTrade();
      this.getBuyTrade();
    },
    async getSellTrade() {
      const resp = await Axios.get("/trade/sell");
      if (resp.data.success) {
        this.$set(this, "sellTrade", resp.data.result);
      }
    },
    async getBuyTrade() {
      const resp = await Axios.get("/trade/buy");
      if (resp.data.success) {
        this.$set(this, "buyTrade", resp.data.result);
      }
    },
    getBuyStatus(i: number) {
      if (i == 0) {
        return "Waiting for seller accept";
      }
      if (i == 1) {
        return "Waiting for confirm";
      }
      if (i == 2) {
        return "Seller rejected";
      }
      if (i == 3) {
        return "Seller cancelled the item";
      }
      if (i == 4) {
        return "Trade Successfully";
      }
    },
    getSellStatus(i: number) {
      if (i == 0) {
        return "Pending";
      }
      if (i == 1) {
        return "Waiting for buyer confirm";
      }
      if (i == 2) {
        return "Rejected";
      }
      if (i == 3) {
        return "Item Cancelled";
      }
      if (i == 4) {
        return "Trade Successfully";
      }
    },
    popAcceptTradeDialog(trade: any) {
      this.dialogTrade = trade;
      this.showAcceptTradeDialog = true;
    },
    popRejectTradeDialog(trade: any) {
      this.dialogTrade = trade;
      this.showRejectTradeDialog = true;
    },
    popConfirmTradeDialog(trade: any) {
      this.dialogTrade = trade;
      this.showConfirmTradeDialog = true;
    },
    popCommentDialog(trade: any, user: any) {
      this.comment = "";
      this.rate = 0;
      this.dialogTrade = trade;
      this.dialogUser = user;
      this.showCommentDialog = true;
    },
    async acceptTrade() {
      this.showAcceptTradeDialog = false;
      await Axios.post(`/trade/${this.dialogTrade.id}/accept`);
      this.reloadTrade();
    },
    async rejectTrade() {
      this.showRejectTradeDialog = false;
      await Axios.post(`/trade/${this.dialogTrade.id}/reject`);
      this.reloadTrade();
    },
    async confirmTrade() {
      this.showConfirmTradeDialog = false;
      await Axios.post(`/trade/${this.dialogTrade.id}/confirm`);
      this.reloadTrade();
    },
    async sendComment() {
      this.showCommentDialog = false;
      await Axios.post(`/trade/${this.dialogTrade.id}/comment`, {
        rate: this.rate,
        comment: this.comment
      });
      this.reloadTrade();
    }
  },
  data() {
    return {
      showAcceptTradeDialog: false,
      showRejectTradeDialog: false,
      showConfirmTradeDialog: false,
      showCommentDialog: false,
      comment: "",
      rate: 0,
      dialogTrade: {
        id: "",
        status: 0,
        sellerRead: false,
        buyerRead: false,
        buyerComment: false,
        sellerComment: false,
        item: {
          id: "",
          images: "",
          status: 0,
          tradeStatus: 0,
          name: "",
          description: "",
          warranty: false,
          price: 0,
          negotiable: false,
          tags: "",
          createdOn: "",
          owner: {
            id: "",
            email: "",
            phoneNumber: "",
            createdOn: ""
          }
        }
      },
      dialogUser: {
        id: "",
        email: "",
        phoneNumber: "",
        createdOn: ""
      },
      tab: 0,
      sellTrade: [],
      buyTrade: [],
      commentTrade: {
        user: {
          email: ""
        },
        trade: {}
      }
    };
  }
});
</script>
