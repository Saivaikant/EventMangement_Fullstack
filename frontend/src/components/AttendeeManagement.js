import React, { useState, useEffect } from "react";
import { Table, Form, Button, Modal, Alert } from "react-bootstrap";

function AttendeeManagement() {
  const [attendees, setAttendees] = useState([]);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", eventId: "" });
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/attendees")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load attendees. Please try again.");
        }
        return response.json();
      })
      .then((data) => setAttendees(data))
      .catch((err) => setError(err.message));

    fetch("http://localhost:5000/api/events")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load events. Please try again.");
        }
        return response.json();
      })
      .then((data) => setEvents(data))
      .catch((err) => setError(err.message));
  }, []);

  const handleAddOrEditAttendee = () => {
    const url = editMode
      ? `http://localhost:5000/api/attendees/${currentId}`
      : "http://localhost:5000/api/attendees";
    const method = editMode ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save the attendee. Please try again.");
        }
        return response.json();
      })
      .then((updatedOrNewAttendee) => {
        if (editMode) {
          setAttendees(
            attendees.map((attendee) =>
              attendee._id === currentId ? updatedOrNewAttendee : attendee
            )
          );
        } else {
          setAttendees([...attendees, updatedOrNewAttendee]);
        }
        resetForm();
        setError(null);
      })
      .catch((err) => setError(err.message));
  };

  const handleEdit = (attendee) => {
    setEditMode(true);
    setCurrentId(attendee._id);
    setForm({
      name: attendee.name,
      email: attendee.email,
      eventId: attendee.event ? attendee.event._id : "",
    });
    setShow(true);
  };

  const handleRemoveAttendee = (id) => {
    fetch(`http://localhost:5000/api/attendees/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete the attendee. Please try again.");
        }
        setAttendees(attendees.filter((attendee) => attendee._id !== id));
        setError(null);
      })
      .catch((err) => setError(err.message));
  };

  const resetForm = () => {
    setForm({ name: "", email: "", eventId: "" });
    setEditMode(false);
    setShow(false);
  };

  return (
    <div className="container mt-4">
      <h2>Attendee Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button className="mb-3" onClick={() => setShow(true)}>
        Add Attendee
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Assigned Event</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {attendees.map((attendee) => (
            <tr key={attendee._id}>
              <td>{attendee.name}</td>
              <td>{attendee.email}</td>
              <td>{attendee.event ? attendee.event.name : "Unassigned"}</td>
              <td>
                <Button variant="info" onClick={() => handleEdit(attendee)}>
                  Edit
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleRemoveAttendee(attendee._id)}
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
          <Modal.Title>
            {editMode ? "Edit Attendee" : "Add Attendee"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter attendee name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter attendee email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
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
          <Button variant="primary" onClick={handleAddOrEditAttendee}>
            {editMode ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AttendeeManagement;
