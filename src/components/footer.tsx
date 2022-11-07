import footerStyles from './footer.module.scss';

export default function Footer() {
  const links = [
    { text: 'More about me', url: 'https://www.airthee.com' },
    { text: 'Contact', url: 'https://www.airthee.com/contact' },
    { text: 'My Github', url: 'https://github.com/airthee' },
  ];

  const cryptoAccounts = [
    { label: 'BTC', address: 'bc1qj52hfzplxree78q42l0u70jv9pqgc5n23l5xtt' },
    { label: 'ETH', address: '0xB7E23f028538F740b364aaa0524ea75f25107b57' },
  ];

  return (
    <footer className={footerStyles.footer}>
      <div>
        {links.map((link, linkIndex) => (
          <span key={linkIndex} className={footerStyles.link}>
            <a target="__blank" href={link.url}>
              {link.text}
            </a>
          </span>
        ))}
      </div>
      <div>
        {cryptoAccounts.map(({ label, address }) => (
          <span>
            {label}: <span className={footerStyles.cryptoAddress}>{address}</span>
          </span>
        ))}
      </div>
      <div>Copyright © 2022 Raphaël TISON. Tous droits réservés.</div>
    </footer>
  );
}
