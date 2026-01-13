const connectBtn = document.getElementById('connectBtn');
const statusEl = document.getElementById('status');
const addressEl = document.getElementById('address');
const informationEl = document.getElementById('information');
const networkEl = document.getElementById('network');
const balanceEl = document.getElementById('balance');
const errorEl = document.getElementById('error');

const AVALANCHE_FUJI_CHAIN_ID = '0xa869';

function showError(message) {
  errorEl.textContent = message;
  errorEl.classList.remove('hidden');
}

function clearError() {
  errorEl.textContent = '';
  errorEl.classList.add('hidden');
}

function formatAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatAvaxBalance(balanceWei) {
  const balance = parseInt(balanceWei, 16);
  return `${(balance / 1e18).toFixed(4)} AVAX`;
}

async function loadBalance(address) {
  const balanceWei = await window.ethereum.request({
    method: 'eth_getBalance',
    params: [address, 'latest'],
  });

  balanceEl.textContent = formatAvaxBalance(balanceWei);
}

async function connectWallet() {
  if (!window.ethereum) {
    showError('Core Wallet tidak terdeteksi!');
    return;
  }

  try {
    clearError();
    connectBtn.disable = true;
    statusEl.textContent = 'Connecting...';

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    const address = accounts[0];
    addressEl.textContent = formatAddress(address);
    informationEl.textContent = 'Adrian Ahmad Al Zidan, 231011403759';

    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    });

    if (chainId !== AVALANCHE_FUJI_CHAIN_ID) {
      statusEl.textContent = 'Wrong Network ❌';
      statusEl.style.color = '#fbc531';
      networkEl.textContent = 'Please switch to Fuji';
      balanceEl.textContent = '-';
      showError('Silahkan ganti network ke Avalanche Fuji');
      return;
    }

    networkEl.textContent = 'Avalanche Fuji';
    statusEl.textContent = 'Connected ✔';
    statusEl.style.color = '#4cd137';

    await loadBalance(address);

    connectBtn.textContent = 'Connected';
    connectBtn.disabled = true;
  } catch (error) {
    console.error(error);
    statusEl.textContent = 'Connection Failed ❌';
    showError('Gagal connect ke wallet');
    connectBtn.disabled = false;
  }
}

connectBtn.addEventListener('click', connectWallet);

if (window.ethereum) {
  window.ethereum.on('accountsChanged', (accounts) => {
    clearError();

    if (accounts.length === 0) {
      statusEl.textContent = 'Disconnected ❌';
      addressEl.textContent = '-';
      balanceEl.textContent = '-';
      connectBtn.textContent = 'Connect Wallet';
      connectBtn.disabled = false;
      showError('Wallet terdisconnect');
      return;
    }

    addressEl.textContent = formatAddress(accounts[0]);
    loadBalance(accounts[0]);
  });

  window.ethereum.on('chainChanged', () => {
    window.location.reload();
  });
}
