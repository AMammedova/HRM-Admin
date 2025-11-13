import type React from "react"
import { NextIntlClientProvider } from "next-intl"
import { Providers } from '../providers';
import { Toaster } from '@/shared/molecules/Toaster';
import { getMessages } from "next-intl/server"

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        {children}
        <Toaster />
      </Providers>
    </NextIntlClientProvider>
  )
}
