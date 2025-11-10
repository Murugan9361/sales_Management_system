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

const SalesModal2 = ({ isOpen, onClose, record, onSave, user }) => {
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
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

  // ✅ Prefill for edit mode
  useEffect(() => {
    if (record) setFormData(record);
    else
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
  }, [record]);

  // ✅ Fetch branches list
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/get_all_branches/");
        setBranches(res.data || []);
      } catch (err) {
        console.error("Error fetching branches:", err);
        toast.error("Failed to load branches");
      }
    };
    fetchBranches();
  }, []);

  // ✅ Handle input changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Submit (Super Admin only)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userRole = user?.role;

      if (userRole !== "Super Admin") {
        toast.error("❌ Only Super Admin can create or edit sales");
        setLoading(false);
        return;
      }

      let response;

      if (!record) {
        // --- CREATE ---
        const apiURL = "http://127.0.0.1:8000/create_sales_super_admin/";
        response = await axios.post(apiURL, formData);
        toast.success(response.data.message || "✅ Sales created!");
      } else {
        // --- UPDATE ---
        const updateURL = `http://127.0.0.1:8000/update_sales_super_admin/${record.sale_id}`;
        response = await axios.put(updateURL, formData);
        toast.success(response.data.message || "✅ Sales updated!");
      }

      onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving record:", error);
      if (error.response?.data?.detail)
        toast.error(error.response.data.detail);
      else toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black"
            onClick={onClose}
          />

          {/* Modal */}
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
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {/* <div>
                <Label>Branch Name *</Label>
                <Select
                  value={formData.branch_name}
                  onValueChange={(v) => handleChange("branch_name", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b, i) => (
                      <SelectItem key={i} value={b.branch_name}>
                        {b.branch_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

              <div>
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Mobile Number *</Label>
                <Input
                  type="text"
                  value={formData.mobile_number}
                  onChange={(e) => handleChange("mobile_number", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Gross Sales *</Label>
                <Input
                  type="number"
                  value={formData.gross_sales}
                  onChange={(e) => handleChange("gross_sales", e.target.value)}
                  required
                />
              </div>

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

              <div>
                <Label>Revenue Sharing Name</Label>
                <Input
                  value={formData.revenue_sharing_name}
                  onChange={(e) =>
                    handleChange("revenue_sharing_name", e.target.value)
                  }
                />
              </div>

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

              <div>
                <Label>Received Amount *</Label>
                <Input
                  type="number"
                  value={formData.received_amount}
                  onChange={(e) =>
                    handleChange("received_amount", e.target.value)
                  }
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label>Remarks</Label>
                <Textarea
                  rows={3}
                  value={formData.remarks}
                  onChange={(e) => handleChange("remarks", e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <Label>Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => handleChange("status", v)}
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

              <div className="md:col-span-2 flex justify-end gap-3 mt-6">
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

export default SalesModal2;
