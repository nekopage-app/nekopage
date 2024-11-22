import Handlebars from 'handlebars';

const handlebars = Handlebars.create();

handlebars.registerHelper('base64', function (input) {
	return btoa(input);
});

handlebars.registerHelper('concat', function (...args) {
    return args.filter(arg => typeof arg !== 'object').join('');
});

export function template(input: string, widget: WidgetData, responses?: WidgetApiResponsesByName): string {
	const template = handlebars.compile(input, {
		noEscape: true
	});

	const context = {
		...widget,
		responses
	};

	return template(context, {
		helpers: { base64: handlebars.helpers.base64, concat: handlebars.helpers.concat }
	});
}

export function templateRecords(object: Record<string, string>, widget: WidgetData, responses?: WidgetApiResponsesByName) {
	Object.entries(object).forEach(([key, value]) => {
		object[key] = template(value, widget, responses);
	});
}