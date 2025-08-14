# Full Stack Task Management App (React + Flask + PostgreSQL)
This is a full stack web application for managing tasks efficiently. Users can create, update, delete, and track the status of tasks. The app also provides real-time statistics such as total tasks, completed tasks, pending tasks, in-progress tasks, and completion rate.

React is used for frontend, Flask for backend and PostgreSQL as database for persistant storage.

## Tech Stack
* **Frontend:** React, Tailwind CSS
* **Backend:** Flask, Python
* **Database:** PostgreSQL, SQLAlchemy ORM
* **API:** RESTful endpoints for task management

## API Endpoints
* `GET /api/tasks`
* `POST /api/tasks`
* `PUT /api/tasks/<id>`
* `DELETE /api/tasks/<id>`
* `GET /api/stats`
* `GET /api/health` API health check endpoint


## Features
* Add, edit and delete tasks
* Track task status: pending, in-progress, completed
* Assign priority to tasks: low, medium, high
* Filter tasks based on status
* Real-time statistics and completion rate dashboard
* RESTful API with Flask
* Persistent database storage using PostgreSQL
* Responsive frontend built with React

## Installation and setup
### Step 1: Setup PostgreSQL
1. Install PostgreSQL on your system:
* **Ubuntu**
```
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

* **Fedora**
```
sudo dnf install postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl start postgresql
```

2. Create a database and user
```
sudo -i -u postgres
psql -U postgres

CREATE DATABASE taskdb;
CREATE USER myuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE taskdb TO taskuser;
```
### Step 2: Backend (Flask + SQLAlchemy)
1. Clone the repository and navigate to backend:
```
git clone https://github.com/AliFarooq77/task-manager-react-flask.git
cd backend
```

2. Activate a virtual environment:
```
source venv/bin/activate
```
3. Run the Flask server:
```
python app.py
```

### Step 3: Frontend (React)
1. Navigate to the frontend folder:
```
cd frontend
```

2. Install dependencies:
```
npm install
```

3. Start the React app:
```
npm start
```
