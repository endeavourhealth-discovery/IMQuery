export interface TreeNode {
    key: string;
    label: string;
    data: string;
    typeIcon: string;
    color: string;
    leaf: boolean;
    children: Array<TreeNode>;
    loading: boolean;
};
