import java.util.*;

public class BFS {
    // This method takes in a 2d array of strings, a starting location, and an
    // ending location, and uses breadth first search to find the shortest path
    // between the two points. The path can only follow nodes marked "x" and
    // must avoid other nodes. It returns a list of coordinates which is the
    // path from start location to end location.
    public static List<int[]> shortestPath(String[][] grid, int[] start, int[] end) {
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

                    // Make sure we are only visiting nodes marked "x"
                    if (!grid[x][y].equals("x")) {
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

    public static void main(String[] args) {
        // Let's test our shortestPath method with the following grid:
        //
        //  x - x x - -
        //  x x - - x x
        //  - x - - x -
        //  x x - x - -
        //  - - x x - x
        //  x x - x - x
        //
        // And the start and end locations: (0, 0) and (5, 5)
        String[][] grid = {
                {"x", "-", "x", "x", "-", "-"},
                {"x", "x", "-", "-", "x", "x"},
                {"-", "x", "-", "-", "x", "-"},
                {"x", "x", "-", "x", "-", "-"},
                {"-", "-", "x", "x", "-", "x"},
                {"x", "x", "-", "x", "-", "x"},
        };
        int[] start = {0, 0};
        int[] end = {3, 1};

        // The expected output is the list: [(0, 0), (1, 0), (2, 0), (3, 1), (4, 2), (5, 3), (5, 4), (5, 5)]
        List<int[]> expected = Arrays.asList(
                new int[]{0, 0},
                new int[]{1, 0},
                new int[]{1, 1},
                new int[]{2, 1},
                new int[]{3, 1}
        );

        List<int[]> result = shortestPath(grid, start, end);

        // Check if the result matches the expected output
        for (int[] coords : result) {
            for (int i : coords) {
                System.out.println(i);
            }
        }

        if (result.equals(expected)) {
            System.out.println("The shortest path was found successfully!");
        } else {
            System.out.println("Error: the shortest path was not found correctly.");
            System.out.println("Expected: " + expected);
            System.out.println("Result: " + result);
        }
    }
}