# Dashboard Integration Apps

Reference skill for building integration/apps in the dashboard. Covers OAuth-based and Input-based integrations.

## Two Integration Archetypes

| Aspect | OAuth (Zoom, Google Calendar) | Input (Meta Pixel, TikTok, Snap, etc.) |
|--------|-------------------------------|----------------------------------------|
| Card component | `LinkAppCard` | `InputAppCard` |
| Connect flow | Lazy query → get URL → `window.location.href` redirect | `useMutation` with form values |
| Callback route | Yes, under `app/(dashboard)/apps/callback/` | None needed |
| Backend mutations | `connect(code!)` + `disconnect` | Single `connect(pixelId, active)` |
| Backend entity | Has `accessToken`, `refreshToken`, `email` | Has `pixelId`, `active` |
| Disconnect | Separate mutation | Same mutation with `active: false` |
| GQL operations | 4 (account query, URL query, connect, disconnect) | 2 (account query, connect) |

---

## ConnectReturn Type

Location: `src/modules/apps/types.ts`

```tsx
export type ConnectReturn<T = undefined> = [(args?: T) => Promise<void> | void, { loading: boolean }]
export type InputAppFormValues = { input?: string }
```

All connect/disconnect hooks return this tuple: `[callback, { loading }]`.

---

## App Card Components

Location: `src/modules/apps/app-card/`

### AppCardContainer (base wrapper)

```tsx
interface AppCardContainerProps extends CardRootProps {
  title: string
  homepage?: string       // External link on title
  logo: string            // Path to logo image
  free?: boolean          // Shows "Free" badge
  description?: string
  instructions?: React.ReactNode  // Shown below separator (see Video Tutorial Instructions below)
}
```

### LinkAppCard (OAuth integrations)

```tsx
interface Props extends AppCardContainerProps {
  label?: string           // Read-only value label
  value?: string           // Connected account display (e.g., email)
  connected?: boolean
  loading?: boolean
  onConnect?: () => Promise<void> | void
  onDisconnect?: () => void
}
```

- When disconnected: subtle button → calls `onConnect`
- When connected: shows value + red ghost disconnect button

### InputAppCard (Input integrations)

```tsx
interface Props extends AppCardContainerProps {
  connected?: boolean
  inputFieldProps?: TextInputFieldProps
  loading?: boolean
  name?: string            // Form field name
  onConnect(values: InputAppFormValues): Promise<void> | void
  onDisconnect?: () => void
}
```

- Has an internal `<form>` with `react-hook-form` + `yupResolver`
- `TextInputField` for pixel/tracking ID
- `onConnect` receives `{ input: string }`

---

## Apps Listing Page

Location: `src/app/(dashboard)/apps/client.page.tsx`

```tsx
import { SimpleGrid } from '@chakra-ui/react'
import { TableView } from '@/components/ui/table-view'

<TableView.Root>
  <TableView.Header>
    <TableView.HeaderContent>
      <Heading variant="table-view.title">{t('index.title')}</Heading>
      <Text variant="table-view.subtitle">{t('index.description')}</Text>
    </TableView.HeaderContent>
  </TableView.Header>

  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
    <ZoomApp />
    <GoogleCalendarApp />
    <MetaPixelApp />
    <TiktokPixelApp />
    <SnapPixelApp />
    {/* ... */}
  </SimpleGrid>
</TableView.Root>
```

---

## OAuth Integration (Complete Example: Zoom)

### 1. Connect Hook — `useLazyQuery` → redirect

Location: `src/modules/apps/zoom-app/use-on-zoom-connect.ts`

