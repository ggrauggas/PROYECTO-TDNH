<template>
  <span class="like-button-wrap">
    <button
      class="btn btn-link btn-like"
      :class="{ liked: isLiked }"
      @click="toggleLike"
      :disabled="!authStore.isAuthenticated || loading"
    >
      <i class="bi" :class="isLiked ? 'bi-heart-fill' : 'bi-heart'"></i>
      <span v-if="showCount" class="ms-1">{{ likeCount }}</span>
    </button>

    <button
      v-if="isAuthor && type === 'post'"
      class="btn btn-link btn-eye"
      title="Ver quién ha dado like"
      @click="openLikers"
    >
      <i class="bi bi-eye"></i>
    </button>

    <!-- Dialog likers -->
    <Teleport to="body">
      <Transition name="lkd">
        <div v-if="likersOpen" class="lkd-overlay" @click="likersOpen = false">
          <div class="lkd-card" @click.stop>
            <button class="lkd-close" @click="likersOpen = false">
              <i class="bi bi-x-lg"></i>
            </button>
            <h6 class="lkd-title">
              <i class="bi bi-heart-fill me-2 text-danger"></i>Les ha gustado
            </h6>

            <div v-if="likersLoading" class="text-center py-4">
              <div class="spinner-border spinner-border-sm text-primary"></div>
            </div>

            <div v-else-if="likers.length === 0" class="lkd-empty">
              Nadie ha dado like aún
            </div>

            <ul v-else class="lkd-list">
              <li v-for="user in likers" :key="user.id" class="lkd-item">
                <div
                  class="lkd-avatar"
                  :style="user.avatar_url ? {} : { backgroundColor: getColor(user.full_name || user.username) }"
                >
                  <img v-if="user.avatar_url" :src="user.avatar_url" :alt="user.username" />
                  <span v-else>{{ (user.full_name || user.username)?.charAt(0)?.toUpperCase() }}</span>
                </div>
                <span class="lkd-name">{{ user.full_name || user.username }}</span>
              </li>
            </ul>
          </div>
        </div>
      </Transition>
    </Teleport>
  </span>
</template>

<script>
import { ref } from 'vue';
import authStore from '../stores/authStore';
import likeService from '../services/likeService';

export default {
  name: 'LikeButton',
  props: {
    itemId: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true,
      validator: (value) => ['post', 'comment'].includes(value)
    },
    initialCount: {
      type: Number,
      default: 0
    },
    initialLiked: {
      type: Boolean,
      default: false
    },
    showCount: {
      type: Boolean,
      default: true
    },
    isAuthor: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const likeCount = ref(props.initialCount);
    const isLiked = ref(props.initialLiked);
    const loading = ref(false);

    const likersOpen = ref(false);
    const likersLoading = ref(false);
    const likers = ref([]);

    const toggleLike = async () => {
      if (!authStore.isAuthenticated) {
        alert('Debes iniciar sesión para dar like');
        return;
      }

      loading.value = true;

      try {
        let response;

        if (isLiked.value) {
          if (props.type === 'post') {
            response = await likeService.unlikePost(props.itemId);
          } else {
            response = await likeService.unlikeComment(props.itemId);
          }
          isLiked.value = false;
        } else {
          if (props.type === 'post') {
            response = await likeService.likePost(props.itemId);
          } else {
            response = await likeService.likeComment(props.itemId);
          }
          isLiked.value = true;
        }

        likeCount.value = response.data.like_count;

      } catch (error) {
        console.error('Error al procesar like:', error);
        isLiked.value = !isLiked.value;
      } finally {
        loading.value = false;
      }
    };

    const openLikers = async () => {
      likersOpen.value = true;
      likersLoading.value = true;
      likers.value = [];
      try {
        const res = await likeService.getPostLikers(props.itemId);
        likers.value = res.data.likers;
      } catch (e) {
        console.error('Error cargando likers:', e);
      } finally {
        likersLoading.value = false;
      }
    };

    const getColor = (name) => {
      const colors = ['#2c7da0', '#61a5c2', '#2a9d8f', '#e9c46a', '#e76f51'];
      return colors[(name?.length || 0) % colors.length];
    };

    return {
      likeCount,
      isLiked,
      loading,
      authStore,
      toggleLike,
      likersOpen,
      likersLoading,
      likers,
      openLikers,
      getColor
    };
  }
};
</script>

<style scoped lang="scss">
.like-button-wrap {
  display: inline-flex;
  align-items: center;
}

.btn-like {
  text-decoration: none;
}

.btn-eye {
  text-decoration: none;
  color: #6c757d;
  padding: 0.25rem 0.4rem;
  font-size: 1rem;
  transition: color 0.15s;

  &:hover { color: $primary; }
}

/* Dialog overlay */
.lkd-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 1900;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.lkd-card {
  position: relative;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
  padding: 1.5rem 1.25rem 1.25rem;
  width: 100%;
  max-width: 320px;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
}

.lkd-close {
  position: absolute;
  top: 0.85rem;
  right: 0.85rem;
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

.lkd-title {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 1rem;
  padding-right: 2rem;
}

.lkd-empty {
  text-align: center;
  color: #6c757d;
  font-size: 0.9rem;
  padding: 1rem 0;
}

.lkd-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.lkd-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.lkd-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  color: #fff;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.lkd-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1a1a2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Transition */
.lkd-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.lkd-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.lkd-enter-from  { opacity: 0; transform: scale(0.95); }
.lkd-leave-to    { opacity: 0; transform: scale(0.95); }
</style>
