-- Habilita a extensão para geração de UUIDs, se necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Papéis (Roles)
-- Armazena os diferentes níveis de acesso (ex: admin, viewer).
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL
);

-- 2. Tabela de Permissões (Permissions)
-- Armazena as ações que podem ser permitidas (ex: create_metric, view_dashboard).
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- 3. Tabela de Junção: Papéis e Permissões (M-N)
-- Conecta os papéis às permissões.
CREATE TABLE role_permissions (
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- 4. Tabela de Usuários (Users)
-- Tabela principal de usuários. Cada usuário tem um papel.
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);

-- 5. Tabela de Configurações do Usuário (User Settings)
-- Armazena personalizações de UI, como fuso horário e tema.
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL,
    theme VARCHAR(20) DEFAULT 'light',
    timezone VARCHAR(50) DEFAULT 'UTC',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Tabela de Logs de Atividade do Usuário (User Activity Logs)
-- Rastreia ações importantes para auditoria e segurança.
CREATE TABLE user_activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    details JSONB,
    ip_address INET,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_log_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX idx_logs_timestamp ON user_activity_logs(timestamp);

-- 7. Tabela de Métricas (Metrics)
-- Tabela para dados brutos, particionável em um ambiente real.
CREATE TABLE metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    value NUMERIC(15, 2) NOT NULL,
    source VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_metric_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_metrics_user_id ON metrics(user_id);
CREATE INDEX idx_metrics_created_at ON metrics(created_at);

-- 8. Tabela de Métricas Agregadas (Aggregated Metrics)
-- Armazena dados resumidos para dashboards de alta performance.
CREATE TABLE aggregated_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    metric_type VARCHAR(50) NOT NULL,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    total_value NUMERIC(15, 2),
    average_value NUMERIC(15, 2),
    count BIGINT,
    CONSTRAINT fk_aggregated_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 9. Tabela de Tags de Métricas (Metric Tags)
-- Tabela para categorizar as métricas de forma flexível.
CREATE TABLE metric_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL
);

-- 10. Tabela de Junção: Métricas e Tags (M-N)
-- Conecta métricas e tags.
CREATE TABLE metrics_tags_join (
    metric_id UUID NOT NULL,
    tag_id UUID NOT NULL,
    PRIMARY KEY (metric_id, tag_id),
    CONSTRAINT fk_join_metric FOREIGN KEY (metric_id) REFERENCES metrics(id) ON DELETE CASCADE,
    CONSTRAINT fk_join_tag FOREIGN KEY (tag_id) REFERENCES metric_tags(id) ON DELETE CASCADE
);