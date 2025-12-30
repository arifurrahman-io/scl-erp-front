// src/components/ui/ConfirmModal.jsx
import React from "react";
import { AlertTriangle } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "danger",
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 text-center">
          <div
            className={`mx-auto w-16 h-16 rounded-3xl flex items-center justify-center mb-6 ${
              type === "danger"
                ? "bg-rose-50 text-rose-500"
                : "bg-indigo-50 text-indigo-500"
            }`}
          >
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">{title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3 p-6 bg-slate-50/50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-6 py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${
              type === "danger"
                ? "bg-rose-500 hover:bg-rose-600 shadow-rose-100"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmModal;
