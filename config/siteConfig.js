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
        siteTitle: 'Visora Veranda Design Tool',
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
        badge: 'Visora Demo Center',
        heading: 'Choose the project you would like to try',
        theme: {
            primary: '#003934',
            // You can keep this as a single color code if you want.
            // If you want to provide a full palette, you can add `palette` like this:
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
            { key: 'veranda-glass-room', title: 'Veranda / Glass Room', image: menuVerandaGlassRoom, status: 'live', opensConfigurator: true },
            { key: 'restorant-onu-pergole', title: 'Restaurant Front Pergola', image: menuRestorantOnuPergole, status: 'comingSoon' },
            { key: 'carport', title: 'Carport', image: menuCarport, status: 'comingSoon' },
            { key: 'container', title: 'Container', image: menuContainer, status: 'comingSoon' },
            { key: 'garden-room', title: 'Garden Room', image: menuGardenRoom, status: 'comingSoon' },
            { key: 'awening', title: 'Awening', image: menuAwening, status: 'comingSoon' },
        ],
    },
    configurator: {
        roofOptions: [
            { key: 'glass', label: 'Glass', enabled: true },
            { key: 'polycarbonate', label: 'Polycarbonate', enabled: true },
            { key: 'aluminium', label: 'Aluminium Panel', enabled: true },
            { key: 'fabric', label: 'Fabric Pergola', enabled: true },
            { key: 'bioclimatic', label: 'Bioclimatic Pergola', enabled: true },
            { key: 'lux-bioclimatic', label: 'Luxury Bioclimatic Pergola', enabled: true },
        ],
        sideOptions: [
            { key: 'sliding', title: 'Sliding glass door', subtitle: '8 mm thickness', enabled: true },
            { key: 'bifold', title: 'Bifold door', subtitle: '3-panel folding system', enabled: true },
            { key: 'guillotine', title: 'Guillotine glass', subtitle: 'Vertical motorized glass', enabled: true },
            { key: 'fixed', title: 'Fixed glass', subtitle: 'Fixed framed glass', enabled: true },
            { key: 'aluminium', title: 'Aluminium Panel', enabled: true },
            { key: 'none', title: 'Open side', subtitle: 'No enclosure', enabled: true },
        ],
        addons: {
            lights: true,
            roofAwning: true,
            sideAwnings: true,
        },
    },
};
