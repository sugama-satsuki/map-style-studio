// window.matchMediaのモック
if (!window.matchMedia) {
  window.matchMedia = function () {
    return {
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  };
}

// window.URL.createObjectURLのモック
if (!window.URL.createObjectURL) {
  window.URL.createObjectURL = vi.fn();
}

// performance.mark/performance.measureのモック
if (!window.performance.mark) {
  window.performance.mark = (markName: string, markOptions?: PerformanceMarkOptions): PerformanceMark => {
    return {
      name: markName,
      entryType: 'mark',
      startTime: performance.now(),
      duration: 0,
      detail: markOptions?.detail ?? null,
      toJSON: function () {
        throw new Error("Function not implemented.");
      }
    };
  };
}
if (!window.performance.measure) {
  window.performance.measure = (measureName: string, _startOrMeasureOptions?: string | PerformanceMeasureOptions, _endMark?: string): PerformanceMeasure => {
    return {
      name: measureName,
      entryType: 'measure',
      startTime: performance.now(),
      duration: 0,
      detail: null,
      toJSON: function () {
        return {};
      }
    };
  };
}
