import { Controller, useFormContext } from "react-hook-form";
import styles from "./FormInput.module.scss";

const getNestedError = (name, errors) =>
  name.split(/[.[\]]+/).reduce((acc, key) => acc?.[key], errors);

const FormInput = ({
  name,
  formLabel,
  formLabelAction,
  label,
  validate,
  renderInput,
  helperText,
  ...props
}) => {
  const { control, getValues } = useFormContext();

  const render = (p) => {
    const error = getNestedError(name, p.formState.errors);
    const hasError = Boolean(error);
    const showAsterisk = !!validate;
    const labelWithAsterisk = label ? (
      <>
        {label}
        {showAsterisk && <span className={styles.asterisk}>*</span>}
      </>
    ) : undefined;

    if (renderInput) {
      return renderInput({ ...p, error: error?.message, required: !!validate });
    }

    return (
      <div className={styles.wrapper}>
        {formLabel && (
          <div className={styles.labelHeader}>
            <label htmlFor={name} className={styles.formLabel}>
              {formLabel}
            </label>
            {formLabelAction && <div>{formLabelAction}</div>}
          </div>
        )}
        <input
          {...props}
          {...p.field}
          id={name}
          className={`${styles.input} ${hasError ? styles.inputError : ""}`}
          placeholder={props.placeholder}
        />
        {labelWithAsterisk && !formLabel && (
          <label htmlFor={name} className={styles.inputLabel}>
            {labelWithAsterisk}
          </label>
        )}
        {hasError && <p className={styles.errorMessage}>{error?.message}</p>}
        {!hasError && helperText && (
          <p className={styles.helperText}>{helperText}</p>
        )}
      </div>
    );
  };

  let rules = validate;
  if (
    validate &&
    validate.validate &&
    typeof validate.validate === "function"
  ) {
    rules = {
      ...validate,
      validate: (value) => validate.validate(value, getValues()),
    };
  }

  return (
    <Controller name={name} control={control} rules={rules} render={render} />
  );
};

export default FormInput;
