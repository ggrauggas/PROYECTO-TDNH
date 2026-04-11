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
    
    <!-- Botones de prueba -->
    <div class="mt-4 p-3 bg-light rounded">
      <small class="text-muted d-block mb-2">🧪 Usuarios de prueba:</small>
      <div class="d-grid gap-2">
        <button class="btn btn-outline-secondary btn-sm" @click="fillTestUser('carlos@example.com')">
          Usuario: carlos@example.com
        </button>
        <button class="btn btn-outline-secondary btn-sm" @click="fillTestUser('ana@example.com')">
          Usuario: ana@example.com
        </button>
        <button class="btn btn-outline-secondary btn-sm" @click="fillTestUser('miguel@example.com')">
          Usuario: miguel@example.com
        </button>
        <small class="text-muted">Contraseña: password123</small>
      </div>
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
        if (error.response?.data?.message) {
          errorMessage.value = error.response.data.message;
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
      handleSubmit,
      fillTestUser
    };
  }
};
</script>