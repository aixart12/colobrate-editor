export type TreeNode = {
    name: string;
    type: "folder" | "file";
    isExpanded?: boolean; // Optional, only for folders
    children?: TreeNode[]; // Optional, only for folders
    content?: string; // Optional, only for files
};
