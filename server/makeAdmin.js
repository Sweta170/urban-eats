const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        try {
            const user = await User.findOneAndUpdate({ email: 'admin@test.com' }, { role: 'admin' }, { new: true });
            console.log('User promoted:', user);
        } catch (err) {
            console.error(err);
        } finally {
            mongoose.disconnect();
        }
    });
