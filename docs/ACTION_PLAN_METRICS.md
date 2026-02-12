# IVR Unity - Plan de Acción con Métricas

## Executive Summary

Basado en el documento "Pruebas IVR.xlsx", se identificaron **brechas críticas** entre la implementación actual y los requisitos esperados. El bot actual opera a un nivel **básico** (30% de funcionalidad esperada), requiriendo mejoras inmediatas para alcanzar nivel **profesional** (85%+).

### Current State vs Target

| Dimensión | Actual | Target | Gap |
|-----------|--------|--------|-----|
| **Conversación Contextual** | 20% | 90% | 🔴 70% |
| **Datos de Póliza** | 40% | 95% | 🔴 55% |
| **Manejo de Siniestros** | 0% | 90% | 🔴 90% |
| **Scripts de Retención** | 0% | 85% | 🔴 85% |
| **Manejo de Errores** | 50% | 95% | 🟡 45% |
| **Múltiples Productos** | 30% | 90% | 🟡 60% |
| **First Call Resolution** | 35% | 65% | 🟡 30% |

---

## 📈 Métricas de Éxito (KPIs)

### KPI 1: First Call Resolution (FCR)
**Definición:** % de llamadas resueltas sin necesidad de transfer a agente humano.

| Métrica | Baseline | Meta Sprint 1 | Meta Sprint 2 | Meta Final |
|---------|----------|---------------|---------------|------------|
| FCR Rate | 35% | 45% | 55% | 65% |

**Cómo medir:**
```typescript
FCR = (Llamadas completadas sin transfer / Total llamadas) * 100

// Implementación en dashboard
await db.query(`
  SELECT
    COUNT(*) FILTER (WHERE transfer_count = 0) as resolved_without_transfer,
    COUNT(*) as total_calls,
    ROUND(100.0 * COUNT(*) FILTER (WHERE transfer_count = 0) / COUNT(*), 2) as fcr_rate
  FROM calls
  WHERE created_at >= NOW() - INTERVAL '7 days'
`);
```

**Factores que aumentan FCR:**
- ✅ Scripts de retención implementados → +10%
- ✅ Datos completos de póliza → +8%
- ✅ Manejo de contexto → +7%
- ✅ Flujo de siniestros completo → +5%

---

### KPI 2: Transfer Rate con Contexto
**Definición:** % de transfers que incluyen contexto completo al asesor.

| Métrica | Baseline | Meta Sprint 1 | Meta Sprint 2 | Meta Final |
|---------|----------|---------------|---------------|------------|
| Context Completeness | 30% | 60% | 80% | 95% |

**Cómo medir:**
```typescript
// Campos requeridos en transfer context
const requiredFields = [
  'customer_name',
  'policy_number',
  'intention',
  'collected_data',
  'sentiment'
];

Context Completeness = (
  Transfers con todos los campos / Total transfers
) * 100
```

**Meta de calidad:**
- Sprint 1: 3/5 campos en promedio
- Sprint 2: 4/5 campos en promedio
- Final: 5/5 campos en 95% de casos

---

### KPI 3: Customer Satisfaction (CSAT)
**Definición:** Satisfacción del cliente al finalizar la llamada.

| Métrica | Baseline | Meta Sprint 1 | Meta Sprint 2 | Meta Final |
|---------|----------|---------------|---------------|------------|
| CSAT Score | 3.8/5.0 | 4.0/5.0 | 4.3/5.0 | 4.5/5.0 |

**Cómo medir:**
```typescript
// Post-call IVR survey
"En una escala del 1 al 5, donde 5 es excelente:
 ¿Qué tan satisfecho quedó con la atención recibida?"

// Tracking
CSAT = Promedio de todas las calificaciones
CSAT Trend = (CSAT esta semana - CSAT semana anterior)
```

**Drivers de CSAT:**
- Empatía en mensajes → Impacto: +0.3 puntos
- Resolución en primera llamada → Impacto: +0.4 puntos
- Tiempo de espera bajo → Impacto: +0.2 puntos

