import { Column, Heading, Text, Button, Logo, Badge, Line, LetterFx, Row } from "@/once-ui/components";
import { BarGraph } from "@/once-ui/components/BarGraph";
import { LineBarGraph } from "@/once-ui/components/LineBarGraph";
import { LineGraph } from "@/once-ui/components/LineGraph";
import { MultiBarGraph } from "@/once-ui/components/MultiBarGraph";

export default function Home() {
  return (
    <Column fill center padding="l">
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

      {/* DATA VISUALIZATION */}
      <Row
          fillWidth
          paddingX="32"
          paddingY="160"
          horizontal="center"
          vertical="center"
        >
          <Column fillWidth gap="64">
            <Column gap="16" horizontal="center">
              <Heading as="h2" variant="display-default-m">
                Data Visualization
              </Heading>
              <Text align="center" onBackground="neutral-weak">
                Powerful, responsive charts with automatic theming support
              </Text>
            </Column>
            
            <Row fill gap="32" mobileDirection="column">
              {/* Bar Graph */}
              <Column fill>
              <Column background="neutral-weak" fill direction="column" border="neutral-alpha-weak" radius="xl" padding="32" gap="24">
                  <Heading as="h3" variant="heading-default-m">
                    Revenue
                  </Heading>
                  <BarGraph
                  hideAxisTitles
                  hideLabels
                  height={20}
                    barColor="success"
                    tooltipTitle="Revenue"
                    xAxisTitle="Month"
                    yAxisTitle="USD"
                    hideYAxisLabels={false}
                    data={[
                      { name: "Jan", value: 4500, startDate: "Jan", endDate: "January" },
                      { name: "Feb", value: 5200, startDate: "Feb", endDate: "February" },
                      { name: "Mar", value: 4900, startDate: "Mar", endDate: "March" },
                      { name: "Apr", value: 6300, startDate: "Apr", endDate: "April" },
                      { name: "May", value: 5900, startDate: "May", endDate: "May" },
                      { name: "Jun", value: 8200, startDate: "Jun", endDate: "June" },
                    ]}
                  />
                </Column>
              </Column>
              
              {/* Line Graph */}
              <Column fillWidth>
                <Column background="neutral-weak" fill direction="column" border="neutral-alpha-weak" radius="xl" padding="32" gap="24">
                  <Heading as="h3" variant="heading-default-m">
                    User Activity
                  </Heading>
                  <LineGraph
                  hideAxisTitles
                    height={20}
                    xAxisTitle="Week"
                    yAxisTitle="Users"
                    value1="Desktop"
                    value2="Mobile"
                    value3="Tablet"
                    data={[
                      { name: "W1", value1: 2100, value2: 1400, value3: 5500 },
                      { name: "W2", value1: 2200, value2: 4398, value3: 3200 },
                      { name: "W3", value1: 2000, value2: 1200, value3: 6500 },
                      { name: "W4", value1: 3780, value2: 1108, value3: 1700 },
                      { name: "W5", value1: 5990, value2: 1800, value3: 2100 },
                      { name: "W6", value1: 4000, value2: 2400, value3: 3000 },
                      { name: "W7", value1: 5000, value2: 3000, value3: 4000 },
                    ]}
                  />
                </Column>
              </Column>
            </Row>
            
            <Row fillWidth gap="32" mobileDirection="column">
              {/* Multi Bar Graph */}
              <Column fillWidth>
                <Column background="neutral-weak" fill direction="column" border="neutral-alpha-weak" radius="xl" padding="32" gap="24">
                  <Heading as="h3" variant="heading-default-m">
                    Quarterly Comparison
                  </Heading>
                  <MultiBarGraph
                  hideAxisTitles
                    height={20}
                    data={[
                      { name: "Q1", value1: 35000, value2: 45000, value3: 30000 },
                      { name: "Q2", value1: 42000, value2: 48000, value3: 36000 },
                      { name: "Q3", value1: 55000, value2: 51000, value3: 40000 },
                      { name: "Q4", value1: 75000, value2: 52000, value3: 48000 },
                    ]}
                    xAxisTitle="Quarter"
                    yAxisTitle="USD"
                    barLabels={["2023", "2024", "Projected"]}
                  />
                </Column>
              </Column>
              
              {/* Line Bar Graph */}
              <Column fillWidth>
                <Column background="neutral-weak" fill direction="column" border="neutral-alpha-weak" radius="xl" padding="32" gap="24">
                  <Heading as="h3" variant="heading-default-m">
                    Conversions vs Traffic
                  </Heading>
                  <LineBarGraph
                  hideAxisTitles
                    height={20}
                    lineColorVariant="info"
                    showArea={true}
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
                </Column>
              </Column>
            </Row>
          </Column>
          </Row>
    </Column>
  );
}
