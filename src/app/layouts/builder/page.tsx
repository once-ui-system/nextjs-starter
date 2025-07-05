"use client";
import React, { useState } from "react";

// Simple block types for demo
const BLOCKS = [
  { type: "header", label: "Header" },
  { type: "text", label: "Text" },
  { type: "image", label: "Image" },
];

export default function LayoutBuilder() {
  const [layout, setLayout] = useState<any[]>([]);
  const [name, setName] = useState("");

  const addBlock = (type: string) => {
    setLayout([...layout, { type, content: "" }]);
  };

  const updateBlock = (idx: number, content: string) => {
    setLayout(layout.map((b, i) => (i === idx ? { ...b, content } : b)));
  };

  const saveLayout = async () => {
    await fetch("/api/layouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, layout }),
    });
    alert("Layout saved!");
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Dynamic Layout Builder</h1>
      <input
        placeholder="Layout Name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <div style={{ marginBottom: 16 }}>
        {BLOCKS.map(b => (
          <button key={b.type} onClick={() => addBlock(b.type)} style={{ marginRight: 8 }}>{b.label}</button>
        ))}
      </div>
      <div>
        {layout.map((block, idx) => (
          <div key={idx} style={{ border: "1px solid #ccc", margin: 8, padding: 8 }}>
            <strong>{block.type}</strong>
            <input
              placeholder="Content"
              value={block.content}
              onChange={e => updateBlock(idx, e.target.value)}
              style={{ marginLeft: 8 }}
            />
          </div>
        ))}
      </div>
      <button onClick={saveLayout} style={{ marginTop: 16 }}>Save Layout</button>
    </div>
  );
}
