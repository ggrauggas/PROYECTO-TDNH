<template>
  <div class="admin-view container-fluid py-4">

    <!-- Header -->
    <div class="admin-header mb-4 p-4 rounded-3">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h2 class="mb-1 fw-bold text-white">
            <i class="bi bi-shield-lock-fill me-2"></i>Panel de Administración
          </h2>
          <p class="text-white-50 mb-0">Gestión de usuarios, publicaciones y estadísticas</p>
        </div>
        <span class="badge admin-badge px-3 py-2 fs-6">
          <i class="bi bi-person-fill-gear me-1"></i>Admin
        </span>
      </div>
    </div>

    <!-- Tabs de navegación -->
    <ul class="nav nav-tabs admin-tabs mb-4" id="adminTabs">
      <li class="nav-item" v-for="tab in tabs" :key="tab.key">
        <button
          class="nav-link"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <i :class="`bi ${tab.icon} me-2`"></i>{{ tab.label }}
          <span v-if="tab.count !== null" class="badge ms-2" :class="activeTab === tab.key ? 'bg-primary' : 'bg-secondary'">
            {{ tab.count }}
          </span>
        </button>
      </li>
    </ul>

    <!-- ======================== TAB: ESTADÍSTICAS ======================== -->
    <div v-if="activeTab === 'stats'">
      <div v-if="loadingStats" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
        <p class="mt-2 text-muted">Cargando estadísticas...</p>
      </div>
      <div v-else class="row g-4">
        <div class="col-md-3" v-for="stat in statCards" :key="stat.label">
          <div class="card stat-card h-100 border-0">
            <div class="card-body d-flex align-items-center gap-3 p-4">
              <div class="stat-icon rounded-3 p-3" :style="{ backgroundColor: stat.color + '22', color: stat.color }">
                <i :class="`bi ${stat.icon} fs-4`"></i>
              </div>
              <div>
                <div class="stat-number fw-bold fs-3">{{ stat.value }}</div>
                <div class="text-muted small">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabla de usuarios más activos -->
        <div class="col-12">
          <div class="card border-0">
            <div class="card-header bg-transparent border-bottom fw-semibold">
              <i class="bi bi-trophy-fill text-warning me-2"></i>Usuarios más activos
            </div>
            <div class="card-body p-0">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>#</th>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Publicaciones</th>
                    <th>Comentarios</th>
                    <th>Registro</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(user, i) in topUsers" :key="user.id">
                    <td>
                      <span class="badge" :class="i === 0 ? 'bg-warning text-dark' : i === 1 ? 'bg-secondary' : 'bg-light text-dark'">
                        {{ i + 1 }}
                      </span>
                    </td>
                    <td>
                      <div class="d-flex align-items-center gap-2">
                        <div class="mini-avatar" :style="{ backgroundColor: getAvatarColor(user.username) }">
                          {{ user.username.charAt(0).toUpperCase() }}
                        </div>
                        <span class="fw-medium">{{ user.username }}</span>
                      </div>
                    </td>
                    <td class="text-muted small">{{ user.email }}</td>
                    <td><span class="badge bg-primary-subtle text-primary">{{ user.post_count || 0 }}</span></td>
                    <td><span class="badge bg-success-subtle text-success">{{ user.comment_count || 0 }}</span></td>
                    <td class="text-muted small">{{ formatDate(user.created_at) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ======================== TAB: USUARIOS ======================== -->
    <div v-if="activeTab === 'users'">
      <div class="card border-0 mb-4">
        <div class="card-body">
          <div class="row g-3 align-items-end">
            <div class="col-md-5">
              <label class="form-label small fw-semibold text-muted">BUSCAR USUARIO</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0">
                  <i class="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  class="form-control border-start-0"
                  v-model="userSearch"
                  placeholder="Nombre, email o username..."
                />
              </div>
            </div>
            <div class="col-md-3">
              <label class="form-label small fw-semibold text-muted">ROL</label>
              <select class="form-select" v-model="userRoleFilter">
                <option value="">Todos los roles</option>
                <option value="user">Usuario</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div class="col-md-4 text-end">
              <span class="text-muted small">{{ filteredUsers.length }} usuarios encontrados</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loadingUsers" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>

      <div v-else class="card border-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Tipo Diabetes</th>
                <th>Rol</th>
                <th>Registro</th>
                <th>Estado</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <div class="mini-avatar" :style="{ backgroundColor: getAvatarColor(user.username) }">
                      {{ user.username.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <div class="fw-medium">{{ user.full_name || user.username }}</div>
                      <div class="text-muted small">@{{ user.username }}</div>
                    </div>
                  </div>
                </td>
                <td class="text-muted small">{{ user.email }}</td>
                <td>
                  <span v-if="user.diabetes_type" class="badge bg-info-subtle text-info">{{ user.diabetes_type }}</span>
                  <span v-else class="text-muted small">—</span>
                </td>
                <td>
                  <span class="badge" :class="user.role === 'admin' ? 'bg-danger' : 'bg-secondary'">
                    {{ user.role === 'admin' ? 'Admin' : 'Usuario' }}
                  </span>
                </td>
                <td class="text-muted small">{{ formatDate(user.created_at) }}</td>
                <td>
                  <span class="badge" :class="user.is_active ? 'bg-success' : 'bg-danger'">
                    {{ user.is_active ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="text-end">
                  <div class="btn-group btn-group-sm">
                    <button
                      class="btn btn-outline-primary"
                      title="Editar usuario"
                      @click="openEditUser(user)"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      v-if="user.role !== 'admin'"
                      class="btn btn-outline-warning"
                      title="Hacer admin"
                      @click="confirmAction('makeAdmin', user)"
                    >
                      <i class="bi bi-shield-plus"></i>
                    </button>
                    <button
                      v-if="user.role === 'admin'"
                      class="btn btn-outline-secondary"
                      title="Quitar admin"
                      @click="confirmAction('removeAdmin', user)"
                    >
                      <i class="bi bi-shield-minus"></i>
                    </button>
                    <button
                      class="btn btn-outline-danger"
                      title="Eliminar usuario"
                      @click="confirmAction('deleteUser', user)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="7" class="text-center py-4 text-muted">
                  <i class="bi bi-people fs-2 d-block mb-2"></i>
                  No se encontraron usuarios
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ======================== TAB: PUBLICACIONES ======================== -->
    <div v-if="activeTab === 'posts'">
      <div class="card border-0 mb-4">
        <div class="card-body">
          <div class="row g-3 align-items-end">
            <div class="col-md-5">
              <label class="form-label small fw-semibold text-muted">BUSCAR PUBLICACIÓN</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0">
                  <i class="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  class="form-control border-start-0"
                  v-model="postSearch"
                  placeholder="Título o autor..."
                />
              </div>
            </div>
            <div class="col-md-3">
              <label class="form-label small fw-semibold text-muted">CATEGORÍA</label>
              <select class="form-select" v-model="postCategoryFilter">
                <option value="">Todas</option>
                <option value="general">General</option>
                <option value="pregunta">Pregunta</option>
                <option value="experiencia">Experiencia</option>
                <option value="consejo">Consejo</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loadingPosts" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>

      <div v-else class="card border-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Categoría</th>
                <th>Likes</th>
                <th>Comentarios</th>
                <th>Vistas</th>
                <th>Fecha</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="post in filteredPosts" :key="post.id">
                <td>
                  <router-link :to="`/post/${post.id}`" class="text-decoration-none fw-medium text-dark">
                    {{ truncate(post.title, 50) }}
                  </router-link>
                </td>
                <td class="text-muted small">{{ post.author_name || post.username }}</td>
                <td>
                  <span v-if="post.category" class="badge bg-primary-subtle text-primary">{{ post.category }}</span>
                  <span v-else class="text-muted small">—</span>
                </td>
                <td>
                  <span class="text-muted small"><i class="bi bi-heart me-1"></i>{{ post.like_count || 0 }}</span>
                </td>
                <td>
                  <span class="text-muted small"><i class="bi bi-chat me-1"></i>{{ post.comment_count || 0 }}</span>
                </td>
                <td>
                  <span class="text-muted small"><i class="bi bi-eye me-1"></i>{{ post.view_count || 0 }}</span>
                </td>
                <td class="text-muted small">{{ formatDate(post.created_at) }}</td>
                <td class="text-end">
                  <div class="btn-group btn-group-sm">
                    <router-link :to="`/post/${post.id}`" class="btn btn-outline-primary" title="Ver">
                      <i class="bi bi-eye"></i>
                    </router-link>
                    <button
                      class="btn btn-outline-danger"
                      title="Eliminar publicación"
                      @click="confirmAction('deletePost', post)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredPosts.length === 0">
                <td colspan="8" class="text-center py-4 text-muted">
                  <i class="bi bi-file-text fs-2 d-block mb-2"></i>
                  No se encontraron publicaciones
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ======= MODAL: Editar Usuario ======= -->
    <div class="modal fade" id="editUserModal" tabindex="-1" ref="editUserModalRef">
      <div class="modal-dialog modal-lg">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-person-gear me-2 text-primary"></i>Editar usuario
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body pt-3">
            <div v-if="editingUser" class="row g-3">
              <div class="col-md-6">
                <label class="form-label small fw-semibold">Nombre completo</label>
                <input type="text" class="form-control" v-model="editingUser.full_name" />
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-semibold">Username</label>
                <input type="text" class="form-control" v-model="editingUser.username" />
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-semibold">Email</label>
                <input type="email" class="form-control" v-model="editingUser.email" />
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-semibold">Tipo de diabetes</label>
                <select class="form-select" v-model="editingUser.diabetes_type">
                  <option value="">No especificado</option>
                  <option value="Tipo 1">Tipo 1</option>
                  <option value="Tipo 2">Tipo 2</option>
                  <option value="Gestacional">Gestacional</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-semibold">Rol</label>
                <select class="form-select" v-model="editingUser.role">
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-semibold">Estado</label>
                <select class="form-select" v-model="editingUser.is_active">
                  <option :value="true">Activo</option>
                  <option :value="false">Inactivo / Baneado</option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label small fw-semibold">Biografía</label>
                <textarea class="form-control" rows="3" v-model="editingUser.bio"></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0 pt-0">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-primary" @click="saveUserEdit" :disabled="savingUser">
              <span v-if="savingUser" class="spinner-border spinner-border-sm me-2"></span>
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ======= MODAL: Confirmar acción ======= -->
    <div class="modal fade" id="confirmModal" tabindex="-1" ref="confirmModalRef">
      <div class="modal-dialog modal-sm">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-body text-center p-4">
            <div class="confirm-icon mb-3" :class="pendingAction?.type === 'deleteUser' || pendingAction?.type === 'deletePost' ? 'text-danger' : 'text-warning'">
              <i class="bi" :class="pendingAction?.type?.includes('delete') ? 'bi-trash-fill' : 'bi-shield-fill'" style="font-size: 2.5rem;"></i>
            </div>
            <h6 class="fw-bold mb-2">{{ confirmMessages[pendingAction?.type]?.title }}</h6>
            <p class="text-muted small mb-4">{{ confirmMessages[pendingAction?.type]?.body }}</p>
            <div class="d-flex gap-2 justify-content-center">
              <button class="btn btn-secondary btn-sm px-4" data-bs-dismiss="modal">Cancelar</button>
              <button
                class="btn btn-sm px-4"
                :class="pendingAction?.type?.includes('delete') ? 'btn-danger' : 'btn-warning'"
                @click="executeAction"
                :disabled="executingAction"
              >
                <span v-if="executingAction" class="spinner-border spinner-border-sm me-1"></span>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast de notificación -->
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 9999">
      <div
        class="toast align-items-center border-0"
        :class="toast.type === 'success' ? 'bg-success text-white' : 'bg-danger text-white'"
        ref="toastRef"
        role="alert"
      >
        <div class="d-flex">
          <div class="toast-body">
            <i class="bi me-2" :class="toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
            {{ toast.message }}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, reactive, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import authStore from '../stores/authStore';
import userService from '../services/userService';
import postService from '../services/postService';

export default {
  name: 'AdminView',
  setup() {
    const router = useRouter();

    // Redirigir si no es admin
    if (!authStore.isAuthenticated || authStore.user?.role !== 'admin') {
      router.push('/');
    }

    // ---- Tabs ----
    const activeTab = ref('stats');

    // ---- Estado ----
    const users = ref([]);
    const posts = ref([]);
    const loadingStats = ref(true);
    const loadingUsers = ref(true);
    const loadingPosts = ref(true);
    const userSearch = ref('');
    const userRoleFilter = ref('');
    const postSearch = ref('');
    const postCategoryFilter = ref('');
    const editingUser = ref(null);
    const savingUser = ref(false);
    const pendingAction = ref(null);
    const executingAction = ref(false);

    // Refs modals
    const editUserModalRef = ref(null);
    const confirmModalRef = ref(null);
    const toastRef = ref(null);

    const toast = reactive({ message: '', type: 'success' });

    // ---- Carga de datos ----
    const loadUsers = async () => {
      loadingUsers.value = true;
      try {
        // Llamada real a la API: const res = await userService.getAll();
        // Datos de ejemplo para mostrar la UI:
        users.value = [
          { id: 1, username: 'carlos_diabetes', email: 'carlos@example.com', full_name: 'Carlos Rodríguez', diabetes_type: 'Tipo 1', role: 'user', is_active: true, created_at: '2024-01-15', post_count: 5, comment_count: 12 },
          { id: 2, username: 'ana_martinez', email: 'ana@example.com', full_name: 'Ana Martínez', diabetes_type: 'Tipo 1', role: 'user', is_active: true, created_at: '2024-02-03', post_count: 3, comment_count: 8 },
          { id: 3, username: 'miguel_asesor', email: 'miguel@example.com', full_name: 'Miguel Sánchez', diabetes_type: 'Tipo 1', role: 'admin', is_active: true, created_at: '2024-01-01', post_count: 10, comment_count: 34 },
          { id: 4, username: 'lucia_tipo2', email: 'lucia@example.com', full_name: 'Lucía Pérez', diabetes_type: 'Tipo 2', role: 'user', is_active: false, created_at: '2024-03-10', post_count: 1, comment_count: 2 },
        ];
      } catch (e) {
        console.error('Error cargando usuarios:', e);
      } finally {
        loadingUsers.value = false;
      }
    };

    const loadPosts = async () => {
      loadingPosts.value = true;
      try {
        const res = await postService.getAll(1);
        posts.value = res.data?.posts || [];
      } catch (e) {
        console.error('Error cargando posts:', e);
        posts.value = [];
      } finally {
        loadingPosts.value = false;
      }
    };

    onMounted(async () => {
      await Promise.all([loadUsers(), loadPosts()]);
      loadingStats.value = false;
    });

    // ---- Estadísticas ----
    const statCards = computed(() => [
      { label: 'Usuarios registrados', value: users.value.length, icon: 'bi-people-fill', color: '#2c7da0' },
      { label: 'Publicaciones', value: posts.value.length, icon: 'bi-file-text-fill', color: '#2a9d8f' },
      { label: 'Usuarios activos', value: users.value.filter(u => u.is_active).length, icon: 'bi-person-check-fill', color: '#e9c46a' },
      { label: 'Administradores', value: users.value.filter(u => u.role === 'admin').length, icon: 'bi-shield-fill', color: '#e76f51' },
    ]);

    const topUsers = computed(() =>
      [...users.value].sort((a, b) => (b.post_count + b.comment_count) - (a.post_count + a.comment_count)).slice(0, 5)
    );

    const tabs = computed(() => [
      { key: 'stats', label: 'Estadísticas', icon: 'bi-bar-chart-fill', count: null },
      { key: 'users', label: 'Usuarios', icon: 'bi-people-fill', count: users.value.length },
      { key: 'posts', label: 'Publicaciones', icon: 'bi-file-text-fill', count: posts.value.length },
    ]);

    // ---- Filtros ----
    const filteredUsers = computed(() => {
      return users.value.filter(u => {
        const matchSearch = !userSearch.value ||
          u.username.toLowerCase().includes(userSearch.value.toLowerCase()) ||
          u.email.toLowerCase().includes(userSearch.value.toLowerCase()) ||
          (u.full_name || '').toLowerCase().includes(userSearch.value.toLowerCase());
        const matchRole = !userRoleFilter.value || u.role === userRoleFilter.value;
        return matchSearch && matchRole;
      });
    });

    const filteredPosts = computed(() => {
      return posts.value.filter(p => {
        const matchSearch = !postSearch.value ||
          p.title.toLowerCase().includes(postSearch.value.toLowerCase()) ||
          (p.author_name || '').toLowerCase().includes(postSearch.value.toLowerCase());
        const matchCat = !postCategoryFilter.value || p.category === postCategoryFilter.value;
        return matchSearch && matchCat;
      });
    });

    // ---- Edición de usuario ----
    const openEditUser = (user) => {
      editingUser.value = { ...user };
      nextTick(() => {
        const modal = new window.bootstrap.Modal(editUserModalRef.value);
        modal.show();
      });
    };

    const saveUserEdit = async () => {
      savingUser.value = true;
      try {
        // Llamada real: await userService.adminUpdate(editingUser.value.id, editingUser.value);
        const idx = users.value.findIndex(u => u.id === editingUser.value.id);
        if (idx !== -1) users.value[idx] = { ...editingUser.value };
        window.bootstrap.Modal.getInstance(editUserModalRef.value)?.hide();
        showToast('Usuario actualizado correctamente', 'success');
      } catch (e) {
        showToast('Error al actualizar el usuario', 'error');
      } finally {
        savingUser.value = false;
      }
    };

    // ---- Confirmar acciones ----
    const confirmMessages = {
      deleteUser: { title: '¿Eliminar usuario?', body: 'Esta acción no se puede deshacer. Se eliminarán también sus publicaciones y comentarios.' },
      deletePost: { title: '¿Eliminar publicación?', body: 'La publicación y todos sus comentarios serán eliminados permanentemente.' },
      makeAdmin: { title: '¿Hacer administrador?', body: 'Este usuario tendrá acceso completo al panel de administración.' },
      removeAdmin: { title: '¿Quitar rol admin?', body: 'El usuario pasará a tener permisos estándar.' },
    };

    const confirmAction = (type, target) => {
      pendingAction.value = { type, target };
      nextTick(() => {
        const modal = new window.bootstrap.Modal(confirmModalRef.value);
        modal.show();
      });
    };

    const executeAction = async () => {
      executingAction.value = true;
      const { type, target } = pendingAction.value;

      try {
        if (type === 'deleteUser') {
          // await userService.adminDelete(target.id);
          users.value = users.value.filter(u => u.id !== target.id);
          showToast('Usuario eliminado', 'success');
        } else if (type === 'deletePost') {
          await postService.delete(target.id);
          posts.value = posts.value.filter(p => p.id !== target.id);
          showToast('Publicación eliminada', 'success');
        } else if (type === 'makeAdmin') {
          // await userService.adminUpdate(target.id, { role: 'admin' });
          const u = users.value.find(u => u.id === target.id);
          if (u) u.role = 'admin';
          showToast('Rol de administrador asignado', 'success');
        } else if (type === 'removeAdmin') {
          // await userService.adminUpdate(target.id, { role: 'user' });
          const u = users.value.find(u => u.id === target.id);
          if (u) u.role = 'user';
          showToast('Rol de administrador eliminado', 'success');
        }
        window.bootstrap.Modal.getInstance(confirmModalRef.value)?.hide();
      } catch (e) {
        showToast('Error al ejecutar la acción', 'error');
      } finally {
        executingAction.value = false;
      }
    };

    // ---- Utilidades ----
    const showToast = (message, type) => {
      toast.message = message;
      toast.type = type;
      nextTick(() => {
        const t = new window.bootstrap.Toast(toastRef.value, { delay: 3000 });
        t.show();
      });
    };

    const formatDate = (d) => {
      if (!d) return '—';
      return new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const truncate = (str, n) => str && str.length > n ? str.substring(0, n) + '...' : str;

    const getAvatarColor = (name) => {
      const colors = ['#2c7da0', '#61a5c2', '#2a9d8f', '#e9c46a', '#e76f51'];
      return colors[(name?.length || 0) % colors.length];
    };

    return {
      activeTab, tabs, users, posts,
      loadingStats, loadingUsers, loadingPosts,
      userSearch, userRoleFilter, postSearch, postCategoryFilter,
      filteredUsers, filteredPosts, statCards, topUsers,
      editingUser, savingUser, pendingAction, executingAction,
      confirmMessages, toast,
      editUserModalRef, confirmModalRef, toastRef,
      openEditUser, saveUserEdit, confirmAction, executeAction,
      formatDate, truncate, getAvatarColor,
    };
  }
};
</script>

<style scoped lang="scss">
.admin-header {
  background: linear-gradient(135deg, #1a5f7a 0%, #2c7da0 60%, #2a9d8f 100%);
  box-shadow: 0 4px 20px rgba(44, 125, 160, 0.3);
}

.admin-badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
}

.admin-tabs {
  border-bottom: 2px solid #dee2e6;

  .nav-link {
    color: #6c757d;
    font-weight: 500;
    border: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    padding: 0.6rem 1.2rem;
    transition: all 0.2s;

    &:hover { color: #2c7da0; background: #f8f9fa; }
    &.active { color: #2c7da0; border-bottom-color: #2c7da0; background: transparent; font-weight: 600; }
  }
}

.stat-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  }

  .stat-icon { border-radius: 10px; }
  .stat-number { color: #1a1a2e; line-height: 1; }
}

.mini-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.table {
  th { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6c757d; }
  td { font-size: 0.9rem; }
  tbody tr { transition: background 0.15s; }
}

.modal-content { border-radius: 16px; }
</style>