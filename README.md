https://typesetter.onrender.com/


# Hyphenation

This library supports optional hyphenation. `hypher`seems to work well but any object with a `hyphenate` method that returns an array of syllables will work. example:

`npm i hypher hyphenation.en-us`

```js
import Hypher from 'hypher'
import english from 'hyphenation.en-us'

const hyphenator = new Hypher(english)

SvgTypeset(
	"some text that you want hyphenated when formatting",
	textEl,
	gEl,
	'center,
	[60],
	20000,
	true,
	'|',
	0,
	hyphenator
);

```

# TODO

- [ ] docs
- [ ] test coverage
- [ ] better typing
- [ ] remove `ramda`
- [ ] remove `hypher` and `en-us`. make them optional with instructions in readme.
- [x] publish to npm
- [ ] improve api

# create-svelte

Everything you need to build a Svelte library, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

Read more about creating a library [in the docs](https://kit.svelte.dev/docs/packaging).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview app.

## Building

To build your library:

```bash
npm run package
```

To create a production version of your showcase app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Publishing

Go into the `package.json` and give your package the desired name through the `"name"` option. Also consider adding a `"license"` field and point it to a `LICENSE` file which you can create from a template (one popular option is the [MIT license](https://opensource.org/license/mit/)).

To publish your library to [npm](https://www.npmjs.com):

```bash
npm publish
```
