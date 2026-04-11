<template>
  <div id="app">
    <NavBar />
    <main>
      <router-view />
    </main>
    <footer class="bg-light py-4 mt-5">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h6 class="text-primary">
              <span class="footer-tu">TU</span> diabetes 
              <span class="footer-nuestra">NUESTRA</span> historia
            </h6>
            <p class="small text-muted">
              Una comunidad de apoyo para personas con diabetes.
            </p>
          </div>
          <div class="col-md-3">
            <h6 class="small fw-bold">Enlaces</h6>
            <ul class="list-unstyled small">
              <li><router-link to="/about" class="text-decoration-none text-muted">Quiénes somos</router-link></li>
              <li><router-link to="/guide" class="text-decoration-none text-muted">Guía</router-link></li>
              <li><router-link to="/videos" class="text-decoration-none text-muted">Videos</router-link></li>
            </ul>
          </div>
          <div class="col-md-3">
            <h6 class="small fw-bold">Legal</h6>
            <ul class="list-unstyled small">
              <li><a href="#" class="text-decoration-none text-muted">Términos de uso</a></li>
              <li><a href="#" class="text-decoration-none text-muted">Política de privacidad</a></li>
            </ul>
          </div>
        </div>
        <hr>
        <p class="text-center small text-muted mb-0">
          © 2026 TU diabetes NUESTRA historia. 
          Proyecto de Trabajo de Fin de Grado. GERARD GRAU GASCÓN
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';

export default {
  name: 'App',
  components: { NavBar }
};
</script>

<style lang="scss">
@import './assets/scss/main.scss';

.footer-tu {
  color: $pink-pastel;
  font-weight: 600;
}

.footer-nuestra {
  color: $pink-pastel-light;
  font-weight: 600;
}

main {
  min-height: calc(100vh - 200px);
}
</style>