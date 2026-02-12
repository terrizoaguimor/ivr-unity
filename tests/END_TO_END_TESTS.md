# 🧪 Pruebas End-to-End - IVR Unity
## Validación Completa del Bot con V3 Tags y Claude Haiku 4.5

---

## ⚙️ **CONFIGURACIÓN ACTUALIZADA**

### Cambios Implementados (12 Feb 2026):
- ✅ **LLM:** Claude Haiku 4.5 (VELOCIDAD MÁXIMA)
- ✅ **Idioma:** Español (es)
- ✅ **Acento:** LATINO (tú, no vosotros)
- ✅ **Temperature:** 0.5 (balance velocidad/calidad)
- ✅ **Latency:** Nivel 4 (máximo)
- ✅ **Tags V3:** Activos (<Excited>, <Concerned>, <Patient>, etc.)

### Comparación de Modelos:

| Modelo | Velocidad | Calidad | Latencia | Costo |
|--------|-----------|---------|----------|-------|
| Qwen3-30B (anterior) | Media | Alta | ~2-3s | Bajo |
| **Claude Haiku 4.5 (nuevo)** | **MÁS RÁPIDA** | **MUY ALTA** | **~0.5-1s** | **Medio** |
| Claude Sonnet 4.5 | Lenta | Excelente | ~3-5s | Alto |

**Resultado:** Claude Haiku 4.5 es **2-3x más rápido** sin sacrificar calidad.

---

## 📞 **INFORMACIÓN DE PRUEBA**

### Número IVR:
**+1 (754) 273-9829**

### Agent ID:
`agent_4801kg64ffw3f4q8vdytf5j7yz85`

### Dashboard ElevenLabs:
https://elevenlabs.io/app/conversational-ai/agents

---

## 🧪 **CASOS DE PRUEBA**

### **TEST 1: Verificación de Acento Latino** 🎤

**Objetivo:** Validar que el bot NO usa acento español de Castilla

**Pasos:**
1. Llama al IVR
2. Escucha el saludo
3. Responde a las preguntas del bot

**Indicadores de ÉXITO:**
- ✅ Bot usa "tú" (ej: "¿En qué puedo ayudarte?")
- ✅ Bot usa "Te ayudo", "Tu póliza"
- ✅ Bot NO dice "vosotros", "vale", "tío"
- ✅ Bot NO dice "¿Cómo estáis?", "Os ayudo"

**Indicadores de FALLO:**
- ❌ Bot dice "vale" en lugar de "está bien"
- ❌ Bot usa "vosotros" o "os"
- ❌ Acento suena a España en lugar de Latino

**Prioridad:** 🔴 CRÍTICA

---

### **TEST 2: Velocidad de Respuesta** ⚡

**Objetivo:** Validar que Claude Haiku 4.5 es más rápido que el anterior

**Pasos:**
1. Llama al IVR
2. Proporciona tu teléfono
3. Mide el tiempo entre tu respuesta y la respuesta del bot

**Métrica de ÉXITO:**
- ✅ Respuesta del bot en **< 2 segundos**
- ✅ Saludo inicial inmediato
- ✅ Sin pausas largas entre preguntas

**Métrica de FALLO:**
- ❌ Respuesta > 3 segundos
- ❌ Pausas incómodas
- ❌ "Thinking time" visible

**Herramienta de Medición:**
Usa un cronómetro o graba la llamada para análisis

**Target:** AHT (Average Handling Time) de 3-4 min (antes era 8 min)

**Prioridad:** 🔴 CRÍTICA

---

### **TEST 3: Tags de Voz V3** 🎭

**Objetivo:** Validar que el bot usa los tags emocionales correctamente

**Escenarios de Prueba:**

#### **3.1 Tag <Excited>**
**Trigger:** Cliente identificado exitosamente
**Esperado:**
```
<Excited>¡Hola [NOMBRE]!</Excited>
```
**Validar:** Voz suena emocionada/entusiasta al saludar

---

