export default function NotFound404() {
  // Static 404 fallback for export to avoid build-time ENOENT issues in some environments.
  return (
    <main className="chat-container">
      <section className="card" role="alert" aria-live="polite">
        <div className="p-6">
          <h1 className="text-xl font-semibold mb-2">404 – Page Not Found</h1>
          <p className="text-gray-600">
            The page you’re looking for doesn’t exist.
          </p>
        </div>
      </section>
    </main>
  );
}
