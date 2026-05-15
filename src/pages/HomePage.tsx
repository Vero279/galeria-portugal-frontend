import { useNavigate } from 'react-router-dom';
import FullscreenSlider from '../components/common/FullscreenSlider';
import { useCities } from '../hooks/useCities';
import { ROUTES } from '../lib/constants';

export default function HomePage() {
  const { cities, loading } = useCities();
  const navigate = useNavigate();

  const slides = cities.map(city => ({
    id: city.slug,
    title: city.name,
    subtitle: city.description ? city.description.replace(/<[^>]*>/g, '') : '',
    image_url: city.image_url,
  }));

  const handleSelect = (slug: string) => {
    navigate(ROUTES.CITY.replace(':citySlug', slug));
  };

  return <FullscreenSlider slides={slides} loading={loading} onSelect={handleSelect} />;
}