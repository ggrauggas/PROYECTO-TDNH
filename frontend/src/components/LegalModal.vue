<template>
  <teleport to="body">
    <div v-if="modelValue" class="legal-overlay" @click.self="$emit('update:modelValue', false)">
      <div class="legal-dialog" role="dialog" :aria-label="title">
        <div class="legal-dialog__header">
          <h5>{{ title }}</h5>
          <button class="legal-dialog__close" @click="$emit('update:modelValue', false)" aria-label="Cerrar">&times;</button>
        </div>
        <div class="legal-dialog__body">

          <!-- TÉRMINOS DE USO -->
          <template v-if="type === 'terms'">
            <p class="legal-date">Última actualización: abril de 2026</p>

            <h6>1. Objeto y ámbito</h6>
            <p>Las presentes condiciones regulan el acceso y uso de la plataforma web <strong>TU diabetes NUESTRA historia</strong> (en adelante, «la Plataforma»), desarrollada como Trabajo de Fin de Grado por Gerard Grau Gascón. La Plataforma es un espacio comunitario para personas con diabetes tipo 1 y sus familias donde compartir experiencias, formular preguntas y acceder a recursos informativos.</p>

            <h6>2. Carácter informativo; no es asistencia médica</h6>
            <p>Los contenidos publicados en la Plataforma tienen finalidad exclusivamente informativa y de apoyo entre iguales. <strong>No constituyen diagnóstico, tratamiento ni consejo médico.</strong> Ante cualquier duda de salud consulta siempre a un profesional sanitario cualificado.</p>

            <h6>3. Registro y cuenta de usuario</h6>
            <p>Para publicar contenido es necesario crear una cuenta con datos verídicos. Cada usuario es responsable de mantener la confidencialidad de sus credenciales y de toda la actividad realizada bajo su cuenta.</p>

            <h6>4. Normas de conducta</h6>
            <p>Los usuarios se comprometen a:</p>
            <ul>
              <li>No publicar contenido falso, difamatorio, ofensivo o que vulnere derechos de terceros.</li>
              <li>No compartir información personal de otros usuarios sin su consentimiento.</li>
              <li>No realizar actividades de spam, phishing o cualquier uso fraudulento.</li>
              <li>Respetar las indicaciones del equipo administrador.</li>
            </ul>
            <p>El incumplimiento podrá conllevar la suspensión o eliminación de la cuenta.</p>

            <h6>5. Propiedad intelectual</h6>
            <p>El código fuente, diseño y recursos propios de la Plataforma son propiedad de su autor. El contenido generado por los usuarios (publicaciones y comentarios) permanece bajo su titularidad; al publicarlo conceden a la Plataforma una licencia no exclusiva para mostrarlo dentro del servicio.</p>

            <h6>6. Limitación de responsabilidad</h6>
            <p>La Plataforma se ofrece «tal cual», sin garantías de disponibilidad ininterrumpida. El autor no será responsable de daños derivados del uso de la información publicada por terceros.</p>

            <h6>7. Modificaciones</h6>
            <p>Estas condiciones pueden actualizarse en cualquier momento. Se notificará a los usuarios registrados de cambios relevantes. El uso continuado de la Plataforma tras la notificación implica la aceptación de las nuevas condiciones.</p>

            <h6>8. Legislación aplicable</h6>
            <p>Estas condiciones se rigen por la legislación española. Para cualquier controversia las partes se someten a los juzgados y tribunales del domicilio del usuario, salvo que la ley disponga otra cosa.</p>
          </template>

          <!-- POLÍTICA DE PRIVACIDAD -->
          <template v-else-if="type === 'privacy'">
            <p class="legal-date">Última actualización: abril de 2026</p>

            <h6>1. Responsable del tratamiento</h6>
            <p>Gerard Grau Gascón · TFG – Jaume II El Just · <a href="mailto:gerardgrau2004@gmail.com">gerardgrau2004@gmail.com</a></p>

            <h6>2. Datos que recogemos</h6>
            <ul>
              <li><strong>Cuenta:</strong> nombre de usuario, dirección de correo electrónico y contraseña (almacenada con hash bcrypt).</li>
              <li><strong>Contenido:</strong> publicaciones, comentarios y valoraciones que el usuario crea voluntariamente.</li>
              <li><strong>Técnicos:</strong> dirección IP y datos de acceso registrados de forma automática por el servidor.</li>
            </ul>

            <h6>3. Finalidad y base jurídica</h6>
            <p>Tratamos tus datos para gestionar tu cuenta y ofrecerte las funcionalidades de la Plataforma (base jurídica: ejecución de contrato). Los datos técnicos se tratan con base en el interés legítimo de garantizar la seguridad del servicio.</p>

            <h6>4. Conservación</h6>
            <p>Los datos de cuenta se conservan mientras la cuenta esté activa. Tras la eliminación de la cuenta se suprimen en un plazo máximo de 30 días, salvo obligación legal de conservación.</p>

            <h6>5. Destinatarios</h6>
            <p>No cedemos datos a terceros. La Plataforma se aloja en infraestructura propia (Docker/PostgreSQL en entorno local o de desarrollo). No se utilizan servicios de analítica de terceros.</p>

            <h6>6. Cookies</h6>
            <p>La Plataforma utiliza únicamente cookies técnicas estrictamente necesarias para mantener la sesión de usuario (token JWT almacenado en <code>localStorage</code>). No se usan cookies de seguimiento ni publicidad.</p>

            <h6>7. Tus derechos</h6>
            <p>Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición y portabilidad escribiendo a <a href="mailto:gerardgrau2004@gmail.com">gerardgrau2004@gmail.com</a>. Si consideras que el tratamiento no es conforme, puedes reclamar ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener">aepd.es</a>).</p>

            <h6>8. Seguridad</h6>
            <p>Aplicamos medidas técnicas razonables (HTTPS, hashing de contraseñas, limitación de peticiones) para proteger tus datos frente a accesos no autorizados.</p>
          </template>

        </div>
        <div class="legal-dialog__footer">
          <button class="btn btn-primary btn-sm" @click="$emit('update:modelValue', false)">Entendido</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  name: 'LegalModal',
  props: {
    modelValue: { type: Boolean, required: true },
    type: { type: String, required: true } // 'terms' | 'privacy'
  },
  emits: ['update:modelValue'],
  computed: {
    title() {
      return this.type === 'terms' ? 'Términos de uso' : 'Política de privacidad';
    }
  },
  watch: {
    modelValue(val) {
      document.body.style.overflow = val ? 'hidden' : '';
    }
  }
};
</script>

