# Power Vote

Interaktywna gra głosowania z tworzeniem awatarów, codziennymi nagrodami i osiągnięciami.

## Funkcje

- **Tworzenie Awatara**: Wybierz zwierzę, nakrycie głowy i narzędzie, aby stworzyć unikalnego awatara
- **Codzienne Głosowanie**: Głosuj raz dziennie (koszt 3 zł) z możliwością wygranej 10 zł
- **Strona Wyników**: Przeglądaj codzienne wyniki z dopasowanymi cechami
- **System Osiągnięć**: Odblokowuj osiągnięcia z animowanymi filmami
- **Wielojęzyczność**: Wsparcie dla języka polskiego (pl-PL) i angielskiego (en-US)
- **Ciekawostki**: Poznaj humorystyczne fakty o każdym zwierzęciu
- **Responsywny Design**: Interfejs mobile-first zoptymalizowany dla wszystkich urządzeń

## Rozwój

Zainstaluj zależności:
```bash
npm install
```

Uruchom serwer deweloperski:
```bash
npm run dev
```

Zbuduj wersję produkcyjną:
```bash
npm run build
```

## Wdrożenie Docker

Zbuduj obraz Docker:
```bash
docker build -t power-vote-app .
```

Wdróż na Google Cloud Run:
```bash
gcloud run deploy power-vote-app --image power-vote-app --platform managed --region europe-central2
```

## Stack Technologiczny

- **Frontend**: React 18 z TypeScript
- **Framework UI**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **Zarządzanie Stanem**: Context API (BalanceContext, CopyProvider)
- **Narzędzie Budowania**: Vite
- **Konteneryzacja**: Docker + Nginx
- **Hosting**: Google Cloud Run

## Struktura Projektu

```
src/
├── components/
│   └── SlotMachine.tsx      # Główny interfejs gry
├── pages/
│   ├── Home.tsx              # Strona główna
│   ├── Results.tsx           # Widok codziennych wyników
│   ├── Achievements.tsx      # Śledzenie osiągnięć
│   ├── OtherGames.tsx        # Dodatkowe gry (demo)
│   └── Login.tsx             # Autoryzacja (demo)
├── context/
│   └── BalanceContext.tsx    # Globalny stan gry
├── content/
│   ├── CopyProvider.tsx      # Kontekst i18n
│   ├── pl-PL.json            # Tłumaczenia polskie
│   └── en-US.json            # Tłumaczenia angielskie
└── assets/
    ├── PV_Pitch_Avatar/      # Obrazy awatarów (~60 kombinacji)
    └── Awards/               # Zasoby osiągnięć
```