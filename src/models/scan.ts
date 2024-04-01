export interface TicketProduct {
  description: string
  amount?: number | string
  productCode?: string
}

export interface ScanTicketResponse {
  supplierName: string
  supplierAddress: string
  ticketTotalAmount: number | string
  ticketPurchaseDate: string
  ticketPurchaseTime: string
  products: TicketProduct[]
}