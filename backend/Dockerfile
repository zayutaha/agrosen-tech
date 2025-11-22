# Base image
FROM ghcr.io/astral-sh/uv:alpine3.22

WORKDIR /app

COPY . .
RUN uv sync
RUN uv tool install uvicorn 

# Expose FastAPI port
EXPOSE 8000

# Run Uvicorn
CMD ["uv", "run", "server.py"]



