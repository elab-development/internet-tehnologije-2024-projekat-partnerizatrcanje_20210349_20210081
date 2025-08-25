Web Aplikacija za trčanje - SprintLink
Autori
Tadija Ristić, broj indeksa 2021/0349

Nemanja Savin, broj indeksa 2021/0081

Mentor
Milica M. Simić

Uvod
Ovaj dokument pruža tehničku i organizacionu dokumentaciju za veb aplikaciju SprintLink, razvijenu kao studentski projekat. Aplikacija je namenjena trkačima i omogućava im da prate svoje performanse, kreiraju planove trčanja, učestvuju u virtuelnim trkama i izazovima, te se povezuju sa drugim korisnicima. Aplikacija je implementirana u skladu sa uprošćenom Larmanovom metodom razvoja softvera.

Metode i tehnologije
Aplikacija je razvijena primenom dvoslojne arhitekture, sa odvojenim frontend i backend delom koji komuniciraju putem REST API-ja.

Frontend
Za razvoj klijentskog dela aplikacije korišćene su sledeće tehnologije:

JavaScript: Kao osnovni programski jezik za klijentsku logiku. Korišćen je za manipulaciju DOM-om, rukovanje događajima i asinhronu komunikaciju sa serverom.

React: Biblioteka za izgradnju korisničkog interfejsa baziranog na komponentama, koja omogućava kreiranje dinamičnih i interaktivnih stranica. Upotreba React-a je omogućila modularnu strukturu i efikasno upravljanje stanjem (state management).

React Router DOM: Korišćen je za definisanje rutiranja na strani klijenta, omogućavajući navigaciju bez ponovnog učitavanja stranice.

Backend
Serverski deo aplikacije je razvijen na bazi PHP-a, koristeći Laravel frejmvork.

PHP: Programski jezik za serversku logiku, obradu podataka i interakciju sa bazom. PHP je korišćen za implementaciju kontrolera i modela, kao i za validaciju i autentifikaciju.

Laravel: MVC (Model-View-Controller) frejmvork koji pruža robusnu osnovu za kreiranje API-ja, upravljanje rutiranjem, autentifikacijom i bazom podataka. Korišćen je Eloquent ORM za jednostavnu manipulaciju podacima.

Organizacija i struktura projekta
Projekat se sastoji od dva nezavisna repozitorijuma (frontend i backend) koji se pokreću zasebno.

Organizacija backend dela (Laravel)
Backend je organizovan po standardnoj strukturi Laravel frejmvorka:

app/Http/Controllers: Sadrži sve kontrolere, koji su odgovorni za obradu HTTP zahteva i poslovnu logiku aplikacije.

app/Models: Definiše modele (npr. User, Post, Race), koji predstavljaju tabele u bazi podataka i njihove relacije.

database/migrations: Datoteke za migracije koje služe za kreiranje i modifikaciju šeme baze podataka.

routes/api.php: Fajl koji sadrži sve definicije REST API ruta.

Organizacija frontend dela (React)
Frontend je organizovan na logičan način radi modularnosti i skalabilnosti:

src/pages: Sadrži komponente koje predstavljaju cele stranice aplikacije (npr. Login.js, Home.js, Profile.js).

src/components: Uključuje ponovo upotrebljive komponente (npr. Navbar.js, Feed.js, Post.js).

src/hooks: Sadrži prilagođene React kuke (useApi.js) koje se koriste za centralizaciju logike, kao što je rukovanje API pozivima.

src/assets: Čuva sve statične resurse (slike, ikone).

Ključne funkcionalnosti i API rute
Aplikacija koristi RESTful API za komunikaciju. Autentifikacija se sprovodi putem Sanctum tokena, koji se generiše na backendu i koristi na frontendu za autorizaciju.

Autentifikacija: Implementirane su rute za registraciju, prijavu i odjavu korisnika. Takođe, omogućena je i privremena prijava za goste.

Upravljanje korisnicima: Rute za prikaz profila, ažuriranje ličnih podataka i brisanje naloga.

Planovi trčanja i feed: Rute za kreiranje, prikaz, filtriranje i pridruživanje planovima.

Izazovi i trke: Rute za kreiranje (samo administratori), pridruživanje, napuštanje i praćenje napretka.
