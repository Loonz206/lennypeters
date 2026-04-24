import { launch } from 'puppeteer'

const performanceTest = async pageUrl => {
  const browser = await launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()

  await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 30000 })

  const metrics = await page.evaluate(() => {
    const entries = performance.getEntriesByType('navigation')[0]
    return {
      domContentLoaded: entries.domContentLoadedEventEnd - entries.fetchStart,
      loadComplete: entries.loadEventEnd - entries.fetchStart,
    }
  })

  await browser.close()

  return {
    url: pageUrl,
    metrics,
    interactive: metrics.domContentLoaded,
    end: metrics.loadComplete,
  }
}

export default performanceTest
