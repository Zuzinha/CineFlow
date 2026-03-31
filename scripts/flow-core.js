// Chaves de Armazenamento Padronizadas
const STORE = {
    MOVIES: 'flow_data_movies',
    ROOMS: 'flow_data_rooms',
    SESSIONS: 'flow_data_sessions',
    TICKETS: 'flow_data_tickets'
};

const FlowIO = {
    get: (key) => JSON.parse(localStorage.getItem(key)) || [],
    save: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
    
    formatMoney: (val) => `R$ ${parseFloat(val).toFixed(2)}`,
    
    formatDT: (dt) => {
        const d = new Date(dt);
        return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
    }
};