```tsx
import { useLazyQuery } from '@apollo/client'
import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from '@/components/ui/toaster'
import { Logger } from '@/logger/client'
import { ApiResZoomConnectUrl, zoomConnectUrlQuery } from '@/services/nzmly-api'
import { ConnectReturn } from '../types'

export function useOnZoomConnect(): ConnectReturn {
  const t = useTranslations('messages')
  const [zoomConnectUrl, { loading }] = useLazyQuery<ApiResZoomConnectUrl>(zoomConnectUrlQuery, {
    fetchPolicy: 'no-cache'
  })

  const callback = useCallback(async () => {
    try {
      const { data } = await zoomConnectUrl()
      if (!data?.zoomConnectUrl?.url) {
        toast.error({ title: t('error.unknownError') })
        return
      }
      window.location.href = data.zoomConnectUrl.url  // Redirect to OAuth provider
    } catch (err) {
      toast.error({ title: t('error.unknownError') })
      Logger.error(err)
    }
  }, [])

  return [callback, { loading }]
}
```

### 2. Disconnect Hook — Confirmation dialog + mutation

Location: `src/modules/apps/zoom-app/use-on-zoom-disconnect.tsx`

```tsx
import { memo, useCallback } from 'react'
import { useMutation } from '@apollo/client'
import { useTranslations } from 'next-intl'
import { AlertDialogContent } from '@/components/ui/alert-dialog'
import { dialog } from '@/components/ui/dialog'
import { toast } from '@/components/ui/toaster'
import { Logger } from '@/logger/client'
import { ConnectReturn } from '../types'

export function useOnZoomDisconnect(): ConnectReturn {
  const t = useTranslations('messages')
  const tl = useTranslations('label')
  const [disconnectApp, { loading }] = useMutation(disconnectZoomAccountMutation, {
    fetchPolicy: 'no-cache',
    refetchQueries: [{ query: zoomAccountQuery }]
  })

  const dialogId = 'zoom-app-disconnect-dialog'
  const title = tl('disconnect')
  const body = t('confirm.disconnectIntegration')

  const Content = memo(function Content({ onConfirm, loading }: { onConfirm?(): void; loading?: boolean }) {
    return (
      <AlertDialogContent
        confirmLabel={tl('disconnect')}
        onConfirm={onConfirm}
        confirmLoading={loading}
        confirmDisabled={loading}
        title={title}
        body={body}
      />
    )
  })

  const disconnect = useCallback(async () => {
    try {
      dialog.update(dialogId, { content: <Content onConfirm={disconnect} loading /> })
      const { data } = await disconnectApp()
      if (data?.disconnectZoomAccount?.active) {
        toast.error({ title: t('error.unknownError') })
        return
      }
      dialog.close(dialogId)
      toast.success({ title: t('success.disconnectSucceeded') })
    } catch (err) {
      dialog.update(dialogId, { content: <Content onConfirm={disconnect} loading={false} /> })
      Logger.error(err)
      toast.error({ title: t('error.unknownError') })
    }
  }, [])

  const callback = useCallback(
    () => dialog.open(dialogId, { content: <Content onConfirm={disconnect} /> }),
    [disconnect]
  )

  return [callback, { loading }]
}
```

### 3. App Component

Location: `src/modules/apps/zoom-app/zoom-app.tsx`

```tsx
export const ZoomApp = () => {
  const t = useTranslations('apps')
  const [onConnect, { loading: loadingConnect }] = useOnZoomConnect()
  const [onDisconnect, { loading: loadingDisconnect }] = useOnZoomDisconnect()
  const { data, loading: fetchLoading } = useQuery<ApiResZoomAccount>(zoomAccountQuery)

  return (
    <LinkAppCard
      title={t('index.zoom.title')}
      logo="/images/apps/logo/zoom.png"
      homepage="https://www.zoom.com/"
      loading={fetchLoading || loadingConnect || loadingDisconnect}
      free
      label={t('email')}
      value={data?.zoomAccount?.email}
      connected={!!data?.zoomAccount?.active}
      onConnect={onConnect}
      onDisconnect={onDisconnect}
    />
  )
}
```

### 4. OAuth Callback Route Handler

Location: `src/app/(dashboard)/apps/callback/zoom/route.ts`

