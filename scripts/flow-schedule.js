document.addEventListener('DOMContentLoaded', () => {
    populateSelects();
    renderSchedule();
    const f = document.getElementById('sessionForm');
    if(f) f.onsubmit = (e) => {
        e.preventDefault();
        const sess = {
            id: Date.now(),
            mId: document.getElementById('filmSelect').value,
            rId: document.getElementById('roomSelect').value,
            time: document.getElementById('datetime').value,
            price: document.getElementById('price').value,
            audio: document.getElementById('audio').value
        };
        const list = FlowIO.get(STORE.SESSIONS);
        list.push(sess);
        FlowIO.save(STORE.SESSIONS, list);
        renderSchedule();
    };
});

function populateSelects() {
    const movies = FlowIO.get(STORE.MOVIES);
    const rooms = FlowIO.get(STORE.ROOMS);
    document.getElementById('filmSelect').innerHTML = movies.map(m => `<option value="${m.id}">${m.title}</option>`).join('');
    document.getElementById('roomSelect').innerHTML = rooms.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
}

function renderSchedule() {
    const list = FlowIO.get(STORE.SESSIONS);
    const movies = FlowIO.get(STORE.MOVIES);
    const out = document.getElementById('sessionList');
    if(!out) return;
    out.innerHTML = list.map((s, i) => {
        const m = movies.find(x => x.id == s.mId);
        return `
            <tr>
                <td>${m ? m.title : '---'}</td>
                <td>${FlowIO.formatDT(s.time)}</td>
                <td class="text-gold">${FlowIO.formatMoney(s.price)}</td>
                <td><button class="btn btn-sm btn-danger" onclick="dropSess(${i})">Remover</button></td>
            </tr>
        `;
    }).join('');
}