/**
 * ReportContext.jsx
 *
 * Global React context that owns the report state.
 * Autosaves to localStorage on every change (debounced 800ms).
 */
import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { DEFAULT_REPORT, createBlankSection } from '../data/defaultReport.js';
import {
  saveReport,
  loadReport,
  clearReport,
  rehydrateImages,
  saveImageBlob,
  deleteImageBlob,
  clearAllImageBlobs,
} from '../storage/storage.js';

const ReportContext = createContext(null);

export function ReportProvider({ children }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef(null);

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      const saved = loadReport();
      if (saved) {
        const mergedHeaderFooter = {
          ...DEFAULT_REPORT.headerFooter,
          ...(saved.headerFooter || {}),
          header: {
            ...DEFAULT_REPORT.headerFooter.header,
            ...(saved.headerFooter?.header || {}),
          },
          footer: {
            ...DEFAULT_REPORT.headerFooter.footer,
            ...(saved.headerFooter?.footer || {}),
          },
          pageDecoration: {
            ...DEFAULT_REPORT.headerFooter.pageDecoration,
            ...(saved.headerFooter?.pageDecoration || {}),
          },
        };
        const hydrated = await rehydrateImages({
          ...saved,
          headerFooter: mergedHeaderFooter,
        });
        setReport(hydrated);
      } else {
        const fresh = {
          ...DEFAULT_REPORT,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setReport(fresh);
      }
      setLoading(false);
    }
    init();
  }, []);

  // ── Autosave (debounced) ──────────────────────────────────────────────────
  useEffect(() => {
    if (!report) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveReport(report);
    }, 800);
    return () => clearTimeout(saveTimer.current);
  }, [report]);

  // ── Updater helpers ───────────────────────────────────────────────────────
  const updateReport = useCallback((updater) => {
    setReport((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return { ...next, updatedAt: new Date().toISOString() };
    });
  }, []);

  const updateFrontSheet = useCallback((patch) => {
    updateReport((prev) => ({
      ...prev,
      frontSheet: { ...prev.frontSheet, ...patch },
    }));
  }, [updateReport]);

  const updateSettings = useCallback((patch) => {
    updateReport((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...patch },
    }));
  }, [updateReport]);

  const updateHeaderFooter = useCallback((patch) => {
    updateReport((prev) => ({
      ...prev,
      headerFooter: {
        ...prev.headerFooter,
        ...patch,
        header: { ...prev.headerFooter?.header, ...(patch.header || {}) },
        footer: { ...prev.headerFooter?.footer, ...(patch.footer || {}) },
        pageDecoration: { ...prev.headerFooter?.pageDecoration, ...(patch.pageDecoration || {}) },
      },
    }));
  }, [updateReport]);

  // ── Section helpers ───────────────────────────────────────────────────────
  const addSection = useCallback(() => {
    const newSec = createBlankSection();
    updateReport((prev) => ({
      ...prev,
      sections: [...prev.sections, newSec],
    }));
    return newSec.id;
  }, [updateReport]);

  const updateSection = useCallback((id, patch) => {
    updateReport((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === id ? { ...s, ...patch } : s
      ),
    }));
  }, [updateReport]);

  const deleteSection = useCallback((id) => {
    updateReport((prev) => {
      const sec = prev.sections.find((s) => s.id === id);
      if (sec) {
        sec.images.forEach((img) => deleteImageBlob(img.id));
      }
      return {
        ...prev,
        sections: prev.sections.filter((s) => s.id !== id),
      };
    });
  }, [updateReport]);

  const moveSectionUp = useCallback((id) => {
    updateReport((prev) => {
      const idx = prev.sections.findIndex((s) => s.id === id);
      if (idx <= 0) return prev;
      const sections = [...prev.sections];
      [sections[idx - 1], sections[idx]] = [sections[idx], sections[idx - 1]];
      return { ...prev, sections };
    });
  }, [updateReport]);

  const moveSectionDown = useCallback((id) => {
    updateReport((prev) => {
      const idx = prev.sections.findIndex((s) => s.id === id);
      if (idx < 0 || idx >= prev.sections.length - 1) return prev;
      const sections = [...prev.sections];
      [sections[idx], sections[idx + 1]] = [sections[idx + 1], sections[idx]];
      return { ...prev, sections };
    });
  }, [updateReport]);

  // ── Image helpers ─────────────────────────────────────────────────────────
  const addImageToSection = useCallback(async (sectionId, imageFile, caption, size) => {
    const imageId = `img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    await saveImageBlob(imageId, imageFile);
    const blobUrl = URL.createObjectURL(imageFile);
    const imgEntry = { id: imageId, caption: caption || '', size: size || 'medium', blobUrl };
    updateSection(sectionId, {});
    updateReport((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, images: [...s.images, imgEntry] } : s
      ),
    }));
  }, [updateReport]);

  const removeImageFromSection = useCallback((sectionId, imageId) => {
    deleteImageBlob(imageId);
    updateReport((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? { ...s, images: s.images.filter((img) => img.id !== imageId) }
          : s
      ),
    }));
  }, [updateReport]);

  /**
   * Patch a single image's metadata (caption, size, etc.) inside a section.
   * Uses the functional updater so it always reads the latest state, not a
   * stale closure snapshot — this is the correct fix for the size-update bug.
   */
  const updateImageInSection = useCallback((sectionId, imageId, patch) => {
    updateReport((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          images: s.images.map((img) =>
            img.id === imageId ? { ...img, ...patch } : img
          ),
        };
      }),
    }));
  }, [updateReport]);

  // ── New / Delete report ───────────────────────────────────────────────────
  const newReport = useCallback(async () => {
    await clearAllImageBlobs();
    clearReport();
    const fresh = {
      ...DEFAULT_REPORT,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setReport(fresh);
  }, []);

  const value = {
    report,
    loading,
    updateFrontSheet,
    updateSettings,
    updateHeaderFooter,
    addSection,
    updateSection,
    deleteSection,
    moveSectionUp,
    moveSectionDown,
    addImageToSection,
    updateImageInSection,
    removeImageFromSection,
    newReport,
  };

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
}

export function useReport() {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error('useReport must be used within <ReportProvider>');
  return ctx;
}
