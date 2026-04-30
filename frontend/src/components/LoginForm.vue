<template>
  <div class="auth-form">
    <h3 class="text-center mb-4">
      <i class="bi bi-box-arrow-in-right text-primary me-2"></i>
      Iniciar sesión
    </h3>
    
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
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
        <label for="password" class="form-label">Contraseña</label>
        <div class="input-group" :class="{ 'is-invalid': errors.password }">
          <input
            :type="showPassword ? 'text' : 'password'"
            class="form-control"
            :class="{ 'is-invalid': errors.password }"
            id="password"
            v-model="form.password"
            placeholder="********"
            required
          >
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="showPassword = !showPassword"
            tabindex="-1"
          >
            <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>
        </div>
        <div v-if="errors.password" class="invalid-feedback d-block">
          {{ errors.password }}
        </div>
      </div>
      
      <button 
        type="submit" 
        class="btn btn-primary w-100"
        :disabled="loading"
      >
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        <i v-else class="bi bi-box-arrow-in-right me-2"></i>
        Iniciar sesión
      </button>
    </form>
    
    <div class="text-center mt-3">
      <p class="mb-0">
        ¿No tienes cuenta? 
        <router-link to="/register">Regístrate aquí</router-link>
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
  name: 'LoginForm',
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const errorMessage = ref('');
    const errors = reactive({});
    const showPassword = ref(false);
    
    const form = reactive({
      email: '',
      password: ''
    });

    const validateForm = () => {
      errors.email = '';
      errors.password = '';
      errorMessage.value = '';
      
      if (!form.email) {
        errors.email = 'El email es requerido';
        return false;
      }
      if (!form.password) {
        errors.password = 'La contraseña es requerida';
        return false;
      }
      return true;
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;
      
      loading.value = true;
      errorMessage.value = '';
      
      try {
        console.log('Intentando login con:', form.email);
        const response = await authService.login({
          email: form.email,
          password: form.password
        });
        
        console.log('Login response:', response);
        authStore.setUser(response.data.user);
        
        const redirectPath = router.currentRoute.value.query.redirect || '/forum';
        router.push(redirectPath);
        
      } catch (error) {
        console.error('Error en login:', error);
        const data = error.response?.data;
        if (data?.data?.requiresVerification) {
          router.push({ path: '/verify-email', query: { email: data.data.email } });
        } else if (data?.message) {
          errorMessage.value = data.message;
        } else if (error.message === 'Network Error') {
          errorMessage.value = 'No se puede conectar al servidor. Inténtalo de nuevo en unos momentos.';
        } else {
          errorMessage.value = 'Error al iniciar sesión. Inténtalo de nuevo.';
        }
      } finally {
        loading.value = false;
      }
    };

    const fillTestUser = (email) => {
      form.email = email;
      form.password = 'password123';
    };

    return {
      form,
      loading,
      errors,
      errorMessage,
      showPassword,
      handleSubmit,
      fillTestUser
    };
  }
};
</script>