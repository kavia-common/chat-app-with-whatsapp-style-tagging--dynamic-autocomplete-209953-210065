import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchTags, setAnchorPos, setQuery, setTrigger, setVisible, show, hide } from "@/store/tagsSlice";
import { TagTrigger } from "@/types";

/**
PUBLIC_INTERFACE
useTagging
Hook to enable WhatsApp-style tagging in a contenteditable element.
It tracks @/# trigger, current query, caret position, and dispatches to store to show suggestions.
*/
export function useTagging(editorRef: React.RefObject<HTMLElement | HTMLDivElement | null>) {
  const dispatch = useDispatch<AppDispatch>();
  const currentTrigger = useRef<TagTrigger | null>(null);

  const getCaretClientRect = useCallback((): { x: number; y: number } | null => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const range = sel.getRangeAt(0).cloneRange();
    range.collapse(true);
    const rect = range.getBoundingClientRect();
    if (rect) {
      return { x: rect.left, y: rect.bottom + window.scrollY + 6 };
    }
    return null;
  }, []);

  const detectTrigger = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const node = sel.anchorNode;
    if (!node) return;

    let textBefore = "";
    if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent || "";
      textBefore = t.slice(0, sel.anchorOffset);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const focusOffset = sel.anchorOffset;
      const child = el.childNodes[focusOffset - 1] as ChildNode | null;
      if (child && child.textContent) {
        textBefore = child.textContent;
      }
    }

    const match = /(^|\s)([@#])([^\s@#]*)$/.exec(textBefore);
    if (match) {
      const symbol = match[2] as TagTrigger;
      const query = match[3] || "";
      currentTrigger.current = symbol;
      const pos = getCaretClientRect();
      if (pos) {
        dispatch(
          show({
            trigger: symbol,
            query,
            anchorPos: pos,
          })
        );
        dispatch(fetchTags({ trigger: symbol, search: query }));
      } else {
        dispatch(setTrigger(symbol));
        dispatch(setQuery(query));
        dispatch(setVisible(true));
      }
    } else {
      currentTrigger.current = null;
      dispatch(hide());
    }
  }, [dispatch, getCaretClientRect]);

  const onKeyUp = useCallback(() => {
    detectTrigger();
  }, [detectTrigger]);

  const onInput = useCallback(() => {
    detectTrigger();
  }, [detectTrigger]);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    el.addEventListener("keyup", onKeyUp);
    el.addEventListener("input", onInput);
    el.addEventListener("mouseup", () => {
      const pos = getCaretClientRect();
      if (pos) dispatch(setAnchorPos(pos));
    });
    return () => {
      el.removeEventListener("keyup", onKeyUp);
      el.removeEventListener("input", onInput);
    };
  }, [editorRef, onKeyUp, onInput, dispatch, getCaretClientRect]);

  // PUBLIC_INTERFACE
  const insertTagAtCaret = useCallback(
    (chipEl: HTMLElement) => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);

      // Remove the "@query" word before caret
      const wordRange = range.cloneRange();
      wordRange.setStart(range.startContainer, 0);
      const fullTextBefore = wordRange.toString();
      const triggerMatch = /([@#])([^\s@#]*)$/.exec(fullTextBefore);
      if (triggerMatch) {
        let remaining = triggerMatch[0].length;
        while (remaining > 0) {
          const container = range.startContainer;
          if (container.nodeType === Node.TEXT_NODE) {
            const tnode = container as Text;
            const removeCount = Math.min(remaining, range.startOffset);
            const start = range.startOffset - removeCount;
            tnode.deleteData(start, removeCount);
            remaining -= removeCount;
            range.setStart(tnode, start);
          } else {
            break;
          }
        }
      }

      // Insert spaces and chip
      const space1 = document.createTextNode(" ");
      const space2 = document.createTextNode(" ");
      range.insertNode(space2);
      range.insertNode(chipEl);
      range.insertNode(space1);

      // Move caret after trailing space
      sel.removeAllRanges();
      const newRange = document.createRange();
      newRange.setStartAfter(space2);
      newRange.collapse(true);
      sel.addRange(newRange);

      dispatch(hide());
    },
    [dispatch]
  );

  return {
    insertTagAtCaret,
  };
}
