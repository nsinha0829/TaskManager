import React, {
    createContext,
    useContext,
    useState,
    useCallback
  } from "react";
  
  type ToastType = "success" | "error" | "info";
  
  type Toast = {
    id: number;
    message: string;
    type: ToastType;
  };
  
  type ToastContextValue = {
    showToast: (message: string, type?: ToastType) => void;
  };
  
  const ToastContext = createContext<ToastContextValue | undefined>(undefined);
  
  export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
    children
  }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
  
    const showToast = useCallback((message: string, type: ToastType = "info") => {
      const id = Date.now() + Math.random();
      const toast: Toast = { id, message, type };
      setToasts((prev) => [...prev, toast]);
  
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    }, []);
  
    return (
      <ToastContext.Provider value={{ showToast }}>
        {children}
        {/* Toast container overlay */}
        <div
          style={{
            position: "fixed",
            bottom: "1rem",
            right: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            zIndex: 9999
          }}
        >
          {toasts.map((t) => {
            let background = "#333";
            if (t.type === "success") background = "#16a34a"; // green
            if (t.type === "error") background = "#b91c1c";   // red
  
            return (
              <div
                key={t.id}
                style={{
                  minWidth: "200px",
                  maxWidth: "320px",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  color: "white",
                  background,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                  fontSize: "0.9rem"
                }}
              >
                {t.message}
              </div>
            );
          })}
        </div>
      </ToastContext.Provider>
    );
  };
  
  export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) {
      throw new Error("useToast must be used within a ToastProvider");
    }
    return ctx;
  };
  