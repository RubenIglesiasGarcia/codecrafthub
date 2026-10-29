
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, "courses.json");

app.use(cors());
app.use(express.json());

const validStatuses = [
  "Not Started",
  "In Progress",
  "Completed"
];

// Create JSON file automatically
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]");
}

// Read courses
function readCourses() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

// Save courses
function saveCourses(courses) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(courses, null, 2));
}

// Validate date
function validDate(date) {
  if (typeof date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsed = new Date(date + "T00:00:00Z");
  return !isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date;
}

// Handle file errors
function handleError(res) {
  return res.status(500).json({
    error: "Unable to read or write course data"
  });
}

// GET all courses
app.get("/api/courses", (req, res) => {
  try {
    res.json(readCourses());
  } catch (error) {
    handleError(res);
  }
});

// GET course by ID
app.get("/api/courses/:id", (req, res) => {
  try {
    const courses = readCourses();
    const course = courses.find(
      c => c.id === Number(req.params.id)
    );

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    handleError(res);
  }
});

// POST create course
app.post("/api/courses", (req, res) => {
  try {
    const { name, description, target_date, status } = req.body || {};

    if (
      typeof name !== "string" || !name.trim() ||
      typeof description !== "string" || !description.trim() ||
      !target_date || !status
    ) {
      return res.status(400).json({
        error: "Missing or invalid required fields"
      });
    }

    if (!validDate(target_date)) {
      return res.status(400).json({
        error: "Invalid date. Use YYYY-MM-DD"
      });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status"
      });
    }

    const courses = readCourses();

    const newCourse = {
      id: Math.max(0, ...courses.map(c => c.id)) + 1,
      name: name.trim(),
      description: description.trim(),
      target_date,
      status,
      created_at: new Date().toISOString()
    };

    courses.push(newCourse);
    saveCourses(courses);

    res.status(201).json(newCourse);
  } catch (error) {
    handleError(res);
  }
});

// PUT update course
app.put("/api/courses/:id", (req, res) => {
  try {
    const courses = readCourses();
    const course = courses.find(
      c => c.id === Number(req.params.id)
    );

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const updates = req.body || {};
    const allowed = [
      "name", "description", "target_date", "status"
    ];

    for (const key of Object.keys(updates)) {
      if (!allowed.includes(key)) {
        return res.status(400).json({
          error: "Field cannot be updated: " + key
        });
      }
    }

    if (
      ["name", "description"].some(
        key => key in updates &&
        (typeof updates[key] !== "string" ||
         !updates[key].trim())
      )
    ) {
      return res.status(400).json({
        error: "Name and description cannot be empty"
      });
    }

    if ("target_date" in updates &&
        !validDate(updates.target_date)) {
      return res.status(400).json({
        error: "Invalid date. Use YYYY-MM-DD"
      });
    }

    if ("status" in updates &&
        !validStatuses.includes(updates.status)) {
      return res.status(400).json({
        error: "Invalid status"
      });
    }

    Object.assign(course, updates);
    saveCourses(courses);

    res.json(course);
  } catch (error) {
    handleError(res);
  }
});

// DELETE course
app.delete("/api/courses/:id", (req, res) => {
  try {
    const courses = readCourses();
    const index = courses.findIndex(
      c => c.id === Number(req.params.id)
    );

    if (index === -1) {
      return res.status(404).json({ error: "Course not found" });
    }

    const deleted = courses.splice(index, 1)[0];
    saveCourses(courses);

    res.json({
      message: "Course deleted successfully",
      course: deleted
    });
  } catch (error) {
    handleError(res);
  }
});

// Start server
app.listen(PORT, () => {
  console.log("CodeCraftHub API is starting...");
  console.log("Data will be stored in: " + DATA_FILE);
  console.log("API is available at: http://localhost:" + PORT);
});

