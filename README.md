# Puzzle Tools

This repo is an auxiliary tool for my [PuzzleSolver](https://github.com/SmilingWayne/PuzzleSolver) project. It provides interactive [webpage](https://smilingwayne.github.io/PuzzleTools/) to quickly select cells and display the corresponding index, thus reducing manual input. The tool can be easily incorporated when creating interesting puzzles like [Polyminoes](https://puzzler.sourceforge.net/docs/polyominoes-intro.html) and [Polyiamonds](https://puzzler.sourceforge.net/docs/polyiamonds.html).

![](https://cdn.jsdelivr.net/gh/SmilingWayne/picsrepo/202505312117805.png)

It also supports result display when you give it a pattern in "Input Result" textarea:

![](https://cdn.jsdelivr.net/gh/SmilingWayne/picsrepo/202505312118180.png)

## Usage

Install nvm: 

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

Install Node.js 16


```shell
nvm install 16
nvm use 16
```

Launch server:

```shell
npm install .
npm run dev
```