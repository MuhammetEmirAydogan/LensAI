FROM python:3.11-slim

WORKDIR /opt/ai

RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# U-2-Net modelini indirip image'e gömerek start süresini hızlandıralım
RUN mkdir -p /root/.u2net
RUN apt-get update && apt-get install -y wget && \
    wget https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net.onnx -O /root/.u2net/u2net.onnx

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
