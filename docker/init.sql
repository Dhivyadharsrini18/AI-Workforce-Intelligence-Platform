-- PostgreSQL Initialization Script
-- =================================
-- Creates the database and enables UUID extension.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tables are created by SQLAlchemy/Alembic migrations.
-- This script only handles PostgreSQL-specific initialization.
