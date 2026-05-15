import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

function Ventes() {
  const [medicaments, setMedicaments] = useState([]);
  const [cart, setCart] = useState([]);
  const [ventes, setVentes] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const { t } = useTranslation();

  const user = JSON.parse(localStorage.getItem("user"));

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const fetchMedicaments = useCallback(() => {
    axios.get("http://localhost:8000/api/medicaments", getAuthHeaders())
      .then(res => setMedicaments(res.data));
  }, []);

  const fetchVentes = useCallback(() => {
    axios.get("http://localhost:8000/api/ventes", getAuthHeaders())
      .then(res => setVentes(res.data));
  }, []);

  useEffect(() => {
    fetchMedicaments();
    fetchVentes();
  }, [fetchMedicaments, fetchVentes]);

  const addToCart = (m) => {
    const exist = cart.find(item => item.id === m.id);

    if (exist) {
      setCart(cart.map(item =>
        item.id === m.id ? { ...item, quantite: item.quantite + 1 } : item
      ));
    } else {
      setCart([...cart, { ...m, quantite: 1 }]);
    }
  };

  const increase = (id) => {
    setCart(cart.map(item => {
      const med = medicaments.find(m => m.id === id);

      if (item.id === id && item.quantite < med.quantite) {
        return { ...item, quantite: item.quantite + 1 };
      }
      return item;
    }));
  };

  const decrease = (id) => {
    setCart(cart.map(item => {
      if (item.id === id && item.quantite > 1) {
        return { ...item, quantite: item.quantite - 1 };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.prix * item.quantite, 0);

  const validerVente = () => {
    for (let item of cart) {
      const med = medicaments.find(m => m.id === item.id);

      if (item.quantite > med.quantite) {
        setMessage(t("salesPage.insufficientStock", { name: med.nom }));
        setTimeout(() => setMessage(""), 3000);
        return;
      }
    }

    axios.post("http://localhost:8000/api/ventes", {
      items: cart,
      total: total
    }, getAuthHeaders())
      .then(() => {
        setCart([]);
        fetchMedicaments();
        fetchVentes();
        setSuccess(t("salesPage.success"));
        setTimeout(() => setSuccess(""), 3000);
      });
  };

  const getRemainingStock = (med) => {
    const item = cart.find(c => c.id === med.id);
    return item ? med.quantite - item.quantite : med.quantite;
  };

  if (user.role !== "pharmacien" && user.role !== "admin") {
    return <h2 className="p-5">{t("accessDenied")}</h2>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {success && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg">
          {success}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6">{t("salesPage.title")}</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-2xl shadow">
          {message && (
            <div className="fixed top-5 right-5 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg animate-bounce">
              {message}
            </div>
          )}

          <input
            type="text"
            placeholder={t("medicamentsPage.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-4 p-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <h2 className="text-lg font-semibold mb-4">{t("medicaments")}</h2>

          <div className="max-h-[32rem] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              {medicaments
                .filter(m => m.nom.toLowerCase().startsWith(search.toLowerCase()))
                .map(m => (
                  <div key={m.id} className="border p-4 rounded-xl hover:shadow transition">
                    <h3 className="font-bold">{m.nom}</h3>
                    <p className="text-gray-500">{m.prix} DH</p>

                    <p className={`text-sm font-semibold ${
                      getRemainingStock(m) <= 5 ? "text-red-500" : "text-green-600"
                    }`}>
                      {t("stock")}: {getRemainingStock(m)}
                    </p>

                    <button
                      onClick={() => addToCart(m)}
                      disabled={getRemainingStock(m) <= 0}
                      className={`mt-3 w-full py-2 rounded-lg text-white transition ${
                        getRemainingStock(m) <= 0
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-indigo-500 hover:bg-indigo-600"
                      }`}
                    >
                      {getRemainingStock(m) <= 0 ? t("salesPage.outOfStock") : t("salesPage.addToCart")}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">{t("salesPage.cart")}</h2>

          {cart.length === 0 ? (
            <p className="text-gray-400">{t("salesPage.emptyCart")}</p>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center border p-3 rounded-lg">
                  <div>
                    <p className="font-semibold">{item.nom}</p>
                    <p className="text-sm text-gray-500">{item.prix} DH</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrease(item.id)}
                      className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                    >
                      -
                    </button>

                    <span className="font-semibold w-6 text-center">{item.quantite}</span>

                    <button
                      onClick={() => increase(item.id)}
                      className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 border-t pt-4">
            <h3 className="font-bold text-lg mb-3">
              {t("total")}: {total} DH
            </h3>

            <button
              onClick={validerVente}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:scale-105 transition"
            >
              {t("salesPage.validateSale")}
            </button>
          </div>
        </div>
      </div>

      {user.role === "admin" && (
        <div className="mt-6 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">{t("salesPage.history")}</h2>

          <div className="max-h-[32rem] overflow-y-auto pr-2">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-2">{t("id")}</th>
                  <th>{t("total")}</th>
                </tr>
              </thead>

              <tbody>
                {ventes.map(v => (
                  <tr key={v.id} className="border-b hover:bg-gray-50">
                    <td className="py-2">#{v.id}</td>
                    <td>{v.total} DH</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ventes;
