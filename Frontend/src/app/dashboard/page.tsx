import EventCard from "../../components/events/EventCard";

export default async function DashboardPage() {
  let events = [];
  try {
    // Si usas Docker Compose, la URL debe ser accesible internamente o por localhost.
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/events`, {
      cache: 'no-store'
    });
    if (res.ok) {
      events = await res.json();
    } else {
      console.error("Error fetching events from backend:", res.status);
    }
  } catch (error) {
    console.error("Failed to connect to backend:", error);
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 font-inter italic">Muro de Noticias y Actividades</h1>
      {events.length === 0 ? (
        <p className="text-gray-500">No hay noticias o actividades para mostrar. ¿Está corriendo el backend en el puerto 3000?</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: { id: string; title: string; description: string; date: string; location: string; category: string; imageUrl?: string }) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      )}
    </div>
  );
}
