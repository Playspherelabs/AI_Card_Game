# Chainsmash


# 🌐 ChainSmash - Blockchain Battle Card Game

ChainSmash is a Web3-native card game where players battle using blockchain market capitalization values. Players collect cards representing major blockchains and compete in strategic battles where real-time market data determines card power levels.

## 🎮 Game Overview

Players engage in 1v1 battles using blockchain cards, with each card's power determined by real-time market capitalization data from oracles. Strategic gameplay involves portfolio management and market prediction.

### Key Features

- Real-time market cap data integration via Pyth Network
- Secure, private gameplay using Phala Network
- Cross-chain compatibility with Flow blockchain
- Fair random card distribution using Pyth Entropy
- Encrypted move submission with Sign/Inco

## 🎴 Game Mechanics

### Card System
- 14 unique blockchain cards
- Real-time market cap values
- Strategic card swapping
- Bull vs Bear market battle modes

### Stakes & Rewards
- Entry Fee: 0.01 ETH per player
- Prize Pool: 0.02 ETH per game
- Winner Share: 95% (0.019 ETH)
- Protocol Fee: 5% (0.001 ETH)

## 🔧 Technical Architecture

### Smart Contracts
```
├── ChainSmashFactory     # Game creation and matchmaking
├── ChainSmashLogic      # Core game mechanics
└── ChainSmashTreasury   # Prize pool management
```

### Oracle Integration
- Real-time market cap data feeds
- Secure random number generation
- Cross-chain data verification

### Privacy Layer
- Secure card distribution
- Private portfolio computation
- Anti-cheat mechanisms
- Encrypted move submission

## 🚀 Getting Started

### Prerequisites
```bash
node >= 16.0.0
yarn >= 1.22.0
```

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/chainsmash.git

# Install dependencies
cd chainsmash
yarn install

# Set up environment variables
cp .env.example .env
```

### Development
```bash
# Run development server
yarn dev

# Run tests
yarn test

# Build for production
yarn build
```

## 🎯 Game States

1. **MATCHING**
   - Player matchmaking
   - Entry fee collection

2. **CARD_DISTRIBUTION**
   - Initial card dealing
   - Market cap data fetching

3. **SWAP_PHASE**
   - Card discarding/drawing
   - Portfolio optimization

4. **BATTLE_PHASE**
   - Battle mode selection
   - Winner determination

5. **SETTLEMENT**
   - Prize distribution
   - Stats updates

## 🔮 Future Features

- Tournament Mode
- Chain-specific special powers
- Multi-chain deployment
- DeFi prize pool integration
- NFT rewards system

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Resources

- [Documentation](docs/)
- [API Reference](docs/api/)
- [Smart Contract Specs](docs/contracts/)

## 🤝 Acknowledgments

- Pyth Network for price feeds
- Phala Network for secure execution
- Flow blockchain for scalability
- Sign/Inco for move encryption
