# React Confirmation Box

**React Confirmation Box** is a lightweight utility that lets you show a confirmation dialog **and await the user’s decision** before continuing.

Instead of managing dialog state, callbacks, or context everywhere, you simply call an async function:

```ts
const confirmed = await promptConfirmation();
```

Perfect for destructive actions, critical flows, or anywhere you’d normally stop and ask *“Are you sure?”*.

## 🚀 Getting Started

Start by installing the package via your preferred package manager:

```sh
npm install react-confirmation-box
```

or, if using pnpm:

```sh
pnpm add react-confirmation-box
```

## ☕ 60-Second TL;DR

Mount the provider once (usually at the root of your app):

```tsx
import { ConfirmationProvider } from "react-confirmation-box";

export function App() {
  return (
    <>
      {/* your app */}
      <ConfirmationProvider />
    </>
  );
}
```

Use it anywhere:

```tsx
import { promptConfirmation } from "react-confirmation-box";

async function deleteItem() {
  const confirmed = await promptConfirmation();

  if (!confirmed) return;

  console.log("Item deleted");
}
```

That’s it.

## Usage

### Basic confirmation

```ts
const confirmed = await promptConfirmation();

if (confirmed) {
  // proceed
}
```

### With custom text and behavior

```ts
await promptConfirmation({
  title: "Delete item",
  description: "This action cannot be undone.",
  confirmText: "Delete",
  cancelText: "Cancel",
  variant: "warning",
});
```

### Using `.then()` instead of `await`

```ts
promptConfirmation().then((confirmed) => {
  if (confirmed) {
    console.log("Confirmed");
  }
});
```

### Nested confirmations

Confirmations can be chained or nested naturally:

```ts
await promptConfirmation({
  onConfirm: () =>
    promptConfirmation().then((confirmed) => {
      if (confirmed) {
        console.log("Second confirmation accepted");
      }
    }),
});
```

## Custom Dialog Component

By default, the package ships with a simple dialog implementation.

You can provide **your own confirmation UI** by passing a custom component to the provider:

```tsx
<ConfirmationProvider Component={MyCustomDialog} />
```

Your component will receive all required props (`open`, `onConfirm`, `onCancel`, etc.) and full control over rendering.

---

## API Reference

### `promptConfirmation(options?)`

Triggers a confirmation dialog and returns a promise that resolves with the user’s choice.

**Parameters**

| Name      | Type                | Description                   |
|-----------|---------------------|-------------------------------|
| `options` | `ConfirmationProps` | Optional dialog configuration |

**Returns**

* `Promise<boolean>`

  * `true` → user confirmed
  * `false` → user cancelled

**Example**

```ts
const confirmed = await promptConfirmation();

if (confirmed) {
  doSomething();
}
```

---

### `<ConfirmationProvider />`

Responsible for rendering confirmation dialogs.

⚠️ **Must be mounted once** in your application.

**Props**

| Name        | Type                                             | Description                          |
|-------------|--------------------------------------------------|--------------------------------------|
| `Component` | `React.FC<ConfirmationDialogProps>` *(optional)* | Custom confirmation dialog component |

**ConfirmationDialogProps**
```typescript
type ConfirmationDialogProps = {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  warning: boolean,
  title: string,
  description: string,
  onCancel: () => void,
  cancelText: string,
  onConfirm: () => void,
  confirmText: string
}
```

---

## FAQ

**Why not a hook?**
Because confirmations are often triggered from services, handlers, or business logic — not just components.

**Can multiple confirmations be shown at once?**
Yes. Confirmations are stacked by default.

**Is this safe with React Strict Mode?**
Yes. The internal store is compatible with modern React patterns.

---

## Issues

If you encounter any issue, please open an issue [here](https://github.com/HichemTab-tech/react-confirmation-box/issues).

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) file for more details.

&copy; 2025 [Hichem Taboukouyout](mailto:hichem.taboukouyout@hichemtab-tech.me)

---

_If you found this package helpful, consider leaving a star! ⭐️_
