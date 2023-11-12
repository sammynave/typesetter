const SVG_NS = 'http://www.w3.org/2000/svg';
const TSPAN_X = 0;
const TSPAN_Y = 0;

export const createTspan = (textContent: string, x: number = TSPAN_X, y: number = TSPAN_Y) => {
	const tspan = document.createElementNS(SVG_NS, 'tspan');

	tspan.setAttribute('x', `${x}`);
	tspan.setAttribute('y', `${y}em`);
	tspan.textContent = textContent;

	return tspan;
};

/*
 * to measure text in SVG we need to append an element
 * with font-size, font-family, styles, ...etc
 * so we clone the existing <text> create a tspan
 * with the new text, measure it then remove it.
 */
export const measure = (el: SVGTextElement, containerEl: SVGGElement, text: string) => {
	const tempText = el.cloneNode(true) as SVGTextElement;

	while (tempText.lastChild) {
		tempText.removeChild(tempText.lastChild);
	}

	tempText.appendChild(createTspan(text));
	containerEl.appendChild(tempText);

	const { width, height } = tempText.getBBox();
	containerEl.removeChild(tempText); // element.remove() doesn't work in IE11

	return { width, height };
};
