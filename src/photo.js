const supported = ['image/jpeg', 'image/png', 'image/webp']

export async function preparePhoto(file) {
  if (!supported.includes(file.type) || file.size > 5 * 1024 * 1024) {
    throw new Error('Choose a JPEG, PNG or WebP image up to 5 MB.')
  }

  const url = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = url
    try {
      await image.decode()
    } catch {
      throw new Error('This image could not be opened.')
    }
    const scale = Math.min(1, 640 / Math.max(image.width, image.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(image.width * scale))
    canvas.height = Math.max(1, Math.round(image.height * scale))
    const context = canvas.getContext('2d')
    context.fillStyle = '#fff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.75)
  } finally {
    URL.revokeObjectURL(url)
  }
}
