import "react-circular-progressbar/dist/styles.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartData,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type StatusData = {
  status: string;
  count: number;
  percentage: number;
}

type DailyAnalyticsProps = {
  data: {
    success: {
      count: number,
      percentage: number
    },
    failed: {
      count: number,
      percentage: number
    },
    pending: {
      count: number,
      percentage: number
    }
  }
}

export const DailyAnalytics = (props: DailyAnalyticsProps) => {

  const data: ChartData<"pie", number[], string> = {
    labels: ['Successful Transactions', 'Failed Transactions', 'Pending Transactions'],
    datasets: [
      {
        data: [props.data.success.percentage, props.data.pending.percentage, props.data.failed.percentage],
        backgroundColor: ['#6A22B2', '#ba83fd', '#e7d5ff'],
        hoverBackgroundColor: ['#6A22B2', '#ba83fd', '#e7d5ff'],
      },
    ],
  };

  // Options for customization
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
    }
  };

  const total = props.data.success.count + props.data.pending.count + props.data.failed.count

  return (
    <div className="flex flex-col gap-4 bg-white rounded-lg p-4">
      <div className="flex items-center">
        <p className="flex-1">
          Daily Analytics: <span className="font-bold ml-3">{total} Transactions</span>
        </p>
        {/* 
        <IconButton className="bg-primary">
          <ListFilterIcon />
        </IconButton> */}
      </div>

      <div className="mx-auto w-[300px] h-[300px]">
        <Pie data={data} options={options} />

      </div>

      <div className="flex flex-col items-end">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-4 aspect-square bg-[#6A22B2]" />
            <p>{props.data.success.percentage.toFixed(2)}% Successful Transactions</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 aspect-square bg-[#ba83fd]" />
            <p>{props.data.pending.percentage.toFixed(2)}% Pending Transactions</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 aspect-square bg-[#e7d5ff]" />
            <p>{props.data.failed.percentage.toFixed(2)}% Failed Transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
};
