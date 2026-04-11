<template>
  <div class="home-view">
    <!-- Hero Section con rosa pastel plano -->
    <section class="hero-section bg-primary text-white text-center py-5 mb-5">
      <div class="container">
        <h1 class="display-4 fw-bold mb-4">
          <span class="hero-tu">TU</span> diabetes 
          <span class="hero-nuestra">NUESTRA</span> historia
        </h1>
        <p class="lead mb-4">
          Un espacio donde compartir experiencias, resolver dudas y encontrar apoyo 
          en tu camino con la diabetes.
        </p>
        <div class="d-flex justify-content-center gap-3">
          <router-link to="/forum" class="btn btn-light btn-lg">
            <i class="bi bi-chat-dots me-2"></i>Visitar el foro
          </router-link>
          <router-link v-if="!authStore.isAuthenticated" to="/register" class="btn btn-outline-light btn-lg">
            <i class="bi bi-person-plus me-2"></i>Unirse ahora
          </router-link>
        </div>
      </div>
    </section>

    <!-- Características -->
    <div class="container mb-5">
      <h2 class="text-center mb-5">¿Qué encontrarás en nuestra comunidad?</h2>
      <div class="row g-4">
        <div class="col-md-4">
          <div class="feature-card text-center p-4">
            <div class="feature-icon mb-3">
              <i class="bi bi-people-fill"></i>
            </div>
            <h4>Comunidad de apoyo</h4>
            <p class="text-muted">
              Conecta con otras personas que entienden tu experiencia y comparten tus mismos desafíos.
            </p>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="feature-card text-center p-4">
            <div class="feature-icon mb-3">
              <i class="bi bi-chat-dots-fill"></i>
            </div>
            <h4>Foro interactivo</h4>
            <p class="text-muted">
              Crea publicaciones, comenta, da likes y participa en conversaciones significativas.
            </p>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="feature-card text-center p-4">
            <div class="feature-icon mb-3">
              <i class="bi bi-book-fill"></i>
            </div>
            <h4>Guía para nuevos diagnosticados</h4>
            <p class="text-muted">
              Recursos y consejos para quienes comienzan su camino con diabetes.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Llamada a la acción -->
    <section class="cta-section bg-primary text-white text-center py-5">
      <div class="container">
        <h2 class="mb-4">Comparte tu experiencia</h2>
        <p class="lead mb-4">
          Tu historia puede ayudar a alguien que está comenzando su camino.
          Únete a nuestra comunidad y sé parte del cambio.
        </p>
        <router-link v-if="authStore.isAuthenticated" to="/create-post" class="btn btn-light btn-lg">
          <i class="bi bi-plus-circle me-2"></i>Crear publicación
        </router-link>
        <router-link v-else to="/register" class="btn btn-light btn-lg">
          <i class="bi bi-person-plus me-2"></i>Registrarse ahora
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import authStore from '../stores/authStore';
import postService from '../services/postService';

export default {
  name: 'HomeView',
  setup() {
    const recentPosts = ref([]);
    const loading = ref(true);

    const loadRecentPosts = async () => {
      try {
        const response = await postService.getAll(1, 4);
        recentPosts.value = response.data.posts;
      } catch (error) {
        console.error('Error cargando posts recientes:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(loadRecentPosts);

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return 'Hoy';
      if (diffDays === 1) return 'Ayer';
      if (diffDays < 7) return `Hace ${diffDays} días`;
      return date.toLocaleDateString('es-ES');
    };

    const truncateContent = (content) => {
      if (content.length > 100) return content.substring(0, 100) + '...';
      return content;
    };

    const getAvatarColor = (name) => {
      const colors = ['#2c7da0', '#61a5c2', '#2a9d8f', '#e9c46a', '#e76f51'];
      return colors[(name?.length || 0) % colors.length];
    };

    return { recentPosts, loading, authStore, formatDate, truncateContent, getAvatarColor };
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.hero-section {
  margin-top: -1.5rem;
  
  .hero-tu {
    color: $pink-pastel;
    font-weight: 800;
  }
  
  .hero-nuestra {
    color: $pink-pastel-light;
    font-weight: 800;
  }
}

.feature-card {
  background: white;
  border-radius: $border-radius-lg;
  box-shadow: $box-shadow;
  height: 100%;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: $box-shadow-lg;
  }
  
  .feature-icon {
    font-size: 3rem;
    color: $primary;
  }
}

.cta-section {
  margin-bottom: -1.5rem;
}

</style>