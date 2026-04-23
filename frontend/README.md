# DRA2 Frontend — React Router + shadcn/ui

Interfejs użytkownika systemu zarządzania naprawami. SPA z autoryzacją JWT i podziałem widoków na role.

## Wymagania

- Node.js 18+
- npm

## Uruchomienie

```bash
npm install
npm run dev
```

Aplikacja dostępna pod `http://localhost:5173`. Wymaga uruchomionego backendu na `http://localhost:8080`.

## Stack technologiczny

| Narzędzie       | Rola                                       |
| --------------- | ------------------------------------------ |
| React Router v7 | Routing, layouty, loadery                  |
| shadcn/ui       | Komponenty UI (Button, Input, Label, Card) |
| Tailwind CSS v4 | Stylowanie                                 |
| Lucide React    | Ikony                                      |
| TypeScript      | Typowanie                                  |

## Struktura projektu

```
app/
├── root.tsx                       # Główny komponent, providery, meta tagi
├── routes.ts                      # Definicja routingu (jakie ścieżki → jakie komponenty)
├── app.css                        # Style globalne, zmienne shadcn, fonty
│
├── components/                    # Komponenty współdzielone
│   ├── layout/
│   │   └── Sidebar.tsx            #   → sidebar z nawigacją i wylogowaniem
│   └── ui/                        #   → komponenty shadcn (nie edytuj ręcznie)
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── label.tsx
│
├── config/
│   └── navigation.ts              # Lista linków nawigacji z rolami
│
├── layouts/
│   └── DashboardLayout.tsx        # Layout z sidebarem (sprawdza auth)
│
├── lib/                           # Narzędzia i helpery
│   ├── api.ts                     #   → funkcje fetch do backendu (login, register)
│   ├── auth.ts                    #   → zarządzanie sesją (token w localStorage)
│   └── utils.ts                   #   → helper cn() do klas Tailwind
│
├── routes/                        # Strony
│   ├── auth/
│   │   ├── login.tsx              #   → strona logowania
│   │   └── register.tsx           #   → strona rejestracji
│   ├── dashboard/
│   │   └── DashboardGuard.tsx     #   → przekierowanie / → /requests
│   └── requests/
│       └── requests.tsx           #   → lista zgłoszeń
│
└── types/                         # Typy TypeScript
    ├── auth.ts                    #   → Role, User
    └── navigation.ts              #   → NavItem
```

## Routing

| Ścieżka     | Komponent               | Auth | Opis                       |
| ----------- | ----------------------- | ---- | -------------------------- |
| `/login`    | `auth/login.tsx`        | Nie  | Formularz logowania        |
| `/register` | `auth/register.tsx`     | Nie  | Formularz rejestracji      |
| `/`         | `DashboardGuard.tsx`    | Tak  | Przekierowuje na /requests |
| `/requests` | `requests/requests.tsx` | Tak  | Lista zgłoszeń             |

## Autoryzacja na froncie

### Flow logowania

1. User wpisuje dane na `/login`
2. `api.ts` → `login()` wysyła POST do backendu
3. Backend zwraca token JWT + dane usera
4. `auth.ts` → `saveAuth()` zapisuje token i dane do `localStorage`
5. Przekierowanie na `/` → `DashboardLayout` sprawdza auth → renderuje dashboard

### Ochrona stron

`DashboardLayout.tsx` sprawdza `isAuthenticated()` przy każdym wejściu. Brak tokena → przekierowanie na `/login`.

### Widoczność nawigacji wg ról

Plik `config/navigation.ts` definiuje linki z tablicą `roles`. Sidebar filtruje je po roli zalogowanego usera:

```typescript
// config/navigation.ts
export const ALL_APP_LINKS: NavItem[] = [
  {
    to: "/requests",
    label: "Zgłoszenia",
    roles: ["MANAGER"], // widoczne tylko dla managera
  },
];
```

### Wylogowanie

Kliknięcie "Wyloguj" w sidebarze wywołuje `logout()` (czyści localStorage) i przekierowuje na `/login`.

## Konwencje dla zespołu

- **Nowe strony** — stwórz plik w `routes/`, dodaj wpis w `routes.ts`.
- **Komponenty shadcn** — instaluj przez `npx shadcn@latest add <nazwa>`. Nie edytuj plików w `components/ui/` ręcznie.
- **Nowe linki w sidebarze** — dodaj wpis w `config/navigation.ts` z odpowiednimi rolami.
- **Requesty do API** — dodawaj funkcje w `lib/api.ts`. Token dołączaj przez `getToken()` z `lib/auth.ts`:

```typescript
// Przykład chronionego requesta
const res = await fetch(`${API_URL}/api/requests`, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  },
});
```

- **Ikony** — używaj `lucide-react`: `import { NazwaIkony } from "lucide-react"`.
- **Style** — Tailwind CSS utility classes. Dla warunkowych klas używaj `cn()` z `lib/utils.ts`.
