import Node from '../module/node';
import Stack from '../module/stack';
import Queue from '../module/queue';

export const calculatePath = (map, startPos, targetPos, algorithm) => {
    let graph = createGraph(map.data, map.width, map.height);
    let startNode = getNodeById(graph, startPos);
    let targetNode = getNodeById(graph, targetPos);
    let path = [];
    let cameFrom = {};
    let current = startNode;

    if (current) {
        if (algorithm === 'depth') {
            let stack = new Stack();
            stack.push(startNode);
            cameFrom[startNode.id] = null;
            while (true) {
                current = stack.top();
                if (current !== undefined) {
                    path.push(current.id);
                    current.visited = true;
                    if (current.id === targetNode.id) {
                        break;
                    }
                    let unvisited = 0;
                    current.adj.forEach((id) => {
                        let node = getNodeById(graph, id);
                        if (!node.visited) {
                            if (cameFrom[id]) {
                            } else {
                                cameFrom[id] = current.id;
                            }
                            stack.push(node);
                            unvisited += 1;
                        }
                    });
                    if (unvisited === 0) {
                        stack.pop();
                    }
                } else {
                    break;
                }

            }
        } else if (algorithm === 'breadth') {
            let queue = new Queue([]);
            queue.enqueue(startNode);
            cameFrom[startNode.id] = null;
            while (true) {
                current = queue.dequeue();
                if (current !== undefined) {
                    current.visited = true;
                    path.push(current.id);
                    if (current.id === targetNode.id) {
                        break;
                    }
                    current.adj.forEach((id) => {
                        if (cameFrom[id]) {
                        } else {
                            cameFrom[id] = current.id;
                        }

                        let node = getNodeById(graph, id);
                        if (!node.visited) {
                            node.visited = true;
                            queue.enqueue(node);
                        }
                    });
                } else {
                    break;
                }
            }
        }

        let optimal = buildOptimal(cameFrom, targetPos, startPos);
        return [path, optimal];
    } else {
        alert('current is undefined');
    }
};

const createGraph = (map, width, height) => {
    let graph = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            
            let adj = [];

            if ((y - 1 > 0) && map[y - 1][x] === 0) {
                adj.push('' + x + ',' + (y - 1));
            }
            if ((y + 1 < map.length) && map[y + 1][x] === 0) {
                adj.push('' + x + ',' + (y + 1));
            }
            if ((x - 1 > 0) && map[y][x - 1] === 0) {
                adj.push('' + (x - 1) + ',' + y);
            }
            if ((x + 1 < map[y].length) && map[y][x + 1] === 0) {
                adj.push('' + (x + 1) + ',' + y);
            }

            graph.push(new Node('' + x + ',' + y, adj));
        }
    }

    return graph;
};

const getNodeById = (graph, nodeId) => {
    return graph.reduce((out, node) => {
        if (node.id === nodeId) {
            out = node;
        }
        return out;
    });
};

const buildOptimal = (cameFrom, targetPos, startPos) => {

    if (!cameFrom[targetPos]) {
        return null;
    }

    let current = targetPos;
    let path = [];

    if (cameFrom[startPos])
        cameFrom[startPos] = null;

    while (current) {
        path.unshift(current);
        current = cameFrom[current];
    }
    return path;
};