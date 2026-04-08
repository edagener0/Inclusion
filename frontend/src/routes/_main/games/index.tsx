import { createFileRoute, Link } from '@tanstack/react-router';
import { Gamepad2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';

export const Route = createFileRoute('/_main/games/')({
  component: GamesList,
});

function GamesList() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <Gamepad2 className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Jogos</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/games/wordle">
          <Card className="hover:ring-primary/50 transition-all cursor-pointer group">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                <span className="text-2xl font-bold text-primary">W</span>
              </div>
              <CardTitle>Wordle</CardTitle>
              <CardDescription>
                Adivinha a palavra do dia em 6 tentativas. Um novo desafio todos os dias!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded border bg-muted" />
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
