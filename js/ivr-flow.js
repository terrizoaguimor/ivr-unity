/**
 * IVR Unity Financial - Flow Definition
 * Based on "Diseño Operativo IVR.docx"
 * Complete decision tree for the IVR system
 */

const IVR_FLOW = {
  // ============================================
  // WELCOME / BIENVENIDA
  // ============================================
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
      'default': 'MAIN_MENU_ES'
    },
    icon: '🏠'
  },

  // ============================================
  // MENÚ PRINCIPAL ESPAÑOL (CLIENTE ACTUAL)
  // ============================================
  MAIN_MENU_ES: {
    id: 'MAIN_MENU_ES',
    type: 'menu',
    language: 'es',
    message: "Bienvenido a su aseguradora. ¿En qué podemos ayudarle hoy? Puede decir algo como 'quiero un seguro de salud', 'tuve un accidente', 'soy cliente nuevo' o 'quiero poner una queja'. También puede digitar su número de identificación, o presionar: 1 para Salud, 2 para Vida, 3 para Propiedad y Accidentes, 4 para PQRS o Siniestros, 5 para consultar estado de póliza, 0 para hablar con asesor.",
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

  // ============================================
  // OPCIÓN 1: SALUD
  // ============================================
  MENU_SALUD: {
    id: 'MENU_SALUD',
    type: 'menu',
    language: 'es',
    message: "Usted ha llegado a nuestro equipo de Salud, por favor digite la opción que considere. Presione 1 para cotización o afiliación. 2 para autorización o información. 3 para beneficios y coberturas. 4 para pagos o facturación. 5 para volver al menú anterior. 0 para hablar con un asesor.",
    displayText: "Equipo de Salud\n\n1 - Cotización/Afiliación\n2 - Autorización/Información\n3 - Beneficios/Coberturas\n4 - Pagos/Facturación\n5 - Menú anterior\n0 - Hablar con asesor",
    transitions: {
      '1': 'SALUD_COTIZACION',
      '2': 'SALUD_AUTORIZACION',
      '3': 'SALUD_BENEFICIOS',
      '4': 'SALUD_PAGOS',
      '5': 'MAIN_MENU_ES',
      '0': 'TRANSFER_VQ_SALUD_GENERAL',
      '*': 'MAIN_MENU_ES',
      'timeout': 'MENU_SALUD'
    },
    icon: '🏥',
    queue: 'VQ_SALUD'
  },

  SALUD_COTIZACION: {
    id: 'SALUD_COTIZACION',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado cotización o afiliación de salud. En un momento le transferiremos con un asesor especializado de nuestro equipo de ventas. Por favor espere en línea.",
    displayText: "Salud > Cotización/Afiliación\n\n📞 Transfiriendo a VQ_SALUD_VENTAS\n\nAsesores: Carlos, Cristian,\nArnulfo, Homero, Hermes, Lina",
    transitions: {
      '*': 'MENU_SALUD'
    },
    icon: '📝',
    action: 'transfer',
    queue: 'VQ_SALUD_VENTAS'
  },

  SALUD_AUTORIZACION: {
    id: 'SALUD_AUTORIZACION',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado autorización o información. Un asesor de servicio le atenderá en breve para verificar su solicitud.",
    displayText: "Salud > Autorización/Info\n\n📞 Transfiriendo a VQ_SALUD_SERVICIO",
    transitions: {
      '*': 'MENU_SALUD'
    },
    icon: '📋',
    action: 'transfer',
    queue: 'VQ_SALUD_SERVICIO'
  },

  SALUD_BENEFICIOS: {
    id: 'SALUD_BENEFICIOS',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado consulta de beneficios y coberturas. Le enviaremos la información a su WhatsApp o correo electrónico registrado. Si desea hablar con un asesor, presione 0.",
    displayText: "Salud > Beneficios/Coberturas\n\n📱 AUTOATENCIÓN\nEnvío de documentos por\nWhatsApp/email\n\n0 - Hablar con asesor",
    transitions: {
      '0': 'TRANSFER_VQ_SALUD_SERVICIO',
      '*': 'MENU_SALUD',
      'timeout': 'MENU_SALUD'
    },
    icon: '💊',
    action: 'autoservice'
  },

  SALUD_PAGOS: {
    id: 'SALUD_PAGOS',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado pagos o facturación. Le transferiremos con nuestro equipo de back office para resolver su consulta.",
    displayText: "Salud > Pagos/Facturación\n\n📞 Transfiriendo a\nVQ_SALUD_BACKOFFICE",
    transitions: {
      '*': 'MENU_SALUD'
    },
    icon: '💳',
    action: 'transfer',
    queue: 'VQ_SALUD_BACKOFFICE'
  },

  // ============================================
  // OPCIÓN 2: VIDA
  // ============================================
  MENU_VIDA: {
    id: 'MENU_VIDA',
    type: 'menu',
    language: 'es',
    message: "Usted ha llegado a nuestro equipo de Vida, por favor digite la opción que considere. Presione 1 para contratar o renovar. 2 para cambiar beneficiario o datos bancarios. 3 para información sobre su póliza. 4 para reclamaciones. 5 para volver al menú anterior. 0 para hablar con un asesor.",
    displayText: "Equipo de Vida\n\n1 - Contratar/Renovar\n2 - Cambiar beneficiario\n3 - Info de póliza\n4 - Reclamaciones\n5 - Menú anterior\n0 - Hablar con asesor",
    transitions: {
      '1': 'VIDA_CONTRATAR',
      '2': 'VIDA_BENEFICIARIO',
      '3': 'VIDA_INFO',
      '4': 'VIDA_RECLAMACIONES',
      '5': 'MAIN_MENU_ES',
      '0': 'TRANSFER_VQ_VIDA_GENERAL',
      '*': 'MAIN_MENU_ES',
      'timeout': 'MENU_VIDA'
    },
    icon: '💚',
    queue: 'VQ_VIDA'
  },

  VIDA_CONTRATAR: {
    id: 'VIDA_CONTRATAR',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado contratar o renovar su seguro de vida. Un asesor especializado de ventas le atenderá para ofrecerle las mejores opciones según sus necesidades.",
    displayText: "Vida > Contratar/Renovar\n\n📞 Transfiriendo a VQ_VIDA_VENTAS\n\nAsesores: Juan, María,\nCarlos, Sebastián",
    transitions: {
      '*': 'MENU_VIDA'
    },
    icon: '📝',
    action: 'transfer',
    queue: 'VQ_VIDA_VENTAS'
  },

  VIDA_BENEFICIARIO: {
    id: 'VIDA_BENEFICIARIO',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado cambiar beneficiario o datos bancarios. Este trámite requiere verificación de identidad. Un agente de servicio le guiará en el proceso.",
    displayText: "Vida > Cambio beneficiario\n\n📞 Transfiriendo a VQ_VIDA_SERVICIO",
    transitions: {
      '*': 'MENU_VIDA'
    },
    icon: '👥',
    action: 'transfer',
    queue: 'VQ_VIDA_SERVICIO'
  },

  VIDA_INFO: {
    id: 'VIDA_INFO',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado información sobre su póliza de vida. Consultaremos su información en nuestro sistema y le enviaremos los datos a su medio de contacto registrado.",
    displayText: "Vida > Información de póliza\n\n📱 AUTOATENCIÓN\nConsulta en CRM + envío datos\n\n0 - Hablar con asesor",
    transitions: {
      '0': 'TRANSFER_VQ_VIDA_SERVICIO',
      '*': 'MENU_VIDA',
      'timeout': 'MENU_VIDA'
    },
    icon: 'ℹ️',
    action: 'autoservice'
  },

  VIDA_RECLAMACIONES: {
    id: 'VIDA_RECLAMACIONES',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado reclamaciones de vida. Lamentamos su pérdida. Un asesor especializado de nuestro equipo de servicio le guiará con sensibilidad en este proceso.",
    displayText: "Vida > Reclamaciones\n\n📞 Transfiriendo a VQ_VIDA_SERVICIO",
    transitions: {
      '*': 'MENU_VIDA'
    },
    icon: '📋',
    action: 'transfer',
    queue: 'VQ_VIDA_SERVICIO'
  },

  // ============================================
  // OPCIÓN 3: PROPIEDAD Y ACCIDENTES (P&C)
  // ============================================
  MENU_PC: {
    id: 'MENU_PC',
    type: 'menu',
    language: 'es',
    message: "Usted ha llegado a nuestro equipo de P&C, por favor digite la opción que considere. Presione 1 para cotización de auto, hogar o responsabilidad civil. 2 para información de su póliza. 3 para renovar su póliza. 4 para reportar un siniestro. 5 para volver al menú anterior. 0 para hablar con un asesor.",
    displayText: "Propiedad y Accidentes\n\n1 - Cotización Auto/Hogar/RC\n2 - Info de póliza\n3 - Renovar póliza\n4 - Reportar siniestro\n5 - Menú anterior\n0 - Hablar con asesor",
    transitions: {
      '1': 'PC_COTIZACION',
      '2': 'PC_INFO',
      '3': 'PC_RENOVAR',
      '4': 'PC_SINIESTRO',
      '5': 'MAIN_MENU_ES',
      '0': 'TRANSFER_VQ_PYC_GENERAL',
      '*': 'MAIN_MENU_ES',
      'timeout': 'MENU_PC'
    },
    icon: '🏠',
    queue: 'VQ_PYC'
  },

  PC_COTIZACION: {
    id: 'PC_COTIZACION',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado cotización de auto, hogar o responsabilidad civil. Nuestro equipo de ventas le ofrecerá las mejores opciones de cobertura.",
    displayText: "P&C > Cotización\n\n📞 Transfiriendo a VQ_PYC_VENTAS\n\nAsesores: Camila, Carlos,\nSantiago, Lidia, Mario, Margarita",
    transitions: {
      '*': 'MENU_PC'
    },
    icon: '🚗',
    action: 'transfer',
    queue: 'VQ_PYC_VENTAS'
  },

  PC_INFO: {
    id: 'PC_INFO',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado información de su póliza de propiedad. Un agente de servicio verificará sus datos y le proporcionará la información solicitada.",
    displayText: "P&C > Información\n\n📞 Transfiriendo a VQ_PYC_SERVICIO",
    transitions: {
      '*': 'MENU_PC'
    },
    icon: 'ℹ️',
    action: 'transfer',
    queue: 'VQ_PYC_SERVICIO'
  },

  PC_RENOVAR: {
    id: 'PC_RENOVAR',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado renovar su póliza. Le transferiremos con un asesor de ventas que revisará sus coberturas actuales y opciones de renovación.",
    displayText: "P&C > Renovación\n\n📞 Transfiriendo a VQ_PYC_VENTAS",
    transitions: {
      '*': 'MENU_PC'
    },
    icon: '🔄',
    action: 'transfer',
    queue: 'VQ_PYC_VENTAS'
  },

  PC_SINIESTRO: {
    id: 'PC_SINIESTRO',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado reportar un siniestro. Es importante que tenga a mano los detalles del incidente. Un ajustador de nuestra línea 24/7 le atenderá de inmediato.",
    displayText: "P&C > Reporte de siniestro\n\n🚨 VQ_PYC_SINIESTRO (7x24)\n\nConectando urgente...",
    transitions: {
      '*': 'MENU_PC'
    },
    icon: '🚨',
    action: 'transfer',
    queue: 'VQ_PYC_SINIESTRO',
    priority: 'high'
  },

  // ============================================
  // OPCIÓN 4: PQRS / SINIESTROS / TRÁMITES
  // ============================================
  MENU_PQRS: {
    id: 'MENU_PQRS',
    type: 'menu',
    language: 'es',
    message: "Ha seleccionado PQRS y trámites. Presione 1 para reportar una queja o reclamación. 2 para hacer una sugerencia. 3 para reportar un siniestro. 4 para volver al menú anterior. 0 para hablar con un asesor especializado.",
    displayText: "PQRS y Trámites\n\n1 - Queja/Reclamación\n2 - Sugerencia\n3 - Reportar siniestro\n4 - Menú anterior\n0 - Asesor especializado",
    transitions: {
      '1': 'PQRS_QUEJA',
      '2': 'PQRS_SUGERENCIA',
      '3': 'PQRS_SINIESTRO',
      '4': 'MAIN_MENU_ES',
      '5': 'MAIN_MENU_ES',
      '0': 'TRANSFER_VQ_PQRS_GENERAL',
      '*': 'MAIN_MENU_ES',
      'timeout': 'MENU_PQRS'
    },
    icon: '📝',
    queue: 'VQ_PQRS'
  },

  PQRS_QUEJA: {
    id: 'PQRS_QUEJA',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado reportar una queja o reclamación. Su opinión es muy importante para nosotros. Un especialista en PQRS le atenderá para registrar su caso.",
    displayText: "PQRS > Queja/Reclamación\n\n📞 Transfiriendo a\nVQ_PQRS_GENERAL\n\nEspecialistas PQRS",
    transitions: {
      '*': 'MENU_PQRS'
    },
    icon: '📢',
    action: 'transfer',
    queue: 'VQ_PQRS_GENERAL'
  },

  PQRS_SUGERENCIA: {
    id: 'PQRS_SUGERENCIA',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado hacer una sugerencia. Agradecemos su interés en ayudarnos a mejorar. Por favor espere para dejar su comentario con uno de nuestros especialistas.",
    displayText: "PQRS > Sugerencia\n\n📞 Transfiriendo a\nVQ_PQRS_GENERAL",
    transitions: {
      '*': 'MENU_PQRS'
    },
    icon: '💡',
    action: 'transfer',
    queue: 'VQ_PQRS_GENERAL'
  },

  PQRS_SINIESTRO: {
    id: 'PQRS_SINIESTRO',
    type: 'terminal',
    language: 'es',
    message: "Ha seleccionado reportar un siniestro. Le transferiremos a nuestra línea de atención prioritaria 24/7 para siniestros urgentes.",
    displayText: "PQRS > Siniestro\n\n🚨 VQ_SINIESTRO_URGENTE (7x24)\n\nLínea prioritaria...",
    transitions: {
      '*': 'MENU_PQRS'
    },
    icon: '🚨',
    action: 'transfer',
    queue: 'VQ_SINIESTRO_URGENTE',
    priority: 'high'
  },

  // ============================================
  // OPCIÓN 5: ESTADO DE PÓLIZA
  // ============================================
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
    message: "Estamos verificando la información de su póliza. Un momento por favor mientras consultamos nuestro sistema. Le enviaremos la información a su WhatsApp o correo registrado.",
    displayText: "Consultando sistema...\n\n📋 Verificando datos...\n📱 Envío por WhatsApp/email",
    transitions: {
      '*': 'MAIN_MENU_ES',
      'timeout': 'TRANSFER_AGENT'
    },
    icon: '📊',
    action: 'lookup'
  },

  // ============================================
  // NODOS DE TRANSFERENCIA
  // ============================================
  TRANSFER_AGENT: {
    id: 'TRANSFER_AGENT',
    type: 'terminal',
    language: 'es',
    message: "En un momento le comunicaremos con uno de nuestros asesores. Por favor permanezca en línea. Su llamada es muy importante para nosotros.",
    displayText: "Transfiriendo a asesor...\n\n🎵 Música de espera\n\nTiempo estimado: 2 min",
    transitions: {},
    icon: '👤',
    action: 'transfer',
    queue: 'VQ_GENERAL'
  },

  // Salud transfers
  TRANSFER_VQ_SALUD_GENERAL: {
    id: 'TRANSFER_VQ_SALUD_GENERAL',
    type: 'terminal',
    language: 'es',
    message: "Le transferimos con un asesor del equipo de Salud. Por favor espere en línea.",
    displayText: "Transfiriendo...\n\n🏥 VQ_SALUD_GENERAL\n\nL-V 7-19, S 8-13",
    transitions: {},
    icon: '👤',
    action: 'transfer',
    queue: 'VQ_SALUD_GENERAL'
  },

  TRANSFER_VQ_SALUD_SERVICIO: {
    id: 'TRANSFER_VQ_SALUD_SERVICIO',
    type: 'terminal',
    language: 'es',
    message: "Le transferimos con un asesor de servicio de Salud. Por favor espere en línea.",
    displayText: "Transfiriendo...\n\n🏥 VQ_SALUD_SERVICIO",
    transitions: {},
    icon: '👤',
    action: 'transfer',
    queue: 'VQ_SALUD_SERVICIO'
  },

  // Vida transfers
  TRANSFER_VQ_VIDA_GENERAL: {
    id: 'TRANSFER_VQ_VIDA_GENERAL',
    type: 'terminal',
    language: 'es',
    message: "Le transferimos con un asesor del equipo de Vida. Por favor espere en línea.",
    displayText: "Transfiriendo...\n\n💚 VQ_VIDA_GENERAL\n\nL-V 7-19, S 8-13",
    transitions: {},
    icon: '👤',
    action: 'transfer',
    queue: 'VQ_VIDA_GENERAL'
  },

  TRANSFER_VQ_VIDA_SERVICIO: {
    id: 'TRANSFER_VQ_VIDA_SERVICIO',
    type: 'terminal',
    language: 'es',
    message: "Le transferimos con un asesor de servicio de Vida. Por favor espere en línea.",
    displayText: "Transfiriendo...\n\n💚 VQ_VIDA_SERVICIO",
    transitions: {},
    icon: '👤',
    action: 'transfer',
    queue: 'VQ_VIDA_SERVICIO'
  },

  // P&C transfers
  TRANSFER_VQ_PYC_GENERAL: {
    id: 'TRANSFER_VQ_PYC_GENERAL',
    type: 'terminal',
    language: 'es',
    message: "Le transferimos con un asesor del equipo de Propiedad y Accidentes. Por favor espere en línea.",
    displayText: "Transfiriendo...\n\n🏠 VQ_PYC_GENERAL\n\nL-V 7-19, S 8-13",
    transitions: {},
    icon: '👤',
    action: 'transfer',
    queue: 'VQ_PYC_GENERAL'
  },

  // PQRS transfers
  TRANSFER_VQ_PQRS_GENERAL: {
    id: 'TRANSFER_VQ_PQRS_GENERAL',
    type: 'terminal',
    language: 'es',
    message: "Le transferimos con un especialista en PQRS. Por favor espere en línea.",
    displayText: "Transfiriendo...\n\n📝 VQ_PQRS_GENERAL\n\nEspecialistas PQRS\nL-V 7-19, S 8-13",
    transitions: {},
    icon: '👤',
    action: 'transfer',
    queue: 'VQ_PQRS_GENERAL'
  },

  // ============================================
  // ENGLISH MENUS (Simplified)
  // ============================================
  MAIN_MENU_EN: {
    id: 'MAIN_MENU_EN',
    type: 'menu',
    language: 'en',
    message: "Thank you for calling Unity Financial. For Health insurance, press 1. For Life insurance, press 2. For Property and Casualty, press 3. For Claims and Complaints, press 4. To check policy status, press 5. To speak with an agent, press 0.",
    displayText: "Main Menu (English)\n\n1 - Health Insurance\n2 - Life Insurance\n3 - Property & Casualty\n4 - Claims/Complaints\n5 - Policy Status\n0 - Speak with Agent",
    transitions: {
      '1': 'MENU_HEALTH_EN',
      '2': 'MENU_LIFE_EN',
      '3': 'MENU_PC_EN',
      '4': 'MENU_PQRS_EN',
      '5': 'POLICY_STATUS_EN',
      '0': 'TRANSFER_AGENT',
      '*': 'WELCOME',
      'timeout': 'MAIN_MENU_EN'
    },
    icon: '📋'
  },

  MENU_HEALTH_EN: {
    id: 'MENU_HEALTH_EN',
    type: 'menu',
    language: 'en',
    message: "You've reached our Health team. Press 1 for quotes or enrollment. 2 for authorizations or information. 3 for benefits and coverage. 4 for billing. 5 to return to main menu. 0 to speak with an agent.",
    displayText: "Health Team\n\n1 - Quotes/Enrollment\n2 - Authorizations\n3 - Benefits/Coverage\n4 - Billing\n5 - Main Menu\n0 - Speak with Agent",
    transitions: {
      '1': 'SALUD_COTIZACION',
      '2': 'SALUD_AUTORIZACION',
      '3': 'SALUD_BENEFICIOS',
      '4': 'SALUD_PAGOS',
      '5': 'MAIN_MENU_EN',
      '0': 'TRANSFER_VQ_SALUD_GENERAL',
      '*': 'MAIN_MENU_EN',
      'timeout': 'MENU_HEALTH_EN'
    },
    icon: '🏥'
  },

  MENU_LIFE_EN: {
    id: 'MENU_LIFE_EN',
    type: 'menu',
    language: 'en',
    message: "You've reached our Life insurance team. Press 1 to purchase or renew. 2 to change beneficiary or bank details. 3 for policy information. 4 for claims. 5 to return to main menu. 0 to speak with an agent.",
    displayText: "Life Insurance Team\n\n1 - Purchase/Renew\n2 - Change Beneficiary\n3 - Policy Info\n4 - Claims\n5 - Main Menu\n0 - Speak with Agent",
    transitions: {
      '1': 'VIDA_CONTRATAR',
      '2': 'VIDA_BENEFICIARIO',
      '3': 'VIDA_INFO',
      '4': 'VIDA_RECLAMACIONES',
      '5': 'MAIN_MENU_EN',
      '0': 'TRANSFER_VQ_VIDA_GENERAL',
      '*': 'MAIN_MENU_EN',
      'timeout': 'MENU_LIFE_EN'
    },
    icon: '💚'
  },

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
      '0': 'TRANSFER_VQ_PYC_GENERAL',
      '*': 'MAIN_MENU_EN',
      'timeout': 'MENU_PC_EN'
    },
    icon: '🏠'
  },

  MENU_PQRS_EN: {
    id: 'MENU_PQRS_EN',
    type: 'menu',
    language: 'en',
    message: "You've selected Customer Service. Press 1 to file a complaint. 2 to make a suggestion. 3 to report a claim. 4 to return to main menu. 0 to speak with an agent.",
    displayText: "Customer Service\n\n1 - File Complaint\n2 - Suggestion\n3 - Report Claim\n4 - Main Menu\n0 - Speak with Agent",
    transitions: {
      '1': 'PQRS_QUEJA',
      '2': 'PQRS_SUGERENCIA',
      '3': 'PQRS_SINIESTRO',
      '4': 'MAIN_MENU_EN',
      '5': 'MAIN_MENU_EN',
      '0': 'TRANSFER_VQ_PQRS_GENERAL',
      '*': 'MAIN_MENU_EN',
      'timeout': 'MENU_PQRS_EN'
    },
    icon: '📝'
  },

  POLICY_STATUS_EN: {
    id: 'POLICY_STATUS_EN',
    type: 'input',
    language: 'en',
    message: "To check your policy status, please enter your identification number followed by the pound key, or press 0 to speak with an agent.",
    displayText: "Policy Status\n\nEnter your ID\nfollowed by #\n\n0 - Speak with agent",
    transitions: {
      '0': 'TRANSFER_AGENT',
      '#': 'POLICY_STATUS_RESULT',
      '*': 'MAIN_MENU_EN',
      'timeout': 'POLICY_STATUS_EN'
    },
    icon: '🔍'
  }
};

