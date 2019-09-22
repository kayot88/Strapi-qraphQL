const stripe = require('stripe')('process.env.STRIPE_SECRET_KEY');
// const strapi = require('strapi');
/**
 * Read the documentation () to implement custom controller functions
 */

module.exports = {
  create: async ctx => {
    const { address, amount, brew, postalCode, city, token } = ctx.request.body;
    console.log(city);
    const charge = await stripe.charges.create({
      amount: amount * 100,
      currency: 'uah',
      description: `Orders ${new Date(Date.now())} - User ${
        ctx.state.user._id
      }`,
      source: token
    });
    // console.log(charge);
    // const order = Orders.create()
    const order = await strapi.services.orders.add({
      user: ctx.state.user._id,
      address,
      amount,
      brew,
      postalCode,
      city
    });
    return order;
  }
};
