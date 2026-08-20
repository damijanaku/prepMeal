#  PrepMeal

A full-stack meal prep and nutrition tracking web app. Create and manage your own recipes and ingredients, track macros per serving, and browse ingredients by food group.

---

## Features

- **Authentication** — Register and log in with JWT-based auth and refresh tokens
- **Recipes** — Create, view, edit, and delete recipes with auto-calculated nutrition per serving
- **Ingredients** — Add custom ingredients with full macro breakdowns (calories, protein, carbs, fats, sugar, saturated fats)
- **Food Groups** — Browse ingredients filtered by food group (fruits, vegetables, grains, protein, dairy, and more)
- **Protected Routes** — All app pages require authentication; unauthenticated users are redirected to login

---

## Tech Stack

### Frontend
- [React](https://reactjs.org/) (Create React App)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router v6](https://reactrouter.com/)

### Backend
- [ASP.NET Core](https://dotnet.microsoft.com/en-us/apps/aspnet) (.NET)
- REST API running on `http://localhost:5204`

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [.NET SDK](https://dotnet.microsoft.com/download) 7+
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/damijanaku/prepMeal.git
cd prepMeal
```

### 2. Start the backend

```bash
cd backend/prepMeal
dotnet restore
dotnet run
```

The API will be available at `http://localhost:5204`.

### 3. Start the frontend

```bash
cd frontend/prepmeal
npm install
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

From the `frontend/prepmeal` directory:

| Command | Description |
|---|---|
| `npm start` | Run the app in development mode |
| `npm run build` | Build for production |
| `npm test` | Run tests in interactive watch mode |

---

## Environment

The frontend proxies API requests to the backend. If you change the backend port from `5204`, update the `API_BASE_URL` references in the page components.

---

## License

This project is for personal/educational use. See [LICENSE](LICENSE) for details.
