# DRA2 — System zarządzania naprawami

Aplikacja fullstack do zarządzania zgłoszeniami i naprawami urządzeń.

## Struktura monorepo

```
tab_DRA2/
├── dra2/                # Backend — Spring Boot + PostgreSQL
│   ├── src/
│   ├── pom.xml
│   ├── docker-compose.yml
│   └── README.md
│
├── frontend/            # Frontend — React Router + shadcn/ui
│   ├── app/
│   ├── package.json
│   └── README.md
│
└── .gitignore
```

## Szybki start

### 1. Baza danych

```bash
cd dra2
docker-compose up -d
```

### 2. Backend (port 8080)

```bash
cd dra2
mvn spring-boot:run
```

### 3. Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

### Domyślne konto admina

| Login | Hasło    |
| ----- | -------- |
| admin | admin123 |

## Dokumentacja

- **Backend**: [dra2/README.md](dra2/README.md) — struktura, endpointy API, flow autoryzacji
- **Frontend**: [frontend/README.md](frontend/README.md) — struktura, routing, konwencje
- **Swagger UI**: http://localhost:8080/swagger-ui.html (przy uruchomionym backendzie)

## Role użytkowników

| Rola    | Opis                       |
| ------- | -------------------------- |
| ADMIN   | Pełen dostęp do systemu    |
| MANAGER | Zarządzanie zgłoszeniami   |
| PERSONEL| Obsługa przypisanych zadań |

## Wymagania

| Narzędzie | Wersja |
| --------- | ------ |
| Java      | 17+    |
| Maven     | 3.9+   |
| Node.js   | 18+    |
| Docker    | 20+    |

## Frontend

Aby poprawnie uruchomić frontend, skopiuj plik `.env.example` (jeśli istnieje) do `.env` i uzupełnij zmienne środowiskowe:

```bash
cd frontend
cp .env.example .env
```
