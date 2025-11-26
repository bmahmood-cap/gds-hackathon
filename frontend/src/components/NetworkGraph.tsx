import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { NetworkData } from '../types';
import './NetworkGraph.css';

interface NetworkGraphProps {
  data: NetworkData;
  width?: number;
  height?: number;
}

interface SimNode extends d3.SimulationNodeDatum {
  id: number;
  label: string;
  group: string;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  label: string;
}

const NetworkGraph = ({ data, width = 800, height = 600 }: NetworkGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);

    // Color scale for departments/groups
    const colorScale = d3.scaleOrdinal<string>()
      .domain([...new Set(data.nodes.map(n => n.group))])
      .range(['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']);

    // Create simulation
    const nodes: SimNode[] = data.nodes.map(n => ({ ...n }));
    const links: SimLink[] = data.links.map(l => ({
      source: l.source,
      target: l.target,
      label: l.label,
    }));

    const simulation = d3.forceSimulation<SimNode>(nodes)
      .force('link', d3.forceLink<SimNode, SimLink>(links)
        .id(d => d.id)
        .distance(120))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    // Add container group for zooming
    const g = svg.append('g');

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', '#4a5568')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6);

    // Create link labels
    const linkLabel = g.append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(links)
      .enter()
      .append('text')
      .attr('class', 'link-label')
      .attr('font-size', '10px')
      .attr('fill', '#a0aec0')
      .text(d => d.label);

    // Create nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag<SVGGElement, SimNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add circles to nodes
    node.append('circle')
      .attr('r', 25)
      .attr('fill', d => colorScale(d.group))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer');

    // Add labels to nodes
    node.append('text')
      .attr('dy', 40)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', '#e2e8f0')
      .text(d => d.label);

    // Add group labels to nodes
    node.append('text')
      .attr('dy', 55)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#a0aec0')
      .text(d => d.group);

    // Simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as SimNode).x!)
        .attr('y1', d => (d.source as SimNode).y!)
        .attr('x2', d => (d.target as SimNode).x!)
        .attr('y2', d => (d.target as SimNode).y!);

      linkLabel
        .attr('x', d => ((d.source as SimNode).x! + (d.target as SimNode).x!) / 2)
        .attr('y', d => ((d.source as SimNode).y! + (d.target as SimNode).y!) / 2);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, SimNode, SimNode>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, SimNode, SimNode>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, SimNode, SimNode>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [data, width, height]);

  return (
    <div className="network-graph-container">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="network-graph"
      />
      <div className="graph-legend">
        <h4>Departments</h4>
        {[...new Set(data.nodes.map(n => n.group))].map((group, i) => {
          const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
          return (
            <div key={group} className="legend-item">
              <span className="legend-color" style={{ background: colors[i % colors.length] }} />
              <span>{group}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NetworkGraph;
