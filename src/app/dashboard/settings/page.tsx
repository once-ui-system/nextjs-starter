"use client";
import React, { useEffect, useState } from "react";

const SETTINGS_KEY = "builder_settings";

const DEFAULT_SETTINGS = {
  defaultLayoutId: "",
  enabledBlocks: ["header", "text", "image"],
};

export default function SettingsDashboard() {
  const [layouts, setLayouts] = useState<any[]>([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLayouts();
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const fetchLayouts = async () => {
    setLoading(true);
    const res = await fetch("/api/layouts");
    const data = await res.json();
    setLayouts(data);
    setLoading(false);
  };

  const setDefaultLayout = (id: string) => {
    const newSettings = { ...settings, defaultLayoutId: id };
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  };

  const toggleBlock = (type: string) => {
    let enabled = settings.enabledBlocks;
    if (enabled.includes(type)) {
      enabled = enabled.filter((b) => b !== type);
    } else {
      enabled = [...enabled, type];
    }
    const newSettings = { ...settings, enabledBlocks: enabled };
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Settings Dashboard</h1>
      <h2>Default Layout</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {layouts.map((l) => (
            <li key={l.id}>
              <b>{l.name}</b>
              <button
                style={{ marginLeft: 8, fontWeight: l.id === settings.defaultLayoutId ? "bold" : "normal" }}
                onClick={() => setDefaultLayout(l.id)}
              >
                {l.id === settings.defaultLayoutId ? "Selected" : "Set as Default"}
              </button>
            </li>
          ))}
        </ul>
      )}
      <h2>Enable/Disable Block Types</h2>
      <div>
        {["header", "text", "image"].map((type) => (
          <label key={type} style={{ marginRight: 16 }}>
            <input
              type="checkbox"
              checked={settings.enabledBlocks.includes(type)}
              onChange={() => toggleBlock(type)}
            />
            {type}
          </label>
        ))}
      </div>
    </div>
  );
}
