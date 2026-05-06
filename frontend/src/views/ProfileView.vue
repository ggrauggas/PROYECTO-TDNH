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
            <label for="avatar-file-input" class="avatar-wrapper mx-auto mb-3" title="Cambiar foto de perfil">
              <div v-if="user?.avatar_url" class="avatar-img-circle">
                <img :src="user.avatar_url" alt="Avatar" class="avatar-img" />
              </div>
              <div v-else class="avatar-circle" :style="{ backgroundColor: getAvatarColor(user?.full_name) }">
                {{ user?.full_name?.charAt(0) || user?.username?.charAt(0) }}
              </div>
              <div class="avatar-overlay">
                <span v-if="uploadingAvatar" class="spinner-border spinner-border-sm text-white"></span>
                <i v-else class="bi bi-camera-fill"></i>
              </div>
            </label>
            <input
              id="avatar-file-input"
              type="file"
              accept="image/*"
              class="d-none"
              @change="handleAvatarChange"
            />
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
            <button class="btn btn-outline-danger w-100 mt-2" @click="deleteAccount" v-if="!editing">
              <i class="bi bi-trash me-2"></i>Eliminar cuenta
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

              <!-- Sección desplegable para cambiar contraseña -->
              <div class="mb-3">
                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm w-100 d-flex align-items-center justify-content-between"
                  @click="showPasswordSection = !showPasswordSection"
                >
                  <span><i class="bi bi-lock me-2"></i>Cambiar contraseña</span>
                  <i :class="showPasswordSection ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
                </button>

                <div v-if="showPasswordSection" class="border rounded-3 p-3 mt-2" style="background: #f8f9fa;">
                  <div class="mb-3">
                    <label class="form-label">Contraseña actual</label>
                    <input
                      type="password"
                      class="form-control"
                      v-model="editForm.current_password"
                      placeholder="Introduce tu contraseña actual"
                      autocomplete="current-password"
                    >
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Nueva contraseña</label>
                    <input
                      type="password"
                      class="form-control"
                      v-model="editForm.new_password"
                      placeholder="Mínimo 6 caracteres"
                      autocomplete="new-password"
                    >
                  </div>
                  <div class="mb-0">
                    <label class="form-label">Confirmar nueva contraseña</label>
                    <input
                      type="password"
                      class="form-control"
                      :class="{ 'is-invalid': editForm.confirm_password && editForm.new_password !== editForm.confirm_password }"
                      v-model="editForm.confirm_password"
                      placeholder="Repite la nueva contraseña"
                      autocomplete="new-password"
                    >
                    <div class="invalid-feedback">Las contraseñas no coinciden</div>
                  </div>
                </div>
              </div>

              <div class="mb-3 p-3 rounded-3 border" style="background: #f8f9fa;">
                <div class="form-check form-switch d-flex align-items-start gap-2 m-0">
                  <input
                    class="form-check-input mt-1 flex-shrink-0"
                    type="checkbox"
                    id="glucose-toggle"
                    v-model="editForm.glucose_enabled"
                    style="width: 2.5em; height: 1.4em;"
                  />
                  <label class="form-check-label" for="glucose-toggle">
                    <span class="fw-semibold d-block mb-1">
                      <i class="bi bi-activity text-primary me-1"></i>Activar sección "Mis datos de glucosa"
                    </span>
                    <span class="text-muted small">
                      Actívalo si tienes diabetes para acceder a la sección de seguimiento de glucosa desde el menú.
                    </span>
                  </label>
                </div>
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
          <div class="card-header bg-primary text-white">
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
          <div class="card-header bg-primary text-white">
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
import { useRouter } from 'vue-router';
import authStore from '../stores/authStore';
import userService from '../services/userService';
import postService from '../services/postService';
import authService from '../services/authService';

