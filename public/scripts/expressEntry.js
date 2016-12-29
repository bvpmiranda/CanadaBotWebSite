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

function languageObject() {
	return {/** {enum} Language test taken
		 * 
		 * Use the languageTest enum
		 */
		test: null,
		/** None: 0 to 10
		 * 
		 * CELPIP: 0 to 12
		 * 
		 * IELTS: 0.0 to 9.0
		 * 
		 * TEF: 0 to 450
		 */
		speaking: null,
		/** None: 0 to 10
		 * 
		 * CELPIP: 0 to 12
		 * 
		 * IELTS: 0.0 to 9.0
		 * 
		 * TEF: 0 to 360
		 */
		listening: null,
		/** None: 0 to 10
		 * 
		 * CELPIP: 0 to 12
		 * 
		 * IELTS: 0.0 to 9.0
		 * 
		 * TEF: 0 to 300
		 */
		reading: null,
		/** None: 0 to 10
		 * 
		 * CELPIP: 0 to 12
		 * 
		 * IELTS: 0.0 to 9.0
		 * 
		 * TEF: 0 to 450
		 */
		writting: null
	}
}

/**
 * Parameters used to calculate the score
 */
var calculatorParameters = {
	/** {boolean} Is the principal applicant married? */
	married: null,
	/** {boolean} Is the spouse a Canadian Citizen? */
	spouseCanadianCitizen: null,
	/** {boolean} Is the spouse coming along? */
	spouseCommingAlong: null,

	/** {integer} Age of the principal applicant */
	age: null, // integer
	/** {enum} Education Level of the principal applicant
	 * 
	 * Use the educationLevel enum
	 */
	educationLevel: null, // enum
	/** {enum} Education the principal applicant aquired in Canada
	 * 
	 * Use the educationInCanada enum
	 */
	educationInCanada: null, // enum

	/** {object} Scores for the first language */
	firstLanguage: languageObject(),

	/** {object} Scores for the second language */
	secondLanguage: languageObject(),

	/** {number} How many years have the principal applicant worked in Canada? */
	workInCanada: null,
	/** {number} How many years of experience the principal applicant have? */
	workExperience: null,

	/** {boolean} Does the principal applicant have a Certificate from a Province? */
	certificateFromProvince: null,
	/** {enum} Does the principal applicant have a Valid Job Offer?
	 * 
	 * Use the nocList enum
	 */
	nocJobOffer: null,
	/** {boolean} Does the principal applicant have a Nomination from a Province? */
	nomination: null,

	/** {enum} Education Level of the spouse
	 * 
	 * Use the educationLevel enum
	 */
	spouseEducationLevel: null, // enum
	/** {number} How many years have the spouse worked in Canada? */
	spouseWorkInCanada: null, // enum

	/** {object} Scores for the language of the spouse */
	spouseLanguage: languageObject(),
}

/** Object returned with the scores for the Express Entry */
var scores = {
	coreHumanCapitalFactors: {
		age: null,
		levelOfEducation: null,
		studyInCadada: null,
		officialLanguages: {
			first: {
				speaking: 0,
				listening: 0,
				reading: 0,
				writting: 0,
				total: 0
			},
			second: {
				speaking: 0,
				listening: 0,
				reading: 0,
				writting: 0,
				total: 0
			}
		},
		canadianWorkExperience: null,
		subTotal: null
	},
	spouseFactors: {
		levelOfEducation: null,
		officialLanguage: {
			speaking: 0,
			listening: 0,
			reading: 0,
			writting: 0,
			total: 0
		},
		canadianWorkExperience: null,
		subTotal: null
	},
	skillTransferabilityFactors: {
		education: {
			officialLanguageProficiency: 0,
			canadianWorkExperience: 0,
			subTotal: 0
		},
		foreignWorkExperience: {
			officialLanguageProficiency: 0,
			canadianWorkExperience: 0,
			subTotal: 0
		},
		certificateOfQualification: 0,
		subTotal: 0
	},
	additionalPoints: {
		studyInCadada: 0,
		jobOffer: 0,
		provincialNomination: 0,
		subTotal: 0
	},
	total: null
};

/**
 * Determine if the points are going to be calculated as single or as married.
 * If the person is married, but the spouse is Canadian or is not comming along,
 * the calculations are done as single.
 * 
 * @param {object} calculatorParameters calculatorParameters for the calculation 
 * 
 * @returns {Boolean} 
 *
 * @author Bruno Miranda
 */
function isSingle() {
	var single = !calculatorParameters.married;

	if (calculatorParameters.married && (calculatorParameters.spouseCanadianCitizen || !calculatorParameters.spouseCommingAlong))
		single = true;

	return single;
}

/**
 * Calculates the score for the Additional Points
 * 
 * @param {object} calculatorParameters calculatorParameters for the calculation 
 * 
 * @returns {object} Returns the ammount of points given for the section. 
 *
 * @author Bruno Miranda
 */
