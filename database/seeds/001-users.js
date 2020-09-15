
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'andyman', password: 'pass'},
        {username: 'megawatts', password: 'pass'},
        {username: 'badpanda', password: 'pass'}
      ]);
    });
};
