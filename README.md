# 🌊 Seapark LSS

**Seapark LSS (Seapark Life Support System)** is a management application designed for **Boudewijn Seapark** in Belgium. The app is created by 3 students of **ArteveldeHogeschool** as a school project. The application aims to help track and manage various tasks and measurements within the park, focusing on tasks related to water management (pumps, filters, etc.) and the associated measurements (e.g., water parameters).

---

## 🛠️ Technologies Used

### 🔧 Backend:
- `bcrypt`: "^5.1.1" (for hashing passwords)  
- `cookie-parser`: "^1.4.7" (for cookie management)  
- `dotenv`: "^16.4.7" (to manage environment variables)  
- `express`: "^4.21.2" (Web framework)  
- `express-ejs-layouts`: "^2.5.1" (Layout manager for EJS)  
- `express-session`: "^1.18.1" (Session management)  
- `express-validator`: "^7.2.1" (For request validation)  
- `knex`: "^3.1.0" (SQL query builder)  
- `node-cron`: "^4.1.0" (For scheduling tasks)  
- `objection`: "^3.1.5" (SQL ORM)  
- `sqlite3`: "^5.1.7" (Database engine)  

### 🎨 Frontend:
- Regular CSS and JavaScript

---

## 🚀 Features

### 🔐 1. User Authentication & Authorization

#### 🔑 Login System:
- Users log in using a unique pin code, with authentication valid for 10 hours.
- The app displays all users on the login screen, making it easy to choose and log in.

#### 👥 Role-Based Access Control:
- **Admin**: Can manage users, departments, tasks, reference values, and more.  
- **Regular User**: Limited to viewing tasks and logging measurements. They are also notified if there are any abnormal measurements or errors.

---

### 🛡️ 2. Admin Features

#### 👤 User Management:
- Admins can add, update, or delete users (soft delete only). This includes editing user details like name, email, and pin code.

#### 🏢 Department Management:
- Admins can manage departments, including adding, updating, and deleting them. Each department has a detail page showing linked sub-departments.

#### ✅ Task Management:
- Admins can view and manage all active tasks. Tasks can be linked to departments, subdepartments, pumps, or filters. Admins can add new tasks, update existing ones, or soft delete those that are no longer needed.

#### 🧪 Reference Values Management:
- Admins can manage parameters related to water basin measurements. This includes adding new parameters, editing their min/max values, and deleting them.

#### 📊 Statistics Page:
- Admins can filter measurements by department, subdepartment, date, or parameter. The filtered data can also be exported to Excel.

#### 📁 History Page:
- Admins can track the completion of tasks. They can filter tasks based on their frequency or specific dates.

---

### 👨‍🔧 3. Regular User Features

#### 📋 Task Overview:
- Regular users can view all tasks across departments, subdepartments, pumps, and filters. They have access to the task status and can log their progress.

#### 📝 Measurement Logging:
- Regular users can log the measurements of water parameters for different subdepartments. Notifications will be sent if measurements go out of the acceptable range.

#### 🚨 Task & Measurement Notifications:
- Regular users are notified when there are bad measurements or other errors detected in the system.

---

## 🗂️ Data Management

### 🧼 Soft Deletes:
- All deletions in the system are soft deletes, meaning data is never permanently removed but rather marked as inactive. This ensures no data is lost and can always be reactivated.

---

## 🔮 Pending Features

### 📌 Extra Filtering on History Page:
- A future update will allow filtering tasks based on departments, subdepartments, or other entities.
