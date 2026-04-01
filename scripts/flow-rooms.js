let editingRoomId = null;

document.addEventListener('DOMContentLoaded', () => {
    renderRooms();
    const f = document.getElementById('roomForm');
    const cancelRoomButton = document.getElementById('cancelRoomButton');

    if (cancelRoomButton) {
        cancelRoomButton.addEventListener('click', cancelEditRoom);
    }

    if(f) f.onsubmit = (e) => {
        e.preventDefault();

        const roomData = {
            name: document.getElementById('roomName').value.trim(),
            size: document.getElementById('capacity').value,
            tech: document.getElementById('roomType').value
        };

        if (!roomData.name || !roomData.size) {
            return alert('Preencha nome e capacidade.');
        }

        const list = FlowIO.get(STORE.ROOMS);

        if (editingRoomId) {
            const i = list.findIndex(r => r.id === editingRoomId);
            if (i === -1) return alert('Sala não encontrada para edição.');
            list[i] = { id: editingRoomId, ...roomData };
            alert('Sala atualizada com sucesso!');
        } else {
            list.push({ id: Date.now(), ...roomData });
            alert('Sala cadastrada com sucesso!');
        }

        FlowIO.save(STORE.ROOMS, list);
        f.reset();
        cancelEditRoom();
        renderRooms();
    };
});

function renderRooms() {
    const list = FlowIO.get(STORE.ROOMS);
    const grid = document.getElementById('roomGrid');
    if(!grid) return;
    document.getElementById('roomCounter').textContent = list.length;
    grid.innerHTML = list.map((r, i) => `
        <div class="col-md-4 mb-3">
            <div class="card bg-flow-card p-3 text-center">
                <h5 class="text-gold">${r.name}</h5>
                <p class="small mb-1">${r.tech} | ${r.size} lugares</p>
                <button class="btn btn-sm btn-outline-info me-1" onclick="startEditRoom(${r.id})">Editar</button>
                <button class="btn btn-sm btn-link text-danger" onclick="dropRoom(${i})">Excluir</button>
            </div>
        </div>
    `).join('');
}

function startEditRoom(roomId) {
    const list = FlowIO.get(STORE.ROOMS);
    const room = list.find(r => r.id === roomId);
    if (!room) return alert('Sala não encontrada para edição.');

    document.getElementById('roomName').value = room.name;
    document.getElementById('capacity').value = room.size;
    document.getElementById('roomType').value = room.tech;

    editingRoomId = roomId;
    document.getElementById('saveRoomButton').textContent = 'ATUALIZAR SALA';
    const cancelBtn = document.getElementById('cancelRoomButton');
    if (cancelBtn) cancelBtn.style.display = 'block';
}

function cancelEditRoom() {
    editingRoomId = null;
    const form = document.getElementById('roomForm');
    if (form) form.reset();
    document.getElementById('saveRoomButton').textContent = 'SALVAR SALA';
    const cancelBtn = document.getElementById('cancelRoomButton');
    if (cancelBtn) cancelBtn.style.display = 'none';
}

function dropRoom(i) {
    const list = FlowIO.get(STORE.ROOMS);
    list.splice(i, 1);
    FlowIO.save(STORE.ROOMS, list);
    renderRooms();

    if (editingRoomId) cancelEditRoom();
}

function dropRoom(i) {
    const list = FlowIO.get(STORE.ROOMS);
    list.splice(i, 1);
    FlowIO.save(STORE.ROOMS, list);
    renderRooms();
}