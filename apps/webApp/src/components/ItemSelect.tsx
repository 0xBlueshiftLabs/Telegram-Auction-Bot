import React from "react";
import { Button } from "./Button";

interface ItemSelectProps {
  items: string[];
  selectedItem: string;
  setSelectedItem: (val: string) => void;
}

export function ItemSelect({
  items,
  selectedItem,
  setSelectedItem,
}: ItemSelectProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "5px",
        width: "100%",
      }}
    >
      {items.map((item) => (
        <Button
          key={item}
          onClickFn={() => setSelectedItem(item)}
          variant={item === selectedItem ? "primary" : "secondary"}
        >
          {item}
        </Button>
      ))}
    </div>
  );
}
