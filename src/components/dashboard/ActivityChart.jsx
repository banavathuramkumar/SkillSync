import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Activity, ShieldCheck } from "lucide-react";
import { statsService } from "../../services/api/statsService";

export const ActivityChart = () => {
  const [activityData, setActivityData] = useState([]);
  const [summary, setSummary] = useState({ totalPeriodRequests: 0, totalPeriodUsers: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchActivity = async () => {
      try {
        const res = await statsService.getActivityStats();
        if (isMounted && res?.activity) {
          setActivityData(res.activity);
          if (res.summary) setSummary(res.summary);
        }
      } catch (err) {
        console.warn("[ActivityChart] Failed to load live activity:", err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchActivity();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-brand-text">
              Team Matching & Request Velocity
            </h4>
            <span className="flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              <ShieldCheck className="w-3 h-3 text-brand-blue" />
              Live DB Records
            </span>
          </div>
          <p className="text-xs text-brand-muted mt-0.5">
            Real database tracking of join applications & student registrations (past 7 days)
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-brand-blue" />
            <span>Join Requests ({summary.totalPeriodRequests})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-brand-mint-dark" />
            <span>New Users ({summary.totalPeriodUsers})</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-xs text-brand-muted">
            <Activity className="w-4 h-4 animate-spin text-brand-blue mr-2" />
            Querying live database activity...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={activityData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#087CF5" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#087CF5" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4FBFA5" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4FBFA5" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="day"
                stroke="#94A3B8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  fontSize: "12px",
                }}
                formatter={(value, name) => [
                  `${value} ${name === "requests" ? "requests" : "students"}`,
                  name === "requests" ? "Join Requests" : "New Students",
                ]}
              />
              <Area
                type="monotone"
                dataKey="requests"
                name="requests"
                stroke="#087CF5"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRequests)"
              />
              <Area
                type="monotone"
                dataKey="activeUsers"
                name="activeUsers"
                stroke="#4FBFA5"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ActivityChart;
