import Candidate from './Candidate.js';
import Job from './Job.js';
import Postulation from './Postulation.js';

Candidate.hasMany(Postulation, {
  foreignKey: 'id_candidate',
  as: 'postulations'
});

Job.hasMany(Postulation, {
  foreignKey: 'id_job',
  as: 'postulations'
});

Postulation.belongsTo(Candidate, {
  foreignKey: 'id_candidate',
  as: 'candidate'
});

Postulation.belongsTo(Job, {
  foreignKey: 'id_job',
  as: 'job'
});


