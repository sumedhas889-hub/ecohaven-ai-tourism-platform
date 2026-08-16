"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthGuard from "../authGuard";

const API = "http://localhost:5000";

export default function Destinations() {
  const [homestays, setHomestays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    location: "",
    price: "",
  });

  const [editingId, setEditingId] = useState(null);

  // =========================
  // READ
  // =========================
  const fetchHomestays = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API}/api/homestays`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load homestays");
      }

      setHomestays(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomestays();
  }, []);

  // =========================
  // FORM
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // CREATE / UPDATE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!form.name.trim() || !form.location.trim() || !form.price) {
      setError("Please fill all fields.");
      return;
    }

    if (Number(form.price) <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    try {
      setSaving(true);

      const url = editingId
        ? `${API}/api/homestays/${editingId}`
        : `${API}/api/homestays`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          location: form.location.trim(),
          price: Number(form.price),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Operation failed");
      }

      setMessage(
        editingId
          ? "Homestay updated successfully!"
          : "Homestay created successfully!"
      );

      setForm({
        name: "",
        location: "",
        price: "",
      });

      setEditingId(null);

      await fetchHomestays();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (homestay) => {
    setEditingId(homestay.id);

    setForm({
      name: homestay.name,
      location: homestay.location,
      price: homestay.price,
    });

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this homestay?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `${API}/api/homestays/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setMessage("Homestay deleted successfully!");

      await fetchHomestays();
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const cancelEdit = () => {
    setEditingId(null);

    setForm({
      name: "",
      location: "",
      price: "",
    });

    setError("");
    setMessage("");
  };

  return (
    <AuthGuard>
      <>
        <Navbar />

        <main className="min-h-screen bg-[#F5F7F2] p-6 md:p-10">
          <div className="mx-auto max-w-7xl">

            {/* HEADER */}
            <h1 className="text-4xl font-bold text-[#2D4F3A]">
              Destinations
            </h1>

            <p className="mt-3 text-gray-600">
              Explore and manage eco-friendly homestays.
            </p>

            {/* FORM */}
            <div className="mt-8 rounded-xl bg-white p-6 shadow">
              <h2 className="text-2xl font-bold text-[#2D4F3A]">
                {editingId ? "Update Homestay" : "Add Homestay"}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="mt-5 grid gap-4 md:grid-cols-3"
              >
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Homestay name"
                  className="rounded-lg border border-gray-300 p-3 text-gray-800"
                />

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Location"
                  className="rounded-lg border border-gray-300 p-3 text-gray-800"
                />

                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Price"
                  className="rounded-lg border border-gray-300 p-3 text-gray-800"
                />

                <div className="flex gap-3 md:col-span-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-[#2D4F3A] px-6 py-3 font-semibold text-white disabled:opacity-60"
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                      ? "Update Homestay"
                      : "Create Homestay"}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {error && (
                <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-600">
                  {error}
                </div>
              )}

              {message && (
                <div className="mt-4 rounded-lg bg-green-50 p-4 text-green-700">
                  {message}
                </div>
              )}
            </div>

            {/* LOADING */}
            {loading && (
              <div className="mt-8 rounded-xl bg-white p-8 text-center shadow">
                <p className="text-gray-600">
                  Loading homestays...
                </p>
              </div>
            )}

            {/* EMPTY STATE */}
            {!loading &&
              !error &&
              homestays.length === 0 && (
                <div className="mt-8 rounded-xl bg-white p-10 text-center shadow">
                  <h2 className="text-xl font-bold text-[#2D4F3A]">
                    No homestays found
                  </h2>

                  <p className="mt-2 text-gray-600">
                    Create your first eco-friendly homestay above.
                  </p>
                </div>
              )}

            {/* HOMESTAYS */}
            {!loading &&
              homestays.length > 0 && (
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {homestays.map((homestay) => (
                    <div
                      key={homestay.id}
                      className="rounded-xl bg-white p-6 shadow"
                    >
                      <h2 className="text-xl font-bold text-[#2D4F3A]">
                        {homestay.name}
                      </h2>

                      <p className="mt-3 text-gray-600">
                        📍 {homestay.location}
                      </p>

                      <p className="mt-2 font-semibold text-gray-700">
                        ₹{homestay.price}
                      </p>

                      <div className="mt-5 flex gap-3">
                        <button
                          onClick={() => handleEdit(homestay)}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(homestay.id)
                          }
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </main>

        <Footer />
      </>
    </AuthGuard>
  );
}