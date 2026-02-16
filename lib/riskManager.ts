// Risk Manager - ERP Integration & AI Risk Analysis
// Integrates with Buildium (Multifamily) and Motive (Fleet/Logistics)

import { RiskFactor, InsuranceLead } from './firebase';

// ============ TYPES ============

export interface ERPConnection {
  type: 'buildium' | 'motive';
  apiKey?: string;
  apiSecret?: string;
  baseUrl: string;
  connected: boolean;
  lastSync?: Date;
}

export interface BuildiumProperty {
  id: string;
  name: string;
  address: string;
  units: number;
  yearBuilt: number;
  propertyType: string;
  occupancyRate: number;
  maintenanceRequests: MaintenanceRequest[];
  inspections: Inspection[];
  claims: PropertyClaim[];
}

export interface MaintenanceRequest {
  id: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: string;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface Inspection {
  id: string;
  type: string;
  date: Date;
  score: number;
  issues: string[];
}

export interface PropertyClaim {
  date: Date;
  type: string;
  amount: number;
  status: string;
}

export interface MotiveVehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  safetyScore: number;
  driver: DriverInfo;
  events: SafetyEvent[];
  maintenance: VehicleMaintenance[];
}

export interface DriverInfo {
  id: string;
  name: string;
  licenseClass: string;
  safetyScore: number;
  hoursThisWeek: number;
  violations: Violation[];
}

export interface Violation {
  type: string;
  date: Date;
  severity: string;
}

export interface SafetyEvent {
  type: 'harsh_brake' | 'harsh_acceleration' | 'speeding' | 'distraction' | 'collision' | 'near_miss';
  date: Date;
  severity: 'low' | 'medium' | 'high';
  location?: { lat: number; lng: number };
}

export interface VehicleMaintenance {
  type: string;
  date: Date;
  cost: number;
  nextDue?: Date;
}

export interface RiskAssessment {
  overallScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  factors: RiskFactor[];
  recommendations: string[];
  premiumMultiplier: number;
  underwritingNotes: string;
  generatedAt: Date;
  llmUsed?: string;
}

// ============ ERP CONNECTION HANDLERS ============

export class BuildiumConnector {
  private baseUrl: string;
  private apiKey: string;

  constructor(apiKey: string, baseUrl: string = 'https://api.buildium.com/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async testConnection(): Promise<boolean> {
    // In production, make actual API call
    // For now, simulate connection test
    return true;
  }

  async getProperties(): Promise<BuildiumProperty[]> {
    // Mock data - replace with actual Buildium API calls
    return [
      {
        id: 'prop-001',
        name: 'Sunset Apartments',
        address: '123 Main St, Anytown, USA',
        units: 48,
        yearBuilt: 1985,
        propertyType: 'apartment',
        occupancyRate: 0.94,
        maintenanceRequests: [
          { id: 'm1', type: 'plumbing', priority: 'high', status: 'open', createdAt: new Date() },
          { id: 'm2', type: 'electrical', priority: 'medium', status: 'completed', createdAt: new Date(), resolvedAt: new Date() }
        ],
        inspections: [
          { id: 'i1', type: 'fire_safety', date: new Date(), score: 85, issues: ['Exit sign needs replacement'] }
        ],
        claims: [
          { date: new Date('2024-06-15'), type: 'water_damage', amount: 15000, status: 'paid' }
        ]
      }
    ];
  }

  async getPropertyRiskData(propertyId: string): Promise<Partial<BuildiumProperty>> {
    const properties = await this.getProperties();
    return properties.find(p => p.id === propertyId) || {};
  }
}

export class MotiveConnector {
  private baseUrl: string;
  private apiKey: string;

  constructor(apiKey: string, baseUrl: string = 'https://api.gomotive.com/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async testConnection(): Promise<boolean> {
    return true;
  }

  async getVehicles(): Promise<MotiveVehicle[]> {
    // Mock data - replace with actual Motive API calls
    return [
      {
        id: 'v-001',
        vin: '1HGBH41JXMN109186',
        make: 'Freightliner',
        model: 'Cascadia',
        year: 2022,
        mileage: 145000,
        safetyScore: 78,
        driver: {
          id: 'd-001',
          name: 'John Smith',
          licenseClass: 'A',
          safetyScore: 82,
          hoursThisWeek: 48,
          violations: []
        },
        events: [
          { type: 'harsh_brake', date: new Date(), severity: 'medium' },
          { type: 'speeding', date: new Date(), severity: 'low' }
        ],
        maintenance: [
          { type: 'oil_change', date: new Date(), cost: 450, nextDue: new Date('2025-04-01') }
        ]
      }
    ];
  }

