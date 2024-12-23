"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";

import "@/once-ui/modules/code/CodeHighlight.css";
import styles from "@/once-ui/modules/code/CodeBlock.module.scss";

import {
  Flex,
  Button,
  IconButton,
  DropdownWrapper,
  Option,
} from "@/once-ui/components";

import Prism from "prismjs";
import "prismjs/plugins/line-highlight/prism-line-highlight";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";

type CodeInstance = {
  code: string;
  language: string;
  label: string;
};

interface CodeBlockProps extends React.ComponentProps<typeof Flex> {
  highlight?: string;
  codeInstances?: CodeInstance[];
  codePreview?: ReactNode;
  copyButton?: boolean;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

const CodeBlock: React.FC<CodeBlockProps> = ({
  highlight,
  codeInstances = [],
  codePreview,
  copyButton = true,
  compact = false,
  className,
  style,
  ...rest
}) => {
  const codeRef = useRef<HTMLElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [selectedInstance, setSelectedInstance] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { code, language, label } = codeInstances[selectedInstance] || {
    code: "",
    language: "",
    label: "Select Code",
  };

  const [copyIcon, setCopyIcon] = useState<string>("clipboard");

  useEffect(() => {
    if (codeRef.current && codeInstances.length > 0) {
      Prism.highlightAll();
    }
  }, [code, codeInstances.length]);

  const handleCopy = () => {
    if (codeInstances.length > 0) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          setCopyIcon("check");

          setTimeout(() => {
            setCopyIcon("clipboard");
          }, 5000);
        })
        .catch((err) => {
          console.error("Failed to copy code: ", err);
        });
    }
  };

  const handleContent = (selectedLabel: string) => {
    const index = codeInstances.findIndex(
      (instance) => instance.label === selectedLabel,
    );
    if (index !== -1) {
      setSelectedInstance(index);
    }
  };

  return (
    <Flex
      position="relative"
      zIndex={0}
      background="surface"
      radius="l"
      border="neutral-medium"
      direction="column"
      justifyContent="center"
      fillWidth
      minHeight={3}
      className={className}
      style={style}
      {...rest}
    >
      {(codeInstances.length > 1 || (copyButton && !compact)) && (
        <Flex
          borderBottom="neutral-medium"
          zIndex={2}
          fillWidth
          padding="8"
          justifyContent="space-between"
        >
          {codeInstances.length > 1 ? (
            <Flex>
              <DropdownWrapper
                isOpen={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
                trigger={
                  <Button
                    size="s"
                    label={label}
                    suffixIcon="chevronDown"
                    variant="tertiary"
                  />
                }
                dropdown={
                  <Flex direction="column" gap="2">
                    {codeInstances.map((instance, index) => (
                      <Option
                        key={index}
                        value={instance.label}
                        label={instance.label}
                        selected={selectedInstance === index}
                        onClick={() => {
                          handleContent(instance.label);
                          setIsDropdownOpen(false);
                        }}
                      />
                    ))}
                  </Flex>
                }
              />
            </Flex>
          ) : (
            <div />
          )}
          {copyButton && !compact && (
            <IconButton
              tooltip="Copy"
              variant="secondary"
              onClick={handleCopy}
              icon={copyIcon}
            />
          )}
        </Flex>
      )}
      {codePreview && (
        <Flex
          position="relative"
          zIndex={1}
          fillHeight
          padding="l"
          minHeight={12}
          justifyContent="center"
          alignItems="center"
        >
          {Array.isArray(codePreview)
            ? codePreview.map((item, index) => (
                <React.Fragment key={index}>{item}</React.Fragment>
              ))
            : codePreview}
        </Flex>
      )}
      {codeInstances.length > 0 && (
        <Flex
          borderTop={(!compact && codePreview) ? "neutral-medium" : undefined}
          fillWidth
          padding="8"
          position="relative"
          overflowY="auto"
        >
          {compact && copyButton && (
            <Flex
              zIndex={1}
              right="8"
              top="8"
              position="absolute"
            >
              <IconButton
                aria-label="Copy code"
                onClick={handleCopy}
                icon={copyIcon}
                size="m"
                variant="secondary"
              />
            </Flex>
          )}
          <pre
            data-line={highlight}
            ref={preRef}
            className={`${styles.pre} language-${language}`}
            tabIndex={-1}
          >
            <code
              ref={codeRef}
              className={`${styles.code} ${`language-${language}`}`}
            >
              {code}
            </code>
          </pre>
        </Flex>
      )}
    </Flex>
  );
};

export { CodeBlock };
