/**
 * IVR Unity Financial - Flow Definition
 * Complete decision tree for the IVR system
 */

const IVR_FLOW = {
  // Initial welcome message
  WELCOME: {
    id: 'WELCOME',
    type: 'message',
    language: 'en',
    message: "Welcome to Unity Line — Great Deals. Greater Trust. Para español, marque dos.",
    displayText: "Welcome to Unity Line\nGreat Deals. Greater Trust.\n\nPara español marque 2",
    transitions: {
      '1': 'MAIN_MENU_EN',
      '2': 'MAIN_MENU_ES',
      'timeout': 'WELCOME',
      'default': 'MAIN_MENU_ES'  // Default to Spanish after welcome
    },
    icon: '🏠'
  },

  // English main menu (simplified)
  MAIN_MENU_EN: {
    id: 'MAIN_MENU_EN',
    type: 'menu',
    language: 'en',
    message: "Thank you for calling Unity Financial. For Health insurance, press 1. For Life insurance, press 2. For Property and Casualty, press 3. For Claims and Complaints, press 4. To check policy status, press 5. To speak with an agent, press 0.",
    displayText: "Main Menu (English)\n\n1 - Health Insurance\n2 - Life Insurance\n3 - Property & Casualty\n4 - Claims/Complaints\n5 - Policy Status\n0 - Speak with Agent",
    transitions: {
      '1': 'MENU_HEALTH',
      '2': 'MENU_LIFE_EN',
      '3': 'MENU_PC_EN',
      '4': 'MENU_PQRS_EN',
      '5': 'POLICY_STATUS',
      '0': 'TRANSFER_AGENT',
      '*': 'WELCOME',
      'timeout': 'MAIN_MENU_EN'
    },
    icon: '📋'
  },

  // Spanish main menu
  MAIN_MENU_ES: {
    id: 'MAIN_MENU_ES',
    type: 'menu',
    language: 'es',
    message: "Bienvenido a su aseguradora. ¿En qué podemos ayudarle hoy? Diga o digite su número de identificación, o presione: 1 para Salud, 2 para Vida, 3 para Propiedad y Accidentes, 4 para PQRS o Siniestros, 5 para consultar estado de póliza, 0 para hablar con asesor.",
    displayText: "Menú Principal\n\n1 - Salud\n2 - Vida\n3 - Propiedad y Accidentes\n4 - PQRS o Siniestros\n5 - Estado de póliza\n0 - Hablar con asesor",
    transitions: {
      '1': 'MENU_SALUD',
      '2': 'MENU_VIDA',
      '3': 'MENU_PC',
      '4': 'MENU_PQRS',
      '5': 'POLICY_STATUS',
      '0': 'TRANSFER_AGENT',
      '*': 'WELCOME',
      'timeout': 'MAIN_MENU_ES'
    },
    icon: '📋'
  },

  // Health Menu (Spanish)
  MENU_SALUD: {
    id: 'MENU_SALUD',
    type: 'menu',
    language: 'es',
    message: "Ha llegado a nuestro equipo de Salud. Presione 1 para cotización o afiliación. 2 para autorización o información. 3 para beneficios y coberturas. 4 para pagos o facturación. 5 para volver al menú anterior. 0 para hablar con asesor.",
    displayText: "Equipo de Salud\n\n1 - Cotización/Afiliación\n2 - Autorización/Información\n3 - Beneficios/Coberturas\n4 - Pagos/Facturación\n5 - Menú anterior\n0 - Hablar con asesor",
    transitions: {
      '1': 'SALUD_COTIZACION',
      '2': 'SALUD_AUTORIZACION',
      '3': 'SALUD_BENEFICIOS',
      '4': 'SALUD_PAGOS',
      '5': 'MAIN_MENU_ES',
      '0': 'TRANSFER_AGENT_SALUD',
      '*': 'MAIN_MENU_ES',
      'timeout': 'MENU_SALUD'
    },
    icon: '🏥'
  },

  // Health sub-options
  SALUD_COTIZACION: {
    id: 'SALUD_COTIZACION',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado cotización o afiliación de salud. En un momento le transferiremos con un asesor especializado que le ayudará con su solicitud. Por favor espere en línea.",
    displayText: "Salud > Cotización/Afiliación\n\n📞 Transfiriendo a asesor...",
    transitions: {
      '*': 'MENU_SALUD',
      'timeout': 'TRANSFER_AGENT_SALUD'
    },
    icon: '📝',
    action: 'transfer'
  },

  SALUD_AUTORIZACION: {
    id: 'SALUD_AUTORIZACION',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado autorización o información. Para verificar el estado de una autorización, necesitamos su número de póliza. Un asesor le atenderá en breve.",
    displayText: "Salud > Autorización/Información\n\n📞 Conectando con agente...",
    transitions: {
      '*': 'MENU_SALUD',
      'timeout': 'TRANSFER_AGENT_SALUD'
    },
    icon: '📋',
    action: 'transfer'
  },

  SALUD_BENEFICIOS: {
    id: 'SALUD_BENEFICIOS',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado beneficios y coberturas. Nuestro equipo de servicio al cliente le proporcionará información detallada sobre su plan. Espere un momento por favor.",
    displayText: "Salud > Beneficios/Coberturas\n\n📞 Transfiriendo...",
    transitions: {
      '*': 'MENU_SALUD',
      'timeout': 'TRANSFER_AGENT_SALUD'
    },
    icon: '💊',
    action: 'transfer'
  },

  SALUD_PAGOS: {
    id: 'SALUD_PAGOS',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado pagos o facturación. Para consultas sobre su estado de cuenta, puede visitar nuestro portal web o esperar para hablar con un asesor de pagos.",
    displayText: "Salud > Pagos/Facturación\n\n📞 Conectando con pagos...",
    transitions: {
      '*': 'MENU_SALUD',
      'timeout': 'TRANSFER_AGENT_SALUD'
    },
    icon: '💳',
    action: 'transfer'
  },

  // Life Menu (Spanish)
  MENU_VIDA: {
    id: 'MENU_VIDA',
    type: 'menu',
    language: 'es',
    message: "Ha llegado a nuestro equipo de Vida. Presione 1 para contratar o renovar. 2 para cambiar beneficiario o datos. 3 para información sobre su póliza. 4 para reclamaciones. 5 para volver al menú anterior. 0 para hablar con asesor.",
    displayText: "Equipo de Vida\n\n1 - Contratar/Renovar\n2 - Cambiar beneficiario\n3 - Info de póliza\n4 - Reclamaciones\n5 - Menú anterior\n0 - Hablar con asesor",
    transitions: {
      '1': 'VIDA_CONTRATAR',
      '2': 'VIDA_BENEFICIARIO',
      '3': 'VIDA_INFO',
      '4': 'VIDA_RECLAMACIONES',
      '5': 'MAIN_MENU_ES',
      '0': 'TRANSFER_AGENT_VIDA',
      '*': 'MAIN_MENU_ES',
      'timeout': 'MENU_VIDA'
    },
    icon: '💚'
  },

  // Life sub-options
  VIDA_CONTRATAR: {
    id: 'VIDA_CONTRATAR',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado contratar o renovar su seguro de vida. Un asesor especializado le atenderá para ofrecerle las mejores opciones según sus necesidades.",
    displayText: "Vida > Contratar/Renovar\n\n📞 Transfiriendo a ventas...",
    transitions: {
      '*': 'MENU_VIDA',
      'timeout': 'TRANSFER_AGENT_VIDA'
    },
    icon: '📝',
    action: 'transfer'
  },

  VIDA_BENEFICIARIO: {
    id: 'VIDA_BENEFICIARIO',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado cambiar beneficiario o actualizar datos. Este trámite requiere verificación de identidad. Un agente le guiará en el proceso.",
    displayText: "Vida > Cambio de beneficiario\n\n📞 Conectando...",
    transitions: {
      '*': 'MENU_VIDA',
      'timeout': 'TRANSFER_AGENT_VIDA'
    },
    icon: '👥',
    action: 'transfer'
  },

  VIDA_INFO: {
    id: 'VIDA_INFO',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado información sobre su póliza de vida. Puede consultar su estado en línea o esperar para hablar con un representante.",
    displayText: "Vida > Información de póliza\n\n📞 Transfiriendo...",
    transitions: {
      '*': 'MENU_VIDA',
      'timeout': 'TRANSFER_AGENT_VIDA'
    },
    icon: 'ℹ️',
    action: 'transfer'
  },

  VIDA_RECLAMACIONES: {
    id: 'VIDA_RECLAMACIONES',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado reclamaciones de vida. Lamentamos su pérdida. Un asesor especializado le guiará con sensibilidad en este proceso.",
    displayText: "Vida > Reclamaciones\n\n📞 Conectando con atención...",
    transitions: {
      '*': 'MENU_VIDA',
      'timeout': 'TRANSFER_AGENT_VIDA'
    },
    icon: '📋',
    action: 'transfer'
  },

  // Property & Casualty Menu (Spanish)
  MENU_PC: {
    id: 'MENU_PC',
    type: 'menu',
    language: 'es',
    message: "Ha llegado a nuestro equipo de Propiedad y Accidentes. Presione 1 para cotización de auto, hogar o responsabilidad civil. 2 para información de su póliza. 3 para renovar póliza. 4 para reportar siniestro. 5 para volver al menú anterior. 0 para hablar con asesor.",
    displayText: "Propiedad y Accidentes\n\n1 - Cotización\n2 - Info de póliza\n3 - Renovar póliza\n4 - Reportar siniestro\n5 - Menú anterior\n0 - Hablar con asesor",
    transitions: {
      '1': 'PC_COTIZACION',
      '2': 'PC_INFO',
      '3': 'PC_RENOVAR',
      '4': 'PC_SINIESTRO',
      '5': 'MAIN_MENU_ES',
      '0': 'TRANSFER_AGENT_PC',
      '*': 'MAIN_MENU_ES',
      'timeout': 'MENU_PC'
    },
    icon: '🏠'
  },

  // P&C sub-options
  PC_COTIZACION: {
    id: 'PC_COTIZACION',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado cotización de auto, hogar o responsabilidad civil. Nuestro equipo de ventas le ofrecerá las mejores opciones de cobertura.",
    displayText: "P&C > Cotización\n\n📞 Transfiriendo a ventas...",
    transitions: {
      '*': 'MENU_PC',
      'timeout': 'TRANSFER_AGENT_PC'
    },
    icon: '🚗',
    action: 'transfer'
  },

  PC_INFO: {
    id: 'PC_INFO',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado información de su póliza de propiedad. Un agente verificará sus datos y le proporcionará la información solicitada.",
    displayText: "P&C > Información\n\n📞 Conectando...",
    transitions: {
      '*': 'MENU_PC',
      'timeout': 'TRANSFER_AGENT_PC'
    },
    icon: 'ℹ️',
    action: 'transfer'
  },

  PC_RENOVAR: {
    id: 'PC_RENOVAR',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado renovar su póliza. Le transferiremos con un asesor que revisará sus coberturas actuales y opciones de renovación.",
    displayText: "P&C > Renovación\n\n📞 Transfiriendo...",
    transitions: {
      '*': 'MENU_PC',
      'timeout': 'TRANSFER_AGENT_PC'
    },
    icon: '🔄',
    action: 'transfer'
  },

  PC_SINIESTRO: {
    id: 'PC_SINIESTRO',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado reportar un siniestro. Es importante que tenga a mano los detalles del incidente. Un ajustador le atenderá de inmediato.",
    displayText: "P&C > Reporte de siniestro\n\n🚨 Conectando urgente...",
    transitions: {
      '*': 'MENU_PC',
      'timeout': 'TRANSFER_AGENT_PC'
    },
    icon: '🚨',
    action: 'transfer',
    priority: 'high'
  },

  // PQRS Menu (Spanish)
  MENU_PQRS: {
    id: 'MENU_PQRS',
    type: 'menu',
    language: 'es',
    message: "Ha seleccionado PQRS y trámites. Presione 1 para reportar queja o reclamación. 2 para hacer sugerencia. 3 para reportar siniestro. 5 para volver al menú anterior. 0 para hablar con asesor especializado.",
    displayText: "PQRS y Trámites\n\n1 - Queja/Reclamación\n2 - Sugerencia\n3 - Reportar siniestro\n5 - Menú anterior\n0 - Hablar con asesor",
    transitions: {
      '1': 'PQRS_QUEJA',
      '2': 'PQRS_SUGERENCIA',
      '3': 'PQRS_SINIESTRO',
      '5': 'MAIN_MENU_ES',
      '0': 'TRANSFER_AGENT_PQRS',
      '*': 'MAIN_MENU_ES',
      'timeout': 'MENU_PQRS'
    },
    icon: '📝'
  },

  // PQRS sub-options
  PQRS_QUEJA: {
    id: 'PQRS_QUEJA',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado reportar una queja o reclamación. Su opinión es muy importante para nosotros. Un asesor de calidad le atenderá para registrar su caso.",
    displayText: "PQRS > Queja/Reclamación\n\n📞 Conectando con calidad...",
    transitions: {
      '*': 'MENU_PQRS',
      'timeout': 'TRANSFER_AGENT_PQRS'
    },
    icon: '📢',
    action: 'transfer'
  },

  PQRS_SUGERENCIA: {
    id: 'PQRS_SUGERENCIA',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado hacer una sugerencia. Agradecemos su interés en ayudarnos a mejorar. Por favor espere para dejar su comentario.",
    displayText: "PQRS > Sugerencia\n\n📞 Transfiriendo...",
    transitions: {
      '*': 'MENU_PQRS',
      'timeout': 'TRANSFER_AGENT_PQRS'
    },
    icon: '💡',
    action: 'transfer'
  },

  PQRS_SINIESTRO: {
    id: 'PQRS_SINIESTRO',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado reportar un siniestro. Le transferiremos a nuestra línea de atención prioritaria para siniestros.",
    displayText: "PQRS > Siniestro\n\n🚨 Línea prioritaria...",
    transitions: {
      '*': 'MENU_PQRS',
      'timeout': 'TRANSFER_AGENT_PQRS'
    },
    icon: '🚨',
    action: 'transfer',
    priority: 'high'
  },

  // Policy Status
  POLICY_STATUS: {
    id: 'POLICY_STATUS',
    type: 'input',
    language: 'es',
    message: "Para consultar el estado de su póliza, por favor ingrese su número de identificación seguido de la tecla numeral, o presione 0 para hablar con un asesor.",
    displayText: "Estado de Póliza\n\nIngrese su identificación\nseguido de #\n\n0 - Hablar con asesor",
    transitions: {
      '0': 'TRANSFER_AGENT',
      '#': 'POLICY_STATUS_RESULT',
      '*': 'MAIN_MENU_ES',
      'timeout': 'POLICY_STATUS'
    },
    icon: '🔍'
  },

  POLICY_STATUS_RESULT: {
    id: 'POLICY_STATUS_RESULT',
    type: 'terminal',
    language: 'es',
    message: "Estamos verificando la información de su póliza. Un momento por favor mientras consultamos nuestro sistema.",
    displayText: "Consultando sistema...\n\n📋 Verificando datos...",
    transitions: {
      '*': 'MAIN_MENU_ES',
      'timeout': 'TRANSFER_AGENT'
    },
    icon: '📊',
    action: 'lookup'
  },

  // Transfer nodes
  TRANSFER_AGENT: {
    id: 'TRANSFER_AGENT',
    type: 'terminal',
    language: 'es',
    message: "En un momento le comunicaremos con uno de nuestros asesores. Por favor permanezca en línea. Su llamada es muy importante para nosotros.",
    displayText: "Transfiriendo a asesor...\n\n🎵 Música de espera\n\nTiempo estimado: 2 min",
    transitions: {},
    icon: '👤',
    action: 'transfer',
    queue: 'general'
  },

  TRANSFER_AGENT_SALUD: {
    id: 'TRANSFER_AGENT_SALUD',
    type: 'terminal',
    language: 'es',
    message: "Le transferimos con un asesor especializado en salud. Por favor espere en línea.",
    displayText: "Transfiriendo...\n\n🏥 Asesor de Salud\n\nEspere por favor...",
    transitions: {},
    icon: '👤',
    action: 'transfer',
    queue: 'health'
  },

  TRANSFER_AGENT_VIDA: {
    id: 'TRANSFER_AGENT_VIDA',
    type: 'terminal',
    language: 'es',
    message: "Le transferimos con un asesor especializado en seguros de vida. Por favor espere en línea.",
    displayText: "Transfiriendo...\n\n💚 Asesor de Vida\n\nEspere por favor...",
    transitions: {},
    icon: '👤',
    action: 'transfer',
    queue: 'life'
  },

  TRANSFER_AGENT_PC: {
    id: 'TRANSFER_AGENT_PC',
    type: 'terminal',
    language: 'es',
    message: "Le transferimos con un asesor de propiedad y accidentes. Por favor espere en línea.",
    displayText: "Transfiriendo...\n\n🏠 Asesor de P&C\n\nEspere por favor...",
    transitions: {},
    icon: '👤',
    action: 'transfer',
    queue: 'pc'
  },

  TRANSFER_AGENT_PQRS: {
    id: 'TRANSFER_AGENT_PQRS',
    type: 'terminal',
    language: 'es',
    message: "Le transferimos con un asesor de servicio al cliente. Por favor espere en línea.",
    displayText: "Transfiriendo...\n\n📝 Servicio al Cliente\n\nEspere por favor...",
    transitions: {},
    icon: '👤',
    action: 'transfer',
    queue: 'pqrs'
  },

  // Health Menu (English)
  MENU_HEALTH: {
    id: 'MENU_HEALTH',
    type: 'menu',
    language: 'en',
    message: "You've reached our Health team. Press 1 for quotes or enrollment. 2 for authorizations. 3 for benefits and coverage. 4 for billing. 5 to return to main menu. 0 to speak with an agent.",
    displayText: "Health Team\n\n1 - Quotes/Enrollment\n2 - Authorizations\n3 - Benefits/Coverage\n4 - Billing\n5 - Main Menu\n0 - Speak with Agent",
    transitions: {
      '1': 'SALUD_COTIZACION',
      '2': 'SALUD_AUTORIZACION',
      '3': 'SALUD_BENEFICIOS',
      '4': 'SALUD_PAGOS',
      '5': 'MAIN_MENU_EN',
      '0': 'TRANSFER_AGENT_SALUD',
      '*': 'MAIN_MENU_EN',
      'timeout': 'MENU_HEALTH'
    },
    icon: '🏥'
  },

  // Life Menu (English)
  MENU_LIFE_EN: {
    id: 'MENU_LIFE_EN',
    type: 'menu',
    language: 'en',
    message: "You've reached our Life insurance team. Press 1 to purchase or renew. 2 to change beneficiary. 3 for policy information. 4 for claims. 5 to return to main menu. 0 to speak with an agent.",
    displayText: "Life Insurance Team\n\n1 - Purchase/Renew\n2 - Change Beneficiary\n3 - Policy Info\n4 - Claims\n5 - Main Menu\n0 - Speak with Agent",
    transitions: {
      '1': 'VIDA_CONTRATAR',
      '2': 'VIDA_BENEFICIARIO',
      '3': 'VIDA_INFO',
      '4': 'VIDA_RECLAMACIONES',
      '5': 'MAIN_MENU_EN',
      '0': 'TRANSFER_AGENT_VIDA',
      '*': 'MAIN_MENU_EN',
      'timeout': 'MENU_LIFE_EN'
    },
    icon: '💚'
  },

  // P&C Menu (English)
  MENU_PC_EN: {
    id: 'MENU_PC_EN',
    type: 'menu',
    language: 'en',
    message: "You've reached Property and Casualty. Press 1 for auto, home, or liability quotes. 2 for policy information. 3 to renew. 4 to report a claim. 5 to return to main menu. 0 to speak with an agent.",
    displayText: "Property & Casualty\n\n1 - Get Quotes\n2 - Policy Info\n3 - Renew Policy\n4 - Report Claim\n5 - Main Menu\n0 - Speak with Agent",
    transitions: {
      '1': 'PC_COTIZACION',
      '2': 'PC_INFO',
      '3': 'PC_RENOVAR',
      '4': 'PC_SINIESTRO',
      '5': 'MAIN_MENU_EN',
      '0': 'TRANSFER_AGENT_PC',
      '*': 'MAIN_MENU_EN',
      'timeout': 'MENU_PC_EN'
    },
    icon: '🏠'
  },

  // PQRS Menu (English)
  MENU_PQRS_EN: {
    id: 'MENU_PQRS_EN',
    type: 'menu',
    language: 'en',
    message: "You've selected Customer Service. Press 1 to file a complaint. 2 to make a suggestion. 3 to report a claim. 5 to return to main menu. 0 to speak with an agent.",
    displayText: "Customer Service\n\n1 - File Complaint\n2 - Suggestion\n3 - Report Claim\n5 - Main Menu\n0 - Speak with Agent",
    transitions: {
      '1': 'PQRS_QUEJA',
      '2': 'PQRS_SUGERENCIA',
      '3': 'PQRS_SINIESTRO',
      '5': 'MAIN_MENU_EN',
      '0': 'TRANSFER_AGENT_PQRS',
      '*': 'MAIN_MENU_EN',
      'timeout': 'MENU_PQRS_EN'
    },
    icon: '📝'
  }
};

// Initial state
const IVR_INITIAL_STATE = 'WELCOME';

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { IVR_FLOW, IVR_INITIAL_STATE };
}
