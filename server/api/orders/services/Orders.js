

/**
 * `Orders` service.
 */
const _ = require('lodash');

module.exports = {
  // exampleService: (arg1, arg2) => {
  //   return isUserOnline(arg1, arg2);
  // }
  /**
   * Promise to add a/an orders.
   *
   * @return {Promise}
   */
  add: async values => {
    // Extract values related to relational data.
    const relations = _.pick(values, Orders.associations.map(ast => ast.alias));
    const data = _.omit(values, Orders.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = await Orders.create(data);

    // Create relational data and return the entry.
    return Orders.updateRelations({ _id: entry.id, values: relations });
  }
};
