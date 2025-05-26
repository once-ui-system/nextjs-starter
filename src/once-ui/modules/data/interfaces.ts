import { DateRange } from "@/once-ui/components";
import { Flex } from "../../components";

type ChartStyles = "flat" | "gradient" | "outline";

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
  variant?: ChartStyles;
  loading?: boolean;
}

export type { DataPoint, SeriesConfig, DateConfig, ChartProps, ChartStyles };