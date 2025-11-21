import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const SalesModal = ({ isOpen, onClose, record, onSave, user, email, role }) => {
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  console.log(user?.role);

  const [formData, setFormData] = useState({
    branch_name: "",
    date: new Date().toISOString().split("T")[0],
    name: "",
    mobile_number: "",
    gross_sales: "",
    vendor_referral_payment: "",
    vendor_referral_name: "",
    revenue_sharing_name: "",
    revenue_sharing_amount: "",
    received_amount: "",
    remarks: "",
    status: "Open",
  });

  // ✅ Prefill data when editing
  useEffect(() => {
    if (record) {
      setFormData({
        ...record,
        date: record.date
          ? record.date.split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    } else {
      setFormData({
        branch_name: "",
        date: new Date().toISOString().split("T")[0],
        name: "",
        mobile_number: "",
        gross_sales: "",
        vendor_referral_payment: "",
        vendor_referral_name: "",
        revenue_sharing_name: "",
        revenue_sharing_amount: "",
        received_amount: "",
        remarks: "",
        status: "Open",
      });
    }
  }, [record]);

  // ✅ Fetch Branch Names from API
  // ✅ Fetch Branch Names from API (based on role)
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const userRole = user?.role || role;
        const userEmail = user?.email || email?.email;
        console.log(userEmail);
        let res;

        if (userRole === "Super Admin") {
          // 🔹 Super Admin → All branches
          res = await axios.get("http://localhost:8000/get_all_branches/");
          setBranches(res.data.branches || []);
          console.log(res.data.branches);
        }
        // } else {
        //   // 🔹 Admin → Specific branch only
        //   res = await axios.get(
        //     `http://localhost:8000/get_branch_sales_no_filters/${userEmail}`
        //   );
        //   // Convert single branch to array for Select
        //   const branchData = res.data.branch_info

        //      console.log(branchData);
        //   setBranches(branchData || []);
        //   console.log(branchData)
        // }
      } catch (err) {
        console.error("❌ Error fetching branches:", err);
        toast.error("Failed to load branch list!");
      }
    };

    fetchBranches();
  }, [user, role, email]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Submit Handler (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userRole = user?.role || role;
      const userEmail = user?.email || email?.email;

      if (!userRole || !userEmail) {
        toast.error("Missing user details!");
        setLoading(false);
        return;
      }

      let apiURL = "";
      let method = "";
      let payload = {
        ...formData,
        gross_sales: Number(formData.gross_sales || 0),
        vendor_referral_payment: Number(formData.vendor_referral_payment || 0),
        revenue_sharing_amount: Number(formData.revenue_sharing_amount || 0),
        received_amount: Number(formData.received_amount || 0),
      };

      // ✅ Determine API & method
      if (record?.sale_id) {
        // UPDATE
        method = "put";
        apiURL =
          userRole === "Super Admin"
            ? `http://127.0.0.1:8000/update_sales_super_admin/${record.sale_id}`
            : `http://127.0.0.1:8000/update_sales_admin/${record.sale_id}/${userEmail}`;
      } else {
        // CREATE
        method = "post";
        apiURL =
          userRole === "Super Admin"
            ? "http://127.0.0.1:8000/create_sales_super_admin/"
            : `http://127.0.0.1:8000/create_sales_admin/${userEmail}`;
      }

      console.log("📤 Sending request:", method.toUpperCase(), apiURL);
      console.log("📦 Payload:", payload);

      // ✅ Make API call
      const res =
        method === "post"
          ? await axios.post(apiURL, payload)
          : await axios.put(apiURL, payload);

      console.log("✅ Backend Response:", res.data);

      if (record?.sale_id) {
        toast.success("✅ Record updated successfully!");
      } else {
        toast.success("✅ Record added successfully!");
      }

      onSave(res.data);
      onClose();
    } catch (error) {
      console.error("❌ Error saving record:", error);
      if (error.response) {
        console.error("🔍 Backend Response:", error.response.data);
        toast.error(
          error.response.data.detail ||
            "Failed to save record. Please check your input!"
        );
      } else {
        toast.error("Network error! Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed top-[10%] left-[20%] z-50 w-[90%] md:w-[75%] lg:w-[65%] -translate-x-1/2 rounded-2xl bg-white p-8 shadow-2xl overflow-y-auto max-h-[80vh]"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {record ? "Edit Sales Record" : "Add Sales Record"}
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              {/* Branch Name */}
              <div className="col-span-1">
                <Label>Branch Name *</Label>
                {user?.role === "Super Admin" ? (
                  <Select
                    value={formData.branch_name}
                    onValueChange={(value) =>
                      handleChange("branch_name", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch, idx) => (
                        <SelectItem key={idx} value={branch.branch_name}>
                          {branch.branch_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type="text"
                    value={user?.branch_name || formData.branch_name}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                )}
              </div>

              {/* Date */}
              <div className="col-span-1">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  required
                />
              </div>

              {/* Name */}
              <div className="col-span-1">
                <Label>Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              {/* Mobile Number */}
              <div>
                <Label>Mobile Number *</Label>
                <Input
                  type="text"
                  value={formData.mobile_number}
                  onChange={(e) =>
                    handleChange("mobile_number", e.target.value)
                  }
                  required
                />
              </div>

              {/* Gross Sales */}
              <div>
                <Label>Gross Sales *</Label>
                <Input
                  type="number"
                  value={formData.gross_sales}
                  onChange={(e) => handleChange("gross_sales", e.target.value)}
                  required
                />
              </div>

              {/* Vendor Referral Name */}
              <div>
                <Label>Vendor Referral Name *</Label>
                <Input
                  value={formData.vendor_referral_name}
                  onChange={(e) =>
                    handleChange("vendor_referral_name", e.target.value)
                  }
                  required
                />
              </div>

              {/* Vendor Referral Payment */}
              <div>
                <Label>Vendor Referral Payment *</Label>
                <Input
                  type="number"
                  value={formData.vendor_referral_payment}
                  onChange={(e) =>
                    handleChange("vendor_referral_payment", e.target.value)
                  }
                  required
                />
              </div>

              {/* Revenue Sharing Name */}
              <div>
                <Label>Revenue Sharing Name</Label>
                <Input
                  value={formData.revenue_sharing_name}
                  onChange={(e) =>
                    handleChange("revenue_sharing_name", e.target.value)
                  }
                />
              </div>

              {/* Revenue Sharing Amount */}
              <div>
                <Label>Revenue Sharing Amount</Label>
                <Input
                  type="number"
                  value={formData.revenue_sharing_amount}
                  onChange={(e) =>
                    handleChange("revenue_sharing_amount", e.target.value)
                  }
                />
              </div>

              {/* Remarks (2 columns) */}
              <div className="md:col-span-2">
                <Label>Remarks</Label>
                <Textarea
                  rows={3}
                  value={formData.remarks}
                  onChange={(e) => handleChange("remarks", e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Status (1 column) */}
              <div className="md:col-span-1">
                <Label>Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Close">Close</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Buttons (Full width) */}
              <div className="md:col-span-3 flex justify-end gap-3 mt-6">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading
                    ? "Saving..."
                    : record
                    ? "Update Record"
                    : "Add Record"}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SalesModal;
