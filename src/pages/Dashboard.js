import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [stats, setStats] = useState(null);
  const [days, setDays] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError("");

    Promise.all([
      axios.get(`http://localhost:8000/api/dashboard?days=${days}`, {
        ...getAuthHeaders(),
        signal: controller.signal
      }),
      axios.get(`http://localhost:8000/api/stats?days=${days}`, {
        ...getAuthHeaders(),
        signal: controller.signal
      })
    ])
      .then(([dashboardRes, statsRes]) => {
        setDashboard(dashboardRes.data);
        setStats(statsRes.data);
      })
      .catch(error => {
        if (error.name !== "CanceledError") {
          console.error("Erreur chargement dashboard:", error);
          setError(t("dashboardPage.loadError"));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [days, t]);

  const ventesChart = stats && {
    labels: stats.ventes.map(v => v.date),
    datasets: [{
      label: t("sales"),
      data: stats.ventes.map(v => v.total)
    }]
  };

  const stockChart = stats && {
    labels: stats.stocks.map(s => s.nom),
    datasets: [{
      label: t("stock"),
      data: stats.stocks.map(s => s.quantite)
    }]
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getReportPeriod = () => {
    if (days === "all") {
      return {
        fileName: "dashboard-report_all-time.pdf",
        label: t("dashboardPage.allTime"),
        startDate: "",
        endDate: formatDate(new Date())
      };
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - Number(days));
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    return {
      fileName: `dashboard-report_${formattedStartDate}_to_${formattedEndDate}.pdf`,
      label: `${formattedStartDate} to ${formattedEndDate}`,
      startDate: formattedStartDate,
      endDate: formattedEndDate
    };
  };

  const downloadPDF = async () => {
    const token = localStorage.getItem("token");
    const reportPeriod = getReportPeriod();
    const params = new URLSearchParams({
      days: String(days),
      start_date: reportPeriod.startDate,
      end_date: reportPeriod.endDate,
      period_label: reportPeriod.label
    });

    const res = await axios.get(
      `http://localhost:8000/api/report/pdf?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: "blob"
      }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", reportPeriod.fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const filterButtonClass = (value) =>
    days === value
      ? "bg-indigo-500 text-white px-3 py-1 rounded"
      : "bg-gray-200 px-3 py-1 rounded";

  if (loading) return <p>{t("dashboardPage.loading")}</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!dashboard || !stats) return <p className="p-6 text-red-600">{t("dashboardPage.missingData")}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t("dashboard")}</h1>

      <div className="mb-4 flex gap-3">
        <button onClick={() => setDays(7)} className={filterButtonClass(7)}>7j</button>
        <button onClick={() => setDays(14)} className={filterButtonClass(14)}>14j</button>
        <button onClick={() => setDays(30)} className={filterButtonClass(30)}>30j</button>
        <button onClick={() => setDays("all")} className={filterButtonClass("all")}>
          {t("dashboardPage.allTime")}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg hover:scale-105 transition">
          <p className="text-gray-500">{t("dashboardPage.revenue")}</p>
          <h2 className="text-3xl font-bold mt-2">{dashboard.totalRevenue} DH</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg hover:scale-105 transition">
          <p className="text-gray-500">{t("sales")}</p>
          <h2 className="text-3xl font-bold mt-2">{dashboard.totalVentes}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">{t("dashboardPage.lowStock")}</p>
          <h2 className="text-3xl font-bold mt-2 text-red-500">
            {dashboard.lowStock.length}
          </h2>

          <div className="mt-4 space-y-2">
            {dashboard.lowStock.slice(0, 5).map((m, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-700">- {m.nom}</span>
                <span className="text-red-500 font-semibold">{m.quantite}</span>
              </div>
            ))}

            {dashboard.lowStock.length > 5 && (
              <p className="text-xs text-gray-400">
                {t("dashboardPage.more", { count: dashboard.lowStock.length - 5 })}
              </p>
            )}
          </div>
        </div>

        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={downloadPDF}>
          {t("dashboardPage.downloadPdf")}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4">{t("sales")}</h3>
          <Bar data={ventesChart} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4">{t("stock")}</h3>
          <Bar data={stockChart} />
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4">{t("dashboardPage.latestSales")}</h3>

        <div className="max-h-[32rem] overflow-y-auto pr-2">
          {dashboard.ventes.map(v => (
            <div key={v.id} className="border-b py-3 last:border-b-0">
              <div className="flex justify-between">
                <strong>{t("dashboardPage.saleNumber", { id: v.id })}</strong>
                <span className="text-green-600 font-bold">{v.total} DH</span>
              </div>

              <p className="text-sm text-gray-500">{v.user_name}</p>

              <ul className="text-sm mt-1">
                {v.details.map(d => (
                  <li key={d.id}>
                    {d.medicament.nom} x {d.quantite}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
