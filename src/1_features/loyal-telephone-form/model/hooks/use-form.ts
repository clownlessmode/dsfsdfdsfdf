import {
  schema,
  FormValues,
  defaultValues,
} from "@features/loyal-telephone-form/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as useHookForm } from "react-hook-form";

export const useForm = () => {
  const form = useHookForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
    mode: "all",
  });

  return form;
};
