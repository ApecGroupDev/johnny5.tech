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
    if (searchParams.get("error") === "RestrictedAccess") {
      setShow(true);
      // Clean up the URL to prevent showing the popup again on refresh
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      router.replace(url.pathname + url.search);
      
      // Auto-hide after 8 seconds
      const timer = setTimeout(() => setShow(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-4 rounded-xl border border-red-500/30 bg-slate-900/90 p-5 shadow-[0_0_30px_rgba(239,68,68,0.3)] backdrop-blur-xl"
        >
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-500 border border-red-500/30">
            <ShieldAlert className="h-5 w-5 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          </div>
          <div>
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.4)]">
              Clearance Denied
            </h3>
            <p className="mt-1.5 text-sm text-slate-300 leading-relaxed">
              Your Trooper ID does not have the required access codes for this system. Contact a Jedi Master for authorization.
            </p>
          </div>
          <button
            onClick={() => setShow(false)}
            className="ml-2 rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
