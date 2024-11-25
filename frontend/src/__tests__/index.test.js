import React from 'react';
import { createRoot } from 'react-dom/client';

// Mock createRoot inside the test
const mockRender = jest.fn();
jest.mock('react-dom/client', () => ({
    createRoot: () => ({
        render: mockRender
    })
}));

test('index.js successfully renders root React application', () => {
    // Mock the root element
    const rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);

    // Now require index.js
    require('../index');

    // Verify that render was called
    expect(mockRender).toHaveBeenCalledTimes(1);
});

