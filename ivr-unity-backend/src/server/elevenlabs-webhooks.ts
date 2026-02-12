import { Request, Response } from 'express';
import { logger } from '../utils/logger';

/**
 * MOCK DATA - Property & Casualty (P&C)
 * Datos de prueba mientras no hay acceso al API real de P&C
 */

interface PolicyMock {
  telefono: string;
  nombre: string;
  tipo_cliente: string;
  poliza?: {
    tipo: string;
    numero: string;
    estado: string;
    member_id: string;
    direccion_asegurada?: string;
    cobertura: Record<string, string>;
    deducible: string;
    prima_anual?: string;
    efectiva_desde?: string;
    vencimiento?: string;
    vehiculo?: string;
    nota?: string;
  };
  polizas?: Array<{
    tipo: string;
    numero: string;
    estado: string;
    member_id: string;
    direccion_asegurada?: string;
    vehiculo?: string;
    cobertura: Record<string, string>;
    deducible: string;
    prima_anual?: string;
    nota?: string;
  }>;
  informacion_completa: string;
}

// Clientes MOCK de P&C
const MOCK_PC_CLIENTS: Record<string, PolicyMock> = {
  // 1. María González - Homeowners
  '3051234567': {
    telefono: '3051234567',
    nombre: 'María González',
    tipo_cliente: 'cliente_pc_home',
    poliza: {
      tipo: 'Homeowners',
      numero: 'HO-2024-001234',
      estado: 'active',
      member_id: 'HO-MG-001234',
      direccion_asegurada: '1425 Brickell Ave, Miami, FL 33131',
      cobertura: {
        estructura: '$350,000',
        contenidos: '$175,000',
        responsabilidad_civil: '$300,000',
        gastos_subsistencia: '$70,000',
      },
      deducible: '$2,500',
      prima_anual: '$1,850',
      efectiva_desde: '2023-06-15',
      vencimiento: '2025-06-15',
    },
    informacion_completa:
      'María González, póliza Homeowners HO-2024-001234 activa. Propiedad en 1425 Brickell Ave, Miami. Cobertura estructura $350K, contenidos $175K, responsabilidad civil $300K, gastos subsistencia $70K. Deducible $2,500. Prima anual $1,850. Efectiva desde 2023-06-15.',
  },

  // 2. Carlos Ramírez - Renters
  '7863456789': {
    telefono: '7863456789',
    nombre: 'Carlos Ramírez',
    tipo_cliente: 'cliente_pc_renters',
    poliza: {
      tipo: 'Renters',
      numero: 'RN-2024-005678',
      estado: 'active',
      member_id: 'RN-CR-005678',
      direccion_asegurada: '2800 SW 3rd Ave Apt 402, Miami, FL 33129',
      cobertura: {
        contenidos: '$40,000',
        responsabilidad_civil: '$100,000',
        gastos_subsistencia: '$12,000',
      },
      deducible: '$500',
      prima_anual: '$240',
      efectiva_desde: '2024-01-10',
      vencimiento: '2025-01-10',
    },
    informacion_completa:
      'Carlos Ramírez, póliza Renters RN-2024-005678 activa. Apartamento en 2800 SW 3rd Ave Apt 402, Miami. Cobertura contenidos $40K, responsabilidad civil $100K, gastos subsistencia $12K. Deducible $500. Prima anual $240. Efectiva desde 2024-01-10.',
  },

  // 3. Ana Martínez - Homeowners + Flood
  '9544567890': {
    telefono: '9544567890',
    nombre: 'Ana Martínez',
    tipo_cliente: 'cliente_pc_home_flood',
    polizas: [
      {
        tipo: 'Homeowners',
        numero: 'HO-2024-002345',
        estado: 'active',
        member_id: 'HO-AM-002345',
        direccion_asegurada: '555 Ocean Drive, Miami Beach, FL 33139',
        cobertura: {
          estructura: '$600,000',
          contenidos: '$300,000',
          responsabilidad_civil: '$500,000',
          gastos_subsistencia: '$120,000',
        },
        deducible: '$5,000',
        prima_anual: '$4,200',
      },
      {
        tipo: 'Flood',
        numero: 'FL-2024-002345',
        estado: 'active',
        member_id: 'FL-AM-002345',
        direccion_asegurada: '555 Ocean Drive, Miami Beach, FL 33139',
        cobertura: {
          estructura: '$250,000',
          contenidos: '$100,000',
        },
        deducible: '$2,000',
        prima_anual: '$1,850',
        nota: 'Zona inundable. FEMA Zone AE.',
      },
    ],
    informacion_completa:
      'Ana Martínez, 2 pólizas. (1) Homeowners HO-2024-002345 activa, propiedad en 555 Ocean Drive Miami Beach, cobertura estructura $600K, contenidos $300K, responsabilidad civil $500K, gastos subsistencia $120K. (2) Flood FL-2024-002345 activa, misma propiedad, cobertura estructura $250K más contenidos $100K. Zona FEMA AE inundable.',
  },

  // 4. Roberto Torres - Auto + Home + Umbrella
  '3059876543': {
    telefono: '3059876543',
    nombre: 'Roberto Torres',
    tipo_cliente: 'cliente_pc_multi',
    polizas: [
      {
        tipo: 'Auto',
        numero: 'AU-2024-007890',
        estado: 'active',
        member_id: 'AU-RT-007890',
        vehiculo: '2022 Toyota Camry - Placa ABC1234',
        cobertura: {
          responsabilidad_civil: '$100,000/$300,000',
          colision: '$50,000',
          comprensiva: '$50,000',
        },
        deducible: '$1,000',
        prima_anual: '$1,450',
      },
      {
        tipo: 'Homeowners',
        numero: 'HO-2024-007890',
        estado: 'active',
        member_id: 'HO-RT-007890',
        direccion_asegurada: '8900 Coral Way, Miami, FL 33165',
        cobertura: {
          estructura: '$450,000',
          contenidos: '$225,000',
          responsabilidad_civil: '$300,000',
        },
        deducible: '$2,500',
        prima_anual: '$2,350',
      },
      {
        tipo: 'Umbrella',
        numero: 'UM-2024-007890',
        estado: 'active',
        member_id: 'UM-RT-007890',
        cobertura: {
          responsabilidad_adicional: '$1,000,000',
        },
        deducible: '$0',
        prima_anual: '$385',
        nota: 'Cubre exceso de límites en Auto y Home',
      },
    ],
    informacion_completa:
      'Roberto Torres, 3 pólizas activas. (1) Auto Toyota Camry 2022 placa ABC1234, cobertura completa, responsabilidad civil $100K/$300K, colisión $50K, comprensiva $50K. (2) Homeowners 8900 Coral Way Miami, cobertura estructura $450K, contenidos $225K, responsabilidad civil $300K. (3) Umbrella $1M responsabilidad adicional sobre Auto y Home.',
  },

  // 5. Laura Díaz - Homeowners VENCIDA
  '7542223344': {
    telefono: '7542223344',
    nombre: 'Laura Díaz',
    tipo_cliente: 'cliente_pc_home',
    poliza: {
      tipo: 'Homeowners',
      numero: 'HO-2023-009876',
      estado: 'expired',
      member_id: 'HO-LD-009876',
      direccion_asegurada: '4500 SW 8th St, Miami, FL 33134',
      cobertura: {
        estructura: '$280,000',
        contenidos: '$140,000',
        responsabilidad_civil: '$300,000',
      },
      deducible: '$2,000',
      vencimiento: '2024-11-30',
      nota: 'Póliza vencida, sin cobertura actual',
    },
    informacion_completa:
      'Laura Díaz, póliza Homeowners HO-2023-009876 VENCIDA desde 2024-11-30. SIN COBERTURA ACTUAL. Requiere renovación para restablecer protección. Propiedad en 4500 SW 8th St, Miami.',
  },
};

