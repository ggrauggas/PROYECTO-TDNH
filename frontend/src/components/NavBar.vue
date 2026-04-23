<template>
  <nav class="navbar navbar-expand-lg fixed-top">
    <div class="container">
      <router-link class="navbar-brand" to="/">
        <img src="/TD-NH.ico" alt="Logo" class="brand-logo me-2" />
        <span class="brand-tu">TU</span> diabetes
        <span class="brand-tu">NUESTRA</span> historia
      </router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/" :class="{ active: $route.path === '/' }">
              <i class="bi bi-house-door me-1"></i> Inicio
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/forum" :class="{ active: $route.path.startsWith('/forum') || $route.path.startsWith('/post') }">
              <i class="bi bi-chat-dots me-1"></i> Foro
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/guide" :class="{ active: $route.path === '/guide' }">
              <i class="bi bi-book me-1"></i> Guía
            </router-link>
          </li>
          <!-- Test para principiantes: accesible para todos -->
          <li class="nav-item">
            <router-link class="nav-link" to="/quiz" :class="{ active: $route.path === '/quiz' }">
              <i class="bi bi-patch-question me-1"></i> Test
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about" :class="{ active: $route.path === '/about' }">
              <i class="bi bi-info-circle me-1"></i> Quiénes somos
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/videos" :class="{ active: $route.path === '/videos' }">
              <i class="bi bi-play-circle me-1"></i> Videos
            </router-link>
          </li>
          <!-- DONACIONES - DESHABILITADO TEMPORALMENTE
          <li class="nav-item">
            <router-link class="nav-link" to="/donate" :class="{ active: $route.path === '/donate' }">
              <i class="bi bi-heart me-1"></i> Donaciones
            </router-link>
          </li>
          -->
        </ul>
        
        <ul class="navbar-nav">
          <template v-if="authStore.isAuthenticated">

            <!-- Panel Admin: solo visible para admins -->
            <li v-if="authStore.user?.role === 'admin'" class="nav-item">
              <router-link class="nav-link admin-link" to="/admin" :class="{ active: $route.path === '/admin' }">
                <i class="bi bi-shield-lock-fill me-1"></i> Admin
              </router-link>
            </li>

            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" role="button" data-bs-toggle="dropdown">
                <img v-if="authStore.user?.avatar_url" :src="authStore.user.avatar_url" alt="avatar" class="nav-avatar" />
                <i v-else class="bi bi-person-circle"></i>
                {{ authStore.user?.username }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <router-link class="dropdown-item" to="/profile">
                    <i class="bi bi-person me-2"></i>Mi Perfil
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/my-posts">
                    <i class="bi bi-file-text me-2"></i>Mis Publicaciones
                  </router-link>
                </li>
                <li v-if="authStore.user?.glucose_enabled"><hr class="dropdown-divider"></li>
                <li v-if="authStore.user?.glucose_enabled">
                  <router-link class="dropdown-item" to="/glucose">
                    <i class="bi bi-activity me-2 text-primary"></i>Mis datos de glucosa
                  </router-link>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item text-danger" href="#" @click.prevent="logout">
                    <i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión
                  </a>
                </li>
              </ul>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link" to="/login">
                <i class="bi bi-box-arrow-in-right me-1"></i> Login
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/register">
                <i class="bi bi-person-plus me-1"></i> Registro
              </router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useRouter, useRoute } from 'vue-router';
import { watch } from 'vue';
import authStore from '../stores/authStore';

export default {
  name: 'NavBar',
  setup() {
    const router = useRouter();
    const route = useRoute();

    const closeNavbar = () => {
      const navbarEl = document.getElementById('navbarNav');
      if (navbarEl && navbarEl.classList.contains('show')) {
        const { Collapse } = window.bootstrap || {};
        if (Collapse) {
          Collapse.getInstance(navbarEl)?.hide();
        } else {
          navbarEl.classList.remove('show');
        }
      }
    };

    watch(() => route.path, closeNavbar);

    const logout = () => {
      authStore.logout();
      router.push('/');
    };

    return { authStore, logout };
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.nav-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid $border-color;
}
</style>