  async getFleetSafetyScore(): Promise<number> {
    const vehicles = await this.getVehicles();
    const avgScore = vehicles.reduce((sum, v) => sum + v.safetyScore, 0) / vehicles.length;
    return Math.round(avgScore);
  }

  async getDrivers(): Promise<DriverInfo[]> {
    const vehicles = await this.getVehicles();
    return vehicles.map(v => v.driver);
  }
}

// ============ RISK ANALYSIS ENGINE ============

export class RiskAnalyzer {
  private llm: 'cerebras' | 'gpt-4' | 'claude-3' | 'gemini' | 'groq';

  constructor(llm: 'cerebras' | 'gpt-4' | 'claude-3' | 'gemini' | 'groq' = 'claude-3') {
    this.llm = llm;
  }

  async analyzeMultifamilyRisk(properties: BuildiumProperty[]): Promise<RiskAssessment> {
    const factors: RiskFactor[] = [];
    let totalScore = 100;

    for (const property of properties) {
      // Age risk
      const age = new Date().getFullYear() - property.yearBuilt;
      if (age > 30) {
        const ageFactor: RiskFactor = {
          category: 'Property Age',
          factor: `Building is ${age} years old`,
          severity: age > 50 ? 'high' : 'medium',
          score: age > 50 ? 15 : 10,
          details: 'Older buildings have higher maintenance needs and potential code compliance issues'
        };
        factors.push(ageFactor);
        totalScore -= ageFactor.score;
      }

      // Maintenance backlog risk
      const openMaintenance = property.maintenanceRequests.filter(m => m.status === 'open');
      const highPriorityOpen = openMaintenance.filter(m => m.priority === 'high' || m.priority === 'emergency');
      if (highPriorityOpen.length > 0) {
        const maintFactor: RiskFactor = {
          category: 'Maintenance',
          factor: `${highPriorityOpen.length} high-priority maintenance requests pending`,
          severity: highPriorityOpen.length > 3 ? 'critical' : 'high',
          score: highPriorityOpen.length * 5,
          details: 'Deferred maintenance increases liability and property damage risk'
        };
        factors.push(maintFactor);
        totalScore -= maintFactor.score;
      }

      // Inspection score risk
      const recentInspections = property.inspections.filter(
        i => new Date().getTime() - i.date.getTime() < 365 * 24 * 60 * 60 * 1000
      );
      for (const inspection of recentInspections) {
        if (inspection.score < 80) {
          const inspFactor: RiskFactor = {
            category: 'Inspection',
            factor: `${inspection.type} inspection scored ${inspection.score}/100`,
            severity: inspection.score < 60 ? 'critical' : 'high',
            score: Math.round((100 - inspection.score) / 5),
            details: `Issues: ${inspection.issues.join(', ')}`
          };
          factors.push(inspFactor);
          totalScore -= inspFactor.score;
        }
      }

      // Claims history risk
      const recentClaims = property.claims.filter(
        c => new Date().getTime() - c.date.getTime() < 3 * 365 * 24 * 60 * 60 * 1000
      );
      if (recentClaims.length > 2) {
        const claimsFactor: RiskFactor = {
          category: 'Claims History',
          factor: `${recentClaims.length} claims in past 3 years`,
          severity: recentClaims.length > 5 ? 'critical' : 'high',
          score: recentClaims.length * 5,
          details: `Total claims amount: $${recentClaims.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}`
        };
        factors.push(claimsFactor);
        totalScore -= claimsFactor.score;
      }

      // Occupancy risk
      if (property.occupancyRate < 0.85) {
        const occFactor: RiskFactor = {
          category: 'Occupancy',
          factor: `Occupancy rate is ${(property.occupancyRate * 100).toFixed(1)}%`,
          severity: property.occupancyRate < 0.7 ? 'high' : 'medium',
          score: Math.round((0.95 - property.occupancyRate) * 20),
          details: 'Low occupancy may indicate property condition issues or market problems'
        };
        factors.push(occFactor);
        totalScore -= occFactor.score;
      }
    }

    totalScore = Math.max(0, Math.min(100, totalScore));

    return {
      overallScore: totalScore,
      riskLevel: this.scoreToRiskLevel(totalScore),
      factors,
      recommendations: this.generateRecommendations(factors),
      premiumMultiplier: this.calculatePremiumMultiplier(totalScore),
      underwritingNotes: await this.generateUnderwritingNotes(factors),
      generatedAt: new Date(),
      llmUsed: this.llm
    };
  }