/**
 * Endpoint: GET /api/elevenlabs/buscar-cliente
 * Busca cliente por teléfono (10 dígitos)
 */
export function handleBuscarCliente(req: Request, res: Response): void {
  const { telefono } = req.query;

  logger.info('Buscando cliente P&C', { telefono });

  if (!telefono || typeof telefono !== 'string') {
    res.status(400).json({
      error: 'Parámetro telefono requerido (10 dígitos)',
    });
    return;
  }

  // Buscar en datos MOCK de P&C
  const cliente = MOCK_PC_CLIENTS[telefono];

  if (cliente) {
    logger.info('Cliente P&C encontrado', { telefono, nombre: cliente.nombre });
    res.json({
      encontrado: true,
      cliente,
    });
  } else {
    logger.info('Cliente P&C no encontrado', { telefono });
    res.json({
      encontrado: false,
      mensaje: `No se encontró cliente con teléfono ${telefono}`,
    });
  }
}

/**
 * Endpoint: POST /api/elevenlabs/guardar-contexto
 * Guarda contexto de conversación antes de transferir
 */
export function handleGuardarContexto(req: Request, res: Response): void {
  const {
    telefono,
    nombre,
    tipo_cliente,
    motivo_llamada,
    resumen_conversacion,
    datos_cliente,
    info_adicional,
  } = req.body;

  logger.info('Guardando contexto P&C', {
    telefono,
    nombre,
    tipo_cliente,
    motivo_llamada,
  });

  // Validaciones
  if (!telefono || !nombre || !motivo_llamada) {
    res.status(400).json({
      error: 'Parámetros requeridos: telefono, nombre, motivo_llamada',
    });
    return;
  }

  // En producción, esto guardaría en base de datos
  // Por ahora solo logueamos
  logger.info('Contexto guardado exitosamente', {
    telefono,
    nombre,
    tipo_cliente,
    motivo_llamada,
    resumen_conversacion,
    datos_cliente,
    info_adicional,
  });

  res.json({
    success: true,
    mensaje: 'Contexto guardado exitosamente',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Endpoint: POST /api/elevenlabs/crear-siniestro (FUTURO)
 * Crea un caso de siniestro en el sistema
 */
export function handleCrearSiniestro(req: Request, res: Response): void {
  const {
    telefono,
    tipo_poliza,
    tipo_siniestro,
    descripcion,
    fecha_incidente,
    gravedad,
  } = req.body;

  logger.info('Creando siniestro P&C (MOCK)', {
    telefono,
    tipo_poliza,
    tipo_siniestro,
  });

  // Validaciones
  if (!telefono || !tipo_poliza || !tipo_siniestro) {
    res.status(400).json({
      error: 'Parámetros requeridos: telefono, tipo_poliza, tipo_siniestro',
    });
    return;
  }

  // Generar número de caso MOCK
  const claim_number = `CLM-${tipo_poliza.toUpperCase().substring(0, 4)}-${Date.now()}`;

  logger.info('Siniestro creado (MOCK)', { claim_number });

  res.json({
    success: true,
    claim_number,
    estado: 'open',
    mensaje: 'Caso de siniestro creado exitosamente',
    proximos_pasos: [
      'El ajustador revisará tu caso en las próximas 24-48 horas',
      'Recibirás un SMS con el número de caso',
      'Guarda todos los recibos relacionados',
      'Toma fotos del daño desde varios ángulos',
    ],
    timestamp: new Date().toISOString(),
  });
}
