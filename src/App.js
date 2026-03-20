import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [medicaments, setMedicaments] = useState([]);

  const [editId, setEditId] = useState(null);

  const editMedicament = (med) => {
    setForm({
      nom: med.nom,
      prix: med.prix,
      quantite: med.quantite,
      date_expiration: med.date_expiration
    });

    setEditId(med.id);
  };

  const [cart, setCart] = useState([]);

  const [form, setForm] = useState({
    nom: "",
    prix: "",
    quantite: "",
    date_expiration: ""
  });

  const deleteMedicament = (id) => {
  axios.delete(`http://localhost:8000/api/medicaments/${id}`)
    .then(() => {
      fetchMedicaments();
    });
  };

  // Fetch data
  useEffect(() => {
    fetchMedicaments();
  }, []);
  


  const fetchMedicaments = () => {
    axios.get("http://localhost:8000/api/medicaments")
      .then(res => setMedicaments(res.data));
  };

  // Handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      axios.put(`http://localhost:8000/api/medicaments/${editId}`, form)
        .then(() => {
          setEditId(null);
          fetchMedicaments();
        });
    } else {
      axios.post("http://localhost:8000/api/medicaments", form)
        .then(() => {
          fetchMedicaments();
        });
    }
  };

  // addToCart 
  const addToCart = (med) => {
    const exist = cart.find(item => item.id === med.id);

    if (exist) {
      setCart(cart.map(item =>
        item.id === med.id
          ? { ...item, quantite: item.quantite + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...med, quantite: 1 }]);
    }
  };
  // removeFromCart 
  const removeFromCart = (id) => {
  setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantite = (id, value) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantite: value } : item
    ));
  };

  const total = cart.reduce((sum, item) => {
    return sum + item.prix * item.quantite;
  }, 0);
  
   // validerVente
  const validerVente = () => {
  if (cart.length === 0) {
    alert("Panier vide !");
    return;
  }

  axios.post("http://localhost:8000/api/ventes", { cart })
    .then(() => {
      alert("Vente réussie !");
      setCart([]);
      fetchMedicaments();
    })
    .catch(err => {
      alert(err.response.data.error);
    });
  };

  return (
    <div>
      <h1>Liste des Medicaments</h1>

      {/* FORM */}
  <form onSubmit={handleSubmit}>
  <input
    name="nom"
    placeholder="Nom du médicament"
    value={form.nom}
    onChange={handleChange}
  />

  <input
    name="prix"
    placeholder="Prix (DH)"
    value={form.prix}
    onChange={handleChange}
  />

  <input
    name="quantite"
    placeholder="Quantité"
    value={form.quantite}
    onChange={handleChange}
  />

  <input
    type="date"
    name="date_expiration"
    value={form.date_expiration}
    onChange={handleChange}
  />

  <button type="submit">
    {editId ? "Update" : "Ajouter"}
  </button>
  </form>

      <hr />

      {/* LIST */}
      <ul>
        {medicaments
          .filter(m => m.quantite > 0)
          .map(m => (
            <li key={m.id}>
              {m.nom} - {m.prix} DH - Stock: {m.quantite}
              {m.quantite <= 5 && <span style={{color: "red"}}> ⚠️ Low Stock</span>}
              <button onClick={() => addToCart(m)}>Ajouter Panier</button>
              <button onClick={() => deleteMedicament(m.id)}>Delete</button>
              <button onClick={() => editMedicament(m)}>Edit</button>
            </li>
        ))}
      </ul>
       {/* PANIER  */}
      <h2>Panier</h2>
      <ul>
        {cart.map(item => (
          <li key={item.id}>
            {item.nom} - {item.prix} DH

            <input
              type="number"
              value={item.quantite}
              onChange={(e) => updateQuantite(item.id, e.target.value)}
              style={{ width: "50px", marginLeft: "10px" }}
            />
            <button onClick={() => removeFromCart(item.id)}>Supprimer</button> 
            
          </li>
        ))}
      </ul>
      <h3>Total: {total} DH</h3>
      <button onClick={validerVente}>
        Valider Vente
      </button>

  

    </div>
  );

  
}

export default App;