<template>
  <div class="quiz-view container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-7">

        <!-- Pantalla de inicio -->
        <div v-if="phase === 'intro'" class="text-center">
          <div class="quiz-intro-card card border-0 shadow-sm p-5">
            <div class="quiz-icon mb-4">
              <i class="bi bi-patch-question-fill"></i>
            </div>
            <h2 class="fw-bold mb-2">Test para principiantes</h2>
            <p class="text-muted mb-4">
              Pon a prueba lo que sabes sobre la diabetes tipo 1. 
              {{ questions.length }} preguntas · Respuesta inmediata · Sin límite de tiempo
            </p>
            <div class="row g-3 mb-4 text-start">
              <div class="col-6" v-for="tip in introTips" :key="tip.text">
                <div class="d-flex align-items-center gap-2">
                  <i :class="`bi ${tip.icon} text-primary`"></i>
                  <small class="text-muted">{{ tip.text }}</small>
                </div>
              </div>
            </div>
            <button class="btn btn-primary btn-lg px-5" @click="startQuiz">
              <i class="bi bi-play-fill me-2"></i>Empezar el test
            </button>
          </div>
        </div>

        <!-- Pantalla de pregunta -->
        <div v-else-if="phase === 'quiz'">
          <!-- Progreso -->
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="text-muted small fw-semibold">
              Pregunta {{ currentIndex + 1 }} de {{ questions.length }}
            </span>
            <span class="text-muted small">
              <i class="bi bi-check-circle-fill text-success me-1"></i>{{ correctCount }} correctas
            </span>
          </div>
          <div class="progress mb-4" style="height: 6px; border-radius: 3px;">
            <div
              class="progress-bar bg-primary"
              :style="{ width: ((currentIndex) / questions.length * 100) + '%', transition: 'width 0.4s ease' }"
            ></div>
          </div>

          <!-- Tarjeta de pregunta -->
          <div class="question-card card border-0 shadow-sm p-4 p-md-5" :key="currentIndex">
            <div class="question-category mb-2">
              <span class="badge" :style="{ backgroundColor: currentQ.color + '22', color: currentQ.color }">
                <i :class="`bi ${currentQ.icon} me-1`"></i>{{ currentQ.category }}
              </span>
            </div>

            <h5 class="fw-bold mb-4">{{ currentQ.question }}</h5>

            <div class="options-list">
              <button
                v-for="(opt, i) in currentQ.options"
                :key="i"
                class="option-btn w-100 text-start p-3 mb-2 rounded-3"
                :class="getOptionClass(i)"
                :disabled="answered"
                @click="selectAnswer(i)"
              >
                <span class="option-letter me-3">{{ letters[i] }}</span>
                {{ opt }}
                <i v-if="answered && i === currentQ.correct" class="bi bi-check-circle-fill float-end mt-1 text-success"></i>
                <i v-else-if="answered && i === selectedAnswer && i !== currentQ.correct" class="bi bi-x-circle-fill float-end mt-1 text-danger"></i>
              </button>
            </div>

            <!-- Explicación -->
            <transition name="fade">
              <div v-if="answered" class="explanation mt-3 p-3 rounded-3"
                :class="isCorrect ? 'explanation-correct' : 'explanation-wrong'">
                <div class="fw-semibold mb-1">
                  <i class="bi me-2" :class="isCorrect ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'"></i>
                  {{ isCorrect ? '¡Correcto!' : 'Incorrecto' }}
                </div>
                <p class="mb-0 small text-muted">{{ currentQ.explanation }}</p>
              </div>
            </transition>

            <div v-if="answered" class="text-end mt-4">
              <button class="btn btn-primary px-4" @click="nextQuestion">
                {{ currentIndex < questions.length - 1 ? 'Siguiente pregunta' : 'Ver resultados' }}
                <i class="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Pantalla de resultados -->
        <div v-else-if="phase === 'results'" class="text-center">
          <div class="results-card card border-0 shadow-sm p-5">
            <div class="result-emoji mb-3">{{ resultEmoji }}</div>
            <h3 class="fw-bold mb-1">{{ resultTitle }}</h3>
            <p class="text-muted mb-4">{{ resultMessage }}</p>

            <!-- Puntuación -->
            <div class="score-circle mb-4">
              <svg viewBox="0 0 120 120" class="score-svg">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e9ecef" stroke-width="10"/>
                <circle
                  cx="60" cy="60" r="50" fill="none"
                  :stroke="scoreColor"
                  stroke-width="10"
                  stroke-linecap="round"
                  :stroke-dasharray="`${scoreArc} 314`"
                  stroke-dashoffset="78.5"
                  style="transition: stroke-dasharray 1s ease;"
                />
              </svg>
              <div class="score-text">
                <span class="score-number">{{ correctCount }}</span>
                <span class="score-total">/ {{ questions.length }}</span>
              </div>
            </div>

            <!-- Desglose por categoría -->
            <div class="text-start mb-4">
              <p class="fw-semibold small text-muted mb-2">RESULTADOS POR CATEGORÍA</p>
              <div v-for="cat in categoryResults" :key="cat.name" class="d-flex align-items-center gap-3 mb-2">
                <span class="small text-muted" style="width: 130px;">{{ cat.name }}</span>
                <div class="flex-grow-1">
                  <div class="progress" style="height: 6px; border-radius: 3px;">
                    <div class="progress-bar" :style="{ width: cat.percent + '%', backgroundColor: cat.color }"></div>
                  </div>
                </div>
                <span class="small fw-semibold" style="width: 50px; text-align:right;">{{ cat.correct }}/{{ cat.total }}</span>
              </div>
            </div>

            <div class="d-flex gap-3 justify-content-center flex-wrap">
              <button class="btn btn-primary px-4" @click="restartQuiz">
                <i class="bi bi-arrow-repeat me-2"></i>Repetir test
              </button>
              <router-link to="/guide" class="btn btn-outline-primary px-4">
                <i class="bi bi-book me-2"></i>Repasar la guía
              </router-link>
              <router-link to="/forum" class="btn btn-outline-secondary px-4">
                <i class="bi bi-chat-dots me-2"></i>Ir al foro
              </router-link>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'QuizView',
  setup() {
    const phase = ref('intro');
    const currentIndex = ref(0);
    const selectedAnswer = ref(null);
    const answered = ref(false);
    const isCorrect = ref(false);
    const correctCount = ref(0);
    const userAnswers = ref([]);
    const letters = ['A', 'B', 'C', 'D'];

    const introTips = [
      { icon: 'bi-lightning-fill', text: 'Respuesta inmediata tras cada pregunta' },
      { icon: 'bi-book-half', text: 'Explicación detallada de cada respuesta' },
      { icon: 'bi-bar-chart-fill', text: 'Resultados por categoría al final' },
      { icon: 'bi-arrow-repeat', text: 'Puedes repetirlo las veces que quieras' },
    ];

    const questions = [
      {
        category: 'Conceptos básicos',
        icon: 'bi-droplet-fill',
        color: '#2c7da0',
        question: '¿Qué es la diabetes tipo 1?',
        options: [
          'Una enfermedad causada por comer demasiado azúcar',
          'Una enfermedad autoinmune en la que el cuerpo destruye las células productoras de insulina',
          'Una enfermedad que solo afecta a personas mayores',
          'Un tipo de alergia a los carbohidratos'
        ],
        correct: 1,
        explanation: 'La diabetes tipo 1 es una enfermedad autoinmune: el sistema inmunológico ataca y destruye las células beta del páncreas, que son las responsables de producir insulina. No está causada por el consumo de azúcar.'
      },
      {
        category: 'Insulina',
        icon: 'bi-capsule',
        color: '#2a9d8f',
        question: '¿Para qué sirve la insulina en el organismo?',
        options: [
          'Para eliminar el exceso de azúcar en la orina',
          'Para regular la temperatura corporal',
          'Para permitir que la glucosa entre en las células y se use como energía',
          'Para producir glucosa en el hígado'
        ],
        correct: 2,
        explanation: 'La insulina actúa como una "llave" que abre las puertas de las células para que la glucosa pueda entrar y ser utilizada como fuente de energía. Sin insulina, la glucosa se acumula en sangre.'
      },
      {
        category: 'Hipoglucemia',
        icon: 'bi-arrow-down-circle',
        color: '#e76f51',
        question: '¿A partir de qué valor de glucosa se considera hipoglucemia?',
        options: [
          'Menos de 100 mg/dL',
          'Menos de 70 mg/dL',
          'Menos de 50 mg/dL',
          'Menos de 120 mg/dL'
        ],
        correct: 1,
        explanation: 'Se considera hipoglucemia cuando la glucosa en sangre es inferior a 70 mg/dL. En este caso es importante actuar rápido tomando azúcar de acción rápida (zumo, glucosa en gel, etc.).'
      },
      {
        category: 'Hiperglucemia',
        icon: 'bi-arrow-up-circle',
        color: '#e9c46a',
        question: '¿Cuál de estos síntomas NO es típico de la hiperglucemia?',
        options: [
          'Sed excesiva',
          'Ganas frecuentes de orinar',
          'Temblores y sudoración fría',
          'Visión borrosa'
        ],
        correct: 2,
        explanation: 'Los temblores y la sudoración fría son síntomas de hipoglucemia (glucosa baja), no de hiperglucemia. La hiperglucemia se caracteriza por sed, micción frecuente, fatiga y visión borrosa.'
      },
      {
        category: 'Tratamiento',
        icon: 'bi-heart-pulse',
        color: '#9b5de5',
        question: '¿Cuál es el tratamiento principal de la diabetes tipo 1?',
        options: [
          'Pastillas para reducir el azúcar en sangre',
          'Solo dieta y ejercicio',
          'Insulina administrada de forma externa (inyecciones o bomba)',
          'Trasplante de riñón'
        ],
        correct: 2,
        explanation: 'Las personas con diabetes tipo 1 necesitan insulina externa para sobrevivir, ya que su páncreas no la produce. Se administra mediante inyecciones con pluma o a través de una bomba de insulina.'
      },
      {
        category: 'Monitorización',
        icon: 'bi-activity',
        color: '#06d6a0',
        question: '¿Qué mide un sensor de glucosa continua (MCG)?',
        options: [
          'La cantidad de insulina que queda en el cuerpo',
          'La glucosa en sangre venosa cada hora',
          'La glucosa intersticial de forma continua sin pinchazos',
          'El nivel de HbA1c en tiempo real'
        ],
        correct: 2,
        explanation: 'Los sensores de glucosa continua (como FreeStyle Libre o Dexcom) miden la glucosa en el líquido intersticial bajo la piel de forma continua, ofreciendo lecturas cada pocos minutos sin necesidad de pinchazos constantes.'
      },
      {
        category: 'Alimentación',
        icon: 'bi-egg-fried',
        color: '#f77f00',
        question: '¿Qué macronutriente tiene mayor impacto en la glucosa postprandial?',
        options: [
          'Las proteínas',
          'Las grasas',
          'Los carbohidratos',
          'Las vitaminas'
        ],
        correct: 2,
        explanation: 'Los carbohidratos son el macronutriente que más eleva la glucosa en sangre. Por eso las personas con diabetes aprenden a "contar carbohidratos" para ajustar mejor la dosis de insulina en cada comida.'
      },
      {
        category: 'Conceptos básicos',
        icon: 'bi-droplet-fill',
        color: '#2c7da0',
        question: '¿Qué indica la HbA1c?',
        options: [
          'El valor de glucosa en ayunas del día anterior',
          'El promedio de glucosa en sangre de los últimos 2-3 meses',
          'La cantidad de insulina que necesitas al día',
          'El nivel de glucosa máximo registrado en un mes'
        ],
        correct: 1,
        explanation: 'La HbA1c (hemoglobina glicosilada) refleja el promedio de glucosa en sangre durante los últimos 2-3 meses. Es uno de los principales indicadores del control diabético a largo plazo. Un valor inferior al 7% suele ser el objetivo para muchas personas.'
      },
      {
        category: 'Ejercicio',
        icon: 'bi-bicycle',
        color: '#4cc9f0',
        question: '¿Qué puede ocurrir con la glucosa durante el ejercicio aeróbico intenso?',
        options: [
          'Siempre sube la glucosa',
          'Siempre baja la glucosa',
          'Puede bajar durante el ejercicio y también horas después',
          'El ejercicio no afecta a la glucosa'
        ],
        correct: 2,
        explanation: 'El ejercicio aeróbico puede bajar la glucosa tanto durante la actividad como varias horas después (efecto retardado). Es importante monitorizar la glucosa antes, durante y después del ejercicio, y llevar siempre algo de azúcar de acción rápida.'
      },
      {
        category: 'Salud emocional',
        icon: 'bi-heart',
        color: '#e63946',
        question: '¿Qué es el "diabetes distress" o agotamiento diabético?',
        options: [
          'Una complicación física de la diabetes mal controlada',
          'El agotamiento emocional y psicológico derivado de vivir con diabetes',
          'Un tipo de hipoglucemia nocturna',
          'Un efecto secundario de la insulina lenta'
        ],
        correct: 1,
        explanation: 'El diabetes distress es el agotamiento emocional que puede sentir una persona al gestionar constantemente la diabetes: el estrés de las mediciones, los ajustes, las hipoglucemias... Es una experiencia muy real y válida, y hay apoyo disponible para afrontarlo.'
      },
    ];

    const currentQ = computed(() => questions[currentIndex.value]);

    const getOptionClass = (i) => {
      if (!answered.value) return 'option-default';
      if (i === currentQ.value.correct) return 'option-correct';
      if (i === selectedAnswer.value && i !== currentQ.value.correct) return 'option-wrong';
      return 'option-disabled';
    };

    const selectAnswer = (i) => {
      if (answered.value) return;
      selectedAnswer.value = i;
      answered.value = true;
      isCorrect.value = i === currentQ.value.correct;
      if (isCorrect.value) correctCount.value++;
      userAnswers.value.push({ questionIndex: currentIndex.value, selected: i, correct: currentQ.value.correct });
    };

    const nextQuestion = () => {
      if (currentIndex.value < questions.length - 1) {
        currentIndex.value++;
        answered.value = false;
        selectedAnswer.value = null;
        isCorrect.value = false;
      } else {
        phase.value = 'results';
      }
    };

    const startQuiz = () => {
      phase.value = 'quiz';
    };

    const restartQuiz = () => {
      currentIndex.value = 0;
      answered.value = false;
      selectedAnswer.value = null;
      isCorrect.value = false;
      correctCount.value = 0;
      userAnswers.value = [];
      phase.value = 'quiz';
    };

    // Resultados
    const scorePercent = computed(() => (correctCount.value / questions.length) * 100);
    const scoreArc = computed(() => (scorePercent.value / 100) * 314);
    const scoreColor = computed(() => {
      if (scorePercent.value >= 80) return '#2a9d8f';
      if (scorePercent.value >= 50) return '#e9c46a';
      return '#e76f51';
    });

    const resultEmoji = computed(() => {
      if (scorePercent.value >= 80) return '🏆';
      if (scorePercent.value >= 60) return '👍';
      if (scorePercent.value >= 40) return '📚';
      return '💪';
    });

    const resultTitle = computed(() => {
      if (scorePercent.value >= 80) return '¡Excelente! Tienes muy buena base';
      if (scorePercent.value >= 60) return 'Bien, pero hay margen de mejora';
      if (scorePercent.value >= 40) return 'Sigue aprendiendo, ¡vas por buen camino!';
      return 'Todavía queda mucho por aprender, ¡ánimo!';
    });

    const resultMessage = computed(() => {
      if (scorePercent.value >= 80) return 'Conoces muy bien los conceptos clave de la diabetes tipo 1. ¡Sigue así!';
      if (scorePercent.value >= 60) return 'Tienes una buena base. Te recomendamos repasar los temas donde has fallado.';
      return 'No te preocupes, todo el mundo empieza desde cero. La guía y el foro son tus mejores aliados.';
    });

    const categoryResults = computed(() => {
      const cats = {};
      questions.forEach((q, i) => {
        if (!cats[q.category]) cats[q.category] = { name: q.category, color: q.color, total: 0, correct: 0 };
        cats[q.category].total++;
        const ans = userAnswers.value.find(a => a.questionIndex === i);
        if (ans && ans.selected === ans.correct) cats[q.category].correct++;
      });
      return Object.values(cats).map(c => ({ ...c, percent: Math.round((c.correct / c.total) * 100) }));
    });

    return {
      phase, currentIndex, currentQ, questions,
      answered, selectedAnswer, isCorrect, correctCount,
      letters, introTips,
      scorePercent, scoreArc, scoreColor,
      resultEmoji, resultTitle, resultMessage, categoryResults,
      getOptionClass, selectAnswer, nextQuestion, startQuiz, restartQuiz
    };
  }
};
</script>

