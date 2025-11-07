import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type TaskStatsChartProps = {
  total: number;
  active: number;
  completed: number;
};

export default function TaskStatsChart(props: TaskStatsChartProps) {
  const { total, active, completed } = props;

  if (!total) return null;

  const data = [
    { name: "Active", value: active },
    { name: "Completed", value: completed },
  ];

  const colors = ["#f97316", "#b83f45"];

  return (
    <div className="mx-auto mt-6 flex w-[90%] max-w-[550px] justify-center">
      <div className="flex w-full items-center justify-between rounded-[10px] border border-[#e5e5e5] bg-white/80 px-4 py-3 shadow-[0_4px_14px_rgba(0,0,0,0.06)] backdrop-blur-[4px]">
        <div className="flex flex-col gap-[2px]">
          <div className="text-[11px] uppercase tracking-[0.12em] text-[#9b9b9b]">
            Task statistics
          </div>
          <div className="text-[18px] font-[200] leading-[1.2] text-[#333333]">
            {completed} of {total} tasks completed
          </div>
          <div className="text-[12px] text-[#9b9b9b]">
            Active: {active} • Completed: {completed}
          </div>
        </div>
        <div className="h-[72px] w-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={20}
                outerRadius={32}
                paddingAngle={2}
                stroke="#f6f6f6"
                strokeWidth={1}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip
                cursor={false}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e5e5e5",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  fontSize: 11,
                  padding: "4px 8px",
                }}
                formatter={(value, name) => [`${value}`, String(name)]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
