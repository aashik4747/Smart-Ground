const mongoose = require("mongoose");
require("dotenv").config({ path: __dirname + "/../.env" });
const User = require("../models/User");
const MatchRequest = require("../models/MatchRequest");

async function run() {
    try {
        console.log("Connecting to Database...");
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-booking-system');
        
        const keepEmails = [
            'alex@example.com', 
            'maria@example.com', 
            'rahul@example.com',
            'admin@test.com',              // The admin
            'aashikmubeen7851@gmail.com'   // The real user account I saw earlier
        ];

        const usersToDelete = await User.find({ email: { $nin: keepEmails } });
        const idsToDelete = usersToDelete.map(u => u._id);

        if (idsToDelete.length > 0) {
            console.log(`Found ${idsToDelete.length} dummy users to delete...`);
            
            // Delete all matches hosted by these dummy users
            const matchRes = await MatchRequest.deleteMany({ host: { $in: idsToDelete } });
            console.log(`Deleted ${matchRes.deletedCount} matches hosted by these dummy accounts.`);

            // Delete the dummy users
            const userRes = await User.deleteMany({ _id: { $in: idsToDelete } });
            console.log(`Deleted ${userRes.deletedCount} dummy user accounts.`);
        } else {
            console.log("No extra dummy users found in the system.");
        }

        process.exit(0);
    } catch (e) {
        console.error("Wipe script error:", e);
        process.exit(1);
    }
}
run();
