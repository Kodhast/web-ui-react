/**
 * Kodhast's two dots (BrandDots) as web-ui's `<kh-dots>`. The two `<i>` are rendered here, so the
 * dots look right without kh.js; kh.js, when an app loads it, finds them and adds nothing.
 */
export declare function Dots({ bouncing }: {
    bouncing?: boolean;
}): import("react").ReactElement<{
    bouncing: string | undefined;
    'aria-hidden': string;
}, string | import("react").JSXElementConstructor<any>>;
