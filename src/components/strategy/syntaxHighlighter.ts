// Syntax highlighting utilities for the code editor
export function highlightCode(code: string, language: string = 'csharp'): string {
  if (language === 'python') {
    return highlightPythonCode(code)
  } else if (language === 'csharp') {
    return highlightCSharpCode(code)
  }
  return escapeHtml(code)
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function highlightCSharpCode(code: string): string {
  if (!code) return ''

  const keywords = [
    'public', 'private', 'protected', 'class', 'interface', 'namespace',
    'using', 'void', 'int', 'double', 'string', 'bool', 'var', 'new',
    'if', 'else', 'for', 'foreach', 'while', 'do', 'switch', 'case',
    'break', 'continue', 'return', 'try', 'catch', 'finally', 'throw',
    'override', 'virtual', 'abstract', 'static', 'readonly', 'const',
    'this', 'base', 'true', 'false', 'null', 'typeof', 'sizeof', 'is', 'as'
  ]
  
  const tradingKeywords = [
    'Strategy', 'OnBarUpdate', 'OnStart', 'EnterLong', 'EnterShort', 'ExitLong', 'ExitShort',
    'SetStopLoss', 'SetProfitTarget', 'Position', 'MarketPosition', 'Flat', 'Long', 'Short',
    'Bars', 'Close', 'Open', 'High', 'Low', 'Volume', 'Time', 'Print', 'CalculationMode',
    'Percent', 'Price', 'RSI', 'SMA', 'EMA', 'MACD', 'BollingerBands', 'ATR', 'Stochastic',
    'OnPositionUpdate', 'OnOrderUpdate', 'Order', 'OrderState', 'Filled', 'OrderAction'
  ]

  let highlighted = escapeHtml(code)

  // Highlight comments
  highlighted = highlighted.replace(
    /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
    '<span style="color: #6A9955;">$1</span>'
  )

  // Highlight strings
  highlighted = highlighted.replace(
    /"([^"\\]|\\.)*"/g,
    '<span style="color: #CE9178;">$&</span>'
  )

  // Highlight numbers
  highlighted = highlighted.replace(
    /\b\d+\.?\d*[fFdDmM]?\b/g,
    '<span style="color: #B5CEA8;">$&</span>'
  )

  // Highlight C# keywords
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g')
    highlighted = highlighted.replace(regex, `<span style="color: #569CD6;">$&</span>`)
  })

  // Highlight trading-specific keywords
  tradingKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g')
    highlighted = highlighted.replace(regex, `<span style="color: #4EC9B0;">$&</span>`)
  })

  // Highlight method calls
  highlighted = highlighted.replace(
    /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
    '<span style="color: #DCDCAA;">$1</span>('
  )

  return highlighted
}

export const highlightPythonCode = (code: string): string => {
  if (!code) return ''

  // Define color classes for different token types
  const colors = {
    keyword: 'text-blue-400',
    string: 'text-green-400', 
    comment: 'text-gray-500',
    number: 'text-orange-400',
    function: 'text-yellow-400',
    class: 'text-purple-400',
    operator: 'text-pink-400',
    builtin: 'text-cyan-400'
  }

  // Python keywords
  const keywords = [
    'def', 'class', 'if', 'else', 'elif', 'for', 'while', 'try', 'except', 'finally',
    'import', 'from', 'as', 'return', 'yield', 'break', 'continue', 'pass', 'and', 'or',
    'not', 'in', 'is', 'True', 'False', 'None', 'self', 'lambda', 'with', 'global',
    'nonlocal', 'assert', 'del', 'raise', 'async', 'await'
  ]

  // Python built-in functions
  const builtins = [
    'print', 'len', 'range', 'enumerate', 'zip', 'map', 'filter', 'sorted', 'max', 'min',
    'sum', 'abs', 'round', 'str', 'int', 'float', 'bool', 'list', 'dict', 'tuple', 'set',
    'type', 'isinstance', 'hasattr', 'getattr', 'setattr', 'open', 'super'
  ]

  // Common trading/data analysis functions
  const tradingFunctions = [
    'talib', 'RSI', 'MACD', 'BBANDS', 'SMA', 'EMA', 'ATR', 'STOCH', 'ADX', 'CCI',
    'calculate_indicators', 'generate_signals', 'backtest', 'calculate_position_size',
    'calculate_stop_loss', 'calculate_take_profit', 'pd', 'np', 'DataFrame', 'iloc',
    'rolling', 'mean', 'std', 'cumsum', 'dropna', 'fillna'
  ]

  let highlighted = code

  // Escape HTML
  highlighted = highlighted
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Highlight comments
  highlighted = highlighted.replace(
    /(#.*$)/gm, 
    `<span class="${colors.comment}">$1</span>`
  )

  // Highlight strings (both single and double quotes, including multiline)
  highlighted = highlighted.replace(
    /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
    `<span class="${colors.string}">$1</span>`
  )

  // Highlight numbers
  highlighted = highlighted.replace(
    /\b(\d+\.?\d*)\b/g,
    `<span class="${colors.number}">$1</span>`
  )

  // Highlight keywords
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g')
    highlighted = highlighted.replace(regex, `<span class="${colors.keyword}">$1</span>`)
  })

  // Highlight built-in functions
  builtins.forEach(builtin => {
    const regex = new RegExp(`\\b(${builtin})\\b`, 'g')
    highlighted = highlighted.replace(regex, `<span class="${colors.builtin}">$1</span>`)
  })

  // Highlight trading functions
  tradingFunctions.forEach(func => {
    const regex = new RegExp(`\\b(${func})\\b`, 'g')
    highlighted = highlighted.replace(regex, `<span class="${colors.function}">$1</span>`)
  })

  // Highlight class names (capitalized words followed by parentheses or colon)
  highlighted = highlighted.replace(
    /\bclass\s+([A-Z][a-zA-Z0-9_]*)/g,
    `<span class="${colors.keyword}">class</span> <span class="${colors.class}">$1</span>`
  )

  // Highlight function definitions
  highlighted = highlighted.replace(
    /\bdef\s+([a-zA-Z_][a-zA-Z0-9_]*)/g,
    `<span class="${colors.keyword}">def</span> <span class="${colors.function}">$1</span>`
  )

  // Highlight operators
  const operators = ['=', '+', '-', '*', '/', '//', '%', '**', '==', '!=', '<', '>', '<=', '>=', '&', '|', '^', '~', '<<', '>>', '+=', '-=', '*=', '/=']
  operators.forEach(op => {
    const escapedOp = op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escapedOp})`, 'g')
    highlighted = highlighted.replace(regex, `<span class="${colors.operator}">$1</span>`)
  })

  return highlighted
}

export const getLineNumbers = (code: string): number[] => {
  return code.split('\n').map((_, index) => index + 1)
}

export const formatCode = (code: string): string => {
  const lines = code.split('\n')
  let formatted = ''
  let indentLevel = 0
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    
    // Decrease indent for closing braces, elif, else, except, finally
    if (trimmed.match(/^(else|elif|except|finally):/)) {
      indentLevel = Math.max(0, indentLevel - 1)
    }
    
    // Add current line with proper indentation
    if (trimmed) {
      formatted += '    '.repeat(indentLevel) + trimmed + '\n'
    } else {
      formatted += '\n'
    }
    
    // Increase indent after colon (function, class, if, for, while, etc.)
    if (trimmed.endsWith(':') && !trimmed.startsWith('#')) {
      indentLevel++
    }
  }
  
  return formatted.trim()
}