function calculateAdditionalPoins() {
	var additionalPoints = {
		studyInCadada: 0,
		jobOffer: 0,
		provincialNomination: 0,
		subTotal: 0
	}

	additionalPoints.studyInCadada = calculateEducationInCanada();
	additionalPoints.jobOffer = calculateJobOffer();
	additionalPoints.provincialNomination = calculateProvincialNomination();

	additionalPoints.subTotal = additionalPoints.studyInCadada +
		additionalPoints.jobOffer +
		additionalPoints.provincialNomination;

	return additionalPoints;
}

/**
 * Calculates the score for the age.
 * 
 * @param {object} calculatorParameters calculatorParameters for the calculation 
 * 
 * @returns {Number} Returns the ammount of points given. 
 *
 * @author Bruno Miranda
 */
function calculateAge() {
	switch (calculatorParameters.age)
	{
		case 18:
			return (isSingle() ? 99 : 90);

		case 19:
			return (isSingle() ? 105 : 95);

		case 20:
		case 21:
		case 22:
		case 23:
		case 24:
		case 25:
		case 26:
		case 27:
		case 28:
		case 29:
			return (isSingle() ? 110 : 100);

		case 30:
			return (isSingle() ? 105 : 95);

		case 31:
			return (isSingle() ? 99 : 90);

		case 32:
			return (isSingle() ? 94 : 85);

		case 33:
			return (isSingle() ? 88 : 80);

		case 34:
			return (isSingle() ? 83 : 75);

		case 35:
			return (isSingle() ? 77 : 70);

		case 36:
			return (isSingle() ? 72 : 65);

		case 37:
			return (isSingle() ? 66 : 60);

		case 38:
			return (isSingle() ? 61 : 55);

		case 39:
			return (isSingle() ? 55 : 50);

		case 40:
			return (isSingle() ? 50 : 45);

		case 41:
			return (isSingle() ? 39 : 35);

		case 42:
			return (isSingle() ? 28 : 25);

		case 43:
			return (isSingle() ? 17 : 15);

		case 44:
			return (isSingle() ? 6 : 5);
	}

	return 0;
}

/**
 * Calculates the CLB levels for the CELPIP test.
 * 
 * @param {object} language Pass the first or second language object
 * @param {boolean} principalApplicant Indicates if the score is for the principal applicant 
 * @param {boolean} firstLanguage Indicates if the score is for the first or second language 
 * 
 * @returns {object} Returns the CLB levels for each skill. 
 *
 * @author Bruno Miranda
 */
function calculateCelpip(language, principalApplicant, firstLanguage) {
	var clbs = {
		speaking: language.speaking,
		listening: language.listening,
		reading: language.reading,
		writting: language.writting
	}

	if (clbs.speaking <= 3)
		clbs.speaking = 0;
	else if (clbs.speaking >= 10)
		clbs.speaking = 10;

	if (clbs.listening <= 3)
		clbs.listening = 0;
	else if (clbs.listening >= 10)
		clbs.listening = 10;

	if (clbs.reading <= 3)
		clbs.reading = 0;
	else if (clbs.reading >= 10)
		clbs.reading = 10;

	if (clbs.writting <= 3)
		clbs.writting = 0;
	else if (clbs.writting >= 10)
		clbs.writting = 10;

	return result;
}

/**
 * Calculates the score for the certificate of qualification transferability.
 * 
 * @param {object} calculatorParameters calculatorParameters for the calculation 
 * @param {number} clb5Count Quantity of CLB5 or higher on the laguage skills 
 * @param {number} clb7Count Quantity of CLB7 or higher on the laguage skills 
 * 
 * @returns {Number} Returns the ammount of points given.
 *
 * @author Bruno Miranda 
 */
function calculateCertificateOfQualitication(clb5Count, clb7Count) {
	if (calculatorParameters.certificateFromProvince === true)
	{
		if (clb5Count === 4 && clb7Count < 4)
			return 25
		else if (clb7Count === 4)
			return 50;
	}

	return 0;
}

/**
 * Calculates the score for the Language test based on the CLB skill.
 * 
 * @param {object} calculatorParameters calculatorParameters for the calculation 
 * @param {object} clbLevel Pass the clb level of the skill
 * @param {boolean} principalApplicant Indicates if the score is for the principal applicant 
 * @param {boolean} firstLanguage Indicates if the score is for the first or second language 
 * 
 * @returns {object} Returns the ammount of points given for each skill. 
 *
 * @author Bruno Miranda
 */
