import Chart from 'react-apexcharts';

const DonutChart = ({ percentage }: { percentage: string }) => {
  return (
    <Chart
      options={{
        chart: {
          id: 'network-security',
          toolbar: {
            show: false,
          },
          stackType: '100%',
        },
        legend: { show: false },
        dataLabels: { enabled: false },
        stroke: { width: 0 },
        colors: ['#8566F2', '#eeeeee'],
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: '75%',
              labels: {
                name: {
                  show: false,
                },
                show: true,
                total: {
                  show: true,
                  label: `${percentage}%`,
                  color: '#3c8fbe',
                  fontWeight: 'bold',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '28px',
                  showAlways: true,
                  formatter: () => `${percentage}%`,
                },
                value: {
                  show: true,
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#3c8fbe', // Blue for percentage
                  formatter: (val: string) => `${val}%`,
                },
              },
            },
          },
        },
        labels: ['confirmed', 'Active'],
      }}
      series={[Number(percentage), 100 - Number(percentage)]}
      type="donut"
      height={'100%'}
      width={'100%'}
    />
  );
};

export default DonutChart;
