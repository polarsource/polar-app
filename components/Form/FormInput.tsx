import { TextInput, TextInputProps } from "react-native";
import {
  Control,
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";

export type FormInputProps<T extends FieldValues> = TextInputProps & {
  control: Control<T>;
  name: UseControllerProps<T>["name"];
  defaultValue?: UseControllerProps<T>["defaultValue"];
};

export const FormInput = <T extends FieldValues>({
  control,
  name,
  defaultValue,
  ...props
}: FormInputProps<T>) => {
  const { field } = useController({ control, name, defaultValue });

  return (
    <TextInput value={field.value} onChangeText={field.onChange} {...props} />
  );
};
