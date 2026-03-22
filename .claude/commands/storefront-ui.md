# Storefront UI Pattern Reference

Concrete code patterns for the Next.js 14 Pages Router storefront with Chakra UI v2.

## Page Pattern (Pages Router + getServerSideProps)

```tsx
// pages/{handle}/products/[url].tsx
import { GetServerSidePropsContext } from 'next'
import { createApolloClient } from '@/api/nzmly/helpers/apollo-client'
import { getTokenFromCookies } from '@/api/nzmly/helpers/cookies'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const apolloClient = createApolloClient({
    locale: context.locale,
    token: getTokenFromCookies(context.req),
    req: context.req
  })

  const { data } = await apolloClient.query({
    query: PRODUCT_QUERY,
    variables: {
      handle: context.params?.handle as string,
      url: context.params?.url as string
    }
  })

  return {
    props: {
      product: data.product,
      locale: context.locale,
      personalLink: data.personalLink
    }
  }
}

export default function ProductPage({ product, personalLink }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <StoreLayout personalLink={personalLink}>
      <ProductDetail product={product} />
    </StoreLayout>
  )
}
```

## Form Pattern (react-hook-form + yup + useMemo)

```tsx
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FormControl, TextInput, SubmitButton } from '@/components/form'

function ContactForm() {
  const { t } = useTranslation()

  // CRITICAL: useMemo with [t] dependency for locale-reactive validation
  const schema = useMemo(() => yup.object({
    name: yup.string().required(t('validation.required')),
    email: yup.string().email(t('validation.invalidEmail')).required(t('validation.required')),
    message: yup.string().required(t('validation.required')),
  }), [t])

  const { handleSubmit, control, register, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl label={t('label.name')} error={errors.name?.message}>
        <TextInput {...register('name')} />
      </FormControl>

      <FormControl label={t('label.email')} error={errors.email?.message}>
        <TextInput {...register('email')} dir="ltr" />
      </FormControl>

      <FormControl label={t('label.message')} error={errors.message?.message}>
        <TextArea {...register('message')} />
      </FormControl>

      <SubmitButton isLoading={isSubmitting}>
        {t('label.send')}
      </SubmitButton>
    </form>
  )
}
```

## Chakra UI v2 Style Props

```tsx
// Layout with logical properties (RTL-safe)
<Flex direction="column" gap={4}>
  <Box
    bg="primary.500"
    color="white"
    p={4}
    borderRadius="md"
    marginStart={2}     // NOT marginLeft
    marginEnd={2}       // NOT marginRight
    paddingStart={4}    // NOT paddingLeft
    paddingEnd={4}      // NOT paddingRight
  >
    Content
  </Box>
</Flex>

// Responsive (mobile-first)
<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
  <ProductCard />
</SimpleGrid>

// Force LTR for specific inputs
<Input dir="ltr" />  {/* emails, URLs, phone numbers */}
```

## Color Tokens

```
primary.*       — Theme-dependent (changes per store themeColor)
gray.*          — Neutral grays
orange.900      — Accent
green.400       — Success
neutral.*       — Neutral palette
```

Theme colors are dynamic based on `personalLink.themeColor` (e.g., `OCEAN_TEAL`, `VIBRANT_VIOLET`).

## Authentication Cookie Pattern

```tsx
import { NZMLY_CUSTOMER_ACCESS_TOKEN_COOKIE_NAME } from '@/constants/cookies'

// In getServerSideProps — read token from cookies
const token = getTokenFromCookies(context.req)

// Apollo automatically adds Authorization header via the link chain
const apolloClient = createApolloClient({ locale, token, req: context.req })
```

## Tracking Events

```tsx
import { useDispatchTrackingEvent } from '@/tracking/hooks'
import { ProductViewEvent, AddToCartEvent, PurchaseEvent } from '@/tracking/events'

function ProductDetail({ product }) {
  const dispatch = useDispatchTrackingEvent()

  useEffect(() => {
    dispatch(new ProductViewEvent({
      productId: product.id,
      productName: product.name,
      price: product.price
    }))
  }, [product.id])

  const handleAddToCart = () => {
    dispatch(new AddToCartEvent({ productId: product.id, price: product.price }))
  }
}
```

Events are defined in `src/tracking/events.ts`. Multiple providers consume them: NZMLY, Mixpanel, Meta Pixel, TikTok, Snap, GA.

## Domain Directory Structure

```
src/domain/{domain}/
├── components/       # Domain-specific components
│   ├── product-card.tsx
│   └── product-list.tsx
├── hooks/            # Domain-specific hooks
│   └── use-product-filter.hook.ts
└── constants/        # Domain-specific constants
    └── product-types.ts
```

## GraphQL Operations

```tsx
// src/api/nzmly/{domain}/product.query.ts
import { gql } from '@apollo/client'

export const PRODUCT_QUERY = gql`
  query Product($handle: String!, $url: String!) {
    product(handle: $handle, url: $url) {
      id
      name
      price
      description
    }
  }
`

// src/api/nzmly/{domain}/create-booking.mutation.ts
export const CREATE_BOOKING_MUTATION = gql`
  mutation CreateBooking($handle: String!, $product: BookingProductInput!, $customer: BookingCustomerInput!) {
    createBooking(handle: $handle, product: $product, customer: $customer) {
      id
      status
    }
  }
`
```

## Error Handling

```tsx
import { logger } from '@/lib/logger'
import { toast } from 'react-toastify'

try {
  await someAsyncOperation()
  toast.success(t('message.success'))
} catch (error) {
  logger.error(
    error instanceof Error ? error : new Error('Operation failed'),
    { context: 'ProductDetail.handlePurchase' }
  )
  toast.error(t('message.error'))
}
```

## i18n (react-i18next)

```tsx
import { useTranslation } from 'react-i18next'

const { t } = useTranslation()           // 'common' namespace (default)
const { t } = useTranslation('home')     // 'home' namespace

// Translation files: public/locales/{ar,en}/{common,home}.json
// Always add keys to BOTH ar and en files
// Arabic is the default locale
```

## Key Differences from Dashboard

| Aspect | Storefront (this) | Dashboard |
|--------|------------------|-----------|
| Next.js | 14 (Pages Router) | 15 (App Router) |
| Chakra UI | v2 | v3 |
| i18n | react-i18next | next-intl |
| CSS | Chakra v2 only (no Tailwind for new code) | Chakra v3 tokens |
| Data fetch | getServerSideProps | Server components + fetch-*.ts |
| Toasts | react-toastify | @/components/ui/toaster |
| File naming | kebab-case mandatory | Standard |
