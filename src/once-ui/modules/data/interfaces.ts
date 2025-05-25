import { DateRange } from "@/once-ui/components";
import { Flex } from "../../components";

interface DataPoint {
  [key: string]: string | number | Date | undefined;
  label?: string;
}

interface SeriesConfig {
  key: string;
  color?: string;
}

interface DateConfig {
  start?: Date;
  end?: Date;
  max?: Date;
  min?: Date;
  dual?: boolean;
  format?: string;
  presets?: boolean;
  onChange?: (range: DateRange) => void;
}

interface ChartProps extends Omit<React.ComponentProps<typeof Flex>, 'title' | 'description'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  series: SeriesConfig | SeriesConfig[];
  data: DataPoint[];
  legend?: boolean;
  date?: DateConfig;
  emptyState?: React.ReactNode;
  labels?: "x" | "y" | "both" | "none";
  variant?: "flat" | "gradient" | "outline";
}

export type { DataPoint, SeriesConfig, DateConfig, ChartProps };