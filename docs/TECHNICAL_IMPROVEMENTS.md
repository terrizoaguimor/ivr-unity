# Technical Improvements Plan - IVR Unity Backend

## 1. Enhanced Tools for ElevenLabs Agent

### Current Tools (Basic)
```typescript
// src/elevenlabs/tools.ts - CURRENT
export const tools = [
  {
    name: "transfer_call",
    description: "Transfer call to department",
    parameters: {
      department: "string",
      queue: "string"
    }
  },
  {
    name: "lookup_policy",
    description: "Get policy info",
    parameters: {
      policyNumber: "string"
    }
  },
  {
    name: "end_call",
    description: "End the call",
    parameters: {}
  }
];
```

### Enhanced Tools (Required)
```typescript
// src/elevenlabs/tools.ts - ENHANCED
export const enhancedTools = [
  // ========================================
  // POLICY MANAGEMENT
  // ========================================
  {
    name: "get_policy_full_details",
    description: "Get complete policy information including coverage, payments, beneficiaries",
    parameters: {
      type: "object",
      properties: {
        policyNumber: {
          type: "string",
          description: "Policy number"
        },
        includePayments: {
          type: "boolean",
          description: "Include payment history",
          default: true
        },
        includeBeneficiaries: {
          type: "boolean",
          description: "Include beneficiaries list",
          default: false // Security consideration
        }
      },
      required: ["policyNumber"]
    }
  },

  {
    name: "get_customer_policies",
    description: "Get all policies for a customer with priority sorting",
    parameters: {
      type: "object",
      properties: {
        phoneNumber: {
          type: "string",
          description: "Customer phone number"
        },
        includeInactive: {
          type: "boolean",
          description: "Include cancelled/expired policies",
          default: false
        }
      },
      required: ["phoneNumber"]
    }
  },

  // ========================================
  // CLAIMS MANAGEMENT
  // ========================================
  {
    name: "create_claim",
    description: "Create a new claim/siniestro report",
    parameters: {
      type: "object",
      properties: {
        policyNumber: {
          type: "string",
          description: "Policy number"
        },
        claimType: {
          type: "string",
          enum: ["auto", "health", "property", "life"],
          description: "Type of claim"
        },
        incidentDate: {
          type: "string",
          description: "Date of incident (YYYY-MM-DD)"
        },
        location: {
          type: "string",
          description: "Location where incident occurred"
        },
        severity: {
          type: "number",
          description: "Severity from 1-10",
          minimum: 1,
          maximum: 10
        },
        hasInjuries: {
          type: "boolean",
          description: "Are there any injuries?"
        },
        policeReport: {
          type: "boolean",
          description: "Was police report filed?"
        },
        description: {
          type: "string",
          description: "Brief description of incident"
        },
        thirdPartyInvolved: {
          type: "boolean",
          description: "Is there a third party involved?"
        }
      },
      required: ["policyNumber", "claimType", "incidentDate", "severity"]
    }
  },

  {
    name: "get_claim_status",
    description: "Get status of existing claim",
    parameters: {
      type: "object",
      properties: {
        claimNumber: {
          type: "string",
          description: "Claim number (SIN-XXXX-XXXXX)"
        }
      },
      required: ["claimNumber"]
    }
  },

  // ========================================
  // CONTEXT MANAGEMENT
  // ========================================
  {
    name: "save_conversation_context",
    description: "Save important context for transfer to human agent",
    parameters: {
      type: "object",
      properties: {
        intention: {
          type: "string",
          description: "Primary intention of call"
        },
        subIntention: {
          type: "string",
          description: "Secondary intention if changed"
        },
        collectedData: {
          type: "object",
          description: "All data collected during conversation"
        },
        sentiment: {
          type: "string",
          enum: ["positive", "neutral", "negative", "urgent"],
          description: "Customer sentiment"
        },
        urgency: {
          type: "string",
          enum: ["low", "medium", "high", "critical"],
          description: "Urgency level"
        },
        notes: {
          type: "string",
          description: "Additional context notes"
        }
      },
      required: ["intention", "collectedData", "sentiment", "urgency"]
    }
  },

  // ========================================
  // PAYMENT MANAGEMENT
  // ========================================
  {
    name: "get_payment_info",
    description: "Get payment information and history",
    parameters: {
      type: "object",
      properties: {
        policyNumber: {
          type: "string",
          description: "Policy number"
        },
        includeHistory: {
          type: "boolean",
          description: "Include payment history",
          default: false
        }
      },
      required: ["policyNumber"]
    }
  },

  {
    name: "generate_payment_link",
    description: "Generate secure payment link for customer",
    parameters: {
      type: "object",
      properties: {
        policyNumber: {
          type: "string",
          description: "Policy number"
        },
        amount: {
          type: "number",
          description: "Payment amount (optional for full balance)"
        },
        sendViaSMS: {
          type: "boolean",
          description: "Send link via SMS",
          default: true
        }
      },
      required: ["policyNumber"]
    }
  },

  // ========================================
  // CUSTOMER SERVICE
  // ========================================
  {
    name: "collect_beneficiary_info",
    description: "Collect beneficiary information before transfer",
    parameters: {
      type: "object",
      properties: {
        policyNumber: {
          type: "string",
          description: "Policy number"
        },
        action: {
          type: "string",
          enum: ["add", "update", "remove"],
          description: "Action to perform"
        },
        beneficiaryName: {
          type: "string",
          description: "Beneficiary full name"
        },
        relationship: {
          type: "string",
          description: "Relationship to policy holder"
        }
      },
      required: ["policyNumber", "action"]
    }
  },

  {
    name: "schedule_callback",
    description: "Schedule a callback for the customer",
    parameters: {
      type: "object",
      properties: {
        phoneNumber: {
          type: "string",
          description: "Customer phone number"
        },
        preferredDate: {
          type: "string",
          description: "Preferred date (YYYY-MM-DD)"
        },
        preferredTime: {
          type: "string",
          description: "Preferred time range (morning/afternoon/evening)"
        },
        reason: {
          type: "string",
          description: "Reason for callback"
        },
        department: {
          type: "string",
          description: "Department that should call back"
        }
      },
      required: ["phoneNumber", "reason", "department"]
    }
  },

  // ========================================
  // TRANSFER WITH CONTEXT
  // ========================================
  {
    name: "transfer_with_context",
    description: "Transfer call to agent with full context",
    parameters: {
      type: "object",
      properties: {
        department: {
          type: "string",
          enum: ["SALUD", "VIDA", "PC", "PQRS", "SINIESTRO"],
          description: "Department name"
        },
        queue: {
          type: "string",
          description: "Specific queue (VQ_XXX)"
        },
        priority: {
          type: "string",
          enum: ["low", "normal", "high", "urgent"],
          description: "Transfer priority",
          default: "normal"
        },
        reason: {
          type: "string",
          description: "Reason for transfer"
        },
        contextSummary: {
          type: "string",
          description: "Brief summary of conversation"
        },
        collectedData: {
          type: "object",
          description: "All data collected during call"
        },
        customerSentiment: {
          type: "string",
          enum: ["positive", "neutral", "frustrated", "angry", "urgent"],
          description: "Customer sentiment"
        }
      },
      required: ["department", "queue", "reason", "contextSummary"]
    }
  },

  // ========================================
  // VALIDATION & VERIFICATION
  // ========================================
  {
    name: "validate_coverage",
    description: "Check if specific event/service is covered by policy",
    parameters: {
      type: "object",
      properties: {
        policyNumber: {
          type: "string",
          description: "Policy number"
        },
        eventType: {
          type: "string",
          description: "Type of event to validate"
        },
        date: {
          type: "string",
          description: "Date of event (YYYY-MM-DD)"
        }
      },
      required: ["policyNumber", "eventType"]
    }
  },

  {
    name: "check_document_requirements",
    description: "Get list of required documents for a process",
    parameters: {
      type: "object",
      properties: {
        processType: {
          type: "string",
          enum: ["claim", "beneficiary_change", "cancellation", "renewal"],
          description: "Type of process"
        },
        policyType: {
          type: "string",
          enum: ["SALUD", "VIDA", "AUTO", "PROPERTY"],
          description: "Type of policy"
        }
      },
      required: ["processType", "policyType"]
    }
  },

  // ========================================
  // EMERGENCY HANDLING
  // ========================================
  {
    name: "escalate_emergency",
    description: "Escalate call to emergency queue immediately",
    parameters: {
      type: "object",
      properties: {
        emergencyType: {
          type: "string",
          enum: ["injury", "accident_severe", "threat", "fraud_alert"],
          description: "Type of emergency"
        },
        description: {
          type: "string",
          description: "Brief description"
        },
        requiresImmediate: {
          type: "boolean",
          description: "Requires immediate human intervention",
          default: true
        }
      },
      required: ["emergencyType", "description"]
    }
  }
];
```