<style scoped lang="scss">
.quiz-intro-card, .question-card, .results-card {
  border-radius: 20px !important;
}

.quiz-icon {
  font-size: 4rem;
  color: #2c7da0;
  animation: bounce 1s infinite alternate;
}
@keyframes bounce {
  from { transform: translateY(0); }
  to   { transform: translateY(-8px); }
}

.option-btn {
  border: 2px solid #e9ecef;
  background: #fafafa;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    border-color: #2c7da0;
    background: white;
  }

  .option-letter {
    display: inline-flex;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #e9ecef;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.8rem;
    color: #6c757d;
    flex-shrink: 0;
  }

  &.option-correct {
    border-color: #2a9d8f !important;
    background: rgba(42, 157, 143, 0.08) !important;
    .option-letter { background: #2a9d8f; color: white; }
  }

  &.option-wrong {
    border-color: #e76f51 !important;
    background: rgba(231, 111, 81, 0.08) !important;
    .option-letter { background: #e76f51; color: white; }
  }

  &.option-disabled {
    opacity: 0.45;
  }
}

.explanation {
  border-left: 4px solid;
  &-correct { border-color: #2a9d8f; background: rgba(42, 157, 143, 0.06); }
  &-wrong   { border-color: #e76f51; background: rgba(231, 111, 81, 0.06); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

// Círculo de puntuación
.score-circle {
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto;

  .score-svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  .score-text {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .score-number { font-size: 2.2rem; font-weight: 800; line-height: 1; }
    .score-total  { font-size: 1rem; color: #adb5bd; }
  }
}

.question-card { animation: slideUp 0.3s ease; }
@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>