class Keyboard {
	constructor() {
		this.keys = {
			0: { ru: "ё", en: "`" },
			1: { ru: "1", en: "1", ctrl: "!" },
			2: { ru: "2", en: "2", ctrl: "\"" },
			3: { ru: "3", en: "3", ctrl: "№" },
			4: { ru: "4", en: "4", ctrl: ";" },
			5: { ru: "5", en: "5", ctrl: "%" },
			6: { ru: "6", en: "6", ctrl: ":" },
			7: { ru: "7", en: "7", ctrl: "?" },
			8: { ru: "8", en: "8", ctrl: "*" },
			9: { ru: "9", en: "9", ctrl: "(" },
			10: { ru: "0", en: "0", ctrl: ")" },
			11: { ru: "-" , en: "-", ctrl: "_" },
			12: { ru: "=" , en: "=", ctrl: "+" },
			13: ["Backspace", "key__func", "key__backspace"],

			14: ["Tab", "key__func", "key__tab"],
			15: { ru: "й", en: "q" },
			16: { ru: "ц", en: "w" },
			17: { ru: "у", en: "e" },
			18: { ru: "к", en: "r" },
			19: { ru: "е", en: "t" },
			20: { ru: "н", en: "y" },
			21: { ru: "г", en: "u" },
			22: { ru: "ш", en: "i" },
			23: { ru: "щ", en: "o" },
			24: { ru: "з", en: "p" },
			25: { ru: "х", en: "{" },
			26: { ru: "ъ", en: "}" },
			27: ["Del", "key__func", "key__del"],

			28: ["CapsLock", "key__func", "key__caps"],
			29: { ru: "ф", en: "a" },
			30: { ru: "ы", en: "s" },
			31: { ru: "в", en: "d" },
			32: { ru: "а", en: "f" },
			33: { ru: "п", en: "g" },
			34: { ru: "р", en: "h" },
			35: { ru: "о", en: "j" },
			36: { ru: "л", en: "k" },
			37: { ru: "д", en: "l" },
			38: { ru: "ж", en: ";" },
			39: { ru: "э", en: "\"" },
			40: ["Enter", "key__func", "key__enter"],

			41: ["Shift", "key__func", "key__l-shift"], //Left shift
			42: { ru: "\\", en: "\\" },
			43: { ru: "я", en: "z" },
			44: { ru: "ч", en: "x" },
			45: { ru: "с", en: "c" },
			46: { ru: "м", en: "v" },
			47: { ru: "и", en: "b" },
			48: { ru: "т", en: "n" },
			49: { ru: "ь", en: "m" },
			50: { ru: "б", en: "<" },
			51: { ru: "ю", en: ">" },
			52: { ru: ".", en: "\/" },
			53: ["↑", "key__func", "key__arrow"], //Up arrow key
			54: ["Shift", "key__func", "key__r-shift"], //Right shift

			55: ["Ctrl" , "key__func", "key__ctrl"],
			56: ["Win", "key__func", "key__win-alt"],
			57: ["Alt", "key__func", "key__win-alt"],
			58: ["Space", "key__func", "key__space"],
			59: ["Alt", "key__func", "key__win-alt"],
			60: ["Ctrl", "key__func", "key__ctrl"],
			61: ["←", "key__func", "key__arrow"], //Left arrow
			62: ["↓", "key__func", "key__arrow"], //Down arrow
			63: ["→", "key__func", "key__arrow"], //right arrow
		}

		this.length = this.__keysLength();
		
		this.keyboardElement = null;
		this.textarea = null;
		this.keyboardKeys = null;
		this.textField = null;
		this.language = "ru";
		this.caps = false;
		this.buffer = ""; //Для сохранения текста
		this.pressed = new Set(); //Для хранения зажатых клавиш (прим. Alt + Shift)

		//Позволяет удалять обработчик события, 
		//чтобы не приводило к дублированию выводимых символов после смены языка
		this.keydownHandler = event => this.__keydownFunction(event);
		this.keyupHandler = event => this.__keyupFunction(event);
		this.clickHandler = event => this.__clickFunction(event);
	}

	/*
		__addListeners и __removeListeners для упрощения добавления и удаления обработчиков.
		Чтобы не лезть постоянно в функцию __keyupFunction и __getElements
	*/
	__addListeners() {
		document.addEventListener("keydown", this.keydownHandler); 
	 	document.addEventListener("keyup", this.keyupHandler); 
	 	document.addEventListener("click", this.clickHandler);
	}

