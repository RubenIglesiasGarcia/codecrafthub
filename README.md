# CodeCraftHub – Personalized Learning Platform

CodeCraftHub is a full-stack learning management application designed to help developers organize, manage, and track their learning courses.

This project was developed as part of the IBM Generative AI Software Development Final Project, using AI-assisted development tools.

## Features

- Create new learning courses.
- View all existing courses.
- View individual course details.
- Update course information and progress.
- Delete courses.
- Track course completion dates and statuses.
- Validate user input and display helpful error messages.
- Store course data persistently using a JSON file.
- Responsive dashboard with a modern user interface.
- REST API integration with loading indicators and feedback messages.

## Technologies Used

**Backend**
- Node.js
- Express.js
- CORS
- JSON file-based storage

**Frontend**
- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API

**Development Tools**
- Git and GitHub
- Bolt.new (AI-assisted UI generation)
- Generative AI for backend development and documentation
- curl for REST API testing

## Project Structure

```text
codecrafthub/
├── app.js
├── index.html
├── courses.json
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

The `node_modules` directory is generated automatically when dependencies are installed and should not be committed to GitHub.

## Installation

### Prerequisites

- Node.js and npm installed
- Git (optional)
- A modern web browser

### 1. Clone the repository

```bash
git clone https://github.com/RubenIglesiasGarcia/codecrafthub.git
cd codecrafthub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the backend server

```bash
npm start
```

The REST API will be available at:

`http://localhost:5000`

The application automatically creates `courses.json` if it does not exist.

### 4. Run the frontend

Open `index.html` in your web browser while the backend is running.

The dashboard communicates with the backend through:

`http://localhost:5000/api/courses`

Both the frontend and backend must be available for the full CRUD functionality to work.

## REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/courses | Retrieve all courses |
| GET | /api/courses/:id | Retrieve a specific course |
| POST | /api/courses | Create a new course |
| PUT | /api/courses/:id | Update an existing course |
| DELETE | /api/courses/:id | Delete an existing course |

### Course Data Model

Each course includes the following fields:

| Field | Type | Description |
|---|---|---|
| id | Number | Auto-generated course identifier |
| name | String | Required course name |
| description | String | Required course description |
| target_date | String | Target completion date (YYYY-MM-DD) |
| status | String | Not Started, In Progress, or Completed |
| created_at | String | Auto-generated creation timestamp |

## API Usage Examples

### Create a Course

```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JavaScript Fundamentals",
    "description": "Learn modern JavaScript",
    "target_date": "2026-12-31",
    "status": "Not Started"
  }'
```

Expected response: `201 Created`

### Get All Courses

```bash
curl http://localhost:5000/api/courses
```

Expected response: `200 OK`

### Get a Course by ID

```bash
curl http://localhost:5000/api/courses/1
```

Expected response: `200 OK`, or `404 Not Found` if the course does not exist.

### Update a Course

```bash
curl -X PUT http://localhost:5000/api/courses/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "In Progress"}'
```

Expected response: `200 OK`

### Delete a Course

```bash
curl -X DELETE http://localhost:5000/api/courses/1
```

Expected response: `200 OK`

## Validation and Error Handling

The backend validates required fields and restricts course status to the following values:

- Not Started
- In Progress
- Completed

The API returns appropriate HTTP status codes:

| Status Code | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Course successfully created |
| 400 | Invalid or missing request data |
| 404 | Course not found |
| 500 | Internal server or file storage error |

All API errors are returned as JSON responses.

## Frontend Dashboard

The CodeCraftHub dashboard provides a simple interface for managing learning courses.

Users can:

1. Fill out a form to create a course.
2. View courses in a responsive layout.
3. Edit course information and progress.
4. Delete courses.
5. Receive feedback on successful and unsuccessful operations.

The frontend uses JavaScript's Fetch API to communicate with the Express backend.

## Testing

The backend was tested using curl to validate:

- Course creation using POST.
- Course retrieval using GET.
- Course updates using PUT.
- Course deletion using DELETE.
- Missing course handling with HTTP 404.
- Invalid input handling with HTTP 400.
- JSON file persistence.

The frontend was manually tested through the browser to verify the CRUD workflow and backend communication.

## Troubleshooting

**Cannot find module 'express'**

Install the project dependencies:

```bash
npm install
```

**npm registry connection error**

If npm is configured to use an unavailable private registry,
