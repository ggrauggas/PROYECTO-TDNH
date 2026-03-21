<template>
  <div class="card post-card mb-3">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div class="d-flex align-items-center">
          <div class="avatar-circle me-2" :style="{ backgroundColor: getAvatarColor(post.author_name) }">
            {{ post.author_name?.charAt(0) || post.username?.charAt(0) || 'U' }}
          </div>
          <div>
            <h6 class="mb-0">{{ post.author_name || post.username }}</h6>
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
          />
          
          <routerLink :to="`/post/${post.id}`" class="btn btn-link text-decoration-none ms-3">
            <i class="bi bi-chat me-1"></i>
            {{ post.comment_count || 0 }} comentarios
          </routerLink>
        </div>
        
        <small class="text-muted">
          <i class="bi bi-eye me-1"></i>
          {{ post.view_count || 0 }} vistas
        </small>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import LikeButton from './LikeButton.vue';
import authStore from '../stores/authStore';
import postService from '../services/postService';

export default {
  name: 'PostItem',
  components: { LikeButton },
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
.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.card-title {
  color: $primary;
  font-weight: 600;
  margin: 0.5rem 0;
}

.card-text {
  color: $dark;
  line-height: 1.6;
}
</style>