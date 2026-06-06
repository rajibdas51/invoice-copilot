import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, Trash2, Sparkles } from "lucide-react";
import moment from "moment";
import toast from "react-hot-toast";

import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";
import TextareaField from "../../components/ui/TextareaField";
import Button from "../../components/ui/Button";
import CreateWithAIModal from "../../components/invoices/CreateWithAIModal";

const EMPTY_ITEM = { name: "", quantity: 1, unitPrice: 0, taxPercent: 0 };

const CreateInvoice = ({ existingInvoice, onSave }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [formData, setFormData] = useState(
    existingInvoice || {
      invoiceNumber: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      billFrom: {
        businessName: user?.businessName || "",
        email: user?.email || "",
        address: user?.address || "",
        phone: user?.phone || "",
      },
      billTo: { clientName: "", email: "", address: "", phone: "" },
      items: [{ ...EMPTY_ITEM }],
      notes: "",
      paymentTerms: "Net 15",
    },
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingNumber, setIsGeneratingNumber] =
    useState(!existingInvoice);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // ── On mount: handle AI pre-fill or edit mode ─────────────
  useEffect(() => {
    const aiData = location.state?.aiData;

    if (aiData) {
      setFormData((prev) => ({
        ...prev,
        billTo: {
          clientName: aiData.clientName || "",
          email: aiData.email || "",
          address: aiData.address || "",
          phone: "",
        },
        items: aiData.items?.map((item) => ({
          name: item.name || "",
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || 0,
          taxPercent: 0,
        })) || [{ ...EMPTY_ITEM }],
      }));
    }

    if (existingInvoice) {
      setFormData({
        ...existingInvoice,
        invoiceDate: moment(existingInvoice.invoiceDate).format("YYYY-MM-DD"),
        dueDate: moment(existingInvoice.dueDate).format("YYYY-MM-DD"),
      });
      return;
    }

    // Auto-generate invoice number for new invoices
    const generateInvoiceNumber = async () => {
      setIsGeneratingNumber(true);
      try {
        const response = await axiosInstance.get(
          API_PATHS.INVOICE.GET_ALL_INVOICES,
        );
        const invoices = response.data;
        let maxNum = 0;
        invoices.forEach((inv) => {
          const num = parseInt(inv.invoiceNumber?.split("-")[1]);
          if (!isNaN(num) && num > maxNum) maxNum = num;
        });
        setFormData((prev) => ({
          ...prev,
          invoiceNumber: `INV-${String(maxNum + 1).padStart(3, "0")}`,
        }));
      } catch {
        setFormData((prev) => ({
          ...prev,
          invoiceNumber: `INV-${Date.now().toString().slice(-5)}`,
        }));
      } finally {
        setIsGeneratingNumber(false);
      }
    };

    generateInvoiceNumber();
  }, [existingInvoice]);

  // ── Form handlers ─────────────────────────────────────────

  const handleInputChange = (e, section, index) => {
    const { name, value } = e.target;

    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [name]: value },
      }));
    } else if (index !== undefined) {
      const newItems = [...formData.items];
      newItems[index] = { ...newItems[index], [name]: value };
      setFormData((prev) => ({ ...prev, items: newItems }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { ...EMPTY_ITEM }],
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // ── Totals ────────────────────────────────────────────────

  const { subtotal, taxTotal, total } = formData.items.reduce(
    (acc, item) => {
      const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
      const itemTax = itemTotal * ((item.taxPercent || 0) / 100);
      return {
        subtotal: acc.subtotal + itemTotal,
        taxTotal: acc.taxTotal + itemTax,
        total: acc.total + itemTotal + itemTax,
      };
    },
    { subtotal: 0, taxTotal: 0, total: 0 },
  );

  // ── Submit ────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const itemsWithTotal = formData.items.map((item) => ({
      ...item,
      total:
        (item.quantity || 0) *
        (item.unitPrice || 0) *
        (1 + (item.taxPercent || 0) / 100),
    }));

    const finalFormData = {
      ...formData,
      items: itemsWithTotal,
      subtotal,
      taxTotal,
      total,
    };

    if (onSave) {
      await onSave(finalFormData);
      setIsLoading(false);
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.INVOICE.CREATE, finalFormData);
      toast.success("Invoice created successfully");
      navigate("/invoices");
    } catch {
      toast.error("Failed to create invoice");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8 pb-[100vh]">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-900">
            {existingInvoice ? "Edit Invoice" : "Create Invoice"}
          </h2>

          <div className="flex items-center gap-3">
            {!existingInvoice && (
              <button
                type="button"
                onClick={() => setIsAIModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Create with AI
              </button>
            )}
            <Button type="submit" isLoading={isLoading || isGeneratingNumber}>
              {existingInvoice ? "Save Changes" : "Save Invoice"}
            </Button>
          </div>
        </div>

        {/* Invoice Meta */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Invoice Number"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              placeholder={isGeneratingNumber ? "Generating..." : ""}
              readOnly
              disabled
            />
            <InputField
              label="Invoice Date"
              name="invoiceDate"
              type="date"
              value={formData.invoiceDate}
              onChange={handleInputChange}
            />
            <InputField
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Bill From / Bill To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bill From */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Bill From</h3>
            <InputField
              label="Business Name"
              name="businessName"
              value={formData.billFrom.businessName}
              onChange={(e) => handleInputChange(e, "billFrom")}
            />
            <InputField
              label="Email"
              name="email"
              value={formData.billFrom.email}
              onChange={(e) => handleInputChange(e, "billFrom")}
            />
            <TextareaField
              label="Address"
              name="address"
              value={formData.billFrom.address}
              onChange={(e) => handleInputChange(e, "billFrom")}
            />
            <InputField
              label="Phone"
              name="phone"
              value={formData.billFrom.phone}
              onChange={(e) => handleInputChange(e, "billFrom")}
            />
          </div>

          {/* Bill To */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Bill To</h3>
            <InputField
              label="Client Name"
              name="clientName"
              value={formData.billTo.clientName}
              onChange={(e) => handleInputChange(e, "billTo")}
            />
            <InputField
              label="Client Email"
              name="email"
              value={formData.billTo.email}
              onChange={(e) => handleInputChange(e, "billTo")}
            />
            <TextareaField
              label="Client Address"
              name="address"
              value={formData.billTo.address}
              onChange={(e) => handleInputChange(e, "billTo")}
            />
            <InputField
              label="Client Phone"
              name="phone"
              value={formData.billTo.phone}
              onChange={(e) => handleInputChange(e, "billTo")}
            />
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
            <h3 className="text-lg font-semibold text-slate-900">Items</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {["Item", "Qty", "Price", "Tax (%)", "Total", ""].map((h) => (
                    <th
                      key={h}
                      className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {formData.items.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-2 sm:px-6 py-4">
                      <input
                        type="text"
                        name="name"
                        value={item.name}
                        onChange={(e) => handleInputChange(e, null, index)}
                        placeholder="Item name"
                        className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-2 sm:px-6 py-4">
                      <input
                        type="number"
                        name="quantity"
                        value={item.quantity}
                        onChange={(e) => handleInputChange(e, null, index)}
                        className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-2 sm:px-6 py-4">
                      <input
                        type="number"
                        name="unitPrice"
                        value={item.unitPrice}
                        onChange={(e) => handleInputChange(e, null, index)}
                        placeholder="0.00"
                        className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-2 sm:px-6 py-4">
                      <input
                        type="number"
                        name="taxPercent"
                        value={item.taxPercent}
                        onChange={(e) => handleInputChange(e, null, index)}
                        placeholder="0"
                        className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-2 sm:px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                      $
                      {(
                        (item.quantity || 0) *
                        (item.unitPrice || 0) *
                        (1 + (item.taxPercent || 0) / 100)
                      ).toFixed(2)}
                    </td>
                    <td className="px-2 sm:px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        disabled={formData.items.length === 1}
                        className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 sm:p-6 border-t border-slate-200">
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddItem}
              icon={Plus}
            >
              Add Item
            </Button>
          </div>
        </div>

        {/* Notes + Totals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Notes */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Notes and Terms
            </h3>
            <TextareaField
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
            />
            <SelectField
              label="Payment Terms"
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleInputChange}
              options={["Net 15", "Net 30", "Net 60", "Due on receipt"]}
            />
          </div>

          {/* Totals */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-center">
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Tax</span>
                <span>${taxTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-slate-900 border-t border-slate-200 pt-4 mt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* AI Modal — outside <form> to avoid nested form issues */}
      <CreateWithAIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />
    </>
  );
};

export default CreateInvoice;
