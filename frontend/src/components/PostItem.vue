<template>
  <div class="card post-card mb-3" :class="{ 'post-card--verified': post.author_role === 'admin' }">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div class="d-flex align-items-center overflow-hidden">
          <div
            class="avatar-circle me-2"
            :style="post.author_avatar ? {} : { backgroundColor: getAvatarColor(post.author_name) }"
            style="cursor: pointer;"
            :title="`Ver foto de ${post.author_name}`"
            @click="$refs.userModal.openAvatar({ avatarUrl: post.author_avatar, authorName: post.author_name })"
          >
            <img v-if="post.author_avatar" :src="post.author_avatar" alt="avatar" class="avatar-img" />
            <span v-else>{{ post.author_name?.charAt(0) || post.username?.charAt(0) || 'U' }}</span>
          </div>
          <div>
            <div class="d-flex align-items-center gap-2">
              <span
                class="mb-0 fw-semibold author-name-link"
                :title="`Ver perfil de ${post.author_name}`"
                @click="$refs.userModal.openProfile(post.user_id)"
              >{{ post.author_name || post.username }}</span>
              <span v-if="post.author_role === 'admin'" class="badge badge-admin">
                <i class="bi bi-shield-check me-1"></i>Admin verificado
              </span>
            </div>
            <small class="text-muted">{{ formatDate(post.created_at) }}</small>
          </div>
        </div>
        
        <div v-if="isAuthor" class="dropdown">
          <button class="btn btn-link text-dark p-0" type="button" data-bs-toggle="dropdown">
            <i class="bi bi-three-dots-vertical"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <routerLink class="dropdown-item" :to="`/edit-post/${post.id}`">
                <i class="bi bi-pencil me-2"></i>Editar
              </routerLink>
            </li>
            <li>
              <a class="dropdown-item text-danger" href="#" @click.prevent="confirmDelete">
                <i class="bi bi-trash me-2"></i>Eliminar
              </a>
            </li>
          </ul>
        </div>
      </div>

      <routerLink :to="`/post/${post.id}`" class="text-decoration-none text-dark">
        <h5 class="card-title">{{ post.title }}</h5>
        <p class="card-text">{{ truncateContent(post.content) }}</p>
      </routerLink>

      <div v-if="post.category" class="mb-2">
        <span class="badge bg-primary">{{ post.category }}</span>
      </div>

      <div class="d-flex justify-content-between align-items-center mt-3">
        <div>
          <LikeButton
            :item-id="post.id"
            type="post"
            :initial-count="post.like_count || 0"
            :initial-liked="post.user_has_liked || false"
            :is-author="isAuthor"
          />
          
          <routerLink :to="`/post/${post.id}`" class="btn btn-link text-decoration-none ms-3">
            <i class="bi bi-chat me-1"></i>
            {{ post.comment_count || 0 }} comentarios
          </routerLink>
        </div>
        
      </div>
    </div>
  </div>

  <UserProfileModal ref="userModal" />
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import LikeButton from './LikeButton.vue';
import UserProfileModal from './UserProfileModal.vue';
import authStore from '../stores/authStore';
import postService from '../services/postService';

export default {
  name: 'PostItem',
  components: { LikeButton, UserProfileModal },
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  emits: ['post-deleted'],
  setup(props, { emit }) {
    const router = useRouter();
    
    const isAuthor = computed(() => {
      return authStore.user?.id === props.post.user_id;
    });

    const formatDate = (dateString) => {
      if (!dateString) return 'Fecha desconocida';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const truncateContent = (content) => {
      if (!content) return '';
      if (content.length > 200) {
        return content.substring(0, 200) + '...';
      }
      return content;
    };

    const getAvatarColor = (name) => {
      const colors = ['#2c7da0', '#61a5c2', '#2a9d8f', '#e9c46a', '#e76f51'];
      const index = (name?.length || 0) % colors.length;
      return colors[index];
    };

    const confirmDelete = async () => {
      if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
        try {
          await postService.delete(props.post.id);
          emit('post-deleted', props.post.id);
        } catch (error) {
          console.error('Error eliminando post:', error);
          alert('Error al eliminar la publicación');
        }
      }
    };

    return {
      isAuthor,
      formatDate,
      truncateContent,
      getAvatarColor,
      confirmDelete,
      authStore
    };
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.avatar-circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid rgba(255,255,255,0.8);
  box-shadow: 0 0 0 1px $border-color;

  .avatar-img {
    width: 100%; height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
}

.author-name-link {
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  color: $dark;
  transition: color 0.15s;
  &:hover { color: $primary; text-decoration: underline; }
}

.badge-admin {
  background: rgba(#7c3aed, 0.1);
  color: #6d28d9;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2em 0.55em;
  border-radius: 999px;
  border: 1px solid rgba(#7c3aed, 0.2);
}

.card-title {
  color: $dark;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: -0.01em;
  margin: 0.5rem 0 0.375rem;
  line-height: 1.4;
}

.card-text {
  color: #475569;
  line-height: 1.65;
  font-size: 0.9rem;
}

.post-card--verified {
  border-left-color: $diabetes-teal !important;
  background-color: #f0fdfc;
}
</style>