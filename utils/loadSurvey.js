require('dotenv').config();
const espSurvey = require('../data/survey_esp');
const engSurvey = require('../data/survey_eng');
const hardSurvey = [espSurvey, engSurvey];
var Questions = require('../models/Questions');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise; //USE ES6 PROMISES see:http://mongoosejs.com/docs/promises.html#plugging-in-your-own-promises-library

let dbPath = '';
if (process.env.NODE_ENV === 'development') { dbPath = process.env.MONGODB_IVORY_URI; }
else { dbPath = process.env.MONGODB_URI; }
// IMPORT MONGOOSE
mongoose.connect(dbPath, { 'useNewUrlParser': true, 'useFindAndModify': false, 'useCreateIndex': true, 'useUnifiedTopology': true }).then(
  () => { console.log('Mongoose connection open.') },
  err => { console.error(`${err.message}`) }
);
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

async function go(hardcode) {
  try {
    await asyncForEach(hardcode, async (survey) => {
      const questions = await Questions.findOneAndUpdate({
        title: survey.title
      }, {
          survey: survey.questions,
          intro: survey.intro,
          instructions: survey.instructions,
          disclaimer: survey.disclaimer,
          close: survey.close
        }, {
          new: true,
          upsert: true
        }).exec();
      console.log('Loaded: ' + questions.title);
    });
    mongoose.connection.close();
  } catch (e) {
    console.error(e); // 💩
    mongoose.connection.close();
  }
}

go(hardSurvey);