import { CometaLogo } from '../CometaLogo/CometaLogo';
import { NavMenu } from './NavMenu/NavMenu';
import { DEFAULT_MENU_ITEMS } from '@/app/constants';
import styles from './TopBar.module.css'
import Link from 'next/link';


export const TopBar = () => {
  return (
    <div className={styles.root}>
        <Link href='/'>
         <CometaLogo width={150} height={100} alt="Cometa Logo" />
        </Link>
        <Link href='/'>
          <h1 className={styles.title}>CometaBeer</h1>
        </Link>
        <NavMenu MenuItems={DEFAULT_MENU_ITEMS} />
    </div>
  );
};