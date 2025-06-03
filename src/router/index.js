import { createRouter, createWebHistory } from "vue-router";
import { maintenanceService } from "../services/maintenanceService"; // Tambahkan ini
import { removeFromStorage } from "../utils/localStorage"; // Tambahkan ini

// Import your views
import LandingPage from "../user/views/guest/LandingPage.vue";
import JobSearch from "../user/views/guest/JobSearch.vue";
import DetailJob from "../user/views/guest/DetailJob.vue";
import Login from "../user/views/auth/Login.vue";
import Register from "../user/views/auth/Register.vue";
import DetailProfil from "../user/views/auth/DetailProfil.vue";
import SkillRegister from "../user/views/auth/SkillRegister.vue";
import LengkapiProfil from "../user/views/auth/LengkapiProfil.vue";
import LandingPageUser from "../user/views/authenticated/LandingPage.vue";
import JobSearchUser from "../user/views/authenticated/JobSearch.vue";
import DetailJobUser from "../user/views/authenticated/DetailJob.vue";
import Recommendation from "../user/views/authenticated/Recommendation.vue";
import EditProfil from "../user/views/authenticated/EditProfil.vue";
import Bookmark from "../user/views/authenticated/Bookmark.vue";
import UbahPassword from "../user/views/authenticated/UbahPassword.vue";
import DetailJobAuth from "../user/views/authenticated/DetailJobAuth.vue";
import Maintenance from "../user/views/maintenance.vue";

// Admin views
const AdminLayout = () => import("../admin/components/AdminLayout.vue");
const AdminDashboard = () => import("../admin/views/Dashboard.vue");
const DataUser = () => import("../admin/views/DataUser.vue");
const DataPekerjaan = () => import("../admin/views/DataPekerjaan.vue");
const DataReport = () => import("../admin/views/DataReport.vue");
const Scraping = () => import("../admin/views/Scraping.vue");

// Define routes
const routes = [
  {
    path: "/",
    name: "LandingPage",
    component: LandingPage,
    meta: { guestOnly: true },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { guestOnly: true },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { guestOnly: true },
  },
  {
    path: "/register/detail",
    name: "detail-register",
    component: DetailProfil,
    meta: { guestOnly: true },
  },
  {
    path: "/register/skill",
    name: "skill-register",
    component: SkillRegister,
    meta: { guestOnly: true },
  },
  {
    path: "/register/lengkapi-profil",
    name: "lengkapi-profil",
    component: LengkapiProfil,
    meta: { guestOnly: true },
  },
  {
    path: "/job-search",
    name: "job-search",
    component: JobSearch,
    meta: { guestOnly: true },
  },
  {
    path: "/detail-job",
    name: "detail-job",
    component: DetailJob,
    meta: { guestOnly: true },
  },
  {
    path: "/home",
    name: "Home",
    component: LandingPageUser,
    meta: { requiresAuth: true },
  },
  {
    path: "/home/job-search",
    name: "job-search-user",
    component: JobSearchUser,
    meta: { requiresAuth: true },
  },
  {
    path: "/home/detail-job",
    name: "detail-job-user",
    component: DetailJobUser,
    meta: { requiresAuth: true },
  },
  {
    path: "/home/detail-job-auth",
    name: "detail-job-user-auth",
    component: DetailJobAuth,
    meta: { requiresAuth: true },
  },
  {
    path: "/recommendation",
    name: "recommendation",
    component: Recommendation,
    meta: { requiresAuth: true },
  },
  {
    path: "/edit-profil",
    name: "edit-profil",
    component: EditProfil,
    meta: { requiresAuth: true },
  },
  {
    path: "/bookmark",
    name: "bookmark",
    component: Bookmark,
    meta: { requiresAuth: true },
  },
  {
    path: "/ubah-password",
    name: "ubah-password",
    component: UbahPassword,
    meta: { requiresAuth: true },
  },

  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAdmin: true }, // Add this meta property
    children: [
      {
        path: "",
        name: "admin-dashboard",
        component: AdminDashboard,
      },
      {
        path: "users",
        name: "admin-users",
        component: DataUser,
      },
      {
        path: "lowongan",
        name: "admin-lowongan",
        component: DataPekerjaan,
      },
      {
        path: "lowongan/detail/:id",
        name: "admin-lowongan-detail",
        component: () => import("../admin/views/DetailPekerjaan.vue"),
      },
      {
        path: "scraping",
        name: "admin-scraping",
        component: Scraping,
      },
      {
        path: "report",
        name: "admin-report",
        component: DataReport,
      },
      {
        path: "report/detail/:id",
        name: "admin-report-detail",
        component: () => import("../admin/views/DetailReport.vue"),
      },
    ],
  },
  // 404 Not Found route
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
  {
    path: "/maintenance",
    name: "maintenance",
    component: Maintenance,
  },
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  // Safe way to access localStorage (in case it's not available)
  const getFromStorage = (key) => {
    try {
      if (typeof localStorage !== "undefined") {
        return localStorage.getItem(key);
      }
      return null;
    } catch (e) {
      console.error("Error accessing localStorage:", e);
      return null;
    }
  };

  // Cek status maintenance
  let isMaintenance = false;
  try {
    isMaintenance = await maintenanceService.getMaintenanceStatus();
  } catch (e) {
    isMaintenance = false;
  }

  // Jika maintenance aktif
  if (isMaintenance) {
    // Untuk halaman login, register, lengkapi-profil
    const maintenanceRoutes = [
      "/login",
      "/register",
      "/register/lengkapi-profil",
    ];
    if (maintenanceRoutes.includes(to.path)) {
      return next("/maintenance");
    }
    // Untuk halaman yang butuh auth
    if (to.meta.requiresAuth) {
      removeFromStorage("user-id");
      removeFromStorage("user-name");
      removeFromStorage("user-token");
      removeFromStorage("token-expired-date");
      removeFromStorage("user-profile-picture");
      removeFromStorage("user-email");
      removeFromStorage("user-refresh-token");
      removeFromStorage("user-role");
      return next("/maintenance");
    }
  }

  // Logic for routes that require admin authentication
  const isAuthenticated = !!getFromStorage("user-id");
  const isAdmin = !!getFromStorage("admin-id");
  if (to.matched.some((record) => record.meta.requiresAdmin)) {
    if (!isAdmin) {
      return next("/login");
    }
  }
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      return next("/login");
    }
  }
  if (to.meta.guestOnly && (isAuthenticated || isAdmin)) {
    return isAdmin ? next("/admin") : next("/home");
  }

  next();
});

export default router;