---

### KPI 4: Average Handling Time (AHT)
**Definición:** Tiempo promedio de duración de llamada.

| Métrica | Baseline | Meta Sprint 1 | Meta Sprint 2 | Meta Final |
|---------|----------|---------------|---------------|------------|
| AHT (segundos) | 480s (8min) | 360s (6min) | 300s (5min) | 240s (4min) |

**Cómo medir:**
```typescript
AHT = Total call duration / Number of calls

// Por tipo de consulta
AHT_by_intent = {
  'policy_info': 180s,        // Target: 3 min
  'claim_report': 420s,       // Target: 7 min
  'payment_inquiry': 240s,    // Target: 4 min
  'cancellation': 600s,       // Target: 10 min (con retención)
  'general': 300s             // Target: 5 min
}
```

**Balance crítico:**
- ❌ AHT muy bajo + FCR bajo = Mala experiencia (transfer rápido sin ayuda)
- ✅ AHT moderado + FCR alto = Experiencia óptima (resuelve pero eficiente)
- ⚠️ AHT muy alto + FCR bajo = Ineficiencia (gasta tiempo y no resuelve)

**Target ideal:** AHT 4-5 min con FCR 65%+

---

### KPI 5: Containment Rate
**Definición:** % de llamadas que el bot puede manejar completamente sin intervención humana.

| Métrica | Baseline | Meta Sprint 1 | Meta Sprint 2 | Meta Final |
|---------|----------|---------------|---------------|------------|
| Containment Rate | 20% | 35% | 50% | 60% |

**Llamadas que deben contenerse (no transferir):**
- ✅ Consulta de estado de póliza → 90% containment
- ✅ Información de pagos → 85% containment
- ✅ Envío de documentos digitales → 95% containment
- ❌ Cambio de beneficiario → 0% containment (siempre transfer)
- ❌ Negociación de deuda → 0% containment (siempre transfer)
- ⚠️ Siniestro básico → 30% containment (recopila datos, luego transfer)

---

### KPI 6: Hallucination Rate
**Definición:** % de respuestas donde el bot inventa información incorrecta.

| Métrica | Baseline | Meta Sprint 1 | Meta Sprint 2 | Meta Final |
|---------|----------|---------------|---------------|------------|
| Hallucination Rate | 8% | 4% | 2% | <1% |

**Ejemplos de alucinaciones:**
- ❌ Prometer cobertura sin verificar en sistema
- ❌ Inventar políticas o excepciones que no existen
- ❌ Confirmar información sin consultar API
- ❌ Dar asesoría legal o regulatoria

**Cómo medir:**
```typescript
// Manual review de muestra aleatoria
Hallucination Rate = (
  Llamadas con info incorrecta / Total llamadas revisadas
) * 100

// Sample size: 50 llamadas/semana
// Revisores: 2 QA agents
```

**Medidas preventivas:**
- Prompt con reglas anti-alucinación
- Validación obligatoria en sistema antes de confirmar
- Frases de cobertura: "Según su póliza..." (no "sí, está cubierto")

---

### KPI 7: Sentiment Trend
**Definición:** Tendencia del sentimiento del cliente durante la llamada.

| Métrica | Baseline | Meta Sprint 1 | Meta Sprint 2 | Meta Final |
|---------|----------|---------------|---------------|------------|
| Positive Trend | 45% | 55% | 65% | 70% |
| Negative Trend | 25% | 20% | 15% | 10% |

**Cómo medir:**
```typescript
// ElevenLabs Conversational AI ya detecta sentimiento
// Tracking en timeline:
const sentimentTimeline = [
  { time: 0, sentiment: 'neutral' },      // Inicio
  { time: 30, sentiment: 'frustrated' },  // Problema detectado
  { time: 90, sentiment: 'positive' }     // Resolución
];

// Analizar:
Positive Trend = sentiment al final > sentiment al inicio
Negative Trend = sentiment al final < sentiment al inicio

// Dashboard metric:
Sentiment Improvement Rate = (
  Llamadas con mejora de sentimiento / Total llamadas
) * 100
```

