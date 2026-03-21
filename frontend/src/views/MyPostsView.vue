<template>
  <div class="my-posts-view container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0">
        <i class="bi bi-file-text-fill text-primary me-2"></i>
        Mis publicaciones
      </h4>
      <router-link to="/create-post" class="btn btn-primary">
        <i class="bi bi-plus-circle me-2"></i>Nueva publicación
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else>
      <PostList
        :user-id="authStore.user?.id"
        @post-deleted="handlePostDeleted"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import PostList from '../components/PostList.vue';
import authStore from '../stores/authStore';

export default {
  name: 'MyPostsView',
  components: { PostList },
  setup() {
    const loading = ref(false);

    const handlePostDeleted = (postId) => {
      // El PostList ya maneja la eliminación
      console.log('Post eliminado:', postId);
    };

    return {
      loading,
      authStore,
      handlePostDeleted
    };
  }
};
</script>