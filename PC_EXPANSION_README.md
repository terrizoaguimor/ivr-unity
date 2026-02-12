# 🏠 Property & Casualty (P&C) Expansion

## ✅ Implementado - 12 Feb 2026

Esta expansión agrega soporte completo para productos de **Property & Casualty** al agente de Unity Financial Network.

---

## 📦 **Productos P&C Incluidos**

1. **AUTO** - Seguros de vehículos (ya existente, mejorado)
2. **HOME** - Propietarios (Homeowners Insurance) **NUEVO**
3. **RENTERS** - Inquilinos (Renters Insurance) **NUEVO**
4. **FLOOD** - Inundación (Flood Insurance) **NUEVO**
5. **UMBRELLA** - Responsabilidad civil extendida **NUEVO**

---

## 🚀 **Cómo Actualizar el Agente**

### Opción 1: Script Automático (Recomendado)

```bash
# Desde la raíz del proyecto
ELEVENLABS_API_KEY=tu_api_key ./scripts/update-agent-pc.sh
```

Este script:
- ✅ Lee el prompt expandido de `ELEVENLABS_PROMPT_P&C_EXPANDED.txt`
- ✅ Actualiza el agente `agent_4801kg64ffw3f4q8vdytf5j7yz85`
- ✅ Verifica la actualización

### Opción 2: Manual desde Dashboard

1. Ve a: https://elevenlabs.io/app/conversational-ai/agents
2. Selecciona el agente: `agent_4801kg64ffw3f4q8vdytf5j7yz85`
3. Copia el contenido de `ELEVENLABS_PROMPT_P&C_EXPANDED.txt`
4. Pégalo en la sección "System Prompt"
5. Guarda los cambios

---

## 🧪 **Datos MOCK para Pruebas**

⚠️ **IMPORTANTE:** Mientras no haya acceso al API de P&C, el sistema usa datos MOCK.

### Clientes de Prueba

Ver archivo completo: `tests/MOCK_DATA_PC.md`

| Teléfono | Cliente | Productos |
|----------|---------|-----------|
| 305-123-4567 | María González | Homeowners activa |
| 786-345-6789 | Carlos Ramírez | Renters activa |
| 954-456-7890 | Ana Martínez | Homeowners + Flood |
| 305-987-6543 | Roberto Torres | Auto + Home + Umbrella |
| 754-222-3344 | Laura Díaz | Homeowners VENCIDA |

### Casos de Siniestros MOCK

1. **CLM-HOME-2024-0001** - Incendio en cocina (María González)
2. **CLM-RENT-2024-0002** - Robo en apartamento (Carlos Ramírez)
3. **CLM-HOME-2024-0003** - Tubería rota (María González)
4. **CLM-HOME-2024-0004** - Inundación NO cubierta (Laura Díaz)
5. **CLM-HOME-2024-0005** - Daño por tormenta (Ana Martínez)
6. **CLM-HOME-2024-0006** - Responsabilidad civil (Roberto Torres)

---

## 🎯 **Nuevos Flujos Implementados**

### 1. Siniestros HOME (Hogar)

**Keywords:** incendio, robo casa, robo hogar, daño casa, inundación casa, vandalismo, ventana rota, puerta rota, agua en casa

**Tipos de daño cubiertos:**
- ✅ **Incendio/Fuego** - Prioriza seguridad, pregunta por bomberos, habitabilidad
- ✅ **Robo/Vandalismo** - INSISTE en reporte policial (OBLIGATORIO)
- ✅ **Agua Interna** - Tubería, lavadora, calentador (CUBIERTO)
- ❌ **Agua Externa** - Lluvia natural, río (requiere póliza FLOOD separada)
- ✅ **Viento/Tormenta/Granizo** - Daño a techo, ventanas, estructura

**Preguntas específicas:**
1. Seguridad y peligro inmediato
2. Tipo de daño
3. Gravedad 1-10
4. Habitabilidad (¿necesita hotel?)
5. Reporte de autoridades (bomberos/policía)

**Coberturas mencionadas:**
- Estructura de la vivienda
- Contenidos personales
- Gastos de subsistencia (hotel, comidas)
- Reparaciones de emergencia

### 2. Siniestros RENTERS (Inquilinos)

**Diferencias vs Homeowners:**
- ❌ NO cubre estructura del edificio
- ✅ SÍ cubre pertenencias personales
- ✅ SÍ cubre responsabilidad civil
- ✅ SÍ cubre gastos de hotel

