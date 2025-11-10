// UserDashboard.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Search, RotateCcw, RefreshCcw } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const UserDashboard = () => {
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Default date range
  const [fromDate, setFromDate] = useState("2023-01-01");
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);

  // ✅ When page opens, load user info
  useEffect(() => {
    if (location.state?.user?.user_info) {
      setUserInfo(location.state.user.user_info);
    } else if (location.state?.user) {
      setUserInfo(location.state.user);
    }
  }, [location.state]);

  // ✅ Get email safely
  const getEmail = () => userInfo?.email || userInfo?.user_email || "";

  // ✅ Fetch data (all or filtered)
  const fetchFilteredSalesData = async (start, end) => {
    const email = getEmail();
    if (!email) {
      toast.error("User email not available — please login again.");
      return;
    }

    setLoading(true);
    try {
      const url = `http://127.0.0.1:8000/get_admin_user_branch_sales/${encodeURIComponent(email)}/`;
      const params = { from_date: start, to_date: end };

      const res = await axios.get(url, { params });
      const data = res.data?.sales_data || [];

      setSalesData(data);
      setFilteredData(data);

      if (data.length === 0) toast.info("No records found");
    } catch (err) {
      console.error("Fetch error:", err);
      if (err.response?.status === 404) {
        setSalesData([]);
        setFilteredData([]);
      }
      toast.error(err.response?.data?.detail || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load ALL data when page first opens (initial load)
  useEffect(() => {
    if (userInfo) {
      fetchFilteredSalesData("2023-01-01", new Date().toISOString().split("T")[0]);
    }
  }, [userInfo]);

  // ✅ Filter button click
  const handleFilter = () => {
    if (new Date(fromDate) > new Date(toDate)) {
      toast.error("From Date cannot be after To Date");
      return;
    }
    fetchFilteredSalesData(fromDate, toDate);
  };

  // ✅ Reset button (show all data again)
  const handleReset = () => {
    const defaultFrom = "2023-01-01";
    const defaultTo = new Date().toISOString().split("T")[0];
    setFromDate(defaultFrom);
    setToDate(defaultTo);
    setSearchTerm("");
    fetchFilteredSalesData(defaultFrom, defaultTo);
  };

  // ✅ Refresh button (reload entire page, and automatically show all data)
  const handleRefresh = () => {
    window.location.reload();
  };

  // ✅ Search mobile number
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredData(salesData);
      toast.info("Showing all records");
      return;
    }
    const result = salesData.filter((r) =>
      String(r.mobile_number || "").includes(searchTerm.trim())
    );
    setFilteredData(result);
    if (result.length === 0) toast.warn("No matching record found!");
  };

  // ✅ Summaries
  const totalGrossSales = filteredData.reduce((s, r) => s + (r.gross_sales || 0), 0);
  const totalNetSales = filteredData.reduce((s, r) => s + (r.net_sales || 0), 0);
  const totalPending = filteredData.reduce((s, r) => s + (r.pending_amount || 0), 0);
  const totalRecords = filteredData.length;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <Navbar user={userInfo} setUser={undefined} onToggleSidebar={undefined} />
      <div className="flex-1 overflow-auto p-6 lg:p-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">User Dashboard</h1>
              <p className="text-gray-500">View and filter sales data for your branch</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="text"
                placeholder="Search by Mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button onClick={handleSearch} className="bg-blue-600 text-white flex items-center gap-1">
                <Search size={16} /> Search
              </Button>
              <Button onClick={handleReset} className="bg-orange-500 text-white flex items-center gap-1">
                <RotateCcw size={16} /> Reset
              </Button>
              <Button onClick={handleRefresh} className="bg-green-600 text-white flex items-center gap-1">
                <RefreshCcw size={16} /> Refresh
              </Button>
            </div>
          </div>

          {/* Date Filters */}
          <div className="mb-8 flex flex-wrap gap-4 bg-white p-5 rounded-xl shadow border">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <Button onClick={handleFilter} className="bg-blue-600 text-white flex items-center gap-1 mt-6">
              <Search size={16} /> Filter
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="rounded-xl bg-gradient-to-br from-white to-gray-50 shadow p-5 border">
              <h3 className="text-gray-600 text-sm font-medium">Total Gross Sales</h3>
              <p className="text-xl font-bold text-gray-800 mt-1">₹{totalGrossSales.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-white to-gray-50 shadow p-5 border">
              <h3 className="text-gray-600 text-sm font-medium">Total Net Sales</h3>
              <p className="text-xl font-bold text-gray-800 mt-1">₹{totalNetSales.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-white to-gray-50 shadow p-5 border">
              <h3 className="text-gray-600 text-sm font-medium">Total Pending</h3>
              <p className="text-xl font-bold text-gray-800 mt-1">₹{totalPending.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-white to-gray-50 shadow p-5 border">
              <h3 className="text-gray-600 text-sm font-medium">Total Records</h3>
              <p className="text-xl font-bold text-gray-800 mt-1">{totalRecords}</p>
            </div>
          </div>

          {/* Sales Table */}
          <Card className="shadow-md rounded-xl">
            <CardHeader><CardTitle className="text-lg font-semibold text-gray-700">Sales Records</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center text-gray-500 py-4 animate-pulse">Loading...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        {["Sale ID", "Branch Name", "Date", "Name", "Mobile Number", "Gross Sales", "Net Sales", "Pending Amount", "Remarks", "Status"].map(h => (
                          <th key={h} className="p-2 text-left font-semibold text-gray-700">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.length > 0 ? filteredData.map(r => (
                        <tr key={r.sale_id} className="border-b hover:bg-gray-50 transition">
                          <td className="p-2">{r.sale_id}</td>
                          <td className="p-2">{r.branch_name}</td>
                          <td className="p-2">{r.date}</td>
                          <td className="p-2">{r.name}</td>
                          <td className="p-2">{r.mobile_number}</td>
                          <td className="p-2">₹{r.gross_sales}</td>
                          <td className="p-2">₹{r.net_sales}</td>
                          <td className="p-2">₹{r.pending_amount}</td>
                          <td className="p-2">{r.remarks}</td>
                          <td className="p-2">{r.status}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan={10} className="text-center text-gray-500 py-5 italic">No records found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;
