import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {

  const [dashboard, setDashboard] = useState(null);
  const [stats, setStats] = useState(null);

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

    useEffect(() => {
        axios.get("http://localhost:8000/api/dashboard", getAuthHeaders())
        .then(res => setDashboard(res.data));
    }, []);


    useEffect(() => {
        axios.get("http://localhost:8000/api/stats", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
        .then(res => setStats(res.data));
    }, []);

    const ventesChart = stats && {
        labels: stats.ventes.map(v => v.date),
        datasets: [{
            label: "Ventes",
            data: stats.ventes.map(v => v.total)
        }]
        };

        const stockChart = stats && {
        labels: stats.stocks.map(s => s.nom),
        datasets: [{
            label: "Stock",
            data: stats.stocks.map(s => s.quantite)
        }]
    };

  if (!dashboard) return <p>Loading...</p>;
  if (!stats) return <p>Loading charts...</p>;

  return (
  <div className="p-6">

    <h1 className="text-2xl font-bold mb-6">📊 Dashboard</h1>

    {/* CARDS */}
    <div className="grid grid-cols-3 gap-6">

      {/* Revenue */}
      <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg hover:scale-105 transition">
        <p className="text-gray-500">💰 Revenue</p>
        <h2 className="text-3xl font-bold mt-2">
          {dashboard.totalRevenue} DH
        </h2>
      </div>

      {/* Ventes */}
      <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg hover:scale-105 transition">
        <p className="text-gray-500">📦 Ventes</p>
        <h2 className="text-3xl font-bold mt-2">
          {dashboard.totalVentes}
        </h2>
      </div>

      {/* Stock faible */}
      <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">

        <p className="text-gray-500">⚠️ Stock faible</p>

        <h2 className="text-3xl font-bold mt-2 text-red-500">
          {dashboard.lowStock.length}
        </h2>

        {/* LIST */}
        <div className="mt-4 space-y-2">

          {dashboard.lowStock.slice(0, 5).map((m, i) => (
            <div key={i} className="flex justify-between text-sm">

              <span className="text-gray-700">
                • {m.nom}
              </span>

              <span className="text-red-500 font-semibold">
                {m.quantite}
              </span>

            </div>
          ))}

          {dashboard.lowStock.length > 5 && (
            <p className="text-xs text-gray-400">
              +{dashboard.lowStock.length - 5} autres...
            </p>
          )}

        </div>

      </div>

    </div>

    {/* CHARTS */}
    <div className="grid grid-cols-2 gap-6 mt-6">

      {/* VENTES CHART */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4">📊 Ventes</h3>
        <Bar data={ventesChart} />
      </div>

      {/* STOCK CHART */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4">📦 Stock</h3>
        <Bar data={stockChart} />
      </div>

    </div>

    {/* DERNIERES VENTES */}
    <div className="mt-6 bg-white p-6 rounded-2xl shadow">

      <h3 className="text-lg font-semibold mb-4">🧾 Dernières ventes</h3>

      {dashboard.ventes.map(v => (
        <div key={v.id} className="border-b py-3">

          <div className="flex justify-between">
            <strong>Vente #{v.id}</strong>
            <span className="text-green-600 font-bold">
              {v.total} DH
            </span>
          </div>

          <p className="text-sm text-gray-500">
            👤 {v.user_name}
          </p>

          <ul className="text-sm mt-1">
            {v.details.map(d => (
              <li key={d.id}>
                {d.medicament.nom} × {d.quantite}
              </li>
            ))}
          </ul>

        </div>
      ))}

    </div>

  </div>
);


  
}

export default Dashboard;