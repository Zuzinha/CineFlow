document.addEventListener('DOMContentLoaded', () => {
    updateFlowStats();
});

function updateFlowStats() {
    const movies = FlowIO.get(STORE.MOVIES);
    const rooms = FlowIO.get(STORE.ROOMS);
    const sessions = FlowIO.get(STORE.SESSIONS);
    const tickets = FlowIO.get(STORE.TICKETS);

    // Mapeamento dos IDs do Dashboard
    const elements = {
        'statFilms': movies.length,
        'statRooms': rooms.length,
        'statShows': sessions.length,
        'statTickets': tickets.length
    };

    for (const [id, value] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
            // Efeito visual de destaque no número
            el.classList.add('text-gold', 'fw-bold');
        }
    }
}