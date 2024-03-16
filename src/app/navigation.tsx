import { AppShell, Burger, Group, UnstyledButton, Image, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";

function NavButton(props: {
    children: any,
    destination: string
}) {
    return <Link href={props.destination} style={{ textDecoration: 'none', color: 'inherit' }}>
        <UnstyledButton style={{
            display: 'block',
            padding: '20px'
        }}>
            {props.children}
        </UnstyledButton>
    </Link>;
}

export function ContentLayout(props: { children: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: !opened, mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Group>
                        <Burger opened={opened} onClick={toggle} size="sm" />
                        <Image src="/logos/black.png" w={30} />
                        <Text>Turbo Scout</Text>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar py="md" px={4}>
                <NavButton destination='/'>Home</NavButton>
                <NavButton destination='/pit'>Pit Scouting</NavButton>
                <NavButton destination='/match'>Match Scouting</NavButton>
                <NavButton destination='/error'>Data Download</NavButton>
            </AppShell.Navbar>

            <AppShell.Main>
                {props.children}
            </AppShell.Main>
        </AppShell>
    );
}