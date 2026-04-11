<template>
  <div class="comment-section">
    <h5 class="mb-4">
      <i class="bi bi-chat-text-fill text-primary me-2"></i>
      Comentarios ({{ totalComments }})
    </h5>
    
    <!-- Formulario de nuevo comentario -->
    <div v-if="authStore.isAuthenticated" class="new-comment mb-4">
      <div class="d-flex">
        <div
          class="avatar-circle me-2"
          :style="authStore.user?.avatar_url ? {} : { backgroundColor: getAvatarColor(authStore.user?.full_name) }"
        >
          <img
            v-if="authStore.user?.avatar_url"
            :src="authStore.user.avatar_url"
            :alt="authStore.user.username"
            class="avatar-img"
          />
          <span v-else>{{ authStore.user?.full_name?.charAt(0) || authStore.user?.username?.charAt(0) }}</span>
        </div>
        <div class="flex-grow-1">
          <textarea
            v-model="newCommentContent"
            class="form-control"
            :placeholder="replyTo ? 'Escribe tu respuesta...' : 'Escribe un comentario...'"
            rows="2"
          ></textarea>
          
          <div v-if="replyTo" class="mt-2 text-muted small">
            <i class="bi bi-reply-fill me-1"></i>
            Respondiendo a {{ replyTo.author_name }}
            <button class="btn btn-link btn-sm p-0 ms-2" @click="cancelReply">
              <i class="bi bi-x-circle"></i>
            </button>
          </div>
          
          <div class="mt-2">
            <button 
              class="btn btn-primary btn-sm" 
              @click="submitComment"
              :disabled="!newCommentContent.trim() || submitting"
            >
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ replyTo ? 'Responder' : 'Comentar' }}
            </button>
            <button 
              v-if="replyTo" 
              class="btn btn-link btn-sm ms-2" 
              @click="cancelReply"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="alert alert-info">
      <i class="bi bi-info-circle me-2"></i>
      <router-link to="/login">Inicia sesión</router-link> para comentar.
    </div>
    
    <!-- Lista de comentarios -->
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando comentarios...</span>
      </div>
    </div>
    
    <div v-else-if="comments.length === 0" class="text-center py-4 text-muted">
      <i class="bi bi-chat-dots" style="font-size: 2rem;"></i>
      <p class="mt-2">No hay comentarios todavía. ¡Sé el primero en comentar!</p>
    </div>
    
    <div v-else class="comments-tree">
      <div v-for="comment in rootComments" :key="comment.id" class="mb-3">
        <CommentItem
          :comment="comment"
          @reply="setReplyTo"
          @comment-updated="handleCommentUpdated"
          @comment-deleted="handleCommentDeleted"
        />
        
        <!-- Respuestas -->
        <div v-if="commentReplies[comment.id]" class="replies">
          <CommentItem
            v-for="reply in commentReplies[comment.id]"
            :key="reply.id"
            :comment="reply"
            :is-reply="true"
            @reply="setReplyTo"
            @comment-updated="handleCommentUpdated"
            @comment-deleted="handleCommentDeleted"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import CommentItem from './CommentItem.vue';
import authStore from '../stores/authStore';
import commentService from '../services/commentService';

export default {
  name: 'CommentSection',
  components: { CommentItem },
  props: {
    postId: {
      type: Number,
      required: true
    }
  },
  emits: ['comment-count-changed'],
  setup(props, { emit }) {
    const comments = ref([]);
    const loading = ref(true);
    const submitting = ref(false);
    const newCommentContent = ref('');
    const replyTo = ref(null);

    const loadComments = async () => {
      loading.value = true;
      try {
        const response = await commentService.getByPost(props.postId);
        comments.value = response.data.comments;
      } catch (error) {
        console.error('Error cargando comentarios:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(loadComments);

    // Organizar comentarios en árbol
    const rootComments = computed(() => {
      return comments.value.filter(c => !c.parent_comment_id);
    });

    const commentReplies = computed(() => {
      const replies = {};
      comments.value.forEach(comment => {
        if (comment.parent_comment_id) {
          if (!replies[comment.parent_comment_id]) {
            replies[comment.parent_comment_id] = [];
          }
          replies[comment.parent_comment_id].push(comment);
        }
      });
      return replies;
    });

    const totalComments = computed(() => comments.value.length);

    const getAvatarColor = (name) => {
      const colors = ['#2c7da0', '#61a5c2', '#2a9d8f', '#e9c46a', '#e76f51'];
      const index = (name?.length || 0) % colors.length;
      return colors[index];
    };

    const setReplyTo = (comment) => {
      replyTo.value = comment;
    };

    const cancelReply = () => {
      replyTo.value = null;
      newCommentContent.value = '';
    };

    const submitComment = async () => {
      if (!newCommentContent.value.trim()) return;
      
      submitting.value = true;
      
      try {
        const commentData = {
          post_id: props.postId,
          content: newCommentContent.value
        };
        
        if (replyTo.value) {
          commentData.parent_comment_id = replyTo.value.id;
        }
        
        const response = await commentService.create(commentData);
        
        // Añadir el nuevo comentario a la lista
        comments.value.push(response.data.comment);
        emit('comment-count-changed', comments.value.length);

        // Limpiar formulario
        newCommentContent.value = '';
        replyTo.value = null;
        
      } catch (error) {
        console.error('Error al crear comentario:', error);
        alert('Error al crear el comentario');
      } finally {
        submitting.value = false;
      }
    };

    const handleCommentUpdated = (updatedComment) => {
      const index = comments.value.findIndex(c => c.id === updatedComment.id);
      if (index !== -1) {
        comments.value[index] = updatedComment;
      }
    };

    const handleCommentDeleted = (commentId) => {
      comments.value = comments.value.filter(c => c.id !== commentId);
    };

    return {
      comments,
      loading,
      submitting,
      newCommentContent,
      replyTo,
      rootComments,
      commentReplies,
      totalComments,
      authStore,
      getAvatarColor,
      setReplyTo,
      cancelReply,
      submitComment,
      handleCommentUpdated,
      handleCommentDeleted
    };
  }
};
</script>

<style scoped lang="scss">
.comment-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #dee2e6;
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
  flex-shrink: 0;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.replies {
  margin-left: 3rem;
  margin-top: 1rem;
}
</style>