var calculateCLB = function (clbLevel, principalApplicant, firstLanguage) {
	if (principalApplicant)
	{
		switch (clbLevel)
		{
			case 4:
				return (firstLanguage ? (isSingle() ? 6 : 6) : (isSingle() ? 0 : 0));

			case 5:
				return (firstLanguage ? (isSingle() ? 6 : 6) : (isSingle() ? 1 : 1));

			case 6:
				return (firstLanguage ? (isSingle() ? 9 : 8) : (isSingle() ? 1 : 1));

			case 7:
				return (firstLanguage ? (isSingle() ? 17 : 16) : (isSingle() ? 3 : 3));

			case 8:
				return (firstLanguage ? (isSingle() ? 23 : 22) : (isSingle() ? 3 : 3));

			case 9:
				return (firstLanguage ? (isSingle() ? 31 : 29) : (isSingle() ? 6 : 6));

			case 10:
				return (firstLanguage ? (isSingle() ? 34 : 32) : (isSingle() ? 6 : 6));
		}
	}
	else
	{
		switch (clbLevel)
		{
			case 4:
				return 0;

			case 5:
			case 6:
				return 1;

			case 7:
			case 8:
				return 3;

			case 9:
			case 10:
				return 5;
		}
	}

	return 0;
}

/**
 * Calculates the score for the Language test based on the CLB.
 * 
 * @param {object} calculatorParameters calculatorParameters for the calculation 
 * @param {object} clbs Pass the CLB level for each skill
 * @param {boolean} principalApplicant Indicates if the score is for the principal applicant 
 * @param {boolean} firstLanguage Indicates if the score is for the first or second language 
 * 
 * @returns {object} Returns the ammount of points given for each skill. 
 *
 * @author Bruno Miranda
 */
var calculateCLBs = function (clbs, principalApplicant, firstLanguage) {
	var result = {
		speaking: calculateCLB(clbs.speaking, principalApplicant, firstLanguage),
		listening: calculateCLB(clbs.listening, principalApplicant, firstLanguage),
		reading: calculateCLB(clbs.reading, principalApplicant, firstLanguage),
		writting: calculateCLB(clbs.writting, principalApplicant, firstLanguage),
		total: 0
	}

	result.total = result.speaking + result.listening + result.reading + result.writting;

	return result;
}

/**
 * Calculates the score for the Section Core/Human Capital Factors
 * 
 * @param {object} calculatorParameters calculatorParameters for the calculation 
 * 
 * @returns {object} Returns the ammount of points given for the section. 
 *
 * @author Bruno Miranda
 */
var calculateCoreHumanCapitalFactors = function () {
	var coreHumanCapitalFactors = {
		age: null,
		levelOfEducation: null,
		officialLanguages: {
			first: {
				speaking: 0,
				listening: 0,
				reading: 0,
				writting: 0,
				total: 0
			},
			second: {
				speaking: 0,
				listening: 0,
				reading: 0,
				writting: 0,
				total: 0
			}
		},
		canadianWorkExperience: null,
		subTotal: null
	}

	coreHumanCapitalFactors.age = calculateAge();
	coreHumanCapitalFactors.levelOfEducation = calculateEducation(true);
	coreHumanCapitalFactors.officialLanguages.first = calculateLanguage(true, true);

	if (calculatorParameters.secondLanguage.test !== null)
		coreHumanCapitalFactors.officialLanguages.second = calculateLanguage(true, false);

	coreHumanCapitalFactors.canadianWorkExperience = calculateWorkInCanada();

	coreHumanCapitalFactors.subTotal = coreHumanCapitalFactors.age +
		coreHumanCapitalFactors.levelOfEducation +
		coreHumanCapitalFactors.officialLanguages.first.total +
		coreHumanCapitalFactors.officialLanguages.second.total +
		coreHumanCapitalFactors.canadianWorkExperience;

	return coreHumanCapitalFactors;
}

/**
 * Calculates the score for the education of the principal applicant.
 * 
 * @param {object} calculatorParameters calculatorParameters for the calculation 
 * @param {boolean} principalApplicant Indicates if the score is for the principal applicant 
 * 
 * @returns {Number} Returns the ammount of points given.
 *
 * @author Bruno Miranda 
 */
var calculateEducation = function (principalApplicant) {
	if (principalApplicant)
	{
		switch (calculatorParameters.educationLevel)
		{
			case educationLevel.Secondary:
				return (isSingle() ? 30 : 28);

			case educationLevel.OneYearDegree:
				return (isSingle() ? 90 : 84);

			case educationLevel.TwoYearDegree:
				return (isSingle() ? 98 : 91);

			case educationLevel.BachelorsDegree:
				return (isSingle() ? 120 : 112);

			case educationLevel.TwoOrMoreDegress:
				return (isSingle() ? 128 : 119);

			case educationLevel.DoctoralDegree:
				return (isSingle() ? 135 : 126);

			case educationLevel.DoctoralDegree:
				return (isSingle() ? 150 : 140);
		}
	}
	else
	{
		switch (calculatorParameters.spouseEducationLevel)
		{
			case educationLevel.Secondary:
				return 2;

			case educationLevel.OneYearDegree:
				return 6;

			case educationLevel.TwoYearDegree:
				return 7;

			case educationLevel.BachelorsDegree:
				return 8;

			case educationLevel.TwoOrMoreDegress:
				return 9;

			case educationLevel.DoctoralDegree:
				return 10;

			case educationLevel.DoctoralDegree:
				return 10;
		}
	}
	return 0;
}

