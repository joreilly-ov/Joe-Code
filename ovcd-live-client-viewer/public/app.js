const refreshButton = document.querySelector('#refresh');
const state = document.querySelector('#state');
const lastFetched = document.querySelector('#last-fetched');
const message = document.querySelector('#message');
const clients = document.querySelector('#clients');
const diagnostics = document.querySelector('#diagnostics');

let lastResult = { clients: [] };
const filterInputs = ['#f-client', '#f-prod', '#f-test', '#f-tablets', '#f-stb', '#f-tv', '#f-aio', '#f-dds', '#f-dwb'].map((s) => document.querySelector(s));
const [fClient, fProd, fTest, fTablets, fStb, fTv, fAio, fDds, fDwb] = filterInputs;
const fCount = document.querySelector('#f-count');
for (const input of filterInputs) input.addEventListener('input', () => render(lastResult));
document.querySelector('#f-clear').addEventListener('click', () => {
  for (const input of filterInputs) {
    if (input.type === 'checkbox') input.checked = false;
    else input.value = '';
  }
  render(lastResult);
});

function hasCount(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
}

function matches(client) {
  const has = (field, term) => !term.trim() || String(field || '').toLowerCase().includes(term.trim().toLowerCase());
  return has(client.name, fClient.value)
    && has(client.productionVersion, fProd.value)
    && has(client.testVersion, fTest.value)
    && (!fTablets.checked || hasCount(client.tabletsCount))
    && (!fStb.checked || hasCount(client.stbCount))
    && (!fTv.checked || hasCount(client.tvCount))
    && (!fAio.checked || hasCount(client.aioCount))
    && (!fDds.checked || hasCount(client.ddsCount))
    && (!fDwb.checked || hasCount(client.dwbDeviceCount));
}

refreshButton.addEventListener('click', refresh);
loadLastState();

async function loadLastState() {
  try {
    const response = await fetch('/api/clients');
    const result = await response.json();
    if (result.clients?.length) {
      render(result);
      const when = new Date(result.snapshotSavedAt || result.fetchedAt).toLocaleString();
      state.textContent = `Saved data from ${when}`;
      message.textContent = `Showing saved data from ${when}, not live. Press Refresh data to update.`;
      message.hidden = false;
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
  lastResult = result;
  const allClients = Array.isArray(result.clients) ? result.clients : [];
  const clientList = allClients.filter(matches);
  fCount.textContent = `${clientList.length} of ${allClients.length}`;
  clients.replaceChildren();
  if (!clientList.length) {
    const row = document.createElement('tr');
    row.className = 'empty';
    row.innerHTML = `<td colspan="11">${allClients.length ? 'No clients match the filters.' : 'No Live clients detected.'}</td>`;
    clients.append(row);
  }
  for (const client of clientList) {
    const row = document.createElement('tr');
    for (const value of [
      client.name,
      client.productionVersion,
      client.productionDate,
      client.testVersion,
      client.testDate,
      client.tabletsCount,
      client.stbCount,
      client.tvCount,
      client.aioCount,
      client.ddsCount,
      client.dwbDeviceCount
    ]) {
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