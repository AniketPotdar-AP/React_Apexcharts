import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Chart from "react-apexcharts";

const App = () => {
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
    },
    title: {
      text: "Requests per Hotel",
      align: "center",
    },
    xaxis: {
      categories: [],
    },
    yaxis: {
      min: 0,
      max: 0,
      tickAmount: 0,
    },
  });

  const [chartSeries, setChartSeries] = useState([
    {
      name: "Requests",
      data: [],
    },
  ]);

  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    axios
      .get("https://checkinn.co/api/v1/int/requests")
      .then((response) => {
        const hotelNames = response.data.requests.map(
          (item) => item.hotel.name
        );

        const uniqueHotelNames = [...new Set(hotelNames)];
        const hotelCounts = uniqueHotelNames.map(
          (name) => hotelNames.filter((hotel) => hotel === name).length
        );

        const maxCount = Math.max(...hotelCounts);
        const maxYAxisValue = Math.ceil(maxCount / 2) * 2;

        setChartOptions((prevOptions) => ({
          ...prevOptions,
          xaxis: {
            categories: uniqueHotelNames,
          },
          yaxis: {
            ...prevOptions.yaxis,
            max: maxYAxisValue,
            tickAmount: Math.ceil(maxYAxisValue / 2),
          },
        }));

        setChartSeries(() => [
          {
            data: hotelCounts,
          },
        ]);

        setRequestCount(hotelNames.length);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="container">
      <Chart
        options={chartOptions}
        series={chartSeries}
        width={680}
        height={320}
      />
      <p className="info">
        <p className="request">Total requests: {requestCount}</p>
        List of <i>unique</i> department names across all Hotels: Housekeeping,
        Front Desk, Maintenance, Concierge, Spa, Fitness, Catering, Security,
        Recreation, Room Service, Water Sports, Guest Services
      </p>
    </div>
  );
};

export default App;
