export async function closeMenu() {
  // Close dropdown menu if open
  const menuButton = document.querySelector('button[aria-label="Menu"]') as HTMLButtonElement;
  if (menuButton?.getAttribute('aria-expanded') === 'true') {
    menuButton.click();
  }

  // Close any open modals
  const modals = document.querySelectorAll('dialog[open]');
  modals.forEach(modal => modal.close());

  // Wait for animations to complete
  return new Promise(resolve => setTimeout(resolve, 300));
}