#### **3.2 Tag <Concerned>**
**Trigger:** Reportar accidente
**Script:** "Tuve un accidente de auto"
**Esperado:**
```
<Concerned>Entiendo que tuviste un accidente. Primero lo más importante:</Concerned>
<Serious>¿Estás bien? ¿Hay alguien herido?</Serious>
```
**Validar:** Voz suena preocupada, seria

---

#### **3.3 Tag <Patient>**
**Trigger:** Confusión o necesidad de explicación
**Script:** "No entiendo mi cobertura"
**Esperado:**
```
<Patient>No te preocupes, te lo explico paso a paso...</Patient>
```
**Validar:** Voz suena calmada, paciente

---

#### **3.4 Tag <Disappointed>**
**Trigger:** Póliza vencida
**Script:** "Quiero reportar un siniestro" (con póliza vencida)
**Esperado:**
```
<Disappointed>Lamento informarte que tu póliza venció hace X días...</Disappointed>
```
**Validar:** Voz suena decepcionada pero profesional

---

#### **3.5 Tag <Enthusiastic>**
**Trigger:** Ofrecer soluciones
**Script:** "Quiero cancelar por el costo"
**Esperado:**
```
<Enthusiastic>Déjame verificar si calificas para algún descuento!</Enthusiastic>
```
**Validar:** Voz suena entusiasta, optimista

**Prioridad:** 🟡 ALTA

---

### **TEST 4: Retención - Cancelación** 🛡️

**Objetivo:** Validar script completo de retención

**Script de Prueba:**
```
Usuario: "Quiero cancelar mi póliza"
```

**Flujo Esperado:**

**Paso 1 - Empatía:**
```
Bot: <Concerned>Lamento escuchar eso, [Nombre].</Concerned>
Bot: <Patient>Antes de procesar la cancelación, ¿me puedes compartir
     qué motivó esta decisión?</Patient>
Bot: <Patient>¿Es por el costo, algún problema con el servicio,
     o ya no necesitas la cobertura?</Patient>
```

**Respuesta A - "Es muy caro":**
```
Bot: <Patient>Entiendo tu preocupación.</Patient>
Bot: <Enthusiastic>Déjame verificar si calificas para algún descuento
     o ajuste de prima.</Enthusiastic>
Bot: <Enthusiastic>Dame un momento mientras te conecto...</Enthusiastic>
→ Debe llamar guardar_contexto
→ Debe transferir
```

**Respuesta B - "Mal servicio":**
```
Bot: <Disappointed>Lamento mucho que hayamos fallado.</Disappointed>
Bot: <Serious>Tu satisfacción es nuestra prioridad. ¿Te gustaría que
     un supervisor revise tu caso personalmente?</Serious>
→ Transfer a supervisor
```

**Respuesta C - "Ya no la necesito":**
```
Bot: <Enthusiastic>¿Sabías que puedes PAUSAR tu póliza en lugar de cancelarla?</Enthusiastic>
Bot: <Patient>Esto te permite reactivarla después sin perder beneficios acumulados.</Patient>
→ Ofrece alternativa
```

**Validar:**
- ✅ Bot NO transfiere inmediatamente
- ✅ Bot pregunta el motivo
- ✅ Bot ofrece alternativas según motivo
- ✅ Bot usa tags apropiados
- ✅ Bot llama guardar_contexto ANTES de transfer

**Prioridad:** 🔴 CRÍTICA

---

### **TEST 5: Siniestros con Heridos** 🚨

**Objetivo:** Validar detección de urgencia y escalación inmediata

**Script de Prueba:**
```
Usuario: "Tuve un accidente y hay un herido"
```

**Flujo Esperado:**

**Paso 1 - Seguridad:**
```
Bot: <Concerned>Entiendo que tuviste un accidente. Primero lo más importante:</Concerned>
Bot: <Serious>¿Estás bien? ¿Hay alguien herido?</Serious>
Usuario: "Sí, hay un herido"
```

