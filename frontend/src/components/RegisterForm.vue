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
          placeholder="ej: carlos_diabetes"
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
import authStore from '../stores/authStore';

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
      password_confirmation: ''
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
          full_name: form.username
        });
        
        console.log('Registro response:', response);
        authStore.setUser(response.data.user);
        router.push('/forum');
        
      } catch (error) {
        console.error('Error en registro:', error);
        if (error.response?.data?.message) {
          errorMessage.value = error.response.data.message;
        } else if (error.message === 'Network Error') {
          errorMessage.value = 'No se puede conectar al servidor. Asegúrate de que el backend está corriendo en http://localhost:3000';
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