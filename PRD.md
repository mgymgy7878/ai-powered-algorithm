# AI-Powered Algorithmic Trading Platform

A comprehensive AI-driven trading platform that generates, tests, optimizes, and manages trading strategies with full automation capabilities, functioning like a professional trading analyst.

**Experience Qualities**:
1. **Professional** - Clean, data-focused interface that instills confidence in financial decision-making
2. **Intelligent** - AI-powered insights and recommendations feel natural and trustworthy
3. **Powerful** - Advanced capabilities are accessible without overwhelming complexity

**Complexity Level**: Complex Application (advanced functionality, accounts)
- This platform requires sophisticated state management, real-time data processing, AI integration, strategy execution, and comprehensive portfolio management features that define a complex trading application.

## Essential Features

### Strategy Generator
- **Functionality**: AI-powered strategy code generation using natural language prompts
- **Purpose**: Enable traders to quickly create custom strategies without deep programming knowledge
- **Trigger**: User inputs trading idea or market conditions in natural language
- **Progression**: Input description → AI generates strategy code → Preview code → Test parameters → Save to drafts
- **Success criteria**: Generated strategies compile successfully and produce logical trading signals

### Backtesting Engine
- **Functionality**: Historical performance testing with comprehensive metrics
- **Purpose**: Validate strategy effectiveness before risking real capital
- **Trigger**: User selects strategy and historical date range
- **Progression**: Select strategy → Choose timeframe → Configure parameters → Run backtest → Analyze results → Save or optimize
- **Success criteria**: Accurate historical simulation with detailed performance metrics and risk analysis

### Strategy Optimizer
- **Functionality**: AI-driven parameter optimization using genetic algorithms
- **Purpose**: Find optimal parameter combinations for maximum risk-adjusted returns
- **Trigger**: User initiates optimization on existing strategy
- **Progression**: Select strategy → Define parameter ranges → Set optimization goals → AI runs optimization → Review results → Apply best parameters
- **Success criteria**: Improved strategy performance metrics compared to baseline

### Live Strategy Manager
- **Functionality**: Real-time strategy execution and monitoring dashboard
- **Purpose**: Manage active strategies with automatic start/stop based on market conditions
- **Trigger**: User activates strategies for live trading
- **Progression**: Select strategies → Configure risk limits → AI monitors conditions → Auto-start/stop strategies → Real-time updates
- **Success criteria**: Strategies execute trades accurately with proper risk management

### AI Market Analyst
- **Functionality**: Intelligent market condition analysis and strategy recommendations
- **Purpose**: Provide professional-grade market insights and strategy suggestions
- **Trigger**: Continuous market monitoring with user-triggered deep analysis
- **Progression**: Market data ingestion → AI analysis → Condition classification → Strategy recommendations → Alert generation
- **Success criteria**: Accurate market condition identification with relevant strategy suggestions

### Portfolio Dashboard
- **Functionality**: Comprehensive performance tracking and risk management
- **Purpose**: Monitor overall portfolio health and individual strategy performance
- **Trigger**: User accesses main dashboard
- **Progression**: Load portfolio data → Display performance metrics → Show active strategies → Risk analysis → Generate reports
- **Success criteria**: Real-time accurate portfolio valuation with clear performance attribution

## Edge Case Handling
- **Network Failures**: Graceful degradation with offline mode and data synchronization
- **Invalid Strategy Code**: Code validation with helpful error messages and auto-correction suggestions
- **Market Volatility**: Automatic risk management with circuit breakers and position sizing
- **Data Feed Issues**: Multiple data source fallbacks with quality validation
- **Optimization Overload**: Progress tracking with cancellation options for long-running optimizations

## Design Direction
The design should evoke confidence, professionalism, and technological sophistication - similar to Bloomberg Terminal or TradingView but with modern, clean aesthetics that make complex financial data accessible and actionable.

## Color Selection
Triadic (three equally spaced colors) - Professional financial blue, accent green for profits, and warning amber for risks, creating a trustworthy yet dynamic interface that clearly communicates financial states.

- **Primary Color**: Financial Blue (oklch(0.45 0.15 240)) - Communicates trust, stability, and professionalism
- **Secondary Colors**: Deep Navy (oklch(0.25 0.08 240)) for depth and Slate Gray (oklch(0.65 0.02 240)) for neutral elements
- **Accent Color**: Success Green (oklch(0.55 0.15 140)) for profits and positive metrics, Warning Amber (oklch(0.65 0.15 60)) for risks and alerts
- **Foreground/Background Pairings**: 
  - Background (White oklch(1 0 0)): Dark Blue text (oklch(0.25 0.08 240)) - Ratio 12.6:1 ✓
  - Card (Light Gray oklch(0.98 0.01 240)): Dark Blue text (oklch(0.25 0.08 240)) - Ratio 11.8:1 ✓
  - Primary (Financial Blue oklch(0.45 0.15 240)): White text (oklch(1 0 0)) - Ratio 5.2:1 ✓
  - Success (Green oklch(0.55 0.15 140)): White text (oklch(1 0 0)) - Ratio 4.8:1 ✓
  - Warning (Amber oklch(0.65 0.15 60)): Dark Blue text (oklch(0.25 0.08 240)) - Ratio 6.1:1 ✓

## Font Selection
Professional, highly legible typefaces that convey technical precision while remaining approachable - Inter for interface elements and JetBrains Mono for code display.

- **Typographic Hierarchy**: 
  - H1 (App Title): Inter Bold/32px/tight letter spacing
  - H2 (Section Headers): Inter SemiBold/24px/normal spacing
  - H3 (Card Titles): Inter Medium/18px/normal spacing
  - Body (Main Content): Inter Regular/16px/relaxed line height
  - Code (Strategy Code): JetBrains Mono Regular/14px/monospace spacing
  - Data (Numbers/Metrics): Inter SemiBold/16px/tabular numbers

## Animations
Subtle, purposeful animations that enhance usability without distraction - focus on smooth transitions, data visualization updates, and progress indicators that convey system activity and build user confidence.

- **Purposeful Meaning**: Smooth chart updates convey real-time data flow, subtle hover states provide feedback, loading animations show AI processing
- **Hierarchy of Movement**: Critical alerts get attention-grabbing animations, data updates use smooth transitions, navigation uses gentle slides

## Component Selection
- **Components**: 
  - Tabs for strategy management sections
  - Cards for strategy display and metrics
  - Charts (custom with recharts) for performance visualization
  - Tables for trade history and optimization results
  - Dialogs for strategy creation and editing
  - Command palette for quick strategy search and actions
  - Toast notifications for trade executions and alerts
- **Customizations**: 
  - Custom TradingChart component with candlestick and indicator overlays
  - StrategyCard component with live status indicators
  - MetricsDisplay component with animated number counters
  - CodeEditor component with syntax highlighting
- **States**: 
  - Buttons show loading states during backtests and optimizations
  - Strategy cards indicate active/inactive/error states with color coding
  - Form inputs provide real-time validation for trading parameters
- **Icon Selection**: 
  - TrendingUp/TrendingDown for performance metrics
  - Play/Pause/Stop for strategy controls
  - Cpu for AI processing indicators
  - BarChart for analytics sections
  - Code for strategy development
- **Spacing**: Consistent 4px/8px/16px/24px spacing scale with generous padding for data-heavy sections
- **Mobile**: 
  - Collapsible sidebar navigation
  - Stacked card layouts for strategies
  - Simplified charts with touch-friendly controls
  - Bottom sheet for quick actions
  - Responsive tables with horizontal scroll for detailed data