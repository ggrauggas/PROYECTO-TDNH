<template>
  <!-- ── Lightbox avatar ── -->
  <Teleport to="body">
    <Transition name="ulb">
      <div v-if="avatarOpen" class="ulb-overlay" @click="avatarOpen = false">
        <div class="ulb-box" @click.stop>
          <button class="ulb-close" @click="avatarOpen = false">
            <i class="bi bi-x-lg"></i>
          </button>
          <div v-if="lightboxSrc" class="ulb-img-wrap">
            <img :src="lightboxSrc" :alt="lightboxName" />
          </div>
          <div v-else class="ulb-initial" :style="{ backgroundColor: getColor(lightboxName) }">
            {{ lightboxName?.charAt(0)?.toUpperCase() }}
          </div>
          <p class="ulb-name">{{ lightboxName }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- ── Modal perfil ── -->
  <Teleport to="body">
    <Transition name="upm">
      <div v-if="profileOpen" class="upm-overlay" @click="profileOpen = false">
        <div class="upm-card" @click.stop>
          <button class="upm-close" @click="profileOpen = false">
            <i class="bi bi-x-lg"></i>
          </button>

          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
          </div>

          <template v-else-if="profile">
            <!-- Avatar clickable -->
            <div class="upm-avatar-wrap" @click="openAvatarFromProfile" title="Ver foto en grande">
              <div
                class="upm-avatar"
                :style="profile.avatar_url ? {} : { backgroundColor: getColor(profile.full_name || profile.username) }"
              >
                <img v-if="profile.avatar_url" :src="profile.avatar_url" :alt="profile.username" />
                <span v-else>{{ (profile.full_name || profile.username)?.charAt(0)?.toUpperCase() }}</span>
              </div>
              <div class="upm-avatar-zoom"><i class="bi bi-zoom-in"></i></div>
            </div>

            <div class="upm-info">
              <h5 class="fw-bold mb-0">{{ profile.full_name || profile.username }}</h5>
              <p class="text-muted small mb-2">@{{ profile.username }}</p>
              <span v-if="profile.diabetes_type" class="badge bg-primary-subtle text-primary">
                <i class="bi bi-heart-pulse me-1"></i>{{ profile.diabetes_type }}
              </span>
              <p v-if="profile.bio" class="small text-muted mt-2 mb-0 text-center">{{ profile.bio }}</p>
            </div>

            <div class="upm-stats">
              <div class="upm-stat">
                <span class="stat-num">{{ profile.post_count }}</span>
                <span class="stat-lbl">Publicaciones</span>
              </div>
              <div class="upm-divider"></div>
              <div class="upm-stat">
                <span class="stat-num">{{ profile.comment_count }}</span>
                <span class="stat-lbl">Comentarios</span>
              </div>
            </div>

            <p class="text-center text-muted small mt-3 mb-0">
              <i class="bi bi-calendar3 me-1"></i>
              Miembro desde {{ formatJoin(profile.created_at) }}
            </p>
          </template>

          <div v-else class="text-center py-4 text-muted small">
            No se pudo cargar el perfil
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { ref } from 'vue';
import userService from '../services/userService';

export default {
  name: 'UserProfileModal',
  setup() {
    // Lightbox
    const avatarOpen  = ref(false);
    const lightboxSrc = ref(null);
    const lightboxName = ref('');

    // Profile modal
    const profileOpen = ref(false);
    const loading     = ref(false);
    const profile     = ref(null);

    const getColor = (name) => {
      const colors = ['#2c7da0', '#61a5c2', '#2a9d8f', '#e9c46a', '#e76f51'];
      return colors[(name?.length || 0) % colors.length];
    };

    const formatJoin = (d) => {
      if (!d) return '—';
      return new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
    };

    /** Llamado desde el padre al pulsar el avatar */
    const openAvatar = ({ avatarUrl, authorName }) => {
      lightboxSrc.value  = avatarUrl || null;
      lightboxName.value = authorName || '';
      avatarOpen.value   = true;
    };

    /** Llamado desde dentro del modal de perfil */
    const openAvatarFromProfile = () => {
      if (!profile.value) return;
      lightboxSrc.value  = profile.value.avatar_url || null;
      lightboxName.value = profile.value.full_name || profile.value.username;
      avatarOpen.value   = true;
    };

    /** Llamado desde el padre al pulsar el nombre */
    const openProfile = async (userId) => {
      profileOpen.value = true;
      loading.value     = true;
      profile.value     = null;
      try {
        const res = await userService.getPublicProfile(userId);
        profile.value = res.data?.user || null;
      } catch (e) {
        console.error('Error cargando perfil público:', e);
      } finally {
        loading.value = false;
      }
    };

    return {
      avatarOpen, lightboxSrc, lightboxName,
      profileOpen, loading, profile,
      getColor, formatJoin,
      openAvatar, openAvatarFromProfile, openProfile,
    };
  }
};
</script>

<style scoped lang="scss">
/* ── Lightbox ── */
.ulb-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ulb-box {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 90vw;
}

.ulb-close {
  position: absolute;
  top: -2.5rem;
  right: -2.5rem;
  background: rgba(255,255,255,0.15);
  border: none;
  color: #fff;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;

  &:hover { background: rgba(255,255,255,0.3); }
}

.ulb-img-wrap img {
  max-width: min(400px, 85vw);
  max-height: 80vh;
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.5);
  object-fit: contain;
}

.ulb-initial {
  width: min(320px, 80vw);
  height: min(320px, 80vw);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(4rem, 15vw, 8rem);
  font-weight: bold;
  color: #fff;
  box-shadow: 0 8px 40px rgba(0,0,0,0.4);
}

.ulb-name {
  color: rgba(255,255,255,0.9);
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
}

/* Lightbox transitions */
.ulb-enter-active, .ulb-leave-active { transition: opacity 0.2s ease; }
.ulb-enter-from, .ulb-leave-to { opacity: 0; }

/* ── Profile modal ── */
.upm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(2px);
  z-index: 1900;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.upm-card {
  position: relative;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.2);
  padding: 2rem 1.75rem 1.5rem;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upm-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #f0f0f0;
  border: none;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s;

  &:hover { background: #e0e0e0; }
}

.upm-avatar-wrap {
  position: relative;
  cursor: pointer;
  margin-bottom: 1rem;

  &:hover .upm-avatar-zoom { opacity: 1; }
}

.upm-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  font-weight: bold;
  color: #fff;
  overflow: hidden;
  border: 3px solid #fff;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.upm-avatar-zoom {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  color: #fff;
  font-size: 1.2rem;
}

.upm-info {
  text-align: center;
  margin-bottom: 1.25rem;
}

.upm-stats {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 0.85rem 2rem;
  width: 100%;
  justify-content: center;
}

.upm-stat {
  display: flex;
  flex-direction: column;
  align-items: center;

  .stat-num { font-size: 1.4rem; font-weight: 700; color: #1a1a2e; line-height: 1; }
  .stat-lbl { font-size: 0.72rem; color: #6c757d; margin-top: 2px; }
}

.upm-divider {
  width: 1px;
  height: 2rem;
  background: #dee2e6;
}

/* Profile modal transitions */
.upm-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.upm-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.upm-enter-from  { opacity: 0; transform: scale(0.95); }
.upm-leave-to    { opacity: 0; transform: scale(0.95); }
</style>
