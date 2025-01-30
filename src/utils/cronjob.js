const cron = require('node-cron');
const { subDays, startOfDay, endOfDay } = require('date-fns');

const ConnectionRequestModel = require('../models/connectionRequest');
const sendEmail = require('./sendEmail');

// cron job will run at 8:00 AM everyday
cron.schedule("0 8 * * *", async () => {
  // send to all people who got a connection request previous day
  try {
    console.log("Cronjob started -----");
    const yesterday = subDays(new Date(), 0); // get the date of yesterday
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd
      }
    }).populate('fromUserId toUserId');

    const listOfEmails = [
      ...new Set(pendingRequests.map((request) => request.toUserId.emailId))
    ]

    // console.log("List of emails", listOfEmails);

    for (const email of listOfEmails) {
      // send mail
      try {
        const res = await sendEmail.run("New Friend request form " + email,
          "You have pending connection requests, Accept the Request or Reject it.")

        // console.log("Email sent", res);
      } catch (error) {
        console.log("Error sending email", error);
      }
    }

  } catch (error) {
    console.log("Cronjob failed", error);
  }

  console.log(" cron job ended -----");
});

// this type of cronjob is useful when you have around 1k to upto 10k users and you want to send them email
// if you want to 1 Lakhs of users, then you should use a queue system like AWS SQS or RabbitMQ