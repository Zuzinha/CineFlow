function processTicketSale() {
    const sId = document.getElementById('sessionSelect').value;
    const sessions = FlowIO.get(STORE.SESSIONS);
    const targetSession = sessions.find(x => x.id == sId);

    if (!targetSession) return alert("Selecione uma sessão.");

    const newTicket = {
        id: Date.now(),
        sessionId: sId,
        buyer: document.getElementById('customerName').value, // Nome deve ser 'buyer'
        doc: document.getElementById('cpfField').value,
        seat: document.getElementById('seat').value.toUpperCase(),
        method: document.getElementById('paymentMethod').value,
        value: targetSession.price
    };

    const allTickets = FlowIO.get(STORE.TICKETS);
    allTickets.push(newTicket);
    FlowIO.save(STORE.TICKETS, allTickets);
    
    alert("Venda realizada!");
    document.getElementById('saleForm').reset();
    displaySoldTickets();
}

function displaySoldTickets() {
    const tickets = FlowIO.get(STORE.TICKETS);
    const list = document.getElementById('ticketList');
    if (!list) return;

    list.innerHTML = tickets.map((t, i) => `
        <tr>
            <td class="text-white">${t.buyer}</td> <td class="text-gold fw-bold">${t.seat}</td>
            <td>${t.method}</td>
            <td><span class="text-success">R$ ${parseFloat(t.value).toFixed(2)}</span></td>
            <td><button class="btn btn-sm btn-outline-danger" onclick="voidTicket(${i})">Estornar</button></td>
        </tr>
    `).join('');
}