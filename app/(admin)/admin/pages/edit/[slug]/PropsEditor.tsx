"use client";

import { useState, memo } from "react";
import {
  TextInput,
  Checkbox,
  Button,
  FileInput,
  Image,
  NumberInput,
  Group,
  Paper,
  Stack,
  Title,
  ActionIcon,
  Loader,
  Alert,
  Divider,
  Box,
  Accordion,
} from "@mantine/core";
import { MdClose, MdAdd, MdWarning } from "react-icons/md";
import MediaModal from "./ChooseMedia";
import { TiTrash } from "react-icons/ti";

// Define PropItem interface with specific types
interface PropItem {
  key?: string;
  type: "string" | "number" | "boolean" | "image" | "array";
  format?: string | null;
  value: any;
  active?: boolean;
}

// Define props interface with unified onSave signature
interface PropsEditorProps {
  props: any;
  initialValues?: Record<string, any>;
  onSave: any;
  navigationEditor?: boolean;
  compKey?: string;
}

// Forward declare ArrayField for use in Field
const ArrayField: React.FC<{
  fieldDef: PropItem;
  value: Record<string, any>[];
  onChange: (index: number, subKey: string, newValue: any, file?: File) => void;
  onRemoveItem: (index: number) => void;
  isNested?: boolean;
}> = ({ fieldDef, value, onChange, onRemoveItem, isNested = false }) => {
  // Ensure we have a valid template structure
  if (
    !fieldDef.value ||
    !Array.isArray(fieldDef.value) ||
    fieldDef.value.length === 0
  ) {
    console.warn("Array field missing template structure", fieldDef);
    return (
      <Paper
        p="md"
        className="text-center text-gray-500 border-2 border-dashed border-gray-200"
      >
        <div className="text-sm">Array configuration error</div>
      </Paper>
    );
  }

  const template = fieldDef.value[0];

  // Check if template has type definitions or is raw data
  const hasTypeDefinitions = Object.values(template).some(
    (val: any) => typeof val === "object" && val !== null && "type" in val
  );

  // If raw data, create type definitions from the template
  const subFieldDefs = hasTypeDefinitions
    ? (template as Record<string, PropItem>)
    : Object.fromEntries(
        Object.entries(template).map(([key, val]) => [
          key,
          {
            key,
            type:
              typeof val === "string"
                ? "string"
                : typeof val === "number"
                ? "number"
                : typeof val === "boolean"
                ? "boolean"
                : "string",
            value: val,
          } as PropItem,
        ])
      );

  return (
    <Stack spacing={isNested ? "sm" : "md"}>
      {value && value.length > 0 ? (
        value.map((item, index) => (
          <Item
            key={index}
            item={item}
            subFieldDefs={subFieldDefs}
            index={index}
            onChange={(subKey, newValue, file) =>
              onChange(index, subKey, newValue, file)
            }
            onRemove={() => onRemoveItem(index)}
            isNested={isNested}
          />
        ))
      ) : (
        <Paper
          p={isNested ? "md" : "xl"}
          className="text-center text-gray-500 border-2 border-dashed border-gray-200"
        >
          <div className="text-sm">No items added yet</div>
          <div className="text-xs mt-1">
            Click the button below to add your first item
          </div>
        </Paper>
      )}
    </Stack>
  );
};

