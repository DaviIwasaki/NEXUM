from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# Imports para carregar suas settings e models ---
import os
import sys
from pathlib import Path

# Adiciona o diretório raiz do backend ao path para permitir imports
# Path(__file__).resolve().parents[2] → sobe dois níveis: migrations → app → backend
sys.path.append(str(Path(__file__).resolve().parents[2]))

# Importe suas settings (ajuste o caminho se o arquivo settings.py estiver em outro lugar)
from config.settings import settings

# Importe o Base dos seus models SQLAlchemy
# Ajuste o caminho conforme onde você definiu o Base (ex: domain/models.py ou domain/base.py)
from domain.models import Base  # <--- MUDE SE NECESSÁRIO (ex: from app.domain.models import Base)

# ---------------------------------------------------------

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Sobrescreve a URL do banco com a do seu .env ---
# Isso evita colocar senha no alembic.ini e usa a variável carregada nas settings
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)
# ---------------------------------------------------------

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Define os models para o autogenerate funcionar ---
target_metadata = Base.metadata
# ---------------------------------------------------------

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
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()