/**
 * Calculates the score for the education in Canada of the principal applicant.
 * 
 * @param {object} calculatorParameters calculatorParameters for the calculation 
 * 
 * @returns {Number} Returns the ammount of points given. 
 *
 * @author Bruno Miranda
 */
var calculateEducationInCanada = function () {
	if (calculatorParameters.educationInCanada !== null && calculatorParameters.educationInCanada !== undefined && typeof (calculatorParameters.educationInCanada) === 'number')
	{
		switch (calculatorParameters.educationInCanada)
		{
			case educationInCanada.OneOrTwoYearDiplomaOrCertificate:
				return 15;

			case educationInCanada.ThreeOrMoreYearsDegree:
				return 30;
		}
	}

	return 0;
}

/**
 * Calculates the score for the education transferability.
 * 
 * @param {object} calculatorParameters calculatorParameters for the calculation 
 * @param {number} clb7Count Quantity of CLB7 or higher on the laguage skills 
 * @param {number} clb9Count Quantity of CLB9 or higher on the laguage skills 
 * 
 * @returns {Number} Returns the ammount of points given.
 *
 * @author Bruno Miranda 
 */
var calculateEducationTransferability = function (clb7Count, clb9Count) {
	var educationTransferability = {
		officialLanguageProficiency: 0,
		canadianWorkExperience: 0,
		subTotal: 0
	};

	switch (calculatorParameters.educationLevel)
	{
		case educationLevel.OneYearDegree:
		case educationLevel.BachelorsDegree:
			if (clb7Count === 4 && clb9Count < 4)
				educationTransferability.officialLanguageProficiency += 13;
			else if (clb9Count === 4)
				educationTransferability.officialLanguageProficiency += 25;

			if (calculatorParameters.workInCanada >= 1 && calculatorParameters.workInCanada < 2)
				educationTransferability.canadianWorkExperience += 13;
			else if (calculatorParameters.workInCanada >= 2)
				educationTransferability.canadianWorkExperience += 25;

			break;

		case educationLevel.TwoOrMoreDegress:
		case educationLevel.MastersDegree:
		case educationLevel.DoctoralDegree:
			if (clb7Count === 4 && clb9Count < 4)
				educationTransferability.officialLanguageProficiency += 25;
			else if (clb9Count === 4)
				educationTransferability.officialLanguageProficiency += 50;

			if (calculatorParameters.workInCanada >= 1 && calculatorParameters.workInCanada < 2)
				educationTransferability.canadianWorkExperience += 25;
			else if (calculatorParameters.workInCanada >= 2)
				educationTransferability.canadianWorkExperience += 50;

			break;
	}

	educationTransferability.subTotal = educationTransferability.officialLanguageProficiency +
		educationTransferability.canadianWorkExperience

	if (educationTransferability.subTotal > 50)
		educationTransferability.subTotal = 50;

	return educationTransferability;
}

/**
 * Calculates the score for the foreign work experience transferability.
 * 
 * @param {object} calculatorParameters calculatorParameters for the calculation 
 * @param {number} clb7Count Quantity of CLB7 or higher on the laguage skills 
 * @param {number} clb9Count Quantity of CLB9 or higher on the laguage skills 
 * 
 * @returns {Number} Returns the ammount of points given.
 *
 * @author Bruno Miranda 
 */
var calculateForeignWorkExperienceTransferability = function (clb7Count, clb9Count) {
	var foreignWorkExperience = {
		officialLanguageProficiency: 0,
		canadianWorkExperience: 0,
		subTotal: 0
	};

	switch (true)
	{
		case calculatorParameters.workExperience >= 1 && calculatorParameters.workExperience < 3:
			if (clb7Count === 4 && clb9Count < 4)
				foreignWorkExperience.officialLanguageProficiency += 13;
			else if (clb9Count === 4)
				foreignWorkExperience.officialLanguageProficiency += 25;

			if (calculatorParameters.workInCanada >= 1 && calculatorParameters.workInCanada < 2)
				foreignWorkExperience.canadianWorkExperience += 13;
			else if (calculatorParameters.workInCanada >= 2)
				foreignWorkExperience.canadianWorkExperience += 25;

			break;

		case calculatorParameters.workExperience >= 3:
			if (clb7Count === 4 && clb9Count < 4)
				foreignWorkExperience.officialLanguageProficiency += 25;
			else if (clb9Count === 4)
				foreignWorkExperience.officialLanguageProficiency += 50;

			if (calculatorParameters.workInCanada >= 1 && calculatorParameters.workInCanada < 2)
				foreignWorkExperience.canadianWorkExperience += 25;
			else if (calculatorParameters.workInCanada >= 2)
				foreignWorkExperience.canadianWorkExperience += 50;

			break;
	}

	foreignWorkExperience.subTotal = foreignWorkExperience.officialLanguageProficiency +
		foreignWorkExperience.canadianWorkExperience

	if (foreignWorkExperience.subTotal > 50)
		foreignWorkExperience.subTotal = 50;

	return foreignWorkExperience;
}

