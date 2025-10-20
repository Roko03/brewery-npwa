import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

const Form = ({
  onSubmit: onSubmitProp,
  children,
  mode = "all",
  context,
  criteriaMode,
  defaultValues,
  reValidateMode,
  resolver,
  shouldFocusError,
  shouldUnregister,
  stopPropagation = false,
  resetDefaultValues = false,
  ...props
}) => {
  const methods = useForm({
    mode,
    context,
    criteriaMode,
    defaultValues,
    reValidateMode,
    resolver,
    shouldUnregister,
    shouldFocusError,
  });

  useEffect(() => {
    if (resetDefaultValues) {
      methods.reset(defaultValues);
    }
  }, [resetDefaultValues, methods, defaultValues]);

  const onSubmit = (values) => onSubmitProp(values, methods);

  const handleSubmit = (event) => {
    if (stopPropagation) {
      event.stopPropagation();
    }
    methods.handleSubmit(onSubmit)(event);
  };

  return (
    <FormProvider {...methods}>
      <form {...props} onSubmit={handleSubmit}>
        {typeof children === "function" ? children(methods) : children}
      </form>
    </FormProvider>
  );
};

export default Form;
