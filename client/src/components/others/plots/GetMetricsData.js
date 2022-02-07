import React, { useEffect, useState, useContext } from "react";
import useSWR from "swr";
import axios from "axios";

import varsStateLib from "../../contexts/varsStateLib";
import VarsState from "../../contexts/VarsState";

const GetMetricsData = () => {
  // Get global states and set local states
  const { varsState, setVarState } = useContext(VarsState);

  const [mounted, setMounted] = useState(false);

  const fetcher = (url) => axios.get(url).then((res) => res.data);

  let metrics = {};
  let urlMetrics;

  for (let key of Object.keys(
    varsState.domObjects.timeSeriesData.evaluationMetricsUrls
  )) {
    urlMetrics = varsState.domObjects.timeSeriesData.evaluationMetricsUrls[key];
    let { data: metricsData, error } = useSWR(
      mounted ? urlMetrics : null,
      fetcher
    );

    metrics[key] = metricsData;
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  varsStateLib.setTimeSeriesPlotModelEvaluationMetrics(metrics, varsState);

  return null;
};

export default GetMetricsData;
