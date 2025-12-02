# 📌 Employee Attendance System (MERN)

A full-stack **Employee Attendance Tracking System** with role-based access for **Employees** and **Managers**.

> ⚠️ **Note:** This project is deployed on free Render servers.  
> The website may take **20–40 seconds to wake up**. Please wait while it loads.

---

# 🔗 Live Demo Links

### **Frontend**
https://attendance-system-tap-academy.onrender.com

### **Backend**
https://attendance-system-spsv.onrender.com

---

# 🔑 Seed Data for Demo Testing

### **Employee Demo**
```

Email: demo@gmail.com
Password: demo@123

```

### **Manager Demo**
```

Email: demomanager@gmail.com
Password: manager@123

```

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
- MongoDB  
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
│   │    ├── users.js
│   │    └── attendance.js
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
git clone https://github.com/sivaramaraju2124/attendance-system.git
cd attendance-system
````

---

# ⚙️ Backend Setup

```sh
cd backend
npm install
```

Create `.env`:

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

### Frontend (`frontend/.env`)

```
REACT_APP_API_URL=http://localhost:5000
```

---

# ▶️ How to Run the Project

Start backend:

```sh
cd backend
npm run dev
```

Start frontend:

```sh
cd frontend
npm start
```

Open browser:

```
http://localhost:3000
```
---

# 📝 Features Summary

### **Employee**

* Login / Register
* Check-in / Check-out
* Monthly summary
* Weekly chart
* Attendance history
* Profile

### **Manager**

* Dashboard
* All employees list
* Filter by employee/date/status
* Team summary
* Export CSV
* Calendar view

---

# 📤 Deployment

* **Frontend:** Render
* **Backend:** Render
* **Database:** MongoDB Atlas