/**
 * Calculates the CLB levels for the IELTS test.
 * 
 * @param {object} calculatorParameters calculatorParameters for the calculation 
 * @param {object} language Pass the first or second language object
 * @param {boolean} principalApplicant Indicates if the score is for the principal applicant 
 * @param {boolean} firstLanguage Indicates if the score is for the first or second language 
 * 
 * @returns {object} Returns the CLB levels for each skill. 
 *
 * @author Bruno Miranda
 */
var calculateIelts = function (language, principalApplicant, firstLanguage) {
	var clbs = {
		speaking: 0,
		listening: 0,
		reading: 0,
		writting: 0
	}

	var score;
	var clb;

	score = language.speaking;
	clb = 0;
	switch (true)
	{
		case score === 4.5:
			clb = 4;
			break;

		case score === 5:
			clb = 5;
			break;

		case score === 5.5:
			clb = 6;
			break;

		case score === 6:
			clb = 7;
			break;

		case score === 6.5:
			clb = 8;
			break;

		case score === 7:
			clb = 9;
			break;

		case score >= 7.5:
			clb = 10;
			break;

	}
	clbs.speaking = clb;

	score = language.listening;
	clb = 0;
	switch (true)
	{
		case score === 4.5:
			clb = 4;
			break;

		case score === 5:
			clb = 5;
			break;

		case score === 5.5:
			clb = 6;
			break;

		case score >= 6 && score < 7.5:
			clb = 7;
			break;

		case score === 7.5:
			clb = 8;
			break;

		case score === 8:
			clb = 9;
			break;

		case score >= 8.5:
			clb = 10;
			break;

	}
	clbs.listening = clb;

	score = language.reading;
	clb = 0;
	switch (true)
	{
		case score === 3.5:
			clb = 4;
			break;

		case score >= 4 && score < 5:
			clb = 5;
			break;

		case score >= 5 && score < 6:
			clb = 6;
			break;

		case score === 6:
			clb = 7;
			break;

		case score === 6.5:
			clb = 8;
			break;

		case score >= 7 && score < 8:
			clb = 9;
			break;

		case score >= 8:
			clb = 10;
			break;

	}
	clbs.reading = clb;

	score = language.writting;
	clb = 0;
	switch (true)
	{
		case score >= 4 && score < 5:
			clb = 4;
			break;

		case score === 5:
			clb = 5;
			break;

		case score === 5.5:
			clb = 6;
			break;

		case score === 6:
			clb = 7;
			break;

		case score === 6.5:
			clb = 8;
			break;

		case score === 7:
			clb = 9;
			break;

		case score >= 7.5:
			clb = 10;
			break;

	}
	clbs.writting = clb;

	return clbs;
}

/**
 * Calculates the score for the Job Offer
 * 
 * @param {object} calculatorParameters calculatorParameters for the calculation 
 * 
 * @returns {Number} Returns the ammount of points given. 
 *
 * @author Bruno Miranda
 */
var calculateJobOffer = function () {
	switch (calculatorParameters.nocJobOffer)
	{
		case nocList._00:
			return 200;

		case nocList._0:
		case nocList.A:
		case nocList.B:
			return 50;

	}

	return 0;
}

/**
 * Calculates the score for the language.
 * 
 * @param {object} calculatorParameters calculatorParameters for the calculation 
 * @param {boolean} principalApplicant Indicates if the score is for the principal applicant 
 * @param {boolean} firstLanguage Indicates if the score is for the first or second language 
 * 
 * @returns {object} Returns the ammount of points given for each skill. 
 *
 * @author Bruno Miranda
 */
var calculateLanguage = function (principalApplicant, firstLanguage) {
	var clbs;
	var language;

	if (principalApplicant)
		language = (firstLanguage ? calculatorParameters.firstLanguage : calculatorParameters.secondLanguage);
	else
		language = calculatorParameters.spouseLanguage;

	switch (language.test)
	{
		case languageTest.none:
			clbs = language;
			break;

		case languageTest.celpip:
			clbs = calculateCelpip(language, principalApplicant, firstLanguage);
			break;

		case languageTest.ielts:
			clbs = calculateIelts(language, principalApplicant, firstLanguage);
			break;

		case languageTest.tef:
			clbs = calculateTef(language, principalApplicant, firstLanguage);
			break;
	}

	return calculateCLBs(clbs, principalApplicant, firstLanguage);
}

/**
 * Calculates the score for the Provincial Nomination
 * 
 * @param {object} calculatorParameters calculatorParameters for the calculation 
 * 
 * @returns {Number} Returns the ammount of points given. 
 *
 * @author Bruno Miranda
 */
var calculateProvincialNomination = function () {
	if (calculatorParameters.provincialNomination === true)
		return 600;

	return 0;
}

/**
 * Calculates the score for the Skill Transferability Factors
 * 
 * @param {object} calculatorParameters calculatorParameters for the calculation 
 * 
 * @returns {object} Returns the ammount of points given for the section. 
 *
 * @author Bruno Miranda
 */
