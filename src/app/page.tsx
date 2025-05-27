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
        labels="x"
        curve="step"
        title="Dachstein glacier retreat"
        description="Surface area of the Dachstein glacier over time"
        legend={{
          display: false,
        }}
        date={{
          start: new Date("1500-01-01"),
          end: new Date("2030-01-01"),
          format: "yyyy"
        }}
        series={[{ key: "Area", color: "contrast" }]}
        data={[
          { date: "1600-01-01", Area: 5.6 },
          { date: "1625-01-01", Area: 5.575 },
          { date: "1650-01-01", Area: 5.55 },
          { date: "1675-01-01", Area: 5.525 },
          { date: "1700-01-01", Area: 5.5 },
          { date: "1725-01-01", Area: 5.475 },
          { date: "1750-01-01", Area: 5.45 },
          { date: "1775-01-01", Area: 5.425 },
          { date: "1800-01-01", Area: 5.4 },
          { date: "1825-01-01", Area: 5.375 },
          { date: "1850-01-01", Area: 5.3 },
          { date: "1875-01-01", Area: 5.1 },
          { date: "1900-01-01", Area: 4.9 },
          { date: "1925-01-01", Area: 4.6 },
          { date: "1950-01-01", Area: 4.2 },
          { date: "1975-01-01", Area: 3.4 },
          { date: "2000-01-01", Area: 2.3 },
          { date: "2025-01-01", Area: 1.2 }
        ]}
      />

      <PieChart
        title="Microplastics Ingested Annually"
        description="Estimated particles per person per source"
        legend={{
          display: true,
          position: "top-left",
          direction: "column"
        }}
        ring={{ inner: 60, outer: 70 }}
        series={{
          key: "value",
        }}
        data={[
          { name: "Bottled Water", value: 94370 },
          { name: "Beer", value: 32270 },
          { name: "Salt", value: 11000 },
          { name: "Air", value: 9800 },
          { name: "Tap Water", value: 4240 },
          { name: "Honey", value: 1480 }
        ]}
      />

      <BarChart
        title="Wealth Distribution: Top 1% vs Bottom 99%"
        description="Share of new global wealth since 2020"
        labels="x"
        xAxisKey="group"
        barWidth="m"
        series={{
          key: "wealth",
        }}
        data={[
          { group: "Top 1%", wealth: 63 },
          { group: "Bottom 99%", wealth: 37 }
        ]}
      />

      <BarChart
        title="Daily Time Spent on Activities"
        description="Social media vs. reading"
        labels="x"
        xAxisKey="activity"
        series={{
          key: "minutes",
          color: "indigo"
        }}
        data={[
          { activity: "Social Media", minutes: 144 },
          { activity: "Reading", minutes: 16 }
        ]}
      />
              
      <LineChart
        title="Page Visits Per Week"
        description="How many users visited our page"
        labels="both"
        date={{
          start: new Date("2024-01-01"),
          end: new Date("2024-01-31"),
          max: new Date(),
          format: "yyyy MMM d",
          dual: false,
          presets: true
        }}
        legend={{
          position: "top-left",
          direction: "column"
        }}
        series={[
          { key: "Revenue" },
          { key: "Profit" },
          { key: "Loss" }
        ]}
        data={[
          { date: "2024-01-01", Revenue: 2100, Profit: 1400, Loss: 5500 },
          { date: "2024-01-08", Revenue: 2200, Profit: 4398, Loss: 3200 },
          { date: "2024-01-15", Revenue: 2000, Profit: 1200, Loss: 6500 },
          { date: "2024-01-22", Revenue: 3780, Profit: 1108, Loss: 1700 },
          { date: "2024-01-29", Revenue: 5990, Profit: 1800, Loss: 2100 },
          { date: "2024-02-05", Revenue: 4000, Profit: 2400, Loss: 3000 },
          { date: "2024-02-12", Revenue: 5000, Profit: 3000, Loss: 4000 },
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
                origo={{ x: 40, y: 50 }}
                legend={{
                  position: "top-left",
                  direction: "column"
                }}
                ring={{
                  inner: 60,
                  outer: 70
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