```tsx
import { NextRequest, redirect } from 'next/server'
import { getApolloClient } from '@/apollo/server'
import { authenticated } from '@/auth/server'
import { Routes } from '@/router/constants'
import { config } from '@/config'

const toApps = () => redirect(new URL(Routes.Apps.Index, config.app.url).toString())

export async function GET(request: NextRequest) {
  const isAuthenticated = await authenticated()
  if (!isAuthenticated) {
    return redirect(new URL(Routes.Auth.Login, config.app.url).toString())
  }

  try {
    const code = request.nextUrl.searchParams.get('code')
    if (!code) return toApps()

    const apolloClient = getApolloClient()
    await apolloClient.mutate({
      mutation: connectZoomAccountMutation,
      variables: { code },
      fetchPolicy: 'network-only'
    })
    return toApps()
  } catch (err) {
    return toApps()
  }
}
```

---

## Input Integration (Complete Example: Meta Pixel)

### 1. Connect Hook — `useMutation` with form values

Location: `src/modules/apps/meta-pixel-app/use-on-meta-pixel-connect.ts`

```tsx
import { useMutation } from '@apollo/client'
import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from '@/components/ui/toaster'
import { Logger } from '@/logger/client'
import { ConnectReturn, InputAppFormValues } from '../types'

export function useOnMetaPixelConnect(): ConnectReturn<InputAppFormValues> {
  const t = useTranslations('messages')
  const [connectApp, { loading }] = useMutation(connectMetaPixelAccountMutation, {
    refetchQueries: [metaPixelAccountQuery]
  })

  const callback = useCallback(async (values?: InputAppFormValues) => {
    try {
      const { data } = await connectApp({
        variables: { pixelId: values?.input, active: true }
      })
      if (!data?.connectMetaPixelAccount?.active) {
        toast.error({ title: t('error.unknownError') })
        return
      }
      toast.success({ title: t('success.savedSuccessfully') })
    } catch (err) {
      toast.error({ title: t('error.unknownError') })
      Logger.error(err)
    }
  }, [])

  return [callback, { loading }]
}
```

### 2. Disconnect Hook — Same mutation with `active: false`

Location: `src/modules/apps/meta-pixel-app/use-on-meta-pixel-disconnect.tsx`

Same dialog pattern as OAuth disconnect, but calls the **connect** mutation with `{ pixelId: '', active: false }` instead of a separate disconnect mutation.

### 3. App Component

Location: `src/modules/apps/meta-pixel-app/meta-pixel-app.tsx`

```tsx
export const MetaPixelApp = () => {
  const t = useTranslations('apps')
  const [onConnect, { loading: connectLoading }] = useOnMetaPixelConnect()
  const [onDisconnect, { loading: disconnectLoading }] = useOnMetaPixelDisconnect()
  const { data, loading: fetchLoading } = useQuery<ApiResMetaPixelAccount>(metaPixelAccountQuery)
  const isLoading = fetchLoading || disconnectLoading || connectLoading

  return (
    <InputAppCard
      title={t('index.metaPixel.title')}
      logo="/images/apps/logo/meta-pixel.png"
      homepage="https://developers.facebook.com/docs/meta-pixel/"
      free
      loading={isLoading}
      connected={!!data?.metaPixelAccount?.active}
      inputFieldProps={{
        label: t('index.metaPixel.form.input.label'),
        placeholder: t('index.metaPixel.form.input.placeholder'),
        disabled: !!data?.metaPixelAccount?.active || isLoading,
        defaultValue: data?.metaPixelAccount?.pixelId || ''
      }}
      name="metaPixelId"
      onConnect={onConnect}
      onDisconnect={onDisconnect}
    />
  )
}
```

---

## GraphQL Layer

Location: `src/services/nzmly-api/schema/integration/{name}/`

### OAuth Integration — 4 operations

```ts
// zoom-account.query.ts
export const zoomAccountQuery = gql`query zoomAccount { zoomAccount { active email } }`

// zoom-connect-url.query.ts
export const zoomConnectUrlQuery = gql`query zoomConnectUrl { zoomConnectUrl { url } }`

// connect-zoom-account.mutation.ts
export const connectZoomAccountMutation = gql`mutation connectZoomAccount($code: String!) { connectZoomAccount(code: $code) { active email } }`

// disconnect-zoom-account.mutation.ts
export const disconnectZoomAccountMutation = gql`mutation disconnectZoomAccount { disconnectZoomAccount { active email } }`
```

