<template>
  <div class="about-view container py-4">
    <div class="info-page">

      <!-- Cabecera -->
      <div class="text-center mb-5">
        <h1 class="mb-3">
          <i class="bi bi-people-fill text-primary me-2"></i>
          Quiénes somos
        </h1>
        <p class="lead about-lead mx-auto">
          "TU diabetes NUESTRA historia" nace de la necesidad de crear un espacio seguro
          y de apoyo mutuo para personas con diabetes y sus familias.
        </p>
      </div>

      <!-- Historia + Misión -->
      <div class="row g-4 mb-5 align-items-stretch">
        <div class="col-md-6">
          <div class="about-section h-100">
            <h2 class="about-section-title">
              <i class="bi bi-clock-history me-2 text-primary"></i>Nuestra historia
            </h2>
            <p>
              Este proyecto ha nacido como un Trabajo de Fin de Grado en Desarrollo de
              Aplicaciones Web. Detrás del código hay personas que entienden lo que significa
              vivir con diabetes, ya sea por experiencia propia o por cercanía con familiares
              y amigos.
            </p>
            <p class="mb-0">
              La diabetes es una condición que afecta a millones de personas en todo el mundo.
              A menudo, quienes reciben el diagnóstico se sienten solos y abrumados.
              Queremos cambiar eso.
            </p>
          </div>
        </div>

        <div class="col-md-6">
          <div class="about-section h-100">
            <h2 class="about-section-title">
              <i class="bi bi-bullseye me-2 text-primary"></i>Nuestra misión
            </h2>
            <p>Crear una comunidad donde:</p>
            <ul class="list-unstyled mb-0">
              <li class="mission-item">
                <i class="bi bi-check-circle-fill text-primary me-2"></i>
                Las personas puedan compartir sus experiencias sin miedo al juicio.
              </li>
              <li class="mission-item">
                <i class="bi bi-check-circle-fill text-primary me-2"></i>
                Los recién diagnosticados encuentren apoyo y orientación.
              </li>
              <li class="mission-item">
                <i class="bi bi-check-circle-fill text-primary me-2"></i>
                Se compartan consejos prácticos para el día a día.
              </li>
              <li class="mission-item">
                <i class="bi bi-check-circle-fill text-primary me-2"></i>
                Se difunda información veraz y contrastada.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Valores -->
      <div class="mb-5">
        <h2 class="text-center mb-4">Nuestros valores</h2>
        <div class="row g-4">
          <div class="col-6 col-md-3">
            <div class="card text-center h-100">
              <div class="card-body">
                <i class="bi bi-heart-fill text-primary" style="font-size: 2.5rem;"></i>
                <h5 class="card-title mt-3">Empatía</h5>
                <p class="card-text">Entendemos cada historia porque la vivimos de cerca.</p>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="card text-center h-100">
              <div class="card-body">
                <i class="bi bi-shield-fill text-primary" style="font-size: 2.5rem;"></i>
                <h5 class="card-title mt-3">Confianza</h5>
                <p class="card-text">Espacio seguro y respetuoso para todos.</p>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="card text-center h-100">
              <div class="card-body">
                <i class="bi bi-people-fill text-primary" style="font-size: 2.5rem;"></i>
                <h5 class="card-title mt-3">Comunidad</h5>
                <p class="card-text">Juntos somos más fuertes. Nadie está solo.</p>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="card text-center h-100">
              <div class="card-body">
                <i class="bi bi-lightbulb-fill text-primary" style="font-size: 2.5rem;"></i>
                <h5 class="card-title mt-3">Conocimiento</h5>
                <p class="card-text">Información veraz y experiencias reales.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cita -->
      <div class="card bg-light">
        <div class="card-body text-center p-5">
          <i class="bi bi-quote" style="font-size: 3rem; color: #2c7da0;"></i>
          <blockquote class="blockquote">
            <p class="mb-0">
              La diabetes puede ser parte de tu vida, pero no tiene por qué definirla.
              En esta comunidad, compartimos no solo los desafíos, sino también las
              victorias, los aprendizajes y la esperanza.
            </p>
          </blockquote>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutView'
};
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.about-lead {
  max-width: 600px;
  color: rgba(28, 28, 30, 0.60);
  font-size: 1.1rem;
}

.about-section {
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba($primary, 0.12);
  border-radius: $border-radius-lg;
  padding: 2rem;

  p { color: rgba(28, 28, 30, 0.70); line-height: 1.75; }
}

.about-section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: $dark;
  margin-bottom: 1.25rem;
}

.mission-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba($primary, 0.08);
  color: rgba(28, 28, 30, 0.75);

  &:last-child { border-bottom: none; }
}

// Tarjetas de valores
.card {
  background: rgba(255, 255, 255, 0.60) !important;
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.78) !important;
  border-radius: $border-radius-lg !important;
  box-shadow: 0 2px 10px rgba(3, 105, 161, 0.07);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(3, 105, 161, 0.10);
  }

  .card-body {
    padding: 1.5rem 1rem;
  }

  .card-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: $dark;
    margin-bottom: 0.4rem;
  }

  .card-text {
    font-size: 0.875rem;
    color: #64748b;
    line-height: 1.55;
    text-align: center !important;
  }
}

// Card de cita
.card.bg-light {
  background: rgba(3, 105, 161, 0.06) !important;
  border-color: rgba(3, 105, 161, 0.14) !important;

  .blockquote p {
    text-align: center !important;
    font-size: 1.05rem;
    color: $dark;
    font-style: italic;
    line-height: 1.75;
  }
}
</style>
