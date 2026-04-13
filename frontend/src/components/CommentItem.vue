<template>
  <div class="comment-thread">
    <!-- Columna izquierda: avatar + línea de hilo -->
    <div class="thread-left">
      <div
        class="avatar-circle"
        style="cursor: pointer;"
        :style="comment.author_avatar ? {} : { backgroundColor: getAvatarColor(comment.author_name) }"
        :title="`Ver foto de ${comment.author_name}`"
        @click="$refs.userModal.openAvatar({ avatarUrl: comment.author_avatar, authorName: comment.author_name })"
      >
        <img v-if="comment.author_avatar" :src="comment.author_avatar" alt="avatar" class="avatar-img" />
        <span v-else>{{ comment.author_name?.charAt(0) || 'U' }}</span>
      </div>
      <!-- Línea de hilo: se extiende automáticamente para cubrir todas las respuestas -->
      <div v-if="hasReplies" class="thread-line"></div>
    </div>

    <!-- Columna derecha: contenido + respuestas anidadas -->
    <div class="thread-right">
      <!-- Indicador "En respuesta a" -->
      <div v-if="parentAuthorName" class="reply-indicator">
        <i class="bi bi-arrow-return-right me-1"></i>
        En respuesta a <span class="reply-to-name">{{ parentAuthorName }}</span>
      </div>

      <!-- Cabecera: nombre, badge, fecha, menú -->
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
        </div>

        <div v-if="isAuthor" class="dropdown">
          <button class="btn btn-link text-muted p-0" type="button" data-bs-toggle="dropdown">
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
      <p v-else class="comment-body mt-1 mb-2">{{ comment.content }}</p>

      <!-- Acciones -->
      <div class="d-flex align-items-center gap-3 comment-actions">
        <LikeButton
          :item-id="comment.id"
          type="comment"
          :initial-count="comment.like_count"
          :initial-liked="comment.user_has_liked"
        />
        <button
          v-if="authStore.isAuthenticated"
          class="btn btn-link btn-sm text-muted p-0 action-btn"
          @click="$emit('reply', comment)"
        >
          <i class="bi bi-reply me-1"></i>Responder
        </button>
      </div>

      <!-- Respuestas anidadas DENTRO de thread-right para que la línea las cubra -->
      <div v-if="hasReplies" class="thread-replies">
        <CommentItem
          v-for="reply in allReplies[comment.id]"
          :key="reply.id"
          :comment="reply"
          :all-replies="allReplies"
          :depth="depth + 1"
          :parent-author-name="comment.author_name"
          @reply="$emit('reply', $event)"
          @comment-updated="$emit('comment-updated', $event)"
          @comment-deleted="$emit('comment-deleted', $event)"
        />
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
    depth: {
      type: Number,
      default: 0
    },
    allReplies: {
      type: Object,
      default: () => ({})
    },
    parentAuthorName: {
      type: String,
      default: null
    }
  },
  emits: ['reply', 'comment-updated', 'comment-deleted'],
  setup(props, { emit }) {
    const isEditing = ref(false);
    const editedContent = ref(props.comment.content);

    const isAuthor = computed(() => authStore.user?.id === props.comment.user_id);

    const hasReplies = computed(() => !!props.allReplies[props.comment.id]?.length);

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffMinutes = Math.floor(Math.abs(now - date) / (1000 * 60));

      if (diffMinutes < 1) return 'Ahora mismo';
      if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
      if (diffMinutes < 1440) {
        const hours = Math.floor(diffMinutes / 60);
        return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
      }
      return date.toLocaleDateString('es-ES');
    };

    const getAvatarColor = (name) => {
      const colors = ['#2c7da0', '#61a5c2', '#2a9d8f', '#e9c46a', '#e76f51'];
      return colors[(name?.length || 0) % colors.length];
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
        await commentService.update(props.comment.id, editedContent.value);
        emit('comment-updated', { ...props.comment, content: editedContent.value, is_edited: true });
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
      hasReplies,
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
/* ── Estructura principal de hilo ───────────────────────── */
.comment-thread {
  display: flex;
  flex-direction: row;
  gap: 12px;
  padding: 12px 0 4px;
}

/* Columna izquierda: avatar + línea */
.thread-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 40px;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  flex-shrink: 0;
  overflow: hidden;

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
}

/* Línea vertical del hilo */
.thread-line {
  width: 2px;
  flex: 1;
  background-color: #cfd9de;
  margin-top: 6px;
  border-radius: 1px;
  min-height: 20px;
}

/* Columna derecha: todo el contenido */
.thread-right {
  flex: 1;
  min-width: 0;
  padding-bottom: 4px;
}

/* ── Indicador de respuesta ─────────────────────────────── */
.reply-indicator {
  font-size: 0.78rem;
  color: #657786;
  margin-bottom: 3px;

  .reply-to-name {
    color: $primary;
    font-weight: 600;
  }
}

/* ── Contenido del comentario ───────────────────────────── */
.comment-body {
  color: #14171a;
  line-height: 1.55;
  margin: 0;
  word-break: break-word;
}

/* ── Acciones ────────────────────────────────────────────── */
.comment-actions {
  margin-bottom: 4px;
}

.action-btn {
  font-size: 0.83rem;
  text-decoration: none;

  &:hover {
    color: $primary !important;
  }
}

/* ── Respuestas anidadas (sin indentación extra) ────────── */
.thread-replies {
  margin-top: 0;
}

/* ── Utilidades ──────────────────────────────────────────── */
.author-name-link {
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: $primary;
    text-decoration: underline;
  }
}

.badge-admin {
  background-color: #6f42c1;
  color: white;
  font-size: 0.65rem;
  padding: 0.2em 0.45em;
  border-radius: 0.4rem;
}
</style>
