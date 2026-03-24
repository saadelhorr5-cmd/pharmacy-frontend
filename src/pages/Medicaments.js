import { useEffect, useState } from "react";
import axios from "axios";

function Medicaments() {

  const [medicaments, setMedicaments] = useState([]);
  const [form, setForm] = useState({
    nom: "",
    prix: "",
    quantite: "",
    date_expiration: ""
  });

  const [editId, setEditId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const fetchMedicaments = () => {
    axios.get("http://localhost:8000/api/medicaments", getAuthHeaders())
      .then(res => setMedicaments(res.data));
  };

  useEffect(() => {
    fetchMedicaments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      axios.put(`http://localhost:8000/api/medicaments/${editId}`, form, getAuthHeaders())
        .then(() => {
          fetchMedicaments();
          setEditId(null);
        });
    } else {
      axios.post("http://localhost:8000/api/medicaments", form, getAuthHeaders())
        .then(() => fetchMedicaments());
    }

    setForm({ nom: "", prix: "", quantite: "", date_expiration: "" });
  };

  const deleteMedicament = (id) => {
    axios.delete(`http://localhost:8000/api/medicaments/${id}`, getAuthHeaders())
      .then(() => fetchMedicaments());
  };

  const editMedicament = (m) => {
    setForm(m);
    setEditId(m.id);
  };

  const [search, setSearch] = useState("");


  if (user?.role !== "admin") return <h2>Access Denied</h2>;
  


return (
  <div className="p-6">

    <h1 className="text-2xl font-bold mb-6">💊 Medicaments</h1>

    {/* FORM */}
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow mb-6 grid grid-cols-4 gap-4"
    >
      <input
        className="border p-2 rounded"
        name="nom"
        placeholder="Nom"
        value={form.nom}
        onChange={handleChange}
      />

      <input
        className="border p-2 rounded"
        name="prix"
        placeholder="Prix"
        value={form.prix}
        onChange={handleChange}
      />

      <input
        className="border p-2 rounded"
        name="quantite"
        placeholder="Quantité"
        value={form.quantite}
        onChange={handleChange}
      />

      <input
        className="border p-2 rounded"
        type="date"
        name="date_expiration"
        value={form.date_expiration}
        onChange={handleChange}
      />

      <button
        className="col-span-4 !bg-blue-500 text-white py-2 rounded hover:!bg-blue-600 transition"
        type="submit"
      >
        {editId ? "Update" : "Ajouter"}
      </button>
    </form>

    {/* TABLE */}
    <div className="bg-white p-6 rounded-2xl shadow">

      <h3 className="text-lg font-semibold mb-4">Liste des medicaments</h3>

       <input
            type="text"
            placeholder="🔍 Rechercher médicament..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-4 p-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
        />

      <table className="w-full">

        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Nom</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {medicaments
              .filter(m =>
                m.nom.toLowerCase().startsWith(search.toLowerCase())
              )
              .map(m => (
            <tr key={m.id} className="border-b hover:bg-gray-50">

              <td className="py-2">{m.nom}</td>

              <td>{m.prix} DH</td>

              <td>{m.quantite}</td>

              <td>
                <span className={`px-2 py-1 rounded text-sm ${
                  m.quantite < 5
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}>
                  {m.quantite < 5 ? "Faible" : "OK"}
                </span>
              </td>

              <td className="space-x-2">

                <button
                  onClick={() => editMedicament(m)}
                  className="bg-yellow-400 px-2 py-1 rounded text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteMedicament(m.id)}
                  className="bg-red-500 px-2 py-1 rounded text-white"
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

export default Medicaments;