import React from "react";
import Cards from "./_indexPageComponents/Cards";
import Chart from "./_indexPageComponents/Chart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Dashboard",
};

const sampleData = [
  { date: "2023-01-01", views: 100 },
  { date: "2023-01-02", views: 150 },
  { date: "2023-01-03", views: 200 },
  { date: "2023-01-04", views: 180 },
  { date: "2023-01-05", views: 250 },
  { date: "2023-01-06", views: 300 },
  { date: "2023-01-07", views: 280 },
];

const page = () => {
  return (
    <div className="space-y-4">
      <Cards />
      <Chart data={sampleData} />
    </div>
  );
};

export default page;