	__removeListeners() {
		document.removeEventListener("keydown", this.keydownHandler);
		document.removeEventListener("keyup", this.keyupHandler);
		document.removeEventListener("click", this.clickHandler);
	}

	init(lang = window.sessionStorage.getItem("lang") || "ru") {
		const form = document.createElement("form");
		const textarea = document.createElement("textarea");
		const div = document.createElement("div");
		const p = document.createElement('p');

		p.innerText = "Для смены раскладки нажмите Shift + Alt";
		textarea.classList.add("output__textarea");
		div.classList.add("keyboard");

		for(let key in this.keys) {
			if(Array.isArray(this.keys[key])) {
				const button = document.createElement("input");
				button.type = "button";

				//class="key key__func key__[backspace | tab | alt | ctrl | sheft | space ]"
				button.classList.add("key", this.keys[key][1], this.keys[key][2]);
			
				switch(this.keys[key][0]) {
					case "Ctrl" :
						button.dataset.key = "ControlLeft";
						break;
					case "Win" :
						button.dataset.key = "MetaLeft";
						break;
					case "Del" :
						button.dataset.key = "Delete";
						break;
					case "↑" :
						button.dataset.key = "ArrowUp";
						break;
					case "←" :
						button.dataset.key = "ArrowLeft";
						break;
					case "↓" :
						button.dataset.key = "ArrowDown";
						break;
					case "→" :
						button.dataset.key = "ArrowRight";
						break;
					default : 
						button.dataset.key = this.keys[key][0];
						break;
				}

				button.value = this.keys[key][0];
				div.appendChild(button);
			}

			else {
				const button = document.createElement("input");
				button.type = "button";
				button.classList.add("key", "key__letter");

				button.value = this.keys[key][lang];
				div.appendChild(button);
			}
		}

		form.appendChild(textarea);
		form.appendChild(div);

		/*
			insertAdjacentElement позволяет вставить элемент до тега script (в данном случае внутрь body первым элементом).
			После этого доступны все созданные элементы на странице.
		*/
		document.body.insertAdjacentElement('afterBegin', form);
		form.insertAdjacentElement('beforeEnd', p);

		this.__initTextField();
		this.__getElements();
	}

	__initTextField() {
		const textField = document.createElement("div");
		textField.classList.add("textField");

		document.querySelector("form").insertAdjacentElement('afterend', textField);
	}

	__getElements() {
		this.keyboardElement = document.getElementsByClassName("keyboard")[0];
		this.textarea = document.getElementsByClassName("output__textarea")[0];
		this.keyboardKeys = document.querySelectorAll("input[type=button]");
		this.textField = document.getElementsByClassName("textField")[0];

		//Сохранение текста при переключении раскладки
		if(this.buffer) {
			this.textarea.value = this.buffer;
		}

		//Сохранение капса нажаты при смене раскладки
		if(this.caps) {
			this.keyboardKeys[28].classList.add("capsLock");
		}

		this.__addListeners();
	}

	__keydownFunction(event) {
		this.pressed.add(event.key);

		if(event.key === "Control") {
			for(let i = 1; i < 13; i++) {
				this.keyboardKeys[i].value = this.keys[i]["ctrl"];
			}
		}

		if(event.key === "Shift") {
			for(let i = 0; i < this.keyboardKeys.length; i++) {
				if(!this.keyboardKeys[i].classList.contains("key__func")) {
					this.keyboardKeys[i].value = this.keys[i][this.language].toUpperCase();
				}
			}

			for(let i = 1; i < 13; i++) {
				this.keyboardKeys[i].value = this.keys[i]["ctrl"];
			}
		}
		
		// Вкл / выкл CapsLock'а
		event.key === "CapsLock" ? this.__capsLock() : false;

		if(event.key === "Enter") {
			this.textField.innerText += "\u0020" + this.textarea.value  ;
			this.textarea.value.length = 0;
			this.textarea.value = "";
		}

		if(event.key === "Delete") {
			this.textarea.value = "";
		}
		
		if(this.__functionalKeyPressCheck(event.key)) {
			this.textarea.value += event.key;
		}

		for(let i = 0; i < this.keyboardKeys.length; i++) {
			if(event.key === this.keyboardKeys[i].value || 
				event.code === this.keyboardKeys[i].value || 
				event.code === this.keyboardKeys[i].dataset.key) {

				if(!this.keyboardKeys[i].classList.contains("active")) {
					this.keyboardKeys[i].classList.add("active");
					break;
				}
			}
		}
	}

