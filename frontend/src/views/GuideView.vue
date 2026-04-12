<template>
  <div class="guide-view container py-4">
    <div class="info-page">
      <h1 class="text-center mb-5">
        <i class="bi bi-book-fill text-primary me-3"></i>
        Guía para recién diagnosticados
      </h1>

      <div class="alert alert-info mb-4">
        <i class="bi bi-info-circle-fill me-2"></i>
        Recuerda que esta guía es informativa y no reemplaza el consejo médico profesional. 
        Siempre consulta con tu equipo de salud.
      </div>

      <div class="info-section">
        <h2>
          <i class="bi bi-1-circle-fill text-primary me-2"></i>
          Primeros pasos después del diagnóstico
        </h2>
        <p>
          Recibir un diagnóstico de diabetes puede ser abrumador. Es normal sentir miedo,
          confusión o incluso enfado. Pero recuerda: no estás solo. Millones de personas viven
          con diabetes y llevan una vida plena y activa.
        </p>
        <ul>
          <li class="mb-2">
            <strong>Infórmate de fuentes confiables:</strong> Aprende sobre la diabetes de la mano 
            de profesionales de la salud y organizaciones reconocidas.
          </li>
          <li class="mb-2">
            <strong>Conoce tu equipo médico:</strong> Endicrinólogo, educador en diabetes, 
            nutricionista - todos son parte de tu equipo de apoyo.
          </li>
          <li class="mb-2">
            <strong>No tengas miedo de preguntar:</strong> No hay preguntas tontas cuando se trata 
            de tu salud.
          </li>
        </ul>
      </div>

      <div class="info-section">
        <h2>
          <i class="bi bi-2-circle-fill text-primary me-2"></i>
          Conceptos básicos que debes conocer
        </h2>
        
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title text-primary">Glucosa</h5>
            <p class="card-text">
              Es el azúcar en sangre. Tu objetivo será mantenerla dentro de un rango saludable 
              mediante insulina, alimentación y ejercicio.
            </p>
          </div>
        </div>

        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title text-primary">Insulina</h5>
            <p class="card-text">
              Es la hormona que tu cuerpo ya no produce. Aprenderás a administrarla mediante 
              inyecciones o bomba de insulina. Tipos: rápida, lenta, mezclas.
            </p>
          </div>
        </div>

        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title text-primary">Hipoglucemia</h5>
            <p class="card-text">
              Es cuando la glucosa baja demasiado (menos de 70 mg/dL). Síntomas: temblor, sudor, 
              confusión. Siempre lleva contigo algo de azúcar de acción rápida.
            </p>
          </div>
        </div>

        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title text-primary">Hiperglucemia</h5>
            <p class="card-text">
              Es cuando la glucosa está alta (más de 180 mg/dL). Puede deberse a falta de insulina, 
              estrés, enfermedad o alimentación.
            </p>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h2>
          <i class="bi bi-3-circle-fill text-primary me-2"></i>
          Consejos para el día a día
        </h2>
        
        <div class="row g-4">
          <div class="col-md-6">
            <div class="d-flex">
              <div class="me-3">
                <i class="bi bi-egg-fried text-primary" style="font-size: 2rem;"></i>
              </div>
              <div>
                <h5>Alimentación</h5>
                <p>
                  Aprende a contar carbohidratos. No se trata de prohibir alimentos, 
                  sino de aprender a ajustarlos con la dosis corrrespondiente de insulina.
                  Una dieta equilibrada puede ayudarte mucho.</p>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="d-flex">
              <div class="me-3">
                <i class="bi bi-bicycle text-primary" style="font-size: 2rem;"></i>
              </div>
              <div>
                <h5>Ejercicio</h5>
                <p>
                  El deporte es beneficioso pero afecta tu glucosa. Aprende a ajustar dosis y 
                  a tomar precauciones. Siempre lleva algo de azúcar cuando hagas ejercicio.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="d-flex">
              <div class="me-3">
                <i class="bi bi-emoji-smile text-primary" style="font-size: 2rem;"></i>
              </div>
              <div>
                <h5>Salud emocional</h5>
                <p>
                  La diabetes puede afectar tu estado de ánimo. Busca apoyo, habla con otros 
                  que te entiendan. El "diabetes burnout" es real.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="d-flex">
              <div class="me-3">
                <i class="bi bi-calendar-check text-primary" style="font-size: 2rem;"></i>
              </div>
              <div>
                <h5>Rutina</h5>
                <p>
                  Establece horarios para medir glucosa y administrar insulina. La constancia 
                  es clave, pero no te castigues si un día no sale perfecto.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h2>
          <i class="bi bi-4-circle-fill text-primary me-2"></i>
          Recursos útiles
        </h2>
        
        <div class="list-group">
          <a href="https://www.fundaciondiabetes.org/" target="_blank" class="list-group-item list-group-item-action">
            <i class="bi bi-link me-2"></i>
            Fundación para la Diabetes
          </a>
          <a href="https://www.idf.org/" target="_blank" class="list-group-item list-group-item-action">
            <i class="bi bi-link me-2"></i>
            International Diabetes Federation
          </a>
          <a href="https://www.fedesp.es/portal/portada/" target="_blank" class="list-group-item list-group-item-action">
            <i class="bi bi-link me-2"></i>
            Federación Española de Diabetes
          </a>
        </div>
      </div>

      <div class="alert alert-success mt-4">
        <i class="bi bi-heart-fill me-2"></i>
        <strong>Recuerda:</strong> La diabetes no te define. Con apoyo, información y las herramientas adecuadas,
        puedes vivir la vida que deseas.
      </div>

      <!-- Bloque cuestionario -->
      <div class="questionnaire-cta mt-5 p-4 rounded-3 text-center">
        <div class="mb-3">
          <i class="bi bi-clipboard2-pulse-fill" style="font-size: 2.5rem; color: #2c7da0;"></i>
        </div>
        <h4 class="fw-bold mb-2">¿Quieres personalizar tu experiencia?</h4>
        <p class="text-muted mb-4">
          Completa el cuestionario de perfil para que podamos ofrecerte contenido 
          más relevante según tu situación con la diabetes.
        </p>
        <router-link to="/questionnaire" class="btn btn-primary btn-lg px-5">
          <i class="bi bi-clipboard2-pulse me-2"></i>
          Hacer el cuestionario
        </router-link>
      </div>

      <div class="text-center mt-4">
        <router-link to="/forum" class="btn btn-outline-primary btn-lg">
          <i class="bi bi-chat-dots me-2"></i>
          Comparte tu experiencia en el foro
        </router-link>
      </div>

      <!-- Compartir la web -->
      <div class="share-cta mt-5 p-4 rounded-3 text-center">
        <div class="mb-3">
          <i class="bi bi-share-fill" style="font-size: 2rem; color: #2c7da0;"></i>
        </div>
        <h4 class="fw-bold mb-2">¿Conoces a alguien recién diagnosticado?</h4>
        <p class="text-muted mb-4">
          Comparte esta guía y la comunidad con quien pueda necesitarla.
          Un pequeño gesto puede marcar una gran diferencia.
        </p>
        <div class="d-flex flex-wrap justify-content-center gap-3">
          <a :href="shareUrls.whatsapp" target="_blank" rel="noopener" class="btn btn-outline-success">
            <i class="bi bi-whatsapp me-2"></i>WhatsApp
          </a>
          <a :href="shareUrls.twitter" target="_blank" rel="noopener" class="btn btn-outline-dark">
            <i class="bi bi-twitter-x me-2"></i>Twitter / X
          </a>
          <a :href="shareUrls.facebook" target="_blank" rel="noopener" class="btn btn-outline-primary">
            <i class="bi bi-facebook me-2"></i>Facebook
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GuideView',
  data() {
    const siteUrl = 'https://tudiabetes.netlify.app/';
    const text = encodeURIComponent('Guía para recién diagnosticados con diabetes — TU diabetes NUESTRA historia 💙');
    const url = encodeURIComponent(siteUrl);
    return {
      shareUrls: {
        whatsapp: `https://wa.me/?text=${text}%20${url}`,
        twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`
      }
    };
  }
};
</script>

<style scoped lang="scss">
.questionnaire-cta {
  background: linear-gradient(135deg, rgba(44, 125, 160, 0.08) 0%, rgba(42, 157, 143, 0.08) 100%);
  border: 2px dashed rgba(44, 125, 160, 0.3);
}

.share-cta {
  background: linear-gradient(135deg, rgba(37, 211, 102, 0.06) 0%, rgba(44, 125, 160, 0.06) 100%);
  border: 2px dashed rgba(44, 125, 160, 0.2);
}
</style>