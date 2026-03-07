const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'sweta123@gmail.com';
        const newPassword = '123456';
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const result = await User.findOneAndUpdate({ email }, { password: hashedPassword });
        if (result) {
            console.log(`Password for ${email} reset to ${newPassword}`);
        } else {
            console.log(`User ${email} not found`);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

resetPassword();
