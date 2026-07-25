"use client";

import { useEffect, useState, useCallback } from "react";

export function useFormPersist<T extends Record<string, any>>(
  storageKey: string,
  initialValues: T
) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [isRestored, setIsRestored] = useState(false);

  // 1. Hydrate state from localStorage on initial client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error("Failed to restore form draft:", error);
    } finally {
      setIsRestored(true);
    }
  }, [storageKey]);

  // 2. Persist state changes back to localStorage
  useEffect(() => {
    if (!isRestored) return; // Don't overwrite storage before restoring!

    try {
      localStorage.setItem(storageKey, JSON.stringify(formData));
    } catch (error) {
      console.error("Failed to persist form draft:", error);
    }
  }, [formData, storageKey, isRestored]);

  // Helper to update a single field
  const updateField = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Helper to clear draft upon successful submission
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error("Failed to clear draft:", error);
    }
  }, [storageKey]);

  return { formData, setFormData, updateField, clearDraft, isRestored };
}