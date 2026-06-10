# Components Documentation

## app/avatar.vue

**Path:** `app/components/app/avatar.vue`

### Props
No props defined.

---

## app/footer.vue

**Path:** `app/components/app/footer.vue`

### Props
No props defined.

---

## app/greeting.vue

**Path:** `app/components/app/greeting.vue`

### Props
```typescript
defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
})
```

---

## app/hideShowCurrency.vue

**Path:** `app/components/app/hideShowCurrency.vue`

### Props
No props defined.

---

## app/loader.vue

**Path:** `app/components/app/loader.vue`

### Props
```typescript
defineProps<{
  title?: string;
}>
```

---

## app/menu.vue

**Path:** `app/components/app/menu.vue`

### Props
No props defined.

---

## app/navTitle.vue

**Path:** `app/components/app/navTitle.vue`

### Props
```typescript
defineProps({
  title: {
    type: String,
    default: "Page Title",
  },
  icon: {
    type: String,
    default: "solar:alt-arrow-left-line-duotone",
  },
})
```

---

## app/privacy.vue

**Path:** `app/components/app/privacy.vue`

### Props
```typescript
defineProps({
  size: {
    type: String as () => "sm" | "md" | "lg",
    default: "lg",
  },
  color: {
    type: String as () => "white" | "primary",
    default: "white",
  },
})
```

---

## app/titlePage.vue

**Path:** `app/components/app/titlePage.vue`

### Props
No props defined.

---

## app/topbar.vue

**Path:** `app/components/app/topbar.vue`

### Props
No props defined.

---

## app/Upload.vue

**Path:** `app/components/app/Upload.vue`

### Props
```typescript
defineProps<{
  title: string;
}>
```

---

## category/display.vue

**Path:** `app/components/category/display.vue`

### Props
```typescript
defineProps({
  selectedCategory: {
    type: Object as () => iCategory,
    default: () => ({})
```

---

## MobileOnly.vue

**Path:** `app/components/MobileOnly.vue`

### Props
No props defined.

---

## money-tracker/Budget.vue

**Path:** `app/components/money-tracker/Budget.vue`

### Props
```typescript
defineProps<{
    isLoading?: boolean;
    budget?: number;
    expenses?: number;
    resetDate?: string;
    isOpen?: boolean;
  }>
```

---

## money-tracker/BudgetChangeModal.vue

**Path:** `app/components/money-tracker/BudgetChangeModal.vue`

### Props
```typescript
defineProps<{
  isOpen?: boolean;
}>
```

---

## money-tracker/create.vue

**Path:** `app/components/money-tracker/create.vue`

### Props
```typescript
defineProps<{
    isOpen?: boolean;
  }>
```

---

## money-tracker/form.vue

**Path:** `app/components/money-tracker/form.vue`

### Props
No props defined.

---

## money-tracker/FormImage.vue

**Path:** `app/components/money-tracker/FormImage.vue`

### Props
No props defined.

---

## profile/Form.vue

**Path:** `app/components/profile/Form.vue`

### Props
No props defined.

---

## SummaryCard.vue

**Path:** `app/components/SummaryCard.vue`

### Props
No props defined.

---

## transactions/all.vue

**Path:** `app/components/transactions/all.vue`

### Props
No props defined.

---

## transactions/amount.vue

**Path:** `app/components/transactions/amount.vue`

### Props
```typescript
defineProps<{
    isExpenses?: boolean;
}>
```

---

## transactions/charts.vue

**Path:** `app/components/transactions/charts.vue`

### Props
```typescript
defineProps<{
  sources?: any;
}>
```

---

## transactions/filter.vue

**Path:** `app/components/transactions/filter.vue`

### Props
No props defined.

---

## transactions/income.vue

**Path:** `app/components/transactions/income.vue`

### Props
No props defined.

---

## transactions/Item.vue

**Path:** `app/components/transactions/Item.vue`

### Props
No props defined.

---

## transactions/List.vue

**Path:** `app/components/transactions/List.vue`

### Props
No props defined.

---

## transactions/outcome.vue

**Path:** `app/components/transactions/outcome.vue`

### Props
No props defined.

---

## transactions/tab.vue

**Path:** `app/components/transactions/tab.vue`

### Props
```typescript
defineProps<{
  source: iGroupedTransaction[];
  isAll?: boolean;
  incomes?: iGroupedTransaction[];
  expenses?: iGroupedTransaction[];
}>
```

---

## transactions/Title.vue

**Path:** `app/components/transactions/Title.vue`

### Props
No props defined.

---

## wallet/Action.vue

**Path:** `app/components/wallet/Action.vue`

### Props
No props defined.

---

## wallet/Edit.vue

**Path:** `app/components/wallet/Edit.vue`

### Props
No props defined.

---

## wallet/Form.vue

**Path:** `app/components/wallet/Form.vue`

### Props
```typescript
defineProps<{
    name?: string;
    amount?: number;
    type?: "create" | "update";
  }>
```

---

## wallet/Item.vue

**Path:** `app/components/wallet/Item.vue`

### Props
```typescript
defineProps<{
  list: iWallets[];
}>
```

---

## wallet/List.vue

**Path:** `app/components/wallet/List.vue`

### Props
```typescript
defineProps({
  isPages: {
    type: Boolean,
    required: false,
    default: false,
  },
  isLoading: {
    type: Boolean,
    required: false,
    default: false,
  },
})
```

---

## wallet/Move.vue

**Path:** `app/components/wallet/Move.vue`

### Props
No props defined.

---