**Target:** 70% de llamadas deben terminar con sentimiento mejor o igual al inicial.

---

## 🎯 Sprint Planning

### Sprint 1 (Semanas 1-2): Fundamentos Críticos

#### Objetivos:
1. ✅ Mejorar calidad de datos de póliza
2. ✅ Implementar contexto conversacional básico
3. ✅ Agregar scripts de retención
4. ✅ Crear flujo básico de siniestros

#### Tasks:
| Task | Owner | Effort | Priority |
|------|-------|--------|----------|
| Implementar `get_policy_full_details` tool | Backend Dev | 2 días | P0 |
| Integrar API de Core System (mock) | Backend Dev | 3 días | P0 |
| Actualizar prompt con scripts de retención | AI Engineer | 1 día | P0 |
| Implementar `create_claim` tool | Backend Dev | 2 días | P0 |
| Agregar context tracking en CallSession | Backend Dev | 2 días | P0 |
| Actualizar prompt con reglas de contexto | AI Engineer | 1 día | P0 |
| Testing end-to-end | QA | 3 días | P0 |

**Total:** 10 días laborables

#### Success Criteria:
- [ ] FCR aumenta de 35% a 45%
- [ ] Context completeness aumenta de 30% a 60%
- [ ] 100% de consultas de póliza muestran datos completos
- [ ] 100% de cancelaciones pasan por script de retención
- [ ] 80% de siniestros generan número de caso

#### Métricas a medir:
```bash
# Daily tracking
- Llamadas totales
- Llamadas con transfer
- Llamadas resueltas (FCR)
- Promedio de CSAT
- Hallucination incidents

# Weekly review
- FCR trend
- CSAT trend
- AHT trend
- Top transfer reasons
```

---

### Sprint 2 (Semanas 3-4): Robustez y Experiencia

#### Objetivos:
1. ✅ Manejo inteligente de múltiples productos
2. ✅ Recovery de errores de audio
3. ✅ Cambio de intención en llamada
4. ✅ Notificaciones SMS

#### Tasks:
| Task | Owner | Effort | Priority |
|------|-------|--------|----------|
| Implementar `get_customer_policies` con priorización | Backend Dev | 2 días | P1 |
| Agregar retry logic para audio | Backend Dev | 1 día | P1 |
| Implementar context stacking | Backend Dev | 2 días | P1 |
| Integrar servicio de SMS (Telnyx) | Backend Dev | 2 días | P1 |
| Actualizar prompt con manejo de intenciones múltiples | AI Engineer | 1 día | P1 |
| Agregar validación de datos contradictorios | Backend Dev | 2 días | P1 |
| Testing de casos complejos | QA | 3 días | P1 |

**Total:** 10 días laborables

#### Success Criteria:
- [ ] FCR aumenta de 45% a 55%
- [ ] 100% de clientes multi-producto reciben contexto correcto
- [ ] <2% de llamadas fallan por error de audio
- [ ] 90% de cambios de intención son detectados
- [ ] 100% de siniestros envían SMS con número de caso

---

### Sprint 3 (Semanas 5-6): Pulimiento y Escalabilidad

#### Objetivos:
1. ✅ Soporte básico de idiomas adicionales
2. ✅ Mejora de manejo de acentos
3. ✅ Mensajes empáticos mejorados
4. ✅ Monitoring y alertas

#### Tasks:
| Task | Owner | Effort | Priority |
|------|-------|--------|----------|
| Agregar mensajes pre-grabados en Creole | Content | 1 día | P2 |
| Tuning de STT para acentos del Caribe | AI Engineer | 2 días | P2 |
| Reescritura de todos los mensajes con empatía | Content | 2 días | P2 |
| Implementar Sentry para monitoring | DevOps | 1 día | P2 |
| Dashboard de métricas en tiempo real | Frontend Dev | 3 días | P2 |
| Testing con usuarios reales (beta) | QA | 5 días | P2 |

