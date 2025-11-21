import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Box,
} from "@mui/material";

import { Edit, Delete } from "@mui/icons-material";

export default function PaymentViewModal({
  open,
  onClose,
  saleDetails,
  refreshSales,
  role,
}) {
  const [paymentDetails, setPaymentDetails] = useState([]);
  let date=new Date().toISOString().split("T")[0];
const [newPayment, setNewPayment] = useState({
  payment_date:`${date}` , // current date in YYYY-MM-DD
  amount_paid: "",
  payment_method: "",
});
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setNewPayment((prev) => ({ ...prev, payment_date: today }));
  }, []);

  const [editPaymentId, setEditPaymentId] = useState(null);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (role) {
      setUserRole(role); // store role/user object safely
    }
  }, [role]); // runs whenever the prop 'role' changes
console.log(userRole?.role)
  const fetchPayments = async () => {
    if (!saleDetails) return;

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/get_payments/${saleDetails}/`
      );
      const data = res.data?.payment_details;

      if (!data || data.length === 0) {
        setPaymentDetails([]);
        setError("No data from this API");
        return;
      }

      setPaymentDetails(data);
      setError("");
    } catch (err) {
      setPaymentDetails([]);
      setError("Failed to fetch payments");
      toast.error(err.response?.data?.detail || "Failed to fetch payments");
    }
  };

  useEffect(() => {
    if (open && saleDetails) {
      fetchPayments();
      setEditPaymentId(null);
      setNewPayment({ payment_date: "", amount_paid: "", payment_method: "" });
    }
  }, [open, saleDetails]);

  const handleAddPayment = async () => {
    if (!newPayment.payment_date || !newPayment.amount_paid) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await axios.post(
        `http://127.0.0.1:8000/add_payment/${saleDetails}/`,
        newPayment
      );

      toast.success("Payment added successfully");

      setNewPayment({ payment_date: "", amount_paid: "", payment_method: "" });
      fetchPayments();
      refreshSales();
    } catch {
      toast.error("Failed to add payment");
    }
  };

  const handleEditPayment = (payment) => {
    setEditPaymentId(payment.payment_id);
    setNewPayment({
      payment_date: payment.payment_date?.split("T")[0] || "",
      amount_paid: payment.amount_paid,
      payment_method: payment.payment_method,
    });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/update_payment/${editPaymentId}/`,
        newPayment
      );

      toast.success("Payment updated successfully");

      setEditPaymentId(null);
      setNewPayment({ payment_date: "", amount_paid: "", payment_method: "" });
      fetchPayments();
      refreshSales();
    } catch {
      toast.error("Failed to update payment");
    }
  };

  // -----------------------
  // DELETE PAYMENT WITH TOAST CONFIRMATION
  // -----------------------
  const handleDeletePayment = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/delete_payment/${id}/`);

      toast.success("Payment deleted successfully");

      fetchPayments(); // refresh only payments inside modal
      // refreshSales(); // ❌ remove if modal closes — keep only if needed
    } catch {
      toast.error("Failed to delete payment");
    }
  };

  if (!saleDetails) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Payments</DialogTitle>
      <DialogContent>
        {/* FORM */}
        {(userRole?.role === "Super Admin" || userRole?.role === "Admin") &&
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: "0 4px 15px rgba(0,0,0,0.10)",
            backgroundColor: "#fff",
            display: "flex",
            gap: 2,
            alignItems: "center",
            mt: 2,
          }}
        >
          <TextField
            type="date"
            label="Payment Date"
            InputLabelProps={{ shrink: true }}
            value={newPayment.payment_date}
            onChange={(e) =>
              setNewPayment({ ...newPayment, payment_date: e.target.value })
            }
            fullWidth
          />

          <TextField
            type="number"
            label="Amount Paid"
            value={newPayment.amount_paid}
            onChange={(e) =>
              setNewPayment({ ...newPayment, amount_paid: e.target.value })
            }
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={newPayment.payment_method}
              onChange={(e) =>
                setNewPayment({ ...newPayment, payment_method: e.target.value })
              }
              label="Payment Method"
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="upi">UPI</MenuItem>
              <MenuItem value="card">Card</MenuItem>
              <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
            </Select>
          </FormControl>

          {editPaymentId ? (
            <Button
              variant="contained"
              color="warning"
              onClick={handleSaveEdit}
            >
              Save
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={handleAddPayment}
            >
              Add Payment
            </Button>
          )}
        </Box>}

        {/* TABLE */}
        <Table sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paymentDetails.length > 0 ? (
              paymentDetails.map((p) => (
                <TableRow key={p.payment_id}>
                  <TableCell>{p.payment_id}</TableCell>
                  <TableCell>{p.payment_date?.split("T")[0]}</TableCell>
                  <TableCell>₹{p.amount_paid}</TableCell>
                  <TableCell>{p.payment_method}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditPayment(p)}
                    >
                      <Edit />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDeletePayment(p.payment_id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {error || "No data from this API"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
