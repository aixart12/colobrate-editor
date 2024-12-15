import { TreeNode } from "@/shared/type";
import React, {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useState,
} from "react";
import { renderTree } from "./renderTree";
import { useRouter } from "next/router";
const TreeView: FunctionComponent<{
  treeViewData: TreeNode;
  setSelectedContentId: Dispatch<SetStateAction<number | null>>;
}> = ({ treeViewData, setSelectedContentId }) => {
  console.log("data of the tree view", treeViewData);
  const [tree, setTree] = useState<TreeNode>(treeViewData);
  const [selectedFile, setSelectedFile] = useState<TreeNode | null>(null);
  const [selectedParent, setSelectedParent] = useState<TreeNode | null>(null);
  const navigate = useRouter();

  const toggleExpand = (name: string) => {
    const toggleNode = (node: TreeNode): TreeNode => {
      if (node.name === name && node.type === "folder") {
        return { ...node, isExpanded: !node.isExpanded };
      }
      if (node.children) {
        return { ...node, children: node.children.map(toggleNode) };
      }
      return node;
    };
    setTree(toggleNode(tree));
  };

  const selectFile = (node: TreeNode, parentNode?: TreeNode | null) => {
    if (node.type === "file") {
      setSelectedFile(node);
      setSelectedParent(parentNode || null);
      setSelectedParent(parentNode || null);
      setSelectedContentId(parentNode?.id || null);

      console.log("selected node", node);
      console.log("selected parent node", parentNode);

      // Change route
      const parentName = parentNode?.name || "root";
      const parentId = parentNode?.id || "0";
      navigate.push(`/edit/${parentName}/${parentId}`);
    }
  };

  const renderTreeWithState = (
    node: TreeNode,
    parentNode: TreeNode | null = null
  ) => {
    return renderTree({
      node,
      parentNode,
      toggleExpand,
      selectFile,
      selectedFile,
      selectedParent,
    });
  };

  return <div className="file-tree">{renderTreeWithState(tree, null)}</div>;
};

export default TreeView;
