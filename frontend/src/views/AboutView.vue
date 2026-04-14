<template>
  <div class="about-view container py-4">
    <div class="info-page">
      <h1 class="text-center mb-5">
        <i class="bi bi-people-fill text-primary me-3"></i>
        Quiénes somos
      </h1>

      <div class="row mb-5">
        <div class="col-lg-8 mx-auto">
          <p class="lead text-center">
            "TU diabetes NUESTRA historia" nace de la necesidad de crear un espacio seguro 
            y de apoyo mutuo para personas con diabetes y sus familias.
          </p>
        </div>
      </div>

      <div class="row mb-5">
        <div class="col-md-6">
          <h2 class="mb-4">Nuestra historia</h2>
          <p>
            Este proyecto ha nacido como un Trabajo de Fin de Grado en Desarrollo de Aplicaciones Web. Detrás del código hay personas 
            que entienden lo que significa vivir con diabetes, ya sea por experiencia
            propia o por cercanía con familiares y amigos.
          </p>
          <p>
            La diabetes es una condición que afecta a millones de personas en todo 
            el mundo. A menudo, quienes reciben el diagnóstico se sienten solos y abrumados. 
            Queremos cambiar eso.
          </p>
        </div>
        
        <div class="col-md-6">
          <h2 class="mb-4">Nuestra misión</h2>
          <p>
            Crear una comunidad donde:
          </p>
          <ul class="list-unstyled">
            <li class="mb-3">
              <i class="bi bi-check-circle-fill text-success me-2"></i>
              Las personas puedan compartir sus experiencias sin miedo al juicio.
            </li>
            <li class="mb-3">
              <i class="bi bi-check-circle-fill text-success me-2"></i>
              Los recién diagnosticados encuentren apoyo y orientación.
            </li>
            <li class="mb-3">
              <i class="bi bi-check-circle-fill text-success me-2"></i>
              Se compartan consejos prácticos para el día a día.
            </li>
            <li class="mb-3">
              <i class="bi bi-check-circle-fill text-success me-2"></i>
              Se difunda información veraz y contrastada.
            </li>
          </ul>
        </div>
      </div>

      <div class="row mb-5">
        <div class="col-12">
          <h2 class="text-center mb-4">Nuestros valores</h2>
          <div class="row g-4">
            <div class="col-6 col-md-3">
              <div class="card text-center h-100">
                <div class="card-body">
                  <i class="bi bi-heart-fill text-primary" style="font-size: 2.5rem;"></i>
                  <h5 class="card-title mt-3">Empatía</h5>
                  <p class="card-text">
                    Entendemos cada historia porque la vivimos de cerca.
                  </p>
                </div>
              </div>
            </div>
            
            <div class="col-6 col-md-3">
              <div class="card text-center h-100">
                <div class="card-body">
                  <i class="bi bi-shield-fill text-primary" style="font-size: 2.5rem;"></i>
                  <h5 class="card-title mt-3">Confianza</h5>
                  <p class="card-text">
                    Espacio seguro y respetuoso para todos.
                  </p>
                </div>
              </div>
            </div>
            
            <div class="col-6 col-md-3">
              <div class="card text-center h-100">
                <div class="card-body">
                  <i class="bi bi-people-fill text-primary" style="font-size: 2.5rem;"></i>
                  <h5 class="card-title mt-3">Comunidad</h5>
                  <p class="card-text">
                    Juntos somos más fuertes. Nadie está solo.
                  </p>
                </div>
              </div>
            </div>
            
            <div class="col-6 col-md-3">
              <div class="card text-center h-100">
                <div class="card-body">
                  <i class="bi bi-lightbulb-fill text-primary" style="font-size: 2.5rem;"></i>
                  <h5 class="card-title mt-3">Conocimiento</h5>
                  <p class="card-text">
                    Información veraz y experiencias reales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutView'
};
</script>
