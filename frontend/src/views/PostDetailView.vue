<template>
  <div class="post-detail-view container py-4">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- Publicación eliminada -->
    <div v-else-if="post && post.is_deleted" class="text-center py-5">
      <i class="bi bi-trash3" style="font-size: 3rem; color: #adb5bd;"></i>
      <h4 class="mt-3 text-muted">Esta publicación ha sido eliminada</h4>
      <p class="text-muted mb-4">
        <span v-if="post.deleted_by === 'admin'">
          <i class="bi bi-shield-fill me-1 text-danger"></i>Un administrador eliminó esta publicación.
        </span>
        <span v-else>
          <i class="bi bi-person-fill me-1"></i>El autor eliminó esta publicación.
        </span>
      </p>
      <router-link to="/forum" class="btn btn-primary">
        <i class="bi bi-arrow-left me-2"></i>Volver al foro
      </router-link>
    </div>

    <div v-else-if="post && !post.is_deleted" class="post-detail">
      <!-- Navegación -->
      <div class="mb-3">
        <router-link to="/forum" class="text-decoration-none">
          <i class="bi bi-arrow-left me-2"></i>
          Volver al foro
        </router-link>
      </div>

      <!-- Publicación -->
      <div class="card post-card mb-4">
        <div class="card-header d-flex justify-content-between align-items-start align-items-sm-center gap-2">
          <div class="d-flex align-items-center">
            <div
              class="avatar-circle me-2"
              :style="post.author_avatar ? {} : { backgroundColor: getAvatarColor(post.author_name) }"
              style="cursor: pointer;"
              :title="`Ver foto de ${post.author_name}`"
              @click="$refs.userModal.openAvatar({ avatarUrl: post.author_avatar, authorName: post.author_name })"
            >
              <img v-if="post.author_avatar" :src="post.author_avatar" :alt="post.author_name" class="avatar-img" />
              <span v-else>{{ post.author_name?.charAt(0) || 'U' }}</span>
            </div>
            <div>
              <span
                class="author-name-link fw-semibold"
                :title="`Ver perfil de ${post.author_name}`"
                @click="$refs.userModal.openProfile(post.user_id)"
              >{{ post.author_name }}</span>
              <small class="text-muted ms-2">
                {{ formatDate(post.created_at) }}
              </small>
            </div>
          </div>
          
          <div v-if="isAuthor" class="dropdown">
            <button class="btn btn-link text-dark p-0" type="button" data-bs-toggle="dropdown">
              <i class="bi bi-three-dots-vertical"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <routerLink :to="`/edit-post/${post.id}`" class="dropdown-item">
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

        <div class="card-body">
          <h3 class="card-title mb-3">{{ post.title }}</h3>
          
          <div v-if="post.category" class="mb-3">
            <span class="badge bg-primary">{{ post.category }}</span>
            <span v-if="post.tags" class="ms-2">
              <span v-for="tag in post.tags.split(',')" :key="tag" class="badge bg-secondary me-1">
                #{{ tag.trim() }}
              </span>
            </span>
          </div>

          <div class="card-text mb-4" v-html="formattedContent"></div>

          <div class="d-flex justify-content-between align-items-center">
            <div>
              <LikeButton
                :item-id="post.id"
                type="post"
                :initial-count="post.like_count"
                :initial-liked="post.user_has_liked"
              />
              
            </div>
            
            <small class="text-muted">
              <i class="bi bi-chat me-1"></i>
              {{ post.comment_count || 0 }} comentarios
            </small>
          </div>
        </div>
      </div>

      <!-- Sección de comentarios -->
      <CommentSection :post-id="post.id" @comment-count-changed="post.comment_count = $event" />
    </div>

    <div v-else class="text-center py-5">
      <i class="bi bi-exclamation-triangle" style="font-size: 3rem; color: #ccc;"></i>
      <h4 class="mt-3 text-muted">Publicación no encontrada</h4>
      <p class="text-muted">La publicación que buscas no existe o ha sido eliminada.</p>
      <router-link to="/forum" class="btn btn-primary mt-3">
        <i class="bi bi-arrow-left me-2"></i>Volver al foro
      </router-link>
    </div>
  </div>

  <UserProfileModal ref="userModal" />
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CommentSection from '../components/CommentSection.vue';
import LikeButton from '../components/LikeButton.vue';
import UserProfileModal from '../components/UserProfileModal.vue';
import authStore from '../stores/authStore';
import postService from '../services/postService';

export default {
  name: 'PostDetailView',
  components: { CommentSection, LikeButton, UserProfileModal },
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const router = useRouter();
    const post = ref(null);
    const loading = ref(true);

    const loadPost = async () => {
      loading.value = true;
      try {
        const response = await postService.getById(props.id);
        post.value = response.data.post;
      } catch (error) {
        console.error('Error cargando post:', error);
        post.value = null;
      } finally {
        loading.value = false;
      }
    };

    onMounted(loadPost);

    const isAuthor = computed(() => {
      return authStore.user?.id === post.value?.user_id;
    });

    const formattedContent = computed(() => {
      if (!post.value?.content) return '';
      // Convertir saltos de línea a <br>
      return post.value.content.replace(/\n/g, '<br>');
    });

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const getAvatarColor = (name) => {
      const colors = ['#2c7da0', '#61a5c2', '#2a9d8f', '#e9c46a', '#e76f51'];
      const index = (name?.length || 0) % colors.length;
      return colors[index];
    };

    const confirmDelete = async () => {
      if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
        try {
          await postService.delete(post.value.id);
          router.push('/forum');
        } catch (error) {
          console.error('Error eliminando post:', error);
          alert('Error al eliminar la publicación');
        }
      }
    };

    return {
      post,
      loading,
      isAuthor,
      formattedContent,
      formatDate,
      getAvatarColor,
      confirmDelete
    };
  }
};
</script>

<style scoped lang="scss">
.avatar-circle {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.author-name-link {
  cursor: pointer;
  font-size: 1rem;
  color: inherit;
  transition: color 0.15s;

  &:hover { color: $primary; text-decoration: underline; }
}

.card-title {
  color: $primary;
  font-weight: 600;
}

.card-text {
  line-height: 1.8;
  font-size: 1rem;

  @media (min-width: 576px) {
    font-size: 1.1rem;
  }
}
</style>