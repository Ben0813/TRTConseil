import e from "express";
import Candidate from "./Candidate.js";
import Job from "./Job.js";
import Postulation from "./Postulation.js";
import Recruiter from "./Recruiter.js";

Candidate.hasMany(Postulation, {
  foreignKey: "id_candidate",
  as: "postulations",
});

Job.hasMany(Postulation, {
  foreignKey: "id_job",
  as: "postulations",
});

Postulation.belongsTo(Candidate, {
  foreignKey: "id_candidate",
  as: "candidate",
});

Postulation.belongsTo(Job, {
  foreignKey: "id_job",
  as: "job",
});

Job.belongsTo(Recruiter, {
  as: "recruiter",
  foreignKey: "id_recruiter",
});

Recruiter.hasMany(Job, {
  as: "jobs",
  foreignKey: "id_recruiter",
});
