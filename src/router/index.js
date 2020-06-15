import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Multi from "../views/Multi.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/multi",
    name: "Multi",
    component: Multi
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/create-api",
    name: "CreateApi",
    // route level code-splitting
    // this generates a separate chunk (Api.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "CreateApi" */ "../views/CreateApi.vue")
  },
  {
    path: "/edit",
    name: "Edit",
    component: () => import(/* webpackChunkName: "Edit" */ "../views/Edit.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
