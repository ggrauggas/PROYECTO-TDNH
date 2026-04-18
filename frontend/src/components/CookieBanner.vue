<template>
  <transition name="cookie-slide">
    <div v-if="visible" class="cookie-banner" role="region" aria-label="Aviso de cookies">
      <div class="cookie-banner__content">
        <span class="cookie-banner__icon">🍪</span>
        <p>
          Esta web usa <strong>cookies técnicas</strong> estrictamente necesarias para el funcionamiento de la sesión.
          No utilizamos cookies de seguimiento ni publicidad.
          Consulta nuestra
          <button class="cookie-banner__link" @click="$emit('open-privacy')">política de privacidad</button>.
        </p>
      </div>
      <div class="cookie-banner__actions">
        <button class="btn btn-primary btn-sm" @click="accept">Aceptar</button>
      </div>
    </div>
  </transition>
</template>

<script>
const COOKIE_KEY = 'tdnh_cookie_consent';

export default {
  name: 'CookieBanner',
  emits: ['open-privacy'],
  data() {
    return {
      visible: false
    };
  },
  mounted() {
    if (!localStorage.getItem(COOKIE_KEY)) {
      setTimeout(() => { this.visible = true; }, 600);
    }
  },
  methods: {
    accept() {
      localStorage.setItem(COOKIE_KEY, '1');
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.cookie-banner {
  position: fixed;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1900;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1.1rem;
  width: calc(100% - 2rem);
  max-width: 640px;

  &__content {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    flex: 1;

    p {
      margin: 0;
      font-size: 0.8rem;
      color: #343a40;
      line-height: 1.5;
    }
  }

  &__icon {
    font-size: 1.1rem;
    flex-shrink: 0;
    margin-top: 0.05rem;
  }

  &__actions {
    flex-shrink: 0;
  }

  &__link {
    background: none;
    border: none;
    padding: 0;
    color: #0d6efd;
    font-size: inherit;
    cursor: pointer;
    text-decoration: underline;
    font-weight: 600;
  }
}

.cookie-slide-enter-active,
.cookie-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.cookie-slide-enter-from,
.cookie-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(1.5rem);
}
</style>
