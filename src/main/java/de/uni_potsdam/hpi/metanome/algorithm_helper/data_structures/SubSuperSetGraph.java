package de.uni_potsdam.hpi.metanome.algorithm_helper.data_structures;

import it.unimi.dsi.fastutil.ints.Int2ObjectMap;
import it.unimi.dsi.fastutil.ints.Int2ObjectOpenHashMap;

import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

/**
 * A graph that allows efficient lookup of all subsets and supersets in the graph for a given ColumnCombinationBitset.
 * TODO describe minimality
 *
 * @author Jens Hildebrandt
 * @author Jakob Zwiener
 */
public class SubSuperSetGraph {

    protected Int2ObjectMap<SubSuperSetGraph> subGraphs = new Int2ObjectOpenHashMap<>();

    /**
     * Adds a column combination to the graph. Returns the graph after adding.
     *
     * @param columnCombination a column combination to add
     */
    public SubSuperSetGraph add(ColumnCombinationBitset columnCombination) {
        SubSuperSetGraph subGraph = this;

        for (int setColumnIndex : columnCombination.getSetBits()) {
            subGraph = subGraph.lazySubGraphGeneration(setColumnIndex);
        }

        return this;
    }

    /**
     * Looks for the subgraph or builds and adds a new one.
     *
     * @param setColumnIndex the column index to perform the lookup on
     * @return the subgraph behind the column index
     */
    protected SubSuperSetGraph lazySubGraphGeneration(int setColumnIndex) {
        SubSuperSetGraph subGraph = subGraphs.get(setColumnIndex);

        if (subGraph == null) {
            subGraph = new SubSuperSetGraph();
            subGraphs.put(setColumnIndex, subGraph);
        }

        return subGraph;
    }

    /**
     * Returns all Subsets of the given ColumnCombination that are in the graph.
     *
     * @param columnCombinationToQuery given superset to search for subsets
     * @return a list containing all found subsets
     */
    public List<ColumnCombinationBitset> getExistingSubsets(ColumnCombinationBitset columnCombinationToQuery) {
        List<ColumnCombinationBitset> subsets = new LinkedList<>();

        // Create task queue and initial task.
        Queue<SubSetFindTask> openTasks = new LinkedList<>();
        openTasks.add(new SubSetFindTask(this, columnCombinationToQuery, 0, new ColumnCombinationBitset()));

        while (!openTasks.isEmpty()) {
            SubSetFindTask currentTask = openTasks.remove();
            // If the current subgraph is empty a subset has been found
            if (currentTask.subGraph.isEmpty()) {
                subsets.add(new ColumnCombinationBitset(currentTask.path));
                continue;
            }

            // Iterate over the remaining column indices
            for (int i = currentTask.numberOfCheckedColumns; i < columnCombinationToQuery.size(); i++) {
                int currentColumnIndex = columnCombinationToQuery.getSetBits().get(i);
                // Get the subgraph behind the current index
                SubSuperSetGraph subGraph =
                        currentTask.subGraph.subGraphs.get(currentColumnIndex);
                // column index is not set on any set --> check next column index
                if (subGraph != null) {
                    // Add the current column index to the path
                    ColumnCombinationBitset path =
                            new ColumnCombinationBitset(currentTask.path)
                                    .addColumn(currentColumnIndex);

                    openTasks.add(new SubSetFindTask(subGraph, columnCombinationToQuery, i + 1, path));
                }
            }
        }

        return subsets;
    }

    /**
     * @return whether the graph is empty
     */
    public boolean isEmpty() {
        return subGraphs.isEmpty();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        SubSuperSetGraph that = (SubSuperSetGraph) o;

        if (subGraphs != null ? !subGraphs.equals(that.subGraphs) : that.subGraphs != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return subGraphs != null ? subGraphs.hashCode() : 0;
    }
}

class SubSetFindTask {

    public SubSuperSetGraph subGraph;
    public ColumnCombinationBitset columnCombinationToQuery;
    public int numberOfCheckedColumns;
    public ColumnCombinationBitset path;

    public SubSetFindTask(
            SubSuperSetGraph subGraph,
            ColumnCombinationBitset columnCombinationToQuery,
            int numberOfCheckedColumns,
            ColumnCombinationBitset path) {
        this.subGraph = subGraph;
        this.columnCombinationToQuery = columnCombinationToQuery;
        this.numberOfCheckedColumns = numberOfCheckedColumns;
        this.path = path;
    }
}
