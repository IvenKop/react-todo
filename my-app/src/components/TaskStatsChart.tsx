import { PieChart, Pie, Cell, Tooltip } from "recharts";

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
    <div
      style={{
        width: "550px",
        maxWidth: "550px",
        margin: "24px auto 0 auto",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "10px",
          border: "1px solid #e5e5e5",
          backgroundColor: "rgba(255,255,255,0.8)",
          padding: "12px 16px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <div
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "1.2px",
              color: "#9b9b9b",
            }}
          >
            Task statistics
          </div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 200,
              color: "#333333",
              lineHeight: "22px",
            }}
          >
            {completed} of {total} tasks completed
          </div>
          <div style={{ fontSize: "12px", color: "#9b9b9b" }}>
            Active: {active} • Completed: {completed}
          </div>
        </div>

        <div
          style={{
            width: "120px",
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PieChart width={120} height={72}>
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
                borderRadius: "8px",
                border: "1px solid #e5e5e5",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                fontSize: "11px",
                padding: "4px 8px",
              }}
              formatter={(value, name) => [`${value}`, String(name)]}
            />
          </PieChart>
        </div>
      </div>
    </div>
  );
}
