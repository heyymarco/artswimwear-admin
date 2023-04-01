import { Container } from '@/components/Container'



export const Footer = () => {
    return (
        <Container tag='footer' className='siteFooter' theme='primary' mild={false} gradient={true}>
            <p>
                Copyright 2023 © Rossalia
            </p>
        </Container>
    );
}
