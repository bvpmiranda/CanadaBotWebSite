/**
 * Enum for Education Level
 * @readonly
 * @enum {number}
 */
var educationLevel = {
	/** Less than secondary school (high school) */
	LessThanSecondary: 1,
	/** Secondary diploma (high school graduation) */
	Secondary: 2,
	/** One-year degree, diploma or certificate from  a university, college, trade or technical school, or other institute */
	OneYearDegree: 3,
	/** Two-year program at a university, college, trade or technical school, or other institute */
	TwoYearDegree: 4,
	/** Bachelor's degree OR  a three or more year program at a university, college, trade or technical school, or other institute */
	BachelorsDegree: 5,
	/** Two or more certificates, diplomas, or degrees. One must be for a program of three or more years */
	TwoOrMoreDegress: 6,
	/** Master's degree, OR professional degree needed to practice in a licensed profession (For “professional degree,” the degree program must have been in: medicine, veterinary medicine, dentistry, optometry, law, chiropractic medicine, or pharmacy.) */
	MastersDegree: 7,
	/** Doctoral level university degree (Ph.D.) */
	DoctoralDegree: 8
}

/**
 * Enum for Education Level aquired in Canada
 * @readonly
 * @enum {number}
 */
var educationInCanada = {
	/** Secondary (high school) or less */
	SecondaryOrLess: 1,
	/** One-year or two-year diploma or certificate */
	OneOrTwoYearDiplomaOrCertificate: 2,
	/** Degree, diploma or certificate of three years or longer OR a Master’s, professional or doctoral degree of at least one academic year */
	ThreeOrMoreYearsDegree: 3
}

/**
 * Enum for Language Test
 * @readonly
 * @enum {number}
 */
var languageTest = {
	none: 0,
	celpip: 1,
	ielts: 2,
	tef: 3
}

/**
 * Enum for Language Ability
 * @readonly
 * @enum {number}
 */
var languageAbility = {
	speaking: 0,
	listening: 1,
	reading: 2,
	writing: 3
}

/**
 * Enum for NOC List
 * @readonly
 * @enum {number}
 */
var nocList = {
	_00: 0,
	_0: 1,
	A: 2,
	B: 3,
	C: 4,
	D: 5
}

/**
 * Create the object with the languague test properties
 */
function languageObject() {
	return {
		test: null,
		speaking: null,
		listening: null,
		reading: null,
		writing: null
	}
}

/**
 * Questions to be asked
 * @readonly
 * @enum {string}
 */
var questions = {
	name: '0',
	maritalStatus: '1',
	spouseCanadianCitizen: '2i',
	spouseCommingAlong: '2ii',
	age: '3',
	educationLevel: '4',
	canadianDegreeDiplomaCertificate: '4b',
	canadianEducationLevel: '4c',
	firstLanguageTest: '5ii',
	firstLanguageSpeaking: '5iiS',
	firstLanguageListening: '5iiL',
	firstLanguageReading: '5iiR',
	firstLanguageWriting: '5iiW',
	secondLanguageTest: '5iii',
	secondLanguageSpeaking: '5iiiS',
	secondLanguageListening: '5iiiL',
	secondLanguageReading: '5iiiR',
	secondLanguageWriting: '5iiiW',
	workExperienceInCanada: '6i',
	workExperienceLastTenYears: '6ii',
	certificateQualificationProvince: '7',
	validJobOffer: '8',
	jobOfferNoc: '8a',
	nominationCertificate: '9',
	spouseEducationLevel: '10',
	spouseWorkExperienceInCanada: '11',
	spouseLanguageTest: '12',
	spouseLanguageSpeaking: '12S',
	spouseLanguageListening: '12L',
	spouseLanguageReading: '12R',
	spouseLanguageWriting: '12W',
	calculate: 'CALC'
}