var calculateSkillTransferabilityFactors = function () {
	var skillTransferabilityFactors = {
		education: {
			officialLanguageProficiency: 0,
			canadianWorkExperience: 0,
			subTotal: 0
		},
		foreignWorkExperience: {
			officialLanguageProficiency: 0,
			canadianWorkExperience: 0,
			subTotal: 0
		},
		certificateOfQualification: 0,
		subTotal: 0
	}

	var clbs;

	switch (calculatorParameters.firstLanguage.test)
	{
		case languageTest.none:
			clbs = language;
			break;

		case languageTest.celpip:
			clbs = calculateCelpip(calculatorParameters.firstLanguage, true, true);
			break;

		case languageTest.ielts:
			clbs = calculateIelts(calculatorParameters.firstLanguage, true, true);
			break;

		case languageTest.tef:
			clbs = calculateTef(calculatorParameters.firstLanguage, true, true);
			break;
	}

	var clb5Count = 0;

	if (clbs.speaking >= 5)
		clb5Count += 1;

	if (clbs.listening >= 5)
		clb5Count += 1;

	if (clbs.reading >= 5)
		clb5Count += 1;

	if (clbs.writting >= 5)
		clb5Count += 1;

	var clb7Count = 0;

	if (clbs.speaking >= 7)
		clb7Count += 1;

	if (clbs.listening >= 7)
		clb7Count += 1;

	if (clbs.reading >= 7)
		clb7Count += 1;

	if (clbs.writting >= 7)
		clb7Count += 1;

	var clb9Count = 0;

	if (clbs.speaking >= 9)
		clb9Count += 1;

	if (clbs.listening >= 9)
		clb9Count += 1;

	if (clbs.reading >= 9)
		clb9Count += 1;

	if (clbs.writting >= 9)
		clb9Count += 1;

	skillTransferabilityFactors.education = calculateEducationTransferability(clb7Count, clb9Count);
	skillTransferabilityFactors.foreignWorkExperience = calculateForeignWorkExperienceTransferability(clb7Count, clb9Count);
	skillTransferabilityFactors.certificateOfQualification = calculateCertificateOfQualitication(clb5Count, clb7Count);

	skillTransferabilityFactors.subTotal = skillTransferabilityFactors.education.subTotal +
		skillTransferabilityFactors.foreignWorkExperience.subTotal +
		skillTransferabilityFactors.certificateOfQualification;

	if (skillTransferabilityFactors.subTotal > 100)
		skillTransferabilityFactors.subTotal = 100;

	return skillTransferabilityFactors;
}

/**
 * Calculates the score for the Section Spouse Factors
 * 
 * @param {object} calculatorParameters calculatorParameters for the calculation 
 * 
 * @returns {object} Returns the ammount of points given for the section. 
 *
 * @author Bruno Miranda
 */
var calculateSpouseFactors = function () {
	var spouseFactors = {
		levelOfEducation: 0,
		officialLanguage: {
			speaking: 0,
			listening: 0,
			reading: 0,
			writting: 0,
			total: 0
		},
		canadianWorkExperience: 0,
		subTotal: 0
	}

	if (!isSingle())
	{
		spouseFactors.levelOfEducation = calculateEducation(false);
		spouseFactors.officialLanguage = calculateLanguage(false);
		spouseFactors.canadianWorkExperience = calculateWorkInCanada(false);

		spouseFactors.subTotal = spouseFactors.levelOfEducation +
			spouseFactors.officialLanguage.total +
			spouseFactors.canadianWorkExperience;
	}

	return spouseFactors;
}

/**
	 * Calculates the CLB levels for the TEF test.
	 * 
	 * @param {object} calculatorParameters calculatorParameters for the calculation 
	 * @param {object} language Pass the first or second language object
	 * @param {boolean} principalApplicant Indicates if the score is for the principal applicant 
	 * @param {boolean} firstLanguage Indicates if the score is for the first or second language 
	 * 
	 * @returns {object} Returns the CLB levels for each skill. 
	 *
	 * @author Bruno Miranda
	 */
