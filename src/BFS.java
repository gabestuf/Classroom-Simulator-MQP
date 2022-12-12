import java.util.*;

public class BFS {
    // This method takes in a 2d array of strings, a starting location, and an
    // ending location, and uses breadth first search to find the shortest path
    // between the two points. The path can only follow nodes marked "f" and
    // must avoid other nodes. It returns a list of coordinates which is the
    // path from start location to end location.
    public static List<int[]> shortestPath(char[][] grid, int[] start, int[] end) {
        // We will use a queue to keep track of which nodes we need to visit next
        // in our breadth first search.
        Queue<int[]> queue = new LinkedList<>();

        // We will also use a set to keep track of which nodes we have already
        // visited, so we don't visit them again and get stuck in a loop.
        Set<int[]> visited = new HashSet<>();

        // We will use a map to keep track of the previous node for each node
        // we visit, so we can reconstruct the path when we are finished.
        Map<int[], int[]> prev = new HashMap<>();

        // Add the starting node to the queue and mark it as visited
        queue.add(start);
        visited.add(start);

        // Perform the search
        while (!queue.isEmpty()) {
            // Get the next node to visit from the queue
            int[] node = queue.remove();

            // Check if we have reached the end node. If so, we can reconstruct
            // the path and return it.
            if (node[0] == end[0] && node[1] == end[1]) {
                List<int[]> path = new ArrayList<>();
                while (node != null) {
                    path.add(0, node);
                    node = prev.get(node);
                }
                return path;
            }

            // Otherwise, we need to visit the node's neighbors.
            for (int i = -1; i <= 1; i++) {
                for (int j = -1; j <= 1; j++) {
                    // We only want to visit the neighbors that are directly
                    // adjacent to the current node (not diagonally)
                    if (Math.abs(i) == Math.abs(j)) {
                        continue;
                    }

                    // Calculate the coordinates of the neighbor
                    int x = node[0] + i;
                    int y = node[1] + j;

                    // Make sure the coordinates are within the bounds of the grid
                    if (x < 0 || x >= grid.length || y < 0 || y >= grid[0].length) {
                        continue;
                    }

                    // Make sure we are only visiting nodes marked "f"
                    if (Character.compare(grid[x][y], 'f') == 0) {
                        continue;
                    }

                    // Create an array to represent the coordinates of the neighbor
                    int[] neighbor = {x, y};

                    // Make sure we haven't already visited this node
                    if (visited.contains(neighbor)) {
                        continue;
                    }

                    // Add the neighbor to the queue, mark it as visited, and
                    // record the current node
                    queue.add(neighbor);
                    visited.add(neighbor);
                    prev.put(neighbor, node);
                }
            }
        }

        // If we reach this point, it means we were unable to find a path from
        // the start node to the end node, so we return an empty list
        return Collections.emptyList();
    }

}