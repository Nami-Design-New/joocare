import { useInfiniteLookup } from './useInfiniteLookup';

export default function useGetReligions(search = '') {
  const query = useInfiniteLookup({
    endpoint: 'religions',
    queryKey: 'religions',
    search,
  });

  return {
    ...query,
    religions: query.data?.pages.flatMap((page) => page.data) ?? [],
  };
}
