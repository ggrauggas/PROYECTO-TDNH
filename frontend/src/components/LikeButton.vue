<template>
  <button 
    class="btn btn-link btn-like" 
    :class="{ liked: isLiked }"
    @click="toggleLike"
    :disabled="!authStore.isAuthenticated || loading"
  >
    <i class="bi" :class="isLiked ? 'bi-heart-fill' : 'bi-heart'"></i>
    <span class="ms-1">{{ likeCount }}</span>
  </button>
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
    }
  },
  setup(props) {
    const likeCount = ref(props.initialCount);
    const isLiked = ref(props.initialLiked);
    const loading = ref(false);

    const toggleLike = async () => {
      if (!authStore.isAuthenticated) {
        alert('Debes iniciar sesión para dar like');
        return;
      }

      loading.value = true;
      
      try {
        let response;
        
        if (isLiked.value) {
          // Quitar like
          if (props.type === 'post') {
            response = await likeService.unlikePost(props.itemId);
          } else {
            response = await likeService.unlikeComment(props.itemId);
          }
          isLiked.value = false;
        } else {
          // Dar like
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
        // Revertir estado en caso de error
        isLiked.value = !isLiked.value;
      } finally {
        loading.value = false;
      }
    };

    return {
      likeCount,
      isLiked,
      loading,
      authStore,
      toggleLike
    };
  }
};
</script>

<style scoped>
.btn-like {
  text-decoration: none;
}
</style>