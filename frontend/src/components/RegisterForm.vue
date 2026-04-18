<template>
  <div class="auth-form">
    <h3 class="text-center mb-4">
      <i class="bi bi-person-plus text-primary me-2"></i>
      Registro de usuario
    </h3>
    
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="username" class="form-label">Nombre de usuario *</label>
        <input
          type="text"
          class="form-control"
          id="username"
          v-model="form.username"
          :class="{ 'is-invalid': errors.username }"
          placeholder="ej: user_diabetes"
          required
        >
        <div v-if="errors.username" class="invalid-feedback">
          {{ errors.username }}
        </div>
      </div>
      
      <div class="mb-3">
        <label for="email" class="form-label">Email *</label>
        <input
          type="email"
          class="form-control"
          id="email"
          v-model="form.email"
          :class="{ 'is-invalid': errors.email }"
          placeholder="tu@email.com"
          required
        >
        <div v-if="errors.email" class="invalid-feedback">
          {{ errors.email }}
        </div>
      </div>
      
      <div class="mb-3">
        <label for="password" class="form-label">Contraseña *</label>
        <input
          type="password"
          class="form-control"
          id="password"
          v-model="form.password"
          :class="{ 'is-invalid': errors.password }"
          placeholder="********"
          required
        >
        <div v-if="errors.password" class="invalid-feedback">
          {{ errors.password }}
        </div>
      </div>
      
      <div class="mb-3">
        <label for="password_confirmation" class="form-label">Confirmar contraseña *</label>
        <input
          type="password"
          class="form-control"
          id="password_confirmation"
          v-model="form.password_confirmation"
          :class="{ 'is-invalid': errors.password_confirmation }"
          placeholder="********"
          required
        >
        <div v-if="errors.password_confirmation" class="invalid-feedback">
          {{ errors.password_confirmation }}
        </div>
      </div>
      
      <div class="mb-3 p-3 rounded-3 border" style="background: #f8f9fa;">
        <div class="form-check form-switch d-flex align-items-start gap-2 m-0">
          <input
            class="form-check-input mt-1 flex-shrink-0"
            type="checkbox"
            id="glucose-toggle"
            v-model="form.glucose_enabled"
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

      <button
        type="submit"
        class="btn btn-primary w-100"
        :disabled="loading"
      >
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        <i v-else class="bi bi-person-plus me-2"></i>
        Registrarse
      </button>
    </form>
    
    <div class="text-center mt-3">
      <p class="mb-0">
        ¿Ya tienes cuenta? 
        <router-link to="/login">Inicia sesión</router-link>
      </p>
    </div>

    <!-- Mensaje de error -->
    <div v-if="errorMessage" class="alert alert-danger mt-3">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/authService';

export default {
  name: 'RegisterForm',
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const errorMessage = ref('');
    const errors = reactive({});
    
    const form = reactive({
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
      glucose_enabled: false
    });

    const validateForm = () => {
      errors.username = '';
      errors.email = '';
      errors.password = '';
      errors.password_confirmation = '';
      errorMessage.value = '';
      
      if (!form.username) {
        errors.username = 'El nombre de usuario es requerido';
        return false;
      }
      if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
        errors.username = 'El nombre de usuario solo puede contener letras, números y guiones bajos (sin espacios)';
        return false;
      }
      if (!form.email) {
        errors.email = 'El email es requerido';
        return false;
      }
      if (!form.password) {
        errors.password = 'La contraseña es requerida';
        return false;
      }
      if (form.password.length < 6) {
        errors.password = 'La contraseña debe tener al menos 6 caracteres';
        return false;
      }
      if (form.password !== form.password_confirmation) {
        errors.password_confirmation = 'Las contraseñas no coinciden';
        return false;
      }
      return true;
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;
      
      loading.value = true;
      errorMessage.value = '';
      
      try {
        console.log('Intentando registrar usuario:', form.email);
        const response = await authService.register({
          username: form.username,
          email: form.email,
          password: form.password,
          full_name: form.username,
          glucose_enabled: form.glucose_enabled
        });
        
        console.log('Registro response:', response);
        router.push({ path: '/verify-email', query: { email: form.email } });
        
      } catch (error) {
        console.error('Error en registro:', error);
        if (error.response?.data?.message) {
          errorMessage.value = error.response.data.message;
        } else if (error.message === 'Network Error') {
          errorMessage.value = 'No se puede conectar al servidor. Inténtalo de nuevo en unos momentos.';
        } else {
          errorMessage.value = 'Error al registrarse. Inténtalo de nuevo.';
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      errors,
      errorMessage,
      handleSubmit
    };
  }
};
</script>