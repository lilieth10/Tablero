# 📝 Kanban Board Application

Este proyecto es una aplicación de tablero Kanban similar a Trello. Permite gestionar tareas mediante columnas personalizables, tarjetas móviles y funcionalidad de arrastrar y soltar. Además, soporta colaboración en tiempo real utilizando WebSocket.

---

## 🎯 **Objetivo**

El objetivo de este proyecto es proporcionar una solución completa para la gestión de tareas mediante un tablero Kanban con las siguientes características:

- ✅ Gestión de columnas y tarjetas.
- ✅ Colaboración en tiempo real utilizando WebSocket.
- ✅ Funcionalidad de arrastrar y soltar fluida.
- ✅ Notificaciones en tiempo real.

---

## 🛠️ **Tecnologías Utilizadas**

### **Frontend**
- **React.js**: Para la construcción de la interfaz.
- **Material-UI**: Para el diseño y los componentes.
- **React Beautiful DnD**: Para la funcionalidad de arrastrar y soltar.
- **React Toastify**: Para notificaciones en tiempo real.

### **Backend**
- **NestJS**: Framework para construir aplicaciones escalables y modulares.
- **Socket.IO**: Para la colaboración en tiempo real mediante WebSocket.
- **MongoDB**: Base de datos NoSQL para el almacenamiento de datos.
- **Mongoose**: ODM para interactuar con MongoDB.

---

## 💡 **Características**

### **Gestión de Columnas**
- Crear, editar y eliminar columnas.
- Relación con tarjetas para organizar tareas.

### **Gestión de Tarjetas**
- Crear, mover, editar y eliminar tarjetas.
- Relación con columnas para organizar tareas.

### **Colaboración en Tiempo Real**
- Sincronización en tiempo real mediante WebSocket:
  - **`columnAdded`**: Notifica cuando se agrega una columna.
  - **`cardMoved`**: Notifica cuando se mueve una tarjeta.
  - **`cardUpdated`**: Notifica cuando se actualiza una tarjeta.

---

## 📦 **Instalación**

### **Requisitos Previos**
- [Node.js](https://nodejs.org/) (v18 o superior)
- [MongoDB](https://www.mongodb.com/) (local o en la nube)

### **Pasos**
1. Clona este repositorio:
   ```bash
   git clone https://github.com/lilieth10/kanban-board.git
   cd kanban-board
   ```

2. Configura las variables de entorno:
   - **Frontend** (`frontend-kanban/.env`):
     ```env
     PORT=3001
     REACT_APP_API_URL=http://localhost:3000
     ```
   - **Backend** (`BACKEND-KANBAN/.env`):
     ```env
     MONGODB_URI=mongodb://localhost:27017/kanban
     PORT=3000
     ```

3. Instala las dependencias:
   - **Frontend**:
     ```bash
     cd frontend-kanban
     npm install
     npm start
     ```
   - **Backend**:
     ```bash
     cd BACKEND-KANBAN
     npm install
     npm run start:dev
     ```

4. Abre el navegador en `http://localhost:3001`.

---

## 📂 **Estructura del Proyecto**

```plaintext
kanban-board/
├── frontend-kanban/       # Código del frontend
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── types/         # Tipos TypeScript
│   │   ├── api/           # Llamadas a la API
│   │   └── index.tsx      # Punto de entrada del frontend
│   └── package.json       # Configuración del frontend
├── BACKEND-KANBAN/        # Código del backend
│   ├── src/
│   │   ├── modules/       # Módulos de NestJS
│   │   ├── main.ts        # Punto de entrada del backend
│   │   └── app.module.ts  # Módulo principal de NestJS
│   └── package.json       # Configuración del backend
└── README.md              # Documentación del proyecto
```

---

## 🚀 **Funcionalidades Clave**

1. **Arrastrar y Soltar**:
   - Implementado con `react-beautiful-dnd` para mover tarjetas entre columnas.

2. **Colaboración en Tiempo Real**:
   - Cambios reflejados instantáneamente para todos los usuarios conectados.

3. **Notificaciones**:
   - Notificaciones visuales para acciones como mover tarjetas o eliminar columnas.

---

## 🧪 **Pruebas**

### **Backend**
- Ejecuta las pruebas del backend:
  ```bash
  cd BACKEND-KANBAN
  npm run test
  ```

### **Frontend**
- Configurado con `@testing-library/react` para pruebas de componentes.


---

💻 **Autor**  
Desarrollado por lilieth. Si tienes preguntas, no dudes en contactarme. 😊