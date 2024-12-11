import classNames from "classnames";
import { Flex, Text } from ".";
import styles from "./option.module.scss";
import { ElementType } from "./ElementType";

interface OptionProps {
  label: React.ReactNode;
  href?: string;
  value: string;
  hasPrefix?: React.ReactNode;
  hasSuffix?: React.ReactNode;
  description?: React.ReactNode;
  danger?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

const Option: React.FC<OptionProps> = ({
  label,
  value,
  href,
  hasPrefix,
  hasSuffix,
  description,
  danger,
  selected,
  onClick
}) => {
  return (
    <ElementType href={href} className="resetButtonStyles" onClick={onClick}>
      <Flex
        fillWidth
        alignItems="center"
        paddingX="12"
        paddingY="8"
        gap="12"
        radius="m"
        role="option"
        data-value={value}
        className={classNames(styles.option, {
          [styles.selected]: selected,
          [styles.danger]: danger
        })}>
        {hasPrefix && <Flex className={styles.prefix}>{hasPrefix}</Flex>}
        <Flex
          alignItems="flex-start"
          style={{ whiteSpace: "nowrap" }}
          fillWidth
          direction="column"
        >
          <Text onBackground="neutral-strong" variant="label-default-s">
            {label}
          </Text>
          {description && (
            <Text variant="body-default-xs" onBackground="neutral-weak">
              {description}
            </Text>
          )}
        </Flex>
        {hasSuffix && (
          <Flex className={styles.suffix}>{hasSuffix}</Flex>
        )}
      </Flex>
    </ElementType>
  );
};

Option.displayName = "Option";
export { Option };