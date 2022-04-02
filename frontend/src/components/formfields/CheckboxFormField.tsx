import { useFormikContext } from "formik";
import { Checkbox } from "src/components/Checkbox";
import { BaseFormField } from "src/components/formfields/BaseFormField";
import type { GenericFormFieldProps } from "src/components/formfields/BaseFormField";

interface CheckboxFormFieldProps extends GenericFormFieldProps {
  onChange?: () => void | undefined;
}

const CheckboxFormField = ({
  name,
  label,
  readonly,
  onChange,
  ...props
}: CheckboxFormFieldProps) => {
  const { values, setFieldValue } = useFormikContext() as {
    values: { [key: string]: any };
    setFieldValue: (name: string, value: any) => void;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(name, event.target.checked);
    onChange?.();
  };

  return (
    <BaseFormField name={name} readonly={readonly} {...props}>
      <label className="Checkbox--label">
        <Checkbox
          disabled={readonly}
          label={label}
          onChange={handleChange}
          checked={values[name]}
        />
      </label>
    </BaseFormField>
  );
};

export { CheckboxFormField };
