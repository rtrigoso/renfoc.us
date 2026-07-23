type HastNode = {
    type: string;
    tagName?: string;
    children?: HastNode[];
};

function unwrapImageParagraphs(node: HastNode): void {
    if (!node.children) return;

    node.children = node.children.flatMap((child) => {
        const onlyChild = child.children?.length === 1 ? child.children[0] : undefined;

        if (child.type === 'element' && child.tagName === 'p' && onlyChild?.type === 'element' && onlyChild.tagName === 'img') {
            return [onlyChild];
        }

        unwrapImageParagraphs(child);
        return [child];
    });
}

/**
 * Markdown always wraps a standalone image in a <p>, but our img component
 * renders a <figure>, which isn't valid inside <p>. This lifts solo images
 * out of their paragraph before MDX compiles the tree to JSX.
 */
export function rehypeUnwrapImages() {
    return (tree: HastNode) => {
        unwrapImageParagraphs(tree);
    };
}
