"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const consent = localStorage.getItem("cookie-consent");
      if (!consent) {
        setShow(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:bottom-8 md:left-8 md:right-auto max-w-sm rounded-xl border border-line bg-bg/95 p-6 shadow-xl backdrop-blur-md"
        >
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-medium text-ink">Cookie Consent</h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                We use cookies to improve your experience. By continuing to visit this site you agree to our use of cookies.
                Read our{" "}
                <Link href="/privacy-policy" className="text-ink underline hover:text-accent">
                  Privacy Policy
                </Link>.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={accept}
                className="rounded-md bg-ink px-4 py-2 text-xs font-medium text-bg hover:bg-ink/90 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
