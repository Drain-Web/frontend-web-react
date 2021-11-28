import React from "react";
import Table from "react-bootstrap/Table";

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

  return (
    <div className="border d-flex align-items-center justify-content-center">
      <Table responsive="md">
        <thead>
          <tr>
            <th>Model</th>
            {metrics.map((metric) => {
              return <th>{metric}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            return (
              <tr>
                {row.map((field) => {
                  return <td>{field}</td>;
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
