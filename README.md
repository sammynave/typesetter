https://typesetter.onrender.com/

# TODO

- [ ] docs
- [ ] test coverage
- [ ] better typing
- [ ] remove `ramda`
- [x] remove `hypher` and `en-us`. make them optional with instructions in readme.
- [x] publish to npm
- [x] improve api

# Hyphenation

This library supports optional hyphenation. `hypher` seems to work well but any object with a `hyphenate` method that returns an array of syllables will work. example:

`npm i hypher hyphenation.en-us`

```js
import Hypher from 'hypher';
import english from 'hyphenation.en-us';

const hyphenator = new Hypher(english);

SvgTypesetter({
	text: 'some text that you want hyphenated when formatting',
	targetNode: textEl,
	parentNode: gEl,
	alignment: 'center',
	lineLengths: [60],
	tolerance: 20000,
	hyphenator
});
```
