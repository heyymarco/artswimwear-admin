import { SiteNavbar } from '@/components/SiteNavbar'



export const Header = () => {
    return (
        <header className='siteHeader'>
            {/* <Suspense fallback={
                <Container
                    className='siteNavbar lazy'
                    theme='primary'
                    mild={false}
                    gradient={true}
                />
            }>
                <SiteNavbarLazy />
            </Suspense> */}
            <SiteNavbar />
        </header>
    );
}