**Validación especial:**
- Bot pregunta si el daño es a **pertenencias** o a **estructura**
- Si es estructura → explica que es responsabilidad del propietario
- Si es pertenencias → continúa con reclamo

### 3. Siniestros FLOOD (Inundación)

**Validación crítica:**
- Bot pregunta: **"¿El agua vino de dentro de la casa o de afuera?"**
  - **DENTRO** (tubería, lavadora) → Cubierto por Homeowners
  - **AFUERA** (lluvia, río, calle) → Requiere póliza FLOOD separada

**Si cliente NO tiene FLOOD:**
- Bot explica: "Daño por inundación natural requiere póliza separada"
- Ofrece conectar con asesor
- Menciona programa FEMA si aplica

### 4. Producto UMBRELLA

**Explicación del bot:**
- "Tu póliza Umbrella da cobertura de responsabilidad civil **adicional** sobre tus pólizas de auto y hogar"

**Casos de uso:**
- Accidente grave con responsabilidad que excede límites de auto/home
- Demandas por lesiones a terceros
- Daños a propiedad ajena

**Acción:**
- Bot NO procesa reclamos Umbrella directamente
- Transfiere a especialista en Umbrella

---

## ⏰ **Plazos de Reporte**

El bot conoce y comunica estos plazos:

| Producto | Plazo | Acción del Bot |
|----------|-------|----------------|
| AUTO | 5 días | Advierte si > 5 días, continúa con caso |
| HOME | 7-10 días | Advierte si > 10 días, genera caso con nota |
| RENTERS | 7-10 días | Advierte si > 10 días |
| FLOOD | 60 días | Plazo FEMA, advierte |
| ROBO | Inmediato | INSISTE en reporte policial OBLIGATORIO |

---

## 🔍 **Keywords Detectadas**

### HOME:
- incendio, fuego, quemado
- robo casa, robo hogar
- agua en casa, inundación casa
- ventana rota, puerta rota, vandalismo
- tormenta, viento, granizo, árbol caído

### RENTERS:
- robo apartamento
- daño apartamento
- incendio apartamento
- alquilado, inquilino, renta

### FLOOD:
- inundación, agua de lluvia
- desborde río, agua de calle
- agua de afuera

### AUTO:
- accidente, choque, colisión
- daño auto, daño carro
- robo auto, robo vehículo

### UMBRELLA:
- paraguas, umbrella
- responsabilidad adicional
- cobertura extendida

---

## 📊 **Tests End-to-End**

Se agregaron **10 nuevos tests** para P&C:

- Test 11: Siniestro HOME - Incendio 🔥
- Test 12: Siniestro RENTERS - Robo sin reporte policial 🚨
- Test 13: Inundación natural - SIN póliza FLOOD 💧
- Test 14: Daño por agua INTERNA - Cubierta 🚿
- Test 15: Múltiples productos P&C 🎯
- Test 16: Producto UMBRELLA - Explicación ☂️
- Test 17: Keywords P&C - Detección correcta 🔍
- Test 18: Plazos de reporte - Validación ⏰
- Test 19: Habitabilidad y gastos de hotel 🏨
- Test 20: Póliza vencida - Aviso correcto ⚠️

**Ver tests completos:** `tests/END_TO_END_TESTS.md`

---

## 🔄 **Integración Futura con API Real**

Cuando el API de P&C esté disponible, actualizar:

### Backend - Tools de ElevenLabs

1. **`buscar_cliente.ts`**
   ```typescript
   // Agregar endpoint para obtener pólizas P&C
   const pcPolicies = await fetch(`${PC_API_URL}/policies/${phone}`);
   ```

2. **`crear_siniestro.ts`**
   ```typescript
   // POST a API real de claims P&C
   const claim = await fetch(`${PC_API_URL}/claims`, {
     method: 'POST',
     body: JSON.stringify({
       policy_number,
       claim_type,
       incident_date,
       description,
       severity
     })
   });
   ```

3. **`validar_cobertura.ts`** (NUEVO)
   ```typescript
   // Validar cobertura en tiempo real
   const coverage = await fetch(`${PC_API_URL}/coverage/validate`, {
     method: 'POST',
     body: JSON.stringify({
       policy_number,
       incident_type,
       incident_details
     })
   });
   ```

### Variables de Entorno

Agregar a `.env`:
```bash
PC_API_URL=https://api.pc-provider.com/v1
PC_API_KEY=your_pc_api_key
```

### Migración de Datos MOCK a Real

