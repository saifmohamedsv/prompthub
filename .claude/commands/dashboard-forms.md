# Dashboard Forms With & Without Tabs

Reference skill for building forms in the dashboard using `FormView` compound component, `react-hook-form`, and `yup`.

## FormView Compound Component

Import: `import { FormView } from '@/components/ui/form-view'`

```ts
FormView.Root                  // CardRoot variant="subtle" bg="transparent"
FormView.Header                // CardHeader px={0}
FormView.Body                  // CardBody px={0} py={4}
FormView.TabsRoot              // TabsRoot variant="line", props: linkable?, availableTabs?
FormView.TabsList              // TabsList overflowX="auto"
FormView.TabsTrigger           // TabsTrigger px={0} flexShrink={0}
FormView.TabsContent           // Re-export of Chakra TabsContent
FormView.FormCardRoot          // CardRoot variant="subtle" bg="bg.2"
FormView.FormCardBody          // CardBody gap={6}
FormView.FormCardSectionTitle  // Separator + Heading (props: title, noSeparator?)
FormView.FormCardFooter        // CardFooter prefixed with Separator
FormView.FooterAction          // Subtle sm Button; renders as Link if href given
FormView.FooterActionSave      // Solid button with IoSaveOutline icon
FormView.FooterActionBack      // Button with IoArrowBack icon (RTL-flipped)
```

**Skeleton:** `import { FormViewSkeleton } from '@/components/ui/form-view/skeleton'`
- `FormViewSkeleton.Page` — FormCardRoot with SkeletonText placeholders

---

## Non-Tabbed Form Pattern

Structure: `FormView.Root > FormView.Header > FormView.Body > FormComponent`

The form component wraps everything in a single `<form onSubmit>`:

```tsx
import { FormView } from '@/components/ui/form-view'
import { TextInputField } from '@/components/ui/form'
import { Hydrated } from '@/components/ui/hydrated'

export const EntityForm = ({ entity }: { entity?: ApiEntity }) => {
  const t = useTranslations('entities')
  const { register, onSubmit, formState: { errors, isSubmitting, isDirty } } = useEntityForm(entity)

  return (
    <form onSubmit={onSubmit}>
      <FormView.FormCardRoot>
        <FormView.FormCardBody>
          <TextInputField
            label={t('form.name.label')}
            {...register('name')}
            error={errors.name?.message}
            required
          />
          <TextInputField
            label={t('form.email.label')}
            type="email"
            dir="ltr"
            {...register('email')}
            error={errors.email?.message}
            required
          />
        </FormView.FormCardBody>
        <FormView.FormCardFooter>
          <Hydrated>
            {(hydrated) => (
              <FormView.FooterActionSave
                disabled={!hydrated || isSubmitting || !isDirty}
                loading={isSubmitting}
                type="submit"
              />
            )}
          </Hydrated>
          <FormView.FooterActionBack href={Routes.Entity.Index()} />
        </FormView.FormCardFooter>
      </FormView.FormCardRoot>
    </form>
  )
}
```

**Page that hosts the form:**

```tsx
'use client'

export const ClientPage = ({ id }: { id: string }) => {
  const t = useTranslations('entities')
  const { data, loading } = useQuery<ApiResMyEntity>(myEntityQuery, { variables: { id } })

  return (
    <FormView.Root>
      <FormView.Header>
        <Heading variant="table-view.title">{t('edit.title')}</Heading>
        <Text variant="table-view.subtitle">{t('edit.description')}</Text>
      </FormView.Header>
      <FormView.Body>
        <Show when={!loading} fallback={<FormViewSkeleton.Page />}>
          <EntityForm entity={data?.myEntity} />
        </Show>
      </FormView.Body>
    </FormView.Root>
  )
}
```

---

## Tabbed Form Pattern

Each tab has its **own independent form** with its own hook, validation, and save button. Tabs do NOT share state.

```tsx
<FormView.Root>
  <FormView.Header>
    <Heading variant="table-view.title">{t('edit.title')}</Heading>
  </FormView.Header>
  <FormView.Body>
    <FormView.TabsRoot defaultValue="info" lazyMount>
      <FormView.TabsList>
        <FormView.TabsTrigger value="info">{t('edit.tabs.info')}</FormView.TabsTrigger>
        <FormView.TabsTrigger value="settings">{t('edit.tabs.settings')}</FormView.TabsTrigger>
        <FormView.TabsTrigger value="appearance">{t('edit.tabs.appearance')}</FormView.TabsTrigger>
      </FormView.TabsList>

      <FormView.TabsContent value="info">
        <BasicInfoForm entity={entity} />      {/* Own <form>, own hook */}
      </FormView.TabsContent>
      <FormView.TabsContent value="settings">
        <SettingsForm entity={entity} />        {/* Own <form>, own hook */}
      </FormView.TabsContent>
      <FormView.TabsContent value="appearance">
        <AppearanceForm entity={entity} />      {/* Own <form>, own hook */}
      </FormView.TabsContent>
    </FormView.TabsRoot>
  </FormView.Body>
</FormView.Root>
```

