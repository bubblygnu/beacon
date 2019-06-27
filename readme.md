## Dependencies

- node >10.13
- chrome >69
- lighthouse: `npm install -g lighthouse`

## Setup

1. `git clone https://github.com/bubblygnu/beacon.git`
2. cd into project
3. `npm link`

## Usage

`beacon <url> [--mobile|--desktop] [--runs <times>]`

default: mobile, 10 runs

examples:

- `beacon http://example.com`
- `beacon http://example.com --desktop`
- `beacon http://example.com --runs 5`
