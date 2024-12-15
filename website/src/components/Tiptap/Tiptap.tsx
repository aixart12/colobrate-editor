"use client";

import socket from "@/shared/socket";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FunctionComponent, useEffect, useState } from "react";
import { toast } from "react-toastify";

const Tiptap: FunctionComponent<{
  content?: string;
  contentId: number | null;
}> = ({ content = "", contentId }) => {
  const [isSaving, setIsSaving] = useState(false); // Track saving state
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const updatedContent = editor.getHTML();

      // Emit content changes to the server and show the saving indicator
      if (contentId) {
        setIsSaving(true); // Show "Saving..." indicator
        socket.emit("edit_content", { contentId, content: updatedContent });

        // Simulate a delay to ensure the indicator is visible
        setTimeout(() => {
          setIsSaving(false); // Hide the "Saving..." indicator after emitting
        }, 1000);
      }
    },
  });

  useEffect(() => {
    if (contentId) {
      // Connect to the socket server when the component is mounted
      if (!socket.connected) socket.connect();

      // Join a room for the specific content
      socket.emit("join_room", { contentId });

      // Listen for real-time content updates
      socket.on("content_update", (data) => {
        if (editor && data.content !== editor.getHTML()) {
          editor.commands.setContent(data.content); // Update editor content in real-time
        }
      });

      // Notify when a user joins or leaves
      socket.on("user_joined", (data) => toast.info(data.msg));
      socket.on("user_left", (data) => toast.warning(data.msg));

      // Cleanup on component unmount
      return () => {
        socket.emit("leave_room", { contentId });
        socket.off("content_update");
        socket.off("user_joined");
        socket.off("user_left");
      };
    }
  }, [contentId, editor]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content); // Sync initial content
    }
  }, [content, editor]);

  return (
    <div>
      <div style={{ marginTop: "10px", fontSize: "14px", color: "gray" }}>
        {isSaving ? "Saving..." : "All changes saved."}
      </div>
      <EditorContent editor={editor} />
      {/* Auto-Save Indicator */}
    </div>
  );
};

export default Tiptap;
