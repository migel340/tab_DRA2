# DRA2 Backend — Spring Boot

System zarządzania naprawami. Backend REST API z autoryzacją JWT i podziałem na role.

## Wymagania

- Java 17+ (projekt kompiluje się na Java 21)
- Maven 3.9+
- Docker (do bazy PostgreSQL)

## Uruchomienie

```bash
# 1. Odpal bazę danych
docker-compose up -d

# 2. Uruchom backend
mvn spring-boot:run
```

Aplikacja startuje na `http://localhost:8080`.
Swagger UI dostępny pod `http://localhost:8080/swagger-ui.html`.

Przy pierwszym uruchomieniu automatycznie tworzone jest konto admina: `admin / admin123`.

## Baza danych

PostgreSQL 17 via Docker Compose. Konfiguracja w `docker-compose.yml`:

| Parametr | Wartość |
|----------|---------|
| Host | localhost |
| Port | 5432 |
| Baza | dra2db |
| User | dra2user |
| Hasło | secret |

Hibernate automatycznie tworzy/aktualizuje tabele (`ddl-auto=update`).

## Struktura projektu

```
src/main/java/com/tab/dra2/
│
├── Dra2Application.java          # Punkt startowy aplikacji
│
├── config/                        # Konfiguracja Springa
│   ├── SecurityConfig.java        #   → reguły bezpieczeństwa, CORS, filtry
│   ├── SwaggerConfig.java         #   → dokumentacja API (Swagger UI)
│   ├── GlobalExceptionHandler.java#   → obsługa błędów (zwraca czytelne JSON)
│   └── DataInitializer.java       #   → tworzy konto admina przy starcie
│
├── entity/                        # Encje JPA (= tabele w bazie)
│   └── Personel.java             #   → tabela "personel" (id, imię, login, hasło, rola)
│
├── enums/
│   └── Role.java                 #   → ADMIN, MANAGER, STAFF
│
├── repository/                    # Warstwa dostępu do bazy
│   └── PersonelRepository.java   #   → findByUsername(), existsByUsername()
│
├── dto/                           # Obiekty request/response (kształt JSON)
│   ├── LoginRequest.java         #   → { username, password }
│   ├── RegisterRequest.java      #   → { firstName, surname, username, password }
│   └── AuthResponse.java         #   → { token, id, username, firstName, surname, role }
│
├── security/                      # Warstwa bezpieczeństwa JWT
│   ├── JwtUtil.java              #   → generowanie i walidacja tokenów
│   ├── JwtFilter.java            #   → filtr sprawdzający token w każdym requeście
│   └── CustomUserDetailsService.java # → ładuje usera z bazy dla Spring Security
│
├── service/                       # Logika biznesowa
│   └── AuthService.java          #   → login(), register()
│
└── web/                           # Kontrolery REST (endpointy)
    ├── AuthController.java       #   → POST /api/auth/login, /api/auth/register
    └── PingController.java       #   → GET /ping (health check)
```

## Endpointy API

### Publiczne (bez tokena)

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| POST | `/api/auth/register` | Rejestracja (domyślna rola: STAFF) |
| POST | `/api/auth/login` | Logowanie, zwraca token JWT |
| GET | `/ping` | Health check |
| GET | `/swagger-ui.html` | Dokumentacja API |

### Chronione (wymagają tokena)

Wszystkie pozostałe endpointy. Token wysyłany w headerze:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

## Jak działa autoryzacja

1. **Rejestracja** — frontend wysyła POST na `/api/auth/register` z danymi użytkownika. Backend hashuje hasło (BCrypt), zapisuje usera w bazie z rolą STAFF, zwraca token JWT.

2. **Logowanie** — frontend wysyła POST na `/api/auth/login` z username i hasłem. Backend weryfikuje dane, generuje token JWT z username i rolą, zwraca go w odpowiedzi.

3. **Autoryzacja requestów** — frontend dołącza token do każdego requesta w headerze `Authorization: Bearer <token>`. JwtFilter przechwytuje request, dekoduje token, ustawia kontekst bezpieczeństwa.

4. **Role** — trzy poziomy dostępu:
   - `ADMIN` — pełen dostęp
   - `MANAGER` — zarządzanie zgłoszeniami
   - `STAFF` — obsługa przypisanych zadań

## Przykłady requestów

### Rejestracja

```bash
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "Jan",
  "surname": "Kowalski",
  "username": "jan.kowalski",
  "password": "haslo123"
}
```

### Logowanie

```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### Odpowiedź (login i register)

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "id": 1,
  "username": "admin",
  "firstName": "Admin",
  "surname": "System",
  "role": "ADMIN"
}
```

## Konfiguracja

Plik `src/main/resources/application.properties`:

| Klucz | Opis |
|-------|------|
| `spring.datasource.url` | URL bazy danych |
| `app.jwt.secret` | Klucz do podpisywania tokenów JWT (min. 32 znaki) |
| `app.jwt.expiration-ms` | Czas życia tokena w ms (domyślnie 24h) |

## Konwencje dla zespołu

- **Kontrolery** trafiają do `web/` — tylko odbierają request i zwracają response.
- **Logika biznesowa** trafia do `service/` — kontroler deleguje całą robotę.
- **Nowe endpointy** — dodaj `@Tag` i `@Operation` żeby pojawiły się w Swaggerze.
- **Nowe encje** — stwórz klasę w `entity/`, Hibernate sam stworzy tabelę.
- **Ograniczanie dostępu** — użyj `@PreAuthorize("hasRole('ADMIN')")` na metodzie kontrolera.
- **Hasła** — zawsze hashuj przez `PasswordEncoder`, nigdy plain text.