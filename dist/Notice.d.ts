import type { ReactNode } from 'react';
import { type PressableProps } from './Surface.js';
export interface NoticeProps extends PressableProps {
    title: ReactNode;
    detail?: ReactNode;
    /** An `<svg>` at the start. */
    icon?: ReactNode;
    /** The app's tone class (e.g. `ton-varning`). */
    tone?: string;
    /** A button under the detail, as in web-ui's gallery. Not with `href` or `onPress`: a button in a link is invalid. */
    action?: ReactNode;
}
/**
 * web-ui's `.kh-notice` (android-ui's NoticeBanner): a line at the top of a view that says something about the
 * whole view. As a link or button it gets the chevron.
 */
export declare function Notice({ title, detail, icon, tone, action, ...press }: NoticeProps): import("react").JSX.Element;
