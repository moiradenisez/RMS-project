const express = require('express');
const moment = require('moment');
const knex = require('../dbconnection');
const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// careers main page
router.get('/careers', async (req, res) => {
  const active_job_opening = await knex('jobs.job_opening').where('status', '0');
  const jobOpening = await knex('jobs.job_opening');
  let admin_department = await knex('admin.department')
    .innerJoin(
      'jobs.job_opening',
      'admin.department.dept_id',
      'jobs.job_opening.job_dept'
    )
    .where('status', '0');

  admin_department = admin_department.filter(
    (value, index, self) => index === self.findIndex((t) => t.dept_id === value.dept_id)
  );
  const skill = await knex('jobs.skill');
  const jobSkill = await knex('jobs.job_opening')
    .innerJoin('jobs.skill', 'jobs.job_opening.job_id', 'jobs.skill.job_id')
    .innerJoin('admin.skill', 'jobs.skill.skill_id', 'admin.skill.skill_id');
  const { date_opened } = active_job_opening[0] || {};
  const date = moment(date_opened).format('DD MMMM YYYY');

  res.render('careers', {
    active_job_opening,
    skill,
    admin_department,
    date,
    jobSkill,
    jobOpening,
  });
});

module.exports = router;
