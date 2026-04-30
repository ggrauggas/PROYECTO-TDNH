<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero-section text-center py-5 mb-5">
      <div class="container">
        <div class="hero-badge mb-4">
          <i class="bi bi-heart-pulse-fill me-2"></i>Comunidad de diabetes
        </div>
        <h1 class="hero-title fw-bold mb-4">
          <span class="hero-tu">TU</span><span class="hero-nuestra"> diabetes</span><br>
          <span class="hero-tu">NUESTRA</span><span class="hero-nuestra"> historia</span>
        </h1>
        <p class="lead hero-subtitle mb-5">
          Un espacio donde compartir experiencias, resolver dudas y encontrar apoyo
          en tu camino con la diabetes.
        </p>
        <div class="d-flex flex-wrap justify-content-center gap-3">
          <router-link to="/forum" class="btn btn-primary btn-hero btn-lg">
            <i class="bi bi-chat-dots me-2"></i>Visitar el foro
          </router-link>
          <router-link v-if="!authStore.isAuthenticated" to="/register" class="btn btn-outline-primary btn-hero btn-lg">
            <i class="bi bi-person-plus me-2"></i>Unirse ahora
          </router-link>
        </div>
      </div>
    </section>

    <!-- Características -->
    <div class="container mb-5">
      <div class="section-header text-center mb-5">
        <p class="section-label">Lo que ofrecemos</p>
        <h2 class="section-title">¿Qué encontrarás en nuestra comunidad?</h2>
      </div>
      <div class="row g-4">
        <div class="col-12 col-sm-6 col-md-4">
          <div class="feature-card p-4">
            <div class="feature-icon-wrap mb-3">
              <i class="bi bi-people-fill"></i>
            </div>
            <h4 class="feature-title">Comunidad de apoyo</h4>
            <p class="text-muted">
              Conecta con otras personas que entienden tu experiencia y comparten tus mismos desafíos.
            </p>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <div class="feature-card p-4">
            <div class="feature-icon-wrap mb-3">
              <i class="bi bi-chat-dots-fill"></i>
            </div>
            <h4 class="feature-title">Foro interactivo</h4>
            <p class="text-muted">
              Crea publicaciones, comenta, da likes y participa en conversaciones significativas.
            </p>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <div class="feature-card p-4">
            <div class="feature-icon-wrap mb-3">
              <i class="bi bi-book-fill"></i>
            </div>
            <h4 class="feature-title">Guía sobre la diabetes</h4>
            <p class="text-muted">
              Recursos y consejos para quienes buscan entender la condición.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Llamada a la acción -->
    <section class="cta-section py-5 mb-4">
      <div class="container">
        <div class="cta-inner text-center">
          <h2 class="cta-title mb-3">Comparte tu experiencia</h2>
          <p class="cta-subtitle mb-4">
            Tu historia puede ayudar a alguien que está comenzando su camino.<br>
            Únete a nuestra comunidad y sé parte del cambio.
          </p>
          <router-link v-if="authStore.isAuthenticated" to="/create-post" class="btn btn-primary btn-lg">
            <i class="bi bi-plus-circle me-2"></i>Crear publicación
          </router-link>
          <router-link v-else to="/register" class="btn btn-primary btn-lg">
            <i class="bi bi-person-plus me-2"></i>Registrarse ahora
          </router-link>
        </div>
      </div>
    </section>

    <!-- Compartir la web -->
    <section class="share-section text-center py-5">
      <div class="container">
        <p class="section-label mb-2">Difunde la comunidad</p>
        <h3 class="share-title fw-bold mb-2">¿Conoces a alguien que lo necesita?</h3>
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

// ── Hero — glass sobre mesh gradient ─────────────────────────────────────────
.hero-section {
  margin-top: -1.5rem;
  padding-top: 5rem !important;
  padding-bottom: 5rem !important;
  background: transparent;
  position: relative;
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 80% at 50% 0%, rgba(3, 105, 161, 0.10) 0%, transparent 60%),
      radial-gradient(ellipse 50% 50% at 10% 60%, rgba(230, 152, 152, 0.09) 0%, transparent 50%),
      radial-gradient(ellipse 50% 50% at 90% 40%, rgba(8, 145, 178, 0.08) 0%, transparent 50%);
    z-index: -1;
  }
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.60);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  color: $primary;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.45em 1.1em;
  border-radius: 50rem;
  border: 1px solid rgba(3, 105, 161, 0.20);
  box-shadow: 0 2px 8px rgba(3, 105, 161, 0.12);
}

