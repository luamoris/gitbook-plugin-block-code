// require(['gitbook'], (gitbook) => {
// 	const TERMINAL_HOOK = '**[terminal]';
// 	let MY_CONFIG = {};
// 	let TIMEOUTS = {};

// 	const CLASS_PREFIX = 'pbc';
// 	const CLASSES = {
// 		wrapper: "code-wrapper",
// 		line: "code-line",
// 		console: "console",
// 		copy: "copy-text",
// 		id: "id"
// 	};

// 	for(const field in CLASSES) {
// 		CLASSES[field] = `${CLASS_PREFIX}_${CLASSES[field]}`;
// 	}

// 	// Button
// 	const updateCopyButton = (but) => {
// 		const timeout = but.getAttribute('data-command');
// 		but.classList.remove('fa-clone');
// 		but.classList.add('fa-check');
// 		timeout in TIMEOUTS && clearTimeout(TIMEOUTS[timeout]);
// 		TIMEOUTS[timeout] = window.setTimeout(() => {
// 			but.classList.remove('fa-check');
// 			but.classList.add('fa-clone');
// 		}, 1000);
// 	};

// 	const onCopyCode = (even) => {
// 		const wrapper = even.srcElement.parentNode;
// 		const textarea = document.querySelector(`#${CLASSES.copy}`);
// 		textarea.value = wrapper.innerText;
// 		textarea.focus();
// 		textarea.select();
// 		document.execCommand('copy');
// 		wrapper.focus();
// 		updateCopyButton(even.srcElement);
// 	};

// 	const createCopyButton = () => {
// 		const button = document.createElement('i');
// 		button.className = 'fa fa-clone t-copy';
// 		button.onclick = onCopyCode;
// 		return button;
// 	};

// 	const addCopyButton = (wrapper) => {
// 		const copyButton = createCopyButton();
// 		wrapper.appendChild(copyButton);
// 	};

// 	// Textarea
// 	const addCopyTextarea = () => {
// 		const text = document.createElement('textarea');
// 		text.id = CLASSES.copy;
// 		document.querySelector('body').appendChild(text);
// 	};

// 	// Apply New Format Code Block
// 	const CONSOLE_LIST = ['shell', 'sh', 'zsh', 'bash', 'console'];
// 	const getNewClass = (isConsole) => CLASSES.line + (!isConsole ? ` ${CLASSES.console}` : '');
// 	const getNewLine = (line, className) => `<span class="${className}">${line}</span>`;
// 	const getNewLinesFormat = (lines, console) => lines.map((line) => getNewLine(line, getNewClass(console))).join('\n');

// 	const commentUpdate = (comment) => {
// 		const className = comment.className;
// 		const linesText = comment.innerHTML.split('\n');
// 		const linesSpan = linesText.map((text) => getNewLine(text, className)).join('\n');
// 		comment.outerHTML = linesSpan;
// 	};

// 	const applyFormat = (pre, id) => {
// 		const code = pre.querySelector('code');
// 		// comment
// 		const comments = [];
// 		code.querySelectorAll('span').forEach((span) => {
// 			span.className.includes('comment') && comments.push(span);
// 		});
// 		comments.forEach(item => {
// 			commentUpdate(item);
// 		});
// 		// comment end
// 		const lines = code.innerHTML.split('\n');
// 		lines.pop();
// 		const isConsole = CONSOLE_LIST.every(item => !code.classList.contains(`lang-${item}`));
// 		const newLines = getNewLinesFormat(lines, isConsole);

// 		const newPre = pre.cloneNode(false);
// 		const newCode = code.cloneNode(false);
// 		newCode.innerHTML = newLines;
// 		newPre.appendChild(newCode);
// 		pre.outerHTML = `<div class="${CLASSES.wrapper} ${CLASSES.id}-${id}">${newPre.outerHTML}</div>`;
// 		return document.querySelector(`.${CLASSES.wrapper}.${CLASSES.id}-${id}`);
// 	};

// 	// Start
// 	gitbook.events.bind('start', (e, config) => {
// 		MY_CONFIG = config['block-code'];
// 		MY_CONFIG.cloneButton && addCopyTextarea();
// 	})

// 	gitbook.events.bind('page.change', () => {
// 		const preCodeBlocks = document.querySelectorAll('pre');
// 		preCodeBlocks.forEach((pre, id) => {
// 			const wrapper = applyFormat(pre, id);
// 			if (MY_CONFIG.cloneButton) {
// 				addCopyButton(wrapper);
// 			}
// 		});
// 	})
// });

