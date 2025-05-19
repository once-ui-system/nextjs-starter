import { Row, Flex } from ".";
import { forwardRef } from "react";

interface BannerProps extends React.ComponentProps<typeof Flex> {}

const Banner = forwardRef<HTMLDivElement, BannerProps>(({ children, ...flex }, ref) => (
  <Row
    fillWidth
    paddingX="16"
    paddingY="8"
    solid="brand-medium"
    onSolid="brand-strong"
    textVariant="label-default-s"
    align="center"
    center
    gap="12"
    ref={ref}
    {...flex}
  >
    {children}
  </Row>
));

Banner.displayName = "Banner";
export { Banner };
