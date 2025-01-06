const SourceTypeSeed = require('./sourceType');
const StatusSeed = require('./status');
const StatusTypeSeed = require('./statusType');

module.exports = function () {
  return Promise.all([
    // Returning and thus passing a Promise here
    // Independent seeds first
    SourceTypeSeed(),
    StatusTypeSeed(),

  ])
    .then(() => {
      // More seeds that require IDs from the seeds above
      StatusSeed()
    })
    .then(() => {
      console.log('********** Successfully seeded db **********');
    });
};
