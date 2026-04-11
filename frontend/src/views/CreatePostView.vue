<template>
  <div class="create-post-view container py-4">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">
              <i class="bi bi-plus-circle me-2"></i>
              Crear nueva publicación
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
                  placeholder="Escribe un título descriptivo"
                  maxlength="200"
                  required
                >
                <div class="d-flex justify-content-between">
                  <div v-if="errors.title" class="invalid-feedback d-block">
                    {{ errors.title }}
                  </div>
                  <small class="text-muted ms-auto">{{ form.title.length }}/200</small>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="category" class="form-label">Categoría</label>
                  <select class="form-select" id="category" v-model="form.category">
                    <option value="">Selecciona una categoría</option>
                    <option value="general">General</option>
                    <option value="pregunta">Pregunta</option>
                    <option value="experiencia">Experiencia</option>
                    <option value="consejo">Consejo</option>
                  </select>
                </div>
                
                <div class="col-md-6">
                  <label for="tags" class="form-label">Etiquetas</label>
                  <input
                    type="text"
                    class="form-control"
                    id="tags"
                    v-model="form.tags"
                    placeholder="ej: ejercicio,alimentacion,insulina"
                  >
                  <small class="text-muted">Separa las etiquetas con comas</small>
                </div>
              </div>

              <div class="mb-3">
                <label for="content" class="form-label">Contenido *</label>
                <textarea
                  class="form-control"
                  id="content"
                  v-model="form.content"
                  :class="{ 'is-invalid': errors.content }"
                  rows="10"
                  placeholder="Escribe tu publicación aquí..."
                  required
                ></textarea>
                <div class="d-flex justify-content-between">
                  <div v-if="errors.content" class="invalid-feedback d-block">
                    {{ errors.content }}
                  </div>
                  <small class="text-muted ms-auto">{{ form.content.length }} caracteres</small>
                </div>
              </div>


              <div class="d-flex justify-content-end gap-2">
                <router-link to="/forum" class="btn btn-secondary">
                  <i class="bi bi-x-lg me-2"></i>Cancelar
                </router-link>
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-check-lg me-2"></i>
                  Publicar
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Consejos para escribir -->
        <div class="card mt-4">
          <div class="card-header bg-info text-white">
            <i class="bi bi-lightbulb me-2"></i>
            Consejos para tu publicación
          </div>
          <div class="card-body">
            <ul class="mb-0">
              <li class="mb-2">Sé claro y específico en el título para que otros usuarios sepan de qué trata.</li>
              <li class="mb-2">Comparte tu experiencia con honestidad y respeto.</li>
              <li class="mb-2">Si tienes dudas médicas, recuerda que este es un espacio de apoyo entre pares.</li>
              <li class="mb-2">Usa las etiquetas adecuadas para que tu publicación sea más fácil de encontrar.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import postService from '../services/postService';

export default {
  name: 'CreatePostView',
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const errors = reactive({});

    const form = reactive({
      title: '',
      content: '',
      category: '',
      tags: '',
    });

    const validateForm = () => {
      errors.title = '';
      errors.content = '';
      
      if (!form.title.trim()) {
        errors.title = 'El título es requerido';
      } else if (form.title.length < 5) {
        errors.title = 'El título debe tener al menos 5 caracteres';
      } else if (form.title.length > 200) {
        errors.title = 'El título no puede exceder los 200 caracteres';
      }
      
      if (!form.content.trim()) {
        errors.content = 'El contenido es requerido';
      } else if (form.content.length < 10) {
        errors.content = 'El contenido debe tener al menos 10 caracteres';
      }
      
      return !errors.title && !errors.content;
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;
      
      loading.value = true;
      
      try {
        const postData = {
          title: form.title.trim(),
          content: form.content.trim(),
          category: form.category || null,
          tags: form.tags || null
        };
        
        const response = await postService.create(postData);
        
        // Redirigir a la publicación creada
        router.push(`/post/${response.data.post.id}`);
        
      } catch (error) {
        console.error('Error creando publicación:', error);
        alert('Error al crear la publicación. Inténtalo de nuevo.');
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      errors,
      handleSubmit
    };
  }
};
</script>