**Total:** 10 días laborables

#### Success Criteria:
- [ ] FCR aumenta de 55% a 65%
- [ ] CSAT aumenta de 4.0 a 4.5
- [ ] Llamadas en Creole/Francés son detectadas y transferidas correctamente
- [ ] <5% de llamadas con problemas de reconocimiento de acento
- [ ] 100% de incidentes críticos generan alerta automática

---

## 📊 Dashboard de Métricas (Implementación)

### Real-Time Metrics Panel

```typescript
// Dashboard component to add
export const MetricsPanel = () => {
  const metrics = useRealtimeMetrics();

  return (
    <div className="grid grid-cols-4 gap-4">
      <MetricCard
        title="FCR Rate"
        value={`${metrics.fcr}%`}
        target={65}
        trend={metrics.fcrTrend}
        color="blue"
      />
      <MetricCard
        title="CSAT Score"
        value={metrics.csat.toFixed(1)}
        target={4.5}
        trend={metrics.csatTrend}
        color="green"
      />
      <MetricCard
        title="Containment Rate"
        value={`${metrics.containment}%`}
        target={60}
        trend={metrics.containmentTrend}
        color="purple"
      />
      <MetricCard
        title="Hallucinations"
        value={metrics.hallucinationCount}
        target={0}
        alert={metrics.hallucinationCount > 5}
        color="red"
      />
    </div>
  );
};
```

### API Endpoints for Metrics

```typescript
// GET /api/metrics/fcr
router.get('/metrics/fcr', async (req, res) => {
  const { startDate, endDate } = req.query;

  const result = await db.query(`
    SELECT
      DATE(created_at) as date,
      COUNT(*) as total_calls,
      COUNT(*) FILTER (WHERE transfer_count = 0) as resolved_without_transfer,
      ROUND(100.0 * COUNT(*) FILTER (WHERE transfer_count = 0) / COUNT(*), 2) as fcr_rate
    FROM calls
    WHERE created_at BETWEEN $1 AND $2
    GROUP BY DATE(created_at)
    ORDER BY date DESC
  `, [startDate, endDate]);

  res.json(result.rows);
});

// GET /api/metrics/csat
router.get('/metrics/csat', async (req, res) => {
  const { startDate, endDate } = req.query;

  const result = await db.query(`
    SELECT
      DATE(created_at) as date,
      AVG(csat_score) as avg_csat,
      COUNT(*) as total_responses,
      STDDEV(csat_score) as stddev
    FROM call_surveys
    WHERE created_at BETWEEN $1 AND $2
    GROUP BY DATE(created_at)
    ORDER BY date DESC
  `, [startDate, endDate]);

  res.json(result.rows);
});

// GET /api/metrics/transfer-reasons
router.get('/metrics/transfer-reasons', async (req, res) => {
  const result = await db.query(`
    SELECT
      transfer_reason,
      COUNT(*) as count,
      ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentage
    FROM calls
    WHERE transfer_count > 0
      AND created_at >= NOW() - INTERVAL '7 days'
    GROUP BY transfer_reason
    ORDER BY count DESC
    LIMIT 10
  `);

  res.json(result.rows);
});
```

---

## 🚨 Alertas y Monitoreo

### Alert Rules

```typescript
// Alert conditions
const alertRules = [
  {
    name: 'FCR Drop',
    condition: 'fcr_rate < 40% for 2 hours',
    severity: 'warning',
    action: 'Notify team lead'
  },
  {
    name: 'Hallucination Spike',
    condition: 'hallucinations > 5 in 1 hour',
    severity: 'critical',
    action: 'Page on-call engineer + disable bot'
  },
  {
    name: 'CSAT Drop',
    condition: 'csat < 3.5 for 4 hours',
    severity: 'warning',
    action: 'Notify QA team'
  },
  {
    name: 'High Transfer Rate',
    condition: 'transfer_rate > 75% for 1 hour',
    severity: 'warning',
    action: 'Review transfer reasons'
  },
  {
    name: 'Audio Errors',
    condition: 'audio_error_rate > 10% for 30 minutes',
    severity: 'critical',
    action: 'Check Telnyx/ElevenLabs status'
  }
];
```