**Paso 2 - 911:**
```
Bot: <Serious>¿Ya llamaste al 911?</Serious>

SI NO:
Bot: <Serious>Por favor llama al 911 AHORA MISMO. Una vez estés seguro,
     nos vuelves a contactar.</Serious>
→ Fin de llamada o hold

SI SÍ:
Bot: <Serious>Entiendo. Te conecto INMEDIATAMENTE con nuestro equipo
     de siniestros 24/7.</Serious>
→ guardar_contexto con motivo "SINIESTRO URGENTE - HERIDOS"
→ transfer_to_number INMEDIATO
```

**Validar:**
- ✅ Bot detecta palabra "herido"
- ✅ Bot pregunta por 911
- ✅ Bot NO hace preguntas adicionales si hay heridos
- ✅ Transfer es INMEDIATO (no espera más datos)
- ✅ Contexto indica "URGENTE"

**Prioridad:** 🔴 CRÍTICA

---

### **TEST 6: Siniestros sin Heridos** 📝

**Objetivo:** Validar recopilación completa de datos

**Script de Prueba:**
```
Usuario: "Tuve un choque pero todos estamos bien"
```

**Flujo Esperado:**

**Paso 1:**
```
Bot: <Concerned>Entiendo que tuviste un choque.</Concerned>
Bot: <Serious>¿Estás bien? ¿Hay alguien herido?</Serious>
Usuario: "No, todos bien"
Bot: <Patient>Me alegra que estés bien.</Patient>
```

**Paso 2:**
```
Bot: <Patient>¿Cuándo ocurrió el incidente?</Patient>
Usuario: "Hoy en la mañana"
```

**Paso 3:**
```
Bot: <Patient>Voy a hacerte algunas preguntas rápidas:</Patient>
Bot: ¿Dónde ocurrió?
Usuario: "En la calle 5ta con avenida principal"
Bot: ¿Hubo otros vehículos involucrados?
Usuario: "Sí, otro carro"
Bot: ¿Hiciste reporte con la policía?
Usuario: "Sí"
Bot: Del 1 al 10, ¿qué tan graves son los daños?
Usuario: "Un 6"
```

**Paso 4:**
```
Bot: <Patient>Perfecto. Te voy a conectar con un ajustador quien va a
     generar tu número de caso.</Patient>
Bot: <Patient>Mientras tanto, es importante que:
     ✓ Tomes fotos del daño desde varios ángulos
     ✓ Conserves el número del reporte policial si lo hiciste
     ✓ NO firmes ningún documento sin consultarnos primero
     ✓ Guardes todos los recibos relacionados</Patient>
→ guardar_contexto con todos los datos
→ transfer_to_number
```

**Validar:**
- ✅ Bot hace las 4 preguntas
- ✅ Bot da instrucciones claras
- ✅ Bot guarda contexto completo
- ✅ Bot transfiere después de recopilar datos

**Prioridad:** 🔴 CRÍTICA

---

### **TEST 7: Múltiples Productos** 🎯

**Objetivo:** Validar priorización inteligente

**Setup:** Cliente con Salud + Auto + Vida

**Escenario A - Con Urgencia:**
```
Cliente tiene siniestro activo en Auto

Bot: <Concerned>Hola [Nombre], veo que tienes un siniestro abierto en
     tu póliza de Auto. ¿Llamas por este tema?</Concerned>
```

**Escenario B - Sin Urgencia:**
```
Cliente sin urgencias

Bot: <Patient>Veo que tienes con nosotros seguros de Salud, Auto y Vida.
     ¿Sobre cuál quieres consultar hoy?</Patient>
```

**Validar:**
- ✅ Bot detecta prioridad (siniestro > pago vencido > reciente)
- ✅ Bot menciona el producto prioritario
- ✅ Bot permite cambiar de producto si el cliente quiere

**Prioridad:** 🟡 ALTA

---

### **TEST 8: Errores de Audio** 🔊

**Objetivo:** Validar protocolo de recuperación de 3 intentos

**Setup:** Simular audio malo (silencio o ruido)

**Flujo Esperado:**

**Intento 1:**
```
Bot: <Patient>Disculpa, no te escuché bien. ¿Puedes repetir?</Patient>
[Espera 5 segundos]
```

