export default async function handler(req, res) {
  // 只接受 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { prompt, model, size, quality, n, response_format } = req.body

  // 基本參數驗證
  if (!prompt || prompt.trim() === '') {
    return res.status(400).json({ error: 'prompt is required' })
  }

  try {
    const response = await fetch('https://image.kawayi.shop/task/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        model: model || 'seedream_5_0_lite',
        size: size || '16:9',
        quality: quality || '4K',
        n: n || 1,
        response_format: response_format || 'url'
      })
    })

    const data = await response.json()

    // 偵測業務層錯誤（API 使用 200 回傳錯誤）
    if (data.error) {
      return res.status(429).json({ error: data.error })
    }

    return res.status(200).json(data)
  } catch (err) {
    console.error('API 呼叫失敗:', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
