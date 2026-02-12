# Datos MOCK para Property & Casualty (P&C)

> **⚠️ IMPORTANTE:** Estos son datos de prueba mientras no hay acceso al API de P&C.
> Una vez integrado el API real, estos datos serán reemplazados.

## 📋 Clientes MOCK con Pólizas P&C

### 1. Cliente: María González (Homeowner)
```json
{
  "telefono": "3051234567",
  "nombre": "María González",
  "tipo_cliente": "cliente_pc_home",
  "poliza": {
    "tipo": "Homeowners",
    "numero": "HO-2024-001234",
    "estado": "active",
    "member_id": "HO-MG-001234",
    "direccion_asegurada": "1425 Brickell Ave, Miami, FL 33131",
    "cobertura": {
      "estructura": "$350,000",
      "contenidos": "$175,000",
      "responsabilidad_civil": "$300,000",
      "gastos_subsistencia": "$70,000"
    },
    "deducible": "$2,500",
    "prima_anual": "$1,850",
    "efectiva_desde": "2023-06-15",
    "vencimiento": "2025-06-15"
  },
  "informacion_completa": "María González, póliza Homeowners HO-2024-001234 activa. Propiedad en 1425 Brickell Ave, Miami. Cobertura estructura $350K, contenidos $175K, responsabilidad civil $300K. Deducible $2,500. Prima anual $1,850."
}
```

### 2. Cliente: Carlos Ramírez (Renter)
```json
{
  "telefono": "7863456789",
  "nombre": "Carlos Ramírez",
  "tipo_cliente": "cliente_pc_renters",
  "poliza": {
    "tipo": "Renters",
    "numero": "RN-2024-005678",
    "estado": "active",
    "member_id": "RN-CR-005678",
    "direccion_asegurada": "2800 SW 3rd Ave Apt 402, Miami, FL 33129",
    "cobertura": {
      "contenidos": "$40,000",
      "responsabilidad_civil": "$100,000",
      "gastos_subsistencia": "$12,000"
    },
    "deducible": "$500",
    "prima_anual": "$240",
    "efectiva_desde": "2024-01-10",
    "vencimiento": "2025-01-10"
  },
  "informacion_completa": "Carlos Ramírez, póliza Renters RN-2024-005678 activa. Apartamento en 2800 SW 3rd Ave Apt 402, Miami. Cobertura contenidos $40K, responsabilidad civil $100K. Deducible $500. Prima anual $240."
}
```

### 3. Cliente: Ana Martínez (Homeowner + Flood)
```json
{
  "telefono": "9544567890",
  "nombre": "Ana Martínez",
  "tipo_cliente": "cliente_pc_home_flood",
  "polizas": [
    {
      "tipo": "Homeowners",
      "numero": "HO-2024-002345",
      "estado": "active",
      "member_id": "HO-AM-002345",
      "direccion_asegurada": "555 Ocean Drive, Miami Beach, FL 33139",
      "cobertura": {
        "estructura": "$600,000",
        "contenidos": "$300,000",
        "responsabilidad_civil": "$500,000",
        "gastos_subsistencia": "$120,000"
      },
      "deducible": "$5,000",
      "prima_anual": "$4,200"
    },
    {
      "tipo": "Flood",
      "numero": "FL-2024-002345",
      "estado": "active",
      "member_id": "FL-AM-002345",
      "direccion_asegurada": "555 Ocean Drive, Miami Beach, FL 33139",
      "cobertura": {
        "estructura": "$250,000",
        "contenidos": "$100,000"
      },
      "deducible": "$2,000",
      "prima_anual": "$1,850",
      "nota": "Zona inundable. FEMA Zone AE."
    }
  ],
  "informacion_completa": "Ana Martínez, 2 pólizas. (1) Homeowners HO-2024-002345 activa, propiedad en Ocean Drive Miami Beach, cobertura estructura $600K. (2) Flood FL-2024-002345 activa, misma propiedad, cobertura $250K estructura + $100K contenidos. Zona FEMA AE."
}
```

