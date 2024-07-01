"use client";

import React from 'react';
import classNames from 'classnames';

import { Flex, InteractiveDetails, InteractiveDetailsProps } from '.';
import styles from './Switch.module.scss';

interface SwitchProps extends Omit<InteractiveDetailsProps, 'onClick'> {
	className?: string;
	isChecked: boolean;
	reverse?: boolean;
	onToggle: () => void;
};

const Switch: React.FC<SwitchProps> = ({ className, isChecked, reverse = false, onToggle, ...interactiveDetailsProps }) => {
	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter') {
			onToggle();
		}
	};

	return (
		<Flex
			gap="16"
			alignItems="center"
			justifyContent={ reverse ? 'space-between' : 'auto' }
			fillWidth={ reverse ? true : false }
			className={classNames(styles.container, className, {
				[styles.reverse]: reverse,
			})}
			onClick={onToggle}>
			<div
				className={classNames(styles.switch, {
					[styles.checked]: isChecked,
				})}>
				<div
					onKeyDown={handleKeyDown}
					tabIndex={0}
					className={classNames(styles.toggle, {
						[styles.checked]: isChecked,
					})}/>
			</div>
			<InteractiveDetails
				{...interactiveDetailsProps}
				onClick={() => {}}/>
		</Flex>
	);
};

Switch.displayName = "Switch";

export { Switch };