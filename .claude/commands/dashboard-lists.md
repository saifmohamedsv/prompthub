# Dashboard Lists with Actions & Pagination

Reference skill for building paginated list pages in the dashboard using the `TableView` compound component.

## Route Structure

Every list page has two files:

```
src/app/(dashboard)/{feature}/page.tsx          # Server component (metadata + ClientPage)
src/app/(dashboard)/{feature}/client.page.tsx    # Client component (all logic)
```

**`page.tsx`** — minimal server component:

```tsx
import { getTranslations } from 'next-intl/server'
import { ClientPage } from './client.page'

export async function generateMetadata() {
  const t = await getTranslations('featureName')
  return { title: t('index.title') }
}

export default function Page() {
  return <ClientPage />
}
```

---

## TableView Compound Component

Import: `import { TableView } from '@/components/ui/table-view'`

```ts
TableView.Root                  // Flex column, gapY={4}, position="relative"
TableView.Header                // Responsive row for title + actions
TableView.HeaderContent         // Flex column for heading + subtitle
TableView.HeaderActions         // ButtonGroup for action buttons
TableView.HeaderAction          // Subtle sm Button; renders as <Link> if href given
TableView.HeaderActionAdd       // Solid button with LuPlus icon, default label t('addNew')
TableView.HeaderActionShare     // Subtle button with LuSend icon
TableView.HeaderActionPublish   // Toggle publish/unpublish with LuEye/LuEyeOff
TableView.FiltersContainer      // Container with bg="bg.2", responsive layout
TableView.FilterGroup           // Flex with gap={4}, flex={1}
TableView.FilterField           // Horizontal field with maxW="220px"
TableView.Pagination            // URL-based pagination (page, pageSize, count)
TableView.LoadingOverlay        // Absolute overlay with blur + spinner (visible prop)
TableView.NoData                // EmptyState with TbDatabaseX icon
TableView.ErrorState            // Red empty state with retry button (onRetry prop)
TableView.ActionGroup           // Flex with gap={1} for row-level actions
TableView.ActionEdit            // FiEdit3 icon; link if href given
TableView.ActionDelete          // FiTrash2 icon with colorPalette="red"
TableView.ActionCancel          // FiX icon with colorPalette="red"
TableView.ActionButton          // Ghost xs IconButton
TableView.ActionLink            // IconButton rendered as Next.js <Link>
TableView.Switch                // Small toggle switch with check/x thumb
```

---

## TableViewSkeleton

Import: `import { TableViewSkeleton } from '@/components/ui/table-view/skeleton'`

```ts
TableViewSkeleton.Page          // Full page skeleton (PageHead + Table)
TableViewSkeleton.PageHead      // Title + subtitle skeleton
TableViewSkeleton.Table         // Filter + table rows + pagination skeleton
TableViewSkeleton.TableRows     // Just row skeletons (8 rows)
TableViewSkeleton.Filter        // Filter bar skeleton
TableViewSkeleton.Pagination    // Pagination skeleton
```

---

## API Types for Pagination

Import: `import { ApiPaginatedResponse, ApiEdge, ApiPagesPageInfo } from '@/services/nzmly-api'`

```ts
interface ApiPagesPageInfo {
  currentPage: number
  rowsPerPage: number
  pagesCount: number
}

interface ApiEdge<T> {
  node: T
  cursor: string
}

interface ApiPaginatedResponse<T> {
  totalCount: number
  edges: ApiEdge<T>[]
  pageInfo: ApiPagesPageInfo
}

// Response type pattern:
type ApiResMyEntities = Record<'myEntities', ApiPaginatedResponse<ApiEntity> | null>
```

---

## GraphQL Paginated Query Pattern

```ts
import { gql } from '@apollo/client'
import { entityFragment } from './entity.fragment'
import { pagesPageInfoFragment } from '../pagination/pages-page-info.fragment'

export const myEntitiesQuery = gql`
  ${entityFragment}
  ${pagesPageInfoFragment}
  query myEntities($page: Int, $filterKey: String) {
    myEntities(page: $page, filterKey: $filterKey) {
      totalCount
      edges {
        node {
          ...entityFragment
        }
      }
      pageInfo {
        ...pagesPageInfo
      }
    }
  }
