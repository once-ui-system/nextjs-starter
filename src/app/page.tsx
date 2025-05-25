import {
  Heading,
  Text,
  Button,
  Column,
  Badge,
  Logo,
  Line,
  LetterFx,
  Row,
} from "@/once-ui/components";
import { format, parseISO } from "date-fns";
import { GroupedBarChart } from "@/once-ui/modules/data/GroupedBarChart";
import { LineBarChart } from "@/once-ui/modules/data/LineBarChart";
import { PieChart } from "@/once-ui/modules/data/PieChart";
import { BarChart } from "@/once-ui/modules/data/BarChart";
import { LineChart } from "@/once-ui/modules/data/LineChart";

export default function Home() {
  return (
    <Column fillWidth center padding="l">
      <Column maxWidth="s" horizontal="center" gap="l" align="center">
        <Badge textVariant="code-default-s" border="neutral-alpha-medium" onBackground="neutral-medium" vertical="center" gap="16">
          <Logo icon={false} href="https://once-ui.com" size="xs" />
          <Line vert background="neutral-alpha-strong"/>
          <Text marginX="4">
            <LetterFx trigger="instant">
              An ecosystem, not a UI kit
            </LetterFx>
          </Text>
        </Badge>
        <Heading variant="display-strong-xl" marginTop="24">
          Presence that doesn't beg for attention
        </Heading>
        <Text variant="heading-default-xl" onBackground="neutral-weak" wrap="balance" marginBottom="16">
          Build with clarity, speed, and quiet confidence
        </Text>
        <Button id="docs" href="https://docs.once-ui.com/once-ui/quick-start" data-border="rounded" weight="default" prefixIcon="copy" arrowIcon>
          Explore docs
        </Button>
      </Column>

      {/* Bar Chart */}
      <BarChart
        title="Company revenue in Q2 2025"
        labels="both"
        yAxisTitle="Count"
        xAxisTitle="Month"
        description="How much dough we made"
        tooltip="Revenue"
        color="emerald"
        data={[
          { name: "Jan", value: 4500, startDate: "Jan", endDate: "January" },
          { name: "Feb", value: 5200, startDate: "Feb", endDate: "February" },
          { name: "Mar", value: 4900, startDate: "Mar", endDate: "March" },
          { name: "Apr", value: 6300, startDate: "Apr", endDate: "April" },
          { name: "May", value: 5900, startDate: "May", endDate: "May" },
          { name: "Jun", value: 8200, startDate: "Jun", endDate: "June" },
        ]}
      />
              
      <LineChart
        title="Page Visits Per Week"
        description="How many users visited our page"
        legend
        labels="both"
        date={{
          start: new Date("2024-01-01"),
          end: new Date("2024-01-31"),
        }}
        series={[
          { key: "Revenue", color: "blue" },
          { key: "Profit", color: "green" },
          { key: "Loss", color: "red" }
        ]}
        data={[
          { date: "2024-01-01", Revenue: 2100, Profit: 1400, Loss: 5500, label: format(parseISO("2024-01-01"), "MMM d") },
          { date: "2024-01-08", Revenue: 2200, Profit: 4398, Loss: 3200, label: format(parseISO("2024-01-08"), "MMM d") },
          { date: "2024-01-15", Revenue: 2000, Profit: 1200, Loss: 6500, label: format(parseISO("2024-01-15"), "MMM d") },
          { date: "2024-01-22", Revenue: 3780, Profit: 1108, Loss: 1700, label: format(parseISO("2024-01-22"), "MMM d") },
          { date: "2024-01-29", Revenue: 5990, Profit: 1800, Loss: 2100, label: format(parseISO("2024-01-29"), "MMM d") },
          { date: "2024-02-05", Revenue: 4000, Profit: 2400, Loss: 3000, label: format(parseISO("2024-02-05"), "MMM d") },
          { date: "2024-02-12", Revenue: 5000, Profit: 3000, Loss: 4000, label: format(parseISO("2024-02-12"), "MMM d") },
        ]}
      />
            
          <Row fillWidth gap="32" mobileDirection="column">
            {/* Multi Bar Graph */}
            <GroupedBarChart
              legend
              yAxisTitle="Count"
              border="neutral-alpha-medium"
              title="Quarterly Revenue"
              description="How much dough we made per quarter in 2023 and 2024"
                data={[
                  { name: "Q1", value1: 35000, value2: 45000, value3: 30000 },
                  { name: "Q2", value1: 42000, value2: 48000, value3: 36000 },
                  { name: "Q3", value1: 55000, value2: 51000, value3: 40000 },
                  { name: "Q4", value1: 75000, value2: 52000, value3: 48000 },
                ]}
                bar={{
                  labels: ["2023", "2024", "Projected"]
                }}
              />
              
              {/* Line Bar Graph */}
              <LineBarChart
                  title="Traffic Per Weekday"
                  description="How many users we had per weekday"
                  showArea
                  legend
                  labels="both"
                  xAxisTitle="Day"
                  yAxisTitle="Count"
                  lineName="Traffic"
                  barName="Conversions"
                  data={[
                    { name: "Mon", lineValue: 4500, barValue: 2190 },
                    { name: "Tue", lineValue: 5200, barValue: 4230 },
                    { name: "Wed", lineValue: 4800, barValue: 3250 },
                    { name: "Thu", lineValue: 5900, barValue: 3280 },
                    { name: "Fri", lineValue: 6800, barValue: 4320 },
                    { name: "Sat", lineValue: 4800, barValue: 3190 },
                    { name: "Sun", lineValue: 3900, barValue: 3170 },
                  ]}
                />
            </Row>

            <Row fillWidth gap="32" mobileDirection="column">
              {/* Pie Chart */}

              <PieChart
                title="Pie chart"
                legend
                innerRadius="70%"
                data = {[
                  { name: 'Category A', value: 400 },
                  { name: 'Category B', value: 300 },
                  { name: 'Category C', value: 300 },
                  { name: 'Category D', value: 200 }
                ]}
              />
              
              <PieChart
                legend
                data = {[
                  { name: 'Category A', value: 400 },
                  { name: 'Category B', value: 300 },
                  { name: 'Category C', value: 300 },
                  { name: 'Category D', value: 200 }
                ]}
              />
            </Row>
          </Column>
  );
}
