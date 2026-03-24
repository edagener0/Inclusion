import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_main/')({ beforeLoad: () => redirect({ to: '/incs' }) });
