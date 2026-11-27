import { useEffect, useLayoutEffect, useRef, type KeyboardEvent } from 'react';
import { flushSync } from 'react-dom';
import {
	clampStep,
	formatTime,
	lapsFor,
	middleOf,
	minuteValues,
	nearestPosition,
	wheelIndexes,
	wrap
} from './timeWheel.js';

export interface TimePickerProps {
	/** The time as "HH:MM", 24 hours. A minute between the steps is shown on the nearest step. */
	value: string;
	/** A new time as "HH:MM", when a wheel has stopped on a new number or an arrow key moved it. */
	onChange: (value: string) => void;
	/** The minute wheel's step in minutes, 1–30 (standard 1). */
	step?: number;
	/** The hour wheel's name (standard "Timme"). */
	hourLabel?: string;
	/** The minute wheel's name (standard "Minut"). */
	minuteLabel?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

/**
 * web-ui's `<kh-time-picker>` (android-ui's TimePickerPopup wheels): hour and minute as two wheels that go round. The
 * wheels are drawn here with web-ui's classes and follow `value`, which the app owns (ADR 0001): a wheel that stops
 * reports the number in the middle, and stands on the app's value again if the app keeps the old one. Put it in a
 * `ConfirmDialog`, or use `TimeField`, which opens it in its own dialog.
 */
export function TimePicker({
	value,
	onChange,
	step = 1,
	hourLabel = 'Timme',
	minuteLabel = 'Minut'
}: TimePickerProps) {
	const minutes = minuteValues(clampStep(step));
	const at = wheelIndexes(value, clampStep(step));
	return (
		<div className="kh-time-picker">
			<Wheel
				label={hourLabel}
				values={HOURS}
				index={at.hour}
				onSelect={(hour) => onChange(formatTime(hour, minutes[at.minute] ?? 0))}
			/>
			<span className="kh-time-picker__colon" aria-hidden="true">
				:
			</span>
			<Wheel
				label={minuteLabel}
				values={minutes}
				index={at.minute}
				onSelect={(minute) => onChange(formatTime(at.hour, minutes[minute] ?? 0))}
			/>
		</div>
	);
}

interface WheelProps {
	label: string;
	values: number[];
	/** The number in the middle, from the app. */
	index: number;
	onSelect: (index: number) => void;
}

/** One wheel: the numbers in several laps, snapped to the middle with `scroll-snap`, as kh.js builds it. */
function Wheel({ label, values, index, onSelect }: WheelProps) {
	const ref = useRef<HTMLDivElement>(null);
	const count = values.length;
	const latest = useRef({ index, onSelect });
	useLayoutEffect(() => {
		latest.current = { index, onSelect };
	});

	// The app's value: stand on it, the short way round; a step or two scrolls, a longer way jumps.
	useLayoutEffect(() => {
		const wheel = ref.current;
		const pitch = pitchOf(wheel);
		if (!wheel || !pitch) return;
		const at = Math.round(wheel.scrollTop / pitch);
		if (wrap(at, count) === index) return;
		const target = nearestPosition(at, index, count);
		wheel.scrollTo({
			top: target * pitch,
			behavior: Math.abs(target - at) <= 3 ? 'smooth' : 'instant'
		});
	}, [index, count]);

	useEffect(() => {
		const wheel = ref.current;
		if (!wheel) return;
		const standOnValue = () => {
			const pitch = pitchOf(wheel);
			if (pitch)
				wheel.scrollTo({ top: middleOf(latest.current.index, count) * pitch, behavior: 'instant' });
		};
		// The wheel stopped: report the number in the middle, then stand on the app's value in the middle lap (the
		// same number, or the old one if the app kept it). Unseen while the lap changes.
		const onScrollEnd = () => {
			const pitch = pitchOf(wheel);
			if (!pitch) return;
			const next = wrap(Math.round(wheel.scrollTop / pitch), count);
			// flushSync: the app's answer is committed before the wheel is placed, also when it keeps the old time.
			if (next !== latest.current.index) flushSync(() => latest.current.onSelect(next));
			standOnValue();
		};
		wheel.addEventListener('scrollend', onScrollEnd);
		// A wheel that is not shown has no height: it stands on its number when it gets one.
		const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(standOnValue);
		resize?.observe(wheel);
		return () => {
			wheel.removeEventListener('scrollend', onScrollEnd);
			resize?.disconnect();
		};
	}, [count]);

	// As kh.js: up brings the number above to the middle, down the one below.
	const onKeyDown = (event: KeyboardEvent) => {
		const move = { ArrowUp: -1, ArrowDown: 1 }[event.key];
		if (!move) return;
		event.preventDefault();
		onSelect(wrap(index + move, count));
	};

	const value = values[index] ?? 0;
	const laps = lapsFor(count);
	return (
		<div
			ref={ref}
			className="kh-time-picker__wheel"
			role="spinbutton"
			tabIndex={0}
			aria-label={label}
			aria-valuemin={values[0]}
			aria-valuemax={values[count - 1]}
			aria-valuenow={value}
			aria-valuetext={String(value).padStart(2, '0')}
			onKeyDown={onKeyDown}
		>
			{Array.from({ length: laps * count }, (_, position) => (
				// A press on a number above or below brings it to the middle.
				<div
					key={position}
					className="kh-time-picker__item"
					aria-hidden="true"
					onClick={() => onSelect(position % count)}
				>
					{String(values[position % count]).padStart(2, '0')}
				</div>
			))}
		</div>
	);
}

const pitchOf = (wheel: HTMLElement | null) =>
	(wheel?.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0;
