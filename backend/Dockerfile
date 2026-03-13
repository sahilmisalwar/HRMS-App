FROM python:3.11-slim

WORKDIR /app

# Install dependencies required by psycopg2 or reportlab if any
RUN apt-get update && apt-get install -y gcc libpq-dev

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create uploads directory
RUN mkdir -p /app/uploads

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
