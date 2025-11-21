// Type definitions for the multi-agent game generator

export interface Env {
  DB: D1Database;
  OPENAI_API_KEY: string;
  ANTHROPIC_API_KEY: string;
  GOOGLE_API_KEY: string;
}

export interface Project {
  id?: number;
  name: string;
  game_type?: string;
  theme?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Worldview {
  id?: number;
  project_id: number;
  title: string;
  history?: string;
  geography?: string;
  culture?: string;
  lore?: string;
  raw_content?: string;
  model_used?: string;
  created_at?: string;
}

export interface Storyline {
  id?: number;
  project_id: number;
  worldview_id?: number;
  type?: string;
  title: string;
  summary?: string;
  acts?: string;
  conflicts?: string;
  raw_content?: string;
  model_used?: string;
  created_at?: string;
}

export interface Character {
  id?: number;
  project_id: number;
  worldview_id?: number;
  name: string;
  role?: string;
  personality?: string;
  background?: string;
  appearance?: string;
  motivations?: string;
  relationships?: string;
  raw_content?: string;
  model_used?: string;
  created_at?: string;
}

export interface Dialogue {
  id?: number;
  project_id: number;
  character_id?: number;
  scene_name?: string;
  content: string;
  emotion?: string;
  context?: string;
  raw_content?: string;
  model_used?: string;
  created_at?: string;
}

export interface GenerationLog {
  id?: number;
  project_id: number;
  agent_type: string;
  input_data?: string;
  output_data?: string;
  model_used?: string;
  tokens_used?: number;
  duration_ms?: number;
  status?: string;
  error_message?: string;
  created_at?: string;
}

export type LLMProvider = 'openai' | 'anthropic' | 'google';

export interface LLMResponse {
  content: string;
  model: string;
  tokens?: number;
}

export interface AgentInput {
  projectId: number;
  context?: any;
  model?: string;
}

export interface AgentOutput {
  success: boolean;
  data?: any;
  error?: string;
  model_used?: string;
  tokens?: number;
  duration_ms?: number;
}
