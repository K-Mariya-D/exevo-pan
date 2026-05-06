import { TRPCError } from '@trpc/server'

export type ApiSuccess<T> = {
  success: true
  data: T
}

export const apiSuccess = <T>(data: T): ApiSuccess<T> => ({
  success: true,
  data,
})

export const toTRPCError = (
  error: unknown,
  fallbackMessage = 'Internal server error',
): TRPCError => {
  if (error instanceof TRPCError) return error
  if (error instanceof Error) {
    return new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || fallbackMessage,
    })
  }
  return new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: fallbackMessage,
  })
}
