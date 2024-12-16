
import { render, fireEvent, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../components/Dashboard/Dashboard';
import axios from 'axios';
import * as jsPDFModule from 'jspdf';

jest.mock('axios');

// Mock window.alert
window.alert = jest.fn();

// Create a spy on the jsPDF constructor
const jsPDFSpy = jest.spyOn(jsPDFModule, 'default');

describe('PDF Generation', () => {
    const mockFeedbackData = {
        'data': {
            "feedback": {
                'fit_score': 65,
                'skills': ['Skill0', 'Skill1', 'Skill5'],
                'keywords': ['Keyword0', 'Keyword1', 'Keyword5', 'Keyword6'],
                'feedback': {
                    'skills': ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'],
                    'experience': ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'],
                    'formatting': ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.']
                }
            }
        },
        "status": "success"
    };

    beforeEach(() => {

        // Clear all mocks
        jest.clearAllMocks();

        // Set up jsPDF spy
        jsPDFSpy.mockImplementation(() => ({
            text: jest.fn().mockReturnThis(),
            setFont: jest.fn().mockReturnThis(),
            setFontSize: jest.fn().mockReturnThis(),
            addPage: jest.fn().mockReturnThis(),
            save: jest.fn(),
            splitTextToSize: jest.fn(text => {
                // Split long text into multiple lines to force page overflow
                return text.match(/.{1,50}/g) || [text];
            }),
            internal: {
                pageSize: {
                    getWidth: jest.fn(() => 210),  // A4 width
                    getHeight: jest.fn(() => 100)  // Small height to force overflow
                }
            }
        }));

        // Mock API responses
        axios.post
            .mockResolvedValueOnce({ data: { message: 'Description uploaded successfully' } })
            .mockResolvedValueOnce({ data: { message: 'Resume uploaded successfully', resume_text: 'Mock Resume Text' } })
            .mockResolvedValueOnce(mockFeedbackData);

        // Set up global variables
        global.fitScore = mockFeedbackData.data.feedback.fit_score;
        global.keywords = mockFeedbackData.data.feedback.keywords;
        global.skills = mockFeedbackData.data.feedback.skills;
        global.skillsFeedback = mockFeedbackData.data.feedback.feedback.skills;
        global.experienceFeedback = mockFeedbackData.data.feedback.feedback.experience;
        global.formattingFeedback = mockFeedbackData.data.feedback.feedback.formatting;
    });

    test('PDF generation handles content correctly including page overflow', async () => {
        render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Dashboard />
            </MemoryRouter>
        );

        // Submit job description
        const descriptionInput = screen.getByRole('descriptionInput');
        await act(async () => {
            fireEvent.change(descriptionInput, { target: { value: 'Test job description' } });
            fireEvent.click(screen.getByRole('descriptionButton'));
        });

        // Upload resume
        const fileInput = screen.getByRole('fileInput');
        const file = new File(['test'], 'resume.pdf', { type: 'application/pdf' });
        await act(async () => {
            fireEvent.change(fileInput, { target: { files: [file] } });
            fireEvent.click(screen.getByRole('fileButton'));
        });

        // Get feedback
        const getFeedbackButton = await screen.findByRole('feedbackButton');
        await act(async () => {
            fireEvent.click(getFeedbackButton);
        });

        // Generate PDF
        const downloadButton = screen.getByRole('downloadButton');
        await act(async () => {
            fireEvent.click(downloadButton);
        });

        // Get the mock instance
        const mockInstance = jsPDFSpy.mock.results[0]?.value;

        // Make sure addPage is called the correct number of times based on content
        const margin = 20;
        const lineHeight = 10;
        const pageHeight = 100;
        const linesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);

        // Calculate total lines in the PDF
        const totalLines = [
            'Resume Analysis Report',
            `Fit Score: ${mockFeedbackData.data.feedback.fit_score}`,
            'Matched Keywords:',
            ...mockFeedbackData.data.feedback.keywords.map(keyword => `- ${keyword}`),
            'Skills:',
            ...mockFeedbackData.data.feedback.feedback.skills.map(skill => `- ${skill}`),
            'Experience:',
            ...mockFeedbackData.data.feedback.feedback.experience.map(experience => `- ${experience}`),
            'Formatting:',
            ...mockFeedbackData.data.feedback.feedback.formatting.map(formatting => `- ${formatting}`)
        ].reduce((count, text) => count + mockInstance.splitTextToSize(text, 170).length, 0);

        // Calculate expected `addPage` calls
        const expectedPageBreaks = Math.ceil(totalLines / linesPerPage) - 1;

        // console.log(`Expected page breaks: ${expectedPageBreaks}`);
        // console.log(`Actual addPage calls: ${mockInstance.addPage.mock.calls.length}`);

        // Assert expected number of `addPage` calls
        expect(mockInstance.addPage.mock.calls.length).toBe(expectedPageBreaks);


        // Verify all methods were called
        expect(jsPDFSpy).toHaveBeenCalled();
        expect(mockInstance.setFont).toHaveBeenCalledWith('Helvetica', 'bold'); // Title font
        expect(mockInstance.setFont).toHaveBeenCalledWith('Helvetica', 'normal'); // Content font
        expect(mockInstance.setFontSize).toHaveBeenCalledWith(24); // Title size
        expect(mockInstance.setFontSize).toHaveBeenCalledWith(16); // Content size
        expect(mockInstance.addPage).toHaveBeenCalled(); // Page overflow
        expect(mockInstance.splitTextToSize).toHaveBeenCalled(); // Text wrapping
        expect(mockInstance.text).toHaveBeenCalled(); // Content addition
        expect(mockInstance.save).toHaveBeenCalledWith('Resume_Analysis_Report.pdf');

        // Extract the full mock calls (structure: [text, x, y])
        const textCalls = mockInstance.text.mock.calls;

        // Extract only the content (first argument of each call)
        const textContents = textCalls.map(call => call[0]);

        // Verify specific content using textContents
        expect(textContents).toContain('Resume Analysis Report');
        expect(textContents).toContain(`Fit Score: ${mockFeedbackData.data.feedback.fit_score}`);
        expect(textContents).toContain('Matched Keywords:');
        mockFeedbackData.data.feedback.keywords.forEach(keyword => {
            expect(textContents).toContain(`- ${keyword}`);
        });
        expect(textContents).toContain('Skills:');
        mockFeedbackData.data.feedback.feedback.skills.forEach(skill => {
            const expectedLines = mockInstance.splitTextToSize(`- ${skill}`, 170); // Match the maxWidth used in your `splitTextToSize` calls
            expectedLines.forEach(line => {
                expect(textContents).toContain(line); // Verify each fragment is present
            });
        });
        expect(textContents).toContain('Experience:');
        expect(textContents).toContain('Formatting:');

        // Find all calls where addPage was triggered
        const addPageIndices = mockInstance.addPage.mock.calls.map((_, i) => i);

        // textCalls.forEach((call, index) => {
        //     console.log(`Text call ${index}: content="${call[0]}", x=${call[1]}, y=${call[2]}`);
        // });

        // Verify y resets to margin (20) or slightly higher after each addPage call
        addPageIndices.forEach((_, index) => {
            const nextTextCall = textCalls[index + 1]; // Call following addPage
            // console.log(`Text after addPage ${index + 1}:`, nextTextCall);

            expect(nextTextCall).toBeDefined();
            expect(nextTextCall[2]).toBeGreaterThanOrEqual(20); // y starts at or above margin
            // Allow y to increment beyond 30 based on lineHeight
            const margin = 20;
            const lineHeight = 10;

            // Verify y resets to a valid range after addPage
            expect(nextTextCall[2]).toBeGreaterThanOrEqual(margin); // Starts at or above margin
            expect(nextTextCall[2] % lineHeight).toBe(0);           // y increments consistently by lineHeight
        });

        // Log all method calls for debugging
        // console.log('Text calls:', textCalls);
        // console.log('Method calls:', {
        //     text: mockInstance.text.mock.calls,
        //     setFont: mockInstance.setFont.mock.calls,
        //     setFontSize: mockInstance.setFontSize.mock.calls,
        //     addPage: mockInstance.addPage.mock.calls,
        //     splitTextToSize: mockInstance.splitTextToSize.mock.calls,
        //     save: mockInstance.save.mock.calls
        // });
    });
});