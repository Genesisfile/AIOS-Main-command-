import { Microservice, SystemEvent, SystemState, SystemLog, Agent } from './types';

export const INITIAL_STATE: SystemState = {
  architecture_score: 0.72,
  migration_phase: 'MONOLITH',
  is_frozen: false,
  version: '0.9.1-LEGACY'
};

export const SERVICES: Microservice[] = [
  {
    id: "SVC-01",
    name: "inventory-ingest",
    type: "LAMBDA",
    status: "COLD",
    latency: "1240ms",
    uptime: "99.1%",
    functions: ["parse_manifest", "validate_signature", "ingest_batch"],
    deployment_hash: "0x8a7f...1b"
  },
  {
    id: "SVC-02",
    name: "specter-auth",
    type: "CONTAINER",
    status: "WARM",
    latency: "45ms",
    uptime: "99.99%",
    functions: ["verify_token", "rotate_keys", "audit_log"],
    deployment_hash: "0x9c2d...4f"
  },
  {
    id: "SVC-03",
    name: "void-storage",
    type: "DATABASE",
    status: "WARM",
    latency: "12ms",
    uptime: "100%",
    functions: ["write_record", "query_index", "archive_shard"],
    deployment_hash: "0x11aa...bb"
  },
  {
    id: "SVC-04",
    name: "event-mesh-prime",
    type: "EVENT_BUS",
    status: "WARM",
    latency: "2ms",
    uptime: "99.99%",
    functions: ["route_event", "dead_letter_queue", "replay_stream"],
    deployment_hash: "0xeeee...00"
  },
  {
    id: "SVC-05",
    name: "asset-recon",
    type: "LAMBDA",
    status: "COLD",
    latency: "800ms",
    uptime: "98.5%",
    functions: ["reconcile_ledger", "flag_anomaly"],
    deployment_hash: "0x3344...55"
  },
  {
    id: "SVC-06",
    name: "legacy-monolith",
    type: "CONTAINER",
    status: "DECAYING",
    latency: "4500ms",
    uptime: "92.0%",
    functions: ["do_everything", "block_thread", "leak_memory"],
    deployment_hash: "0xLEGACY...00"
  }
];

export const MOCK_EVENTS: SystemEvent[] = [
  {
    id: "evt-1",
    timestamp: new Date().toISOString(),
    source: "legacy-monolith",
    payload: "WARNING: Thread pool exhaustion detected.",
    type: "ERROR"
  },
  {
    id: "evt-2",
    timestamp: new Date(Date.now() - 1000).toISOString(),
    source: "inventory-ingest",
    payload: "Cold start detected. Init duration: 1200ms",
    type: "TRIGGER"
  },
  {
    id: "evt-3",
    timestamp: new Date(Date.now() - 2000).toISOString(),
    source: "event-mesh-prime",
    payload: "Routing 405 events/sec",
    type: "RESPONSE"
  }
];

export const INITIAL_LOGS: SystemLog[] = [
  {
    id: "log-1",
    timestamp: new Date().toISOString(),
    source: "SYSTEM_BOOT",
    message: "Kernel initialized successfully.",
    type: "success"
  },
  {
    id: "log-2",
    timestamp: new Date(Date.now() - 1000).toISOString(),
    source: "NETWORK",
    message: "Swarm mesh topology verified.",
    type: "info"
  },
  {
    id: "log-3",
    timestamp: new Date(Date.now() - 5000).toISOString(),
    source: "SECURITY",
    message: "Port scan detected from internal subnet.",
    type: "warning"
  }
];

// Aliases for App.tsx compatibility
export const AGENTS: Agent[] = SERVICES;
export const MARKET_EVENTS: SystemEvent[] = MOCK_EVENTS;
export const SYSTEM_CONFIG = {
    ...INITIAL_STATE,
    name: "GHOST INVENTORY",
};