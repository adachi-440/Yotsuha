import { Navbar, Text } from "@nextui-org/react";


const NavbarMenu = () => {
    return(
        <Navbar variant={"sticky"} color="inherit">
            <Navbar.Brand>
                <Text b color="inherit" hideIn="xs">
                    Yotsuha
                </Text>
            </Navbar.Brand>
            <Navbar.Content hideIn="xs">
                <Navbar.Link href="#" isActive>Mint</Navbar.Link>
                <Navbar.Link href="#">Bridge</Navbar.Link>
                <Navbar.Link href="#">History</Navbar.Link>
            </Navbar.Content>
        </Navbar>
    )
}

export default NavbarMenu