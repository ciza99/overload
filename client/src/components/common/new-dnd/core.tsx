import { createContext, useContext } from "react";

const DndContext = createContext(undefined as never);
const useDndContext = () => useContext(DndContext);

export const DndProvider = () => {};
