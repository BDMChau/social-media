const express = require('express');
const app = express();
require('dotenv').config()
const PORT = 4000 || process.env.PORT;

// connect db
require('./database/db');

////////
app.use(express.json());

// routes
const auth = require('./middleware/authlogin.middleware');

app.use('/', require('./routers/authlog.route'));
app.use('/home', auth, require('./routers/post.route'));
app.use('/user', auth, require('./routers/user.route'));


///////
app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
})