import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


export type DayData = {
  count: number;
  dayOfWeek: string;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type UserActivityBarGraphProps = {
  data: DayData[],
  total: number
}
export const UserActivityBarGraph = (props: UserActivityBarGraphProps) => {

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    }
  };
  const labels = props.data.map((item) => item.dayOfWeek);

  const data: ChartData<"bar", number[], string> = {
    labels,
    datasets: [
      {
        label: 'Number of transactions',
        data: props.data.map((item) => item.count),
        backgroundColor: '#6A22B2',
        borderWidth: 0
      }
    ],
  };
  return (
    <div className="flex flex-col gap-4 bg-white rounded-lg p-4">
      <div className="flex items-center">
        <div className='flex flex-col'>
          <p className="flex-1">
            Weekly Analytics
          </p>
          <p className="block font-bold text-2xl">{props.total}<span className='text-red-500 text-sm ml-2'>-20%</span></p>
        </div>

        {/* <IconButton className="bg-primary">
          <ListFilterIcon />
        </IconButton> */}
      </div>

      <div>
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};
