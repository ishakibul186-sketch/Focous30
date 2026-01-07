
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';
import { DailyLog } from '../types';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
// FIX: Import subDays directly from its submodule to resolve module export error.
import { format } from 'date-fns';
import subDays from 'date-fns/subDays';

const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user || !profile) return;
      setLoading(true);
      const logsRef = ref(db, `users_LifeRoutineAnalyzer/${user.uid}/dailyLogs`);
      const snapshot = await get(logsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        
        // Create logs for missing days with 0 values
        const startDate = new Date(profile.startDate);
        const today = new Date();
        const allLogs: DailyLog[] = [];

        for (let i = 0; i < 30; i++) {
            const date = subDays(today, i);
            if (date < startDate) break;

            const dateString = format(date, 'yyyy-MM-dd');
            if (data[dateString]) {
                allLogs.push({ ...data[dateString], date: dateString });
            } else {
                 allLogs.push({
                    date: dateString, dailyScore: 0, habitCompletion: 0,
                    brush: false, personalHygiene: false, exercise: false, breakfast: false, lunch: false,
                    studyWorkHours: 0, energySave: false, eveningSnacks: false, socialMediaTime: 0,
                    negativeSiteVisit: false, nightStudy: false, phoneUseAfter11: false, sleepTime: 0,
                });
            }
        }

        setLogs(allLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      }
      setLoading(false);
    };
    fetchLogs();
  }, [user, profile]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  if (logs.length === 0) {
    return <Card className="text-center">No data available yet. Start logging your daily routine!</Card>;
  }
  
  const formattedLogs = logs.map(log => ({
      ...log,
      shortDate: format(new Date(log.date), 'MMM d'),
  }));

  const totalStudy = logs.reduce((sum, log) => sum + log.studyWorkHours, 0);
  const totalSocial = logs.reduce((sum, log) => sum + log.socialMediaTime, 0) / 60; // in hours

  const goodHabits = logs.reduce((sum, log) => {
    const positiveHabits = [log.brush, log.personalHygiene, log.exercise, log.breakfast, log.lunch, log.energySave, log.eveningSnacks, log.nightStudy];
    return sum + positiveHabits.filter(Boolean).length;
  }, 0);
  const badHabits = logs.reduce((sum, log) => sum + (log.negativeSiteVisit ? 1 : 0) + (log.phoneUseAfter11 ? 1 : 0), 0);
  
  const pieData = [
      { name: 'Good Habits Done', value: goodHabits },
      { name: 'Negative Habits Done', value: badHabits },
  ];
  const COLORS = ['#10B981', '#F43F5E'];

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Your 30-Day Analysis</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <Card title="Daily Score Trend">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={formattedLogs}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a4a4a" />
                        <XAxis dataKey="shortDate" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #4a4a4a' }} />
                        <Legend />
                        <Line type="monotone" dataKey="dailyScore" stroke="#34D399" strokeWidth={2} name="Daily Score"/>
                    </LineChart>
                </ResponsiveContainer>
            </Card>
             <Card title="Habit Completion (%)">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={formattedLogs}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a4a4a" />
                        <XAxis dataKey="shortDate" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #4a4a4a' }} />
                        <Legend />
                        <Bar dataKey="habitCompletion" fill="#60A5FA" name="Completion %" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
             <Card title="Good vs Bad Habits">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                             {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <RechartsTooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #4a4a4a' }} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Card>
             <Card title="Time Allocation (Hours)">
                 <div className="flex justify-around items-center h-[300px]">
                    <div className="text-center">
                        <p className="text-lg text-gray-400">Total Study / Work</p>
                        <p className="text-5xl font-bold text-blue-400">{totalStudy.toFixed(1)}h</p>
                    </div>
                     <div className="text-center">
                        <p className="text-lg text-gray-400">Total Social Media</p>
                        <p className="text-5xl font-bold text-pink-500">{totalSocial.toFixed(1)}h</p>
                    </div>
                 </div>
            </Card>
        </div>
    </div>
  );
};

export default DashboardPage;