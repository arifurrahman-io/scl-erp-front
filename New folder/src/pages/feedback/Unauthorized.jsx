import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import Button from "../../components/ui/Button";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      {/* Visual Indicator */}
      <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <ShieldAlert className="text-rose-500" size={48} />
      </div>

      {/* Error Message */}
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Access Denied</h1>
      <p className="text-slate-600 max-w-md mb-8">
        Oops! It looks like you don't have the necessary permissions to view
        this page. If you believe this is a mistake, please contact your System
        Administrator.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Go Back
        </Button>

        <Button
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <Home size={18} />
          Back to Dashboard
        </Button>
      </div>

      {/* System Note */}
      <div className="mt-12 pt-8 border-t border-slate-200 w-full max-w-xs">
        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
          Error Code: 403 Forbidden
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
