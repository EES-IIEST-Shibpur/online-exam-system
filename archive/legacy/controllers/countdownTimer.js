async function Countdown(req, res) {
    const targetTime = new Date("2024-12-31T18:12:00").getTime();
    return res.status(200).json({status: "success", data: targetTime});
}

module.exports = Countdown;