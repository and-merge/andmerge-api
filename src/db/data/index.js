const ProjectStatusSeed = require('./projectStatus');

module.exports = function () {
  return Promise.all([
    // Returning and thus passing a Promise here
    // Independent seeds first
    ProjectStatusSeed(),
  ])
    .then(() => {
      // More seeds that require IDs from the seeds above
    })
    .then(() => {
      console.log('********** Successfully seeded db **********');
    });
};
