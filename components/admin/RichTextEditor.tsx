"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { TableKit } from "@tiptap/extension-table";
import ResizableImage from "@/components/admin/ResizableImage";
import { useEffect, useRef } from "react";

const FONTS = [
  "Arial",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Verdana",
  "Tahoma",
  "Helvetica",
];

const SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 40, 48];

async function uploadImage(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json();
  return data.ok ? data.url : null;
}

const btnBase: React.CSSProperties = {
  border: "1px solid #000",
  padding: "6px 10px",
  fontSize: 12,
  background: "#fff",
};

function ToolbarButton({
  active,
  onClick,
  children,
  style,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ ...btnBase, ...style, background: active ? "#000" : "#fff", color: active ? "#fff" : "#000" }}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
        padding: 8,
        borderBottom: "1px solid #000",
        background: "#f4f4f4",
      }}
    >
      <ToolbarButton
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        style={{ fontWeight: 700 }}
      >
        B
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        style={{ fontStyle: "italic" }}
      >
        I
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        style={{ textDecoration: "underline" }}
      >
        U
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        style={{ textDecoration: "line-through" }}
      >
        S
      </ToolbarButton>

      <select
        className="mono"
        style={btnBase}
        defaultValue=""
        onChange={(e) => {
          if (e.target.value) editor.chain().focus().setFontFamily(e.target.value).run();
          e.target.value = "";
        }}
      >
        <option value="" disabled>
          Шрифт
        </option>
        {FONTS.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>

      <select
        className="mono"
        style={btnBase}
        defaultValue=""
        onChange={(e) => {
          if (e.target.value) editor.chain().focus().setFontSize(`${e.target.value}px`).run();
          e.target.value = "";
        }}
      >
        <option value="" disabled>
          Размер
        </option>
        {SIZES.map((s) => (
          <option key={s} value={s}>
            {s}px
          </option>
        ))}
      </select>

      <label className="mono" style={{ ...btnBase, display: "flex", alignItems: "center", gap: 4 }}>
        A
        <input
          type="color"
          style={{ width: 18, height: 18, border: "none", padding: 0 }}
          onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
        />
      </label>

      <label className="mono" style={{ ...btnBase, display: "flex", alignItems: "center", gap: 4 }}>
        ▨
        <input
          type="color"
          style={{ width: 18, height: 18, border: "none", padding: 0 }}
          onInput={(e) =>
            editor.chain().focus().toggleHighlight({ color: (e.target as HTMLInputElement).value }).run()
          }
        />
      </label>

      <ToolbarButton
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()}>
        P
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • Список
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1. Список
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        ⟸
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        ⟺
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        ⟹
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive("table")}
        onClick={() => {
          if (editor.isActive("table")) return;
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        }}
      >
        ▦ Таблица
      </ToolbarButton>
      {editor.isActive("table") && (
        <>
          <ToolbarButton onClick={() => editor.chain().focus().addRowAfter().run()}>+ Строка</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().addColumnAfter().run()}>+ Столбец</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().deleteRow().run()}>− Строка</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().deleteColumn().run()}>− Столбец</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().deleteTable().run()}>🗑 Таблица</ToolbarButton>
        </>
      )}

      <ToolbarButton onClick={() => fileInputRef.current?.click()}>🖼 Картинка</ToolbarButton>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
        style={{ display: "none" }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          const url = await uploadImage(file);
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
      />

      <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
        Очистить
      </ToolbarButton>
    </div>
  );
}

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextStyleKit,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TableKit.configure({ table: { resizable: true } }),
      ResizableImage,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      // Lets an admin paste a screenshot/image straight from the clipboard
      // (Ctrl+V) or drag a file in, instead of only picking one via the
      // toolbar button — both go through the same /api/upload endpoint.
      handlePaste: (view, event) => {
        const files = Array.from(event.clipboardData?.items || [])
          .filter((item) => item.kind === "file" && item.type.startsWith("image/"))
          .map((item) => item.getAsFile())
          .filter((f): f is File => f !== null);
        if (files.length === 0) return false;
        event.preventDefault();
        files.forEach((file) => {
          uploadImage(file).then((url) => {
            if (!url) return;
            const { schema } = view.state;
            const node = schema.nodes.image.create({ src: url });
            const transaction = view.state.tr.replaceSelectionWith(node);
            view.dispatch(transaction);
          });
        });
        return true;
      },
      handleDrop: (view, event) => {
        const files = Array.from(event.dataTransfer?.files || []).filter((f) => f.type.startsWith("image/"));
        if (files.length === 0) return false;
        event.preventDefault();
        files.forEach((file) => {
          uploadImage(file).then((url) => {
            if (!url) return;
            const { schema } = view.state;
            const node = schema.nodes.image.create({ src: url });
            const transaction = view.state.tr.replaceSelectionWith(node);
            view.dispatch(transaction);
          });
        });
        return true;
      },
      // ListItem's own Tab shortcut (sinkListItem) only fires when the
      // browser event never reaches native tab-navigation — but when
      // sinkListItem isn't applicable (e.g. this is the first item at its
      // depth, nothing to nest under), Tiptap's keymap returns false and
      // the keydown falls through to the browser, which then moves focus
      // to the next focusable element on the page (jumping the scroll
      // position to wherever that is). Always intercept Tab/Shift-Tab
      // ourselves so that never happens, regardless of whether the
      // indent/outdent actually applies.
      handleKeyDown: (_view, event) => {
        if (event.key !== "Tab") return false;
        event.preventDefault();
        if (event.shiftKey) {
          editor?.commands.liftListItem("listItem");
        } else {
          editor?.commands.sinkListItem("listItem");
        }
        return true;
      },
    },
  });

  useEffect(() => {
    if (editor && !editor.isFocused && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div style={{ border: "1px solid #000" }}>
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        style={{
          minHeight: 220,
          padding: 16,
          fontSize: 15,
          lineHeight: 1.6,
          background: "#fff",
          color: "#000",
        }}
      />
    </div>
  );
}
