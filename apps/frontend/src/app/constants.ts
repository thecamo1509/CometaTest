import { PromoContainerProps } from '@/components/PromoContainer/PromoContainer.types'
import type { MenuItem } from '@/components/TopBar/NavMenu/NavMenu.types'

export const DEFAULT_MENU_ITEMS: Array<MenuItem> = [
    {
        name: 'Manager',
        href: '/manager'
    },
    {
        name: 'Clientes',
        href: '/clients'
    },
]


export const DEFAULT_PROMOTION_CONTAINERS: Array<PromoContainerProps> = [
    {
        title: 'Se acabo el stock?',
        subtitle: 'No te preocupes puedes añadir nuevas unidades de tus cervezas favoritas.',
        imgSrc: 'https://png.pngtree.com/png-vector/20240528/ourmid/pngtree-beer-bottles-in-ice-bucket-png-image_12532121.png',
        imgAlt: 'Cervezas',
        btnText: 'Añadir cervezas',
        btnHref: '/manager',
        color: 'primary',
        contentPlacement: 'left'
    },
    {
        title: 'Eres un cliente?',
        subtitle: 'Puedes crear una orden de cervezas y pedir las rondas que quieras. Puedes pedirlas en cualquier momento.',
        imgSrc: 'https://licoresbrisasdejuanchito.com/wp-content/uploads/2021/04/C-47.png',
        imgAlt: 'Cometa Logo',
        btnText: 'Hacer un pedido',
        btnHref: '/clients',
        color: 'secondary',
        contentPlacement: 'right'
    },
    {
        title: 'Gestiona tus promociones!',
        subtitle: 'Como manager puedes crear promociones express para todos tus clientes',
        imgSrc: 'https://5471282.fs1.hubspotusercontent-na1.net/hubfs/5471282/logo-flash-promo@2x.png',
        imgAlt: 'Cometa Logo',
        btnText: 'Gestionar Promociones',
        btnHref: '/manager',
        color: 'accent',
        contentPlacement: 'left'
    },
    
]

export const ITEM_MAPPER ={
    "Corona": "https://api.lalicorera.com/storage/productos/licores/84256441-corona-extra-710ml.webp?t=1727655329000",
    "Quilmes": "https://www.totalwine.com/dynamic/x1000,6pk/media/sys_master/twmmedia/h00/h6b/13565733928990.png",
    "Club Colombia": "https://www.clubcolombia.com.co/sites/g/files/seuoyk481/files/styles/large/public/2022-08/_FOTOS-BOTELLAS-OKTOBERFEST8695%201%281%29_0.png?itok=8EWJVxnw"
}