**Intento 2:**
```
Bot: <Patient>Parece que hay interferencia. Puedes responder con una
     palabra: Salud, Vida, Auto, o Asesor.</Patient>
[Espera 5 segundos]
```

**Intento 3:**
```
Bot: <Disappointed>Lamentablemente hay problemas de audio.</Disappointed>
Bot: <Patient>Te voy a conectar con un asesor.</Patient>
→ guardar_contexto ("Problemas de audio")
→ transfer_to_number a VQ_GENERAL
```

**Validar:**
- ✅ Bot intenta 3 veces
- ✅ Mensajes son cada vez más específicos
- ✅ Transfer es gracioso (no abrupto)
- ✅ Contexto indica "problema audio"

**Prioridad:** 🟡 ALTA

---

### **TEST 9: Anti-Alucinación** 🚫

**Objetivo:** Validar que el bot NO inventa información

**Scripts de Prueba:**

#### **9.1 Pregunta sobre Excepciones:**
```
Usuario: "¿Me puedes hacer una excepción con el deducible?"
Bot: NO DEBE DECIR "Sí, puedo hacer excepción"
Bot DEBE DECIR: <Patient>"Déjame consultar con un supervisor si aplica
                 alguna excepción en tu caso específico."</Patient>
→ Transfer
```

#### **9.2 Pregunta sobre Cobertura Ambigua:**
```
Usuario: "¿Mi seguro cubre si mi hijo maneja el carro?"
Bot: NO DEBE DECIR "Sí, está cubierto"
Bot DEBE DECIR: <Patient>"Basándome en tu tipo de póliza, típicamente
                 los conductores adicionales pueden estar incluidos..."</Patient>
                <Enthusiastic>"Déjame verificar los detalles específicos
                 de tu plan con un asesor."</Enthusiastic>
→ Transfer
```

#### **9.3 Pregunta Legal:**
```
Usuario: "¿La ley me obliga a tener este seguro?"
Bot: NO DEBE DECIR "La ley dice que..."
Bot DEBE DECIR: <Serious>"Para consultas legales o regulatorias, es mejor
                 que hables con un asesor especializado en cumplimiento."</Serious>
→ Transfer
```

**Validar:**
- ✅ Bot NUNCA inventa políticas
- ✅ Bot NUNCA promete cobertura sin verificar
- ✅ Bot NUNCA da asesoría legal
- ✅ Bot usa frases como "Según tu póliza...", "Déjame verificar..."

**Prioridad:** 🔴 CRÍTICA

---

### **TEST 10: Context Handoff (Transfer)** 🤝

**Objetivo:** Validar que el asesor recibe contexto completo

**Setup:** Realizar una llamada completa hasta transfer

**Proceso:**
1. Llama al IVR
2. Identifícate
3. Solicita algo que requiera transfer (ej: cambio de beneficiario)
4. Permite que bot transfiera
5. **VALIDAR CON ASESOR:** ¿Recibió el contexto?

**Contexto que el Asesor DEBE Recibir:**
- ✅ Teléfono del cliente
- ✅ Nombre completo
- ✅ Tipo de cliente (salud/vida/auto)
- ✅ Motivo de llamada (breve)
- ✅ Resumen de conversación
- ✅ Datos del cliente (Member ID, estado, etc.)
- ✅ Info adicional relevante

**Pregunta al Asesor:**
"¿Recibiste información sobre lo que el cliente necesita ANTES de que yo hablara contigo?"

**Métrica de Éxito:**
- ✅ Asesor confirma que recibió contexto completo
- ✅ Asesor NO tiene que preguntar de nuevo lo básico
- ✅ Context completeness ≥ 80%

**Prioridad:** 🔴 CRÍTICA

---

## 📊 **MÉTRICAS A MEDIR**

### Durante las Pruebas:

