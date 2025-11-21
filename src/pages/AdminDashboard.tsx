import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Plus,
  DollarSign,
  TrendingUp,
  Users,
  Package,
  Edit,
  Trash2,
  Search,
  RotateCcw,
  Eye,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SalesModal from "@/components/SalesModal";
import Navbar from "@/components/Navbar";
import Swal from "sweetalert2";
import PaymentViewModal from "./PaymentViewModal";

const AdminDashboard = () => {
  const location = useLocation();
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filters
  const [fromDate, setFromDate] = useState("2023-01-01");
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Payment Modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  // 🟢 Get user info from login
  useEffect(() => {
    if (location.state && location.state.user) {
      setUserInfo(location.state.user.user_info);
    }
  }, [location.state]);

  // 🟢 Fetch all or filtered sales data
  const fetchSalesData = async (startDate, endDate, showToast = true) => {
    if (!userInfo?.email) return;
    setLoading(true);

    try {
      const url = `http://127.0.0.1:8000/get_admin_user_branch_sales/${userInfo.email}/`;
      const res = await axios.get(url, {
        params: { from_date: startDate, to_date: endDate },
      });

      const data = res.data.sales_data || [];
      setSalesData(data);
      setFilteredData(data);

      if (showToast) {
        if (startDate && endDate)
          toast.success("✅ Filtered data loaded successfully!");
        else toast.success("✅ All data loaded!");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        toast.warn("No sales found in this range!");
      } else {
        toast.error("Server Error fetching data!");
      }
      setSalesData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // Load all data initially
  useEffect(() => {
    if (userInfo?.email)
      fetchSalesData(
        "2023-01-01",
        new Date().toISOString().split("T")[0],
        false
      );
  }, [userInfo]);

  // 🔹 Filter Button
  const handleFilter = () => {
    if (new Date(fromDate) > new Date(toDate)) {
      toast.error("⚠️ From date cannot be after To date!");
      return;
    }
    fetchSalesData(fromDate, toDate);
  };

  // 🔹 Reset Button
  const handleReset = () => {
    const defaultFrom = "2023-01-01";
    const defaultTo = new Date().toISOString().split("T")[0];
    setFromDate(defaultFrom);
    setToDate(defaultTo);
    setSearchTerm("");
    fetchSalesData(defaultFrom, defaultTo);
  };

  // 🔹 Search
 const handleSearch = () => {
   if (!searchTerm.trim()) {
     setFilteredData(salesData);
     toast.info("Showing all records");
     return;
   }
 
   const normalizedSearch = searchTerm.trim().toLowerCase().replace(/\s+/g, "");
   const result = salesData.filter((r) => {
     const normalizedName = (r.name || "").toLowerCase().replace(/\s+/g, "");
     return normalizedName.includes(normalizedSearch);
   });
 
   setFilteredData(result);
   if (result.length === 0) toast.warn("No matching record found!");
 };
  // 🔹 Delete Record
  const handleDeleteRecord = (saleId) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete record ID: ${saleId}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await axios.delete(`http://127.0.0.1:8000/delete_sales/${saleId}/`);
        setSalesData((prev) => prev.filter((r) => r.sale_id !== saleId));
        setFilteredData((prev) => prev.filter((r) => r.sale_id !== saleId));
        Swal.fire("Deleted!", "Record removed successfully!", "success");
      } catch {
        Swal.fire("Error", "Failed to delete record", "error");
      }
    });
  };

  // 🔹 Save Record
  const handleSaveRecord = () => {
    fetchSalesData(fromDate, toDate);
    setModalOpen(false);
  };

  const handleAddRecord = () => {
    setEditingRecord(null);
    setModalOpen(true);
    toast.info("Add Record Mode");
  };

  // 🔹 View Payments
  const handleViewPayments = (sale) => {
    setSelectedSale(sale.sale_id); // send sale id
    setPaymentModalOpen(true);
  };

  // 🟢 Summary Calculations
  const totalGrossSales = filteredData.reduce(
    (sum, r) => sum + (Number(r.gross_sales) || 0),
    0
  );
  const totalNetSales = filteredData.reduce(
    (sum, r) => sum + (Number(r.net_sales) || 0),
    0
  );
  const totalPending = filteredData.reduce(
    (sum, r) => sum + (Number(r.pending_amount) || 0),
    0
  );
  const totalCollectedAmount = filteredData.reduce(
    (sum, r) => sum + (Number(r.received_amount) || 0),
    0
  );
  const totalRevenueSharing = filteredData.reduce(
    (sum, r) => sum + (Number(r.revenue_sharing_amount) || 0),
    0
  );
  const totalRecords = filteredData.length;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-100 to-gray-200">
      <Navbar user={userInfo} setUser={undefined} onToggleSidebar={undefined} />
      <div className="flex-1 overflow-auto p-6 lg:p-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header Section */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-500">Manage sales records — branch specific</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="🔍 Search by Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button onClick={handleSearch} className="bg-blue-600">
                <Search size={16} /> Search
              </Button>
              <Button onClick={handleAddRecord} className="bg-indigo-600">
                <Plus size={18} /> Add Record
              </Button>
            </div>
          </div>

          {/* Filter Section */}
          <div className="backdrop-blur-md bg-white/60 border border-gray-200 shadow-sm p-4 rounded-xl flex flex-wrap gap-4 items-end mb-8">
            <div>
              <label className="text-sm font-medium text-gray-700">From Date</label>
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
            <Button onClick={handleFilter} className="bg-blue-600">
              <Search size={16} /> Filter
            </Button>
            <Button onClick={handleReset} className="bg-orange-500">
              <RotateCcw size={16} /> Reset
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <SummaryCard
              title="Total Gross Sales"
              value={totalGrossSales}
              icon={<DollarSign className="text-green-600" size={22} />}
              bg="from-green-100 to-green-50"
            />
            <SummaryCard
              title="Total Net Sales"
              value={totalNetSales}
              icon={<TrendingUp className="text-blue-600" size={22} />}
              bg="from-blue-100 to-blue-50"
            />
            <SummaryCard
              title="Total Pending"
              value={totalPending}
              icon={<Package className="text-red-600" size={22} />}
              bg="from-red-100 to-red-50"
            />
            <SummaryCard
              title="Total Collected Amount"
              value={totalCollectedAmount}
              icon={<DollarSign className="text-emerald-600" size={22} />}
              bg="from-emerald-100 to-emerald-50"
            />
            <SummaryCard
              title="Total Revenue Sharing"
              value={totalRevenueSharing}
              icon={<TrendingUp className="text-orange-600" size={22} />}
              bg="from-orange-100 to-orange-50"
            />
            <SummaryCard
              title="Total Records"
              value={totalRecords}
              icon={<Users className="text-purple-600" size={22} />}
              bg="from-purple-100 to-purple-50"
            />
          </div>

          {/* Sales Table */}
          <Card className="shadow-md rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Sales Records</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center py-5 text-gray-500">Loading...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead className="bg-gradient-to-r from-blue-600 to-orange-500 text-white">
                      <tr>
                        {[
                          "S.No",
                          "Sale ID",
                          "Branch Name",
                          "Date",
                          "Name",
                          "Mobile Number",
                          "Gross Sales",
                          "Vendor Referral Payment",
                          "Vendor Referral Name",
                          "Revenue Sharing Name",
                          "Revenue Sharing Amount",
                          "Net Sales",
                          "Received Amount",
                          "Pending Amount",
                          "Remarks",
                          "Status",
                          "Action",
                          "View",
                        ].map((header) => (
                          <th
                            key={header}
                            className="p-2 text-left font-semibold text-gray-700"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.length > 0 ? (
                        [...filteredData]
                          .sort((a, b) => a.sale_id - b.sale_id)
                          .map((r,i) => (
                            <tr
                              key={r.sale_id}
                              className="border-b hover:bg-gray-50 transition"
                            >
                               <td className="p-2">{i+1}</td>
                              <td className="p-2">{r.sale_id}</td>
                              <td className="p-2">{r.branch_name}</td>
                              <td className="p-2">{r.date}</td>
                              <td className="p-2">{r.name}</td>
                              <td className="p-2">{r.mobile_number}</td>
                              <td className="p-2">₹{r.gross_sales}</td>
                              <td className="p-2">₹{r.vendor_referral_payment}</td>
                              <td className="p-2">{r.vendor_referral_name}</td>
                              <td className="p-2">{r.revenue_sharing_name}</td>
                              <td className="p-2">₹{r.revenue_sharing_amount}</td>
                              <td className="p-2">₹{r.net_sales}</td>
                              <td className="p-2">₹{r.received_amount}</td>
                              <td className="p-2">₹{r.pending_amount}</td>
                              <td className="p-2">{r.remarks}</td>
                              <td className="p-2">{r.status}</td>
                              <td className="p-2 flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setEditingRecord(r);
                                    setModalOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteRecord(r.sale_id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </td>
                              <td className="p-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewPayments(r)}
                                >
                                  <Eye className="h-4 w-4 text-green-600" />
                                </Button>
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td
                            colSpan={17}
                            className="text-center text-gray-500 py-4 italic"
                          >
                            No sales records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sales Modal */}
          <SalesModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSaveRecord}
            record={editingRecord}
            user={userInfo}
            email={userInfo?.email}
            role={userInfo?.role}
          />

          {/* Payment View Modal */}
          <PaymentViewModal
            open={paymentModalOpen}
            onClose={() => setPaymentModalOpen(false)}
            saleDetails={selectedSale}
            refreshSales={() => fetchSalesData(fromDate, toDate)}
            role={userInfo}
          />
        </motion.div>
      </div>
    </div>
  );
};

// 🔹 Summary Card Component
export function SummaryCard({ title, value, icon, bg }) {
  const isRecord = title.toLowerCase().includes("record");
  return (
    <div
      className={`flex items-center justify-between p-4 bg-gradient-to-br ${bg} rounded-2xl shadow-sm`}
    >
      <div>
        <h3 className="text-gray-700 text-sm font-medium">{title}</h3>
        <p className="text-xl font-bold mt-1">
          {isRecord ? value : `₹${Number(value).toLocaleString("en-IN")}`}
        </p>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  );
}

export default AdminDashboard;
