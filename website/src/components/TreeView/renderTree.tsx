import { TreeNode } from "@/shared/type";

type RenderTreeProps = {
  node: TreeNode;
  parentNode?: TreeNode | null;
  toggleExpand: (name: string) => void;
  selectFile: (node: TreeNode, parentNode?: TreeNode | null) => void;
  selectedFile: TreeNode | null;
  selectedParent: TreeNode | null;
};

export const renderTree = ({
  node,
  parentNode = null,
  toggleExpand,
  selectFile,
  selectedFile,
  selectedParent,
}: RenderTreeProps) => {
  // Determine if the current node should be highlighted
  const isSelected = selectedFile?.id === node.id;
  const isParentSelected =
    selectedParent?.id === node.id ||
    (selectedFile && selectedParent?.id === parentNode?.id);

  const nodeStyle = {
    color: isSelected ? "blue" : isParentSelected ? "green" : "black",
    fontWeight: isSelected || isParentSelected ? "bold" : "normal",
    cursor: "pointer",
  };

  if (node.type === "folder") {
    return (
      <div key={node.name + "-" + node.id} className="ml-4 folder">
        <div
          onClick={() => toggleExpand(node.name)}
          className="cursor-pointer font-semibold flex items-center space-x-2 hover:text-blue-600"
          style={nodeStyle}
        >
          <span>{node.name}</span>
          <span>{node.isExpanded ? "-" : "+"}</span>
        </div>
        {node.isExpanded && node.children && (
          <div className="children">
            {node.children.map((child) =>
              renderTree({
                node: child,
                parentNode: node,
                toggleExpand,
                selectFile,
                selectedFile,
                selectedParent,
              })
            )}
          </div>
        )}
      </div>
    );
  } else if (node.type === "file") {
    return (
      <div
        key={node.name + "-" + node.id}
        onClick={() => selectFile(node, parentNode)}
        className="ml-6 cursor-pointer file text-gray-700 hover:text-blue-600"
        style={nodeStyle}
      >
        - &nbsp;{node.name}
      </div>
    );
  }
};
