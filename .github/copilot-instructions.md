# Once UI - Instrucciones para Agentes de IA

Este es un proyecto Next.js construido con **Once UI**, un sistema de diseño que reduce significativamente la cantidad de código necesario comparado con otras soluciones. El enfoque principal es generar componentes usando la biblioteca `@once-ui-system/core`.

## Arquitectura del Proyecto

- **Framework**: Next.js 15.3+ con App Router (`src/app/`)
- **Sistema de Diseño**: Once UI Core v1.4.12+
- **Configuración Centralizada**: `src/resources/once-ui.config.js` controla todo el tema, colores, fuentes y estilos
- **TypeScript**: Estricto, con paths alias `@/*` para imports
- **Styling**: CSS tokens de Once UI (no usar Tailwind ni CSS-in-JS custom)

## Generación de Componentes Once UI

### Importación de Componentes

**SIEMPRE** importar componentes desde `@once-ui-system/core`:

```tsx
import { 
  Button, Heading, Text, Column, Flex, Row, Grid,
  Badge, Avatar, Icon, Logo, Line, LetterFx,
  Input, Select, Checkbox, Toggle, SmartImage,
  Card, Tag, Dropdown, Toast, Modal, Accordion
} from "@once-ui-system/core";
```

### Patrones de Componentes Once UI

#### 1. **Layout Components** (Column, Flex, Row, Grid)

Estos son los contenedores principales. Usar propiedades semánticas en lugar de CSS:

```tsx
// ❌ NO hacer esto:
<div className="flex flex-col items-center gap-4">

// ✅ SÍ hacer esto:
<Column fillWidth center gap="l" padding="xl">
  {children}
</Column>

// Propiedades comunes:
// - fillWidth, fillHeight: ocupar espacio disponible
// - center, horizontal="center", vertical="center": alineación
// - gap: "xs" | "s" | "m" | "l" | "xl" | "4" | "8" | "16" | "24" | "32"
// - padding, margin: igual que gap
// - maxWidth: "xs" | "s" | "m" | "l" | "xl"
// - as: cambiar el elemento HTML renderizado
```

#### 2. **Tipografía** (Heading, Text)

Usar variantes predefinidas en lugar de clases CSS:

```tsx
// ❌ NO hacer esto:
<h1 className="text-4xl font-bold">

// ✅ SÍ hacer esto:
<Heading variant="display-strong-xl">
  Título Principal
</Heading>

<Text 
  variant="body-default-l"
  onBackground="neutral-weak"
  wrap="balance"
>
  Texto descriptivo
</Text>

// Variantes de Heading:
// - display-strong-xl, display-strong-l, display-strong-m
// - heading-strong-xl, heading-strong-l, heading-default-m

// Variantes de Text:
// - body-default-xl, body-default-l, body-default-m, body-default-s
// - label-default-s, code-default-s
```

#### 3. **Componentes Interactivos** (Button, Input)

```tsx
// Botones con iconos integrados
<Button
  href="/docs"
  variant="secondary"
  size="m"
  prefixIcon="rocket"      // de src/resources/icons.ts
  arrowIcon                // añade flecha automáticamente
  data-border="rounded"    // override de estilo
>
  Ver documentación
</Button>

// Inputs con validación visual
<Input
  id="email"
  label="Email"
  type="email"
  placeholder="tu@email.com"
  error="Email inválido"   // muestra estado de error
  hasPrefix               // para iconos
/>
```

#### 4. **Efectos Visuales** (LetterFx, Background)

```tsx
// Animación de texto
<Text>
  <LetterFx trigger="instant">
    Texto con efecto de aparición
  </LetterFx>
</Text>

// Background con efectos (ver layout.tsx)
<Background
  position="absolute"
  mask={{ x: 50, y: 0, radius: 100 }}
  dots={{ display: true, size: "2", color: "brand-on-background-weak" }}
  gradient={{ display: false }}
/>
```

### Tokens de Color

Usar sistema de tokens en lugar de colores hex:

```tsx
// Propiedades de color:
// - background: "page" | "surface" | "brand-weak" | "neutral-medium"
// - onBackground: "neutral-weak" | "neutral-strong" | "brand-medium"
// - border: "neutral-alpha-weak" | "brand-medium"

<Column background="surface" border="neutral-alpha-weak">
  <Text onBackground="brand-strong">Texto colorido</Text>
</Column>
```

### Espaciado y Sizing

Sistema de tokens consistente:

