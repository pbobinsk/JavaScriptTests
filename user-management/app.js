require('dotenv').config();

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
// app.engine('handlebars', exphbs.engine());
app.engine('handlebars', exphbs.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true, // Czasem potrzebne również dla metod
    },
}));


app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/usersdb';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log(`MongoDB Connected to ${MONGODB_URI}`)) // Dodano logowanie URI
.catch(err => console.error('MongoDB Connection Error:', err));

const User = mongoose.model('User', {
    name: String,
    email: String,
});

app.get('/', (req, res) => {
    res.render('index');
});


app.get('/users', async (req, res) => {
    const users = await User.find();
    res.render('users', { users });
});

app.get('/users/new', (req, res) => {
    res.render('user_form', { user: null });
});

app.post('/users', async (req, res) => {
    await new User({ name: req.body.name, email: req.body.email }).save();
    res.redirect('/users');
});

app.get('/users/edit/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('user_form', { user });
});

app.post('/users/update', async (req, res) => {
    await User.findByIdAndUpdate(req.body.id, {
        name: req.body.name,
        email: req.body.email,
    });
    res.redirect('/users');
});

app.get('/users/delete/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users');
});


const PORT = process.env.PORT || 3000; // Użyj zmiennej środowiskowej PORT lub domyślnie 3000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT} (inside container)`));
