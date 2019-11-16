import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import routes from "./router.js";
import Vuelidate from "vuelidate";

Vue.config.productionTip = false

Vue.use(VueRouter);
Vue.use(Vuelidate);


const router = new VueRouter({
  linkExactActiveClass: "active",
  routes
});

new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
