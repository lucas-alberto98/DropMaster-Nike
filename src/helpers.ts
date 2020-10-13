export const buildFormikFieldProps = (form: any, name: string): any => {
    const { handleChange, handleBlur, submitCount } = form;

    const errors: any = form.errors;
    const touched: any = form.touched;
    const values: any = form.values;

    const fieldTouched = touched[name];
    const error = errors[name];

    const getFormErrorMessage = (): string => {
        if ((fieldTouched || submitCount !== 0) && error) return error;
        return '';
    };

    return {
        onChange: handleChange,
        onBlur: handleBlur,
        value: values[name],
        error: getFormErrorMessage(),
    };
};

export const timeout = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
