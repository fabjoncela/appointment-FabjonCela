import React, { useState, useEffect } from "react";
import api from "../../utils/axios";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [status, setStatus] = useState("request");

  // Fetch all appointments on component mount
  useEffect(() => {
    api
      .get("/admin/appointments")
      .then((res) => setAppointments(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Handle editing of appointment
  const handleEdit = (appointment) => {
    setIsEditing(true);
    setEditId(appointment.id);
    setStatus(appointment.status); // Set status from the appointment
  };

  // Handle updating of appointment status
  const handleUpdate = (e) => {
    e.preventDefault();

    const updatedAppointment = { status };

    api
      .put(`/admin/appointments/${editId}`, updatedAppointment)
      .then((res) => {
        setAppointments(
          appointments.map((appointment) =>
            appointment.id === editId ? { ...appointment, ...updatedAppointment } : appointment
          )
        );
        resetForm();
      })
      .catch((err) => console.log(err));
  };

  // Handle deletion of appointment
  const handleDelete = (id) => {
    api
      .delete(`/admin/appointments/${id}`)
      .then((res) => {
        setAppointments(appointments.filter((appointment) => appointment.id !== id));
      })
      .catch((err) => console.log(err));
  };

  // Reset form state after edit
  const resetForm = () => {
    setStatus("request");
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center text-indigo-600 mb-8">Manage Appointments</h1>

      {/* Edit Form (Visible when editing an appointment) */}
      {isEditing && (
        <form onSubmit={handleUpdate} className="mb-6 p-6 bg-white rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="request">Request</option>
              <option value="confirmed">Confirmed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Update Appointment
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Appointments Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto text-sm text-left text-gray-600">
          <thead className="bg-indigo-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-indigo-700">ID</th>
              <th className="px-6 py-4 font-semibold text-indigo-700">User</th>
              <th className="px-6 py-4 font-semibold text-indigo-700">Provider</th>
              <th className="px-6 py-4 font-semibold text-indigo-700">Service</th>
              <th className="px-6 py-4 font-semibold text-indigo-700">Date</th>
              <th className="px-6 py-4 font-semibold text-indigo-700">Start Time</th>
              <th className="px-6 py-4 font-semibold text-indigo-700">End Time</th>
              <th className="px-6 py-4 font-semibold text-indigo-700">Status</th>
              <th className="px-6 py-4 font-semibold text-indigo-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="border-b hover:bg-indigo-50">
                <td className="px-6 py-4">{appointment.id}</td>
                <td className="px-6 py-4">{appointment.user}</td>
                <td className="px-6 py-4">{appointment.provider}</td>
                <td className="px-6 py-4">{appointment.service}</td>
                <td className="px-6 py-4">{appointment.date}</td>
                <td className="px-6 py-4">{appointment.start_time}</td>
                <td className="px-6 py-4">{appointment.end_time}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-white ${
                      appointment.status === "request"
                        ? "bg-yellow-500"
                        : appointment.status === "confirmed"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(appointment)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(appointment.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminAppointments;
