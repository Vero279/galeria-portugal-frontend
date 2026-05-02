import { Calendar, MapPin } from 'lucide-react';
import type { ArtistEvent } from '../../hooks/useArtistEvents';

interface EventsListProps {
  events: ArtistEvent[];
}

export default function EventsList({ events }: EventsListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/30 text-sm tracking-widest">Nenhum evento agendado</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map(event => {
        const eventDate = new Date(event.event_date);
        const isUpcoming = eventDate > new Date();

        return (
          <div
            key={event.id}
            className="group overflow-hidden border border-white/10 rounded-lg hover:border-white/20 transition-colors"
          >
            <div className="aspect-video overflow-hidden relative">
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="p-4">
              <div className={`inline-block px-2 py-1 rounded text-xs tracking-widest mb-2 ${
                isUpcoming
                  ? 'bg-amber-400/20 text-amber-400'
                  : 'bg-white/10 text-white/40'
              }`}>
                {isUpcoming ? 'Próximo' : 'Passado'}
              </div>

              <h3 className="text-white font-light text-sm leading-tight mb-3 tracking-wide">
                {event.title}
              </h3>

              <div className="space-y-2 text-xs text-white/50">
                <div className="flex items-start gap-2">
                  <Calendar size={12} className="mt-0.5 flex-shrink-0" />
                  <span>
                    {eventDate.toLocaleDateString('pt-PT', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })} às {eventDate.toLocaleTimeString('pt-PT', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                  <span>{event.location}</span>
                </div>
              </div>

              {event.description && (
                <p className="text-white/40 text-xs mt-3 leading-relaxed">
                  {event.description.substring(0, 80)}...
                </p>
              )}

              <button className="w-full mt-4 px-3 py-2 border border-white/20 text-white/60 text-xs tracking-widest uppercase hover:border-white/50 hover:text-white transition-colors">
                Mais Info
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}