require(['gitbook'], (gitbook) => {

	// ============================= Required variables

	const BODY = document.querySelector('body');
	const ROOT_STYLE = document.documentElement.style;
	let MY_CONFIG = {};
	let TIMEOUTS = {};
	const PLUGIN = 'block-code';
	const CLASSES = {
		wrapper: "pbc-code-wrapper",
		line: "pbc-code-line",
		console: "pbc-console",
		numbers: "pbc-number",
		copy: "pbc-copy-text",
		id: "pbc-id",
		but: {
			main: 'fa t-copy',
			clone: 'fa-clone',
			check: 'fa-check',
		},
	};
	const CONSOLE_LIST = ['shell', 'sh', 'zsh', 'bash', 'console'];

	const isHexadecimalColors = new RegExp(/^#[a-zA-Z0-9]{6}$/);
	const isPx = new RegExp(/^[0-9]px$/);

	// ============================= Help Functions

	const linking = (...arg) => arg.join(' ');
	const getField = (obj, ...args) => args.reduce((el, level) => el && el[level], obj);

	// ============================= Configuring the copy content button

	const applyAnimation = (button) => {
		const sleep = button.getAttribute('data-command');
		button.classList.remove(CLASSES.but.clone);
		button.classList.add(CLASSES.but.check);
		sleep in TIMEOUTS && clearTimeout(TIMEOUTS[sleep]);
		TIMEOUTS[sleep] = window.setTimeout(() => {
			button.classList.remove(CLASSES.but.check);
			button.classList.add(CLASSES.but.clone);
		}, 1000);
	};

	const getCopyText = (even) => {
		const button = even.srcElement;
		const text = document.querySelector(`#${CLASSES.copy}`)
		text.value = button.parentNode.innerText;
		text.focus();
		text.select();
		document.execCommand('copy');
		button.parentNode.focus();
		applyAnimation(button);
	};

	const createTextareaBlock = () => {
		const textarea = document.createElement('textarea');
		textarea.id = CLASSES.copy;
		BODY.appendChild(textarea);
	};

	const createCloneButton = () => {
		const clone = document.createElement('i');
		clone.className = linking(CLASSES.but.main, CLASSES.but.clone);
		clone.onclick = getCopyText;
		return clone;
	};

	// ============================= Formatting input styles

	const getStyleProperties = (config) => {
		const style = [];
		if(config.cloneButtonStyle) {
			for(const item in config.cloneButtonStyle) {
				const property = { title: `--button-${item}`, value: config.cloneButtonStyle[item] };
				(property.value === 'transparent' || isHexadecimalColors.test(property.value)) && style.push(property);
			};
		}
		return style;
	};

	const applyButtonIcons = (config) => {
		const clone = getField(config, 'cloneButtonIcon', 'clone');
		const check = getField(config, 'cloneButtonIcon', 'check');
		clone && (CLASSES.but.clone = clone);
		check && (CLASSES.but.check = check);
	};

	// ============================= Add button to block

	const addButtonToBlock = (block, style) => {
		style.forEach((item) => { ROOT_STYLE.setProperty(item.title, `${item.value}`); })
		const button = createCloneButton();
		block.appendChild(button);
	};





	// ============================= Apply New Format Code Block
	const getNewClass = (isConsole, isNumber) => CLASSES.line
		+ (!isConsole ? ` ${CLASSES.console}` : '')
		+ (!isNumber ? '' : ` ${CLASSES.numbers}`);
	const getNewLine = (line, className) => `<span class="${className}">${line}</span>`;
	const getNewLinesFormat = (lines, isConsole, isNumber) => lines.map((line) => getNewLine(line, getNewClass(isConsole, isNumber))).join('\n');

	const createComment = (comment) => {
		const className = comment.className;
		const linesText = comment.innerHTML.split('\n');
		const linesSpan = linesText.map((text) => getNewLine(text, className)).join('\n');
		comment.outerHTML = linesSpan;
	};

	const commentUpdate = (spans) => {
		const comments = [];
		spans.forEach((span) => { span.className.includes('comment') && comments.push(span); });
		comments.forEach((cmt) => { createComment(cmt) });
	};

	const createLines = (code, isNumber) => {
		const lines = code.innerHTML.split('\n');
		lines.pop();
		const isConsole = CONSOLE_LIST.every(item => !code.classList.contains(`lang-${item}`));
		return getNewLinesFormat(lines, isConsole, isNumber);
	};

	const applyFormat = (pre, id, isNumber) => {
		const code = pre.querySelector('code');
		const spans = code.querySelectorAll('span');
		commentUpdate(spans);
		const newLines = createLines(code, isNumber);
		const newPre = pre.cloneNode(false);
		const newCode = code.cloneNode(false);
		newCode.innerHTML = newLines;
		newPre.appendChild(newCode);
		pre.outerHTML = `<div class="${CLASSES.wrapper} ${CLASSES.id}-${id}">${newPre.outerHTML}</div>`;
		return document.querySelector(`.${CLASSES.wrapper}.${CLASSES.id}-${id}`);
	};




	// Start
	gitbook.events.bind('start', (e, config) => {
		MY_CONFIG = config[PLUGIN];
		MY_CONFIG.cloneButton && createTextareaBlock();
	})

	gitbook.events.bind('page.change', () => {
		const preCodeBlocks = document.querySelectorAll('pre');
		const cloneStyle = getStyleProperties(MY_CONFIG);
		preCodeBlocks.forEach((pre, id) => {
			const isNumber = MY_CONFIG.lineNumber ? true : false;
			const wrapper = applyFormat(pre, id, isNumber);
			if (MY_CONFIG.cloneButton) {
				applyButtonIcons(MY_CONFIG);
				addButtonToBlock(wrapper, cloneStyle);
			}
		});
	})
});
