import Handlebars from 'handlebars';

const handlebars = Handlebars.create();

handlebars.registerHelper('base64', function (input) {
	return btoa(input);
});

handlebars.registerHelper('concat', function (...args) {
    return args.filter(arg => typeof arg !== 'object').join('');
});

export default function (widget: WidgetData, input: string): string {
	const template = handlebars.compile(input, {
		noEscape: true
	});

	return template(widget, {
		helpers: { base64: handlebars.helpers.base64, concat: handlebars.helpers.concat }
	});
}
