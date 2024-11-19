import Handlebars from 'handlebars';

const handlebars = Handlebars.create();

handlebars.registerHelper('base64', function (input) {
	return btoa(input);
});

handlebars.registerHelper('concat', function (...args) {
    return args.filter(arg => typeof arg !== 'object').join('');
});

export function template(widget: WidgetData, input: string): string {
	const template = handlebars.compile(input, {
		noEscape: true
	});

	return template(widget, {
		helpers: { base64: handlebars.helpers.base64, concat: handlebars.helpers.concat }
	});
}

export function templateRecords(object: Record<string, string>, widget: WidgetData) {
	Object.entries(object).forEach(([key, value]) => {
		object[key] = template(widget, value);
	});
}