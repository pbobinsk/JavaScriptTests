const doubleNumbers = (numbers: number[]): number[] => numbers.map(num => num * 2);

// Przykład użycia
const numbers = [1, 2, 3, 4, 5];
console.log(doubleNumbers(numbers)); // [2, 4, 6, 8, 10]

const fetchCatBreeds = async (): Promise<void> => {
    try {
        const response = await fetch("https://api.thecatapi.com/v1/breeds");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const breeds = await response.json();
        console.log("Lista ras kotów:", breeds.map((b: any) => b.name));
    } catch (error) {
        console.error("Błąd pobierania danych:", error);
    }
};

// Wywołanie funkcji
fetchCatBreeds();
