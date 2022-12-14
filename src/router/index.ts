import Vue from "vue";
import VueRouter, { NavigationGuardNext, Route, RouteConfig } from "vue-router";
import Login from "@/views/Login.vue";
import AdminLogin from "@/views/AdminLogin.vue";
import Project from "@/views/Project.vue";
import ProjectInfo from "@/views/ProjectInfo.vue";
import Repository from "@/views/Repository.vue";
import GithubAuthorize from "@/components/GithubAuthorize.vue";
import RepoInfo from "@/views/RepoInfo.vue";
import JiraInfo from "@/views/JiraInfo.vue";
import ScheduleInfo from "@/views/ScheduleInfo.vue";
import MeetingMinuteInfo from "@/views/MeetingMinuteInfo.vue";
import NotFound from "@/views/NotFound.vue";
import store from "@/store";
import Manage from "@/views/Manage.vue";
Vue.use(VueRouter);

const checkAuth = (
  isNeedAuth: boolean,
  isNotMatchTo: string,
  next: NavigationGuardNext<Vue>
) => {
  const isMatch = isNeedAuth
    ? store.auth.isAuthenticated
    : !store.auth.isAuthenticated;
  if (isMatch) next();
  else next({ name: isNotMatchTo });
};

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Login",
    component: Login,
    beforeEnter: (to, from, next) => checkAuth(false, "Project", next)
  },
  {
    path: "/oauth-callback/github",
    component: GithubAuthorize
  },
  {
    path: "/admin",
    name: "AdminLogin",
    component: AdminLogin,
    beforeEnter: (to, from, next) => checkAuth(false, "Manage", next)
  },
  {
    path: "/project",
    name: "Project",
    component: Project,
    beforeEnter: (to, from, next) => checkAuth(true, "Login", next)
  },
  {
    path: "/project/:projectId",
    name: "ProjectInfo",
    component: ProjectInfo,
    beforeEnter: (to, from, next) => checkAuth(true, "Login", next)
  },
  {
    path: "/project/:projectId/repo/:repoId",
    name: "RepoInfo",
    component: RepoInfo,
    beforeEnter: (to, from, next) => checkAuth(true, "Login", next)
  },
  {
    path: "/project/:projectId/jira/:repoId",
    name: "JiraInfo",
    component: JiraInfo,
    beforeEnter: (to, from, next) => checkAuth(true, "Login", next)
  },
  {
    path: "/project/:projectId/schedule/:scheduleId",
    name: "ScheduleInfo",
    component: ScheduleInfo,
    beforeEnter: (to, from, next) => checkAuth(true, "Login", next)
  },
  {
    path: "/project/:projectId/meetingMinute/:meetingMinuteId",
    name: "MeetingMinuteInfo",
    component: MeetingMinuteInfo,
    beforeEnter: (to, from, next) => checkAuth(true, "Login", next)
  },
  {
    path: "*",
    name: "NotFound",
    component: NotFound
  },
  {
    path: "/admin/manage",
    name: "Manage",
    component: Manage,
    beforeEnter: (to, from, next) => {
      if (store.auth.isAuthenticated && store.auth.getAuthority == "Admin") {
        next();
      } else {
        next({ name: "Login" });
      }
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
