declare module 'react-native-chart-kit' {
	import { ViewStyle } from 'react-native';

	interface ChartConfig {
		backgroundColor?: string;
		backgroundGradientFrom?: string;
		backgroundGradientTo?: string;
		decimalPlaces?: number;
		color?: (opacity?: number) => string;
		labelColor?: (opacity?: number) => string;
		style?: ViewStyle;
		propsForDots?: {
			r?: string;
			strokeWidth?: string;
			stroke?: string;
		};
		barPercentage?: number;
		propsForLabels?: {
			fontSize?: number;
		};
	}

	interface ChartData {
		labels: string[];
		datasets: Array<{
			data: number[];
		}>;
	}

	interface BaseChartProps {
		width: number;
		height: number;
		chartConfig: ChartConfig;
		style?: ViewStyle;
	}

	interface LineChartProps extends BaseChartProps {
		data: ChartData;
		bezier?: boolean;
		yAxisLabel?: string;
		yAxisSuffix?: string;
		withInnerLines?: boolean;
		withOuterLines?: boolean;
		withDots?: boolean;
		withShadow?: boolean;
	}

	interface BarChartProps extends BaseChartProps {
		data: ChartData;
		showValuesOnTopOfBars?: boolean;
		withInnerLines?: boolean;
	}

	export class LineChart extends React.Component<LineChartProps> {}
	export class BarChart extends React.Component<BarChartProps> {}
}