## 2. Backend API Endpoints to Create

### Policy API
```typescript
// src/server/routes/policies.ts
router.get('/policies/:policyNumber', async (req, res) => {
  const { policyNumber } = req.params;
  const { includeBeneficiaries, includePayments } = req.query;

  // Call Core system API
  const policy = await coreAPI.getPolicy(policyNumber);

  // Transform to user-friendly format
  const response = {
    policyNumber,
    type: policy.lineOfBusiness,
    status: {
      internal: policy.status,
      display: mapStatusToDisplay(policy.status),
      details: getStatusDetails(policy)
    },
    coverage: {
      deductible: formatCurrency(policy.deductible),
      maxCoverage: formatCurrency(policy.maxCoverage),
      effectiveDate: formatDate(policy.effectiveDate),
      expirationDate: formatDate(policy.expirationDate)
    }
  };

  if (includePayments) {
    response.payments = await getPaymentInfo(policyNumber);
  }

  if (includeBeneficiaries && hasPermission(req, 'view_beneficiaries')) {
    response.beneficiaries = await getBeneficiaries(policyNumber);
  }

  res.json(response);
});

router.get('/customers/:phoneNumber/policies', async (req, res) => {
  const { phoneNumber } = req.params;

  const policies = await coreAPI.getPoliciesByPhone(phoneNumber);

  // Sort by priority
  const sorted = policies.sort((a, b) => {
    // Priority logic
    if (a.hasActiveClaimreturn -1;
    if (b.hasActiveClaim) return 1;
    if (a.isOverdue && !b.isOverdue) return -1;
    if (b.isOverdue && !a.isOverdue) return 1;
    return new Date(b.lastInteraction) - new Date(a.lastInteraction);
  });

  res.json({
    phoneNumber,
    totalPolicies: sorted.length,
    policies: sorted.map(mapPolicyToSummary),
    recommendedContext: sorted[0] // Top priority
  });
});
```

