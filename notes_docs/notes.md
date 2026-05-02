TO DO



Files / Values to Create/Update Manually
.env file (copy from .env.example and add real Supabase credentials if needed – for mock it works without).

Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set (any dummy values work with the mock client).

Follow‑up Improvements Recommended (Not Required)
Add a toast notification library (e.g., react-hot-toast) and replace alert calls.

Implement persistent cart using Supabase real tables instead of localStorage.

Add proper form validation (e.g., using react-hook-form).

Add unit and integration tests.

Implement a real backend with Supabase and remove the mock client.

Add code splitting via React.lazy for routes.









________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

Strapi base URL – http://localhost:1337

API response structure – Strapi typically returns { data: [...], meta: {...} }. Confirm:

How are relationships (e.g., artist.city) returned? Populated via ?populate=*? - {"data":[{"id":1,"documentId":"s5pyff8hepe892t71vb6uh2h","name":"Lisboa","slug":"lisboa","image_url":"https://images.unsplash.com/photo-1555881286-ac550fe6aceb?w=800","description":"A capital e a maior cidade de Portugal","is_published":true,"createdAt":"2026-04-23T20:44:51.927Z","updatedAt":"2026-04-23T20:44:51.927Z","publishedAt":"2026-04-23T20:44:51.857Z","artists":[],"artist_events":[]},{"id":2,"documentId":"ekgangwqqemnkmyf8o8zhor5","name":"Porto","slug":"porto","image_url":"https://images.unsplash.com/photo-1548681528-6a846cf386ad?w=800","description":"Cidade histórica no norte de Portugal","is_published":true,"createdAt":"2026-04-23T20:44:52.268Z","updatedAt":"2026-04-23T20:44:52.268Z","publishedAt":"2026-04-23T20:44:52.223Z","artists":[],"artist_events":[]},{"id":3,"documentId":"ibi35wdyary4fi5qei31tezt","name":"Coimbra","slug":"coimbra","image_url":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800","description":"Cidade universitária histórica","is_published":true,"createdAt":"2026-04-23T20:44:52.575Z","updatedAt":"2026-04-23T20:44:52.575Z","publishedAt":"2026-04-23T20:44:52.530Z","artists":[],"artist_events":[]},{"id":4,"documentId":"lxvinahl94x1klbc8jbce2fh","name":"Faro","slug":"faro","image_url":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800","description":"Capital do Algarve","is_published":true,"createdAt":"2026-04-23T20:44:52.932Z","updatedAt":"2026-04-23T20:44:52.932Z","publishedAt":"2026-04-23T20:44:52.886Z","artists":[],"artist_events":[]},{"id":5,"documentId":"x10rvsskj4fibwoawtg60j5j","name":"Aveiro","slug":"aveiro","image_url":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800","description":"Veneza de Portugal","is_published":true,"createdAt":"2026-04-23T20:44:53.245Z","updatedAt":"2026-04-23T20:44:53.245Z","publishedAt":"2026-04-23T20:44:53.201Z","artists":[],"artist_events":[]}],"meta":{"pagination":{"page":1,"pageSize":25,"pageCount":1,"total":5}}}

How do you handle published entries? (e.g., filters[is_published][$eq]=true) - 0	
id	1
documentId	"s5pyff8hepe892t71vb6uh2h"
name	"Lisboa"
slug	"lisboa"
image_url	"https://images.unsplash.com/photo-1555881286-ac550fe6aceb?w=800"
description	"A capital e a maior cidade de Portugal"
is_published	true
createdAt	"2026-04-23T20:44:51.927Z"
updatedAt	"2026-04-23T20:44:51.927Z"
publishedAt	"2026-04-23T20:44:51.857Z"
artists	[]
artist_events	[]
1	


User roles – Strapi has roles (admin, artist, customer). How are they assigned? - the register-login-logout flow is not yet finished. Is there a custom user collection with role field? - Artist and Customer have been created. as user registers for the first time they should choose between visitor and artist.

Image URLs – Strapi returns image objects with url relative to the uploads folder. Should we prepend the base URL? Example: http://localhost:1337/uploads/image.jpg. - Content-Types are created.

Custom endpoints – Do you have any custom Strapi controllers/routes (e.g., quizzes, reviews, cart, orders)? If not, we will need to create them. - used default Content-Types and let the frontend perform direct CRUD

Environment variables – Expected names (e.g., VITE_STRAPI_URL, VITE_STRAPI_TOKEN). - done

CORS settings – Has Strapi been configured to accept requests from the frontend origin? - my strapi project config/middlewares.js: module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];















need different permissions for admin, artist, customer. the roles are created and configured on strapi admin panel. how to create user levels and access flow as follows on this frontend: 1. ENTRAR EM LOGIN.HTML 2. IR PARA REGISTER.HTML (SE NECESSÁRIO) 3. APÓS REGISTO → VOLTA PARA LOGIN 4. LOGIN COM SUCESSO → PRODUCTS.HTML 5. PÁGINA CARREGA PRODUTOS (COM JWT) 6. LOGOUT → VOLTA PARA LOGIN 7. ACESSO DIRETO A PRODUCTS.HTML SEM TOKEN → REDIRECIONA PARA LOGIN


erros a corrigir:
1-as paginas como http://localhost:5173/artista/maria-santos deve ter o mesmo layout e logica que as paginas como http://localhost:5173/cidade/porto, the element <div class="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-12 flex flex-col md:flex-row md:items-end gap-8"><div class="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400" alt="Maria Santos" class="w-full h-full object-cover"></div><div class="flex-1"><div class="flex items-start justify-between gap-4 mb-4"><h1 class="text-white text-4xl md:text-6xl font-light tracking-wider">Maria Santos</h1><div class="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full"><div class="flex gap-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star fill-amber-400 text-amber-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star fill-amber-400 text-amber-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star fill-amber-400 text-amber-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star fill-amber-400 text-amber-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star text-white/30"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></div><span class="text-white/50 text-xs ml-1">4.8</span></div></div><div class="flex flex-wrap items-center gap-4 text-white/50 text-xs tracking-widest uppercase mb-4"><span class="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-palette "><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>Escultura</span><button class="text-amber-400/70 hover:text-amber-400 transition-colors">Ver todos os artistas de </button></div><button class="px-6 py-2 bg-amber-500 text-black font-medium text-xs tracking-[0.2em] uppercase hover:bg-amber-600 rounded transition-colors">Fazer Quiz</button></div></div> should occupy the bottom of the page, below the artworks slider.
2-the element <div class="mb-8"><div class="flex items-center gap-2 mb-4"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-filter text-white/40"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg><span class="text-white/40 text-xs tracking-widest uppercase">Filtrar por Cidade</span></div><div class="flex flex-wrap gap-2"><button class="px-4 py-2 text-xs tracking-wider uppercase transition-all bg-white text-black">Todas as Cidades</button></div></div> displayed in page http://localhost:5173/eventos should be the same as in page http://localhost:5173/artistas : <div class="flex flex-wrap gap-2"><button class="px-4 py-2 text-xs tracking-wider uppercase transition-all bg-white text-black">Todas as Cidades</button><button class="px-4 py-2 text-xs tracking-wider uppercase transition-all bg-white/5 text-white/60 hover:bg-white/10">Lisboa</button><button class="px-4 py-2 text-xs tracking-wider uppercase transition-all bg-white/5 text-white/60 hover:bg-white/10">Porto</button><button class="px-4 py-2 text-xs tracking-wider uppercase transition-all bg-white/5 text-white/60 hover:bg-white/10">Coimbra</button><button class="px-4 py-2 text-xs tracking-wider uppercase transition-all bg-white/5 text-white/60 hover:bg-white/10">Faro</button><button class="px-4 py-2 text-xs tracking-wider uppercase transition-all bg-white/5 text-white/60 hover:bg-white/10">Aveiro</button></div>
3-in pages like http://localhost:5173/admin , the element <button class="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium text-sm tracking-widest uppercase rounded transition-colors whitespace-nowrap"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out "><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>Terminar Sessão</button> should be deleted. it is a duplicate of: <button class="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium text-sm tracking-widest uppercase rounded transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out "><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>Terminar Sessão</button>
4-the element <button class="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium text-sm tracking-widest uppercase rounded transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out "><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>Terminar Sessão</button> must be moved to the lower right corner of the page and display a darker and less vibrant shade of red.

1-remove button <button class="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium text-sm tracking-widest uppercase rounded transition-colors whitespace-nowrap"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out "><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>Terminar Sessão</button> from http://localhost:5173/admin
2-insert button like <button class="pointer-events-auto mt-8 px-10 py-3 border border-white/40 text-white/80 text-xs tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300">Explorar</button> from page http://localhost:5173/cidade/lisboa in pages like http://localhost:5173/artista/joao-silva centered within element <div class="flex items-start justify-between gap-4 mb-4"><h1 class="text-white text-4xl md:text-6xl font-light tracking-wider">João Silva</h1><div class="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full"><div class="flex gap-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star fill-amber-400 text-amber-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star fill-amber-400 text-amber-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star fill-amber-400 text-amber-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star fill-amber-400 text-amber-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star text-white/30"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></div><span class="text-white/50 text-xs ml-1">4.5</span></div></div>. instead of "EXPLORAR" the button should display "PAREDE VIRTUAL" and redirect to test the artwork displayed on the slider at the moment of the click in the page http://localhost:5173/parede-virtual 



customerpage: this part is being hidden under the navbar : return (
    <main className="pt-16 pb-12 bg-[#0d0d0d] text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-light mb-2">Minha Conta</h1>
            <p className="text-gray-400">Bem-vindo, {user?.name}</p>
            what's the best way to make sure the navbar does never hide other elements of the pages?




navbar's following element responsiveness needs a fix:
<nav class="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d] border-b border-white/10"><div class="flex items-center justify-between px-4 sm:px-8 py-4"><div class="flex items-center gap-2"><button class="flex items-center gap-1 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors text-xs sm:text-sm tracking-widest uppercase font-medium" title="Voltar">← <span class="hidden sm:inline">Voltar</span></button></div><a class="absolute left-1/2 -translate-x-1/2 text-white font-light tracking-[0.25em] uppercase text-xs sm:text-sm hover:text-amber-400 transition-colors" href="/">Galeria Portugal</a><div class="flex items-center gap-3"><button class="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors" title="Carrinho"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart "><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg></button><div class="hidden sm:block relative"><button class="flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"><div class="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-medium">A</div><span class="text-sm">admin3@gal.pt</span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down transition-transform "><path d="m6 9 6 6 6-6"></path></svg></button></div><button class="md:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors" title="Abrir menu"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu "><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg></button></div></div><div class="hidden md:flex px-8 py-3 border-t border-white/10 justify-center gap-6"><a class="text-xs tracking-widest uppercase font-medium transition-colors text-white/60 hover:text-white" href="/obras">Galeria</a><a class="text-xs tracking-widest uppercase font-medium transition-colors text-white/60 hover:text-white" href="/artistas">Artistas</a><a class="text-xs tracking-widest uppercase font-medium transition-colors text-white/60 hover:text-white" href="/eventos">Eventos</a><a class="text-xs tracking-widest uppercase font-medium transition-colors text-white/60 hover:text-white" href="/testes">Testes</a><a class="text-xs tracking-widest uppercase font-medium transition-colors text-white/60 hover:text-white" href="/parede-virtual">Parede Virtual</a><a class="text-xs tracking-widest uppercase font-medium transition-colors text-white/60 hover:text-white" href="/loja">Loja</a><a class="text-xs tracking-widest uppercase font-medium transition-colors text-white/60 hover:text-white" href="/sobre">Sobre</a><a class="text-xs tracking-widest uppercase font-medium transition-colors text-white/60 hover:text-white" href="/contacto">Contacto</a><a class="text-xs tracking-widest uppercase font-medium transition-colors text-amber-400" href="/cliente/conta">Minha Conta</a></div></nav>
the following child element when the screen's width is too narrow: <a class="absolute left-1/2 -translate-x-1/2 text-white font-light tracking-[0.25em] uppercase text-xs sm:text-sm hover:text-amber-400 transition-colors" href="/">Galeria Portugal</a> is displayed over <div class="flex items-center gap-3"><button class="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors" title="Carrinho"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart "><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg></button><div class="hidden sm:block relative"><button class="flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"><div class="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-medium">A</div><span class="text-sm">admin3@gal.pt</span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down transition-transform "><path d="m6 9 6 6 6-6"></path></svg></button></div><button class="md:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors" title="Abrir menu"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu "><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg></button></div>
navbar must be resonsive and mobile-friendly








LEM 3 - Gestão de Conteúdos Online - Front/Back-end Galeria

# Frontend
cd galeria-frontend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/Vero279/galeria-portugal-frontend.git
git push -u origin main

# Backend
cd galeria-backend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/Vero279/galeria-portugal-backend.git
git push -u origin main





falta que cada user as artist criado (conta) crie um perfil Artist onde o utilizador possa fazer upload dos seus artworks
AuthContext.tsx:33 User role missing, defaulting to customer {id: 2, documentId: 'a8yeubyk3tblibr2mib56md5', username: 'admin2@gal.pt', email: 'admin2@gal.pt', provider: 'local', …}
getUserRole @ AuthContext.tsx:33
mapStrapiUser @ AuthContext.tsx:42
(anonymous) @ AuthContext.tsx:55
Promise.then
(anonymous) @ AuthContext.tsx:55
commitHookEffectListMount @ chunk-M324AGAM.js?v=734274a3:16913
commitPassiveMountOnFiber @ chunk-M324AGAM.js?v=734274a3:18154
commitPassiveMountEffects_complete @ chunk-M324AGAM.js?v=734274a3:18127
commitPassiveMountEffects_begin @ chunk-M324AGAM.js?v=734274a3:18117
commitPassiveMountEffects @ chunk-M324AGAM.js?v=734274a3:18107
flushPassiveEffectsImpl @ chunk-M324AGAM.js?v=734274a3:19488
flushPassiveEffects @ chunk-M324AGAM.js?v=734274a3:19445
(anonymous) @ chunk-M324AGAM.js?v=734274a3:19326
workLoop @ chunk-M324AGAM.js?v=734274a3:195
flushWork @ chunk-M324AGAM.js?v=734274a3:174
performWorkUntilDeadline @ chunk-M324AGAM.js?v=734274a3:382
postMessage
schedulePerformWorkUntilDeadline @ chunk-M324AGAM.js?v=734274a3:405
performWorkUntilDeadline @ chunk-M324AGAM.js?v=734274a3:385
postMessage
schedulePerformWorkUntilDeadline @ chunk-M324AGAM.js?v=734274a3:405
requestHostCallback @ chunk-M324AGAM.js?v=734274a3:416
unstable_scheduleCallback @ chunk-M324AGAM.js?v=734274a3:328
scheduleCallback$1 @ chunk-M324AGAM.js?v=734274a3:19824
ensureRootIsScheduled @ chunk-M324AGAM.js?v=734274a3:18650
scheduleUpdateOnFiber @ chunk-M324AGAM.js?v=734274a3:18560
updateContainer @ chunk-M324AGAM.js?v=734274a3:20774
ReactDOMHydrationRoot.render.ReactDOMRoot.render @ chunk-M324AGAM.js?v=734274a3:21114
(anonymous) @ main.tsx:35Understand this warning
AuthContext.tsx:33 User role missing, defaulting to customer {id: 2, documentId: 'a8yeubyk3tblibr2mib56md5', username: 'admin2@gal.pt', email: 'admin2@gal.pt', provider: 'local', …}