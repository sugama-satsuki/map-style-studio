// ResizeObserverのモック (react-window等で使用)
if (!window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
  };
}

// window.matchMediaのモック
if (!window.matchMedia) {
  window.matchMedia = function () {
    return {
      matches: false,
      media: '',
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  };
}

// window.URL.createObjectURLのモック
if (!window.URL.createObjectURL) {
  window.URL.createObjectURL = jest.fn();
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  window.performance.measure = (measureName: string, _startOrMeasureOptions?: string | PerformanceMeasureOptions, endMark?: string): PerformanceMeasure => {
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