### `linkable` Prop (URL hash sync)

When `linkable` is true, the active tab syncs with `window.location.hash`. Triggers must use `asChild` with `<Link>`:

```tsx
<FormView.TabsRoot linkable availableTabs={['settings', 'playground']} lazyMount>
  <FormView.TabsList>
    <FormView.TabsTrigger value="settings" asChild>
      <Link unstyled href="#settings">{t('tabs.settings')}</Link>
    </FormView.TabsTrigger>
    <FormView.TabsTrigger value="playground" asChild>
      <Link unstyled href="#playground">{t('tabs.playground')}</Link>
    </FormView.TabsTrigger>
  </FormView.TabsList>
  <FormView.TabsContent value="settings">...</FormView.TabsContent>
  <FormView.TabsContent value="playground">...</FormView.TabsContent>
</FormView.TabsRoot>
```

### `lazyMount` Prop

Standard Chakra Tabs prop. Tab content only mounts when first activated. Used on all product edit pages and linkable tabs.

---

## Three-Part Hook System

All form hooks live in `src/modules/{feature}/` and follow this pattern:

### Part 1: `use{Feature}FormValidationSchema()`

Returns a yup schema. Uses `useTranslations('validation')` for error messages.

```tsx
const useEntityFormValidationSchema = () => {
  const tv = useTranslations('validation')
  return yup.object({
    name: yup.string().trim().required(tv('required')).max(255, tv('tooLong', { max: 255 })),
    email: yup.string().trim().required(tv('required')).email(tv('invalidEmail')),
    phone: yup.string().trim()
      .transform((v) => v?.replace(/\s/g, ''))
      .required(tv('required'))
      .matches(GLOBAL_PHONE_REGEX, tv('invalidPhone')),
  })
}

type EntityFormValues = yup.InferType<ReturnType<typeof useEntityFormValidationSchema>>
```

### Part 2: `useOnSubmit{Feature}(control, existingEntity?)`

Receives `Control<FormValues>` and optional entity for edit mode. Returns an async callback.

```tsx
import { Control } from 'react-hook-form'
import { isUserInputError } from '@/apollo/helpers'
import { useMapApolloFormErrors } from '@/apollo/hooks'
import { toast } from '@/components/ui/toaster'
import { Logger } from '@/logger/client'

export const useOnSubmitEntity = (control: Control<EntityFormValues>, entity?: ApiEntity) => {
  const t = useTranslations()
  const tm = useTranslations('messages')
  const mapApolloFormErrors = useMapApolloFormErrors()
  const router = useRouter()

  const [mutate] = useMutation(entity ? updateEntityMutation : createEntityMutation, {
    refetchQueries: [myEntitiesQuery],
    update: (cache) => { cache.evict({ fieldName: 'myEntities' }); cache.gc() }
  })

  return useCallback(async (values: EntityFormValues) => {
    control._setErrors({})
    try {
      await mutate({ variables: { id: entity?.id, ...values } })
      control._reset(values)
      toast.success({ title: tm('success.savedSuccessfully') })
      router.push(Routes.Entity.Index())
    } catch (err) {
      control.setError('root.status', {})

      if (isUserInputError(err)) {
        const formErrors = mapApolloFormErrors(err)
        if (formErrors) {
          toast.error({ title: tm('error.validationFailed') })
          control._setErrors(formErrors)
          return
        }
        toast.error({ title: t(err.message) })
        return
      }

      toast.error({ title: tm('error.unknownError') })
      Logger.error(err)
    }
  }, [entity?.id, router])
}
```

### Part 3: `use{Feature}Form(existingEntity?)`

Combines schema + useForm + reset + submit handler.

```tsx
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

export const useEntityForm = (entity?: ApiEntity) => {
  const validationSchema = useEntityFormValidationSchema()
  const formMethods = useForm<EntityFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: entity?.name || '',
      email: entity?.email || '',
    }
  })

  // Reset form when entity data loads (edit mode)
  useEffect(() => {
    if (entity) {
      formMethods.reset({
        name: entity.name || '',
        email: entity.email || '',
      })
    }
  }, [entity])

  const onSubmit = useOnSubmitEntity(formMethods.control, entity)

  return {
    ...formMethods,
    onSubmit: formMethods.handleSubmit(onSubmit),
  }
}
```

