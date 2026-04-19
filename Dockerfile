# Use official Python 3.10 slim image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PORT=8080

# Set working directory
WORKDIR /app

# Copy EVERYTHING first to ensure we don't miss files regardless of folder structure
COPY . .

# Try to find and install requirements.txt wherever it is
RUN if [ -f "backend/requirements.txt" ]; then \
        pip install --no-cache-dir -r backend/requirements.txt; \
    elif [ -f "requirements.txt" ]; then \
        pip install --no-cache-dir -r requirements.txt; \
    else \
        pip install --no-cache-dir fastapi uvicorn pydantic python-multipart; \
    fi

# Final check for uvicorn
RUN pip install --no-cache-dir uvicorn fastapi pydantic

# Expose port
EXPOSE ${PORT}

# Start command with intelligent path detection
# We try to run from root main, or backend.main
CMD if [ -f "backend/main.py" ]; then \
        python3 -m uvicorn backend.main:app --host 0.0.0.0 --port ${PORT}; \
    else \
        python3 -m uvicorn main:app --host 0.0.0.0 --port ${PORT}; \
    fi
