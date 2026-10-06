declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function connectMetaMask(): Promise<{ address: string | null; error: string | null }> {
  if (typeof window === 'undefined' || !window.ethereum) {
    return {
      address: null,
      error: 'MetaMask tidak terdeteksi di browser ini. Silakan pasang ekstensi MetaMask.',
    };
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts && accounts.length > 0) {
      return { address: accounts[0], error: null };
    }
    return { address: null, error: 'Tidak ada akun yang dipilih.' };
  } catch (err: any) {
    return { address: null, error: err.message || 'Gagal menghubungkan MetaMask.' };
  }
}

export function isMetaMaskInstalled(): boolean {
  return typeof window !== 'undefined' && Boolean(window.ethereum);
}