---

## Field Components

Import: `import { TextInputField, TextareaField, SelectField, SwitchField, ... } from '@/components/ui/form'`

### Simple fields (use `register()`)

```tsx
// Text input
<TextInputField label={t('name')} {...register('name')} error={errors.name?.message} required />

// With inputWidth (default 'lg', options: xs, sm, md, lg, xl, full)
<TextInputField label={t('url')} {...register('url')} inputWidth="xl" />

// With input group (end/start elements)
<TextInputField label={t('price')} {...register('price')} inputGroupProps={{ endElement: 'SAR' }} />

// Number with transform
<TextInputField type="number" {...register('maxUsage', { setValueAs: toNumberOrUndefined })} />

// With uppercase transform
<TextInputField {...register('code', { setValueAs: (v) => v.toUpperCase().trim() })} />

// Textarea
<TextareaField label={t('bio')} {...register('bio')} error={errors.bio?.message} inputWidth="xl" />
```

### Complex fields (use `Controller`)

```tsx
import { Controller } from 'react-hook-form'

// SwitchField
<Controller name="isActive" control={control} render={({ field }) => (
  <SwitchField
    label={t('isActive')}
    checked={field.value}
    onCheckedChange={({ checked }) => field.onChange(checked)}
    error={errors.isActive?.message}
  />
)} />

// SelectField (value must be array, extracts single value)
<Controller name="category" control={control} render={({ field }) => (
  <SelectField
    label={t('category')}
    options={categoryOptions}
    value={field.value ? [field.value] : []}
    onValueChange={({ value }) => field.onChange(value?.[0] || '')}
    error={errors.category?.message}
    placeholder={t('selectCategory')}
  />
)} />

// RadioOptionsField
<Controller name="type" control={control} render={({ field }) => (
  <RadioOptionsField
    label={t('type')}
    options={typeOptions}
    value={field.value}
    onValueChange={({ value }) => field.onChange(value)}
    error={errors.type?.message}
  />
)} />

// PhoneInputField (uses custom onPhoneChange)
<Controller name="phone" control={control} render={({ field: { value } }) => (
  <PhoneInputField
    label={t('phone')}
    defaultCountry={defaultClientCountry}
    error={errors.phone?.message}
    onPhoneChange={onPhoneChange}
    value={value}
  />
)} />

// DatePickerField
<Controller name="startDate" control={control} render={({ field }) => (
  <DatePickerField
    label={t('startDate')}
    value={field.value}
    onChange={(date) => field.onChange(date)}
    error={errors.startDate?.message}
  />
)} />

// RichEditorField (uses editorRef + setValue)
<Controller name="content" control={control} shouldUnregister={false} render={() => (
  <RichEditorField
    label={t('content')}
    editorRef={editorRef}
    defaultValue={entity?.content}
    onChange={(json) => setValue('content', json, { shouldDirty: true })}
    error={errors.content?.message}
  />
)} />
```

### Field Component Quick Reference

| Component | register/Controller | Key value pattern |
|-----------|-------------------|-------------------|
| `TextInputField` | `register()` | Standard string |
| `TextareaField` | `register()` | Standard string |
| `SelectField` | `Controller` | `value={[val]}` / `onValueChange={({value}) => onChange(value[0])}` |
| `SwitchField` | `Controller` | `checked={val}` / `onCheckedChange={({checked}) => onChange(checked)}` |
| `RadioOptionsField` | `Controller` | `value={val}` / `onValueChange={({value}) => onChange(value)}` |
| `CheckboxField` | `Controller` | `checked={val}` / `onCheckedChange={({checked}) => onChange(checked)}` |
| `PhoneInputField` | `Controller` | `value={val}` / `onPhoneChange` callback |
| `DatePickerField` | `Controller` | `value={date}` / `onChange={date => onChange(date)}` |
| `RichEditorField` | `Controller` | `editorRef` + `setValue()` / `shouldUnregister={false}` |
| `PinInputField` | `Controller` | Standard pin input |

---

## Hydrated Component

Import: `import { Hydrated } from '@/components/ui/hydrated'`

Prevents SSR hydration mismatch on the `disabled` prop. Used on every save button:

```tsx
<Hydrated>
  {(hydrated) => (
    <FormView.FooterActionSave
      disabled={!hydrated || isSubmitting || !isDirty}
      loading={isSubmitting}
      type="submit"
    />
  )}
</Hydrated>
```

---

## ImageUpload Compound Component