.hero-title {
  font-size: 2.75rem;
  letter-spacing: -0.04em;
  line-height: 1.07;
  color: $dark;
  font-weight: 800;

  @media (min-width: 768px) { font-size: 4rem; }
  @media (min-width: 992px) { font-size: 5rem; }
}

.hero-tu      { color: $pink-pastel; }
.hero-nuestra { color: $primary; }

.hero-subtitle {
  font-size: 1.125rem;
  color: rgba(28, 28, 30, 0.60);
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;
}

.btn-hero {
  padding: 0.75rem 1.75rem;
  font-weight: 600;
  font-size: 1rem;
}

// ── Section headers ────────────────────────────────────────────────────────────
.section-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: $secondary;
  margin-bottom: 0.5rem;
}

.section-title {
  font-size: 1.85rem;
  font-weight: 700;
  color: $dark;
  letter-spacing: -0.03em;
}

// ── Feature cards — Liquid Glass ──────────────────────────────────────────────
.feature-card {
  background: rgba(255, 255, 255, 0.70);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.82);
  border-radius: $border-radius-lg;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9);
  height: 100%;
  transition: $transition-smooth;

  &:hover {
    transform: translateY(-5px) scale(1.01);
    box-shadow: 0 16px 40px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.9);
  }

  p { text-align: left; color: rgba(28,28,30,0.55); font-size: 0.925rem; }
}

.feature-icon-wrap {
  width: 54px;
  height: 54px;
  background: linear-gradient(145deg, rgba($primary, 0.16) 0%, rgba($primary, 0.08) 100%);
  border-radius: $border-radius;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: $primary;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
}

.feature-title {
  font-size: 1rem;
  font-weight: 700;
  color: $dark;
  letter-spacing: -0.01em;
  margin-bottom: 0.5rem;
}

// ── CTA — Glass gradient ──────────────────────────────────────────────────────
.cta-section { background: transparent; }

.cta-inner {
  background: linear-gradient(135deg,
    rgba($primary, 0.88) 0%,
    rgba($secondary, 0.90) 100%
  );
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: $border-radius-xl;
  padding: 4rem 2rem;
  color: white;
  box-shadow:
    0 24px 60px rgba($primary, 0.28),
    inset 0 1px 0 rgba(255,255,255,0.22);
}

.cta-title {
  font-size: 1.85rem;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.cta-subtitle {
  font-size: 1.05rem;
  opacity: 0.88;
  max-width: 520px;
  margin: 0 auto;
}

.cta-inner .btn-primary {
  background: #fff;
  color: $primary;
  border: 2px solid #fff;
  font-weight: 700;

  &:hover {
    background: rgba(255,255,255,0.88);
    border-color: rgba(255,255,255,0.88);
    color: darken($primary, 6%);
  }
}

// ── Share section — Glass ─────────────────────────────────────────────────────
.share-section {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255,255,255,0.70);
}

.share-title { color: $dark; font-size: 1.4rem; letter-spacing: -0.02em; }

.btn-share {
  font-weight: 500;
  font-size: 0.9rem;
  border-width: 2px;
  padding: 0.5rem 1.25rem;
  transition: $transition-smooth;
}

.btn-whatsapp {
  color: #16a34a; border-color: rgba(22, 163, 74, 0.5);
  background: rgba(22, 163, 74, 0.05);
  &:hover { background: #16a34a; border-color: #16a34a; color: white; }
}

.btn-twitter {
  color: #0f172a; border-color: rgba(15, 23, 42, 0.4);
  background: rgba(15, 23, 42, 0.04);
  &:hover { background: #0f172a; border-color: #0f172a; color: white; }
}

.btn-facebook {
  color: #1877f2; border-color: rgba(24, 119, 242, 0.45);
  background: rgba(24, 119, 242, 0.04);
  &:hover { background: #1877f2; border-color: #1877f2; color: white; }
}
</style>