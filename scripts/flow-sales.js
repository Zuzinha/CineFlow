document.addEventListener('DOMContentLoaded', () => {
    refreshSessionList();
    displaySoldTickets();
    
    const saleForm = document.getElementById('saleForm');
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

    const newTicket = {
        id: Date.now(),
        sessionId: sId,
        buyer: document.getElementById('customerName').value,
        doc: document.getElementById('cpfField').value,
        seat: document.getElementById('seat').value.toUpperCase(),
        method: document.getElementById('paymentMethod').value,
        value: targetSession.price
    };

    const allTickets = FlowIO.get(STORE.TICKETS);
    
    // Validação de assento ocupado
    if (allTickets.some(t => t.sessionId == sId && t.seat == newTicket.seat)) {
        return alert("Erro: Este assento já foi vendido para esta sessão.");
    }

    allTickets.push(newTicket);
    FlowIO.save(STORE.TICKETS, allTickets);
    
    alert("Venda registrada com sucesso no CineFlow!");
    document.getElementById('saleForm').reset();
    displaySoldTickets();
}

function displaySoldTickets() {
    const tickets = FlowIO.get(STORE.TICKETS);
    const list = document.getElementById('ticketList');
    if (!list) return;

    document.getElementById('ticketCounter').textContent = tickets.length;
    
    list.innerHTML = tickets.map((t, i) => `
        <tr>
            <td class="text-white">${t.buyer}</td>
            <td class="text-gold fw-bold">${t.seat}</td>
            <td>${t.method}</td>
            <td><span class="text-success">${FlowIO.formatMoney(t.value)}</span></td>
            <td><button class="btn btn-sm btn-outline-danger" onclick="voidTicket(${i})">Estornar</button></td>
        </tr>
    `).join('');
}

function voidTicket(index) {
    if (!confirm("Deseja estornar esta venda?")) return;
    const tickets = FlowIO.get(STORE.TICKETS);
    tickets.splice(index, 1);
    FlowIO.save(STORE.TICKETS, tickets);
    displaySoldTickets();
}