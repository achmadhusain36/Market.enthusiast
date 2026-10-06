import { MOCK_ASSETS, Asset } from '../data/mockAssets';

// CoinGecko ID mapping for crypto assets
const COINGECKO_MAP: Record<string, string> = {
  'BTC/USD': 'bitcoin',
  'ETH/USD': 'ethereum',
  'SOL/USD': 'solana',
  'BNB/USD': 'binancecoin',
  'XRP/USD': 'ripple',
};

export async function fetchLiveCryptoPrices(): Promise<Record<string, { usd: number; usd_24h_change: number }>> {
  try {
    const ids = Object.values(COINGECKO_MAP).join(',');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!res.ok) throw new Error('CoinGecko API rate limit or error');
    return await res.json();
  } catch (err) {
    // Graceful fallback: return null to let mockAssets handle it
    return {};
  }
}

export function mergeLiveMarketData(
  assets: Asset[],
  livePrices: Record<string, { usd: number; usd_24h_change: number }>
): Asset[] {
  if (!livePrices || Object.keys(livePrices).length === 0) return assets;

  return assets.map((asset) => {
    const cgId = COINGECKO_MAP[asset.symbol];
    if (cgId && livePrices[cgId]) {
      const data = livePrices[cgId];
      const newPrice = data.usd || asset.price;
      const changePct = Number((data.usd_24h_change || asset.changePercent24h).toFixed(2));
      const diff = newPrice - (newPrice / (1 + changePct / 100));
      return {
        ...asset,
        price: newPrice,
        change24h: Number(diff.toFixed(2)),
        changePercent24h: changePct,
        sparkline: [...asset.sparkline.slice(1), newPrice],
      };
    }
    return asset;
  });
}
