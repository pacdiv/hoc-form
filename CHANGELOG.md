## 1.2.0 (June 5, 2018)

### Features

* `HocForm` now provides its state to the wrapped form component through a property named `hocFormState`.

## 1.1.0 (June 5, 2018)

### Features

* `HocForm` now accepts a new option: `validateOnBlur`, which allows to run sync validation on blur events. Defaults to `false`.

### Fixes

* Resolved an issue on `multiple renderers concurrently rendering the same context provider`.
