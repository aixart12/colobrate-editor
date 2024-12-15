"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FunctionComponent, useEffect } from "react";

const Tiptap: FunctionComponent<{ content?: string }> = ({ content = "" }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    // Don't initialize immediatelyRender to false, it may affect the initial render
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content); // Update the editor content when the prop changes
    }
  }, [content, editor]); // Effect depends on content and editor

  return <EditorContent editor={editor} />;
};

export default Tiptap;
