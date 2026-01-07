
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
// FIX: Import parseISO directly from its submodule to resolve module export error.
import { differenceInDays } from 'date-fns';
import parseISO from 'date-fns/parseISO';

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
    
    const handleToggle = (name: keyof typeof log, value: boolean) => {
      setLog(prev => ({ ...prev, [name]: value }));
    };

    const calculateScore = () => {
        let score = 0;
        const positiveHabits = [log.brush, log.personalHygiene, log.exercise, log.breakfast, log.lunch, log.energySave, log.eveningSnacks, log.nightStudy];
        const positiveHabitsCompleted = positiveHabits.filter(Boolean).length;
        
        score += positiveHabitsCompleted;
        if (log.studyWorkHours > 0) score += 1;
        if (log.sleepTime >= 7) score +=1;
        
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
            toast.success("Today's log saved successfully!");
            setLogExists(true);
        } catch (error) {
            console.error(error);
            toast.error("Failed to save today's log.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const dayCounter = profile ? differenceInDays(new Date(), parseISO(profile.startDate)) + 1 : 1;

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    }
    
    if (logExists) {
        return (
          <div className="text-center mt-10">
              <Card>
                <h2 className="text-3xl font-bold text-teal-400 mb-4">Well Done!</h2>
                <p className="text-gray-300">You've already submitted your log for today. Come back tomorrow!</p>
                <p className="text-lg text-white mt-2">Day {dayCounter} of 30</p>
              </Card>
          </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white">Daily Log for <span className="text-teal-400">{today}</span></h1>
                <p className="text-gray-400 mt-2">Day <span className="font-semibold text-white">{dayCounter}</span> of your 30-day journey. Keep going!</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
                <Card title="🌅 Morning Routine">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Checkbox label="Brush" name="brush" checked={log.brush} onChange={handleChange} />
                        <Checkbox label="Hygiene" name="personalHygiene" checked={log.personalHygiene} onChange={handleChange} />
                        <Checkbox label="Exercise" name="exercise" checked={log.exercise} onChange={handleChange} />
                        <Checkbox label="Breakfast" name="breakfast" checked={log.breakfast} onChange={handleChange} />
                    </div>
                </Card>
                <Card title="☀️ Daytime Routine">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Checkbox label="Lunch" name="lunch" checked={log.lunch} onChange={handleChange} />
                        <Input id="studyWorkHours" label="Study/Work (Hours)" name="studyWorkHours" type="number" min="0" value={log.studyWorkHours} onChange={handleChange} />
                        <Checkbox label="Energy Save" name="energySave" checked={log.energySave} onChange={handleChange} />
                    </div>
                </Card>
                <Card title="🌆 Evening Routine">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Checkbox label="Evening Snacks" name="eveningSnacks" checked={log.eveningSnacks} onChange={handleChange} />
                         <Input id="socialMediaTime" label="Social Media (Mins)" name="socialMediaTime" type="number" min="0" value={log.socialMediaTime} onChange={handleChange} />
                        <Checkbox label="Bad Site Visit?" name="negativeSiteVisit" checked={log.negativeSiteVisit} onChange={handleChange} isNegative />
                    </div>
                </Card>
                 <Card title="🌙 Night Routine">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Checkbox label="Night Study" name="nightStudy" checked={log.nightStudy} onChange={handleChange} />
                        <Input id="sleepTime" label="Sleep (Hours)" name="sleepTime" type="number" min="0" value={log.sleepTime} onChange={handleChange} />
                        <Checkbox label="Phone after 11PM?" name="phoneUseAfter11" checked={log.phoneUseAfter11} onChange={handleChange} isNegative />
                    </div>
                </Card>
                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Today\'s Log'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default HomePage;
