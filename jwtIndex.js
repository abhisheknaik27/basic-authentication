const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const adminRouter = require('./routes/jwtAdmin');
const userRouter = require('./routes/jwtUser');

app.use(bodyParser.json());
app.use('/user', userRouter);
app.use('/admin', adminRouter);

const PORT = 3000;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

