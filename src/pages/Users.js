import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "pharmacien"
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const { t } = useTranslation();

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const fetchUsers = useCallback(() => {
    axios.get("http://localhost:8000/api/users", getAuthHeaders())
      .then(res => setUsers(res.data));
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const deleteUser = (id) => {
    axios.delete(`http://localhost:8000/api/users/${id}`, getAuthHeaders())
      .then(() => fetchUsers());
  };

  const editUser = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role
    });
    setEditingUserId(user.id);
  };

  const addUser = (e) => {
    e.preventDefault();

    if (editingUserId) {
      axios.put(
        `http://localhost:8000/api/users/${editingUserId}`,
        form,
        getAuthHeaders()
      )
        .then(() => {
          alert(t("usersPage.updated"));
          fetchUsers();
          setForm({ name: "", email: "", password: "", role: "pharmacien" });
          setEditingUserId(null);
        });
    } else {
      axios.post(
        "http://localhost:8000/api/users",
        form,
        getAuthHeaders()
      )
        .then(() => {
          alert(t("usersPage.added"));
          fetchUsers();
          setForm({ name: "", email: "", password: "", role: "pharmacien" });
        });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">{t("usersPage.title")}</h1>

      <form onSubmit={addUser} className="bg-white p-6 rounded-2xl shadow mb-6 space-y-3">
        <input
          name="name"
          placeholder={t("name")}
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="email"
          placeholder={t("email")}
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="password"
          placeholder={t("password")}
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="pharmacien">{t("pharmacist")}</option>
          <option value="admin">{t("admin")}</option>
        </select>

        <button className="bg-indigo-500 text-white px-4 py-2 rounded">
          {editingUserId ? t("edit") : t("add")}
        </button>
      </form>

      <div className="bg-white p-6 rounded-2xl shadow">
        {users.map(u => (
          <div key={u.id} className="flex justify-between border-b py-2">
            <div>
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm text-gray-500">{u.email} - {u.role}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => editUser(u)}
                className="text-blue-500"
              >
                {t("edit")}
              </button>

              <button
                onClick={() => deleteUser(u.id)}
                className="text-red-500"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Users;
