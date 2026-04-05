import { useEffect, useRef, useState } from 'react';
import type { WidgetId, WidgetLayout } from '../../types';

interface UseWidgetEditHistoryArgs {
  isEditMode: boolean;
  layoutDraft: Partial<Record<WidgetId, WidgetLayout>>;
  setLayoutDraft: (layouts: Partial<Record<WidgetId, WidgetLayout>>) => void;
  persistLayouts: (layouts: Partial<Record<WidgetId, WidgetLayout>>) => void;
  onExitEditMode: () => void;
}

const cloneLayouts = (layouts: Partial<Record<WidgetId, WidgetLayout>>) => {
  const cloned: Partial<Record<WidgetId, WidgetLayout>> = {};
  Object.entries(layouts).forEach(([widgetId, layout]) => {
    if (!layout) return;
    cloned[widgetId as WidgetId] = { ...layout };
  });
  return cloned;
};

export const useWidgetEditHistory = ({
  isEditMode,
  layoutDraft,
  setLayoutDraft,
  persistLayouts,
  onExitEditMode,
}: UseWidgetEditHistoryArgs) => {
  const [undoStack, setUndoStack] = useState<Array<Partial<Record<WidgetId, WidgetLayout>>>>([]);
  const [redoStack, setRedoStack] = useState<Array<Partial<Record<WidgetId, WidgetLayout>>>>([]);
  const layoutDraftRef = useRef(layoutDraft);

  useEffect(() => {
    layoutDraftRef.current = layoutDraft;
  }, [layoutDraft]);

  const pushUndoSnapshot = () => {
    if (!isEditMode) return;
    setUndoStack((prev) => [...prev, cloneLayouts(layoutDraftRef.current)]);
    setRedoStack([]);
  };

  const resetHistory = () => {
    setUndoStack([]);
    setRedoStack([]);
  };

  const undoEdit = () => {
    if (!isEditMode) return;
    setUndoStack((prev) => {
      const last = prev[prev.length - 1];
      if (!last) return prev;

      setRedoStack((redoPrev) => [...redoPrev, cloneLayouts(layoutDraftRef.current)]);
      setLayoutDraft(last);
      persistLayouts(last);
      return prev.slice(0, -1);
    });
  };

  const redoEdit = () => {
    if (!isEditMode) return;
    setRedoStack((prev) => {
      const last = prev[prev.length - 1];
      if (!last) return prev;

      setUndoStack((undoPrev) => [...undoPrev, cloneLayouts(layoutDraftRef.current)]);
      setLayoutDraft(last);
      persistLayouts(last);
      return prev.slice(0, -1);
    });
  };

  const finishEditMode = () => {
    resetHistory();
    onExitEditMode();
  };

  useEffect(() => {
    if (!isEditMode) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        finishEditMode();
        return;
      }

      const isUndo = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && !event.shiftKey;
      const isRedo = (event.ctrlKey || event.metaKey) && (
        (event.shiftKey && event.key.toLowerCase() === 'z') ||
        event.key.toLowerCase() === 'y'
      );

      if (isUndo) {
        event.preventDefault();
        undoEdit();
      } else if (isRedo) {
        event.preventDefault();
        redoEdit();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isEditMode]);

  return {
    undoStack,
    redoStack,
    pushUndoSnapshot,
    resetHistory,
    undoEdit,
    redoEdit,
    finishEditMode,
  };
};
