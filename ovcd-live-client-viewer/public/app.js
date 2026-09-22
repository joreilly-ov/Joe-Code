const refreshButton = document.querySelector('#refresh');
const state = document.querySelector('#state');
const lastFetched = document.querySelector('#last-fetched');
const message = document.querySelector('#message');
const clients = document.querySelector('#clients');
const diagnostics = document.querySelector('#diagnostics');

refreshButton.addEventListener('click', refresh);
loadLastState();

async function loadLastState() {
  try {
    const response = await fetch('/api/clients');
    const result = await response.json();
    if (result.clients?.length) {
      render(result);
      state.textContent = 'Showing the last good snapshot';
    }
  } catch (_error) {
  }
}

async function refresh() {
  refreshButton.disabled = true;
  state.textContent = 'Opening OVCD and collecting Live clients...';
  message.hidden = true;

  try {
    const response = await fetch('/api/refresh', { method: 'POST' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Refresh failed.');
    if (!Array.isArray(result.clients)) {
      throw new Error(result.message || 'Refresh did not return client data.');
    }
    render(result);
    state.textContent = `${result.clients.length} Live client${result.clients.length === 1 ? '' : 's'} found`;
  } catch (error) {
    state.textContent = 'Refresh failed';
    message.textContent = error.message;
    message.hidden = false;
  } finally {
    refreshButton.disabled = false;
  }
}

function render(result) {
  const clientList = Array.isArray(result.clients) ? result.clients : [];
  clients.replaceChildren();
  if (!clientList.length) {
    const row = document.createElement('tr');
    row.className = 'empty';
    row.innerHTML = '<td colspan="5">No Live clients detected.</td>';
    clients.append(row);
  }
  for (const client of clientList) {
    const row = document.createElement('tr');
    for (const value of [client.name, client.productionVersion, client.productionDate, client.testVersion, client.testDate]) {
      const cell = document.createElement('td');
      cell.textContent = value || '—';
      row.append(cell);
    }
    clients.append(row);
  }
  if (result.message) {
    message.textContent = result.message;
    message.hidden = false;
  }
  const fetchedLabel = result.fetchedAt ? `Fetched ${new Date(result.fetchedAt).toLocaleString()}` : '';
  const savedLabel = result.snapshotSavedAt ? `Saved ${new Date(result.snapshotSavedAt).toLocaleString()}` : '';
  lastFetched.textContent = [fetchedLabel, savedLabel].filter(Boolean).join(' · ');
  diagnostics.textContent = JSON.stringify(result.diagnostics || {}, null, 2);
}