### Claims API
```typescript
// src/server/routes/claims.ts
router.post('/claims', async (req, res) => {
  const {
    policyNumber,
    claimType,
    incidentDate,
    location,
    severity,
    hasInjuries,
    policeReport,
    description,
    thirdPartyInvolved
  } = req.body;

  // Validate claim is within reporting period
  const policy = await coreAPI.getPolicy(policyNumber);
  const daysElapsed = daysBetween(incidentDate, new Date());
  const reportingPeriod = getReportingPeriod(claimType);

  if (daysElapsed > reportingPeriod) {
    // Late report - flag for manual review
    logger.warn('Late claim report', { policyNumber, daysElapsed, reportingPeriod });
  }

  // Create claim
  const claim = await coreAPI.createClaim({
    policyNumber,
    type: claimType,
    incidentDate,
    location,
    severity,
    hasInjuries,
    policeReportFiled: policeReport,
    description,
    thirdPartyInvolved,
    reportedDate: new Date(),
    source: 'IVR_AI',
    status: hasInjuries ? 'urgent' : 'pending',
    daysToReport: daysElapsed
  });

  // Send SMS with claim number
  await smsService.send(policy.phoneNumber, {
    template: 'claim_created',
    data: {
      claimNumber: claim.number,
      claimType,
      nextSteps: getNextSteps(claimType)
    }
  });

  res.json({
    success: true,
    claimNumber: claim.number,
    status: claim.status,
    estimatedResponseTime: getEstimatedResponseTime(claim),
    nextSteps: getNextSteps(claimType),
    emergencyContact: hasInjuries ? config.emergencyContact : null
  });
});

router.get('/claims/:claimNumber/status', async (req, res) => {
  const { claimNumber } = req.params;

  const claim = await coreAPI.getClaim(claimNumber);

  res.json({
    claimNumber,
    status: {
      internal: claim.status,
      display: mapClaimStatusToDisplay(claim.status),
      description: getClaimStatusDescription(claim)
    },
    timeline: claim.timeline,
    pendingDocuments: claim.requiredDocuments.filter(d => !d.received),
    nextAction: getNextAction(claim),
    adjusterInfo: claim.adjuster ? {
      name: claim.adjuster.name,
      phone: claim.adjuster.phone,
      email: claim.adjuster.email
    } : null
  });
});
```

### Context Management API
```typescript
// src/server/routes/context.ts
router.post('/context/save', async (req, res) => {
  const {
    callId,
    intention,
    subIntention,
    collectedData,
    sentiment,
    urgency,
    notes
  } = req.body;

  await contextStore.save(callId, {
    intention,
    subIntention,
    collectedData,
    sentiment,
    urgency,
    notes,
    timestamp: new Date()
  });

  res.json({ success: true });
});

router.get('/context/:callId', async (req, res) => {
  const { callId } = req.params;

  const context = await contextStore.get(callId);

  res.json(context);
});
```

