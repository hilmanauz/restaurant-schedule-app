import { Menu as MantineMenu } from "@mantine/core";
import { MenuProps } from "./menu.types";

const MenuComp = ({ shadow, ...props }: MenuProps): JSX.Element => {
    return <MantineMenu {...props} />;
};

MenuComp.Target = MantineMenu.Target;
MenuComp.Dropdown = MantineMenu.Dropdown;
MenuComp.Divider = MantineMenu.Divider;
MenuComp.Label = MantineMenu.Label;
MenuComp.Item = MantineMenu.Item;

export const Menu = MenuComp;
