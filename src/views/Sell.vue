<template>
  <v-content>
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="display-3">Sell Item</div>
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12">
          <v-file-input
            v-model="files"
            color="deep-purple accent-4"
            counter
            label
            multiple
            placeholder="Upload Images"
            prepend-icon="mdi-paperclip"
            outlined
          >
            <template v-slot:selection="{ index, text }">
              <div class="ma-2" v-if="index < 5">
                <v-img
                  :src="`/images/${findImage(index).url}`"
                  v-if="findImage(index) != null"
                  width="150"
                  height="150"
                  contain
                >
                  <v-chip
                    color="deep-purple accent-4"
                    dark
                    label
                    small
                    style="max-width:140px"
                    >{{ text }}</v-chip
                  >
                </v-img>
              </div>
              <span
                v-else-if="index === 5"
                class="overline grey--text text--darken-3 mx-2"
                >+{{ files.length - 2 }} File(s)</span
              >
            </template>
          </v-file-input>
        </v-col>
        <v-col cols="12">
          <div class="caption">Item Status</div>
          <v-radio-group v-model="item.status">
            <v-row no-gutters>
              <v-col cols="6" md="4" lg="2">
                <v-radio label="New" :value="0"></v-radio>
              </v-col>
              <v-col cols="6" md="4" lg="2">
                <v-radio label="Used" :value="1"></v-radio>
              </v-col>
            </v-row>
          </v-radio-group>
        </v-col>
        <v-col cols="12">
          <div class="caption">Item Name</div>
        </v-col>
        <v-col cols="12">
          <v-text-field
            outlined
            label="Item Name"
            v-model="item.name"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <div class="caption">Item Description</div>
        </v-col>
        <v-col cols="12">
          <v-textarea
            outlined
            label="Item Description"
            hide-details
            v-model="item.description"
          ></v-textarea>
        </v-col>
        <v-col cols="12">
          <v-checkbox label="Warranty" v-model="item.warranty"></v-checkbox>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="12">
          <div class="caption">
            Price
          </div>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            outlined
            label="Price"
            prepend-icon="attach_money"
            v-model="item.price"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-checkbox label="Negotiable"></v-checkbox>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="12">
          <div class="caption">
            Tags
          </div>
        </v-col>
        <v-col cols="12">
          <v-combobox
            v-model="tags"
            label="Tags"
            multiple
            chips
            deletable-chips
            append-icon=""
            outlined
          ></v-combobox>
        </v-col>
        <v-col>
          <v-btn class="primary" @click="submit">Post Item</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import Vue from "vue";
import Axios from "axios";
export default Vue.extend({
  name: "Sell",
  created() {
    this.files.splice(0, this.files.length);
  },
  methods: {
    async submit() {
      this.item.tags = JSON.stringify(this.tags);
      this.item.images = JSON.stringify(this.preview.map(p => p.url));
      const resp = await Axios.post("/item", this.item);
      if (resp.data.success) {
        this.$router.replace(`/item/${resp.data.result.itemId}`);
      }
    },
    findImage(index: number) {
      return this.preview.find(p => p.index == index);
    }
  },
  data() {
    return {
      files: [{} as File],
      preview: [
        {
          index: 1,
          url: ""
        }
      ],
      tags: [],
      item: {
        images: "",
        status: 0,
        name: "",
        description: "",
        warranty: false,
        price: null,
        negotiable: false,
        tags: ""
      }
    };
  },
  watch: {
    files() {
      this.preview.splice(0, this.preview.length);
      this.files.forEach((f, index) => {
        const formData = new FormData();
        formData.append("file", f);
        Axios.post("/file", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }).then(resp => {
          if (resp.data.success) {
            this.preview.push({ index: index, url: resp.data.result });
          }
        });
      });
    }
  }
});
</script>
