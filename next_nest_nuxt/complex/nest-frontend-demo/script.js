document.addEventListener('DOMContentLoaded', () => {
    const itemsListDiv = document.getElementById('items-list');
    const addItemForm = document.getElementById('addItemForm');
    const errorMessageDiv = document.getElementById('error-message');
    // const apiUrl = 'http://localhost:3000/items'; // Upewnij się, że port jest poprawny
    const apiUrl = 'https://nest-complex-api.vercel.app/items';
    // Funkcja do wyświetlania błędów
    function displayError(message) {
        errorMessageDiv.textContent = message;
    }

    // Funkcja do czyszczenia błędów
    function clearError() {
        errorMessageDiv.textContent = '';
    }

    // Funkcja do pobierania i wyświetlania przedmiotów
    async function fetchItems() {
        try {
            itemsListDiv.innerHTML = '<p>Ładowanie przedmiotów...</p>'; // Komunikat ładowania
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const items = await response.json();

            if (items.length === 0) {
                itemsListDiv.innerHTML = '<p>Brak przedmiotów do wyświetlenia.</p>';
                return;
            }

            const ul = document.createElement('ul');
            items.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>ID:</strong> ${item.id}<br>
                    <strong>Nazwa:</strong> ${item.name}<br>
                    <strong>Opis:</strong> ${item.description}<br>
                    <strong>Ilość:</strong> ${item.quantity}
                `;
                ul.appendChild(li);
            });
            itemsListDiv.innerHTML = ''; // Wyczyść poprzednią zawartość (np. "Ładowanie...")
            itemsListDiv.appendChild(ul);
        } catch (error) {
            console.error('Błąd podczas pobierania przedmiotów:', error);
            itemsListDiv.innerHTML = `<p class="error">Nie udało się załadować przedmiotów. Sprawdź konsolę i upewnij się, że API działa. (${error.message})</p>`;
        }
    }

    // Funkcja do dodawania nowego przedmiotu
    async function addItem(event) {
        event.preventDefault(); // Zapobiegaj domyślnemu przesłaniu formularza
        clearError();

        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const quantity = parseInt(document.getElementById('quantity').value, 10);

        if (isNaN(quantity) || quantity < 1) {
            displayError('Ilość musi być liczbą większą od 0.');
            return;
        }

        const newItem = { name, description, quantity };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });

            if (!response.ok) {
                // Spróbuj odczytać błąd z API (np. błędy walidacji)
                let apiErrorMsg = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    if (errorData.message) {
                        apiErrorMsg += ` - ${Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message}`;
                    }
                } catch (e) { /* Ignoruj, jeśli odpowiedź nie jest JSONem */ }
                throw new Error(apiErrorMsg);
            }

            // const addedItem = await response.json(); // Odkomentuj, jeśli chcesz użyć danych zwróconych przez API
            // console.log('Dodano przedmiot:', addedItem);

            addItemForm.reset(); // Wyczyść formularz
            fetchItems(); // Odśwież listę przedmiotów
        } catch (error) {
            console.error('Błąd podczas dodawania przedmiotu:', error);
            displayError(`Nie udało się dodać przedmiotu: ${error.message}`);
        }
    }

    // Inicjalizacja
    fetchItems(); // Pobierz przedmioty przy pierwszym załadowaniu
    addItemForm.addEventListener('submit', addItem);
});