Import: `import { ImageUpload } from '@/components/ui/image-upload'`

```ts
ImageUpload.Root                // FileUpload root with upload logic
ImageUpload.UploadingIndicator  // Loading spinner overlay
ImageUpload.PreviewRoot         // Container for preview
ImageUpload.PreviewContainer    // Aspect ratio container
ImageUpload.PreviewImage        // Image preview
ImageUpload.EditButton          // Edit/change button overlay
ImageUpload.HelperText          // Helper text below
ImageUpload.ErrorText           // Error text below
```

**Usage with react-hook-form:**

```tsx
<FormField label={t('form.cover.label')} error={errors.cover?.message}>
  <ImageUpload.Root
    gap={2}
    minUploadedImageWidth={1600}
    minUploadedImageHeight={900}
    tag="entity-cover"
    maxFileSize={50 * 1024 * 1024}
    onUploadSucceeded={(upload) => {
      if (upload?.id) setValue('cover', upload.id, { shouldDirty: true, shouldValidate: true })
    }}
  >
    {({ loading, error, src }) => (
      <>
        <ImageUpload.PreviewRoot w="auto">
          <ImageUpload.PreviewContainer aspectRatio="16/9" maxH={32} minH={{ base: 24, md: 32 }}>
            <ImageUpload.PreviewImage src={src || existingCoverSrc} />
            <ImageUpload.UploadingIndicator show={loading} />
            <ImageUpload.EditButton disabled={loading} />
          </ImageUpload.PreviewContainer>
        </ImageUpload.PreviewRoot>
        <ImageUpload.HelperText>{t('form.cover.description')}</ImageUpload.HelperText>
        <Show when={!!error}>
          <ImageUpload.ErrorText>{error}</ImageUpload.ErrorText>
        </Show>
      </>
    )}
  </ImageUpload.Root>
</FormField>
```

---

## Error Handling

### `isUserInputError`

Import: `import { isUserInputError } from '@/apollo/helpers'`

Checks if an ApolloError has `BAD_USER_INPUT` or `BAD_REQUEST` extension code.

### `useMapApolloFormErrors`

Import: `import { useMapApolloFormErrors } from '@/apollo/hooks'`

Extracts field-level validation errors from Apollo errors and maps them to react-hook-form `FieldErrors`.

### Standard error flow in submit hooks

```
1. control._setErrors({})                    // Clear previous errors
2. try { await mutate(...) }
3. catch (err) {
4.   control.setError('root.status', {})     // Mark form as having error
5.   if (isUserInputError(err)) {
6.     formErrors = mapApolloFormErrors(err)
7.     if (formErrors) → toast + control._setErrors(formErrors)  // Field-level errors
8.     else → toast with err.message                              // General user error
9.   }
10.  else → toast('unknownError') + Logger.error(err)             // System error
11. }
```

---

## i18n Namespaces

| Namespace | Usage |
|-----------|-------|
| Domain-specific (e.g., `'entities'`) | Form labels, page titles, descriptions |
| `'validation'` | Required, tooLong, invalidEmail, invalidPhone |
| `'messages'` | success.savedSuccessfully, error.unknownError, error.validationFailed |
| `'label'` | Common labels: save, back, actions, loading |

---

## Key Import Paths

| What | Import |
|------|--------|
| FormView | `@/components/ui/form-view` |
| FormViewSkeleton | `@/components/ui/form-view/skeleton` |
| Field components | `@/components/ui/form` |
| Hydrated | `@/components/ui/hydrated` |
| ImageUpload | `@/components/ui/image-upload` |
| isUserInputError | `@/apollo/helpers` |
| useMapApolloFormErrors | `@/apollo/hooks` |
| toast | `@/components/ui/toaster` |
| Logger | `@/logger/client` |
| Routes | `@/router/constants` |
| yup | `yup` |
| useForm, Controller | `react-hook-form` |
| yupResolver | `@hookform/resolvers/yup` |

## Real Examples in Codebase

| Form | Path |
|------|------|
| Password (simple) | `src/modules/account/password/password.form.tsx` |
| Customer (Controller) | `src/modules/customers/customer.form.tsx` |
| Review (Select, Switch) | `src/modules/reviews/review.form.tsx` |
| Digital Product (tabbed) | `src/app/(dashboard)/products/[id]/digital-product-client.page.tsx` |
| Personal Link (tabbed) | `src/app/(dashboard)/personal-link/client.page.tsx` |
| Webhooks (linkable tabs) | `src/app/(dashboard)/developers/webhooks/client.page.tsx` |
| Promo Code (complex) | `src/modules/promo-code/use-promo-code-form.ts` |
