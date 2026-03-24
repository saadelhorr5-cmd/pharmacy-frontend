import { useEffect, useState } from "react";
import axios from "axios";

function Users() {

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "pharmacien"
  });

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const fetchUsers = () => {
    axios.get("http://localhost:8000/api/users", getAuthHeaders())
      .then(res => setUsers(res.data));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addUser = (e) => {
    e.preventDefault();

    axios.post("http://localhost:8000/api/users", form, getAuthHeaders())
      .then(() => {
        fetchUsers();
        setForm({ name: "", email: "", password: "", role: "pharmacien" });
      });
  };

  const deleteUser = (id) => {
    axios.delete(`http://localhost:8000/api/users/${id}`, getAuthHeaders())
      .then(() => fetchUsers());
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">👥 Gestion des utilisateurs</h1>

      {/* FORM */}
      <form onSubmit={addUser} className="bg-white p-6 rounded-2xl shadow mb-6 space-y-3">

        <input name="name" placeholder="Nom" value={form.name} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full p-2 border rounded" />

        <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="pharmacien">Pharmacien</option>
          <option value="admin">Admin</option>
        </select>

        <button className="bg-indigo-500 text-white px-4 py-2 rounded">
          Ajouter
        </button>

      </form>

      {/* LIST */}
      <div className="bg-white p-6 rounded-2xl shadow">

        {users.map(u => (
          <div key={u.id} className="flex justify-between border-b py-2">

            <div>
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm text-gray-500">{u.email} - {u.role}</p>
            </div>

            <button
              onClick={() => deleteUser(u.id)}
              className="text-red-500"
            >
              Delete
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Users;