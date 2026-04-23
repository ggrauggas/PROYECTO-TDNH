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

        <!-- Buscador -->
        <div class="search-bar mb-4">
          <div class="input-group">
            <span class="input-group-text search-icon">
              <i class="bi bi-search"></i>
            </span>
            <input
              v-model="rawQuery"
              type="text"
              class="form-control search-input"
              placeholder="Buscar por título, contenido o comentarios..."
              autocomplete="off"
            />
            <button
              v-if="rawQuery"
              class="btn btn-outline-secondary search-clear"
              type="button"
              @click="rawQuery = ''"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <!-- Lista de posts -->
        <PostList
          ref="postList"
          :search-query="debouncedQuery"
          @post-deleted="handlePostDeleted"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import PostList from '../components/PostList.vue';
import authStore from '../stores/authStore';

export default {
  name: 'ForumView',
  components: { PostList },
  setup() {
    const postList = ref(null);
    const rawQuery = ref('');
    const debouncedQuery = ref('');
    let debounceTimer = null;

    watch(rawQuery, (val) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        debouncedQuery.value = val;
      }, 400);
    });

    const handlePostDeleted = () => {};

    return {
      authStore,
      postList,
      rawQuery,
      debouncedQuery,
      handlePostDeleted
    };
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.search-bar {
  .input-group {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
    border-radius: $border-radius-lg;
    overflow: hidden;
  }

  .search-icon {
    background: #fff;
    border-right: none;
    color: $primary;
    font-size: 1rem;
    padding-left: 1rem;
  }

  .search-input {
    border-left: none;
    font-size: 0.95rem;
    padding: 0.65rem 0.75rem;

    &:focus {
      box-shadow: none;
      border-color: #dee2e6;
    }
  }

  .search-clear {
    border-left: none;
    color: #94a3b8;

    &:hover { color: $dark; }
  }
}
</style>