  async analyzeFleetRisk(vehicles: MotiveVehicle[]): Promise<RiskAssessment> {
    const factors: RiskFactor[] = [];
    let totalScore = 100;

    // Fleet-wide safety score
    const avgSafetyScore = vehicles.reduce((sum, v) => sum + v.safetyScore, 0) / vehicles.length;
    if (avgSafetyScore < 80) {
      const safetyFactor: RiskFactor = {
        category: 'Fleet Safety',
        factor: `Average fleet safety score is ${avgSafetyScore.toFixed(1)}`,
        severity: avgSafetyScore < 60 ? 'critical' : avgSafetyScore < 70 ? 'high' : 'medium',
        score: Math.round((80 - avgSafetyScore) / 2),
        details: 'Low safety scores indicate higher accident probability'
      };
      factors.push(safetyFactor);
      totalScore -= safetyFactor.score;
    }

    // Individual vehicle analysis
    for (const vehicle of vehicles) {
      // High-risk safety events
      const highRiskEvents = vehicle.events.filter(e => e.severity === 'high');
      if (highRiskEvents.length > 2) {
        const eventFactor: RiskFactor = {
          category: 'Safety Events',
          factor: `Vehicle ${vehicle.id} has ${highRiskEvents.length} high-severity events`,
          severity: 'high',
          score: highRiskEvents.length * 3,
          details: `Events: ${highRiskEvents.map(e => e.type).join(', ')}`
        };
        factors.push(eventFactor);
        totalScore -= eventFactor.score;
      }

      // Driver violations
      if (vehicle.driver.violations.length > 0) {
        const violationFactor: RiskFactor = {
          category: 'Driver Violations',
          factor: `Driver ${vehicle.driver.name} has ${vehicle.driver.violations.length} violations`,
          severity: vehicle.driver.violations.length > 2 ? 'critical' : 'high',
          score: vehicle.driver.violations.length * 5,
          details: `Violations: ${vehicle.driver.violations.map(v => v.type).join(', ')}`
        };
        factors.push(violationFactor);
        totalScore -= violationFactor.score;
      }

      // HOS compliance (hours of service)
      if (vehicle.driver.hoursThisWeek > 60) {
        const hosFactor: RiskFactor = {
          category: 'HOS Compliance',
          factor: `Driver ${vehicle.driver.name} has ${vehicle.driver.hoursThisWeek} hours this week`,
          severity: vehicle.driver.hoursThisWeek > 70 ? 'critical' : 'high',
          score: Math.round((vehicle.driver.hoursThisWeek - 60) / 2),
          details: 'Exceeding hours of service limits increases fatigue-related accident risk'
        };
        factors.push(hosFactor);
        totalScore -= hosFactor.score;
      }

      // Vehicle age/mileage
      const vehicleAge = new Date().getFullYear() - vehicle.year;
      if (vehicleAge > 7 || vehicle.mileage > 500000) {
        const ageFactor: RiskFactor = {
          category: 'Vehicle Condition',
          factor: `${vehicle.year} ${vehicle.make} ${vehicle.model} with ${vehicle.mileage.toLocaleString()} miles`,
          severity: vehicleAge > 10 || vehicle.mileage > 750000 ? 'high' : 'medium',
          score: Math.min(10, Math.floor(vehicleAge / 2) + Math.floor(vehicle.mileage / 200000)),
          details: 'Older vehicles with high mileage have increased breakdown and safety risks'
        };
        factors.push(ageFactor);
        totalScore -= ageFactor.score;
      }

      // Maintenance compliance
      const overdueMaintenance = vehicle.maintenance.filter(
        m => m.nextDue && m.nextDue < new Date()
      );
      if (overdueMaintenance.length > 0) {
        const maintFactor: RiskFactor = {
          category: 'Maintenance',
          factor: `${overdueMaintenance.length} overdue maintenance items on vehicle ${vehicle.id}`,
          severity: overdueMaintenance.length > 2 ? 'critical' : 'high',
          score: overdueMaintenance.length * 5,
          details: `Overdue: ${overdueMaintenance.map(m => m.type).join(', ')}`
        };
        factors.push(maintFactor);
        totalScore -= maintFactor.score;
      }
    }

    totalScore = Math.max(0, Math.min(100, totalScore));

    return {
      overallScore: totalScore,
      riskLevel: this.scoreToRiskLevel(totalScore),
      factors,
      recommendations: this.generateRecommendations(factors),
      premiumMultiplier: this.calculatePremiumMultiplier(totalScore),
      underwritingNotes: await this.generateUnderwritingNotes(factors),
      generatedAt: new Date(),
      llmUsed: this.llm
    };
  }