`
```

The `pagesPageInfo` fragment is at `@/services/nzmly-api/schema/pagination/pages-page-info.fragment`:

```graphql
fragment pagesPageInfo on PagesPageInfo {
  rowsPerPage
  pagesCount
  currentPage
}
```

---

## The previousData Trick

Every list page uses this pattern for seamless re-fetch without layout shift:

```tsx
const { data, previousData, loading, error, refetch } = useQuery<ApiResMyEntities>(
  myEntitiesQuery, { variables: { page, filterKey: filterParam || undefined } }
)

// While loading new data, show previousData so table stays populated
const result = useMemo(() => (loading ? previousData : data), [loading, data, previousData])
const hasError = !loading && !!error
const ready = !!result && !error
```

Three loading states:
1. **Initial load** (no previousData): `<TableViewSkeleton.Table />` shown via `<Show when={ready} fallback={...}>`
2. **Data loaded**: Table renders normally
3. **Re-fetch** (filter/page change): `<TableView.LoadingOverlay visible={ready && loading} />` blurs table

---

## Pagination Extraction Pattern

```tsx
const edges = result?.myEntities?.edges || []
const totalCount = result?.myEntities?.totalCount || 0
const currentPage = result?.myEntities?.pageInfo.currentPage || 0
const rowsPerPage = result?.myEntities?.pageInfo.rowsPerPage || 0
const count = (currentPage - 1) * rowsPerPage   // offset for row numbering
const showPagination = totalCount > rowsPerPage

// In table body:
<Table.Cell>{i + 1 + count}</Table.Cell>  // Row number with offset

// After table:
<Show when={showPagination}>
  <TableView.Pagination count={totalCount} pageSize={rowsPerPage} page={currentPage} />
</Show>
```

`TableView.Pagination` uses `window.history.pushState` internally to update the `?page=N` URL parameter without full navigation.

---

## useTableViewFilter Hook

Import: `import { useTableViewFilter } from '@/utils/hooks/use-table-view-filter'`

```tsx
interface TableViewFilterOptions {
  defaultValues?: Record<string, string | number | boolean | null | undefined>
  debounceKeys?: string[]    // keys debounced on change (text inputs)
  debounceDelay?: number     // default 300ms
}

const { values, setFilter } = useTableViewFilter(options)
```

- `values` — current filter values from URL search params
- `setFilter(key, value)` — updates URL param; always removes `page` param when any filter changes

**Usage in filters:**

```tsx
const { setFilter } = useTableViewFilter({
  defaultValues: { customerQ: customerQ, status },
  debounceKeys: ['customerQ']  // text search is debounced
})

// Text search filter
<TableView.FilterField label={tl('search')}>
  <Input size="sm" defaultValue={customerQ} onChange={(e) => setFilter('customerQ', e.target.value)} />
</TableView.FilterField>

// Select filter (immediate)
<TableView.FilterField label={tl('status')}>
  <NativeSelectRoot size="sm">
    <NativeSelectField defaultValue={status} onChange={(e) => setFilter('status', e.target.value)}>
      <option value="">{tl('all')}</option>
      <option value="ACTIVE">{t('status.active')}</option>
    </NativeSelectField>
  </NativeSelectRoot>
</TableView.FilterField>
```

---

## Delete Hook Pattern

Location: `src/modules/{feature}/use-delete-{feature}.tsx`

Import: `import { AlertDialogContent } from '@/components/ui/alert-dialog'`
Import: `import { dialog } from '@/components/ui/dialog'`
Import: `import { toast } from '@/components/ui/toaster'`

