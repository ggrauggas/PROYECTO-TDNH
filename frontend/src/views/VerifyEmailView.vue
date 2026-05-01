<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-10 col-md-6 col-lg-5">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4 p-md-5">
            <div class="text-center mb-4">
              <i class="bi bi-envelope-check text-primary" style="font-size: 3rem;"></i>
              <h4 class="mt-3 mb-1">Verifica tu cuenta</h4>
              <p class="text-muted small mb-0">
                Hemos enviado un código de 4 dígitos a<br>
                <strong>{{ email }}</strong>
              </p>
            </div>

            <div v-if="successMessage" class="alert alert-success text-center">
              <i class="bi bi-check-circle me-2"></i>{{ successMessage }}
            </div>

            <form v-else @submit.prevent="handleVerify">
              <div class="d-flex justify-content-center gap-2 mb-4">
                <input
                  v-for="(_, i) in digits"
                  :key="i"
                  :ref="el => { if (el) inputs[i] = el }"
                  v-model="digits[i]"
                  type="text"
                  inputmode="numeric"
                  maxlength="1"
                  class="form-control text-center fw-bold fs-4"
                  style="width: 56px; height: 64px;"
                  :class="{ 'is-invalid': errorMessage && !digits[i] }"
                  @input="onInput(i, $event)"
                  @keydown="onKeydown(i, $event)"
                  @paste.prevent="onPaste($event)"
                />
              </div>

              <div v-if="errorMessage" class="alert alert-danger text-center small py-2">
                {{ errorMessage }}
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100 mb-3"
                :disabled="loading || code.length < 4"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-check2-circle me-2"></i>
                Verificar cuenta
              </button>

              <div class="text-center">
                <button
                  type="button"
                  class="btn btn-link btn-sm text-muted p-0"
                  :disabled="resendCooldown > 0 || resendLoading"
                  @click="handleResend"
                >
                  <span v-if="resendLoading" class="spinner-border spinner-border-sm me-1"></span>
                  {{ resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : '¿No has recibido el código? Reenviar' }}
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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import authService from '../services/authService';
import authStore from '../stores/authStore';

export default {
  name: 'VerifyEmailView',
  setup() {
    const route = useRoute();
    const router = useRouter();

    const email = ref(route.query.email || '');
    const digits = reactive(['', '', '', '']);
    const inputs = reactive([]);
    const loading = ref(false);
    const resendLoading = ref(false);
    const errorMessage = ref('');
    const successMessage = ref('');
    const resendCooldown = ref(0);
    let cooldownTimer = null;

    const code = computed(() => digits.join(''));

    function onInput(i, event) {
      const val = event.target.value.replace(/\D/g, '');
      digits[i] = val.slice(-1);
      if (digits[i] && i < 3) {
        inputs[i + 1]?.focus();
      }
    }

    function onKeydown(i, event) {
      if (event.key === 'Backspace' && !digits[i] && i > 0) {
        inputs[i - 1]?.focus();
      }
    }

    function onPaste(event) {
      const pasted = (event.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 4);
      pasted.split('').forEach((char, i) => { digits[i] = char; });
      inputs[Math.min(pasted.length, 3)]?.focus();
    }

    function startCooldown() {
      resendCooldown.value = 60;
      cooldownTimer = setInterval(() => {
        resendCooldown.value--;
        if (resendCooldown.value <= 0) clearInterval(cooldownTimer);
      }, 1000);
    }

    async function handleVerify() {
      errorMessage.value = '';
      loading.value = true;
      try {
        const response = await authService.verifyEmail({ email: email.value, code: code.value });
        authStore.setUser(response.data.user);
        successMessage.value = '¡Cuenta verificada! Redirigiendo...';
        setTimeout(() => router.push('/forum'), 1500);
      } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Código incorrecto. Inténtalo de nuevo.';
      } finally {
        loading.value = false;
      }
    }

    async function handleResend() {
      resendLoading.value = true;
      errorMessage.value = '';
      try {
        await authService.resendVerification(email.value);
        startCooldown();
      } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Error al reenviar el código.';
      } finally {
        resendLoading.value = false;
      }
    }

    onMounted(() => {
      if (!email.value) { router.push('/register'); return; }
      inputs[0]?.focus();
      handleResend();
    });

    onUnmounted(() => clearInterval(cooldownTimer));

    return { email, digits, inputs, code, loading, resendLoading, errorMessage, successMessage, resendCooldown, handleVerify, handleResend, onInput, onKeydown, onPaste };
  }
};
</script>

<style scoped>
input.form-control {
  border: 2px solid #dee2e6;
  border-radius: 8px;
  box-shadow: none;
  background-color: #fff;
  transition: border-color 0.15s ease;
}

input.form-control:focus {
  border-color: #0d6efd;
  box-shadow: none;
  outline: none;
}

input.form-control.is-invalid {
  border-color: #dc3545;
  box-shadow: none;
}
</style>
