import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Button } from "@nextui-org/react";


interface Props {
    result: number;
    result2:number;
    function: () => void
  }

const MintButton: NextPage<Props> = (props) => {
  //ここに関数を書く
  
  const hogehoge = async () => {

    
  
  }


  return (
    <div className={styles.container}>
      <button onClick={hogehoge}>Mint test NFT</button>
      <Button onClick={hogehoge}>Default</Button>


    </div>
  )
}
export default MintButton