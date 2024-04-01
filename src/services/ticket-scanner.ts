import { DocumentProcessorServiceClient } from '@google-cloud/documentai'
import { readFile } from 'node:fs/promises'
import type { TicketProduct, ScanTicketResponse } from '@models/scan'
import { google } from '@google-cloud/documentai/build/protos/protos'
import { extractNumber, extractTime } from '@utils/text'

const { GCP_DOC_AI_PROCESSOR_ENDPOINT_NAME } = process.env

const client = new DocumentProcessorServiceClient()

export const extractTicketInfo = (response: google.cloud.documentai.v1.IProcessResponse): Partial<ScanTicketResponse> | {} => {
  const { document } = response

  if (!document) {
    return {}
  }

  const { entities } = document

  if (!entities) {
    return {}
  }

  let supplierName = ''
  let supplierAddress = ''
  let ticketTotalAmount: number | string = 0
  let ticketDate = ''
  let ticketPurchaseTime = ''

  const products: TicketProduct[] = []

  for (const entity of entities) {
    if (entity.type === 'supplier_name') {
      supplierName ||= entity.normalizedValue?.text || entity.mentionText || ''
      supplierName.trim()

      continue
    }

    if (entity.type === 'supplier_address') {
      supplierAddress ||= entity.normalizedValue?.text || entity.mentionText || ''
      supplierAddress.trim()

      continue
    }

    if (entity.type === 'total_amount') {
      const normalizedTotal = entity.normalizedValue?.text?.trim() || entity.mentionText?.trim() || ''

      // Extract total from text using regex
      const extractedTotal = extractNumber(normalizedTotal)

      ticketTotalAmount = Number.isNaN(extractedTotal) ? normalizedTotal : extractedTotal

      continue
    }

    if (entity.type === 'receipt_date') {
      ticketDate = entity.normalizedValue?.text || entity.mentionText || ''
      ticketDate.trim()

      continue
    }

    if (entity.type === 'purchase_time') {
      const purchaseTime = entity.normalizedValue?.text || entity.mentionText || ''
      purchaseTime.trim()

      // Extract time from text using regex
      const extractedTime = extractTime(purchaseTime)

      ticketPurchaseTime = extractedTime || purchaseTime

      continue
    }

    if (entity.type === 'line_item') {
      // Get info from products
      if (entity.properties && entity.properties.length > 1) {
        const product: TicketProduct = {} as TicketProduct

        for (const entityProperty of entity.properties) {
          if (entityProperty.type === 'line_item/description') {
            product.description = entityProperty.normalizedValue?.text || entityProperty.mentionText || ''
            product.description.trim()

            continue
          }

          if (entityProperty.type === 'line_item/amount') {
            const normalizedAmount = entityProperty.normalizedValue?.text?.trim() || entityProperty.mentionText?.trim() || ''

            // Extract amount from text using regex
            const extractedAmount = extractNumber(normalizedAmount)

            product.amount = Number.isNaN(extractedAmount) ? normalizedAmount : extractedAmount

            continue
          }

          if (entityProperty.type === 'line_item/product_code') {
            product.productCode = entityProperty.normalizedValue?.text || entityProperty.mentionText || ''
            product.productCode.trim()

            continue
          }
        }

        products.push(product)
      }

      continue
    }
  }

  return {
    supplierName,
    supplierAddress,
    ticketTotalAmount,
    ticketDate,
    ticketPurchaseTime,
    products,
  }
}

export const scanTicket = async (
  content: string | Uint8Array | null | undefined,
  mimeType = 'image/jpeg'
): Promise<Partial<ScanTicketResponse> | {}> => {
  const name = GCP_DOC_AI_PROCESSOR_ENDPOINT_NAME

  const request: Parameters<typeof client.processDocument>[0] = {
    name,
    rawDocument: {
      content,
      mimeType,
    },
  }

  const [result] = await client.processDocument(request)

  return extractTicketInfo(result)
}

export const scanTicketFromPath = async (path: string, mimeType = 'image/jpeg') => {
  const file = await readFile(path)
  const encodedImage = Buffer.from(file).toString('base64')

  // debugger

  return scanTicket(encodedImage, mimeType)
}

export const scanTicketFromFile = async (file: File) => {
  // Transform file to base64 string using Node.js APIs
  const fileBuffer = await file.arrayBuffer()
  const encodedImage = Buffer.from(fileBuffer).toString('base64')

  return scanTicket(encodedImage, file.type)
}

export const scanTicketFromBlob = async (blob: Blob, mimeType = 'image/jpeg') => {
  const file = await blob.arrayBuffer()
  const encodedImage = Buffer.from(file)

  return scanTicket(encodedImage, mimeType)
}

export const scanTicketFromBase64 = async (base64: string, mimeType = 'image/jpeg') => {
  return scanTicket(base64, mimeType)
}
