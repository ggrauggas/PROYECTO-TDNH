<template>
  <div class="profile-view container py-4">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else class="row">
      <div class="col-md-4 mb-4">
        <div class="card">
          <div class="card-body text-center">
            <div class="avatar-circle mx-auto mb-3" :style="{ backgroundColor: getAvatarColor(user?.full_name) }">
              {{ user?.full_name?.charAt(0) || user?.username?.charAt(0) }}
            </div>
            <h4>{{ user?.full_name || user?.username }}</h4>
            <p class="text-muted">@{{ user?.username }}</p>
            
            <div class="mt-3">
              <span class="badge bg-primary me-2">{{ user?.diabetes_type || 'No especificado' }}</span>
              <span v-if="user?.diagnosis_date" class="badge bg-info">
                Diagnosticado: {{ formatDate(user.diagnosis_date) }}
              </span>
            </div>

            <hr>

            <div class="text-start">
              <p><i class="bi bi-envelope me-2"></i> {{ user?.email }}</p>
              <p><i class="bi bi-calendar me-2"></i> Miembro desde: {{ formatJoinDate(user?.created_at) }}</p>
              <p v-if="user?.bio"><i class="bi bi-chat me-2"></i> {{ user.bio }}</p>
            </div>

            <button class="btn btn-outline-primary w-100" @click="editing = true" v-if="!editing">
              <i class="bi bi-pencil me-2"></i>Editar perfil
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <!-- Formulario de edición -->
        <div v-if="editing" class="card mb-4">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">
              <i class="bi bi-pencil-square me-2"></i>
              Editar perfil
            </h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="updateProfile">
              <div class="mb-3">
                <label class="form-label">Nombre completo</label>
                <input type="text" class="form-control" v-model="editForm.full_name">
              </div>

              <div class="mb-3">
                <label class="form-label">Tipo de diabetes</label>
                <select class="form-select" v-model="editForm.diabetes_type">
                  <option value="">Selecciona...</option>
                  <option value="Tipo 1">Tipo 1</option>
                  <option value="Tipo 2">Tipo 2</option>
                  <option value="Gestacional">Gestacional</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label">Fecha de diagnóstico</label>
                <input type="date" class="form-control" v-model="editForm.diagnosis_date">
              </div>

              <div class="mb-3">
                <label class="form-label">Biografía</label>
                <textarea class="form-control" v-model="editForm.bio" rows="3"></textarea>
              </div>

              <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-secondary" @click="cancelEdit">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-primary" :disabled="saving">
                  <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Estadísticas -->
        <div class="card mb-4">
          <div class="card-header bg-info text-white">
            <h5 class="mb-0">
              <i class="bi bi-bar-chart me-2"></i>
              Mis estadísticas
            </h5>
          </div>
          <div class="card-body">
            <div class="row text-center">
              <div class="col-4">
                <h3>{{ stats.posts }}</h3>
                <small class="text-muted">Publicaciones</small>
              </div>
              <div class="col-4">
                <h3>{{ stats.comments }}</h3>
                <small class="text-muted">Comentarios</small>
              </div>
              <div class="col-4">
                <h3>{{ stats.likesReceived }}</h3>
                <small class="text-muted">Likes recibidos</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Mis últimas publicaciones -->
        <div class="card">
          <div class="card-header bg-success text-white">
            <h5 class="mb-0">
              <i class="bi bi-file-text me-2"></i>
              Mis últimas publicaciones
            </h5>
          </div>
          <div class="list-group list-group-flush">
            <div v-if="recentPosts.length === 0" class="list-group-item text-center py-4">
              <p class="text-muted mb-0">No has creado publicaciones todavía</p>
              <router-link to="/create-post" class="btn btn-primary btn-sm mt-3">
                Crear primera publicación
              </router-link>
            </div>
            <div v-for="post in recentPosts" :key="post.id" class="list-group-item">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <routerLink :to="`/post/${post.id}`" class="text-decoration-none">
                    <h6 class="mb-1">{{ post.title }}</h6>
                  </routerLink>
                  <small class="text-muted">
                    {{ formatDate(post.created_at) }} · 
                    {{ post.comment_count || 0 }} comentarios ·
                    {{ post.like_count || 0 }} likes
                  </small>
                </div>
                <routerLink :to="`/post/${post.id}`" class="btn btn-sm btn-outline-primary">
                  Ver
                </routerLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import authStore from '../stores/authStore';
import userService from '../services/userService';
import postService from '../services/postService';

export default {
  name: 'ProfileView',
  setup() {
    const user = ref(null);
    const loading = ref(true);
    const editing = ref(false);
    const saving = ref(false);
    const stats = reactive({ posts: 0, comments: 0, likesReceived: 0 });
    const recentPosts = ref([]);

    const editForm = reactive({
      full_name: '',
      diabetes_type: '',
      diagnosis_date: '',
      bio: ''
    });

    const loadUserData = async () => {
      try {
        // Esto debería venir de un endpoint /api/users/profile
        user.value = authStore.user;
        
        editForm.full_name = user.value.full_name || '';
        editForm.diabetes_type = user.value.diabetes_type || '';
        editForm.diagnosis_date = user.value.diagnosis_date || '';
        editForm.bio = user.value.bio || '';

        // Cargar publicaciones recientes del usuario y estadísticas reales en paralelo
        const [postsResponse, statsResponse] = await Promise.all([
          postService.getByUser(user.value.id, 1, 5),
          userService.getStats(user.value.id)
        ]);

        recentPosts.value = postsResponse.data.posts;

        stats.posts = statsResponse.data.stats.posts;
        stats.comments = statsResponse.data.stats.comments;
        stats.likesReceived = statsResponse.data.stats.likesReceived;

      } catch (error) {
        console.error('Error cargando perfil:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(loadUserData);

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES');
    };

    const formatJoinDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
    };

    const getAvatarColor = (name) => {
      const colors = ['#2c7da0', '#61a5c2', '#2a9d8f', '#e9c46a', '#e76f51'];
      const index = (name?.length || 0) % colors.length;
      return colors[index];
    };

    const updateProfile = async () => {
      saving.value = true;
      try {
        // Aquí llamarías a la API para actualizar el perfil
        // await userService.updateProfile(editForm);
        
        // Actualizar store local
        authStore.user = { ...authStore.user, ...editForm };
        
        editing.value = false;
        alert('Perfil actualizado correctamente');
      } catch (error) {
        console.error('Error actualizando perfil:', error);
        alert('Error al actualizar el perfil');
      } finally {
        saving.value = false;
      }
    };

    const cancelEdit = () => {
      editing.value = false;
      // Restaurar valores originales
      editForm.full_name = user.value.full_name || '';
      editForm.diabetes_type = user.value.diabetes_type || '';
      editForm.diagnosis_date = user.value.diagnosis_date || '';
      editForm.bio = user.value.bio || '';
    };

    return {
      user,
      loading,
      editing,
      saving,
      stats,
      recentPosts,
      editForm,
      formatDate,
      formatJoinDate,
      getAvatarColor,
      updateProfile,
      cancelEdit
    };
  }
};
</script>

<style scoped lang="scss">
.avatar-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 2.5rem;
}
</style>