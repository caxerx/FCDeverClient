<template>
  <v-card class="ma-2">
    <slot name="header"></slot>
    <v-row no-gutters>
      <v-col cols="12" md="auto">
        <v-img
          :src="`/images/${parsedItem.images[0]}`"
          width="150"
          height="200"
          v-if="parsedItem.images[0]"
        ></v-img>
        <v-img
          width="150"
          height="200"
          v-else
          src="@/assets/no-image.png"
        ></v-img>
      </v-col>
      <v-col class="pa-3">
        <slot name="top"></slot>
        <v-row no-gutters align="center">
          <v-col>
            <router-link :to="`/item/${parsedItem.id}`">{{
              parsedItem.name
            }}</router-link>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="auto" class="pr-0">
            <v-chip v-if="parsedItem.status == 0" class="success" small
              >New</v-chip
            >
            <v-chip v-if="parsedItem.status == 1" small>Used</v-chip>
          </v-col>
          <v-col class="orange--text">HK${{ parsedItem.price }}</v-col>
        </v-row>
        <v-row no-gutters v-if="showUser">
          <v-row no-gutters class="grey--text mb-2" align="center">
            <v-col cols="12" sm="auto" class="pr-1"> {{ userTitle }}: </v-col>
            <v-col cols="12" sm="auto">
              <router-link :to="`/profile/${user.id}`">{{
                user.email
              }}</router-link>
              <v-btn
                small
                class="ml-3"
                @click="sendMessage(user.email, parsedItem.name)"
                >Contact</v-btn
              >
            </v-col>
          </v-row>
        </v-row>
        <slot name="inner-bottom"></slot>
      </v-col>
      <slot name="outer-bottom"></slot>
    </v-row>
    <slot name="footer"></slot>
  </v-card>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    userTitle: {
      type: String,
      default: "Seller"
    },
    showUser: {
      type: Boolean,
      default: true
    },
    user: {
      type: Object,
      default: (): Record<string, any> => ({
        id: "",
        email: "",
        phoneNumber: "",
        createdOn: ""
      })
    },
    item: {
      type: Object,
      default: (): Record<string, any> => ({
        id: "",
        images: "[]",
        status: 0,
        tradeStatus: 0,
        name: "",
        description: "",
        warranty: false,
        price: 0,
        negotiable: false,
        tags: "[]",
        createdOn: ""
      })
    }
  },
  methods: {
    sendMessage(to: string, title: string) {
      this.$store.commit("sendMessageTo", {
        to: to,
        title: `Enquiry: ${title}`
      });
    }
  },
  computed: {
    parsedItem() {
      return {
        ...this.item,
        images: JSON.parse(this.item.images || "[]"),
        tags: JSON.parse(this.item.tags || "[]")
      };
    }
  }
});
</script>