## 3. Call Session Enhancement

```typescript
// src/bridge/call-session.ts - ENHANCED
export interface CallSession {
  id: string;
  callControlId: string;

  // Customer info
  customer: {
    phoneNumber: string;
    name?: string;
    customerId?: string;
  };

  // Policies
  policies: Array<{
    number: string;
    type: string;
    status: string;
    isPrimary: boolean; // Priority policy
  }>;

  // Conversation context
  context: {
    intentionStack: Array<{
      intention: string;
      timestamp: number;
      status: 'pending' | 'completed' | 'interrupted';
      data: Record<string, any>;
    }>;
    currentIntention: string;
    collectedData: Record<string, any>;
    sentiment: 'positive' | 'neutral' | 'negative' | 'frustrated' | 'urgent';
  };

  // Error handling
  retryCount: {
    noAudio: number;
    noUnderstanding: number;
    timeout: number;
  };

  maxRetries: {
    noAudio: 3;
    noUnderstanding: 2;
    timeout: 2;
  };

  // Metrics
  metrics: {
    startTime: Date;
    firstResponseTime?: Date;
    totalSilenceTime: number;
    totalTalkTime: number;
    transferCount: number;
  };

  // State
  status: 'ringing' | 'active' | 'streaming' | 'transferring' | 'completed' | 'failed';
}

export class CallSessionManager {
  private sessions: Map<string, CallSession> = new Map();

  async initializeSession(callControlId: string, phoneNumber: string): Promise<CallSession> {
    // Get customer policies
    const policies = await this.getPoliciesForPhone(phoneNumber);

    // Determine primary policy (highest priority)
    const primaryPolicy = this.determinePrimaryPolicy(policies);

    const session: CallSession = {
      id: uuid(),
      callControlId,
      customer: {
        phoneNumber
      },
      policies: policies.map(p => ({
        number: p.policyNumber,
        type: p.type,
        status: p.status,
        isPrimary: p.policyNumber === primaryPolicy.policyNumber
      })),
      context: {
        intentionStack: [],
        currentIntention: 'initial',
        collectedData: {},
        sentiment: 'neutral'
      },
      retryCount: {
        noAudio: 0,
        noUnderstanding: 0,
        timeout: 0
      },
      maxRetries: {
        noAudio: 3,
        noUnderstanding: 2,
        timeout: 2
      },
      metrics: {
        startTime: new Date(),
        totalSilenceTime: 0,
        totalTalkTime: 0,
        transferCount: 0
      },
      status: 'active'
    };

    this.sessions.set(callControlId, session);

    return session;
  }

  private determinePrimaryPolicy(policies: any[]): any {
    // Priority rules
    const withActiveClaim = policies.find(p => p.hasActiveClaim);
    if (withActiveClaim) return withActiveClaim;

    const overdue = policies.find(p => p.isOverdue);
    if (overdue) return overdue;

    const recentInteraction = policies.find(p =>
      p.lastInteraction && daysBetween(p.lastInteraction, new Date()) < 30
    );
    if (recentInteraction) return recentInteraction;

    // Default to first policy
    return policies[0];
  }

  updateContext(
    callControlId: string,
    updates: Partial<CallSession['context']>
  ): void {
    const session = this.sessions.get(callControlId);
    if (!session) return;

    session.context = {
      ...session.context,
      ...updates
    };
  }

  addIntention(
    callControlId: string,
    intention: string,
    data: Record<string, any> = {}
  ): void {
    const session = this.sessions.get(callControlId);
    if (!session) return;

    // Mark previous intention as interrupted if not completed
    const currentStack = session.context.intentionStack;
    if (currentStack.length > 0) {
      const last = currentStack[currentStack.length - 1];
      if (last.status === 'pending') {
        last.status = 'interrupted';
      }
    }

    // Add new intention
    session.context.intentionStack.push({
      intention,
      timestamp: Date.now(),
      status: 'pending',
      data
    });

    session.context.currentIntention = intention;
  }

  completeIntention(callControlId: string): void {
    const session = this.sessions.get(callControlId);
    if (!session) return;

    const currentStack = session.context.intentionStack;
    if (currentStack.length > 0) {
      const last = currentStack[currentStack.length - 1];
      last.status = 'completed';
    }
  }

  incrementRetry(callControlId: string, type: keyof CallSession['retryCount']): boolean {
    const session = this.sessions.get(callControlId);
    if (!session) return false;

    session.retryCount[type]++;

    return session.retryCount[type] >= session.maxRetries[type];
  }

  getContextForTransfer(callControlId: string): any {
    const session = this.sessions.get(callControlId);
    if (!session) return null;

    return {
      customer: session.customer,
      primaryPolicy: session.policies.find(p => p.isPrimary),
      allPolicies: session.policies,
      intentionHistory: session.context.intentionStack,
      currentIntention: session.context.currentIntention,
      collectedData: session.context.collectedData,
      sentiment: session.context.sentiment,
      metrics: {
        callDuration: Date.now() - session.metrics.startTime.getTime(),
        transferCount: session.metrics.transferCount
      }
    };
  }
}
```

