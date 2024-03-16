import { MantineColorsTuple, createTheme } from "@mantine/core";

//TODO: Make these colors match the specification.
const color: MantineColorsTuple = [
    "#effee7",
    "#e0f8d4",
    "#c2efab",
    "#a2e67e",
    "#87de57",
    "#75d940",
    "#6bd731",
    "#59be23",
    "#4da91b",
    "#3d920c"
];

export const MANTINE_THEME = createTheme({
    colors: {
        blue: color //TODO: Find a less cursed way of doing this.
    }
});