```tsx
// Espaciado: "xs" | "s" | "m" | "l" | "xl" | "2" | "4" | "8" | "12" | "16" | "24" | "32" | "40" | "48"
<Column gap="l" padding="xl" margin="m">

// Tamaños de componentes: "xs" | "s" | "m" | "l" | "xl"
<Button size="l">
<Avatar size="m">
<Icon size="s">
```

## Estructura de Páginas

### Page Component

```tsx
"use client"; // si usa interactividad

import { Heading, Column, /* ... */ } from "@once-ui-system/core";

export default function MiPagina() {
  return (
    <Column fillWidth padding="l" gap="xl">
      <Column maxWidth="m" horizontal="center">
        <Heading variant="display-strong-l">Título</Heading>
        {/* contenido */}
      </Column>
    </Column>
  );
}
```

### Metadata (para páginas server)

```tsx
import { Meta } from "@once-ui-system/core";
import { baseURL, meta } from "@/resources/once-ui.config";

export async function generateMetadata() {
  return Meta.generate({
    title: "Mi Página",
    description: "Descripción SEO",
    baseURL: baseURL,
    path: "/mi-pagina",
    image: "/images/og/mi-pagina.jpg",
  });
}
```

## Configuración Global

### Modificar Tema (once-ui.config.js)

```js
const style = {
  theme: "dark",          // dark | light | system
  brand: "blue",          // color primario
  accent: "indigo",       // color secundario
  neutral: "gray",        // escala de grises
  border: "playful",      // rounded | playful | conservative
  scaling: "100",         // 90-110, afecta todo el tamaño
};
```

### Añadir Iconos Custom (icons.ts)

```ts
import { HiOutlineRocketLaunch, HiSparkles } from "react-icons/hi2";

export const iconLibrary: Record<string, IconType> = {
  rocket: HiOutlineRocketLaunch,
  sparkles: HiSparkles,
};
// Luego usar: <Icon name="sparkles" />
```

## Comandos de Desarrollo

```bash
npm run dev          # Desarrollo con Turbopack
npm run build        # Build de producción
npm run biome-write  # Formatear código (preferir esto sobre Prettier)
```

## Reglas Importantes

1. **NO usar Tailwind**: Once UI reemplaza completamente Tailwind
2. **NO usar CSS modules**: Usar propiedades de componentes Once UI
3. **NO importar CSS global**: Excepto en layout.tsx (ya configurado)
4. **Propiedades semánticas primero**: gap, padding, fillWidth en lugar de className
5. **Tokens de diseño**: Siempre usar tokens predefinidos (colors, spacing, sizing)
6. **Client Components**: Añadir `"use client"` solo si hay interactividad (useState, useEffect, event handlers)
7. **Configuración centralizada**: Modificar `once-ui.config.js` para cambios globales de tema

## Ejemplos de Patrones Comunes

### Card con Imagen y Contenido

```tsx
<Column 
  border="neutral-alpha-weak" 
  radius="l" 
  padding="l" 
  gap="m"
  background="surface"
>
  <SmartImage 
    src="/images/feature.jpg" 
    alt="Feature"
    aspectRatio="16 / 9"
    radius="m"
  />
  <Heading variant="heading-strong-m">Título</Heading>
  <Text variant="body-default-m" onBackground="neutral-weak">
    Descripción del contenido
  </Text>
  <Button variant="secondary" size="s">Ver más</Button>
</Column>
```

### Grid Responsivo

```tsx
<Grid columns="1" mobileColumns="1" tabletColumns="2" gap="l">
  <Column>Item 1</Column>
  <Column>Item 2</Column>
  <Column>Item 3</Column>
</Grid>
```

### Hero Section

```tsx
<Column fillWidth center padding="xl" style={{ minHeight: "100vh" }}>
  <Column maxWidth="m" horizontal="center" gap="l" align="center">
    <Heading variant="display-strong-xl" wrap="balance">
      Título impactante centrado
    </Heading>
    <Text variant="heading-default-l" onBackground="neutral-weak">
      Subtítulo explicativo
    </Text>
    <Flex gap="m">
      <Button size="l" href="/empezar">Comenzar</Button>
      <Button variant="secondary" size="l" href="/docs">Documentación</Button>
    </Flex>
  </Column>
</Column>
```

## Recursos

- **Documentación**: https://docs.once-ui.com/once-ui/quick-start
- **Componentes**: https://once-ui.com/blocks
- **Figma**: https://once-ui.com/figma
- **Discord**: https://discord.com/invite/5EyAQ4eNdS
