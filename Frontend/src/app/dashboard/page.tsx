import EventCard from "../../components/events/EventCard";

export default async function DashboardPage() {
  let events = [];
  try {
    const baseUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api';
    const res = await fetch(`${baseUrl}/events`, {
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

  // Agrupar eventos por carrera
  const groupedEvents: Record<string, any[]> = {};
  events.forEach((event: any) => {
    const carreraName = event.author?.carrera?.nombre || 'General';
    if (!groupedEvents[carreraName]) {
      groupedEvents[carreraName] = [];
    }
    groupedEvents[carreraName].push(event);
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 font-inter italic">Muro de Noticias y Actividades</h1>
      {events.length === 0 ? (
        <p className="text-gray-500">No hay noticias o actividades para mostrar. ¿Está corriendo el backend en el puerto 3000?</p>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedEvents).map(([carrera, carreraEvents]) => (
            <section key={carrera}>
              <h2 className="text-2xl font-bold text-[#003b5c] mb-6 border-b border-gray-200 pb-2">{carrera}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {carreraEvents.map((event: any) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