### 4. Cliente: Roberto Torres (Auto + Home + Umbrella)
```json
{
  "telefono": "3059876543",
  "nombre": "Roberto Torres",
  "tipo_cliente": "cliente_pc_multi",
  "polizas": [
    {
      "tipo": "Auto",
      "numero": "AU-2024-007890",
      "estado": "active",
      "vehiculo": "2022 Toyota Camry - Placa ABC1234",
      "cobertura": {
        "responsabilidad_civil": "$100,000/$300,000",
        "colision": "$50,000",
        "comprensiva": "$50,000"
      },
      "deducible": "$1,000",
      "prima_anual": "$1,450"
    },
    {
      "tipo": "Homeowners",
      "numero": "HO-2024-007890",
      "estado": "active",
      "direccion_asegurada": "8900 Coral Way, Miami, FL 33165",
      "cobertura": {
        "estructura": "$450,000",
        "contenidos": "$225,000",
        "responsabilidad_civil": "$300,000"
      },
      "deducible": "$2,500",
      "prima_anual": "$2,350"
    },
    {
      "tipo": "Umbrella",
      "numero": "UM-2024-007890",
      "estado": "active",
      "cobertura": {
        "responsabilidad_adicional": "$1,000,000"
      },
      "prima_anual": "$385",
      "nota": "Cubre exceso de límites en Auto y Home"
    }
  ],
  "informacion_completa": "Roberto Torres, 3 pólizas. (1) Auto Toyota Camry 2022, cobertura completa. (2) Homeowners 8900 Coral Way, cobertura $450K. (3) Umbrella $1M responsabilidad adicional sobre Auto y Home."
}
```

### 5. Cliente: Laura Díaz (Homeowner - Póliza Vencida)
```json
{
  "telefono": "7542223344",
  "nombre": "Laura Díaz",
  "tipo_cliente": "cliente_pc_home",
  "poliza": {
    "tipo": "Homeowners",
    "numero": "HO-2023-009876",
    "estado": "expired",
    "member_id": "HO-LD-009876",
    "direccion_asegurada": "4500 SW 8th St, Miami, FL 33134",
    "cobertura": {
      "estructura": "$280,000",
      "contenidos": "$140,000",
      "responsabilidad_civil": "$300,000"
    },
    "deducible": "$2,000",
    "vencimiento": "2024-11-30",
    "nota": "Póliza vencida, sin cobertura actual"
  },
  "informacion_completa": "Laura Díaz, póliza Homeowners HO-2023-009876 VENCIDA desde 2024-11-30. SIN COBERTURA ACTUAL. Requiere renovación para restablecer protección. Propiedad en 4500 SW 8th St, Miami."
}
```

---

## 🚨 Casos de Siniestros MOCK para Pruebas

### Caso 1: Incendio en Cocina (Homeowner)
```json
{
  "claim_number": "CLM-HOME-2024-0001",
  "telefono": "3051234567",
  "cliente": "María González",
  "tipo_poliza": "Homeowners",
  "tipo_siniestro": "Incendio",
  "fecha_incidente": "2024-02-10",
  "descripcion": "Incendio en cocina causado por estufa. Daño a gabinetes, paredes y techo. Bomberos controlaron el fuego.",
  "gravedad": 7,
  "reporte_bomberos": "MFR-2024-12345",
  "habitable": false,
  "gastos_hotel": true,
  "estado": "open",
  "ajustador": "John Smith - Claims Specialist",
  "proximos_pasos": [
    "Inspección del ajustador programada para 2024-02-12",
    "Guardar todos los recibos de hotel y comidas",
    "NO entrar a la cocina hasta autorización",
    "Esperar estimado de reparación"
  ]
}
```

### Caso 2: Robo en Apartamento (Renter)
```json
{
  "claim_number": "CLM-RENT-2024-0002",
  "telefono": "7863456789",
  "cliente": "Carlos Ramírez",
  "tipo_poliza": "Renters",
  "tipo_siniestro": "Robo",
  "fecha_incidente": "2024-02-08",
  "descripcion": "Robo mientras estaba fuera. Entrada por ventana rota. Robaron laptop, TV, joyas.",
  "gravedad": 6,
  "reporte_policial": "MPD-2024-67890",
  "items_robados": [
    "MacBook Pro 2023 - Aprox $2,500",
    "TV Samsung 55\" - Aprox $800",
    "Joyas varias - Aprox $1,200",
    "PlayStation 5 - Aprox $500"
  ],
  "valor_estimado": "$5,000",
  "estado": "pending_documentation",
  "documentos_requeridos": [
    "Copia del reporte policial (OBLIGATORIO)",
    "Fotos de ventana rota",
    "Recibos o comprobantes de compra",
    "Lista detallada de items robados"
  ]
}
```

