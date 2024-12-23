import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";

function EventManagement() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    date: "",
  });
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch(() =>
        setError("Failed to load events. Please check your backend connection.")
      );
  }, []);

  const handleAddOrEditEvent = () => {
    const url = editMode
      ? `http://localhost:5000/api/events/${currentId}`
      : "http://localhost:5000/api/events";
    const method = editMode ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save the event. Please try again.");
        }
        return response.json();
      })
      .then((updatedOrNewEvent) => {
        if (editMode) {
          setEvents(
            events.map((event) =>
              event._id === currentId ? updatedOrNewEvent : event
            )
          );
        } else {
          setEvents([...events, updatedOrNewEvent]);
        }
        resetForm();
        setError(null);
      })
      .catch((err) => setError(err.message));
  };

  const handleRemoveEvent = (id) => {
    fetch(`http://localhost:5000/api/events/${id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete the event. Please try again.");
        }
        setEvents(events.filter((event) => event._id !== id));
        setError(null);
      })
      .catch((err) => setError(err.message));
  };

  const resetForm = () => {
    setForm({ name: "", description: "", location: "", date: "" });
    setEditMode(false);
    setShow(false);
    setError(null);
  };

  return (
    <div className="container mt-4">
      <h2>Event Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button className="mb-3" onClick={() => setShow(true)}>
        Add Event
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Location</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id}>
              <td>{event.name}</td>
              <td>{event.description}</td>
              <td>{event.location}</td>
              <td>{new Date(event.date).toLocaleDateString()}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleAddOrEditEvent(event)}
                >
                  Edit
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleRemoveEvent(event._id)}
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
          <Modal.Title>{editMode ? "Edit Event" : "Add Event"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={resetForm}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddOrEditEvent}>
            {editMode ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EventManagement;
