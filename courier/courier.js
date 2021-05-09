const { CourierClient } = require("@trycourier/courier");

const courier = CourierClient({
  authorizationToken: "dk_prod_H8PNZMMY3A4PD1KC9CMHE46G2CFG",
});

exports.sendNotif = async (message, email) => {
  // Example: send a message supporting email & SMS
  const { messageId } = await courier.send({
    eventId: "E1MSYV748TMX9KNHPTTN7D5BX7ZQ",
    recipientId: "38488a77-d611-4f70-8953-322500452b0d",
    profile: {
      email,
    },
    data: {
      new_notification: message,
    },
    override: {},
  });
};
