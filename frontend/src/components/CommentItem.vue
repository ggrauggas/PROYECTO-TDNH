<template>
  <div class="comment-item" :class="{ 'is-reply': isReply }">
    <div class="d-flex">
      <div
        class="avatar-circle me-2"
        :style="comment.author_avatar ? {} : { backgroundColor: getAvatarColor(comment.author_name) }"
        style="cursor: pointer;"
        :title="`Ver foto de ${comment.author_name}`"
        @click="$refs.userModal.openAvatar({ avatarUrl: comment.author_avatar, authorName: comment.author_name })"
      >
        <img v-if="comment.author_avatar" :src="comment.author_avatar" alt="avatar" class="avatar-img" />
        <span v-else>{{ comment.author_name?.charAt(0) || 'U' }}</span>
      </div>

      <div class="flex-grow-1">
        <div class="d-flex justify-content-between align-items-start">
          <div class="d-flex align-items-center flex-wrap gap-2">
            <strong
              class="author-name-link"
              :title="`Ver perfil de ${comment.author_name}`"
              @click="$refs.userModal.openProfile(comment.user_id)"
            >{{ comment.author_name }}</strong>
            <span v-if="comment.author_role === 'admin'" class="badge badge-admin">
              <i class="bi bi-shield-check me-1"></i>Admin verificado
            </span>
            <small class="text-muted">{{ formatDate(comment.created_at) }}</small>
            <span v-if="comment.is_edited" class="badge bg-light text-muted">editado</span>
          </div>
          
          <div v-if="isAuthor" class="dropdown">
            <button class="btn btn-link text-dark p-0" type="button" data-bs-toggle="dropdown">
              <i class="bi bi-three-dots-vertical"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <a class="dropdown-item" href="#" @click.prevent="startEditing">
                  <i class="bi bi-pencil me-2"></i>Editar
                </a>
              </li>
              <li>
                <a class="dropdown-item text-danger" href="#" @click.prevent="confirmDelete">
                  <i class="bi bi-trash me-2"></i>Eliminar
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Modo edición -->
        <div v-if="isEditing" class="mt-2">
          <textarea 
            v-model="editedContent" 
            class="form-control form-control-sm"
            rows="2"
          ></textarea>
          <div class="mt-2">
            <button class="btn btn-primary btn-sm me-2" @click="saveEdit">
              <i class="bi bi-check-lg"></i> Guardar
            </button>
            <button class="btn btn-secondary btn-sm" @click="cancelEdit">
              <i class="bi bi-x-lg"></i> Cancelar
            </button>
          </div>
        </div>
        
        <!-- Modo vista -->
        <p v-else class="mt-1 mb-2">{{ comment.content }}</p>
        
        <div class="d-flex align-items-center">
          <LikeButton
            :item-id="comment.id"
            type="comment"
            :initial-count="comment.like_count"
            :initial-liked="comment.user_has_liked"
          />
          
          <button 
            v-if="authStore.isAuthenticated && !isReply" 
            class="btn btn-link btn-sm text-muted"
            @click="$emit('reply', comment)"
          >
            <i class="bi bi-reply me-1"></i>Responder
          </button>
        </div>
      </div>
    </div>
  </div>

  <UserProfileModal ref="userModal" />
</template>

<script>
import { ref, computed } from 'vue';
import LikeButton from './LikeButton.vue';
import UserProfileModal from './UserProfileModal.vue';
import authStore from '../stores/authStore';
import commentService from '../services/commentService';

export default {
  name: 'CommentItem',
  components: { LikeButton, UserProfileModal },
  props: {
    comment: {
      type: Object,
      required: true
    },
    isReply: {
      type: Boolean,
      default: false
    }
  },
  emits: ['reply', 'comment-updated', 'comment-deleted'],
  setup(props, { emit }) {
    const isEditing = ref(false);
    const editedContent = ref(props.comment.content);

    const isAuthor = computed(() => {
      return authStore.user?.id === props.comment.user_id;
    });

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      
      if (diffMinutes < 1) return 'Ahora mismo';
      if (diffMinutes < 60) return `Hace ${diffMinutes} minutos`;
      if (diffMinutes < 1440) {
        const hours = Math.floor(diffMinutes / 60);
        return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
      }
      
      return date.toLocaleDateString('es-ES');
    };

    const getAvatarColor = (name) => {
      const colors = ['#2c7da0', '#61a5c2', '#2a9d8f', '#e9c46a', '#e76f51'];
      const index = (name?.length || 0) % colors.length;
      return colors[index];
    };

    const startEditing = () => {
      editedContent.value = props.comment.content;
      isEditing.value = true;
    };

    const cancelEdit = () => {
      isEditing.value = false;
      editedContent.value = props.comment.content;
    };

    const saveEdit = async () => {
      if (!editedContent.value.trim()) return;
      
      try {
        const response = await commentService.update(props.comment.id, editedContent.value);
        emit('comment-updated', {
          ...props.comment,
          content: editedContent.value,
          is_edited: true
        });
        isEditing.value = false;
      } catch (error) {
        console.error('Error al editar comentario:', error);
        alert('Error al editar el comentario');
      }
    };

    const confirmDelete = async () => {
      if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
        try {
          await commentService.delete(props.comment.id);
          emit('comment-deleted', props.comment.id);
        } catch (error) {
          console.error('Error al eliminar comentario:', error);
          alert('Error al eliminar el comentario');
        }
      }
    };

    return {
      isEditing,
      editedContent,
      isAuthor,
      formatDate,
      getAvatarColor,
      startEditing,
      cancelEdit,
      saveEdit,
      confirmDelete,
      authStore
    };
  }
};
</script>

<style scoped lang="scss">
.comment-item {
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #f8f9fa;
  border-radius: $border-radius;
  
  &.is-reply {
    margin-left: 3rem;
    background-color: white;
    border-left: 3px solid $diabetes-light;
  }
  
  .avatar-circle {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1rem;
    flex-shrink: 0;
    overflow: hidden;

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  }
}

.author-name-link {
  cursor: pointer;
  transition: color 0.15s;

  &:hover { color: $primary; text-decoration: underline; }
}

.badge-admin {
  background-color: #6f42c1;
  color: white;
  font-size: 0.65rem;
  padding: 0.2em 0.45em;
  border-radius: 0.4rem;
}
</style>