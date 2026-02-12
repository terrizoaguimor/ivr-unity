# 🧪 Guía de Pruebas Rápidas - P&C

## 📞 Información del IVR

- **Número:** +1 (754) 273-9829
- **Agent ID:** agent_4801kg64ffw3f4q8vdytf5j7yz85
- **Status:** ✅ Actualizado con P&C completo

---

## ⚡ 3 Tests Rápidos (5 minutos total)

### Test 1: Incendio en Hogar 🔥

**Tiempo estimado:** 2 minutos

1. **Llama:** +1 (754) 273-9829
2. **Espera saludo:** "Bienvenido a Unity Financial Network..."
3. **Di:** "Hubo un incendio en mi cocina"
4. **Bot debe preguntar:** "¿Todos están seguros? ¿Hay peligro inmediato?"
5. **Responde:** "Sí, todos estamos bien. Los bomberos ya vinieron"
6. **Bot pide teléfono:** Proporciona: **305-123-4567**
7. **Bot identifica:** "¡Hola María González! Eres cliente de Homeowners..."

**✅ Validar que el bot:**
- [x] Prioriza seguridad primero
- [x] Pregunta por bomberos
- [x] Pregunta gravedad del daño (1-10)
- [x] Pregunta si la casa es habitable
- [x] Menciona que gastos de hotel están cubiertos
- [x] Usa tag `<Concerned>` y `<Serious>`

---

### Test 2: Robo sin Reporte Policial 🚨

**Tiempo estimado:** 2 minutos

1. **Llama:** +1 (754) 273-9829
2. **Di:** "Me robaron en mi apartamento"
3. **Bot pide teléfono:** Proporciona: **786-345-6789**
4. **Bot identifica:** "¡Hola Carlos Ramírez! Eres cliente de Renters..."
5. **Cuando bot pregunte sobre reporte policial, di:** "No, todavía no"

**✅ Validar que el bot:**
- [x] **INSISTE:** "Es URGENTE hacer el reporte. Sin él no podemos procesar el reclamo"
- [x] Pregunta: "¿Puedes llamar a la policía ahora?"
- [x] Usa tag `<Serious>` al insistir
- [x] Explica diferencia Renters: NO cubre estructura, SÍ pertenencias
- [x] NO continúa con reclamo hasta confirmar reporte

---

### Test 3: Inundación sin Póliza FLOOD 💧

**Tiempo estimado:** 1 minuto

1. **Llama:** +1 (754) 273-9829
2. **Di:** "Tengo agua en mi casa por la lluvia"
3. **Bot pide teléfono:** Proporciona: **754-222-3344**
4. **Bot identifica:** "¡Hola Laura Díaz!"
5. **Bot pregunta:** "¿El agua vino de dentro de la casa o de afuera?"
6. **Responde:** "De la calle, entró por la puerta con la lluvia"

**✅ Validar que el bot:**
- [x] Pregunta fuente de agua (dentro vs afuera)
- [x] Identifica: agua de afuera = requiere póliza FLOOD
- [x] Verifica si cliente tiene Flood (no tiene)
- [x] Informa: "Lamento informarte que daño por inundación natural requiere póliza separada"
- [x] Usa tag `<Disappointed>` al dar mala noticia
- [x] **IMPORTANTE:** Menciona que la póliza está VENCIDA
- [x] Ofrece conectar con asesor

---

## 📊 Reporte de Resultados

Después de ejecutar los 3 tests, completa:

### Test 1 - Incendio:
- [ ] ✅ PASÓ | [ ] ❌ FALLÓ
- Notas: _______________________________________________

### Test 2 - Robo sin Reporte:
- [ ] ✅ PASÓ | [ ] ❌ FALLÓ
- Notas: _______________________________________________

### Test 3 - Inundación sin Flood:
- [ ] ✅ PASÓ | [ ] ❌ FALLÓ
- Notas: _______________________________________________

---

## 🔧 Si Algo Falla

### Problema: Bot no reconoce keywords de P&C

**Solución:**
1. Verifica que el agente está actualizado: `agent_4801kg64ffw3f4q8vdytf5j7yz85`
2. El prompt debe incluir keywords: "incendio", "robo casa", "inundación"
3. Llama de nuevo y usa frases exactas del script

### Problema: Bot no encuentra cliente

**Solución:**
1. Verifica que usas teléfono exacto (10 dígitos sin guiones)
2. Clientes MOCK disponibles:
   - 305-123-4567 (María González - Home)
   - 786-345-6789 (Carlos Ramírez - Renters)
   - 754-222-3344 (Laura Díaz - Home VENCIDA)

### Problema: Bot no usa tags emocionales

**Solución:**
1. Tags V3 deben estar activos
2. Escucha el tono de voz del bot (debería cambiar con tags)
3. Si no hay cambio, verifica configuración de voz en ElevenLabs

---

## 📋 Clientes MOCK Disponibles

| Teléfono | Cliente | Producto | Casos de Uso |
|----------|---------|----------|--------------|
| **305-123-4567** | María González | Homeowners | Incendio, robo, agua interna |
| **786-345-6789** | Carlos Ramírez | Renters | Robo, daños pertenencias |
| **954-456-7890** | Ana Martínez | Home + Flood | Inundación con póliza Flood |
| **305-987-6543** | Roberto Torres | Auto + Home + Umbrella | Múltiples productos |
| **754-222-3344** | Laura Díaz | Home VENCIDA | Póliza expirada |

**Ver datos completos:** `tests/MOCK_DATA_PC.md`

---

## 🎯 Tests Adicionales (Opcional)

Si los 3 tests rápidos pasaron, prueba estos:

### Test 4: Múltiples Productos
- Teléfono: 305-987-6543 (Roberto Torres)
- Di: "Necesito ayuda"
- Bot debe preguntar sobre cuál póliza (Auto, Home, o Umbrella)

### Test 5: Agua Interna vs Externa
- Teléfono: 305-123-4567 (María González)
- Di: "Tengo agua en mi casa, se rompió una tubería"
- Bot debe identificar: agua interna = CUBIERTO

### Test 6: Póliza con Flood
- Teléfono: 954-456-7890 (Ana Martínez)
- Di: "Se inundó mi casa por la lluvia"
- Bot debe verificar póliza Flood y continuar con reclamo

---

## 🚀 Próximos Pasos Después de Tests

1. ✅ Si todos los tests pasan → Ejecutar los 10 tests completos (`tests/END_TO_END_TESTS.md`)
2. ❌ Si algún test falla → Revisar logs del agente en ElevenLabs
3. 📝 Documentar cualquier comportamiento inesperado
4. 🔄 Iterar y mejorar el prompt si es necesario

---

**Fecha de creación:** 12 Feb 2026
**Versión del agente:** P&C Expansion v1.0
**Status:** ✅ Listo para testing
