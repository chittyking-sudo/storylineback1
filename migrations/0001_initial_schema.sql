-- Projects table: Stores game generation projects
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  game_type TEXT,
  theme TEXT,
  status TEXT DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Worldviews table: Stores generated worldview content
CREATE TABLE IF NOT EXISTS worldviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  history TEXT,
  geography TEXT,
  culture TEXT,
  lore TEXT,
  raw_content TEXT,
  model_used TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Storylines table: Stores main and side storylines
CREATE TABLE IF NOT EXISTS storylines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  worldview_id INTEGER,
  type TEXT DEFAULT 'main',
  title TEXT NOT NULL,
  summary TEXT,
  acts TEXT,
  conflicts TEXT,
  raw_content TEXT,
  model_used TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (worldview_id) REFERENCES worldviews(id) ON DELETE SET NULL
);

-- Characters table: Stores game characters (protagonists and NPCs)
CREATE TABLE IF NOT EXISTS characters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  worldview_id INTEGER,
  name TEXT NOT NULL,
  role TEXT,
  personality TEXT,
  background TEXT,
  appearance TEXT,
  motivations TEXT,
  relationships TEXT,
  raw_content TEXT,
  model_used TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (worldview_id) REFERENCES worldviews(id) ON DELETE SET NULL
);

-- Dialogues table: Stores dialogue scripts
CREATE TABLE IF NOT EXISTS dialogues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  character_id INTEGER,
  scene_name TEXT,
  content TEXT NOT NULL,
  emotion TEXT,
  context TEXT,
  raw_content TEXT,
  model_used TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE SET NULL
);

-- Generation logs: Track all agent generation activities
CREATE TABLE IF NOT EXISTS generation_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  agent_type TEXT NOT NULL,
  input_data TEXT,
  output_data TEXT,
  model_used TEXT,
  tokens_used INTEGER,
  duration_ms INTEGER,
  status TEXT DEFAULT 'success',
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_worldviews_project ON worldviews(project_id);
CREATE INDEX IF NOT EXISTS idx_storylines_project ON storylines(project_id);
CREATE INDEX IF NOT EXISTS idx_characters_project ON characters(project_id);
CREATE INDEX IF NOT EXISTS idx_dialogues_project ON dialogues(project_id);
CREATE INDEX IF NOT EXISTS idx_generation_logs_project ON generation_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
