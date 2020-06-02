<template>
  <v-content>
    <v-container>
      <v-card class="pa-3">
        <div class="mb-2">
          <v-text-field
            outlined
            label="Keyword or Tags"
            prepend-inner-icon="search"
            hide-details
            v-model="search.keyword"
          ></v-text-field>
        </div>
        <div class="subtitle mb-3">Advance Search</div>
        <v-row class="mx-5">
          <v-col cols="12" md="6">
            <v-row>
              <div class="caption">Order by</div>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  label="Order By"
                  solo
                  v-model="search.order_field"
                  :items="orderFieldOptions"
                  item-text="label"
                  item-value="value"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  label="Order"
                  solo
                  v-model="search.order"
                  :items="orderOptions"
                  item-text="label"
                  item-value="value"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <div class="caption">Price Range</div>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  solo
                  label="From"
                  v-model="search.price_from"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  solo
                  label="To"
                  v-model="search.price_to"
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6">
            <v-row>
              <div class="caption">Warranty</div>
            </v-row>
            <v-row>
              <v-col>
                <v-select
                  label="Warranty"
                  solo
                  v-model="search.warranty"
                  :items="warrantyOptions"
                  item-text="label"
                  item-value="value"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <div class="caption">Item Status</div>
            </v-row>
            <v-row>
              <v-col>
                <v-select
                  label="Item Status"
                  solo
                  v-model="search.item_status"
                  :items="itemStatusOptions"
                  item-text="label"
                  item-value="value"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
      <v-card class="pa-2">
        <item-card v-for="i in searchResult" :key="i" :item="i" :user="i.owner">
        </item-card>
      </v-card>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import Vue from "vue";
import Axios from "axios";
import ItemCardVue from "../components/ItemCard.vue";
export default Vue.extend({
  name: "Search",
  components: {
    "item-card": ItemCardVue
  },
  watch: {
    "$route.query": {
      immediate: true,
      handler(value) {
        this.$set(this, "search", { ...this.search, ...value });
      }
    },
    search: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$router.replace({
          path: "/search",
          query: value as any
        });
        Axios.get("/search", {
          params: value
        }).then(res => {
          if (res.data.success) {
            this.$set(this, "searchResult", res.data.result);
          }
        });
      }
    }
  },
  data() {
    return {
      warrantyOptions: [
        {
          label: "Any",
          value: -1
        },
        {
          label: "Yes",
          value: 1
        },
        {
          label: "No",
          value: 0
        }
      ],
      itemStatusOptions: [
        {
          label: "Any",
          value: -1
        },
        {
          label: "New",
          value: 0
        },
        {
          label: "Used",
          value: 1
        }
      ],
      orderFieldOptions: [
        {
          label: "Post Date",
          value: "createdOn"
        },
        {
          label: "Name",
          value: "name"
        },
        {
          label: "Price",
          value: "price"
        }
      ],
      orderOptions: [
        {
          label: "Descending",
          value: "DESC"
        },
        {
          label: "Ascending",
          value: "ASC"
        }
      ],
      search: {
        keyword: "",
        order_field: "createdOn",
        order: "DESC",
        price_from: null,
        price_to: null,
        warranty: -1,
        item_status: -1
      },
      searchResult: []
    };
  }
});
//keyword=&price_from=&price_to=&order_field=&order=&negotiable_price=&item_status=&warranty=
</script>
