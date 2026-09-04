# ==============================================================================
# Ashky Studio - Multi-Stage Production Dockerfile
# Stage 1: Build React/Vite Frontend
# Stage 2: Python 3.12-slim Runtime with FFmpeg & Uvicorn
# ==============================================================================

# --- Stage 1: Frontend Build ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# --- Stage 2: Backend Runtime ---
FROM python:3.12-slim

# Install system dependencies: FFmpeg, ffprobe, and curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

# Install Python dependencies
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ ./

# Copy built frontend bundle from Stage 1
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Ensure media storage directories exist
RUN mkdir -p /app/backend/media/audio /app/backend/media/video /app/backend/media/images

ENV PORT=8000
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app/backend

EXPOSE 8000

# Start FastAPI application via Uvicorn
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
