# Dashboard UI Pattern Reference

Concrete code patterns for the Next.js 15 App Router dashboard with Chakra UI v3.

## Route Pattern (page.tsx + page.client.tsx)

### Server Component (page.tsx)

```tsx
import { getTranslations, getLocale } from 'next-intl/server'
import { PageClient } from './page.client'
import { fetchProducts } from '@/modules/products/server/fetch-products'

export async function generateMetadata() {
  const t = await getTranslations('products')
  const locale = await getLocale()
  return {
    title: t('pageTitle'),
    dir: locale === 'ar' ? 'rtl' : 'ltr'
  }
}

export default async function Page() {
  const data = await fetchProducts()
  return <PageClient initialData={data} />
}
```

### Client Component (page.client.tsx)

```tsx
'use client'

import { useTranslations } from 'next-intl'

export function PageClient({ initialData }: { initialData: SomeType }) {
  const t = useTranslations('products')
  // ...
}
```

### Server-Side Data Fetching (fetch-*.ts)

```tsx
// src/modules/{module}/server/fetch-products.ts
import { getApolloClient } from '@/apollo/apollo-client'
import { PRODUCTS_QUERY } from '@/services/nzmly-api'

export async function fetchProducts() {
  const client = await getApolloClient()
  const { data } = await client.query({ query: PRODUCTS_QUERY })
  return data.myProducts
}
```

## TableView Pattern (List Pages)

```tsx
'use client'

import { TableView, TableViewSkeleton } from '@/components/ui/table-view'
import { useQuery } from '@apollo/client'

export function ProductsPageClient() {
  const t = useTranslations('products')
  const { data, loading } = useQuery(PRODUCTS_QUERY)

  if (loading) return <TableViewSkeleton />

  return (
    <TableView>
      <TableView.Header>
        <TableView.Title>{t('title')}</TableView.Title>
        <TableView.Actions>
          <Button onClick={() => router.push(Routes.products.create)}>
            {t('addProduct')}
          </Button>
        </TableView.Actions>
      </TableView.Header>
      <TableView.Table>
        <TableView.Thead>
          <TableView.Tr>
            <TableView.Th>{t('name')}</TableView.Th>
            <TableView.Th>{t('price')}</TableView.Th>
          </TableView.Tr>
        </TableView.Thead>
        <TableView.Tbody>
          {data.items.map(item => (
            <TableView.Tr key={item.id}>
              <TableView.Td>{item.name}</TableView.Td>
              <TableView.Td>{item.price}</TableView.Td>
            </TableView.Tr>
          ))}
        </TableView.Tbody>
      </TableView.Table>
      <TableView.Pagination total={data.total} />
    </TableView>
  )
}
```

## FormView Pattern (Form Pages)

```tsx
'use client'

import { FormView } from '@/components/ui/form-view'
import { TextInputField, SelectField } from '@/components/ui/form'
import { Hydrated } from '@/components/ui/hydrated'

export function EditProductPageClient({ product }: Props) {
  const t = useTranslations('products')
  const form = useProductForm(product)
  const onSubmit = useOnSubmitProduct(form.control)

  return (
    <FormView>
      <FormView.Header>
        <FormView.Title>{t('editProduct')}</FormView.Title>
      </FormView.Header>
      <FormView.Body as="form" onSubmit={form.handleSubmit(onSubmit)}>
        <TextInputField
          label={t('name')}
          error={form.formState.errors.name?.message}
          {...form.register('name')}
        />
        <SelectField
          label={t('category')}
          error={form.formState.errors.categoryId?.message}
          {...form.register('categoryId')}
        >
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </SelectField>

        <Hydrated>
          <Button type="submit" loading={form.formState.isSubmitting}>
            {t('save')}
          </Button>
        </Hydrated>
      </FormView.Body>
    </FormView>
  )
}
```

## Form Hook Pattern (react-hook-form + yup)

```tsx
// src/modules/{module}/form/use-product-form.ts
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useTranslations } from 'next-intl'

export function useProductForm(existingData?: ApiProduct) {
  const t = useTranslations('validation')

  const schema = useMemo(() => yup.object({
    name: yup.string().required(t('required')),
    price: yup.number().min(0, t('minValue', { min: 0 })).required(t('required')),
  }), [t])

  return useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: existingData?.name ?? '',
      price: existingData?.price ?? 0,
    }
  })
}
```

## Submit Handler Pattern (useOnSubmit)

```tsx
// src/modules/{module}/form/use-on-submit-product.ts
import { useMutation } from '@apollo/client'
import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { isUserInputError, mapApolloFormError } from '@/apollo/helpers'
import { toast } from '@/components/ui/toaster'
import { Logger } from '@/logger'

export function useOnSubmitProduct(control: Control) {
  const t = useTranslations('products')
  const tm = useTranslations('messages')
  const [mutate] = useMutation(SAVE_PRODUCT_MUTATION)

  return useCallback(async (values: FormValues) => {
    try {
      const { data } = await mutate({ variables: values })
      toast.success({ title: tm('success.savedSuccessfully') })
    } catch (err) {
      if (isUserInputError(err)) {
        const formErrors = mapApolloFormError(err)
        if (formErrors) { control._setErrors(formErrors); return }
        toast.error({ title: t(err.message) })
        return
      }
      Logger.error(err)
      toast.error({ title: tm('error.unknownError') })
    }
  }, [mutate, control, t, tm])
}
```

## GraphQL Operations

```tsx
// src/services/nzmly-api/schema/products/products.query.ts
import { gql } from '@apollo/client'
import { PRODUCT_FRAGMENT } from './product.fragment'

export const PRODUCTS_QUERY = gql`
  ${PRODUCT_FRAGMENT}
  query MyProducts($page: Int) {
    myProducts(page: $page) {
      items { ...ProductFragment }
      total
    }
  }
`

// src/services/nzmly-api/schema/products/save-product.mutation.ts
export const SAVE_PRODUCT_MUTATION = gql`
  mutation SaveProduct($id: ID, $name: String!, $price: Float!) {
    saveProduct(id: $id, name: $name, price: $price) {
      id
      name
      price
    }
  }
`
```

## Dialog / Alert Dialog Pattern

```tsx
import { dialog } from '@/components/ui/dialog'
import { AlertDialogContent } from '@/components/ui/alert-dialog'

// Show confirmation dialog
dialog.open(() => (
  <AlertDialogContent
    title={t('confirmDelete')}
    description={t('deleteWarning')}
    onConfirm={async () => {
      await deleteMutation({ variables: { id } })
      dialog.close()
    }}
  />
))
```

## Styling Tokens (Chakra v3)

```tsx
// Semantic background tokens
<Box bg="bg.1">   {/* white */}
<Box bg="bg.2">   {/* light gray */}
<Box bg="bg.3">   {/* light blue */}
<Box bg="bg.4">   {/* light purple */}
<Box bg="bg.5">   {/* semi-transparent white */}

// Responsive (mobile-first)
<Box w={{ base: '100%', md: '50%', lg: '33%' }}>

// RTL-aware
<Box ps={4} pe={2}>  {/* paddingStart, paddingEnd */}
<Input dir="ltr" />   {/* Force LTR for emails, URLs */}
```

## i18n with next-intl

```tsx
import { useTranslations } from 'next-intl'

const t = useTranslations('products')     // Namespace-based
const tm = useTranslations('messages')    // Messages namespace
const tv = useTranslations('validation')  // Validation namespace

// Translation files: messages/ar.json, messages/en.json
// Nested keys: { "products": { "title": "المنتجات" } }
```
