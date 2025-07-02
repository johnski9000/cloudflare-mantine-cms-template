import { Button } from "@mantine/core";
import React from "react";
import { NavigationMap } from "../../../components/ComponentMaps/NavigationMap";
import { PropsEditor } from "../pages/edit/[slug]/PropsEditor";
import { formatProps } from "@/app/utils/formatProps";

function NavigationEditor({ navigation, setEdit, save }) {
  const props = navigation?.value?.props;
  return (
    <div>
      <Button
        onClick={() => {
          setEdit(false);
        }}
        color="blue"
        variant="outline"
      >
        Go Back
      </Button>
      <PropsEditor
        props={props}
        onSave={save}
        navigationEditor={true}
        compKey={navigation?.value?.compKey}
      />
    </div>
  );
}

export default NavigationEditor;
