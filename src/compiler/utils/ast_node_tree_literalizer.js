export function literalizeASTNodeTree(node, expression = false){

    let reversedNodeTree = [];

    var cnode = node.expression;

    if(!expression) cnode = node;

    while(cnode.property !== undefined && cnode.property.type == "Identifier"){
        reversedNodeTree.push(cnode.property);
        cnode = cnode.object;
        if(cnode.object.type !== "MemberExpression") break;
    }

    reversedNodeTree.push(cnode.property);
    reversedNodeTree.push(cnode.object);

    let nodeTree = [];

    reversedNodeTree.reverse().forEach((x) => nodeTree.push(x.name));

    console.log('Expression result: ', nodeTree);

    return nodeTree;
}