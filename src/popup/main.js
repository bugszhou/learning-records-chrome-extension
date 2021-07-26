import Vue from "vue";
import {
  Notification,
  Menu,
  Submenu,
  MenuItem,
  Button,
  Input,
  Table,
  TableColumn,
  DatePicker,
  TimePicker,
  Tabs,
  TabPane,
  Collapse,
  CollapseItem,
  Dialog,
  Form,
  FormItem,
  Card,
} from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";

Vue.prototype.$notify = Notification;

Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Button);
Vue.use(Input);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(TimePicker);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Card);
/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: (h) => h(App),
});
