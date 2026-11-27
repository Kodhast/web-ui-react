import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button as AriaButton, DropIndicator, GridList, GridListItem, useDragAndDrop } from 'react-aria-components';
/** The drag data's type for the row's id, so that the preview finds the row. */
const ID_TYPE = 'application/x-kh-reorder-id';
/**
 * Moves `moved` to before or after `target`, keeping their order among themselves. An id not in the list, or a
 * target that is itself moved, leaves the order as it is.
 */
export function reorder(ids, moved, target, position) {
    const movedSet = new Set([...moved].map(String));
    if (movedSet.has(String(target)) || !ids.includes(String(target)))
        return [...ids];
    const rest = ids.filter((id) => !movedSet.has(id));
    const block = ids.filter((id) => movedSet.has(id));
    const at = rest.indexOf(String(target)) + (position === 'after' ? 1 : 0);
    return [...rest.slice(0, at), ...block, ...rest.slice(at)];
}
/**
 * web-ui's `kh-reorder` (only on the web): a list of `kh-row` with a handle last in each row, reordered by
 * dragging (or with the keyboard from the handle). React Aria's GridList owns the dragging and sets
 * `data-dragging` and `data-drop-target`, which web-ui's CSS reads. The app owns the order.
 */
export function ReorderList({ items, onReorder, onAction, handleLabel = (item) => `Flytta ${item.textValue}`, 'aria-label': ariaLabel }) {
    const byId = new Map(items.map((item) => [item.id, item]));
    const { dragAndDropHooks } = useDragAndDrop({
        getItems: (keys) => [...keys].map((key) => ({
            'text/plain': byId.get(String(key))?.textValue ?? '',
            [ID_TYPE]: String(key)
        })),
        onReorder: (event) => {
            if (event.target.dropPosition === 'on')
                return;
            onReorder(reorder(items.map((item) => item.id), event.keys, event.target.key, event.target.dropPosition));
        },
        renderDropIndicator: (target) => (_jsx(DropIndicator, { target: target, className: "kh-reorder__indicator" })),
        renderDragPreview: (dragged) => {
            const item = byId.get(dragged[0]?.[ID_TYPE] ?? '');
            return (_jsx("div", { className: "kh-row kh-reorder__preview", children: _jsx(Text, { item: item }) }));
        }
    });
    return (_jsx(GridList, { className: "kh-reorder", "aria-label": ariaLabel, items: items, dragAndDropHooks: dragAndDropHooks, onAction: onAction && ((key) => onAction(String(key))), children: (item) => (_jsxs(GridListItem, { id: item.id, textValue: item.textValue, className: "kh-row", children: [_jsx(Text, { item: item }), _jsx("span", { className: "kh-row__trailing", children: _jsx(AriaButton, { slot: "drag", className: "kh-icon-btn kh-reorder__handle", "aria-label": handleLabel(item), children: _jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: _jsx("path", { d: "M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" }) }) }) })] })) }));
}
function Text({ item }) {
    return (_jsxs("span", { className: "kh-row__text", children: [_jsx("span", { className: "kh-row__title", children: item?.title }), item?.subtitle !== undefined && _jsx("span", { className: "kh-row__subtitle", children: item.subtitle })] }));
}
