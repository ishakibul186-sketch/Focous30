
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { db } from '../firebase.ts';
import { ref, get, set } from 'firebase/database';
import { DailyLog } from '../types.ts';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button.tsx';
import Card from '../components/ui/Card.tsx';
import Input from '../components/ui/Input.tsx';
import Checkbox from '../components/ui/Checkbox.tsx';
import Spinner from '../components/ui/Spinner.tsx';
// Fix: Removed 'parseISO' from imports as it was reported missing; using native Date instead
import { format, differenceInDays } from 'date-fns';

const HomePage: React.FC = () => {
    const { user, profile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [logExists, setLogExists] = useState(false);
    const today = new Date().toISOString().split('T')[0];
    
    const [log, setLog] = useState<Omit<DailyLog, 'dailyScore' | 'habitCompletion' | 'date'>>({
        brush: false, personalHygiene: false, exercise: false, breakfast: false,
        lunch: false, studyWorkHours: 0, energySave: false,
        eveningSnacks: false, socialMediaTime: 0, negativeSiteVisit: false,
        nightStudy: false, phoneUseAfter11: false, sleepTime: 0,
    });

    useEffect(() => {
        const checkLog = async () => {
            if (!user) return;
            setIsLoading(true);
            const logRef = ref(db, `users_LifeRoutineAnalyzer/${user.uid}/dailyLogs/${today}`);
            const snapshot = await get(logRef);
            if (snapshot.exists()) {
                setLogExists(true);
                setLog(snapshot.val());
            }
            setIsLoading(false);
        };
        checkLog();
    }, [user, today]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setLog(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value }));
    };
    
    const calculateScore = () => {
        let score = 0;
        const positiveHabits = [log.brush, log.personalHygiene, log.exercise, log.breakfast, log.lunch, log.energySave, log.eveningSnacks, log.nightStudy];
        const positiveHabitsCompleted = positiveHabits.filter(Boolean).length;
        
        score += positiveHabitsCompleted;
        if (log.studyWorkHours > 0) score += 1;
        if (log.sleepTime >= 7) score += 1;
        
        if (log.negativeSiteVisit) score -= 1;
        if (log.phoneUseAfter11) score -= 1;
        if (log.socialMediaTime > 60) score -= 1;

        const totalPositiveHabits = 8;
        const habitCompletion = (positiveHabitsCompleted / totalPositiveHabits) * 100;
        
        return { dailyScore: score, habitCompletion: parseFloat(habitCompletion.toFixed(2)) };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsSubmitting(true);
        
        const { dailyScore, habitCompletion } = calculateScore();
        const fullLog: DailyLog = { ...log, dailyScore, habitCompletion, date: today };

        try {
            const logRef = ref(db, `users_LifeRoutineAnalyzer/${user.uid}/dailyLogs/${today}`);
            await set(logRef, fullLog);
            toast.success("Progress saved.");
            setLogExists(true);
        } catch (error) {
            console.error(error);
            toast.error("Save failed.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Fix: Using new Date(profile.startDate) instead of parseISO(profile.startDate)
    const dayCounter = profile ? differenceInDays(new Date(), new Date(profile.startDate)) + 1 : 1;

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-[60vh]"><Spinner /></div>;
    }
    
    if (logExists) {
        return (
          <div className="max-w-2xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <Card className="text-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-blue-500"></div>
                <div className="w-20 h-20 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <h2 className="text-3xl font-black text-white mb-2">Cycle Complete</h2>
                <p className="text-gray-400 mb-6">Your data for today is securely logged. Review your evolution in the dashboard.</p>
                <div className="inline-block px-6 py-2 bg-white/5 border border-white/5 rounded-full text-xs font-bold text-teal-400 uppercase tracking-widest">
                  Day {dayCounter} of 30
                </div>
              </Card>
          </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <header className="text-center">
                <div className="inline-block px-4 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-[10px] font-black text-teal-400 uppercase tracking-[0.2em] mb-4">
                  Evolution Protocol: Day {dayCounter}
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2">Focus Daily <span className="text-teal-400">Log</span></h1>
                <p className="text-gray-500 text-lg font-medium">{format(new Date(), 'EEEE, MMMM do')}</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card title="Morning Rituals">
                      <div className="grid grid-cols-2 gap-4">
                          <Checkbox label="Brush" name="brush" checked={log.brush} onChange={handleChange} />
                          <Checkbox label="Hygiene" name="personalHygiene" checked={log.personalHygiene} onChange={handleChange} />
                          <Checkbox label="Exercise" name="exercise" checked={log.exercise} onChange={handleChange} />
                          <Checkbox label="Breakfast" name="breakfast" checked={log.breakfast} onChange={handleChange} />
                      </div>
                  </Card>
                  
                  <Card title="Deep Work Focus">
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <Checkbox label="Lunch" name="lunch" checked={log.lunch} onChange={handleChange} />
                          <Checkbox label="Energy Save" name="energySave" checked={log.energySave} onChange={handleChange} />
                        </div>
                        <Input id="studyWorkHours" label="Study/Work Productivity" name="studyWorkHours" type="number" min="0" suffix="Hours" value={log.studyWorkHours} onChange={handleChange} />
                      </div>
                  </Card>

                  <Card title="Evening Recovery">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                          <Checkbox label="Evening Snacks" name="eveningSnacks" checked={log.eveningSnacks} onChange={handleChange} />
                          <Checkbox label="Negative Site Visit" name="negativeSiteVisit" checked={log.negativeSiteVisit} onChange={handleChange} isNegative />
                        </div>
                        <Input id="socialMediaTime" label="Social Entertainment" name="socialMediaTime" type="number" min="0" suffix="Minutes" value={log.socialMediaTime} onChange={handleChange} />
                      </div>
                  </Card>
                  
                  <Card title="Nocturnal Discipline">
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <Checkbox label="Night Study" name="nightStudy" checked={log.nightStudy} onChange={handleChange} />
                          <Checkbox label="Late Phone" name="phoneUseAfter11" checked={log.phoneUseAfter11} onChange={handleChange} isNegative />
                        </div>
                        <Input id="sleepTime" label="Sleep Duration" name="sleepTime" type="number" min="0" suffix="Hours" value={log.sleepTime} onChange={handleChange} />
                      </div>
                  </Card>
                </div>

                <div className="flex justify-center md:justify-end pt-8">
                    <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                        {isSubmitting ? 'Syncing Data...' : 'Confirm Daily Entry'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default HomePage;
