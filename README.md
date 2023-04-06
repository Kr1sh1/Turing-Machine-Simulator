# Turing Machine Simulator

This is a graphical simulator for Turing machines and their variations built using React. It is a completely client-side application and makes no requests to any servers.

The project visualises how the state of a Turing machine changes across computations by the use of a computation tree, tape and transition table.

The different variations supported are:
* One-way infinite tape
* Two-way infinite tape
* Accepting & Rejecting terminal states
* Halting terminal state
* Non-deterministic Turing machines

## Getting Started

### Prerequisites

[Node.js](https://nodejs.org) and [npm](https://www.npmjs.com/) are required to install and run this software. Check if you have them installed using the following commands. This software has also only been tested with these versions. It is likely to work on future versions and some older ones but there is no guarantee.

```
$ node -v
v18.15.0

$ npm -v
9.5.0
```

### Installation

The project uses a number of external dependencies, all of which can be installed onto your local machine by running:

```
npm install
```

## Running

To spin up a development server run:

```
npm run dev
```

To build the project for production run:

```
npm run build
```

## Testing

All tests are executable by running:

```
npm run test
```