<style lang="scss" scoped>
.legal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.legal-dialog {
  background: #fff;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 660px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem 0.75rem;
    border-bottom: 1px solid #e9ecef;

    h5 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      color: #212529;
    }
  }

  &__close {
    background: none;
    border: none;
    font-size: 1.4rem;
    line-height: 1;
    color: #6c757d;
    cursor: pointer;
    padding: 0 0.25rem;

    &:hover { color: #212529; }
  }

  &__body {
    overflow-y: auto;
    padding: 1.1rem 1.25rem;
    font-size: 0.82rem;
    color: #343a40;
    line-height: 1.65;

    h6 {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 1.1rem;
      margin-bottom: 0.35rem;
      color: #495057;
    }

    p, ul { margin-bottom: 0.5rem; }
    ul { padding-left: 1.25rem; }
    li { margin-bottom: 0.2rem; }
    a { color: #0d6efd; }
    code {
      background: #f1f3f5;
      padding: 0.1em 0.35em;
      border-radius: 3px;
      font-size: 0.8em;
    }
  }

  &__footer {
    padding: 0.75rem 1.25rem;
    border-top: 1px solid #e9ecef;
    display: flex;
    justify-content: flex-end;
  }
}

.legal-date {
  font-size: 0.75rem;
  color: #868e96;
  margin-bottom: 0.75rem;
}
</style>
