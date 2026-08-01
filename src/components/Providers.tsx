"use client";

import { type BorderStyle, type ChartMode, type ChartVariant, DataThemeProvider, IconProvider, LayoutProvider, type NeutralColor, type ScalingSize, type Schemes, type SolidStyle, type SolidType, type SurfaceStyle, type Theme, ThemeProvider, ToastProvider, type TransitionStyle } from "@once-ui-system/core";
import { style, dataStyle } from "../resources/once-ui.config";
import { iconLibrary } from "../resources/icons";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <ThemeProvider
        theme={style.theme as Theme}
        brand={style.brand as Schemes}
        accent={style.accent as Schemes}
        neutral={style.neutral as NeutralColor}
        solid={style.solid as SolidType}
        solidStyle={style.solidStyle as SolidStyle}
        border={style.border as BorderStyle}
        surface={style.surface as SurfaceStyle}
        transition={style.transition as TransitionStyle}
        scaling={style.scaling as ScalingSize}
      >
        <DataThemeProvider
          variant={dataStyle.variant as ChartVariant}
          mode={dataStyle.mode as ChartMode}
          height={dataStyle.height}
          axis={{
            stroke: dataStyle.axis.stroke
          }}
          tick={{
            fill: dataStyle.tick.fill,
            fontSize: dataStyle.tick.fontSize,
            line: dataStyle.tick.line
          }}
          >
          <ToastProvider>
            <IconProvider icons={iconLibrary}>
              {children}
            </IconProvider>
          </ToastProvider>
        </DataThemeProvider>
      </ThemeProvider>
    </LayoutProvider>
  );
}