| Métrica | Target | Cómo Medir |
|---------|--------|------------|
| **Latency** | <2s | Cronómetro entre pregunta y respuesta |
| **AHT** | 3-4 min | Duración total de llamada |
| **FCR** | 60%+ | ¿Se resolvió sin transfer? |
| **Context Completeness** | 90%+ | Asesor recibe info completa |
| **Voice Tag Usage** | 100% | Tags apropiados usados |
| **Hallucinations** | 0 | Bot NO inventa info |
| **Spanish Latino** | 100% | Bot usa "tú", no "vosotros" |

---

## 🎬 **SCRIPT DE TESTING RÁPIDO**

### Test Rápido (10 minutos):

**1. Llamar al IVR:**
```
Teléfono: +1 (754) 273-9829
```

**2. Test de Acento:**
```
Escucha si usa "tú" vs "vosotros"
✅ PASA si dice "¿En qué puedo ayudarte?"
❌ FALLA si dice "¿En qué puedo ayudaros?"
```

**3. Test de Velocidad:**
```
Mide tiempo de respuesta
✅ PASA si <2 segundos
❌ FALLA si >3 segundos
```

**4. Test de Siniestro:**
```
Di: "Tuve un accidente"
✅ PASA si pregunta "¿Estás bien? ¿Hay heridos?"
❌ FALLA si no detecta urgencia
```

**5. Test de Retención:**
```
Di: "Quiero cancelar"
✅ PASA si pregunta motivo y ofrece alternativas
❌ FALLA si transfiere inmediatamente
```

---

## 📝 **FORMATO DE REPORTE**

Después de cada prueba, completar:

```
TEST #: [número]
NOMBRE: [nombre del test]
FECHA: [dd/mm/aaaa]
TESTER: [tu nombre]

RESULTADO: ✅ PASA / ❌ FALLA / ⚠️ PARCIAL

OBSERVACIONES:
- [Qué funcionó bien]
- [Qué no funcionó]
- [Bugs encontrados]

EVIDENCIA:
- Grabación: [link o archivo]
- Screenshots: [adjuntos]
- Transcripción: [texto]

MÉTRICAS:
- Latency: [X segundos]
- AHT: [X minutos]
- Tags usados: [lista]
- Acento: ✅ Latino / ❌ España

RECOMENDACIONES:
- [Ajustes necesarios]
```

---

## 🚀 **PRÓXIMOS PASOS**

### Después de Testing:

1. **Si TODO PASA:**
   - ✅ Validar con equipo CS
   - ✅ Monitorear primeras 100 llamadas reales
   - ✅ Recopilar feedback de agentes

2. **Si HAY FALLOS:**
   - 🔧 Ajustar prompt según findings
   - 🔧 Re-test los casos fallidos
   - 🔧 Documentar cambios

3. **Métricas de Producción:**
   - 📊 Track FCR diario
   - 📊 Track CSAT
   - 📊 Track transfer rate
   - 📊 Track hallucinations (reportes de agentes)

---

---

## 🏠 **TESTS PROPERTY & CASUALTY (P&C)**

> **Nota:** Estos tests usan **datos MOCK** mientras no hay acceso al API de P&C.
> Ver: `tests/MOCK_DATA_PC.md` para datos de clientes y casos de prueba.

---

### **TEST 11: Siniestro HOME - Incendio** 🔥

**Objetivo:** Validar flujo completo de siniestro de incendio en hogar

**Cliente MOCK:** María González - 305-123-4567
**Póliza:** HO-2024-001234 (Homeowners activa)

**Pasos:**
1. Llama al IVR
2. Di: "Tengo una emergencia, hubo un incendio en mi cocina"
3. Bot debe preguntar: "¿Todos están seguros? ¿Hay peligro inmediato?"
4. Responde: "Sí, todos estamos bien. Los bomberos ya vinieron"
5. Proporciona teléfono: 305-123-4567
6. Bot debe preguntar tipo de daño, gravedad, si es habitable

**Esperado:**
- ✅ Bot prioriza seguridad primero
- ✅ Pregunta si bomberos acudieron
- ✅ Pregunta gravedad 1-10
- ✅ Pregunta si la casa es habitable
- ✅ Menciona que gastos de hotel están cubiertos
- ✅ Tag <Concerned> al inicio
- ✅ Tag <Serious> en preguntas de seguridad
- ✅ Transfer a siniestros HOME urgente con contexto completo