### Caso 3: Daño por Agua - Tubería Rota (Homeowner)
```json
{
  "claim_number": "CLM-HOME-2024-0003",
  "telefono": "3051234567",
  "cliente": "María González",
  "tipo_poliza": "Homeowners",
  "tipo_siniestro": "Daño por agua - Interna",
  "fecha_incidente": "2024-02-11",
  "descripcion": "Tubería rota en baño del segundo piso. Agua cayó a sala y comedor. Daño a piso, muebles y techo.",
  "gravedad": 8,
  "fuente": "Tubería PVC en baño",
  "areas_afectadas": ["Baño 2do piso", "Sala", "Comedor"],
  "habitable": true,
  "acciones_emergencia": [
    "Llave principal cerrada",
    "Plomero de emergencia llamado - $450",
    "Ventiladores industriales rentados - $200/día"
  ],
  "estado": "open",
  "cobertura_estimada": "Cubierto - daño interno por tubería",
  "proximos_pasos": [
    "Guardar recibos de plomero y ventiladores",
    "Fotos de todas las áreas dañadas",
    "No botar muebles dañados hasta inspección"
  ]
}
```

### Caso 4: Inundación Natural - NO Cubierto (Homeowner sin Flood)
```json
{
  "claim_number": "CLM-HOME-2024-0004-DENIED",
  "telefono": "7542223344",
  "cliente": "Laura Díaz",
  "tipo_poliza": "Homeowners (sin Flood)",
  "tipo_siniestro": "Inundación natural",
  "fecha_incidente": "2024-02-09",
  "descripcion": "Tormenta tropical. Agua de calle entró a la casa. Daño a piso y muebles de sala.",
  "gravedad": 5,
  "fuente": "Lluvia natural / Agua de calle",
  "estado": "denied",
  "razon_denegacion": "Póliza Homeowners NO cubre inundación natural. Requiere póliza de Flood separada.",
  "opciones": [
    "Aplicar a programa FEMA para asistencia",
    "Considerar póliza de Flood para futuro",
    "Consultar con asesor sobre opciones"
  ],
  "nota": "Cliente NO tiene póliza de Flood. Daño por agua externa NO cubierto."
}
```

### Caso 5: Daño por Tormenta - Techo (Homeowner)
```json
{
  "claim_number": "CLM-HOME-2024-0005",
  "telefono": "9544567890",
  "cliente": "Ana Martínez",
  "tipo_poliza": "Homeowners",
  "tipo_siniestro": "Viento/Tormenta",
  "fecha_incidente": "2024-02-07",
  "descripcion": "Tormenta con vientos fuertes. Daño a tejas del techo. Agua entró por techo dañado.",
  "gravedad": 6,
  "areas_afectadas": ["Techo sección norte", "Habitación principal - filtración"],
  "reparacion_emergencia": "Lona colocada en techo - $350",
  "habitable": true,
  "estado": "open",
  "cobertura_estimada": "Cubierto - daño por viento",
  "proximos_pasos": [
    "Fotos del techo dañado",
    "Guardar recibo de lona de emergencia (reembolsable)",
    "Estimado de reparación en proceso",
    "Inspección de ajustador 2024-02-14"
  ]
}
```

### Caso 6: Responsabilidad Civil - Visita Herida (Homeowner)
```json
{
  "claim_number": "CLM-HOME-2024-0006",
  "telefono": "3059876543",
  "cliente": "Roberto Torres",
  "tipo_poliza": "Homeowners (Liability)",
  "tipo_siniestro": "Responsabilidad civil",
  "fecha_incidente": "2024-02-05",
  "descripcion": "Visitante se cayó en escalera exterior. Lesión en tobillo. Reclama gastos médicos.",
  "gravedad": 5,
  "heridos": "Visitante - lesión tobillo",
  "gastos_medicos_estimados": "$8,500",
  "estado": "under_review",
  "cobertura": "Responsabilidad civil hasta $300,000",
  "nota": "Caso en revisión legal. Cliente tiene Umbrella adicional de $1M.",
  "proximos_pasos": [
    "NO discutir responsabilidad con visitante",
    "Enviar toda comunicación del visitante a claims",
    "Esperar revisión de especialista en liability"
  ]
}
```

---

## 🧪 Scripts de Prueba - Conversaciones MOCK

