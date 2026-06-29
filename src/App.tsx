import { useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import WorkoutPage from './pages/WorkoutPage';
import GuidePage from './pages/GuidePage';
import ProgressPage from './pages/ProgressPage';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { DayRecord } from './types';

function getTodayDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getTodayPlanDay(startDate: string | null): number {
  if (!startDate) return 1;
  const start = new Date(startDate);
  const today = new Date();
  const diff = Math.floor(
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
  return Math.min(Math.max(diff + 1, 1), 30);
}

// Wrapper that reads useParams
function WorkoutPageWithParams({
  records,
  onSave,
}: {
  records: Record<number, DayRecord>;
  onSave: (day: number, record: DayRecord) => void;
}) {
  const { day } = useParams<{ day: string }>();
  const dayNum = Number(day);

  if (isNaN(dayNum) || dayNum < 1 || dayNum > 30) {
    return <div className="py-20 text-center text-night-300">Dia inválido</div>;
  }

  return (
    <WorkoutPage
      day={dayNum}
      savedRecord={records[dayNum] ?? null}
      onSave={onSave}
    />
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [records, setRecords] = useLocalStorage<Record<number | string, DayRecord | string>>(
    'treino-records',
    {},
  );

  // Initialize start date on first visit
  const startDate = (records['_meta'] as string) ?? null;

  useEffect(() => {
    if (!startDate) {
      setRecords((prev) => ({ ...prev, _meta: getTodayDateString() }));
    }
  }, [startDate, setRecords]);

  const currentDay = useMemo(
    () => getTodayPlanDay(startDate),
    [startDate],
  );

  const handleSelectDay = (day: number) => {
    if (day <= currentDay) {
      navigate(`/treino/dia/${day}`);
    }
  };

  const handleSaveRecord = (day: number, record: DayRecord) => {
    setRecords((prev) => ({ ...prev, [day]: record }));
  };

  // Redirect /hoje to /dia/{currentDay}
  useEffect(() => {
    if (location.pathname === '/treino/hoje') {
      navigate(`/treino/dia/${currentDay}`, { replace: true });
    }
  }, [location.pathname, currentDay, navigate]);

  return (
    <div className="min-h-screen bg-night-900 text-night-50">
      <div className="mx-auto max-w-md px-4 py-4">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/treino/"
              element={
                <HomePage
                  records={records as unknown as Record<number, DayRecord>}
                  onSelectDay={handleSelectDay}
                  startDay={currentDay}
                />
              }
            />
            <Route
              path="/treino/dia/:day"
              element={
                <WorkoutPageWithParams
                  records={records as unknown as Record<number, DayRecord>}
                  onSave={handleSaveRecord}
                />
              }
            />
            <Route path="/treino/guia" element={<GuidePage />} />
            <Route
              path="/treino/progresso"
              element={
                <ProgressPage
                  records={records as unknown as Record<number, DayRecord>}
                />
              }
            />
          </Routes>
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