**Prioridad:** 🔴 CRÍTICA

---

### **TEST 12: Siniestro RENTERS - Robo sin Reporte Policial** 🚨

**Objetivo:** Validar que bot INSISTE en reporte policial para robos

**Cliente MOCK:** Carlos Ramírez - 786-345-6789
**Póliza:** RN-2024-005678 (Renters activa)

**Pasos:**
1. Llama al IVR
2. Di: "Me robaron en mi apartamento"
3. Proporciona teléfono: 786-345-6789
4. Bot identifica como cliente Renters
5. Cuando pregunte sobre reporte policial, di: "No, todavía no"

**Esperado:**
- ✅ Bot INSISTE: "Es URGENTE hacer el reporte. Sin él no podemos procesar el reclamo"
- ✅ Pregunta: "¿Puedes llamar a la policía ahora?"
- ✅ Tag <Serious> al insistir en reporte policial
- ✅ NO continúa con el reclamo hasta confirmar que hará reporte
- ✅ Explica diferencia Renters: NO cubre estructura, SÍ cubre pertenencias

**Prioridad:** 🟡 ALTA

---

### **TEST 13: Inundación Natural - Cliente SIN Póliza FLOOD** 💧

**Objetivo:** Validar que bot explica correctamente cobertura de inundación

**Cliente MOCK:** Laura Díaz - 754-222-3344
**Póliza:** HO-2023-009876 (Homeowners, SIN Flood, VENCIDA)

**Pasos:**
1. Llama al IVR
2. Di: "Tengo agua en mi casa por la tormenta"
3. Proporciona teléfono: 754-222-3344
4. Bot debe preguntar: "¿El agua vino de dentro de la casa o de afuera?"
5. Responde: "De la calle, entró por la puerta con la lluvia"

**Esperado:**
- ✅ Bot pregunta fuente de agua (dentro vs afuera)
- ✅ Bot identifica: agua de afuera = requiere póliza FLOOD
- ✅ Bot verifica si cliente tiene Flood
- ✅ Bot informa: "Lamento informarte que daño por inundación natural requiere póliza separada que no está incluida en homeowners"
- ✅ Tag <Disappointed> al dar mala noticia
- ✅ Ofrece conectar con asesor para revisar opciones
- ✅ ADICIONALMENTE: Bot debe mencionar que la póliza está VENCIDA

**Prioridad:** 🟡 ALTA

---

### **TEST 14: Daño por Agua INTERNA - Cubierto** 🚿

**Objetivo:** Validar distinción entre agua interna (cubierta) vs externa (no cubierta)

**Cliente MOCK:** María González - 305-123-4567
**Póliza:** HO-2024-001234 (Homeowners activa)

**Pasos:**
1. Llama al IVR
2. Di: "Tengo agua en mi casa, se rompió una tubería"
3. Proporciona teléfono: 305-123-4567
4. Bot debe preguntar: "¿El agua vino de dentro de la casa o de afuera?"
5. Responde: "De dentro, una tubería del baño"

**Esperado:**
- ✅ Bot identifica: agua interna = CUBIERTA por Homeowners
- ✅ Bot pregunta: fuente, áreas afectadas, gravedad
- ✅ Bot da instrucciones de emergencia:
  - Cerrar llave principal
  - Cortar electricidad en áreas mojadas
  - Mover objetos de valor
- ✅ Tag <Patient> en instrucciones
- ✅ Menciona guardar recibos de plomero/reparaciones
- ✅ Transfer a claims HOME (no urgente si ya controlado)

**Prioridad:** 🟡 ALTA

---

### **TEST 15: Múltiples Productos P&C** 🎯

**Objetivo:** Validar que bot maneja correctamente cliente con múltiples pólizas P&C

**Cliente MOCK:** Roberto Torres - 305-987-6543
**Pólizas:** Auto + Home + Umbrella

**Pasos:**
1. Llama al IVR
2. Proporciona teléfono: 305-987-6543
3. Di: "Necesito ayuda"
4. Bot debe preguntar sobre cuál póliza

