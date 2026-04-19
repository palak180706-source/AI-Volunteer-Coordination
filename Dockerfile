# Use official Python 3.10 slim image
FROM python:3.10-slim
# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PORT=8080
# Set working directory
WORKDIR /app
# Copy EVERYTHING from your local machine to the container
# This includes backend/ requirements.txt and index.html etc.
COPY . .
# Install dependencies from wherever requirements.txt is found
RUN if [ -f "backend/requirements.txt" ]; then \
        pip install --no-cache-dir -r backend/requirements.txt; \
    elif [ -f "requirements.txt" ]; then \
        pip install --no-cache-dir -r requirements.txt; \
    fi
# Final dependencies ensure
RUN pip install --no-cache-dir uvicorn fastapi pydantic
# Render uses the PORT environment variable
EXPOSE ${PORT}
# Smart launch: Try running as a package, if not, try running directly
CMD if [ -f "backend/main.py" ]; then \
        python3 -m uvicorn backend.main:app --host 0.0.0.0 --port ${PORT}; \
    else \
        python3 -m uvicorn main:app --host 0.0.0.0 --port ${PORT}; \
    fi
