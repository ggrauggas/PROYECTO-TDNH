<template>
  <div class="questionnaire-view container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">

        <!-- Completado -->
        <div v-if="completed" class="text-center py-5 completed-card card border-0 shadow-sm p-5">
          <div class="check-animation mb-4">
            <div class="check-circle">
              <i class="bi bi-check-lg"></i>
            </div>
          </div>
          <h3 class="fw-bold mb-2">¡Cuestionario completado!</h3>
          <p class="text-muted mb-4">Gracias por compartir tu información. Esto nos ayuda a ofrecerte contenido más relevante.</p>
          <div class="row g-3 mb-4" v-if="summary">
            <div class="col-md-4" v-for="item in summary" :key="item.label">
              <div class="summary-chip p-3 rounded-3 text-center">
                <i :class="`bi ${item.icon} fs-4 mb-2 d-block`" :style="{ color: item.color }"></i>
                <div class="small text-muted">{{ item.label }}</div>
                <div class="fw-semibold small mt-1">{{ item.value }}</div>
              </div>
            </div>
          </div>
          <div class="d-flex gap-3 justify-content-center">
            <router-link to="/forum" class="btn btn-primary">
              <i class="bi bi-chat-dots me-2"></i>Ir al foro
            </router-link>
            <button class="btn btn-outline-secondary" @click="restartQuestionnaire">
              <i class="bi bi-arrow-repeat me-2"></i>Repetir cuestionario
            </button>
          </div>
        </div>

        <!-- Cuestionario activo -->
        <div v-else>
          <!-- Header con progreso -->
          <div class="questionnaire-header card border-0 shadow-sm mb-4 p-4">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h4 class="fw-bold mb-1">
                  <i class="bi bi-clipboard2-pulse-fill text-primary me-2"></i>
                  Cuestionario de perfil
                </h4>
                <p class="text-muted small mb-0">Pregunta {{ currentStep + 1 }} de {{ questions.length }}</p>
              </div>
              <span class="badge bg-primary-subtle text-primary px-3 py-2">
                {{ Math.round(progressPercent) }}% completado
              </span>
            </div>
            <div class="progress" style="height: 8px; border-radius: 4px;">
              <div
                class="progress-bar bg-primary"
                :style="{ width: progressPercent + '%', transition: 'width 0.4s ease' }"
              ></div>
            </div>
            <!-- Indicadores de pasos -->
            <div class="d-flex gap-1 mt-3">
              <div
                v-for="(q, i) in questions"
                :key="i"
                class="step-dot"
                :class="{
                  'completed': answers[i] !== undefined && answers[i] !== '',
                  'active': i === currentStep,
                  'future': i > currentStep
                }"
              ></div>
            </div>
          </div>

          <!-- Pregunta actual -->
          <div class="question-card card border-0 shadow-sm p-4 p-md-5" :key="currentStep">
            <div class="question-icon mb-3" :style="{ color: currentQuestion.color }">
              <i :class="`bi ${currentQuestion.icon}`" style="font-size: 2.5rem;"></i>
            </div>

            <h5 class="fw-bold mb-2">{{ currentQuestion.question }}</h5>
            <p v-if="currentQuestion.description" class="text-muted small mb-4">
              {{ currentQuestion.description }}
            </p>

            <!-- Tipo: opción única -->
            <div v-if="currentQuestion.type === 'radio'" class="options-grid">
              <label
                v-for="option in currentQuestion.options"
                :key="option.value"
                class="option-card d-flex align-items-center gap-3 p-3 rounded-3 mb-2"
                :class="{ selected: answers[currentStep] === option.value }"
              >
                <input
                  type="radio"
                  :name="`q${currentStep}`"
                  :value="option.value"
                  v-model="answers[currentStep]"
                  class="d-none"
                />
                <span class="option-icon" :style="{ color: currentQuestion.color }">
                  <i :class="`bi ${option.icon || 'bi-circle'}`"></i>
                </span>
                <div>
                  <div class="fw-medium">{{ option.label }}</div>
                  <div v-if="option.desc" class="text-muted small">{{ option.desc }}</div>
                </div>
                <i class="bi bi-check-circle-fill ms-auto check-mark" :style="{ color: currentQuestion.color }"></i>
              </label>
            </div>

            <!-- Tipo: selección múltiple -->
            <div v-else-if="currentQuestion.type === 'checkbox'" class="options-grid">
              <label
                v-for="option in currentQuestion.options"
                :key="option.value"
                class="option-card d-flex align-items-center gap-3 p-3 rounded-3 mb-2"
                :class="{ selected: (answers[currentStep] || []).includes(option.value) }"
              >
                <input
                  type="checkbox"
                  :value="option.value"
                  :checked="(answers[currentStep] || []).includes(option.value)"
                  @change="toggleCheckbox(currentStep, option.value)"
                  class="d-none"
                />
                <span class="option-icon" :style="{ color: currentQuestion.color }">
                  <i :class="`bi ${option.icon || 'bi-circle'}`"></i>
                </span>
                <div class="fw-medium">{{ option.label }}</div>
                <i class="bi bi-check-circle-fill ms-auto check-mark" :style="{ color: currentQuestion.color }"></i>
              </label>
            </div>

            <!-- Tipo: rango (slider) -->
            <div v-else-if="currentQuestion.type === 'range'" class="range-container">
              <div class="d-flex justify-content-between text-muted small mb-2">
                <span>{{ currentQuestion.min_label }}</span>
                <span class="fw-bold fs-5" :style="{ color: currentQuestion.color }">
                  {{ answers[currentStep] || currentQuestion.default }} {{ currentQuestion.unit }}
                </span>
                <span>{{ currentQuestion.max_label }}</span>
              </div>
              <input
                type="range"
                class="form-range"
                :min="currentQuestion.min"
                :max="currentQuestion.max"
                :step="currentQuestion.step || 1"
                v-model.number="answers[currentStep]"
              />
              <div class="range-labels d-flex justify-content-between mt-1">
                <span v-for="label in currentQuestion.scale_labels" :key="label.value" class="small text-muted">
                  {{ label.label }}
                </span>
              </div>
            </div>

            <!-- Tipo: texto libre -->
            <div v-else-if="currentQuestion.type === 'text'">
              <textarea
                class="form-control"
                rows="4"
                :placeholder="currentQuestion.placeholder"
                v-model="answers[currentStep]"
              ></textarea>
            </div>

            <!-- Tipo: fecha -->
            <div v-else-if="currentQuestion.type === 'date'">
              <input
                type="date"
                class="form-control form-control-lg"
                v-model="answers[currentStep]"
                :max="today"
              />
            </div>

            <!-- Navegación -->
            <div class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
              <button
                class="btn btn-outline-secondary"
                @click="previousStep"
                :disabled="currentStep === 0"
              >
                <i class="bi bi-arrow-left me-2"></i>Anterior
              </button>

              <button
                v-if="currentStep < questions.length - 1"
                class="btn btn-primary"
                @click="nextStep"
                :disabled="!canAdvance"
              >
                Siguiente<i class="bi bi-arrow-right ms-2"></i>
              </button>

              <button
                v-else
                class="btn btn-success"
                @click="submitQuestionnaire"
                :disabled="!canAdvance || submitting"
              >
                <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-check-lg me-2"></i>
                Finalizar
              </button>
            </div>
          </div>

          <!-- Saltar cuestionario -->
          <div class="text-center mt-3">
            <router-link to="/forum" class="text-muted small text-decoration-none">
              <i class="bi bi-skip-forward me-1"></i>Completar más tarde
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import authStore from '../stores/authStore';

