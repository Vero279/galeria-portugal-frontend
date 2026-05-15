import { Mail, Phone, MapPin, Heart, Globe } from 'lucide-react';

export default function AboutPage(): React.ReactNode {
  return (
    <div className="min-h-screen bg-[#0d0d0d] pt-40 pb-12">
      <div className="max-w-4xl mx-auto px-8">
        <div className="mb-16">
          <h1 className="text-white text-5xl md:text-6xl font-light tracking-wider mb-6">
            Sobre Galeria Portugal
          </h1>
          <p className="text-white/50 text-lg leading-relaxed">
            Uma plataforma dedicada a celebrar a criatividade portuguesa, conectando artistas, colecionadores e apreciadores de arte numa experiência imersiva e interativa.
          </p>
        </div>

        <div className="space-y-16">
          <section>
            <h2 className="text-white text-2xl font-light tracking-wider mb-6">Nossa Missão</h2>
            <p className="text-white/60 leading-relaxed mb-4">
              Galeria Portugal é uma iniciativa dedicada a promover e celebrar os talentos artísticos portugueses. Acreditamos que a arte tem o poder de transcender fronteiras e conectar pessoas de forma significativa.
            </p>
            <p className="text-white/60 leading-relaxed">
              A nossa plataforma oferece uma experiência única onde visitantes podem explorar artistas de várias cidades portuguesas, compreender as suas obras através de quizzes interativos, e visualizar como as obras se enquadram nos seus espaços pessoais.
            </p>
          </section>

          <section>
            <h2 className="text-white text-2xl font-light tracking-wider mb-6">Características</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h3 className="text-white font-light tracking-wider mb-3">Galeria Interativa</h3>
                <p className="text-white/50 text-sm">
                  Explore artistas de 5 cidades portuguesas: Porto, Braga, Aveiro, Faro e Coimbra.
                </p>
              </div>
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h3 className="text-white font-light tracking-wider mb-3">Testes de Conhecimento</h3>
                <p className="text-white/50 text-sm">
                  Participe em quizzes sobre artistas e ganhe descontos exclusivos.
                </p>
              </div>
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h3 className="text-white font-light tracking-wider mb-3">Visualização 3D</h3>
                <p className="text-white/50 text-sm">
                  Veja como as obras de arte ficam no seu espaço com a tecnologia de parede virtual.
                </p>
              </div>
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h3 className="text-white font-light tracking-wider mb-3">Eventos Culturais</h3>
                <p className="text-white/50 text-sm">
                  Acompanhe exposições, apresentações e eventos dos artistas.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-white text-2xl font-light tracking-wider mb-6">Cidades em Destaque</h2>
            <div className="space-y-4">
              {[
                { city: 'Porto', description: 'A cidade das pontes, do vinho e da alma criativa' },
                { city: 'Braga', description: 'Berço da nação e palco de uma nova geração de artistas' },
                { city: 'Aveiro', description: 'A Veneza portuguesa inspira obras de cor e movimento' },
                { city: 'Faro', description: 'A luz do Algarve reflete-se nas telas dos seus criadores' },
                { city: 'Coimbra', description: 'Entre tradição académica e vanguarda artística' }
              ].map(({ city, description }) => (
                <div key={city} className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                  <MapPin size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-white font-light tracking-wider mb-1">{city}</h3>
                    <p className="text-white/50 text-sm">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-white/10 pt-16">
            <h2 className="text-white text-2xl font-light tracking-wider mb-6">Equipa</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Somos uma equipa apaixonada por arte portuguesa, dedicada a criar experiências significativas que conectam artistas com públicos de todo o mundo.
            </p>
          </section>

          <section className="border-t border-white/10 pt-16">
            <h2 className="text-white text-2xl font-light tracking-wider mb-6">Contacte-nos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a href="mailto:hello@galeria-portugal.pt" className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group">
                <Mail size={16} className="text-amber-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Email</p>
                  <p className="text-white font-light">hello@galeria-portugal.pt</p>
                </div>
              </a>
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <Phone size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Telefone</p>
                  <p className="text-white font-light">+351 912 345 678</p>
                </div>
              </div>
              <a href="https://galeria-portugal.pt" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group">
                <Globe size={16} className="text-amber-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Website</p>
                  <p className="text-white font-light">galeria-portugal.pt</p>
                </div>
              </a>
            </div>
          </section>

          <section className="border-t border-white/10 pt-16">
            <div className="bg-gradient-to-r from-amber-400/10 to-white/10 p-8 rounded-lg border border-white/10">
              <div className="flex items-start gap-4 mb-4">
                <Heart size={20} className="text-amber-400 flex-shrink-0" />
                <h3 className="text-white text-xl font-light tracking-wider">Apoie a Arte Portuguesa</h3>
              </div>
              <p className="text-white/60 leading-relaxed">
                Cada compra e participação na Galeria Portugal ajuda a promover e sustentar artistas locais. Junte-se a nós nesta missão de celebrar a criatividade portuguesa.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
