## 2.0.0 (July 27, 2018)

### Features

* `Field` allows an `onBlur` callback through its `props` component properties, which must return a Promise;

### Breaking changes

* `hocForm.options.validate` must return a Promise;
* `hocForm.options.asyncValidate` has been removed. All validation runs now through the `validate` option;
* `hocForm.options.validateOnBlur` have been removed. Blur events are now running through `Field.props.onBlur`.

## 1.2.0 (June 5, 2018)

### Features

* `hocForm` now provides its state to the wrapped form component through a property named `hocFormState`.

## 1.1.0 (June 5, 2018)

### Features

* `hocForm` now accepts a new option: `validateOnBlur`, which allows to run sync validation on blur events. Defaults to `false`.

### Fixes

* Resolved an issue on `multiple renderers concurrently rendering the same context provider`.
