let editingTicketId = null;

document.addEventListener('DOMContentLoaded', () => {
    refreshSessionList();
    displaySoldTickets();
    
    const saleForm = document.getElementById('saleForm');
    const cancelTicketButton = document.getElementById('cancelTicketButton');

    if (cancelTicketButton) {
        cancelTicketButton.addEventListener('click', cancelEditTicket);
    }

    if (saleForm) {
        saleForm.onsubmit = (e) => {
            e.preventDefault();
            processTicketSale();
        };
    }

    // Máscara simplificada para CPF
    const cpfInput = document.getElementById('cpfField');
    if (cpfInput) {
        cpfInput.oninput = (e) => {
            let v = e.target.value.replace(/\D/g, '');
            v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
            e.target.value = v;
        };
    }
});

function refreshSessionList() {
    const sessions = FlowIO.get(STORE.SESSIONS);
    const movies = FlowIO.get(STORE.MOVIES);
    const select = document.getElementById('sessionSelect');
    
    if (!select) return;
    
    select.innerHTML = '<option value="">Selecione a exibição...</option>' + 
        sessions.map(s => {
            const m = movies.find(x => x.id == s.mId);
            return `<option value="${s.id}">${m ? m.title : 'Filme'} - ${FlowIO.formatDT(s.time)}</option>`;
        }).join('');
}

function processTicketSale() {
    const sId = document.getElementById('sessionSelect').value;
    const sessions = FlowIO.get(STORE.SESSIONS);
    const targetSession = sessions.find(x => x.id == sId);

    if (!targetSession) return alert("Selecione uma sessão válida.");

    const ticketData = {
        sessionId: sId,
        buyer: document.getElementById('customerName').value.trim(),
        doc: document.getElementById('cpfField').value.trim(),
        seat: document.getElementById('seat').value.toUpperCase().trim(),
        method: document.getElementById('paymentMethod').value,
        value: targetSession.price
    };

    if (!ticketData.buyer || !ticketData.doc || !ticketData.seat) {
        return alert('Preencha todos os campos do ingresso.');
    }

    const allTickets = FlowIO.get(STORE.TICKETS);

    const seatInUse = allTickets.some(t => t.sessionId == sId && t.seat == ticketData.seat && t.id !== editingTicketId);
    if (seatInUse) {
        return alert("Erro: Este assento já foi vendido para esta sessão.");
    }

    if (editingTicketId) {
        const i = allTickets.findIndex(t => t.id === editingTicketId);
        if (i === -1) return alert('Erro ao atualizar venda: ingresso não encontrado.');

        allTickets[i] = { id: editingTicketId, ...ticketData };
        alert('Venda atualizada com sucesso!');
    } else {
        allTickets.push({ id: Date.now(), ...ticketData });
        alert('Venda registrada com sucesso no CineFlow!');
    }

    FlowIO.save(STORE.TICKETS, allTickets);
    cancelEditTicket();
    displaySoldTickets();
}

function displaySoldTickets() {
    const tickets = FlowIO.get(STORE.TICKETS);
    const list = document.getElementById('ticketList');
    if (!list) return;

    document.getElementById('ticketCounter').textContent = tickets.length;
    
    list.innerHTML = tickets.map((t, i) => {
        const session = FlowIO.get(STORE.SESSIONS).find(s => s.id == t.sessionId);
        const movie = session ? FlowIO.get(STORE.MOVIES).find(m => m.id == session.mId) : null;
        return `
        <tr>
            <td class="text-white">${t.buyer}</td>
            <td>${movie ? movie.title : 'Sessão removida'}</td>
            <td class="text-gold fw-bold">${t.seat}</td>
            <td>${t.method}</td>
            <td><span class="text-success">${FlowIO.formatMoney(t.value)}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-info me-1" onclick="startEditTicket(${t.id})">Editar</button>
                <button class="btn btn-sm btn-outline-danger" onclick="voidTicket(${i})">Estornar</button>
            </td>
        </tr>
    `;
    }).join('');
}

function startEditTicket(ticketId) {
    const tickets = FlowIO.get(STORE.TICKETS);
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return alert('Ingresso não encontrado para edição.');

    refreshSessionList();
    document.getElementById('sessionSelect').value = ticket.sessionId;
    document.getElementById('customerName').value = ticket.buyer;
    document.getElementById('cpfField').value = ticket.doc;
    document.getElementById('seat').value = ticket.seat;
    document.getElementById('paymentMethod').value = ticket.method;

    editingTicketId = ticketId;
    document.getElementById('saveTicketButton').textContent = 'ATUALIZAR VENDA';
    const cancelBtn = document.getElementById('cancelTicketButton');
    if (cancelBtn) cancelBtn.style.display = 'block';
}

function cancelEditTicket() {
    editingTicketId = null;
    const saleForm = document.getElementById('saleForm');
    if (saleForm) saleForm.reset();
    document.getElementById('saveTicketButton').textContent = 'CONFIRMAR VENDA';
    const cancelBtn = document.getElementById('cancelTicketButton');
    if (cancelBtn) cancelBtn.style.display = 'none';
}

function voidTicket(index) {
    if (!confirm("Deseja estornar esta venda?")) return;
    const tickets = FlowIO.get(STORE.TICKETS);
    tickets.splice(index, 1);
    FlowIO.save(STORE.TICKETS, tickets);
    displaySoldTickets();

    if (editingTicketId) cancelEditTicket();
}