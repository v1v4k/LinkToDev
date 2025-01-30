const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionReqModel = require("../models/connectionRequest");
const { run } = require("./sesSendEmail");

cron.schedule("8 * * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 0);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await ConnectionReqModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");


    const listOfEmails = [
      ...new Set(pendingRequests.map((request) => request.toUserId.emailId)),
    ];

    
    for (const email of listOfEmails) {
      const res = await run(
        `New connection request `,
        `You received a new connection request from ${email}`
      );
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});
