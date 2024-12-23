import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";

function TaskTracker() {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    deadline: "",
    status: "Pending",
    eventId: "",
  });
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch(() =>
        setError("Failed to load tasks. Please check your backend connection.")
      );

    fetch("http://localhost:5000/api/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch(() =>
        setError("Failed to load events. Please check your backend connection.")
      );
  }, []);

  const handleAddOrEditTask = () => {
    const url = editMode
      ? `http://localhost:5000/api/tasks/${currentId}`
      : "http://localhost:5000/api/tasks";
    const method = editMode ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save the task. Please try again.");
        }
        return response.json();
      })
      .then((updatedOrNewTask) => {
        if (editMode) {
          setTasks(
            tasks.map((task) =>
              task._id === currentId ? updatedOrNewTask : task
            )
          );
        } else {
          setTasks([...tasks, updatedOrNewTask]);
        }
        resetForm();
        setError(null);
      })
      .catch((err) => setError(err.message));
  };

  const handleRemoveTask = (id) => {
    fetch(`http://localhost:5000/api/tasks/${id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete the task. Please try again.");
        }
        setTasks(tasks.filter((task) => task._id !== id));
        setError(null);
      })
      .catch((err) => setError(err.message));
  };

  const resetForm = () => {
    setForm({ name: "", deadline: "", status: "Pending", eventId: "" });
    setEditMode(false);
    setShow(false);
    setError(null);
  };

  return (
    <div className="container mt-4">
      <h2>Task Tracker</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button className="mb-3" onClick={() => setShow(true)}>
        Add Task
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Deadline</th>
            <th>Status</th>
            <th>Assigned Event</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.name}</td>
              <td>{new Date(task.deadline).toLocaleDateString()}</td>
              <td>{task.status}</td>
              <td>{task.event ? task.event.name : "Unassigned"}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleAddOrEditTask(task)}
                >
                  Edit
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleRemoveTask(task._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={resetForm}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Task" : "Add Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Deadline</Form.Label>
              <Form.Control
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Assign to Event</Form.Label>
              <Form.Control
                as="select"
                value={form.eventId}
                onChange={(e) => setForm({ ...form, eventId: e.target.value })}
              >
                <option value="">Unassigned</option>
                {events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={resetForm}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddOrEditTask}>
            {editMode ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TaskTracker;