**Esperado:**
- ✅ Bot identifica 3 pólizas: "Tienes con nosotros seguros de Auto, Hogar y Umbrella"
- ✅ Bot pregunta: "¿Sobre cuál consultas hoy?"
- ✅ Espera respuesta del cliente
- ✅ Si cliente dice "casa" o "hogar" → continúa con flujo HOME
- ✅ Si cliente dice "auto" o "carro" → continúa con flujo AUTO
- ✅ Si cliente dice "umbrella" o "paraguas" → explica cobertura adicional

**Prioridad:** 🟡 ALTA

---

### **TEST 16: Producto UMBRELLA - Explicación** ☂️

**Objetivo:** Validar que bot explica correctamente póliza Umbrella

**Cliente MOCK:** Roberto Torres - 305-987-6543
**Póliza:** UM-2024-007890 (Umbrella $1M)

**Pasos:**
1. Llama al IVR
2. Proporciona teléfono: 305-987-6543
3. Di: "Tengo preguntas sobre mi seguro umbrella"

**Esperado:**
- ✅ Bot explica: "Tu póliza Umbrella da cobertura de responsabilidad civil adicional sobre tus pólizas de auto y hogar"
- ✅ Bot menciona casos de uso:
  - Accidente grave con responsabilidad que excede límites
  - Demandas por lesiones a terceros
  - Daños a propiedad ajena
- ✅ Bot transfiere a especialista en Umbrella
- ✅ Tag <Patient> en explicación
- ✅ NO intenta procesar reclamo directamente

**Prioridad:** 🟢 MEDIA

---

### **TEST 17: Keywords P&C - Detección Correcta** 🔍

**Objetivo:** Validar que bot detecta correctamente keywords de P&C

**Variaciones a probar:**

**Escenario A - HOME:**
- "Hay un incendio en mi casa"
- "Robaron en mi hogar"
- "Se inundó mi propiedad"

**Escenario B - RENTERS:**
- "Robaron en mi apartamento"
- "Daño en mi apartamento alquilado"

**Escenario C - AUTO:**
- "Tuve un accidente con mi carro"
- "Chocaron mi vehículo"

**Esperado:**
- ✅ Bot identifica correctamente el tipo de póliza por keywords
- ✅ Bot aplica el flujo correcto (HOME vs RENTERS vs AUTO)
- ✅ Bot hace preguntas específicas del tipo de siniestro

**Prioridad:** 🟡 ALTA

---

### **TEST 18: Plazos de Reporte - Validación** ⏰

**Objetivo:** Validar que bot conoce y comunica plazos de reporte

**Casos de prueba:**

**Caso A - Siniestro AUTO reciente (< 5 días):**
- ✅ Bot NO menciona problema de plazo
- ✅ Continúa con proceso normal

**Caso B - Siniestro AUTO viejo (> 5 días):**
- Di: "Tuve un accidente hace una semana"
- ✅ Bot advierte: "Siniestros de auto deben reportarse dentro de 5 días"
- ✅ Bot continúa: "Voy a generar tu caso, pero el ajustador revisará si aplican excepciones"

**Caso C - Siniestro HOME viejo (> 10 días):**
- Di: "Hubo un incendio hace 2 semanas"
- ✅ Bot advierte: "Siniestros de hogar deben reportarse dentro de 7-10 días"
- ✅ Bot genera caso pero advierte revisión

**Esperado:**
- ✅ Bot conoce plazos: AUTO (5d), HOME (7-10d), FLOOD (60d)
- ✅ Bot advierte pero NO NIEGA servicio
- ✅ Tag <Concerned> al advertir sobre plazo

**Prioridad:** 🟡 ALTA

---

### **TEST 19: Habitabilidad y Gastos de Hotel** 🏨

**Objetivo:** Validar que bot explica cobertura de gastos de subsistencia

**Cliente MOCK:** Ana Martínez - 954-456-7890
**Póliza:** HO-2024-002345 (Homeowners con gastos subsistencia $120K)