function calculateTef(language, principalApplicant, firstLanguage) {
	var clbs = {
		speaking: 0,
		listening: 0,
		reading: 0,
		writting: 0
	}

	var score;
	var clb;

	score = language.speaking;
	clb = 0;
	switch (true)
	{
		case score >= 181 && score <= 225:
			clb = 4;
			break;

		case score >= 226 && score <= 270:
			clb = 5;
			break;

		case score >= 271 && score <= 309:
			clb = 6;
			break;

		case score >= 310 && score <= 348:
			clb = 7;
			break;

		case score >= 349 && score <= 370:
			clb = 8;
			break;

		case score >= 371 && score <= 392:
			clb = 9;
			break;

		case score >= 393 && score <= 415:
			clb = 10;
			break;

	}
	clbs.speaking = clb;

	score = language.listening;
	clb = 0;
	switch (true)
	{
		case score >= 145 && score <= 180:
			clb = 4;
			break;

		case score >= 181 && score <= 216:
			clb = 5;
			break;

		case score >= 217 && score <= 248:
			clb = 6;
			break;

		case score >= 249 && score <= 279:
			clb = 7;
			break;

		case score >= 280 && score <= 297:
			clb = 8;
			break;

		case score >= 298 && score <= 315:
			clb = 9;
			break;

		case score >= 316 && score <= 333:
			clb = 10;
			break;

	}
	clbs.listening = clb;

	score = language.reading;
	clb = 0;
	switch (true)
	{
		case score >= 121 && score <= 150:
			clb = 4;
			break;

		case score >= 151 && score <= 180:
			clb = 5;
			break;

		case score >= 181 && score <= 206:
			clb = 6;
			break;

		case score >= 207 && score <= 232:
			clb = 7;
			break;

		case score >= 233 && score <= 247:
			clb = 8;
			break;

		case score >= 248 && score <= 262:
			clb = 9;
			break;

		case score >= 263 && score <= 277:
			clb = 10;
			break;

	}
	clbs.reading = clb;

	score = language.writting;
	clb = 0;
	switch (true)
	{
		case score >= 181 && score <= 225:
			clb = 4;
			break;

		case score >= 226 && score <= 270:
			clb = 5;
			break;

		case score >= 271 && score <= 309:
			clb = 6;
			break;

		case score >= 310 && score <= 348:
			clb = 7;
			break;

		case score >= 349 && score <= 370:
			clb = 8;
			break;

		case score >= 371 && score <= 392:
			clb = 9;
			break;

		case score >= 393 && score <= 415:
			clb = 10;
			break;

	}
	clbs.writting = clb;

	return clbs;
}

/**
 * Calculates the score for the work experience in Canada.
 * 
 * @param {object} calculatorParameters calculatorParameters for the calculation 
 * @param {boolean} principalApplicant Indicates if the score is for the principal applicant 
 * 
 * @returns {Number} Returns the ammount of points given. 
 *
 * @author Bruno Miranda
 */
function calculateWorkInCanada(principalApplicant) {
	if (principalApplicant)
	{
		switch (true)
		{
			case calculatorParameters.workInCanada >= 1 && calculatorParameters.workInCanada < 2:
				return (isSingle() ? 40 : 35);

			case calculatorParameters.workInCanada >= 2 && calculatorParameters.workInCanada < 3:
				return (isSingle() ? 53 : 46);

			case calculatorParameters.workInCanada >= 3 && calculatorParameters.workInCanada < 4:
				return (isSingle() ? 64 : 56);

			case calculatorParameters.workInCanada >= 4 && calculatorParameters.workInCanada < 5:
				return (isSingle() ? 72 : 63);

			case calculatorParameters.workInCanada >= 5:
				return (isSingle() ? 80 : 70);
		}
	}
	else
	{
		switch (true)
		{
			case calculatorParameters.spouseWorkInCanada >= 1 && calculatorParameters.spouseWorkInCanada < 2:
				return 5;

			case calculatorParameters.spouseWorkInCanada >= 2 && calculatorParameters.spouseWorkInCanada < 3:
				return 7;

			case calculatorParameters.spouseWorkInCanada >= 3 && calculatorParameters.spouseWorkInCanada < 4:
				return 8;

			case calculatorParameters.spouseWorkInCanada >= 4 && calculatorParameters.spouseWorkInCanada < 5:
				return 9;

			case calculatorParameters.spouseWorkInCanada >= 5:
				return 10;
		}
	}

	return 0;
}

/**
 * Validates the properties to make sure the calculation is possible.
 * 
 * @param {object} calculatorParameters calculatorParameters for the calculation 
 * 
 * @returns {Boolean}
 *
 * @author Bruno Miranda 
 */
