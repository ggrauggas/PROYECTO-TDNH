<template>
  <div class="post-list">
    <!-- Estado de carga -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando publicaciones...</span>
      </div>
      <p class="mt-2 text-muted">Cargando publicaciones...</p>
    </div>
    
    <!-- Sin publicaciones -->
    <div v-else-if="posts.length === 0" class="text-center py-5">
      <i class="bi bi-chat-dots" style="font-size: 3rem; color: #ccc;"></i>
      <h4 class="mt-3 text-muted">No hay publicaciones todavía</h4>
      <p class="text-muted">¡Sé el primero en compartir tu experiencia!</p>
      <router-link v-if="authStore.isAuthenticated" to="/create-post" class="btn btn-primary">
        <i class="bi bi-plus-circle me-2"></i>Crear publicación
      </router-link>
    </div>
    
    <!-- Lista de publicaciones -->
    <div v-else>
      <div class="mb-4 d-flex justify-content-between align-items-center">
        <h5 class="mb-0">
          <i class="bi bi-collection-fill text-primary me-2"></i>
          Publicaciones ({{ posts.length }})
        </h5>
        <router-link v-if="authStore.isAuthenticated && showCreateButton" to="/create-post" class="btn btn-primary btn-sm">
          <i class="bi bi-plus-circle me-2"></i>Nueva publicación
        </router-link>
      </div>
      
      <PostItem
        v-for="post in posts"
        :key="post.id"
        :post="post"
        @post-deleted="handlePostDeleted"
      />
      
      <div v-if="hasMore" class="text-center mt-4">
        <button 
          class="btn btn-outline-primary" 
          @click="loadMore" 
          :disabled="loadingMore"
        >
          <span v-if="loadingMore" class="spinner-border spinner-border-sm me-2"></span>
          Cargar más publicaciones
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import PostItem from './PostItem.vue';
import authStore from '../stores/authStore';
import postService from '../services/postService';

export default {
  name: 'PostList',
  components: { PostItem },
  props: {
    userId: {
      type: Number,
      default: null
    },
    showCreateButton: {
      type: Boolean,
      default: true
    }
  },
  emits: ['post-deleted'],
  setup(props, { emit }) {
    const posts = ref([]);
    const loading = ref(true);
    const loadingMore = ref(false);
    const currentPage = ref(1);
    const hasMore = ref(true);

    const loadPosts = async (page = 1) => {
      try {
        console.log('Cargando posts, página:', page);
        let response;
        
        if (props.userId) {
          response = await postService.getByUser(props.userId, page);
        } else {
          response = await postService.getAll(page);
        }
        
        console.log('Posts recibidos:', response);
        
        if (response.data && response.data.posts) {
          if (page === 1) {
            posts.value = response.data.posts;
          } else {
            posts.value = [...posts.value, ...response.data.posts];
          }
          
          hasMore.value = response.data.pagination?.hasMore || false;
          currentPage.value = page;
        } else {
          console.error('Formato de respuesta inesperado:', response);
          posts.value = [];
        }
      } catch (error) {
        console.error('Error cargando posts:', error);
        posts.value = [];
      } finally {
        loading.value = false;
      }
    };

    const loadMore = async () => {
      if (loadingMore.value || !hasMore.value) return;
      
      loadingMore.value = true;
      await loadPosts(currentPage.value + 1);
      loadingMore.value = false;
    };

    const handlePostDeleted = (postId) => {
      posts.value = posts.value.filter(p => p.id !== postId);
      emit('post-deleted', postId);
    };

    onMounted(() => {
      console.log('PostList montado, cargando posts...');
      loadPosts();
    });

    return {
      posts,
      loading,
      loadingMore,
      hasMore,
      authStore,
      loadMore,
      handlePostDeleted
    };
  }
};
</script>