```tsx
import { memo, useCallback } from 'react'
import { useMutation } from '@apollo/client'
import { useTranslations } from 'next-intl'
import { AlertDialogContent } from '@/components/ui/alert-dialog'
import { dialog } from '@/components/ui/dialog'
import { toast } from '@/components/ui/toaster'
import { Logger } from '@/logger/client'
import { deleteEntityMutation, myEntitiesQuery } from '@/services/nzmly-api'

export function useDeleteEntity() {
  const t = useTranslations('deleteDialog')
  const tm = useTranslations('messages')
  const [deleteMutation] = useMutation(deleteEntityMutation, {
    refetchQueries: [myEntitiesQuery]
  })

  const dialogId = 'delete-entity-dialog'
  const title = t('title')
  const body = t('description')

  const Content = memo(function Content({ onConfirm, loading }: { onConfirm?(): void; loading?: boolean }) {
    return (
      <AlertDialogContent
        confirmLabel={t('actions.delete')}
        onConfirm={onConfirm}
        confirmLoading={loading}
        confirmDisabled={loading}
        title={title}
        body={body}
      />
    )
  })

  const execute = useCallback(async (id: string) => {
    try {
      dialog.update(dialogId, { content: <Content onConfirm={() => execute(id)} loading /> })
      await deleteMutation({ variables: { id } })
      dialog.close(dialogId)
      toast.success({ title: tm('success.deletedSuccessfully') })
    } catch (err) {
      dialog.update(dialogId, { content: <Content onConfirm={() => execute(id)} loading={false} /> })
      Logger.error(err)
      toast.error({ title: tm('error.unknownError') })
    }
  }, [])

  return useCallback(
    (id: string) => dialog.open(dialogId, { content: <Content onConfirm={() => execute(id)} /> }),
    [execute]
  )
}
```

**Usage in table row:**

```tsx
const deleteEntity = useDeleteEntity()

<TableView.ActionGroup>
  <TableView.ActionEdit href={Routes.Entity.Edit(node.id)} />
  <TableView.ActionDelete onClick={() => deleteEntity(node.id)} />
</TableView.ActionGroup>
```

---

## Complete Client Page Template

