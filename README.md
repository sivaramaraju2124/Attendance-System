# 📌 Employee Attendance System (MERN)

A full-stack **Employee Attendance Tracking System** with role-based access for **Employees** and **Managers**.  
Employees can check in/out and view attendance history, while managers can view team stats, filter records, and export reports.

---

# 🚀 Tech Stack

### **Frontend**
- React  
- Zustand / Redux Toolkit  
- Material UI  
- Axios  
- Recharts  
- Framer Motion  

### **Backend**
- Node.js  
- Express.js  
- MongoDB / PostgreSQL  
- JWT Authentication  

---

# 📁 Project Structure

```

attendance-system/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
├── src/
├── pages/
├── components/
├── store/
├── App.js
├── AppRoutes.js
└── package.json

````

---

# 🔧 Setup Instructions

## 1️⃣ Clone the Repository

```sh
git clone https://github.com/your-username/attendance-system.git
cd attendance-system
````

---

# ⚙️ Backend Setup

```sh
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongo_url
JWT_SECRET=your_secret_key
PORT=5000
```

Start backend:

```sh
npm run dev
```

Backend URL:

```
http://localhost:5000
```

---

# 💻 Frontend Setup

```sh
cd frontend
npm install
npm start
```

Frontend URL:

```
http://localhost:3000
```

---

# 🔐 Environment Variables

### Backend (`backend/.env`)

```
MONGO_URI=
JWT_SECRET=
PORT=
```

### Frontend (optional)

```
REACT_APP_API_URL=
```

---

# ▶️ How to Run the Project

Start Backend:

```sh
cd backend
npm run dev
```

Start Frontend:

```sh
cd frontend
npm start
```

Open browser:

```
http://localhost:3000
```

---

# 📸 Screenshots

> Add your screenshots inside `/screenshots` folder.

### 🖥️ Login Page

`![Login](screenshots/login.png)`

### 👨‍💼 Employee Dashboard

`![Employee Dashboard](screenshots/employee-dashboard.png)`

### 🧑‍💼 Manager Dashboard

`![Manager Dashboard](screenshots/manager-dashboard.png)`

### 📅 Attendance History

`![History](screenshots/history.png)`

### 📊 Reports Page

`![Reports](screenshots/reports.png)`

---

# 📝 Features Summary

### Employee

* Login / Register
* Check-in / Check-out
* Monthly summary
* Weekly chart
* Attendance history (calendar/table)
* Profile

### Manager

* Dashboard
* All employees list
* Filter by employee/date/status
* Team attendance summary
* Export CSV
* Calendar view

---

# 🧪 Seed Data (Optional)

Inside `/backend/seed/` you can add:

* Sample users
* Sample attendance records

---

# 📤 Deployment (Optional)

Frontend → Netlify / Vercel
Backend → Render / Railway
Database → MongoDB Atlas

---

# 🏁 Submission

* GitHub Repo Link
* Live Demo Link (optional but recommended)
