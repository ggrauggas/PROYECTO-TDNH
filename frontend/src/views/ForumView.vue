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
    border: 2px solid rgba($primary, 0.22);
    border-radius: $border-radius-lg;
    overflow: hidden;
    background: #fff;
    transition: border-color 0.2s;

    &:focus-within {
      border-color: $primary;
    }
  }

  .search-icon {
    background: #fff;
    border: none;
    color: $primary;
    font-size: 1rem;
    padding-left: 1.1rem;
  }

  .search-input {
    background: #fff;
    border: none;
    font-size: 0.95rem;
    padding: 0.7rem 0.75rem;

    &:focus {
      box-shadow: none;
      background: #fff;
    }
  }

  .search-clear {
    background: #fff;
    border: none;
    color: #94a3b8;

    &:hover { color: $dark; background: #fff; }
  }
}
</style>