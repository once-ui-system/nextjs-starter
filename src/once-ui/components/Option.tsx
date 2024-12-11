interface OptionProps {
  label: React.ReactNode;
  value: string;
  hasPrefix?: React.ReactNode;
  hasSuffix?: React.ReactNode;
  description?: React.ReactNode;
  danger?: boolean;
}

const Option: React.FC<OptionProps> = ({
  label,
  value,
  hasPrefix,
  hasSuffix,
  description,
  danger,
}) => {
  return (
    <div className={`option, ${danger ? "danger" : ""}`}>
      {hasPrefix && <span className="prefix">{hasPrefix}</span>}
      <span className="label">{label}</span>
      {hasSuffix && <span className="suffix">{hasSuffix}</span>}
      {description && <span className="description">{description}</span>}
    </div>
  );
};

Option.displayName = "Option";
export { Option };
