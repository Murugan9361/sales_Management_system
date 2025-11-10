import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  Search,
  RotateCcw,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

const SuperUserDashboard = () => {
  const location = useLocation();
  const userData = location.state?.user || {};

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [branch, setBranch] = useState(userData.branch || "");
  const [fromDate, setFromDate] = useState("2023-01-01");
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [branches, setBranches] = useState([]);
  const [mobileSearch, setMobileSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch all branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/get_all_branches/");
        setBranches(res.data.branches || []);
      } catch {
        toast.error("Failed to load branches!");
      }
    };
    fetchBranches();
  }, []);

  // ✅ Fetch all sales data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://127.0.0.1:8000/get_all_sales/");
      const allData = res.data.data || [];
      setData(allData);
      setFilteredData(allData);
    } catch {
      setError("Failed to fetch sales data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Filter by branch + date
  const fetchFilteredData = async () => {
    if (!branch || !fromDate || !toDate) {
      toast.warn("Please select branch and dates!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/get_all_sales/", {
        params: { branch_name: branch, from_date: fromDate, to_date: toDate },
      });
      const filtered = res.data.data || [];
      setFilteredData(filtered);
      if (filtered.length > 0) toast.success("Filtered data loaded!");
      else toast.warn("No records found.");
    } catch {
      toast.error("Error fetching filtered data.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset filters
  const resetFilters = () => {
    setFromDate("2023-01-01");
    setToDate(new Date().toISOString().split("T")[0]);
    setBranch("");
    setMobileSearch("");
    fetchData();
  };

  // ✅ Search by mobile
  const handleMobileSearch = () => {
    if (!mobileSearch.trim()) {
      setFilteredData(data);
      toast.info("Showing all records");
      return;
    }
    const search = mobileSearch.trim().toLowerCase();
    const filtered = data.filter((r) =>
      String(r.mobile_number).toLowerCase().includes(search)
    );
    setFilteredData(filtered);
    if (filtered.length === 0) toast.warn("No matching record found!");
  };

  // ✅ Summary calculations
  const summary = {
    totalGrossSales: filteredData.reduce((a, b) => a + (b.gross_sales || 0), 0),
    totalReferralAmount: filteredData.reduce(
      (a, b) => a + (b.vendor_referral_payment || 0),
      0
    ),
    totalRevenueSharing: filteredData.reduce(
      (a, b) => a + (b.revenue_sharing_amount || 0),
      0
    ),
    totalNetSales: filteredData.reduce((a, b) => a + (b.net_sales || 0), 0),
    totalCollectedAmount: filteredData.reduce(
      (a, b) => a + (b.received_amount || 0),
      0
    ),
    totalPendingAmount: filteredData.reduce(
      (a, b) => a + (b.pending_amount || 0),
      0
    ),
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <Navbar
        user={userData.user_info}
        setUser={undefined}
        onToggleSidebar={undefined}
      />

      <div className="flex-1 overflow-auto p-6 lg:p-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                📊 SuperUser Dashboard
              </h1>
              <p className="text-gray-500">
                Analyze performance across all branches
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="🔍 Search by Mobile..."
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
                className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button onClick={handleMobileSearch} className="bg-blue-600">
                <Search size={16} /> Search
              </Button>
            </div>
          </div>

          {/* Filter Section */}
          <div className="backdrop-blur-md bg-white/60 border border-gray-200 shadow-sm p-4 rounded-xl flex flex-wrap gap-4 items-end mb-8">
            <div>
              <label className="text-sm font-medium text-gray-700">Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              >
                <option value="">-- Select Branch --</option>
                {branches.map((b, i) => (
                  <option key={i} value={b.branch_name}>
                    {b.branch_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>

            <Button onClick={fetchFilteredData} className="bg-blue-600">
              <Search size={16} /> Filter
            </Button>
            <Button onClick={resetFilters} className="bg-orange-500">
              <RotateCcw size={16} /> Reset
            </Button>
          </div>

          {/* Summary Section */}
          {!loading && filteredData.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
              <SummaryCard
                title="Total Gross Sales"
                value={summary.totalGrossSales}
                icon={<DollarSign className="text-blue-600" />}
                bg="from-blue-100 to-blue-50"
              />
              <SummaryCard
                title="Referral Amount"
                value={summary.totalReferralAmount}
                icon={<TrendingDown className="text-orange-600" />}
                bg="from-orange-100 to-orange-50"
              />
              <SummaryCard
                title="Revenue Sharing"
                value={summary.totalRevenueSharing}
                icon={<Package className="text-green-600" />}
                bg="from-green-100 to-green-50"
              />
              <SummaryCard
                title="Net Sales"
                value={summary.totalNetSales}
                icon={<TrendingUp className="text-blue-600" />}
                bg="from-blue-100 to-blue-50"
              />
              <SummaryCard
                title="Collected"
                value={summary.totalCollectedAmount}
                icon={<DollarSign className="text-green-600" />}
                bg="from-green-100 to-green-50"
              />
              <SummaryCard
                title="Pending"
                value={summary.totalPendingAmount}
                icon={<TrendingDown className="text-red-600" />}
                bg="from-red-100 to-red-50"
              />
            </div>
          )}

          {/* Table Section */}
          {!loading && filteredData.length > 0 && (
            <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-gradient-to-r from-blue-600 to-orange-500 text-white">
                  <tr>
                    {[
                      "#",
                      "Name",
                      "Mobile",
                      "Date",
                      "Branch",
                      "Gross Sales",
                      "Referral",
                      "Revenue Share",
                      "Net Sales",
                      "Collected",
                      "Pending",
                    ].map((col, i) => (
                      <th key={i} className="px-4 py-3 font-semibold">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, i) => (
                    <tr
                      key={item.sale_id || i}
                      className="border-t hover:bg-blue-50 transition"
                    >
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2 font-medium">{item.name}</td>
                      <td className="px-4 py-2">{item.mobile_number}</td>
                      <td className="px-4 py-2">{item.date}</td>
                      <td className="px-4 py-2">{item.branch_name}</td>
                      <td className="px-4 py-2">₹{item.gross_sales}</td>
                      <td className="px-4 py-2">₹{item.vendor_referral_payment}</td>
                      <td className="px-4 py-2">₹{item.revenue_sharing_amount}</td>
                      <td className="px-4 py-2 font-semibold text-blue-700">
                        ₹{item.net_sales}
                      </td>
                      <td className="px-4 py-2 text-green-700 font-semibold">
                        ₹{item.received_amount}
                      </td>
                      <td className="px-4 py-2 text-red-600 font-semibold">
                        ₹{item.pending_amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {loading && (
            <p className="text-center text-gray-500 mt-6">Loading data...</p>
          )}
          {error && (
            <p className="text-center text-red-600 mt-6 font-medium">{error}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// 🔹 Reusable Summary Card
const SummaryCard = ({ title, value, icon, bg }) => (
  <div
    className={`rounded-xl shadow-sm p-5 flex items-center justify-between bg-gradient-to-br ${bg}`}
  >
    <div>
      <h3 className="text-gray-700 text-sm font-medium">{title}</h3>
      <p className="text-xl font-bold mt-1">₹{value.toLocaleString()}</p>
    </div>
    {icon}
  </div>
);

export default SuperUserDashboard;
