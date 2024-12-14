import { TreeNode } from '@/shared/type';
import React, { useState } from 'react'
import { renderTree } from './renderTree';

const TreeView = () => {
    const treeData: TreeNode = {
        name: "Root",
        type: "folder",
        isExpanded: true,
        children: [
            {
                name: "Section 1",
                type: "folder",
                isExpanded: false,
                children: [
                    { name: "Page 1.1", type: "file", content: "..." },
                    { name: "Page 1.2", type: "file", content: "..." },
                ],
            },
            {
                name: "Section 2",
                type: "folder",
                isExpanded: true,
                children: [
                    { name: "Page 2.1", type: "file", content: "..." },
                    { name: "Page 2.2", type: "file", content: "..." },
                ],
            },
        ],
    };

    const [tree, setTree] = useState<TreeNode>(treeData);

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

    const selectFile = (node: TreeNode) => {
        console.log("Selected File:", node);
    };

    return (
        <div className="file-tree">
            {renderTree({ node: tree, toggleExpand, selectFile })}
        </div>
    );
}

export default TreeView