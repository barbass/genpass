/**
 * Название: Генератор пароля
 * Разработал: Владислав (vlad1010@inbox.ru)
 * Дата: 2013-05-22
 */

function GenPass(options) {
	this.init(options);
};

GenPass.prototype = {
	/**
	 * Инициализация
	 * @param array
	 */
	init: function(options) {
		this.options = (options) ? options : {};

		if(!this.options['length']) {
			this.options['length'] = 10;
		}

		this.options['register_addit_char'] = this.options['register_addit_char'] | 0;

		if(!this.options['field_password']) {
			this.options['field_password'] = '#new_pass';
		}
		if(!this.options['field_length']) {
			this.options['field_length'] = '#pass_length';
		}
		if(!this.options['field_addit_char']) {
			this.options['field_addit_char'] = '#addit_char';
		}
	},
	//счетчик вызова функции для избежания зацикливания
	recursion: 0,

	/**
	 * Генерация пароля
	 * @return string
	 */
	generationPassword: function() {
		var pass_length = parseInt(this.options['length']) | 0;

		var password = '';

		var symbols = [
			'a','b','c','d','e','f',
			'g','h','i','j','k','l',
			'm','n','o','p','r','s',
			't','u','v','x','y','z',
			'A','B','C','D','E','F',
			'G','H','I','J','K','L',
			'M','N','O','P','R','S',
			'T','U','V','X','Y','Z',
			'1','2','3','4','5','6',
			'7','8','9','0'];

		var additional_chars = [
			'.',',','(',')','[',']','!','?',
			'&','^','%','@','*','$',
			'<','>','/','|','+','-',
			'{','}','`','~','#','&','_','='];

		if (this.options['register_addit_char']) {
			var symbols = symbols.concat(additional_chars);
		}

		var sym = 0;
		for(var i=0; i<pass_length; i++) {
			sym = Math.floor(Math.random() * symbols.length);
			password += symbols[sym];
		}

		//Проверка на валидность
		try {
			if (!this.validatePassword(password)) {
				this.recursion += 1;
				if (isNaN(parseInt(this.recursion)) || parseInt(this.recursion) > 100) {
					throw new Error('Recursion: More 100');
					return false;
				}
				return this.generationPassword();
			}
		} catch(e) {
			console.error(e);
			return false;
		}
		this.recursion = 0;
		return password;
	},

	/**
	 * Проверка на валидность
	 * Примечание: проверка на наличие спец. символов специально не проходит
	 * @param string
	 * @return bool
	 */
	validatePassword: function(password) {
		if (typeof(password) != 'string') {
			throw new Error('validatePassword: No password');
			return false;
		}

		if (password.length < 5 || password.length > 100) {
			throw new Error('validatePassword: Not correct length password');
			return false;
		}

		//Проверяем на наличие только чисел или строки без чисел
		var intReg = /^\d*$/i;
		var txtReg = /^\D*$/i;
		if (intReg.test(password) || txtReg.test(password)) {
			return false;
		}

		//Проверяем на то, как часто повторяется один символ
		var pass_length = password.length;
		for(var i=0; i<password.length; i++) {
			if(!isNaN(parseInt(password[i]))) {
				pass_length -= 1;
				continue;
			}
			//Если в пароле один и тот же символ
			var count_char = 0;
			for(var j=0; j<password.length; j++) {
				if (password[i] == password[j]) {
					count_char += 1;
				}
			}
			if (count_char == pass_length) {
				return false;
			}
			//Если символ повторяется 3 раза подряд
			if(password[i+1] && password[i+2]) {
				if (password[i] === password[i+1] && password[i] === password[i+2]) {
					return false;
				}
			}
		}

		//Проверяем символы на один регистр
		var register_lower_case = 0;
		var register_upper_case = 0;
		for(var i=0; i<password.length; i++) {
			if(!isNaN(parseInt(password[i]))) {continue;}

			if(password[i].toLowerCase() == password[i]) {
				register_lower_case += 1;
			} else {
				register_upper_case += 1;
			}
		}
		if (register_lower_case == 0) {
			return false;
		}
		if (register_upper_case == 0) {
			return false;
		}

		//Проверяем на количество цифр и букв
		var count_int = 0;
		var count_str = 0;
		for(var i=0; i<password.length; i++) {
			if (parseInt(password[i])) {count_int += 1;}
			else {count_str += 1;}
		}
		if (count_int < 2) {
			return false;
		}
		if (count_str < 2) {
			return false;
		}

		return true;
	},

	/**
	 * Работа с формой
	 */
	formPassword: function() {
		var pass_length = ( (document.querySelector(this.options['field_length'])) ? parseInt(document.querySelector(this.options['field_length']).value) : 0 ) | 0;
		if (pass_length < 5 || pass_length > 100) {
			throw new Error('formPassword: Not the correct length of the password');
			return false;
		} else {
			this.options['length'] = pass_length;
		}

		this.options['registr_addit_char'] = (document.querySelector(this.options['field_addit_char'])) ? document.querySelector(this.options['field_addit_char']).checked : 0;

		//Меняем длину input-а в зависимости от длины пароля
		document.querySelector(this.options['field_password']).setAttribute('size', (pass_length + Math.round(pass_length/3)) );

		var password = this.generationPassword();

		document.querySelector(this.options['field_password']).value = (password) ? password : '';
	}

};
