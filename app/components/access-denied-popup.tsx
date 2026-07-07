"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldAlert, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AccessDeniedPopup() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (searchParams?.get("error") === "RestrictedAccess") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(true);
      // Clean up the URL to prevent showing the popup again on refresh
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      router.replace(url.pathname + url.search + url.hash, { scroll: false });
      
      // Auto-hide after 8 seconds
      const timer = setTimeout(() => setShow(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShow(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md cursor-pointer"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative flex w-full max-w-lg flex-col items-center gap-6 rounded-2xl border border-red-500/40 bg-slate-900/95 p-8 shadow-[0_10px_40px_rgba(239,68,68,0.3)] backdrop-blur-2xl text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-red-500 border border-red-500/30">
              <ShieldAlert className="h-8 w-8 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            </div>
            
            <div>
              <h3 className="font-display text-2xl font-bold uppercase tracking-[0.1em] text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.4)]">
                Clearance Denied
              </h3>
              <p className="mt-3 text-lg text-slate-300 leading-relaxed max-w-sm mx-auto">
                Your ID does not have the required access codes for this system. Contact Admin for authorization.
              </p>
            </div>
            
            <button
              onClick={() => setShow(false)}
              className="mt-4 flex w-full max-w-[200px] items-center justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.6)]"
            >
              Acknowledge
            </button>
            
            <button
              onClick={() => setShow(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
