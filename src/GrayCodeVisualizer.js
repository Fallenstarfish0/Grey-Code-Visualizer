import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Info } from 'lucide-react';

const GrayCodeVisualizer = () => {
  const [bits, setBits] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [activeTab, setActiveTab] = useState('visualization');

  /* Generate Gray code sequence */
  const generateGrayCode = React.useCallback((n) => {
    const result = [];
    const total = Math.pow(2, n);
    for (let i = 0; i < total; i++) {
      const gray = i ^ (i >> 1);
      result.push(gray.toString(2).padStart(n, '0'));
    }
    return result;
  }, []);

  const graySequence = React.useMemo(() => generateGrayCode(bits), [bits, generateGrayCode]);

  /* Auto-play functionality */
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % graySequence.length);
      }, speed);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, currentIndex, speed, graySequence.length]);

  /* Highlight changed bit */
  const getChangedBit = (prev, curr) => {
    if (!prev) return -1;
    for (let i = 0; i < prev.length; i++) {
      if (prev[i] !== curr[i]) return i;
    }
    return -1;
  };

  const prevCode = currentIndex > 0 ? graySequence[currentIndex - 1] : null;
  const currentCode = graySequence[currentIndex];
  const changedBit = getChangedBit(prevCode, currentCode);

  /* Binary to decimal conversion */
  const binaryToDecimal = (binary) => parseInt(binary, 2);

  const handleReset = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">
          Binary Reflected Gray Code Visualizer
        </h1>
        <p className="text-purple-200 text-center mb-8">
          Watch how consecutive codes differ by exactly one bit
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['visualization', 'algorithm', 'applications'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-t-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-white text-purple-900'
                  : 'bg-purple-800 text-white hover:bg-purple-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-2xl p-8">
          {activeTab === 'visualization' && (
            <>
              {/* Controls */}
              <div className="mb-8 space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-gray-700 font-semibold">Bits:</label>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    value={bits}
                    onChange={(e) => {
                      setBits(parseInt(e.target.value));
                      setCurrentIndex(0);
                      setIsPlaying(false);
                    }}
                    className="flex-1"
                  />
                  <span className="text-2xl font-bold text-purple-900 w-12">{bits}</span>
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-gray-700 font-semibold">Speed:</label>
                  <input
                    type="range"
                    min="200"
                    max="2000"
                    step="200"
                    value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 w-24">{speed}ms</span>
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <RotateCcw size={20} />
                    Reset
                  </button>
                </div>
              </div>

              {/* Current State Display */}
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6 mb-8">
                <div className="text-center mb-4">
                  <p className="text-gray-600 mb-2">Step {currentIndex + 1} of {graySequence.length}</p>
                  <div className="flex justify-center gap-2 mb-4">
                    {currentCode.split('').map((bit, idx) => (
                      <div
                        key={idx}
                        className={`w-16 h-16 flex items-center justify-center text-3xl font-bold rounded-lg transition-all duration-500 ${
                          idx === changedBit
                            ? 'bg-yellow-400 text-gray-900 scale-110 shadow-lg'
                            : bit === '1'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {bit}
                      </div>
                    ))}
                  </div>
                  <p className="text-xl text-gray-700">
                    Decimal: <span className="font-bold text-purple-900">{binaryToDecimal(currentCode)}</span>
                  </p>
                  {changedBit >= 0 && (
                    <p className="text-sm text-yellow-700 mt-2 font-semibold">
                      ⚡ Bit {changedBit} changed from previous step
                    </p>
                  )}
                </div>
              </div>

              {/* Full Sequence */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Complete Sequence:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {graySequence.map((code, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setIsPlaying(false);
                      }}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        idx === currentIndex
                          ? 'bg-purple-600 text-white scale-105 shadow-lg'
                          : idx < currentIndex
                          ? 'bg-green-100 text-gray-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <div className="font-mono text-lg font-bold">{code}</div>
                      <div className="text-sm opacity-75">Dec: {binaryToDecimal(code)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'algorithm' && (
            <div className="prose max-w-none">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Algorithm</h3>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h4 className="font-semibold mb-3">Method 1: Binary to Gray Conversion</h4>
                <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto">
{`def binary_to_gray(n):
    return n ^ (n >> 1)

# Generate n-bit Gray code
def generate_gray_code(bits):
    for i in range(2**bits):
        gray = binary_to_gray(i)
        yield format(gray, f'0{bits}b')`}
                </pre>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3">Method 2: Recursive Reflection</h4>
                <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto">
{`def gray_code_recursive(n):
    if n == 1:
        return ['0', '1']
    
    prev = gray_code_recursive(n - 1)
    # Reflect and prefix
    result = ['0' + code for code in prev]
    result += ['1' + code for code in reversed(prev)]
    return result`}
                </pre>
              </div>

              <div className="mt-6 bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Info size={20} className="text-blue-600" />
                  Key Property
                </h4>
                <p className="text-gray-700">
                  The XOR operation (n ^ (n >> 1)) converts binary to Gray code by XORing each bit
                  with the bit to its left. This ensures adjacent values differ by only one bit.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="prose max-w-none">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Real-World Applications</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                  <h4 className="font-bold text-lg mb-3 text-blue-900">🔄 Rotary Encoders</h4>
                  <p className="text-gray-700">
                    Mechanical position sensors use Gray code to prevent misreading during transitions.
                    Since only one bit changes at a time, momentary misalignment causes at most one bit error.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                  <h4 className="font-bold text-lg mb-3 text-green-900">📊 Karnaugh Maps</h4>
                  <p className="text-gray-700">
                    K-maps use Gray code ordering to group adjacent cells, making it easier to identify
                    and minimize Boolean expressions in digital logic design.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                  <h4 className="font-bold text-lg mb-3 text-purple-900">🎮 Tower of Hanoi</h4>
                  <p className="text-gray-700">
                    The solution sequence for Tower of Hanoi follows Gray code. Each move corresponds
                    to flipping one bit, making it optimal for solving the puzzle.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
                  <h4 className="font-bold text-lg mb-3 text-orange-900">🔢 Error Correction</h4>
                  <p className="text-gray-700">
                    Analog-to-digital converters use Gray code to minimize errors. If a reading occurs
                    during a transition, the error is limited to one quantization level.
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
                <h4 className="font-semibold mb-2">💡 Why It Matters</h4>
                <p className="text-gray-700">
                  Gray code's single-bit-change property makes it invaluable in systems where:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                  <li>Minimizing transition errors is critical</li>
                  <li>Hardware simplicity is desired</li>
                  <li>Sequential state changes must be reliable</li>
                  <li>Combinatorial generation needs efficiency</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-purple-200 text-sm">
          <p>Created with React • Visualization of Binary Reflected Gray Code algorithm</p>
          <p className="mt-1">GenAI assisted (Claude 3.5 Sonnet) - Code generated for educational visualization</p>
        </div>
      </div>
    </div>
  );
};

export default GrayCodeVisualizer;