### Input Integration — 2 operations

```ts
// meta-pixel-account.query.ts
export const metaPixelAccountQuery = gql`query metaPixelAccount { metaPixelAccount { active pixelId } }`

// connect-meta-pixel-account.mutation.ts (used for both connect AND disconnect)
export const connectMetaPixelAccountMutation = gql`mutation connectMetaPixelAccount($pixelId: String, $active: Boolean) { connectMetaPixelAccount(pixelId: $pixelId, active: $active) { active pixelId } }`
```

### API Types

Location: `src/services/nzmly-api/types.ts`

```tsx
// OAuth
interface ApiZoomAccount { active: boolean; email: string }
type ApiResZoomConnectUrl = Record<'zoomConnectUrl', { url: string } | null>
type ApiResZoomAccount = Record<'zoomAccount', ApiZoomAccount | null>
type ApiResConnectZoomAccount = Record<'connectZoomAccount', ApiZoomAccount | null>
type ApiResDisconnectZoomAccount = Record<'disconnectZoomAccount', ApiZoomAccount | null>

// Input
interface ApiMetaPixelAccount { active: boolean; pixelId: string }
type ApiResMetaPixelAccount = Record<'metaPixelAccount', ApiMetaPixelAccount | null>
type ApiResConnectMetaPixelAccount = Record<'connectMetaPixelAccount', ApiMetaPixelAccount | null>
```

---

## Backend Architecture (per integration)

### GQL Schema (schema-first `.gql`)

Location: `backend/apps/dash-api/src/modules/integration/{name}/schema/`

**OAuth:**
```graphql
type ZoomAccount { active: Boolean; email: String }
type ZoomConnectUrl { url: String }
type Query { zoomAccount: ZoomAccount; zoomConnectUrl: ZoomConnectUrl }
type Mutation { connectZoomAccount(code: String!): ZoomAccount; disconnectZoomAccount: ZoomAccount }
```

**Input:**
```graphql
type MetaPixelAccount { pixelId: String; active: Boolean }
type Query { metaPixelAccount: MetaPixelAccount }
type Mutation { connectMetaPixelAccount(pixelId: String, active: Boolean): MetaPixelAccount }
```

### Entity

Location: `backend/libs/database/src/entities/{name}/`

**OAuth entity fields:** `id`, `userId`, `email`, `accessToken`, `refreshToken`, `expiresAt`, `active`
**Input entity fields:** `id`, `userId`, `storeId?`, `pixelId`, `active`

### Service

Location: `backend/apps/dash-api/src/modules/integration/{name}/services/`

**Input service pattern:**
```ts
async connectAccount(userId: string, pixelId?: string, active?: boolean) {
  const [account] = await this.repo.entity.findOrCreate({ where: { userId } })
  if (!pixelId && active) throw createValidationError({ pixelId: 'validation.required' })
  await account.update({ pixelId, active })
  return account
}
```

### Resolver

Location: `backend/apps/dash-api/src/modules/integration/{name}/resolvers/`

Delegates to service for mutations; queries the repository directly for reads.

---

## Video Tutorial Instructions

When an integration needs setup instructions with a video tutorial, use the shared `instructions` prop with `t.rich('index.getCodeVideoInstructions', ...)`. This is a shared i18n key used across all apps that need a "click here to watch a video" link.

**i18n key** (in `apps` namespace): `"index.getCodeVideoInstructions"`
- EN: `"To watch a video on how to get the code, <link>click here</link>"`
- AR: `"لطريقة ربط التطبيق بحسابك شاهد هذا <link>الفيديو</link>."`

**Usage pattern** (from GoogleAnalyticsApp):

```tsx
<InputAppCard
  // ... other props
  instructions={t.rich('index.getCodeVideoInstructions', {
    link: (chunks) => (
      <Link href="https://youtu.be/eNZLSvIKNS0" target="_blank" colorPalette="blue">
        {chunks}
      </Link>
    )
  })}
/>
```

