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

Mount the provider once per confirmation scope (usually at the root of your app):

```tsx
import { ConfirmationProvider } from "react-confirmation-box";
import "react-confirmation-box/style.css"; // you don't need to import the css if you provide you're own component, check #custom-dialog-component

export function App() {
  return (
    <>
      {/* your app */}
      <ConfirmationProvider />
    </>
  );
}
```

Need more than one isolated confirmation zone (micro-frontends, portals, modals living outside the root tree, etc.)? Give each provider a unique `name` and pass that same name to `promptConfirmation`. If you would rather not wire names manually, the new `createConfirmation` helper (documented below) can spin up a scoped provider/prompt pair for you.

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

### Targeting a specific provider instance

If you render more than one provider, pass the `name` prop to keep each confirmation stream isolated. Use the same `name` when calling `promptConfirmation`.

```tsx
<ConfirmationProvider name="admin" />
<ConfirmationProvider name="customer" />

async function deleteAsAdmin() {
  const confirmed = await promptConfirmation({ title: "Delete admin record" }, "admin");
  if (confirmed) {
    // ...
  }
}
```

### Using `createConfirmation` for scoped flows

`createConfirmation` bundles a unique provider and a matching `promptConfirmation` function. This is handy for components that should manage their own confirmation scope without worrying about global names.

```tsx
import { createConfirmation } from "react-confirmation-box";
import { CustomDialog } from "./CustomDialog";

const {
  ConfirmationProvider: CommentConfirmationProvider,
  promptConfirmation: promptCommentConfirmation,
} = createConfirmation(
  { title: "Delete comment" },
  CustomDialog
);

function CommentsModule() {
  return (
    <>
      {/* module code */}
      <CommentConfirmationProvider />
    </>
  );
}

async function deleteComment() {
  const confirmed = await promptCommentConfirmation();
  if (confirmed) {
    // delete comment
  }
}
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

### `promptConfirmation(options?, name?)`

Triggers a confirmation dialog and returns a promise that resolves with the user’s choice.

**Parameters**

| Name      | Type                | Description                                                             |
|-----------|---------------------|-------------------------------------------------------------------------|
| `options` | `ConfirmationProps` | Optional dialog configuration                                           |
| `name`    | `string`            | The confirmation scope to target. Defaults to `"default"` when omitted. |

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

| Name        | Type                                             | Description                                                                  |
|-------------|--------------------------------------------------|------------------------------------------------------------------------------|
| `Component` | `React.FC<ConfirmationDialogProps>` *(optional)* | Custom confirmation dialog component                                         |
| `name`      | `string`                                         | Scope identifier. Use unique names when you need multiple providers at once. |
### `createConfirmation(baseOptions?, Component?)`

Creates a scoped confirmation helper consisting of a dedicated provider component and a `promptConfirmation` function that automatically targets that provider’s internal `name`.

**Parameters**

| Name           | Type                                             | Description                                                         |
|----------------|--------------------------------------------------|---------------------------------------------------------------------|
| `baseOptions`  | `ConfirmationProps`                              | Defaults that apply to every confirmation created by the helper.    |
| `Component`    | `React.FC<ConfirmationDialogProps>` *(optional)* | Custom dialog component to render for that scoped provider.         |

**Returns**

- `ConfirmationProvider`: mount this inside the scope that needs confirmations.
- `promptConfirmation`: call this to show a dialog wired to that provider.

**Example**

```ts
const { ConfirmationProvider, promptConfirmation } = createConfirmation();

function Feature() {
  return (
    <ConfirmationProvider>
      {/* feature tree */}
    </ConfirmationProvider>
  );
}
```

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
