# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


Weather App

Bu loyiha — 3D interaktiv globusli, zamonaviy animatsiyali, qorong'u/yorug' rejimli **ReactJS ob-havo ilovasi**. Foydalanuvchining geolokatsiyasini aniqlaydi, shahar bo‘yicha qidiradi va 5–7 kunlik prognoz taqdim etadi.


Texnologiyalar

### Frontend:

- **React JS**
- **Vite** – Tez ishlaydigan development muhit
- **Tailwind CSS** + `tw-animate-css` – Stil berish va animatsiyalar uchun
- **shadcn/ui** – Chiroyli va qayta ishlatiladigan UI komponentlar

### Navigatsiya & State:

- `react-router-dom` – Sahifalararo navigatsiya
- `@reduxjs/toolkit`, `react-redux` – Global state management

### API & HTTP:
- `axios` – API chaqiriqlar uchun

### UI Qo‘shimchalari:
- `clsx`, `class-variance-authority` – Shartli klasslar
- `lucide-react` – SVG ikonalar
- `sonner` – Toast bildirishnomalar

### 3D Vizualizatsiya:
- `three`, `@react-three/fiber`, `@react-three/drei` – 3D globe animatsiyasi va interaktivlik


### Qo‘shimcha:
- `geojson` – Geolokatsiya uchun
- `vercel.json` – Vercel deploy konfiguratsiyasi

##  Loyiha Tuzilishi

src/
├── assets/ # Rasm va media fayllar (earth.png)
├── components/ # UI komponentlar (Earth)
├── pages/ # Sahifalar (LocationWeatherInfo)
├── lib/ # Redux store, slice va konfiguratsiya
├── App.jsx # Root component
└── main.jsx # Entry point


##  Ishga tushirish

bash & npm

git clone https://github.com/Rozimuxammed/weather-app
cd weather-app


##  Paketlarni o‘rnatish

npm install

##  Ishga tushirish

npm run dev


##  Dasturchi 

Rozimuxammad Rozimurodov

##  Github

https://github.com/Rozimuxammed

