// --- START OF FILE app.js ---

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// --- Połączenie z MongoDB ---
// Upewnij się, że MongoDB działa na localhost:27017
// lub zmień connection string
mongoose.connect('mongodb://localhost:27017/usersdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));


const User = mongoose.model('User', new mongoose.Schema({ // Lepiej użyć Schema explicitnie
    name: String,
    email: String,
}));

app.get('/', (req, res) => {
    res.render('index'); // Zakładając, że masz widok index.handlebars
});


app.get('/users', async (req, res) => {
    try {
        const users = await User.find().lean(); // <--- DODAJ .lean()
        res.render('users', { users }); // Zakładając, że masz widok users.handlebars
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).send("Error fetching users");
    }
});

app.get('/users/new', (req, res) => {
    // Zakładając, że masz widok user_form.handlebars
    res.render('user_form', { user: null, isNew: true }); // Dodaj flagę isNew dla logiki w szablonie
});

app.post('/users', async (req, res) => {
    try {
        await new User({ name: req.body.name, email: req.body.email }).save();
        res.redirect('/users');
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).send("Error creating user");
    }
});

app.get('/users/edit/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).lean(); // <--- DODAJ .lean()
        if (!user) {
            return res.status(404).send('User not found');
        }
        // Zakładając, że masz widok user_form.handlebars
        res.render('user_form', { user, isNew: false }); // Przekaż user i flagę
    } catch (err) {
        console.error("Error fetching user for edit:", err);
        // Obsługa błędu, np. nieprawidłowe ID
        if (err.kind === 'ObjectId') {
            return res.status(400).send('Invalid user ID format');
        }
        res.status(500).send("Error fetching user for edit");
    }
});

// Zmień ścieżkę update, aby zawierała ID, lub użyj ukrytego pola w formularzu
// Użycie ukrytego pola jest już zaimplementowane (req.body.id)

// Upewnij się, że formularz edycji wysyła POST na /users/update
// i zawiera pole <input type="hidden" name="id" value="{{user._id}}">
app.post('/users/update', async (req, res) => {
    try {
        // Sprawdź, czy ID zostało przesłane
        if (!req.body.id) {
           return res.status(400).send('User ID is missing for update');
        }
        const updatedUser = await User.findByIdAndUpdate(req.body.id, {
            name: req.body.name,
            email: req.body.email,
        }, { new: true }); // { new: true } zwraca zaktualizowany dokument, choć tu nie jest to potrzebne

        if (!updatedUser) {
             return res.status(404).send('User not found for update');
        }
        res.redirect('/users');
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).send("Error updating user");
    }
});

// Zmień metodę usuwania na POST lub DELETE zamiast GET dla bezpieczeństwa
// W prostym przykładzie GET może pozostać, ale w realnych aplikacjach unikaj GET do operacji modyfikujących dane
app.get('/users/delete/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
         if (!deletedUser) {
             return res.status(404).send('User not found for deletion');
        }
        res.redirect('/users');
    } catch (err) {
        console.error("Error deleting user:", err);
         if (err.kind === 'ObjectId') {
            return res.status(400).send('Invalid user ID format for deletion');
        }
        res.status(500).send("Error deleting user");
    }
});

const PORT = process.env.PORT || 3000; // Użyj zmiennej środowiskowej PORT lub domyślnie 3000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// --- END OF FILE app.js ---

/*
docker run --rm -it --name node-app-container -p 3000:3000 -e PORT=3000 -e MONGODB_URI=mongodb://host.docker.internal:27017/usersdb my-node-app
*/