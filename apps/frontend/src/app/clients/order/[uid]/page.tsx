import { getOrderById } from "@/actions/orders/getOrderById"
import styles from './page.module.css'
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { ITEM_MAPPER } from "@/app/constants"
import { es } from "date-fns/locale";
import { format } from "date-fns";
import AddRoundModal from "./components/AddRoundModal"
import MarkAsPaidButton from "./components/MarkAsPaidButton/MarkAsPaidButton"



export default async function OrderSpecificPage({
    params,
  }: {
    params: Promise<{ uid: string }>
  }) {
    const uid = (await params).uid
    const order = await getOrderById(uid)

    if(!order){
        return <div>No se encontro la orden</div>
    }

    return (
        <>
        <div className={styles.root}>
            <div className={styles.flexContainer}>
                <h1 className={styles.title}>Detalles de la orden</h1>
                {
                    order.paid === false &&
                    <MarkAsPaidButton orderId={uid} />
                }
            </div>
            <div className={styles.flexContainer}>
                <div>
                    <h6><strong className={styles.strong}>Order ID:</strong> {order.uid}</h6>
                    <h6>{format(new Date(order.created), "dd 'de' MMMM 'de' yyyy, HH:mm:ss", { locale: es })}</h6>
                </div>
                <Badge className={cn(styles.innerbadge, order.paid ? styles.success : styles.danger)}>{order.paid ? 'Paga' : 'Pendiente por pagar'}</Badge>
            </div>
            <div className={styles.flexContainer}>
                <div>

                    <h6><strong className={styles.strong}>Impuestos: </strong> ${order.taxes}</h6>
                    <h6><strong className={styles.strong}>Descuentos: </strong>${order.discounts}</h6>
                </div>
                <div>
                    <h6><strong className={styles.strong}>Total con deducciones: </strong>${order.subtotal + order.taxes - order.discounts}</h6>
                </div>
                
            </div>
            <h1 className={styles.subtitle}>Resumen de compra:</h1>
            <div>
                <div>
                    <p>Un resumen de todas tus rondas de cerveza</p>
                </div>
                <>
                                    <div className={styles.tableContainer} >
                                        <div className={styles.start}>

                                        </div>
                                    <div className={styles.start}>
                                        <p><strong>Cerveza</strong></p>
                                    </div>
                                    <div className={styles.start}>
                                        <p><strong>Cantidad</strong></p>
                                    </div>
                                    <div className={styles.start}>
                                        <p><strong>Precio unitario</strong></p>
                                    </div>
                                    <div className={styles.start}>
                                        <p><strong>Cerveza</strong></p>
                                    </div>
                                </div>
                                </>
                        {
                            order.items.map((item)=>(
          
                                <div className={styles.tableContainer} key={`${item.name}-${item.quantity}`}>
                                    <div className={styles.start}>
                                        <Image className={styles.image} src={ITEM_MAPPER[item.name as keyof typeof ITEM_MAPPER]} alt={item.name} width={100} height={100} />
                                    </div>
                                    <div className={styles.start}>
                                        <p> {item.name}</p>
                                    </div>
                                    <div className={styles.start}>
                                        <p>{item.quantity}</p>
                                    </div>
                                    <div className={styles.start}>
                                        <p>${item.pricePerUnit}</p>
                                    </div>
                                    <div className={styles.start}>
                                        <p>${item.total}</p>
                                    </div>
                                </div>
  
                            ))
                        }
            </div>
        </div>
        <div>
            <div className={styles.flexContainer}>
                <h1 className={styles.subtitle}>Rondas de cervezas:</h1>
                {
                    order.paid === false &&
                    <AddRoundModal orderId={uid} />
                }
            </div>
            {
                order.rounds.map((round)=>(
                    <div className={styles.roundRoot} key={round.created.toString()}>
                        <div className={styles.flexContainer}>
                            <div>
                            <h3 className={styles.strong}>Creada:</h3>
                            <h3 >{format(new Date(round.created), "dd 'de' MMMM 'de' yyyy, HH:mm:ss", { locale: es })}</h3>
                            </div>
                            <Badge className={cn(styles.innerbadge, round.promotions.length > 0 ? styles.success : styles.danger)}>{round.promotions.length > 0 ? `${round.promotions.length} promos  aplicadas`: 'No se aplicaron promociones'}</Badge>
                        </div>
                        <div>
                            <h3 className={styles.subtitle}>Pedido:</h3>
                            <div>
                                <div>
                                    {
                                        round.items.map((item)=>(
                                            <div className={styles.tableContainer} key={`${item.name}-${item.quantity}`}>
                                                <p><strong>Cerveza: </strong>{item.name}</p>
                                                <p><strong>Cantidad: </strong>{item.quantity}</p>
                                            </div>
                                        ))
                                    }
                            </div>
                            </div>
                        </div>
                        {
                            round.promotions.length > 0 &&
                            <div>
                            <h3 className={styles.subtitle}>Promociones aplicadas:</h3>
                            <div>
                                <div>
                                    {
                                        round.promotions.map((item)=>(
                                            <div key={item.name} className={styles.promoContainer}>
                                                <p><strong>Promo: </strong>{item.name}</p>
                                                <p><strong>En cerveza: </strong>{item.itemName}</p>
                                                <p><strong>Desde: </strong>{item.start.toLocaleString('es-ES',{day:'2-digit',month:'short', 'year':'numeric', hour:'numeric', minute:'numeric'})} <strong>a: </strong> {item.end.toLocaleString('es-ES',{day:'2-digit',month:'short', 'year':'numeric', hour:'numeric', minute:'numeric'})} </p>
                                                <Badge className={styles.badge}>Ahorra el {item.discountPercentage}%</Badge>
                                            </div>
                                        ))
                                    }
                            </div>
                            </div>
                        </div>
                        }

                    </div>
                ))
            }
        </div>
        </>
    )
}