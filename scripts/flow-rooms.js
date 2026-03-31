document.addEventListener('DOMContentLoaded', () => {
    renderRooms();
    const f = document.getElementById('roomForm');
    if(f) f.onsubmit = (e) => {
        e.preventDefault();
        const room = {
            id: Date.now(),
            name: document.getElementById('roomName').value,
            size: document.getElementById('capacity').value,
            tech: document.getElementById('roomType').value
        };
        const list = FlowIO.get(STORE.ROOMS);
        list.push(room);
        FlowIO.save(STORE.ROOMS, list);
        f.reset();
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
                <button class="btn btn-sm btn-link text-danger" onclick="dropRoom(${i})">Excluir</button>
            </div>
        </div>
    `).join('');
}

function dropRoom(i) {
    const list = FlowIO.get(STORE.ROOMS);
    list.splice(i, 1);
    FlowIO.save(STORE.ROOMS, list);
    renderRooms();
}