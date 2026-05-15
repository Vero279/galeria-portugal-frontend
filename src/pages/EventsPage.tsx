import { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import EventsList from '../components/common/EventsList';
import { useAllEvents } from '../hooks/useAllEvents';
import { useCities } from '../hooks/useCities';

export default function EventsPage() {
  const { events, loading } = useAllEvents();
  const { cities } = useCities();
  const [filterCity, setFilterCity] = useState<string>('all');

  const filteredEvents = events.filter(event => {
    if (filterCity === 'all') return true;
    return event.city?.name === filterCity;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
  });

  // Lista de cidades: "all" + todas as cidades cadastradas
  const cityOptions = [
    { id: 'all', name: 'Todas as Cidades' },
    ...cities.map(city => ({ id: city.name, name: city.name }))
  ];

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center pt-40">
        <div className="w-px h-16 bg-white/10 animate-pulse" />
      </div>
    );
  }

  const upcomingEvents = sortedEvents.filter(e => new Date(e.event_date) > new Date());
  const pastEvents = sortedEvents.filter(e => new Date(e.event_date) <= new Date());

  return (
    <div className="min-h-screen bg-[#0d0d0d] pt-40 pb-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-12">
          <h1 className="text-white text-5xl md:text-6xl font-light tracking-wider mb-2">
            Calendário de Eventos
          </h1>
          <p className="text-white/40 text-sm">
            {upcomingEvents.length} evento{upcomingEvents.length !== 1 ? 's' : ''} agendado{upcomingEvents.length !== 1 ? 's' : ''} • {pastEvents.length} evento{pastEvents.length !== 1 ? 's' : ''} passado{pastEvents.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={14} className="text-white/40" />
            <span className="text-white/40 text-xs tracking-widest uppercase">Filtrar por Cidade</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {cityOptions.map(city => (
              <button
                key={city.id}
                onClick={() => setFilterCity(city.id)}
                className={`px-4 py-2 text-xs tracking-wider uppercase transition-all ${
                  filterCity === city.id
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        {upcomingEvents.length > 0 && (
          <div className="mb-16">
            <div className="mb-6 pb-4 border-b border-white/10">
              <h2 className="text-white text-xl font-light tracking-wider">Próximos Eventos</h2>
            </div>
            <EventsList events={upcomingEvents} />
          </div>
        )}

        {pastEvents.length > 0 && (
          <div>
            <div className="mb-6 pb-4 border-b border-white/10">
              <h2 className="text-white text-xl font-light tracking-wider">Eventos Anteriores</h2>
            </div>
            <div className="opacity-60">
              <EventsList events={pastEvents} />
            </div>
          </div>
        )}

        {sortedEvents.length === 0 && (
          <div className="text-center py-16">
            <Calendar size={32} className="text-white/20 mx-auto mb-4" />
            <p className="text-white/40 text-sm">Nenhum evento encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}