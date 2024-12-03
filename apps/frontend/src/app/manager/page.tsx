import { getStock } from '@/actions/inventory/getStock'
import styles from './page.module.css'
import { ITEM_MAPPER } from '../constants'
import Image from 'next/image'
import { getActivePromotions } from '@/actions/promotions/getActivePromotions'
import { AddPromotionModal } from './components/AddPromotionModal/AddPromotionModal'
import { AddStockModal } from './components/AddStockModal/AddStockModal'
import { Badge } from '@/components/ui/badge'
import { getOrders } from '@/actions/orders/getOrders'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default async function ManagerPage() {
    const stock = await getStock()
    const promotions = await getActivePromotions()
    const orders = await getOrders()
    return (
        <>
        <div className={styles.root}>
            <div className={styles.flexContainer}>
                <div>
                    <h1 className={styles.title}>Este es tu inventario actual </h1>
                    <h3>Ultima actualizacion: {stock.lastUpdated.toLocaleString()}</h3>
                </div>
                <AddStockModal />
            </div>
            <div className={cn(styles.flexContainer,styles.summaryContainer)}>
                {
                    stock.beers.map((beer) => (
                        <div key={beer.name} className={styles.infoContainer}>
                            <Image className={styles.image} src={ITEM_MAPPER[beer.name as keyof typeof ITEM_MAPPER]} alt={beer.name} width={100} height={100} />
                            <p><strong>Item: </strong>{beer.name}</p>
                            <p><strong>Existencias: </strong>{beer.quantity}</p>
                            <p><strong>Precio c/u: </strong>${beer.price.toLocaleString()}</p>
                        </div>
                    ))
                }
            </div>
        </div>
        <div className={styles.root}>
            <div className={styles.flexContainer}>
                <div>
                    <h1 className={styles.title}>Promociones Activas</h1>
                </div>
                <AddPromotionModal />
            </div>
            <div className={cn(styles.flexContainer,styles.summaryContainer)}> 
                {
                    promotions.length === 0 ? <p>No hay promociones activas</p> :
                    promotions.map((promotion) => (
                        <div key={promotion.name} className={styles.promoContainer}>
                            <p><strong>Promo: </strong>{promotion.name}</p>
                            <p><strong>En cerveza: </strong>{promotion.itemName}</p>
                            <p><strong>Desde: </strong>{promotion.start.toLocaleString('es-ES',{day:'2-digit',month:'short', 'year':'numeric', hour:'numeric', minute:'numeric'})} <strong>a: </strong> {promotion.end.toLocaleString('es-ES',{day:'2-digit',month:'short', 'year':'numeric', hour:'numeric', minute:'numeric'})} </p>
                            <Badge className={styles.badge}>Ahorra el {promotion.discountPercentage}%</Badge>
                        </div>
                    ))
                }
                
            </div>
        </div>
        <div className={styles.root}>
            <div className={styles.flexContainer}>
                <div>
                    <h1 className={styles.title}>Ordenes Abiertas</h1>
                </div>
            </div>
            <div className={cn(styles.flexContainer,styles.summaryContainer)}> 
                {
                    orders.length === 0 ? <p>No hay ordenes abiertas</p> :
                    orders.map((order) => (
                        <div key={order.uid} className={styles.promoContainer}>
                            <p><strong>Orden: </strong><Link className={styles.link} href={`/clients/order/${order.uid}`}>{order.uid}</Link></p>
                            <p><strong>Fecha de creacion: </strong>{order.created.toLocaleString('es-ES',{day:'2-digit',month:'short', 'year':'numeric', hour:'numeric', minute:'numeric'})} </p>
                            <p><strong>Total: </strong>${order.subtotal + order.taxes - order.discounts}</p>
                        </div>
                    ))
                }
            </div>
        </div>
        </>
    )
}