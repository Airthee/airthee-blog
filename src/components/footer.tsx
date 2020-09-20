import footerStyles from './footer.module.scss'

export default function Footer () {
    const links = [
        { text: 'More about me', url: 'https://www.airthee.com' },
        { text: 'Contact', url: 'https://www.airthee.com/contact' },
        { text: 'My Github', url: 'https://github.com/airthee' },
    ]

    return (
        <footer className={footerStyles.footer}>
            {links.map((link, linkIndex) => (
                <span key={linkIndex} className={footerStyles.link}>
                    <a target="__blank" href={link.url}>
                        {link.text}
                    </a>
                </span>
            ))}
        </footer>
    )
}