```tsx
'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@apollo/client'
import { Flex, Heading, Show, Table, Text, Box, Input } from '@chakra-ui/react'
import { NativeSelectField, NativeSelectRoot } from '@/components/ui/native-select'
import { TableView } from '@/components/ui/table-view'
import { TableViewSkeleton } from '@/components/ui/table-view/skeleton'
import { useDashboardLayout } from '@/components/ui/layout'
import { useTableViewFilter } from '@/utils/hooks/use-table-view-filter'
import { Routes } from '@/router/constants'
import { ApiResMyEntities, myEntitiesQuery } from '@/services/nzmly-api'
import { useDeleteEntity } from '@/modules/entities/use-delete-entity'

export const ClientPage = () => {
  const t = useTranslations('entities')
  const tl = useTranslations('label')
  const { setSidebarActiveKey, setBreadcrumb } = useDashboardLayout()

  useEffect(() => {
    setSidebarActiveKey('section.entities')
    setBreadcrumb([{ title: t('index.title') }])
  }, [])

  // 1. Read URL params
  const query = useSearchParams()
  const page = parseInt(query.get('page') || '1')
  const searchQ = query.get('searchQ') || ''
  const status = query.get('status') || ''

  // 2. Query with previousData trick
  const { data, previousData, loading, error, refetch } = useQuery<ApiResMyEntities>(
    myEntitiesQuery,
    { variables: { page, searchQ: searchQ || undefined, status: status || undefined } }
  )

  const result = useMemo(() => (loading ? previousData : data), [loading, data, previousData])
  const hasError = !loading && !!error
  const ready = !!result && !error

  // 3. Extract pagination
  const edges = result?.myEntities?.edges || []
  const totalCount = result?.myEntities?.totalCount || 0
  const currentPage = result?.myEntities?.pageInfo.currentPage || 0
  const rowsPerPage = result?.myEntities?.pageInfo.rowsPerPage || 0
  const count = (currentPage - 1) * rowsPerPage
  const showPagination = totalCount > rowsPerPage

  // 4. Filters
  const { setFilter } = useTableViewFilter({
    defaultValues: { searchQ, status },
    debounceKeys: ['searchQ']
  })

  // 5. Delete hook
  const deleteEntity = useDeleteEntity()

  return (
    <TableView.Root>
      <TableView.Header>
        <TableView.HeaderContent>
          <Heading variant="table-view.title">{t('index.title')}</Heading>
          <Text variant="table-view.subtitle">
            <Show when={ready} fallback="...">
              {t('index.description', { count: totalCount })}
            </Show>
          </Text>
        </TableView.HeaderContent>
        <TableView.HeaderActions>
          <TableView.HeaderActionAdd href={Routes.Entity.Add} />
        </TableView.HeaderActions>
      </TableView.Header>

      <Flex flexDirection="column" gap={8} position="relative">
        <Show when={!hasError} fallback={<TableView.ErrorState onRetry={() => refetch()} />}>
          <Show when={ready} fallback={<TableViewSkeleton.Table />}>
            <Flex flexDirection="column" gap={4} position="relative">
              {/* Filters */}
              <TableView.FiltersContainer>
                <TableView.FilterGroup>
                  <TableView.FilterField label={tl('search')}>
                    <Input size="sm" defaultValue={searchQ} onChange={(e) => setFilter('searchQ', e.target.value)} />
                  </TableView.FilterField>
                  <TableView.FilterField label={tl('status')}>
                    <NativeSelectRoot size="sm">
                      <NativeSelectField defaultValue={status} onChange={(e) => setFilter('status', e.target.value)}>
                        <option value="">{tl('all')}</option>
                        <option value="ACTIVE">{t('status.active')}</option>
                        <option value="INACTIVE">{t('status.inactive')}</option>
                      </NativeSelectField>
                    </NativeSelectRoot>
                  </TableView.FilterField>
                </TableView.FilterGroup>
                <Box />
              </TableView.FiltersContainer>

              {/* Table */}
              <Table.ScrollArea>
                <Table.Root interactive>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader w="12">#</Table.ColumnHeader>
                      <Table.ColumnHeader>{tl('name')}</Table.ColumnHeader>
                      <Table.ColumnHeader>{tl('status')}</Table.ColumnHeader>
                      <Table.ColumnHeader w="12">{tl('actions')}</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {edges.map(({ node }, i) => (
                      <Table.Row key={node.id}>
                        <Table.Cell>{i + 1 + count}</Table.Cell>
                        <Table.Cell>{node.name}</Table.Cell>
                        <Table.Cell>{node.status}</Table.Cell>
                        <Table.Cell>
                          <TableView.ActionGroup>
                            <TableView.ActionEdit href={Routes.Entity.Edit(node.id)} />
                            <TableView.ActionDelete onClick={() => deleteEntity(node.id)} />
                          </TableView.ActionGroup>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Table.ScrollArea>
            </Flex>
          </Show>

          <Show when={showPagination}>
            <TableView.Pagination count={totalCount} pageSize={rowsPerPage} page={currentPage} />
          </Show>
        </Show>

        <TableView.LoadingOverlay visible={ready && loading} message={tl('loading')} />
      </Flex>
    </TableView.Root>
  )
}
```

---

## Key Import Paths

| What | Import |
|------|--------|
| TableView | `@/components/ui/table-view` |
| TableViewSkeleton | `@/components/ui/table-view/skeleton` |
| useTableViewFilter | `@/utils/hooks/use-table-view-filter` |
| AlertDialogContent | `@/components/ui/alert-dialog` |
| dialog (overlay manager) | `@/components/ui/dialog` |
| toast | `@/components/ui/toaster` |
| Routes | `@/router/constants` |
| useDashboardLayout | `@/components/ui/layout` |
| API types | `@/services/nzmly-api` |
| Logger | `@/logger/client` |
| NativeSelectRoot/Field | `@/components/ui/native-select` |

## Real Examples in Codebase

| Page | Path |
|------|------|
| Orders | `src/app/(dashboard)/orders/client.page.tsx` |
| Promo Codes | `src/app/(dashboard)/promo-code/client.page.tsx` |
| Products | `src/app/(dashboard)/products/list.client.page.tsx` |
| Customers | `src/app/(dashboard)/customers/client.page.tsx` |
| Payment Transactions | `src/app/(dashboard)/payments/client.page.tsx` |