## 4. Integration with Core System (Mock/Real)

```typescript
// src/integrations/core-api.ts
export class CoreSystemAPI {
  private baseURL: string;
  private apiKey: string;

  async getPolicy(policyNumber: string): Promise<Policy> {
    // Real implementation would call actual Core API
    if (config.nodeEnv === 'development') {
      return this.getMockPolicy(policyNumber);
    }

    const response = await fetch(`${this.baseURL}/policies/${policyNumber}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get policy: ${response.statusText}`);
    }

    return response.json();
  }

  private getMockPolicy(policyNumber: string): Policy {
    // Realistic mock data based on test file
    const mockPolicies: Record<string, Policy> = {
      '7033443365': {
        policyNumber: '7033443365',
        lineOfBusiness: 'SALUD',
        status: 'pending_activation',
        effectiveDate: '2026-02-20',
        expirationDate: '2027-02-20',
        deductible: 500,
        maxCoverage: 50000,
        planType: 'PPO',
        dependents: 2,
        phoneNumber: '7033443365',
        payments: {
          nextDue: '2026-03-01',
          amount: 150.00,
          method: 'auto_debit',
          status: 'current'
        }
      },
      // Add more mock policies from test file
    };

    return mockPolicies[policyNumber] || {
      policyNumber,
      lineOfBusiness: 'UNKNOWN',
      status: 'not_found'
    };
  }

  async getPoliciesByPhone(phoneNumber: string): Promise<Policy[]> {
    // Implementation
  }

  async createClaim(claimData: ClaimData): Promise<Claim> {
    // Implementation
  }

  async getClaim(claimNumber: string): Promise<Claim> {
    // Implementation
  }
}
```

## 5. SMS/Email Notifications

```typescript
// src/services/notifications.ts
export class NotificationService {
  async sendClaimConfirmation(phoneNumber: string, claimData: any): Promise<void> {
    const message = `
Unity Financial - Siniestro Creado

Número de caso: ${claimData.claimNumber}
Tipo: ${claimData.type}
Fecha: ${formatDate(claimData.date)}

Un ajustador lo contactará en las próximas ${claimData.estimatedResponseTime}.

Documentos requeridos:
${claimData.requiredDocuments.join('\n')}

Más info: unity.com/claims/${claimData.claimNumber}
    `.trim();

    await this.sendSMS(phoneNumber, message);
  }

  async sendPaymentLink(phoneNumber: string, paymentData: any): Promise<void> {
    const message = `
Unity Financial - Link de Pago

Póliza: ${paymentData.policyNumber}
Monto: $${paymentData.amount}

Pagar ahora: ${paymentData.paymentLink}

Vence: ${formatDate(paymentData.dueDate)}
    `.trim();

    await this.sendSMS(phoneNumber, message);
  }

  private async sendSMS(to: string, message: string): Promise<void> {
    // Use Telnyx Messaging API
    await fetch('https://api.telnyx.com/v2/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.telnyx.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: config.telnyx.phoneNumber,
        to,
        text: message
      })
    });
  }
}
```

## Implementation Priority

### Week 1-2 (Critical)
- [ ] Implement `get_policy_full_details` tool
- [ ] Implement `create_claim` tool
- [ ] Implement `save_conversation_context` tool
- [ ] Enhance CallSessionManager with context tracking
- [ ] Deploy enhanced system prompt to ElevenLabs agent

### Week 3-4 (High)
- [ ] Implement `get_customer_policies` with priority logic
- [ ] Implement `transfer_with_context` tool
- [ ] Add retry logic for audio errors
- [ ] Implement SMS notification service
- [ ] Add validation for late claim reports

### Week 5-6 (Medium)
- [ ] Implement payment link generation
- [ ] Implement beneficiary info collection
- [ ] Add callback scheduling
- [ ] Implement emergency escalation
- [ ] Add comprehensive logging and metrics
