function optionMaker(options) {
  const opts = new Array();
  options.forEach((opt, index) => {
    const str = `\r\n${index + 1} = ${opt}`;
    opts.push(str);
  });
  return opts.join("");
}

exports.response = (answers, questions, err) => {
  var responseLength = answers.responses.length;
  var currentQuestion = questions.survey[responseLength];
  var responseMessage = '';
  let interloper = new Array;
  if (!currentQuestion || responseLength === questions.survey.length) {
    interloper.push(questions.close);
    return interloper;
  }
  if (answers.responses.length === 0) {
    if (!err) {
      responseMessage += questions.intro;
      responseMessage += '\r\n';
    }
  }
  if (answers.responses.length >= 0) {
    responseMessage += currentQuestion.text;
  }
  if (answers.spanish === true) {
    if (currentQuestion.type === 'boolean') {
      responseMessage += '\r\nResponda con numero:\r\n1 = Sí\r\n2 = No';
    }
    if (currentQuestion.type === 'single') {
      responseMessage += '\r\nResponda con numero:';
    }
    if (currentQuestion.type === 'txt') {
      if (answers.responses.length != 14) {
        responseMessage += '\r\nPor favor escriba su respuesta.';
      }
    }
    if (currentQuestion.type === 'address' && currentQuestion.location === 'home') {
      responseMessage += '\r\nProporcione un código postal de 5 dígitos o el nombre de su vecindario y ciudad.';
    }
    // TRANSLATION NEEDED
    if (currentQuestion.type === 'address' && currentQuestion.location === 'work') {
      responseMessage += '\r\nPor favor, proporcione la ubicación de su lugar de trabajo, ya sea a través de un código postal de 5 dígitos o el nombre de la ciudad. Si trabaja desde casa, responda "CASA".';
    }
    if (currentQuestion.type === 'address' && currentQuestion.location === 'school') {
      responseMessage += '\r\nIndique el nombre del lugar donde va a la escuela y un código postal de 5 dígitos o nombre y ciudad.';
    }
    if (currentQuestion.type === 'multi') {
      responseMessage += `\r\nElija sus ${currentQuestion.limit} principales. Responda con un número:`;
    }
    if (currentQuestion.type === 'rank') {
      responseMessage += `\r\nResponda con un número. Elija sus ${currentQuestion.limit} principales, ${currentQuestion.orderStatement}:`;
    }
  } else {
    if (currentQuestion.type === 'boolean') {
      responseMessage += '\r\nReply with number:\r\n1 = Yes\r\n2 = No';
    }
    if (currentQuestion.type === 'single') {
      responseMessage += '\r\nReply with number:';
    }
    if (currentQuestion.type === 'txt') {
      if (answers.responses.length != 14) {
        responseMessage += '\r\nPlease type your response below.';
      }
    }
    if (currentQuestion.type === 'address' && currentQuestion.location === 'home') {
      responseMessage += '\r\nPlease provide a 5-digit zip code or the name of your neighborhood and city.';
    }
    if (currentQuestion.type === 'address' && currentQuestion.location === 'work') {
      responseMessage += '\r\nPlease provide the location of where you work, either through a 5-digit zip code or name of city. If you work from home, reply “HOME”.';
    }
    if (currentQuestion.type === 'address' && currentQuestion.location === 'school') {
      responseMessage += '\r\nPlease provide the name of the place where you go to school and a 5-digit zip code or name and city.';
    }
    if (currentQuestion.type === 'multi') {
      responseMessage += `\r\nChoose your top ${currentQuestion.limit}. Reply with number for each:`;
    }
    if (currentQuestion.type === 'rank') {
      responseMessage += `\r\nReply with number. Choose your top ${currentQuestion.limit}, ${currentQuestion.orderStatement}:`;
    }
  }
  if (currentQuestion.type === 'single' || currentQuestion.type === 'multi' || currentQuestion.type === 'rank') {
    responseMessage += optionMaker(currentQuestion.options);
  }
  // HANDLE SPANISH SURVEYS TO PROVIDE INTRO AGAIN
  if (!err && answers.spanish === true && answers.responses.length === 1) {
    interloper.push(questions.intro, questions.instructions, questions.disclaimer, responseMessage);
    return interloper;
  }
  // ENGLISH
  if (!err && answers.responses.length === 1) {
    interloper.push(questions.instructions, questions.disclaimer, responseMessage);
    return interloper;
  }
  return responseMessage;
}