import type { ReactNode } from 'react';
import { ToggleButton, ToggleButtonGroup } from 'react-aria-components';
import { cx } from './cx.js';

export interface ChipOption {
	value: string;
	label: ReactNode;
	/** An `<svg>` before the label; the check replaces it while the chip is chosen. */
	icon?: ReactNode;
	/** A count after the label (`kh-chip__value`). */
	count?: ReactNode;
	/** The active one among several chosen: filled in the primary colour (`kh-chip--emphasized`). */
	emphasized?: boolean;
	/** Not available yet (`kh-chip--pending`): dimmed with a dashed edge. The text says when, e.g. `från 15:40`. */
	pending?: ReactNode;
	isDisabled?: boolean;
}

export interface FilterChipsProps {
	options: ChipOption[];
	selected?: string[];
	defaultSelected?: string[];
	onChange?: (selected: string[]) => void;
	isDisabled?: boolean;
	'aria-label'?: string;
	'aria-labelledby'?: string;
}

/** web-ui's `.kh-chips` with `.kh-chip` (android-ui's ChipRow of AppFilterChip): several can be chosen. */
export function FilterChips({
	options,
	selected,
	defaultSelected,
	onChange,
	isDisabled,
	...labels
}: FilterChipsProps) {
	return (
		<ToggleButtonGroup
			{...labels}
			className="kh-chips"
			selectionMode="multiple"
			selectedKeys={selected}
			defaultSelectedKeys={defaultSelected}
			onSelectionChange={(keys) => onChange?.([...keys].map(String))}
			isDisabled={isDisabled}
		>
			{options.map((option) => (
				<ToggleButton
					key={option.value}
					id={option.value}
					isDisabled={option.isDisabled}
					className={cx(
						'kh-chip',
						option.emphasized && 'kh-chip--emphasized',
						option.pending !== undefined && 'kh-chip--pending'
					)}
				>
					{option.icon}
					<span className="kh-chip__label">{option.label}</span>
					{option.count !== undefined && <span className="kh-chip__value">{option.count}</span>}
					{option.pending !== undefined && (
						<span className="kh-chip__pending">{option.pending}</span>
					)}
				</ToggleButton>
			))}
		</ToggleButtonGroup>
	);
}
