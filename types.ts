export interface Microservice {
  id: string;
  name: string;
  type: 'LAMBDA' | 'CONTAINER' | 'DATABASE' | 'EVENT_BUS';
  status: 'COLD' | 'WARM' | 'FROZEN' | 'DECAYING';
  latency: string;
  uptime: string;
  functions: string[];
  deployment_hash: string;
}

export type Agent = Microservice;

export interface SystemEvent {
  id: string;
  timestamp: string;
  source: string;
  payload: string;
  type: 'TRIGGER' | 'RESPONSE' | 'ERROR' | 'MIGRATION';
}

export interface SystemState {
  architecture_score: number; // 0.0 to 1.0
  migration_phase: 'MONOLITH' | 'DECOUPLING' | 'SERVERLESS' | 'FROZEN_ALPHA';
  is_frozen: boolean;
  version: string;
}

export interface TransformationLog {
  id: string;
  step: string;
  impact: string;
  timestamp: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'critical';
}

export interface ReportItem {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  downloadPayload?: {
      filename: string;
      mimeType: string;
      content: string;
  };
}