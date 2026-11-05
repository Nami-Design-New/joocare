import { DEFAULT_CURRENCY_ID } from '../../constants';

// "$" is shown for the default currency (US Dollar) only.
export default function CurrencySymbol({ currencyId }: { currencyId: string }) {
  if (currencyId !== DEFAULT_CURRENCY_ID) return null;
  return <span aria-hidden>$</span>;
}
