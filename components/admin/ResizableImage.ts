import TiptapImage from "@tiptap/extension-image";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";

// Adds a drag handle to the bottom-right corner of inserted images so an
// admin can resize them by dragging, instead of only choosing a fixed
// size. Width is stored as a node attribute and rendered as an inline
// `style="width:...px"` on the <img> itself, so the size carries straight
// through into the raw HTML saved to the DB and shows up identically on
// the public site (no JS needed there, it's just a static style).
const ResizableImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        renderHTML: (attributes: { width?: number | null }) => {
          if (!attributes.width) return {};
          return { style: `width: ${attributes.width}px` };
        },
        parseHTML: (element: HTMLElement) => {
          const width = element.style.width;
          return width ? parseInt(width, 10) : null;
        },
      },
    };
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      let currentNode: ProseMirrorNode = node;

      const container = document.createElement("div");
      container.style.position = "relative";
      container.style.display = "inline-block";
      container.style.maxWidth = "100%";
      container.style.lineHeight = "0";

      const img = document.createElement("img");
      img.src = currentNode.attrs.src;
      if (currentNode.attrs.alt) img.alt = currentNode.attrs.alt;
      img.style.display = "block";
      img.style.maxWidth = "100%";
      img.style.height = "auto";
      if (currentNode.attrs.width) img.style.width = `${currentNode.attrs.width}px`;

      const handle = document.createElement("div");
      handle.contentEditable = "false";
      handle.style.position = "absolute";
      handle.style.right = "2px";
      handle.style.bottom = "2px";
      handle.style.width = "14px";
      handle.style.height = "14px";
      handle.style.background = "#000";
      handle.style.border = "2px solid #fff";
      handle.style.cursor = "nwse-resize";
      handle.style.boxSizing = "border-box";

      container.appendChild(img);
      container.appendChild(handle);

      let startX = 0;
      let startWidth = 0;

      const onPointerMove = (event: PointerEvent) => {
        const delta = event.clientX - startX;
        const newWidth = Math.max(60, Math.round(startWidth + delta));
        img.style.width = `${newWidth}px`;
      };

      const onPointerUp = () => {
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onPointerUp);
        const finalWidth = parseInt(img.style.width, 10);
        const pos = typeof getPos === "function" ? getPos() : undefined;
        if (typeof pos === "number") {
          editor.view.dispatch(
            editor.view.state.tr.setNodeMarkup(pos, undefined, { ...currentNode.attrs, width: finalWidth })
          );
        }
      };

      handle.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        startX = event.clientX;
        startWidth = img.getBoundingClientRect().width;
        document.addEventListener("pointermove", onPointerMove);
        document.addEventListener("pointerup", onPointerUp);
      });

      return {
        dom: container,
        update(updatedNode: ProseMirrorNode) {
          if (updatedNode.type.name !== "image") return false;
          currentNode = updatedNode;
          img.src = updatedNode.attrs.src;
          img.style.width = updatedNode.attrs.width ? `${updatedNode.attrs.width}px` : "";
          return true;
        },
      };
    };
  },
});

export default ResizableImage;
