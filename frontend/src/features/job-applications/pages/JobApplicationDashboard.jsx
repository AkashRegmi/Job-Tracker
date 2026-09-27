import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
} from "lucide-react";
import { getError } from "../../../utils/errorHandler";
import { useJobApplicationDashboard } from "../hooks/useJobApplications";

const stages = [
  ["wishlist", "Wishlist", "#94a3b8"],
  ["applied", "Applied", "#38bdf8"],
  ["screening", "Screening", "#818cf8"],
  ["interviews", "Interview", "#a78bfa"],
  ["assessments", "Assessment", "#fbbf24"],
  ["offers", "Offer", "#34d399"],
  ["rejected", "Rejected", "#fb7185"],
  ["withdrawn", "Withdrawn", "#a8a29e"],
];

function StatCard({ label, value, icon: Icon, detail, accent }) {
  return (
    <article
      className="rounded-xl border border-emerald-950/10 border-t-4 bg-white p-5 shadow-sm"
      style={{ borderTopColor: accent }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-finance-muted">{label}</p>
          <strong className="mt-3 block text-3xl font-bold text-finance-dark">
            {value}
          </strong>
        </div>
        <span
          className="rounded-lg p-2.5"
          style={{ color: accent, backgroundColor: `${accent}18` }}
        >
          <Icon size={19} />
        </span>
      </div>
      <p className="mt-3 text-xs text-finance-muted">{detail}</p>
    </article>
  );
}

export default function JobApplicationDashboard() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const dashboardQuery = useJobApplicationDashboard({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });
  const dashboard = dashboardQuery.data?.data || {};
  const chartData = stages.map(([key, label, color]) => ({
    name: label,
    value: dashboard[key] || 0,
    color,
  }));
  const activeStages = chartData.filter((stage) => stage.value > 0);
  const statCards = [
    [
      "Total applications",
      dashboard.totalJobs,
      "All tracked opportunities",
      BriefcaseBusiness,
      "#176b87",
    ],
    [
      "Wishlist",
      dashboard.wishlist,
      "Saved opportunities",
      BriefcaseBusiness,
      "#94a3b8",
    ],
    [
      "Applied",
      dashboard.applied,
      "Applications submitted",
      BriefcaseBusiness,
      "#38bdf8",
    ],
    ["Screening", dashboard.screening, "Initial reviews", Clock3, "#818cf8"],
    [
      "Interviews",
      dashboard.interviews,
      "Conversations in progress",
      Clock3,
      "#a78bfa",
    ],
    [
      "Assessments",
      dashboard.assessments,
      "Tasks in progress",
      BriefcaseBusiness,
      "#fbbf24",
    ],
    ["Offers", dashboard.offers, "Offers received", CheckCircle2, "#34d399"],
    [
      "Rejected",
      dashboard.rejected,
      "Closed applications",
      BriefcaseBusiness,
      "#fb7185",
    ],
    [
      "Withdrawn",
      dashboard.withdrawn,
      "Withdrawn applications",
      BriefcaseBusiness,
      "#a8a29e",
    ],
  ];

  if (dashboardQuery.isPending)
    return (
      <div className="py-16 text-center text-sm text-finance-muted">
        Loading your application dashboard...
      </div>
    );
  if (dashboardQuery.isError)
    return (
      <div className="py-16 text-center text-sm text-rose-600">
        {getError(dashboardQuery.error)}
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#176b87]">Your pipeline</p>
          <h1 className="mt-1 text-3xl font-bold text-finance-dark">
            Application dashboard
          </h1>
          <p className="mt-2 text-sm text-finance-muted">
            See the health of your job search at a glance.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/applications"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#176b87] px-4 text-sm font-semibold text-[#176b87] hover:bg-[#e8f5f7]"
          >
            View applications <ArrowRight size={16} />
          </Link>
          <Link
            to="/applications"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#176b87] px-4 text-sm font-semibold text-white hover:bg-[#0d4c63]"
          >
            <Plus size={17} /> Add application
          </Link>
        </div>
      </header>
      <section className="rounded-xl border border-emerald-950/10 bg-white p-4">
        <div className="flex flex-wrap items-end gap-4">
          <label className="text-xs font-semibold text-finance-muted">
            <span className="mb-2 flex items-center gap-1.5">
              <CalendarDays size={14} /> Start date
            </span>
            <input
              className="rounded-lg border border-emerald-950/10 px-3 py-2 text-sm text-finance-text outline-none focus:border-[#176b87]"
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </label>
          <label className="text-xs font-semibold text-finance-muted">
            <span className="mb-2 flex items-center gap-1.5">
              <CalendarDays size={14} /> End date
            </span>
            <input
              className="rounded-lg border border-emerald-950/10 px-3 py-2 text-sm text-finance-text outline-none focus:border-[#176b87]"
              type="date"
              min={startDate || undefined}
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </label>
          {(startDate || endDate) && (
            <button
              type="button"
              className="mb-0.5 text-sm font-semibold text-[#176b87] hover:text-[#0d4c63]"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
            >
              Clear dates
            </button>
          )}
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map(([label, value, detail, Icon, accent]) => (
          <StatCard
            key={label}
            label={label}
            value={value || 0}
            icon={Icon}
            detail={detail}
            accent={accent}
          />
        ))}
      </section>
      <section className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
        <article className="rounded-xl border border-emerald-950/10 bg-white p-5">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-finance-dark">
              Pipeline by status
            </h2>
            <p className="mt-1 text-sm text-finance-muted">
              How your applications are distributed across the process.
            </p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
              >
                <CartesianGrid stroke="#e5eeee" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip cursor={{ fill: "#f3f8f8" }} />
                <Bar dataKey="value" name="Applications" radius={[5, 5, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell fill={entry.color} key={entry.name} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
        <article className="rounded-xl border border-emerald-950/10 bg-white p-5">
          <h2 className="text-lg font-semibold text-finance-dark">
            Pipeline mix
          </h2>
          <p className="mt-1 text-sm text-finance-muted">
            Your active application stages.
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={
                    activeStages.length
                      ? activeStages
                      : [
                          {
                            name: "No applications",
                            value: 1,
                            color: "#e2e8f0",
                          },
                        ]
                  }
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {(activeStages.length
                    ? activeStages
                    : [{ name: "No applications", value: 1, color: "#e2e8f0" }]
                  ).map((entry) => (
                    <Cell fill={entry.color} key={entry.name} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {chartData
              .filter((stage) => stage.value > 0)
              .map((stage) => (
                <div
                  className="flex items-center gap-2 text-xs text-finance-muted"
                  key={stage.name}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  {stage.name}: {stage.value}
                </div>
              ))}
          </div>
        </article>
      </section>
    </div>
  );
}
