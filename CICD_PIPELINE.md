# 🔄 LensAI — CI/CD PIPELINE

## Pipeline Genel Bakış

```
Developer Push
     │
     ▼
Pre-commit Hooks (local)
     │
     ▼
GitHub Pull Request
     │
     ├── Lint & Type Check
     ├── Unit Tests
     ├── Integration Tests
     ├── Security Scan
     ├── Bundle Analysis
     └── Preview Deploy
          │
          ▼
     PR Onayı (Orchestrator)
          │
          ▼
     Merge to main
          │
          ▼
     Staging Deploy (otomatik)
          │
          ├── Smoke Tests
          ├── E2E Tests
          └── Performance Tests
               │
               ▼
          Manuel Onay
          (Orchestrator + Security Agent)
               │
               ▼
          Production Deploy
          (Blue/Green)
               │
               ▼
          Post-Deploy Monitoring
          (15 dakika)
               │
               ▼
          ✅ Deploy Tamamlandı
```

---

## 📋 GitHub Actions Workflow'ları

### 1. PR Kontrolleri (`.github/workflows/pr.yml`)
```yaml
name: PR Checks
on: [pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lint
        run: npm run lint

  type-check:
    runs-on: ubuntu-latest
    steps:
      - name: TypeScript
        run: npm run type-check

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
      redis:
        image: redis:7
    steps:
      - name: Unit + Integration Tests
        run: npm run test:ci
      - name: Coverage Report
        uses: codecov/codecov-action@v3

  security:
    runs-on: ubuntu-latest
    steps:
      - name: GitLeaks
        uses: gitleaks/gitleaks-action@v2
      - name: npm audit
        run: npm audit --audit-level=high
      - name: Snyk
        uses: snyk/actions/node@master

  build:
    runs-on: ubuntu-latest
    steps:
      - name: Docker Build
        run: docker build -t lensai/api:${{ github.sha }} .
      - name: Trivy Scan
        uses: aquasecurity/trivy-action@master
```

### 2. Staging Deploy (`.github/workflows/staging.yml`)
```yaml
name: Staging Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    steps:
      - name: Build & Push ECR
        run: |
          docker build -t $ECR_REGISTRY/lensai:$GITHUB_SHA .
          docker push $ECR_REGISTRY/lensai:$GITHUB_SHA

      - name: Deploy to EKS (staging)
        run: |
          kubectl set image deployment/lensai-api \
            api=$ECR_REGISTRY/lensai:$GITHUB_SHA \
            -n staging

      - name: Run E2E Tests
        run: npx playwright test --project=staging

      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
        with:
          payload: '{"text": "✅ Staging deploy başarılı: ${{ github.sha }}"}'
```

### 3. Production Deploy (`.github/workflows/production.yml`)
```yaml
name: Production Deploy
on:
  workflow_dispatch:   # Manuel tetikleme
    inputs:
      version:
        description: 'Deploy edilecek SHA'
        required: true

jobs:
  production-deploy:
    environment: production  # Manuel onay gerektirir
    runs-on: ubuntu-latest
    steps:
      - name: Blue/Green Deploy
        run: |
          # Yeni version'ı green'e deploy et
          kubectl set image deployment/lensai-api-green \
            api=$ECR_REGISTRY/lensai:${{ inputs.version }} \
            -n production

      - name: Health Check (5 dakika)
        run: |
          for i in {1..30}; do
            curl -f https://green.api.lensai.io/health || exit 1
            sleep 10
          done

      - name: Switch Traffic
        run: |
          # Kademeli trafik aktarımı
          kubectl patch service lensai-api \
            -p '{"spec":{"selector":{"version":"green"}}}'
```

---

## 🌿 Branch Stratejisi

```
main          → Production (korumalı, direkt push yasak)
develop       → Staging (entegrasyon dalı)
feature/*     → Yeni özellikler
fix/*         → Bug düzeltmeleri
hotfix/*      → Production acil düzeltmeler
release/*     → Release hazırlık
```

### Commit Mesaj Standardı (Conventional Commits)
```
feat: yeni stil kütüphanesi eklendi
fix: upload timeout hatası düzeltildi
perf: video önizleme lazy loading eklendi
security: JWT süresi kısaltıldı
docs: API kılavuzu güncellendi
test: video generation unit testleri
chore: bağımlılıklar güncellendi
```

---
*Bu doküman DevOps Agent tarafından yönetilir.*