export default {
  name: 'ProfileView',
  setup() {
    const router = useRouter();
    const user = ref(null);
    const loading = ref(true);
    const editing = ref(false);
    const saving = ref(false);
    const uploadingAvatar = ref(false);
    const showPasswordSection = ref(false);
    const stats = reactive({ posts: 0, comments: 0, likesReceived: 0 });
    const recentPosts = ref([]);

    const editForm = reactive({
      full_name: '',
      diabetes_type: '',
      diagnosis_date: '',
      bio: '',
      glucose_enabled: false,
      current_password: '',
      new_password: '',
      confirm_password: ''
    });

    const loadUserData = async () => {
      try {
        // Esto debería venir de un endpoint /api/users/profile
        user.value = authStore.user;
        
        editForm.full_name = user.value.full_name || '';
        editForm.diabetes_type = user.value.diabetes_type || '';
        editForm.diagnosis_date = user.value.diagnosis_date || '';
        editForm.bio = user.value.bio || '';
        editForm.glucose_enabled = user.value.glucose_enabled || false;

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

    const resizeImage = (file, maxSize = 300) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let w = img.width, h = img.height;
            if (w > h) { if (w > maxSize) { h = Math.round(h * maxSize / w); w = maxSize; } }
            else { if (h > maxSize) { w = Math.round(w * maxSize / h); h = maxSize; } }
            canvas.width = w;
            canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          };
          img.onerror = reject;
          img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    const handleAvatarChange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      uploadingAvatar.value = true;
      try {
        const base64 = await resizeImage(file, 300);
        await userService.updateProfile({ avatar_url: base64 });
        const updatedUser = { ...authStore.user, avatar_url: base64 };
        authStore.setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        user.value = updatedUser;
      } catch (error) {
        console.error('Error subiendo avatar:', error);
        alert('Error al cambiar la foto de perfil');
      } finally {
        uploadingAvatar.value = false;
        event.target.value = '';
      }
    };

    const updateProfile = async () => {
      // Validar contraseñas si se quiere cambiar
      if (editForm.new_password) {
        if (editForm.new_password !== editForm.confirm_password) {
          alert('Las contraseñas no coinciden');
          return;
        }
        if (editForm.new_password.length < 6) {
          alert('La nueva contraseña debe tener al menos 6 caracteres');
          return;
        }
        if (!editForm.current_password) {
          alert('Debes introducir tu contraseña actual para cambiarla');
          return;
        }
      }

      saving.value = true;
      try {
        const payload = {
          full_name: editForm.full_name,
          diabetes_type: editForm.diabetes_type,
          diagnosis_date: editForm.diagnosis_date,
          bio: editForm.bio,
          glucose_enabled: editForm.glucose_enabled
        };
        if (editForm.new_password) {
          payload.current_password = editForm.current_password;
          payload.new_password = editForm.new_password;
        }

        const response = await userService.updateProfile(payload);
        const updatedUser = { ...authStore.user, ...response.data.user };
        authStore.setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        user.value = updatedUser;

        editing.value = false;
        showPasswordSection.value = false;
        alert('Perfil actualizado correctamente');
      } catch (error) {
        console.error('Error actualizando perfil:', error);
        const msg = error.response?.data?.message || 'Error al actualizar el perfil';
        alert(msg);
      } finally {
        saving.value = false;
      }
    };

    const deleteAccount = async () => {
      const first = confirm('¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer y perderás todos tus datos, publicaciones y comentarios.');
      if (!first) return;
      const second = confirm('Última confirmación: ¿eliminar la cuenta de forma permanente?');
      if (!second) return;

      try {
        await userService.deleteOwnAccount();
        authService.logout();
        router.push('/');
      } catch (error) {
        console.error('Error al eliminar cuenta:', error);
        alert('Error al eliminar la cuenta. Inténtalo de nuevo.');
      }
    };

    const cancelEdit = () => {
      editing.value = false;
      showPasswordSection.value = false;
      editForm.full_name = user.value.full_name || '';
      editForm.diabetes_type = user.value.diabetes_type || '';
      editForm.diagnosis_date = user.value.diagnosis_date || '';
      editForm.bio = user.value.bio || '';
      editForm.glucose_enabled = user.value.glucose_enabled || false;
      editForm.current_password = '';
      editForm.new_password = '';
      editForm.confirm_password = '';
    };

    return {
      user,
      loading,
      editing,
      saving,
      uploadingAvatar,
      showPasswordSection,
      stats,
      recentPosts,
      editForm,
      formatDate,
      formatJoinDate,
      getAvatarColor,
      handleAvatarChange,
      updateProfile,
      cancelEdit,
      deleteAccount
    };
  }
};
</script>

<style scoped lang="scss">
.avatar-wrapper {
  position: relative;
  display: block;
  width: 100px;
  height: 100px;
  cursor: pointer;

  &:hover .avatar-overlay {
    opacity: 1;
  }
}

.avatar-circle,
.avatar-img-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 2.5rem;
  overflow: hidden;
}

.avatar-img-circle {
  background-color: #eee;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  color: white;
  font-size: 1.4rem;
}
</style>