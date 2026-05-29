import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage(): JSX.Element {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // Pré‑preencher com os dados passados pelo Navbar
  useEffect(() => {
    if (location.state) {
      const { name, email } = location.state as { name?: string; email?: string };
      setFormData(prev => ({
        ...prev,
        name: name || '',
        email: email || '',
      }));
    }
  }, [location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-white text-xs uppercase tracking-widest mb-2">Nome Completo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="block text-white text-xs uppercase tracking-widest mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="block text-white text-xs uppercase tracking-widest mb-2">Assunto</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:border-amber-500"
            >
              <option value="" className="text-gray-900">Seleccione um tema...</option>
              <option value="general" className="text-gray-900">Informação Geral</option>
              <option value="artist" className="text-gray-900">Sobre um Artista</option>
              <option value="event" className="text-gray-900">Informação de Eventos</option>
              <option value="partnership" className="text-gray-900">Parcerias</option>
              <option value="feedback" className="text-gray-900">Feedback</option>
              <option value="other" className="text-gray-900">Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-white text-xs uppercase tracking-widest mb-2">Mensagem</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 resize-none"
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

        {/* ... resto do FAQ e informações adicionais (mantém igual) ... */}
      </div>
    </div>
    </div>
  );
}