// Memoized Field Component
const Field = memo(
  ({
    fieldDef,
    value,
    onChange,
    error,
    isNested = false,
  }: {
    fieldDef: PropItem;
    value: any;
    onChange: (newValue: any, file?: File) => void;
    error?: string;
    isNested?: boolean;
  }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = async (file: File) => {
      setIsLoading(true);
      try {
        const fileUrl = URL.createObjectURL(file);
        onChange(fileUrl, file);
      } catch (err) {
        console.error("Error processing file:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const handleArrayChange = (
      index: number,
      subKey: string,
      newValue: any,
      file?: File
    ) => {
      const currentArray = Array.isArray(value) ? value : [];
      const updatedArray = [...currentArray];
      updatedArray[index] = { ...updatedArray[index], [subKey]: newValue };
      onChange(updatedArray);

      // Handle file separately if needed
      if (file && fieldDef.key) {
        // This is for tracking files at the parent level
        // The parent handler should manage this
      }
    };

    const handleArrayItemRemove = (index: number) => {
      const updatedArray = (value as any[]).filter((_, i) => i !== index);
      onChange(updatedArray);
    };

    const handleArrayItemAdd = () => {
      // Check if fieldDef.value exists and has a structure
      if (
        !fieldDef.value ||
        !Array.isArray(fieldDef.value) ||
        fieldDef.value.length === 0
      ) {
        console.error("Array field definition is missing or invalid", fieldDef);
        return;
      }

      const template = fieldDef.value[0];
      if (!template || typeof template !== "object") {
        console.error("Array template is invalid", template);
        return;
      }

      const processTemplate = (template: any): any => {
        if (!template || typeof template !== "object") {
          return template;
        }

        const result: Record<string, any> = {};

        // Check if this is a typed template or raw data
        const hasTypeDefinitions = Object.values(template).some(
          (val: any) => typeof val === "object" && val !== null && "type" in val
        );

        if (hasTypeDefinitions) {
          // Process typed template
          Object.entries(template).forEach(
            ([subKey, subProp]: [string, any]) => {
              if (subProp.type === "array" && Array.isArray(subProp.value)) {
                result[subKey] = [];
              } else {
                result[subKey] = subProp.value;
              }
            }
          );
        } else {
          // It's raw data, copy as is
          return { ...template };
        }

        return result;
      };

      const newItem = processTemplate(template);
      const currentArray = Array.isArray(value) ? value : [];
      onChange([...currentArray, newItem]);
    };

    switch (fieldDef.type) {
      case "string":
        return (
          <TextInput
            label={fieldDef.key}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            error={error}
            className="w-full"
            size={isNested ? "sm" : "md"}
          />
        );
      case "number":
        return (
          <NumberInput
            label={fieldDef.key}
            value={value as number | undefined}
            onChange={(val) => onChange(val)}
            error={error}
            className="w-full"
            size={isNested ? "sm" : "md"}
          />
        );
      case "boolean":
        return (
          <Checkbox
            label={fieldDef.key}
            checked={value as boolean}
            onChange={(e) => onChange(e.target.checked)}
            error={error}
            className="mt-2"
            size={isNested ? "sm" : "md"}
          />
        );
      case "image":
        return (
          <Box className="w-full">
            <div
              className={`font-medium mb-2 text-gray-700 ${
                isNested ? "text-xs" : "text-sm"
              }`}
            >
              {fieldDef.key}
            </div>
            <Stack spacing={isNested ? "sm" : "md"} align="center">
              {value && (
                <div className="relative">
                  <Image
                    src={value as string}
                    width={isNested ? 80 : 120}
                    height={isNested ? 80 : 120}
                    radius="md"
                    className="border border-gray-200"
                    alt="Preview"
                  />
                  {isLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                      <Loader size="sm" color="white" />
                    </div>
                  )}
                </div>
              )}
              <Group spacing="sm" className="w-full !flex !flex-col">
                <FileInput
                  onChange={(file) => file && handleFileChange(file)}
                  className="flex-1 !w-full"
                  accept="image/*"
                  placeholder="Upload image"
                  disabled={isLoading}
                  variant="filled"
                  size={isNested ? "sm" : "md"}
                />
                <MediaModal
                  onChange={(fileUrl) => onChange(fileUrl)}
                  disabled={isLoading}
                />
              </Group>
            </Stack>
            {error && (
              <Alert
                icon={<MdWarning size="1rem" />}
                color="red"
                size="sm"
                className="mt-2"
              >
                {error}
              </Alert>
            )}
          </Box>
        );
      case "array":
        // Ensure value is an array, initialize if needed
        const arrayValue = Array.isArray(value) ? value : [];

        return (
          <Box className="w-full">
            <div
              className={`font-medium mb-2 text-gray-700 ${
                isNested ? "text-xs" : "text-sm"
              }`}
            >
              {fieldDef.key}
            </div>
            <ArrayField
              fieldDef={fieldDef}
              value={arrayValue}
              onChange={handleArrayChange}
              onRemoveItem={handleArrayItemRemove}
              isNested={true}
            />
            <Button
              variant="light"
              leftSection={<MdAdd size="1rem" />}
              onClick={handleArrayItemAdd}
              className="mt-2"
              size="xs"
              disabled={
                !fieldDef.value ||
                !Array.isArray(fieldDef.value) ||
                fieldDef.value.length === 0
              }
            >
              Add {fieldDef.key?.slice(0, -1) || "item"}
            </Button>
          </Box>
        );
      default:
        return null;
    }
  },
  (prevProps, nextProps) =>
    prevProps.value === nextProps.value &&
    prevProps.fieldDef === nextProps.fieldDef &&
    prevProps.onChange === nextProps.onChange &&
    prevProps.error === nextProps.error &&
    prevProps.isNested === nextProps.isNested
);

Field.displayName = "Field";

// Memoized Item Component
const Item = memo(
  ({
    item,
    subFieldDefs,
    onChange,
    onRemove,
    index,
    isNested = false,
  }: {
    item: Record<string, any>;
    subFieldDefs: Record<string, PropItem>;
    onChange: (subKey: string, newValue: any, file?: File) => void;
    onRemove: () => void;
    index: number;
    isNested?: boolean;
  }) => {
    const [open, setOpen] = useState(false);

    return (
      <div
        className={`!relative border border-gray-200 rounded-lg ${
          isNested ? "bg-gray-50" : ""
        }`}
      >
        <ActionIcon
          onClick={onRemove}
          className="!absolute top-[-10px] right-[-5px] hover:bg-red-50 z-10"
          color="red"
          variant="subtle"
          size={isNested ? "xs" : "sm"}
          aria-label={`Remove item ${index + 1}`}
        >
          <TiTrash size={isNested ? "1.5rem" : "2rem"} />
        </ActionIcon>

        <Accordion
          value={open ? `item-${index}` : undefined}
          onChange={(value) => setOpen(!!value)}
        >
          <Accordion.Item value={`item-${index}`}>
            <Accordion.Control>
              <div
                className={`font-medium pr-8 ${
                  isNested ? "text-xs" : "text-sm"
                }`}
              >
                Item {index + 1}
              </div>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="pr-8">
                <Stack spacing={isNested ? "sm" : "md"}>
                  {Object.entries(subFieldDefs).map(([subKey, subFieldDef]) => (
                    <Field
                      key={subKey}
                      fieldDef={{ ...subFieldDef, key: subKey }}
                      value={item[subKey]}
                      onChange={(newValue, file) =>
                        onChange(subKey, newValue, file)
                      }
                      isNested={isNested}
                    />
                  ))}
                </Stack>
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.item === nextProps.item &&
    prevProps.subFieldDefs === nextProps.subFieldDefs &&
    prevProps.onChange === nextProps.onChange &&
    prevProps.index === nextProps.index &&
    prevProps.isNested === nextProps.isNested
);

Item.displayName = "Item";

export function PropsEditor({
  props,
  initialValues = {},
  onSave,
  navigationEditor = false,
  compKey,
}: PropsEditorProps) {
  console.log("PropsEditor rendered with props:", props);

  const [formValues, setFormValues] = useState<Record<string, any>>(() => {
    const processValue = (prop: any, initialValue?: any): any => {
      if (prop.type === "array") {
        // If we have an initial value, use it
        if (initialValue !== undefined) {
          return initialValue;
        }

        // Otherwise, create array from template
        if (Array.isArray(prop.value) && prop.value.length > 0) {
          const template = prop.value[0];

          // Check if template has type definitions
          const hasTypeDefinitions = Object.values(template).some(
            (val: any) =>
              typeof val === "object" && val !== null && "type" in val
          );

          if (hasTypeDefinitions) {
            // Process as typed fields
            return prop.value.map((item: any) => {
              const processedItem: Record<string, any> = {};
              Object.entries(item).forEach(
                ([subKey, subProp]: [string, any]) => {
                  processedItem[subKey] = processValue(subProp, undefined);
                }
              );
              return processedItem;
            });
          } else {
            // It's raw data, return as is
            return prop.value;
          }
        }
        return [];
      }

      // For non-array types, use initial value or default
      return initialValue !== undefined ? initialValue : prop.value;
    };

    return Object.fromEntries(
      Object.entries(props).map(([key, prop]) => [
        key,
        processValue(prop, initialValues[key]),
      ])
    );
  });

  const [files, setFiles] = useState<Record<string, File>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>(
    () =>
      Object.entries(props).reduce((acc, [key, value]) => {
        if (value.type === "array") {
          value.value.forEach((item: any, index: number) => {
            if (item.image?.type === "image") {
              acc[`${key}[${index}].image`] = item.image.value;
            }
          });
        } else if (value.format === "image") {
          acc[key] = initialValues[key] ?? value.value;
        }
        return acc;
      }, {} as Record<string, string>)
  );

  const validateField = (
    key: string,
    value: any,
    fieldDef: PropItem
  ): string | null => {
    if (fieldDef.type === "string" && typeof value !== "string") {
      return "This field must be a string";
    }
    if (
      fieldDef.type === "number" &&
      value !== undefined &&
      typeof value !== "number"
    ) {
      return "This field must be a number";
    }
    return null;
  };

  const handleChange = (key: string, newValue: any, file?: File) => {
    setFormValues((prev) => ({ ...prev, [key]: newValue }));

    // Clear field error when user starts typing
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }

    // Validate field
    const fieldDef = props[key];
    const error = validateField(key, newValue, fieldDef);
    if (error) {
      setFieldErrors((prev) => ({ ...prev, [key]: error }));
    }

    if (file) {
      setFiles((prev) => ({ ...prev, [key]: file }));
      setImagePreviews((prev) => ({ ...prev, [key]: newValue }));
    }
  };

  const handleArrayChange = (
    arrayKey: string,
    index: number,
    subKey: string,
    newValue: any,
    file?: File
  ) => {
    setFormValues((prev) => {
      const currentArray = Array.isArray(prev[arrayKey]) ? prev[arrayKey] : [];
      const updatedArray = [...currentArray];

      // Ensure the item at index exists
      if (!updatedArray[index]) {
        updatedArray[index] = {};
      }

      // Update the specific field
      updatedArray[index] = {
        ...updatedArray[index],
        [subKey]: newValue,
      };

      return {
        ...prev,
        [arrayKey]: updatedArray,
      };
    });

    if (file) {
      const fileKey = `${arrayKey}[${index}].${subKey}`;
      setFiles((prev) => ({ ...prev, [fileKey]: file }));
      setImagePreviews((prev) => ({ ...prev, [fileKey]: newValue }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      // Validate all fields
      const errors: Record<string, string> = {};
      Object.entries(props).forEach(([key, fieldDef]) => {
        const error = validateField(key, formValues[key], fieldDef);
        if (error) {
          errors[key] = error;
        }
      });

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        throw new Error("Please fix the validation errors");
      }

      if (navigationEditor && compKey) {
        const file = files["logo"];
        console.log("compKey", compKey);
        await onSave(compKey, formValues, { logo: file });
      } else {
        await onSave(formValues, files);
      }
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Failed to save changes"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const addValue = (formValues: Record<string, any>, key: string) => {
    const processTemplate = (template: any): any => {
      if (!template || typeof template !== "object") {
        return template;
      }

      const result: Record<string, any> = {};
      Object.entries(template).forEach(([subKey, subProp]: [string, any]) => {
        if (
          typeof subProp === "object" &&
          subProp !== null &&
          "type" in subProp
        ) {
          // This is a properly formatted field definition
          if (subProp.type === "array" && Array.isArray(subProp.value)) {
            // For nested arrays, initialize as empty array
            result[subKey] = [];
          } else {
            result[subKey] = subProp.value;
          }
        } else {
          // This is a raw value (like in dropdownItems)
          result[subKey] = subProp;
        }
      });
      return result;
    };

    const newItem = processTemplate(props[key].value[0]);

    const updatedValues = {
      ...formValues,
      [key]: [...formValues[key], newItem],
    };
    setFormValues(updatedValues);
  };

  const removeValue = (formValues: Record<string, any>, key: string) => {
    const updatedValues = {
      ...formValues,
      [key]: formValues[key].slice(0, -1),
    };
    setFormValues(updatedValues);
  };

  const removeItem = (arrayKey: string, index: number) => {
    setFormValues((prev) => ({
      ...prev,
      [arrayKey]: prev[arrayKey].filter((_: any, i: number) => i !== index),
    }));
    const fileKeyPrefix = `${arrayKey}[${index}]`;
    setFiles((prev) => {
      const updatedFiles = { ...prev };
      Object.keys(updatedFiles).forEach((key) => {
        if (key.startsWith(fileKeyPrefix)) {
          delete updatedFiles[key];
        }
      });
      return updatedFiles;
    });
    setImagePreviews((prev) => {
      const updatedPreviews = { ...prev };
      Object.keys(updatedPreviews).forEach((key) => {
        if (key.startsWith(fileKeyPrefix)) {
          delete updatedPreviews[key];
        }
      });
      return updatedPreviews;
    });
  };

  return (
    <div className=" w-full max-w-2xl mx-auto ">
      <Stack spacing="xl">
        <Stack spacing="xl">
          {Object.entries(props).map(([key, fieldDef], index) => (
            <div key={key}>
              {fieldDef.type === "array" ? (
                <Stack spacing="md">
                  <div>
                    <Title order={4} className="text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </Title>
                    <div className="text-sm text-gray-500 mt-1">
                      Manage your {key.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                  </div>

                  <ArrayField
                    fieldDef={fieldDef}
                    value={formValues[key] as Record<string, any>[]}
                    onChange={(index, subKey, newValue, file) =>
                      handleArrayChange(key, index, subKey, newValue, file)
                    }
                    onRemoveItem={(index) => removeItem(key, index)}
                  />

                  <Button
                    variant="light"
                    leftSection={<MdAdd size="1rem" />}
                    onClick={() => addValue(formValues, key)}
                    className="self-start"
                    size="sm"
                  >
                    Add {key.slice(0, -1)}
                  </Button>
                </Stack>
              ) : (
                <Stack spacing="sm">
                  <Title order={4} className="text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </Title>
                  <Field
                    fieldDef={fieldDef}
                    value={formValues[key]}
                    onChange={(newValue, file) =>
                      handleChange(key, newValue, file)
                    }
                    error={fieldErrors[key]}
                  />
                </Stack>
              )}

              {index < Object.keys(props).length - 1 && <Divider />}
            </div>
          ))}
        </Stack>

        <div className="pt-4 sticky bottom-0 left-0 right-0">
          <Button
            onClick={handleSave}
            fullWidth
            size="md"
            loading={isSaving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? "Saving Changes..." : "Save Changes"}
          </Button>
        </div>
      </Stack>
    </div>
  );
}
