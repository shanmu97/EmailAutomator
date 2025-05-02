import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Underline } from "@tiptap/extension-underline";
import { Strike } from "@tiptap/extension-strike";
import { Button } from "react-bootstrap";

const EditorComponent = ({
  initialContent = "<p>Start typing...</p>",
  onChange,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        HTMLAttributes: {
          class: "text-sky-500 underline",
        },
      }),
      Image,
      Underline,
      Strike,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange && onChange(editor.getHTML());
    },
    editorProps: {
        attributes: {
            class: "your-custom-class focus:outline-none", // Example: remove focus outline
            style: "min-height:350px; padding:6px;"      // Example: set min height and padding
          },
      handlePaste: (view, event) => {
        const clipboard = event.clipboardData;
        const items = clipboard.items;

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.indexOf("image") !== -1) {
            const blob = item.getAsFile();
            const reader = new FileReader();

            reader.onload = () => {
              const url = reader.result;
              editor.chain().focus().setImage({ src: url }).run();
            };

            reader.readAsDataURL(blob);
          }
        }
      },
    },
  });

  // --- This useEffect ensures the editor updates when initialContent changes ---
  React.useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent, false);
    }
  }, [initialContent, editor]);
  // ---------------------------------------------------------------------------

  // Convert any "http" or "https" starting text to a link (optional, can be improved)
  React.useEffect(() => {
    if (!editor) return;
    const handleLinkAutoConvert = () => {
      const content = editor.getText();
      const regex = /https?:\/\/[^\s]+/g;
      const matches = content.match(regex);
      if (matches) {
        matches.forEach((match) => {
          editor.commands.setLink({ href: match });
        });
      }
    };
    handleLinkAutoConvert();
  }, [editor]);

  const handleLinkInsert = () => {
    if (!editor) return;
    const url = prompt("Enter the URL");
    if (url) {
      const { empty } = editor.state.selection;
      if (empty) {
        editor
          .chain()
          .focus()
          .insertContent([
            {
              type: "text",
              text: url,
              marks: [{ type: "link", attrs: { href: url } }],
            },
          ])
          .run();
      } else {
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
      }
    }
  };

  return (
    <div className="editor-container">
      <Button onClick={handleLinkInsert} className="
    inline-flex items-center
    border border-transparent
    rounded-lg
    py-1 px-6
    my-2
    text-white
    bg-gradient-to-r from-blue-600 to-blue-800
    hover:from-blue-700 hover:to-blue-900
    text-base font-semibold
    shadow
    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
    transition
    duration-150
    ease-in-out
    dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900
  ">Link</Button>

      <EditorContent
  editor={editor}
  className="tiptap-editor border border-gray-400 rounded-md m-3 "
/>

      
    </div>
  );
};

export default EditorComponent;
