import { TreeNode } from "@/shared/type";

type RenderTreeProps = {
    node: TreeNode;
    toggleExpand: (name: string) => void;
    selectFile: (node: TreeNode) => void;
};

export const renderTree = ({ node, toggleExpand, selectFile }: RenderTreeProps) => {
    if (node.type === "folder") {
        return (
            <div key={node.name} className="ml-4 folder">
                {/* Folder name */}
                <div
                    onClick={() => toggleExpand(node.name)}
                    className="cursor-pointer font-semibold flex items-center space-x-2 hover:text-blue-600"
                >
                    <span>{node.name}</span>
                    <span>{node.isExpanded ? "-" : "+"}</span>
                </div>
                {/* Render children recursively if expanded */}
                {node.isExpanded && node.children && (
                    <div className="children">
                        {node.children.map((child) =>
                            renderTree({
                                node: child,
                                toggleExpand,
                                selectFile,
                            })
                        )}
                    </div>
                )}
            </div>
        );
    } else if (node.type === "file") {
        return (
            <div
                key={node.name}
                onClick={() => selectFile(node)}
                className="ml-6 cursor-pointer file text-gray-700 hover:text-blue-600"
            >
                {node.name}
            </div>
        );
    }
};
