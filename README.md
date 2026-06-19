# 📚 NoteShare - Student Notes Sharing Application

A **full-stack web application** where students can upload, browse, search, and download study notes.

> **Tech Stack:** React (Frontend) · Spring Boot + MySQL (Backend) · REST API

---

## 🗂️ Project Structure

```
notes-app/
├── backend/                          ← Spring Boot Project
│   ├── pom.xml                       ← Maven dependencies
│   └── src/main/
│       ├── java/com/notesapp/
│       │   ├── NotesApplication.java ← Main entry point
│       │   ├── config/
│       │   │   └── SecurityConfig.java
│       │   ├── controller/
│       │   │   ├── UserController.java   ← /api/users/* endpoints
│       │   │   └── NoteController.java   ← /api/notes/* endpoints
│       │   ├── model/
│       │   │   ├── User.java         ← User entity (maps to DB table)
│       │   │   └── Note.java         ← Note entity (maps to DB table)
│       │   ├── repository/
│       │   │   ├── UserRepository.java   ← DB queries for users
│       │   │   └── NoteRepository.java   ← DB queries for notes
│       │   └── service/
│       │       ├── UserService.java      ← User business logic
│       │       └── NoteService.java      ← Note business logic
│       └── resources/
│           └── application.properties   ← Config (DB URL, port, etc.)
│
├── frontend/                         ← React Project
│   ├── package.json
│   └── src/
│       ├── index.js                  ← Entry point
│       ├── App.jsx                   ← Root component + page routing
│       ├── services/
│       │   └── api.js                ← All API calls (axios)
│       ├── styles/
│       │   └── global.css            ← All CSS styles
│       ├── components/
│       │   ├── Navbar.jsx            ← Top navigation bar
│       │   └── NoteCard.jsx          ← Note card component
│       └── pages/
│           ├── HomePage.jsx          ← Landing page
│           ├── LoginPage.jsx         ← Login form
│           ├── RegisterPage.jsx      ← Registration form
│           ├── BrowsePage.jsx        ← Browse + search notes
│           ├── UploadPage.jsx        ← Upload new note
│           ├── MyNotesPage.jsx       ← Student's own notes
│           └── AdminPage.jsx         ← Admin dashboard
│
└── database/
    └── setup.sql                     ← Run this to set up MySQL
```

---

## ⚙️ Prerequisites

Before running the app, make sure you have installed:

| Tool            | Version    | Download |
|----------------|-----------|---------|
| Java JDK       | 17+       | https://adoptium.net |
| Maven          | 3.8+      | https://maven.apache.org |
| MySQL          | 8.0+      | https://dev.mysql.com/downloads |
| Node.js + npm  | 18+       | https://nodejs.org |

---

## 🚀 How to Run (Step by Step)

### Step 1: Set Up MySQL Database

1. Open **MySQL Workbench** (or MySQL CLI)
2. Run the setup script:
   ```sql
   source /path/to/notes-app/database/setup.sql
   ```
   This creates the `notes_db` database and an admin account.

### Step 2: Configure Backend

Open `backend/src/main/resources/application.properties` and update:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE
```

### Step 3: Run the Backend (Spring Boot)

```bash
cd notes-app/backend
mvn spring-boot:run
```

✅ Backend starts at: **http://localhost:8080**

### Step 4: Run the Frontend (React)

Open a **new terminal**:
```bash
cd notes-app/frontend
npm install        # Download dependencies (first time only)
npm start          # Start the React development server
```

✅ Frontend starts at: **http://localhost:3000**

---

## 🌐 API Endpoints

| Method | Endpoint                      | Description              |
|--------|------------------------------|--------------------------|
| POST   | `/api/users/register`        | Register new student     |
| POST   | `/api/users/login`           | Login                    |
| GET    | `/api/notes`                 | Get all notes            |
| GET    | `/api/notes/search?keyword=` | Search notes by keyword  |
| GET    | `/api/notes/my/{userId}`     | Get notes by uploader    |
| POST   | `/api/notes/upload`          | Upload new note (file)   |
| GET    | `/api/notes/download/{id}`   | Download note file       |
| DELETE | `/api/notes/{id}`            | Delete a note (admin)    |
| GET    | `/api/notes/stats`           | Dashboard stats          |

---

## 👤 Default Accounts

| Role    | Email              | Password   |
|---------|-------------------|------------|
| Admin   | admin@notes.com   | admin123   |
| Student | priya@example.com | student123 |

---

## ✨ Features

| Feature                  | Who Can Use  |
|--------------------------|-------------|
| Register / Login          | Everyone    |
| Browse all notes          | Everyone    |
| Search by title/subject   | Everyone    |
| Download notes            | Everyone    |
| Upload notes              | Students    |
| View my uploaded notes    | Students    |
| Admin dashboard           | Admin only  |
| Delete any note           | Admin only  |

---

## 🏗️ Architecture Overview

```
[React Frontend :3000]
        ↕ HTTP / REST API (JSON)
[Spring Boot Backend :8080]
        ↕ JPA / Hibernate
[MySQL Database :3306]
        ↕ File System
[./uploads/ folder]
```

**Request Flow for Uploading a Note:**
```
User selects file → React sends multipart POST →
NoteController receives it → NoteService saves file to disk
+ saves metadata to MySQL → Response sent back to React
```

---

## 📦 Key Dependencies

### Backend (Maven)
- `spring-boot-starter-web` — REST API
- `spring-boot-starter-data-jpa` — Database ORM (Hibernate)
- `spring-boot-starter-security` — Security config
- `mysql-connector-j` — MySQL driver
- `lombok` — Reduces boilerplate code

### Frontend (npm)
- `react` — UI framework
- `axios` — HTTP requests to backend

---

## 💡 Key Concepts Used

- **REST API** — Backend exposes endpoints; frontend calls them with HTTP
- **Spring MVC** — `@RestController`, `@GetMapping`, `@PostMapping`
- **JPA / ORM** — Java objects (`User`, `Note`) map to database tables automatically
- **Repository Pattern** — `JpaRepository` provides CRUD methods out of the box
- **Service Layer** — Business logic separated from controllers
- **Multipart File Upload** — Sending files over HTTP using `FormData`
- **Component-Based UI** — React components like `NoteCard`, `Navbar`
- **State Management** — React `useState` / `useEffect` hooks
- **CORS** — Configured to allow React (port 3000) to call Spring Boot (port 8080)

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|---------|
| `Connection refused` on login | Make sure Spring Boot backend is running on port 8080 |
| `Access denied for user 'root'` | Check `application.properties` password |
| `Table 'notes_db.users' doesn't exist` | Run `database/setup.sql` first |
| `CORS error` in browser | Make sure `@CrossOrigin(origins = "http://localhost:3000")` is on controllers |
| File upload fails | Check that the `./uploads` folder has write permissions |
