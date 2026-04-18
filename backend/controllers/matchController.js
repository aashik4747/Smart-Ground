const Match = require("../models/MatchRequest");

exports.createMatch = async (req, res) => {
    try {
        const { date, time, requiredPlayers } = req.body;

        // Check if date is in the future
        if (date && time) {
            const matchDateTime = new Date(`${date}T${time}`);
            if (matchDateTime < new Date()) {
                return res.status(400).json({ message: "Match date and time must be in the future." });
            }
        }

        if (!requiredPlayers || requiredPlayers < 2) {
            return res.status(400).json({ message: "A match requires at least 2 players." });
        }

        const match = await Match.create({
            ...req.body,
            host: req.user.id, // Assign host
            joinedPlayers: [req.user.id] // Host auto-joins? Usually yes.
        });
        res.status(201).json(match);
    } catch (error) {
        console.error("Match Creation Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getAllMatches = async (req, res) => {
    try {
        let query = { status: { $in: ["open", "closed"] }, isPrivate: false };

        // If the user is authenticated, they can also see private matches from people they follow
        if (req.user && req.user.id) {
            const User = require("../models/User");
            const me = await User.findById(req.user.id);
            if (me) {
                const myFollowing = me.following || [];
                query = {
                    status: { $in: ["open", "closed"] },
                    $or: [
                        { isPrivate: false },
                        { isPrivate: true, host: { $in: [...myFollowing, req.user.id] } }
                    ]
                };
            }
        }

        const matches = await Match.find(query)
            .populate("host", "name turfId")
            .populate("joinedPlayers", "name turfId")
            .sort({ date: 1 });
        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getMyMatches = async (req, res) => {
    try {
        const matches = await Match.find({
            $or: [
                { host: req.user.id },
                { joinedPlayers: req.user.id }
            ]
        })
            .populate("host", "name")
            .populate("joinedPlayers", "name")
            .sort({ date: -1 });
        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getMatchDetails = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id)
            .populate("host", "name email turfId reliabilityScore mvpAwards profileImage followers")
            .populate("joinedPlayers", "name email turfId reliabilityScore mvpAwards profileImage followers")
            .populate("waitlistedPlayers", "name email turfId reliabilityScore profileImage");

        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }
        res.json(match);
    } catch (error) {
        console.error("Get Match Details Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.joinMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);

        if (!match) {
            return res.status(404).json({ message: "Match not found." });
        }

        if (match.joinedPlayers.includes(req.user.id)) {
            return res.status(400).json({ message: "You have already joined this match." });
        }

        if (match.status === "closed" || match.joinedPlayers.length >= match.requiredPlayers) {
            if (match.waitlistedPlayers && match.waitlistedPlayers.includes(req.user.id)) {
                return res.status(400).json({ message: "You are already on the waiting list." });
            }
            if (!match.waitlistedPlayers) match.waitlistedPlayers = [];
            
            match.waitlistedPlayers.push(req.user.id);
            await match.save();
            return res.json({ message: "Match is full. You have been added to the waiting list.", match });
        }

        match.joinedPlayers.push(req.user.id);

        if (match.joinedPlayers.length >= match.requiredPlayers) {
            match.status = "closed";
        }

        await match.save();
        res.json(match);
    } catch (error) {
        console.error("Join Match Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.leaveMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);

        if (!match) {
            return res.status(404).json({ message: "Match not found." });
        }

        if (match.host.toString() === req.user.id) {
            return res.status(400).json({ message: "Host cannot leave the match. You must cancel it instead." });
        }

        const isJoined = match.joinedPlayers.includes(req.user.id);
        const isWaitlisted = match.waitlistedPlayers && match.waitlistedPlayers.includes(req.user.id);

        if (!isJoined && !isWaitlisted) {
            return res.status(400).json({ message: "You are not part of this match or waitlist." });
        }

        if (isJoined) {
            // Remove user from joinedPlayers
            match.joinedPlayers = match.joinedPlayers.filter(
                playerId => playerId.toString() !== req.user.id
            );

            // If match is closed or full, check waitlist for promotion
            if (match.waitlistedPlayers && match.waitlistedPlayers.length > 0) {
                const promotedUser = match.waitlistedPlayers.shift(); // Dequeue
                match.joinedPlayers.push(promotedUser);
                // Status remains closed because a spot was instantly refilled
            } else if (match.joinedPlayers.length < match.requiredPlayers) {
                match.status = "open";
            }
        } else if (isWaitlisted) {
             match.waitlistedPlayers = match.waitlistedPlayers.filter(
                playerId => playerId.toString() !== req.user.id
             );
        }

        await match.save();
        res.json({ message: "Successfully left the match.", match });
    } catch (error) {
        console.error("Leave Match Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.cancelMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);

        if (!match) {
            return res.status(404).json({ message: "Match not found." });
        }

        if (match.host.toString() !== req.user.id) {
            return res.status(403).json({ message: "Only the host can cancel the match." });
        }

        match.status = "cancelled";
        await match.save();

        res.json({ message: "Match cancelled successfully.", match });
    } catch (error) {
        console.error("Cancel Match Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
