"use client";

import { useEffect, useRef, useState } from "react";
import { Badge, Button, Column, Heading, Input, NumberInput, Row, SegmentedControl, Text, Textarea, Switch, ThemeSwitcher, useTheme } from "@once-ui-system/core";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJExporter } from "three/addons/exporters/OBJExporter.js";
import { FBXExporter } from "@comfyorg/fbx-exporter-three";
import type { HandlePosition, HandleType, ModelOutputMode, TextAlign, TextShape, TextifySettings } from "@/lib/textify/geometry";
import { createTextifyModel } from "@/lib/textify/geometry";
import { loadHarfBuzz, loadTextifyFont } from "@/lib/textify/harfbuzz";
import type { TextifyFont } from "@/lib/textify/harfbuzz";
import styles from "./textify.module.css";

const defaults: TextifySettings = {
  text: "",
  size: 45,
  height: 10,
  spacing: 2,
  vSpacing: 0,
  alignment: "center",
  vAlignment: "default",
  type: "support",
  textColor: "#e4e8ed",
  baseColor: "#e4e8ed",
  supportHeight: 5,
  supportPadding: { top: 10, bottom: 10, left: 10, right: 10 },
  supportSize: { width: 0, height: 0 },
  supportBorderRadius: 5,
  uprightPosition: { x: 0, y: 0, z: 0 },
  handleSettings: { type: "none", position: "top", size: 10, size2: 2, offsetX: 0, offsetY: 0 },
};

const shapeOptions = [
  { value: "text", label: "Regular text", description: "Standalone extruded lettering" },
  { value: "support", label: "Text on plate", description: "Raised lettering with a backing plate" },
  { value: "negative", label: "Engraved plate", description: "Cut text into a solid plate" },
  { value: "vertical", label: "Upright text", description: "Text standing vertically on a plate" },
];

const familyOptions = [
  { value: "Inter", label: "Inter" },
  { value: "Poppins", label: "Poppins" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Roboto Slab", label: "Roboto Slab" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Lora", label: "Lora" },
];
const verticalAlignmentOptions = [
  { value: "default", label: "Default" },
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
];

type GeneratedModel = ReturnType<typeof createTextifyModel>;
type AdSenseWindow = Window & { adsbygoogle?: Array<Record<string, never>>; textifyAdsenseReady?: boolean };

const adsensePublisherId = "ca-pub-7461216674792341";
const adsenseBannerSlotId = "4222442269";
const adsenseSkyscraperSlotId = "8002080184";
const adsenseEnabled = Boolean(adsensePublisherId && adsenseBannerSlotId && adsenseSkyscraperSlotId);

function AdSenseSlot({ elementId, slotId, width, height, ready, minViewportWidth }: {
  elementId: string;
  slotId: string;
  width: number;
  height: number;
  ready: boolean;
  minViewportWidth: number;
}) {
  const slotRef = useRef<HTMLModElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!ready || initializedRef.current || !slotRef.current) return;

    const initializeAd = () => {
      if (initializedRef.current || window.innerWidth < minViewportWidth) return;
      const adsWindow = window as AdSenseWindow;
      const queue = adsWindow.adsbygoogle ?? (adsWindow.adsbygoogle = []);
      try {
        queue.push({});
      } catch {
        // AdSense can reject a slot when it is blocked or already initialized.
      }
      initializedRef.current = true;
    };

    initializeAd();
    window.addEventListener("resize", initializeAd);
    return () => window.removeEventListener("resize", initializeAd);
  }, [ready, minViewportWidth]);

  return (
    <ins
      ref={slotRef}
      id={elementId}
      className="adsbygoogle"
      style={{ display: "inline-block", width, height }}
      data-ad-client={adsensePublisherId}
      data-ad-slot={slotId}
    />
  );
}

function safeSettings(value: unknown): TextifySettings {
  if (!value || typeof value !== "object") return defaults;
  const input = value as Partial<TextifySettings>;
  return {
    ...defaults,
    ...input,
    supportPadding: { ...defaults.supportPadding, ...input.supportPadding },
    supportSize: { ...defaults.supportSize, ...input.supportSize },
    uprightPosition: { ...defaults.uprightPosition, ...input.uprightPosition },
    handleSettings: { ...defaults.handleSettings, ...input.handleSettings },
  };
}

