import { Button } from "@mantine/core";
import React from "react";
import { PropsEditor } from "../pages/edit/[slug]/PropsEditor";
import { formatProps } from "@/app/utils/formatProps";
import { FooterMap } from "../../../components/ComponentMaps/FooterMap";

function FooterEditor({ footer, setEdit, save }) {
  const props = footer?.value?.props;

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
        compKey={footer?.value?.compKey}
      />
    </div>
  );
}

export default FooterEditor;