---

## 📝 Testing Checklist

### Pre-Sprint Testing
- [ ] Baseline metrics captured
- [ ] Test environment configured
- [ ] Mock data prepared

### During Sprint
- [ ] Daily smoke tests
- [ ] Weekly regression tests
- [ ] User acceptance testing (UAT)

### Post-Sprint
- [ ] Metrics comparison (before/after)
- [ ] Hallucination audit (50 random calls)
- [ ] CSAT survey analysis
- [ ] Performance benchmarks

---

## 🎓 Training Material

### For QA Team
- [ ] Script de pruebas actualizado
- [ ] Checklist de casos edge
- [ ] Proceso de reportar alucinaciones

### For Customer Service
- [ ] Guía de contexto que reciben de IVR
- [ ] Mejores prácticas para recibir transfers
- [ ] FAQ de funcionamiento del bot

### For Management
- [ ] Dashboard walkthrough
- [ ] Interpretación de métricas
- [ ] Proceso de escalación

---

## 💰 ROI Estimation

### Baseline (Current)
- Llamadas/día: 200
- % manejadas por bot: 35%
- Costo por llamada agente: $2.50
- Costo por llamada bot: $0.15

**Costo mensual actual:**
- Llamadas a agentes: 200 × 65% × 30 × $2.50 = $9,750
- Llamadas a bot: 200 × 35% × 30 × $0.15 = $315
- **Total: $10,065/mes**

### Target (After Sprint 3)
- Llamadas/día: 200
- % manejadas por bot: 65%
- Costo por llamada agente: $2.50
- Costo por llamada bot: $0.15

**Costo mensual proyectado:**
- Llamadas a agentes: 200 × 35% × 30 × $2.50 = $5,250
- Llamadas a bot: 200 × 65% × 30 × $0.15 = $585
- **Total: $5,835/mes**

### **Savings: $4,230/mes = $50,760/año**

**Payback de inversión:**
- Costo desarrollo (3 sprints): ~$30,000
- Payback period: 7 meses
- ROI año 1: 69%

---

## 📅 Timeline Summary

```
Week 1-2:  Sprint 1 - Fundamentos
Week 3-4:  Sprint 2 - Robustez
Week 5-6:  Sprint 3 - Pulimiento
Week 7:    Testing final y deployment
Week 8:    Monitoring y ajustes

Total: 8 semanas para alcanzar meta de 65% FCR
```

---

## ✅ Definition of Done

### Sprint 1 Complete When:
- ✅ 100% de consultas de póliza muestran datos completos
- ✅ FCR ≥ 45%
- ✅ Context completeness ≥ 60%
- ✅ Todos los tests pasan
- ✅ Documentación actualizada

### Sprint 2 Complete When:
- ✅ Multi-producto funciona correctamente
- ✅ FCR ≥ 55%
- ✅ Audio errors < 2%
- ✅ SMS notifications funcionando

### Sprint 3 Complete When:
- ✅ FCR ≥ 65%
- ✅ CSAT ≥ 4.5
- ✅ Hallucination rate < 1%
- ✅ Dashboard de métricas en vivo
- ✅ Training material completo

---

## 🔄 Continuous Improvement

### Weekly Reviews
- Revisar top 10 transfer reasons
- Analizar llamadas con CSAT < 3
- Identificar nuevos patrones de alucinación
- Ajustar prompts según hallazgos

### Monthly Reviews
- Comparar métricas mes vs mes
- Ajustar targets basado en tendencias
- Revisar ROI real vs proyectado
- Planear próximas mejoras

---

**Próximos pasos:**
1. Aprobar plan de sprints
2. Asignar equipo
3. Configurar ambiente de desarrollo
4. Iniciar Sprint 1

¿Aprobado para iniciar?