export default {
  name: 'QuestionnaireView',
  setup() {
    const router = useRouter();
    const currentStep = ref(0);
    const submitting = ref(false);
    const completed = ref(false);
    const answers = reactive({});
    const today = new Date().toISOString().split('T')[0];

    const questions = [
      {
        id: 'diabetes_type',
        question: '¿Qué tipo de diabetes tienes?',
        description: 'Esto nos ayuda a mostrarte contenido más relevante para tu situación.',
        type: 'radio',
        icon: 'bi-droplet-fill',
        color: '#2c7da0',
        required: true,
        options: [
          { value: 'tipo1', label: 'Diabetes tipo 1', icon: 'bi-1-circle', desc: 'Autoinmune, dependiente de insulina' },
          { value: 'tipo2', label: 'Diabetes tipo 2', icon: 'bi-2-circle', desc: 'Resistencia a la insulina' },
          { value: 'gestacional', label: 'Diabetes gestacional', icon: 'bi-heart', desc: 'Durante el embarazo' },
          { value: 'otro', label: 'Otro tipo / No sé', icon: 'bi-question-circle', desc: '' },
        ]
      },
      {
        id: 'diagnosis_years',
        question: '¿Cuántos años llevas con el diagnóstico?',
        description: 'Aproximadamente, ¿cuánto tiempo llevas conviviendo con la diabetes?',
        type: 'radio',
        icon: 'bi-calendar-heart',
        color: '#e9c46a',
        required: true,
        options: [
          { value: 'menos1', label: 'Menos de 1 año', icon: 'bi-emoji-surprise', desc: 'Recién diagnosticado/a' },
          { value: '1a5', label: '1 a 5 años', icon: 'bi-emoji-smile', desc: 'Aún adaptándome' },
          { value: '5a10', label: '5 a 10 años', icon: 'bi-emoji-laughing', desc: 'Con experiencia' },
          { value: 'mas10', label: 'Más de 10 años', icon: 'bi-trophy', desc: 'Toda una carrera' },
        ]
      },
      {
        id: 'treatment',
        question: '¿Qué tratamiento utilizas actualmente?',
        description: 'Puedes seleccionar varios si combinas métodos.',
        type: 'checkbox',
        icon: 'bi-capsule',
        color: '#2a9d8f',
        required: true,
        options: [
          { value: 'plumas', label: 'Plumas de insulina', icon: 'bi-pen' },
          { value: 'bomba', label: 'Bomba de insulina', icon: 'bi-cpu' },
          { value: 'pastillas', label: 'Medicación oral', icon: 'bi-capsule' },
          { value: 'dieta', label: 'Solo dieta y ejercicio', icon: 'bi-egg-fried' },
          { value: 'sensor', label: 'Sensor de glucosa (MCG)', icon: 'bi-activity' },
        ]
      },
      {
        id: 'control_satisfaction',
        question: '¿Cómo valoras tu control de glucosa actual?',
        description: 'Sé honesto/a — esta información es solo para ti.',
        type: 'range',
        icon: 'bi-graph-up',
        color: '#e76f51',
        required: false,
        min: 1, max: 10, step: 1, default: 5,
        unit: '/ 10',
        min_label: 'Muy mejorable',
        max_label: 'Excelente',
        scale_labels: [
          { value: 1, label: '1' }, { value: 3, label: '3' }, { value: 5, label: '5' },
          { value: 7, label: '7' }, { value: 10, label: '10' }
        ]
      },
      {
        id: 'main_challenges',
        question: '¿Cuáles son tus principales desafíos?',
        type: 'checkbox',
        icon: 'bi-emoji-frown',
        color: '#9b5de5',
        required: false,
        options: [
          { value: 'hipoglucemia', label: 'Hipoglucemias frecuentes', icon: 'bi-arrow-down-circle' },
          { value: 'hiperglucemia', label: 'Hiperglucemias', icon: 'bi-arrow-up-circle' },
          { value: 'dieta', label: 'Seguir la dieta', icon: 'bi-egg-fried' },
          { value: 'ejercicio', label: 'Hacer ejercicio', icon: 'bi-bicycle' },
          { value: 'burnout', label: 'Agotamiento emocional (burnout)', icon: 'bi-emoji-dizzy' },
          { value: 'social', label: 'Situaciones sociales', icon: 'bi-people' },
          { value: 'trabajo', label: 'Trabajo / estudios', icon: 'bi-briefcase' },
        ]
      },
      {
        id: 'topics_interest',
        question: '¿Qué temas te interesan más del foro?',
        type: 'checkbox',
        icon: 'bi-chat-heart',
        color: '#f77f00',
        required: false,
        options: [
          { value: 'alimentacion', label: 'Alimentación y recetas', icon: 'bi-egg-fried' },
          { value: 'tecnologia', label: 'Tecnología y dispositivos', icon: 'bi-cpu' },
          { value: 'ejercicio', label: 'Deporte y actividad física', icon: 'bi-bicycle' },
          { value: 'emocional', label: 'Apoyo emocional', icon: 'bi-heart' },
          { value: 'medicacion', label: 'Medicación e insulinas', icon: 'bi-capsule' },
          { value: 'viajes', label: 'Viajar con diabetes', icon: 'bi-airplane' },
          { value: 'ninos', label: 'Diabetes en niños', icon: 'bi-balloon-heart' },
        ]
      },
      {
        id: 'how_heard',
        question: '¿Cómo nos encontraste?',
        type: 'radio',
        icon: 'bi-megaphone',
        color: '#06d6a0',
        required: false,
        options: [
          { value: 'redes', label: 'Redes sociales', icon: 'bi-share' },
          { value: 'buscador', label: 'Buscador (Google, etc.)', icon: 'bi-search' },
          { value: 'recomendacion', label: 'Recomendación de alguien', icon: 'bi-person-heart' },
          { value: 'medico', label: 'Mi médico o equipo sanitario', icon: 'bi-heart-pulse' },
          { value: 'otro', label: 'Otro medio', icon: 'bi-three-dots' },
        ]
      },
      {
        id: 'message',
        question: '¿Algo más que quieras contarnos?',
        description: 'Opcional — puedes compartir lo que sientes, lo que esperas de esta comunidad, o cualquier cosa que consideres importante.',
        type: 'text',
        icon: 'bi-chat-left-text',
        color: '#2c7da0',
        required: false,
        placeholder: 'Escribe aquí lo que quieras compartir...'
      }
    ];

    const currentQuestion = computed(() => questions[currentStep.value]);

    const progressPercent = computed(() => ((currentStep.value) / questions.length) * 100);

    const canAdvance = computed(() => {
      const q = currentQuestion.value;
      if (!q.required) return true;
      const ans = answers[currentStep.value];
      if (q.type === 'checkbox') return ans && ans.length > 0;
      return ans !== undefined && ans !== '';
    });

    const toggleCheckbox = (stepIndex, value) => {
      if (!answers[stepIndex]) answers[stepIndex] = [];
      const arr = answers[stepIndex];
      const idx = arr.indexOf(value);
      if (idx === -1) arr.push(value);
      else arr.splice(idx, 1);
    };

    const nextStep = () => {
      if (currentStep.value < questions.length - 1) currentStep.value++;
    };

    const previousStep = () => {
      if (currentStep.value > 0) currentStep.value--;
    };

    const summary = ref(null);

    const submitQuestionnaire = async () => {
      submitting.value = true;
      try {
        // Aquí enviarías los datos a la API
        // await userService.saveQuestionnaire(answers);
        console.log('Respuestas del cuestionario:', { ...answers });

        // Generar resumen visual
        const typeMap = { tipo1: 'Tipo 1', tipo2: 'Tipo 2', gestacional: 'Gestacional', otro: 'Otro' };
        const yearsMap = { menos1: '< 1 año', '1a5': '1-5 años', '5a10': '5-10 años', mas10: '+10 años' };

        summary.value = [
          { label: 'Tipo de diabetes', value: typeMap[answers[0]] || '—', icon: 'bi-droplet-fill', color: '#2c7da0' },
          { label: 'Tiempo con DM', value: yearsMap[answers[1]] || '—', icon: 'bi-calendar-heart', color: '#e9c46a' },
          { label: 'Control de glucosa', value: `${answers[3] || 5}/10`, icon: 'bi-graph-up', color: '#e76f51' },
        ];

        completed.value = true;

        // Actualizar el store si se desea
        if (authStore.user) {
          authStore.user.questionnaire_completed = true;
        }
      } catch (e) {
        console.error('Error enviando cuestionario:', e);
        alert('Error al guardar el cuestionario. Inténtalo de nuevo.');
      } finally {
        submitting.value = false;
      }
    };

    const restartQuestionnaire = () => {
      Object.keys(answers).forEach(k => delete answers[k]);
      currentStep.value = 0;
      completed.value = false;
      summary.value = null;
    };

    return {
      currentStep, questions, currentQuestion, answers,
      progressPercent, canAdvance, submitting, completed, summary, today,
      toggleCheckbox, nextStep, previousStep, submitQuestionnaire, restartQuestionnaire
    };
  }
};
</script>

<style scoped lang="scss">
.questionnaire-header {
  border-radius: 16px !important;
}

.question-card {
  border-radius: 16px !important;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.step-dot {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #dee2e6;
  transition: background 0.3s;

  &.completed { background: #2c7da0; }
  &.active    { background: #61a5c2; }
}

.option-card {
  cursor: pointer;
  border: 2px solid #e9ecef;
  transition: all 0.2s;
  background: #fafafa;

  &:hover { border-color: #adb5bd; background: white; }

  &.selected {
    border-color: currentColor;
    background: white;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);

    .check-mark { opacity: 1; }
  }

  .check-mark { opacity: 0; transition: opacity 0.2s; }
  .option-icon { font-size: 1.2rem; }
}

.form-range::-webkit-slider-thumb { background: #2c7da0; }
.form-range::-webkit-slider-runnable-track { background: #dee2e6; height: 6px; border-radius: 3px; }

.completed-card {
  border-radius: 20px !important;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: scale(1); }
}

.check-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2a9d8f, #2c7da0);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto;
  animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes pop {
  from { transform: scale(0); }
  to   { transform: scale(1); }
}

.summary-chip {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}
</style>