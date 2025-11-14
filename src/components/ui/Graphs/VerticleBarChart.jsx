import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import TopBar from "../TopBar";

const chartSetting = {
  height: 250,
};

// Error boundary component for charts
class ChartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Chart error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className=" w-full border-2 mt-5  rounded-lg p-5">
          <TopBar title={this.props.title} />
          <p className="text-gray-500 text-center py-8">Chart failed to load. Please refresh the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function VertcleBarChart({ verTitle, dataset = [], series = [{ dataKey: "value", label: "Value" }] }) {
  // Safety check: don't render if dataset is empty or invalid
  if (!dataset || !Array.isArray(dataset) || dataset.length === 0) {
    return (
      <div className=" w-full border-2 mt-5  rounded-lg p-5">
        <TopBar title={verTitle} />
        <p className="text-gray-500 text-center py-8">No data available</p>
      </div>
    );
  }

  return (
    <ChartErrorBoundary title={verTitle}>
      <div className=" w-full border-2 mt-5  rounded-lg p-5">
        <TopBar title={verTitle} />
        <BarChart
          dataset={dataset}
          series={series}
          layout="vertical"
          grid={{ vertical: true }}
          xAxis={[{ id: "xAxis", dataKey: "vendorName", scaleType: "band" }]}
          yAxis={[{ id: "yAxis", scaleType: "linear" }]}
          {...chartSetting}
        slots={{
          bar: (props) => {
            const radius =20; 
            const { 
              x, 
              y, 
              width, 
              height, 
              ownerState,
              dataIndex,
              xOrigin,
              yOrigin,
              skipAnimation,
              ...restProps 
            } = props;

            const safeRadius = Math.min(radius, height / 2);

            const d = `
      M${x},${y + safeRadius}
      a${safeRadius},${safeRadius} 0 0 1 ${safeRadius},${-safeRadius}
      h${width - 2 * safeRadius}
      a${safeRadius},${safeRadius} 0 0 1 ${safeRadius},${safeRadius}
      v${height - safeRadius}
      h${-width}
      z
    `;

            return <path d={d} fill={ownerState.color} {...restProps} />;
          },
        }}
        />
      </div>
    </ChartErrorBoundary>
  );
}
