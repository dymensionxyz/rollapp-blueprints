# rollapp-blueprints

## Overview

**rollapp-blueprints** is a collection of blueprints designed to help you bootstrap RollApps which require Oracles. This repository provides three example RollApps to demonstrate various functionalities and use cases.

## Table of Contents

- [Overview](#overview)
- [Examples](#examples)
  - [AI Agent](#ai-agent)
  - [Binary Option](#binary-option)
  - [Random Number Generator](#random-number-generator)
- [Oracle Contracts](#oracle-contracts)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Examples

### AI Agent

Desmos is an AI Agent built on EVM and launched as a RollApp. Users can double their money by trying to jailbreak Desmos to choose a specific number within a range by providing a jailbreak prompt. All revenue made by Desmos is being distributed by it's stakers.

- **[Read the README](./desmos-ai-agent/README.md)** for installation and usage instructions.

### Binary Option

A binary options application utilizing a price oracle to facilitate trading based on asset price movements.

- **[Read the README](./binary-options/README.md)** for installation and usage instructions.

### Random Number Generator

A deterministic random number generator suitable for various applications requiring unpredictability.

- **[Read the README](./random-number-generator/README.md)** for installation and usage instructions.

## Oracle Contracts

The `oracle-contracts` directory contains the core smart contracts used across all RollApp examples for oracle functionality:

- Base oracle implementations
- Interface definitions
- Common utilities and helper contracts
- Shared oracle types and structures

These contracts serve as the foundation for oracle integration in the example RollApps. Each RollApp implements and extends these base contracts according to its specific requirements.

- **[Read the README](./oracle-contracts/README.md)** for detailed documentation on the oracle contracts.

## Installation

Installation instructions for each RollApp are provided within their respective README files. Please navigate to the specific RollApp directory and follow the guidelines outlined there.

## Usage

Detailed usage instructions for each RollApp are available in their individual README files. Ensure you have completed the installation steps before attempting to use any of the RollApps.

## Contributing

Contributions are welcome! If you'd like to contribute to **rollapp-blueprints**, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with clear and descriptive messages.
4. Submit a pull request detailing your changes and the rationale behind them.

Please ensure your contributions adhere to the project's coding standards and include appropriate documentation.

## License

This project is licensed under the [MIT License](./LICENSE).
