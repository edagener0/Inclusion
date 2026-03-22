import { createFileRoute } from '@tanstack/react-router';

import { NotesSection } from '@/widgets/notes-section';

export const Route = createFileRoute('/_main/messages')({
  component: function () {
    return (
      <div className="flex flex-col">
        <div className="border-b max-h-60 overflow-y-hidden">
          <NotesSection />
        </div>
        <h2 className="text-xl font-bold pt-4">Messages</h2>
      </div>
    );
  },
});