function validateLanguageScore(test, ability, score) {
	if (isNaN(score))
		return false;
	else
		score = parseFloat(score);

	var scoreValid = true;

	switch (parseInt(test))
	{
		case languageTest.none:
			if (score < 0 || score > 10)
				scoreValid = false;
			break;

		case languageTest.celpip:
			if (score < 0 || score > 12)
				scoreValid = false;
			break;

		case languageTest.ielts:
			if (score < 1 || score > 9)
				scoreValid = false;
			break;

		case languageTest.tef:
			switch (ability)
			{
				case languageAbility.speaking:
					if (score < 0 || score > 450)
						scoreValid = false;
					break;

				case languageAbility.listening:
					if (score < 0 || score > 360)
						scoreValid = false;
					break;

				case languageAbility.reading:
					if (score < 0 || score > 300)
						scoreValid = false;
					break;

				case languageAbility.writing:
					if (score < 0 || score > 450)
						scoreValid = false;
					break;
			}
			break;
	}

	return scoreValid;
}

var questionFlow = function (request) {
	var payload = request.customPayload;

	console.log('payload', request);

	if (payload === undefined || payload === '') payload = null;

	if (typeof (payload) === 'string')
		payload = JSON.parse(payload);

	var responseJSON = {
		"response": null, // what the bot will respond with (more is appended below)
		"continue": false, // denotes that Motion AI should hit this module again, rather than continue further in the flow
		"customPayload": null, // working data to examine in future calls to this function to keep track of state
		"quickReplies": null, // a JSON object containing suggested/quick replies to display to the user
		"cards": null // a cards JSON object to display a carousel to the user (see docs)
	};

	if (request === null || payload == null)
	{
		payload = {
			question: questions.name
		}

		responseJSON.response = "Hello, nice to meet you.\nI'm CanadaBot. What is your name?";
	}
	else
	{
		var repeatQuestion = false;

		// Stores the answer in it's respective property
		switch (payload.question)
		{
			case questions.name:
				payload.name = request.reply;
				break;

			case questions.maritalStatus:
				switch (request.reply)
				{
					case 'Annulled Marriage':
					case 'Divorced / Separated':
					case 'Legally Separated':
					case 'Never Married / Single':
					case 'Widowed':
						payload.married = false;
						payload.spouseCanadianCitizen = false;
						payload.spouseCommingAlong = false;
						break;

					case 'Common-Law':
					case 'Married':
						payload.married = true;
						break;

					default:
						repeatQuestion = true;
						break;
				}
				break;

			case questions.spouseCanadianCitizen:
				payload.spouseCanadianCitizen = (request.reply === 'Yes');
				if (!payload.spouseCanadianCitizen) payload.spouseCommingAlong = false;
				break;

			case questions.spouseCommingAlong:
				payload.spouseCommingAlong = (request.reply === 'Yes');
				break;

			case questions.age:
				if (isNaN(request.reply))
					repeatQuestion = true;
				else
					payload.age = parseInt(request.reply);
				break;

			case questions.educationLevel:
				switch (request.reply)
				{
					case 'Less than secondary school (high school)':
						payload.educationLevel = educationLevel.LessThanSecondary;
						break;

					case 'Secondary diploma (high school graduation)':
						payload.educationLevel = educationLevel.Secondary;
						break;

					case 'One-year degree, diploma or certificate from  a university, college, trade or technical school, or other institute':
						payload.educationLevel = educationLevel.OneYearDegree;
						break;

					case 'Two-year program at a university, college, trade or technical school, or other institute':
						payload.educationLevel = educationLevel.TwoYearDegree;
						break;

					case 'Bachelor\'s degree OR  a three or more year program at a university, college, trade or technical school, or other institute':
						payload.educationLevel = educationLevel.BachelorsDegree;
						break;

					case 'Two or more certificates, diplomas, or degrees. One must be for a program of three or more years':
						payload.educationLevel = educationLevel.TwoOrMoreDegress;
						break;

					case 'Master\'s degree, OR professional degree needed to practice in a licensed profession (For “professional degree,” the degree program must have been in: medicine, veterinary medicine, dentistry, optometry, law, chiropractic medicine, or pharmacy.)':
						payload.educationLevel = educationLevel.MastersDegree;
						break;

					case 'Doctoral level university degree (Ph.D.)':
						payload.educationLevel = educationLevel.DoctoralDegree;
						break;

					default:
						repeatQuestion = true;
						break;
				}
				break;

			case questions.canadianDegreeDiplomaCertificate:
				break;

			case questions.canadianEducationLevel:
				switch (request.reply)
				{
					case 'Secondary (high school) or less':
						payload.educationInCanada = educationInCanada.SecondaryOrLess;
						break;

					case 'One-year or two-year diploma or certificate':
						payload.educationInCanada = educationInCanada.OneOrTwoYearDiplomaOrCertificate;
						break;

					case 'Degree, diploma or certificate of three years or longer OR a Master’s, professional or doctoral degree of at least one academic year':
						payload.educationInCanada = educationInCanada.ThreeOrMoreYearsDegree;
						break;

					default:
						repeatQuestion = true;
						break;
				}
				break;

			case questions.firstLanguageTest:
				payload.firstLanguage = languageObject();

				switch (request.reply)
				{
					case 'No':
						payload.firstLanguage.test = languageTest.none;
						break;

					case 'CELPIP':
						payload.firstLanguage.test = languageTest.celpip;
						break;

					case 'IELTS':
						payload.firstLanguage.test = languageTest.ielts;
						break;

					case 'TEF':
						payload.firstLanguage.test = languageTest.tef;
						break;

					default:
						repeatQuestion = true;
						break;
				}
				break;

			case questions.firstLanguageSpeaking:
				if (validateLanguageScore(payload.firstLanguage.test, languageAbility.speaking, request.reply))
					payload.firstLanguage.speaking = parseFloat(request.reply);
				else
					repeatQuestion = true;
				break;

			case questions.firstLanguageListening:
				if (validateLanguageScore(payload.firstLanguage.test, languageAbility.listening, request.reply))
					payload.firstLanguage.listening = parseFloat(request.reply);
				else
					repeatQuestion = true;
				break;

			case questions.firstLanguageReading:
				if (validateLanguageScore(payload.firstLanguage.test, languageAbility.reading, request.reply))
					payload.firstLanguage.reading = parseFloat(request.reply);
				else
					repeatQuestion = true;
				break;

			case questions.firstLanguageWriting:
				if (validateLanguageScore(payload.firstLanguage.test, languageAbility.writing, request.reply))
					payload.firstLanguage.writing = parseFloat(request.reply);
				else
					repeatQuestion = true;
				break;

			case questions.secondLanguageTest:
				payload.secondLanguage = languageObject();

				switch (request.reply)
				{
					case 'No':
						payload.secondLanguage.test = languageTest.none;
						break;

					case 'CELPIP':
						payload.secondLanguage.test = languageTest.celpip;
						break;

					case 'IELTS':
						payload.secondLanguage.test = languageTest.ielts;
						break;

					case 'TEF':
						payload.secondLanguage.test = languageTest.tef;
						break;

					default:
						repeatQuestion = true;
						break;
				}
				break;

			case questions.secondLanguageSpeaking:
				if (validateLanguageScore(payload.secondLanguage.test, languageAbility.speaking, request.reply))
					payload.secondLanguage.speaking = parseFloat(request.reply);
				else
					repeatQuestion = true;
				break;

			case questions.secondLanguageListening:
				if (validateLanguageScore(payload.secondLanguage.test, languageAbility.listening, request.reply))
					payload.secondLanguage.listening = parseFloat(request.reply);
				else
					repeatQuestion = true;
				break;

			case questions.secondLanguageReading:
				if (validateLanguageScore(payload.secondLanguage.test, languageAbility.reading, request.reply))
					payload.secondLanguage.reading = parseFloat(request.reply);
				else
					repeatQuestion = true;
				break;

			case questions.secondLanguageWriting:
				if (validateLanguageScore(payload.secondLanguage.test, languageAbility.writing, request.reply))
					payload.secondLanguage.writing = parseFloat(request.reply);
				else
					repeatQuestion = true;
				break;

			case questions.workExperienceInCanada:
				if (isNaN(request.reply))
					repeatQuestion = true;
				else
					payload.workInCanada = parseFloat(request.reply);
				break;

			case questions.workExperienceLastTenYears:
				if (isNaN(request.reply))
					repeatQuestion = true;
				else
					payload.workExperience = parseFloat(request.reply);
				break;

			case questions.certificateQualificationProvince:
				payload.certificateFromProvince = (request.reply === 'Yes');
				break;

			case questions.validJobOffer:
				payload.validJobOffer = (request.reply === 'Yes');
				break;

			case questions.jobOfferNoc:
				switch (request.reply)
				{
					case '00':
						payload.nocJobOffer = nocList._00;
						break;

					case '0':
						payload.nocJobOffer = nocList._0;
						break;

					case 'A':
						payload.nocJobOffer = nocList.A;
						break;

					case 'B':
						payload.nocJobOffer = nocList.B;
						break;

					case 'C':
						payload.nocJobOffer = nocList.C;
						break;

					case 'D':
						payload.nocJobOffer = nocList.D;
						break;

					default:
						repeatQuestion = true;
						break;
				}
				break;

			case questions.nominationCertificate:
				payload.nomination = (request.reply === 'Yes');
				break;

			case questions.spouseEducationLevel:
				switch (request.reply)
				{
					case 'Less than secondary school (high school)':
						payload.spouseEducationLevel = educationLevel.LessThanSecondary;
						break;

					case 'Secondary diploma (high school graduation)':
						payload.spouseEducationLevel = educationLevel.Secondary;

						break;
					case 'One-year degree, diploma or certificate from  a university, college, trade or technical school, or other institute':
						payload.spouseEducationLevel = educationLevel.OneYearDegree;

						break;
					case 'Two-year program at a university, college, trade or technical school, or other institute':
						payload.spouseEducationLevel = educationLevel.TwoYearDegree;

						break;
					case 'Bachelor\'s degree OR  a three or more year program at a university, college, trade or technical school, or other institute':
						payload.spouseEducationLevel = educationLevel.BachelorsDegree;

						break;
					case 'Two or more certificates, diplomas, or degrees. One must be for a program of three or more years':
						payload.spouseEducationLevel = educationLevel.TwoOrMoreDegress;

						break;
					case 'Master\'s degree, OR professional degree needed to practice in a licensed profession (For “professional degree,” the degree program must have been in: medicine, veterinary medicine, dentistry, optometry, law, chiropractic medicine, or pharmacy.)':
						payload.spouseEducationLevel = educationLevel.MastersDegree;

						break;
					case 'Doctoral level university degree (Ph.D.)':
						payload.spouseEducationLevel = educationLevel.DoctoralDegree;

						break;

					default:
						repeatQuestion = true;
						break;
				}
				break;

			case questions.spouseWorkExperienceInCanada:
				if (isNaN(request.reply))
					repeatQuestion = true;
				else
					payload.spouseWorkInCanada = parseFloat(request.reply);
				break;

			case questions.spouseLanguageTest:
				payload.spouseLanguage = languageObject();

				switch (request.reply)
				{
					case 'No':
						payload.spouseLanguage.test = languageTest.none;
						break;

					case 'CELPIP':
						payload.spouseLanguage.test = languageTest.celpip;
						break;

					case 'IELTS':
						payload.spouseLanguage.test = languageTest.ielts;
						break;

					case 'TEF':
						payload.spouseLanguage.test = languageTest.tef;
						break;

					default:
						repeatQuestion = true;
						break;
				}
				break;

			case questions.spouseLanguageSpeaking:
				if (validateLanguageScore(payload.spouseLanguage.test, languageAbility.speaking, request.reply))
					payload.spouseLanguage.speaking = parseFloat(request.reply);
				else
					repeatQuestion = true;
				break;

			case questions.spouseLanguageListening:
				if (validateLanguageScore(payload.spouseLanguage.test, languageAbility.listening, request.reply))
					payload.spouseLanguage.listening = parseFloat(request.reply);
				else
					repeatQuestion = true;
				break;

			case questions.spouseLanguageReading:
				if (validateLanguageScore(payload.spouseLanguage.test, languageAbility.reading, request.reply))
					payload.spouseLanguage.reading = parseFloat(request.reply);
				else
					repeatQuestion = true;
				break;

			case questions.spouseLanguageWriting:
				if (validateLanguageScore(payload.spouseLanguage.test, languageAbility.writing, request.reply))
					payload.spouseLanguage.writing = parseFloat(request.reply);
				else
					repeatQuestion = true;
				break;
		}

		if (!repeatQuestion)
		{
			// Defines the next question
			switch (payload.question)
			{
				case questions.name:
					payload.question = questions.maritalStatus;
					break;

				case questions.maritalStatus:
					if (payload.married)
						payload.question = questions.spouseCanadianCitizen;
					else
						payload.question = questions.age;
					break;

				case questions.spouseCanadianCitizen:
					if (payload.spouseCanadianCitizen)
						payload.question = questions.age;
					else
						payload.question = questions.spouseCommingAlong;
					break;

				case questions.spouseCommingAlong:
					payload.question = questions.age;
					break;

				case questions.age:
					payload.question = questions.educationLevel;
					break;

				case questions.educationLevel:
					payload.question = questions.canadianDegreeDiplomaCertificate;
					break;

				case questions.canadianDegreeDiplomaCertificate:
					if (request.reply === 'Yes')
						payload.question = questions.canadianEducationLevel;
					else
						payload.question = questions.firstLanguageTest;
					break;

				case questions.canadianEducationLevel:
					payload.question = questions.firstLanguageTest;
					break;

				case questions.firstLanguageTest:
					payload.question = questions.firstLanguageSpeaking;
					break;

				case questions.firstLanguageSpeaking:
					payload.question = questions.firstLanguageListening;
					break;

				case questions.firstLanguageListening:
					payload.question = questions.firstLanguageReading;
					break;

				case questions.firstLanguageReading:
					payload.question = questions.firstLanguageWriting;
					break;

				case questions.firstLanguageWriting:
					if (payload.firstLanguage.test == languageTest.none)
						payload.question = questions.workExperienceInCanada;
					else
						payload.question = questions.secondLanguageTest;
					break;

				case questions.secondLanguageTest:
					if (payload.secondLanguage.test == languageTest.none)
						payload.question = questions.workExperienceInCanada;
					else
						payload.question = questions.secondLanguageSpeaking;
					break;

				case questions.secondLanguageSpeaking:
					payload.question = questions.secondLanguageListening;
					break;

				case questions.secondLanguageListening:
					payload.question = questions.secondLanguageReading;
					break;

				case questions.secondLanguageReading:
					payload.question = questions.secondLanguageWriting;
					break;

				case questions.secondLanguageWriting:
					payload.question = questions.workExperienceInCanada;
					break;

				case questions.workExperienceInCanada:
					payload.question = questions.workExperienceLastTenYears;
					break;

				case questions.workExperienceLastTenYears:
					payload.question = questions.certificateQualificationProvince;
					break;

				case questions.certificateQualificationProvince:
					payload.question = questions.validJobOffer;
					break;

				case questions.validJobOffer:
					if (payload.validJobOffer)
						payload.question = questions.jobOfferNoc;
					else
						payload.question = questions.nominationCertificate;
					break;

				case questions.jobOfferNoc:
					payload.question = questions.nominationCertificate;
					break;

				case questions.nominationCertificate:
					if (Boolean.parse(payload.married))
					{
						if (Boolean.parse(payload.spouseCanadianCitizen))
							payload.question = questions.calculate;
						else
						{
							if (Boolean.parse(payload.spouseCommingAlong))
								payload.question = questions.spouseEducationLevel;
							else
								payload.question = questions.calculate;
						}
					}
					else
						payload.question = questions.calculate;
					break;

				case questions.spouseEducationLevel:
					payload.question = questions.spouseWorkExperienceInCanada;
					break;

				case questions.spouseWorkExperienceInCanada:
					payload.question = questions.spouseLanguageTest;
					break;

				case questions.spouseLanguageTest:
					if (payload.spouseLanguage.test == languageTest.none)
						payload.question = questions.calculate;
					else
						payload.question = questions.spouseLanguageSpeaking;
					break;

				case questions.spouseLanguageSpeaking:
					payload.question = questions.spouseLanguageListening;
					break;

				case questions.spouseLanguageListening:
					payload.question = questions.spouseLanguageReading;
					break;

				case questions.spouseLanguageReading:
					payload.question = questions.spouseLanguageWriting;
					break;

				case questions.spouseLanguageWriting:
					payload.question = questions.calculate;
					break;
			}
		}

		// Fill up the responseJSON for the next question
		switch (payload.question)
		{
			case questions.maritalStatus:
				responseJSON.response = "Hi " + payload.name + ". What is your marital status?";
				responseJSON.quickReplies = ['Annulled Marriage',
					'Common-Law',
					'Divorced / Separated',
					'Legally Separated',
					'Married',
					'Never Married / Single',
					'Widowed'];
				break;

			case questions.spouseCanadianCitizen:
				responseJSON.response = "Is your spouse or common-law partner a citizen or permanent resident of Canada?";
				responseJSON.quickReplies = ['Yes', 'No'];
				break;

			case questions.spouseCommingAlong:
				responseJSON.response = "Will your spouse or common-law partner come with you to Canada?";
				responseJSON.quickReplies = ['Yes', 'No'];
				break;

			case questions.age:
				responseJSON.response = "How old are you? (Only the numbers please)";
				break;

			case questions.educationLevel:
				responseJSON.response = "What is your education level?";
				responseJSON.quickReplies = ['Less than secondary school (high school)',
					'Secondary diploma (high school graduation)',
					'One-year degree, diploma or certificate from  a university, college, trade or technical school, or other institute',
					'Two-year program at a university, college, trade or technical school, or other institute',
					'Bachelor\'s degree OR  a three or more year program at a university, college, trade or technical school, or other institute',
					'Two or more certificates, diplomas, or degrees. One must be for a program of three or more years',
					'Master\'s degree, OR professional degree needed to practice in a licensed profession (For “professional degree,” the degree program must have been in: medicine, veterinary medicine, dentistry, optometry, law, chiropractic medicine, or pharmacy.)',
					'Doctoral level university degree (Ph.D.)'];
				break;

			case questions.canadianDegreeDiplomaCertificate:
				responseJSON.response = "Have you earned a Canadian degree, diploma or certificate?";
				responseJSON.quickReplies = ['Yes', 'No'];
				break;

			case questions.canadianEducationLevel:
				responseJSON.response = "What is your education level in Canada?";
				responseJSON.quickReplies = ['Secondary (high school) or less',
					'One-year or two-year diploma or certificate',
					'Degree, diploma or certificate of three years or longer OR a Master’s, professional or doctoral degree of at least one academic year'];
				break;

			case questions.firstLanguageTest:
				responseJSON.response = "Did you take a language test?";
				responseJSON.quickReplies = ['No',
					'CELPIP',
					'IELTS',
					'TEF'];
				break;

			case questions.firstLanguageSpeaking:
				switch (parseInt(payload.firstLanguage.test))
				{
					case languageTest.none:
						responseJSON.response = "In a scale of 0 to 10, where 0 you cannot speak English at all and 10 you master it, how good do you Speak in English?";
						break;

					case languageTest.celpip:
						responseJSON.response = "What is your Speaking Score on the CELIP test?";
						break;

					case languageTest.ielts:
						responseJSON.response = "What is your Speaking Score on the IELTS test?";
						break;

					case languageTest.tef:
						responseJSON.response = "What is your Speaking Score on the TEF test?";
						break;

				}
				break;

			case questions.firstLanguageListening:
				switch (parseInt(payload.firstLanguage.test))
				{
					case languageTest.none:
						responseJSON.response = "In a scale of 0 to 10, where 0 you cannot understand spoken English at all and 10 you master it, how good do you Understand Spoken English?";
						break;

					case languageTest.celpip:
						responseJSON.response = "What is your Listening Score on the CELIP test?";
						break;

					case languageTest.ielts:
						responseJSON.response = "What is your Listening Score on the IELTS test?";
						break;

					case languageTest.tef:
						responseJSON.response = "What is your Listening Score on the TEF test?";
						break;

				}
				break;

			case questions.firstLanguageReading:
				switch (parseInt(payload.firstLanguage.test))
				{
					case languageTest.none:
						responseJSON.response = "In a scale of 0 to 10, where 0 you cannot read English at all and 10 you master it, how good do you Read in English?";
						break;

					case languageTest.celpip:
						responseJSON.response = "What is your Reading Score on the CELIP test?";
						break;

					case languageTest.ielts:
						responseJSON.response = "What is your Reading Score on the IELTS test?";
						break;

					case languageTest.tef:
						responseJSON.response = "What is your Reading Score on the TEF test?";
						break;

				}
				break;

			case questions.firstLanguageWriting:
				switch (parseInt(payload.firstLanguage.test))
				{
					case languageTest.none:
						responseJSON.response = "In a scale of 0 to 10, where 0 you cannot write in English at all and 10 you master it, how good do you Write in English?";
						break;

					case languageTest.celpip:
						responseJSON.response = "What is your Writing Score on the CELIP test?";
						break;

					case languageTest.ielts:
						responseJSON.response = "What is your Writing Score on the IELTS test?";
						break;

					case languageTest.tef:
						responseJSON.response = "What is your Writing Score on the TEF test?";
						break;

				}
				break;

			case questions.secondLanguageTest:
				responseJSON.response = "Did you take a second language test?";

				if (payload.firstLanguage.test == languageTest.tef)
					responseJSON.quickReplies = ['No',
						'CELPIP',
						'IELTS'];
				else
					responseJSON.quickReplies = ['No',
						'TEF'];
				break;

			case questions.secondLanguageSpeaking:
				switch (parseInt(payload.secondLanguage.test))
				{
					case languageTest.celpip:
						responseJSON.response = "What is your Speaking Score on the CELIP test?";
						break;

					case languageTest.ielts:
						responseJSON.response = "What is your Speaking Score on the IELTS test?";
						break;

					case languageTest.tef:
						responseJSON.response = "What is your Speaking Score on the TEF test?";
						break;

				}
				break;

			case questions.secondLanguageListening:
				switch (parseInt(payload.secondLanguage.test))
				{
					case languageTest.celpip:
						responseJSON.response = "What is your Listening Score on the CELIP test?";
						break;

					case languageTest.ielts:
						responseJSON.response = "What is your Listening Score on the IELTS test?";
						break;

					case languageTest.tef:
						responseJSON.response = "What is your Listening Score on the TEF test?";
						break;

				}
				break;

			case questions.secondLanguageReading:
				switch (parseInt(payload.secondLanguage.test))
				{
					case languageTest.celpip:
						responseJSON.response = "What is your Reading Score on the CELIP test?";
						break;

					case languageTest.ielts:
						responseJSON.response = "What is your Reading Score on the IELTS test?";
						break;

					case languageTest.tef:
						responseJSON.response = "What is your Reading Score on the TEF test?";
						break;

				}
				break;

			case questions.secondLanguageWriting:
				switch (parseInt(payload.secondLanguage.test))
				{
					case languageTest.celpip:
						responseJSON.response = "What is your Writing Score on the CELIP test?";
						break;

					case languageTest.ielts:
						responseJSON.response = "What is your Writing Score on the IELTS test?";
						break;

					case languageTest.tef:
						responseJSON.response = "What is your Writing Score on the TEF test?";
						break;

				}
				break;

			case questions.workExperienceInCanada:
				responseJSON.response = "In the last ten years, how many years of skilled work experience in Canada do you have?";
				break;

			case questions.workExperienceLastTenYears:
				responseJSON.response = "How many years of skilled work experience, in total, do you have?";
				break;

			case questions.certificateQualificationProvince:
				responseJSON.response = "Do you have a certificate of qualification from a Canadian province or territory?";
				responseJSON.quickReplies = ['Yes', 'No'];
				break;

			case questions.validJobOffer:
				responseJSON.response = "Do you have a valid job offer supported by a Labour Market Impact Assessment (if needed)?";
				responseJSON.quickReplies = ['Yes', 'No'];
				break;

			case questions.jobOfferNoc:
				responseJSON.response = "Which NOC skill type or level is the job offer?";
				responseJSON.quickReplies = ['00', '0', 'A', 'B', 'C', 'D'];
				break;

			case questions.nominationCertificate:
				responseJSON.response = "Do you have a nomination certificate from a province or territory?";
				responseJSON.quickReplies = ['Yes', 'No'];
				break;

			case questions.spouseEducationLevel:
				responseJSON.response = "What is your spouse or common-law partner's education level?";
				responseJSON.quickReplies = ['Less than secondary school (high school)',
					'Secondary diploma (high school graduation)',
					'One-year degree, diploma or certificate from  a university, college, trade or technical school, or other institute',
					'Two-year program at a university, college, trade or technical school, or other institute',
					'Bachelor\'s degree OR  a three or more year program at a university, college, trade or technical school, or other institute',
					'Two or more certificates, diplomas, or degrees. One must be for a program of three or more years',
					'Master\'s degree, OR professional degree needed to practice in a licensed profession (For “professional degree,” the degree program must have been in: medicine, veterinary medicine, dentistry, optometry, law, chiropractic medicine, or pharmacy.)',
					'Doctoral level university degree (Ph.D.)'];
				break;

			case questions.spouseWorkExperienceInCanada:
				responseJSON.response = "In the last ten years, how many years of skilled work experience in Canada does your spouse/common-law partner have?";
				break;

			case questions.spouseLanguageTest:
				responseJSON.response = "Did your your spouse or common-law partner take a language test?";
				responseJSON.quickReplies = ['No',
					'CELPIP',
					'IELTS',
					'TEF'];
				break;

			case questions.spouseLanguageSpeaking:
				switch (parseInt(payload.spouseLanguage.test))
				{
					case languageTest.celpip:
						responseJSON.response = "What is your spouse or common-law partner Speaking Score on the CELIP test?";
						break;

					case languageTest.ielts:
						responseJSON.response = "What is your spouse or common-law partner Speaking Score on the IELTS test?";
						break;

					case languageTest.tef:
						responseJSON.response = "What is your Sspouse or common-law partner peaking Score on the TEF test?";
						break;

				}
				break;

			case questions.spouseLanguageListening:
				switch (parseInt(payload.spouseLanguage.test))
				{
					case languageTest.celpip:
						responseJSON.response = "What is your spouse or common-law partner Listening Score on the CELIP test?";
						break;

					case languageTest.ielts:
						responseJSON.response = "What is your spouse or common-law partner Listening Score on the IELTS test?";
						break;

					case languageTest.tef:
						responseJSON.response = "What is your spouse or common-law partner Listening Score on the TEF test?";
						break;

				}
				break;

			case questions.spouseLanguageReading:
				switch (parseInt(payload.spouseLanguage.test))
				{
					case languageTest.celpip:
						responseJSON.response = "What is your spouse or common-law partner Reading Score on the CELIP test?";
						break;

					case languageTest.ielts:
						responseJSON.response = "What is your spouse or common-law partner Reading Score on the IELTS test?";
						break;

					case languageTest.tef:
						responseJSON.response = "What is your spouse or common-law partner Reading Score on the TEF test?";
						break;

				}
				break;

			case questions.spouseLanguageWriting:
				switch (parseInt(payload.spouseLanguage.test))
				{
					case languageTest.celpip:
						responseJSON.response = "What is your spouse or common-law partner Writing Score on the CELIP test?";
						break;

					case languageTest.ielts:
						responseJSON.response = "What is your spouse or common-law partner Writing Score on the IELTS test?";
						break;

					case languageTest.tef:
						responseJSON.response = "What is your spouse or common-law partner Writing Score on the TEF test?";
						break;

				}
				break;
		}
	}

	responseJSON.customPayload = payload;

	return responseJSON;
}

module.exports = {
	nextFlow: questionFlow
};