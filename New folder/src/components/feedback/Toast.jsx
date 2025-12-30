// Tip: Use a library like 'react-hot-toast' for the logic,
// but style it here to match your professional theme.
import { Toaster } from "react-hot-toast";

export const FeedbackProvider = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 3000,
      style: {
        background: "#fff",
        color: "#1e293b",
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      },
    }}
  />
);
