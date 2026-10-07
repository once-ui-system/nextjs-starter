"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Column, Heading, NumberInput, ParticleFx, Row, SegmentedControl, Text, ThemeSwitcher, useTheme } from "@once-ui-system/core";
import { HiPhotograph } from "react-icons/hi";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FBXExporter } from "@comfyorg/fbx-exporter-three";
import { createImageifyModel } from "@/lib/imageify/geometry";
import type { ImageBackgroundMode, ImageifyMode, ImageifyPartReduction, ImageifySettings, ImageifySnapMode } from "@/lib/imageify/geometry";
import styles from "./imageify.module.css";

const robloxTriangleLimit = 20_000;

const defaults: ImageifySettings = {
  mode: "extrude",
  backgroundMode: "none",
  backgroundColor: "#ffffff",
  backgroundTolerance: 36,
  width: 120,
  baseThickness: 3,
  reliefHeight: 14,
  detail: 1024,
  invert: false,
  mergeSimilarColors: 40,
  holePartReduction: "auto",
  snapVertices: "average",
  snapDistance: 3.1,
  outlineSmoothing: 0,
  outlineSimplification: 0,
};

type GeneratedModel = ReturnType<typeof createImageifyModel>;
type ImageDetails = { name: string; width: number; height: number };
type PageView = "landing" | "generating" | "editor";

function disposeGroup(group: THREE.Group) {
  group.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.geometry.dispose();
    const material = object.material;
    const materials = Array.isArray(material) ? material : [material];
    materials.forEach((item) => {
      if ("map" in item && item.map instanceof THREE.Texture) item.map.dispose();
      item.dispose();
    });
  });
}

function linearToSrgb(channel: number) {
  return channel <= 0.0031308 ? channel * 12.92 : 1.055 * channel ** (1 / 2.4) - 0.055;
}

function exportObjWithColors(group: THREE.Group) {
  const lines: string[] = [];
  let vertexOffset = 0;
  group.updateMatrixWorld(true);

  group.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    const geometry = object.geometry;
    const positions = geometry.getAttribute("position");
    const colors = geometry.getAttribute("color");
    const indices = geometry.getIndex();
    const point = new THREE.Vector3();
    const color = new THREE.Color();
    lines.push(`o ${object.name || "ImageifyPart"}`);

    for (let index = 0; index < positions.count; index++) {
      point.fromBufferAttribute(positions, index).applyMatrix4(object.matrixWorld);
      if (colors) color.fromBufferAttribute(colors, index);
      else color.copy(Array.isArray(object.material) ? object.material[0].color : object.material.color);
      lines.push(`v ${point.x} ${point.y} ${point.z} ${linearToSrgb(color.r)} ${linearToSrgb(color.g)} ${linearToSrgb(color.b)}`);
    }

    const faceCount = indices ? indices.count : positions.count;
    for (let index = 0; index < faceCount; index += 3) {
      const first = vertexOffset + (indices ? indices.getX(index) : index) + 1;
      const second = vertexOffset + (indices ? indices.getX(index + 1) : index + 1) + 1;
      const third = vertexOffset + (indices ? indices.getX(index + 2) : index + 2) + 1;
      lines.push(`f ${first} ${second} ${third}`);
    }
    vertexOffset += positions.count;
  });

  return `${lines.join("\n")}\n`;
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
    scene.background = new THREE.Color("#111713");
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 10000);
    camera.position.set(145, 130, 190);
    cameraRef.current = camera;
    scene.add(new THREE.HemisphereLight(0xe8f1e8, 0x303b32, 2.1));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(-90, 140, 120);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xa8d3b1, 1.3);
    fillLight.position.set(110, 40, -100);
    scene.add(fillLight);

    const grid = new THREE.GridHelper(2200, 120, 0x617366, 0x39483d);
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
      if (groundRef.current) {
        groundRef.current.geometry.dispose();
        (groundRef.current.material as THREE.Material).dispose();
      }
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
    if (groundRef.current) {
      scene.remove(groundRef.current);
      groundRef.current.geometry.dispose();
      (groundRef.current.material as THREE.Material).dispose();
      groundRef.current = null;
    }
    if (!model) return;

    const group = model.group;
    const bounds = new THREE.Box3().setFromObject(group);
    const size = bounds.getSize(new THREE.Vector3());
    group.position.sub(bounds.getCenter(new THREE.Vector3()));
    scene.add(group);
    currentRef.current = group;

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(2200, 2200),
      new THREE.MeshStandardMaterial({ color: theme === "dark" ? "#161c17" : "#dce8dd", roughness: 0.9 }),
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
  }, [model, onResetCamera, theme]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    scene.background = new THREE.Color(theme === "dark" ? "#111713" : "#e8f0e9");
    if (gridRef.current) {
      const gridColors = theme === "dark" ? [0x617366, 0x39483d] : [0x829889, 0xc4d2c6];
      const materials = Array.isArray(gridRef.current.material) ? gridRef.current.material : [gridRef.current.material];
      materials.forEach((material, index) => material.color?.setHex(gridColors[index] ?? gridColors[0]));
    }
    if (groundRef.current?.material instanceof THREE.MeshStandardMaterial) {
      groundRef.current.material.color.set(theme === "dark" ? "#161c17" : "#dce8dd");
    }
  }, [theme]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-label="Interactive 3D image relief preview" />;
}

