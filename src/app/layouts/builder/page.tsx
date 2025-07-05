"use client";
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

// Simple block types for demo
const BLOCKS = [
  { type: "header", label: "Header" },
  { type: "text", label: "Text" },
  { type: "image", label: "Image" },
];

type Layout = {
  id?: string;
  name: string;
  layout: any[];
};

export default function LayoutBuilder() {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [layout, setLayout] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load all layouts
  const fetchLayouts = async () => {
    setLoading(true);
    const res = await fetch("/api/layouts");
    const data = await res.json();
    setLayouts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLayouts();
  }, []);

  const addBlock = (type: string) => {
    setLayout([...layout, { type, content: "" }]);
  };

  const updateBlock = (idx: number, content: string) => {
    setLayout(layout.map((b, i) => (i === idx ? { ...b, content } : b)));
  };

  const saveLayout = async () => {
    if (editId) {
      await fetch("/api/layouts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, name, layout }),
      });
    } else {
      await fetch("/api/layouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, layout }),
      });
    }
    setName("");
    setLayout([]);
    setEditId(null);
    fetchLayouts();
  };

  const editLayout = (l: Layout) => {
    setName(l.name);
    setLayout(l.layout);
    setEditId(l.id!);
  };

  const deleteLayout = async (id: string) => {
    await fetch("/api/layouts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (editId === id) {
      setName("");
      setLayout([]);
      setEditId(null);
    }
    fetchLayouts();
  };

  const cancelEdit = () => {
    setName("");
    setLayout([]);
    setEditId(null);
  };

  // Drag handler
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(layout);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setLayout(items);
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Dynamic Layout Builder</h1>
      <div style={{ marginBottom: 32 }}>
        <h2>Saved Layouts</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul>
            {layouts.map((l) => (
              <li key={l.id} style={{ marginBottom: 8 }}>
                <b>{l.name}</b>
                <button
                  onClick={() => editLayout(l)}
                  style={{ marginLeft: 8 }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteLayout(l.id!)}
                  style={{ marginLeft: 8, color: "red" }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <input
        placeholder="Layout Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <div style={{ marginBottom: 16 }}>
        {BLOCKS.map((b) => (
          <button
            key={b.type}
            onClick={() => addBlock(b.type)}
            style={{ marginRight: 8 }}
          >
            {b.label}
          </button>
        ))}
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="layoutBlocks">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {layout.map((block, idx) => (
                <Draggable key={idx} draggableId={String(idx)} index={idx}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        border: "1px solid #ccc",
                        margin: 8,
                        padding: 8,
                        background: "#fafafa",
                        ...provided.draggableProps.style,
                      }}
                    >
                      <strong>{block.type}</strong>
                      <input
                        placeholder="Content"
                        value={block.content}
                        onChange={(e) => updateBlock(idx, e.target.value)}
                        style={{ marginLeft: 8 }}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button onClick={saveLayout} style={{ marginTop: 16 }}>
        {editId ? "Update Layout" : "Save Layout"}
      </button>
      {editId && (
        <button onClick={cancelEdit} style={{ marginLeft: 8 }}>
          Cancel
        </button>
      )}
    </div>
  );
}
