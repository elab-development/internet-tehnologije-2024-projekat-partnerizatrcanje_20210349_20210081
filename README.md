<<<<<<< HEAD
<<<<<<< HEAD
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
=======
<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains over 2000 video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the Laravel [Patreon page](https://patreon.com/taylorotwell).

### Premium Partners

- **[Vehikl](https://vehikl.com/)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Cubet Techno Labs](https://cubettech.com)**
- **[Cyber-Duck](https://cyber-duck.co.uk)**
- **[Many](https://www.many.co.uk)**
- **[Webdock, Fast VPS Hosting](https://www.webdock.io/en)**
- **[DevSquad](https://devsquad.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
- **[OP.GG](https://op.gg)**
- **[WebReinvent](https://webreinvent.com/?utm_source=laravel&utm_medium=github&utm_campaign=patreon-sponsors)**
- **[Lendio](https://lendio.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
>>>>>>> origin/master
=======
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
>>>>>>> origin/react-frontend