1. Remover datos hardcoded de `tests/MOCK_DATA_PC.md`
2. Conectar endpoints reales
3. Actualizar validaciones de cobertura
4. Generar números de caso reales
5. Integrar con sistema de ajustadores

---

## 📁 **Archivos Creados/Modificados**

### Nuevos Archivos:
- ✅ `ELEVENLABS_PROMPT_P&C_EXPANDED.txt` - Prompt completo con P&C
- ✅ `tests/MOCK_DATA_PC.md` - Datos de prueba para P&C
- ✅ `scripts/update-agent-pc.sh` - Script de actualización del agente
- ✅ `PC_EXPANSION_README.md` - Este archivo

### Archivos Modificados:
- ✅ `tests/END_TO_END_TESTS.md` - Agregados tests 11-20 para P&C

---

## ✨ **Mejoras Implementadas**

1. **Validación de Cobertura Inteligente**
   - Bot distingue entre agua interna (cubierta) vs externa (flood)
   - Bot identifica si cliente tiene múltiples pólizas P&C
   - Bot valida plazos de reporte automáticamente

2. **Flujos Específicos por Producto**
   - HOME tiene 4 sub-flujos (incendio, robo, agua, tormenta)
   - RENTERS valida estructura vs pertenencias
   - FLOOD valida póliza separada

3. **Instrucciones de Emergencia**
   - Incendio: NO entrar hasta autorización de bomberos
   - Agua interna: Cerrar llave principal, cortar electricidad
   - Tormenta: Reparaciones de emergencia cubiertas

4. **Gastos de Subsistencia**
   - Bot pregunta habitabilidad
   - Explica cobertura de hotel y comidas
   - Instruye guardar TODOS los recibos

5. **Reporte Policial Obligatorio**
   - Para ROBO: Bot INSISTE en reporte policial
   - Explica que sin reporte NO se puede procesar reclamo
   - Usa tag <Serious> para enfatizar importancia

---

## 🎯 **Métricas Esperadas**

Con la expansión de P&C:

| Métrica | Antes | Después (Esperado) |
|---------|-------|-------------------|
| Productos cubiertos | 3 (Salud, Vida, Suplementarios) | 8 (+ Auto, Home, Renters, Flood, Umbrella) |
| Tipos de siniestros | 1 (Auto básico) | 6 (Auto, Incendio, Robo, Agua, Tormenta, Flood) |
| FCR (First Call Resolution) | 40% | 55% (+ validaciones inteligentes) |
| AHT (Average Handling Time) | 4-5 min | 4-5 min (mantenido) |
| CSAT (Customer Satisfaction) | 4.3/5 | 4.6/5 (+ claridad en coberturas) |

---

## 🚨 **Notas Importantes**

1. **Datos MOCK Activos**
   - Todos los clientes de prueba están en `tests/MOCK_DATA_PC.md`
   - Backend debe retornar estos datos hasta integración con API real

2. **Validaciones Críticas**
   - Agua interna vs externa (cobertura diferente)
   - Reporte policial OBLIGATORIO para robos
   - Póliza FLOOD separada de Homeowners
   - Renters NO cubre estructura

3. **Transfer Apropiado**
   - HOME urgente: severidad >= 8 o no habitable
   - UMBRELLA: siempre a especialista
   - Flood sin póliza: a asesor para opciones

4. **Tags V3 Usados**
   - `<Concerned>` - Siniestros en general
   - `<Serious>` - Seguridad, peligro, reporte policial
   - `<Patient>` - Instrucciones, explicaciones de cobertura
   - `<Disappointed>` - Mala noticia (no cubierto, póliza vencida)
   - `<Enthusiastic>` - Buena noticia (gastos hotel cubiertos)

---

## 📞 **Contacto de Prueba**

**Número IVR:** +1 (754) 273-9829
**Agent ID:** agent_4801kg64ffw3f4q8vdytf5j7yz85

---

## ✅ **Checklist de Implementación**

- [x] Prompt expandido creado
- [x] Datos MOCK documentados
- [x] Script de actualización creado
- [x] Tests end-to-end agregados (10 nuevos)
- [x] README de expansión creado
- [ ] Agente actualizado en producción (requiere API key)
- [ ] Backend configurado para retornar datos MOCK
- [ ] Tests ejecutados y validados
- [ ] Integración con API real de P&C (pendiente acceso)

---

**Implementado por:** Claude Code
**Fecha:** 12 Feb 2026
**Status:** ✅ Listo para testing con datos MOCK