**Pasos:**
1. Llama al IVR
2. Di: "Hubo un incendio grande, no podemos quedarnos en la casa"
3. Proporciona teléfono: 954-456-7890
4. Durante el flujo, bot debe preguntar sobre habitabilidad

**Esperado:**
- ✅ Bot pregunta: "¿Tu casa es habitable o necesitas alojamiento temporal?"
- ✅ Al responder "No es habitable", bot explica:
  - "Tu póliza incluye gastos de subsistencia (hotel, comidas)"
  - "Busca hotel y guarda TODOS los recibos"
  - "El ajustador te reembolsará"
- ✅ Tag <Enthusiastic> al dar buenas noticias de cobertura
- ✅ Tag <Patient> en instrucciones sobre recibos

**Prioridad:** 🟡 ALTA

---

### **TEST 20: Póliza Vencida - Aviso Correcto** ⚠️

**Objetivo:** Validar que bot detecta y comunica correctamente pólizas vencidas

**Cliente MOCK:** Laura Díaz - 754-222-3344
**Póliza:** HO-2023-009876 (VENCIDA desde 2024-11-30)

**Pasos:**
1. Llama al IVR
2. Proporciona teléfono: 754-222-3344
3. Bot identifica cliente

**Esperado:**
- ✅ Bot identifica póliza VENCIDA
- ✅ Bot comunica: "Laura Díaz, póliza Homeowners HO-2023-009876 VENCIDA desde 2024-11-30. SIN COBERTURA ACTUAL"
- ✅ Bot advierte: "Requiere renovación para restablecer protección"
- ✅ Tag <Disappointed> al dar mala noticia
- ✅ Si cliente reporta siniestro, bot explica que NO HAY COBERTURA
- ✅ Ofrece conectar con asesor para renovación

**Prioridad:** 🔴 CRÍTICA

---

## ✅ **CHECKLIST DE VALIDACIÓN COMPLETA**

Antes de considerar las pruebas completas:

**Tests Básicos:**
- [ ] Test 1: Acento Latino ✅
- [ ] Test 2: Velocidad (Claude Haiku) ✅
- [ ] Test 3: Tags V3 funcionando ✅
- [ ] Test 4: Retención completa ✅
- [ ] Test 5: Siniestros con heridos ✅
- [ ] Test 6: Siniestros sin heridos ✅
- [ ] Test 7: Múltiples productos ✅
- [ ] Test 8: Errores de audio ✅
- [ ] Test 9: Anti-alucinación ✅
- [ ] Test 10: Context handoff ✅

**Tests P&C (Property & Casualty):**
- [ ] Test 11: Siniestro HOME - Incendio 🔥
- [ ] Test 12: Siniestro RENTERS - Robo sin reporte policial 🚨
- [ ] Test 13: Inundación natural - SIN póliza FLOOD 💧
- [ ] Test 14: Daño por agua INTERNA - Cubierta 🚿
- [ ] Test 15: Múltiples productos P&C 🎯
- [ ] Test 16: Producto UMBRELLA - Explicación ☂️
- [ ] Test 17: Keywords P&C - Detección correcta 🔍
- [ ] Test 18: Plazos de reporte - Validación ⏰
- [ ] Test 19: Habitabilidad y gastos de hotel 🏨
- [ ] Test 20: Póliza vencida - Aviso correcto ⚠️

**Datos MOCK:**
- [ ] Clientes MOCK configurados en `tests/MOCK_DATA_PC.md`
- [ ] Backend retorna datos MOCK para pruebas P&C
- [ ] Validación de cobertura funciona con datos MOCK

**Firma:** __________________
**Fecha:** __________________

---

## 📚 **RECURSOS ADICIONALES**

- **Datos MOCK P&C:** `tests/MOCK_DATA_PC.md`
- **Prompt Expandido:** `ELEVENLABS_PROMPT_P&C_EXPANDED.txt`
- **Script de Actualización:** `scripts/update-agent-pc.sh`

---

**¿Listo para empezar? ¡Llama al +1 (754) 273-9829 y comienza las pruebas!** 📞
