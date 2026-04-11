<template>
  <div class="donate-view container py-4">
    <div class="info-page">
      <h1 class="text-center mb-5">
        <i class="bi bi-heart-fill text-danger me-3"></i>
        Apoya nuestra comunidad
      </h1>

      <div class="row mb-5">
        <div class="col-lg-8 mx-auto text-center">
          <p class="lead">
            "TU diabetes NUESTRA historia" es un proyecto sin ánimo de lucro. Tu ayuda nos permite 
            mantener la plataforma, mejorar sus funcionalidades y llegar a más personas que 
            necesitan apoyo.
          </p>
        </div>
      </div>

      <div class="row mb-5">
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="bi bi-server text-primary" style="font-size: 3rem;"></i>
              <h5 class="card-title mt-3">Mantenimiento</h5>
              <p class="card-text">
                Servidores, dominio y mantenimiento técnico para que la plataforma 
                esté siempre disponible.
              </p>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="bi bi-code-square text-primary" style="font-size: 3rem;"></i>
              <h5 class="card-title mt-3">Desarrollo</h5>
              <p class="card-text">
                Nuevas funcionalidades, mejoras y adaptación a las necesidades de la comunidad.
              </p>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="bi bi-megaphone text-primary" style="font-size: 3rem;"></i>
              <h5 class="card-title mt-3">Difusión</h5>
              <p class="card-text">
                Llegar a más personas que puedan beneficiarse de esta comunidad.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="row justify-content-center mb-5">
        <div class="col-md-8">
          <div class="card border-success">
            <div class="card-header bg-success text-white">
              <h5 class="mb-0">
                <i class="bi bi-heart-fill me-2"></i>
                Cómo ayudar
              </h5>
            </div>
            <div class="card-body">
              <div class="mb-4">
                <h6 class="fw-bold">Transferencia bancaria</h6>
                <p class="mb-1">Banco: Banco de Ejemplo</p>
                <p class="mb-1">IBAN: ES00 0000 0000 0000 0000 0000</p>
                <p>BIC/SWIFT: EJEMPLOXX</p>
              </div>

              <div class="mb-4">
                <h6 class="fw-bold">PayPal</h6>
                <p>
                  <a href="#" class="btn btn-primary">
                    <i class="bi bi-paypal me-2"></i>
                    Donar con PayPal
                  </a>
                </p>
              </div>

              <div>
                <h6 class="fw-bold">Bizum</h6>
                <p>Código: 00000</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="alert alert-info">
            <i class="bi bi-info-circle-fill me-2"></i>
            <strong>Transparencia:</strong> Publicaremos periódicamente cómo se utilizan los fondos 
            recibidos. Puedes contactarnos en cualquier momento para consultar sobre el destino de 
            las donaciones.
          </div>
        </div>
      </div>

      <div class="text-center mt-5">
        <p class="text-muted">
          También puedes ayudar compartiendo la plataforma en tus redes sociales 
          o invitando a otros a unirse a la comunidad.
        </p>
        <div class="d-flex flex-wrap justify-content-center gap-3">
          <a :href="shareUrls.twitter" target="_blank" rel="noopener" class="btn btn-outline-primary">
            <i class="bi bi-twitter me-2"></i>Compartir
          </a>
          <a :href="shareUrls.facebook" target="_blank" rel="noopener" class="btn btn-outline-primary">
            <i class="bi bi-facebook me-2"></i>Compartir
          </a>
          <a :href="shareUrls.whatsapp" target="_blank" rel="noopener" class="btn btn-outline-primary">
            <i class="bi bi-whatsapp me-2"></i>Compartir
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DonateView',
  data() {
    const siteUrl = 'https://tudiabetes.netlify.app';
    const text = encodeURIComponent('¡Únete a TU diabetes NUESTRA historia! Una comunidad para personas con diabetes. 💙');
    const url = encodeURIComponent(siteUrl);
    return {
      shareUrls: {
        twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        whatsapp: `https://wa.me/?text=${text}%20${url}`
      }
    };
  }
};
</script>