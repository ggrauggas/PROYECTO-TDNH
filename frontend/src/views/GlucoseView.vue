<template>
  <div class="glucose-view container py-4">

    <div class="page-header mb-4">
      <h2 class="fw-bold mb-1">
        <i class="bi bi-activity text-primary me-2"></i>Mis datos de glucosa
      </h2>
      <p class="text-muted mb-0">Importa tu archivo CSV y visualiza tus datos de glucosa de forma gráfica</p>
    </div>

    <!-- Zona de carga / instrucciones (cuando no hay datos) -->
    <div v-if="!csvData.length" class="row g-4">

      <!-- Dropzone -->
      <div class="col-lg-8">
        <div
          class="drop-zone card border-0 shadow-sm p-5 text-center"
          :class="{ dragging: isDragging, 'border-danger': parseError }"
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <div v-if="!loading">
            <div class="drop-icon mb-3" :class="{ 'text-danger': parseError }">
              <i class="bi" :class="parseError ? 'bi-exclamation-triangle-fill' : 'bi-file-earmark-spreadsheet'" style="font-size: 4rem;"></i>
            </div>
            <h5 class="fw-bold mb-2">
              {{ parseError ? 'Error al leer el archivo' : 'Arrastra tu archivo CSV aquí' }}
            </h5>
            <p class="text-muted mb-4">
              {{ parseError || 'o haz clic para seleccionarlo desde tu dispositivo' }}
            </p>
            <label class="btn btn-primary btn-lg px-4">
              <i class="bi bi-upload me-2"></i>Seleccionar CSV
              <input type="file" accept=".csv,.txt" class="d-none" @change="handleFileInput" ref="fileInput" />
            </label>
            <p class="text-muted small mt-3">
              <i class="bi bi-info-circle me-1"></i>Formatos compatibles: LibreLink, Dexcom Clarity, Freestyle Libre, CSV genérico
            </p>
          </div>
          <div v-else class="py-4">
            <div class="spinner-border text-primary mb-3"></div>
            <p class="text-muted">Procesando archivo...</p>
          </div>
        </div>
      </div>

      <!-- Instrucciones -->
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-transparent border-bottom fw-semibold">
            <i class="bi bi-question-circle-fill text-info me-2"></i>¿Qué formato necesito?
          </div>
          <div class="card-body">
            <p class="text-muted small mb-3">Tu CSV debe tener al menos estas columnas:</p>

            <div class="format-example p-3 rounded-2 mb-3">
              <code class="small text-success">timestamp, glucosa</code><br>
              <code class="small text-muted">2024-01-15 08:30, 120</code><br>
              <code class="small text-muted">2024-01-15 12:00, 145</code>
            </div>

            <p class="text-muted small mb-2 fw-semibold">Dispositivos compatibles:</p>
            <ul class="list-unstyled small text-muted">
              <li class="mb-1"><i class="bi bi-check-circle text-success me-2"></i>FreeStyle Libre / LibreLink</li>
              <li class="mb-1"><i class="bi bi-check-circle text-success me-2"></i>Dexcom Clarity</li>
              <li class="mb-1"><i class="bi bi-check-circle text-success me-2"></i>Medtronic CareLink</li>
              <li class="mb-1"><i class="bi bi-check-circle text-success me-2"></i>CSV genérico con fecha y valor</li>
            </ul>

            <div class="mt-3">
              <button class="btn btn-outline-secondary btn-sm w-100" @click="loadSampleData">
                <i class="bi bi-play-circle me-2"></i>Cargar datos de ejemplo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard con datos cargados -->
    <div v-else>
      <!-- Barra de acciones -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center gap-3">
          <span class="badge bg-success px-3 py-2 fs-6">
            <i class="bi bi-check-circle me-1"></i>{{ csvData.length }} registros cargados
          </span>
          <span class="text-muted small">
            <i class="bi bi-calendar me-1"></i>
            {{ formatDate(dateRange.start) }} — {{ formatDate(dateRange.end) }}
          </span>
        </div>
        <div class="d-flex gap-2">
          <!-- Selector de periodo -->
          <div class="btn-group btn-group-sm">
            <button
              v-for="p in periods"
              :key="p.value"
              class="btn"
              :class="selectedPeriod === p.value ? 'btn-primary' : 'btn-outline-secondary'"
              @click="selectedPeriod = p.value"
            >{{ p.label }}</button>
          </div>
          <button class="btn btn-outline-danger btn-sm" @click="clearData">
            <i class="bi bi-trash me-1"></i>Borrar
          </button>
        </div>
      </div>

      <!-- Tarjetas de estadísticas -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3" v-for="stat in statsCards" :key="stat.label">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-3 text-center">
              <div class="fw-bold fs-3" :style="{ color: stat.color }">{{ stat.value }}</div>
              <div class="text-muted small">{{ stat.label }}</div>
              <div v-if="stat.sublabel" class="text-muted" style="font-size: 0.7rem;">{{ stat.sublabel }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráfico principal de línea -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-header bg-transparent border-bottom d-flex justify-content-between align-items-center">
          <span class="fw-semibold"><i class="bi bi-graph-up-arrow text-primary me-2"></i>Evolución de glucosa</span>
          <div class="d-flex gap-2 align-items-center">
            <span class="range-label text-muted small">Rango objetivo:</span>
            <span class="badge" style="background: #2a9d8f22; color: #2a9d8f;">70 - 180 mg/dL</span>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height: 300px; position: relative;">
            <canvas ref="lineChartRef" style="width: 100%; height: 100%;"></canvas>
          </div>
        </div>
      </div>

      <!-- Gráficos secundarios -->
      <div class="row g-4 mb-4">
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-transparent border-bottom fw-semibold">
              <i class="bi bi-pie-chart-fill text-warning me-2"></i>Distribución por rango
            </div>
            <div class="card-body d-flex align-items-center justify-content-center">
              <div class="chart-container" style="height: 220px; width: 220px; position: relative;">
                <canvas ref="pieChartRef"></canvas>
              </div>
              <div class="ms-4">
                <div v-for="d in distributionData" :key="d.label" class="d-flex align-items-center gap-2 mb-2">
                  <div class="legend-dot" :style="{ background: d.color }"></div>
                  <div class="small">
                    <span class="fw-medium">{{ d.label }}</span>
                    <span class="text-muted ms-2">{{ d.percent }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-transparent border-bottom fw-semibold">
              <i class="bi bi-clock-history text-info me-2"></i>Patrón por hora del día
            </div>
            <div class="card-body">
              <div class="chart-container" style="height: 220px; position: relative;">
                <canvas ref="barChartRef"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de registros -->
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-transparent border-bottom d-flex justify-content-between align-items-center">
          <span class="fw-semibold"><i class="bi bi-table text-secondary me-2"></i>Registros detallados</span>
          <div class="d-flex gap-2">
            <select class="form-select form-select-sm" v-model="tableFilter" style="width: auto;">
              <option value="all">Todos</option>
              <option value="low">Hipoglucemia (&lt;70)</option>
              <option value="normal">En rango (70-180)</option>
              <option value="high">Hiperglucemia (&gt;180)</option>
            </select>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive" style="max-height: 350px; overflow-y: auto;">
            <table class="table table-hover table-sm align-middle mb-0">
              <thead class="table-light sticky-top">
                <tr>
                  <th>Fecha y hora</th>
                  <th>Glucosa (mg/dL)</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in filteredTableData" :key="row.timestamp">
                  <td class="text-muted small">{{ formatDateTime(row.timestamp) }}</td>
                  <td>
                    <span class="fw-semibold" :style="{ color: getGlucoseColor(row.glucose) }">
                      {{ row.glucose }}
                    </span>
                  </td>
                  <td>
                    <span class="badge" :class="getGlucoseBadge(row.glucose)">
                      {{ getGlucoseLabel(row.glucose) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="p-2 text-center text-muted small border-top">
            Mostrando {{ filteredTableData.length }} de {{ csvData.length }} registros
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';

export default {
  name: 'GlucoseView',
  setup() {
    const fileInput = ref(null);
    const lineChartRef = ref(null);
    const pieChartRef = ref(null);
    const barChartRef = ref(null);
    const csvData = ref([]);
    const isDragging = ref(false);
    const loading = ref(false);
    const parseError = ref('');
    const selectedPeriod = ref('7d');
    const tableFilter = ref('all');

    let lineChart = null;
    let pieChart = null;
    let barChart = null;

    const periods = [
      { value: '1d', label: '1D' },
      { value: '7d', label: '7D' },
      { value: '14d', label: '14D' },
      { value: '30d', label: '30D' },
      { value: 'all', label: 'Todo' },
    ];

    // ---- Parseo de CSV ----
    const parseCSV = (text) => {
      const lines = text.trim().split('\n').filter(l => l.trim());
      if (lines.length < 2) throw new Error('El archivo parece estar vacío o mal formateado.');

      const headers = lines[0].toLowerCase().split(/[,;|\t]/).map(h => h.trim().replace(/"/g, ''));

      // Buscar columnas de fecha y glucosa (nombres comunes en distintos exportadores)
      const dateAliases = ['timestamp', 'fecha', 'date', 'time', 'hora', 'datetime', 'device timestamp'];
      const glucoseAliases = ['glucosa', 'glucose', 'valor', 'value', 'mg/dl', 'mmol', 'historic glucose mg/dl', 'scan glucose mg/dl', 'calculated value'];

      const dateCol = headers.findIndex(h => dateAliases.some(a => h.includes(a)));
      const glucoseCol = headers.findIndex(h => glucoseAliases.some(a => h.includes(a)));

      if (dateCol === -1 || glucoseCol === -1) {
        throw new Error(`No se encontraron las columnas de fecha/glucosa. Columnas detectadas: ${headers.join(', ')}`);
      }

      const rows = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(/[,;|\t]/).map(c => c.trim().replace(/"/g, ''));
        const rawDate = cols[dateCol];
        const rawGlucose = cols[glucoseCol];

        if (!rawDate || !rawGlucose) continue;

        const date = new Date(rawDate);
        const glucose = parseFloat(rawGlucose);

        if (isNaN(date.getTime()) || isNaN(glucose) || glucose <= 0 || glucose > 600) continue;

        rows.push({ timestamp: date, glucose });
      }

      if (rows.length === 0) throw new Error('No se encontraron datos válidos en el archivo.');

      return rows.sort((a, b) => a.timestamp - b.timestamp);
    };

    const handleFile = (file) => {
      if (!file) return;
      if (!file.name.match(/\.(csv|txt)$/i)) {
        parseError.value = 'Por favor selecciona un archivo CSV o TXT.';
        return;
      }

      loading.value = true;
      parseError.value = '';

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          csvData.value = parseCSV(e.target.result);
        } catch (err) {
          parseError.value = err.message;
        } finally {
          loading.value = false;
        }
      };
      reader.readAsText(file, 'UTF-8');
    };

    const handleFileInput = (e) => handleFile(e.target.files[0]);
    const handleDrop = (e) => {
      isDragging.value = false;
      handleFile(e.dataTransfer.files[0]);
    };

    // ---- Datos de ejemplo ----
    const loadSampleData = () => {
      const now = new Date();
      const data = [];
      // Generar 14 días de datos simulados
      for (let d = 13; d >= 0; d--) {
        for (let h = 0; h < 24; h += 2) {
          const ts = new Date(now);
          ts.setDate(ts.getDate() - d);
          ts.setHours(h, Math.floor(Math.random() * 60), 0, 0);

          let base = 100;
          if (h >= 7 && h <= 9) base = 160 + Math.random() * 40;    // Post desayuno
          else if (h >= 12 && h <= 14) base = 155 + Math.random() * 35; // Post almuerzo
          else if (h >= 19 && h <= 21) base = 145 + Math.random() * 40; // Post cena
          else if (h >= 2 && h <= 4) base = 80 + Math.random() * 30;   // Madrugada

          const glucose = Math.round(base + (Math.random() - 0.5) * 30);
          data.push({ timestamp: ts, glucose: Math.max(55, Math.min(300, glucose)) });
        }
      }
      csvData.value = data;
    };

    const clearData = () => {
      csvData.value = [];
      parseError.value = '';
      if (fileInput.value) fileInput.value.value = '';
    };

    // ---- Filtro por periodo ----
    const filteredData = computed(() => {
      if (selectedPeriod.value === 'all') return csvData.value;
      const days = { '1d': 1, '7d': 7, '14d': 14, '30d': 30 };
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - (days[selectedPeriod.value] || 7));
      return csvData.value.filter(r => r.timestamp >= cutoff);
    });

    // ---- Estadísticas ----
    const stats = computed(() => {
      const data = filteredData.value;
      if (!data.length) return {};
      const values = data.map(d => d.glucose);
      const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
      const max = Math.max(...values);
      const min = Math.min(...values);
      const inRange = values.filter(v => v >= 70 && v <= 180).length;
      const tir = Math.round((inRange / values.length) * 100);
      const low = values.filter(v => v < 70).length;
      const high = values.filter(v => v > 180).length;
      // eHbA1c aproximado
      const a1c = ((avg + 46.7) / 28.7).toFixed(1);
      return { avg, max, min, tir, low, high, a1c };
    });

    const statsCards = computed(() => {
      const s = stats.value;
      if (!s.avg) return [];
      return [
        { label: 'Media glucosa', value: `${s.avg}`, sublabel: 'mg/dL', color: '#2c7da0' },
        { label: 'TIR (en rango)', value: `${s.tir}%`, sublabel: '70–180 mg/dL', color: s.tir >= 70 ? '#2a9d8f' : '#e76f51' },
        { label: 'HbA1c estimada', value: `${s.a1c}%`, sublabel: 'Aproximación', color: '#e9c46a' },
        { label: 'Hipoglucemias', value: `${s.low}`, sublabel: 'registros < 70', color: '#e76f51' },
      ];
    });

    const distributionData = computed(() => {
      const d = filteredData.value;
      if (!d.length) return [];
      const total = d.length;
      const low = d.filter(v => v.glucose < 70).length;
      const normal = d.filter(v => v.glucose >= 70 && v.glucose <= 180).length;
      const high = d.filter(v => v.glucose > 180).length;
      return [
        { label: 'Hipoglucemia (<70)', color: '#e76f51', percent: Math.round((low / total) * 100), count: low },
        { label: 'En rango (70-180)', color: '#2a9d8f', percent: Math.round((normal / total) * 100), count: normal },
        { label: 'Hiperglucemia (>180)', color: '#e9c46a', percent: Math.round((high / total) * 100), count: high },
      ];
    });

    const dateRange = computed(() => {
      if (!csvData.value.length) return {};
      return {
        start: csvData.value[0].timestamp,
        end: csvData.value[csvData.value.length - 1].timestamp
      };
    });

    // ---- Tabla ----
    const filteredTableData = computed(() => {
      return filteredData.value.filter(row => {
        if (tableFilter.value === 'low') return row.glucose < 70;
        if (tableFilter.value === 'normal') return row.glucose >= 70 && row.glucose <= 180;
        if (tableFilter.value === 'high') return row.glucose > 180;
        return true;
      }).slice(-200).reverse();
    });

    // ---- Helpers glucosa ----
    const getGlucoseColor = (v) => v < 70 ? '#e76f51' : v > 180 ? '#e9c46a' : '#2a9d8f';
    const getGlucoseBadge = (v) => v < 70 ? 'bg-danger' : v > 180 ? 'bg-warning text-dark' : 'bg-success';
    const getGlucoseLabel = (v) => v < 70 ? 'Hipo' : v > 180 ? 'Hiper' : 'Normal';

    // ---- Gráficos ----
    const loadChartJS = () => new Promise(resolve => {
      if (window.Chart) return resolve();
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
      script.onload = resolve;
      document.head.appendChild(script);
    });

    const renderCharts = async () => {
      await loadChartJS();
      await nextTick();

      const data = filteredData.value;
      if (!data.length) return;

      // Destruir gráficos anteriores
      [lineChart, pieChart, barChart].forEach(c => c?.destroy());

      // Datos para línea (máx 200 puntos)
      const step = Math.max(1, Math.floor(data.length / 200));
      const lineData = data.filter((_, i) => i % step === 0);

      // Línea principal
      const lineCtx = lineChartRef.value?.getContext('2d');
      if (lineCtx) {
        lineChart = new window.Chart(lineCtx, {
          type: 'line',
          data: {
            labels: lineData.map(d => d.timestamp.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })),
            datasets: [
              {
                label: 'Glucosa (mg/dL)',
                data: lineData.map(d => d.glucose),
                borderColor: '#2c7da0',
                backgroundColor: 'rgba(44, 125, 160, 0.08)',
                tension: 0.3,
                fill: true,
                pointRadius: lineData.length > 50 ? 0 : 3,
                pointHoverRadius: 5,
                borderWidth: 2,
              },
              {
                label: 'Límite superior (180)',
                data: lineData.map(() => 180),
                borderColor: '#e9c46a',
                borderDash: [5, 5],
                borderWidth: 1,
                pointRadius: 0,
                fill: false,
              },
              {
                label: 'Límite inferior (70)',
                data: lineData.map(() => 70),
                borderColor: '#e76f51',
                borderDash: [5, 5],
                borderWidth: 1,
                pointRadius: 0,
                fill: false,
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { ticks: { maxTicksLimit: 8, font: { size: 10 } }, grid: { display: false } },
              y: { min: 40, max: 320, ticks: { font: { size: 10 } }, grid: { color: '#f0f0f0' } }
            }
          }
        });
      }

      // Pie
      const pieCtx = pieChartRef.value?.getContext('2d');
      if (pieCtx && distributionData.value.length) {
        pieChart = new window.Chart(pieCtx, {
          type: 'doughnut',
          data: {
            labels: distributionData.value.map(d => d.label),
            datasets: [{
              data: distributionData.value.map(d => d.count),
              backgroundColor: distributionData.value.map(d => d.color),
              borderWidth: 0,
              hoverOffset: 8,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '65%',
            plugins: { legend: { display: false } }
          }
        });
      }

      // Bar - patrón por hora
      const hourlyAvg = Array.from({ length: 24 }, (_, h) => {
        const hourData = data.filter(d => d.timestamp.getHours() === h);
        return hourData.length ? Math.round(hourData.reduce((s, d) => s + d.glucose, 0) / hourData.length) : null;
      });

      const barCtx = barChartRef.value?.getContext('2d');
      if (barCtx) {
        barChart = new window.Chart(barCtx, {
          type: 'bar',
          data: {
            labels: Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, '0')}h`),
            datasets: [{
              label: 'Media mg/dL',
              data: hourlyAvg,
              backgroundColor: hourlyAvg.map(v =>
                v === null ? '#dee2e6' : v < 70 ? '#e76f51' : v > 180 ? '#e9c46a' : '#2a9d8f'
              ),
              borderRadius: 4,
              borderSkipped: false,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { ticks: { font: { size: 9 } }, grid: { display: false } },
              y: { min: 40, ticks: { font: { size: 10 } }, grid: { color: '#f0f0f0' } }
            }
          }
        });
      }
    };

    // Re-renderizar al cambiar datos o periodo
    watch([filteredData], () => {
      if (csvData.value.length) renderCharts();
    });

    watch(csvData, (val) => {
      if (val.length) nextTick(renderCharts);
    });

    onUnmounted(() => {
      [lineChart, pieChart, barChart].forEach(c => c?.destroy());
    });

    // ---- Formateo de fechas ----
    const formatDate = (d) => d ? new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
    const formatDateTime = (d) => d ? new Date(d).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';

    return {
      fileInput, lineChartRef, pieChartRef, barChartRef,
      csvData, isDragging, loading, parseError,
      selectedPeriod, periods, tableFilter,
      statsCards, distributionData, dateRange,
      filteredTableData,
      handleFileInput, handleDrop, loadSampleData, clearData,
      getGlucoseColor, getGlucoseBadge, getGlucoseLabel,
      formatDate, formatDateTime
    };
  }
};
</script>

<style scoped lang="scss">
.page-header {
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 1rem;
}

.drop-zone {
  border-radius: 20px !important;
  border: 2px dashed #dee2e6 !important;
  transition: all 0.2s;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;

  &.dragging {
    border-color: #2c7da0 !important;
    background: rgba(44, 125, 160, 0.04) !important;
  }

  &.border-danger { border-color: #dc3545 !important; }

  .drop-icon { color: #adb5bd; transition: color 0.2s; }
  &.dragging .drop-icon { color: #2c7da0; }
}

.format-example {
  background: #1e1e2e;
  border-radius: 8px;
  font-family: monospace;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  flex-shrink: 0;
}

.card {
  border-radius: 12px !important;
}

.table {
  th { font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: #6c757d; }
}
</style>