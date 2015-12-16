# Loop Deformations

*A Routine for Random Generation of Closed Loops in the Disk.*

## The Problem

Generally, the problem here is to find non-self-intersecting embeddings of loops onto a disk, and visualize them. Additionally, we'd like these loops to be as visually intricate as possible. Ultimately, these randomly generated loops will be used as surface shapes for a line of  medatative toys, and will be routed into plywood. This specific code base limits itself to generating the geometries, and visualizing them as SVG graphics. It also provides some tools for visualizing how the generation algorithm works.

## The Solution

Imagine you have a disk. There are a lot of ways to trace a non-self-intersecting loop across its surface. Let's start by discretizing the problem. Divide the disk into cells using N radial divisions and M concentric divisions. At the center of each cell, place a vertex. The resulting NM points will be the vertices that our loop can coil around.

Now that you have a finite grid to work with, do the following:

1. Draw a concentric circle in the disk, by connecting each co-concentric vertex by an edge. 

2. Define the neighbors of each edge you've just drawn as the hypothetical edge one step further towards the rim of the disk, and one step further towards its center, according to the concentric divisions. *(There aren't any radial edges yet, but if there were, their neighbors would be the edges one step further around the disk, and one step prior around the disk, according to the radial divisions.)*

3. Now define a **Free Edge** as an edge that has at least one neighbor that does not intersect any of the edges that you've drawn. (Two edges intersect if they share a vertex).

4. Pick a Free Edge at random (or use some heuristic, if you like). Deform this edge into one of neighbors, F, by deleting the original edge E you'd selected, and creating 3 edges, one from the start of E to the start of F, then F, then one from the end of F to the end of E. Clearly, the loop is still continuous after this pulling.

5. Repeat 3 and 4 until there are no more Free Edges anywhere in the loop.

The character of the resulting loop varies with the initial concentric circle that was drawn and with the selection process for edges, but especially for the initial grid chosen on the disk.

## The Visualization

The visualization of the algorithm is simple – it just shows the algorithm at each step, starting from the arbitarary concentric circle chosen. It visualizes fixed edges as light blue, free edges as dark blue, and the neighbors of free edges as orange. 

To run the system, run ```npm install; npm run build``` and point your browser at http://localhost:8080. Make sure npm's ```http-server``` is installed, otherwise serve the ```output``` directory using the server of your choice.

You can modify the initial grid by changing the parameters in ```main.js```. Be aware that the complexity of this routine is linear in the size of the grid you specify.