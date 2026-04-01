let editingMovieId = null;

document.addEventListener('DOMContentLoaded', () => {
    renderMovies();

    const filmForm = document.getElementById('filmForm');
    const cancelEditButton = document.getElementById('cancelEditButton');

    if (cancelEditButton) {
        cancelEditButton.addEventListener('click', cancelEdit);
    }

    if (filmForm) {
        filmForm.onsubmit = (e) => {
            e.preventDefault();

            const movieData = {
                title: document.getElementById('title').value.trim(),
                genre: document.getElementById('genre').value.trim(),
                duration: Number(document.getElementById('duration').value) || 0,
                rating: document.getElementById('rating').value
            };

            if (!movieData.title || !movieData.genre || !movieData.duration) {
                return alert('Preencha todos os campos obrigatórios do filme.');
            }

            const movies = FlowIO.get(STORE.MOVIES);

            if (editingMovieId) {
                const i = movies.findIndex(m => m.id === editingMovieId);
                if (i === -1) return alert('Erro ao atualizar: filme não encontrado.');

                movies[i] = { id: editingMovieId, ...movieData };
                alert('Filme atualizado com sucesso!');
            } else {
                movies.push({ id: Date.now(), ...movieData });
                alert('Filme salvo com sucesso!');
            }

            FlowIO.save(STORE.MOVIES, movies);
            cancelEdit();
            renderMovies();
        };
    }
});

function renderMovies() {
    const movies = FlowIO.get(STORE.MOVIES);
    const filmCounter = document.getElementById('filmCounter');
    const filmList = document.getElementById('filmList');

    if (filmCounter) filmCounter.textContent = movies.length;
    if (!filmList) return;

    filmList.innerHTML = movies.map((movie, index) => `
        <tr>
            <td>${movie.title}</td>
            <td>${movie.genre}</td>
            <td>${movie.rating}</td>
            <td>${movie.duration}</td>
            <td>
                <button class="btn btn-sm btn-outline-info me-1" onclick="startEditMovie(${movie.id})">Editar</button>
                <button class="btn btn-sm btn-outline-danger" onclick="removeMovie(${index})">Excluir</button>
            </td>
        </tr>
    `).join('');
}

function startEditMovie(movieId) {
    const movies = FlowIO.get(STORE.MOVIES);
    const movie = movies.find(m => m.id === movieId);
    if (!movie) return alert('Filme não encontrado para edição.');

    document.getElementById('title').value = movie.title;
    document.getElementById('genre').value = movie.genre;
    document.getElementById('duration').value = movie.duration;
    document.getElementById('rating').value = movie.rating;

    editingMovieId = movieId;
    document.getElementById('saveButton').textContent = 'ATUALIZAR FILME';
    document.getElementById('cancelEditButton').style.display = 'block';
}

function cancelEdit() {
    editingMovieId = null;
    document.getElementById('filmForm').reset();
    document.getElementById('saveButton').textContent = 'ADICIONAR AO FLUXO';
    document.getElementById('cancelEditButton').style.display = 'none';
}

function removeMovie(index) {
    if (!confirm('Tem certeza que deseja excluir este filme?')) return;

    const movies = FlowIO.get(STORE.MOVIES);
    movies.splice(index, 1);
    FlowIO.save(STORE.MOVIES, movies);
    renderMovies();

    if (editingMovieId) cancelEdit();
}