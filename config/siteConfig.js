const brandLogo = new URL('../assets/visora-brand-logo.png', import.meta.url).href;
const faviconAsset = new URL('../assets/site-favicon.png', import.meta.url).href;
const menuVerandaGlassRoom = new URL('../assets/menu-veranda-glass-room.webp', import.meta.url).href;
const menuRestorantOnuPergole = new URL('../assets/menu-restorant-onu-pergole.jpg', import.meta.url).href;
const menuCarport = new URL('../assets/menu-carport.jpg', import.meta.url).href;
const menuContainer = new URL('../assets/menu-container.webp', import.meta.url).href;
const menuGardenRoom = new URL('../assets/menu-garden-room.webp', import.meta.url).href;
const menuAwening = new URL('../assets/menu-awening.jpg', import.meta.url).href;
export const siteConfig = {
    branding: {
        siteTitle: 'Visora Veranda Tasarım Aracı',
        logo: brandLogo,
        favicon: faviconAsset,
        homepageUrl: 'https://visora.uk',
        whatsappNumber: '447453974426',
        whatsappBrandName: 'Visora',
        socialLinks: {
            instagram: 'https://instagram.com',
            facebook: 'https://facebook.com',
            tiktok: 'https://tiktok.com',
        },
    },
    menu: {
        badge: 'Visora Demo Merkezi',
        heading: 'Denemek istediğiniz projeyi seçin',
        theme: {
            primary: '#003934',
            // İsterseniz bunu tek renk kodu olarak bırakabilirsiniz.
            // Tam palet vermek isterseniz `palette` alanını şöyle ekleyebilirsiniz:
            // palette: {
            //   backgroundStart: '#f4f8f7',
            //   backgroundMid: '#e2efec',
            //   backgroundEnd: '#f7fbfa',
            //   panelBackground: 'rgba(255,255,255,0.72)',
            //   panelBorder: 'rgba(255,255,255,0.70)',
            //   cardBackground: 'rgba(255,255,255,0.70)',
            //   cardBorder: 'rgba(255,255,255,0.70)',
            //   accent: '#0a5b53',
            //   text: '#003934',
            // },
        },
        projectCards: [
            { key: 'veranda-glass-room', title: 'Veranda / Cam Oda', image: menuVerandaGlassRoom, status: 'live', opensConfigurator: true },
            { key: 'restorant-onu-pergole', title: 'Restoran Önü Pergola', image: menuRestorantOnuPergole, status: 'comingSoon' },
            { key: 'carport', title: 'Araç Sundurması', image: menuCarport, status: 'comingSoon' },
            { key: 'container', title: 'Konteyner', image: menuContainer, status: 'comingSoon' },
            { key: 'garden-room', title: 'Bahçe Odası', image: menuGardenRoom, status: 'comingSoon' },
            { key: 'awening', title: 'Tente', image: menuAwening, status: 'comingSoon' },
        ],
    },
    configurator: {
        roofOptions: [
            { key: 'glass', label: 'Cam', enabled: true },
            { key: 'polycarbonate', label: 'Polikarbon', enabled: true },
            { key: 'aluminium', label: 'Alüminyum Panel', enabled: true },
            { key: 'fabric', label: 'Kumaş Pergola', enabled: true },
            { key: 'bioclimatic', label: 'Biyoklimatik Pergola', enabled: true },
            { key: 'lux-bioclimatic', label: 'Lüks Biyoklimatik Pergola', enabled: true },
        ],
        sideOptions: [
            { key: 'sliding', title: 'Sürgülü cam kapı', subtitle: '8 mm kalınlık', enabled: true },
            { key: 'bifold', title: 'Katlanır kapı', subtitle: '3 panelli katlanir sistem', enabled: true },
            { key: 'guillotine', title: 'Giyotin cam', subtitle: 'Dikey motorlu cam', enabled: true },
            { key: 'fixed', title: 'Sabit cam', subtitle: 'Sabit çerçeveli cam', enabled: true },
            { key: 'aluminium', title: 'Alüminyum Panel', enabled: true },
            { key: 'none', title: 'Açık cephe', subtitle: 'Kapatma yok', enabled: true },
        ],
        addons: {
            lights: true,
            roofAwning: true,
            sideAwnings: true,
        },
    },
};
