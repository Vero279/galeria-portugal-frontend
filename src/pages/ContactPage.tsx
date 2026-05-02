import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage(): React.ReactNode {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui irá integrar com um serviço de email (Supabase, SendGrid, etc)
    console.log('Formulário enviado:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] pt-40 pb-12">
      <div className="max-w-5xl mx-auto px-8">
        <div className="mb-16">
          <h1 className="text-white text-5xl md:text-6xl font-light tracking-wider mb-4">
            Entre em Contacto
          </h1>
          <p className="text-white/50 text-sm">
            Tem perguntas sobre a Galeria Portugal, artistas ou eventos? Gostaríamos de ouvir de si.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Informações de Contacto */}
          <div className="lg:col-span-1">
            <h2 className="text-white text-2xl font-light tracking-wider mb-8">Informações</h2>

            <div className="space-y-6">
              <a
                href="mailto:hello@galeria-portugal.pt"
                className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group"
              >
                <Mail size={20} className="text-amber-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Email</p>
                  <p className="text-white font-light">hello@galeria-portugal.pt</p>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <Phone size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Telefone</p>
                  <p className="text-white font-light">+351 912 345 678</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <MapPin size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Localização</p>
                  <p className="text-white font-light text-sm">Porto, Portugal</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <h3 className="text-white text-sm font-light tracking-wider mb-4 uppercase">Redes Sociais</h3>
              <div className="flex gap-4">
                {['Instagram', 'Facebook', 'LinkedIn'].map(social => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all"
                    title={social}
                  >
                    {social[0]}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Formulário de Contacto */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-white text-xs uppercase tracking-widest mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="O seu nome"
              />
            </div>

            <div>
              <label className="block text-white text-xs uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="seu.email@exemplo.com"
              />
            </div>

            <div>
              <label className="block text-white text-xs uppercase tracking-widest mb-2">
                Assunto
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:border-white/30 transition-colors"
              >
                <option value="">Seleccione um tema...</option>
                <option value="general">Informação Geral</option>
                <option value="artist">Sobre um Artista</option>
                <option value="event">Informação de Eventos</option>
                <option value="partnership">Parcerias</option>
                <option value="feedback">Feedback</option>
                <option value="other">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-white text-xs uppercase tracking-widest mb-2">
                Mensagem
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors resize-none"
                placeholder="A sua mensagem..."
              />
            </div>

            <button
              type="submit"
              className={`w-full px-8 py-4 font-light tracking-wider uppercase text-sm transition-all ${
                submitted
                  ? 'bg-green-500/20 border border-green-500 text-green-400'
                  : 'bg-white text-black hover:bg-white/90'
              }`}
            >
              {submitted ? '✓ Mensagem Enviada' : 'Enviar Mensagem'}
            </button>
          </form>
        </div>

        {/* Mapa ou Informação Adicional */}
        <div className="mt-16 pt-16 border-t border-white/10">
          <h2 className="text-white text-2xl font-light tracking-wider mb-8">Perguntas Frequentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: 'Como faço compras de obras de arte?',
                answer: 'Pode contactar directamente o artista através do nosso site ou enviar-nos um email para mais informações.'
              },
              {
                question: 'Posso vender as minhas obras na plataforma?',
                answer: 'Somos sempre abertos a parcerias! Entre em contacto para discutir oportunidades.'
              },
              {
                question: 'Como funcionam os quizzes?',
                answer: 'Responda às perguntas sobre artistas e ganhe descontos exclusivos nas obras de arte.'
              },
              {
                question: 'Qual é o custo de envio?',
                answer: 'O custo de envio varia com o tamanho da obra. Entre em contacto para uma cotação.'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-white/5 rounded-lg border border-white/10">
                <h3 className="text-white font-light tracking-wider mb-3">{item.question}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
