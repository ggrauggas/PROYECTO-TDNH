<template>
  <div class="guide-view container py-4">
    <div class="info-page">

      <!-- Cabecera -->
      <div class="page-header text-center mb-5">
        <h1 class="fw-bold mb-2">
          <i class="bi bi-book-fill text-primary me-3"></i>
          Entender la diabetes
        </h1>
        <p class="lead text-muted">
          Una guía para familiares, amigos, compañeros y cualquier persona que quiera comprender
          qué es vivir con diabetes — sea del tipo que sea.
        </p>
      </div>

      <div class="alert alert-info mb-5">
        <i class="bi bi-info-circle-fill me-2"></i>
        Esta guía no está pensada para quien ya tiene diabetes — es para quien convive con ella
        o quiere entenderla. Si eres tú quien la tiene, probablemente ya sabes todo esto de sobra.
      </div>

      <!-- Índice de navegación -->
      <nav class="guide-nav mb-5 p-3 rounded-3 shadow-sm">
        <p class="fw-semibold text-muted small mb-2 text-uppercase">Contenido</p>
        <div class="d-flex flex-wrap gap-2">
          <a href="#que-es" class="btn btn-outline-secondary btn-sm">¿Qué es la diabetes?</a>
          <a href="#tipos" class="btn btn-outline-secondary btn-sm">Tipos</a>
          <a href="#tipo1" class="btn btn-outline-primary btn-sm">Diabetes tipo 1</a>
          <a href="#tipo2" class="btn btn-outline-success btn-sm">Diabetes tipo 2</a>
          <a href="#en-comun" class="btn btn-outline-secondary btn-sm">Lo que tienen en común</a>
          <a href="#mitos" class="btn btn-outline-secondary btn-sm">Mitos</a>
          <a href="#ayudar" class="btn btn-outline-secondary btn-sm">Cómo ayudar</a>
          <a href="#hipoglucemia" class="btn btn-outline-warning btn-sm">Emergencia: bajada de azúcar</a>
          <a href="#frases" class="btn btn-outline-secondary btn-sm">Frases que duelen</a>
          <a href="#recursos" class="btn btn-outline-secondary btn-sm">Recursos</a>
        </div>
      </nav>

      <!-- 1. Qué es -->
      <div class="info-section" id="que-es">
        <h2>
          <i class="bi bi-1-circle-fill text-primary me-2"></i>
          ¿Qué es la diabetes?
        </h2>
        <p>
          La diabetes es una enfermedad crónica que afecta a la manera en que el cuerpo regula
          el azúcar en sangre (glucosa). La glucosa es la principal fuente de energía del organismo,
          y la insulina —una hormona producida por el páncreas— es la que permite que esa glucosa
          entre en las células para ser usada.
        </p>
        <p>
          Cuando este sistema falla, ya sea porque el páncreas no produce insulina o porque el
          cuerpo no la utiliza bien, la glucosa se acumula en la sangre. Con el tiempo, niveles
          elevados de forma mantenida dañan vasos sanguíneos, nervios y órganos.
        </p>
        <div class="row g-3 mt-2">
          <div class="col-md-4">
            <div class="card border-0 shadow-sm h-100 text-center p-3">
              <i class="bi bi-infinity text-primary mb-2" style="font-size:2rem;"></i>
              <h6 class="fw-bold">Es crónica</h6>
              <p class="text-muted small mb-0">No desaparece. Se gestiona, no se cura (con las excepciones que veremos).</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-0 shadow-sm h-100 text-center p-3">
              <i class="bi bi-people-fill text-success mb-2" style="font-size:2rem;"></i>
              <h6 class="fw-bold">Es muy frecuente</h6>
              <p class="text-muted small mb-0">Más de 500 millones de personas en el mundo viven con diabetes. En España, más de 5 millones.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-0 shadow-sm h-100 text-center p-3">
              <i class="bi bi-layers-fill text-warning mb-2" style="font-size:2rem;"></i>
              <h6 class="fw-bold">No es una sola enfermedad</h6>
              <p class="text-muted small mb-0">Existen varios tipos con causas y tratamientos muy distintos. No es lo mismo la tipo 1 que la tipo 2.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Tipos -->
      <div class="info-section" id="tipos">
        <h2>
          <i class="bi bi-2-circle-fill text-primary me-2"></i>
          Tipos de diabetes
        </h2>
        <p class="text-muted mb-4">
          Los cuatro tipos principales. Los más frecuentes son la tipo 1 y la tipo 2, que veremos
          en detalle a continuación.
        </p>
        <div class="row g-3">
          <div class="col-md-6">
            <div class="card border-primary h-100">
              <div class="card-header bg-primary text-white fw-semibold">
                <i class="bi bi-shield-exclamation me-2"></i>Tipo 1
              </div>
              <div class="card-body small text-muted">
                Autoinmune. El sistema inmunitario destruye las células del páncreas que producen insulina.
                Aparece generalmente en la infancia o adolescencia, aunque puede darse a cualquier edad.
                Requiere insulina de por vida. <strong>No tiene relación con los hábitos de vida.</strong>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card border-success h-100">
              <div class="card-header bg-success text-white fw-semibold">
                <i class="bi bi-activity me-2"></i>Tipo 2
              </div>
              <div class="card-body small text-muted">
                El páncreas produce insulina, pero el cuerpo no la usa bien (resistencia a la insulina)
                y con el tiempo la producción se reduce. Es la forma más prevalente — más del 90% de los casos.
                Tiene componente genético y se asocia a factores de estilo de vida.
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card border-warning h-100">
              <div class="card-header bg-warning bg-opacity-75 fw-semibold">
                <i class="bi bi-person-heart me-2"></i>Gestacional
              </div>
              <div class="card-body small text-muted">
                Aparece durante el embarazo en mujeres que no tenían diabetes antes.
                Suele desaparecer tras el parto, pero aumenta el riesgo de desarrollar tipo 2 en el futuro.
                Requiere seguimiento y, en algunos casos, insulina.
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card border-secondary h-100">
              <div class="card-header bg-secondary bg-opacity-10 fw-semibold">
                <i class="bi bi-diagram-3 me-2"></i>Otros tipos (MODY, LADA…)
              </div>
              <div class="card-body small text-muted">
                Existen formas menos frecuentes de origen genético (MODY) o que comparten
                características de la tipo 1 y 2 (LADA). Suelen diagnosticarse en adultos jóvenes
                y a menudo se confunden inicialmente con los tipos más comunes.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Tipo 1 en profundidad -->
      <div class="info-section type1-section" id="tipo1">
        <div class="section-badge bg-primary text-white px-3 py-1 rounded-pill d-inline-flex align-items-center gap-2 mb-3">
          <i class="bi bi-shield-exclamation"></i>
          <span class="fw-semibold">Diabetes tipo 1</span>
        </div>
        <h2 class="text-primary">Diabetes tipo 1 en profundidad</h2>

        <h5 class="mt-4 mb-3 fw-semibold">¿Qué la hace diferente?</h5>
        <p>
          La diabetes tipo 1 es una enfermedad autoinmune: el propio sistema inmunitario ataca
          y destruye las células beta del páncreas, que son las únicas responsables de producir
          insulina. Sin insulina, el cuerpo no puede usar la glucosa de los alimentos como energía
          y empieza a descomponerse para sobrevivir, lo que puede llevar a una situación de
          emergencia llamada <strong>cetoacidosis diabética</strong>.
        </p>
        <div class="row g-3 mb-4">
          <div class="col-sm-6 col-lg-3">
            <div class="mini-stat text-center p-3 rounded-3">
              <div class="fw-bold fs-4 text-primary">5–10%</div>
              <div class="text-muted small">de todos los casos de diabetes</div>
            </div>
          </div>
          <div class="col-sm-6 col-lg-3">
            <div class="mini-stat text-center p-3 rounded-3">
              <div class="fw-bold fs-4 text-primary">Toda la vida</div>
              <div class="text-muted small">necesita insulina sin excepción</div>
            </div>
          </div>
          <div class="col-sm-6 col-lg-3">
            <div class="mini-stat text-center p-3 rounded-3">
              <div class="fw-bold fs-4 text-primary">Sin cura</div>
              <div class="text-muted small">aunque la investigación avanza</div>
            </div>
          </div>
          <div class="col-sm-6 col-lg-3">
            <div class="mini-stat text-center p-3 rounded-3">
              <div class="fw-bold fs-4 text-primary">Cualquier edad</div>
              <div class="text-muted small">pero más frecuente en jóvenes</div>
            </div>
          </div>
        </div>

        <h5 class="mb-3 fw-semibold">¿Cómo es vivir con diabetes tipo 1?</h5>
        <p>
          Desde fuera puede parecer que solo "se pinchan insulina y ya". La realidad es
          bastante más compleja y exigente.
        </p>
        <div class="row g-3 mb-4">
          <div class="col-md-6" v-for="aspect in t1Aspects" :key="aspect.title">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body d-flex gap-3">
                <i :class="`bi ${aspect.icon} text-primary flex-shrink-0`" style="font-size:1.6rem; margin-top:2px;"></i>
                <div>
                  <h6 class="fw-semibold mb-1">{{ aspect.title }}</h6>
                  <p class="text-muted small mb-0">{{ aspect.text }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h5 class="mt-4 mb-3 fw-semibold">Tecnología habitual</h5>
        <div class="row g-3">
          <div class="col-md-4" v-for="tech in t1Tech" :key="tech.name">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <i :class="`bi ${tech.icon} text-primary`" style="font-size:1.4rem;"></i>
                  <h6 class="fw-semibold mb-0">{{ tech.name }}</h6>
                </div>
                <p class="text-muted small mb-0">{{ tech.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Tipo 2 en profundidad -->
      <div class="info-section type2-section" id="tipo2">
        <div class="section-badge bg-success text-white px-3 py-1 rounded-pill d-inline-flex align-items-center gap-2 mb-3">
          <i class="bi bi-activity"></i>
          <span class="fw-semibold">Diabetes tipo 2</span>
        </div>
        <h2 class="text-success">Diabetes tipo 2 en profundidad</h2>

        <h5 class="mt-4 mb-3 fw-semibold">¿Qué la hace diferente?</h5>
        <p>
          En la diabetes tipo 2 el páncreas sí produce insulina, pero el cuerpo no responde bien
          a ella — lo que se llama <strong>resistencia a la insulina</strong>. Para compensar,
          el páncreas trabaja más y produce más insulina, hasta que con el tiempo se agota y
          ya no puede mantener el ritmo. Entonces los niveles de glucosa empiezan a subir.
        </p>
        <p>
          Tiene un fuerte componente genético, pero también intervienen factores como la
          alimentación, el sedentarismo, el sobrepeso o la edad. Eso no significa que quien
          la tiene "se lo haya buscado" — la predisposición genética es determinante y hay
          personas con hábitos saludables que la desarrollan igualmente.
        </p>

        <div class="row g-3 mb-4">
          <div class="col-sm-6 col-lg-3">
            <div class="mini-stat mini-stat--green text-center p-3 rounded-3">
              <div class="fw-bold fs-4 text-success">+90%</div>
              <div class="text-muted small">de todos los casos de diabetes</div>
            </div>
          </div>
          <div class="col-sm-6 col-lg-3">
            <div class="mini-stat mini-stat--green text-center p-3 rounded-3">
              <div class="fw-bold fs-4 text-success">Progresiva</div>
              <div class="text-muted small">avanza con el tiempo si no se trata</div>
            </div>
          </div>
          <div class="col-sm-6 col-lg-3">
            <div class="mini-stat mini-stat--green text-center p-3 rounded-3">
              <div class="fw-bold fs-4 text-success">Tratable</div>
              <div class="text-muted small">hábitos, pastillas y/o insulina</div>
            </div>
          </div>
          <div class="col-sm-6 col-lg-3">
            <div class="mini-stat mini-stat--green text-center p-3 rounded-3">
              <div class="fw-bold fs-4 text-success">Silenciosa</div>
              <div class="text-muted small">muchos años sin síntomas claros</div>
            </div>
          </div>
        </div>

        <h5 class="mb-3 fw-semibold">El diagnóstico y cómo evoluciona</h5>
        <div class="row g-3 mb-4">
          <div class="col-md-6" v-for="stage in t2Stages" :key="stage.title">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body d-flex gap-3">
                <i :class="`bi ${stage.icon} text-success flex-shrink-0`" style="font-size:1.5rem; margin-top:2px;"></i>
                <div>
                  <h6 class="fw-semibold mb-1">{{ stage.title }}</h6>
                  <p class="text-muted small mb-0">{{ stage.text }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h5 class="mb-3 fw-semibold">Tratamiento habitual</h5>
        <div class="row g-3">
          <div class="col-md-4" v-for="treat in t2Treatments" :key="treat.name">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <i :class="`bi ${treat.icon} text-success`" style="font-size:1.4rem;"></i>
                  <h6 class="fw-semibold mb-0">{{ treat.name }}</h6>
                </div>
                <p class="text-muted small mb-0">{{ treat.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="alert alert-success mt-4 mb-0">
          <i class="bi bi-info-circle-fill me-2"></i>
          Con el tratamiento adecuado y cambios de hábitos, algunas personas con tipo 2 logran
          mantener la glucosa en rango sin medicación. Pero eso no significa que la diabetes
          haya "desaparecido" — la predisposición sigue ahí y puede volver.
        </div>
      </div>

      <!-- 5. Lo que tienen en común -->
      <div class="info-section" id="en-comun">
        <h2>
          <i class="bi bi-5-circle-fill text-primary me-2"></i>
          Lo que tienen en común
        </h2>
        <p>
          Aunque la tipo 1 y la tipo 2 son enfermedades distintas, comparten muchos aspectos
          del día a día que es importante entender.
        </p>
        <div class="row g-3">
          <div class="col-md-6" v-for="common in commonAspects" :key="common.title">
            <div class="d-flex gap-3 p-3 rounded-3 bg-light">
              <i :class="`bi ${common.icon} text-primary flex-shrink-0`" style="font-size:1.5rem;"></i>
              <div>
                <h6 class="fw-semibold mb-1">{{ common.title }}</h6>
                <p class="text-muted small mb-0">{{ common.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 6. Mitos -->
      <div class="info-section" id="mitos">
        <h2>
          <i class="bi bi-6-circle-fill text-primary me-2"></i>
          Mitos que conviene desmontar
        </h2>

        <h5 class="mt-4 mb-3 d-flex align-items-center gap-2">
          <span class="badge bg-primary fs-6">Tipo 1</span> Mitos específicos
        </h5>
        <div class="row g-3 mb-4">
          <div class="col-md-6" v-for="myth in mythsT1" :key="myth.myth">
            <div class="myth-card card border-0 shadow-sm h-100">
              <div class="card-body">
                <p class="mb-2">
                  <i class="bi bi-x-circle-fill text-danger me-1"></i>
                  <em class="text-danger fw-semibold">"{{ myth.myth }}"</em>
                </p>
                <p class="mb-0 text-muted small">
                  <i class="bi bi-check-circle-fill text-success me-1"></i>{{ myth.reality }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <h5 class="mt-4 mb-3 d-flex align-items-center gap-2">
          <span class="badge bg-success fs-6">Tipo 2</span> Mitos específicos
        </h5>
        <div class="row g-3 mb-4">
          <div class="col-md-6" v-for="myth in mythsT2" :key="myth.myth">
            <div class="myth-card card border-0 shadow-sm h-100">
              <div class="card-body">
                <p class="mb-2">
                  <i class="bi bi-x-circle-fill text-danger me-1"></i>
                  <em class="text-danger fw-semibold">"{{ myth.myth }}"</em>
                </p>
                <p class="mb-0 text-muted small">
                  <i class="bi bi-check-circle-fill text-success me-1"></i>{{ myth.reality }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <h5 class="mt-4 mb-3 d-flex align-items-center gap-2">
          <span class="badge bg-secondary fs-6">General</span> Válidos para ambos tipos
        </h5>
        <div class="row g-3">
          <div class="col-md-6" v-for="myth in mythsGeneral" :key="myth.myth">
            <div class="myth-card card border-0 shadow-sm h-100">
              <div class="card-body">
                <p class="mb-2">
                  <i class="bi bi-x-circle-fill text-danger me-1"></i>
                  <em class="text-danger fw-semibold">"{{ myth.myth }}"</em>
                </p>
                <p class="mb-0 text-muted small">
                  <i class="bi bi-check-circle-fill text-success me-1"></i>{{ myth.reality }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 7. Cómo ayudar -->
      <div class="info-section" id="ayudar">
        <h2>
          <i class="bi bi-7-circle-fill text-primary me-2"></i>
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

      <!-- 8. Hipoglucemia -->
      <div class="info-section" id="hipoglucemia">
        <h2>
          <i class="bi bi-8-circle-fill text-warning me-2"></i>
          Emergencia: bajada de azúcar (hipoglucemia)
        </h2>

        <div class="alert alert-warning">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Hipoglucemia</strong> significa glucosa por debajo de 70 mg/dL. Puede ocurrir
          en personas con cualquier tipo de diabetes que usen insulina o ciertos medicamentos.
          Es la urgencia más habitual y es importante saber cómo reaccionar.
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
                  <li class="mb-1">Sudoración repentina sin causa aparente</li>
                  <li class="mb-1">Palidez</li>
                  <li class="mb-1">Confusión o dificultad para hablar</li>
                  <li class="mb-1">Irritabilidad inusual</li>
                  <li class="mb-1">Sensación de mareo o debilidad</li>
                  <li>Sensación de hambre repentina e intensa</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card border-success h-100">
              <div class="card-header bg-success bg-opacity-10 fw-semibold">
                <i class="bi bi-check2-all me-2"></i>Qué hacer (Regla de los 15)
              </div>
              <div class="card-body">
                <ol class="mb-0 text-muted small">
                  <li class="mb-2">Dale <strong>15 g de azúcar rápida</strong>: un zumo pequeño, 3–4 sobres de azúcar, caramelos de glucosa o refresco con azúcar.</li>
                  <li class="mb-2">Espera <strong>15 minutos</strong> sin alejarte de su lado.</li>
                  <li class="mb-2">Si mejora, ofrécele algo más consistente (galleta, fruta, bocado).</li>
                  <li>Si no mejora o pierde el conocimiento, <strong>llama al 112</strong>.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div class="alert alert-danger mt-3 mb-0">
          <i class="bi bi-x-circle-fill me-2"></i>
          <strong>Nunca</strong> des de comer ni de beber a alguien que esté inconsciente o
          no pueda tragar con seguridad.
        </div>
      </div>

      <!-- 9. Frases que duelen -->
      <div class="info-section" id="frases">
        <h2>
          <i class="bi bi-9-circle-fill text-primary me-2"></i>
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
                  <i class="bi bi-arrow-right me-1 text-success"></i>{{ phrase.why }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 10. Recursos -->
      <div class="info-section" id="recursos">
        <h2>
          <i class="bi bi-bookmark-fill text-primary me-2"></i>
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
          <a href="https://www.redgdps.org/" target="_blank" rel="noopener" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <span><i class="bi bi-link-45deg me-2 text-primary"></i>Red de Grupos de Diabetes en Atención Primaria (redGDPS)</span>
            <i class="bi bi-box-arrow-up-right text-muted small"></i>
          </a>
          <a href="https://www.idf.org/" target="_blank" rel="noopener" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <span><i class="bi bi-link-45deg me-2 text-primary"></i>International Diabetes Federation (IDF)</span>
            <i class="bi bi-box-arrow-up-right text-muted small"></i>
          </a>
        </div>
      </div>

      <div class="alert alert-success mt-4">
        <i class="bi bi-heart-fill me-2"></i>
        <strong>Lo más importante que puedes hacer</strong> es escuchar sin juzgar y preguntar
        con genuina curiosidad. La diabetes no define a quien la tiene, pero sí forma parte de
        su vida. Entenderla es una forma de querer.
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
    const text = encodeURIComponent('Guía para entender la diabetes — TU diabetes NUESTRA historia 💙');
    const url = encodeURIComponent(siteUrl);
    return {

      // --- Tipo 1 ---
      t1Aspects: [
        {
          icon: 'bi-clock-history',
          title: 'Un trabajo sin descanso',
          text: 'Medir la glucosa, contar carbohidratos, calcular la dosis de insulina… todo ocurre cada día, a todas horas, incluido en mitad de la noche.'
        },
        {
          icon: 'bi-graph-up-arrow',
          title: 'La glucosa cambia constantemente',
          text: 'El estrés, el calor, una infección, una emoción fuerte, dormir mal… cualquier cosa puede alterar los niveles. No siempre hay explicación lógica.'
        },
        {
          icon: 'bi-emoji-dizzy',
          title: 'La carga mental es enorme',
          text: 'Se toman decenas de decisiones al día relacionadas con la diabetes. Este esfuerzo constante, invisible para los demás, se llama diabetes distress y es agotador.'
        },
        {
          icon: 'bi-shield-check',
          title: 'Con buen control se vive bien',
          text: 'El objetivo es mantener la glucosa en rango. Con la tecnología actual (sensores, bombas de insulina) muchas personas llevan una vida completamente normal.'
        },
      ],
      t1Tech: [
        {
          icon: 'bi-broadcast',
          name: 'Sensor de glucosa (MCG)',
          desc: 'Un pequeño parche con un filamento bajo la piel que mide la glucosa cada pocos minutos y envía los datos al móvil o a un lector. Sustituye en gran medida los pinchazos en el dedo.'
        },
        {
          icon: 'bi-droplet-half',
          name: 'Plumas de insulina',
          desc: 'El método de administración más extendido. Existen plumas desechables y reutilizables. Se usan para la insulina rápida (en comidas) y la lenta (basal).'
        },
        {
          icon: 'bi-cpu',
          name: 'Bomba de insulina',
          desc: 'Dispositivo que administra insulina de forma continua a través de un catéter. Los modelos más avanzados se comunican con el sensor y ajustan la dosis automáticamente.'
        },
      ],

      // --- Tipo 2 ---
      t2Stages: [
        {
          icon: 'bi-eye-slash',
          title: 'Años sin síntomas',
          text: 'La tipo 2 puede desarrollarse en silencio durante años. Muchas personas la descubren en una analítica de rutina, sin haber notado nada.'
        },
        {
          icon: 'bi-clipboard2-pulse',
          title: 'Prediabetes',
          text: 'Antes del diagnóstico, la glucosa puede estar elevada sin llegar al umbral de diabetes. Es el momento ideal para actuar: cambios de hábitos pueden revertirla.'
        },
        {
          icon: 'bi-arrow-up-right-circle',
          title: 'Progresión con el tiempo',
          text: 'Sin tratamiento, la glucosa sube y el páncreas se va agotando. Con el tiempo puede necesitarse medicación más intensa o incluso insulina.'
        },
        {
          icon: 'bi-heart-pulse',
          title: 'Complicaciones a largo plazo',
          text: 'Glucosa elevada de forma mantenida daña los vasos sanguíneos y nervios. Las complicaciones más frecuentes afectan riñones, vista, corazón y pies.'
        },
      ],
      t2Treatments: [
        {
          icon: 'bi-apple',
          name: 'Cambios de hábitos',
          desc: 'Alimentación saludable, actividad física y pérdida de peso son el primer tratamiento. En estadios iniciales pueden ser suficientes.'
        },
        {
          icon: 'bi-capsule',
          name: 'Medicación oral',
          desc: 'Existen varios grupos de fármacos (metformina, inhibidores SGLT2, agonistas GLP-1…) que mejoran la sensibilidad a la insulina o reducen la glucosa por otras vías.'
        },
        {
          icon: 'bi-droplet-half',
          name: 'Insulina',
          desc: 'Cuando el páncreas ya no produce suficiente insulina, se necesita administrarla externamente, igual que en la tipo 1. No es un fracaso — es la evolución natural de la enfermedad.'
        },
      ],

      // --- Común a ambas ---
      commonAspects: [
        {
          icon: 'bi-clipboard-data',
          title: 'Control y monitorización',
          text: 'Ambos tipos requieren controlar la glucosa de forma regular, aunque la frecuencia y el método pueden variar.'
        },
        {
          icon: 'bi-egg-fried',
          title: 'La alimentación importa',
          text: 'No se prohíben alimentos, pero sí hay que entender cómo afectan a la glucosa. Los hidratos de carbono tienen especial impacto.'
        },
        {
          icon: 'bi-bicycle',
          title: 'El ejercicio es beneficioso… y complejo',
          text: 'El deporte mejora la sensibilidad a la insulina y el control glucémico, pero también puede provocar bajadas. Hay que aprender a gestionarlo.'
        },
        {
          icon: 'bi-emoji-neutral',
          title: 'El estrés emocional afecta',
          text: 'La diabetes impacta en el estado de ánimo y viceversa. El estrés eleva la glucosa. El agotamiento de gestionar la enfermedad es real y frecuente.'
        },
        {
          icon: 'bi-calendar-check',
          title: 'Revisiones periódicas',
          text: 'Analíticas, HbA1c, revisión de pie diabético, fondo de ojo… el seguimiento médico regular es esencial para prevenir complicaciones.'
        },
        {
          icon: 'bi-people',
          title: 'El apoyo del entorno marca la diferencia',
          text: 'Contar con familia y amigos que entienden la enfermedad reduce el aislamiento y mejora la adherencia al tratamiento.'
        },
      ],

      // --- Mitos ---
      mythsT1: [
        {
          myth: '¿Se te pasará con dieta y ejercicio?',
          reality: 'No. La tipo 1 requiere insulina de por vida. Ningún hábito puede suplir la insulina que el páncreas ya no produce.'
        },
        {
          myth: '¿La tienes por comer mucho azúcar de pequeño?',
          reality: 'Es autoinmune. La alimentación durante la infancia no tiene ninguna relación con su aparición.'
        },
        {
          myth: 'Con la insulina ya está todo controlado',
          reality: 'La insulina es imprescindible, pero ajustarla requiere decenas de decisiones diarias. No es un piloto automático.'
        },
        {
          myth: 'Si no se le nota, es que no es tan grave',
          reality: 'La tipo 1 es invisible pero exige un esfuerzo constante. Que no se vea no significa que no cueste.'
        },
      ],
      mythsT2: [
        {
          myth: 'Se la ha buscado por comer mal',
          reality: 'Tiene un fuerte componente genético. La predisposición es determinante y hay personas con hábitos saludables que la desarrollan igualmente.'
        },
        {
          myth: 'Con pastillas ya no hay que preocuparse',
          reality: 'La medicación ayuda, pero el seguimiento, la alimentación y el ejercicio siguen siendo fundamentales.'
        },
        {
          myth: 'Si llega a necesitar insulina es porque ha fracasado',
          reality: 'Necesitar insulina es la progresión natural de la enfermedad, no un fracaso personal. Es lo que el cuerpo necesita en ese momento.'
        },
        {
          myth: 'Si adelgazas, se cura',
          reality: 'Perder peso puede mejorar mucho el control e incluso llevar a una remisión, pero la predisposición genética no desaparece.'
        },
      ],
      mythsGeneral: [
        {
          myth: 'No puede comer nada dulce',
          reality: 'Puede comer de todo con moderación. Lo importante es gestionar bien los hidratos de carbono totales.'
        },
        {
          myth: 'Mi abuela también tenía diabetes y se curó con...',
          reality: 'Remedios caseros o suplementos no curan la diabetes. Algunos incluso son peligrosos por sus interacciones con la medicación.'
        },
        {
          myth: 'La diabetes de mayor no es tan seria como la de los jóvenes',
          reality: 'Ambos tipos pueden generar graves complicaciones si no se controlan bien. La seriedad no depende de la edad ni del tipo.'
        },
        {
          myth: 'Podrías esforzarte más en controlarlo',
          reality: 'Las personas con diabetes ya se esfuerzan enormemente. Decirlo implica que el mal control es por dejadez, lo cual es injusto y falso.'
        },
      ],

      // --- Cómo ayudar ---
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
          text: 'Ya saben qué comer y cuánta medicación necesitan. No hace falta vigilar su plato ni comentar lo que eligen.'
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

      // --- Frases a evitar ---
      avoidPhrases: [
        {
          avoid: '¿Y no puedes comer eso?',
          why: 'Puede comer de todo. Preguntarlo en público puede resultar incómodo y restar autonomía.'
        },
        {
          avoid: 'Si hicieras más ejercicio se te quitaría',
          why: 'Ni la tipo 1 ni la tipo 2 desaparecen solo con ejercicio. Es más complejo que eso.'
        },
        {
          avoid: 'Qué mal lo debes de llevar',
          why: 'Proyectar sufrimiento cuando no lo han expresado puede resultar agotador. Mejor preguntar cómo están.'
        },
        {
          avoid: '¿No te duele pincharte tanto?',
          why: 'Con el tiempo se normaliza. Señalarlo constantemente recuerda que son diferentes.'
        },
        {
          avoid: 'Mi primo se curó con canela / con ayuno / con...',
          why: 'No existe cura para la tipo 1. Para la tipo 2, los remedios caseros no son tratamientos validados.'
        },
        {
          avoid: 'Podrías esforzarte más en controlarlo',
          why: 'Ya se esfuerzan enormemente. Implica que el mal control es por dejadez, lo cual es injusto.'
        },
        {
          avoid: 'Pero si no tienes sobrepeso, ¿cómo tienes diabetes?',
          why: 'La tipo 1 no tiene relación con el peso. Y la tipo 2 tampoco es exclusiva de personas con sobrepeso.'
        },
        {
          avoid: 'Al menos no es cáncer',
          why: 'Minimizar una enfermedad crónica y exigente no es un consuelo. Reconocer su peso sí lo es.'
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

.guide-nav {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.info-section {
  scroll-margin-top: 80px;

  > p {
    text-align: left;
  }
}

.type1-section {
  border-left: 4px solid #2c7da0;
  padding-left: 1.25rem;
}

.type2-section {
  border-left: 4px solid #2a9d8f;
  padding-left: 1.25rem;
}

.mini-stat {
  background: rgba(44, 125, 160, 0.07);
}

.mini-stat--green {
  background: rgba(42, 157, 143, 0.07);
}

.myth-card {
  border-left: 3px solid #e9ecef !important;
}

h5 .badge {
  min-width: 4.5rem;
  text-align: center;
}

.share-cta {
  background: linear-gradient(135deg, rgba(37, 211, 102, 0.06) 0%, rgba(44, 125, 160, 0.06) 100%);
  border: 2px dashed rgba(44, 125, 160, 0.2);
}
</style>
