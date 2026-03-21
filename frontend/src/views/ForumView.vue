<template>
  <div class="forum-view container py-4">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="mb-0">
            <i class="bi bi-chat-dots-fill text-primary me-2"></i>
            Foro de discusión
          </h2>
        </div>

        <!-- Lista de posts -->
        <PostList ref="postList" @post-deleted="handlePostDeleted" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import PostList from '../components/PostList.vue';
import authStore from '../stores/authStore';

export default {
  name: 'ForumView',
  components: { PostList },
  setup() {
    const postList = ref(null);

    const handlePostDeleted = (postId) => {
      console.log('Post eliminado:', postId);
      // El PostList ya maneja la eliminación
    };

    return {
      authStore,
      postList,
      handlePostDeleted
    };
  }
};
</script>