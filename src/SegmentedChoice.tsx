import { useState, type ReactNode } from 'react';
import { ToggleButton, ToggleButtonGroup } from 'react-aria-components';

export interface SegmentedOption {
	value: string;
	label: ReactNode;
	isDisabled?: boolean;
}

export interface SegmentedChoiceProps {
	options: SegmentedOption[];
	value?: string;
	/** The chosen value when uncontrolled. */
	defaultValue?: string;
	onChange?: (value: string) => void;
	isDisabled?: boolean;
	/** The group's name; there is no visible label in web-ui's segmented choice. */
	'aria-label'?: string;
	'aria-labelledby'?: string;
}

/**
 * web-ui's `.kh-segmented` (android-ui's AppSegmentedChoice): one choice at a time, always one chosen.
 * React Aria's toggle button group gives `role="radiogroup"` and `role="radio"` with `aria-checked`, which is
 * what web-ui's CSS reads. The arrow keys move the choice with the focus, as in a native radio group.
 */
export function SegmentedChoice({
	options,
	value,
	defaultValue,
	onChange,
	isDisabled,
	...labels
}: SegmentedChoiceProps) {
	// Uncontrolled when `value` is not given; the focus-follows-choice below needs the state either way.
	const [inner, setInner] = useState(defaultValue);
	const current = value ?? inner;
	const select = (next: string) => {
		setInner(next);
		onChange?.(next);
	};
	return (
		<ToggleButtonGroup
			{...labels}
			className="kh-segmented"
			selectionMode="single"
			disallowEmptySelection
			selectedKeys={current === undefined ? [] : [current]}
			onSelectionChange={(keys) => {
				const [next] = keys;
				if (next !== undefined) select(String(next));
			}}
			isDisabled={isDisabled}
		>
			{options.map((option) => (
				<ToggleButton
					key={option.value}
					id={option.value}
					isDisabled={option.isDisabled}
					className=""
					onFocus={(event) => {
						// Focus arriving from another segment in the group came from an arrow key (Tab leaves the
						// group, a click selects anyway): the choice follows it. Selecting is idempotent.
						const from = event.relatedTarget;
						const group = event.currentTarget.closest('[role="radiogroup"]');
						if (from instanceof Element && group?.contains(from)) select(option.value);
					}}
				>
					{option.label}
				</ToggleButton>
			))}
		</ToggleButtonGroup>
	);
}