function validate() {
	var result = [];

	if (calculatorParameters.married === null)
		result.push('married');
	else
		if (typeof (calculatorParameters.married) !== 'boolean')
			result.push('married');
		else
		{
			if (calculatorParameters.spouseCanadianCitizen === null)
				result.push('spouseCanadianCitizen');
			else
				if (typeof (calculatorParameters.spouseCanadianCitizen) !== 'boolean')
					result.push('spouseCanadianCitizen');
				else
				{
					if (!calculatorParameters.spouseCanadianCitizen)
					{
						if (calculatorParameters.spouseCommingAlong === null)
							result.push('spouceCommingAlong');
						else
							if (typeof (calculatorParameters.spouseCommingAlong) !== 'boolean')
								result.push('spouceCommingAlong');
					}
				}
		}

	if (calculatorParameters.age === null || calculatorParameters.age === undefined)
		result.push('age');
	else
		if (typeof (calculatorParameters.age) !== 'number')
			result.push('age');

	if (calculatorParameters.firstLanguage.test === null)
		result.push('firstLanguage.test');
	else
		if (typeof (calculatorParameters.firstLanguage.test) !== 'number')
			result.push('firstLanguage.test');

	if (calculatorParameters.firstLanguage.speaking === null)
		result.push('firstLanguage.speaking');
	else
		if (typeof (calculatorParameters.firstLanguage.speaking) !== 'number')
			result.push('firstLanguage.speaking');

	if (calculatorParameters.firstLanguage.listening === null)
		result.push('firstLanguage.listening');
	else
		if (typeof (calculatorParameters.firstLanguage.listening) !== 'number')
			result.push('firstLanguage.listening');

	if (calculatorParameters.firstLanguage.reading === null)
		result.push('firstLanguage.reading');
	else
		if (typeof (calculatorParameters.firstLanguage.reading) !== 'number')
			result.push('firstLanguage.reading');

	if (calculatorParameters.firstLanguage.writting === null)
		result.push('firstLanguage.writting');
	else
		if (typeof (calculatorParameters.firstLanguage.writting) !== 'number')
			result.push('firstLanguage.writting');

	if (calculatorParameters.secondLanguage.test !== null || calculatorParameters.secondLanguage.speaking !== null || calculatorParameters.secondLanguage.listening !== null || calculatorParameters.secondLanguage.reading !== null || calculatorParameters.secondLanguage.speaking !== null)
	{
		if (calculatorParameters.secondLanguage.test === null)
			result.push('secondLanguage.test');
		else
			if (typeof (calculatorParameters.secondLanguage.test) !== 'number')
				result.push('secondLanguage.test');

		if (calculatorParameters.secondLanguage.speaking === null)
			result.push('secondLanguage.speaking');
		else
			if (typeof (calculatorParameters.secondLanguage.speaking) !== 'number')
				result.push('secondLanguage.speaking');

		if (calculatorParameters.secondLanguage.listening === null)
			result.push('secondLanguage.listening');
		else
			if (typeof (calculatorParameters.secondLanguage.listening) !== 'number')
				result.push('secondLanguage.listening');

		if (calculatorParameters.secondLanguage.reading === null)
			result.push('secondLanguage.reading');
		else
			if (typeof (calculatorParameters.secondLanguage.reading) !== 'number')
				result.push('secondLanguage.reading');

		if (calculatorParameters.secondLanguage.writting === null)
			result.push('secondLanguage.writting');
		else
			if (typeof (calculatorParameters.secondLanguage.writting) !== 'number')
				result.push('secondLanguage.writting');
	}

	return (result.length === 0 ? true : result);
}

/**
 * Calculates the Express Entry Score.
 * 
 * @returns Returns an object that contains all the scores for each section of the Comprehensive Ranking System.
 * 
 * If there's any missing information that makes it impossible to calculate the score, an array with the missing properties is returned.
 * 
 * @author Bruno Miranda
 */
function calculate(parameters) {
	if (parameters.married !== undefined) calculatorParameters.married = parameters.married;
	if (parameters.spouseCanadianCitizen !== undefined) calculatorParameters.spouseCanadianCitizen = parameters.spouseCanadianCitizen;
	if (parameters.spouseCommingAlong !== undefined) calculatorParameters.spouseCommingAlong = parameters.spouseCommingAlong;
	if (parameters.age !== undefined) calculatorParameters.age = parameters.age;
	if (parameters.educationLevel !== undefined) calculatorParameters.educationLevel = parameters.educationLevel;
	if (parameters.educationInCanada !== undefined) calculatorParameters.educationInCanada = parameters.educationInCanada;
	if (parameters.firstLanguage !== undefined) calculatorParameters.firstLanguage = parameters.firstLanguage;
	if (parameters.secondLanguage !== undefined) calculatorParameters.secondLanguage = parameters.secondLanguage;
	if (parameters.workInCanada !== undefined) calculatorParameters.workInCanada = parameters.workInCanada;
	if (parameters.workExperience !== undefined) calculatorParameters.workExperience = parameters.workExperience;
	if (parameters.certificateFromProvince !== undefined) calculatorParameters.certificateFromProvince = parameters.certificateFromProvince;
	if (parameters.nocJobOffer !== undefined) calculatorParameters.nocJobOffer = parameters.nocJobOffer;
	if (parameters.nomination !== undefined) calculatorParameters.nomination = parameters.nomination;
	if (parameters.spouseEducationLevel !== undefined) calculatorParameters.spouseEducationLevel = parameters.spouseEducationLevel;
	if (parameters.spouseWorkInCanada !== undefined) calculatorParameters.spouseWorkInCanada = parameters.spouseWorkInCanada;
	if (parameters.spouseLanguage !== undefined) calculatorParameters.spouseLanguage = parameters.spouseLanguage;

	var valid = validate();

	if (valid === true)
	{
		scores.coreHumanCapitalFactors = calculateCoreHumanCapitalFactors();
		scores.spouseFactors = calculateSpouseFactors();
		scores.skillTransferabilityFactors = calculateSkillTransferabilityFactors();
		scores.additionalPoints = calculateAdditionalPoins();

		scores.total = scores.coreHumanCapitalFactors.subTotal +
			scores.spouseFactors.subTotal +
			scores.skillTransferabilityFactors.subTotal +
			scores.additionalPoints.subTotal;

		return scores;
	}
	else
	{
		return valid;
	}
}