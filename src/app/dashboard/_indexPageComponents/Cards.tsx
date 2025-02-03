import React from "react";
import { StatisticsCard } from "./StaticsCard";

const Cards = () => {
  return (
    <div className="w-full h-fit grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatisticsCard title="Total Users" count={1234} change={5.2} />
      <StatisticsCard title="Active Users" count={987} change={-2.1} />
      <StatisticsCard title="Deleted Users" count={987} change={-2.1} />
      <StatisticsCard title="New Users" count={56} change={12.5} />
    </div>
  );
};

export default Cards;
