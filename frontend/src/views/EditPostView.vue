# Crear EditPostView.vue
@'
<template>
  <div class="edit-post-view container py-4">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="post" class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">
              <i class="bi bi-pencil-square me-2"></i>
              Editar publicación
            </h5>
          </div>
          
          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="title" class="form-label">Título *</label>
                <input
                  type="text"
                  class="form-control"
                  id="title"
                  v-model="form.title"
                  :class="{ 'is-invalid': errors.title }"
                  maxlength="200"
                  required
                >
                <div v-if="errors.title" class="invalid-feedback">{{ errors.title }}</div>
              </div>

              <div class="mb-3">
                <label for="category" class="form-label">Categoría</label>
                <select class="form-select" id="category" v-model="form.category">
                  <option value="">Selecciona una categoría</option>
                  <option value="general">General</option>
                  <option value="pregunta">Pregunta</option>
                  <option value="experiencia">Experiencia</option>
                  <option value="consejo">Consejo</option>
                </select>
              </div>

              <div class="mb-3">
                <label for="content" class="form-label">Contenido *</label>
                <textarea
                  class="form-control"
                  id="content"
                  v-model="form.content"
                  :class="{ 'is-invalid': errors.content }"
                  rows="10"
                  required
                ></textarea>
                <div v-if="errors.content" class="invalid-feedback">{{ errors.content }}</div>
              </div>

              <div class="d-flex justify-content-end gap-2">
                <router-link :to="`/post/${post.id}`" class="btn btn-secondary">
                  Cancelar
                </router-link>
                <button type="submit" class="btn btn-primary" :disabled="submitting">
                  <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import postService from '../services/postService';

export default {
  name: 'EditPostView',
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
    const submitting = ref(false);
    const errors = reactive({});

    const form = reactive({
      title: '',
      content: '',
      category: '',
      tags: ''
    });

    const loadPost = async () => {
      try {
        const response = await postService.getById(props.id);
        post.value = response.data.post;
        form.title = post.value.title;
        form.content = post.value.content;
        form.category = post.value.category || '';
        form.tags = post.value.tags || '';
      } catch (error) {
        console.error('Error cargando post:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(loadPost);

    const handleSubmit = async () => {
      errors.title = '';
      errors.content = '';
      
      if (!form.title.trim()) {
        errors.title = 'El título es requerido';
        return;
      }
      if (!form.content.trim()) {
        errors.content = 'El contenido es requerido';
        return;
      }
      
      submitting.value = true;
      try {
        await postService.update(props.id, form);
        router.push(`/post/${props.id}`);
      } catch (error) {
        console.error('Error actualizando publicación:', error);
        alert('Error al actualizar la publicación');
      } finally {
        submitting.value = false;
      }
    };

    return {
      post,
      loading,
      submitting,
      form,
      errors,
      handleSubmit
    };
  }
};
</script>
'@ | Out-File -FilePath frontend/src/views/EditPostView.vue -Encoding UTF8