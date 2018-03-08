const {log, biglog, errorlog, colorize} = require("./out");

const model = require('./model');

/**
	* Muestra la ayuda.
	*/
exports.helpCmd = rl => {
		log("Comandos:");
    log(" h|help - Muestra esta ayuda.");
    log(" list - Listar los quiz interactivamente.");
    log(" show <id> - Muestra la pregunta y la respuesta a el quiz indicado.");
    log(" add - Añadir un nuevo quiz interactivamente.");
    log(" delete <id> - Borrar el quiz indicado.");
    log(" edit <id> - Editar el quiz indicado.");
    log(" test <id> - Probar el quiz indicado.");
    log(" p|play - Jugar a preguntar aleatoriamente todos los quizzes.")
    log(" credits - Créditos.");
    log(" q|quit - Salir del programa.");
    	rl.prompt();
    };
exports.quitCmd = rl => {
	 rl.close();
};
/**
	* Añade nuevo quiz al modelo.
	*Pregunta interactivamente por la pregunta y por la respuesta.
	*
	*Hay que recordar que el funcionamiento de la función rl.question es asíncrono.
	*El prompt hay que sacarlo cuando ya se ha terminado la inteacción con el usuario,
	*es decir, la llamada a rl.prompt() se debe hacr en el callback de la segunda
	*llamada a rl.question
	*
	* @param rl Objeto readLine usado para implementar el CLI.
	*/
exports.addCmd = rl => {
	
	rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

		rl.question(colorize(' Introduzca la respuesta ', 'red'), answer => {

			model.add(question, answer);
			log(` ${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
			rl.prompt();
		});
	});
};
/**
	* Lista todos los quizzes existentes en el modelo
	*/
exports.listCmd = rl => {
		model.getAll().forEach((quiz, id) => {

		log(` [${colorize(id, 'magenta')}]: ${quiz.question}`);
	});

	rl.prompt();
};
/**
	* Muestra el quizz indicando el parámetro: la pregunta y la respuesta

	* @param id Clave del quiz a mostrar.
	*/
exports.showCmd = (rl, id) => {
	
	if (typeof id == "undefined"){
		errorlog(`Falta el parámetro id.`);
	} else {
		try {
			const quiz = model.getByIndex(id);
			log(`[${colorize(id, 'magenta')}]:  ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
		} catch(error) {
			errorlog(error.message);
		}
	}

	rl.prompt();
};
exports.testCmd = (rl, id) => {
   	   	if (typeof id == "undefined"){
		errorlog(`Falta el parámetro id.`);
		rl.prompt();
	} else {
		try {
			const quiz = model.getByIndex(id);
			log(`[${colorize(id, 'magenta')}]:  ${quiz.question} ${colorize('=>', 'magenta')}`);
			rl.question(colorize(' Introduzca la respuesta: ', 'red'), respuesta => {
				if (respuesta.toLowerCase().trim() === quiz.answer.toLowerCase().trim()){
					log(`correcta`);
					biglog('CORRECTA', 'green');
					rl.prompt();
				}
				else{
					log(`incorrecta`);
					biglog('INCORRECTA', 'red');
					rl.prompt();
				}

   		});
   		} catch(error) {
			errorlog(error.message);
			rl.prompt();
		}
}
};
exports.playCmd = rl => {
   	
   	let score = 0;
   	let toBeResolved = [];
   	for(let j = 0; j<model.count(); j++){
   		toBeResolved[j] = j;
   	}
   	const playaux = () =>{

   		if (toBeResolved.length == 0){
   			log(`Nada que pregungar`);
   			log(`Fin del juego. Aciertos ${score}`);
   			biglog(score, 'green');
   			rl.prompt();
   		}else{
   			let id = Math.floor((Math.random()*toBeResolved.length));
   			if(id >= 0){
   				try{
   				let quiz = model.getByIndex(toBeResolved[id]);
   				toBeResolved.splice(id,1);
   				rl.question(colorize(quiz.question.toString() + ' ', 'green'), respuesta =>{

   					if(quiz.answer.toLowerCase().trim() === respuesta.toLowerCase().trim()){
   						log(`correcta`);
   						score = score +1;
   						log(`Lleva ${score} aciertos`);
   						playaux();
   					}	else{
   						log(`incorrecta`);
   						biglog("INCORRECTA",'red');
   						log(`La respuesta correcta era ${quiz.answer}`)
   						log(`Fin del juego. Aciertos ${score}`);
   						biglog(score, 'green');
   						rl.prompt();
   					}
   			});
   		} catch(error) {
			errorlog(error.message);
			rl.prompt();
		}
	}
}
};
playaux();
};
/**
	* Borra un quiz del modelo
	* @param id Clave del quiz a borrar en el modelo.
	*/
exports.deleteCmd = (rl, id) => {
    	
	if (typeof id == "undefined"){
		errorlog(`Falta el parámetro id.`);
	} else {
		try {
			model.deleteByIndex(id);
		} catch(error) {
			errorlog(error.message);
		}
	}
    rl.prompt();
};
/**
	* Edita un quiz del modelo
	* @param id Clave del quiz a editar
	 en el modelo.
	*/
exports.editCmd = (rl, id) => {
   			if (typeof id === "undefined"){
		errorlog(`Falta el parámetro id.`);
		rl.prompt();
	} else {
		try {
const quiz = model.getByIndex(id);

			process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)}, 0);

			rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

				process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)}, 0);
				
				rl.question(colorize(' Introduzca la respuesta', 'red'), answer => {
					model.update(id, question, answer);
					log(` Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);	
					rl.prompt();
				});
			});

		} catch(error) {
			errorlog(error.message);
			rl.prompt();
		}
	}
};
exports.creditsCmd = rl => {
    	log('Autor de la práctica:');
    	log('JAVIER Cruz Salaverri');
    	log('Nombre 2');
    	rl.prompt();

};