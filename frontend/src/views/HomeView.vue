<template>
  <div class="home-view">
    <!-- Hero Section con rosa pastel plano -->
    <section class="hero-section bg-primary text-white text-center py-5 mb-5">
      <div class="container">
        <h1 class="hero-title fw-bold mb-4">
          <span class="hero-tu">TU</span> diabetes
          <span class="hero-nuestra">NUESTRA</span> historia
        </h1>
        <p class="lead mb-4">
          Un espacio donde compartir experiencias, resolver dudas y encontrar apoyo
          en tu camino con la diabetes.
        </p>
        <div class="d-flex flex-wrap justify-content-center gap-3">
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
        <div class="col-12 col-sm-6 col-md-4">
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

        <div class="col-12 col-sm-6 col-md-4">
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

        <div class="col-12 col-sm-6 col-md-4">
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

    <!-- Compartir la web -->
    <section class="share-section text-center py-5">
      <div class="container">
        <p class="text-muted mb-1 small text-uppercase fw-semibold letter-spacing-1">Difunde la comunidad</p>
        <h3 class="fw-bold mb-2">¿Conoces a alguien que lo necesita?</h3>
        <p class="text-muted mb-4">
          Comparte esta plataforma con personas con diabetes o sus familias.
          Cuantos más seamos, más nos ayudamos.
        </p>
        <div class="d-flex flex-wrap justify-content-center gap-3">
          <a :href="shareUrls.whatsapp" target="_blank" rel="noopener" class="btn btn-share btn-whatsapp">
            <i class="bi bi-whatsapp me-2"></i>WhatsApp
          </a>
          <a :href="shareUrls.twitter" target="_blank" rel="noopener" class="btn btn-share btn-twitter">
            <i class="bi bi-twitter-x me-2"></i>Twitter / X
          </a>
          <a :href="shareUrls.facebook" target="_blank" rel="noopener" class="btn btn-share btn-facebook">
            <i class="bi bi-facebook me-2"></i>Facebook
          </a>
        </div>
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

    const siteUrl = 'https://tudiabetes.netlify.app';
    const text = encodeURIComponent('¡Únete a TU diabetes NUESTRA historia! Una comunidad para personas con diabetes. 💙');
    const url = encodeURIComponent(siteUrl);
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`
    };

    return { recentPosts, loading, authStore, formatDate, truncateContent, getAvatarColor, shareUrls };
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

.hero-title {
  font-size: 2.5rem;

  @media (min-width: 768px) {
    font-size: 3.5rem;
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
  margin-bottom: 0;
}

.share-section {
  background: #f5f9ff;

  h3 { color: #1a1a2e; }
}

.btn-share {
  font-weight: 500;
  border-width: 2px;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  transition: transform 0.15s, box-shadow 0.15s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }
}

.btn-whatsapp {
  color: #25d366;
  border-color: #25d366;
  &:hover { background: #25d366; color: white; }
}

.btn-twitter {
  color: #000;
  border-color: #000;
  &:hover { background: #000; color: white; }
}

.btn-facebook {
  color: #1877f2;
  border-color: #1877f2;
  &:hover { background: #1877f2; color: white; }
}

</style>