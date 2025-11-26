import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { SignalLogEvent, RiskScore } from '../types';
import { signalEventLabels, getRiskScoreColor } from '../utils/riskUtils';
import './SignalLogGraph.css';

interface SignalLogGraphProps {
  events: SignalLogEvent[];
  width?: number;
  height?: number;
}

const riskScoreToNumber = (score: RiskScore): number => {
  const values: Record<RiskScore, number> = {
    green: 1,
    amber: 2,
    red: 3,
  };
  return values[score];
};

const SignalLogGraph = ({ events, width = 600, height = 300 }: SignalLogGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !events.length) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Sort events by date
    const sortedEvents = [...events].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Parse dates
    const parseDate = d3.timeParse('%Y-%m-%d');
    const eventData = sortedEvents.map(e => ({
      ...e,
      parsedDate: parseDate(e.date) as Date,
      riskValue: riskScoreToNumber(e.riskScoreAfter),
    }));

    // X scale - time
    const xScale = d3.scaleTime()
      .domain(d3.extent(eventData, d => d.parsedDate) as [Date, Date])
      .range([0, innerWidth])
      .nice();

    // Y scale - risk level (1-3)
    const yScale = d3.scaleLinear()
      .domain([0.5, 3.5])
      .range([innerHeight, 0]);

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add background zones for risk levels
    const riskZones = [
      { start: 0.5, end: 1.5, color: getRiskScoreColor('green'), label: 'Low Risk' },
      { start: 1.5, end: 2.5, color: getRiskScoreColor('amber'), label: 'Medium Risk' },
      { start: 2.5, end: 3.5, color: getRiskScoreColor('red'), label: 'High Risk' },
    ];

    riskZones.forEach(zone => {
      g.append('rect')
        .attr('x', 0)
        .attr('y', yScale(zone.end))
        .attr('width', innerWidth)
        .attr('height', yScale(zone.start) - yScale(zone.end))
        .attr('fill', zone.color)
        .attr('opacity', 0.15);
    });

    // Add X axis
    const xAxis = d3.axisBottom(xScale)
      .ticks(6)
      .tickFormat(d3.timeFormat('%b %Y') as (domainValue: Date | d3.NumberValue, index: number) => string);

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#a0aec0')
      .attr('font-size', '10px');

    // Add Y axis
    const yAxis = d3.axisLeft(yScale)
      .tickValues([1, 2, 3])
      .tickFormat(d => {
        const labels: Record<number, string> = { 1: 'Low', 2: 'Medium', 3: 'High' };
        return labels[d as number] || '';
      });

    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', '#a0aec0')
      .attr('font-size', '11px');

    // Style axis lines
    g.selectAll('.x-axis line, .y-axis line, .x-axis path, .y-axis path')
      .attr('stroke', '#4a5568');

    // Create line generator
    const line = d3.line<typeof eventData[0]>()
      .x(d => xScale(d.parsedDate))
      .y(d => yScale(d.riskValue))
      .curve(d3.curveStepAfter);

    // Add line path
    g.append('path')
      .datum(eventData)
      .attr('fill', 'none')
      .attr('stroke', '#667eea')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add event points - remove any existing tooltip first
    d3.select('.signal-tooltip').remove();
    
    const tooltip = d3.select('body').append('div')
      .attr('class', 'signal-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', '#1a1a2e')
      .style('border', '1px solid #4a5568')
      .style('border-radius', '8px')
      .style('padding', '10px')
      .style('color', '#e2e8f0')
      .style('font-size', '12px')
      .style('max-width', '250px')
      .style('z-index', '9999')
      .style('pointer-events', 'none');

    g.selectAll('.event-point')
      .data(eventData)
      .enter()
      .append('circle')
      .attr('class', 'event-point')
      .attr('cx', d => xScale(d.parsedDate))
      .attr('cy', d => yScale(d.riskValue))
      .attr('r', 8)
      .attr('fill', d => getRiskScoreColor(d.riskScoreAfter))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(_event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 12);
        
        const eventLabel = signalEventLabels[d.eventType];
        const formattedDate = d3.timeFormat('%d %b %Y')(d.parsedDate);
        const impactText = d.riskScoreImpact > 0 
          ? `+${d.riskScoreImpact} ⬆️` 
          : d.riskScoreImpact < 0 
            ? `${d.riskScoreImpact} ⬇️` 
            : 'No change';
        
        tooltip
          .style('visibility', 'visible')
          .html(`
            <div style="font-weight: 600; margin-bottom: 5px;">
              ${eventLabel.icon} ${eventLabel.label}
            </div>
            <div style="color: #a0aec0; margin-bottom: 5px;">${formattedDate}</div>
            <div style="margin-bottom: 5px;">${d.description}</div>
            <div style="color: ${getRiskScoreColor(d.riskScoreAfter)};">
              Risk Impact: ${impactText}
            </div>
          `);
      })
      .on('mousemove', function(event) {
        tooltip
          .style('top', (event.pageY - 10) + 'px')
          .style('left', (event.pageX + 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 8);
        tooltip.style('visibility', 'hidden');
      });

    // Add event icons
    g.selectAll('.event-icon')
      .data(eventData)
      .enter()
      .append('text')
      .attr('class', 'event-icon')
      .attr('x', d => xScale(d.parsedDate))
      .attr('y', d => yScale(d.riskValue) - 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .text(d => signalEventLabels[d.eventType].icon);

    // Cleanup tooltip on unmount
    return () => {
      tooltip.remove();
    };
  }, [events, width, height]);

  if (!events.length) {
    return (
      <div className="no-data">
        <span>📊</span>
        <p>No signal log events recorded</p>
      </div>
    );
  }

  return (
    <div className="signal-log-graph-container">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="signal-log-graph"
      />
      <div className="graph-legend-horizontal">
        <div className="legend-item">
          <span className="legend-color" style={{ background: getRiskScoreColor('green') }} />
          <span>Low Risk</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: getRiskScoreColor('amber') }} />
          <span>Medium Risk</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: getRiskScoreColor('red') }} />
          <span>High Risk</span>
        </div>
      </div>
    </div>
  );
};

export default SignalLogGraph;
