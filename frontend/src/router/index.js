import { createRouter, createWebHistory } from 'vue-router';
import authStore from '../stores/authStore';

// Vistas existentes
import HomeView from '../views/HomeView.vue';
import ForumView from '../views/ForumView.vue';
import PostDetailView from '../views/PostDetailView.vue';
import CreatePostView from '../views/CreatePostView.vue';
import EditPostView from '../views/EditPostView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import GuideView from '../views/GuideView.vue';
import AboutView from '../views/AboutView.vue';
import DonateView from '../views/DonateView.vue';
import VideosView from '../views/VideosView.vue';
import ProfileView from '../views/ProfileView.vue';
import MyPostsView from '../views/MyPostsView.vue';

// ── Nuevas vistas ──
import AdminView from '../views/AdminView.vue';
import QuestionnaireView from '../views/QuestionnaireView.vue';
import GlucoseView from '../views/GlucoseView.vue';

const routes = [
  // ── Rutas existentes ──
  { path: '/', name: 'Home', component: HomeView },
  { path: '/forum', name: 'Forum', component: ForumView },
  { path: '/post/:id', name: 'PostDetail', component: PostDetailView, props: true },
  { path: '/create-post', name: 'CreatePost', component: CreatePostView, meta: { requiresAuth: true } },
  { path: '/edit-post/:id', name: 'EditPost', component: EditPostView, props: true, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: LoginView, meta: { guest: true } },
  { path: '/register', name: 'Register', component: RegisterView, meta: { guest: true } },
  { path: '/guide', name: 'Guide', component: GuideView },
  { path: '/about', name: 'About', component: AboutView },
  { path: '/donate', name: 'Donate', component: DonateView },
  { path: '/videos', name: 'Videos', component: VideosView },
  { path: '/profile', name: 'Profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/my-posts', name: 'MyPosts', component: MyPostsView, meta: { requiresAuth: true } },

  // ── Nuevas rutas ──
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/questionnaire',
    name: 'Questionnaire',
    component: QuestionnaireView,
    meta: { requiresAuth: true }
  },
  {
    path: '/glucose',
    name: 'Glucose',
    component: GlucoseView,
    meta: { requiresAuth: true }
  },

  // ── Fallback ──
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Volver al inicio de la página en cada navegación
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 };
  }
});

// Guard de navegación
router.beforeEach((to, from, next) => {
  const isAuthenticated = authStore.isAuthenticated;
  const isAdmin = authStore.user?.role === 'admin';

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ path: '/login', query: { redirect: to.fullPath } });
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    return next('/');   // Redirigir a inicio si no es admin
  }

  if (to.meta.guest && isAuthenticated) {
    return next('/forum');
  }

  next();
});

export default router;