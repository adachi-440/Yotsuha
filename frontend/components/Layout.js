import NavbarMenu from "./NavbarMenu"

const Layout = ({children}) => {
    return (
        <>
        <header>
            <NavbarMenu/>
        </header>
        <main>
            {children}
        </main>
        </>
    )
}

export default Layout