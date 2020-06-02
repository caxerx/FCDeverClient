<template>
  <v-content>
    <v-container style="max-width:1200px">
      <v-card class="pa-3">
        <div class="mb-2">
          <v-form @submit.prevent="search">
            <v-text-field
              outlined
              label="Search"
              prepend-inner-icon="search"
              hide-details
              v-model="keyword"
            ></v-text-field>
          </v-form>
        </div>

        <div class="headline">Hot Search</div>
        <div class="d-flex flex-row flex-wrap">
          <v-chip
            v-for="i in hotSearch"
            :key="i.keyword"
            class="ma-1"
            @click="searchKw(i.keyword)"
            >{{ i.keyword }}</v-chip
          >
        </div>
      </v-card>
      <h1 class="display-1 mt-5">Discover</h1>
      <v-row>
        <v-col v-for="(i, index) in items" :key="index">
          <v-card max-width="300" @click="routeToItem(i.id)" class="mx-auto">
            <v-img
              height="250"
              :src="`/images/${i.images[0]}`"
              v-if="i.images[0]"
            ></v-img>
            <v-img height="250" v-else src="@/assets/no-image.png"></v-img>
            <v-card-text class="text--primary">
              <div>
                {{ i.name }}
              </div>
              <div class="orange--text">
                <v-chip v-if="i.status == 0" class="success" small>
                  New
                </v-chip>
                <v-chip v-if="i.status == 1" small>Used</v-chip>
                HK${{ i.price }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import Vue from "vue";
import Axios from "axios";
export default Vue.extend({
  name: "Home",
  mounted() {
    this.items.splice(0, this.items.length);
    this.getDiscover();
  },
  methods: {
    searchKw(kw: string) {
      this.keyword = kw;
      this.search();
    },
    search() {
      this.$router.push({
        path: "/search",
        query: {
          keyword: this.keyword
        }
      });
    },
    routeToItem(itemId: string) {
      this.$router.push(`/item/${itemId}`);
    },
    async getDiscover() {
      const data = await Axios.get("/item");
      const result = data.data.result;
      result.forEach((r: any) => {
        r.images = JSON.parse(r.images);
        this.items.push(r);
      });

      const datahs = await Axios.get("/search/keyword");
      const resulths = datahs.data.result;
      this.$set(this, "hotSearch", resulths);
    }
  },
  data() {
    return {
      keyword: "",
      hotSearch: [{ keyword: "" }],
      items: [
        {
          images: [""],
          name: "",
          price: 0
        }
      ]
    };
  }
});
</script>
