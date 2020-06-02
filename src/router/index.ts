import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Search from "../views/Search.vue";
import Sell from "../views/Sell.vue";
import Profile from "../views/Profile.vue";
import AppFrame from "../AppFrame.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Item from "../views/Item.vue";
import Trade from "../views/Trade.vue";
import Message from "../views/Message.vue";
import store from "../store";
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "App",
    component: AppFrame,
    children: [
      {
        path: "/",
        name: "Home",
        component: Home,
        meta: {
          title: "Home",
        },
      },
      {
        path: "/search",
        name: "Search",
        component: Search,
        meta: {
          title: "Search",
        },
      },
      {
        path: "/sell",
        name: "Sell",
        component: Sell,
        meta: {
          title: "Sell Item",
          login: true,
        },
      },
      {
        path: "/myprofile",
        name: "Profile",
        component: Profile,
        meta: {
          title: "My Profile",
          login: true,
        },
      },
      {
        path: "/mytrade/:type",
        name: "Trade",
        component: Trade,
        meta: {
          title: "My Trade",
          login: true,
        },
        props: true,
      },
      {
        path: "/profile/:id",
        name: "Profile",
        component: Profile,
        meta: {
          title: "Profile",
        },
        props: true,
      },
      {
        path: "/message",
        name: "Message",
        component: Message,
        meta: {
          title: "Message",
          login: true,
        },
      },
      {
        path: "/item/:id",
        name: "Item",
        component: Item,
        meta: {
          title: "Item",
        },
        props: true,
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "Login",
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      title: "Register",
    },
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name == "Login" && store.state.loggedIn) {
    next("/");
  } else if (to.meta.login && !store.state.loggedIn) {
    next({
      path: "/login",
      query: {
        goto: to.path,
      },
    });
  } else {
    next();
  }
  document.title = `${to.meta.title} - FCDever`;
});

export default router;
