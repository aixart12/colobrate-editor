"use client";

import { updateScrapedDataByID } from "@/service/scrape";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FunctionComponent, useEffect, useState, useCallback } from "react";
import { debounce } from "lodash"; // To debounce the auto-save
import { toast } from "react-toastify"; // Import toast

const Tiptap: FunctionComponent<{
  content?: string;
  contentId: number | null;
}> = ({ content = "", contentId }) => {
  const [autoSaveInterval, setAutoSaveInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [isSaving, setIsSaving] = useState(false); // Track saving state

  // Function to simulate auto-saving
  const autoSaveContent = useCallback(
    async (content: string) => {
      if (contentId) {
        setIsSaving(true); // Start showing saving indicator
        try {
          console.log("Auto-saving content:", content);
          await updateScrapedDataByID(contentId, { content: content });
          // Show success toast after saving
          toast.success("Content saved successfully!");
        } catch (error) {
          console.error("Auto-save failed:", error);
          // Show error toast if save fails
          toast.error("Failed to save content.");
        } finally {
          setIsSaving(false); // Stop showing saving indicator after save is complete
        }
      }
    },
    [contentId]
  );

  // Debounced version of auto-save function to avoid immediate calls
  const debouncedAutoSave = useCallback(
    debounce((content: string) => autoSaveContent(content), 1000),
    [autoSaveContent]
  );

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      // Ensures that the editor content is updated and available for auto-save
      const currentContent = editor.getHTML();
      debouncedAutoSave(currentContent); // Use debounced auto-save on every update
    },
  });

  useEffect(() => {
    if (editor) {
      // This effect should only set the initial content when `content` prop changes.
      if (content !== editor.getHTML()) {
        editor.commands.setContent(content); // Update the editor content when the prop changes
      }
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor && autoSaveInterval === null) {
      // Set auto-save interval (e.g., every 5 seconds) only once when the editor is initialized
      const interval = setInterval(() => {
        const currentContent = editor.getHTML();
        debouncedAutoSave(currentContent); // Call auto-save function
      }, 5000);

      setAutoSaveInterval(interval);

      // Cleanup on component unmount
      return () => clearInterval(interval);
    }
  }, [editor, autoSaveInterval, debouncedAutoSave]); // Only run this effect once when the editor is initialized

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