### Prueba 1: Incendio en Cocina (Urgente)
```
TESTER: [Llama al +1 754-273-9829]
UNITY: Bienvenido a Unity Financial Network...
TESTER: "Tengo una emergencia, hubo un incendio en mi casa"
UNITY: [Debe preguntar] "¿Todos están seguros? ¿Hay peligro inmediato?"
TESTER: "Sí, todos estamos bien. Los bomberos ya vinieron y lo controlaron"
UNITY: [Debe preguntar teléfono] "Para ayudarte mejor, ¿me das tu teléfono?"
TESTER: "305-123-4567" [María González]
UNITY: [Debe identificar cliente y continuar con flujo de incendio]
       - Preguntar tipo de daño
       - Gravedad
       - Si la casa es habitable
       - Explicar gastos de hotel cubiertos
ESPERADO: Transfer a VQ_SINIESTRO_HOME_URGENTE con contexto completo
```

### Prueba 2: Robo sin Reporte Policial (Debe insistir)
```
TESTER: "Me robaron en mi apartamento"
UNITY: [Flujo de identificación]
TESTER: "786-345-6789" [Carlos Ramírez - Renters]
UNITY: [Debe preguntar] "¿Hiciste reporte policial?"
TESTER: "No, todavía no"
UNITY: [DEBE INSISTIR] "Es URGENTE hacer el reporte. Sin él no podemos
                        procesar el reclamo. ¿Puedes llamar a la policía ahora?"
ESPERADO: Insiste en reporte policial OBLIGATORIO para robos
```

### Prueba 3: Inundación Natural - Cliente sin Flood (Debe explicar NO cobertura)
```
TESTER: "Tengo agua en mi casa por la tormenta"
UNITY: [Identificación]
TESTER: "754-222-3344" [Laura Díaz - Solo Home, sin Flood]
UNITY: [Debe preguntar] "¿El agua vino de dentro de la casa o de afuera?"
TESTER: "De la calle, entró por la puerta con la lluvia"
UNITY: [DEBE EXPLICAR] "Si el agua vino de afuera (lluvia natural), eso
                        requiere póliza de FLOOD separada. ¿Tienes seguro
                        de inundación con nosotros?"
TESTER: "No sé, solo tengo el de la casa"
UNITY: [Revisar sistema - NO tiene Flood]
       [DEBE INFORMAR] "Lamento informarte que daño por inundación natural
                        requiere póliza separada que no está incluida en
                        homeowners."
ESPERADO: Explica claramente que NO hay cobertura y ofrece conectar con asesor
```

### Prueba 4: Múltiples Productos - Priorización
```
TESTER: "Necesito ayuda"
UNITY: [Identificación]
TESTER: "305-987-6543" [Roberto Torres - Auto + Home + Umbrella]
UNITY: [Debe identificar múltiples pólizas]
       "Hola Roberto, tienes con nosotros seguros de Auto, Hogar y Umbrella.
        ¿Sobre cuál consultas hoy?"
TESTER: "El de la casa"
UNITY: [Debe continuar con flujo HOME]
ESPERADO: Identifica correctamente múltiples productos y deja elegir al cliente
```

---

## 📊 Validación de Cobertura MOCK

| Escenario | Póliza Requerida | ¿Cubierto? | Notas |
|-----------|-----------------|------------|-------|
| Incendio cocina | Homeowners | ✅ SÍ | + Gastos hotel |
| Robo apartamento | Renters | ✅ SÍ | Requiere reporte policial |
| Tubería rota (agua interna) | Homeowners | ✅ SÍ | Fuente interna cubierta |
| Inundación calle (agua externa) | Flood | ❌ NO (sin Flood) | Requiere póliza separada |
| Daño techo por viento | Homeowners | ✅ SÍ | Reparación emergencia cubierta |
| Visitante herido | Homeowners (Liability) | ✅ SÍ | Hasta límite liability |
| Daño estructura apartamento | Renters | ❌ NO | Responsabilidad del propietario |

---

## 🔄 Integración Futura con API Real

Una vez disponible el API de P&C, reemplazar:

1. **Endpoint buscar_cliente** - Conectar a API real de P&C
2. **Endpoint crear_siniestro** - POST a API de claims
3. **Validación de cobertura** - Lógica real de underwriting
4. **Números de caso** - Generados por sistema real
5. **Datos de pólizas** - Información en tiempo real

**Archivos a actualizar:**
- `/backend/src/services/elevenlabs-tools/buscar_cliente.ts`
- `/backend/src/services/elevenlabs-tools/crear_siniestro.ts`
- `/backend/src/services/elevenlabs-tools/validar_cobertura.ts`

---

✅ **Datos MOCK listos para testing**
🔜 **Pendiente integración API P&C**
