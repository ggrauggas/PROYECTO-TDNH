<template>
  <div id="app">
    <NavBar />
    <main>
      <router-view />
    </main>
    <footer class="site-footer mt-5">
      <div class="container">
        <div class="row gy-3">
          <div class="col-md-5">
            <div class="footer-brand mb-2">
              <img src="/TD-NH.ico" alt="Logo" class="footer-logo me-2" />
              <span class="footer-tu">TU </span>  diabetes
              <span class="footer-tu">NUESTRA </span>  historia
            </div>
            <p class="footer-desc">
              Una comunidad de apoyo para personas con diabetes. Comparte, aprende y crece junto a otros.
            </p>
          </div>
          <div class="col-6 col-md-3 offset-md-1">
            <h6 class="footer-heading">Plataforma</h6>
            <ul class="list-unstyled footer-links">
              <li><router-link to="/">Inicio</router-link></li>
              <li><router-link to="/forum">Foro</router-link></li>
              <li><router-link to="/guide">Guía</router-link></li>
              <li><router-link to="/videos">Videos</router-link></li>
              <li><router-link to="/about">Quiénes somos</router-link></li>
            </ul>
          </div>
          <div class="col-6 col-md-3">
            <h6 class="footer-heading">Legal</h6>
            <ul class="list-unstyled footer-links">
              <li><button class="footer-btn-link" @click="showTerms = true">Términos de uso</button></li>
              <li><button class="footer-btn-link" @click="showPrivacy = true">Política de privacidad</button></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 TU diabetes NUESTRA historia</span>
          <span class="footer-divider">·</span>
          <span>Trabajo de Fin de Grado · Gerard Grau Gascón</span>
        </div>
      </div>
    </footer>

    <LegalModal v-model="showTerms" type="terms" />
    <LegalModal v-model="showPrivacy" type="privacy" />
    <CookieBanner @open-privacy="showPrivacy = true" />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import LegalModal from './components/LegalModal.vue';
import CookieBanner from './components/CookieBanner.vue';

export default {
  name: 'App',
  components: { NavBar, LegalModal, CookieBanner },
  data() {
    return {
      showTerms: false,
      showPrivacy: false
    };
  }
};
</script>

<style lang="scss">
@import './assets/scss/main.scss';

main {
  padding-top: 60px; // altura del navbar fijo
  min-height: calc(100vh - 200px);
}

// ── Footer ────────────────────────────────────────────────────────────────────
.site-footer {
  background: #0369a1;
  color: rgba(255, 255, 255, 0.7);
  padding: 2.5rem 0 0;

  .footer-brand {
    display: flex;
    align-items: center;
    font-size: 0.95rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.75rem;
    letter-spacing: -0.01em;
  }

  .footer-logo {
    width: 22px; height: 22px;
    object-fit: contain;
    vertical-align: middle;
  }

  .footer-tu      { color: $pink-pastel; font-weight: 700; margin-left: 0.15rem; }
  .footer-nuestra { color: #60a5fa;      font-weight: 700; }

  .footer-desc {
    font-size: 0.825rem;
    color: rgba(255, 255, 255, 0.5);
    line-height: 1.6;
    max-width: 300px;
  }

  .footer-heading {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.4);
    margin-bottom: 0.75rem;
  }

  .footer-links {
    li { margin-bottom: 0.35rem; }
    a {
      color: rgba(255, 255, 255, 0.6);
      text-decoration: none;
      font-size: 0.825rem;
      transition: color 0.15s;
      &:hover { color: #fff; }
    }
  }

  .footer-btn-link {
    background: none;
    border: none;
    padding: 0;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.825rem;
    cursor: pointer;
    transition: color 0.15s;
    text-align: left;
    &:hover { color: #fff; }
  }

  .footer-bottom {
    margin-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding: 0.875rem 0;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.35);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.4rem;
  }

  .footer-divider { opacity: 0.4; }
}
</style>