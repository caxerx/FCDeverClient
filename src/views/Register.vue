<template>
  <v-row align="center" justify="center" class="grey darken-3">
    <v-dialog v-model="showErrorDialog" max-width="300">
      <v-card>
        <v-card-title>
          Error
        </v-card-title>
        <v-card-text>
          {{ errorMessage }}
        </v-card-text>
        <v-card-actions>
          <v-btn class="grey darken-3" dark @click="showErrorDialog = false"
            >OK</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card class="px-3">
      <v-card-title>Register</v-card-title>
      <v-card-text>
        <v-row class="mb-3">
          <v-text-field
            outlined
            hide-details
            label="Email"
            name="email"
            v-model="email"
          ></v-text-field>
        </v-row>
        <v-row>
          <v-text-field
            outlined
            hide-details
            label="Password"
            type="password"
            name="password"
            v-model="password"
          ></v-text-field>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn text class="grey darken-3" dark @click="register">Register</v-btn>
        <v-spacer></v-spacer>
        <router-link to="/login">Back to login</router-link>
      </v-card-actions>
    </v-card>
  </v-row>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      email: "",
      password: "",
      showErrorDialog: false,
      errorMessage: ""
    };
  },
  methods: {
    async register() {
      const res = await this.$store.dispatch("register", {
        email: this.email,
        password: this.password
      });
      if (res !== true) {
        this.errorMessage = res;
        this.showErrorDialog = true;
      } else {
        this.$router.replace("/");
      }
    }
  }
});
</script>