function ModelPreview({ model, onResetCamera, theme }: { model: GeneratedModel | null; onResetCamera: number; theme: "dark" | "light" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const currentRef = useRef<THREE.Group | null>(null);
  const groundRef = useRef<THREE.Mesh | null>(null);
  const gridRef = useRef<THREE.GridHelper | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#111519");
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 10000);
    camera.position.set(145, 130, 190);
    cameraRef.current = camera;

    scene.add(new THREE.HemisphereLight(0xe8f1f4, 0x31373b, 2.1));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(-90, 140, 120);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x9eb9ca, 1.3);
    fillLight.position.set(110, 40, -100);
    scene.add(fillLight);

    const grid = new THREE.GridHelper(2200, 120, 0x607078, 0x39454b);
    grid.position.y = -0.05;
    scene.add(grid);
    gridRef.current = grid;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.minDistance = 12;
    controls.maxDistance = 1800;
    controlsRef.current = controls;

    const resizeRenderer = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resizeRenderer();
    const resizeObserver = new ResizeObserver(resizeRenderer);
    resizeObserver.observe(canvas.parentElement ?? canvas);

    let frame = 0;
    const render = () => {
      frame = requestAnimationFrame(render);
      controls.update();
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      controls.dispose();
      if (currentRef.current) disposeGroup(currentRef.current);
      renderer.dispose();
      rendererRef.current = null;
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!scene || !camera || !controls) return;
    if (currentRef.current) {
      scene.remove(currentRef.current);
      disposeGroup(currentRef.current);
      currentRef.current = null;
    }
    if (!model) return;

    const group = model.group;
    group.rotation.x = -Math.PI / 2;
    const bounds = new THREE.Box3().setFromObject(group);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    group.position.sub(center);
    scene.add(group);
    currentRef.current = group;

    if (groundRef.current) scene.remove(groundRef.current);
    const baseSize = 2200;
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(baseSize, baseSize),
      new THREE.MeshStandardMaterial({ color: "#161c20", roughness: 0.9, metalness: 0 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -size.y / 2 - 0.2;
    groundRef.current = ground;
    scene.add(ground);
    if (gridRef.current) gridRef.current.position.y = ground.position.y + 0.02;

    const largest = Math.max(size.x, size.y, size.z, 20);
    const verticalFov = THREE.MathUtils.degToRad(camera.fov);
    const fitHeight = size.y / (2 * Math.tan(verticalFov / 2));
    const fitWidth = size.x / (2 * Math.tan(verticalFov / 2) * camera.aspect);
    const distance = Math.max(largest * 1.1, fitHeight, fitWidth) * 1.45;
    camera.position.copy(new THREE.Vector3(0.55, 0.5, 0.8).normalize().multiplyScalar(distance));
    camera.near = Math.max(0.1, largest / 1000);
    camera.far = largest * 100;
    camera.updateProjectionMatrix();
    controls.target.set(0, 0, 0);
    controls.minDistance = largest * 0.25;
    controls.maxDistance = largest * 12;
    controls.update();
  }, [model, onResetCamera]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    scene.background = new THREE.Color(theme === "dark" ? "#111519" : "#e7eef2");

    if (gridRef.current) {
      const gridColors = theme === "dark" ? [0x607078, 0x39454b] : [0x78909b, 0xbdcbd3];
      const materials = Array.isArray(gridRef.current.material) ? gridRef.current.material : [gridRef.current.material];
      materials.forEach((material, index) => material.color?.setHex(gridColors[index] ?? gridColors[0]));
    }

    const ground = groundRef.current;
    if (ground?.material instanceof THREE.MeshStandardMaterial) {
      ground.material.color.set(theme === "dark" ? "#161c20" : "#dce6eb");
    }
  }, [model, theme]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-label="Interactive 3D preview" />;
}

function disposeGroup(group: THREE.Group) {
  group.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.geometry.dispose();
    const material = object.material;
    if (Array.isArray(material)) material.forEach((item) => item.dispose());
    else material.dispose();
  });
}

function LabeledNumber({ id, label, value, min = 0, max = 500, step = 1, onChange, unit = "mm" }: {
  id: string; label: string; value: number; min?: number; max?: number; step?: number; onChange: (value: number) => void; unit?: string;
}) {
  return (
    <label className={styles.field} htmlFor={id}>
      <span className={styles.fieldLabel}>{label}<span>{unit}</span></span>
      <NumberInput id={id} value={value} min={min} max={max} step={step} onChange={onChange} size="s" />
    </label>
  );
}

