import React, { useState } from "react";
import { 
  CreditCard, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Download, 
  Key, 
  ShieldCheck, 
  RefreshCw,
  Coins,
  History
} from "lucide-react";
import { PaymentProfile, Invoice } from "../types";

interface BillingManagerProps {
  paymentProfile: PaymentProfile;
  onRemediatePayment: () => void;
  onToggleAISyncAccess: (status: boolean) => void;
  onAddNotification: (msg: string) => void;
  onAddAuditLog: (action: string, details: string) => void;
}

export default function BillingManager({
  paymentProfile,
  onRemediatePayment,
  onToggleAISyncAccess,
  onAddNotification,
  onAddAuditLog
}: BillingManagerProps) {
  
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(paymentProfile.paymentMethod);
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4821");
  const [customKey, setCustomKey] = useState("FQ-LICENSE-KEY-X889F1-LOCAL");

  const handleRemediate = () => {
    setLoading(true);
    setTimeout(() => {
      onRemediatePayment();
      setLoading(false);
      onAddNotification("Payment remediation complete! Premium services active.");
      onAddAuditLog("Payment Remediation", "Outstanding balance dues settled; local user account verified.");
    }, 1200);
  };

  const handleUpdatePaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    onAddNotification("Payment method updated successfully. Safe-token mapped.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      
      {/* Visual Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-bold text-slate-200 flex items-center">
            <CreditCard className="h-5 w-5 text-indigo-400 mr-2" />
            License & Payment Remediation Desk
          </h2>
          <p className="text-xs text-slate-500 mt-1">Resolve outstanding fee bottlenecks to guarantee absolute data independence</p>
        </div>

        <div className="flex items-center space-x-3">
          {paymentProfile.status === "remediation_required" ? (
            <div className="flex items-center space-x-2 bg-rose-500/10 text-rose-400 border border-rose-500/25 px-3 py-1.5 rounded-xl text-xs font-semibold leading-none">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
              <span>Remediation Required (${paymentProfile.balanceDue} due)</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-3 py-1.5 rounded-xl text-xs font-semibold leading-none">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
              <span>License Active & Certified</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMN A: Outstanding Remediation Form & License Status (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Status Remediation Alerts */}
          {paymentProfile.status === "remediation_required" && (
            <div className="bg-rose-950/15 border border-rose-500/35 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-start space-x-3 text-sm">
                <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-rose-400">Restricted Quota Active</h4>
                  <p className="text-xs text-rose-300/90 leading-relaxed">
                    Your account has an outstanding invoice balance of <strong>${paymentProfile.balanceDue}</strong> from previous pipeline cycles. Because of standard data independence policy compliance, certain automated synchronizations and unrestricted Gemini AI requests are throttled.
                  </p>
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-rose-500/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider block">Outstanding Due Amount</span>
                  <span className="text-lg font-bold font-mono text-white">${paymentProfile.balanceDue}.00 USD</span>
                </div>

                <button
                  onClick={handleRemediate}
                  disabled={loading}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition duration-300 flex items-center shadow-lg shadow-rose-900/10 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Settle Dues & Enable Services</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Settle Details form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Independent Data Renewal Options</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We uphold active user data independence. This ensures you can export, audit, or permanently download your entire productivity stream anytime, regardless of licensing state.
            </p>

            <form onSubmit={handleUpdatePaymentMethod} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1">Billing Channel</label>
                  <select
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none"
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                  >
                    <option value="Visa">Visa •••• 4821</option>
                    <option value="Mastercard">Mastercard •••• 1099</option>
                    <option value="PayPal">PayPal Business (Admin Linked)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1">Backup Vault</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2">
                <span className="text-slate-500">Auto-renewal scheduled: <strong>{paymentProfile.nextRenewalDate}</strong></span>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-350 hover:text-white rounded-lg border border-slate-700 transition"
                >
                  Settle Billing Credentials
                </button>
              </div>
            </form>
          </div>

          {/* Licenses Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center space-x-2">
              <Key className="h-4.5 w-4.5 text-indigo-400" />
              <h4 className="text-xs font-bold text-slate-200">Local License Key Registration</h4>
            </div>

            <div className="flex space-x-3">
              <input
                type="text"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs font-mono text-slate-305 outline-none"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
              />
              <button
                onClick={() => onAddNotification("License key re-verified successfully.")}
                className="px-3.5 py-1.5 bg-indigo-600/10 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition rounded-xl text-xs text-indigo-400 font-bold"
              >
                Re-Verify Key
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              License keys are saved locally. Removing keys reverts account to offline basic tracking immediately.
            </p>
          </div>

        </div>

        {/* COLUMN B: Invoices Ledger (Span 5) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <History className="h-5 w-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-200">Billing & Invoice Ledger</h3>
            </div>

            <div className="space-y-3">
              {paymentProfile.invoiceHistory.map((inv) => (
                <div key={inv.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <span className="font-semibold block text-slate-200">{inv.description}</span>
                    <span className="text-[10px] text-slate-500">Date: {inv.date}</span>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="font-mono font-bold block text-slate-300">${inv.amount}.00</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-mono font-semibold ${
                      inv.status === "paid" 
                        ? "bg-emerald-500/10 text-emerald-400"
                        : inv.status === "pending"
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-red-500/10 text-red-400 animate-pulse"
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 text-xs">
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-slate-400">
              <span className="flex items-center text-[11px] leading-tight text-slate-400"><HelpCircle className="h-3.5 w-3.5 mr-1" />Invoice Audits required?</span>
              <button 
                onClick={() => onAddNotification("Initiated local file invoice receipt download.")} 
                className="text-xs text-indigo-400 font-bold hover:underline flex items-center cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Receipts (PDF)
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
