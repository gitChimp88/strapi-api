"use strict";

/**
 * A set of functions called "actions" for `transfer`
 */
module.exports = {
  async index(ctx) {
    const {
      data: { sender, receiver, amount },
    } = ctx.request.body;

    let entity;

    // Deduct amount from sender
    // Add amount to receiver
    // Add the transaction to transact
    const [senderAcc] = await strapi.entityService.findMany(
      "api::account.account",
      {
        filters: { name: { $eq: sender } },
      }
    );
    const [receiverAcc] = await strapi.entityService.findMany(
      "api::account.account",
      {
        filters: { name: { $eq: receiver } },
      }
    );

    senderAcc.balance = parseFloat(senderAcc.balance) - parseFloat(amount);
    receiverAcc.balance = parseFloat(receiverAcc.balance) + parseFloat(amount);

    await strapi.documents("api::account.account").update({
      documentId: senderAcc.documentId,
      data: senderAcc,
      status: "published",
    });

    await strapi.documents("api::account.account").update({
      documentId: receiverAcc.documentId,
      data: receiverAcc,
      status: "published",
    });

    entity = await strapi.entityService.create("api::transact.transact", {
      data: { sender, receiver, amount, status: "published" },
    });

    return entity;
  },
};
