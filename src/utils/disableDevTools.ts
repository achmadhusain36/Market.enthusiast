/**
 * Security protection module to disable Developer Tools (F12),
 * Inspect Element shortcuts, and Right-Click context menu.
 */

export function initSecurityProtection(): () => void {
  // 1. Block Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, etc.)
  const handleKeyDown = (e: KeyboardEvent) => {
    // F12 key
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      showSecurityNotice();
      return false;
    }

    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    const isShift = e.shiftKey;
    const isAlt = e.altKey;
    const key = e.key ? e.key.toUpperCase() : '';

    // Ctrl + Shift + I (Inspect) or Cmd + Option + I (Mac)
    if ((isCtrlOrCmd && isShift && key === 'I') || (isCtrlOrCmd && isAlt && key === 'I')) {
      e.preventDefault();
      e.stopPropagation();
      showSecurityNotice();
      return false;
    }

    // Ctrl + Shift + J (Console) or Cmd + Option + J (Mac)
    if ((isCtrlOrCmd && isShift && key === 'J') || (isCtrlOrCmd && isAlt && key === 'J')) {
      e.preventDefault();
      e.stopPropagation();
      showSecurityNotice();
      return false;
    }

    // Ctrl + Shift + C (Element Inspector) or Cmd + Option + C (Mac)
    if ((isCtrlOrCmd && isShift && key === 'C') || (isCtrlOrCmd && isAlt && key === 'C')) {
      e.preventDefault();
      e.stopPropagation();
      showSecurityNotice();
      return false;
    }

    // Ctrl + Shift + K (Firefox Console)
    if (isCtrlOrCmd && isShift && key === 'K') {
      e.preventDefault();
      e.stopPropagation();
      showSecurityNotice();
      return false;
    }

    // Ctrl + U or Cmd + U (View Source)
    if (isCtrlOrCmd && key === 'U') {
      e.preventDefault();
      e.stopPropagation();
      showSecurityNotice();
      return false;
    }

    // Ctrl + S or Cmd + S (Save Page)
    if (isCtrlOrCmd && key === 'S') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  // 2. Block Right Click (Context Menu)
  const handleContextMenu = (e: MouseEvent) => {
    // Allow right click if user is clicking on an input/textarea (for cut/copy/paste)
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    showSecurityNotice();
    return false;
  };

  // 3. Temporary Toast Notice on Screen
  let toastTimeout: any = null;
  const showSecurityNotice = () => {
    const existing = document.getElementById('security-notice-toast');
    if (existing) {
      existing.remove();
    }
    clearTimeout(toastTimeout);

    const toast = document.createElement('div');
    toast.id = 'security-notice-toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.zIndex = '999999';
    toast.style.backgroundColor = '#181b24';
    toast.style.color = '#ffffff';
    toast.style.padding = '10px 18px';
    toast.style.borderRadius = '12px';
    toast.style.border = '1px solid #ef4444';
    toast.style.boxShadow = '0 10px 25px -5px rgba(239, 68, 68, 0.3)';
    toast.style.fontFamily = 'system-ui, sans-serif';
    toast.style.fontSize = '12px';
    toast.style.fontWeight = '600';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '8px';
    toast.style.pointerEvents = 'none';
    toast.style.transition = 'opacity 0.25s ease';
    toast.innerHTML = `
      <span style="color: #ef4444; font-size: 14px;">🔒</span>
      <span>Akses Inspect Element & F12 dinonaktifkan demi keamanan terminal.</span>
    `;

    document.body.appendChild(toast);

    toastTimeout = setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 250);
    }, 2400);
  };

  // 4. Console Security Notice
  try {
    console.clear();
    console.log(
      '%cPRO TERMINAL SECURITY ACTIVATED%c\nFitur Inspect Element dan Developer Tools (F12) dinonaktifkan untuk melindungi data transaksi dan terminal.',
      'color: #ef4444; font-size: 16px; font-weight: 800; background: #1a0f0f; padding: 4px 8px; border-radius: 4px; border: 1px solid #ef4444;',
      'color: #94a3b8; font-size: 12px;'
    );
  } catch {
    // Ignore in unsupported environments
  }

  // Register listeners on window and document
  window.addEventListener('keydown', handleKeyDown, { capture: true });
  document.addEventListener('contextmenu', handleContextMenu, { capture: true });

  // Return cleanup function
  return () => {
    window.removeEventListener('keydown', handleKeyDown, { capture: true });
    document.removeEventListener('contextmenu', handleContextMenu, { capture: true });
  };
}
