import Vue from "vue";
import ElementUI, { Notification } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";

Vue.prototype.$notify = Notification;

Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: (h) => h(App),
});
