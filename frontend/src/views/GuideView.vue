<template>
  <div class="guide-view container py-4">
    <div class="info-page">

      <div class="page-header text-center mb-5">
        <h1 class="fw-bold mb-2">
          <i class="bi bi-book-fill text-primary me-3"></i>
          Entender la diabetes tipo 1
        </h1>
        <p class="lead text-muted">
          Una guía para familiares, amigos y cualquier persona que quiera comprender qué es vivir con diabetes tipo 1.
        </p>
      </div>

      <div class="alert alert-info mb-5">
        <i class="bi bi-info-circle-fill me-2"></i>
        Esta guía no es para quien ya tiene diabetes — es para quien convive con ella o quiere entenderla.
        Si eres tú quien la tiene, probablemente ya sabes todo esto de sobra.
      </div>

      <!-- 1. Qué es -->
      <div class="info-section">
        <h2>
          <i class="bi bi-1-circle-fill text-primary me-2"></i>
          ¿Qué es la diabetes tipo 1?
        </h2>
        <p>
          La diabetes tipo 1 es una enfermedad autoinmune: el propio sistema inmunitario destruye
          las células del páncreas que producen insulina. Sin insulina, el cuerpo no puede usar
          el azúcar de los alimentos como energía.
        </p>
        <p>
          No tiene nada que ver con los hábitos de vida. No se coge por comer demasiado dulce,
          no se puede prevenir y, de momento, no tiene cura. Aparece mayoritariamente en la infancia
          o adolescencia, aunque puede diagnosticarse a cualquier edad.
        </p>
        <div class="row g-3 mt-2">
          <div class="col-md-4">
            <div class="card border-0 shadow-sm h-100 text-center p-3">
              <i class="bi bi-x-circle-fill text-danger mb-2" style="font-size:2rem;"></i>
              <h6 class="fw-bold">No es por malos hábitos</h6>
              <p class="text-muted small mb-0">No se desarrolla por comer mal ni por sedentarismo. Es autoinmune.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-0 shadow-sm h-100 text-center p-3">
              <i class="bi bi-arrow-repeat text-warning mb-2" style="font-size:2rem;"></i>
              <h6 class="fw-bold">Es para toda la vida</h6>
              <p class="text-muted small mb-0">No desaparece con dieta ni ejercicio. Requiere insulina todos los días.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-0 shadow-sm h-100 text-center p-3">
              <i class="bi bi-people-fill text-primary mb-2" style="font-size:2rem;"></i>
              <h6 class="fw-bold">No es contagiosa</h6>
              <p class="text-muted small mb-0">No se transmite. Tampoco es hereditaria de forma directa.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Cómo es vivir con ella -->
      <div class="info-section">
        <h2>
          <i class="bi bi-2-circle-fill text-primary me-2"></i>
          ¿Cómo es vivir con diabetes tipo 1?
        </h2>
        <p>
          Desde fuera puede parecer que una persona con diabetes solo "se pincha insulina y ya".
          La realidad es bastante más compleja y exigente.
        </p>

        <div class="row g-4">
          <div class="col-md-6">
            <div class="d-flex gap-3">
              <i class="bi bi-clock-history text-primary flex-shrink-0" style="font-size:1.8rem;"></i>
              <div>
                <h5 class="fw-semibold">Es un trabajo sin descanso</h5>
                <p class="text-muted">
                  Medir la glucosa, contar los carbohidratos de cada comida, calcular la dosis de insulina,
                  decidir qué hacer antes de hacer ejercicio... todo esto ocurre cada día, a todas horas,
                  incluido en medio de la noche.
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="d-flex gap-3">
              <i class="bi bi-graph-up-arrow text-primary flex-shrink-0" style="font-size:1.8rem;"></i>
              <div>
                <h5 class="fw-semibold">La glucosa cambia constantemente</h5>
                <p class="text-muted">
                  El estrés, el calor, una infección, una emoción fuerte, dormir mal... cualquier cosa
                  puede disparar o bajar la glucosa. No siempre hay una explicación lógica.
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="d-flex gap-3">
              <i class="bi bi-brain text-primary flex-shrink-0" style="font-size:1.8rem;"></i>
              <div>
                <h5 class="fw-semibold">La carga mental es enorme</h5>
                <p class="text-muted">
                  Hay que tomar decenas de decisiones al día relacionadas con la diabetes.
                  Este esfuerzo constante, invisible para los demás, se llama <em>diabetes distress</em>
                  y es agotador.
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="d-flex gap-3">
              <i class="bi bi-shield-check text-primary flex-shrink-0" style="font-size:1.8rem;"></i>
              <div>
                <h5 class="fw-semibold">Con buen control se vive bien</h5>
                <p class="text-muted">
                  Mantener la glucosa en rango es el objetivo. No es fácil, pero con la tecnología
                  actual (sensores de glucosa, bombas de insulina) muchas personas llevan una vida
                  completamente normal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Mitos -->
      <div class="info-section">
        <h2>
          <i class="bi bi-3-circle-fill text-primary me-2"></i>
          Mitos que conviene desmontar
        </h2>
        <p class="text-muted mb-4">
          Hay muchas ideas erróneas sobre la diabetes. Aquí van las más comunes:
        </p>

        <div class="row g-3">
          <div class="col-md-6" v-for="myth in myths" :key="myth.myth">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body">
                <div class="d-flex align-items-start gap-2 mb-2">
                  <i class="bi bi-x-circle-fill text-danger flex-shrink-0 mt-1"></i>
                  <span class="fw-semibold text-danger">{{ myth.myth }}</span>
                </div>
                <div class="d-flex align-items-start gap-2">
                  <i class="bi bi-check-circle-fill text-success flex-shrink-0 mt-1"></i>
                  <span class="text-muted small">{{ myth.reality }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Cómo ayudar -->
      <div class="info-section">
        <h2>
          <i class="bi bi-4-circle-fill text-primary me-2"></i>
          Cómo puedes ayudar
        </h2>
        <p>
          No hace falta ser experto en diabetes para ser un buen apoyo. Estas son las cosas
          que más valoran las personas con diabetes de quienes las rodean:
        </p>

        <div class="list-group list-group-flush rounded-3 shadow-sm">
          <div class="list-group-item d-flex gap-3 py-3" v-for="tip in supportTips" :key="tip.title">
            <i :class="`bi ${tip.icon} text-primary flex-shrink-0`" style="font-size:1.4rem; margin-top:2px;"></i>
            <div>
              <div class="fw-semibold">{{ tip.title }}</div>
              <div class="text-muted small">{{ tip.text }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Hipoglucemia de emergencia -->
      <div class="info-section">
        <h2>
          <i class="bi bi-5-circle-fill text-primary me-2"></i>
          Qué hacer si tiene una bajada de azúcar
        </h2>

        <div class="alert alert-warning">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Hipoglucemia</strong> significa que la glucosa ha bajado demasiado (menos de 70 mg/dL).
          Es la situación de urgencia más habitual y es importante saber reaccionar.
        </div>

        <div class="row g-3 mt-1">
          <div class="col-md-6">
            <div class="card border-warning h-100">
              <div class="card-header bg-warning bg-opacity-10 fw-semibold">
                <i class="bi bi-eye me-2"></i>Señales de alerta
              </div>
              <div class="card-body">
                <ul class="mb-0 text-muted small">
                  <li class="mb-1">Temblores o manos temblorosas</li>
                  <li class="mb-1">Sudoración repentina</li>
                  <li class="mb-1">Palidez</li>
                  <li class="mb-1">Confusión o dificultad para hablar</li>
                  <li class="mb-1">Irritabilidad inusual</li>
                  <li>Sensación de mareo o debilidad</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card border-success h-100">
              <div class="card-header bg-success bg-opacity-10 fw-semibold">
                <i class="bi bi-check2-all me-2"></i>Qué hacer
              </div>
              <div class="card-body">
                <ol class="mb-0 text-muted small">
                  <li class="mb-2">Dale algo con azúcar rápida: zumo, un sobre de azúcar, caramelos, refresco con azúcar.</li>
                  <li class="mb-2">Espera 15 minutos y quédate con ella.</li>
                  <li class="mb-2">Si mejora, ofrécele algo más consistente (una galleta, fruta).</li>
                  <li>Si pierde el conocimiento o no reacciona, llama al 112.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div class="alert alert-danger mt-3 mb-0">
          <i class="bi bi-x-circle-fill me-2"></i>
          <strong>Nunca</strong> des de comer ni de beber a alguien que esté inconsciente.
        </div>
      </div>

      <!-- 6. Qué no decir -->
      <div class="info-section">
        <h2>
          <i class="bi bi-6-circle-fill text-primary me-2"></i>
          Frases que (aunque bien intencionadas) duelen
        </h2>
        <p class="text-muted">
          A veces, sin querer, decimos cosas que minimizan lo que vive una persona con diabetes.
          Aquí van las más comunes, con una alternativa mejor:
        </p>

        <div class="row g-3">
          <div class="col-md-6" v-for="phrase in avoidPhrases" :key="phrase.avoid">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body">
                <p class="mb-2">
                  <i class="bi bi-chat-quote text-danger me-1"></i>
                  <em class="text-danger">"{{ phrase.avoid }}"</em>
                </p>
                <p class="mb-0 text-muted small">
                  <i class="bi bi-arrow-right me-1 text-success"></i>
                  {{ phrase.why }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 7. Recursos -->
      <div class="info-section">
        <h2>
          <i class="bi bi-7-circle-fill text-primary me-2"></i>
          Si quieres saber más
        </h2>
        <div class="list-group shadow-sm">
          <a href="https://www.fundaciondiabetes.org/" target="_blank" rel="noopener" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <span><i class="bi bi-link-45deg me-2 text-primary"></i>Fundación para la Diabetes</span>
            <i class="bi bi-box-arrow-up-right text-muted small"></i>
          </a>
          <a href="https://www.fedesp.es/portal/portada/" target="_blank" rel="noopener" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <span><i class="bi bi-link-45deg me-2 text-primary"></i>Federación Española de Diabetes (FEDE)</span>
            <i class="bi bi-box-arrow-up-right text-muted small"></i>
          </a>
          <a href="https://www.idf.org/" target="_blank" rel="noopener" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <span><i class="bi bi-link-45deg me-2 text-primary"></i>International Diabetes Federation</span>
            <i class="bi bi-box-arrow-up-right text-muted small"></i>
          </a>
        </div>
      </div>

      <div class="alert alert-success mt-4">
        <i class="bi bi-heart-fill me-2"></i>
        <strong>Lo más importante que puedes hacer</strong> es escuchar sin juzgar y preguntar con
        genuina curiosidad. La diabetes no define a quien la tiene, pero sí forma parte de su vida.
        Entenderla es una forma de querer.
      </div>

      <!-- CTA foro -->
      <div class="text-center mt-4">
        <router-link to="/forum" class="btn btn-outline-primary btn-lg">
          <i class="bi bi-chat-dots me-2"></i>
          Conoce a nuestra comunidad en el foro
        </router-link>
      </div>

      <!-- CTA compartir -->
      <div class="share-cta mt-5 p-4 rounded-3 text-center">
        <div class="mb-3">
          <i class="bi bi-share-fill" style="font-size: 2rem; color: #2c7da0;"></i>
        </div>
        <h4 class="fw-bold mb-2">¿Conoces a alguien que debería leer esto?</h4>
        <p class="text-muted mb-4">
          Comparte esta guía con quien quieras. Cuanta más gente entienda la diabetes,
          mejor vida tienen quienes la viven.
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
    const text = encodeURIComponent('Guía para entender la diabetes tipo 1 — TU diabetes NUESTRA historia 💙');
    const url = encodeURIComponent(siteUrl);
    return {
      myths: [
        {
          myth: '¿Se te pasará con dieta?',
          reality: 'La diabetes tipo 1 no se cura ni se controla solo con dieta. Requiere insulina de por vida.'
        },
        {
          myth: '¿La tienes por comer mucho azúcar?',
          reality: 'Es una enfermedad autoinmune. La alimentación no tiene nada que ver con su aparición.'
        },
        {
          myth: 'Con insulina ya está controlada, ¿no?',
          reality: 'La insulina es imprescindible, pero no es un piloto automático. Ajustarla correctamente requiere esfuerzo constante.'
        },
        {
          myth: 'No puede comer nada con azúcar',
          reality: 'Puede comer de todo. Lo que hace es calcular y ajustar la insulina según lo que come.'
        },
        {
          myth: 'Parece que está bien, no se le nota',
          reality: 'La diabetes es invisible. Que no se note no significa que no sea un esfuerzo diario.'
        },
        {
          myth: 'Mi abuela también tenía diabetes',
          reality: 'La tipo 1 y la tipo 2 son enfermedades muy diferentes. No tienen el mismo origen ni tratamiento.'
        },
      ],
      supportTips: [
        {
          icon: 'bi-ear',
          title: 'Escucha sin dar consejos',
          text: 'A veces solo necesitan contar cómo va el día sin recibir sugerencias sobre lo que deberían hacer diferente.'
        },
        {
          icon: 'bi-question-circle',
          title: 'Pregunta con curiosidad, no con alarma',
          text: 'Un "¿cómo llevas la glucosa hoy?" dicho con naturalidad es mucho más reconfortante que un "¿estás bien? ¿te has pinchado?".'
        },
        {
          icon: 'bi-cup-straw',
          title: 'Ten algo de azúcar a mano',
          text: 'Si pasáis tiempo juntos, tener un zumo o caramelos de glucosa cerca puede marcar la diferencia en una bajada.'
        },
        {
          icon: 'bi-calendar-event',
          title: 'No hagas un drama en comidas o eventos',
          text: 'Ya gestiona ellos mismos qué comer y cuánta insulina poner. No hace falta vigilar su plato ni comentar lo que eligen.'
        },
        {
          icon: 'bi-patch-check',
          title: 'Normaliza los momentos de gestión',
          text: 'Si se mide la glucosa o se pone insulina en mitad de una conversación, sigue hablando con normalidad.'
        },
        {
          icon: 'bi-heart',
          title: 'Reconoce el esfuerzo invisible',
          text: 'Un simple "sé que esto es agotador" puede significar mucho más de lo que imaginas.'
        },
      ],
      avoidPhrases: [
        {
          avoid: '¿Y no puedes comer eso?',
          why: 'Puede comer de todo. Preguntarlo en público puede resultar incómodo y restar autonomía.'
        },
        {
          avoid: 'Si hicieras más ejercicio se te quitaría',
          why: 'La diabetes tipo 1 no tiene cura. El ejercicio ayuda, pero no la elimina.'
        },
        {
          avoid: 'Qué mal lo debes de llevar',
          why: 'Proyectar sufrimiento cuando no lo han expresado puede resultar agotador. Mejor preguntar cómo están.'
        },
        {
          avoid: '¿No te duele pincharte tanto?',
          why: 'Con el tiempo se normaliza. Señalarlo constantemente recuerda que es diferente a los demás.'
        },
        {
          avoid: 'Mi primo se curó con canela',
          why: 'No existe cura para la tipo 1. Los remedios caseros no funcionan y pueden ser peligrosos.'
        },
        {
          avoid: 'Podrías esforzarte más en controlarlo',
          why: 'Ya se esfuerzan enormemente. Decirlo implica que el mal control es por dejadez, lo cual es injusto y falso.'
        },
      ],
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
.page-header {
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 2rem;
}

.share-cta {
  background: linear-gradient(135deg, rgba(37, 211, 102, 0.06) 0%, rgba(44, 125, 160, 0.06) 100%);
  border: 2px dashed rgba(44, 125, 160, 0.2);
}
</style>