  private scoreToRiskLevel(score: number): 'low' | 'moderate' | 'high' | 'critical' {
    if (score >= 80) return 'low';
    if (score >= 60) return 'moderate';
    if (score >= 40) return 'high';
    return 'critical';
  }

  private calculatePremiumMultiplier(score: number): number {
    if (score >= 90) return 0.9;
    if (score >= 80) return 1.0;
    if (score >= 70) return 1.15;
    if (score >= 60) return 1.3;
    if (score >= 50) return 1.5;
    if (score >= 40) return 1.75;
    return 2.0;
  }

  private generateRecommendations(factors: RiskFactor[]): string[] {
    const recommendations: string[] = [];

    for (const factor of factors) {
      switch (factor.category) {
        case 'Property Age':
          recommendations.push('Schedule comprehensive building inspection and update as needed');
          break;
        case 'Maintenance':
          recommendations.push('Clear maintenance backlog, prioritizing safety-related items');
          break;
        case 'Inspection':
          recommendations.push('Address inspection deficiencies and schedule re-inspection');
          break;
        case 'Claims History':
          recommendations.push('Implement loss control measures based on claim patterns');
          break;
        case 'Fleet Safety':
          recommendations.push('Implement driver safety training program');
          break;
        case 'Safety Events':
          recommendations.push('Review and address specific vehicle safety patterns');
          break;
        case 'Driver Violations':
          recommendations.push('Consider driver retraining or reassignment');
          break;
        case 'HOS Compliance':
          recommendations.push('Review scheduling to ensure HOS compliance');
          break;
        case 'Vehicle Condition':
          recommendations.push('Evaluate vehicle replacement or enhanced maintenance schedule');
          break;
      }
    }

    return [...new Set(recommendations)];
  }

  private async generateUnderwritingNotes(factors: RiskFactor[]): Promise<string> {
    // In production, this would call the selected LLM
    const criticalFactors = factors.filter(f => f.severity === 'critical');
    const highFactors = factors.filter(f => f.severity === 'high');

    let notes = `Risk Assessment Summary:\n`;
    notes += `- ${factors.length} total risk factors identified\n`;
    notes += `- ${criticalFactors.length} critical issues requiring immediate attention\n`;
    notes += `- ${highFactors.length} high-severity concerns\n\n`;

    if (criticalFactors.length > 0) {
      notes += `Critical Issues:\n`;
      criticalFactors.forEach(f => {
        notes += `• ${f.category}: ${f.factor}\n`;
      });
    }

    notes += `\nUnderwriting Recommendation: `;
    if (criticalFactors.length > 2) {
      notes += `DECLINE or require significant risk mitigation before binding`;
    } else if (criticalFactors.length > 0 || highFactors.length > 3) {
      notes += `REFER to senior underwriter with conditions`;
    } else if (highFactors.length > 0) {
      notes += `APPROVE with standard rate adjustments`;
    } else {
      notes += `APPROVE at preferred rates`;
    }

    return notes;
  }
}

// ============ EXPORT SINGLETON INSTANCES ============

export const buildiumConnector = (apiKey: string) => new BuildiumConnector(apiKey);
export const motiveConnector = (apiKey: string) => new MotiveConnector(apiKey);
export const riskAnalyzer = (llm: 'cerebras' | 'gpt-4' | 'claude-3' | 'gemini' | 'groq' = 'claude-3') => new RiskAnalyzer(llm);
