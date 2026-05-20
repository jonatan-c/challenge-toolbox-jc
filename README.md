# Challenge Toolbox JC

Aplicación web fullstack que consume una API externa de datos CSV, los procesa en el backend y los visualiza en el frontend.

---

## Tecnologías

### Backend
- **Node** — v14+
- **Express** — servidor REST
- **Axios** — cliente HTTP para consumir la API externa
- **Mocha / Chai / Nock / Sinon** — testing

### Frontend
- **Node** — v24+
- **React** — librería de UI
- **React Bootstrap** — componentes y estilos

---

## Levantar el proyecto

### Con Docker (recomendado)

Requiere tener [Docker](https://www.docker.com/) instalado.

```bash
docker-compose up --build
```

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:3000 |

**Verificar que los contenedores están corriendo:**
```bash
docker-compose ps
```

**Ver logs en tiempo real:**
```bash
docker-compose logs -f
```

**Detener los contenedores:**
```bash
docker-compose down
```

**Probar el backend directamente:**
```bash
curl http://localhost:3000/files/list
```

---

### Sin Docker (manual)

#### Backend

```bash
cd backend
npm install
npm start
```

El servidor queda escuchando en **http://localhost:3000**

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

El servidor de desarrollo queda disponible en **http://localhost:5173**.

---

## Rutas del API (backend)

Base URL: `http://localhost:3000`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/files/list` | Lista los archivos disponibles en la API externa |
| GET | `/files/data` | Retorna los datos de todos los archivos procesados |
| GET | `/files/data?fileName=file1.csv` | Retorna los datos de un archivo específico |


---

## Correr tests

### En un contenedor ya corriendo

```bash
docker-compose exec backend npm test
```

### Sin Docker

```bash
cd backend
npm test
```

