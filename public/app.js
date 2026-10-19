const form = document.getElementById('material-form');
const list = document.getElementById('material-list');
const message = document.getElementById('message');

async function loadMaterials() {
  try {
    const response = await fetch('/materials');
    const materials = await response.json();
    renderMaterials(materials);
  } catch (err) {
    message.textContent = 'Cannot load materials';
  }
}

function makeButton(label, action, id) {
  const button = document.createElement('button');
  button.textContent = label;
  button.dataset.action = action;
  button.dataset.id = id;
  return button;
}

function renderMaterials(materials) {
  list.innerHTML = '';

  for (const m of materials) {
    const row = document.createElement('tr');

    const values = [m.item_id, m.name, Number(m.quantity), m.unit];
    for (const value of values) {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.appendChild(cell);
    }

    const actions = document.createElement('td');
    actions.appendChild(makeButton('Edit Qty', 'edit', m.item_id));
    actions.appendChild(makeButton('Delete', 'delete', m.item_id));
    row.appendChild(actions);

    list.appendChild(row);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const body = {
    name: document.getElementById('name').value,
    quantity: document.getElementById('quantity').value,
    unit: document.getElementById('unit').value,
  };

  const response = await fetch('/materials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();

  if (!response.ok) {
    message.textContent = data.error;
    return;
  }

  message.textContent = '';
  form.reset();
  loadMaterials();
});

list.addEventListener('click', async (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const id = button.dataset.id;

  if (button.dataset.action === 'delete') {
    if (!confirm('Delete this material?')) return;

    const response = await fetch(`/materials/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      const data = await response.json();
      message.textContent = data.error;
      return;
    }
    message.textContent = '';
    loadMaterials();
  }

  if (button.dataset.action === 'edit') {
    const input = prompt('New quantity:');
    if (input === null || input.trim() === '') return;

    const response = await fetch(`/materials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: Number(input) }),
    });
    if (!response.ok) {
      const data = await response.json();
      message.textContent = data.error;
      return;
    }
    message.textContent = '';
    loadMaterials();
  }
});

loadMaterials();