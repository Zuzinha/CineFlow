let editingSessionId = null;

document.addEventListener('DOMContentLoaded', () => {
    populateSelects();
    renderSchedule();

    const f = document.getElementById('sessionForm');
    const cancelSessionButton = document.getElementById('cancelSessionButton');

    if (cancelSessionButton) {
        cancelSessionButton.addEventListener('click', cancelEditSession);
    }

    if (f) f.onsubmit = (e) => {
        e.preventDefault();

        const sessionData = {
            mId: document.getElementById('filmSelect').value,
            rId: document.getElementById('roomSelect').value,
            time: document.getElementById('datetime').value,
            price: document.getElementById('price').value,
            audio: document.getElementById('audio').value
        };

        if (!sessionData.mId || !sessionData.rId || !sessionData.time || !sessionData.price) {
            return alert('Preencha todos os campos da sessão.');
        }

        const list = FlowIO.get(STORE.SESSIONS);

        if (editingSessionId) {
            const i = list.findIndex(s => s.id === editingSessionId);
            if (i === -1) return alert('Sessão não encontrada para atualizar.');
            list[i] = { id: editingSessionId, ...sessionData };
            alert('Sessão atualizada com sucesso!');
        } else {
            list.push({ id: Date.now(), ...sessionData });
            alert('Sessão criada com sucesso!');
        }

        FlowIO.save(STORE.SESSIONS, list);
        cancelEditSession();
        renderSchedule();
    };
});

function cancelEditSession() {
    editingSessionId = null;
    const form = document.getElementById('sessionForm');
    if (form) form.reset();
    document.getElementById('saveSessionButton').textContent = 'PUBLICAR NA GRADE';
    const cancelBtn = document.getElementById('cancelSessionButton');
    if (cancelBtn) cancelBtn.style.display = 'none';
}


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
        const r = FlowIO.get(STORE.ROOMS).find(x => x.id == s.rId);
        return `
            <tr>
                <td>${m ? m.title : '---'}</td>
                <td>${FlowIO.formatDT(s.time)}</td>
                <td class="text-gold">${FlowIO.formatMoney(s.price)}</td>
                <td>${r ? r.name : '---'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-info me-1" onclick="startEditSession(${s.id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="dropSess(${i})">Remover</button>
                </td>
            </tr>
        `;
    }).join('');
}

function startEditSession(sessionId) {
    const list = FlowIO.get(STORE.SESSIONS);
    const sess = list.find(x => x.id === sessionId);
    if (!sess) return alert('Sessão não encontrada para edição.');

    document.getElementById('filmSelect').value = sess.mId;
    document.getElementById('roomSelect').value = sess.rId;
    document.getElementById('datetime').value = sess.time;
    document.getElementById('price').value = sess.price;
    document.getElementById('audio').value = sess.audio;

    editingSessionId = sessionId;
    document.getElementById('saveSessionButton').textContent = 'ATUALIZAR SESSÃO';
    const cancelBtn = document.getElementById('cancelSessionButton');
    if (cancelBtn) cancelBtn.style.display = 'block';
}

function dropSess(index) {
    if (!confirm('Deseja remover esta sessão?')) return;

    const list = FlowIO.get(STORE.SESSIONS);
    list.splice(index, 1);
    FlowIO.save(STORE.SESSIONS, list);
    renderSchedule();

    if (editingSessionId) cancelEditSession();
}