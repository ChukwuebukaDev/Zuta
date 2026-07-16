"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { AuthCard } from "@/app/(auth)/login/AuthCard";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
       <div className="fixed inset-0 z-50 flex flex-col items-center justify-start p-4 overflow-y-auto sm:py-12">
          
          {/* Backdrop Blur Layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer" // Changed to fixed inset
          />

          {/* Modal Content Wrapper */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            
            className="relative w-full max-w-md pointer-events-auto my-auto z-10"
          >
            {/* Elegant Close Button Anchor */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-900/50 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            {/* Reused AuthCard Core Logic */}
            <AuthCard initialMode={initialMode} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}