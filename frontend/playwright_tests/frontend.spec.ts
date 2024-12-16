import { test, expect } from '@playwright/test';

test('End-to-end workflow, positive responses', async ({ page }) => {
  await page.route('*/**/api/verify-token', async route => {
    const json = [{}];
    await route.fulfill({ json });
  });

  await page.goto('http://127.0.0.1:3000');

  await expect(page.getByText('Home Page')).toBeVisible();

  // Mock the api call before navigating
  await page.route('*/**/api/register', async route => {
    const json = [{}];
    await route.fulfill({ json });
  });

  await page.goto('http://127.0.0.1:3000/register');

  await page.fill('#email', 'test@example.com');
  await page.fill('#username', 'test');
  await page.fill('#password', 'TestPassword123');
  await page.fill('#confirmPassword', 'TestPassword123');

  await page.click('button[type="submit"]');

  await expect(page.getByText('Registration successful!')).toBeVisible();

  await expect(page.getByTestId('loginButton')).toBeVisible();

  // Mock the api call before navigating
  await page.route('*/**/api/login', async route => {
    const json = [{ data: { token: 'mockToken' } }];
    await route.fulfill({ json });
  });

  await page.goto('http://127.0.0.1:3000/login');

  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'TestPassword123');

  await page.click('button[type="submit"]');

  // Mock the api call before navigating
  const resumeText = 'This is the resume text in playwright: Skill0, Keyword0'
  await page.route('*/**/api/resume-upload', async route => {
    const json = {message: 'Resume uploaded successfully.', resume_text: resumeText, status: 'success'};
    await route.fulfill({ json });
  });
  await page.route('*/**/api/job-description', async route => {
    const json = {message: 'Job description submitted successfully.', status: 'success'};
    await route.fulfill({ json });
  });
  await page.route('*/**/api/fit-score', async route => {
    const json = {
      feedback: {
              'fit_score': 65,
              'skills': ['Skill0', 'Skill1', 'Skill2'],
              'keywords': ['Keyword0', 'Keyword1', 'Keyword3'],
              'feedback': {
                  'skills': ['SkillFeedback1', 'SkillFeedback2'],
                  'experience': ['ExperienceFeedback1', 'ExperienceFeedback2'],
                  'formatting': ['FormattingFeedback1', 'FormattingFeedback2'] 
              }
          },
      status: 'success'
  };
    await route.fulfill({ json });
  });

  await page.goto('http://127.0.0.1:3000/dashboard');
  
  expect(page.getByText('Dashboard:')).toBeVisible();

  // Fill description
  await page.fill('#descriptionUpload', 'This is the job description');

  // Fill resume
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator('input[type="file"]').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles('.\\playwright_tests\\sample_resume.pdf');
  
  await page.click('button[id="descriptionButton"]');
  await expect(page.getByText('Job Description: ✅')).toBeVisible();

  await page.click('button[id="fileButton"]');
  await expect(page.getByText('Resume Upload: ✅')).toBeVisible();

  await expect(page.getByTestId('feedbackButton')).toBeVisible();

  await page.click('button[id="feedbackButton"]');

  // Wait for animation to play
  await expect(page.getByText('Results:')).toBeVisible({timeout:2000});

  // Check feedback rendering
  expect(page.getByText('Skill0')).toBeTruthy();
  expect(page.getByText('Skill1')).toBeTruthy();
  expect(page.getByText('Skill2')).toBeTruthy();

  expect(page.getByText('Keyword0')).toBeTruthy();
  expect(page.getByText('Keyword1')).toBeTruthy();
  expect(page.getByText('Keyword2')).toBeTruthy();

  expect(page.getByText('SkillFeedback1')).toBeTruthy();
  expect(page.getByText('SkillFeedback2')).toBeTruthy();
  expect(page.getByText('ExperienceFeedback1')).toBeTruthy();
  expect(page.getByText('ExperienceFeedback2')).toBeTruthy();
  expect(page.getByText('FormattingFeedback1')).toBeTruthy();
  expect(page.getByText('FormattingFeedback2')).toBeTruthy();

  expect(page.getByText('65%')).toBeTruthy();
  
  // Download feedback
  // await page.click('[contentdisposition="attachment"]');

  const downloadButton = page.locator('#downloadButton');
  const [ download ] = await Promise.all([
    page.waitForEvent('download'),
    downloadButton.click(),
  ]);

  // Download feedback file and save
  await download.saveAs('.\\playwright_tests\\' + download.suggestedFilename());
});

test('End-to-end workflow, negative or error responses', async ({ page }) => {
  await page.route('*/**/api/verify-token', async route => {
    const json = [{}];
    await route.fulfill({ json });
  });
  
  await page.goto('http://127.0.0.1:3000');

  await expect(page.getByText('Home Page')).toBeVisible();

  await page.goto('http://127.0.0.1:3000/dashboard');

  // Wait for redirect
  await page.waitForTimeout(1000)

  await expect(page.getByText('Login:')).toBeVisible();

  // Mock the api call before navigating
  await page.route('*/**/api/register', async route => {
    const json = [{}];
    await route.fulfill({ json });
  });

  await page.goto('http://127.0.0.1:3000/register');

  await page.fill('#email', 'test@example.com');
  await page.fill('#username', 'test');
  await page.fill('#password', 'TestPassword123');
  await page.fill('#confirmPassword', 'TestPassword12');

  await page.click('button[type="submit"]');

  await expect(page.getByText('Registration successful!')).not.toBeVisible();

  await page.fill('#email', 'test@example.com');
  await page.fill('#username', 'test');
  await page.fill('#password', 'TestPassword123');
  await page.fill('#confirmPassword', 'TestPassword123');

  await page.click('button[type="submit"]');

  await expect(page.getByText('Registration successful!')).toBeVisible();

  await expect(page.getByTestId('loginButton')).toBeVisible();

  // Mock the api call before navigating
  await page.route('*/**/api/login', async route => {
    const json = [{ data: { token: 'mockToken' } }];
    await route.fulfill({ json });
  });

  await page.goto('http://127.0.0.1:3000/login');

  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'TestPassword123');

  await page.click('button[type="submit"]');

  // Mock the api call before navigating
  const resumeText = 'This is the resume text in playwright: Skill0, Keyword0'
  await page.route('*/**/api/resume-upload', async route => {
    const json = {message: 'Resume uploaded successfully.', status: 'success'};
    await route.fulfill({ json });
  });
  await page.route('*/**/api/job-description', async route => {
    const json = {message: 'Job description submitted successfully.', status: 'success'};
    await route.fulfill({ json });
  });
  await page.route('*/**/api/fit-score', async route => {
    const json = {
      feedback: {},
      status: 'success'
  };
    await route.fulfill({ json });
  });

  await page.goto('http://127.0.0.1:3000/dashboard');
  
  expect(page.getByText('Dashboard:')).toBeVisible();

  // Fill description
  //await page.fill('#descriptionUpload', '');

  // Fill resume
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator('input[type="file"]').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles('.\\playwright_tests\\sample_resume.txt');
  
  await page.click('button[id="descriptionButton"]');
  await expect(page.getByText('Job Description: ✅')).not.toBeVisible();

  await page.click('button[id="fileButton"]');
  await expect(page.getByText('Resume Upload: ✅')).not.toBeVisible();

  await expect(page.getByTestId('feedbackButton')).not.toBeVisible();
});