	__keyupFunction(event) {
		this.textarea.autofocus = false;

		if(event.key === "Control") {
			for(let i = 0; i < 13; i++) {
				this.keyboardKeys[i].value = this.keys[i]["ru"];
			}
		}

		if(event.key === "Shift") {
			for(let i = 0; i < this.keyboardKeys.length; i++) {
				if(!this.keyboardKeys[i].classList.contains("key__func")) {
					this.keyboardKeys[i].value = this.keys[i][this.language].toLowerCase();
				}
			}

			for(let i = 1; i < 13; i++) {
				this.keyboardKeys[i].value = this.keys[i]["ru"];
			}
		}

		for(let i = 0; i < this.keyboardKeys.length; i++) {
			if(this.keyboardKeys[i].classList.contains("active")) {
				this.keyboardKeys[i].classList.remove("active");
			}
		}

		if(this.pressed.has("Alt") && this.pressed.has("Shift") && this.pressed.size == 2) {
			const form = document.querySelector("form");

			//Удаление все дочек
			while (document.body.firstChild) {
				document.body.removeChild(document.body.firstChild);
			}

			this.language == 'ru' ? this.language = 'en' : this.language = 'ru';
			this.buffer = this.textarea.value; //Сохранение набранного текста

			this.__removeListeners();

			window.sessionStorage.setItem("lang", this.language);

			//Пересоздаем клавиатуру с новым языком (en-ru)
			this.init(this.language);
		}

		this.pressed.clear();
	}

	__clickFunction(event) {
		if(event.target.value == "Backspace") {
			//Эмуляция работы клавиши backspace при клике на него мышкой.
			this.textarea.value = this.textarea.value.slice(0, this.textarea.value.toString().length - 1);
		}

		if(event.target.value === "Enter") {
			this.textField.innerText += "\u0020" + this.textarea.value  ;
			this.textarea.value.length = 0;
			this.textarea.value = "";
		}

		if(event.target.value === "Del") {
			this.textarea.value = "";
		}

		if(event.target.type !== "textarea" && event.target.type === "button" && 
			this.__functionalKeyClickCheck(event.target.value)) {

			this.textarea.value += event.target.value;
		}

		// Вкл / выкл CapsLock'а
		event.target.value === "CapsLock" ? this.__capsLock() : false;
	}

	__capsLock() {
		if(!this.caps) {
			this.keyboardKeys[28].classList.add("capsLock");

			for(let i = 0; i < this.keyboardKeys.length; i++) {
				if(!this.keyboardKeys[i].classList.contains("key__func")) {
					this.keyboardKeys[i].value = this.keys[i][this.language].toUpperCase();
				}
			}

		}

		else {
			this.keyboardKeys[28].classList.remove("capsLock");

			for(let i = 0; i < this.keyboardKeys.length; i++) {
				if(!this.keyboardKeys[i].classList.contains("key__func")) {
					this.keyboardKeys[i].value = this.keys[i][this.language].toLowerCase();
				}
			}
		}
	
		this.caps = !this.caps;
	}

	__keysLength() {
		let counter = 0;

		for(let key in this.keys) {
			counter++;
		}

		return counter;
	}

	__functionalKeyPressCheck(key) {
		return  key !== "Backspace" && key !== "Alt" && key !== "Delete" && key !== "Control" &&
				key !== "Shift" && key !== "CapsLock" &&  key !== "Enter" && key !== "Tab" &&
				key !== "Meta" && key !== "AltGraph" && key !== "ContextMenu" && key !== "ArrowUp" &&
				key !== "ArrowLeft" && key !== "ArrowDown" && key !== "ArrowRight"
	}

	__functionalKeyClickCheck(key) {
		return  key && key !== "Backspace" && key !== "Alt" && key !== "Del" && 
				key !== "Control" && key !== "Shift" && key !== "CapsLock" && 
				key !== "Enter" && key !== "Tab" && key !== "Ctrl" && key !== "Meta" && 
				key !== "Space" && key !== "Win" && key !== "AltGraph" && key !== "ContextMenu" 
				&& key !== "←" && key !== "↑" && key !== "↓" && key !== "→"
	}
}

module.exports = Keyboard;