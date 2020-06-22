# Yarnberry Seed

The starter for all Yarnberry recipes!

This README is the orginal draft of my article, [Getting started with Yarn 2 and TypeScript](https://medium.com/swlh/getting-started-with-yarn-2-and-typescript-43321a3acdee).

## What is a _**Yarnberry**_?

Berry is the name of the 2.0 release of Yarn, which completely changes how Yarn functions as a whole, with limited support and templates for Yarn 2, I created the Yarnberry Cookbook to home every recipe I came up with.

## Basics

Getting started with Yarn 2 isn't as straightforward as Yarn Classic or npm. It's a headache for newcomers. You can read the [getting started](https://yarnpkg.com/getting-started) and [features](https://yarnpkg.com/features/) to get a good idea of how things work.

### Installation

One of the best things about Yarn Modern is that it started using available resources instead of forcing you to adapt new ones. Such as, not requiring `.msi` installations and Chocolately. They expect the bare minimum, you having installed [Node.js](https://nodejs.org/en/) 10+ which ships with npm! I personally prefer Node 12 LTS.

```bash
PS C:\...> npm -g install yarn
PS C:\...> mkdir <your-project>
PS C:\...> cd <your-project>
PS C:\...> yarn init
... # Package information
PS C:\...\your-project> yarn set version berry
Resolving berry to a url...
Downloading https://github.com/yarnpkg/berry/raw/master/packages/berry-cli/bin/berry.js...
Saving it into C:\Users\adria\Desktop\Grim\projects\yarnberry-seed\.yarn\releases\yarn-berry.js...
Updating C:\Users\adria\Desktop\Grim\projects\yarnberry-seed/.yarnrc.yml...
Done!
```

And just like that, you're ready to get started. It couldn't be simpler!

### Dependency Management

Here's where things get tricky, but once you're used to it, it's all game.

So once you install your first dependency you'll notice one of the things that makes Yarn Modern awesome, no more heavy `node_modules` directory! Now dependencies live across 3 points,

- `yarn.lock`: your YAML-based lockfile (never touch, always commit)
- `.pnp.js`: your Plug'n'Play resolver
- `.yarn/cache`: all of your dependencies nicely zipped up

All 3 of these points remain synced every time you install a dependency. A caveat? When using TypeScript, you'll notice a severe lack of `Go To Definition` functionality, or lack there of. At first I saw this as a _huge_ no for me, but then I realized I didn't need that functionality much, we'll revisit this topic.

So back to those zipped dependencies, there's an error you'll run across occassionally when first starting out relative to checksum mismatches, specifically, [YN0018](https://yarnpkg.com/advanced/error-codes#yn0018---cache_checksum_mismatch), of which I now remember by heart because it burdened me for days. The fix? Easy. The cause? Depends, for me it was because in gitattributes I auto commit all files with an `eol=lf`, or End of Line = Unix-style.

```conf
# .gitattributes
* text=auto
* text eol=lf
*.zip binary
# GitHub Linguist Override
.yarn/* linguist-vendored
.pnp.js linguist-vendored
```

That's all it takes to fix _**YN0018**_. What about that _"Github Linguist Override"_? Well it's optional, but it helps GitHub determine the true language stats for your repository. If you're unfamiliar, [GitHub Linguist](https://github.com/github/linguist) is the library that reports the stats for those pretty colors on the bar under your [\d commits, \d branches, etc...]. I don't know the name for that navbar.

In short, if you don't add those last two lines, the entire repository shows as 99% JavaScript, which isn't true because that 99% isn't _your_ code.

## Ignorables

This one is pretty straightforward, ignore everything except a few folders. Never include `install-state.gz`, `.yarn/unplugged/`, or `buildstate.json`. These are not only platform specific artifacts, but including `.yarn/unplugged/` gets heavy depending on your dependencies, `puppeteer` ships with Chromium which then means you have to add `*.exe` and `*.dll` as Git LFS files, which _**even then**_ you only have 1 GB of free LFS storage. Just... not worth it.

```conf
# Yarn 2
.yarn/*
!.yarn/cache/
!.yarn/releases/
!.yarn/plugins/
!.yarn/versions/
!.yarn/sdks/
```

### TypeScript

So, back on the topic of TypeScript support, this is where two things come into play... in Plug'n'Play... anyway you're going to want to import the typescript plugin, and make sure your integrations are updated. TypeScript, VS Code, etc.

```bash
PS C:\...> yarn add typescript --dev
➤ YN0000: ┌ Resolution step
➤ YN0000: └ Completed in 0.25s
➤ YN0000: ┌ Fetch step
➤ YN0013: │ ...
➤ YN0013: │ ... "can't be found and will be fetched etc..."
➤ YN0013: │ ...
➤ YN0000: └ Completed in 0.22s
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: Done in 0.54s
PS C:\...> yarn plugin import typescript
➤ YN0000: Downloading https://.../plugin-typescript.js
➤ YN0000: Saving the new plugin in .yarn/plugins/@yarnpkg/plugin-typescript.cjs
➤ YN0000: Done in 0.67s
# Did I mention Yarn Modern is fast?
```

This just installs typescript, of course, but also adds the TypeScript plugin! Which, is the best thing to happen in the history of TypeScript, as it literally fetches your type definitions for you 😍!!! No more `add` then `add --dev @types/... blah blah repetitive` nonsense!

So you've got that going, but then you load up VS Code and make your first module and BAM **"Cannot find module 'fs' or its corresponding type declarations. ts(2307)"**. What a _fucking_ pain! Right? Not really! Because here's the issue, we've zipped those dependencies, stored them in a folder TypeScript knows nothing about, and expected it to... just work. Well lucky you it actually does _just work_ with a simple fix!

```bash
PS C:\...> yarn add @yarnpkg/pnpify --dev
➤ YN0000: ┌ Resolution step
➤ YN0000: └ Completed in 1.45s
➤ YN0000: ┌ Fetch step
➤ YN0013: │ ...
➤ YN0013: │ ... "can't be found and will be fetched etc..."
➤ YN0013: │ ...
➤ YN0000: └ Completed in 1.44s
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: Done in 3.26s
PS C:\...> yarn pnpify --sdk vscode
➤ YN0000: ┌ Generating SDKs inside .yarn/sdks
➤ YN0000: │ ✓ Typescript
➤ YN0000: │ • 5 SDKs were skipped based on your root dependencies
➤ YN0000: └ Completed
➤ YN0000: ┌ Generating settings
➤ YN0000: │ ✓ Vscode (new ✨)
➤ YN0000: └ Completed
```

You install `@yarnpkg/pnpify` and then `pnpify` to get going! It's that simple. Of course you can also run `yarn pnpify --sdk vim`. Either way this'll setup your workspace! So what about those _"5 SDKs were skipped"_? Well you can also install `ESLint` and `Prettier` and run `yarn pnpify --sdk base` to install support for those too!

Here's another caveat, `.yarn/sdks` is actually new... that sounds good but I've had to support 3 separate solutions. Another downside about bleeding-edge unsupported tech is how much it changes. `.yarn/sdks` was previously `.yarn/pnpify` and before that it was `.vscode/pnpify` and just `yarn pnpify --sdk` instead of adding base. These changes were all in 2 weeks. So you'll wanto to either keep up-to-date about those changes, or come back to ol' Grim and keep using my up-to-date templates 😁... Shameless plug?

Also, remember to actually use the workspace version of TypeScript, `3.9.5-pnpify` for example. Otherwise you'll bang your head wondering why `@types/node` didn't resolve even though you've installed it 5 times. I've been there.

And finally, a pain-in-the-ass caveat is that you may need to Reload the TS Server sometimes when it bugs out. And other times, Yarn will say it can't remove a module, just close and reopen VS Code I did a LOT of digging and a Node.js process hangs onto a file under Yarn 2 sometimes but it's hidden under VS Code. Just a weird quirk but it happens when VS Code is under heavy load.

OH! Sorry almost forgot, `yarn node <file>.js` will solve those pesky node issues. Yarn 2 runs with it's own Node instance. If you want to resolve that, use a bundler like Webpack. Same goes for binaries too, `yarn add --dev webpack-cli` then `yarn webpack-cli` you get the idea.

## Tooling

I'll be making a few more base seeds for tooling, linting, webpack, etc. Webpack, React, ESLint, and Prettier are already in a recipe together called [Reaxpress](https://github.com/yarnberry-cookbook/reaxpress). Other than that, I think that sums everything up!

I've done the research so you can get to playing, have fun!
