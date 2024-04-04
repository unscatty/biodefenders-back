import json from 'json5'

export const extractNumber = (text: string): number => {
  const floatRegex = /(\d+(\.\d+)?)/
  const numberMatch = text.match(floatRegex)

  if (!numberMatch) {
    return NaN
  }

  return Number.parseFloat(numberMatch[0])
}

export const extractTime = (text: string): string => {
  // Regex to match time in the format HH:MM with optional seconds
  const timeRegex = /(\d{1,2}:\d{2}(:\d{2})?)/

  // Match the time in the text
  const timeMatch = text.match(timeRegex)

  // If no match is found, return an empty string
  if (!timeMatch) {
    return ''
  }

  // Return the matched time
  return timeMatch[0]
}

export const extractJsonFromText = (text: string): Record<string, any> | null => {
  const regex = /{[^]*}/
  // const regex = /{.*?}/;

  const match = text.match(regex)

  if (!match) {
    return null
  }

  try {
    return json.parse(match[0])
  } catch (error) {
    return null
  }
}