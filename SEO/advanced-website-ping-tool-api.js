// advanced-website-ping-tool-api.js
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const apiKey = process.env.PAGESPEED_API_KEY;
    
    if (!apiKey) {
      throw new Error('PageSpeed API key not configured');
    }

    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO&key=${apiKey}`;

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`PageSpeed API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.lighthouseResult) {
      throw new Error('No Lighthouse result in API response');
    }

    const lighthouse = data.lighthouseResult;
    
    const result = {
      success: true,
      data: {
        performance: Math.round((lighthouse.categories.performance?.score || 0) * 100),
        accessibility: Math.round((lighthouse.categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((lighthouse.categories['best-practices']?.score || 0) * 100),
        seo: Math.round((lighthouse.categories.seo?.score || 0) * 100),
        firstContentfulPaint: lighthouse.audits['first-contentful-paint']?.displayValue || 'N/A',
        largestContentfulPaint: lighthouse.audits['largest-contentful-paint']?.displayValue || 'N/A',
        cumulativeLayoutShift: lighthouse.audits['cumulative-layout-shift']?.displayValue || 'N/A',
        speedIndex: lighthouse.audits['speed-index']?.displayValue || 'N/A',
        totalBlockingTime: lighthouse.audits['total-blocking-time']?.displayValue || 'N/A'
      }
    };

    res.status(200).json(result);
    
  } catch (error) {
    console.error('PageSpeed API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      fallback: 'using_simulated_data'
    });
  }
}
