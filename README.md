# Challenge Toolbox JC

Fullstack web application that fetches CSV data from an external API, processes it in the backend, and displays it in the frontend.

---

## Tech Stack

### Backend
- **Node** — >=v14
- **Express** — REST server
- **Axios** — HTTP client for consuming the external API
- **Mocha / Chai / Sinon** — testing

### Frontend
- **Node** — >=v24
- **React** — UI library
- **React Bootstrap** — components and styles

---

## Running the project

### With Docker (recommended)

Requires [Docker](https://www.docker.com/) installed.

```bash
docker-compose up --build
```

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:3000 |

**Check running containers:**
```bash
docker-compose ps
```

**Stream logs:**
```bash
docker-compose logs -f
```

**Stop containers:**
```bash
docker-compose down
```

**Test the backend directly:**
```bash
curl http://localhost:3000/files/list
```

---

### Without Docker (manual)

#### Backend

```bash
cd backend
npm install
npm start
```

Server listens on **http://localhost:3000**

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Dev server available at **http://localhost:5173**

---

## API Routes (backend)

Base URL: `http://localhost:3000`

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/files/list` | Returns the list of available files from the external API |
| GET | `/files/data` | Returns parsed data from all files |
| GET | `/files/data?fileName=file1.csv` | Returns parsed data for a specific file |

---

## Running tests

### With Docker

```bash
docker-compose exec backend npm test
```

### Without Docker

```bash
cd backend
npm test
```
