/* eslint-disable react-refresh/only-export-components */
import { Link, createFileRoute } from '@tanstack/react-router';
import { Gamepad2 } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

export const Route = createFileRoute('/_main/games/')({
  component: GamesList,
});

function GamesList() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center gap-3">
        <Gamepad2 className="text-primary h-8 w-8" />
        <h1 className="text-3xl font-bold">Jogos</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/games/wordle/wordle">
          <Card className="hover:ring-primary/50 group cursor-pointer transition-all">
            <CardHeader>
              <div className="bg-primary/10 group-hover:bg-primary/20 mb-2 flex h-12 w-12 items-center justify-center rounded-lg transition-colors">
                <span className="text-primary text-2xl font-bold">W</span>
              </div>
              <CardTitle>Wordle</CardTitle>
              <CardDescription>
                Adivinha a palavra do dia em 6 tentativas. Um novo desafio todos os dias!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-muted h-6 w-6 rounded border" />
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
