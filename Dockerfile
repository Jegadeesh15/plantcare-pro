# Step 1: Build the React frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Step 2: Set up Python/Flask backend
FROM python:3.10-slim
WORKDIR /app
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend files
COPY backend/ ./backend/

# Copy built frontend assets to backend's static directory
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose port (Hugging Face defaults to 7860, Render uses PORT env var)
ENV PORT=7860
EXPOSE 7860

WORKDIR /app/backend
CMD ["python", "main.py"]
