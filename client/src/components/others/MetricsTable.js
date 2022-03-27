import React from "react";
import Table from "react-bootstrap/Table";

/*
 * timeSeriesMetrics: Dictionary with format: {'evaluations': {'metric1': {'simulationModuleInstanceId1': value, ...}}}
 *     as returned by v1dw/timeseries_calculator?filter={...}&calcs={...},{...}&simParameterId={...}&obsParameterId={...}&simModuleInstanceIds={...},{...}&obsModuleInstanceId={...}&locationId={...}
 */

const MetricsTable = ({ timeSeriesMetrics }) => {
  const evaluations = timeSeriesMetrics["evaluations"];
  const metrics = Object.entries(evaluations).map((entry) => entry[0]);
  const models = Object.entries(evaluations)
    .map((val) => Object.entries(val[1]))[0]
    .map((model) => model[0]);
  const rows = [];

  for (let model of models) {
    let row = [model];

    for (let metric of metrics) {
      row.push(evaluations[metric][model]);
    }

    rows.push(row);
  }

  /* ** MAIN RENDER ************************************************************************** */

  return (
    <div className="d-flex align-items-center justify-content-center metricTables">
      <Table responsive="md">
        <thead>
          <tr>
            <th>Model</th>
            {metrics.map((metric, metricIndex) => {
              return <th key={`m${metricIndex}`}>{metric}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            return (
              <tr key={`r${rowIndex}`}>
                {row.map((field, colIndex) => {
                  const tdKey = `r${rowIndex}c${colIndex}`;
                  return <td key={tdKey}>{field}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default MetricsTable;