// Queue definitions based on document
const IVR_QUEUES = {
  VQ_SALUD_VENTAS: {
    name: 'Salud Ventas',
    agents: ['Carlos', 'Cristian', 'Arnulfo', 'Homero', 'Hermes', 'Lina'],
    schedule: 'L-V 7-19, S 8-13'
  },
  VQ_SALUD_SERVICIO: {
    name: 'Salud Servicio',
    agents: ['Carlos', 'Cristian', 'Arnulfo', 'Homero', 'Hermes', 'Lina'],
    schedule: 'L-V 7-19, S 8-13'
  },
  VQ_SALUD_BACKOFFICE: {
    name: 'Salud Back Office',
    agents: ['Back Office Team'],
    schedule: 'L-V 7-19'
  },
  VQ_VIDA_VENTAS: {
    name: 'Vida Ventas',
    agents: ['Juan', 'María', 'Carlos', 'Sebastián'],
    schedule: 'L-V 7-19, S 8-13'
  },
  VQ_VIDA_SERVICIO: {
    name: 'Vida Servicio',
    agents: ['Juan', 'María', 'Carlos', 'Sebastián'],
    schedule: 'L-V 7-19, S 8-13'
  },
  VQ_PYC_VENTAS: {
    name: 'P&C Ventas',
    agents: ['Camila', 'Carlos', 'Santiago', 'Lidia', 'Mario', 'Margarita'],
    schedule: 'L-V 7-19, S 8-13'
  },
  VQ_PYC_SERVICIO: {
    name: 'P&C Servicio',
    agents: ['Camila', 'Carlos', 'Santiago', 'Lidia', 'Mario', 'Margarita'],
    schedule: 'L-V 7-19, S 8-13'
  },
  VQ_PYC_SINIESTRO: {
    name: 'P&C Siniestros',
    agents: ['Equipo Siniestros'],
    schedule: '7x24'
  },
  VQ_PQRS_GENERAL: {
    name: 'PQRS General',
    agents: ['Especialistas PQRS'],
    schedule: 'L-V 7-19, S 8-13'
  },
  VQ_SINIESTRO_URGENTE: {
    name: 'Siniestro Urgente',
    agents: ['Guardia Siniestros'],
    schedule: '7x24'
  }
};

// Initial state
const IVR_INITIAL_STATE = 'WELCOME';

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { IVR_FLOW, IVR_QUEUES, IVR_INITIAL_STATE };
}
