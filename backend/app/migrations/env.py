from logging.config import fileConfig
import os
import sys
from pathlib import Path

from sqlalchemy import engine_from_config, pool
from alembic import context

# -----------------------------
# Configura path para importar app
sys.path.append(str(Path(__file__).resolve().parents[2]))  # backend/
# -----------------------------

# Carrega variáveis do .env
from dotenv import load_dotenv
load_dotenv()

# Importa Base e todos os models
from app.domain.models import Base  # Base está definido nos seus models
from app.domain.models import *     # importa User, Empresa, AuditLog etc.

# -----------------------------
# Configuração Alembic
config = context.config

# Sobrescreve sqlalchemy.url com a variável do .env (se não estiver no alembic.ini)
if not config.get_main_option("sqlalchemy.url"):
    config.set_main_option("sqlalchemy.url", os.getenv("DATABASE_URL"))

# Logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Define os models para autogenerate
target_metadata = Base.metadata
# -----------------------------

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
