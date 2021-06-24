import React from "react";
import PropTypes from "prop-types";
import { Text, Colors} from "react-native-ui-lib";
import { AreaChart, Grid } from "react-native-svg-charts";
import {  useSelector } from 'react-redux';
import { selectChartData } from '../../redux/reducers/video';
import * as shape from "d3-shape";

function CalibrationChart(props) {
  const data = useSelector(selectChartData);

  if (!data) {
    return (<Text>Loading...</Text>)
  }

  return (
    <AreaChart
      style={{ height: 200 }}
      data={data[0].data}
      yAccessor={({item}) => item.y}
      xAccessor={({item}) => item.x}
      contentInset={{
        top: 0,
        bottom: 0,
        left: props.horizontalInset,
        right: props.horizontalInset,
      }}
      curve={shape.curveBasis}
      svg={{
        fill: Colors.primary + "80",
        stroke: Colors.primary,
      }}
    >
      <Grid />
    </AreaChart>
  );
}

CalibrationChart.propTypes = {
  margin: PropTypes.number.isRequired,
  horizontalInset: PropTypes.number.isRequired,
};

export default CalibrationChart;
