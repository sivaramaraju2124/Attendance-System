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

### 🖥️ Login Page

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/973074e7-d1bb-4b2c-b577-c9c7ed82d215" />

### 🖥️ Register Page
<img width="1366" height="768" alt="register" src="https://github.com/user-attachments/assets/2eaa335f-2960-432b-bdf9-5465c1e3b507" />


### 👨‍💼 Employee Dashboard
<img width="1366" height="768" alt="employee-dashboard" src="https://github.com/user-attachments/assets/2f8961f6-e32b-474e-b410-a5569762d024" />


### 🧑‍💼 Manager Dashboard

<img width="1366" height="768" alt="manager-dashboard" src="https://github.com/user-attachments/assets/ceb05a8e-7d3b-454d-93a5-1bba05147c86" />

### 📅 Attendance History
<img width="1366" height="768" alt="attendance-history" src="https://github.com/user-attachments/assets/a2d2c080-987f-4b9e-8cf7-08b83c2540f2" />


### 📅 <Monthly Summary
<img width="1366" height="768" alt="monthly-summary" src="https://github.com/user-attachments/assets/b6934d83-a9be-4d2f-ba4b-467886b083f8" />

### 🧑‍💼 All Employees
<img width="1366" height="768" alt="all-employees" src="https://github.com/user-attachments/assets/7394ff7d-05d4-4056-8e86-6a7df14eb1bc" />

### 📊 Reports Page
<img width="1366" height="768" alt="reports" src="https://github.com/user-attachments/assets/dd367381-0b9c-4236-8668-98be0fe36b3e" />

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

- Frontend → Netlify / Vercel
- Backend → Render / Railway
- Database → MongoDB Atlas

---

# 🏁 Submission

* GitHub Repo Link
* Live Demo Link (optional but recommended)
