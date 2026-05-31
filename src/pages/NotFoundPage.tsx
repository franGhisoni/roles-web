import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-xl bg-slate-800 text-slate-400">
          <Compass className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">404 · Not found</h1>
        <p className="mt-2 text-sm text-slate-400">
          The route you followed doesn't exist (or it never did).
        </p>
        <Link to="/" className="mt-6 inline-block">
          <Button>Back to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