function LabeledNumber({ id, label, value, min, max, step = 1, onChange }: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className={styles.field} htmlFor={id}>
      <span className={styles.fieldLabel}>{label}<span>mm</span></span>
      <NumberInput id={id} value={value} min={min} max={max} step={step} onChange={onChange} size="s" />
    </label>
  );
}

export default function ImageifyApp() {
  const { resolvedTheme } = useTheme();
  const [view, setView] = useState<PageView>("landing");
  const [settings, setSettings] = useState(defaults);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [imageDetails, setImageDetails] = useState<ImageDetails | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [model, setModel] = useState<GeneratedModel | null>(null);
  const [exportFormat, setExportFormat] = useState<"fbx" | "obj">("fbx");
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("Preparing image");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [resetCamera, setResetCamera] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generationIdRef = useRef(0);

  useEffect(() => {
    if (!imageData) {
      setModel(null);
      return;
    }
    const timeout = window.setTimeout(() => {
      try {
        setModel(createImageifyModel(imageData, settings));
        setError("");
        setView((current) => current === "generating" ? "editor" : current);
      } catch (reason) {
        setModel(null);
        setError(reason instanceof Error ? reason.message : "Unable to generate this model.");
        setView("landing");
      }
    }, 24);
    return () => window.clearTimeout(timeout);
  }, [imageData, settings]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const clipboardItems = Array.from(event.clipboardData?.items ?? []);
      const pastedImage = clipboardItems.find((item) => item.kind === "file" && item.type.startsWith("image/"))?.getAsFile();
      if (pastedImage) {
        event.preventDefault();
        const extension = pastedImage.type.split("/")[1]?.replace("svg+xml", "svg") || "png";
        setPendingFile(new File([pastedImage], `clipboard-image.${extension}`, { type: pastedImage.type || "image/png" }));
        setImageUrl("");
        setError("");
        setView("landing");
        return;
      }

      const text = event.clipboardData?.getData("text/plain").trim();
      if (text && /^https?:\/\/\S+$/i.test(text)) {
        event.preventDefault();
        setPendingFile(null);
        setImageUrl(text);
        setError("");
        setView("landing");
      }
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, []);

  function selectFile(file?: File) {
    if (!file) return;
    setPendingFile(file);
    setImageUrl("");
    setError("");
  }

  async function loadImage(file: File | null, url: string) {
    if (!file && !url) return;
    if (file && file.size > 25 * 1024 * 1024) {
      setError("Images must be 25 MB or smaller.");
      return;
    }

    const generationId = ++generationIdRef.current;
    const fileName = file?.name ?? (() => {
      try {
        const parsedUrl = new URL(url);
        return decodeURIComponent(parsedUrl.pathname.split("/").pop() || parsedUrl.hostname);
      } catch {
        return "remote-image";
      }
    })();
    setLoading(true);
    setLoadingLabel(`Loading ${fileName}`);
    setView("generating");
    setError("");
    setImageData(null);
    setModel(null);
    setImageDetails(null);
    try {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const form = new FormData();
      if (file) form.append("image", file);
      else form.append("url", url);
      const response = await fetch("/api/imageify/normalize", { method: "POST", body: form });
      if (generationId !== generationIdRef.current) return;
      if (!response.ok) {
        const result = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(result?.error ?? "This image could not be opened.");
      }
      const bitmap = await createImageBitmap(await response.blob());
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("Your browser could not prepare this image.");
      context.drawImage(bitmap, 0, 0);
      const pixels = context.getImageData(0, 0, bitmap.width, bitmap.height);
      bitmap.close();
      if (generationId !== generationIdRef.current) return;
      setLoadingLabel("Building colored relief");
      setImageData(pixels);
      setImageDetails({ name: fileName, width: pixels.width, height: pixels.height });
      setPendingFile(null);
      setImageUrl("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (reason) {
      if (generationId === generationIdRef.current) {
        setError(reason instanceof Error ? reason.message : "This image could not be opened.");
        setView("landing");
      }
    } finally {
      if (generationId === generationIdRef.current) setLoading(false);
    }
  }

  function generateSelectedImage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadImage(pendingFile, imageUrl.trim());
  }

  function returnToLanding() {
    generationIdRef.current++;
    setView("landing");
    setLoading(false);
    setImageData(null);
    setImageDetails(null);
    setModel(null);
    setPendingFile(null);
    setImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function resetAll() {
    setSettings(defaults);
    setError("");
    setNotice("Settings reset");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setResetCamera((value) => value + 1);
  }

  async function exportModel() {
    if (!model) return;
    setBusy(true);
    try {
      let blob: Blob;
      if (exportFormat === "obj") {
        blob = new Blob([exportObjWithColors(model.group)], { type: "text/plain" });
      } else {
        const result = new FBXExporter().parseSync(model.group, { preset: "threejs", includeAnimations: false });
        const buffer = result.buffer.slice(result.byteOffset, result.byteOffset + result.byteLength) as ArrayBuffer;
        blob = new Blob([buffer], { type: "application/octet-stream" });
      }
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      const baseName = (imageDetails?.name.replace(/\.[^.]+$/, "") || "imageify").replace(/[^\p{L}\p{N}_-]/gu, "_");
      link.download = `${baseName || "imageify"}.${exportFormat}`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      setNotice(`Colored ${exportFormat.toUpperCase()} model exported`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Export failed.");
    } finally {
      setBusy(false);
    }
  }

  function update<K extends keyof ImageifySettings>(key: K, value: ImageifySettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  const formatDimension = (value: number) => `${value.toFixed(1)} mm`;
  const status = loading ? "Preparing image" : model ? "Preview ready" : imageDetails ? "Building relief" : "Waiting for an image";

  if (view === "landing") {
    return (
      <main className={styles.landing}>
        <div className={styles.landingParticles} aria-hidden="true">
          <ParticleFx className={styles.particleField} fill interactive color="particle-color" opacity={60} density={240} speed={0.8} intensity={14} />
        </div>
        <div className={styles.landingMain}>
          <div className={styles.landingIntro}>
            <span className={styles.simpleMark}><HiPhotograph aria-hidden="true" /></span>
            <h1>Imageify</h1>
            <p>Turn an image into a colored 3D model.</p>
          </div>

          <form className={styles.landingForm} onSubmit={generateSelectedImage}>
            <label
              className={styles.landingDropzone}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files[0]); }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.avif,.bmp,.gif,.heic,.heif,.svg,.tif,.tiff"
                onChange={(event) => { selectFile(event.currentTarget.files?.[0]); event.currentTarget.value = ""; }}
              />
              <span className={styles.dropIcon}><HiPhotograph aria-hidden="true" /></span>
              <strong>{pendingFile?.name ?? "Drop an image here"}</strong>
              <span className={styles.dropDescription}>{pendingFile ? `${(pendingFile.size / 1024 / 1024).toFixed(2)} MB · ready to build` : "or choose a file from your device"}</span>
              <span className={styles.browseAction}>Browse files</span>
            </label>
            <div className={styles.sourceDivider}><span>OR</span></div>
            <label className={styles.urlField} htmlFor="imageify-source-url">
              <span>Image URL</span>
              <input
                id="imageify-source-url"
                type="url"
                value={imageUrl}
                onChange={(event) => { setImageUrl(event.currentTarget.value); setPendingFile(null); setError(""); }}
                placeholder="https://example.com/image.png"
                autoComplete="url"
                spellCheck={false}
              />
            </label>
            <button className={styles.generateButton} type="submit" disabled={loading || (!pendingFile && !imageUrl.trim())}>
              <span>Build 3D model</span><b aria-hidden="true">↗</b>
            </button>
            <div className={styles.pasteHint}>Paste an image or image URL with <kbd>Ctrl</kbd> + <kbd>V</kbd></div>
            {(error || notice) && <div className={styles.landingNotice} role={error ? "alert" : "status"}>{error || notice}</div>}
          </form>
        </div>
      </main>
    );
  }

  if (view === "generating") {
    return (
      <main className={styles.loadingScreen} aria-busy="true" aria-live="polite">
        <div className={styles.loadingContent}>
          <span className={styles.loadingMark} aria-hidden="true" />
          <h1>Building your model</h1>
          <p>{loadingLabel}</p>
          <div className={styles.loadingTrack}><span /></div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.app}>
      <header className={styles.topbar}>
        <Row gap="12" vertical="center" className={styles.brand}>
          <a href="/" className={styles.backLink} aria-label="Back to tools">←</a>
          <div className={styles.brandMark}>im</div>
          <Column gap="2">
            <Heading as="h1" variant="heading-strong-s">Imageify</Heading>
            <Text variant="label-default-xs" onBackground="neutral-weak">V90.A4.00P</Text>
          </Column>
        </Row>
        <Row gap="8" vertical="center" className={styles.topActions}>
          <ThemeSwitcher collapsed direction="row" />
          <Button variant="secondary" size="s" onClick={returnToLanding}>New image</Button>
          <Button variant="secondary" size="s" onClick={resetAll}>Reset</Button>
        </Row>
      </header>

      <div className={styles.workspace}>
        <aside className={styles.settingsPanel}>
          <div className={styles.panelHeading}>
            <div><Text variant="label-strong-xs" onBackground="neutral-weak">IMAGE SOURCE</Text><Heading as="h2" variant="heading-strong-m">Current image</Heading></div>
            <span className={styles.step}>01</span>
          </div>
          <div className={styles.sourceSummary}>
            <span className={styles.sourceSummaryIcon}><HiPhotograph aria-hidden="true" /></span>
            <span className={styles.sourceSummaryName}>{imageDetails?.name}</span>
            <span className={styles.sourceSummarySize}>{imageDetails?.width} × {imageDetails?.height} px</span>
            <Button variant="tertiary" size="xs" onClick={returnToLanding}>Change image</Button>
          </div>

          <div className={styles.rule} />
          <div className={styles.panelHeading}>
            <div><Text variant="label-strong-xs" onBackground="neutral-weak">MODEL MODE</Text><Heading as="h2" variant="heading-strong-m">Surface type</Heading></div>
            <span className={styles.step}>02</span>
          </div>
          <SegmentedControl
            buttons={[{ value: "heightmap", label: "Heightmap" }, { value: "extrude", label: "Color Extrude" }]}
            value={settings.mode}
            onChange={(value) => update("mode", value as ImageifyMode)}
          />
          <Text className={styles.modelModeNote} variant="body-default-xs" onBackground="neutral-weak">
            {settings.mode === "extrude"
              ? `Simplified color regions extruded at one depth. Grid: ${model?.gridSize.columns ?? 0} × ${model?.gridSize.rows ?? 0}.`
              : `Smooth height field shaped by brightness. Current grid: ${model?.gridSize.columns ?? 0} × ${model?.gridSize.rows ?? 0}.`}
          </Text>

          <div className={styles.rule} />
          <div className={styles.panelHeading}>
            <div><Text variant="label-strong-xs" onBackground="neutral-weak">BACKGROUND</Text><Heading as="h2" variant="heading-strong-m">Remove background</Heading></div>
            <span className={styles.step}>03</span>
          </div>
          <SegmentedControl
            buttons={[{ value: "none", label: "None" }, { value: "auto", label: "Auto" }, { value: "color", label: "Color" }]}
            value={settings.backgroundMode}
            onChange={(value) => update("backgroundMode", value as ImageBackgroundMode)}
          />
          {settings.backgroundMode === "auto" && <Text variant="body-default-xs" onBackground="neutral-weak">Removes the most common border color and connected areas.</Text>}
          {settings.backgroundMode === "color" && <label className={styles.backgroundColorField} htmlFor="image-background-color">
            <span className={styles.fieldLabel}>Color to remove <span>{settings.backgroundColor.toUpperCase()}</span></span>
            <input id="image-background-color" type="color" value={settings.backgroundColor} onChange={(event) => update("backgroundColor", event.currentTarget.value)} />
          </label>}
          {settings.backgroundMode !== "none" && <div className={styles.detailControl}>
            <label className={styles.fieldLabel} htmlFor="image-background-tolerance">Color tolerance <span>{settings.backgroundTolerance}</span></label>
            <input id="image-background-tolerance" type="range" min="0" max="128" step="1" value={settings.backgroundTolerance} onChange={(event) => update("backgroundTolerance", Number(event.currentTarget.value))} />
          </div>}

          <div className={styles.rule} />
          <div className={styles.panelHeading}>
            <div><Text variant="label-strong-xs" onBackground="neutral-weak">DIMENSIONS</Text><Heading as="h2" variant="heading-strong-m">Model size</Heading></div>
            <span className={styles.step}>04</span>
          </div>
          <div className={styles.numberGrid}>
            <LabeledNumber id="image-width" label="Model width" value={settings.width} min={10} max={500} onChange={(value) => update("width", value)} />
            <LabeledNumber id="image-base" label={settings.mode === "extrude" ? "Extrusion depth" : "Base thickness"} value={settings.baseThickness} min={0.5} max={30} step={0.5} onChange={(value) => update("baseThickness", value)} />
            {settings.mode === "heightmap" && <LabeledNumber id="image-relief" label="Relief height" value={settings.reliefHeight} min={0} max={60} step={0.5} onChange={(value) => update("reliefHeight", value)} />}
          </div>
          <div className={styles.detailControl}>
            <label className={styles.fieldLabel} htmlFor="image-detail">{settings.mode === "extrude" ? "Contour detail" : "Mesh detail"}<span>{settings.detail} samples</span></label>
            <input id="image-detail" type="range" min="32" max="10000" step="16" value={settings.detail} onChange={(event) => update("detail", Number(event.currentTarget.value))} />
            <div className={styles.rangeEnds}><span>Faster</span><span>More detail</span></div>
          </div>
          {settings.mode === "extrude" && <>
            <div className={styles.rule} />
            <div className={styles.panelHeading}>
              <div><Text variant="label-strong-xs" onBackground="neutral-weak">GEOMETRY</Text><Heading as="h2" variant="heading-strong-m">Extrusion quality</Heading></div>
            </div>
            <div className={styles.detailControl}>
              <label className={styles.fieldLabel} htmlFor="image-merge-colors">Merge similar colors<span>{settings.mergeSimilarColors}</span></label>
              <input id="image-merge-colors" type="range" min="0" max="128" step="1" value={settings.mergeSimilarColors} onChange={(event) => update("mergeSimilarColors", Number(event.currentTarget.value))} />
            </div>
            <label className={styles.field} htmlFor="image-part-reduction">
              <span className={styles.fieldLabel}>Hole/part reduction</span>
              <select id="image-part-reduction" value={settings.holePartReduction} onChange={(event) => update("holePartReduction", event.currentTarget.value as ImageifyPartReduction)}>
                <option value="auto">Auto</option>
                <option value="low">Low</option>
                <option value="none">None</option>
              </select>
            </label>
            <SegmentedControl
              buttons={[{ value: "none", label: "No snap" }, { value: "average", label: "Average" }, { value: "nearest", label: "Nearest" }]}
              value={settings.snapVertices}
              onChange={(value) => update("snapVertices", value as ImageifySnapMode)}
            />
            {settings.snapVertices !== "none" && <div className={styles.detailControl}>
              <label className={styles.fieldLabel} htmlFor="image-snap-distance">Snap distance<span>{settings.snapDistance.toFixed(1)}</span></label>
              <input id="image-snap-distance" type="range" min="0" max="5" step="0.1" value={settings.snapDistance} onChange={(event) => update("snapDistance", Number(event.currentTarget.value))} />
            </div>}
            <div className={styles.detailControl}>
              <label className={styles.fieldLabel} htmlFor="image-outline-smoothing">Outline smoothing<span>{settings.outlineSmoothing.toFixed(2)}</span></label>
              <input id="image-outline-smoothing" type="range" min="0" max="0.5" step="0.01" value={settings.outlineSmoothing} onChange={(event) => update("outlineSmoothing", Number(event.currentTarget.value))} />
            </div>
            <div className={styles.detailControl}>
              <label className={styles.fieldLabel} htmlFor="image-outline-simplification">Outline simplification<span>{settings.outlineSimplification.toFixed(1)}</span></label>
              <input id="image-outline-simplification" type="range" min="0" max="3" step="0.1" value={settings.outlineSimplification} onChange={(event) => update("outlineSimplification", Number(event.currentTarget.value))} />
            </div>
          </>}
          {settings.mode === "heightmap" && <>
            <label className={styles.checkRow}>
              <input type="checkbox" checked={settings.invert} onChange={(event) => update("invert", event.currentTarget.checked)} />
              <span>Invert height map</span>
            </label>
          </>}
        </aside>

        <section className={styles.stage} aria-label="Model preview">
          <div className={styles.stageToolbar}>
            <Row gap="8" vertical="center"><span className={`${styles.statusDot} ${model ? styles.statusReady : ""}`} /><Text variant="label-default-s" onBackground="neutral-weak">{status}</Text></Row>
            <Row gap="8" vertical="center"><Text variant="label-default-xs" onBackground="neutral-weak">Drag to orbit · Scroll to zoom</Text><Button variant="tertiary" size="xs" onClick={() => setResetCamera((value) => value + 1)}>Reset view</Button></Row>
          </div>
          <div className={styles.viewport}>
            {model && <ModelPreview model={model} onResetCamera={resetCamera} theme={resolvedTheme} />}
            {!model && <div className={styles.emptyState}>
              <span className={styles.emptyMark}>I</span>
              <Heading as="h2" variant="heading-strong-m">Your relief will appear here</Heading>
              <Text variant="body-default-s" onBackground="neutral-weak">Choose an image to create a colored 3D model.</Text>
            </div>}
            {model && <div className={styles.axisTag}><span>X</span><span>Y</span><span>Z</span></div>}
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
            <div className={`${styles.triangleIndicator} ${(model?.triangleCount ?? 0) > robloxTriangleLimit ? styles.triangleLimitExceeded : ""}`} aria-label={`${(model?.triangleCount ?? 0).toLocaleString()} triangles; Roblox limit ${robloxTriangleLimit.toLocaleString()}`}>
              <span>TRIANGLES</span><b>{(model?.triangleCount ?? 0).toLocaleString()}</b><i>/ {robloxTriangleLimit.toLocaleString()}</i>
            </div>
            <div className={styles.exportControls}>
              <label className={styles.exportPillWrap}>
                <span className={styles.pillLabel}>Format</span>
                <select className={styles.exportFormatSelect} value={exportFormat} onChange={(event) => setExportFormat(event.currentTarget.value as "fbx" | "obj")} aria-label="Export format">
                  <option value="fbx">FBX</option>
                  <option value="obj">OBJ</option>
                </select>
              </label>
              <Button size="s" prefixIcon="download" onClick={() => void exportModel()} disabled={!model || busy} loading={busy}>Export model</Button>
            </div>
          </footer>
        </section>
      </div>
      {(error || notice) && <div className={`${styles.toast} ${error ? styles.toastError : ""}`} role={error ? "alert" : "status"}>
        <span>{error || notice}</span><button type="button" onClick={() => { setError(""); setNotice(""); }} aria-label="Dismiss message">×</button>
      </div>}
    </main>
  );
}