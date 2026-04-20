import { test, expect } from '@playwright/test';

// I am so clever.
test.beforeEach(async ({context, page}) => {
    await page.goto('http://localhost:8080')
    
    await context.addCookies([
        {
            name: '1',
            value: 'false',
            url: page.url(),
        },
        {
            name: '2',
            value: 'false',
            url: page.url(),
        },
        {
            name: '3',
            value: 'false',
            url: page.url(),
        },
    ])
})

test("TEST-1-RESET", async ({ page }) => {
    // EXECUTION
    await page.getByRole('link', {name: 'Reset'}).click()

    // POSTCONDITION CHECKS
    await expect(
        page.getByTestId('listing').getByRole('listitem').nth(0)
    ).toHaveText('ID 1. Jennyanydots')

    await expect(
        page.getByTestId('listing').getByRole('listitem').nth(1)
    ).toHaveText('ID 2. Old Deuteronomy')

    await expect(
        page.getByTestId('listing').getByRole('listitem').nth(2)
    ).toHaveText('ID 3. Mistoffelees')
});

test("TEST-2-CATALOG", async ({ page }) => {
    // EXECUTION
    await page.getByRole('link', {name: 'Catalog'}).click()

    // POSTCONDITION CHECKS
    await expect(
        page.locator('ol').getByRole('img').nth(1)
    ).toHaveAttribute('src', '/images/cat2.jpg')
});

test("TEST-3-LISTING", async ({ page }) => {
    // EXECUTION
    await page.getByRole('link', {name: 'Catalog'}).click()

    // POSTCONDITION CHECKS
    await expect(
        page.getByTestId('listing').getByRole("listitem")
    ).toHaveCount(3)

    await expect(
        page.getByTestId('listing').getByRole('listitem').nth(2)
    ).toHaveText('ID 3. Mistoffelees')
});

test("TEST-4-RENT-A-CAT", async ({ page }) => {
    // EXECUTION
    await page.getByRole('link', {name: 'Rent-A-Cat'}).click()

    // POSTCONDITION CHECKS
    await expect(
        page.getByRole('button', {name: 'Rent'})
    ).toBeVisible()

    await expect(
        page.getByRole('button', {name: 'Return'})
    ).toBeVisible()
});

test("TEST-5-RENT", async ({ page }) => {
    // EXECUTION
    await page.getByRole('link', {name: 'Rent-A-Cat'}).click()
    await page.getByTestId('rentID').fill('1')
    await page.getByRole('button', {name: 'Rent'}).click()

    // POSTCONDITION CHECKS
    await expect(
        await page.getByTestId('rentResult')
    ).toHaveText('Success!')

    await page.getByRole('link', {name: 'Catalog'}).click()

    await expect(
        page.getByTestId('listing').getByRole('listitem').nth(0)
    ).toHaveText('Rented out')

    await expect(
        page.getByTestId('listing').getByRole('listitem').nth(1)
    ).toHaveText('ID 2. Old Deuteronomy')

    await expect(
        page.getByTestId('listing').getByRole('listitem').nth(2)
    ).toHaveText('ID 3. Mistoffelees')
});

test("TEST-6-RETURN", async ({ context, page }) => {
    // PRECONDITIONS
    await context.addCookies([
        {
            name: '2',
            value: 'true',
            url: page.url(),
        },
        {
            name: '3',
            value: 'true',
            url: page.url(),
        },
    ])

    // EXECUTION STEPS
    await page.getByRole('link', {name: 'Rent-A-Cat'}).click()
    await page.getByTestId('returnID').fill('2')
    await page.getByRole('button', {name: 'Return'}).click()

    // POSTCONDITION CHECKS
    await expect(
        await page.getByTestId('returnResult')
    ).toHaveText('Success!')

    await page.getByRole('link', {name: 'Catalog'}).click()

    await expect(
        page.getByTestId('listing').getByRole('listitem').nth(0)
    ).toHaveText('ID 1. Jennyanydots')

    await expect(
        page.getByTestId('listing').getByRole('listitem').nth(1)
    ).toHaveText('ID 2. Old Deuteronomy')

    await expect(
        page.getByTestId('listing').getByRole('listitem').nth(2)
    ).toHaveText('Rented out')
});

test("TEST-7-FEED-A-CAT", async ({ page }) => {
    // EXECUTION STEPS
    await page.getByRole('link', {name: 'Feed-A-Cat'}).click()

    // POSTCONDITION CHECKS
    await expect(
        page.getByRole('button', {name: 'Feed'})
    ).toBeVisible()
});

test("TEST-8-FEED", async ({ page }) => {
    // EXECUTION STEPS
    await page.getByRole('link', {name: 'Feed-A-Cat'}).click()
    await page.getByTestId('catnips').fill('6')
    await page.getByRole('button', {name: 'Feed'}).click()

    // POSTCONDITION CHECKS
    await expect(
        await page.getByTestId('feedResult')
    ).toHaveText('Nom, nom, nom.', {timeout: 10_000})
});

test("TEST-9-GREET-A-CAT", async ({ page }) => {
    // EXECUTION STEPS
    await page.getByRole('link', {name: 'Greet-A-Cat'}).click()

    // POSTCONDITION CHECKS
    await expect(
        page.getByTestId('greeting')
    ).toHaveText('Meow!Meow!Meow!')
});

test("TEST-10-GREET-A-CAT-WITH-NAME", async ({ page }) => {
    // EXECUTION STEPS
    // Relative paths aren't working for me?
    await page.goto(page.url() + '/greet-a-cat/Jennyanydots')

    // POSTCONDITION CHECKS
    await expect(
        page.getByTestId('greeting')
    ).toHaveText('Meow! from Jennyanydots.')
});

test("TEST-11-FEED-A-CAT-SCREENSHOT", async ({ context, page }) => {
    // PRECONDITION SETUP
    await context.addCookies([
        {
            name: '1',
            value: 'true',
            url: page.url(),
        },
        {
            name: '2',
            value: 'true',
            url: page.url(),
        },
        {
            name: '3',
            value: 'true',
            url: page.url(),
        },
    ])

    // EXECUTION STEPS
    await page.getByRole('link', {name: 'Feed-A-Cat'}).click()

    // POSTCONDITION CHECKS
    page.setViewportSize({width: 1280, height: 848})
    await expect(page).toHaveScreenshot({maxDiffPixelRatio: 0.09})
});