function ColorField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className={styles.colorField} htmlFor={id}>
      <span className={styles.fieldLabel}>{label}<span>{value.toUpperCase()}</span></span>
      <input id={id} type="color" value={value} onChange={(event) => onChange(event.currentTarget.value)} />
    </label>
  );
}

function NativeSelect({ id, value, options, onChange }: { id: string; value: string; options: Array<{ value: string; label: string }>; onChange: (value: string) => void }) {
  return (
    <select id={id} className={styles.nativeSelect} value={value} onChange={(event) => onChange(event.currentTarget.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
}

function PillDropdown({ value, options, onChange }: { value: string; options: Array<{ value: string; label: string }>; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const selected = options.find((option) => option.value === value) ?? options[0];

  return (
    <div className={styles.pillSelect} ref={ref}>
      <button type="button" className={styles.pillSelectButton} onClick={() => setOpen((current) => !current)}>
        <span>{selected.label}</span>
        <span className={styles.pillChevron}>▾</span>
      </button>
      {open && (
        <div className={styles.pillSelectMenu} role="menu">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${styles.pillSelectItem} ${option.value === value ? styles.pillSelectItemActive : ""}`}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

async function loadGoogleFont(fontName: string, bold: boolean, italic: boolean): Promise<{ buffer: ArrayBuffer; syntheticItalic: boolean }> {
  const query = new URLSearchParams({ family: fontName, weight: bold ? "700" : "400", italic: String(italic) });
  const response = await fetch(`/api/textify/font?${query}`);
  if (!response.ok) {
    const result = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(result?.error ?? "The selected Google font could not be loaded.");
  }
  return {
    buffer: await response.arrayBuffer(),
    syntheticItalic: response.headers.get("X-Textify-Synthetic-Italic") === "true",
  };
}

export default function TextifyApp() {
  const { resolvedTheme } = useTheme();
  const [settings, setSettings] = useState<TextifySettings>(defaults);
  const [family, setFamily] = useState("Inter");
  const [font, setFont] = useState<TextifyFont | null>(null);
  const [syntheticItalic, setSyntheticItalic] = useState(false);
  const [emojiFont, setEmojiFont] = useState<TextifyFont | null>(null);
  const [customFont, setCustomFont] = useState<{ font: TextifyFont; name: string } | null>(null);
  const [model, setModel] = useState<GeneratedModel | null>(null);
  const [error, setError] = useState("");
  const [fontLoading, setFontLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [resetCamera, setResetCamera] = useState(0);
  const [advancedPadding, setAdvancedPadding] = useState(false);
  const [exportFormat, setExportFormat] = useState<"fbx" | "obj">("fbx");
  const [outputMode, setOutputMode] = useState<ModelOutputMode>("solid");
  const [measurementUnit, setMeasurementUnit] = useState<"mm" | "studs">("mm");
  const [textStyles, setTextStyles] = useState({ bold: false, italic: false, underline: false });
  const [adsenseReady, setAdsenseReady] = useState(false);

  const hasText = settings.text.trim().length > 0;
  const plateWidth = settings.supportSize.width || model?.dimensions.x || Math.max(settings.size, settings.text.length * settings.size * 0.62) + settings.supportPadding.left + settings.supportPadding.right;
  const plateHeight = settings.supportSize.height || model?.dimensions.y || settings.size + settings.supportPadding.top + settings.supportPadding.bottom;
  const formatDimension = (value: number) => {
    const numeric = measurementUnit === "studs" ? value / 100 : value;
    return `${numeric.toFixed(1)}${measurementUnit === "studs" ? " studs" : " mm"}`;
  };

  useEffect(() => {
    if (!adsenseEnabled) return;

    const adsWindow = window as AdSenseWindow;
    if (adsWindow.textifyAdsenseReady) {
      setAdsenseReady(true);
      return;
    }

    let script = document.getElementById("textify-adsense-script") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "textify-adsense-script";
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`;
      script.crossOrigin = "anonymous";
    }

    const adsenseScript = script;
    const handleLoad = () => {
      adsWindow.textifyAdsenseReady = true;
      setAdsenseReady(true);
    };
    adsenseScript.addEventListener("load", handleLoad, { once: true });
    if (adsWindow.textifyAdsenseReady || adsWindow.adsbygoogle) handleLoad();
    else if (!adsenseScript.isConnected) document.head.appendChild(adsenseScript);

    return () => adsenseScript.removeEventListener("load", handleLoad);
  }, []);

  useEffect(() => {
    try {
      const query = new URLSearchParams(window.location.search).get("modelSettings");
      const saved = query ?? localStorage.getItem("textify-settings");
      if (saved) setSettings(safeSettings(JSON.parse(saved)));
    } catch {
      localStorage.removeItem("textify-settings");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("textify-settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => () => customFont?.font.dispose(), [customFont]);

  useEffect(() => {
    let cancelled = false;
    let loadedFonts: TextifyFont[] = [];
    setFontLoading(true);

    Promise.all([
      loadGoogleFont(family, textStyles.bold, textStyles.italic),
      fetch("/textify/fonts/noto-emoji.ttf").then((response) => {
        if (!response.ok) throw new Error("The emoji fallback font could not be loaded.");
        return response.arrayBuffer();
      }),
      loadHarfBuzz(),
    ]).then(async ([fontResult, emojiBuffer, runtime]) => {
      const [loadedFont, loadedEmoji] = await Promise.all([
        loadTextifyFont(runtime, fontResult.buffer),
        loadTextifyFont(runtime, emojiBuffer),
      ]);
      loadedFonts = [loadedFont, loadedEmoji];
      if (cancelled) {
        loadedFonts.forEach((loadedFont) => loadedFont.dispose());
        return;
      }
      setFont(loadedFont);
      setSyntheticItalic(fontResult.syntheticItalic);
      setEmojiFont(loadedEmoji);
      setError("");
      setFontLoading(false);
    }).catch((reason: unknown) => {
      if (cancelled) return;
      setError(reason instanceof Error ? reason.message : "Unable to load fonts.");
      setFontLoading(false);
    });
    return () => {
      cancelled = true;
      loadedFonts.forEach((loadedFont) => loadedFont.dispose());
    };
  }, [family, textStyles.bold, textStyles.italic]);

  useEffect(() => {
    if (!font || !emojiFont || fontLoading) return;
    try {
      const modelSettings = resolvedTheme === "light"
        ? {
            ...settings,
            textColor: settings.textColor === defaults.textColor ? "#263f4d" : settings.textColor,
            baseColor: settings.baseColor === defaults.baseColor ? "#aebdc5" : settings.baseColor,
          }
        : settings;
      const generated = createTextifyModel(modelSettings, customFont?.font ?? font, emojiFont, outputMode, {
        underline: textStyles.underline,
        syntheticBold: Boolean(customFont && textStyles.bold),
        syntheticItalic: Boolean(textStyles.italic && (customFont || syntheticItalic)),
      });

      setModel(generated);
      setError("");
    } catch (reason) {
      setModel(null);
      setError(reason instanceof Error ? reason.message : "Unable to generate this model.");
    }
  }, [settings, font, emojiFont, customFont, fontLoading, outputMode, resolvedTheme, syntheticItalic, textStyles.bold, textStyles.italic, textStyles.underline]);

  function update<K extends keyof TextifySettings>(key: K, value: TextifySettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  function updatePadding(key: keyof TextifySettings["supportPadding"], value: number) {
    setSettings((current) => ({ ...current, supportPadding: { ...current.supportPadding, [key]: value } }));
  }

  function updateHandle<K extends keyof TextifySettings["handleSettings"]>(key: K, value: TextifySettings["handleSettings"][K]) {
    setSettings((current) => ({ ...current, handleSettings: { ...current.handleSettings, [key]: value } }));
  }

  async function loadCustomFont(file?: File) {
    if (!file) return;
    try {
      const loadedFont = await loadTextifyFont(await loadHarfBuzz(), await file.arrayBuffer());
      setCustomFont({ font: loadedFont, name: file.name });
      setError("");
      setNotice(`${file.name} loaded`);
    } catch {
      setError("That font file could not be read. Choose a valid TTF or OTF font.");
    }
  }

  function resetAll() {
    setSettings(defaults);
    setFamily("Inter");
    setCustomFont(null);
    setAdvancedPadding(false);
    window.history.replaceState(null, "", "/textify");
    localStorage.removeItem("textify-settings");
    setNotice("Settings reset");
  }

  async function shareSettings() {
    const url = new URL(window.location.href);
    url.search = new URLSearchParams({ modelSettings: JSON.stringify(settings) }).toString();
    try {
      await navigator.clipboard.writeText(url.toString());
      setNotice("Share link copied");
    } catch {
      window.history.replaceState(null, "", url.toString());
      setNotice("Share link is ready in the address bar");
    }
  }

  function exportModel() {
    if (!model) return;
    setBusy(true);
    try {
      const baseName = `${(settings.text.trim().split(/\s+/)[0] || "textify").replace(/[^\p{L}\p{N}_-]/gu, "") || "textify"}`;
      if (exportFormat === "obj") {
        const exporter = new OBJExporter();
        const string = exporter.parse(model.group);
        const blob = new Blob([string], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${baseName}.obj`;
        link.click();
        URL.revokeObjectURL(link.href);
        setNotice("OBJ model exported");
        return;
      }

      const result = new FBXExporter().parseSync(model.group, { preset: "threejs", includeAnimations: false });
      const blob = new Blob([result.buffer.slice(result.byteOffset, result.byteOffset + result.byteLength) as ArrayBuffer], { type: "application/octet-stream" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${baseName}.fbx`;
      link.click();
      URL.revokeObjectURL(link.href);
      setNotice("FBX model exported");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Export failed.");
    } finally {
      setBusy(false);
    }
  }

  const needsSupport = settings.type !== "text";
  const handleOptions = [
    { value: "none", label: "None" },
    { value: "hole", label: "Hole" },
    { value: "handle", label: "Open handle" },
  ];
  const positionOptions = [
    { value: "top", label: "Top" },
    { value: "bottom", label: "Bottom" },
    { value: "left", label: "Left" },
    { value: "right", label: "Right" },
  ];

  return (
    <main className={styles.app}>
      <header className={styles.topbar}>
        <Row gap="12" vertical="center" className={styles.brand}>
          <a href="/" className={styles.backLink} aria-label="Back to tools">←</a>
          <div className={styles.brandMark}>
           tx
          </div>
          <Column gap="2">
            <Heading as="h1" variant="heading-strong-s">Textify</Heading>
            <Text variant="label-default-xs" onBackground="neutral-weak">V0.93.07P</Text>
          </Column>
        </Row>
        <Row gap="8" vertical="center" className={styles.topActions}>
          <ThemeSwitcher collapsed direction="row" />
          <Button variant="secondary" size="s" onClick={shareSettings}>Share</Button>
          <Button variant="secondary" size="s" onClick={resetAll}>Reset</Button>
        </Row>
      </header>

      <div className={styles.workspace}>
        <aside className={styles.settingsPanel}>
          <div className={styles.panelHeading}>
            <div>
              <Text variant="label-strong-xs" onBackground="neutral-weak">MODEL SETUP</Text>
              <Heading as="h2" variant="heading-strong-m">Text & design</Heading>
            </div>
            <span className={styles.step}>01</span>
          </div>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Model type</span>
            <NativeSelect
              id="textify-shape"
              value={settings.type}
              options={shapeOptions}
              onChange={(value) => update("type", value as TextShape)}
            />
          </label>

          <label className={styles.field} htmlFor="textify-copy">
            <span className={styles.fieldLabel}>Text <span>{settings.text.length}/120</span></span>
            <Textarea
              id="textify-copy"
              lines={3}
              resize="vertical"
              maxLength={120}
              value={settings.text}
              onChange={(event) => update("text", event.currentTarget.value)}
              placeholder="Type something to extrude"
            />
          </label>

          <ColorField id="text-color" label="Text color" value={settings.textColor} onChange={(value) => update("textColor", value)} />

          <div className={styles.rule} />
          <div className={styles.panelHeading}>
            <div>
              <Text variant="label-strong-xs" onBackground="neutral-weak">TYPEFACE</Text>
              <Heading as="h2" variant="heading-strong-m">Font selection</Heading>
            </div>
            <span className={styles.step}>02</span>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Font family</span>
            <NativeSelect
              id="textify-font"
              value={family}
              options={familyOptions}
              onChange={setFamily}
            />
            <label className={styles.uploadFont}>
              <span>{customFont?.name ?? "Use a custom font"}</span>
              <span className={styles.uploadButton}>Browse</span>
              <input type="file" accept=".ttf,.otf,.woff" onChange={(event) => void loadCustomFont(event.currentTarget.files?.[0])} />
            </label>
          </div>
          <div className={styles.fontStyleControls}>
            <span className={styles.fieldLabel}>Text style</span>
            <div className={styles.inlineToggleRow}>
              <button type="button" aria-label="Bold" aria-pressed={textStyles.bold} className={`${styles.styleToggle} ${textStyles.bold ? styles.styleToggleActive : ""}`} onClick={() => setTextStyles((current) => ({ ...current, bold: !current.bold }))}>B</button>
              <button type="button" aria-label="Italic" aria-pressed={textStyles.italic} className={`${styles.styleToggle} ${textStyles.italic ? styles.styleToggleActive : ""}`} onClick={() => setTextStyles((current) => ({ ...current, italic: !current.italic }))} style={{ fontStyle: "italic" }}>I</button>
              <button type="button" aria-label="Underline" aria-pressed={textStyles.underline} className={`${styles.styleToggle} ${textStyles.underline ? styles.styleToggleActive : ""}`} onClick={() => setTextStyles((current) => ({ ...current, underline: !current.underline }))} style={{ textDecoration: "underline" }}>U</button>
            </div>
          </div>

          <div className={styles.rule} />
          <div className={styles.panelHeading}>
            <div>
              <Text variant="label-strong-xs" onBackground="neutral-weak">DIMENSIONS</Text>
              <Heading as="h2" variant="heading-strong-m">Text geometry</Heading>
            </div>
            <span className={styles.step}>03</span>
          </div>

          <div className={styles.numberGrid}>
            <LabeledNumber id="text-size" label="Text size" value={settings.size} min={1} max={300} onChange={(value) => update("size", value)} />
            <LabeledNumber id="text-depth" label={settings.type === "negative" ? "Engrave depth" : "Text thickness"} value={settings.height} min={0.2} max={200} step={0.5} onChange={(value) => update("height", value)} />
            <LabeledNumber id="text-spacing" label="Letter spacing" value={settings.spacing} min={-50} max={100} step={0.5} onChange={(value) => update("spacing", value)} />
            {settings.text.includes("\n") && settings.type !== "vertical" && <LabeledNumber id="line-spacing" label="Line spacing" value={settings.vSpacing} min={-50} max={100} step={0.5} onChange={(value) => update("vSpacing", value)} />}
          </div>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Vertical alignment</span>
            <NativeSelect
              id="textify-valignment"
              value={settings.vAlignment}
              options={verticalAlignmentOptions}
              onChange={(value) => update("vAlignment", value as TextifySettings["vAlignment"])}
            />
          </label>

          {settings.text.includes("\n") && settings.type !== "vertical" && (
            <div className={styles.alignRow}>
              <span className={styles.fieldLabel}>Line alignment</span>
              <SegmentedControl
                buttons={[{ value: "left", label: "Left" }, { value: "center", label: "Center" }, { value: "right", label: "Right" }]}
                value={settings.alignment}
                onChange={(value) => update("alignment", value as TextAlign)}
              />
            </div>
          )}

          {needsSupport && <>
            <div className={styles.rule} />
            <div className={styles.panelHeading}>
              <div>
                <Text variant="label-strong-xs" onBackground="neutral-weak">{settings.type === "negative" ? "ENGRAVED BASE" : "BACKING PLATE"}</Text>
                <Heading as="h2" variant="heading-strong-m">{settings.type === "negative" ? "Engraved plate" : "Base dimensions"}</Heading>
              </div>
              <span className={styles.step}>04</span>
            </div>
            <div className={styles.numberGrid}>
              <LabeledNumber id="plate-width" label="Plate width" value={plateWidth} min={1} max={1000} onChange={(value) => setSettings((current) => ({ ...current, supportSize: { ...current.supportSize, width: value } }))} />
              <LabeledNumber id="plate-height-size" label="Plate height" value={plateHeight} min={1} max={1000} onChange={(value) => setSettings((current) => ({ ...current, supportSize: { ...current.supportSize, height: value } }))} />
              <LabeledNumber id="support-height" label="Plate thickness" value={settings.supportHeight} min={0.5} max={200} step={0.5} onChange={(value) => update("supportHeight", value)} />
              <LabeledNumber id="support-radius" label={settings.type === "negative" ? "Corner rounding" : "Corner radius"} value={settings.supportBorderRadius} min={0} max={100} step={0.5} onChange={(value) => update("supportBorderRadius", value)} />
            </div>
            <Text variant="body-default-xs" onBackground="neutral-weak">The plate grows as needed to fit the text and padding.</Text>
            <ColorField id="base-color" label="Base color" value={settings.baseColor} onChange={(value) => update("baseColor", value)} />
            {settings.type === "vertical" && <>
              <div className={styles.panelHeading}><Heading as="h3" variant="heading-strong-s">Text position</Heading></div>
              <div className={styles.numberGrid}>
                <LabeledNumber id="upright-position-x" label="X offset" value={settings.uprightPosition.x} min={-500} max={500} step={0.5} onChange={(value) => setSettings((current) => ({ ...current, uprightPosition: { ...current.uprightPosition, x: value } }))} />
                <LabeledNumber id="upright-position-y" label="Y offset" value={settings.uprightPosition.y} min={-500} max={500} step={0.5} onChange={(value) => setSettings((current) => ({ ...current, uprightPosition: { ...current.uprightPosition, y: value } }))} />
                <LabeledNumber id="upright-position-z" label="Z offset" value={settings.uprightPosition.z} min={-500} max={500} step={0.5} onChange={(value) => setSettings((current) => ({ ...current, uprightPosition: { ...current.uprightPosition, z: value } }))} />
              </div>
            </>}
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Plate padding <span>mm</span></span>
              {advancedPadding ? (
                <div className={styles.numberGrid}>
                  <LabeledNumber id="padding-top" label="Top" value={settings.supportPadding.top} onChange={(value) => updatePadding("top", value)} />
                  <LabeledNumber id="padding-bottom" label="Bottom" value={settings.supportPadding.bottom} onChange={(value) => updatePadding("bottom", value)} />
                  <LabeledNumber id="padding-left" label="Left" value={settings.supportPadding.left} onChange={(value) => updatePadding("left", value)} />
                  <LabeledNumber id="padding-right" label="Right" value={settings.supportPadding.right} onChange={(value) => updatePadding("right", value)} />
                </div>
              ) : <LabeledNumber id="padding-all" label="All sides" value={settings.supportPadding.top} onChange={(value) => setSettings((current) => ({ ...current, supportPadding: { top: value, bottom: value, left: value, right: value } }))} />}
            </label>
            <div className={styles.switchRow}>
              <Text variant="body-default-s">Uneven padding</Text>
              <Switch checked={advancedPadding} onToggle={() => setAdvancedPadding((value) => !value)} ariaLabel="Toggle uneven padding" />
            </div>

            <>
              <div className={styles.rule} />
              <div className={styles.panelHeading}>
                <div>
                  <Text variant="label-strong-xs" onBackground="neutral-weak">ATTACHMENT</Text>
                  <Heading as="h2" variant="heading-strong-m">Hole & handle</Heading>
                </div>
              </div>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Attachment style</span>
                <NativeSelect
                  id="handle-type"
                  value={settings.handleSettings.type}
                  options={handleOptions}
                  onChange={(value) => updateHandle("type", value as HandleType)}
                />
              </label>
              {settings.handleSettings.type !== "none" && <>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Edge</span>
                  <NativeSelect
                    id="handle-position"
                    value={settings.handleSettings.position}
                    options={positionOptions}
                    onChange={(value) => updateHandle("position", value as HandlePosition)}
                  />
                </label>
                <div className={styles.numberGrid}>
                  <LabeledNumber id="handle-size" label={settings.handleSettings.type === "hole" ? "Hole diameter" : "Handle width"} value={settings.handleSettings.size} min={1} max={150} onChange={(value) => updateHandle("size", value)} />
                  {settings.handleSettings.type === "handle" ? <LabeledNumber id="handle-wall" label="Wall thickness" value={settings.handleSettings.size2} min={0.5} max={30} step={0.5} onChange={(value) => updateHandle("size2", value)} /> : <LabeledNumber id="handle-offset-y" label="Offset Y" value={settings.handleSettings.offsetY} min={-100} max={100} onChange={(value) => updateHandle("offsetY", value)} />}
                  <LabeledNumber id="handle-offset-x" label="Offset X" value={settings.handleSettings.offsetX} min={-100} max={100} onChange={(value) => updateHandle("offsetX", value)} />
                </div>
              </>}
            </>
          </>}
          {adsenseEnabled && <div className={styles.skyscraperAd} aria-label="Advertisement">
            <AdSenseSlot elementId="textify-adsense-skyscraper" slotId={adsenseSkyscraperSlotId} width={120} height={600} ready={adsenseReady} minViewportWidth={1200} />
          </div>}
        </aside>

        <section className={styles.stage} aria-label="Model preview">
          <div className={styles.stageToolbar}>
            <Row gap="8" vertical="center">
              <span className={`${styles.statusDot} ${model ? styles.statusReady : ""}`} />
              <Text variant="label-default-s" onBackground="neutral-weak">{fontLoading ? "Loading typefaces" : model ? "Preview ready" : "Waiting for valid text"}</Text>
            </Row>
            <Row gap="8" vertical="center">
              <Text variant="label-default-xs" onBackground="neutral-weak">Drag to orbit · Scroll to zoom</Text>
              <Button variant="tertiary" size="xs" onClick={() => setResetCamera((value) => value + 1)}>Reset view</Button>
            </Row>
          </div>
          {adsenseEnabled && <div className={styles.bannerAd} aria-label="Advertisement">
            <AdSenseSlot elementId="textify-adsense-banner-top" slotId={adsenseBannerSlotId} width={728} height={90} ready={adsenseReady} minViewportWidth={1200} />
          </div>}
          <div className={styles.viewport}>
            {hasText && <ModelPreview model={model} onResetCamera={resetCamera} theme={resolvedTheme} />}
            {!hasText && <div className={styles.emptyState}>
              <span className={styles.emptyMark}>T</span>
              <Heading as="h2" variant="heading-strong-m">Your model will appear here</Heading>
              <Text variant="body-default-s" onBackground="neutral-weak">Enter text to generate a 3D preview.</Text>
            </div>}
            {hasText && <div className={styles.axisTag}><span>X</span><span>Y</span><span>Z</span></div>}
          </div>
          <footer className={styles.stageFooter}>
            <div className={styles.measurementsWrap}>
              <Text variant="label-strong-xs" onBackground="neutral-weak">MODEL SIZE</Text>
              <Row gap="12" vertical="center" className={styles.dimensions}>
                <span><b>X</b> {formatDimension(model?.dimensions.x ?? 0)}</span>
                <span><b>Y</b> {formatDimension(model?.dimensions.y ?? 0)}</span>
                <span><b>Z</b> {formatDimension(model?.dimensions.z ?? 0)}</span>
              </Row>
            </div>
            <div className={styles.measurementSelectWrap}>
              <PillDropdown value={measurementUnit} options={[{ value: "mm", label: "mm" }, { value: "studs", label: "studs" }]} onChange={(value) => setMeasurementUnit(value as "mm" | "studs")} />
            </div>
            <div className={styles.exportPillWrap}>
              <div className={styles.pillLabel}>Mesh structure:</div>
              <PillDropdown value={outputMode} options={[{ value: "solid", label: "Solid" }, { value: "separate", label: "Separate" }]} onChange={(value) => setOutputMode(value as ModelOutputMode)} />
            </div>
            {outputMode === "separate" && settings.type === "negative" && <span className={styles.outputNote}>Engraved text stays one plate</span>}
            <div className={styles.exportControls}>
              <div className={styles.exportPillWrap}>
                <div className={styles.pillLabel}>Model Export Type:</div>
                <PillDropdown value={exportFormat} options={[{ value: "fbx", label: "FBX" }, { value: "obj", label: "OBJ" }]} onChange={(value) => setExportFormat(value as "fbx" | "obj")} />
              </div>
              <Button size="s" prefixIcon="download" onClick={exportModel} disabled={!model || busy} loading={busy}>Export Model</Button>
            </div>
          </footer>
          {adsenseEnabled && <div className={`${styles.bannerAd} ${styles.bannerAdBottom}`} aria-label="Advertisement">
            <AdSenseSlot elementId="textify-adsense-banner-bottom" slotId={adsenseBannerSlotId} width={728} height={90} ready={adsenseReady} minViewportWidth={1200} />
          </div>}
        </section>
      </div>
      {(error || notice) && <div className={`${styles.toast} ${error ? styles.toastError : ""}`} role={error ? "alert" : "status"}>
        <span>{error || notice}</span>
        <button type="button" onClick={() => { setError(""); setNotice(""); }} aria-label="Dismiss message">×</button>
      </div>}
      <input className={styles.visuallyHidden} aria-hidden="true" tabIndex={-1} />
    </main>
  );
}