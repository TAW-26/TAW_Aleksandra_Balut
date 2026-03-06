# Platforma organizacji sąsiedzkich aktywności

## Opis tematu projektu

Projekt polega na stworzeniu aplikacji webowej umożliwiającej mieszkańcom danego obszaru organizowanie i wyszukiwanie sąsiedzkich aktywności.

Użytkownicy będą mogli tworzyć wydarzenia takie jak:

* wspólne granie w planszówki
* zajęcia jogi na świeżym powietrzu
* bieganie w grupie
* zabawy dla dzieci
* spotkania integracyjne sąsiadów

Platforma będzie umożliwiać:

* wyszukiwanie wydarzeń w określonej lokalizacji oraz po nazwie
* zapisanie się na wydarzenie
* przeglądanie szczegółowych informacji o planowanych aktywnościach
* zapisywanie wydarzeń do ulubionych

---

## Cel projektu

Celem projektu jest stworzenie aplikacji, która:

* umożliwia mieszkańcom łatwe organizowanie wspólnych aktywności
* pozwala znajdować wydarzenia w pobliżu miejsca zamieszkania
* wspiera budowanie lokalnej społeczności

---

## Zakres funkcjonalny

### 1. Zarządzanie użytkownikami

* rejestracja użytkownika
* logowanie
* edycja profilu
* podanie lokalizacji użytkownika (np. adres lub kod pocztowy)

---

### 2. Tworzenie wydarzeń sąsiedzkich

Użytkownik może:

* utworzyć wydarzenie

Podczas tworzenia wydarzenia podaje:

* nazwę wydarzenia
* opis
* datę i godzinę
* adres lub lokalizację
* maksymalną liczbę uczestników
* kategorię (np. sport, gry, dzieci, spotkania)

Organizator będzie mógł również:

* edytować wydarzenia
* usuwać wydarzenia
* zarządzać uczestnikami

---

### 3. Przeglądanie wydarzeń

Użytkownik może:

* przeglądać listę wydarzeń

Filtrowanie wydarzeń według:

* kategorii
* daty
* odległości od podanej lokalizacji
* nazwy wydarzenia

Dodatkowo użytkownik może:

* zapisać się na wydarzenie
* wycofać zapis
* przeglądać szczegóły wydarzenia
* dodać wydarzenie do ulubionych

---

## Proponowane technologie

### Frontend

* **Angular** – framework do budowy interfejsu użytkownika
* **TypeScript**
* **HTML / CSS**

---

### Backend

* **Node.js + Express**

Backend będzie odpowiadał za:

* obsługę API
* logikę aplikacji
* autoryzację użytkowników

---

### Baza danych

* **MongoDB**

Przechowywane dane:

* użytkownicy
* wydarzenia
* uczestnicy wydarzeń
* lokalizacje

---

## Dodatkowe narzędzia

* **JWT** – autoryzacja
* **Git** – kontrola wersji
* **REST API**