This renders as subtle text below a separator at the bottom of the card, with the "click here" / "الفيديو" portion as a clickable link opening the YouTube video in a new tab.

**When to use:** When adding a new integration, ask if setup instructions with a video tutorial are needed. If yes, pass the `instructions` prop using the pattern above with the appropriate YouTube URL.

---

## Full Checklist: Adding a New Integration

### Backend (in `backend/`)

1. **Entity** — Create in `libs/database/src/entities/{name}/`
   - OAuth: `id`, `userId`, `email`, `accessToken`, `refreshToken`, `expiresAt`, `active`
   - Input: `id`, `userId`, `pixelId` (or equivalent), `active`
2. **Migration** — `npm run migration:gen add-{name}-account`
3. **Repository + Providers** — Register entity in DatabaseModule
4. **Service** — `apps/dash-api/src/modules/integration/{name}/services/`
5. **Resolver** — `apps/dash-api/src/modules/integration/{name}/resolvers/`
6. **GQL Schema** — `apps/dash-api/src/modules/integration/{name}/schema/{name}.gql`
7. **Module** — Register resolver + service, import repositories

### Dashboard GraphQL (in `dashboard/`)

8. **Fragment** — `src/services/nzmly-api/schema/integration/{name}/{name}.fragment.ts`
9. **Query** — `src/services/nzmly-api/schema/integration/{name}/{name}-account.query.ts`
10. **Mutations** — Connect (+ disconnect for OAuth)
11. **Types** — Add to `src/services/nzmly-api/types.ts`
12. **Barrel export** — Add to `src/services/nzmly-api/index.ts`

### Dashboard Module (in `dashboard/`)

13. **Module folder** — `src/modules/apps/{name}-app/`
14. **Connect hook** — `use-on-{name}-connect.ts`
15. **Disconnect hook** — `use-on-{name}-disconnect.tsx`
16. **App component** — `{name}-app.tsx` using `InputAppCard` or `LinkAppCard`
17. **Wire into listing** — Add to `src/modules/apps/index.ts` + `src/app/(dashboard)/apps/client.page.tsx` SimpleGrid
18. **Callback route** (OAuth only) — `src/app/(dashboard)/apps/callback/{name}/route.ts`
19. **Logo** — `public/images/apps/logo/{name}.png`
20. **i18n keys** — Add to `apps` namespace: `index.{name}.title`, `index.{name}.description`, `index.{name}.form.input.label/placeholder`
21. **Instructions** (if needed) — Pass `instructions` prop with `t.rich('index.getCodeVideoInstructions', { link: ... })` and the YouTube URL (see Video Tutorial Instructions section above)

---

## Key Import Paths

| What | Import |
|------|--------|
| LinkAppCard | `@/modules/apps/app-card` |
| InputAppCard | `@/modules/apps/app-card` |
| AppCardContainer | `@/modules/apps/app-card` |
| ConnectReturn, InputAppFormValues | `@/modules/apps/types` |
| AlertDialogContent | `@/components/ui/alert-dialog` |
| dialog | `@/components/ui/dialog` |
| toast | `@/components/ui/toaster` |
| Logger | `@/logger/client` |
| getApolloClient (server) | `@/apollo/server` |
| authenticated (server) | `@/auth/server` |

## Real Examples in Codebase

| Integration | Type | Path |
|------------|------|------|
| Zoom | OAuth | `src/modules/apps/zoom-app/` |
| Google Calendar | OAuth | `src/modules/apps/google-calendar-app/` |
| Meta Pixel | Input | `src/modules/apps/meta-pixel-app/` |
| TikTok Pixel | Input | `src/modules/apps/tiktok-pixel-app/` |
| Snap Pixel | Input | `src/modules/apps/snap-pixel-app/` (consolidated hooks.tsx pattern) |
| Snap CAPI | Input | `src/modules/apps/snap-capi-app/` |
| Microsoft Clarity | Input | `src/modules/apps/microsoft-clarity-app/` |
| Google Analytics | Input | `src/modules/apps/google-analytics-app/` |
| Google Tag | Input | `src/modules/apps/google-tag-app/` |
