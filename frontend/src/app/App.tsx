function App() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      {/* Header */}

      <main className="@container/main flex flex-1 flex-col gap-2">
        {/* Outlet (router) */}
        <div>Inclusion</div>
      </main>
    </div>
  );
}

export default App;
