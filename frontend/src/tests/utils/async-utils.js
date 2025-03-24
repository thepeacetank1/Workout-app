/**
 * Specialized utilities for handling async operations in React components
 */
import { act } from 'react-testing-library';

/**
 * Helper to wait for an element to appear in the DOM
 * @param {Function} callback - Function that returns the element to wait for
 * @param {Object} options - Options for waiting
 * @param {number} options.timeout - Milliseconds to wait before timing out
 * @param {number} options.interval - Milliseconds between checks
 * @returns {Promise<Element>} The found element
 */
export const waitForElement = async (callback, { timeout = 5000, interval = 50 } = {}) => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    try {
      const element = callback();
      if (element) return element;
    } catch (error) {
      // Ignore errors during the search
    }
    
    // Wait before trying again
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error('Timed out waiting for element');
};

/**
 * Waits for all pending promises to resolve
 * @returns {Promise<void>}
 */
export const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

/**
 * Waits for a specific amount of time, wrapped in act()
 * Useful for waiting for async operations to complete in tests
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
export const waitFor = async (ms = 0) => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, ms));
  });
};

/**
 * Simulates a delayed API response for testing loading states
 * @param {*} data - The data to return
 * @param {number} delay - Milliseconds to delay
 * @returns {Promise<*>} The data after the delay
 */
export const delayedResponse = (data, delay = 100) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

/**
 * Executes a sequence of test steps with proper async handling
 * @param {Function[]} steps - Array of async test step functions
 * @returns {Promise<void>}
 */
export const runAsyncSteps = async (steps) => {
  for (const step of steps) {
    await act(async () => {
      await step();
      await flushPromises();
    });
  }
};

export default {
  waitForElement,
  flushPromises,
  waitFor,
  delayedResponse,
  runAsyncSteps
};