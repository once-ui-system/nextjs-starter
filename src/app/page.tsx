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

      <Row fillWidth gap="32" mobileDirection="column">
        <BarChart
          title="Company revenue in Q2 2025"
          variant="flat"
          description="How much dough we made"
          series={{
            key: "Revenue",
            color: "contrast"
          }}
          date={{
            start: new Date("2024-01-01"),
            end: new Date("2024-01-31"),
            max: new Date(),
            dual: false,
            presets: true
          }}
          data={[
            { date: "2024-01-01", Revenue: 4500, label: "January" },
            { date: "2024-02-01", Revenue: 5200, label: "February" },
            { date: "2024-03-01", Revenue: 4900, label: "March" },
            { date: "2024-04-01", Revenue: 6300, label: "April" },
            { date: "2024-05-01", Revenue: 5900, label: "May" },
            { date: "2024-06-01", Revenue: 9900, label: "June" },
          ]}
        />
        
        <BarChart
          title="Product Sales by Category"
          description="Non-date based example"
          labels="x"
          xAxisKey="name"
          series={{
            key: "Sales",
            color: "blue"
          }}
          data={[
            { name: "Electronics", Sales: 4500, label: "Electronics" },
            { name: "Clothing", Sales: 3200, label: "Clothing" },
            { name: "Food", Sales: 2900, label: "Food" },
            { name: "Books", Sales: 1800, label: "Books" },
            { name: "Toys", Sales: 2200, label: "Toys" },
          ]}
        />
      </Row>
              
      <LineChart
        title="Page Visits Per Week"
        description="How many users visited our page"
        labels="both"
        date={{
          start: new Date("2024-01-01"),
          end: new Date("2024-01-31"),
          max: new Date(),
          dual: false,
          presets: true
        }}
        legend={{
          display: true,
          position: "top-left",
          direction: "column"
        }}
        series={[
          { key: "Revenue" },
          { key: "Profit" },
          { key: "Loss" }
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
            <GroupedBarChart
              title="Quarterly revenue"
              description="How much dough we made per quarter in 2023 and 2024"
                data={[
                  { name: "Q1", Income: 35000, Expenses: 45000, Profit: 30000 },
                  { name: "Q2", Income: 42000, Expenses: 48000, Profit: 36000 },
                  { name: "Q3", Income: 55000, Expenses: 51000, Profit: 40000 },
                  { name: "Q4", Income: 75000, Expenses: 52000, Profit: 48000 },
                ]}
                series={[
                  { key: "Income" },
                  { key: "Expenses" },
                  { key: "Profit" }
                ]}
              />
              
              <LineBarChart
                  title="Traffic Per Weekday"
                  description="How many users we had per weekday"
                  labels="both"
                  legend={{
                    display: true,
                    position: "top-right"
                  }}
                  series={[
                    { key: "Traffic", color: "blue" },
                    { key: "Conversions", color: "indigo" }
                  ]}
                  data={[
                    { name: "Mon", Traffic: 4500, Conversions: 2190 },
                    { name: "Tue", Traffic: 5200, Conversions: 4230 },
                    { name: "Wed", Traffic: 4800, Conversions: 3250 },
                    { name: "Thu", Traffic: 5900, Conversions: 3280 },
                    { name: "Fri", Traffic: 6800, Conversions: 4320 },
                    { name: "Sat", Traffic: 4800, Conversions: 3190 },
                    { name: "Sun", Traffic: 3900, Conversions: 3170 },
                  ]}
                />
            </Row>

            <Row fillWidth gap="32" mobileDirection="column">
              {/* Pie Chart */}

              <PieChart
                title="Pie chart"
                legend={{
                  display: true,
                  position: "top-left",
                  direction: "column"
                }}
                ring={{
                  inner: 0,
                  outer: 100
                }}
                series={{
                  key: "value",
                  color: "moss"
                }}
                data = {[
                  { name: 'Category A', value: 400 },
                  { name: 'Category B', value: 300 },
                  { name: 'Category C', value: 300 },
                  { name: 'Category D', value: 200 }
                ]}
              />
              
              <PieChart
                series={{
                  key: "value",
                  color: "green"
                }}
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
