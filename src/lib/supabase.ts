// Mock Supabase Client with localStorage for local development
// This provides a drop-in replacement using in-memory data

class MockQuery {
  private tableData: any[];
  private filters: Array<{ field: string; value: any }> = [];
  private sortField: string | null = null;
  private sortAscending: boolean = true;

  constructor(tableData: any[]) {
    this.tableData = tableData;
  }

  eq(field: string, value: any): MockQuery {
    this.filters.push({ field, value });
    return this;
  }

  order(field: string, options?: { ascending: boolean }): MockQuery {
    this.sortField = field;
    this.sortAscending = options?.ascending !== false;
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  select(_fields?: string): MockQuery {
    return this;
  }

  private getData(): any[] {
    let result = [...this.tableData];

    // Apply filters
    for (const filter of this.filters) {
      result = result.filter((row) => row[filter.field] === filter.value);
    }

    // Apply sorting
    if (this.sortField) {
      result.sort((a, b) => {
        const aVal = String(a[this.sortField!]);
        const bVal = String(b[this.sortField!]);
        const comparison = aVal.localeCompare(bVal);
        return this.sortAscending ? comparison : -comparison;
      });
    }

    return result;
  }

  async maybeSingle() {
    return { data: this.getData()[0] || null };
  }

  then(cb: ((result: { data: any[] }) => void) | null, errorCb?: () => void) {
    try {
      const result = { data: this.getData() };
      if (cb) {
        cb(result);
      }
      return Promise.resolve(result);
    } catch (error) {
      if (errorCb) {
        errorCb();
      }
      return Promise.reject(error);
    }
  }
}

class MockSupabaseClient {
  private data: Record<string, any[]> = {};

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize with mock data
    this.data = {
      cities: [
        {
          id: '1',
          name: 'Lisboa',
          slug: 'lisboa',
          image_url: 'https://images.unsplash.com/photo-1555881286-ac550fe6aceb?w=800',
          description: 'A capital e a maior cidade de Portugal',
          is_published: true,
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Porto',
          slug: 'porto',
          image_url: 'https://images.unsplash.com/photo-1548681528-6a846cf386ad?w=800',
          description: 'Cidade histórica no norte de Portugal',
          is_published: true,
          created_at: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Coimbra',
          slug: 'coimbra',
          image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
          description: 'Cidade universitária histórica no centro de Portugal',
          is_published: true,
          created_at: new Date().toISOString(),
        },
        {
          id: '4',
          name: 'Faro',
          slug: 'faro',
          image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
          description: 'Capital do Algarve, conhecida pelas praias e arquitetura mourisca',
          is_published: true,
          created_at: new Date().toISOString(),
        },
        {
          id: '5',
          name: 'Aveiro',
          slug: 'aveiro',
          image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
          description: 'Cidade conhecida como "Veneza de Portugal" pelos seus canais',
          is_published: true,
          created_at: new Date().toISOString(),
        },
      ],
      artists: [
        {
          id: '1',
          city_id: '1',
          name: 'João Silva',
          slug: 'joao-silva',
          bio: 'Artista contemporâneo português',
          profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          cover_image: 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=800',
          medium: 'Pintura',
          is_published: true,
          rating: 4.5,
          total_reviews: 12,
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          city_id: '2',
          name: 'Maria Santos',
          slug: 'maria-santos',
          bio: 'Escultora e instaladora',
          profile_image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
          cover_image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
          medium: 'Escultura',
          is_published: true,
          rating: 4.8,
          total_reviews: 15,
          created_at: new Date().toISOString(),
        },
        {
          id: '3',
          city_id: '3',
          name: 'Pedro Costa',
          slug: 'pedro-costa',
          bio: 'Artista multidisciplinar focado em arte urbana e intervenção pública',
          profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          cover_image: 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=800',
          medium: 'Arte Urbana',
          is_published: true,
          rating: 4.3,
          total_reviews: 8,
          created_at: new Date().toISOString(),
        },
        {
          id: '4',
          city_id: '3',
          name: 'Ana Rodrigues',
          slug: 'ana-rodrigues',
          bio: 'Fotógrafa especializada em arquitetura histórica e patrimônio cultural',
          profile_image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
          cover_image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
          medium: 'Fotografia',
          is_published: true,
          rating: 4.6,
          total_reviews: 11,
          created_at: new Date().toISOString(),
        },
        {
          id: '5',
          city_id: '4',
          name: 'Miguel Ferreira',
          slug: 'miguel-ferreira',
          bio: 'Artista plástico inspirado pela luz e cores do Algarve',
          profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          cover_image: 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=800',
          medium: 'Pintura',
          is_published: true,
          rating: 4.4,
          total_reviews: 9,
          created_at: new Date().toISOString(),
        },
        {
          id: '6',
          city_id: '4',
          name: 'Carla Mendes',
          slug: 'carla-mendes',
          bio: 'Ceramista contemporânea que combina tradições mouriscas com design moderno',
          profile_image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
          cover_image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
          medium: 'Cerâmica',
          is_published: true,
          rating: 4.7,
          total_reviews: 13,
          created_at: new Date().toISOString(),
        },
        {
          id: '7',
          city_id: '5',
          name: 'Tiago Alves',
          slug: 'tiago-alves',
          bio: 'Artista digital que explora a relação entre tecnologia e natureza',
          profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          cover_image: 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=800',
          medium: 'Arte Digital',
          is_published: true,
          rating: 4.5,
          total_reviews: 10,
          created_at: new Date().toISOString(),
        },
        {
          id: '8',
          city_id: '5',
          name: 'Sofia Pereira',
          slug: 'sofia-pereira',
          bio: 'Escultora especializada em formas orgânicas inspiradas na ria de Aveiro',
          profile_image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
          cover_image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
          medium: 'Escultura',
          is_published: true,
          rating: 4.9,
          total_reviews: 16,
          created_at: new Date().toISOString(),
        },
      ],
      artworks: [
        {
          id: '1',
          artist_id: '1',
          title: 'Abstração Urbana',
          image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
          year: 2023,
          medium: 'Acrílico sobre tela',
          dimensions: '100x150cm',
          price: 2500,
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          artist_id: '2',
          title: 'Formas Geométricas',
          image_url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600',
          year: 2023,
          medium: 'Acrílico sobre tela',
          dimensions: '90x120cm',
          price: 1800,
          created_at: new Date().toISOString(),
        },
        {
          id: '3',
          artist_id: '1',
          title: 'Reflexo Noturno',
          image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600',
          year: 2023,
          medium: 'Óleo sobre tela',
          dimensions: '120x80cm',
          price: 3200,
          created_at: new Date().toISOString(),
        },
        {
          id: '4',
          artist_id: '2',
          title: 'Expressão em Pedra',
          image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
          year: 2022,
          medium: 'Escultura em granito',
          dimensions: '85x60cm',
          price: 4500,
          created_at: new Date().toISOString(),
        },
        {
          id: '5',
          artist_id: '1',
          title: 'Cores em Harmonia',
          image_url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600',
          year: 2024,
          medium: 'Acrílico sobre tela',
          dimensions: '110x140cm',
          price: 2800,
          created_at: new Date().toISOString(),
        },
        {
          id: '6',
          artist_id: '2',
          title: 'Instalação Contemporânea',
          image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600',
          year: 2024,
          medium: 'Instalação mista',
          dimensions: '200x300cm',
          price: 5500,
          created_at: new Date().toISOString(),
        },
        {
          id: '7',
          artist_id: '1',
          title: 'Movimento Abstrato',
          image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
          year: 2023,
          medium: 'Técnica mista',
          dimensions: '130x90cm',
          price: 2100,
          created_at: new Date().toISOString(),
        },
        {
          id: '8',
          artist_id: '2',
          title: 'Equilíbrio Perfeito',
          image_url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600',
          year: 2024,
          medium: 'Acrílico sobre madeira',
          dimensions: '95x75cm',
          price: 1900,
          created_at: new Date().toISOString(),
        },
        {
          id: '9',
          artist_id: '1',
          title: 'Luz e Sombra',
          image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600',
          year: 2022,
          medium: 'Óleo sobre tela',
          dimensions: '140x100cm',
          price: 3600,
          created_at: new Date().toISOString(),
        },
        {
          id: '10',
          artist_id: '2',
          title: 'Texturas Urbanas',
          image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
          year: 2023,
          medium: 'Colagem digital',
          dimensions: '80x120cm',
          price: 1600,
          created_at: new Date().toISOString(),
        },
        {
          id: '11',
          artist_id: '1',
          title: 'Paisagem Interior',
          image_url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600',
          year: 2024,
          medium: 'Aquarela sobre papel',
          dimensions: '70x100cm',
          price: 1200,
          created_at: new Date().toISOString(),
        },
        {
          id: '12',
          artist_id: '2',
          title: 'Formas Orgânicas',
          image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600',
          year: 2023,
          medium: 'Escultura em bronze',
          dimensions: '60x40x30cm',
          price: 4200,
          created_at: new Date().toISOString(),
        },
        {
          id: '13',
          artist_id: '1',
          title: 'Composição Moderna',
          image_url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600',
          year: 2024,
          medium: 'Óleo sobre tela',
          dimensions: '125x95cm',
          price: 2900,
          created_at: new Date().toISOString(),
        },
        {
          id: '14',
          artist_id: '2',
          title: 'Estrutura Metálica',
          image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600',
          year: 2023,
          medium: 'Instalação metálica',
          dimensions: '180x120cm',
          price: 4800,
          created_at: new Date().toISOString(),
        },
        {
          id: '15',
          artist_id: '1',
          title: 'Explosão de Cores',
          image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
          year: 2023,
          medium: 'Acrílico sobre tela',
          dimensions: '150x110cm',
          price: 3400,
          created_at: new Date().toISOString(),
        },
        {
          id: '16',
          artist_id: '2',
          title: 'Minimalismo Urbano',
          image_url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600',
          year: 2024,
          medium: 'Fotografia artística',
          dimensions: '100x150cm',
          price: 2200,
          created_at: new Date().toISOString(),
        },
        {
          id: '17',
          artist_id: '1',
          title: 'Abstração Líquida',
          image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600',
          year: 2023,
          medium: 'Tinta acrílica fluida',
          dimensions: '120x80cm',
          price: 2600,
          created_at: new Date().toISOString(),
        },
        {
          id: '18',
          artist_id: '2',
          title: 'Volume e Espaço',
          image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
          year: 2022,
          medium: 'Escultura cinética',
          dimensions: '90x70x50cm',
          price: 5100,
          created_at: new Date().toISOString(),
        },
        {
          id: '19',
          artist_id: '1',
          title: 'Ritmo Visual',
          image_url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600',
          year: 2024,
          medium: 'Pintura digital',
          dimensions: '110x140cm',
          price: 2400,
          created_at: new Date().toISOString(),
        },
        {
          id: '20',
          artist_id: '2',
          title: 'Intersecções',
          image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600',
          year: 2023,
          medium: 'Instalação interativa',
          dimensions: '250x180cm',
          price: 6200,
          created_at: new Date().toISOString(),
        },
        {
          id: '21',
          artist_id: '1',
          title: 'Contrastes',
          image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
          year: 2024,
          medium: 'Técnica mista sobre tela',
          dimensions: '135x105cm',
          price: 3100,
          created_at: new Date().toISOString(),
        },
        {
          id: '22',
          artist_id: '2',
          title: 'Elementos Naturais',
          image_url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600',
          year: 2023,
          medium: 'Cerâmica contemporânea',
          dimensions: '75x55cm',
          price: 1800,
          created_at: new Date().toISOString(),
        },
        {
          id: '23',
          artist_id: '1',
          title: 'Movimento Fluido',
          image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600',
          year: 2023,
          medium: 'Acrílico e spray',
          dimensions: '160x120cm',
          price: 3800,
          created_at: new Date().toISOString(),
        },
        {
          id: '24',
          artist_id: '2',
          title: 'Arquitetura Viva',
          image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
          year: 2024,
          medium: 'Instalação biológica',
          dimensions: '300x200cm',
          price: 7500,
          created_at: new Date().toISOString(),
        },
        {
          id: '25',
          artist_id: '3',
          title: 'Mural Urbano',
          image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
          year: 2023,
          medium: 'Grafite e spray',
          dimensions: '400x300cm',
          price: 5200,
          created_at: new Date().toISOString(),
        },
        {
          id: '26',
          artist_id: '3',
          title: 'Intervenção Pública',
          image_url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600',
          year: 2024,
          medium: 'Instalação urbana',
          dimensions: '250x180cm',
          price: 4100,
          created_at: new Date().toISOString(),
        },
        {
          id: '27',
          artist_id: '4',
          title: 'Universidade Antiga',
          image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600',
          year: 2023,
          medium: 'Fotografia arquitetônica',
          dimensions: '120x80cm',
          price: 1900,
          created_at: new Date().toISOString(),
        },
        {
          id: '28',
          artist_id: '4',
          title: 'Patrimônio Cultural',
          image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
          year: 2024,
          medium: 'Fotografia artística',
          dimensions: '100x150cm',
          price: 2200,
          created_at: new Date().toISOString(),
        },
        {
          id: '29',
          artist_id: '5',
          title: 'Luz do Algarve',
          image_url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600',
          year: 2023,
          medium: 'Óleo sobre tela',
          dimensions: '140x100cm',
          price: 3600,
          created_at: new Date().toISOString(),
        },
        {
          id: '30',
          artist_id: '5',
          title: 'Costa Vibrante',
          image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600',
          year: 2024,
          medium: 'Acrílico sobre tela',
          dimensions: '130x90cm',
          price: 3100,
          created_at: new Date().toISOString(),
        },
        {
          id: '31',
          artist_id: '6',
          title: 'Tradição Mourisca',
          image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
          year: 2023,
          medium: 'Cerâmica esmaltada',
          dimensions: '60x40cm',
          price: 1400,
          created_at: new Date().toISOString(),
        },
        {
          id: '32',
          artist_id: '6',
          title: 'Azulejos Modernos',
          image_url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600',
          year: 2024,
          medium: 'Cerâmica contemporânea',
          dimensions: '80x60cm',
          price: 1800,
          created_at: new Date().toISOString(),
        },
        {
          id: '33',
          artist_id: '7',
          title: 'Ria Digital',
          image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600',
          year: 2023,
          medium: 'Arte digital interativa',
          dimensions: '150x100cm',
          price: 2900,
          created_at: new Date().toISOString(),
        },
        {
          id: '34',
          artist_id: '7',
          title: 'Natureza Codificada',
          image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
          year: 2024,
          medium: 'Instalação digital',
          dimensions: '200x150cm',
          price: 4200,
          created_at: new Date().toISOString(),
        },
        {
          id: '35',
          artist_id: '8',
          title: 'Formas Aquáticas',
          image_url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600',
          year: 2023,
          medium: 'Escultura em resina',
          dimensions: '90x70x50cm',
          price: 3800,
          created_at: new Date().toISOString(),
        },
        {
          id: '36',
          artist_id: '8',
          title: 'Onda Viva',
          image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600',
          year: 2024,
          medium: 'Escultura cinética',
          dimensions: '120x80x60cm',
          price: 5100,
          created_at: new Date().toISOString(),
        },
      ],
      artwork_descriptions: [
        {
          id: '1',
          artwork_id: '1',
          description: 'Uma exploração fascinante das cores e formas urbanas modernas.',
        },
        {
          id: '2',
          artwork_id: '2',
          description: 'Composição baseada em formas geométricas puras e cores vibrantes.',
        },
        {
          id: '3',
          artwork_id: '3',
          description: 'Uma reflexão poética sobre a luz e a escuridão da noite urbana.',
        },
        {
          id: '4',
          artwork_id: '4',
          description: 'Escultura que interpreta os sentimentos humanos através de formas abstratas em pedra.',
        },
        {
          id: '5',
          artwork_id: '5',
          description: 'Pintura que celebra a harmonia e o equilíbrio entre cores complementares.',
        },
        {
          id: '6',
          artwork_id: '6',
          description: 'Instalação imersiva que convida o espectador a repensar espaços e percepções.',
        },
        {
          id: '25',
          artwork_id: '25',
          description: 'Mural urbano que transforma a paisagem urbana em uma tela viva de expressão artística.',
        },
        {
          id: '26',
          artwork_id: '26',
          description: 'Intervenção artística que dialoga com o espaço público e a comunidade local.',
        },
        {
          id: '27',
          artwork_id: '27',
          description: 'Fotografia que captura a majestade da arquitetura histórica da Universidade de Coimbra.',
        },
        {
          id: '28',
          artwork_id: '28',
          description: 'Exploração fotográfica do patrimônio cultural e sua importância na identidade coletiva.',
        },
        {
          id: '29',
          artwork_id: '29',
          description: 'Pintura que captura a intensa luz mediterrânea característica do Algarve.',
        },
        {
          id: '30',
          artwork_id: '30',
          description: 'Representação vibrante da costa algarvia e sua energia vital.',
        },
        {
          id: '31',
          artwork_id: '31',
          description: 'Cerâmica que funde tradições mouriscas com linguagem contemporânea.',
        },
        {
          id: '32',
          artwork_id: '32',
          description: 'Azulejos modernos que reinterpretam a arte tradicional portuguesa.',
        },
        {
          id: '33',
          artwork_id: '33',
          description: 'Arte digital que explora a interação entre tecnologia e os canais de Aveiro.',
        },
        {
          id: '34',
          artwork_id: '34',
          description: 'Instalação que questiona os limites entre natureza digital e realidade física.',
        },
        {
          id: '35',
          artwork_id: '35',
          description: 'Escultura que evoca as formas fluidas da ria de Aveiro e seus movimentos.',
        },
        {
          id: '36',
          artwork_id: '36',
          description: 'Escultura cinética que representa o constante movimento das águas.',
        },
      ],
      artist_events: [
        {
          id: '1',
          city_id: '1',
          artist_id: '1',
          title: 'Exposição de Primavera',
          description: 'Uma nova coleção de trabalhos contemporâneos',
          event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Galeria Central, Lisboa',
          image_url: 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=600',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          city_id: '2',
          artist_id: '2',
          title: 'Instalação de Verão',
          description: 'Novas obras de escultura e instalação mista',
          event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Museu de Arte Contemporânea, Porto',
          image_url: 'https://images.unsplash.com/photo-1561214115-6d2f1b0c68f2?w=600',
          created_at: new Date().toISOString(),
        },
      ],
      artist_quizzes: [
        {
          id: '1',
          artist_id: '1',
          title: 'Teste Conhecimento João Silva',
          description: 'Quanto conhece sobre João Silva?',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          artist_id: '2',
          title: 'Teste Conhecimento Maria Santos',
          description: 'Quanto conhece sobre Maria Santos?',
          created_at: new Date().toISOString(),
        },
      ],
      quiz_questions: [
        {
          id: '1',
          quiz_id: '1',
          question: 'Em que ano João Silva começou a pintar?',
          correct_answer: 'b',
          option_a: '2005',
          option_b: '2010',
          option_c: '2015',
          option_d: '2020',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          quiz_id: '1',
          question: 'Qual é o medium principal de João Silva?',
          correct_answer: 'b',
          option_a: 'Escultura',
          option_b: 'Pintura',
          option_c: 'Fotografia',
          option_d: 'Instalação',
          created_at: new Date().toISOString(),
        },
        {
          id: '3',
          quiz_id: '1',
          question: 'Em que cidade reside João Silva?',
          correct_answer: 'a',
          option_a: 'Lisboa',
          option_b: 'Porto',
          option_c: 'Covilhã',
          option_d: 'Évora',
          created_at: new Date().toISOString(),
        },
        {
          id: '4',
          quiz_id: '2',
          question: 'Qual é o medium principal de Maria Santos?',
          correct_answer: 'a',
          option_a: 'Escultura',
          option_b: 'Pintura',
          option_c: 'Fotografia',
          option_d: 'Cerâmica',
          created_at: new Date().toISOString(),
        },
        {
          id: '5',
          quiz_id: '2',
          question: 'Em que cidade reside Maria Santos?',
          correct_answer: 'b',
          option_a: 'Lisboa',
          option_b: 'Porto',
          option_c: 'Braga',
          option_d: 'Aveiro',
          created_at: new Date().toISOString(),
        },
        {
          id: '6',
          quiz_id: '2',
          question: 'Quantas críticas positivas teve Maria Santos?',
          correct_answer: 'c',
          option_a: '5',
          option_b: '10',
          option_c: '15',
          option_d: '20',
          created_at: new Date().toISOString(),
        },
      ],
      products: [
        {
          id: '1',
          artist_id: '1',
          artwork_id: '1',
          title: 'Abstração Urbana - Original',
          description: 'Pintura original de João Silva',
          image_url: 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=600',
          price: 2500,
          category: 'artwork',
          stock_quantity: 1,
          is_available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          artist_id: '1',
          title: 'Poster - Abstração Urbana',
          description: 'Reprodução em poster de alta qualidade',
          image_url: 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=600',
          price: 25,
          category: 'print',
          stock_quantity: 50,
          is_available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '3',
          artist_id: '2',
          artwork_id: '2',
          title: 'Formas Geométricas - Original',
          description: 'Escultura original de Maria Santos',
          image_url: 'https://images.unsplash.com/photo-1561214115-6d2f1b0c68f2?w=600',
          price: 3500,
          category: 'artwork',
          stock_quantity: 1,
          is_available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '4',
          artist_id: '1',
          artwork_id: '3',
          title: 'Reflexo Noturno - Original',
          description: 'Óleo original sobre tela de João Silva',
          image_url: 'https://images.unsplash.com/photo-1561214115-6d2f1b0c68f2?w=600',
          price: 3200,
          category: 'artwork',
          stock_quantity: 1,
          is_available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '5',
          artist_id: '2',
          title: 'Livro de Arte - Maria Santos',
          description: 'Monografia e catálogo completo de suas obras',
          image_url: 'https://images.unsplash.com/photo-1561214115-6d2f1b0c68f2?w=600',
          price: 45,
          category: 'book',
          stock_quantity: 30,
          is_available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '6',
          artist_id: '1',
          title: 'Camiseta - Abstração Urbana',
          description: 'Camiseta de algodão com impressão de alta qualidade',
          image_url: 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=600',
          price: 35,
          category: 'merchandise',
          stock_quantity: 100,
          is_available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      cart_items: [],
      orders: [],
      order_items: [],
      artwork_reviews: [],
      quiz_answers: [],
      user_discounts: [],
    };
  }

  from(table: string) {
    const tableData = this.data[table] || [];

    return {
      select: (_fields?: string) => {
        return new MockQuery(tableData);
      },
      insert: (values: any) => {
        const newData = Array.isArray(values) ? values : [values];
        this.data[table] = [...this.data[table], ...newData];
        return {
          select: () => ({
            maybeSingle: () =>
              Promise.resolve({ data: newData[0] || null }),
          }),
        };
      },
      delete: () => ({
        eq: (field: string, value: any) => {
          this.data[table] = this.data[table].filter((row) => row[field] !== value);
          return Promise.resolve();
        },
      }),
      update: (values: any) => ({
        eq: (field: string, value: any) => {
          this.data[table] = this.data[table].map((row) =>
            row[field] === value ? { ...row, ...values } : row
          );
          return Promise.resolve();
        },
      }),
    };
  }
}

export const supabase = new MockSupabaseClient() as any;
