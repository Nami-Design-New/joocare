import { useInfiniteLookup } from './useInfiniteLookup';

export default function useGetPrimaryLicenses(search = '') {
  const query = useInfiniteLookup({
    endpoint: 'primary-licenses',
    queryKey: 'primary-licenses',
    search,
  });

  return {
    ...query,
    primaryLicenses: query.data?.pages.flatMap((page) => page.data) ?? [],
  };
}
